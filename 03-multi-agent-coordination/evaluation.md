# Evaluation
The evaluation should focus on the following parameters:

- Correct context of the answer.
- Correctness of sources and evidences.
- Structure and quality of the output message.

It should also cover problems and errors as well as trade-offs.

## Parameter evaluation

- The answers were placed in the correct context. 
- In terms of structure, the answers ranged from “acceptable” to “really good and well-structured” and were of good quality overall.
- Since the decision was made to keep the task simple and not allow any additional resources, there were no sources cited, as the model answered solely based on its general knowledge.

## Problems and errors

- Achieving proper communication between supervisor and subagent: strict format {"request": "{ ... task ... }"} such that a request can be interpreted by the sub-agent as prompt {{ $fromAI("request") }}.
- Getting sensible requests to sub-agents such that they don't hallucinate i.e. improving the system message of the supervisor.
- Getting a balanced system message for sub-agents, such that output for supervisor is satisfying.
   - Attaching a small memory help but had to be careful to let the memory only correspond to the specific execution id.
- How do you actually measure how good an answer is?