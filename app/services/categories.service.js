import { supabase } from "../lib/supabase/client";

export const getParentCategories = () => supabase.from("categories").select("id, name").is("parent_id", null);
