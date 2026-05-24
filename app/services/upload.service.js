import { supabase } from "../lib/supabase/client";

export const uploadAttachments = ({ fileName, file }) => supabase.storage.from("attachments").upload(fileName, file);

export const getUrlAttachments = (fileName) => supabase.storage.from("attachments").getPublicUrl(fileName);

export const removeAttachments = (file) => {
    const path = file?.url?.split("/storage/v1/object/public/attachments/")[1];
    return supabase.storage.from("attachments").remove([path]);
};

// Private bucket: id-cards
// Path scheme: <auth.uid>/<uuid>.<ext>  (จำเป็นต่อ RLS — ดู supabase/migrations/20260524160000_*)

export const uploadIdCard = async ({ userId, uid, file }) => {
    const ext = (file.name?.split(".").pop() || "bin").toLowerCase();
    const path = `${userId}/${uid}.${ext}`;
    const { data, error } = await supabase.storage
        .from("id-cards")
        .upload(path, file, { upsert: true });
    return { data, error, path };
};

export const createIdCardSignedUrl = async (path, expiresIn = 300) => {
    if (!path) return { data: null, error: null };
    return supabase.storage.from("id-cards").createSignedUrl(path, expiresIn);
};

export const removeIdCard = (path) => {
    if (!path) return Promise.resolve({ data: null, error: null });
    return supabase.storage.from("id-cards").remove([path]);
};
