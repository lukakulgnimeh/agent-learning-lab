# Experiments

This log records small experiments that compare Codex's agent-oriented workflow with an n8n-style workflow. Each experiment is kept deliberately narrow so its architectural lesson is clear.

## Experiment A — on-demand weather delegation

**Purpose.** Verify that a Codex supervisor can delegate a weather lookup only when needed, then retain responsibility for the wardrobe-aware recommendation.

**Setup.** Invoke the clothing-recommendation skill with a request such as: "What should I wear in Berlin tomorrow?" The supervisor reads wardrobe.md, delegates the location and time period to a weather subagent, and uses its concise assessment to select listed items.

**Expected behavior.** The delegate uses a weather tool and returns conditions plus clothing implications. The supervisor does not pass the wardrobe to the delegate, chooses only available clothes, and produces the single user-facing recommendation.

**Actual observations/results.** Indeed, the subagent is called and uses web search to obtain weather data. Additionally, it suggests general clothing implications and returns both to the supervisor. Based thereon the supervisor searches the wardrobe and produces a concise output to the user. The result is correct and complete. In a second request it is explicitly assigned that the a specialized weather subagent should be delegated and that also work as before. Since the request was the same, the supervisor took note and named the on-demand called agent as "Berlin weather repeat". In a third request it was asked to present an alternative sweatshirt. The supervisor decided that the subagent is not needed again and just looked into the wardrobe to present several alternatives.

**Conclusion/lesson learned.** The experiment is intended to show that Codex models delegation as an on-demand, conversational subtask with tool access, while n8n would usually model the same hand-off as explicitly connected workflow nodes and data fields. And this is true: conceptually all the structural preparation was the same. The difference lies in the fact that Codex then decided on the concrete realization itself and so to speak implicitly constructs the workflow (each execution on its own) while the workflow in n8n had to be constructed manually initially. The subagents is part of the agent loop or ongoing processing. But that also comes with the downside that the information and communication flow is not as obvious and probably makes debugging more difficult. Codex dynamically constructs the specific execution path during processing. Also confusing is the fact that the supervisor receiving the weather task is the same as the one who initially constructed parts of (its own future) workflow.

**Remarks.** Since the AGENTS.md file contains concrete instructions, the supervisor actually did more than expected for this experiment. First of all, it really used the skill and also autonomously and automatically called the subagent. Second, it decided wether to delegate or not on its own based on the task - as desired. But initially it was planned to test this behavior in upcoming experiments.
