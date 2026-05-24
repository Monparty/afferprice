"use client";
import UseTable from "@/app/components/utils/UseTable";
import UseTag from "@/app/components/utils/UseTag";
import UseImage from "@/app/components/utils/UseImage";
import UseButton from "@/app/components/inputs/UseButton";
import UseTooltip from "@/app/components/utils/UseTooltip";
import { useColumnSearch } from "@/app/hooks/useColumnSearch";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getBidsByProductId } from "@/app/services/admin/bids.service";
import { formatDateTime } from "@/app/utils/dateUtils";
import { LeftOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

function Page() {
    const { id } = useParams();
    const router = useRouter();
    const { control, setValue } = useForm();
    const [dataSource, setDataSource] = useState([]);
    const [product, setProduct] = useState(null);
    const { columnSearch } = useColumnSearch();

    useEffect(() => {
        if (!id) return;
        getBidsByProductId(id).then(({ data, error }) => {
            if (error) return notifyError(error);
            if (data?.[0]?.products) setProduct(data[0].products);
            setDataSource(
                data.map((item) => ({
                    ...item,
                    bidTime: formatDateTime(item.bid_time),
                    bidderName: item.profile
                        ? `${item.profile.first_name ?? ""} ${item.profile.last_name ?? ""}`.trim() ||
                          item.profile.email
                        : "—",
                    bidderEmail: item.profile?.email || "—",
                })),
            );
        });
    }, [id]);

    const columns = [
        {
            title: "ผู้ประมูล",
            dataIndex: "bidderName",
            key: "bidderName",
            ...columnSearch("bidderName", control, setValue),
        },
        {
            title: "อีเมล",
            dataIndex: "bidderEmail",
            key: "bidderEmail",
            ...columnSearch("bidderEmail", control, setValue),
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
            <div className="flex gap-2 items-center">
                <UseTooltip title="กลับ">
                    <UseButton
                        shape="circle"
                        icon={LeftOutlined}
                        size="large"
                        type="default"
                        onClick={() => router.back()}
                    />
                </UseTooltip>
            </div>
            {product && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex gap-4 items-center">
                    <UseImage width={80} height={80} alt="product" src={product.images_url?.[0]?.url || null} />
                    <div className="grid gap-1">
                        <div className="text-lg font-medium">{product.title}</div>
                        <div className="text-sm text-slate-500">
                            ราคาเริ่มต้น ฿{product.start_price?.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500">จำนวนการประมูล {dataSource.length} ครั้ง</div>
                    </div>
                </div>
            )}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <UseTable columns={columns} dataSource={dataSource} />
            </div>
        </main>
    );
}

export default Page;
