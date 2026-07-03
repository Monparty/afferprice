// Supabase origin สำหรับ CSP — derive จาก env เพื่อให้ทำงานได้ทั้ง prod (https)
// และ local/docker (http://127.0.0.1:54321). ถ้าไม่ตั้ง env fallback เป็น host prod เดิม
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://auiowkhqygdswdkexrip.supabase.co";
const supaOrigin = new URL(SUPABASE_URL).origin; // http://127.0.0.1:54321 | https://xxx.supabase.co
const supaWs = supaOrigin.replace(/^http/, "ws"); // ws://127.0.0.1:54321 | wss://xxx.supabase.co
const isHttps = supaOrigin.startsWith("https");

const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.omise.co`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${supaOrigin} https://picsum.photos`,
    `media-src 'self' blob: data: ${supaOrigin}`,
    "font-src 'self' data:",
    `connect-src 'self' ${supaOrigin} ${supaWs} https://*.omise.co`,
    "frame-src 'self' https://*.omise.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    // อย่า upgrade เป็น https ตอน local (Supabase local เป็น http) — จะทำให้ยิงไม่ถึง
    ...(isHttps ? ["upgrade-insecure-requests"] : []),
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
    // standalone build สำหรับ Docker (.next/standalone/server.js)
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "auiowkhqygdswdkexrip.supabase.co",
                pathname: "/storage/v1/object/public/**",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
            {
                // Supabase local storage (docker/dev)
                protocol: "http",
                hostname: "127.0.0.1",
                port: "54321",
                pathname: "/storage/v1/object/public/**",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "Content-Security-Policy", value: csp },
                    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
                    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
                ],
            },
        ];
    },
};

export default nextConfig;
