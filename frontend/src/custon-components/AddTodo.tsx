import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus, Send } from 'lucide-react'
import { useState } from 'react'
import { type Todo } from '@/types'
import { useRootContext } from '@/providers/RootContextProvider'
import { toast } from 'sonner'

const AddTodo = () => {
    const [newTodoText, setNewTodoText] = useState<string>('');
    const { addTodo } = useRootContext();

    const handleAddTodo = () => {
        toast("Todo added successfully!");
        if (newTodoText.trim() !== '') {
            addTodo({
                id: Date.now(),
                title: newTodoText.trim(),
                completed: false,
            } as Todo);
            setNewTodoText('');
        }
    };

    return (
        <div className='border border-amber-600 rounded-lg flex flex-col w-full h-[150px] p-2 justify-between gap-2'>
            <textarea name="todo" id="add-todo" placeholder='Add new todo' className='w-full rounded-lg focus:outline-none resize-none p-2 flex-1' value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} />

            <div className="actions flex justify-between items-center">
                <Button variant="default" className={cn("bg-amber-600 hover:bg-amber-700 cursor-pointer rounded-full")}
                    onClick={handleAddTodo}
                >
                    <Plus />
                </Button>
                <Button variant="default" className={cn("bg-amber-600 hover:bg-amber-700 cursor-pointer rounded-full flex items-center gap-2")}>
                    <Send /> Summarize
                </Button>
            </div>
        </div>
    )
}

export default AddTodo