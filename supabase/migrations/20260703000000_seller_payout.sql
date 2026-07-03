-- Seller payout: เครดิตเงินขายเข้า wallet ผู้ขาย
--   * ผู้ซื้อชำระค่าประมูลสำเร็จ → ผู้ขายได้ final_price เต็ม (platform เก็บค่าธรรมเนียม 5% จากผู้ซื้อ + listing fee แล้ว)
--   * ผู้ซื้อผิดนัด (forfeit) → มัดจำที่ริบ credit ให้ผู้ขายเป็นค่าชดเชย
-- เงินเข้า wallet ผู้ขาย → ถอนออกผ่าน withdrawal flow (ดู migration ถัดไป)

-- 1. เพิ่ม type 'sale' (รายได้ขาย) + 'withdrawal' (ถอนออก) ให้ wallet_transactions
ALTER TABLE wallet_transactions DROP CONSTRAINT IF EXISTS wallet_transactions_type_check;
ALTER TABLE wallet_transactions ADD CONSTRAINT wallet_transactions_type_check
  CHECK (type IN ('topup', 'payment', 'refund', 'sale', 'withdrawal'));

-- 2. credit_seller_proceeds: เครดิต final_price เข้า wallet ผู้ขาย (idempotent ต่อ auction_result)
CREATE OR REPLACE FUNCTION credit_seller_proceeds(p_auction_result_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_result auction_results%ROWTYPE;
  v_seller_id uuid;
  v_balance numeric;
BEGIN
  SELECT * INTO v_result FROM auction_results WHERE id = p_auction_result_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'auction_result_not_found'; END IF;
  IF v_result.payment_status <> 'paid' THEN
    RETURN jsonb_build_object('skipped', true, 'reason', 'not_paid');
  END IF;

  -- idempotent: เครดิตขายไปแล้วไม่ทำซ้ำ (กัน webhook ยิงซ้ำ / เรียกจากหลายจุด)
  IF EXISTS (SELECT 1 FROM wallet_transactions WHERE reference_id = p_auction_result_id AND type = 'sale') THEN
    RETURN jsonb_build_object('already_credited', true);
  END IF;

  SELECT seller_id INTO v_seller_id FROM products WHERE id = v_result.product_id;
  IF v_seller_id IS NULL THEN RAISE EXCEPTION 'seller_not_found'; END IF;

  UPDATE profiles SET wallet_balance = wallet_balance + v_result.final_price
    WHERE id = v_seller_id RETURNING wallet_balance INTO v_balance;

  INSERT INTO wallet_transactions (user_id, amount, type, reference_id, balance_after, note)
    VALUES (v_seller_id, v_result.final_price, 'sale', p_auction_result_id, v_balance, 'auction sale proceeds');

  RETURN jsonb_build_object('seller_id', v_seller_id, 'amount', v_result.final_price, 'balance_after', v_balance);
END $$;

REVOKE ALL ON FUNCTION credit_seller_proceeds(uuid) FROM public;
GRANT EXECUTE ON FUNCTION credit_seller_proceeds(uuid) TO service_role;

-- 3. expire_unpaid_auction: เพิ่มเครดิตมัดจำที่ริบให้ผู้ขายเป็นค่าชดเชย (CREATE OR REPLACE จาก 20260702100000)
CREATE OR REPLACE FUNCTION expire_unpaid_auction(p_auction_result_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_result auction_results%ROWTYPE;
  v_seller_id uuid;
  v_deposit_amount numeric;
  v_seller_balance numeric;
BEGIN
  SELECT * INTO v_result FROM auction_results WHERE id = p_auction_result_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'auction_result_not_found'; END IF;

  IF v_result.payment_status <> 'pending' THEN
    RETURN jsonb_build_object('already_processed', true, 'status', v_result.payment_status);
  END IF;

  IF v_result.payment_due_at IS NULL OR v_result.payment_due_at > now() THEN
    RETURN jsonb_build_object('not_due', true);
  END IF;

  UPDATE auction_results SET payment_status = 'canceled' WHERE id = p_auction_result_id;

  UPDATE bid_deposits
    SET status = 'forfeited', forfeited_at = now()
    WHERE product_id = v_result.product_id
      AND user_id = v_result.winner_id
      AND status IN ('applied', 'held')
    RETURNING amount INTO v_deposit_amount;

  UPDATE products SET state = 'cancelled'
    WHERE id = v_result.product_id AND state = 'sold'
    RETURNING seller_id INTO v_seller_id;

  IF v_seller_id IS NULL THEN
    SELECT seller_id INTO v_seller_id FROM products WHERE id = v_result.product_id;
  END IF;

  -- มัดจำที่ริบ → เครดิตให้ผู้ขายเป็นค่าชดเชยการผิดนัดของผู้ซื้อ
  IF COALESCE(v_deposit_amount, 0) > 0 AND v_seller_id IS NOT NULL THEN
    UPDATE profiles SET wallet_balance = wallet_balance + v_deposit_amount
      WHERE id = v_seller_id RETURNING wallet_balance INTO v_seller_balance;
    INSERT INTO wallet_transactions (user_id, amount, type, reference_id, balance_after, note)
      VALUES (v_seller_id, v_deposit_amount, 'sale', p_auction_result_id, v_seller_balance, 'forfeited deposit compensation');
  END IF;

  RETURN jsonb_build_object(
    'expired', true,
    'winner_id', v_result.winner_id,
    'seller_id', v_seller_id,
    'product_id', v_result.product_id,
    'deposit_amount', COALESCE(v_deposit_amount, 0)
  );
END $$;

REVOKE ALL ON FUNCTION expire_unpaid_auction(uuid) FROM public;
GRANT EXECUTE ON FUNCTION expire_unpaid_auction(uuid) TO service_role;
