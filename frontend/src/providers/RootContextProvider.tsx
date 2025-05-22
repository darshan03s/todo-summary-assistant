import type { Todo } from "@/types";
import { useState } from "react";
import { RootContext } from "./contexts";
import { useSessionContext } from "@/hooks/contextHooks";
import { toast } from "sonner";

const RootContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const { session } = useSessionContext();
    const [newTodoText, setNewTodoText] = useState<string>('');
    const [updateMode, setUpdateMode] = useState<boolean>(false);
    const [updateTodoId, setUpdateTodoId] = useState<string>('');

    const addTodo = async (todo: Todo) => {
        if (!session) return;
        const accessToken = session?.access_token;
        if (!accessToken) {
            return;
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                todo_id: todo.todo_id,
                title: todo.title,
                completed: todo.completed,
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            toast(errorData.message || 'Failed to add todo from backend');
        }
        const data: Todo = await response.json();
        if (data) {
            setTodos((prevTodos) => [data, ...prevTodos]);
        };

    }

    const deleteTodo = async (id: string) => {
        if (!session) return;
        const accessToken = session?.access_token;
        if (!accessToken) {
            return;
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/todos`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                todo_id: id,
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            toast(errorData.message || 'Failed to delete todo from backend');
        }
        setTodos(todos.filter((todo) => todo.todo_id !== id));
    };

    const updateTodo = async () => {
        if (!session) return;
        const accessToken = session?.access_token;
        if (!accessToken) {
            return;
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/todos`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                todo_id: updateTodoId,
                title: newTodoText,
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            toast(errorData.message || 'Failed to update todo from backend');
        }
        setTodos(todos.map(todo =>
            todo.todo_id === updateTodoId ? { ...todo, title: newTodoText } : todo
        ));
        setUpdateMode(false);
        setUpdateTodoId('');
        setNewTodoText('');
    };

    const toggleTodo = async (id: string) => {
        if (!session) return;
        const accessToken = session?.access_token;
        if (!accessToken) {
            return;
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/toggle-todo`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                todo_id: id,
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            toast(errorData.message || 'Failed to toggle todo from backend');
        }
        setTodos(todos.map(todo =>
            todo.todo_id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    return (
        <RootContext.Provider value={{ todos, setTodos, addTodo, deleteTodo, updateTodo, toggleTodo, newTodoText, setNewTodoText, updateMode, setUpdateMode, updateTodoId, setUpdateTodoId }}>
            {children}
        </RootContext.Provider>
    );
};

export default RootContextProvider;

