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
    if (!user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // check role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return response;
}

export const config = {
    matcher: ["/admin/:path*"],
};
