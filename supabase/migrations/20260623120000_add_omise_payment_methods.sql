-- เพิ่ม 'truemoney' ใน payment_method CHECK constraint
-- (Rabbit LINE Pay ผ่าน Omise เก็บเป็น 'linepay' เดิม — ไม่ต้องเพิ่มใหม่)
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_method_check;
ALTER TABLE payments ADD CONSTRAINT payments_payment_method_check
  CHECK (payment_method IN ('bank', 'credit_card', 'promptpay', 'wallet', 'linepay', 'truemoney'));
