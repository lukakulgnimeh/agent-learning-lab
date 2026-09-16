---
name: clothing-recommendation
description: Recommend clothing from the local wardrobe after obtaining a concise, clothing-relevant weather assessment through a weather subagent.
---

# Clothing recommendation

Act as the supervisor for a clothing recommendation.

- Read `wardrobe.md` before selecting items.
- If the request depends on current or forecast weather, delegate only the weather task to a subagent. Give it the location and time period from the request. Ask it to use available weather tools and return a concise assessment: conditions, temperature range, precipitation/wind, and clothing implications. First try to use the `get_meteoblue_forecast` MCP tool provided by `tools/weather-auth-mcp.mjs` which, based on experience, is more accurate. Then try to use the `get_weather_forecast` MCP tool provided by `tools/weather-mcp.mjs`.
- Do not delegate wardrobe selection or the final answer. Combine the returned assessment with the listed wardrobe, choosing only items that exist in `wardrobe.md`.
- State any missing location or time assumption. If weather is not needed, make the recommendation directly from the wardrobe.

Return a short, practical outfit recommendation and, when used, a one-line weather rationale.
