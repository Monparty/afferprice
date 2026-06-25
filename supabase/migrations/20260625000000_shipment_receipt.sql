-- #9/#10: ผู้ซื้อยืนยันรับสินค้า + วิดีโอแกะกล่อง (หลักฐานภายใน 48 ชม.)
-- ผู้ซื้อกด "ยืนยันรับสินค้า" → shipping_status='delivered' + received_at + unboxing_video_url
-- (update ทำผ่าน server action `confirmReceipt` ด้วย service_role — ไม่เพิ่ม RLS policy)

alter table public.shipments
    add column if not exists received_at timestamptz,
    add column if not exists unboxing_video_url text;
