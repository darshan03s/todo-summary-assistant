import { Route, Routes } from "react-router"
import Auth from "./pages/Auth"
import Home from "./pages/Home"
import Navbar from "./custon-components/Navbar"
import RootContextProvider from "./providers/RootContextProvider"
import { Toaster } from "@/components/ui/sonner"

const App = () => {
  return (
    <>
      <Navbar />
      <RootContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </RootContextProvider>
      <Toaster />
    </>
  )
}

export default App