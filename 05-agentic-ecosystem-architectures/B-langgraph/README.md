# Part B - Which architectural assumptions does LangGraph have?

##  Goal

Moving from n8n, Codex and Claude Code to LangGraph, we once more construct the same two-agent system as before, i.e. providing a clothing suggestion for the day based on the weather and contents of a wardrobe. We want to understand the basic model, developer control, agent autonomy, transparency, tooling, subagents and extensibility to understand suitable problem types for LangGraph.

## Project Structure

The project is structured as follows. While this `README.md` focusses on a compact summary of the learnings about LangGraph's architectural model, the `reflection.md` file contains a more in-depth analysis.

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

