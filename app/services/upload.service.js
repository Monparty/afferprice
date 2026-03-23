import { supabase } from "../lib/supabase/client";

export const uploadAttachments = ({ fileName, file }) => supabase.storage.from("attachments").upload(fileName, file);

export const getUrlAttachments = (fileName) => supabase.storage.from("attachments").getPublicUrl(fileName);

export const removeAttachments = (file) => {
    const path = file?.url?.split("/storage/v1/object/public/attachments/")[1];
    return supabase.storage.from("attachments").remove([path]);
};
