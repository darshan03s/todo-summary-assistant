import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Edit, Plus, Send } from 'lucide-react'
import { type Todo } from '@/types'
import { useRootContext, useSessionContext } from '@/hooks/contextHooks'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react'
import Spinner from '@/components/custom/Spinner'
import { parseTodos, summarizeTodos } from '@/utils'
import SentToSlackModal from '@/components/custom/SentToSlackModal'

const AddTodo = () => {
    const { newTodoText, setNewTodoText, addTodo, updateMode, updateTodo, todos } = useRootContext();
    const { session } = useSessionContext();
    const [loadingSummarize, setLoadingSummarize] = useState<boolean>(false);
    const [loadingAddTodo, setLoadingAddTodo] = useState<boolean>(false);
    const [loadingUpdateTodo, setLoadingUpdateTodo] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [summary, setSummary] = useState<string>("");

    const handleAddTodo = async () => {
        if (!session) {
            toast("You must be logged in to add a todo!");
            return;
        }
        if (newTodoText.trim() !== '') {
            setLoadingAddTodo(true);
            await addTodo({
                todo_id: uuidv4(),
                title: newTodoText.trim(),
                completed: false,
            } as Todo);
            setNewTodoText('');
            setLoadingAddTodo(false);
        }
    };

    const handleSummarize = async () => {
        if (!session) {
            toast("You must be logged in to summarize a todos!");
            return;
        }
        setLoadingSummarize(true);
        const allTodos: string = parseTodos(todos);
        const { summary, slackResponse } = await summarizeTodos(allTodos);
        if (slackResponse.error) {
            toast(slackResponse.error, { duration: 5000 });
            setLoadingSummarize(false);
            return;
        }
        setSummary(summary);
        setIsModalOpen(true);
        setLoadingSummarize(false);
    };

    const handleUpdateTodo = async () => {
        if (!session) {
            toast("You must be logged in to update a todo!");
            return;
        }
        setLoadingUpdateTodo(true);
        await updateTodo();
        setLoadingUpdateTodo(false);
    }

    return (
        <>
            <div className='border border-amber-600 rounded-lg flex flex-col w-full h-[150px] p-2 justify-between gap-2'>
                <textarea name="todo" id="add-todo" placeholder='Add new todo' className='w-full rounded-lg focus:outline-none resize-none p-2 flex-1' value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} />

                <div className="actions flex justify-between items-center">
                    {updateMode ? (
                        <Button variant="default" className={cn("bg-amber-600 hover:bg-amber-700 cursor-pointer rounded-full")}
                            onClick={handleUpdateTodo}
                        >
                            {loadingUpdateTodo ? <Spinner /> : <Edit />}
                        </Button>
                    ) : (
                        <Button variant="default" className={cn("bg-amber-600 hover:bg-amber-700 cursor-pointer rounded-full")}
                            onClick={handleAddTodo}
                        >
                            {loadingAddTodo ? <Spinner /> : <Plus />}
                        </Button>
                    )}

                    <Button
                        variant="default"
                        className={cn("bg-amber-600 hover:bg-amber-700 cursor-pointer rounded-full flex items-center gap-2")}
                        onClick={handleSummarize}
                    >
                        {loadingSummarize ? <Spinner /> : <Send />}
                        Summarize
                    </Button>
                </div>
            </div>

            <SentToSlackModal open={isModalOpen} onOpenChange={setIsModalOpen} summary={summary} />
        </>
    )
}

export default AddTodo