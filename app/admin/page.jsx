"use client";
import UseImage from "../components/utils/UseImage";
import UseTable from "../components/utils/UseTable";
import UseTag from "../components/utils/UseTag";
import { ContainerOutlined, NotificationOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";
import { getDashboardStats } from "../services/admin/dashboard.service";
import { getProducts } from "../services/admin/products.service";
import { getAllBids } from "../services/admin/bids.service";
import { mapProductState } from "../utils/mapProductState";
import { ROUTES } from "./constants/routes";
import UseButton from "../components/inputs/UseButton";

dayjs.extend(relativeTime);
dayjs.locale("th");

function Page() {
    const [stats, setStats] = useState({ activeCount: 0, pendingCount: 0, totalRevenue: 0, newUsersCount: 0 });
    const [products, setProducts] = useState([]);
    const [recentBids, setRecentBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const [statsResult, productsResult, bidsResult] = await Promise.all([
                getDashboardStats(),
                getProducts(),
                getAllBids(),
            ]);
            if (statsResult) setStats(statsResult);
            if (productsResult.data) {
                const formatted = productsResult.data
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 10)
                    .map((p) => ({
                        ...p,
                        imageUrl: p.images_url?.[0]?.url || null,
                        ownerName: [p.profiles?.first_name, p.profiles?.last_name].filter(Boolean).join(" ") || "-",
                    }));
                setProducts(formatted);
            }
            if (bidsResult.data) setRecentBids(bidsResult.data.slice(0, 5));
            setLoading(false);
        };
        load();
    }, []);

    const columns = [
        {
            title: "สินค้า",
            dataIndex: "imageUrl",
            key: "imageUrl",
            width: 80,
            align: "center",
            render: (_, record) => <UseImage width={52} height={52} alt={record.title} src={record.imageUrl} />,
        },
        {
            title: "ชื่อสินค้า",
            dataIndex: "title",
            key: "title",
            render: (_, record) => (
                <Link href={`${ROUTES.ADMIN_PRODUCT}/${record.id}/edit`} className="font-medium hover:underline">
                    {record.title}
                </Link>
            ),
        },
        {
            title: "ผู้ขาย",
            dataIndex: "ownerName",
            key: "ownerName",
        },
        {
            title: "ราคาปัจจุบัน",
            dataIndex: "start_price",
            key: "start_price",
            render: (_, record) => <span className="font-bold">฿{record.start_price?.toLocaleString()}</span>,
        },
        {
            title: "สถานะ",
            dataIndex: "state",
            key: "state",
            render: (_, record) => {
                const { name, color } = mapProductState(record.state);
                return <UseTag label={name} variant="filled" color={color} />;
            },
        },
        {
            title: "สิ้นสุดประมูล",
            dataIndex: "auction_end_time",
            key: "auction_end_time",
            render: (_, record) =>
                record.auction_end_time ? dayjs(record.auction_end_time).format("DD/MM/YY HH:mm") : "-",
        },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 text-sm font-medium">รายได้ทั้งหมด</p>
                    </div>
                    <h3 className="text-2xl font-bold text-black tracking-tight">
                        ฿{stats.totalRevenue.toLocaleString()}
                    </h3>
                    <p className="text-slate-400 text-xs">จากการชำระเงินสำเร็จ</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 text-sm font-medium">การประมูลที่ใช้งานอยู่</p>
                        <NotificationOutlined />
                    </div>
                    <h3 className="text-2xl font-bold text-black tracking-tight">{stats.activeCount}</h3>
                    <p className="text-slate-400 text-xs">สินค้ากำลังประมูลอยู่</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 text-sm font-medium">รอการอนุมัติ</p>
                        <ContainerOutlined />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-amber-500">{stats.pendingCount}</h3>
                    <p className="text-slate-400 text-xs">ต้องดำเนินการเร่งด่วน</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 text-sm font-medium">ผู้ใช้งานใหม่</p>
                    </div>
                    <h3 className="text-2xl font-bold text-black tracking-tight">{stats.newUsersCount}</h3>
                    <p className="text-slate-400 text-xs">ใน 7 วันล่าสุด</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-black">สินค้าล่าสุด</h3>
                    <Link href={ROUTES.ADMIN_PRODUCT}>
                        <span className="text-sm text-primary hover:underline cursor-pointer">ดูทั้งหมด</span>
                    </Link>
                </div>
                <UseTable columns={columns} dataSource={products} loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h4 className="font-bold text-black mb-4">การประมูลล่าสุด</h4>
                    {loading ? (
                        <p className="text-slate-400 text-sm">กำลังโหลด...</p>
                    ) : recentBids.length === 0 ? (
                        <p className="text-slate-400 text-sm">ยังไม่มีการประมูล</p>
                    ) : (
                        <div className="space-y-4">
                            {recentBids.map((bid) => (
                                <div key={bid.id} className="flex gap-4">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="text-sm text-black">
                                            <span className="font-bold">
                                                {[bid.profile?.first_name, bid.profile?.last_name]
                                                    .filter(Boolean)
                                                    .join(" ") || "ผู้ใช้"}
                                            </span>{" "}
                                            ประมูล{" "}
                                            <span className="text-primary font-bold">{bid.products?.title || "-"}</span>{" "}
                                            ฿{bid.bid_price?.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-slate-400">{dayjs(bid.bid_time).fromNow()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-6 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="relative z-10 h-full flex flex-col justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-xl mb-2">จัดการสินค้ารออนุมัติ</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                มี {stats.pendingCount} รายการรอการตรวจสอบและอนุมัติจากแอดมิน
                            </p>
                        </div>
                        <Link href={`${ROUTES.ADMIN_PRODUCT}?state=pending_review`}>
                            <UseButton label="ไปยังหน้าอนุมัติ" size="large" wFull />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
