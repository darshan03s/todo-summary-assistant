import { Check, Edit, Trash2, TriangleAlert } from 'lucide-react';
import { useRootContext, useSessionContext } from '@/hooks/contextHooks';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { Todo } from '@/types';
import { useState } from 'react';
import Spinner from '@/components/custom/Spinner';

const Todos = () => {
    const { todos, toggleTodo, deleteTodo, setTodos, setNewTodoText, setUpdateMode, setUpdateTodoId } = useRootContext();
    const { session } = useSessionContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingTodoId, setLoadingTodoId] = useState<string | null>(null);
    const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);

    useEffect(() => {
        if (!session) return;
        const fetchTodos = async () => {
            setLoading(true);
            const accessToken = session?.access_token;
            if (!accessToken) {
                return;
            }
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/todos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast(errorData.message || 'Failed to fetch todos from backend', { duration: 5000, icon: <TriangleAlert size={20} /> });
            }

            const data: Todo[] = await response.json();
            setTodos(data);
            setLoading(false);
        };
        fetchTodos();
    }, [session, setTodos]);

    if (session && loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner className="text-amber-600 size-8" />
            </div>
        );
    }

    if (todos.length === 0 || !session) {
        return (
            <div className="text-center py-8 text-amber-700/70">
                <p className="text-lg font-medium">No todos yet!</p>
                <p className="text-sm mt-1">Add a new task to get started</p>
            </div>
        );
    }

    const handleToggleTodo = async (id: string) => {
        if (loadingTodoId === id) return;
        setLoadingTodoId(id);
        await toggleTodo(id);
        setLoadingTodoId(null);
    }

    const handleDeleteTodo = async (id: string) => {
        if (deletingTodoId === id) return;
        setDeletingTodoId(id);
        await deleteTodo(id);
        setDeletingTodoId(null);
    }


    return (
        <div className="space-y-3 overflow-y-auto h-[calc(100vh-300px)] hide-scrollbar">
            {todos.map((todo, index) => (
                <div
                    key={index}
                    className={`group relative p-4 bg-amber-100 rounded-lg border border-amber-600 transition-all duration-200 ${todo.completed ? 'opacity-75' : ''}`}
                >
                    <div className="flex items-start gap-3">
                        {loadingTodoId === todo.todo_id ? <Spinner className="text-amber-600 size-5" /> : <>
                            <button
                                onClick={() => handleToggleTodo(todo.todo_id)}
                                className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center 
                border-2 ${todo.completed
                                        ? 'bg-amber-500 border-amber-500 text-white'
                                        : 'border-amber-300 hover:border-amber-400'}`}
                                aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                            >
                                {todo.completed && <Check size={12} />}
                            </button>
                        </>}

                        <div className="flex-1 min-w-0">
                            <h3
                                className={`text-sm font-medium line-clamp-2 ${todo.completed
                                    ? 'text-amber-700/70 line-through'
                                    : 'text-amber-900'}`}
                            >
                                {todo.title}
                            </h3>
                            <p className="text-xs text-amber-500">{new Date(todo.created_at).toLocaleString()}</p>
                        </div>

                        <button
                            onClick={() => {
                                setUpdateMode(true);
                                setUpdateTodoId(todo.todo_id);
                                setNewTodoText(todo.title);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 -mr-1 
                text-amber-400 hover:text-amber-600"
                            aria-label="Delete todo"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDeleteTodo(todo.todo_id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 -mr-1 
                text-amber-400 hover:text-amber-600"
                            aria-label="Delete todo"
                        >
                            {deletingTodoId === todo.todo_id ? <Spinner className="text-amber-600 size-5" /> : <Trash2 size={16} />}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Todos;