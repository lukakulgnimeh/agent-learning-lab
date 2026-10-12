# Part A - Which architectural assumptions does Claude Code have?

##  Goal

Moving from n8n and Codex to Claude Code, we construct the same two-agent system as before, i.e. providing a clothing suggestion for the day based on the weather and contents of a wardrobe. 

Examining the behavior regarding the above example problem, we want to understand the basic model, developer control, agent autonomy, transparency, tooling, subagents and extensibility to understand suitable problem types for Claude Code.

## Project Structure

The project is structured as follows, Claude Code having access to the folder `weather-multi-agent/`. While this `README.md` focusses on a compact summary of the learnings about Claude Code's architectural model, the `reflection.md` file contains a more in-depth analysis.

- `README.md`
- `reflection.md`
- `prompt-history.md`
- `weather-multi-agent/`
    - `CLAUDE.md` *(supervisor role, delegation rule, pointer to the wardrobe)*
    - `data/`
        - `wardrobe.md` *(given list of pieces of clothing)*
    - `.claude/`
        - `settings.json`
        - `agents/`
            - `weather-specialist.md` *(custom subagent, fixed output contract)*
        - `skills/`
            - `weather-to-clothing/`
                - `SKILL.md` *(interpretation rules)*
        
This reflects the state after the first build and the two subsequent design discussions (negotiation, custom tool exposure). Neither discussion was implemented, so there is no `mcp/open-meteo-server.js`, `.mcp.json`, or any auth-related file here - see **Extensibility** below for why.

## Summary of the Interaction with Claude Code and Decisions

The project's planning began outside Claude Code entirely, exploring how agentic projects could be realized with Anthropic's Claude. Indeed, that lead to Claude Code as the right thing for observing an already-built agent harness instead of using Claude's LLM via raw-API for a custom build harness. It was planned which role is taken by the `CLAUDE.md` file and how subagents relate to skills.

Before any Claude Code work, a separate setup phase covered environment mechanics: installing the native Claude Code binary on Windows, fixing a missing-PATH warning, working out which surfaces (Desktop app vs. terminal vs. VS Code extension) actually are able to use an `ANTHROPIC_API_KEY`, provisioning a Claude Console API key independent of any subscription, and separating Claude Code's local session transcripts from claude.ai's own memory system.

Inside Claude Code, the interaction had three stages:

1. **Scaffolding.** After extensive context for the project was presented to Claude Code, the agent proposed and created the always auto-loaded `CLAUDE.md`, custom subagent `.claude/agents/weather-specialist.md` restricted to `WebSearch`/`WebFetch`, and interpretation rules `.claude/skills/weather-to-clothing/SKILL.md`. A single-delegation model (supervisor decides once, delegates once, specialist behaves like a pure function) was chosen deliberately over a negotiating one.
2. **Verification.** A live test request against the setup succeeded: testing a request without a location leads to a follow-up question, including an activity like visiting the german parliament extends the answer with specific suggestions. Specifically, the agent even pointed out that you have to make sure to be registered in advance.
3. **Exploration without implementation.** Two follow-up discussions were conducted explicitly as design exercises, not builds:  
(a) What *negotiation between supervisor and specialist* would structurally require: an explicit `NEEDS:` field in the specialist's output contract, a bounded round protocol added to `CLAUDE.md` and an explicit rule for what wardrobe information is allowed to be passed downward. It was judged not worth the added non-determinism for this iteration.  
(b) How a *custom external API* could be implemented as a tool, narrowing six candidate mechanisms (MCP, Bash+curl, WebFetch, a documenting skill, hooks, plugins) down to the first three as real contenders, and then to MCP alone once authentication entered was suggested for the future, since it is the only mechanism that keeps a secret out of the model's context entirely.

The project was then intentionally closed at the design stage: implementing the MCP server itself was judged to add no further architectural insight beyond what had already been reasoned through, since the same exercise had already been carried out in Codex.


## Core Architectural Findings

1. **Basic Model.** Claude Code is an agentic reasoning loop (one model, one turn at a time) wrapped in a repository convention: a project folder of files (`CLAUDE.md`, `.claude/agents/`, `.claude/skills/`, `.claude/settings.json`) that the loop reads and is shaped by, rather than a coded pipeline the loop executes. Control flow is emergent from the model's own reasoning, not encoded anywhere as an explicit sequence.

