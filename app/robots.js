export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin/", "/user/", "/api/", "/(auth)/"],
            },
        ],
        sitemap: "https://www.afferprice.com/sitemap.xml",
    };
}
