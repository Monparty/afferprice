import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { volcano } from "@ant-design/colors";
import { NotificationProvider } from "./providers/NotificationProvider";
import HolyLoader from "holy-loader";
import Providers from "./providers/Providers";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ThemeAwareConfig } from "./providers/ThemeAwareConfig";

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
