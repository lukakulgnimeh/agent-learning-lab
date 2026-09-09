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
