import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router"

const Navbar = () => {
    return (
        <>
            <nav className="bg-amber-100 h-12 flex justify-between items-center px-4 border-b border-amber-200">
                <Link to="/" className="text-2xl font-bold text-amber-600">Todo Summarizer</Link>
                <div>
                    <Link className={cn(buttonVariants({ variant: "default" }), "bg-amber-600 hover:bg-amber-700 cursor-pointer")} to="/auth">Sign In</Link>
                </div>
            </nav>
        </>
    )
}

export default Navbar