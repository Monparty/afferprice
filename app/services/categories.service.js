import { supabase } from "../lib/supabase/client";

export const getParentCategories = () =>
    supabase.from("categories").select("id, name").eq("status", "active").is("parent_id", null);
