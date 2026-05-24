-- credit_wallet: เครดิตเงินเข้า wallet หลัง topup สำเร็จ (idempotent ผ่าน payment_id)
CREATE OR REPLACE FUNCTION credit_wallet(p_payment_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_payment payments%ROWTYPE;
  v_balance numeric;
BEGIN
  SELECT * INTO v_payment FROM payments WHERE id = p_payment_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'payment_not_found'; END IF;
  IF v_payment.purpose <> 'topup' THEN RAISE EXCEPTION 'not_topup_payment'; END IF;

  IF EXISTS (SELECT 1 FROM wallet_transactions WHERE reference_id = p_payment_id AND type = 'topup') THEN
    RETURN jsonb_build_object('already_credited', true);
  END IF;

  UPDATE profiles SET wallet_balance = wallet_balance + v_payment.amount
    WHERE id = v_payment.user_id RETURNING wallet_balance INTO v_balance;

  INSERT INTO wallet_transactions (user_id, amount, type, reference_id, balance_after, note)
    VALUES (v_payment.user_id, v_payment.amount, 'topup', p_payment_id, v_balance,
            'topup via ' || v_payment.payment_method);

  RETURN jsonb_build_object('balance_after', v_balance);
END $$;

-- charge_wallet: ตัดเงินออกจาก wallet (atomic) สำหรับชำระค่าประมูล
CREATE OR REPLACE FUNCTION charge_wallet(p_user_id uuid, p_amount numeric, p_auction_result_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_balance numeric;
  v_payment_id uuid;
BEGIN
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

REVOKE ALL ON FUNCTION credit_wallet(uuid) FROM public;
REVOKE ALL ON FUNCTION charge_wallet(uuid, numeric, uuid) FROM public;
GRANT EXECUTE ON FUNCTION credit_wallet(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION charge_wallet(uuid, numeric, uuid) TO service_role;
