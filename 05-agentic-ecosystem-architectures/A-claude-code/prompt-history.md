# Project Instructions

This project explores how an agentic clothing recommendation system can be implemented with Claude. It will happen in this currently empty folder weather-multi-Agent.

The system should consist conceptually of:

1. A supervisor responsible for the final clothing recommendation.
2. A weather specialist responsible for obtaining and interpreting weather information.

The supervisor should:
- understand the user's wardrobe (will be provided),
- request weather information when necessary,
- combine the weather assessment with the available wardrobe,
- produce the final recommendation.

The weather specialist should:
- obtain current weather information (first, for example through the simplest method like web search),
- interpret it in terms relevant to clothing,
- return a concise assessment to the supervisor.

Keep the implementation deliberately simple and do not implement anything yet.
The purpose of this project is to understand Claude architecture, agent delegation, skills and tool usage rather than to build a production-ready system.

First, I want you to explain how such a multi agent project can be realized with Claude Code and have several questions:
1. How would be the structure of such a project in Claude Code? I think there is always a CLAUDE.md file that contains all context of the project and will be updated with the progress of the project.
2. I know that there are default and custom subagents. I suppose one way to realize the project would be for the supervisor to call a default subagent who for example has access to a predefined skill for the weather research. Or to configure a custom subagent who has parts of this skill in his description and other configurations, I suppose. Am I wrong and there are other more common ways in Claude Code?




---





