import { supabase } from "../lib/supabase/client";

export const getMenus = async () => supabase.from("menus").select("*");