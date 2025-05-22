import type { SlackResponseType, Todo } from "./types";

export const parseTodos = (todos: Todo[]): string => {
    let parsedTodosString = '';
    parsedTodosString += "----------MY TODOS----------\n\n";
    parsedTodosString += `Total todos: ${todos.length}\n\n`;
    todos.forEach(todo => {
        const date = new Date(todo.created_at);
        parsedTodosString += `Date: ${date.toLocaleString()}\n`;
        parsedTodosString += `Todo: ${todo.title}\n`;
        parsedTodosString += `Status: ${todo.completed ? "Completed" : "Not Completed"}\n`;
        parsedTodosString += "------------------------------------------\n";
    });
    return parsedTodosString;
};

export const summarizeTodos = async (parsedTodosString: string): Promise<{ summary: string; slackResponse: SlackResponseType }> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ todos: parsedTodosString }),
        });
        const data: { summary: string; slackResponse: SlackResponseType } = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return { summary: "", slackResponse: { error: "Failed to summarize todos", message: "Failed to summarize todos" } };
    }
};
