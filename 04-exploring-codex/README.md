# Project 4 – Which architectural assumptions does Codex have?

## Research Question

Moving from n8n to a different agentic ecosystem, we investigate which way of thinking OpenAIs Codex tool possesses.

## Goal

Exploring Codex to understand its underlying architecture, strengths and weaknesses as well as differences to n8n. To do so, we construct a two-agent system realizing the problem of project 01, i.e. providing a clothing suggestion for the day based on the weather and contents of a wardrobe. 

If not already done, a supervisor can ask his subagent for the weather forecast: the subagent gathers weather information via HTTP request and puts it into a general perspective regarding clothing suggestions like light summer outfit. After combining this expertise with the given wardrobe, the supervisor then selects a suitable clothing suggestion. We want to realize the task of the supervisor via an underlying skill. This would allow for extended use of the same agent, for example, by adding another skill to recommend running gear that also takes trail maps into account.

Furthermore, we want to investigate how tools are used by Codex's (sub-)agent and which structure is needed to be implemented. For example in case of simple web search, external API access and how Codex handles authentication. 

## Project Structure
Following the **commit-history**, the project is structured as follows, Codex having access only to the weather-multi-agent folder. The `experiment.md` file documents the progress of this project in detail and is the most important log for the in depth project progress and observations. This `README.md` and files in this folder summarize the most important observations.

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

During development several challenges emerged.

### 1. 

## Result

## Findings

## Core Reflection