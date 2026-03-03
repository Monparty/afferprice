import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { volcano } from "@ant-design/colors";
import { ConfigProvider } from "antd";
import { NotificationProvider } from "./providers/NotificationProvider";

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
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: volcano[5],
                        },
                        components: {
                            Input: {
                                colorPrimary: volcano[2],
                            },
                        },
                    }}
                >
                    <NotificationProvider>{children}</NotificationProvider>
                </ConfigProvider>
            </body>
        </html>
    );
}
