import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppHeader from "./components/layout/AppHeader";
import AppFooter from "./components/layout/AppFooter";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Afferprice | แหล่งรวมการประมูลสิ้นค้าจากทั่วไทย",
    description: "แหล่งรวมการประมูลสิ้นค้าจากทั่วไทย",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <AppHeader />
                <div className="w-full max-w-360 mx-auto px-4 md:px-10 py-6">{children}</div>
                <AppFooter />
            </body>
        </html>
    );
}
