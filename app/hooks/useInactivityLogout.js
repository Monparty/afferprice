"use client";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/app/services/auth.service";
import { clearUser } from "@/app/features/user/userSlice";
import { supabase } from "@/app/lib/supabase/client";

const TIMEOUT = 2 * 60 * 60 * 1000;
const STORAGE_KEY = "lastActivity";

export function useInactivityLogout() {
    const dispatch = useDispatch();
    const router = useRouter();
    const timerRef = useRef(null);

    useEffect(() => {
        const updateActivity = () => {
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
        };

        const check = async () => {
            const last = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
            if (last && Date.now() - last > TIMEOUT) {
                await logout();
                dispatch(clearUser());
                localStorage.removeItem(STORAGE_KEY);
                router.push("/login");
            }
        };

        // ลบ key ทุกครั้งที่ออกจากระบบ (logout ปกติ หรือ session หมดอายุจาก Supabase)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") {
                localStorage.removeItem(STORAGE_KEY);
            }
        });

        updateActivity();

        const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
        events.forEach((e) => window.addEventListener(e, updateActivity, { passive: true }));
        timerRef.current = setInterval(check, 60_000);

        return () => {
            events.forEach((e) => window.removeEventListener(e, updateActivity));
            clearInterval(timerRef.current);
            subscription.unsubscribe();
        };
    }, [dispatch, router]);
}
