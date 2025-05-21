import { useContext } from "react";
import { RootContext, SessionContext } from "@/providers/contexts";

export const useRootContext = () => {
    const context = useContext(RootContext);
    if (!context) {
        throw new Error("useRootContext must be used within a RootContextProvider");
    }
    return context;
};

export const useSessionContext = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSessionContext must be used within a SessionContextProvider");
    }
    return context;
};