import type { Todo } from "@/types";
import { createContext, useContext, useState } from "react";

interface RootContextType {
    todos: Todo[];
    addTodo: (todo: Todo) => void;
    deleteTodo: (id: number) => void;
    updateTodo: (id: number, updatedTodo: Todo) => void;
    toggleTodo: (id: number) => void;
}

const RootContext = createContext<RootContextType | null>(null);

const RootContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [todos, setTodos] = useState<Todo[]>([]);

    const addTodo = (todo: Todo) => {
        setTodos([...todos, todo]);
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const updateTodo = (id: number, updatedTodo: Todo) => {
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    return (
        <RootContext.Provider value={{ todos, addTodo, deleteTodo, updateTodo, toggleTodo }}>
            {children}
        </RootContext.Provider>
    );
};

export const useRootContext = () => {
    const context = useContext(RootContext);
    if (!context) {
        throw new Error("useRootContext must be used within a RootContextProvider");
    }
    return context;
};

export default RootContextProvider;

