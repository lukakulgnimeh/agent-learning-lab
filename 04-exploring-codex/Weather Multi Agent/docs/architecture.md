# Minimal two-agent architecture

The main Codex task is the **supervisor**. Its reusable behavior is defined in [`skills/clothing-recommendation/SKILL.md`](../skills/clothing-recommendation/SKILL.md). It reads [`wardrobe.md`](../wardrobe.md), decides whether weather is needed, and owns the final recommendation.

When weather is needed, the supervisor uses Codex's native subagent delegation to create a short-lived **weather specialist** task. The delegate receives only the requested location and time period, obtains weather through the available weather tool, and returns a compact clothing-relevant assessment. It does not inspect the wardrobe or address the user directly.

```text
user request
  -> supervisor: wardrobe + decision
      -> weather subagent: forecast -> clothing assessment
  -> supervisor: available outfit + final response
```

There is deliberately no agent framework, API service, queue, or persistent state. Codex supplies the orchestration and tool access at runtime; the repository supplies the reusable supervisor instructions and the wardrobe data.

## Expanding the architecture: adding custom MCP tool for external API access

The external API access is realized via a **local stdio MCP server**: a small Node.js process that exposes one tool, such as `get_weather_forecast`, and calls a public weather API (for example, Open-Meteo). This suits best as the standard Codex setup already has Node.js available; no Python runtime is present.

```text
Codex / weather subagent
  → MCP tool: get_weather_forecast(city, date)
    → local Node MCP server
      → weather API over HTTPS
      ← normalized forecast result
    ← MCP tool result
  ← weather assessment
```

1. **Tool definition**  
   The MCP server defines the tool’s name, description, and input schema—for example, `city: string` and `date: YYYY-MM-DD`. The description is important: it tells the agent when the tool is appropriate.

2. **API-request code**  
   The actual `fetch()` calls live in a small local Node file in this repository, e.g. `tools/weather-mcp.mjs`. That code can geocode Berlin, call the forecast endpoint, and return only the fields useful for clothing.

3. **Tool discovery**  
   Codex starts the MCP server through a project-level `.codex/config.toml` entry pointing at that Node command. On startup, Codex asks the server for its tool catalog, making the tool available in the desktop app, CLI, and IDE for this Codex host. 

4. **Decision to call it**  
   The agent decides from the user request, the tool description/schema, and applicable instructions. In this project, the supervisor skill could explicitly instruct the weather specialist: “Use `get_weather_forecast` for weather-dependent requests.” The tool is available; it is not automatically invoked.

5. **Result flow**  
   The MCP server returns structured/text tool output to Codex. The weather specialist sees that result in its tool context, turns it into a concise clothing assessment, and returns that summary to the supervisor.
