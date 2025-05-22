import { GoogleGenAI } from "@google/genai";

export const summarizeTodos = async (todos) => {

    const prompt = `Here are the user todos: ${todos}`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-05-20",
        contents: prompt,
        config: {
            systemInstruction: "You are a todo summarizer. You will be given a list of todos, you need to summarize them in a concise way and easy to understand manner. Give the summary as a string. You should summarize it in this template: 'Here is the summary of your todos from (start-date) to (end-date): (summary)'",
            temperature: 0.5,
        },
    });
    return response.text;
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