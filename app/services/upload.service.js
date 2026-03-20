import { supabase } from "../lib/supabase/client";

export const uploadAttachments = ({ fileName, file }) => supabase.storage.from("attachments").upload(fileName, file);

export const getUrlAttachments = (fileName) => supabase.storage.from("attachments").getPublicUrl(fileName);
