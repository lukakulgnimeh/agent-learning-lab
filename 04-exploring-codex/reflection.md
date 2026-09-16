# Reflection

### Learnings

- It is confusing that the supervisor receiving the weather task is the same agent that initially constructs parts of the workflow. Planning, orchestration and execution are therefore closely intertwined.

- The supervisor has a lot of degrees of freedom in how it completes a task. This provides flexibility, but makes the resulting execution path less predictable.

- Due to the stronger underlying LLM ("brain"), the answers were noticeably better compared to the local Ollama model used in the previous projects.

- Compared to n8n:

  - task completion is more autonomous;
  - the information and decision flow is more difficult to track;
  - debugging is more difficult;
  - capabilities that would be represented as explicit workflow nodes in n8n have to be provided to Codex through concrete tools, APIs, MCP servers, etc. This allows these capabilities to be used more dynamically rather than enforcing a predefined execution sequence.

- Despite the dynamic execution, there is still a clear separation of responsibilities. This became particularly visible in Experiment D, where the agent could use an authenticated API through an encapsulated MCP server without having access to the credential itself.

- Skills influence the agent's behavior, but they do not define a fixed workflow. They provide instructions and constraints within which the agent can decide how to complete a task.

- Tool availability and tool instructions therefore form an important part of the agent's environment. The actual execution path can change depending on available tools, delegation limits, and the agent's assessment of what is necessary.

- **Obtained skills:**

  - Structuring a Codex project using `AGENTS.md`.
  - Creating and applying reusable `SKILL.md` files.
  - Designing supervisor–subagent responsibilities and on-demand delegation.
  - Providing context explicitly when delegating tasks.
  - Creating and configuring a local stdio MCP server.
  - Defining MCP tools through a name, description and input schema.
  - Understanding JSON-RPC communication and stdin/stdout-based MCP communication.
  - Implementing request routing and tool-specific handling.
  - Encapsulating external API requests behind an MCP tool interface.
  - Integrating an authenticated API without exposing credentials to the agent.
  - Managing local credentials with `.env`, `.env.example`, and `dotenv`.
  - Managing Node.js dependencies with `package.json`, `package-lock.json`, and `node_modules`.
  - Using `.gitignore` to separate local dependencies and secrets from the repository.
  - Considering portability and reproducibility when structuring a project and configuring MCP servers.
  - Testing autonomous tool selection, delegation and fallback behavior.

### Meta-level realizations and learnings

- A major architectural difference to n8n is that the developer primarily defines the available context, instructions and capabilities, while the agent determines much of the concrete execution path at runtime.

- This increases autonomy and flexibility, but reduces explicit control and makes observability and debugging more difficult.
