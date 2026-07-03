import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(req) {
    let response = NextResponse.next({ request: req });

    const supabase = createServerClient(
        process.env.SUPABASE_INTERNAL_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    // เขียน cookie ที่ refresh แล้วกลับเข้า request (ใช้ใน middleware นี้ต่อ)
                    cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
                    // สร้าง response ใหม่จาก request ที่อัปเดตแล้ว + เซ็ต cookie ลง response (ส่งกลับ browser)
                    response = NextResponse.next({ request: req });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    // redirect helper — ต้อง copy cookie ที่ refresh แล้วไปด้วย ไม่งั้น session หลุด
    const redirectTo = (path) => {
        const res = NextResponse.redirect(new URL(path, req.url));
        response.cookies.getAll().forEach((c) => res.cookies.set(c));
        return res;
    };

    // check login
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = req.nextUrl.pathname;

    // login แล้ว → ห้ามเข้า login
    if (pathname === "/login") {
        if (user) {
            return redirectTo("/admin");
        }
        return response;
    }

    // ยังไม่ login ให้ไป login
    if (pathname.startsWith("/admin")) {
        if (!user) {
            return redirectTo("/login");
        }
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (profile?.role !== "admin") {
            return redirectTo("/");
        }
    }

    const authenticatedPaths = ["/user", "/checkout", "/payment", "/order"];
    if (authenticatedPaths.some((p) => pathname.startsWith(p))) {
        if (!user) {
            return redirectTo("/login");
        }
    }

    return response;
}

export const config = {
    matcher: ["/admin/:path*", "/login", "/user/:path*", "/checkout/:path*", "/payment/:path*", "/order/:path*"],
};
