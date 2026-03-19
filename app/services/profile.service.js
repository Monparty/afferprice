import { supabase } from "../lib/supabase/client";

export const getProfileByUserId = (userId) =>
    supabase.from("profiles").select("id, first_name, role").eq("id", userId).single();
