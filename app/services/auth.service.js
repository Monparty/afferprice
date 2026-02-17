import { supabase } from "../lib/supabase/client";

export const login = (email, password) => supabase.auth.signInWithPassword({ email, password });

export const logout = () => supabase.auth.signOut();

export const getCurrentUser = () => supabase.auth.getUser();
