# Project 4 – Which architectural assumptions does Codex have?

## Research Question

Moving from n8n to a different agentic ecosystem, we investigate which way of thinking OpenAIs Codex tool possesses.

## Goal

Exploring Codex to understand its underlying architecture, strengths and weaknesses as well as differences to n8n. To do so, we construct a two-agent system realizing the problem of project 01, i.e. providing a clothing suggestion for the day based on the weather and contents of a wardrobe. 

If not already done, a supervisor can ask his subagent for the weather forecast: the subagent gathers weather information via HTTP request and puts it into a general perspective regarding clothing suggestions like light summer outfit. After combining this expertise with the given wardrobe, the supervisor then selects a suitable clothing suggestion. We want to realize the task of the supervisor via an underlying skill. This would allow for extended use of the same agent, for example, by adding another skill to recommend running gear that also takes trail maps into account.

Furthermore, we want to investigate how tools are used by Codex's (sub-)agent and which structure is needed to be implemented. For example in case of simple web search, external API access and how Codex handles authentication. 

## Project Structure

- Weather Multi Agent/
    - AGENTS.md
    - README.md
    - wardrobe.md
    - skills/
        - clothing-recommendation/
            - SKILL.md
    - docs/
        - architecture.md
        - experiments.md
    - .codex/
        - config.toml
    - tools/
        - weather-mcp.mjs
        - weather-auth-mcp.mjs
    - package.json
    - package-lock.json
    - .env.example
    - .gitignore
    - .env
    - node_modules/dotenv/..



## Architecture (sketch)

Natural-language-request: clothing request

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr;

Supervisor agent: which weather data is needed?  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&rarr; Weather-subagent: gathers data based on request and puts it into clothing perspective  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
Supervisor agent: decides to call subagent again or use wardrobe to create output (based on skill)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr;

Output to user