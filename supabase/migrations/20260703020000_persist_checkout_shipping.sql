-- Persist ที่อยู่จัดส่ง + รูปแบบ/ค่าจัดส่งที่ผู้ซื้อเลือกตอน checkout ลง auction_results
-- เดิมไม่ persist → payment page คิดยอดไม่รวมค่าส่ง + ผู้ขาย/แอดมินเห็นแค่ default address
ALTER TABLE auction_results ADD COLUMN IF NOT EXISTS address_id uuid REFERENCES user_addresses(id) ON DELETE SET NULL;
ALTER TABLE auction_results ADD COLUMN IF NOT EXISTS shipping_option text;
ALTER TABLE auction_results ADD COLUMN IF NOT EXISTS shipping_fee numeric(10,2) NOT NULL DEFAULT 0;
