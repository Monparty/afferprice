import { supabase } from "../lib/supabase/client";

export const getProfileById = (id) => supabase.from("profiles").select("*").eq("id", id).maybeSingle();

export const updateProfileById = (id, data) => supabase.from("profiles").update(data).eq("id", id);
