# Project 5 - Which architectural assumptions underlie different AI development ecosystems?
 
## Research Question
 
Investigating and comparing different agentic system providers and their underlying architectural model.
 
## Goal
 
This project examines how different agentic development ecosystems approach the same underlying problem: a small two-agent system that recommends an outfit for the day based on current weather and the contents of a wardrobe. It is implemented once per ecosystem so that the results are comparable rather than incidental.

Two ecosystems were already explored in the more exploratory Projects 01-04: **n8n** (workflow based) and **Codex** (OpenAI's agent harness). This project adds two further, deliberately in-depth examinations of the same problem:
 
- **Part A: Claude Code** (`A-claude-code/`). A supervisor/subagent/skill architecture built directly with Claude Code's own project conventions.
- **Part B: LangGraph** (`B-langgraph/`). The same problem, rebuilt as an explicit graph with developer-defined state and control flow.

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

The comparison shows that n8n, Codex, Claude Code, and LangGraph do not mainly differ in whether they can solve the weather/wardrobe problem, but in where they place control over the solution.

n8n treats the problem primarily as an explicit workflow. The developer defines the nodes, connections, state passed between them, and delegation structure, while any model-driven behavior is restricted to specific AI Agent nodes. This makes execution relatively deterministic and transparent, which fits repeatable integrations and automations well.

Codex and Claude Code make a different architectural assumption: the main control loop belongs to the model. The developer provides project context, tools, permissions, skills and delegation capabilities, but leaves much of the execution path to the agent. Their architectures are therefore flexible for open-ended tasks, while exact sequencing and other guarantees are weaker. The two systems differ in how delegation and tool access are configured, but both rely on a pre-built agent harness rather than an explicitly authored workflow.

LangGraph sits more flexibly between these approaches. The weather/wardrobe problem can be implemented with explicit developer-defined routing, with a model-driven ReAct loop, or as a multi-agent system in which specialized agents are integrated as tools. This makes control itself configurable: the developer can decide how much of the execution should remain explicit and how much should be delegated to model decisions.

The comparison also shows that tools and delegation are common architectural building blocks, but their role differs. n8n wires capabilities directly into a workflow, Codex and Claude Code integrate capabilities inside their agent harnesses and LangGraph allows the developer to choose whether a capability should be a node, a tool, or even a complete agent as a tool. LangGraph therefore makes the boundary between workflow logic and agent behavior especially explicit.

State and context are another major difference. n8n passes explicit data between workflow nodes, while Codex and Claude Code rely mainly on project configuration and the active session context. LangGraph makes state a central architectural concept and therefore gives the developer explicit control over how information is represented and shared.

Overall, the shared problem shows that there is no single ideal agentic architecture. **n8n prioritizes explicit workflow control, Codex and Claude Code prioritize model-driven autonomy within a predefined harness, and LangGraph allows the developer to choose the boundary between the two.** The main architectural trade-off across the four ecosystems is therefore not simply automation versus agents, but **determinism and explicit control versus flexibility and model-driven execution**.

