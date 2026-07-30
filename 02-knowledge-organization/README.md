# Project 2 – How do you organize knowledge?

## Research Question

How can an AI agent reliably access its own documents without hallucinating information or relying on world knowledge?

This project investigates the development of a Retrieval-Augmented Generation (RAG) system based on n8n, Qdrant, and local lecture notes.

## Goal

Development of an assistant that responds exclusively to provided documents and cites every statement in a traceable manner, including the page number. Learning how to provide the (un-)organized documents in the first place is the main subgoal.

The discussion focuses in particular on the following questions:

- How should PDF documents be prepared?
- What metadata is needed for reliable source citations?
- How can hallucinations be prevented?
- How can an LLM be made to actually use sources?
