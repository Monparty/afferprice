-- ============================================================
-- seed.sql — ข้อมูลทดสอบ AfterPrice
-- วิธีใช้:
--   1. แทนที่ UUID ในส่วน SELLER IDs ด้วย id จริงจาก auth.users
--   2. Run ใน Supabase SQL Editor หรือ psql
-- ============================================================

-- ── Categories ───────────────────────────────────────────────
INSERT INTO
    public.categories (
        id,
        parent_id,
        name,
        description
    )
VALUES (
        '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
        NULL,
        'อิเล็กทรอนิกส์',
        'อุปกรณ์อิเล็กทรอนิกส์ทุกประเภท'
    ),
    (
        '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
        '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
        'กล้องถ่ายภาพ',
        'กล้องดิจิตัล มิเรอร์เลส ฟิล์ม'
    ),
    (
        '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
        '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
        'คอมพิวเตอร์และโน้ตบุ๊ก',
        'แล็ปท็อป แท็บเล็ต อุปกรณ์ต่อพ่วง'
    ),
    (
        '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
        NULL,
        'นาฬิกา',
        'นาฬิกาหรู นาฬิกาโบราณ'
    ),
    (
        '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
        '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
        'สมาร์ทวอทช์',
        'Apple Watch Garmin Suunto'
    ),
    (
        '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
        NULL,
        'เครื่องประดับ',
        'แหวน สร้อย ต่างหู กำไล'
    ),
    (
        '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
        NULL,
        'ศิลปะและของสะสม',
        'จิตรกรรม ประติมากรรม ภาพถ่ายศิลปะ'
    ),
    (
        '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
        NULL,
        'พระเครื่องและวัตถุมงคล',
        'พระเครื่อง เหรียญ วัตถุมงคล'
    ),
    (
        '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
        NULL,
        'ยานยนต์',
        'รถยนต์ มอเตอร์ไซค์ รถคลาสสิก'
    )
ON CONFLICT (id) DO NOTHING;

-- ── Products ─────────────────────────────────────────────────
-- TODO: แทนที่ seller_id ด้านล่างด้วย UUID จริงของผู้ใช้ใน auth.users
-- seller1 = '71d87ea2-5206-444c-b6a4-ce9b2ea002ed'
-- seller2 = '71d87ea2-5206-444c-b6a4-ce9b2ea002ed'

INSERT INTO
    public.products (
        seller_id,
        category_id,
        title,
        description,
        condition,
        start_price,
        buy_now_price,
        auction_start_time,
        auction_end_time,
        duration_days,
        state,
        images_url
    )
VALUES

-- 1. นาฬิกาโอเมก้า — active (กำลังประมูล)
(
    '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
    '11fbf64c-78cb-425f-9aa8-b47bf4ea57bf',
    'โอเมก้า สปีดมาสเตอร์ มูนวอทช์ Ref. 310.30.42.50.01.001',
    'นาฬิกามือสอง สภาพดีมาก เดินแม่นยำ พร้อมกล่องและเอกสารครบ ปี 2021 เซอร์วิสครบแล้ว ประกันศูนย์เหลือ 1 ปี',
    'like_new',
    185000.00,
    230000.00,
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '2 days 3 hours 45 minutes',
    3,
    'active',
    '[{"url":"https://placehold.co/600x400?text=Omega+1","order":1},{"url":"https://placehold.co/600x400?text=Omega+2","order":2}]'
),

-- 2. MacBook Pro — active (ใกล้หมดเวลา 15 นาที)
(
    '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
    '11fbf64c-78cb-425f-9aa8-b47bf4ea57bf',
    'Apple MacBook Pro 16 นิ้ว M3 Max 128GB RAM / 4TB SSD',
    'ซื้อมาใช้งาน 3 เดือน สภาพดีมาก ยังอยู่ในประกัน AppleCare+ ถึงปี 2027 มาพร้อม USB-C Hub และ Magic Mouse',
    'like_new',
    75000.00,
    95000.00,
    NOW() - INTERVAL '6 hours',
    NOW() + INTERVAL '15 minutes 30 seconds',
    1,
    'active',
    '[{"url":"https://placehold.co/600x400?text=MacBook+1","order":1},{"url":"https://placehold.co/600x400?text=MacBook+2","order":2}]'
),

-- 3. กล้องไรก้า — active
(
    '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
    '11fbf64c-78cb-425f-9aa8-b47bf4ea57bf',
    'Leica M11 Digital Rangefinder 60MP Black Chrome',
    'กล้องสภาพสวย ใช้งาน 6 เดือน พร้อม Lens Summicron-M 35mm f/2 (มูลค่าเลนส์ 95,000 บาท) ชัตเตอร์ 1,200 ครั้ง',
    'good',
    240000.00,
    NULL,
    NOW() - INTERVAL '2 days',
    NOW() + INTERVAL '5 hours 22 minutes',
    7,
    'active',
    '[{"url":"https://placehold.co/600x400?text=Leica+1","order":1},{"url":"https://placehold.co/600x400?text=Leica+2","order":2},{"url":"https://placehold.co/600x400?text=Leica+3","order":3}]'
),

