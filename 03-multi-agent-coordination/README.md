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
- The construction is documented in the **workflow** and **prompts and nodes** folders. Note that these are written in German, since I didn’t want to lose my train of thought by searching for perfect phrasing. Adjustments lead to an update of the **decisions** file.
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

During development several architectural challenges emerged.

### 1. Agent Communication

The most important challenge was establishing reliable communication between the supervisor and specialized sub-agents. Since tool calls only expose explicitly defined parameters, robust message interfaces had to be designed to ensure every sub-agent received the correct task and context.

### 2. Prompt Engineering

The quality of the overall system strongly depended on the prompts of both the supervisor and the sub-agents. Responsibilities, expected outputs, and communication protocols had to be defined precisely to avoid hallucinations and ambiguous task execution.

### 3. Memory and Session Management

To make agent behavior reproducible, memory had to be isolated per workflow execution. This required careful session management to prevent information leakage between independent conversations while still allowing reasoning within a single execution.

### 4. Orchestration

Designing the supervisor's orchestration logic proved more difficult than expected. Deciding which agent to call, when additional analysis was required, and how to combine intermediate results became an architectural problem rather than a prompting problem.

## Result

The resulting system consists of a supervisor agent coordinating multiple specialized sub-agents with clearly separated responsibilities. The agents communicate through structured interfaces, produce traceable intermediate results, and generate a final assessment based solely on the collected expert opinions. Given the design decisions that were made, the output is good enough and satisfactory.

## Findings

The project demonstrated that multi-agent systems are primarily an architectural challenge rather than a modeling challenge. Reliable collaboration depends on explicit communication protocols, clearly defined responsibilities, robust interfaces, and careful session management. The experiments also showed that architectural decisions often have a greater impact on system quality than the choice of the underlying language model, and that multiple specialized agents are generally easier to control than a single general-purpose agent.



## Core Reflection

Instead of focusing primarily on how multiple agents communicate with one another, I automatically began to explore what kind of architecture enables shared understanding in the first place and how information, communication, and decision-making flows need to be organized. There is no automatic shared understanding among intelligent components.