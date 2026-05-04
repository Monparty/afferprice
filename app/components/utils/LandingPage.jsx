"use client";
import { useEffect, useState } from "react";
import {
    ArrowRightOutlined,
    FireOutlined,
    FormatPainterOutlined,
    GroupOutlined,
    LaptopOutlined,
    SketchOutlined,
    AppstoreOutlined,
    BarsOutlined,
} from "@ant-design/icons";
import { useForm } from "react-hook-form";
import UseTabs from "./UseTabs";
import CardZoomImage from "./CardZoomImage";
import CardProduct from "./CardProduct";
import UseButton from "../inputs/UseButton";
import UseSegmented from "../inputs/UseSegmented";
import UseCarousel from "./UseCarousel";
import UseCollapse from "./UseCollapse";
import { getActiveProductsWithDetails } from "@/app/services/products.service";
import UseSkeleton from "./UseSkeleton";

function formatTimeRemaining(endTime) {
    if (!endTime) return "--:--:--";
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return "หมดเวลา";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function toCardProps(p) {
    return {
        image: p.images_url?.[0]?.url || "https://placehold.co/400x400",
        time: formatTimeRemaining(p.auction_end_time),
        category: p.categories?.name,
        name: p.title,
        price: p.start_price,
        bid: p.bids?.length ?? 0,
    };
}

function CardSkeleton() {
    return (
        <div className="grid gap-6">
            <UseSkeleton />
            <UseSkeleton />
        </div>
    );
}

function ProductGrid({ items, loading }) {
    if (loading) {
        return <CardSkeleton />;
    }
    if (!items.length) {
        return <p className="text-center text-slate-400 py-12">ไม่มีสินค้าในหมวดหมู่นี้</p>;
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, i) => (
                <CardProduct key={i} {...item} />
            ))}
        </div>
    );
}

