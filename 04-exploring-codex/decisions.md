# Decisions

To keep the focus on the main objectives, I intentionally decided to:

- Split into two agents although the subagent is not really an agent anymore but a workflow.

The construction process - especially for Experiments C and D - led to the following additional decisions:

- After it was discovered how Codex handles external API access (done by asking Codex itself), we decided to implement a local MCP server via a Node.js process. it provides the desired tool through a defined tool interface consisting of a name, description, and input schema. The agent therefore interacts with the tool rather than directly with the underlying API implementation.