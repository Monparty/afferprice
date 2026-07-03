-- คืนเงินค่าประกันการขาย (เดิม: ค่าธรรมเนียมลงขาย 5%) ให้ผู้ขายเมื่อการขายไม่สำเร็จ
-- เรียกจาก server เท่านั้น (reconcile.js): กรณีไม่มีคน bid (endAuction → cancelled)
-- และกรณีผู้ชนะไม่ชำระเงินตามกำหนด (expire_unpaid_auction → cancelled)

CREATE OR REPLACE FUNCTION public.refund_listing_fee(p_product_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_payment payments%ROWTYPE;
  v_balance numeric;
BEGIN
  -- lock payment row → serialize การเรียกซ้ำพร้อมกัน (idempotency check ข้างล่างจึงปลอดภัย)
  SELECT * INTO v_payment FROM payments
    WHERE product_id = p_product_id
      AND purpose = 'listing_fee'
      AND payment_status = 'success'
    ORDER BY paid_at DESC NULLS LAST
    LIMIT 1
    FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('no_payment', true);
  END IF;

  -- idempotent: เคยคืนแล้ว → จบ (กัน double-credit เมื่อ reconcile ถูกยิงซ้ำ)
  IF EXISTS (
    SELECT 1 FROM wallet_transactions
    WHERE reference_id = v_payment.id AND type = 'refund'
  ) THEN
    RETURN jsonb_build_object('already_processed', true);
  END IF;

  UPDATE profiles SET wallet_balance = wallet_balance + v_payment.amount
    WHERE id = v_payment.user_id RETURNING wallet_balance INTO v_balance;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('no_payment', true);
  END IF;

  INSERT INTO wallet_transactions (user_id, amount, type, reference_id, balance_after, note)
    VALUES (v_payment.user_id, v_payment.amount, 'refund', v_payment.id, v_balance, 'listing fee refund');

  RETURN jsonb_build_object(
    'refunded', true,
    'seller_id', v_payment.user_id,
    'amount', v_payment.amount,
    'balance_after', v_balance
  );
END $$;

ALTER FUNCTION public.refund_listing_fee(uuid) OWNER TO postgres;

-- server-only: เงินเข้า wallet ต้องผ่าน service_role เท่านั้น
REVOKE ALL ON FUNCTION public.refund_listing_fee(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.refund_listing_fee(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.refund_listing_fee(uuid) FROM authenticated;
GRANT ALL ON FUNCTION public.refund_listing_fee(uuid) TO service_role;
