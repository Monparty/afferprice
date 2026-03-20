import { supabase } from "../lib/supabase/client";

export const getMenus = () => supabase.from("menus").select("*");