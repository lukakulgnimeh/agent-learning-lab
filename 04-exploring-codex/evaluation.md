# Evaluation
The evaluation should focus on the following parameters:

- Quality of the output with respect to the given skill.
- Interaction between supervisor and subagent specialist.
- How does Codex deal with different tool options?
- Distinctive features of the architecture underlying Codex.

It should also cover problems and errors as well as trade-offs.

## Parameter evaluation

- Codex agents are able to thoroughly follow a skill with both supervisor and subagent having access to it. The output was always right on point, even suggesting to bring extra waterproof jackets or shoes if available, since they were not present in the wardrobe.
- Codex always seems to want to find a satisfying answer: with no tool given in the beginning, it decided to discover a forecast through a web search although no fallback was given.
- Experiment A also showed that Codex is able to dynamically decide wether it is enough to recycle a forecast or a new one is needed - "delegation on-demand".
- Experiment B showed that Codex is able to follow clear execution paths. There seems to be a lot of autonomy in the completion of a given task: the decision which tools are used in which way is more dynamic - coming at the cost of difficulties in tracking information and decision flow.
    - Experiment C further confirmed this: as the subagents thread limit was reached, the supervisor adapted and did the forecast request itself.
- Experiment C also showed that workflow nodes must be implemented concretely in Codex, like a HTTP request node via the implementation of an MCP-server. But this again allows more dynamic uses of the interface.
    - Experiment D extended this: when dealing with authentication, the more dynamic access to tools must also allow for a more dynamic use of the authentication key. A decision has to be made on how the API key is stored and processed. It was demonstrated that the authentication can be integrate into the MCP architecture without exposing the key to the agent itself.
- It was successfully tested that the MCP server handles different input requests.
- All in all it was seen that the tool selection itself was influenced by several things: skill instructions, available tools, subagent-limit and task requirements.

## Problems and errors

All foreseeable problems, such as those related to the implementation of authentication, were resolved through targeted design decisions and compromises in selecting the most appropriate architecture.