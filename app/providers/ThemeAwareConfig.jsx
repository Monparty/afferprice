"use client";
import { ConfigProvider, theme as antTheme } from "antd";
import { volcano } from "@ant-design/colors";
import thTH from "antd/locale/th_TH";
import { useTheme } from "./ThemeProvider";

export function ThemeAwareConfig({ children }) {
    const { isDark } = useTheme();

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
                token: {
                    colorPrimary: volcano[5],
                },
                components: {
                    Input: {
                        colorPrimary: volcano[2],
                    },
                },
            }}
            locale={thTH}
        >
            {children}
        </ConfigProvider>
    );
}
