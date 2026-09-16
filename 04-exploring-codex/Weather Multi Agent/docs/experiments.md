# Experiments

This log records small experiments that compare Codex's agent-oriented workflow with an n8n-style workflow. Each experiment is kept deliberately narrow so its architectural lesson is clear.

## Experiment A — on-demand weather delegation

**Purpose.** Verify that a Codex supervisor can delegate a weather lookup only when needed, then retain responsibility for the wardrobe-aware recommendation.

**Setup.** Invoke the clothing-recommendation skill with a request such as: "What should I wear in Berlin tomorrow?" The supervisor reads wardrobe.md, delegates the location and time period to a weather subagent, and uses its concise assessment to select listed items.

**Expected behavior.** The delegate uses a weather tool and returns conditions plus clothing implications. The supervisor does not pass the wardrobe to the delegate, chooses only available clothes, and produces the single user-facing recommendation.

**Actual observations/results.** Indeed, the subagent is called and uses web search to obtain weather data. Additionally, it suggests general clothing implications and returns both to the supervisor. Based thereon the supervisor searches the wardrobe and produces a concise output to the user. The result is correct and complete. In a second request it is explicitly assigned that the a specialized weather subagent should be delegated and that also work as before. Since the request was the same, the supervisor took note and named the on-demand called agent as "Berlin weather repeat". In a third request it was asked to present an alternative sweatshirt. The supervisor decided that the subagent is not needed again and just looked into the wardrobe to present several alternatives.

**Conclusion/lesson learned.** The experiment is intended to show that Codex models delegation as an on-demand, conversational subtask with tool access, while n8n would usually model the same hand-off as explicitly connected workflow nodes and data fields. And this is true: conceptually all the structural preparation was the same. The difference lies in the fact that Codex then decided on the concrete realization itself and so to speak implicitly constructs the workflow (each execution on its own) while the workflow in n8n had to be constructed manually initially. The subagents is part of the agent loop or ongoing processing. But that also comes with the downside that the information and communication flow is not as obvious and probably makes debugging more difficult. Codex dynamically constructs the specific execution path during processing. Also confusing is the fact that the supervisor receiving the weather task is the same as the one who initially constructed parts of (its own future) workflow.

**Remarks.** Since the AGENTS.md file contains concrete instructions, the supervisor actually did more than expected for this experiment. First of all, it really used the skill and also autonomously and automatically called the subagent. Second, it decided wether to delegate or not on its own based on the task - as desired. But initially it was planned to test this behavior in upcoming experiments.

## Experiment B — using tools

**Purpose.** Give the weather specialist access to a weather/web tool and investigate how tool usage is handled inside a delegated subagent: who decides to use an available tool and how the result returns to the supervisor.

**Setup.** Repeat the Berlin-tomorrow clothing request. The supervisor delegates a narrowly scoped forecast task and instructs the weather specialist to use the available weather/web capability, report the capability used, and return only a clothing-relevant assessment. No custom weather API or infrastructure is added.

**Expected behavior.** The delegated agent independently performs the external lookup, then returns a compact result to the supervisor. The supervisor uses that result with wardrobe.md to choose the outfit.

**Actual observations/results.** The supervisor created a subagent. The specialist first attempted the structured weather endpoint, which produced no valid response; it then chose the delegated web-search capability (web__run) and obtained the forecast. It returned approximately 12-13°C low, 19-20°C high, bright early conditions, possible midday/afternoon showers, gusty westerly wind, and the advice to layer and bring rainproof outerwear with closed water-resistant footwear. It did not read the wardrobe or select an outfit. The supervisor received this text result and selected the outfit from the wardrobe.

**Conclusion/lesson learned.** The project instructions prescribe the responsibility split-supervisor delegates weather; specialist obtains and interprets weather-but they do not encode a fixed HTTP request or node graph. Within its scope, the specialist made the execution choice to fall back from the unavailable structured endpoint to web search. And that's despite the fact that there was no fallback given. Codex therefore exposes tool use as an agent action inside a delegated task, whereas n8n would normally make the tool choice, fallback path, and field mapping explicit in the workflow definition.


