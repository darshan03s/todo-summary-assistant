import AddTodo from "@/components/custom/AddTodo"
import Todos from "@/components/custom/Todos"

const Home = () => {
    return (
        <main className="h-[calc(100vh-3rem)] flex items-center justify-center bg-amber-100">
            <div className="flex flex-col gap-4 w-[500px]">
                <AddTodo />
                <Todos />
            </div>
        </main>
    )
}

export default Home