2. **Developer Control.** What's explicit: the existence and description of subagents and skills, a subagent's hard tool allowlist, and permission rules in `settings.json`. What's implicit: whether and when the supervisor actually delegates, how a subagent phrases its findings, how thoroughly it searches - all inferred from natural-language descriptions rather than coded branches. Developer control here is structural/permission-level, not behavioral.

3. **Agent Role/Autonomy.** The supervisor decides on its own whether to delegate by matching the request against each subagent's `description`. A subagent decides on its own how to accomplish its assigned task within its tool allowlist. But a subagent cannot initiate contact upward since it runs to completion and returns exactly one report. Autonomy is high in *how*, zero in *when to speak*.

4. **Control/Determinism.** Genuinely deterministic gates are narrow: the `tools:` allowlist and `settings.json`'s permission rules (approval vs. silent execution). Everything else regarding delegation decisions, search thoroughness and phrasing can plausibly vary run to run for identical input framing. Determinism, where it's needed, has to be manufactured through literal imperative wording, not assumed from configuration.

5. **Transparency/Observability/Debugging.** Session transcripts persist locally per project (`~/.claude/projects/...`), one `.jsonl` file per session enabling `--continue`/`--resume`, though long sessions are subject to compaction that can summarize away detail. Within a session, the supervisor's own tool calls and their outputs are visible. Subagent internals are not surfaced upward. Only the final report crosses into the supervisor's context, which probably is a context-isolation feature.

6. **State/Context.** No automatic memory across sessions. A resumed session reloads `CLAUDE.md` fresh and reattaches the prior transcript while a genuinely fresh session attaches nothing at all, only files on disk. Anything meant to persist has to be deliberately written into a file, there is no equivalent of an automatic project memory layer. Token cost scales with the full accumulated transcript on every turn, so continuing a long session gets more expensive over time.

7. **Tools.** A small built-in set (`WebSearch`, `WebFetch`, `Bash`, etc.) needs no setup. Genuinely new custom tools (a name, a schema, dedicated backend code) exist only via MCP servers. Everything else (Bash+curl, a custom `WebFetch` URL, a skill describing an API) is more like a custom invocation of an existing built-in tool, not a new one. MCP is the only mechanism that can keep a secret out of the model's context entirely, since the key lives in the spawned server process's environment, not in a tool argument.

8. **Delegation/Subagents.** There are built-in generic subagents (no config but can't be pre-wired to a specific skill) and custom subagents (`.claude/agents/*.md`, each with a routing `description`, a body/output contract, and an explicit `tools:` allowlist). Skills are a separate and complementary: not an isolated context, just optional instructions loaded into whichever agent invokes them. Delegation is strictly parent-driven. A subagent instance can be reopened for a genuine multi-turn exchange, but it can never spontaneously interrupt since any negotiation has to be manually engineered into the prompts.

9. **Extensibility.** Adding a new role or capability at the prompt level (a new skill, a new subagent) is just adding a markdown file, thus cheap and fast. Extending the actual tool surface beyond the built-ins requires MCP, which introduces a real setup cost: a spawned process and potentially a runtime/dependency footprint (though here, a dependency-free single-file server needs nothing beyond an already-present language runtime). Plugins were identified as packaging around MCP servers, skills and commands.

10. **Suitable Problem Types and Typical Use Cases.** Best fit: tasks where delegating *how*-decisions to model judgment is acceptable and the developer mainly wants to constrain roles, permissions and context boundaries like coding-adjacent agentic work (its native habitat), exploratory tasks with tool delegation, and small architectural prototypes like this one, where the point is understanding roles rather than production guarantees. Weaker fit, without extra engineering: tasks needing guaranteed exact control flow, mid-task renegotiation between agents, or strict run-to-run reproducibility. These require deliberately manufacturing determinism inside the framework.

## Conclusion

Project architecture for Claude Code lives almost entirely in text (markdown and JSON configuration files read by a single, session-scoped reasoning loop) rather than in code. Delegation and tool access are the only genuinely hard-enforced boundaries. Everything else, from when to delegate to how a subagent phrases its report, is left to the model's judgment over natural-language descriptions inside the given agentic harness. That trade-off is the defining characteristic: extremely cheap to reshape through editing a file, but any guarantee stronger than "it will probably do this" (exact sequencing, negotiation, secrecy) has to be deliberately engineered around the pre-built Claude Code agentic harness.
