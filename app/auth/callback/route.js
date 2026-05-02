import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    },
                },
            }
        );

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("id")
                .eq("id", data.user.id)
                .single();

            if (!profile) {
                const meta = data.user.user_metadata;
                await supabase.from("profiles").insert({
                    id: data.user.id,
                    first_name: meta?.full_name?.split(" ")[0] || meta?.name || "",
                    last_name: meta?.full_name?.split(" ").slice(1).join(" ") || "",
                    profile_image: meta?.avatar_url || null,
                });
            }
        }
    }

    return NextResponse.redirect(new URL("/", request.url));
}
