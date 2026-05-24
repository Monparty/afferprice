import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function proxy(req) {
    let response = NextResponse.next();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        },
    );

    // check login
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    const pathname = req.nextUrl.pathname;

    // login แล้ว → ห้ามเข้า login
    if (pathname === "/login") {
        if (user) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
        return response;
    }

    // ยังไม่ login ให้ไป login
    if (pathname.startsWith("/admin")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (profile?.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    const authenticatedPaths = ["/user", "/checkout", "/payment", "/order"];
    if (authenticatedPaths.some((p) => pathname.startsWith(p))) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return response;
}

export const config = {
    matcher: ["/admin/:path*", "/login", "/user/:path*", "/checkout/:path*", "/payment/:path*", "/order/:path*"],
};