Folder confirmed empty, and you have no user-level agents/skills yet, so we start from a clean slate. Nothing implemented — here's the architecture explanation.

  1. Project structure

  Claude Code reads a handful of conventional files from your project root. A minimal version of your system would look like:

  weather-multi-agent/
  ├── CLAUDE.md                          # always-loaded project context
  ├── data/
  │   └── wardrobe.md                    # the wardrobe (plain data, read on demand)
  └── .claude/
      ├── agents/
      │   └── weather-specialist.md      # custom subagent definition
      ├── skills/
      │   └── weather-to-clothing/
      │       └── SKILL.md               # domain knowledge, loaded on demand
      ├── commands/
      │   └── outfit.md                  # optional: /outfit slash command
      └── settings.json                  # permissions (e.g. allow WebSearch), hooks

  On CLAUDE.md specifically: yes, it exists by convention and is auto-loaded into context at session start — but it's worth being precise about its role, because it shapes the whole design. It is not
  a project log or a progress tracker. It's the system prompt for the main session, and everything in it costs tokens on every single turn. So it should hold: what the project is, the supervisor's
  role and decision rules, where the wardrobe lives, when to delegate. Not: the full wardrobe inventory, weather-code lookup tables, or a changelog. Those belong in files that get read only when
  needed. (/init generates a first draft of this file from the codebase.)

  The key structural insight: there is no supervisor.md. The main Claude Code session is the supervisor. CLAUDE.md configures it, you talk to it directly, and it delegates downward. Making the
  supervisor its own subagent would add a hop with no benefit — and subagents don't get the Agent tool by default, so a supervisor-as-subagent often can't delegate further anyway.

  2. Subagents vs. skills — the distinction you're circling

  You're not wrong that both are viable, but the mental model needs one correction: a subagent's description field is not where knowledge goes. It's routing metadata — the supervisor reads only the
  name + description of each available subagent to decide whether to delegate. The knowledge goes in the body (the subagent's system prompt) or in a skill it loads.

  The cleaner way to separate them:

  ┌──────────────┬──────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────┐
  │              │                  Subagent (.claude/agents/x.md)                  │         Skill (.claude/skills/x/SKILL.md)         │
  ├──────────────┼──────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ Gives you    │ A separate context window, its own tool allowlist, its own model │ Instructions + optional scripts/reference files   │
  ├──────────────┼──────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ Answers      │ Who does the work, in isolation                                  │ How the work is done                              │
  ├──────────────┼──────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ Context cost │ Returns only a final report to the parent                        │ Description always loaded; body only when invoked │
  ├──────────────┼──────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
  │ Runs         │ As a separate agent loop                                         │ Inside whoever invokes it                         │
  └──────────────┴──────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────┘

  Why a subagent genuinely fits your weather specialist: your spec says it should "return a concise assessment to the supervisor." That's exactly the subagent contract — the specialist can burn 8 web
  searches and 40k tokens of raw HTML, and the supervisor's context receives only the final paragraph. A skill alone cannot do that; skill instructions execute in the caller's own context, so all
  that search noise would land in the supervisor's window and compete with the wardrobe reasoning.

  Why you'd still want a skill: the mapping from weather to clothing ("felt temperature 5–10 °C with wind > 20 km/h → windproof outer layer") is durable domain knowledge that may grow into tables and
  edge cases. Putting that in a skill keeps it out of context until a weather question is actually live, and makes it independently editable and reusable.

  So the combination is the most idiomatic answer to your question:

  - weather-specialist subagent — tools restricted to WebSearch, WebFetch, description written so the supervisor reliably routes weather questions to it, body defining its output contract (a fixed
    short format: felt temperature, precipitation, wind, notable changes during the day).
  - weather-to-clothing skill — the interpretation rules the specialist applies.

  Other approaches, so you know the full space

  1. Single agent + skill, no delegation at all. CLAUDE.md gives the supervisor role, one skill covers weather lookup and interpretation. Genuinely the simplest thing that works, and worth
     considering as step one precisely because it makes the cost of delegation visible when you later add it. You lose context isolation and per-agent tool restriction.
  2. A built-in subagent (general-purpose) with instructions in the prompt. Works, and needs no config files. But you cannot pre-wire a skill to a built-in subagent — you'd re-describe the task in
     the prompt every time, so the specialist's behavior lives in your prompt rather than in the repo. Fine for a throwaway test, bad as the architecture.
  3. An MCP server for weather. Replaces web search with a real typed weather API (Open-Meteo needs no API key). This is the natural second iteration — swapping the data source without touching the
     delegation structure, which is a good demonstration that the architecture is sound.
  4. Slash command as the entry point (/outfit Munich). Not an agent layer — just a saved prompt that kicks off the supervisor. Cheap and makes the demo repeatable.
  5. Claude Agent SDK (Python/TypeScript) if you eventually want the supervisor to be a program you control rather than an interactive session. Same concepts — subagents, skills, tools — expressed in
     code. Out of scope for understanding the harness, but it's where this design would go if it became an application.

  One thing worth deciding before any implementation

  The interesting architectural question in your spec is hidden in "request weather information when necessary." Two readings, and they produce different systems:

  - Supervisor decides, then delegates once, passing location and time. The specialist is a pure function. Simple, predictable, one round trip.
  - Supervisor and specialist negotiate — the specialist asks back, or the supervisor re-queries after seeing the wardrobe. More realistic, but Claude Code subagents can't ask the parent questions
    mid-run; they run to completion and report. You'd emulate it with a second delegation.

  I'd build the first and note where the second would go. Which reading did you have in mind — and do you want the wardrobe as free-form markdown (more natural for you to write, and the more
  interesting test of the supervisor's reasoning) or structured JSON with explicit warmth/waterproofness attributes (easier for the model, less of a test)?


---

Thank you for the general elaboration and also the explanation of the full space (an MCP server would be the next iteration I am interested in, but let's start with the following basic architecture). The suggested structure is exactly as I expected and I have added the wardrobe.md file. It contains a free-form markdown list with only small attributes like t-shirt or jeans, but no structured JSON. Do not modify it.
Go ahead and add the rest of the structure in this project folder. Consider the following:
1. To start, I would like to have the first architectural version, as suggested: a supervisor who decides, then deligates once, passing location and time. The specialist is like a tool, the supervisor has the capability to call it as it is guided by his given environment (the CLAUDE.md file). Do not implement the version where the supervisor and specialist are able to negotiate (I will keep that in mind for a possible future experiment).
2. It makes absolute sense that the Claude Code session is the supervisor. Based on our discussion, create the CLAUDE.md file covering everything you suggested.
3. Furthermore, create the .claude/ folder and therein:
	- Implement agents/weather-specialist.md as the custom weather-specialist subagent. As suggested, include tools restricted to WebSearch, WebFetch, description written so the supervisor reliably routes weather questions to it, body defining its output contract (a fixed short format). As intended, we want to start simple. Just as a side-note: I did not know that a built-in subagent can not access skills, such that indeed, a custom subagent suits better.
	- Implement skills/weather-to-cloting/SKILL.md as a concise first version for the interpretation rules the specialist applies.
	- Do not implement the optional command macro since testing with natural language first ("What should I wear in Berlin today?", but also edge cases like "Is it a good day for a bike ride in Munich, and what should I wear?") is the more informative test of whether the CLAUDE.md and subagent description are actually doing their job.
	- If needed, implement other configurational structure like the settings.json file as well.
This project is intended to understand the architecture. Keep the implementation minimal, explicit and transparent.

After implementation, summarize:
1. Which structure has been implemented.
2. Which files were created.
3. If present, which parts had to be added for which reasons.
4. What can be accessed by the supervisor (Claude Code session) and what can be accessed by the specialist.
5. The expected information flow.
Do not perform any tests yet.


---


Done. data/wardrobe.md untouched.

1. Structure implemented

Supervisor-decides-then-delegates-once, exactly as specified:

weather-multi-agent/
├── CLAUDE.md                                   # supervisor instructions
├── data/
│   └── wardrobe.md                             # yours, unmodified
└── .claude/
    ├── agents/
    │   └── weather-specialist.md               # custom subagent
    ├── skills/
    │   └── weather-to-clothing/SKILL.md        # interpretation rules
    └── settings.json                           # permissions

One delegation per request, no back-channel. The specialist behaves as a function: location + absolute time window in, fixed-format assessment out.

2. Files created

┌─────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                    File                     │                                                                     Role                                                                      │
├─────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ CLAUDE.md                                   │ The supervisor's system prompt: architecture, role split, wardrobe handling, delegation rules, what to pass, output format, out-of-scope list │
├─────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ .claude/agents/weather-specialist.md        │ Subagent: routing description, tools: WebSearch, WebFetch, Skill, fixed output contract, boundaries                                           │
├─────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ .claude/skills/weather-to-clothing/SKILL.md │ Temperature bands, wind, precipitation, sun, intra-day change, conflict priority                                                              │
├─────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ .claude/settings.json                       │ Pre-approves the tools this project needs; denies writes to the wardrobe                                                                      │
└─────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

I used weather-to-clothing as the skill folder name — your message had weather-to-cloting, and the folder name is the skill's identity, so a typo there would be load-bearing.

3. Parts added beyond the spec, and why

- Skill in the subagent's tool allowlist. You asked for tools restricted to WebSearch, WebFetch. Taken literally, that would have made the skill unreachable — tools: is a strict allowlist, and a skill is invoked through the Skill tool. So it's three tools, not two. Still no Read, Write, Edit, or Bash, which is what the restriction was actually for: the specialist structurally cannot reach the wardrobe. (If the skill later grows reference files alongside SKILL.md, it will need Read too.)
- A one-retry exception on outright failure. Strict one-shot delegation means a failed web search produces a useless answer with no recovery. CLAUDE.md permits a single unchanged retry when the specialist returns no data at all, and separates that from negotiation explicitly. Remove the clause if you want the failure mode visible during testing.
- FAILED: line in the output contract. Gives the supervisor an unambiguous signal for that path, instead of having to infer failure from a vague report.
- A wardrobe-gap rule. Your wardrobe has tops and pants but no rain shell, coat, or shoes. Without an explicit instruction, the supervisor's strong pull is to invent a plausible jacket. CLAUDE.md now states that naming the gap is a correct answer.
- settings.json deny rules. Your "do not modify it" is enforced by the harness rather than only by a prompt instruction — a prompt can be talked out of; a deny rule can't.
- Conflict priority section in the skill. Rain/wind/temperature rules routinely disagree (mild but wet). Without an ordering the specialist's output gets mushy, which defeats the fixed-format contract.

4. Access

Supervisor (this session, on restart): all normal tools — Read on data/wardrobe.md, the Agent tool to spawn the specialist, plus web tools it is instructed not to use for weather. Sees the conversation, the wardrobe, and the specialist's returned text. Cannot see the specialist's searches or raw pages.

Specialist: WebSearch, WebFetch, Skill — nothing else. No filesystem, no wardrobe, no conversation history, no ability to spawn further agents. Its context is only the prompt the supervisor writes plus what it fetches. It returns text and nothing else.

The asymmetry is the architecture: weather knowledge can't leak into wardrobe reasoning, and vice versa.

5. Expected information flow

1. User asks in natural language ("Is it a good day for a bike ride in Munich, and what should I wear?").
2. Supervisor reads CLAUDE.md, recognises an outdoor-conditions dependency, resolves location (Munich) and time window (absolute date + hours), and notes the activity (cycling).
3. Supervisor spawns weather-specialist once with those three items.
4. Specialist searches, prefers feels-like temperature and a range, invokes weather-to-clothing, applies the bands plus the cycling wind adjustment.
5. Specialist returns the ~9-line contract with abstract REQUIREMENTS and a confidence line. Its search transcript is discarded.
6. Supervisor reads data/wardrobe.md, matches requirements to real items, and answers both halves — bike-ride verdict and outfit — naming gaps if the conditions demand something absent.

One thing before you test: CLAUDE.md is loaded at session start, so this session isn't running under it. Start a fresh session in this folder for the routing test to be meaningful. The bike-ride prompt is the interesting one — it tests whether the subagent description routes on an activity question and whether the supervisor answers the non-clothing half.

---


(restarted)




What should I wear today?

---


I need a location before I can check the weather — where are you today? (City, and country if it's ambiguous.)

Once I have that, I'll get conditions for 2026-09-22 and match them against your wardrobe.

---


I am in Berlin and I want to visit the Bundestag including the dome of the Reichstagsgebäude.

---


(((● weather-specialist(Berlin weather for today)
Backgrounded agent (↓ to manage · ctrl+o to expand)
Prompt:
  Location: Berlin, Germany.

  Time window: 2026-09-22, 09:00–20:00 local time (today).

  Activity: sightseeing on foot in the city centre, including a visit to the Reichstag building and its glass dome. This involves queuing outdoors at street level, walking between sights, and time on the Reichstag roof terrace and inside the dome — the dome has an open oculus at the top, so the rooftop portion is effectively outdoors and exposed to wind and rain. Wind and precipitation at rooftop level matter, as does comfort while standing still outdoors for stretches rather than moving continuously.

  Please return your fixed-format clothing-relevant assessment for that location and window.


Read 1 file

Checking Berlin conditions for today now — I've got your wardrobe in hand.

✻ Crunched for 20s · done 3:36 PM

● Agent "Berlin weather for today" finished · 1m 0s)))




Conditions (Berlin Mitte, today 09:00–20:00) — Dry and sunny all day, feels like 10 °C at 09:00 rising to 16–17 °C mid-afternoon and easing to 15 °C by 20:00; light but persistent N/NW wind of 10–17 km/h, stronger and more constant on the Reichstag roof terrace and through the dome's open oculus. Three forecast sources agree, so confidence is high.

Recommendation

- Base: dark blue solid t-shirt
- Mid: blue fleece — your best insulating layer, and it packs down when the afternoon warms up
- Outer: black sweatshirt jacket, closed for the morning queue and the roof terrace
- Bottom: blue straight-leg jeans

Bring a bag you can stuff the fleece into. The day swings about 7 °C, so you'll want the fleece and jacket for the 09:00–12:00 stretch and again after 18:00, and just the t-shirt (plus jacket if the roof feels breezy) in between.

Gaps

- No wind-resistant outer layer. The sweatshirt jacket insulates but doesn't block wind, which is exactly the constraint on the exposed roof and in the dome draught. A light windbreaker or softshell would make that part of the visit noticeably more comfortable — worth borrowing or buying if you have one available.
- No hat or cap. Clear skies, many hours outdoors, and the dome's reflective glass mean sun on the head and face for most of the day; the wardrobe has nothing for that.
- No shoes in the wardrobe at all, so I can't recommend a pair — anything comfortable for a lot of standing and walking on hard surfaces will do, and dry conditions mean waterproofing isn't needed.

On the visit itself: weather-wise it's a good day for the dome — dry, sunny, clear skies means the long views over the city will actually be there, and no rain on the open oculus. The only real discomfort is wind while you're standing still. One non-weather thing worth checking: the Reichstag dome requires registration in advance with ID, so confirm you have a slot booked before heading over.



---





This is about the project's architecture. I have done a test request and it has worked great. Now I want to go to the next iteration. But before that, you suggested that it is possible to extend the current setup such that supervisor and specialist negotiate: "the specialist asks back, or the supervisor re-queries after seeing the wardrobe. This would be more realistic, but Claude Code subagents can't ask the parent questions mid-run; they run to completion and report. You'd emulate it with a second delegation". I do not want to do that scenario but, for learning purposes, please indicate what would have to be changed in which way. Do not implement anything, just briefly explain the structural change needed to make it work in Claude Code.

After this explanation, continue by elaborating on the following iteration. I now want to understand how a custom external API can be provided as a tool to a Claude Code agent or delegated subagent. Do not implementing anything yet. What are the ways Claude Code currently lets an agent call a custom external function or API as a tool, and which is simplest for a minimal case like an Open-Meteo weather lookup? For whichever mechanism you propose, state explicitly which existing files (if any) — including weather-specialist.md's tool restrictions and .claude/settings.json permissions — would need to change for the subagent specifically to gain access to it. What does setting this up require beyond editing project files — e.g. a separate running process, an additional runtime/interpreter, new dependencies — versus something that works with only Markdown/config files already supported by Claude Code? Furthermore, I want to understand:
1. where the tool is defined,
2. where the code that actually performs the API request lives,
3. how the agent discovers the tool,
4. how the agent decides to call it,
5. how the API result is returned to the agent,
6. whether a delegated subagent can use the custom tool.
Do not implement anything yet. First explain the proposed architecture.



---




I'll look at the current setup first so the explanation is concrete about your actual files.

  Searched for 1 pattern

● Skill(claude-api)
Successfully loaded skill · 1 tool allowed

  Read 3 files

Read all four files. Two answers below; nothing implemented.

---

Part 1 — What negotiation would actually require

The real constraint is narrower than "subagents can't talk back"

My earlier phrasing was a bit loose. The accurate version:

- A subagent cannot initiate anything. It has no channel to interrupt, no way to raise a question mid-run and wait. It runs to completion and emits one text blob.
- But the parent can re-open the same subagent. SendMessage to an agent you already spawned continues it with its context intact — it still remembers the searches it did and the assessment it produced. That is a genuine second turn, not a cold restart.

So negotiation in Claude Code is possible, but it is strictly parent-driven turn-taking: the supervisor always speaks, the specialist always answers. The "specialist asks back" half has to be faked.

The four structural changes

1. The question becomes a field in the output contract, not a control-flow event.

The specialist can't ask — so it has to report that it wants to ask. You'd add a line to the output contract in weather-specialist.md:

NEEDS: <what wardrobe-side fact would change this assessment, or "nothing">

e.g. NEEDS: whether a wind-resistant outer layer is available — the 30 km/h gusts dominate only if it is not. That turns a question into data the supervisor can pattern-match on. This is the core trick: conversation state is encoded in the text, because there is no conversation.

2. CLAUDE.md loses "Delegation is one-shot" and gains a bounded protocol.

Replacing it with a loop needs three things spelled out, or two Claudes will happily ping-pong forever:

- a hard round cap (round 1 + at most one follow-up),
- a termination rule — what counts as settled (NEEDS: nothing, or the cap is hit),
- a fallback — what the supervisor does when the budget runs out with the question unanswered (answer anyway, state the limitation).

3. You must define exactly what leaks downward — or the role split dies.

The whole value of round 2 is the supervisor saying "there is no waterproof outer layer and no gloves; re-rank under that constraint." That is wardrobe information crossing into the specialist. If you don't constrain it, the cheapest thing for the supervisor to do is paste the wardrobe, and then you have one agent with extra steps.

So the protocol would have to say: pass derived constraints only ("no waterproof outer layer available"), never items, never the file. This is the part that actually needs design thought; the rest is plumbing.

4. The second turn needs its own, shorter output format.

Round 2 shouldn't re-emit all ten contract lines. You'd add a REVISED: shape — the changed requirement plus one line of reasoning.

What that costs you

Nothing structural in the filesystem — no new files, no new tools. Negotiation is a prompt protocol between CLAUDE.md and weather-specialist.md, not a Claude Code feature you switch on. What it costs is determinism: the supervisor now has a branch ("did it say NEEDS?"), and branches in prose are where these setups get flaky. Your instinct to skip it is sound for this iteration.

(Aside: if SendMessage weren't available, the fallback is a second fresh Agent call with the round-1 output hand-pasted into the prompt. That's stateless — the specialist re-searches from scratch, and you pay for it. Strictly worse. Prefer continuing the existing agent.)

---

Part 2 — Custom external APIs as tools

The mechanisms Claude Code actually offers

┌─────┬──────────────────────────────────┬────────────────────────────────────────────────────────────────┬──────────────────────────┐
│  #  │            Mechanism             │                       Real custom tool?                        │ Needs a process/runtime? │
├─────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────┼──────────────────────────┤
│ 1   │ MCP server (stdio, HTTP, or SSE) │ Yes — the only one where you define a tool                     │ Yes                      │
├─────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────┼──────────────────────────┤
│ 2   │ Bash + curl/script               │ No — built-in tool, custom invocation                          │ No (needs curl on PATH)  │
├─────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────┼──────────────────────────┤
│ 3   │ WebFetch at the API URL          │ No — built-in tool, custom URL                                 │ No                       │
├─────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────┼──────────────────────────┤
│ 4   │ Skill documenting the API        │ No — it's the description, not the tool                        │ No                       │
├─────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────┼──────────────────────────┤
│ 5   │ Hooks                            │ No — fires on lifecycle events, model can't choose to call one │ Yes                      │
├─────┼──────────────────────────────────┼────────────────────────────────────────────────────────────────┼──────────────────────────┤
│ 6   │ Plugins                          │ Packaging for #1, not a separate mechanism                     │ Yes                      │
└─────┴──────────────────────────────────┴────────────────────────────────────────────────────────────────┴──────────────────────────┘

Hooks are worth ruling out explicitly because they look adjacent: a PreToolUse hook can call an external program, but it runs because the harness fired it, not because the model decided it needed weather data. Wrong shape entirely.

That leaves a three-rung ladder. Open-Meteo is unusually friendly — public, no API key, GET-only JSON — so all three work.

---

Option A — WebFetch + a skill (simplest; zero new machinery)

Open-Meteo is two GET requests: geocoding (geocoding-api.open-meteo.com/v1/search?name=Berlin) → lat/lon → forecast (api.open-meteo.com/v1/forecast?latitude=…&hourly=apparent_temperature,precipitation_probability,wind_speed_10m).

WebFetch can hit both. The specialist already has WebFetch in its tools: line, and settings.json already allows WebFetch.

Files that change:
- New .claude/skills/open-meteo/SKILL.md — the endpoints, the parameter names, which hourly= fields map to the weather-to-clothing bands, and the two-step geocode-then-forecast sequence.
- .claude/agents/weather-specialist.md — body only. Steps 1–2 currently say "use WebSearch"; they'd say "call Open-Meteo per the skill; fall back to WebSearch only if geocoding fails." The tools: line needs no change (WebFetch and Skill are both already there).
- .claude/settings.json — no change required. Optionally tighten "WebFetch" to "WebFetch(domain:api.open-meteo.com)", but that would break the existing WebSearch-result fallback.

Beyond project files: nothing. Pure Markdown.

The catch, and it's a real one: WebFetch is built for web pages. It retrieves the URL and passes the content through a model to answer your prompt about it — so what lands in the transcript is a model's reading of the JSON, not the JSON. For a flat numeric payload that usually survives fine, but it is model-mediated and non-deterministic, which is exactly the property you don't want in the one part of the pipeline that's supposed to be hard data. It also can't set headers or do auth, so it wouldn't generalize to a keyed API.

---

Option B — Bash + curl (deterministic, no new runtime)

curl https://api.open-meteo.com/v1/forecast?... — raw JSON lands in the transcript as tool output, unmediated.

Files that change:
- .claude/agents/weather-specialist.md — tools: must become WebSearch, WebFetch, Skill, Bash. This is non-negotiable and is the single most important mechanical fact in this whole answer: a subagent's tools: frontmatter is a hard allowlist. A tool absent from that line is invisible to the subagent no matter what settings.json says. Permissions and the tool list are two independent gates and you need both.
- .claude/settings.json — add something like "Bash(curl https://api.open-meteo.com/*)" to allow, so it doesn't prompt every run.
- Optionally the same new SKILL.md as Option A, holding the URL recipe.

Beyond project files: curl on PATH. Windows 11 ships curl.exe, and the Bash tool here is Git Bash, so it's there. No new runtime, no dependencies.

The catch: you are handing the subagent a general shell. The permission rule narrows what's allowed without a prompt, but Bash in the tool list is a categorically larger capability than this project has granted anything so far. For a deliberately minimal experiment that's a meaningful step down in transparency.

---

Option C — MCP stdio server (the actual "custom tool", and the one that teaches you something)

This is the only rung where you define a tool: a name, a description, and a JSON input schema, with a function behind it.

Files that change:
- New .mcp.json at the project root — server name, transport, launch command. Project-scoped and checked in, so it travels with the repo.
- New mcp/open-meteo-server.js (or .py) — the server: declares one tool, e.g. get_forecast(location, start, end), and implements it.
- New package.json + node_modules/ (@modelcontextprotocol/sdk), or a Python env with the mcp package.
- .claude/agents/weather-specialist.md — tools: must gain the fully-qualified name: WebSearch, WebFetch, Skill, mcp__open-meteo__get_forecast. Same hard-allowlist rule as Option B. The main session would see the tool automatically; the subagent will not, until it's on this line.
- .claude/settings.json — add "mcp__open-meteo__get_forecast" (or "mcp__open-meteo" for the whole server) to allow to suppress approval prompts.

Beyond project files: a Node or Python runtime, an installed dependency, and a process. One nuance worth being precise about: for stdio transport you do not start or babysit anything — Claude Code spawns the server as a child process per session and tears it down after. It's a separate process but not a separate thing you operate. (HTTP/SSE transport is the opposite: you host it.) There is also a one-time runtime step — Claude Code prompts for approval the first time it sees a project-scoped .mcp.json, since it's about to execute a command from the repo.

What you gain: the server can do the geocode→forecast chain internally and return only the six fields weather-to-clothing needs, pre-shaped. The model never sees raw Open-Meteo JSON, can't misparse it, and burns a fraction of the tokens. Failures become real errors instead of a model's guess about a 404 page.

What you lose: this is the first thing in the repo that isn't Markdown or JSON config. node_modules in a project whose stated purpose is minimality is a genuine cost.

---

Your six questions

┌────────────────┬───────────────────────────────────────────────────┬──────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┐
│                │                A: WebFetch + skill                │      B: Bash + curl      │                                         C: MCP server                                         │
├────────────────┼───────────────────────────────────────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Where the   │ Nowhere new — WebFetch is built in. Only the URL  │ Nowhere new — Bash is    │                                                                                               │
│ tool is        │ recipe is yours, in SKILL.md                      │ built in. Recipe in      │ In your server code, as a tools/list entry: name + description + JSON input schema            │
│ defined        │                                                   │ SKILL.md                 │                                                                                               │
├────────────────┼───────────────────────────────────────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. Where the   │ Inside Claude Code's own WebFetch implementation. │ In curl. The invocation  │                                                                                               │
│ request code   │  You write none                                   │ string is composed by    │ In your handler function, in your process. The model never composes the HTTP call             │
│ lives          │                                                   │ the model at call time   │                                                                                               │
├────────────────┼───────────────────────────────────────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. How the     │ Built-in, always in the system prompt (gated by   │                          │                                                                                               │
│ agent          │ tools:). The API is discovered via the skill's    │ Same                     │ Claude Code connects to each configured server at session start, calls tools/list, and        │
│ discovers it   │ description, which is always listed; the body     │                          │ injects the names/descriptions/schemas into the agent's tool list — then filtered by tools:   │
│                │ loads on invoke                                   │                          │                                                                                               │
├────────────────┼───────────────────────────────────────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. How it      │                                                   │                          │ Model judgment. Identical to A and B — this is the point most people expect to differ and it  │
│ decides to     │ Model judgment against description text           │ Model judgment           │ doesn't. A custom tool is still selected by natural-language match against its description.   │
│ call it        │                                                   │                          │ Determinism comes only from an imperative instruction in weather-specialist.md ("always call  │
│                │                                                   │                          │ get_forecast before answering")                                                               │
├────────────────┼───────────────────────────────────────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ 5. How the     │                                                   │ Raw stdout as            │                                                                                               │
│ result comes   │ URL content passed through a model, returned as   │ tool-result text,        │ MCP content blocks inserted verbatim as tool result. You control the shape — return five      │
│ back           │ text. Lossy, non-deterministic                    │ verbatim (truncated if   │ clean numbers instead of 400 lines of JSON                                                    │
│                │                                                   │ very large)              │                                                                                               │
├────────────────┼───────────────────────────────────────────────────┼──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
│ 6. Usable by a │                                                   │ Yes, only after adding   │                                                                                               │
│  delegated     │ Yes — already in tools:                           │ Bash to tools:           │ Yes, only after adding mcp__open-meteo__get_forecast to tools:                                │
│ subagent?      │                                                   │                          │                                                                                               │
└────────────────┴───────────────────────────────────────────────────┴──────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘

Two things that hold across all three, and are the answer to "what changes for the subagent specifically":

- tools: in the agent frontmatter is a hard allowlist, independent of settings.json. Omitting the line entirely means "inherit everything"; the moment you write it — as this project does — anything unlisted is invisible to that subagent. settings.json governs approval; tools: governs existence. Both gates, every time.
- The subagent's tool results stay in the subagent's context. The supervisor never sees the Open-Meteo payload — only the ten-line report. That property is preserved by all three options, so none of them threatens the role split.

---

What I'd suggest

Your two goals point different directions, so pick by which one you actually care about this iteration:

- If the goal is a better weather lookup → Option A. It is genuinely a config-and-Markdown change: one new SKILL.md, an edit to the specialist's body, and zero changes to tools: or settings.json. Accept that the JSON passes through a model on the way in.
- If the goal is to understand how custom tools work → Option C, and skip A and B. It's the only one with a real tool definition, a real schema, and a real execution path you own, and the tools: / settings.json interaction only becomes visible when the tool isn't a built-in. Option B teaches you almost nothing that A doesn't, and costs you a shell in the subagent.

Given CLAUDE.md says this project exists to understand Claude Code's architecture, C is the one that pays. It does break the repo's Markdown-only property — that's the price, and it's worth naming before you decide rather than after.

One thing to settle before either: whether the specialist keeps WebSearch as a fallback when geocoding misses, or Open-Meteo becomes the sole source and a failure becomes a clean FAILED: line. That changes what goes in the tools: list and how much of the current agent body survives.



---

I would like the current method WebSerach as a fallback still, such that, as you have explained, I think the current structure will be just extended by the new API call option through one of the options. For a future experiment it would be nice to now choose a structure that can be extended to an API scenario with authentication. Please elaborate on the different options:
1. wether an extension is possible, 
2. how the API key would be stored then (e.g. locally as environment variable in the operating system or somewhere in the project's folder),
3. who would see the API key (agent, subagent, only server etc.),
4. how portable the project would be.
Regarding the options specifically: I agree that handing the subagent a general shell is a major step. Also the (I assume locally installed) node_modules folder is a major step, but I think just a WebFetch and Skill or just pasting the API in the Skill defies the actual purpose of dividing up the architectural logic. More specific concerning the MCP-server: I assume that it requires Node.js to be installed and that Claude Code does not provide it in its own runtime environment or what do you mean by a new node_modules folder? Can the Python impletation of the MCP server avoid an external setup and what is the difference? Of course the setup of new MCP server related files would be fine as it has to be provided and be discovered/started somehow.





---




Good questions — several of these are checkable rather than theoretical, so let me look at what's actually on this machine before answering the runtime part.

  Ran 3 shell commands

Checked the machine — this changes one of my recommendations concretely:

┌─────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────┐
│   Runtime   │                                              Status                                               │
├─────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Node        │ v24.20.0, installed (C:\Program Files\nodejs)                                                     │
├─────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Python      │ Not installed — python resolves to the Microsoft Store alias stub ("Python wurde nicht gefunden") │
├─────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ uv / uvx    │ Not installed                                                                                     │
├─────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ curl        │ Present (Git Bash mingw64)                                                                        │
├─────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Claude Code │ Native binary, 237 MB at ~/.local/bin/claude                                                      │
└─────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────┘

So the Node-vs-Python question is already settled on this machine, and not in the direction you guessed.

---

First: your three direct questions

"Does Claude Code provide its own runtime?"

It has one and does not share it. Your install is the native binary (237 MB — that size is the bundled runtime). Claude Code can also be installed as an npm package, in which case it runs on your Node. Either way there is no supported way to borrow Claude Code's internal runtime for your own MCP server. An MCP server is an independent process that Claude Code spawns via a command — it needs a runtime that exists on your PATH.

You happen to have one: Node 24.20.0. That's a separate system install, unrelated to Claude Code.

"What did you mean by a new node_modules folder?"

I meant installing @modelcontextprotocol/sdk, the official MCP SDK, via npm install — which creates package.json, package-lock.json, and a node_modules/ tree in your project. That's the conventional way to write an MCP server.

It is not required, and I should have said so last time. MCP stdio transport is just newline-delimited JSON-RPC 2.0 over stdin/stdout. A server that handles initialize, notifications/initialized, tools/list, and tools/call is roughly 100 lines using nothing but Node built-ins — and Node 24 has global fetch, so even the HTTP call needs no dependency.

That means:

mcp/open-meteo.mjs     ← one file, committed, ~100 lines
.mcp.json              ← one file, committed

No package.json. No node_modules. No install step. The "major step" you were objecting to disappears.

The honest tradeoff: you hand-write the protocol envelope and pin a protocolVersion string, so if the spec revs, you maintain it. For a project whose stated purpose is understanding Claude Code's architecture, seeing the actual wire protocol is arguably the point rather than a cost.

"Can the Python implementation avoid external setup?"

Normally Python has the better story here — with uv, a single file carrying PEP 723 inline metadata (# /// script + dependencies = ["mcp"]) runs via uv run --script, with the environment cached outside your project. One file, no venv, no committed deps.

But on this machine, neither Python nor uv is installed, so Python means two new system-level installs before you write a line. Node means zero.

And the deciding point: the zero-dependency approach works identically in Node. Python's advantage was never the language — it was avoiding a dependency folder. Drop the SDK and that advantage evaporates. Node wins here purely because it's already present.

---

The four dimensions, per option

1. Can it extend to an authenticated API?

┌──────────────────────┬─────────────────────┐
│        Option        │ Extensible to auth? │
├──────────────────────┼─────────────────────┤
│ A — WebFetch + skill │ No. Decisive.       │
├──────────────────────┼─────────────────────┤
│ B — Bash + curl      │ Yes, technically    │
├──────────────────────┼─────────────────────┤
│ C — MCP server       │ Yes, and cleanly    │
└──────────────────────┴─────────────────────┘

Option A is a dead end for auth, and this is the most important thing in this answer given you're choosing a structure for the future auth experiment.

WebFetch cannot set request headers. No Authorization: Bearer, no X-API-Key. The only auth it could ever do is a key in the query string — which means the model has to write the key into the URL, which means the key must be in the model's context, which means it's in the transcript. There is no version of Option A that handles a secret acceptably. It is a fine way to call Open-Meteo today and a structural dead end the moment a key appears.

2. Where the key would be stored

┌────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬───────────────────────────────────┐
│ Option │                                                                      Storage                                                                      │           Committable?            │
├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────┤
│ A      │ Pasted in SKILL.md, or in the URL                                                                                                                 │ ❌ plaintext in repo — never do   │
│        │                                                                                                                                                   │ this                              │
├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────┤
│ B      │ OS user env var, or .claude/settings.local.json "env" block (gitignored) — not settings.json, which is checked in                                 │ ⚠️ secret must stay out of the    │
│        │                                                                                                                                                   │ repo                              │
├────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────┤
│ C      │ .mcp.json "env" block using variable indirection: "env": { "WEATHER_API_KEY": "${WEATHER_API_KEY}" } — the real value lives in the OS env var or  │ ✅ .mcp.json itself is safe to    │
│        │ settings.local.json                                                                                                                               │ commit                            │
└────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴───────────────────────────────────┘

Option C's ${VAR} expansion is the detail that matters: you commit the wiring (which variable the server needs, where it goes) while the value never enters the repository. A collaborator clones, sets one environment variable, and it works — the configuration is self-documenting without being a leak.

3. Who sees the key

This is where the options genuinely diverge, and it maps directly onto your architectural concern.

┌─────┬───────────────────────────┬─────────────┬────────────────────────────────────────────────┬─────────────────────────────┐
│     │ Supervisor (main session) │  Subagent   │           Model context / transcript           │ Process making the request  │
├─────┼───────────────────────────┼─────────────┼────────────────────────────────────────────────┼─────────────────────────────┤
│ A   │ sees it                   │ sees it     │ key is in context                              │ n/a                         │
├─────┼───────────────────────────┼─────────────┼────────────────────────────────────────────────┼─────────────────────────────┤
│ B   │ can read it               │ can read it │ not printed by default, but one echo $KEY away │ curl child process          │
├─────┼───────────────────────────┼─────────────┼────────────────────────────────────────────────┼─────────────────────────────┤
│ C   │ never                     │ never       │ never                                          │ only the MCP server process │
└─────┴───────────────────────────┴─────────────┴────────────────────────────────────────────────┴─────────────────────────────┘

For B, the nuance: if the model writes $WEATHER_API_KEY, the shell expands it and the literal value doesn't necessarily enter the transcript. But that's a convention, not a boundary. The model has a shell; the key is in that shell's environment; it is readable on request and leakable through error output that echoes a URL. Shell access is key access. And note what that means for your design: the key would be reachable by the subagent whose entire premise is "knows nothing except weather."

For C, the subagent calls get_forecast(location: "Berlin", start: ..., end: ...). The key is not a parameter. Claude Code injects it into the server process's environment at spawn; the server attaches the header. The model cannot see it, cannot print it, and cannot accidentally include it in the final answer.

That is the thing worth naming: in C, the separation stops being a prompt instruction and becomes a process boundary. Everywhere else in this project, the role split is maintained because the Markdown tells the agents to maintain it — which is exactly the right design for a prompting experiment, but it's honour-system. The MCP server is the first place where a boundary is enforced by the operating system instead of by good behaviour. Given that you objected to A and B on the grounds that they "defy the purpose of dividing up the architectural logic," that's the strongest argument for C.

4. Portability

┌────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────┐
│       Option       │                                              Requirements on a fresh machine                                              │                    Verdict                    │
├────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────┤
│ A                  │ Nothing                                                                                                                   │ Perfect — but no auth, so irrelevant to the   │
│                    │                                                                                                                           │ goal                                          │
├────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────┤
│ B                  │ curl (ubiquitous) + env var per machine. Model composes shell commands, so Git Bash vs. cmd vs. POSIX quoting differences │ Moderate                                      │
│                    │  can bite                                                                                                                 │                                               │
├────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────┤
│ C, SDK version     │ Node + npm install per clone; node_modules/ gitignored                                                                    │ Medium                                        │
├────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────┤
│ C, zero-dep        │ Node on PATH. That's it. One committed file; clone → set env var → run                                                    │ High, given Node                              │
│ version            │                                                                                                                           │                                               │
├────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────┤
│ C, Python          │ Python + uv, neither installed here                                                                                       │ Worst on this machine                         │
└────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────┘

---

What I'd propose

Option C, zero-dependency Node, single .mjs file — no package.json, no node_modules, no install step.

Files, with WebSearch retained as you asked:

┌────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                        File                        │                                                             Change                                                             │
├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ .mcp.json (new, committed)                         │ Declares the server: command: "node", args: ["mcp/open-meteo.mjs"], plus the env block (empty now; "${WEATHER_API_KEY}" later) │
├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ mcp/open-meteo.mjs (new, committed)                │ JSON-RPC envelope + geocode→forecast via built-in fetch. Returns only the fields weather-to-clothing needs                     │
├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ .claude/agents/weather-specialist.md               │ tools: becomes WebSearch, WebFetch, Skill, mcp__open-meteo__get_forecast. Body gains an explicit precedence rule               │
├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ .claude/settings.json                              │ Add "mcp__open-meteo__get_forecast" to allow                                                                                   │
├────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ (future) .claude/settings.local.json or OS env var │ The actual secret                                                                                                              │
└────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

The fallback you want becomes an explicit ladder in the specialist's body: try get_forecast → on failure fall back to WebSearch → WebFetch → only then emit FAILED:. Your existing SOURCE: contract line already surfaces which path ran, so you get a free observability signal for the experiment — you'll be able to see in every answer whether the API or the fallback produced the numbers. The weather-to-clothing skill is untouched; it still consumes numbers and emits requirements, indifferent to where the numbers came from.

Two things I'd verify at implementation time rather than promise now: whether the relative path in args resolves against the project root or needs an absolute path, and whether spawning bare node on Windows needs node.exe or a full path. Both are small and surface immediately on first run.

One decision left for you: whether get_forecast returns pre-digested fields (feels-like range, precip probability, wind km/h, sky, and the min/max delta the skill's §5 needs) or raw Open-Meteo JSON. Pre-digested makes the server a real translation layer and cuts the specialist's token load sharply; raw keeps all the interpretation in the model where you can watch it reason. For a project about seeing where logic lives, that choice is more interesting than it looks — and it's the one thing I'd want your call on before writing anything.