## Experiment C — external API access via a custom MCP tool

**Purpose.** This experiment aims at understanding the integration and use of custom tools via a custom weather API.

**Setup.** Prior to the actual use of a custom API, it was discovered how Codex handles these. This was done by asking Codex itself how a minimal mechanism supported by the standard Codex setup would look like. And this already uncovers a structural difference to n8n, where an agent accesses an API via a HTTP request node. Here, a local MCP server is implemented (via a Node.js process) which provides the desired tool get_weather_forecast through a defined tool interface consisting of a name, description, and input schema. The agent therefore interacts with the tool rather than directly with the underlying API implementation. The local MCP server isolates the actual HTTP implementation and API interaction. This was done by Codex via files .codex/config.toml (telling Codex that if MCP server is needed, start this program) and tools/weather-mcp.mjs (the MCP server). Afterwards this setup was understood. Finally the SKILL.md was adjusted to instruct the agent to first try to use the implemented tool when weather information is required
To test the actual use of this custom API, the Berlin clothing request is submitted to the supervisor.

**Expected behavior.** The supervisor delegates a weather specialist subagent who accesses the MCP tool get_weather_forecast(city, date) via the MCP server, started through the entry in the config.toml file referring to the node command. The weather API request is done over HTTPS and a result is processed and returned by the local MCP server back to the subagent. As before, the supervisor uses that result with wardrobe.md to choose the outfit.

**Actual observations/results.** The new get_weather_forecast MCP tool was available and returned Berlins forecast successfully. The supervisor could not delegate this lookup in this turn because the sessions subagent-thread limit was already reached, so afterwards he used the same custom tool directly. Access was permitted to use the Open-Meteo HTTP request. The weather result was returned and the supervisor looked up the wardrobe.md file to suggest an outfit.

**Conclusion/lesson learned.** The actual tool use worked as expected from what was learned about the setup. And the setup is probably just making the node in n8n explicit. But the way it is used differs from n8n: The architecture is not tied to the sequence of agent &rarr; subagent &rarr; tool, rather the supervisor decides at runtime which path to take to complete the task. The planned architecture was not identical to the path that was actually implemented. Here, the agent did not treat subagent delegation as a mandatory execution path. When the subagent limit was reached, it adapted by calling the MCP weather tool directly. Again demonstrating the more dynamic and autonomous execution model observed in Codex.

**Remark — understanding the MCP server implementation.** Before implementing the authenticated variant in Experiment D, the existing `weather-mcp.mjs` server was examined in detail to understand the underlying MCP architecture and communication model.

This led to several important implementation-level learnings. The server starts as a Node.js program, indicated by the shebang, and acts as a small, self-contained interface between Codex and an external weather API. The `TOOL` definition represents the public interface exposed to the MCP client: it defines the tool name, description, and expected input schema. The actual implementation is separated from this interface. In the current server, `getForecast()` contains the weather-specific logic, including input validation, geocoding, external HTTP requests, and normalization of the API response.

The `handle()` function acts as the central request handler and, conceptually, as a router. It receives JSON-RPC messages from the MCP client, distinguishes between initialization, tool discovery, and tool execution requests, and dispatches the request to the appropriate implementation. This also revealed how the architecture would need to change when adding multiple tools: the current implementation is explicitly tied to the single `TOOL` definition and `getForecast()` function. Adding a second tool would therefore require extending both the tool list and the routing logic inside `handle()` so that different tool names trigger different implementations.

Another important learning was the distinction between the involved components: Codex acts as the MCP host/client environment, the Node.js process acts as the MCP server, and the server exposes tools that the client can discover and call. The server itself encapsulates all details of the external API interaction, meaning that the agent does not need to know the concrete HTTP request structure, geocoding procedure, or response format.

