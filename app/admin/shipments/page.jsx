"use client";
import UseImage from "@/app/components/utils/UseImage";
import UseTable from "@/app/components/utils/UseTable";
import UseTag from "@/app/components/utils/UseTag";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getShipments } from "@/app/services/admin/shipments.service";
import { formatDateTime } from "@/app/utils/dateUtils";
import { useColumnSearch } from "@/app/hooks/useColumnSearch";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const STATUS_COLOR = {
    preparing: "gold",
    shipped: "blue",
    delivered: "green",
    returned: "red",
};

function Page() {
    const { control, setValue } = useForm();
    const [dataSource, setDataSource] = useState([]);
    const { columnSearch } = useColumnSearch();

    useEffect(() => {
        getShipments().then(({ data, error }) => {
            if (error) return notifyError(error);
            setDataSource(
                data.map((s) => ({
                    ...s,
                    key: s.id,
                    title: s.auction_results?.products?.title || "—",
                    imageUrl: s.auction_results?.products?.images_url?.[0]?.url || null,
                    sellerName: [s.seller?.first_name, s.seller?.last_name].filter(Boolean).join(" ") || "-",
                    winnerName: [s.winner?.first_name, s.winner?.last_name].filter(Boolean).join(" ") || "-",
                    createdAt: formatDateTime(s.created_at),
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
            title: "ผู้รับ",
            dataIndex: "winnerName",
            key: "winnerName",
        },
        {
            title: "บริษัทขนส่ง",
            dataIndex: "shipping_company",
            key: "shipping_company",
        },
        {
            title: "Tracking",
            dataIndex: "tracking_number",
            key: "tracking_number",
            ...columnSearch("tracking_number", control, setValue),
        },
        {
            title: "สถานะ",
            dataIndex: "shipping_status",
            key: "shipping_status",
            render: (_, record) => (
                <UseTag
                    label={record.shipping_status}
                    variant="filled"
                    color={STATUS_COLOR[record.shipping_status] || "default"}
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
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <UseTable columns={columns} dataSource={dataSource} />
            </div>
        </main>
    );
}

export default Page;
