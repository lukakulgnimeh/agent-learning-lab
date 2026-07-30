## Learnings:

* I realized that the agents follows a strict workflow and is actually not an agent anymore: It is triggered by a chat message such as “What should I wear today?” or automatically every morning at 6 a.m.. It then checks the weather via an HTTP request to MeteoBlue and looks up a Docs document that lists the wardrobe. It then outputs a message regarding the weather and the resulting outfit recommendation, which is formatted into a fixed JSON format using the following code node, and an email is sent afterwards in a standardized format.

* So with all trade-offs I had to include to not overwhelm the agent, I more or less obtained an AI workflow, where the LLM just gets a fixed task. But it does not take actions! So we could just replace the node by an llm-chain node. 

* To really obtain an agent, we would have to restore more degrees of freedom, allowing the agent to take actions. Somehow adjust the prompt to work again or use a stronger llm as brain which can handle the tasks. Or include other tools like a calendar call to match the outfit to given appointments, allow to ask follow-up questions etc.

* Obtained skills: 
  * Set up OAuth
  * Used Google Cloud
  * Integrated the Gmail API
  * Used HTTP requests
  * Integrated an external API
  * Understood tool calling
  * Processed JSON
  * Modeled a workflow
  * Used LLM effectively
  * Recognized the limitations of workflows compared to agents
  * Made an architectural decision (outsourced email sending)

## The essence:

Don't build an agent when a workflow is enough. First observe the structure of the problem and then decide on the architecture. And I really loved thinking about the kind of system that is indeed needed - and how the system should be adapted in the construction to match appearing difficulties like a too weak llm. How responsibilities and tasks can be separated and viewed as components.