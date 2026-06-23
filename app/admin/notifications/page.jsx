"use client";
import UseTable from "@/app/components/utils/UseTable";
import UseTag from "@/app/components/utils/UseTag";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getAllNotifications } from "@/app/services/admin/notifications.service";
import { formatDateTime } from "@/app/utils/dateUtils";
import { useColumnSearch } from "@/app/hooks/useColumnSearch";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const TYPE_COLOR = {
    bid: "blue",
    win: "green",
    lose: "red",
    payment: "gold",
    shipping: "purple",
};

function Page() {
    const { control, setValue } = useForm();
    const [dataSource, setDataSource] = useState([]);
    const { columnSearch } = useColumnSearch();

    useEffect(() => {
        getAllNotifications().then(({ data, error }) => {
            if (error) return notifyError(error);
            setDataSource(
                data.map((n) => ({
                    ...n,
                    key: n.id,
                    userName: [n.user?.first_name, n.user?.last_name].filter(Boolean).join(" ") || "-",
                    createdAt: formatDateTime(n.created_at),
                })),
            );
        });
    }, []);

    const columns = [
        {
            title: "ประเภท",
            dataIndex: "type",
            key: "type",
            render: (_, r) => (
                <UseTag label={r.type} variant="filled" color={TYPE_COLOR[r.type] || "default"} className="capitalize" />
            ),
        },
        {
            title: "ผู้รับ",
            dataIndex: "userName",
            key: "userName",
            ...columnSearch("userName", control, setValue),
        },
        {
            title: "หัวข้อ",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "ข้อความ",
            dataIndex: "message",
            key: "message",
        },
        {
            title: "อ่านแล้ว",
            dataIndex: "is_read",
            key: "is_read",
            render: (_, r) => (
                <UseTag
                    label={r.is_read ? "อ่านแล้ว" : "ยังไม่อ่าน"}
                    variant="filled"
                    color={r.is_read ? "green" : "gold"}
                />
            ),
        },
        {
            title: "วันที่",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            defaultSortOrder: "descend",
        },
    ];

    return (
        <main className="grid gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <UseTable columns={columns} dataSource={dataSource} />
            </div>
        </main>
    );
}

export default Page;
