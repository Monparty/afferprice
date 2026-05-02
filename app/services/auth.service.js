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

export const register = async ({ email, password, firstName, lastName, phone, gender }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };

    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            phone,
            gender,
        }),
    });

    if (!res.ok) {
        const { error: msg } = await res.json();
        return { error: new Error(msg) };
    }

    return { data };
};

export const loginWithGoogle = (redirectTo) =>
    supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
    });
