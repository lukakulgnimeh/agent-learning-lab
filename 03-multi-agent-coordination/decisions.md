# Decisions
To keep the focus on the main objectives, I intentionally decided to:

- First build the whole system with only two sub-agents. 
- Do not provide any further tools like research, just let them decide on their world knowledge.
- Each agent should, if possible, answer a clearly defined question (that is distinct from the others) so that the supervisor can then synthesize the various perspectives.

The construction process led to the following additional decisions:

- To reduce the amount of information the supervisor must handle, the sub-agent were explicitly advised top not send back any information related to the other sub-agents.
- For the same reason, they are restricted to returning only a concise summary and not an entire argumentation.
- The supervisor agent is provided with additional information on each sub-agent such that misunderstandings due to the small llm are reduced.