# agent-learning-lab
Welcome! This repository documents my transition from learning AI technologies to reasoning about AI system architectures. It is not intended to showcase production-ready software.

## Learning Journey
**Goal:** Develop an architectural understanding of modern AI systems through the iterative design of increasingly complex agent-based applications.

**Side quest:** Familiarization with the technical fundamentals, focusing on structure, organization and functions.

The first projects build an understanding of agent architecture from the system-building perspective. Later projects shift towards understanding the architectural assumptions embedded in the ecosystems used to build these systems.

## Learning Path

The projects are intentionally ordered. Rather than increasing mainly in technical complexity, each phase addresses a different architectural question.

### Phase 1: Agent Architecture Foundations

<p align="center">
  System Integration <br />
  &darr; <br />
  Knowledge Organization <br />
  &darr; <br />
  Agent Coordination <br />
</p>

Projects 01-03 explore the basic building blocks and patterns of agent-based systems through low-code implementations in n8n.

### Phase 2: AI Ecosystems and Architectural Assumptions


<p align="center">
  Agentic Development <br />
  &darr; <br />
  Ecosystem Comparison <br />
</p>

Projects 04-05 shift the focus from building agent architectures to examining how different development ecosystems structure, constrain and support them.

## About the Projects
The repository therefore consists of two connected parts: foundational agent architecture and ecosystem-oriented architectural analysis. 

The projects are designed to explore the following architectural questions while gaining hands-on experience with the underlying technologies and tooling.

| Project | Key Question                              | Focus                            |
| ------- | ----------------------------------------- | -------------------------------- |
| 01      | How do you connect and integrate systems? | Workflows, APIs, Tool Use        |
| 02      | How do you organize knowledge?            | RAG, Embeddings, Vector Database |
| 03      | How do you coordinate agents?             | Supervisor, Multi-Agent Systems  |
| 04      | Which architectural assumptions does Codex have? | Agentic Development, Skills, MCP, Tool Use  |
| 05      | Which architectural assumptions underlie different AI development ecosystems? | Claude Code, LangGraph, State, Tool Calling, Comparison |

### Development Philosophy
Each project follows the same iterative process:

Architecture &rarr; Implementation &rarr; Evaluation &rarr; Reflection &rarr; Reusable Principles

Each iteration aims not only to build a working system, but also to continuously refine the underlying mental model of agent architectures.

## Architectural Knowledge Base

Beyond the individual projects, this repository captures the reusable knowledge extracted from each iteration. Rather than documenting specific implementations, the `docs/` folder summarizes recurring architectural concepts and design principles across technologies.

| Document                    | Purpose                                                |
| --------------------------- | ------------------------------------------------------ |
| **components-modules**      | What building blocks exist?                            |
| **agent-patterns**          | How are these building blocks combined?                |
| **architecture-principles** | Which design principles guide architectural decisions? |
| **lessons-learned**         | Which insights proved reusable across projects?        |

## Current Status

Project 05 currently serves as a summary of the learning journey. The same problem was used to compare four different architectural approaches: n8n, Codex, Claude Code, and LangGraph.

The detailed cross-ecosystem comparison is documented in `05-agentic-ecosystem-architectures/comparison.md`, while the project's final conclusions are summarized in its `README.md`. The main finding is that these ecosystems differ less in what they can build - n8n is certainly more rigid - than in where they place control between the developer, the agent and the framework.

The repository is now maintained as a reference of the architectural concepts and lessons learned during this learning phase, while further development will follow future technical interests and opportunities.