# Recurring Patterns in the Design of Agent Systems

## 01 – Tool Selection

**Problem:** Task depend on results of multiple tools. 

**Solution:** Let the agent decide on the tool order and number of calls.

**Advantages:**
- follow reasoning of the agents llm

**Limitations:**
- might miss potential of some tools (probably more of a problem with the prompt)


## 02 - Memory

**Problem:** Want to improve based on previous work.

**Solution:** The agent uses experience from previous runs via memory.

**Advantage:** use of long-term knowledge, not only context

**Limitation:** might restrict creativity for new reasoning


## 03 – Retrieval/RAG

**Problem:** The model lacks the necessary knowledge.

**Solution:** Before generating a response, relevant information is retrieved from external sources and provided to the model.

**Advantages:**
- up-to-date knowledge
- traceable sources
- smaller models are sufficient

**Limitations:**
- quality depends entirely on retrieval
- poor chunking strategies degrade the answers


## 04 – Reflection

**Problem:** Output obviously not good.

**Solution:** Let the agent practice self-criticism and review its own conclusion.

**Advantage:** easily appended

**Limitation:** potentially still believes in own previous conclusions


## 05 – Evaluation

**Problem:** Verification of Output.

**Solution:** Let a separate agent review the conclusion.

**Advantage:** can test for completeness, correctness and evidences

**Limitation:** might need a more powerful llm


## 06 – Supervisor

**Problem:** Multiple specialized tasks need to be coordinated and decisions depend on intermediate results.

**Solution:** A supervisor decides which agent to call, in what order, and whether additional information is needed.

**Advantages:**
- clear responsibilities
- easy to extend
- specialization possible

**Limitations:**
- the supervisor becomes a bottleneck
- quality depends heavily on routing


## 07 - Human-in-the-loop

**Problem:** Provide safety gates for important decisions and approvals.

**Solution:** Let a human actively review the conclusions of the agent.

**Advantage:** safe and easy to integrate

**Limitation:** might be too much workload if human would have to review every final decision


## 08 - Planner and Executor

**Problem:** Long and complex workflow.

**Solution:** Let one agent plan the actions and another one execute the steps.

**Advantage:** clear structure, less drift

**Limitation:** increasingly complex problem


## 09 - Parallel Experts

**Problem:** Answer seems to be focused on one direction.

**Solution:** Let multiple agents work on the same question independently and compare results in the end.

**Advantage:** easy to duplicate and implement

**Limitation:** can still be not the actual root of the problem


## 10 - Debate

**Problem:** Needed to explicitly consider each direction.

**Solution:** Two or more agents deliberately take opposing positions and a third agent evaluates them.

**Advantage:** rich analysis

**Limitation:** measurement of whether all relevant arguments were covered