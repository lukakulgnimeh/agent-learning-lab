# Project 4 – Which architectural assumptions does Codex have?

## Research Question

Moving from n8n to a different agentic ecosystem, we investigate which way of thinking OpenAIs Codex tool possesses.

## Goal

Exploring Codex to understand its underlying architecture, strengths and weaknesses as well as differences to n8n. To do so, we construct a two-agent system realizing the problem of project 01, i.e. providing a clothing suggestion for the day based on the weather and contents of a wardrobe. 

If not already done, a supervisor can ask his subagent for the weather forecast: the subagent gathers weather information via HTTP request and puts it into a general perspective regarding clothing suggestions like light summer outfit. After combining this expertise with the given wardrobe, the supervisor then selects a suitable clothing suggestion. We want to realize the task of the supervisor via an underlying skill. This would allow for extended use of the same agent, for example, by adding another skill to recommend running gear that also takes trail maps into account.

Furthermore, we want to investigate how tools are used by Codex's (sub-)agent and which structure is needed to be implemented. For example in case of simple web search, external API access and how Codex handles authentication. 

## Project Structure
Following the **commit-history**, the project is structured as follows, Codex having access only to the weather-multi-agent folder. The `experiment.md` file documents the progress of this project in detail and is the most important log for the in-depth project progress and observations. The purpose of each experiment is briefly summarized in the section below. This `README.md` and files in this folder summarize the most important observations.

- `README.md`
- `decisions.md`
- `evaluation.md`
- `reflection.md`
- `prompt-history.md`
- `Weather Multi Agent/`
    - `AGENTS.md` *(defines the supervisor/weather-specialist responsibilities)*
    - `README.md` *(contains project overview: initial draft of this README)*
    - `wardrobe.md` *(contains a list of pieces of clothing)*
    - `skills/`
        - `clothing-recommendation/`
            - `SKILL.md` *(contains specialized instructions how to deal with clothing recommendation tasks)*
    - `docs/`
        - `architecture.md` *(Codex generated this from the rest to tell the agent in the loop a concise structure)*
        - `experiments.md` *(logs the steps involved to achieve the goal; Codex created first draft for setup and expected behavior from assignments in prompt, while we added observations and conclusions afterwards)*
    - `.codex/`
        - `config.toml` *(Experiment C and D: for Codex to discover and start MCP-servers)*
    - `tools/`
        - `weather-mcp.mjs` *(Experiment C: the custom MCP-server exposing forecast tool)*
        - `weather-auth-mcp.mjs` *(Experiment D: new adapted MCP server; obtains its authentication key from the process environment)*
    - `package.json` *(Experiment D:  minimal Node project declaration with dotenv as a dependency)*
    - `package-lock.json` *(Experiment D: lock the installed dotenv version for reproducibility)*
    - `.env.example` *(Experiment D: non-secret key documentation template)*
    - `.gitignore` *(Experiment D: ignore .env and any other local secret files for configuration)*
    - `.env` *(Experiment D: secret key documentation)*
    - `node_modules/dotenv/..` *(Experiment D: executes .env key call inside the Node MCP process)*

## Experiments

The experiments progressively explore how Codex handles delegation, skills, tools, external APIs and authentication.

- **Experiment A - Dynamic delegation:** Investigates whether the supervisor dynamically delegates weather-related tasks to the weather specialist when needed.
- **Experiment B - Supervisor-subagent interaction:** Explores how responsibilities, context and information are passed between the supervisor and the delegated weather specialist.
- **Experiment C - External API as a tool:** Investigates how an external weather API can be exposed to Codex through a custom local MCP server and how the agent uses this capability at runtime.
- **Experiment D - Authenticated API as a custom MCP tool:** Extends the MCP approach to an authenticated API, focusing on credential handling and the separation between agent, tool interface, implementation and secrets.

## Architecture (sketch)

The following architecture illustrates the dependencies at the agent level. In Experiments A and B, the actual collection of weather data is nothing special, but especially for Experiments C and D the architectural details of the forecast HTTP request are worth noting. These details can be found in the `architecture.md` file and further explanations are included in the `experiments.md` file.

Natural-language-request: user's clothing request

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr;

Supervisor agent: which weather data is needed?  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&rarr; Weather-subagent: gathers data based on request and puts it into clothing perspective  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
Supervisor agent: decides to call subagent again or use wardrobe to create output (based on skill)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr;

Output to user


## Key Challenges

- Balancing autonomy and control: Codex can dynamically choose how to complete a task, but this makes the execution path less predictable and harder to track and debug.
- Understanding how to translate explicit workflow concepts from n8n into concrete agent capabilities such as skills, tools, APIs and MCP servers.
- Integrating an authenticated external API while keeping credentials outside the agent, source code and Codex configuration.

## Result

- A working supervisor–subagent architecture was implemented using a reusable clothing-recommendation skill.
- Weather access was progressively implemented through web search, a custom MCP tool and an authenticated custom MCP tool.
- The authenticated API integration successfully kept the API key encapsulated inside the MCP server while exposing only a stable tool interface to the agent.

## Findings

- Codex does not primarily execute a predefined workflow. Instead, the developer provides instructions, context and capabilities, while the agent determines much of the concrete execution path at runtime.
- Skills constrain and guide behavior, but do not define a fixed workflow.
- Delegation is on-demand, i.e. the supervisor can delegate when useful, reuse existing information, or adapt when a subagent is unavailable.
- MCP provides a clear capability boundary, meaning that the agent decides when to use a tool, while the MCP server controls how the external system is accessed.
- Compared to n8n, Codex therefore provides more execution flexibility, but with less explicit observability and more difficult debugging.

## Core Reflection

The main architectural difference to n8n is the **shift from workflow definition to capability definition**. In n8n, the developer largely determines the execution path through explicitly connected nodes. In Codex, the developer defines the environment and its capabilities, while the agent decides how to combine them at runtime. 

The resulting autonomy is powerful, but it also means that information flow, decision-making and debugging become less transparent.
