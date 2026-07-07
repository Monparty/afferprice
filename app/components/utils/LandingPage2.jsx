"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getActiveProductsWithDetails } from "@/app/services/products.service";
import { getParentCategories } from "@/app/services/categories.service";
import { getRecentlySoldPublic, getPlatformStats } from "@/app/services/landing.service";

/* ============================================================
   Afferprice — Landing Page 2 (Modern minimal · #FF6B1A)
   Converted from the design handoff "Afferprice Home.html"
   ============================================================ */

/* ---------- tiny icon helpers ---------- */
const Ico = ({ d, size = 18, fill = "none", stroke = "currentColor", strokeWidth = 1.6, children }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {d ? <path d={d} /> : children}
    </svg>
);

const ArrowRight = (p) => (
    <Ico {...p}>
        <path d="M5 12h14" />
        <path d="M13 5l7 7-7 7" />
    </Ico>
);
const Star = (p) => (
    <Ico fill="currentColor" stroke="none" {...p}>
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </Ico>
);
const Heart = ({ filled, ...p }) => (
    <Ico fill={filled ? "currentColor" : "none"} {...p}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Ico>
);
const Search = (p) => (
    <Ico {...p}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3-3" />
    </Ico>
);
const Bell = (p) => (
    <Ico {...p}>
        <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" />
        <path d="M10 21a2 2 0 0 0 4 0" />
    </Ico>
);
const Check = (p) => (
    <Ico {...p}>
        <path d="M20 6 9 17l-5-5" />
    </Ico>
);

/* ---------- small reusable parts ---------- */
const BrandMark = ({ size = 30 }) => (
    <span
        className="relative inline-block rounded-lg shadow-[inset_0_-2px_6px_rgba(0,0,0,.18),0_4px_12px_rgba(255,107,26,.28)]"
        style={{
            width: size,
            height: size,
            background: "conic-gradient(from 220deg at 50% 50%, #FF8A4A, #FF6B1A 40%, #E04A00 70%, #FF8A4A)",
        }}
    >
        <span
            className="absolute rounded-[4px] bg-white/20"
            style={{
                inset: 6,
                clipPath: "polygon(0 30%, 50% 0, 100% 30%, 100% 100%, 0 100%)",
            }}
        />
    </span>
);