-- 4. ภาพวาดสีน้ำมัน — active
(
    '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
    '11fbf64c-78cb-425f-9aa8-b47bf4ea57bf',
    'Leica M11 Digital Rangefinder 60MP Black Chrome',
    'เกษม ขนาด 80×120 ทองคำ สีไม่ซีด',
    'new',
    150000.00,
    200000.00,
    NOW() - INTERVAL '3 days',
    NOW() + INTERVAL '1 day 10 hours 45 minutes',
    5,
    'active',
    '[{"url":"https://placehold.co/600x400?text=Art+1","order":1},{"url":"https://placehold.co/600x400?text=Art+2","order":2}]'
),

-- 5. โรเล็กซ์ ซับมาริเนอร์ — active (ใกล้หมด ~55 นาที)
(
    '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
    '11fbf64c-78cb-425f-9aa8-b47bf4ea57bf',
    'Rolex Submariner Date 126610LV "Starbucks" Full Set 2022',
    'Full set box & papers ปี 2022 สภาพ 98% ไม่เคยขัดเจาะ Ref. 126610LV หน้าปัดดำ ขอบเขียว สายเหล็กแท้',
    'like_new',
    320000.00,
    420000.00,
    NOW() - INTERVAL '12 hours',
    NOW() + INTERVAL '55 minutes 20 seconds',
    1,
    'active',
    '[{"url":"https://placehold.co/600x400?text=Rolex+1","order":1},{"url":"https://placehold.co/600x400?text=Rolex+2","order":2}]'
),

-- 6. พระสมเด็จ — pending_review (รอตรวจสอบ)
(
    '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
    '11fbf64c-78cb-425f-9aa8-b47bf4ea57bf',
    'พระสมเด็จ วัดระฆังโฆสิตาราม พิมพ์ใหญ่ พร้อมตลับทอง 96.5%',
    'พระสมเด็จแท้ ตรวจสอบโดยผู้เชี่ยวชาญสมาคมผู้นิยมพระเครื่อง มีใบรับรอง ถ่ายรูปหน้า-หลัง-ด้านข้าง ตลับทองคำแท้',
    'good',
    850000.00,
    NULL,
    NULL,
    NOW() + INTERVAL '7 days',
    7,
    'pending_review',
    '[{"url":"https://placehold.co/600x400?text=Phra+1","order":1},{"url":"https://placehold.co/600x400?text=Phra+2","order":2}]'
),

-- 7. รถคลาสสิก — ended (จบการประมูลแล้ว)
(
    '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
    '11fbf64c-78cb-425f-9aa8-b47bf4ea57bf',
    'Ford Mustang Fastback 1967 ปรับปรุงใหม่ทั้งคัน สีแดง Candy Apple',
    'ซ่อมแซมและทาสีใหม่ทั้งคัน เครื่องยนต์ V8 390ci Rebuilt ภายในครบ เอกสารจดทะเบียนครบถ้วน พร้อมโอน',
    'good',
    4500000.00,
    NULL,
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '1 day',
    7,
    'ended',
    '[{"url":"https://placehold.co/600x400?text=Car+1","order":1},{"url":"https://placehold.co/600x400?text=Car+2","order":2},{"url":"https://placehold.co/600x400?text=Car+3","order":3}]'
),

-- 8. แหวนเพชร — active
(
    '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
    '11fbf64c-78cb-425f-9aa8-b47bf4ea57bf',
    'แหวนเพชรเบลเยียม 2.5 กะรัต F/VS1 ใบรับรอง GIA ตัวเรือนแพลทินัม 950',
    'เพชรเบลเยียมแท้ 2.5 กะรัต เกรด F สีขาว VS1 ความสะอาด ตัวเรือนแพลทินัม 950 พร้อมกล่องและใบ GIA ออริจินัล',
    'new',
    280000.00,
    380000.00,
    NOW() - INTERVAL '4 days',
    NOW() + INTERVAL '4 hours 18 minutes',
    5,
    'active',
    '[{"url":"https://placehold.co/600x400?text=Ring+1","order":1},{"url":"https://placehold.co/600x400?text=Ring+2","order":2}]'
),

-- 9. Apple Watch Ultra 2 — active
(
    '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
    '11fbf64c-78cb-425f-9aa8-b47bf4ea57bf',
    'Apple Watch Ultra 2 Titanium 49mm Alpine Loop Size M',
    'ซื้อมา 2 เดือน สภาพสวย แบตเตอรี่ 99% ยังอยู่ในประกัน AppleCare+ พร้อมสายสำรองอีก 2 เส้น',
    'like_new',
    38000.00,
    45000.00,
    NOW() - INTERVAL '1 day 6 hours',
    NOW() + INTERVAL '3 days 8 hours',
    5,
    'active',
    '[{"url":"https://placehold.co/600x400?text=Watch+1","order":1}]'
),

-- 10. กล้องฟูจิ — rejected (ถูกปฏิเสธ)
(
    '71d87ea2-5206-444c-b6a4-ce9b2ea002ed',
    '11fbf64c-78cb-425f-9aa8-b47bf4ea57bf',
    'Fujifilm X-T5 Mirrorless Body + XF 18-55mm f/2.8-4',
    'กล้องมือสอง สภาพดี ใช้งาน 1 ปี ชัตเตอร์ 5,000 ครั้ง ไม่มีรอยขีดข่วน พร้อมถุงกล้องและสายคล้อง',
    'good',
    62000.00,
    NULL,
    NULL,
    NOW() + INTERVAL '5 days',
    5,
    'rejected',
    '[{"url":"https://placehold.co/600x400?text=Fuji+1","order":1}]'
);