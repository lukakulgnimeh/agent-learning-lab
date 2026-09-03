# Project 4 – Which architectural assumptions does Codex have?

## Research Question

Moving from n8n to a different agentic ecosystem, we investigate which way of thinking OpenAIs Codex tool possesses.

## Goal

Exploring Codex to understand its underlying architecture, strengths and weaknesses as well as differences to n8n. To do so, we construct a two-agent system realizing the problem of project 01, i.e. providing a clothing suggestion for the day based on the weather and contents of a wardrobe. If not already done, a supervisor can ask his subagent for the weather forecast: the subagent gathers weather information via an http request and puts it into a general perspective regarding clothing suggestions like light summer outfit. After combining this expertise with the given wardrobe, the supervisor then selects a suitable clothing suggestion.

Furthermore, we want to realize the task of the supervisor via an underlying skill. This would allow for extended use of the same agent, for example, by adding another skill to recommend running gear that also takes trail maps into account.

## Project Structure
Following the **commit-history**, the project is structured as follows:
- Initial drafts

## Architecture (sketch)

Natural-language-request: user's business idea 

<p style="text-indent: 54px;">&darr;

Supervisor agent: which weather data is needed?
<div style="padding-left: 54px;">|</div>
<div style="padding-left: 54px;">|&rarr; Weather-subagent: gathers data based on request and puts it into clothing perspective</div>
<p style="text-indent: 54px;">|

Supervisor agent: decides to call subagent again or use wardrobe to create output (based on skill)
<p style="text-indent: 54px;">&darr;

Output document

## Key Challenges

During development several challenges emerged.

### 1. 

## Result

## Findings

## Core Reflection