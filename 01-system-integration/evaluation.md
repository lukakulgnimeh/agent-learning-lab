## Was the system successful?
Yes, the architecture works structurewise. 

Given the restricted power of ollama, it completes its automatization with some misinterpretations on the exact contents of the dummy wardrobe. 

The triggers work, the agent reliable calls all APIs and interpretes the information correctly. 

But to achieve all of that, the prompt had to be very specific and we had to do a major trade-off: the actually messaging of the email had to be outsourced. Eventhough I tried all sorts of prompts, the agent seemed to be overwhelmed. So instead he now outputs a strictly structured message that ist then parsed to JSON by a code node and send by a final gmail node. 

Nevertheless, the result is good and fast.