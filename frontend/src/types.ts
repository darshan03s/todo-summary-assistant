export interface Todo {
    todo_id: string;
    title: string;
    completed: boolean;
    created_at: string;
}

export type SlackResponseType = {
    message: string;
    error?: string;
}