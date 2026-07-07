import { supabase } from "../lib/supabase/client";
import { apiPost } from "../lib/api";

export const subscribeAuth = (callback) => {
    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => callback(session?.user ?? null));
    return () => subscription.unsubscribe();
};

export const login = (email, password) => supabase.auth.signInWithPassword({ email, password });

// Email OTP — ส่งรหัส 6 หลักไปที่อีเมล (เฉพาะผู้ใช้ที่มีบัญชีแล้ว: shouldCreateUser=false)
export const sendEmailOtp = (email) =>
    supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });

export const verifyEmailOtp = (email, token) => supabase.auth.verifyOtp({ email, token, type: "email" });

export const logout = () => supabase.auth.signOut();

export const getCurrentUser = () => supabase.auth.getUser();

export const updateUser = (email) => supabase.auth.updateUser({ email });

export const updatePassword = (password) => supabase.auth.updateUser({ password });

export const register = async ({ email, password, firstName, lastName, phone, gender }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };

    try {
        await apiPost("/api/auth/register", {
            first_name: firstName,
            last_name: lastName,
            phone,
            gender,
        });
    } catch (err) {
        return { error: err };
    }

    return { data };
};

export const loginWithGoogle = (redirectTo) =>
    supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
    });