The geocoding step was also identified as an important architectural component. Before requesting weather data, the server converts a human-readable location such as a city name into geographic coordinates. This separates the user-facing tool interface from the requirements of the external weather API and makes the tool easier to reuse.

Finally, the JSON-RPC communication mechanism was examined in detail. The MCP server receives messages through `stdin` and sends protocol responses through `stdout`, while diagnostic output is written to `stderr`. Because incoming data streams do not guarantee that a complete JSON message arrives in a single chunk, the server maintains a buffer and processes complete newline-delimited messages only. Incomplete messages remain in the buffer until the next chunk arrives. This chunk handling is therefore essential for reliable stream-based communication and prevents incomplete JSON from being processed accidentally.

Overall, examining the server implementation demonstrated the importance of clear encapsulation. The MCP tool provides a stable interface to the agent, while protocol handling, routing, API logic, geocoding, HTTP requests, and response normalization remain hidden behind the server boundary. This separation makes the capability easier to understand, modify, reuse, and extend without exposing unnecessary implementation details to the agent.


## Experiment D — authenticated API as a custom MCP tool

**Remark.** For this experiment, Node.js LTS had to be installed locally using the Windows installer from their website. Afterwards, PowerShell was used to navigate to the project folder and execute `npm.cmd install`, which reads `package.json` and installs the declared dependencies. The existing public MCP server had previously worked without a local Node.js installation, as Codex apparently provided Node.js within its own runtime environment. However, the new implementation required `dotenv` as a project dependency, making a local Node.js/npm installation necessary. Similar to `.env`, the generated `node_modules/` directory was added to `.gitignore`.

**Purpose.** This experiment aims to understand how an external API requiring authentication can be integrated as a custom MCP tool and how credentials are separated from agent instructions, source code, and project configuration. It also investigates whether the resulting tool can be discovered and used by the existing agent architecture in the same way as the public weather tool.

**Setup.** A second local stdio MCP server, `weather-auth-mcp.mjs`, was implemented alongside the existing public Open-Meteo server. The new server closely reused the structure, JSON-RPC communication, tool declaration, validation, error handling, stdin buffering, Open-Meteo geocoding, and normalized output format of the original implementation. The main difference was the authenticated forecast request to the meteoblue API.

The API credential was stored locally in a `.env` file and excluded from version control through `.gitignore`. A committed `.env.example` documented the required environment variable without containing the actual credential. The MCP server used `dotenv` to load the API key into `process.env.METEOBLUE_API_KEY`, keeping the credential outside of the source code, agent prompts, MCP schema, and Codex configuration.

The `.codex/config.toml` configuration was also adjusted to remove the previously hard-coded absolute working directory and to register the new `weather_auth` MCP server using a relative script path. The authenticated server resolved its `.env` file relative to its own source location, making the credential setup independent of the current working directory.

The new `get_meteoblue_forecast(city, date)` tool first reused Open-Meteo geocoding to convert the requested city into coordinates. These coordinates were then used for an authenticated HTTPS request to meteoblue's `basic-1h_basic-day` endpoint. The server selected the requested date from the returned forecast data and mapped the result into a normalized format comparable to the existing public weather tool.

Finally, `SKILL.md` was updated so that weather-related requests would prefer the authenticated meteoblue tool before considering other available weather capabilities.

**Expected behavior.** For a weather-dependent clothing request, the supervisor should delegate the weather task to the specialized weather subagent. The subagent should use the authenticated `get_meteoblue_forecast` MCP tool, which causes Codex to communicate with the local MCP server. The server should load the API credential internally from `.env`, perform the geocoding and authenticated HTTPS request, normalize the result, and return it to the subagent without exposing the credential.

The weather specialist should interpret the returned forecast into clothing-relevant implications and return a concise assessment to the supervisor. The supervisor should then combine this assessment with `wardrobe.md` to produce the final clothing recommendation.

