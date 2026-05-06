import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://www.afferprice.com";

export default async function sitemap() {
    const staticRoutes = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
        { url: `${BASE_URL}/auction`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
        { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
        { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
        { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ];

    let productRoutes = [];
    try {
        const supabase = createClient();
        const { data } = await supabase
            .from("products")
            .select("id, updated_at")
            .eq("status", "active")
            .order("updated_at", { ascending: false })
            .limit(1000);

        if (data) {
            productRoutes = data.map((p) => ({
                url: `${BASE_URL}/product/${p.id}`,
                lastModified: new Date(p.updated_at),
                changeFrequency: "hourly",
                priority: 0.8,
            }));
        }
    } catch {
        // ถ้า fetch ไม่ได้ ยังคืน static routes ได้
    }

    return [...staticRoutes, ...productRoutes];
}
