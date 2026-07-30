# Project 3 – How do you coordinate agents?

## Research Question

How do multiple AI agents communicate and work with each other?

This project investigates the interaction of multiple agents based on n8n. For that, the interaction between a supervisor agent and multiple sub-agents is examined.

## Goal 

Development of an assistant that reviews a given business idea. To do so, this supervisor agent orchestras sub-agents for market analysis, competition, technical realization, economy and customer perspective. Based on their expertise and its own evaluation, the idea should be put into a broader context and a review is presented.

The discussion focuses in particular on the following questions:

- How does communication between supervisor and sub-agents flow?
- How do interfaces between agents work?
- How can decisions be tracked?
- How should a message for another agent be structured?

## Business Framing
**Example problem:** checking the potential of a start-up idea.

**Target KPI's:** reduce manual review workload for potential founders with low experience.

**System lever:** reduce research needed, while the final expertise is a detailed analysis that can be interpreted and used as a base for further research for the user.

**Measurement lens:** quality of review with regard to sources, completeness and correctness.

**Note:** For the purpose of simple testing we always asked about a business which manufactures toy cars for kids, either made from wood or glass.


## Project Structure
Following the **commit-history**, the project is structured as follows:
- Initial drafts for the **architecture** (including an exemplary **Failure Mode and Effects Analysis**) as well as a conception for intentional design **decisions** and **evaluation** were documented in the respective files.
- The construction is documented in the **workflow** and **prompts and nodes** folders. Adjustments lead to an update of the **architecture** file.
- Finally, **evaluation** and **reflection** took part in the respective files.

## Architecture (sketch)

Natural-language-request: user's business idea 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr;

Supervisor agent: which requests for which agents first?  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&rarr; Market analysis agent?  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&rarr; Competition agent?  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&rarr; Technical realization agent?  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&rarr; Economy agent?  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&rarr; Customer perspective agent?  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
Supervisor agent

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr;

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;... Sub-agent calls, evaluations, decisions

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&darr;

Output structured review



## Key Challenges

Several practical problems arose during development.

### 1. 

## Result

The developed agent

- 

## Findings



## Core Reflection

