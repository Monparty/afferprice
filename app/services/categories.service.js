import { supabase } from "../lib/supabase/client";

export const getCategories = () => supabase.from("categories").select("id, name").is("parent_id", null);
