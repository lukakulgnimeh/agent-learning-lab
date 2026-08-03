# Findings that have occurred multiple times


### A functioning workflow is not an agent.


### Systems consist of a few recurring building blocks.
Complexity arises from their combination.


### Complexity rarely arises from individual components. 
It almost always arises at the interfaces between them. This applies just as much to APIs as it does to agent communication.


### Missing metadata is often more important than a better model.


### Retrieval often has a greater impact on quality than the LLM.
An agent is only as good as the information it uses to make decisions. That's why it's often more worthwhile to improve the information system than to optimize the prompt.


### Good architecture reduces prompt complexity.


### A better model does not compensate for a poor system structure.


### Hallucinations are often architectural problems.
Not exclusively problems of the llm.


### Observability saves more time than debugging.


### Architectural decisions can only be made once data flows are clear.


### Iteration beats perfection.
Every version improves the mental and architectural model.


### Good documentation accelerates further development.
Not just collaboration.


### Tools change. Principles remain.


### Decisions should be transparent.
A good architecture explains not only what happens, but why.


### The real work begins after the first working prototype.
That’s when the process of improving the architecture begins.


### There is no shared understanding among agents.
Communication must be explicitly designed.


### Local optimizations can degrade global quality.
Example: A perfect prompt for a subagent can unnecessarily restrict the supervisor.


### Every new component also increases maintenance costs.
Therefore, only add it if it provides clear added value.


### Documentation is part of the architecture.
A good architecture is not only implemented, it is communicated. Design decisions become reusable only when they are documented.


### Version history documents learning, not only code.
Meaningful commits create a narrative of architectural evolution. Version control is a record of decisions, not just file changes.