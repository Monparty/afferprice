"use client";

import React, { useState } from "react";

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
    <div className="flex items-end justify-between mt-14 mb-6">
        <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[.12em] uppercase text-[#8B857E]">
                {live && <span className="ap-live-dot inline-block w-2 h-2 rounded-full bg-[#E11D48]" />}
                {eyebrow}
            </span>
            <h2 className="m-0 text-[32px] font-semibold tracking-[-.02em] leading-[1.1] text-[#161412]">{title}</h2>
        </div>
        {showMore && (
            <a
                href="#"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#E8E5DE] bg-white text-[#4A4641] text-[14px] font-medium hover:bg-[#F4F3EE] hover:translate-x-0.5 transition no-underline"
            >
                {more}
                <ArrowRight />
            </a>
        )}
    </div>
);

/* ---------- placeholder pattern map (for art-direction parity) ---------- */
const PH_CLASSES = {
    card: "ap-ph-card",
    amulet: "ap-ph-amulet",
    jewel: "ap-ph-jewel",
    watch: "ap-ph-watch",
    art: "ap-ph-art",
    toy: "ap-ph-toy",
    coin: "ap-ph-coin",
    stamp: "ap-ph-stamp",
};

/* ---------- data ---------- */
const LIVE_ITEMS = [
    {
        thumb: "v1",
        cat: "การ์ดสะสม",
        name: "การ์ด Pokémon Charizard 1st Ed.",
        bump: 12,
        mins: 3,
        price: "45,000",
        time: "02:14:33",
    },
    {
        thumb: "v2",
        cat: "นาฬิกา",
        name: "Rolex Submariner 116610LN",
        bump: 5,
        mins: 8,
        price: "385,000",
        time: "00:42:18",
    },
    {
        thumb: "v3",
        cat: "พระเครื่อง",
        name: "หลวงปู่ทวด เนื้อทองคำ",
        bump: 8,
        mins: 5,
        price: "128,000",
        time: "04:11:02",
    },
    {
        thumb: "v4",
        cat: "ART TOY",
        name: "Bearbrick 1000% Karimoku",
        bump: 3,
        mins: 12,
        price: "62,500",
        time: "06:28:45",
    },
];

const ENDING_ITEMS = [
    { ph: "watch", cat: "นาฬิกา", name: "Omega Speedmaster Moonwatch", price: "142,000", time: "00:08:24" },
    { ph: "jewel", cat: "เครื่องประดับ", name: "สร้อยมุก Akoya ยาว 18 นิ้ว", price: "38,500", time: "00:14:02" },
    { ph: "amulet", cat: "พระเครื่อง", name: "หลวงพ่อเงิน วัดบางคลาน", price: "87,000", time: "00:23:47" },
    { ph: "card", cat: "การ์ดสะสม", name: "การ์ด Yu-Gi-Oh Blue-Eyes 1st", price: "15,800", time: "00:42:11" },
];

const STATS = [
    { v: "24,318", k: "รายการประมูลทั้งหมด" },
    { v: "8,142", k: "นักสะสมที่ใช้งาน" },
    { v: "฿ 142M", k: "มูลค่าซื้อขายต่อเดือน" },
    { v: "99.8", suffix: "%", k: "การประมูลสำเร็จ" },
];

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

