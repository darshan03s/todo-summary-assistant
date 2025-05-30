import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router"
import { useSessionContext } from "@/hooks/contextHooks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"
import Spinner from "@/components/custom/Spinner"
import { useState } from "react"

const Navbar = () => {
    const { signInWithGoogle, session, signOut } = useSessionContext();

    const [loading, setLoading] = useState<boolean>(false);

    const handleLogout = async () => {
        setLoading(true);
        await signOut();
        setLoading(false);
    }

    return (
        <>
            <nav className="bg-amber-100 h-12 flex justify-between items-center px-4 border-b border-amber-200">
                <Link to="/" className="text-2xl font-bold text-amber-600">Todo Summary Assistant</Link>
                <div>
                    {session
                        ?
                        <div className="flex items-center gap-2">
                            <Avatar className="cursor-pointer">
                                <AvatarImage
                                    src={session.user.user_metadata?.avatar_url} alt={session.user.user_metadata?.name} />
                                <AvatarFallback>{session.user.user_metadata?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <Button className={cn("bg-amber-600 hover:bg-amber-700 rounded-full cursor-pointer")}
                                onClick={() => {
                                    handleLogout()
                                }}
                            >
                                {loading ? <Spinner className="text-white" /> : <LogOut />}
                            </Button>
                        </div>
                        :
                        <>
                            <Button className={cn("bg-amber-600 hover:bg-amber-700 cursor-pointer")}
                                onClick={() => {
                                    signInWithGoogle()
                                }}
                            >
                                Sign In
                            </Button>
                        </>}
                </div>
            </nav>
        </>
    )
}

export default Navbar