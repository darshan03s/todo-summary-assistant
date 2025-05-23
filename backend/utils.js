import { Mistral } from "@mistralai/mistralai";

export const summarizeTodos = async (todos) => {

    const prompt = `Here are the user todos: ${todos}`;

    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

    const chatResponse = await client.chat.complete({
        model: 'mistral-medium-2505',
        messages: [
            { role: 'system', content: "You are a todo summarizer. You will be given a list of todos, you need to summarize them in a concise way and easy to understand manner. Give the summary as a string. You should summarize it in this template: 'Here is the summary of your todos from (start-date) to (end-date): (summary)'" },
            { role: 'user', content: prompt }
        ],
    });

    return chatResponse.choices[0].message.content;
}

export const sendSlackMessage = async (payload, slackWebhookUrl) => {
    try {
        const response = await fetch(slackWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: payload
            })
        });

        if (response.ok) {
            console.log('Message sent to Slack successfully!');
            return { message: 'Message sent to Slack successfully!', error: null };
        } else {
            const errorText = await response.text();
            console.error('Failed to send message to Slack:', response.status, errorText);
            return { message: 'Failed to send message to Slack.', error: errorText };
        }
    } catch (error) {
        console.error('An error occurred while sending to Slack:', error);
        return { message: 'An error occurred while sending to Slack.', error: error.message };
    }
}