-- Wallet listing fee — link payment กับ product (audit + idempotency)
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS product_id uuid REFERENCES public.products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_payments_product ON public.payments(product_id);

-- charge_wallet_listing: ตัด wallet ชำระค่าธรรมเนียมลงขาย (5% ของ start_price)
-- Idempotent: ถ้าเคยจ่าย listing_fee ของ product นี้สำเร็จแล้ว → return error
CREATE OR REPLACE FUNCTION public.charge_wallet_listing(
  p_user_id uuid,
  p_amount numeric,
  p_product_id uuid
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_balance numeric;
  v_payment_id uuid;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'invalid_amount';
  END IF;

  IF EXISTS (
    SELECT 1 FROM payments
    WHERE product_id = p_product_id
      AND purpose = 'listing_fee'
      AND payment_status = 'success'
  ) THEN
    RAISE EXCEPTION 'already_paid';
  END IF;

  SELECT wallet_balance INTO v_balance
    FROM profiles WHERE id = p_user_id FOR UPDATE;
  IF v_balance IS NULL THEN RAISE EXCEPTION 'profile_not_found'; END IF;
  IF v_balance < p_amount THEN RAISE EXCEPTION 'insufficient_balance'; END IF;

  UPDATE profiles SET wallet_balance = wallet_balance - p_amount
    WHERE id = p_user_id RETURNING wallet_balance INTO v_balance;

  INSERT INTO payments (
    auction_result_id, user_id, amount, payment_method,
    payment_status, paid_at, purpose, product_id
  )
  VALUES (
    NULL, p_user_id, p_amount, 'wallet',
    'success', now(), 'listing_fee', p_product_id
  )
  RETURNING id INTO v_payment_id;

  INSERT INTO wallet_transactions (
    user_id, amount, type, reference_id, balance_after, note
  )
  VALUES (
    p_user_id, -p_amount, 'payment', v_payment_id, v_balance,
    'listing fee for product ' || p_product_id::text
  );

  RETURN jsonb_build_object('payment_id', v_payment_id, 'balance_after', v_balance);
END $$;

REVOKE ALL ON FUNCTION public.charge_wallet_listing(uuid, numeric, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.charge_wallet_listing(uuid, numeric, uuid) TO service_role;
