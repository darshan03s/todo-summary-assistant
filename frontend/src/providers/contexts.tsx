import type { Todo } from "@/types";
import { createContext } from "react";
import { type Session } from "@supabase/supabase-js";

export interface RootContextType {
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
    addTodo: (todo: Todo) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    updateTodo: () => Promise<void>;
    toggleTodo: (id: string) => Promise<void>;
    newTodoText: string;
    setNewTodoText: React.Dispatch<React.SetStateAction<string>>;
    updateMode: boolean;
    setUpdateMode: React.Dispatch<React.SetStateAction<boolean>>;
    updateTodoId: string;
    setUpdateTodoId: React.Dispatch<React.SetStateAction<string>>;
}


export const RootContext = createContext<RootContextType | null>(null);

export interface SessionContextType {
    session: Session | null;
    setSession: (session: Session | null) => void;
    signInWithGoogle: () => void;
    signOut: () => void;
}

export const SessionContext = createContext<SessionContextType | null>(null);