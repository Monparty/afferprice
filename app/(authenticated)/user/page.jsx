"use client";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
    DownloadOutlined,
    EyeFilled,
    FieldTimeOutlined,
    RiseOutlined,
    TrophyFilled,
    MoreOutlined,
} from "@ant-design/icons";
import UseTable from "../../components/utils/UseTable";
import UseImage from "../../components/utils/UseImage";
import UseTag from "../../components/utils/UseTag";
import UseSegmented from "../../components/inputs/UseSegmented";
import UseButton from "../../components/inputs/UseButton";
import { useForm } from "react-hook-form";
import { getMyActiveBids, getMyFavoritesCount, getMyWonAuctionsCount } from "@/app/services/bids.service";
import { notifyError } from "@/app/providers/NotificationProvider";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

function getTimeRemaining(endTime) {
    const diff = dayjs(endTime).diff(dayjs());
    if (diff <= 0) return "หมดเวลาแล้ว";
    const d = dayjs.duration(diff);
    const days = Math.floor(d.asDays());
    const hours = d.hours();
    const mins = d.minutes();
    if (days > 0) return `${days} วัน ${hours} ชม. ${mins} นาที`;
    if (hours > 0) return `${hours} ชม. ${mins} นาที`;
    return `${mins} นาที`;
}

function Page() {
    const { control, watch } = useForm({ defaultValues: { filter: "1" } });
    const filter = watch("filter");
    const user = useSelector((state) => state.user.data);

    const [bids, setBids] = useState([]);
    const [stats, setStats] = useState({ active: 0, won: 0, favorites: 0 });

    useEffect(() => {
        const fetchData = async () => {
            const [bidsRes, wonRes, favRes] = await Promise.all([
                getMyActiveBids(),
                getMyWonAuctionsCount(),
                getMyFavoritesCount(),
            ]);

            if (bidsRes.error) return notifyError(bidsRes.error);

            const seenProducts = new Set();
            const uniqueActiveBids = (bidsRes.data || []).filter((bid) => {
                if (!bid.products || bid.products.state !== "active") return false;
                if (seenProducts.has(bid.product_id)) return false;
                seenProducts.add(bid.product_id);
                return true;
            });

            setBids(uniqueActiveBids);
            setStats({
                active: uniqueActiveBids.length,
                won: wonRes.count || 0,
                favorites: favRes.count || 0,
            });
        };
        fetchData();
    }, []);

    const filteredBids = useMemo(() => {
        if (filter === "2") return bids.filter((b) => b.is_winning);
        if (filter === "3") return bids.filter((b) => !b.is_winning);
        return bids;
    }, [bids, filter]);

    const columns = [
        {
            title: "รายละเอียด",
            key: "img",
            width: 80,
            align: "center",
            render: (_, record) => (
                <UseImage
                    width={60}
                    height={60}
                    alt={record.products?.title}
                    src={record.products?.images_url?.[0]?.url}
                />
            ),
        },
        {
            title: "ชื่อสินค้า",
            key: "title",
            render: (_, record) => <div className="font-medium">{record.products?.title}</div>,
        },
        {
            title: "สถานะ",
            key: "status",
            align: "center",
            render: (_, record) =>
                record.is_winning ? (
                    <UseTag label="คุณกำลังนำ" color="green" />
                ) : (
                    <UseTag label="ถูกประมูลแซง" color="volcano" />
                ),
        },
        {
            title: "ราคาที่เสนอ",
            key: "bid_price",
            render: (_, record) => <div className="font-bold">฿{record.bid_price?.toLocaleString()}</div>,
        },
        {
            title: "เวลาคงเหลือ",
            key: "remainTime",
            render: (_, record) => (
                <>
                    <FieldTimeOutlined /> {getTimeRemaining(record.products?.auction_end_time)}
                </>
            ),
        },
        {
            title: "จัดการ",
            align: "center",
            render: (_, record) =>
                record.is_winning ? <UseButton shape="circle" icon={MoreOutlined} /> : <UseButton label="ประมูลด่วน" />,
        },
    ];

    return (
        <>
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900">
                        แดชบอร์ดผู้ใช้งาน
                    </h1>
                    <p className="text-slate-500 text-base font-normal">
                        ยินดีต้อนรับกลับมา {user?.first_name || ""} นี่คือสรุปภาพรวมการประมูลของคุณ
                    </p>
                </div>
                <UseButton label="ดาวน์โหลดรายงาน" icon={DownloadOutlined} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            การประมูลที่กำลังร่วม
                        </p>
                        <RiseOutlined className="text-2xl text-green-500!" />
                    </div>
                    <p className="text-3xl font-bold leading-tight">{stats.active}</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">สินค้าที่ชนะ</p>
                        <TrophyFilled className="text-2xl text-blue-500!" />
                    </div>
                    <p className="text-3xl font-bold leading-tight">{stats.won}</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">กำลังติดตาม</p>
                        <EyeFilled className="text-2xl text-orange-600!" />
                    </div>
                    <p className="text-3xl font-bold leading-tight">{stats.favorites}</p>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold">รายการประมูลปัจจุบันของคุณ</h2>
                    <UseSegmented
                        control={control}
                        name="filter"
                        options={[
                            { value: "1", label: "ทั้งหมด" },
                            { value: "2", label: "กำลังนำ" },
                            { value: "3", label: "ถูกแซง" },
                        ]}
                    />
                </div>
                <UseTable columns={columns} dataSource={filteredBids} rowKey="id" />
            </div>
        </>
    );
}

export default Page;
