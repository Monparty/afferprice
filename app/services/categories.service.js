import { supabase } from "../lib/supabase/client";

export const getParentCategories = () =>
    supabase.from("categories").select("id, name, evaluation").eq("status", "active").is("parent_id", null);
