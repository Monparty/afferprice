"use client";
import UseTable from "@/app/components/utils/UseTable";
import UseImage from "@/app/components/utils/UseImage";
import UseTag from "@/app/components/utils/UseTag";
import UseButton from "@/app/components/inputs/UseButton";
import UseTooltip from "@/app/components/utils/UseTooltip";
import { useColumnSearch } from "@/app/hooks/useColumnSearch";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getBidsGroupedByProduct } from "@/app/services/admin/bids.service";
import { formatDateTime } from "@/app/utils/dateUtils";
import { mapProductState } from "@/app/utils/mapProductState";
import { EyeFilled } from "@ant-design/icons";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ROUTES } from "../constants/routes";

function Page() {
    const { control, setValue } = useForm();
    const [dataSource, setDataSource] = useState([]);
    const { columnSearch } = useColumnSearch();

    useEffect(() => {
        getBidsGroupedByProduct().then(({ data, error }) => {
            if (error) return notifyError(error);
            setDataSource(
                data.map((item) => ({
                    ...item,
                    key: item.product_id,
                    productTitle: item.product?.title || "—",
                    imageUrl: item.product?.images_url?.[0]?.url || null,
                    state: item.product?.state,
                    latestBidTime: formatDateTime(item.latest_bid_time),
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
            title: "สินค้า",
            dataIndex: "productTitle",
            key: "productTitle",
            ...columnSearch("productTitle", control, setValue),
        },
        {
            title: "จำนวนผู้ประมูล",
            dataIndex: "bidders_count",
            key: "bidders_count",
            align: "center",
            sorter: (a, b) => a.bidders_count - b.bidders_count,
            render: (_, record) => <>{record.bidders_count} คน</>,
        },
        {
            title: "จำนวนการประมูล",
            dataIndex: "bids_count",
            key: "bids_count",
            align: "center",
            sorter: (a, b) => a.bids_count - b.bids_count,
            render: (_, record) => <>{record.bids_count} ครั้ง</>,
        },
        {
            title: "ราคาสูงสุด",
            dataIndex: "highest_price",
            key: "highest_price",
            sorter: (a, b) => a.highest_price - b.highest_price,
            render: (_, record) => <>฿{record.highest_price?.toLocaleString()}</>,
        },
        {
            title: "สถานะสินค้า",
            dataIndex: "state",
            key: "state",
            render: (_, record) => {
                const { color } = mapProductState(record.state);
                return <UseTag label={record.state} variant="filled" color={color} className="capitalize" />;
            },
        },
        {
            title: "ประมูลล่าสุด",
            dataIndex: "latestBidTime",
            key: "latestBidTime",
            sorter: (a, b) => a.latestBidTime.localeCompare(b.latestBidTime),
            defaultSortOrder: "descend",
        },
        {
            title: "จัดการ",
            dataIndex: "action",
            key: "action",
            width: 100,
            align: "center",
            render: (_, record) => (
                <div className="flex gap-2 justify-center">
                    <UseTooltip title="ดูรายละเอียดการประมูล">
                        <Link href={`${ROUTES.ADMIN_BID}/${record.product_id}`}>
                            <UseButton shape="circle" className="bg-blue-500!" icon={EyeFilled} />
                        </Link>
                    </UseTooltip>
                </div>
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
