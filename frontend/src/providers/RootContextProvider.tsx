import type { Todo } from "@/types";
import { useState } from "react";
import { RootContext } from "./contexts";
import supabaseClient from "@/supabaseClient";
import { useSessionContext } from "@/hooks/contextHooks";

const RootContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const { session } = useSessionContext();
    const [newTodoText, setNewTodoText] = useState<string>('');
    const [updateMode, setUpdateMode] = useState<boolean>(false);
    const [updateTodoId, setUpdateTodoId] = useState<string>('');

    const addTodo = (todo: Todo) => {
        if (!session) return;
        supabaseClient
            .from('user_todos')
            .insert({
                user_id: session.user.id,
                todo_id: todo.todo_id,
                title: todo.title,
                completed: todo.completed,
            })
            .select()
            .single()
            .then(({ data, error }) => {
                if (error) {
                    console.error('Error adding todo:', error);
                    return;
                }
                if (data) {
                    setTodos((prevTodos) => [data, ...prevTodos]);
                }
            });
    };

    const deleteTodo = (id: string) => {
        if (!session) return;
        supabaseClient
            .from('user_todos')
            .delete()
            .eq('todo_id', id)
            .then(({ error }) => {
                if (error) {
                    console.error('Error deleting todo:', error);
                    return;
                }
                setTodos(todos.filter((todo) => todo.todo_id !== id));
            });
    };

    const updateTodo = () => {
        if (!session) return;
        supabaseClient
            .from('user_todos')
            .update({
                title: newTodoText,
            })
            .eq('todo_id', updateTodoId)
            .then(({ error }) => {
                if (error) {
                    console.error('Error updating todo:', error);
                    return;
                }
                setTodos(todos.map(todo =>
                    todo.todo_id === updateTodoId ? { ...todo, title: newTodoText } : todo
                ));
                setUpdateMode(false);
                setUpdateTodoId('');
                setNewTodoText('');
            });
    };

    const toggleTodo = (id: string) => {
        if (!session) return;
        supabaseClient
            .from('user_todos')
            .update({
                completed: !todos.find((todo) => todo.todo_id === id)?.completed,
            })
            .eq('todo_id', id)
            .then(({ error }) => {
                if (error) {
                    console.error('Error toggling todo:', error);
                    return;
                }
                setTodos(todos.map(todo =>
                    todo.todo_id === id ? { ...todo, completed: !todo.completed } : todo
                ));
            });
    };

    return (
        <RootContext.Provider value={{ todos, setTodos, addTodo, deleteTodo, updateTodo, toggleTodo, newTodoText, setNewTodoText, updateMode, setUpdateMode, updateTodoId, setUpdateTodoId }}>
            {children}
        </RootContext.Provider>
    );
};

export default RootContextProvider;

