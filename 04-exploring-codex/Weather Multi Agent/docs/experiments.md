# Experiments

This log records small experiments that compare Codex's agent-oriented workflow with an n8n-style workflow. Each experiment is kept deliberately narrow so its architectural lesson is clear.

## Experiment A — on-demand weather delegation

**Purpose.** Verify that a Codex supervisor can delegate a weather lookup only when needed, then retain responsibility for the wardrobe-aware recommendation.

**Setup.** Invoke the clothing-recommendation skill with a request such as: "What should I wear in Berlin tomorrow?" The supervisor reads wardrobe.md, delegates the location and time period to a weather subagent, and uses its concise assessment to select listed items.

**Expected behavior.** The delegate uses a weather tool and returns conditions plus clothing implications. The supervisor does not pass the wardrobe to the delegate, chooses only available clothes, and produces the single user-facing recommendation.

**Actual observations/results.** Indeed, the subagent is called and uses web search to obtain weather data. Additionally, it suggests general clothing implications and returns both to the supervisor. Based thereon the supervisor searches the wardrobe and produces a concise output to the user. The result is correct and complete. In a second request it is explicitly assigned that the a specialized weather subagent should be delegated and that also work as before. Since the request was the same, the supervisor took note and named the on-demand called agent as "Berlin weather repeat". In a third request it was asked to present an alternative sweatshirt. The supervisor decided that the subagent is not needed again and just looked into the wardrobe to present several alternatives.

**Conclusion/lesson learned.** The experiment is intended to show that Codex models delegation as an on-demand, conversational subtask with tool access, while n8n would usually model the same hand-off as explicitly connected workflow nodes and data fields. And this is true: conceptually all the structural preparation was the same. The difference lies in the fact that Codex then decided on the concrete realization itself and so to speak implicitly constructs the workflow (each execution on its own) while the workflow in n8n had to be constructed manually initially. The subagents is part of the agent loop or ongoing processing. But that also comes with the downside that the information and communication flow is not as obvious and probably makes debugging more difficult. Codex dynamically constructs the specific execution path during processing. Also confusing is the fact that the supervisor receiving the weather task is the same as the one who initially constructed parts of (its own future) workflow.

**Remarks.** Since the AGENTS.md file contains concrete instructions, the supervisor actually did more than expected for this experiment. First of all, it really used the skill and also autonomously and automatically called the subagent. Second, it decided wether to delegate or not on its own based on the task - as desired. But initially it was planned to test this behavior in upcoming experiments.

## Experiment B — using tools

**Purpose.** Give the weather specialist access to a weather/web tool and investigate how tool usage is handled inside a delegated subagent: who decides to use an available tool and how the result returns to the supervisor.

**Setup.** Repeat the Berlin-tomorrow clothing request. The supervisor delegates a narrowly scoped forecast task and instructs the weather specialist to use the available weather/web capability, report the capability used, and return only a clothing-relevant assessment. No custom weather API or infrastructure is added.

**Expected behavior.** The delegated agent independently performs the external lookup, then returns a compact result to the supervisor. The supervisor uses that result with wardrobe.md to choose the outfit.

**Actual observations/results.** The supervisor created a subagent. The specialist first attempted the structured weather endpoint, which produced no valid response; it then chose the delegated web-search capability (web__run) and obtained the forecast. It returned approximately 12-13°C low, 19-20°C high, bright early conditions, possible midday/afternoon showers, gusty westerly wind, and the advice to layer and bring rainproof outerwear with closed water-resistant footwear. It did not read the wardrobe or select an outfit. The supervisor received this text result and selected the outfit from the wardrobe.

**Conclusion/lesson learned.** The project instructions prescribe the responsibility split-supervisor delegates weather; specialist obtains and interprets weather-but they do not encode a fixed HTTP request or node graph. Within its scope, the specialist made the execution choice to fall back from the unavailable structured endpoint to web search. And that's despite the fact that there was no fallback given. Codex therefore exposes tool use as an agent action inside a delegated task, whereas n8n would normally make the tool choice, fallback path, and field mapping explicit in the workflow definition.