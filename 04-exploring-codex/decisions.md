# Decisions

To keep the focus on the main objectives, I intentionally decided to:

- Split into two agents although the subagent is not really an agent anymore but a workflow.
- Intentionally, it is decided to use the build-in Codex delegation for subagents instead of implementing the agents separately.

The construction process - especially for Experiments C and D - led to the following additional decisions:

- After it was discovered how Codex handles external API access (done by asking Codex itself), we decided to implement a local MCP server via a Node.js process. It provides the desired tool through a defined tool interface consisting of a name, description, and input schema. The agent therefore interacts with the tool rather than directly with the underlying API implementation.
- Adding authentication: The new server is designed to closely reuse the structure, JSON-RPC communication, tool declaration, validation, error handling, stdin buffering, Open-Meteo geocoding, and normalized output format of the original implementation. The main difference is the authenticated forecast request to the meteoblue API. Additionally, the following thought went into the choice of the authentication:
    - Instead of simply setting the API key via a Windows user-level environment variable *setx METEOBLUE_API_KEY "your-real-key"*, we wanted to keep the setup contained in the project folders. 
    - The credentials should also stay outside of the source code, agent prompts, MCP schema, and Codex configuration. But it should also be easily reproducible. 
    - Therefore, the API key is stored locally in a `.env` file and excluded from version control through `.gitignore`. A committed `.env.example` documents the required environment variable without containing the actual credential. The MCP server used `dotenv` to load the API key into `process.env.METEOBLUE_API_KEY`, keeping the credential outside of reach for the agent etc. 
    - Unfortunately this means, that `dotenv` must be setup locally, coming at the cost of installing Node.js for the operating system.