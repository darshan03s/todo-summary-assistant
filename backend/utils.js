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
