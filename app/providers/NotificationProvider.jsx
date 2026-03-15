"use client";
import { notification } from "antd";
import { useEffect } from "react";
import AppHeader from "../components/layout/AppHeader";
import AppFooter from "../components/layout/AppFooter";
import { usePathname } from "next/navigation";

let notificationApi = null;

export const notifyError = (error) => {
    if (!notificationApi) return;
    notificationApi.error({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        placement: "topRight",
    });
    return;
};

export const notifySuccess = (description) => {
    if (!notificationApi) return;
    notificationApi.success({
        title: "Success",
        description,
        placement: "topRight",
    });
};

export const NotificationProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        notificationApi = api;
    }, [api]);

    const pathname = usePathname();
    const hiddenPrefixes = ["/admin", "/login", "/register"];
    const isHidden = hiddenPrefixes.some((path) => pathname.startsWith(path));

    return (
        <>
            {!isHidden && <AppHeader />}
            {contextHolder}
            {children}
            {!isHidden && <AppFooter />}
        </>
    );
};
