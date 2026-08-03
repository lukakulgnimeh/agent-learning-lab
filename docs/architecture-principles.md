# Architecture Principles for Agent Systems

### 01 - Architecture before implementation

Good architecture reduces future complexity more effectively than any optimization of individual components.

### 02 - Understand the data flow first

If data doesn't flow smoothly, the agent won't improve.

### 03 - First simple, then evolved

First workflow, then llm, then agent and then multi-agent.

### 04 - Knowledge is independent of the agent

RAG, memory and databases are separate components.

### 05 - Prompts are interfaces

A prompt is communication.

### 06 - Developing architecture iteratively

Don't plan everything in advance. Architecture evolves as understanding grows.

### 07 - Decoupling components

Each component should have exactly one responsibility, if possible.

### 08 - Specialization beats versatility

It's better to have several small agents than one huge one.

### 09 - Communication must be explicit

There is never an automatic mutual understanding between two intelligent components. Information must be deliberately structured, transmitted, and interpreted.

### 10 - Plan for observability

Logs, metadata, storage and debugging are part of the architecture.

### 11 - Fail controlled

If something fails, the system must respond appropriately.

### 12 - Keeping interfaces stable

If components remain interchangeable, it will be possible later on to replace them with a different LLM, a different retriever, or a different database without major modifications.

### 13 - Make architectural evolution visible

Instead of documenting only the final state, preserve important intermediate design decisions.

### 14 - Architecture follows the problem, not the technology

Which architecture solves the problem most easily and which technology suffices?