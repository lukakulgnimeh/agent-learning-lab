# Part B - Which architectural assumptions does LangGraph have?

##  Goal

Moving from n8n, Codex and Claude Code to LangGraph, we once more construct the same two-agent system as before, i.e. providing a clothing suggestion for the day based on the weather and contents of a wardrobe. We want to understand the basic model, developer control, agent autonomy, transparency, tooling, subagents and extensibility to understand suitable problem types for LangGraph.

## Project Structure

The project is structured as follows. While this `README.md` focusses on a compact summary of the learnings about LangGraph's architectural model, the `reflection.md` file contains a more in-depth analysis. The core of the project's implementation is contained in files 01-03. The folder `exploring-langgraph-basics/` lives up to its name and, in addition to file 00, contains setup instructions. 

- `README.md`
- `reflection.md`
- `weather-multi-agent/`
    - `wardrobe.md`
    - `01-weather-multi-agent-deterministic.ipynb`
    - `02-weather-multi-agent-react.ipynb`
    - `03-weather-multi-agent-abstraction.ipynb`
    - `.env.example`
    - `exploring-langgraph-basics/`
        - `Setup-LangGraph-Miniconda-Claude-VSCode.md`
        - `00-hello-langgraph.ipynb`
        - `.env.example`
        - `simplest_chatbot.txt`
        - `sailing_cancellation_email.txt`


## Summary of the Implementation in LangGraph and Decisions

The LangGraph implementation was developed iteratively to compare explicit workflow control with increasingly autonomous agent behavior. The same two-agent clothing recommendation problem was rebuilt through several stages, deliberately changing one architectural assumption at a time. This made it possible to observe what is being abstracted away and to compare the resulting trade-off between developer control, autonomy, transparency, and implementation effort.

1. **Explicit router architecture.** The first version used a custom `TypedDict` state and explicitly defined nodes, edges, and conditional routing. The supervisor used structured output to determine whether weather or wardrobe information was required, while a developer-defined router determined the next graph step. This established a deterministic reference implementation.

2. **ReAct-style tool calling.** The deterministic routing logic was then replaced by a model-driven tool-calling loop using `ToolNode`. The supervisor could decide at runtime whether to call the wardrobe or weather capability, and the graph returned tool results to the supervisor until no further tool calls were requested. This made the system less deterministic while preserving an explicit graph-level implementation.

3. **API integration.** The weather capability was initially kept deliberately simple to isolate graph behavior. It was then extended to call the public Open-Meteo API through ordinary Python code, separating deterministic API execution from the LLM-based interpretation of the result.

4. **Nested weather agent.** The weather capability was subsequently turned into a standalone agent with its own model, state, ReAct loop, and `get_forecast` tool. The supervisor accessed this specialist through a tool interface, creating a hierarchical multi-agent architecture without requiring both agents to use different underlying models.

5. **Framework-provided message state.** The custom message state was replaced with LangGraph's `MessagesState`. This kept the same communication model and state-merging behavior.

6. **`create_agent` abstraction.** Finally, the manually constructed agent graphs were replaced by `create_agent`. The model, tools, system prompt, and agent identity became configuration rather than explicit graph implementation, while the underlying model/tool loop remained the same. This abstracts away standard agent infrastructure while retaining extensibility through options such as response format.


## Core Architectural Findings

1. **Basic Model.** LangGraph models the application as a stateful graph in which nodes read and write shared state and edges determine how execution progresses. This can represent deterministic workflows, cyclic agent/tool loops, and multi-agent compositions. `create_agent` provides a higher-level implementation of a standard tool-calling agent graph.

2. **Developer Control.** The developer can explicitly define the state schema, nodes, edges, conditional routing, tools, prompts and agent composition. The developer decides which infrastructure parts are moved to framework.

3. **Agent Role/Autonomy.** The model can interpret task requirements, choose among exposed tools, decide when additional information is needed, and determine when the agent loop is complete. With multiple agents, a supervisor can also decide when to delegate to a specialized agent exposed through a tool.

4. **Control.** LangGraph supports a wide spectrum from deterministic developer-defined routing to model-driven ReAct loops. More model-driven routing increases flexibility but reduces predictability and shifts responsibility from explicit code to runtime model decisions.

5. **Transparency/Observability/Debugging.** Explicit `StateGraph` implementations make nodes, edges, state updates, and routing decisions directly visible in code and graph visualizations. As more infrastructure is abstracted, implementation details become less visible, although framework-level debugging and graph inspection remain available.

6. **State/Context.** State is an explicit architectural interface through which nodes and agents exchange information. For conversational agents, `MessagesState` provides a prebuilt message-based state with `add_messages`.

7. **Tools.** Capabilities can be implemented directly in developer-defined nodes, exposed as LangChain tools, or executed through `ToolNode`. In standard ReAct agents, the model emits tool calls and LangGraph executes the corresponding tools before returning the results as messages.

8. **Delegation/Subagents.** A specialized capability can remain a simple tool or be implemented as a complete independent agent with its own graph and tools. In this project, the weather agent was exposed to the supervisor as a tool, creating hierarchical delegation.

9. **Extensibility.** New capabilities can be added by introducing nodes, edges, tools, or independent agents, depending on the required degree of control. The same architecture can therefore evolve from explicit graph logic to higher-level agent composition.

10. **Suitable Problem Types and Typical Use Cases.** LangGraph appears particularly useful for stateful, multi-step agent systems where execution may branch, loop, delegate, or require explicit control boundaries. It is especially valuable when developers need a balance between workflow determinism and LLM autonomy, while framework abstractions like `create_agent` also provide options for standard components.


## Conclusion

LangGraph's defining characteristic is the flexibility it gives the developer to choose where control should live. The same agentic problem can be implemented as an explicitly routed graph, a developer-defined ReAct loop, or a nested multi-agent system, while higher-level abstractions progressively hide parts of the underlying implementation. This makes LangGraph suitable both for tightly controlled workflows and for systems where the LLM decides dynamically which capabilities or agents to invoke. The central trade-off is therefore not simply control versus autonomy, but explicitness versus abstraction: more explicit graph code provides greater transparency and fine-grained control, while higher-level abstractions reduce implementation effort at the cost of making more of the execution model implicit.
