-- กำหนดเวลาชำระเงินของผู้ชนะ (payment deadline) + ริบมัดจำเมื่อไม่ชำระตามกำหนด (forfeit)
-- ผู้ชนะมีเวลา 3 วันหลังปิดประมูลเพื่อชำระค่าประมูล; ถ้าไม่ชำระ:
--   * auction_results.payment_status → 'canceled'
--   * มัดจำผู้ชนะ (bid_deposits) → 'forfeited' (เงินถูกตัดตอนวางมัดจำแล้ว ไม่คืน = ค่าปรับ)
--   * product.state → 'cancelled' (ประมูลไม่สำเร็จ)

-- 1. เพิ่มคอลัมน์กำหนดชำระเงินใน auction_results
ALTER TABLE auction_results ADD COLUMN IF NOT EXISTS payment_due_at timestamptz;

-- 2. เพิ่มสถานะ 'forfeited' ให้ bid_deposits + คอลัมน์เวลาที่ริบ
ALTER TABLE bid_deposits ADD COLUMN IF NOT EXISTS forfeited_at timestamptz;
ALTER TABLE bid_deposits DROP CONSTRAINT IF EXISTS bid_deposits_status_check;
ALTER TABLE bid_deposits ADD CONSTRAINT bid_deposits_status_check
  CHECK (status IN ('held', 'refunded', 'applied', 'forfeited'));

-- 3. Backfill: ผลประมูลที่ยังค้างชำระอยู่ ให้ผ่อนผัน 3 วันนับจากตอน migrate (ไม่ริบย้อนหลังทันที)
UPDATE auction_results
  SET payment_due_at = now() + interval '3 days'
  WHERE payment_status = 'pending' AND payment_due_at IS NULL;

-- 4. expire_unpaid_auction: ยกเลิกผลประมูลที่ผู้ชนะไม่ชำระตามกำหนด (atomic, idempotent)
--    grant service_role เท่านั้น; guard ด้วย payment_due_at + payment_status ภายใน (กัน abuse)
CREATE OR REPLACE FUNCTION expire_unpaid_auction(p_auction_result_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_result auction_results%ROWTYPE;
  v_seller_id uuid;
  v_deposit_amount numeric;
BEGIN
  SELECT * INTO v_result FROM auction_results WHERE id = p_auction_result_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'auction_result_not_found'; END IF;

  -- idempotent: ชำระแล้ว (paid) หรือยกเลิกไปแล้ว (canceled) → ไม่ทำซ้ำ
  IF v_result.payment_status <> 'pending' THEN
    RETURN jsonb_build_object('already_processed', true, 'status', v_result.payment_status);
  END IF;

  -- ยังไม่ครบกำหนดชำระ → ยังไม่ยกเลิก
  IF v_result.payment_due_at IS NULL OR v_result.payment_due_at > now() THEN
    RETURN jsonb_build_object('not_due', true);
  END IF;

  -- ยกเลิกผลประมูล
  UPDATE auction_results SET payment_status = 'canceled' WHERE id = p_auction_result_id;

  -- ริบมัดจำผู้ชนะ (applied/held → forfeited); เงินถูกตัดจาก wallet ตั้งแต่ตอนวางแล้ว จึงไม่คืน
  UPDATE bid_deposits
    SET status = 'forfeited', forfeited_at = now()
    WHERE product_id = v_result.product_id
      AND user_id = v_result.winner_id
      AND status IN ('applied', 'held')
    RETURNING amount INTO v_deposit_amount;

  -- product กลับเป็น cancelled (ยังต้องเป็น 'sold' อยู่ ถ้า order แปลว่าจ่ายแล้วซึ่งไม่ควรมาถึงจุดนี้)
  UPDATE products SET state = 'cancelled'
    WHERE id = v_result.product_id AND state = 'sold'
    RETURNING seller_id INTO v_seller_id;

  IF v_seller_id IS NULL THEN
    SELECT seller_id INTO v_seller_id FROM products WHERE id = v_result.product_id;
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

-- 5. charge_wallet: เพิ่ม lock + guard auction_results (กัน race กับ expire_unpaid_auction)
--    เดิมไม่ lock/เช็คสถานะ auction_results เลย → ถ้า expire รันแทรกกลาง ผู้ชนะอาจโดนตัดเงิน
--    ค่าประมูล "และ" ถูกริบมัดจำพร้อมกัน. ล็อก row เดียวกับ expire แล้วเช็ค pending + ยังไม่เลยกำหนด
CREATE OR REPLACE FUNCTION charge_wallet(p_user_id uuid, p_amount numeric, p_auction_result_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_balance numeric;
  v_payment_id uuid;
  v_result auction_results%ROWTYPE;
BEGIN
  -- ล็อก auction_results ก่อน (serialize กับ expire_unpaid_auction ที่ล็อก row เดียวกัน)
  SELECT * INTO v_result FROM auction_results WHERE id = p_auction_result_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'auction_result_not_found'; END IF;
  IF v_result.payment_status = 'paid' THEN RAISE EXCEPTION 'already_paid'; END IF;
  IF v_result.payment_status = 'canceled' THEN RAISE EXCEPTION 'auction_canceled'; END IF;
  IF v_result.payment_due_at IS NOT NULL AND v_result.payment_due_at < now() THEN
    RAISE EXCEPTION 'payment_expired';
  END IF;

  SELECT wallet_balance INTO v_balance FROM profiles WHERE id = p_user_id FOR UPDATE;
  IF v_balance IS NULL THEN RAISE EXCEPTION 'profile_not_found'; END IF;
  IF v_balance < p_amount THEN RAISE EXCEPTION 'insufficient_balance'; END IF;

  UPDATE profiles SET wallet_balance = wallet_balance - p_amount
    WHERE id = p_user_id RETURNING wallet_balance INTO v_balance;

  INSERT INTO payments (auction_result_id, user_id, amount, payment_method, payment_status, paid_at, purpose)
    VALUES (p_auction_result_id, p_user_id, p_amount, 'wallet', 'success', now(), 'auction')
    RETURNING id INTO v_payment_id;

  INSERT INTO wallet_transactions (user_id, amount, type, reference_id, balance_after, note)
    VALUES (p_user_id, -p_amount, 'payment', v_payment_id, v_balance, 'auction payment');

  UPDATE auction_results SET payment_status = 'paid' WHERE id = p_auction_result_id;

  RETURN jsonb_build_object('payment_id', v_payment_id, 'balance_after', v_balance);
END $$;

REVOKE ALL ON FUNCTION charge_wallet(uuid, numeric, uuid) FROM public;
GRANT EXECUTE ON FUNCTION charge_wallet(uuid, numeric, uuid) TO service_role;
