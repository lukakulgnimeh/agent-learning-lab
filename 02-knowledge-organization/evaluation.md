# Evaluation
The evaluation should focus on the following parameters:

- Correct context of answer.
- Completeness.
- Given and correct references.
- Structure and quality of output message.

It should also cover problems and errors as well as trade-offs.

## Parameter evaluation

- The answers carry correct context and are satisfying.
- They are not really complete but most of the time contain the essence.
- References are given and within the decided trade-off range.
- Overall structure is good, follows given format, but individual answers differ in appearance. Quality is enough for a quick refresher and allows follow up questions.

## Problems and errors

### RAG:

- Extracts not every word, e.g. problems with graphs and included logic.
- Extracts "randomly" if graph or diagram is present such that no real structure noticeable.
    - Leading to the trade-off that answers are plus minus one page accurate enough.
- Have to split pages to obtain metadata, which turns out to be hard covering edge cases.
- Respect chunk sizes of data loader to avoid further sub-splitting.

### Agent:

- Output highly depends on quality of input data (RAG).
- Good prompt for consistent references was difficult.
- Agent first send english requests to the retriever which was hard to match.
- Sometimes does not asked retriever again and started hallucinating own answers without references. Although it was supposed to answer with a specific answer in that case.
   - Adding memory helped.