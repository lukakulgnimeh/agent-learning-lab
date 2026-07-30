# Reflection

### Learnings

- The main problem is good RAG.
- We actually contructed an agent since it decides for the right request, based on answers decides to call retriever tool again and decides on answer.
- Does not work as intentionally designed: 
   - Retriever just returns top k results but searches everything.
   - Fix would be to tell the agent metadata of injected documents. Then the request can be a specific restriced search with a following more directed search if necessary.
- Obtained skills:
  - PDF import
  - Text extraction
  - Document splitting
  - Metadata management
  - Embedding generation
  - Storage in a local Qdrant vector database
  - Semantic search
  - Agent construction using Ollama as the reasoning component

**Conclusion:** The project should have been planned as two different components: the RAG-System as knowledge infrastructure and the agent who takes action based on this infrastructure.

### Meta-level realizaitions and learnings

- Creation of increasingly structured system concepts prior to implementation.
- Active use of architectural models as a thinking tool.
- Distinguishing between the problem space and the solution space even before implementation begins.
- Developing complete data flows rather than individual workflows.
- Systematical analysis of technical problems based on data flows.
- Identifying the root causes of technical errors rather than merely fixing symptoms.
- Recognizing that the agents quality depends on the quality of the knowledge infrastructure.
- Viewing agents as part of larger systems rather than as isolated components.
- Iteratively improving architectural models based on new insights.
- Documenting technical decisions, including their trade-offs.
- Evaluating solutions not only based on functionality, but also on long-term maintainability and extensibility.