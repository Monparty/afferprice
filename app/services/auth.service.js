import { supabase } from "../lib/supabase/client";

export const subscribeAuth = (callback) => {
    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => callback(session?.user ?? null));
    return () => subscription.unsubscribe();
};

export const login = (email, password) => supabase.auth.signInWithPassword({ email, password });

export const logout = () => supabase.auth.signOut();

export const getCurrentUser = () => supabase.auth.getUser();

export const updateUser = (email) => supabase.auth.updateUser({ email });
