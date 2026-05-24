"use client";
import UseTable from "@/app/components/utils/UseTable";
import UseTag from "@/app/components/utils/UseTag";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getPayments } from "@/app/services/admin/payments.service";
import { formatDateTime } from "@/app/utils/dateUtils";
import { useColumnSearch } from "@/app/hooks/useColumnSearch";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const METHOD_COLOR = {
    promptpay: "blue",
    linepay: "green",
    wallet: "purple",
    credit_card: "geekblue",
    bank: "cyan",
};

const STATUS_COLOR = {
    success: "green",
    paid: "green",
    pending: "gold",
    failed: "red",
};

function Page() {
    const { control, setValue } = useForm();
    const [dataSource, setDataSource] = useState([]);
    const { columnSearch } = useColumnSearch();

    useEffect(() => {
        getPayments().then(({ data, error }) => {
            if (error) return notifyError(error);
            setDataSource(
                data.map((p) => ({
                    ...p,
                    key: p.id,
                    userName: [p.user?.first_name, p.user?.last_name].filter(Boolean).join(" ") || "-",
                    email: p.user?.email || "-",
                    createdAt: formatDateTime(p.created_at),
                })),
            );
        });
    }, []);

    const columns = [
        {
            title: "Transaction Ref",
            dataIndex: "transaction_ref",
            key: "transaction_ref",
            ...columnSearch("transaction_ref", control, setValue),
        },
        {
            title: "ผู้จ่าย",
            dataIndex: "userName",
            key: "userName",
        },
        {
            title: "อีเมล",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "จำนวนเงิน",
            dataIndex: "amount",
            key: "amount",
            sorter: (a, b) => a.amount - b.amount,
            render: (_, record) => <span className="font-bold">฿{record.amount?.toLocaleString()}</span>,
        },
        {
            title: "ช่องทาง",
            dataIndex: "payment_method",
            key: "payment_method",
            render: (_, record) => (
                <UseTag
                    label={record.payment_method}
                    variant="filled"
                    color={METHOD_COLOR[record.payment_method] || "default"}
                    className="capitalize"
                />
            ),
        },
        {
            title: "สถานะ",
            dataIndex: "payment_status",
            key: "payment_status",
            render: (_, record) => (
                <UseTag
                    label={record.payment_status}
                    variant="filled"
                    color={STATUS_COLOR[record.payment_status] || "default"}
                    className="capitalize"
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
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <UseTable columns={columns} dataSource={dataSource} />
            </div>
        </main>
    );
}

export default Page;
