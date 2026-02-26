"use client";
import { notification } from "antd";
import { useEffect } from "react";

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

export const notifySuccess = (title, description) => {
    if (!notificationApi) return;
    notificationApi.success({
        title,
        description,
        placement: "topRight",
    });
};

export const NotificationProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        notificationApi = api;
    }, [api]);

    return (
        <>
            {contextHolder}
            {children}
        </>
    );
};
