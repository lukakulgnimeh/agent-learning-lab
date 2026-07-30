# Reflection

### Learnings

- The supervisor often just calls every agent one after another, rarely in any chosen order after getting feedback.
- The supervisor should get a better llm brain for better orchestration and conclusions.
- As in Project 01, the output is only as good as the input: all sub-agents should be equipped with a variety of research tools.
- It could be helpful to append an agent at the end for quality check.
- Obtained skills:
  - Organizing communication between the supervisor and subagents
  - Defining robust interfaces
  - Structuring messages
  - Erasing hallucinations caused by imprecise prompts
  - Traceability of decisions
  - Session management of memory
  - Separation between reasoning and results
  - Limitations of local LLM knowledge
- To see what changes, an alternative implementation using workflow triggers has been done afterwards. It turned out that the functionality was structurewise exactly the same.
  - Here also learned about the debugging tool and publishing/activating a workflow.


### Meta-level realizations and learnings

- A high-level design was once again systematically developed prior to implementation and iteratively refined during implementation.
- Information and decision flows must be explicitly modeled.
- Communication between agents is a distinct architectural problem.
- Robust interfaces result from clearly defined data structures, not from implicit assumptions.
- There is no automatic shared understanding among intelligent components.
- Good prompts define responsibilities, not just tasks.
- Observability (logs, memory, intermediate states) is essential for understanding and improving agent systems at all.
- Session management significantly influences the behavior of agent-based systems (clear memory after each workflow execution).
- The actual thought process of an LLM remains hidden; only the (forced)generated output is visible.
- Architectural decisions often have a greater impact on system quality than the choice of individual models.
- Multiple small, specialized agents may be easier to control than a single universal agent.
- Agents require clear boundaries for their areas of responsibility.
- A system can be expanded iteratively without changing its basic structure.