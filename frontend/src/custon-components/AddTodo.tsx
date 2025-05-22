import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Edit, Plus, Send } from 'lucide-react'
import { type Todo } from '@/types'
import { useRootContext, useSessionContext } from '@/hooks/contextHooks'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react'
import Spinner from '@/custon-components/Spinner'
import { parseTodos, summarizeTodos } from '@/utils'

const AddTodo = () => {
    const { newTodoText, setNewTodoText, addTodo, updateMode, updateTodo, todos } = useRootContext();
    const { session } = useSessionContext();
    const [loading, setLoading] = useState<boolean>(false);

    const handleAddTodo = () => {
        if (!session) {
            toast("You must be logged in to add a todo!");
            return;
        }
        if (newTodoText.trim() !== '') {
            addTodo({
                todo_id: uuidv4(),
                title: newTodoText.trim(),
                completed: false,
            } as Todo);
            setNewTodoText('');
        }
    };

    const handleSummarize = async () => {
        if (!session) {
            toast("You must be logged in to summarize a todos!");
            return;
        }
        setLoading(true);
        const allTodos: string = parseTodos(todos);
        const summary: string = await summarizeTodos(allTodos);
        toast(summary);
        setLoading(false);
    };

    return (
        <div className='border border-amber-600 rounded-lg flex flex-col w-full h-[150px] p-2 justify-between gap-2'>
            <textarea name="todo" id="add-todo" placeholder='Add new todo' className='w-full rounded-lg focus:outline-none resize-none p-2 flex-1' value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} />

            <div className="actions flex justify-between items-center">
                {updateMode ? (
                    <Button variant="default" className={cn("bg-amber-600 hover:bg-amber-700 cursor-pointer rounded-full")}
                        onClick={updateTodo}
                    >
                        <Edit />
                    </Button>
                ) : (
                    <Button variant="default" className={cn("bg-amber-600 hover:bg-amber-700 cursor-pointer rounded-full")}
                        onClick={handleAddTodo}
                    >
                        <Plus />
                    </Button>
                )}

                <Button
                    variant="default"
                    className={cn("bg-amber-600 hover:bg-amber-700 cursor-pointer rounded-full flex items-center gap-2")}
                    onClick={handleSummarize}
                >
                    {loading ? <Spinner /> : <Send />}
                    Summarize
                </Button>
            </div>
        </div>
    )
}

export default AddTodo