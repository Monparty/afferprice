-- แบ่งเงินมัดจำที่ริบ (ผู้ชนะไม่จ่ายตามกำหนด): มัดจำ = 20% ของราคาสินค้า
-- → 15% เข้าแพลตฟอร์ม (เงินอยู่กับ platform อยู่แล้ว ไม่ต้อง move) + 5% ให้ผู้ขายเป็นค่าชดเชย
-- ผู้ขายจึงได้ 5/20 = 25% ของยอดมัดจำ (เดิม: ได้เต็ม 100%)
-- หมายเหตุ: ผู้ขายยังได้เงินค่าประกันการขาย (listing fee) คืนแยกต่างหากผ่าน refund_listing_fee

CREATE OR REPLACE FUNCTION "public"."expire_unpaid_auction"("p_auction_result_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_result auction_results%ROWTYPE;
  v_seller_id uuid;
  v_deposit_amount numeric;
  v_seller_comp numeric;
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

  -- มัดจำที่ริบ (20% ของราคา) → ผู้ขายได้ส่วนแบ่ง 5% ของราคา = 1/4 ของมัดจำ; ที่เหลือ 15% platform เก็บ
  v_seller_comp := ROUND(COALESCE(v_deposit_amount, 0) * 5.0 / 20.0, 2);
  IF v_seller_comp > 0 AND v_seller_id IS NOT NULL THEN
    UPDATE profiles SET wallet_balance = wallet_balance + v_seller_comp
      WHERE id = v_seller_id RETURNING wallet_balance INTO v_seller_balance;
    INSERT INTO wallet_transactions (user_id, amount, type, reference_id, balance_after, note)
      VALUES (v_seller_id, v_seller_comp, 'sale', p_auction_result_id, v_seller_balance, 'forfeited deposit compensation (5% of 20%)');
  END IF;

  RETURN jsonb_build_object(
    'expired', true,
    'winner_id', v_result.winner_id,
    'seller_id', v_seller_id,
    'product_id', v_result.product_id,
    'deposit_amount', COALESCE(v_deposit_amount, 0),
    'seller_compensation', COALESCE(v_seller_comp, 0)
  );
END $$;

ALTER FUNCTION "public"."expire_unpaid_auction"("p_auction_result_id" "uuid") OWNER TO "postgres";

-- hardening: RPC เงิน → server (service_role) เท่านั้น (guard ภายในมีอยู่แล้ว แต่ปิดทางเรียกตรงจาก client)
REVOKE ALL ON FUNCTION "public"."expire_unpaid_auction"("p_auction_result_id" "uuid") FROM PUBLIC;
REVOKE ALL ON FUNCTION "public"."expire_unpaid_auction"("p_auction_result_id" "uuid") FROM anon;
REVOKE ALL ON FUNCTION "public"."expire_unpaid_auction"("p_auction_result_id" "uuid") FROM authenticated;
GRANT ALL ON FUNCTION "public"."expire_unpaid_auction"("p_auction_result_id" "uuid") TO service_role;