const PRODUCTS = [
    {
        ph: "card",
        pill: { type: "live", label: "LIVE" },
        cat: "การ์ดสะสม · OP TCG",
        name: "การ์ด One Piece Leader Luffy Foil OP02-098",
        price: "600",
        priceLbl: "ราคาปัจจุบัน",
        bids: 1,
        label: "[ Image · OP02-098 · Luffy Leader ]",
        timer: "⏱ 11:13:46",
        avatars: [{ c: "c1", t: "น" }],
        who: "นพดล กำลังประมูล",
        cta: "เสนอราคาประมูล",
        primary: true,
    },
    {
        ph: "watch",
        pill: { type: "live", label: "LIVE" },
        cat: "นาฬิกา · ROLEX",
        name: "Rolex Submariner Date 116610LN ปี 2019",
        price: "385,000",
        priceLbl: "ราคาปัจจุบัน",
        bids: 42,
        fav: true,
        label: "[ Image · Rolex Submariner 116610LN ]",
        timer: "⏱ 00:42:18",
        avatars: [
            { c: "c2", t: "ส" },
            { c: "c3", t: "ก" },
            { c: "c4", t: "ว" },
            { c: "c1", t: "+39" },
        ],
        who: "สมชายและอีก 41 คน",
        cta: "เสนอราคาประมูล",
        primary: true,
    },
    {
        ph: "amulet",
        pill: { type: "hot", label: "🔥 มาแรง" },
        cat: "พระเครื่อง · หลวงปู่ทวด",
        name: "หลวงปู่ทวด เนื้อทองคำ พิมพ์ใหญ่ ปี 2497",
        price: "128,000",
        priceLbl: "ราคาปัจจุบัน",
        bids: 23,
        label: "[ Image · หลวงปู่ทวด เนื้อทองคำ ]",
        timer: "⏱ 04:11:02",
        avatars: [
            { c: "c5", t: "ธ" },
            { c: "c1", t: "ป" },
            { c: "c2", t: "ม" },
        ],
        who: "ธนากรและอีก 22 คน",
        cta: "เสนอราคาประมูล",
        primary: true,
    },
    {
        ph: "jewel",
        pill: { type: "plain", label: "ตรวจสอบแล้ว ✓" },
        cat: "เครื่องประดับ · DIAMOND",
        name: "แหวนเพชร 2.1 กะรัต GIA VVS1 D-Color",
        price: "450,000",
        priceLbl: "ราคาเริ่มต้น",
        bids: 0,
        label: "[ Image · Diamond Ring 2.1ct VVS1 ]",
        timer: "⏱ 18:24:09",
        avatars: [{ c: "c3", t: "·" }],
        who: "ยังไม่มีผู้เสนอราคา",
        cta: "เริ่มประมูล",
        primary: false,
    },
    {
        ph: "toy",
        pill: { type: "live", label: "LIVE" },
        cat: "ART TOY · MEDICOM",
        name: "Be@rbrick 1000% Karimoku Fragment Wood",
        price: "62,500",
        priceLbl: "ราคาปัจจุบัน",
        bids: 18,
        label: "[ Image · Bearbrick 1000% Karimoku ]",
        timer: "⏱ 06:28:45",
        avatars: [
            { c: "c4", t: "ภ" },
            { c: "c5", t: "ช" },
            { c: "c2", t: "+16" },
        ],
        who: "ภัทรและอีก 17 คน",
        cta: "เสนอราคาประมูล",
        primary: true,
    },
    {
        ph: "art",
        pill: { type: "plain", label: "ศิลปิน · มี่ พงศ์" },
        cat: "ศิลปะ · ภาพเขียนสีน้ำมัน",
        name: '"เพลิงเย็น" — สีน้ำมันบนผ้าใบ 80×120 ซม.',
        price: "95,000",
        priceLbl: "ราคาปัจจุบัน",
        bids: 11,
        label: "[ Image · Oil on canvas · 80×120cm ]",
        timer: "⏱ 02:14:33",
        avatars: [
            { c: "c1", t: "อ" },
            { c: "c3", t: "ค" },
            { c: "c4", t: "+9" },
        ],
        who: "อนุชาและอีก 10 คน",
        cta: "เสนอราคาประมูล",
        primary: true,
    },
    {
        ph: "coin",
        pill: { type: "plain", label: "ตรวจสอบแล้ว ✓" },
        cat: "เหรียญสะสม · ทองคำ",
        name: "เหรียญทองคำ พระบรมรูปทรงม้า ปี 2452",
        price: "78,000",
        priceLbl: "ราคาปัจจุบัน",
        bids: 9,
        label: "[ Image · เหรียญทองคำ 96.5% ]",
        timer: "⏱ 1d 03:42",
        avatars: [
            { c: "c2", t: "บ" },
            { c: "c5", t: "ก" },
            { c: "c1", t: "+7" },
        ],
        who: "บุญชัยและอีก 8 คน",
        cta: "เสนอราคาประมูล",
        primary: true,
    },
    {
        ph: "stamp",
        pill: { type: "hot", label: "🔥 มาแรง" },
        cat: "แสตมป์ · สะสมเก่า",
        name: "แสตมป์ ร.5 ชุดโสฬส บล็อก 4 สภาพดี",
        price: "22,500",
        priceLbl: "ราคาปัจจุบัน",
        bids: 15,
        label: "[ Image · Vintage Stamps Block ]",
        timer: "⏱ 09:17:55",
        avatars: [
            { c: "c3", t: "ว" },
            { c: "c1", t: "ส" },
            { c: "c4", t: "+13" },
        ],
        who: "วิชัยและอีก 14 คน",
        cta: "เสนอราคาประมูล",
        primary: true,
    },
];

