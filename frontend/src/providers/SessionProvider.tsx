import { useEffect, useState } from "react";
import { type Session } from "@supabase/supabase-js";
import supabaseClient from "../supabaseClient";
import { SessionContext } from "./contexts";

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })
        const {
            data: { subscription },
        } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
        return () => subscription.unsubscribe()
    }, []);


    async function signInWithGoogle() {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            console.error('Error signing in with Google:', error.message);
        }
    }

    async function signOut() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
        }
    }

    return (
        <SessionContext.Provider value={{ session, setSession, signInWithGoogle, signOut }}>
            {children}
        </SessionContext.Provider>
    );
};

export default SessionProvider;