function LandingPage() {
    const { control } = useForm();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActiveProductsWithDetails().then(({ data }) => {
            if (data) setProducts(data);
            setLoading(false);
        });
    }, []);

    const byBids = (a, b) => (b.bids?.length ?? 0) - (a.bids?.length ?? 0);

    const filterCat = (keywords) =>
        products
            .filter((p) => keywords.some((kw) => p.categories?.name?.includes(kw)))
            .slice(0, 4)
            .map(toCardProps);

    const hotItems = [...products].sort(byBids).slice(0, 4).map(toCardProps);
    const electronicItems = filterCat(["อิเล็กทรอนิกส์", "กล้อง", "คอมพิวเตอร์", "สมาร์ทวอทช์"]);
    const artItems = filterCat(["ศิลปะ"]);
    const jewelryItems = filterCat(["เครื่องประดับ", "นาฬิกา"]);
    const amuletItems = filterCat(["พระเครื่อง"]);
    const popularItems = [...products].sort(byBids).slice(0, 8).map(toCardProps);

    // จับคู่ทีละ 2 เป็น slide
    const carouselSlides = [];
    for (let i = 0; i < Math.min(products.length, 6); i += 2) {
        carouselSlides.push(products.slice(i, i + 2));
    }

    const collapseItems = [
        {
            key: "1",
            label: "วิธีเสนอราคาประมูลทำอย่างไร?",
            children: (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    เข้าสู่ระบบแล้วคลิก &quot;เสนอราคาประมูล&quot; ในหน้ารายการสินค้า ใส่จำนวนเงินที่ต้องการเสนอ
                    (ต้องสูงกว่าราคาปัจจุบันอย่างน้อย 1 ขั้น) แล้วยืนยัน
                    ระบบจะแจ้งเตือนทันทีเมื่อมีผู้เสนอราคาสูงกว่าคุณ
                </p>
            ),
        },
        {
            key: "2",
            label: "มีช่องทางชำระเงินอะไรบ้าง?",
            children: (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    รองรับ 4 ช่องทาง ได้แก่ <strong>PromptPay</strong> (สแกน QR Code), <strong>บัตรเครดิต/เดบิต</strong>{" "}
                    (Visa, Mastercard), <strong>โอนผ่านธนาคาร</strong> และ <strong>กระเป๋าเงินอิเล็กทรอนิกส์</strong> —
                    ทุกช่องทางมีระบบเข้ารหัสความปลอดภัยมาตรฐาน PCI DSS
                </p>
            ),
        },
        {
            key: "3",
            label: "หากชนะการประมูลจะทราบได้อย่างไร?",
            children: (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    เมื่อการประมูลสิ้นสุดระบบจะส่ง <strong>แจ้งเตือนในแอป</strong> และ <strong>อีเมล</strong>{" "}
                    ให้ผู้ชนะทันที คุณมีเวลา 24 ชั่วโมงในการชำระเงิน
                    หากเกินกำหนดระบบจะยกเลิกและมอบสิทธิ์ให้ผู้เสนอราคาถัดไป
                </p>
            ),
        },
        {
            key: "4",
            label: "สินค้าที่ลงประมูลต้องผ่านการตรวจสอบหรือไม่?",
            children: (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    ใช่ — ทุกรายการต้องผ่านทีมตรวจสอบก่อนเผยแพร่ ผู้ขายต้องอัปโหลดรูปภาพและเอกสารรับรองความแท้ (ถ้ามี)
                    กระบวนการตรวจสอบใช้เวลา 1–3 วันทำการ สินค้าที่ผ่านการตรวจจะแสดงป้าย &quot;รับรองแล้ว&quot;
                </p>
            ),
        },
    ];

    const tabItems = [
        {
            key: "1",
            label: (
                <div className="flex flex-col justify-center items-center gap-1 text-sm px-3">
                    <FireOutlined className="text-xl" />
                    มาแรง
                </div>
            ),
            children: <ProductGrid items={hotItems} loading={loading} />,
        },
        {
            key: "2",
            label: (
                <div className="flex flex-col justify-center items-center gap-1 text-sm px-3">
                    <LaptopOutlined className="text-xl" />
                    อิเล็กทรอนิกส์
                </div>
            ),
            children: <ProductGrid items={electronicItems} loading={loading} />,
        },
        {
            key: "3",
            label: (
                <div className="flex flex-col justify-center items-center gap-1 text-sm px-3">
                    <FormatPainterOutlined className="text-xl" />
                    ศิลปะ
                </div>
            ),
            children: <ProductGrid items={artItems} loading={loading} />,
        },
        {
            key: "4",
            label: (
                <div className="flex flex-col justify-center items-center gap-1 text-sm px-3">
                    <SketchOutlined className="text-xl" />
                    เครื่องประดับ
                </div>
            ),
            children: <ProductGrid items={jewelryItems} loading={loading} />,
        },
        {
            key: "5",
            label: (
                <div className="flex flex-col justify-center items-center gap-1 text-sm px-3">
                    <GroupOutlined className="text-xl" />
                    พระเครื่อง
                </div>
            ),
            children: <ProductGrid items={amuletItems} loading={loading} />,
        },
    ];

    return (
        <main className="flex min-h-screen w-full flex-col overflow-x-hidden">
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="flex w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                        <h2 className="text-2xl font-bold tracking-tight">ประมูลสดตอนนี้</h2>
                    </div>
                    <UseButton label="ดูทั้งหมด" type="default" icon={ArrowRightOutlined} iconPlacement />
                </div>

                {loading ? (
                    <CardSkeleton />
                ) : carouselSlides.length > 0 ? (
                    <UseCarousel>
                        {carouselSlides.map((pair, si) => (
                            <div key={si}>
                                <div className="flex gap-4">
                                    {pair.map((p) => (
                                        <div key={p.id} className="flex-1">
                                            <CardZoomImage
                                                backgroundImage={
                                                    p.images_url?.[0]?.url || "https://placehold.co/600x400"
                                                }
                                                title={p.title}
                                                price={p.start_price}
                                                bid={p.bids?.length ?? 0}
                                                state={new Date(p.auction_end_time) - new Date() < 3600000}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </UseCarousel>
                ) : null}
            </section>

            <section className="mb-8">
                <UseTabs items={tabItems} size="large" />
            </section>

            <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">การประมูลยอดนิยม</h2>
                    <UseSegmented
                        control={control}
                        name="layout"
                        options={[
                            { value: "1", icon: <BarsOutlined /> },
                            { value: "2", icon: <AppstoreOutlined /> },
                        ]}
                    />
                </div>
                {loading ? (
                    <CardSkeleton />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {popularItems.map((item, i) => (
                            <CardProduct key={i} {...item} />
                        ))}
                    </div>
                )}
            </section>
            <UseCollapse items={collapseItems} />
        </main>
    );
}

export default LandingPage;