const SectionHead = ({ eyebrow, title, live = false, more = "ดูทั้งหมด", showMore = true }) => (
    <div className="flex items-end justify-between gap-3 mt-14 mb-6">
        <div className="flex flex-col gap-1.5 min-w-0">
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[.12em] uppercase text-[#8B857E]">
                {live && <span className="ap-live-dot inline-block w-2 h-2 rounded-full bg-[#E11D48]" />}
                {eyebrow}
            </span>
            <h2 className="m-0 text-2xl sm:text-[32px] font-semibold tracking-[-.02em] leading-[1.1] text-[#161412]">{title}</h2>
        </div>
        {showMore && (
            <a
                href="#"
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#E8E5DE] bg-white text-[#4A4641] text-[14px] font-medium hover:bg-[#F4F3EE] hover:translate-x-0.5 transition no-underline"
            >
                {more}
                <ArrowRight />
            </a>
        )}
    </div>
);

/* ---------- live-data helpers ---------- */
const fmtBaht = (n) => (n == null ? "—" : Number(n).toLocaleString("th-TH"));

const pad2 = (n) => String(n).padStart(2, "0");

function formatCountdown(endTime, now = Date.now()) {
    if (!endTime) return "—";
    const diff = new Date(endTime).getTime() - now;
    if (diff <= 0) return "หมดเวลา";
    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (days >= 1) return `${days}d ${pad2(h)}:${pad2(m)}`;
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

function timeAgo(ts, now = Date.now()) {
    if (!ts) return "";
    const diff = now - new Date(ts).getTime();
    if (diff < 0) return "เพิ่งปิด";
    const min = Math.floor(diff / 60000);
    if (min < 1) return "เมื่อสักครู่";
    if (min < 60) return `${min} นาทีที่แล้ว`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} ชั่วโมงที่แล้ว`;
    const d = Math.floor(hr / 24);
    return `${d} วันที่แล้ว`;
}

/** ticking countdown — re-render ทุก 1 วินาทีผ่าน `now` ที่ส่งเข้ามา */
const Countdown = ({ endTime, now, prefix = "" }) => (
    <span>
        {prefix}
        {formatCountdown(endTime, now)}
    </span>
);

/** รูปจริงจาก images_url ถ้าไม่มี fallback เป็น gradient placeholder เดิม */
const Thumb = ({ image, fallback = "ap-ph-card", alt = "", className = "" }) =>
    image ? (
        <img src={image} alt={alt} className={`absolute inset-0 w-full h-full object-cover ${className}`} loading="lazy" />
    ) : (
        <div className={`absolute inset-0 ${fallback}`} />
    );

const highestBid = (p) => (p.bids?.length ? Math.max(...p.bids.map((b) => b.bid_price)) : null);
const bidderCount = (p) => p.bids?.length ?? 0;
const catFallback = (name) => {
    const map = {
        การ์ดสะสม: "card",
        พระเครื่อง: "amulet",
        เครื่องประดับ: "jewel",
        นาฬิกา: "watch",
        ศิลปะ: "art",
        "ART TOY": "toy",
        เหรียญ: "coin",
        แสตมป์: "stamp",
    };
    return map[name] || "card";
};

const DEFAULT_CAT_ICON = (
    <Ico>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </Ico>
);

/* ---------- data (static marketing content) ---------- */
const CATS = [
    {
        label: "มาแรง",
        count: 128,
        icon: (
            <Ico>
                <path d="M12 2c1 4 4 5 4 9a4 4 0 0 1-8 0c0-4 3-5 4-9Z" />
            </Ico>
        ),
    },
    {
        label: "อิเล็กทรอนิกส์",
        count: 42,
        icon: (
            <Ico>
                <rect x="2" y="4" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 18v3" />
            </Ico>
        ),
    },
    {
        label: "ศิลปะ",
        count: 86,
        icon: (
            <Ico>
                <path d="m12 19 7-7-3-3-7 7v3h3z" />
                <path d="m18 13-1.5-1.5" />
            </Ico>
        ),
    },
    {
        label: "เครื่องประดับ",
        count: 214,
        icon: (
            <Ico>
                <path d="m6 3 6 6 6-6" />
                <path d="m3 9 9 12L21 9" />
            </Ico>
        ),
    },
    {
        label: "พระเครื่อง",
        count: 309,
        icon: (
            <Ico>
                <path d="M3 7h18l-2 13H5L3 7Z" />
                <path d="M8 7V5a4 4 0 0 1 8 0v2" />
            </Ico>
        ),
    },
    {
        label: "นาฬิกา",
        count: 67,
        icon: (
            <Ico>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </Ico>
        ),
    },
    {
        label: "ART TOY",
        count: 94,
        icon: (
            <Ico>
                <rect x="3" y="6" width="18" height="13" rx="2" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </Ico>
        ),
    },
    {
        label: "เหรียญ",
        count: 53,
        icon: (
            <Ico>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v8M8 12h8" />
            </Ico>
        ),
    },
];

const STEPS = [
    {
        num: "STEP 01",
        title: "ค้นหาและเลือกรายการ",
        desc: "เลือกของสะสมจากหมวดหมู่ที่คุณสนใจ ทุกชิ้นผ่านการตรวจสอบความถูกต้องโดยผู้เชี่ยวชาญก่อนเปิดประมูล",
        icon: <Search size={24} />,
    },
    {
        num: "STEP 02",
        title: "เสนอราคาประมูล",
        desc: "ยืนยันตัวตนและฝากเงินมัดจำ จากนั้นเริ่มเสนอราคาแบบเรียลไทม์ พร้อมระบบ Auto-bid ตั้งวงเงินสูงสุดได้",
        icon: (
            <Ico size={24}>
                <path d="M14 9V5a3 3 0 0 0-6 0v4" />
                <rect x="3" y="9" width="18" height="12" rx="2" />
                <circle cx="12" cy="15" r="1.5" />
            </Ico>
        ),
    },
    {
        num: "STEP 03",
        title: "ชนะและรับสินค้า",
        desc: "เมื่อชนะการประมูล เราจะจัดส่งพร้อมประกันราคาเต็ม ตรวจรับก่อนชำระจริง ส่งคืนได้ภายใน 7 วันถ้าไม่ตรงตามคำบรรยาย",
        icon: <Check size={24} />,
    },
];

const TRUST = [
    {
        icon: (
            <Ico size={22}>
                <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
                <circle cx="12" cy="7" r="4" />
            </Ico>
        ),
        title: "ทีมผู้เชี่ยวชาญ 40+ คน",
        text: "นักประเมินที่ผ่านการรับรองในแต่ละหมวด ตรวจสอบทุกชิ้นด้วยตาเปล่าและเครื่องมือเฉพาะทาง",
    },
    {
        icon: (
            <Ico size={22}>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 10h18M7 15h4" />
            </Ico>
        ),
        title: "ใบรับรองความแท้ (COA)",
        text: "รายการมูลค่าเกิน 100,000 ฿ จะออกใบรับรองความแท้พร้อมเลขซีเรียลที่ตรวจสอบกลับได้",
    },
    {
        icon: (
            <Ico size={22}>
                <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z" />
            </Ico>
        ),
        title: "คุ้มครองผู้ซื้อเต็มจำนวน",
        text: "ตรวจรับก่อนชำระจริง คืนได้ภายใน 7 วันถ้าไม่ตรงคำบรรยาย พร้อมประกันราคาเต็มระหว่างการจัดส่ง",
    },
    {
        icon: (
            <Ico size={22}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </Ico>
        ),
        title: "การประมูลแบบเปิดเผย",
        text: "ราคาและจำนวนผู้ประมูลแบบเรียลไทม์ ไม่มี shill bidding ป้องกันการประมูลปลอมด้วย AI",
    },
];

const REVIEWS = [
    {
        featured: false,
        badge: "VERIFIED",
        text: "ประมูลพระเครื่องผ่านที่นี่มา 3 ปี ทีมตรวจสอบของแท้ละเอียดมาก เคยได้หลวงพ่อเงินสภาพสวยในราคาที่ตลาดยังไม่รู้ ระบบแจ้งเตือนเร็วทันใจ",
        name: "สมชาย พงษ์ไพศาล",
        meta: "นักสะสมพระเครื่อง · 142 ดีล",
        avatarBg: "linear-gradient(135deg, #B36430, #8B4520)",
        avatarChar: "ส",
    },
    {
        featured: true,
        badge: "TOP SELLER",
        text: "ขายนาฬิกาวินเทจที่สะสมไว้ ได้ราคาดีกว่าร้านรับซื้อทั่วไป 30-40% ทีมงานช่วยถ่ายรูปและเขียนคำบรรยายให้ฟรี ปิดดีลเร็วภายในสัปดาห์",
        name: "นพดล ภัทรกุล",
        meta: "ผู้ขาย · 28 รายการที่ขายได้",
        avatarBg: "linear-gradient(135deg, #2A4F8F, #1a3565)",
        avatarChar: "น",
    },
    {
        featured: false,
        badge: "VERIFIED",
        text: "เริ่มประมูลการ์ด One Piece TCG ที่นี่เพราะมั่นใจระบบตรวจของแท้ ไม่ต้องเสี่ยงเจอของปลอม ราคาขั้นต่ำสมเหตุสมผล และเสนอราคาผ่านมือถือลื่นมาก",
        name: "อนุชา วิริยะนุกูล",
        meta: "นักสะสมการ์ด TCG · 67 ดีล",
        avatarBg: "linear-gradient(135deg, #6F4F9A, #4a3268)",
        avatarChar: "อ",
    },
];

const FAQS = [
    {
        q: "วิธีเสนอราคาประมูลทำอย่างไร?",
        a: 'เข้าสู่ระบบและฝากเงินมัดจำขั้นต่ำ 5% ของราคาเริ่มต้น จากนั้นกด "เสนอราคาประมูล" ที่หน้ารายการ ราคาขั้นต่ำในการเพิ่มแต่ละครั้งจะแสดงในกล่องเสนอราคา หรือเปิด Auto-bid ระบบจะประมูลให้อัตโนมัติจนถึงวงเงินสูงสุดที่ตั้งไว้',
    },
    {
        q: "มีช่องทางชำระเงินอะไรบ้าง?",
        a: "รองรับโอนผ่านธนาคาร, PromptPay, บัตรเครดิต/เดบิต และ Crypto (BTC, USDT) สำหรับรายการมูลค่าสูงเกิน 500,000 บาท",
    },
    {
        q: "หากชนะการประมูลจะทราบได้อย่างไร?",
        a: "เมื่อการประมูลปิด ระบบจะแจ้งเตือนทันทีผ่านอีเมล SMS และ Push notification พร้อมรายละเอียดการชำระเงินและจัดส่ง คุณมีเวลา 48 ชั่วโมงในการชำระยอดส่วนที่เหลือ",
    },
    {
        q: "สินค้าที่ลงประมูลต้องผ่านการตรวจสอบหรือไม่?",
        a: "ทุกรายการต้องส่งให้ทีมผู้เชี่ยวชาญของ Afferprice ตรวจสอบความแท้ก่อนเปิดประมูล สำหรับรายการมูลค่าเกิน 100,000 บาท จะมีใบรับรองความแท้ออกให้ลูกค้าด้วย",
    },
];

const AVATAR_BG = {
    c1: "#2A4F8F",
    c2: "#B36430",
    c3: "#6F4F9A",
    c4: "#2A8F6E",
    c5: "#99553B",
};

/* ============================================================ */

function LandingPage2() {
    const [activeCat, setActiveCat] = useState(0);
    const [openFaq, setOpenFaq] = useState(0);
    const [favs, setFavs] = useState(() => new Set());
    const [activeNav, setActiveNav] = useState(0);

    // live data
    const [products, setProducts] = useState([]); // active products (browser client, anon-readable)
    const [categories, setCategories] = useState([]);
    const [sold, setSold] = useState([]);
    const [stats, setStats] = useState(null);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        getActiveProductsWithDetails().then(({ data }) => setProducts(data ?? []));
        getParentCategories().then(({ data }) => setCategories(data ?? []));
        getRecentlySoldPublic(6).then(({ data }) => setSold(data ?? []));
        getPlatformStats().then(({ data }) => setStats(data ?? null));
    }, []);

    // ticking clock for all countdowns
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    // active products เรียงตามใกล้ปิดก่อน (auction_end_time asc) + กรองที่ยังไม่หมดเวลา
    const activeProducts = useMemo(
        () => products.filter((p) => new Date(p.auction_end_time).getTime() > now - 1000),
        [products, now],
    );

    // หมวด chip: "ทั้งหมด" + parent categories ที่มีสินค้า active
    const catCounts = useMemo(() => {
        const m = new Map();
        for (const p of activeProducts) m.set(p.category_id, (m.get(p.category_id) ?? 0) + 1);
        return m;
    }, [activeProducts]);

    const catTabs = useMemo(() => {
        const real = categories
            .map((c) => ({ id: c.id, label: c.name, count: catCounts.get(c.id) ?? 0 }))
            .filter((c) => c.count > 0);
        return [{ id: null, label: "ทั้งหมด", count: activeProducts.length }, ...real];
    }, [categories, catCounts, activeProducts.length]);

    const selectedCatId = catTabs[activeCat]?.id ?? null;

    // grid สินค้า (กรองตามหมวดที่เลือก)
    const gridItems = useMemo(() => {
        const list = selectedCatId ? activeProducts.filter((p) => p.category_id === selectedCatId) : activeProducts;
        return list.slice(0, 8);
    }, [activeProducts, selectedCatId]);

    // hero = สินค้าที่มีคนประมูลมากสุด (ถ้าไม่มี bid ใช้ตัวใกล้ปิดสุด)
    const hero = useMemo(() => {
        if (!activeProducts.length) return null;
        const ranked = [...activeProducts].sort((a, b) => bidderCount(b) - bidderCount(a));
        return ranked[0];
    }, [activeProducts]);

    // sidebar "กำลังประมูลสด" = ประมูลคึกคักสุด 4 อันดับ
    const liveItems = useMemo(
        () => [...activeProducts].sort((a, b) => bidderCount(b) - bidderCount(a)).slice(0, 4),
        [activeProducts],
    );

    // "ใกล้ปิดประมูล" = ใกล้หมดเวลาสุด 4 รายการ
    const endingItems = useMemo(() => activeProducts.slice(0, 4), [activeProducts]);

    const toggleFav = (i) => {
        setFavs((prev) => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i);
            else next.add(i);
            return next;
        });
    };

    const navItems = ["หน้าแรก", "หมวดหมู่", "การประมูล", "สิ่งที่ถูกใจ", "สร้างรายการ"];

    return (
        <div className="ap-root //bg-[#FAFAF7] text-[#161412] min-h-screen">
            <LocalStyles />

            {/* ============ Header ============ */}
            <header
                className="hidden sticky top-0 z-50 border-b border-[#E8E5DE] backdrop-blur-[14px] backdrop-saturate-150"
                style={{ background: "rgba(250,250,247,.85)" }}
            >
                <div className="max-w-[1320px] mx-auto px-8 grid grid-cols-[auto_1fr_auto] items-center gap-8 h-[76px]">
                    <div className="flex items-center gap-2.5 font-semibold text-[19px] tracking-[-.01em]">
                        <BrandMark />
                        <span>Afferprice</span>
                    </div>
                    <nav className="flex items-center gap-1 justify-self-center">
                        {navItems.map((n, i) => (
                            <a
                                key={n}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveNav(i);
                                }}
                                className={[
                                    "no-underline px-4 py-2.5 rounded-full text-[15px] font-medium transition-colors",
                                    i === activeNav
                                        ? "text-[#161412] bg-white border border-[#E8E5DE] shadow-[0_1px_2px_rgba(20,18,15,.04),0_1px_1px_rgba(20,18,15,.03)]"
                                        : "text-[#4A4641] hover:bg-[#F4F3EE] hover:text-[#161412]",
                                ].join(" ")}
                            >
                                {n}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2.5 w-80 h-11 bg-white border border-[#E8E5DE] rounded-full px-4.5 text-[#8B857E] text-[14px] hover:border-[#DAD6CC] transition px-[18px]">
                            <Search />
                            <input
                                placeholder="ค้นหาสินค้าประมูล..."
                                className="flex-1 bg-transparent border-0 outline-none text-[#161412]"
                            />
                            <span className="font-mono text-[11px] text-[#8B857E] px-1.5 py-0.5 border border-[#E8E5DE] rounded-[5px] bg-[#F4F3EE]">
                                ⌘ K
                            </span>
                        </div>
                        <div className="flex items-center gap-2 h-10 px-3.5 bg-[#161412] text-white rounded-full font-semibold text-[14px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B1A]" />฿ 1,500
                        </div>
                        <button className="relative w-10 h-10 grid place-items-center bg-white border border-[#E8E5DE] rounded-full text-[#4A4641] cursor-pointer">
                            <Bell />
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#FF6B1A] text-white rounded-[9px] text-[11px] font-semibold grid place-items-center border-2 border-[#FAFAF7]">
                                3
                            </span>
                        </button>
                        <div
                            className="w-10 h-10 rounded-full border border-[#E8E5DE] grid place-items-center text-white font-semibold text-[14px]"
                            style={{ background: "linear-gradient(135deg, #2A4F8F, #6FA4E8)" }}
                        >
                            น
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* ============ Hero ============ */}
                <section>
                    <SectionHead
                        eyebrow={`ประมูลสดตอนนี้ · ${activeProducts.length} รายการ`}
                        title="รายการประมูลแนะนำ"
                        live
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-6 mt-4">
                        <Link
                            href={hero ? `/product/${hero.id}` : "#"}
                            className="group relative overflow-hidden rounded-[28px] bg-[#1a1815] aspect-[16/10] shadow-[0_32px_80px_-40px_rgba(20,18,15,.35),0_4px_16px_rgba(20,18,15,.06)] no-underline block"
                        >
                            <Thumb
                                image={hero?.images_url?.[0]?.url}
                                fallback="ap-hero-img"
                                alt={hero?.title ?? ""}
                                className="transition-transform duration-500 group-hover:scale-105"
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: "linear-gradient(180deg, transparent 30%, rgba(10,8,5,.85) 100%)",
                                }}
                            />
                            <div className="absolute left-5 right-5 sm:left-8 sm:right-8 bottom-6 sm:bottom-8 text-white flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
                                <div className="flex flex-col gap-3.5 max-w-[540px]">
                                    <span className="self-start inline-flex items-center gap-2 bg-[#E11D48] text-white px-3 py-1.5 rounded-full text-[12px] font-semibold tracking-[.04em] uppercase">
                                        <span className="ap-blink w-1.5 h-1.5 bg-white rounded-full" />
                                        LIVE NOW
                                    </span>
                                    <div className="text-2xl sm:text-[36px] font-semibold leading-[1.1] tracking-[-.02em] line-clamp-2">
                                        {hero?.title ?? "ยังไม่มีรายการประมูล"}
                                    </div>
                                    <div className="flex gap-6 text-white/70 text-[14px]">
                                        <span>
                                            หมวด{" "}
                                            <b className="text-white font-semibold">{hero?.categories?.name ?? "—"}</b>
                                        </span>
                                        <span>
                                            <b className="text-white font-semibold">{bidderCount(hero ?? {})}</b> ประมูล
                                        </span>
                                        <span className="font-mono text-[#FFB37A]">
                                            <Countdown endTime={hero?.auction_end_time} now={now} />
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-stretch sm:items-end gap-3.5 w-full sm:w-auto sm:min-w-[240px]">
                                    <div className="bg-white/10 border border-white/15 backdrop-blur-xl py-3.5 rounded-[18px] text-right w-full sm:min-w-[240px] px-[18px]">
                                        <div className="text-[12px] text-white/60 tracking-[.05em] uppercase">
                                            {hero && highestBid(hero) ? "ราคาปัจจุบัน" : "ราคาเริ่มต้น"}
                                        </div>
                                        <div className="text-[30px] font-semibold tracking-[-.02em] font-num">
                                            {fmtBaht(hero ? (highestBid(hero) ?? hero.start_price) : null)}
                                            <span className="text-[16px] font-medium opacity-70 ml-1">฿</span>
                                        </div>
                                    </div>
                                    <span className="ap-btn-primary inline-flex items-center justify-center gap-2.5 h-[52px] bg-[#FF6B1A] text-white rounded-full font-semibold text-[15px] cursor-pointer px-[26px]">
                                        เข้าร่วมประมูล
                                        <ArrowRight />
                                    </span>
                                </div>
                            </div>
                        </Link>

                        <aside className="bg-white border border-[#E8E5DE] rounded-[28px] p-6 flex flex-col gap-4.5 shadow-[0_1px_2px_rgba(20,18,15,.04),0_1px_1px_rgba(20,18,15,.03)]">
                            <h3 className="m-0 text-[14px] font-semibold text-[#4A4641] tracking-[.04em] flex items-center gap-2.5">
                                <span className="ap-live-dot w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                                กำลังประมูลสด
                            </h3>
                            <div className="flex flex-col gap-3.5">
                                {liveItems.length === 0 && (
                                    <p className="text-[13px] text-[#8B857E] py-4 text-center">ยังไม่มีการประมูลสด</p>
                                )}
                                {liveItems.map((it) => (
                                    <Link
                                        href={`/product/${it.id}`}
                                        key={it.id}
                                        className="grid grid-cols-[56px_1fr_auto] gap-3 items-center no-underline text-inherit"
                                    >
                                        <div className="w-14 h-14 rounded-lg relative overflow-hidden bg-[#F4F3EE]">
                                            <Thumb
                                                image={it.images_url?.[0]?.url}
                                                fallback={`ap-ph-${catFallback(it.categories?.name)}`}
                                                alt={it.title}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <div className="text-[11px] text-[#8B857E] uppercase tracking-[.08em] truncate">
                                                {it.categories?.name ?? "—"}
                                            </div>
                                            <div className="text-[14px] font-medium truncate">{it.title}</div>
                                            <div className="text-[12px] text-[#8B857E]">
                                                <b className="text-[#FF6B1A] font-semibold">{bidderCount(it)}</b> ประมูล
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[15px] font-semibold font-num">
                                                {fmtBaht(highestBid(it) ?? it.start_price)}
                                                <small className="text-[11px] font-medium text-[#8B857E] ml-0.5">
                                                    ฿
                                                </small>
                                            </div>
                                            <div className="text-[11px] text-[#E11D48] font-medium font-mono">
                                                <Countdown endTime={it.auction_end_time} now={now} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </aside>
                    </div>
                </section>

                {/* ============ Ending Soon ============ */}
                <section className="mt-[72px]">
                    <SectionHead eyebrow="ใกล้ปิดประมูล" title="เหลือเวลาไม่นาน รีบเสนอราคา" live />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 mt-6">
                        {endingItems.length === 0 && (
                            <p className="col-span-full text-center text-[#8B857E] py-8">ยังไม่มีรายการใกล้ปิดประมูล</p>
                        )}
                        {endingItems.map((e) => (
                            <Link
                                href={`/product/${e.id}`}
                                key={e.id}
                                className="ap-ending-card grid grid-cols-[72px_1fr] gap-3.5 items-center bg-white border border-[#E8E5DE] rounded-[18px] p-4 cursor-pointer no-underline text-inherit"
                            >
                                <div className="w-[72px] h-[72px] rounded-lg relative overflow-hidden bg-[#F4F3EE]">
                                    <Thumb
                                        image={e.images_url?.[0]?.url}
                                        fallback={`ap-ph-${catFallback(e.categories?.name)}`}
                                        alt={e.title}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 min-w-0">
                                    <div className="text-[10px] text-[#8B857E] uppercase tracking-[.08em] font-medium truncate">
                                        {e.categories?.name ?? "—"}
                                    </div>
                                    <div className="text-[14px] font-medium leading-[1.3] truncate">{e.title}</div>
                                    <div className="flex items-center justify-between mt-1">
                                        <div className="text-[15px] font-semibold font-num">
                                            {fmtBaht(highestBid(e) ?? e.start_price)}
                                            <small className="text-[11px] opacity-60 ml-0.5 font-medium">฿</small>
                                        </div>
                                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-[#E11D48] px-2 py-0.5 rounded-full bg-[#E11D48]/10">
                                            <span className="ap-live-dot w-[5px] h-[5px] bg-[#E11D48] rounded-full" />
                                            <Countdown endTime={e.auction_end_time} now={now} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ============ Stats ============ */}
                <section className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-7 bg-white border border-[#E8E5DE] rounded-[28px]">
                    {[
                        { v: stats ? fmtBaht(stats.totalAuctions) : "—", k: "รายการประมูลทั้งหมด" },
                        { v: stats ? fmtBaht(stats.activeCollectors) : "—", k: "นักสะสมที่ใช้งาน" },
                        { v: stats ? `฿ ${fmtBaht(stats.monthlyValue)}` : "—", k: "มูลค่าซื้อขายต่อเดือน" },
                        {
                            v: stats ? stats.successRate.toFixed(1) : "—",
                            suffix: stats ? "%" : "",
                            k: "การประมูลสำเร็จ",
                        },
                    ].map((s, i) => (
                        <div key={i}>
                            <div className="text-[28px] font-semibold tracking-[-.02em] font-num">
                                {s.v}
                                {s.suffix && (
                                    <small className="text-[14px] font-medium opacity-55 ml-1">{s.suffix}</small>
                                )}
                            </div>
                            <div className="text-[13px] text-[#8B857E] mt-0.5">{s.k}</div>
                        </div>
                    ))}
                </section>

                {/* ============ Categories + Grid ============ */}
                <section className="mt-14">
                    <div className="flex items-end justify-between mb-6">
                        <div className="flex flex-col gap-1.5">
                            <span className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[.12em] uppercase text-[#8B857E]">
                                การประมูลยอดนิยม
                            </span>
                            <h2 className="m-0 text-2xl sm:text-[32px] font-semibold tracking-[-.02em] leading-[1.1]">
                                เลือกประมูลตามหมวดที่คุณสนใจ
                            </h2>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="w-10 h-10 grid place-items-center bg-white border border-[#E8E5DE] rounded-[10px] text-[#4A4641]"
                                aria-label="grid view"
                            >
                                <Ico>
                                    <rect x="3" y="3" width="7" height="7" rx="1" />
                                    <rect x="14" y="3" width="7" height="7" rx="1" />
                                    <rect x="3" y="14" width="7" height="7" rx="1" />
                                    <rect x="14" y="14" width="7" height="7" rx="1" />
                                </Ico>
                            </button>
                            <button
                                className="w-10 h-10 grid place-items-center bg-white border border-[#E8E5DE] rounded-[10px] text-[#4A4641]"
                                aria-label="list view"
                            >
                                <Ico>
                                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                                </Ico>
                            </button>
                        </div>
                    </div>

                    {/* tabs */}
                    <div className="flex gap-2.5 items-center overflow-x-auto pb-1">
                        {catTabs.map((c, i) => {
                            const active = i === activeCat;
                            const icon = CATS.find((x) => x.label === c.label)?.icon ?? DEFAULT_CAT_ICON;
                            return (
                                <button
                                    key={c.id ?? "all"}
                                    onClick={() => setActiveCat(i)}
                                    className={[
                                        "inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full border text-[14px] font-medium whitespace-nowrap transition-all cursor-pointer",
                                        active
                                            ? "bg-[#161412] text-white border-[#161412]"
                                            : "bg-white text-[#4A4641] border-[#E8E5DE] hover:bg-[#F4F3EE]",
                                    ].join(" ")}
                                >
                                    <span className={active ? "text-[#FF6B1A] opacity-100" : "opacity-65"}>{icon}</span>
                                    {c.label}
                                    <span
                                        className={[
                                            "text-[12px] px-2 py-0.5 rounded-full font-medium",
                                            active ? "bg-white/10 text-white/85" : "bg-[#F4F3EE] text-[#8B857E]",
                                        ].join(" ")}
                                    >
                                        {c.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-7">
                        {gridItems.length === 0 && (
                            <p className="col-span-full text-center text-[#8B857E] py-12">ไม่มีสินค้าในหมวดหมู่นี้</p>
                        )}
                        {gridItems.map((p) => {
                            const isFav = favs.has(p.id);
                            const bids = bidderCount(p);
                            const distinct = new Set((p.bids ?? []).map((b) => b.user_id)).size;
                            const price = highestBid(p) ?? p.start_price;
                            const colorKeys = ["c1", "c2", "c3", "c4", "c5"];
                            return (
                                <article
                                    key={p.id}
                                    className="ap-card relative flex flex-col bg-white border border-[#E8E5DE] rounded-[18px] overflow-hidden"
                                >
                                    <Link
                                        href={`/product/${p.id}`}
                                        className="flex flex-col no-underline text-inherit"
                                    >
                                        <div className="relative overflow-hidden bg-[#F4F3EE] aspect-[4/5]">
                                            <Thumb
                                                image={p.images_url?.[0]?.url}
                                                fallback={`ap-ph-${catFallback(p.categories?.name)}`}
                                                alt={p.title}
                                            />
                                            {/* pill */}
                                            <span
                                                className={[
                                                    "absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold tracking-[.04em] backdrop-blur-md",
                                                    bids > 0 ? "bg-[#E11D48] text-white" : "bg-white/95 text-[#161412]",
                                                ].join(" ")}
                                            >
                                                {bids > 0 && (
                                                    <span className="ap-blink w-1.5 h-1.5 bg-white rounded-full" />
                                                )}
                                                {bids > 0 ? "LIVE" : "ตรวจสอบแล้ว ✓"}
                                            </span>
                                            {/* timer */}
                                            <span className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 bg-black/75 text-white px-2.5 py-1.5 rounded-lg font-mono text-[12px] font-medium backdrop-blur-sm">
                                                <Countdown endTime={p.auction_end_time} now={now} prefix="⏱ " />
                                            </span>
                                        </div>
                                        <div className="p-4.5 flex flex-col gap-3.5">
                                            <div className="text-[11px] text-[#8B857E] uppercase tracking-[.08em] font-medium truncate">
                                                {p.categories?.name ?? "—"}
                                            </div>
                                            <div className="text-[16px] font-medium leading-[1.3] tracking-[-.005em] -my-1.5 line-clamp-2">
                                                {p.title}
                                            </div>
                                            <div className="flex items-end justify-between gap-2">
                                                <div>
                                                    <div className="text-[11px] text-[#8B857E] uppercase tracking-[.06em]">
                                                        {highestBid(p) ? "ราคาปัจจุบัน" : "ราคาเริ่มต้น"}
                                                    </div>
                                                    <div className="text-[22px] font-semibold tracking-[-.02em] leading-none font-num">
                                                        {fmtBaht(price)}
                                                        <small className="text-[13px] font-medium opacity-60 ml-1">
                                                            ฿
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className="text-[13px] text-[#8B857E]">
                                                    <b className="text-[#161412] font-semibold">{bids}</b> ประมูล
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 -mx-0.5 min-h-6">
                                                <div className="flex">
                                                    {Array.from({ length: Math.min(distinct, 3) }).map((_, j) => (
                                                        <div
                                                            key={j}
                                                            className="w-6 h-6 rounded-full border-2 border-white -ml-1.5 text-[10px] font-semibold text-white grid place-items-center"
                                                            style={{
                                                                background: AVATAR_BG[colorKeys[j % colorKeys.length]],
                                                                marginLeft: j === 0 ? 0 : -6,
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="text-[12px] text-[#8B857E]">
                                                    {distinct > 0 ? `${distinct} ผู้ร่วมประมูล` : "ยังไม่มีผู้เสนอราคา"}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    {/* fav */}
                                    <button
                                        onClick={() => toggleFav(p.id)}
                                        className={[
                                            "absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/95 border-0 cursor-pointer grid place-items-center backdrop-blur-md transition-colors",
                                            isFav ? "text-[#E11D48]" : "text-[#4A4641] hover:text-[#E11D48]",
                                        ].join(" ")}
                                        aria-label="favorite"
                                    >
                                        <Heart filled={isFav} />
                                    </button>
                                    <div className="px-4.5 pb-4.5">
                                        <Link
                                            href={`/product/${p.id}`}
                                            className="ap-card-btn flex items-center justify-center h-11 rounded-full font-semibold text-[14px] cursor-pointer transition-all no-underline bg-[#FF6B1A] border border-[#FF6B1A] text-white hover:bg-[#C94800] hover:border-[#C94800]"
                                        >
                                            {bids > 0 ? "เสนอราคาประมูล" : "เริ่มประมูล"}
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* ============ Recently sold ============ */}
                <section className="mt-[72px] bg-[#161412] text-white rounded-[28px] px-6 sm:px-10 py-8 sm:py-9 grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-10 items-center">
                    <div>
                        <h3 className="m-0 mb-2 text-2xl sm:text-[26px] font-semibold tracking-[-.02em]">ขายแล้วล่าสุด</h3>
                        <p className="m-0 text-white/65 text-[14px]">
                            การประมูลที่ปิดดีล เห็นเทรนด์ราคา ก่อนเสนอราคาครั้งต่อไป
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
                        {sold.length === 0 && <p className="text-white/50 text-[14px]">ยังไม่มีรายการที่ปิดดีล</p>}
                        {sold.map((s) => (
                            <Link
                                href={`/product/${s.id}`}
                                key={s.id}
                                className="flex items-center gap-3 no-underline text-inherit"
                            >
                                <div className="w-12 h-12 rounded-lg shrink-0 relative overflow-hidden bg-white/10">
                                    <Thumb image={s.image} fallback="ap-sold-thumb" alt={s.title} />
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <div className="text-[13px] font-medium truncate">{s.title}</div>
                                    <div className="text-[13px] text-[#FF6B1A] font-semibold font-num">
                                        ฿ {fmtBaht(s.finalPrice)}
                                    </div>
                                    <div className="text-[11px] text-white/50">{timeAgo(s.endTime, now)}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ============ How it works ============ */}
                <section className="mt-24">
                    <SectionHead eyebrow="วิธีใช้งาน" title="ประมูลของสะสมใน 3 ขั้นตอน" showMore={false} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                        {STEPS.map((s, i) => (
                            <div
                                key={i}
                                className="ap-step bg-white border border-[#E8E5DE] rounded-[28px] p-8 flex flex-col gap-4 relative"
                            >
                                <div className="font-mono text-[13px] text-[#FF6B1A] font-medium tracking-[.1em]">
                                    {s.num}
                                </div>
                                <div className="w-14 h-14 rounded-xl bg-[#FFEEDF] text-[#FF6B1A] grid place-items-center mb-2">
                                    {s.icon}
                                </div>
                                <h4 className="m-0 text-[20px] font-semibold tracking-[-.01em]">{s.title}</h4>
                                <p className="m-0 text-[#8B857E] text-[14px] leading-[1.6]">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ============ Testimonials / Reviews ============ */}
                <section className="mt-24">
                    <SectionHead eyebrow="รีวิวจากนักสะสม" title="นักสะสมตัวจริงไว้ใจเรา" more="รีวิวทั้งหมด" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {REVIEWS.map((r, i) => (
                            <div
                                key={i}
                                className={[
                                    "ap-review p-8 rounded-[28px] border flex flex-col gap-5 relative transition-all",
                                    r.featured
                                        ? "bg-[#161412] text-white border-[#161412]"
                                        : "bg-white border-[#E8E5DE]",
                                ].join(" ")}
                            >
                                <div
                                    className={`leading-[.8] font-bold text-[56px] h-7 ${r.featured ? "text-[#FF6B1A]" : "text-[#FF6B1A]"}`}
                                >
                                    “
                                </div>
                                <div className="flex gap-0.5 text-[#FF6B1A]">
                                    {[...Array(5)].map((_, k) => (
                                        <Star key={k} size={16} />
                                    ))}
                                </div>
                                <p
                                    className={[
                                        "m-0 text-[16px] leading-[1.6] tracking-[-.005em] flex-1",
                                        r.featured ? "text-white/70" : "text-[#161412]",
                                    ].join(" ")}
                                >
                                    {r.text}
                                </p>
                                <div
                                    className={[
                                        "flex items-center gap-3 pt-5 border-t",
                                        r.featured ? "border-white/10" : "border-[#E8E5DE]",
                                    ].join(" ")}
                                >
                                    <div
                                        className="w-11 h-11 rounded-full grid place-items-center text-white font-semibold text-[15px] shrink-0"
                                        style={{ background: r.avatarBg }}
                                    >
                                        {r.avatarChar}
                                    </div>
                                    <div>
                                        <div className={`text-[15px] font-semibold ${r.featured ? "text-white" : ""}`}>
                                            {r.name}
                                        </div>
                                        <div
                                            className={`text-[12px] mt-0.5 ${r.featured ? "text-white/70" : "text-[#8B857E]"}`}
                                        >
                                            {r.meta}
                                        </div>
                                    </div>
                                    <span
                                        className={[
                                            "ml-auto text-[11px] px-2.5 py-1 rounded-full font-semibold tracking-[.04em]",
                                            r.featured
                                                ? "bg-[#FF6B1A]/20 text-[#FF6B1A]"
                                                : "bg-[#FFEEDF] text-[#C94800]",
                                        ].join(" ")}
                                    >
                                        {r.badge}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-9 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 sm:px-8 py-6 bg-white border border-[#E8E5DE] rounded-[18px]">
                        <div className="flex items-center gap-5">
                            <div className="text-[36px] font-semibold tracking-[-.02em] leading-none font-num">
                                4.9<small className="text-[16px] font-medium opacity-55">/5.0</small>
                            </div>
                            <div>
                                <div className="flex gap-0.5 text-[#FF6B1A] mb-1">
                                    {[...Array(5)].map((_, k) => (
                                        <Star key={k} size={16} />
                                    ))}
                                </div>
                                <p className="m-0 text-[13px] text-[#8B857E]">
                                    คะแนนรวมจากนักสะสม <b className="text-[#161412] font-semibold">5,284 คน</b> ·
                                    ผ่านการตรวจสอบจาก Trustpilot
                                </p>
                            </div>
                        </div>
                        <a
                            href="#"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#E8E5DE] bg-white text-[#4A4641] text-[14px] font-medium hover:bg-[#F4F3EE] no-underline transition"
                        >
                            อ่านรีวิวทั้งหมด
                            <ArrowRight />
                        </a>
                    </div>
                </section>

                {/* ============ FAQ ============ */}
                <section className="mt-24">
                    <SectionHead eyebrow="คำถามที่พบบ่อย" title="ตอบคำถามที่นักสะสมสงสัยกันบ่อย" showMore={false} />
                    <div className="mt-7 border-t border-[#E8E5DE]">
                        {FAQS.map((f, i) => {
                            const open = i === openFaq;
                            return (
                                <div key={i} className="border-b border-[#E8E5DE]">
                                    <div
                                        onClick={() => setOpenFaq(open ? -1 : i)}
                                        className={[
                                            "py-7 flex justify-between items-center cursor-pointer text-[18px] font-medium tracking-[-.005em] transition-colors",
                                            open ? "" : "hover:text-[#FF6B1A]",
                                        ].join(" ")}
                                    >
                                        <span>{f.q}</span>
                                        <span
                                            className={[
                                                "w-9 h-9 rounded-full border border-[#E8E5DE] grid place-items-center shrink-0",
                                                open ? "bg-[#161412] text-white border-[#161412]" : "text-[#4A4641]",
                                            ].join(" ")}
                                        >
                                            {open ? (
                                                <Ico>
                                                    <path d="M5 12h14" />
                                                </Ico>
                                            ) : (
                                                <Ico>
                                                    <path d="M12 5v14M5 12h14" />
                                                </Ico>
                                            )}
                                        </span>
                                    </div>
                                    {open && (
                                        <div className="text-[#4A4641] text-[15px] leading-[1.7] pr-4 sm:pr-20 pb-7 max-w-[880px]">
                                            {f.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ============ Sell with us CTA ============ */}
                <section
                    className="mt-24 relative rounded-[28px] py-12 sm:py-[72px] px-6 sm:px-10 lg:px-16 overflow-hidden text-white grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-12 items-center"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 100% at 80% 20%, rgba(255,107,26,.35), transparent 50%), linear-gradient(135deg, #1a0a02 0%, #2a1208 100%)",
                    }}
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "repeating-linear-gradient(45deg, rgba(255,255,255,.025) 0 1px, transparent 1px 32px)",
                        }}
                    />
                    <div className="relative">
                        <span className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[.12em] uppercase text-[#FF6B1A]">
                            มาเป็นผู้ขาย
                        </span>
                        <h3 className="mt-3 mb-4 text-3xl sm:text-[44px] font-semibold tracking-[-.025em] leading-[1.05]">
                            มีของสะสมที่อยากเปลี่ยนเป็นเงิน?
                        </h3>
                        <p className="mt-0 mb-7 text-[16px] leading-[1.6] text-white/70 max-w-[480px]">
                            เปลี่ยนของสะสมในตู้ของคุณเป็นรายได้ — เราช่วยตรวจสอบ ถ่ายรูปสตูดิโอ และเขียนคำบรรยายให้ฟรี
                            ผู้ขายของเราขายได้เฉลี่ยสูงกว่าราคาตลาด 18%
                        </p>
                        <ul className="list-none p-0 m-0 mb-8 flex flex-col gap-3.5">
                            {[
                                "ค่าธรรมเนียมเพียง 8% เมื่อขายสำเร็จ ไม่มีค่าลงประกาศ",
                                "ทีมงานช่วยถ่ายรูปและเขียนคำบรรยายให้ฟรี",
                                "ได้รับเงินภายใน 24 ชม. หลังผู้ซื้อตรวจรับ",
                            ].map((t) => (
                                <li key={t} className="flex items-center gap-3 text-[14px] text-white/85">
                                    <span className="w-[22px] h-[22px] rounded-full bg-[#FF6B1A] text-white grid place-items-center shrink-0">
                                        <Check size={12} strokeWidth={2.5} />
                                    </span>
                                    {t}
                                </li>
                            ))}
                        </ul>
                        <div className="flex gap-3 items-center">
                            <button className="ap-btn-primary inline-flex items-center gap-2.5 h-[52px] px-6.5 bg-[#FF6B1A] text-white rounded-full font-semibold text-[15px] cursor-pointer px-[26px]">
                                เริ่มลงประมูล
                                <ArrowRight />
                            </button>
                            <button className="inline-flex items-center gap-2 h-[52px] px-5.5 bg-transparent text-white border border-white/25 rounded-full font-medium text-[15px] cursor-pointer hover:bg-white/10 transition px-[22px]">
                                ดูค่าธรรมเนียม
                            </button>
                        </div>
                    </div>
                    <div className="relative bg-white/5 border border-white/10 backdrop-blur-md rounded-[18px] p-7 flex flex-col gap-6">
                        {[
                            { lbl: "ยอดขายเฉลี่ยของผู้ขาย", v: "+18%", accent: true },
                            { lbl: "ระยะเวลาขายเฉลี่ย", v: "5.2", suffix: "วัน" },
                            {
                                lbl: "การประมูลสำเร็จ",
                                v: stats ? stats.successRate.toFixed(1) : "—",
                                suffix: stats ? "%" : "",
                            },
                            { lbl: "ผู้ซื้อที่ active", v: stats ? fmtBaht(stats.activeCollectors) : "—" },
                        ].map((r, i, arr) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between ${i < arr.length - 1 ? "pb-5 border-b border-white/10" : ""}`}
                            >
                                <span className="text-white/60 text-[13px]">{r.lbl}</span>
                                <span
                                    className={`text-[22px] font-semibold tracking-[-.01em] font-num ${r.accent ? "text-[#FF6B1A]" : ""}`}
                                >
                                    {r.v}
                                    {r.suffix && (
                                        <small className="opacity-55 text-[13px] font-medium ml-1">{r.suffix}</small>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* ============ Footer ============ */}
            <footer className="hidden mt-[120px] bg-[#0E0C0A] text-white/70 pt-[72px] pb-9">
                <div className="max-w-[1320px] mx-auto px-8">
                    <div className="grid grid-cols-[1.5fr_1fr_1fr_1.4fr] gap-12">
                        <div>
                            <div className="flex items-center gap-2.5 text-white text-[22px] font-semibold mb-3.5">
                                <BrandMark />
                                <span>Afferprice</span>
                            </div>
                            <p className="text-[13px] leading-[1.7] max-w-[320px] text-white/55 m-0">
                                แพลตฟอร์มประมูลของสะสมระดับโลก มั่นใจได้ด้วยระบบตรวจสอบความถูกต้องแบบเรียลไทม์
                                และผู้เชี่ยวชาญดูแลทุกรายการ
                            </p>
                        </div>
                        <div>
                            <h5 className="m-0 mb-4 text-[13px] font-semibold text-white tracking-[.04em]">
                                แพลตฟอร์ม
                            </h5>
                            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                                {["การประมูลสด", "สินค้าใหม่เร็วๆ นี้", "ขั้นตอนการตรวจสอบ", "ค่าธรรมเนียม"].map(
                                    (l) => (
                                        <li key={l}>
                                            <a
                                                href="#"
                                                className="text-white/60 no-underline text-[14px] hover:text-[#FF6B1A] transition-colors"
                                            >
                                                {l}
                                            </a>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                        <div>
                            <h5 className="m-0 mb-4 text-[13px] font-semibold text-white tracking-[.04em]">
                                ช่วยเหลือ
                            </h5>
                            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                                {["ศูนย์ช่วยเหลือ", "การคุ้มครองผู้ซื้อ", "คู่มือการขาย", "ติดต่อเรา"].map((l) => (
                                    <li key={l}>
                                        <a
                                            href="#"
                                            className="text-white/60 no-underline text-[14px] hover:text-[#FF6B1A] transition-colors"
                                        >
                                            {l}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="m-0 mb-4 text-[13px] font-semibold text-white tracking-[.04em]">ข่าวสาร</h5>
                            <p className="text-[13px] text-white/50 m-0">รับข่าวสารเกี่ยวกับสินค้าหายากก่อนใคร</p>
                            <div className="flex gap-2 mt-3 bg-white/5 border border-white/10 rounded-full py-1.5 pl-4 pr-1.5">
                                <input
                                    placeholder="อีเมลของคุณ"
                                    className="bg-transparent border-0 outline-none text-white flex-1 text-[14px] placeholder:text-white/40"
                                />
                                <button className="bg-[#FF6B1A] text-white border-0 px-4.5 h-9 rounded-full font-semibold text-[13px] cursor-pointer px-[18px]">
                                    ติดตาม
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 pt-7 border-t border-white/10 flex justify-between items-center text-[13px] text-white/40">
                        <span>© 2026 Afferprice Global Inc. สงวนลิขสิทธิ์</span>
                        <div className="flex gap-7">
                            <a href="#" className="text-white/50 no-underline hover:text-white transition-colors">
                                นโยบายความเป็นส่วนตัว
                            </a>
                            <a href="#" className="text-white/50 no-underline hover:text-white transition-colors">
                                เงื่อนไขการให้บริการ
                            </a>
                            <a href="#" className="text-white/50 no-underline hover:text-white transition-colors">
                                นโยบายคุกกี้
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

/* ============================================================
   Local styles — for things Tailwind can't express ergonomically:
   keyframes, repeating-linear-gradient placeholders, font import,
   hover transforms on cards.
   ============================================================ */
function LocalStyles() {
    return (
        <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap");

            .ap-root {
                font-family: "IBM Plex Sans Thai", "IBM Plex Sans", system-ui, sans-serif;
                font-feature-settings:
                    "ss01" on,
                    "cv11" on;
                -webkit-font-smoothing: antialiased;
                text-rendering: optimizeLegibility;
                line-height: 1.5;
            }
            .ap-root .font-num {
                font-family: "IBM Plex Sans", system-ui, sans-serif;
                font-feature-settings: "tnum" on;
            }
            .ap-root .font-mono {
                font-family: "IBM Plex Mono", ui-monospace, monospace;
            }

            /* keyframes */
            @keyframes ap-pulse {
                0%,
                100% {
                    box-shadow: 0 0 0 4px rgba(225, 29, 72, 0.15);
                }
                50% {
                    box-shadow: 0 0 0 8px rgba(225, 29, 72, 0.05);
                }
            }
            @keyframes ap-blink {
                50% {
                    opacity: 0;
                }
            }
            @keyframes ap-rotate {
                to {
                    transform: rotate(360deg);
                }
            }

            .ap-live-dot {
                animation: ap-pulse 2s ease-in-out infinite;
                box-shadow: 0 0 0 4px rgba(225, 29, 72, 0.15);
            }
            .ap-blink {
                animation: ap-blink 1.2s steps(2) infinite;
            }

            /* hero image (radial + linear + stripes) */
            .ap-hero-img {
                background:
                    radial-gradient(ellipse 60% 80% at 60% 40%, rgba(255, 180, 120, 0.6), transparent 70%),
                    linear-gradient(135deg, #2a1e16 0%, #4a2818 40%, #7a3a1e 100%);
            }
            .ap-hero-img::before {
                content: "";
                position: absolute;
                inset: 0;
                background:
                    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0 2px, transparent 2px 14px),
                    radial-gradient(circle at 65% 50%, rgba(255, 210, 170, 0.25), transparent 50%);
            }

            /* live side panel thumbs */
            .ap-live-thumb.v1 {
                background: repeating-linear-gradient(45deg, #2a241c 0 1px, #3a3025 1px 8px), #2a241c;
            }
            .ap-live-thumb.v2 {
                background: repeating-linear-gradient(135deg, #1f3a4f 0 1px, #2a4d68 1px 8px);
            }
            .ap-live-thumb.v3 {
                background: repeating-linear-gradient(45deg, #4a2a3c 0 1px, #62384e 1px 8px);
            }
            .ap-live-thumb.v4 {
                background: repeating-linear-gradient(135deg, #2c4a2e 0 1px, #3b643d 1px 8px);
            }

            /* placeholder patterns per category */
            .ap-ph-card {
                background:
                    repeating-linear-gradient(45deg, #1f2937 0 1px, #2a3441 1px 14px),
                    linear-gradient(135deg, #324154, #1f2937);
            }
            .ap-ph-amulet {
                background:
                    repeating-linear-gradient(45deg, #3a2a1a 0 1px, #4d3a25 1px 14px),
                    linear-gradient(135deg, #5a4128, #2c1f12);
            }
            .ap-ph-jewel {
                background:
                    repeating-linear-gradient(45deg, #2d3548 0 1px, #3b4760 1px 14px),
                    linear-gradient(135deg, #4a5a7a, #1e2438);
            }
            .ap-ph-watch {
                background:
                    repeating-linear-gradient(45deg, #1f1f1f 0 1px, #2a2a2a 1px 14px),
                    linear-gradient(135deg, #3d3d3d, #0d0d0d);
            }
            .ap-ph-art {
                background:
                    repeating-linear-gradient(45deg, #5a3838 0 1px, #6f4848 1px 14px),
                    linear-gradient(135deg, #864e4e, #3a1f1f);
            }
            .ap-ph-toy {
                background:
                    repeating-linear-gradient(45deg, #2a3d2a 0 1px, #364f36 1px 14px),
                    linear-gradient(135deg, #486b48, #1c2a1c);
            }
            .ap-ph-coin {
                background:
                    repeating-linear-gradient(45deg, #6f5a25 0 1px, #826a30 1px 14px),
                    linear-gradient(135deg, #9b8038, #5a4818);
            }
            .ap-ph-stamp {
                background:
                    repeating-linear-gradient(45deg, #4a2f5a 0 1px, #5e3d72 1px 14px),
                    linear-gradient(135deg, #7a4f93, #2c1c39);
            }

            /* sold strip thumbs */
            .ap-sold-thumb {
                background: repeating-linear-gradient(45deg, #3a3528 0 1px, #4a4538 1px 8px);
            }
            .ap-sold-thumb.s2 {
                background: repeating-linear-gradient(135deg, #2d3a4a 0 1px, #3a4960 1px 8px);
            }
            .ap-sold-thumb.s3 {
                background: repeating-linear-gradient(45deg, #4a2a3a 0 1px, #5a3548 1px 8px);
            }

            /* cards hover */
            .ap-card {
                transition:
                    transform 0.2s,
                    box-shadow 0.2s,
                    border-color 0.2s;
            }
            .ap-card:hover {
                transform: translateY(-2px);
                border-color: #dad6cc;
                box-shadow:
                    0 12px 32px -16px rgba(20, 18, 15, 0.18),
                    0 2px 6px rgba(20, 18, 15, 0.04);
            }
            .ap-ending-card {
                transition:
                    border-color 0.2s,
                    transform 0.2s;
            }
            .ap-ending-card:hover {
                border-color: #e11d48;
                transform: translateY(-2px);
            }
            .ap-step {
                transition:
                    border-color 0.2s,
                    transform 0.2s;
            }
            .ap-step:hover {
                border-color: #ff6b1a;
                transform: translateY(-2px);
            }
            .ap-review {
                transition:
                    border-color 0.2s,
                    transform 0.2s;
            }
            .ap-review:hover:not(.featured) {
                border-color: #dad6cc;
                transform: translateY(-2px);
            }

            /* primary button hover lift */
            .ap-btn-primary {
                box-shadow:
                    0 8px 24px -8px rgba(255, 107, 26, 0.6),
                    inset 0 -2px 0 rgba(0, 0, 0, 0.1);
                transition:
                    transform 0.15s,
                    box-shadow 0.15s;
            }
            .ap-btn-primary:hover {
                transform: translateY(-1px);
                box-shadow:
                    0 12px 30px -8px rgba(255, 107, 26, 0.7),
                    inset 0 -2px 0 rgba(0, 0, 0, 0.1);
            }

            /* trust visual + seal */
            .ap-trust-visual {
                background:
                    radial-gradient(ellipse at 30% 30%, rgba(255, 107, 26, 0.18), transparent 60%),
                    linear-gradient(135deg, #f5efe6 0%, #ebe3d3 100%);
            }
            .ap-trust-visual::before {
                content: "";
                position: absolute;
                inset: 0;
                background: repeating-linear-gradient(45deg, rgba(255, 107, 26, 0.05) 0 1px, transparent 1px 24px);
            }
            .ap-seal::before {
                content: "";
                position: absolute;
                inset: 12px;
                border-radius: 50%;
                border: 2px dashed #ff6b1a;
                opacity: 0.35;
                animation: ap-rotate 30s linear infinite;
            }

            /* ---------- dark mode (scoped to .ap-root) ----------
               Override the design's hardcoded light palette. Attribute
               selectors match the arbitrary-value utility tokens and win
               on specificity (.dark .ap-root […] = 0-3-0 > utility 0-1-0). */
            .dark .ap-root {
                color: #e4e4e7;
            }
            .dark .ap-root [class~="text-[#161412]"] {
                color: #f4f4f5;
            }
            .dark .ap-root [class~="text-[#4A4641]"] {
                color: #d4d4d8;
            }
            .dark .ap-root [class~="bg-white"] {
                background-color: #18181b;
            }
            .dark .ap-root [class~="bg-white/95"] {
                background-color: rgba(24, 24, 27, 0.9);
            }
            .dark .ap-root [class~="bg-[#F4F3EE]"] {
                background-color: #27272a;
            }
            .dark .ap-root [class~="border-[#E8E5DE]"] {
                border-color: #27272a;
            }
            .dark .ap-root [class~="hover:bg-[#F4F3EE]"]:hover {
                background-color: #27272a;
            }
            .dark .ap-root .ap-card:hover {
                border-color: #3f3f46;
                box-shadow: 0 12px 32px -16px rgba(0, 0, 0, 0.55);
            }
            .dark .ap-root .ap-review:hover:not(.featured) {
                border-color: #3f3f46;
            }
            .dark .ap-root .ap-trust-visual {
                background:
                    radial-gradient(ellipse at 30% 30%, rgba(255, 107, 26, 0.18), transparent 60%),
                    linear-gradient(135deg, #1f1b17 0%, #15120e 100%);
            }
        `}</style>
    );
}

export default LandingPage2;
