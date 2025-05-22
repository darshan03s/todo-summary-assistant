import { Route, Routes } from "react-router"
import Home from "./pages/Home"
import Navbar from "./components/custom/Navbar"
import RootContextProvider from "./providers/RootContextProvider"
import { Toaster } from "@/components/ui/sonner"
import SessionProvider from "./providers/SessionProvider"

const App = () => {
  return (
    <>
      <SessionProvider>
        <Navbar />
        <RootContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </RootContextProvider>
      </SessionProvider>
      <Toaster />
    </>
  )
}

export default App