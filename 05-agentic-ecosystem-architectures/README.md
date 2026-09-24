# Project 5 - Which architectural assumptions underlie different AI development ecosystems?
 
## Research Question
 
Investigating and comparing different agentic system providers and their underlying architectural model.
 
## Goal
 
This project examines how different agentic development ecosystems approach the same underlying problem: a small two-agent system that recommends an outfit for the day based on current weather and the contents of a wardrobe. It is implemented once per ecosystem so that the results are comparable rather than incidental.

Two ecosystems were already explored in the more exploratory Projects 01-04: **n8n** (workflow based) and **Codex** (OpenAI's agent harness). This project adds two further, deliberately in-depth examinations of the same problem:
 
- **Part A: Claude Code** (`A-claude-code/`). A supervisor/subagent/skill architecture built directly with Claude Code's own project conventions.
- (currently) **Part B: LangGraph** (`B-langgraph/`). The same problem, rebuilt as an explicit graph with developer-defined state and control flow.

Rather than repeating the earlier n8n and Codex work here, their architectural conclusions are carried forward and via **The Comparison** below added into `comparison.md`, so that all four ecosystems end up evaluated against the same ten criteria.
 
## The Comparison
 
Each ecosystem (n8n, Codex, Claude Code, LangGraph) is evaluated against the same ten architectural criteria, used consistently across every part of this project:
 
1. **Basic Model** — Workflow? Repository? Agent? Graph? Runtime?
2. **Developer Control** — What do I define explicitly?
3. **Agent Role/Autonomy** — What does the system decide on its own?
4. **Control** — How deterministic is the execution?
5. **Transparency/Observability/Debugging** — How do I see what has happened?
6. **State/Context** — How does the system know what has happened so far?
7. **Tools** — How are capabilities integrated?
8. **Delegation/Subagents** — How are subagents / parallel tasks created?
9. **Extensibility** — How do I add new capabilities?
10. **Suitable Problem Types and Typical Use Cases** — For which problem classes does the model seem particularly useful?

The full per-ecosystem reasoning behind each answer lives in that part's own `README.md` (*Core Architectural Findings*) and `reflection.md`. The `comparison.md` file in this folder condenses all four ecosystems into a single side-by-side table against these ten criteria, as a quick-reference result overview.
 
## Conclusion
 
*(To be added once Part B is complete.)* This section will summarize the core cross-ecosystem findings - the general architectural differences between n8n, Codex, Claude Code, and LangGraph, using the weather/wardrobe problem as the shared example throughout - as an analysis of `comparison.md`.
