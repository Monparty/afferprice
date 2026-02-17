import { supabase } from "../lib/supabase/client";

export const getUsers = async () => supabase.from("profile").select("*");