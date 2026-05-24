-- เพิ่ม 'linepay' ใน payment_method CHECK constraint
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_method_check;
ALTER TABLE payments ADD CONSTRAINT payments_payment_method_check
  CHECK (payment_method IN ('bank', 'credit_card', 'promptpay', 'wallet', 'linepay'));
