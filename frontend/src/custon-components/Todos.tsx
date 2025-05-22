import { Check, Edit, Trash2 } from 'lucide-react';
import { useRootContext, useSessionContext } from '@/hooks/contextHooks';
import { useEffect } from 'react';
import supabaseClient from '@/supabaseClient';

const Todos = () => {
    const { todos, toggleTodo, deleteTodo, setTodos, setNewTodoText, setUpdateMode, setUpdateTodoId } = useRootContext();
    const { session } = useSessionContext();

    useEffect(() => {
        if (!session) return;
        const fetchTodos = async () => {
            const { data, error } = await supabaseClient.from('user_todos').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching todos:', error);
            } else {
                setTodos(data);
            }
        };
        fetchTodos();
    }, [session, setTodos]);

    if (todos.length === 0 || !session) {
        return (
            <div className="text-center py-8 text-amber-700/70">
                <p className="text-lg font-medium">No todos yet!</p>
                <p className="text-sm mt-1">Add a new task to get started</p>
            </div>
        );
    }


    return (
        <div className="space-y-3 overflow-y-auto h-[calc(100vh-300px)] hide-scrollbar">
            {todos.map((todo, index) => (
                <div
                    key={index}
                    className={`group relative p-4 bg-amber-100 rounded-lg border border-amber-600 transition-all duration-200 ${todo.completed ? 'opacity-75' : ''}`}
                >
                    <div className="flex items-start gap-3">
                        <button
                            onClick={() => toggleTodo(todo.todo_id)}
                            className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center 
                border-2 ${todo.completed
                                    ? 'bg-amber-500 border-amber-500 text-white'
                                    : 'border-amber-300 hover:border-amber-400'}`}
                            aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                            {todo.completed && <Check size={12} />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <h3
                                className={`text-sm font-medium ${todo.completed
                                    ? 'text-amber-700/70 line-through'
                                    : 'text-amber-900'}`}
                            >
                                {todo.title}
                            </h3>
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
                            onClick={() => deleteTodo(todo.todo_id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 -mr-1 
                text-amber-400 hover:text-amber-600"
                            aria-label="Delete todo"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Todos;