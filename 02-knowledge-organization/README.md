# Project 2 – How do you organize knowledge?

## Research Question

How can an AI agent reliably access its own documents without hallucinating information or relying on world knowledge?

This project investigates the development of a Retrieval-Augmented Generation (RAG) system based on n8n, Ollama, Qdrant, and local lecture notes.

## Goal

Development of an assistant that responds exclusively to provided documents and cites every statement in a traceable manner, including the page number. Learning how to provide the (un-)organized documents in the first place is the main subgoal.

The discussion focuses in particular on the following questions:

- How should PDF documents be prepared?
- What metadata is needed for reliable source citations?
- How can hallucinations be prevented?
- How can an LLM be made to actually use sources?

## Project structure
Following the **commit-history**, the project is structured as follows:
- Initial drafts for the **architecture** as well as a conception for intentional design **decisions** and **evaluation** were documented in the respective files.
- The construction is documented in the **workflow** and **prompts and nodes** folders. Adjustments lead to an update of the **architecture** file.
- Finally, **evaluation** and **reflection** took part in the respective files.

## Architecture (sketch)

&rarr; PDF submission

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr;

Extract from file 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr;

Parsing pagewise and include metadata

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr;

Embedding in vector database

&rarr; user request

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr; Agent

Database retriever

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr;

Agent analysis/evaluation/decision

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr;

Structured Output


## Key Challenges

Several practical problems arose during development.

### 1. PDF Extraction

The lecture notes used contain many graphics. As a result, page breaks were lost during extraction, and multiple pages were combined into a single document.

To solve this, a custom parser was developed that splits the extracted text back into individual pages based on recurring patterns.

### 2. Metadata

The standard loader only stored "source = blob". To ensure traceable sources, custom metadata therefore had to be added:

- Document name
- Page number
- Total number of pages

### 3. Retrieval

Not every search query yielded meaningful results. Various parameters were examined and adjusted:

- Chunk size
- Top k filtering
- Chunking strategies
- Prompt of the retriever

### 4. Citations

One of the biggest challenges was getting the LLM to

- use only retriever results,
- not invent sources,
- provide the correct page number for each statement.

Several prompt iterations were necessary before reliable citations with acceptable margin of error were generated.

## Result

The developed agent

- answers questions based solely on the documents,
- cites each statement with the document name and page number,
- does not use external world knowledge,
- recognizes missing information and points it out.

## Findings

The biggest challenge of an RAG system is not vector retrieval. Rather, the following three factors are crucial:

- high-quality document processing,
- meaningful metadata,
- precise prompt engineering.

Even small changes to these components had a significantly greater impact on response quality than switching the language model.

## Core Reflection

While the agent itself was developed relatively quickly, I spent most of my time trying to understand the underlying system architecture. For me, the core of the project wasn’t the implementation itself, but rather the gradual process of understanding and improving the relationships between data, infrastructure, the agent, and the results.