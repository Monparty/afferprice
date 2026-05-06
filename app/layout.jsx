import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { volcano } from "@ant-design/colors";
import { NotificationProvider } from "./providers/NotificationProvider";
import HolyLoader from "holy-loader";
import Providers from "./providers/Providers";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ThemeAwareConfig } from "./providers/ThemeAwareConfig";
import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    metadataBase: new URL("https://www.afferprice.com"),
    title: {
        default: "Afferprice | แหล่งรวมการประมูลสินค้าจากทั่วไทย",
        template: "%s | Afferprice",
    },
    description:
        "แพลตฟอร์มประมูลสินค้าออนไลน์ที่ใหญ่ที่สุดในไทย ประมูลสินค้ามือสอง สินค้าหายาก และสินค้าลักชัวรี่ ราคาเริ่มต้นที่คุ้มค่า",
    keywords: ["ประมูลออนไลน์", "ประมูลสินค้า", "auction ไทย", "สินค้ามือสอง", "ลักชัวรี่ประมูล", "afferprice"],
    authors: [{ name: "Afferprice" }],
    creator: "Afferprice",
    publisher: "Afferprice",
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    openGraph: {
        type: "website",
        locale: "th_TH",
        url: "https://www.afferprice.com",
        siteName: "Afferprice",
        title: "Afferprice | แหล่งรวมการประมูลสินค้าจากทั่วไทย",
        description:
            "แพลตฟอร์มประมูลสินค้าออนไลน์ที่ใหญ่ที่สุดในไทย ประมูลสินค้ามือสอง สินค้าหายาก และสินค้าลักชัวรี่",
    },
    twitter: {
        card: "summary_large_image",
        title: "Afferprice | ประมูลสินค้าออนไลน์",
        description: "แพลตฟอร์มประมูลสินค้าออนไลน์ที่ใหญ่ที่สุดในไทย",
    },
    alternates: {
        canonical: "https://www.afferprice.com",
    },
};

const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Afferprice",
    url: "https://www.afferprice.com",
    logo: "https://www.afferprice.com/logo.png",
    sameAs: [],
    contactPoint: { "@type": "ContactPoint", contactType: "customer service", availableLanguage: "Thai" },
};

export default function RootLayout({ children }) {
    return (
        <html lang="th">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Script id="org-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
                <HolyLoader color={volcano[5]} height={3} speed={250} easing="ease" showSpinner={false} />
                <ThemeProvider>
                    <ThemeAwareConfig>
                        <Providers>
                            <NotificationProvider>{children}</NotificationProvider>
                        </Providers>
                    </ThemeAwareConfig>
                </ThemeProvider>
            </body>
        </html>
    );
}
