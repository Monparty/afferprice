"use client";
import UseTable from "@/app/components/utils/UseTable";
import UseTag from "@/app/components/utils/UseTag";
import UseImage from "@/app/components/utils/UseImage";
import { useColumnSearch } from "@/app/hooks/useColumnSearch";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getAllBids } from "@/app/services/admin/bids.service";
import { formatDateTime } from "@/app/utils/dateUtils";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

function Page() {
    const { control, setValue } = useForm();
    const [dataSource, setDataSource] = useState([]);
    const { columnSearch } = useColumnSearch();

    useEffect(() => {
        getAllBids().then(({ data, error }) => {
            if (error) return notifyError(error);
            setDataSource(
                data.map((item) => ({
                    ...item,
                    bidTime: formatDateTime(item.bid_time),
                    productTitle: item.products?.title || "—",
                    imageUrl: item.products?.images_url?.[0]?.url || null,
                    bidderName: item.profile
                        ? `${item.profile.first_name ?? ""} ${item.profile.last_name ?? ""}`.trim() ||
                          item.profile.email
                        : "—",
                })),
            );
        });
    }, []);

    const columns = [
        {
            title: "รูปภาพ",
            dataIndex: "imageUrl",
            key: "imageUrl",
            width: 120,
            align: "center",
            render: (_, record) => <UseImage width={60} height={60} alt="product thumbnail" src={record.imageUrl} />,
        },
        {
            title: "ผู้ประมูล",
            dataIndex: "bidderName",
            key: "bidderName",
            ...columnSearch("bidderName", control, setValue),
        },
        {
            title: "สินค้า",
            dataIndex: "productTitle",
            key: "productTitle",
            ...columnSearch("productTitle", control, setValue),
        },
        {
            title: "ราคาประมูล",
            dataIndex: "bid_price",
            key: "bid_price",
            sorter: (a, b) => a.bid_price - b.bid_price,
            render: (_, record) => <>฿{record.bid_price?.toLocaleString()}</>,
        },
        {
            title: "วันที่ประมูล",
            dataIndex: "bidTime",
            key: "bidTime",
            sorter: (a, b) => a.bidTime.localeCompare(b.bidTime),
            defaultSortOrder: "descend",
        },
        {
            title: "สถานะ",
            dataIndex: "is_winning",
            key: "is_winning",
            render: (_, record) =>
                record.is_winning ? (
                    <UseTag label="ชนะ" color="green" variant="filled" />
                ) : (
                    <UseTag label="ไม่ชนะ" color="default" />
                ),
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