const SOLD = [
    { thumb: "s1", name: "การ์ด Pokémon Pikachu Illustrator", price: "฿ 2,400,000", ago: "12 นาทีที่แล้ว" },
    { thumb: "s2", name: "นาฬิกา Patek Philippe 5711", price: "฿ 4,850,000", ago: "28 นาทีที่แล้ว" },
    { thumb: "s3", name: "พระสมเด็จ บางขุนพรหม", price: "฿ 320,000", ago: "1 ชั่วโมงที่แล้ว" },
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
    const [favs, setFavs] = useState(() => {
        const s = new Set();
        PRODUCTS.forEach((p, i) => {
            if (p.fav) s.add(i);
        });
        return s;
    });
    const [activeNav, setActiveNav] = useState(0);

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
                    <SectionHead eyebrow="ประมูลสดตอนนี้ · 12 รายการ" title="รายการประมูลแนะนำ" live />
                    <div className="grid grid-cols-[1.65fr_1fr] gap-6 mt-4">
                        <article className="relative overflow-hidden rounded-[28px] bg-[#1a1815] aspect-[16/10] shadow-[0_32px_80px_-40px_rgba(20,18,15,.35),0_4px_16px_rgba(20,18,15,.06)]">
                            <div className="absolute inset-0 ap-hero-img" />
                            <span className="absolute top-[18px] right-[18px] font-mono text-[10px] text-white/55 bg-black/35 border border-white/15 px-2 py-1 rounded tracking-[.08em] uppercase">
                                [ Image · OP-Card · Monkey D. Luffy ]
                            </span>
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: "linear-gradient(180deg, transparent 30%, rgba(10,8,5,.85) 100%)",
                                }}
                            />
                            <div className="absolute left-8 right-8 bottom-8 text-white flex items-end justify-between gap-6">
                                <div className="flex flex-col gap-3.5 max-w-[540px]">
                                    <span className="self-start inline-flex items-center gap-2 bg-[#E11D48] text-white px-3 py-1.5 rounded-full text-[12px] font-semibold tracking-[.04em] uppercase">
                                        <span className="ap-blink w-1.5 h-1.5 bg-white rounded-full" />
                                        LIVE NOW
                                    </span>
                                    <div className="text-[36px] font-semibold leading-[1.1] tracking-[-.02em]">
                                        การ์ด One Piece Leader
                                        <br />
                                        Monkey D. Luffy · Foil
                                    </div>
                                    <div className="flex gap-6 text-white/70 text-[14px]">
                                        <span>
                                            หมวด <b className="text-white font-semibold">การ์ดสะสม</b>
                                        </span>
                                        <span>
                                            <b className="text-white font-semibold">87</b> ประมูล
                                        </span>
                                        <span>
                                            <b className="text-white font-semibold">234</b> กำลังดู
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3.5 min-w-[240px]">
                                    <div className="bg-white/10 border border-white/15 backdrop-blur-xl px-4.5 py-3.5 rounded-[18px] text-right min-w-[240px] px-[18px]">
                                        <div className="text-[12px] text-white/60 tracking-[.05em] uppercase">
                                            ราคาปัจจุบัน
                                        </div>
                                        <div className="text-[30px] font-semibold tracking-[-.02em] font-num">
                                            28,500<span className="text-[16px] font-medium opacity-70 ml-1">฿</span>
                                        </div>
                                    </div>
                                    <button className="ap-btn-primary inline-flex items-center gap-2.5 h-[52px] px-6.5 bg-[#FF6B1A] text-white rounded-full font-semibold text-[15px] cursor-pointer px-[26px]">
                                        เข้าร่วมประมูล
                                        <ArrowRight />
                                    </button>
                                </div>
                            </div>
                        </article>

                        <aside className="bg-white border border-[#E8E5DE] rounded-[28px] p-6 flex flex-col gap-4.5 shadow-[0_1px_2px_rgba(20,18,15,.04),0_1px_1px_rgba(20,18,15,.03)]">
                            <h3 className="m-0 text-[14px] font-semibold text-[#4A4641] tracking-[.04em] flex items-center gap-2.5">
                                <span className="ap-live-dot w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                                กำลังประมูลสด
                            </h3>
                            <div className="flex flex-col gap-3.5">
                                {LIVE_ITEMS.map((it, i) => (
                                    <div key={i} className="grid grid-cols-[56px_1fr_auto] gap-3 items-center">
                                        <div
                                            className={`w-14 h-14 rounded-lg relative overflow-hidden ap-live-thumb ${it.thumb}`}
                                        />
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <div className="text-[11px] text-[#8B857E] uppercase tracking-[.08em]">
                                                {it.cat}
                                            </div>
                                            <div className="text-[14px] font-medium truncate">{it.name}</div>
                                            <div className="text-[12px] text-[#8B857E]">
                                                <b className="text-[#FF6B1A] font-semibold">+{it.bump}</b> ประมูลใน{" "}
                                                {it.mins} นาที
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[15px] font-semibold font-num">
                                                {it.price}
                                                <small className="text-[11px] font-medium text-[#8B857E] ml-0.5">
                                                    ฿
                                                </small>
                                            </div>
                                            <div className="text-[11px] text-[#E11D48] font-medium font-mono">
                                                {it.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>
                    </div>
                </section>

                {/* ============ Ending Soon ============ */}
                <section className="mt-[72px]">
                    <SectionHead eyebrow="ใกล้ปิดประมูล" title="เหลือเวลาไม่นาน รีบเสนอราคา" live />
                    <div className="grid grid-cols-4 gap-4.5 mt-6">
                        {ENDING_ITEMS.map((e, i) => (
                            <div
                                key={i}
                                className="ap-ending-card grid grid-cols-[72px_1fr] gap-3.5 items-center bg-white border border-[#E8E5DE] rounded-[18px] p-4 cursor-pointer"
                            >
                                <div className="w-[72px] h-[72px] rounded-lg relative overflow-hidden">
                                    <div className={`absolute inset-0 ${PH_CLASSES[e.ph]}`} />
                                </div>
                                <div className="flex flex-col gap-1 min-w-0">
                                    <div className="text-[10px] text-[#8B857E] uppercase tracking-[.08em] font-medium">
                                        {e.cat}
                                    </div>
                                    <div className="text-[14px] font-medium leading-[1.3] truncate">{e.name}</div>
                                    <div className="flex items-center justify-between mt-1">
                                        <div className="text-[15px] font-semibold font-num">
                                            {e.price}
                                            <small className="text-[11px] opacity-60 ml-0.5 font-medium">฿</small>
                                        </div>
                                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-[#E11D48] px-2 py-0.5 rounded-full bg-[#E11D48]/10">
                                            <span className="ap-live-dot w-[5px] h-[5px] bg-[#E11D48] rounded-full" />
                                            {e.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ============ Stats ============ */}
                <section className="mt-14 grid grid-cols-4 gap-6 p-7 bg-white border border-[#E8E5DE] rounded-[28px]">
                    {STATS.map((s, i) => (
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
                            <h2 className="m-0 text-[32px] font-semibold tracking-[-.02em] leading-[1.1]">
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
                        {CATS.map((c, i) => {
                            const active = i === activeCat;
                            return (
                                <button
                                    key={c.label}
                                    onClick={() => setActiveCat(i)}
                                    className={[
                                        "inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full border text-[14px] font-medium whitespace-nowrap transition-all cursor-pointer",
                                        active
                                            ? "bg-[#161412] text-white border-[#161412]"
                                            : "bg-white text-[#4A4641] border-[#E8E5DE] hover:bg-[#F4F3EE]",
                                    ].join(" ")}
                                >
                                    <span className={active ? "text-[#FF6B1A] opacity-100" : "opacity-65"}>
                                        {c.icon}
                                    </span>
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
                    <div className="grid grid-cols-4 gap-6 mt-7">
                        {PRODUCTS.map((p, i) => {
                            const isFav = favs.has(i);
                            return (
                                <article
                                    key={i}
                                    className="ap-card relative flex flex-col bg-white border border-[#E8E5DE] rounded-[18px] overflow-hidden"
                                >
                                    <div className="relative overflow-hidden bg-[#F4F3EE] aspect-[4/5]">
                                        <div className={`absolute inset-0 ${PH_CLASSES[p.ph]}`} />
                                        {/* pill */}
                                        {p.pill && (
                                            <span
                                                className={[
                                                    "absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold tracking-[.04em] backdrop-blur-md",
                                                    p.pill.type === "live" && "bg-[#E11D48] text-white",
                                                    p.pill.type === "hot" && "bg-[#FFEEDF] text-[#C94800]",
                                                    p.pill.type === "plain" && "bg-white/95 text-[#161412]",
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ")}
                                            >
                                                {p.pill.type === "live" && (
                                                    <span className="ap-blink w-1.5 h-1.5 bg-white rounded-full" />
                                                )}
                                                {p.pill.label}
                                            </span>
                                        )}
                                        {/* fav */}
                                        <button
                                            onClick={() => toggleFav(i)}
                                            className={[
                                                "absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/95 border-0 cursor-pointer grid place-items-center backdrop-blur-md transition-colors",
                                                isFav ? "text-[#E11D48]" : "text-[#4A4641] hover:text-[#E11D48]",
                                            ].join(" ")}
                                            aria-label="favorite"
                                        >
                                            <Heart filled={isFav} />
                                        </button>
                                        {/* image label */}
                                        <span
                                            className="absolute left-0 right-0 bottom-0 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[.08em] text-white/55"
                                            style={{
                                                background: "linear-gradient(180deg, transparent, rgba(0,0,0,.5))",
                                            }}
                                        >
                                            {p.label}
                                        </span>
                                        {/* timer */}
                                        <span className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 bg-black/75 text-white px-2.5 py-1.5 rounded-lg font-mono text-[12px] font-medium backdrop-blur-sm">
                                            {p.timer}
                                        </span>
                                    </div>
                                    <div className="p-4.5 flex flex-col gap-3.5">
                                        <div className="text-[11px] text-[#8B857E] uppercase tracking-[.08em] font-medium">
                                            {p.cat}
                                        </div>
                                        <div className="text-[16px] font-medium leading-[1.3] tracking-[-.005em] -my-1.5 line-clamp-2">
                                            {p.name}
                                        </div>
                                        <div className="flex items-end justify-between gap-2">
                                            <div>
                                                <div className="text-[11px] text-[#8B857E] uppercase tracking-[.06em]">
                                                    {p.priceLbl}
                                                </div>
                                                <div className="text-[22px] font-semibold tracking-[-.02em] leading-none font-num">
                                                    {p.price}
                                                    <small className="text-[13px] font-medium opacity-60 ml-1">฿</small>
                                                </div>
                                            </div>
                                            <div className="text-[13px] text-[#8B857E]">
                                                <b className="text-[#161412] font-semibold">{p.bids}</b> ประมูล
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 -mx-0.5">
                                            <div className="flex">
                                                {p.avatars.map((a, j) => (
                                                    <div
                                                        key={j}
                                                        className="w-6 h-6 rounded-full border-2 border-white -ml-1.5 text-[10px] font-semibold text-white grid place-items-center"
                                                        style={{
                                                            background: AVATAR_BG[a.c],
                                                            marginLeft: j === 0 ? 0 : -6,
                                                        }}
                                                    >
                                                        {a.t}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-[12px] text-[#8B857E]">{p.who}</div>
                                        </div>
                                        <button
                                            className={[
                                                "ap-card-btn h-11 rounded-full font-semibold text-[14px] cursor-pointer transition-all",
                                                p.primary
                                                    ? "bg-[#FF6B1A] border border-[#FF6B1A] text-white hover:bg-[#C94800] hover:border-[#C94800]"
                                                    : "bg-transparent border border-[#161412] text-[#161412] hover:bg-[#161412] hover:text-white",
                                            ].join(" ")}
                                        >
                                            {p.cta}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* ============ Recently sold ============ */}
                <section className="mt-[72px] bg-[#161412] text-white rounded-[28px] px-10 py-9 grid grid-cols-[1fr_1.8fr] gap-10 items-center">
                    <div>
                        <h3 className="m-0 mb-2 text-[26px] font-semibold tracking-[-.02em]">ขายแล้วล่าสุด</h3>
                        <p className="m-0 text-white/65 text-[14px]">
                            การประมูลที่ปิดดีล เห็นเทรนด์ราคา ก่อนเสนอราคาครั้งต่อไป
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4.5">
                        {SOLD.map((s, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-lg shrink-0 ap-sold-thumb ${s.thumb}`} />
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <div className="text-[13px] font-medium truncate">{s.name}</div>
                                    <div className="text-[13px] text-[#FF6B1A] font-semibold font-num">{s.price}</div>
                                    <div className="text-[11px] text-white/50">{s.ago}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ============ How it works ============ */}
                <section className="mt-24">
                    <SectionHead eyebrow="วิธีใช้งาน" title="ประมูลของสะสมใน 3 ขั้นตอน" showMore={false} />
                    <div className="grid grid-cols-3 gap-6 mt-8">
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

                {/* ============ Trust & Authentication ============ */}
                <section className="mt-24 bg-white border border-[#E8E5DE] rounded-[28px] p-14 grid grid-cols-[1fr_1.1fr] gap-16 items-center">
                    <div className="ap-trust-visual relative aspect-square rounded-[28px] overflow-hidden grid place-items-center">
                        <div className="ap-seal relative w-[200px] h-[200px] rounded-full bg-white grid place-items-center border border-[#E8E5DE] shadow-[0_32px_80px_-40px_rgba(20,18,15,.35),0_4px_16px_rgba(20,18,15,.06)]">
                            <div className="ap-seal-inner relative w-[140px] h-[140px] rounded-full bg-[#FFEEDF] text-[#C94800] grid place-items-center text-center font-mono text-[11px] font-medium tracking-[.1em] leading-[1.3]">
                                <div>
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="32"
                                        height="32"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="block mx-auto mb-2"
                                    >
                                        <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z" />
                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                    AFFERPRICE
                                    <br />
                                    VERIFIED
                                    <br />
                                    AUTHENTIC
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[.12em] uppercase text-[#8B857E]">
                            ตรวจสอบและรับประกันของแท้
                        </span>
                        <h3 className="mt-3 mb-3 text-[32px] font-semibold tracking-[-.02em] leading-[1.15]">
                            ทุกชิ้นผ่านการตรวจสอบ
                            <br />
                            โดยผู้เชี่ยวชาญ
                        </h3>
                        <p className="mt-0 mb-8 text-[15px] leading-[1.7] text-[#4A4641]">
                            นักประเมินของเรามีประสบการณ์เฉลี่ย 15+ ปี ในแต่ละหมวด — การ์ดสะสม, นาฬิกา, พระเครื่อง,
                            เครื่องประดับ และศิลปะ พร้อมระบบยืนยันความแท้แบบ multi-step ก่อนเปิดประมูลทุกครั้ง
                        </p>
                        <div className="flex flex-col gap-5">
                            {TRUST.map((t, i) => (
                                <div key={i} className="grid grid-cols-[42px_1fr] gap-4.5">
                                    <div className="w-[42px] h-[42px] rounded-lg bg-[#F4F3EE] text-[#161412] grid place-items-center shrink-0">
                                        {t.icon}
                                    </div>
                                    <div>
                                        <h5 className="m-0 mb-1 text-[15px] font-semibold">{t.title}</h5>
                                        <p className="m-0 text-[14px] text-[#8B857E] leading-[1.55]">{t.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ============ Testimonials / Reviews ============ */}
                <section className="mt-24">
                    <SectionHead eyebrow="รีวิวจากนักสะสม" title="นักสะสมตัวจริงไว้ใจเรา" more="รีวิวทั้งหมด" />
                    <div className="grid grid-cols-3 gap-6 mt-8">
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

                    <div className="mt-9 flex items-center justify-between px-8 py-6 bg-white border border-[#E8E5DE] rounded-[18px]">
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
                                        <div className="text-[#4A4641] text-[15px] leading-[1.7] pr-20 pb-7 max-w-[880px]">
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
                    className="mt-24 relative rounded-[28px] py-[72px] px-16 overflow-hidden text-white grid grid-cols-[1.4fr_1fr] gap-12 items-center"
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
                        <h3 className="mt-3 mb-4 text-[44px] font-semibold tracking-[-.025em] leading-[1.05]">
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
                            { lbl: "ผู้ขายที่ขายสำเร็จ", v: "94.6", suffix: "%" },
                            { lbl: "ผู้ซื้อที่ active", v: "8,142" },
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
