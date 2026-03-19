import { supabase } from "../lib/supabase/client";

export const getProfileById = (id) =>
    supabase.from("profiles").select("*").eq("id", id).single();
