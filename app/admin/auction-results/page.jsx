"use client";
import UseImage from "@/app/components/utils/UseImage";
import UseTable from "@/app/components/utils/UseTable";
import UseTag from "@/app/components/utils/UseTag";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getAuctionResults } from "@/app/services/admin/auction-results.service";
import { formatDateTime } from "@/app/utils/dateUtils";
import { useColumnSearch } from "@/app/hooks/useColumnSearch";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function Page() {
    const { control, setValue } = useForm();
    const [dataSource, setDataSource] = useState([]);
    const { columnSearch } = useColumnSearch();

    useEffect(() => {
        getAuctionResults().then(({ data, error }) => {
            if (error) return notifyError(error);
            setDataSource(
                data.map((r) => ({
                    ...r,
                    key: r.id,
                    title: r.products?.title || "—",
                    imageUrl: r.products?.images_url?.[0]?.url || null,
                    winnerName: [r.winner?.first_name, r.winner?.last_name].filter(Boolean).join(" ") || "-",
                    sellerName: [r.seller?.first_name, r.seller?.last_name].filter(Boolean).join(" ") || "-",
                    createdAt: formatDateTime(r.ended_at),
                })),
            );
        });
    }, []);

    const columns = [
        {
            title: "รูปภาพ",
            dataIndex: "imageUrl",
            key: "imageUrl",
            width: 100,
            align: "center",
            render: (_, record) => <UseImage width={56} height={56} alt="thumbnail" src={record.imageUrl} />,
        },
        {
            title: "สินค้า",
            dataIndex: "title",
            key: "title",
            ...columnSearch("title", control, setValue),
        },
        {
            title: "ผู้ขาย",
            dataIndex: "sellerName",
            key: "sellerName",
        },
        {
            title: "ผู้ชนะ",
            dataIndex: "winnerName",
            key: "winnerName",
        },
        {
            title: "ราคาปิด",
            dataIndex: "final_price",
            key: "final_price",
            sorter: (a, b) => a.final_price - b.final_price,
            render: (_, record) => <span className="font-bold">฿{record.final_price?.toLocaleString()}</span>,
        },
        {
            title: "สถานะชำระเงิน",
            dataIndex: "payment_status",
            key: "payment_status",
            render: (_, record) => (
                <UseTag
                    label={record.payment_status}
                    variant="filled"
                    color={record.payment_status === "paid" ? "green" : "gold"}
                    className="capitalize"
                />
            ),
        },
        {
            title: "วันที่จบ",
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
