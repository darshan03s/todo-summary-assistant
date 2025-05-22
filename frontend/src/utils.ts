import type { Todo } from "./types";

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

export const summarizeTodos = async (parsedTodosString: string): Promise<string> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/summarize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todos: parsedTodosString }),
    });
    const data: { summary: string } = await response.json();
    return data.summary;
};
