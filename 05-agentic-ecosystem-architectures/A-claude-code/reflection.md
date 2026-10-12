# Reflection

### Learnings

- `CLAUDE.md` is not a project log but it is the supervisor's system prompt (configuration), loaded and paid for on every single turn. Thus, it should hold role/structure/delegation rules, never historical detail, changelogs, or full data (like the wardrobe contents).
- Claude Code offers built-in subagents and custom subagents. But since the built-in ones would require the role to be described each time when called by the supervisor (or when manually called), a custom subagent was chosen to be implemented.
- Delegation is routed by matching natural language against a subagent's `description:` field. There is no explicit dispatcher a developer writes, the supervisor decides for itself whether a request justifies delegation.
- A subagent's `tools:` frontmatter is a hard allowlist, entirely independent of `.claude/settings.json`: omitting the field means "inherit everything", writing it means "only what's listed, nothing else is visible to this subagent regardless of what settings.json allows."
- Skills and subagents solve different problems: a skill is *how* (instructions and optional scripts, loaded into whoever invokes it, description always loaded, body only on demand) while a subagent is *who* (a separate, isolated context with its own tool allowlist and returns only a final report). A subagent's `description` is routing metadata, not a place to put domain knowledge - that belongs in the body or in a skill it loads.
- Subagents cannot ask questions mid-run, they run to completion and report once. Anything resembling negotiation (a specialist asking the supervisor for missing information) has to be faked via an explicit protocol. That is, an output-contract field the specialist can set to signal "I have an open question," a bounded round cap, and an explicit rule for what information is allowed to cross the communication in future rounds.
- It is also possible to implement a slash command macro as the entry point (/outfit Berlin). It is a saved prompt which is filled in with e.g. the location, easily making the demo repeatable.
- Of the six mechanisms Claude Code offered for calling something external (MCP, Bash+curl, WebFetch, a documenting skill, hooks, plugins), only MCP defines a genuinely new, schema-backed tool with dedicated code. The others are either custom invocations of existing built-in tools (but with the bash a categorically larger capability than this project has granted anything so far) or, in the case of hooks, not model-initiated at all. `WebFetch` cannot set headers, which rules it out entirely once an API needs authentication (but is not ideal anyways as the fetch is a model summary of a website, hence non-deterministic).
- MCP is the only one of these mechanisms where a secret is enforced out of the model's context by the operating system rather than merely by convention since e.g. a shell-accessible key is technically readable by the agent that holds the shell, even if it's not printed by default. This would also defy the purpose of dividing up the architectural logic, especially the subagent whose entire premise is "knows nothing except weather".
- A dependency-free, single-file MCP server is a realistic minimal option which is also compatible with the existing structure as a fallback. The wire protocol is plain JSON-RPC over stdin/stdout using only language built-ins as in Codex, the Python-SDK/`node_modules` route is convenient but not required. Claude Code spawns the server as a child process per session and tears it down after.



- **Obtained skills:**
    - Structuring a Claude Code project using `CLAUDE.md`, including knowing what does not belong there.
    - Distinguishing a native-installer CLI tool's lifecycle from a conventional Windows GUI-installer app: PATH registration instead of a desktop shortcut, dotfiles in the user profile instead of `AppData`, silent background self-updates, no `Add/Remove Programs` entry by default.
    - Diagnosing and fixing a missing-PATH warning on Windows, via both the System Properties GUI and the PowerShell `[Environment]::SetEnvironmentVariable` equivalent.
    - Distinguishing which Claude surfaces (Desktop app, terminal CLI, VS Code extension) do or do not work with an `ANTHROPIC_API_KEY` environment variable, and why: an OAuth-exclusive credential path for the Desktop app versus a terminal-only path for the CLI.
    - Setting up Console/API billing independent of any claude.ai subscription.
    - Understanding Claude Code's session-persistence model in enough depth to reason about its cost: 
        - `--continue`/`--resume` reload `CLAUDE.md` fresh while reattaching the prior transcript. 
        - A plain fresh session called by `claude` attaches nothing.
        - Long sessions are subject to compaction and because the full transcript is resent on every turn, continuing a session gets more expensive over time.
    - Working in a CLI more generally: the difference between a terminal-occupying process and a conventional always-available Windows app and why installing something globally doesn't imply it does anything until explicitly invoked from a given working directory.

### Meta-level realizations and learnings

- Agent harnesses like Claude Code and Codex are elaborate, opinionated scaffolding around a single underlying model call, not a fundamentally different computational model from a raw API loop.  
Anything the supervisor can do - including adaptively taking over from a subagent that returned something unsatisfying - is in principle buildable directly against the raw API, as an orchestrator that has its own tools and reasons over failures. The harness's real contribution is pre-built machinery (context isolation, tool allowlisting, permission gating), not a capability that's otherwise unreachable.
- Compared to n8n: the rigidity of a hand-built pipeline isn't a property of using an API directly. It's a property of encoding control flow as fixed, hand-wired steps instead of letting a reasoning model decide the next step. The same rigidity would show up in a Claude Code equivalent, too, if its control flow were scripted rather than left to model judgment. The harness doesn't grant immunity to that failure mode, it just makes the non-scripted default easy to fall into.
- Compared to Codex, flagged explicitly as based on the single run of each rather than a confirmed pattern: Codex's subagents appeared to receive skill access more automatically, and Codex produced more open-ended agent/skill files despite an identical "keep it concise" instruction given to both systems.  It is worth revisiting with several controlled, repeated runs before treating it as an established architectural difference rather than one instance of prompt-interpretation variance between two models.
- Determinism in Claude Code is not a default property of the system. It must be manufactured where it's actually needed: through a small number of hard gates (`tools:`, `settings.json`) plus deliberately literal imperative language in prompts. Nearly everything else is genuinely emergent and can plausibly vary between runs. 