**Actual observations/results.** After creating the `.env` file, installing the required `dotenv` dependency, and restarting Codex, the authenticated `get_meteoblue_forecast` MCP tool was successfully discovered and called directly. The meteoblue API returned a normalized forecast result for Berlin, and the corresponding API request could independently be verified in the meteoblue API key manager.

After updating `SKILL.md`, a normal clothing request for Berlin was submitted. The supervisor delegated the weather task to a specialized subagent, which successfully used the authenticated MCP tool and returned a clothing-relevant weather assessment to the supervisor. The supervisor then consulted `wardrobe.md` and generated the final outfit recommendation.

An additional request for Berlin two days in the future also returned a valid forecast with different weather values. This showed that the configured meteoblue endpoint and MCP server were capable of handling future dates rather than being limited to the current day. The request therefore confirmed that the server correctly processed the `date` parameter and selected forecast data for the requested date.

The experiment successfully demonstrated the complete authenticated tool flow:

`.env` → `dotenv` → `process.env.METEOBLUE_API_KEY` → local MCP server → authenticated HTTPS request → normalized MCP result → weather subagent → supervisor → clothing recommendation.

**Conclusion/lesson learned.** The transfer of the architecture from Experiment C to an authenticated external API was successful. The experiment demonstrated that authentication can be integrated into an MCP-based tool architecture without exposing credentials to the agent itself. Conceptually, the authenticated HTTP request performs a similar role to an authenticated HTTP Request node in n8n, but the implementation is encapsulated behind an MCP tool instead of being directly represented in the workflow.

The major architectural decision concerned how to store and provide the API key. Possible approaches included hard-coding the key into the MCP server, manually setting it as an environment variable in the terminal for each session, exposing it to the agent, or storing it locally while avoiding unnecessary additional infrastructure. The chosen approach was to use a local `.env` file together with `dotenv`. The real API key remains outside the source code and Git repository, while `.env.example` documents which configuration variable is required. The MCP server loads the credential at runtime and accesses it internally through `process.env`.

This resulted in a clear separation of responsibilities:

```text
Agent
  → decides whether to use the tool

MCP tool
  → provides a stable interface

MCP server
  → implements the API integration
  → loads and handles the credential

.env
  → stores the local secret
```

This encapsulation is one of the main advantages of the architecture. The agent can use `get_meteoblue_forecast` without knowing how the HTTP request is constructed or where the API key is stored. The credential does not need to appear in prompts, skill instructions, tool schemas, tool results, or the agent context. From the agent's perspective, the authenticated and unauthenticated weather tools remain similar capabilities with clearly defined interfaces.

The experiment also required a better understanding of the local Node.js environment and package management. Although the previous MCP server had apparently been executable within the Codex environment, the new implementation introduced the external `dotenv` dependency. This required installing Node.js and npm locally, creating a `package.json` to declare dependencies, and installing them into the project. `package-lock.json` additionally records the resolved dependency versions to improve reproducibility. The installed `node_modules` directory, like the real `.env` file, must not be committed and therefore belongs in `.gitignore`.

Portability became another important architectural consideration. The original MCP configuration contained an absolute working-directory path, making the project dependent on its local location. Removing this path allowed the MCP server configuration to use relative script paths instead. The authenticated server additionally resolves the `.env` file relative to its own source location rather than relying on the current working directory. This makes the project easier to clone, move, and reproduce on another machine.

The experiment therefore demonstrated that credential handling is not merely an implementation detail. It affects architecture, security, portability, reproducibility, and observability. A well-designed MCP server provides a stable boundary between an autonomous agent and external infrastructure: the agent decides *when* a capability should be used, while the MCP server controls *how* the external request is executed and how sensitive credentials are handled.

Finally, `.gitignore` became particularly important. It separates reproducible project structure from machine-specific or secret information. Files such as `.env` and `node_modules` are necessary for local execution but should not become part of the repository, whereas files such as `.env.example`, `package.json`, and `package-lock.json` document how another user can recreate the required environment without receiving the actual credentials.
