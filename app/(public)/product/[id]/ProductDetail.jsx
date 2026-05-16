"use client";
import { BarChartOutlined, SafetyOutlined } from "@ant-design/icons";
import UseButton from "@/app/components/inputs/UseButton";
import CardProductBid from "@/app/components/utils/CardProductBid";
import UseBreadcrumb from "@/app/components/utils/UseBreadcrumb";
import UseImageGroup from "@/app/components/utils/UseImageGroup";
import UseTag from "@/app/components/utils/UseTag";
import { useParams } from "next/navigation";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getProductById } from "@/app/services/products.service";
import { getBidsByProduct } from "@/app/services/bids.service";
import { supabase } from "@/app/lib/supabase/client";
import { useEffect, useState } from "react";

function formatTimeAgo(time) {
    const mins = Math.floor((Date.now() - new Date(time)) / 60000);
    if (mins < 1) return "เมื่อสักครู่";
    if (mins < 60) return `${mins} นาทีที่แล้ว`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`;
    return `${Math.floor(hrs / 24)} วันที่แล้ว`;
}

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [bids, setBids] = useState([]);

    const fetchBids = async (productId) => {
        const { data } = await getBidsByProduct(productId);
        if (data) setBids(data);
    };

    useEffect(() => {
        if (!id) return;
        const onGetProductById = async () => {
            const { data, error } = await getProductById(id);
            if (error) return notifyError(error);
            setProduct(data);
        };
        onGetProductById();
        fetchBids(id);

        const ch = supabase
            .channel(`bid-${id}`)
            .on("broadcast", { event: "new_bid" }, () => { fetchBids(id); })
            .subscribe();
        return () => { supabase.removeChannel(ch); };
    }, [id]);

    const formatProductImage = product?.images_url?.map((item) => ({
        id: item.uid,
        width: 100,
        height: 100,
        alt: item.name,
        src: item.url,
    }));

    const UseBreadcrumbItems = [
        { href: "", title: "product" },
        { title: "Luxury Profes..." },
    ];

    return (
        <main>
            <UseBreadcrumb items={UseBreadcrumbItems} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                        <div className="absolute top-4 left-4 z-10">
                            <span className="bg-accent-orange text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> กำลังประมูล
                            </span>
                        </div>
                        <UseImageGroup imageGroup={formatProductImage} alone />
                    </div>
                    <UseImageGroup imageGroup={formatProductImage} />
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
                        <div>
                            <h1 className="text-3xl font-extrabold mb-4 text-primary">{product?.title}</h1>
                            <p className="text-slate-600 leading-relaxed">{product?.description}</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-100">
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">ปีที่ผลิต</p>
                                <p className="font-semibold text-lg">x2023</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">สภาพสินค้า</p>
                                <p className="font-semibold text-lg text-emerald-600">xของใหม่ (Mint)</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">วัสดุ</p>
                                <p className="font-semibold text-lg">xOystersteel</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">การจัดส่ง</p>
                                <p className="font-semibold text-lg">รับประกันทั่วโลก</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold">ข้อมูลผู้ขาย</h3>
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="text-white bg-orange-600 h-9 w-9 flex items-center justify-center rounded-full">
                                    <SafetyOutlined className="text-2xl" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">ChronoElite Traders</span>
                                        <UseTag label="Top Seller" color="blue" variant="outlined" />
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        สำเร็จการประมูล 4,821 ครั้ง • คะแนนบวก 99.8%
                                    </p>
                                </div>
                                <UseButton label="ส่งข้อความ" type="default" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-4">
                    <div className="sticky top-12 space-y-6">
                        <CardProductBid product={product} onBidSuccess={() => fetchBids(id)} />
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> ประวัติการประมูล
                                </h3>
                                <span className="text-xs text-slate-400">{bids.length} รายการ</span>
                            </div>
                            <div className="space-y-3">
                                {bids.slice(0, 5).map((bid, i) => {
                                    const initials = bid.user_id.slice(0, 2).toUpperCase();
                                    const maskedId = `u***${bid.user_id.slice(-4)}`;
                                    const isLeader = i === 0;
                                    return (
                                        <div
                                            key={bid.id}
                                            className="flex items-center justify-between py-2 border-b border-slate-100"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{maskedId}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase">
                                                        {formatTimeAgo(bid.bid_time)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={`text-sm font-extrabold ${isLeader ? "text-emerald-600" : "text-slate-400"}`}
                                                >
                                                    ฿{Number(bid.bid_price).toLocaleString("th-TH")}
                                                </p>
                                                <p
                                                    className={`text-[10px] font-medium ${isLeader ? "text-emerald-600" : "text-slate-400"}`}
                                                >
                                                    {isLeader ? "ผู้นำประมูล" : "ถูกประมูลแซง"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {bids.length === 0 && (
                                    <p className="text-center text-slate-400 text-sm py-4">ยังไม่มีการประมูล</p>
                                )}
                            </div>
                            {bids.length > 5 && (
                                <div className="flex justify-center">
                                    <UseButton
                                        label={`ดูประวัติทั้งหมด ${bids.length} รายการ`}
                                        type="text"
                                        className="text-xs! font-bold! text-slate-400!"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="bg-orange-50 rounded-2xl p-6 border border-l-4 border-orange-600">
                            <div className="flex items-start gap-3">
                                <BarChartOutlined className="text-2xl text-orange-600!" />
                                <div>
                                    <h4 className="font-bold text-sm">ข้อมูลเชิงลึกจากตลาด</h4>
                                    <p className="text-xs text-orange-600 mt-1 leading-relaxed">
                                        รุ่นนี้กำลังเป็นที่นิยม +12.4% เหนือราคาป้าย
                                        สินค้าที่คล้ายกันประมูลไปในราคาสูงสุดเฉลี่ยที่ ฿577,500 ในไตรมาสนี้
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
