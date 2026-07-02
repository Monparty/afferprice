-- เงินมัดจำการประมูล (bid deposit)
-- ผู้ประมูลครั้งแรกของแต่ละสินค้า ต้องวางมัดจำ 20% ของราคาปัจจุบัน (ตัดจาก wallet)
--   * แพ้ประมูล → คืนเข้า wallet อัตโนมัติ (/api/auction/end เรียก refund_bid_deposit)
--   * ชนะประมูล → status='applied' แล้วหักออกจากยอดชำระตอน checkout

CREATE TABLE bid_deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  -- held = ถืออยู่ระหว่างประมูล, refunded = คืนแล้ว (แพ้/ยกเลิก), applied = ผู้ชนะ หักจากยอดชำระ
  status text NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'refunded', 'applied')),
  created_at timestamptz DEFAULT now(),
  refunded_at timestamptz,
  UNIQUE (product_id, user_id)
);

CREATE INDEX idx_bid_deposits_product_status ON bid_deposits(product_id, status);

-- กัน /api/auction/end รันซ้ำพร้อมกันแล้วสร้าง result ซ้ำ (endpoint นี้ move เงินจริงแล้ว)
ALTER TABLE auction_results ADD CONSTRAINT auction_results_product_id_key UNIQUE (product_id);

ALTER TABLE bid_deposits ENABLE ROW LEVEL SECURITY;

-- อ่านได้เฉพาะมัดจำของตัวเอง; INSERT/UPDATE ผ่าน RPC (service_role) เท่านั้น
CREATE POLICY "own deposit read" ON bid_deposits
  FOR SELECT USING (auth.uid() = user_id);

-- place_bid_deposit: ตัด wallet วางมัดจำ 20% ของราคาปัจจุบัน (atomic, กันซ้ำผ่าน UNIQUE)
CREATE OR REPLACE FUNCTION place_bid_deposit(p_user_id uuid, p_product_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_product products%ROWTYPE;
  v_current numeric;
  v_amount numeric;
  v_balance numeric;
  v_deposit_id uuid;
  v_kyc text;
BEGIN
  SELECT * INTO v_product FROM products WHERE id = p_product_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'product_not_found'; END IF;
  IF v_product.state <> 'active' THEN RAISE EXCEPTION 'auction_not_active'; END IF;
  IF v_product.auction_end_time IS NULL OR v_product.auction_end_time <= now() THEN
    RAISE EXCEPTION 'auction_ended';
  END IF;
  IF v_product.seller_id = p_user_id THEN RAISE EXCEPTION 'seller_cannot_bid'; END IF;

  -- กัน user ที่ KYC ยังไม่ approved ล็อกเงินตัวเองทั้งที่ bid ไม่ได้ (สอดคล้อง validate_bid)
  SELECT is_kyc INTO v_kyc FROM profiles WHERE id = p_user_id;
  IF v_kyc IS DISTINCT FROM 'approved' THEN RAISE EXCEPTION 'bidder_kyc_not_approved'; END IF;

  IF EXISTS (SELECT 1 FROM bid_deposits WHERE product_id = p_product_id AND user_id = p_user_id) THEN
    RAISE EXCEPTION 'already_deposited';
  END IF;

  -- ราคาปัจจุบัน = highest bid หรือ start_price (สูตรเดียวกับ validate_bid)
  SELECT COALESCE(MAX(bid_price), v_product.start_price) INTO v_current
  FROM bids WHERE product_id = p_product_id;
  v_amount := GREATEST(1, ROUND(v_current * 0.20));

  SELECT wallet_balance INTO v_balance FROM profiles WHERE id = p_user_id FOR UPDATE;
  IF v_balance IS NULL THEN RAISE EXCEPTION 'profile_not_found'; END IF;
  IF v_balance < v_amount THEN RAISE EXCEPTION 'insufficient_balance'; END IF;

  UPDATE profiles SET wallet_balance = wallet_balance - v_amount
    WHERE id = p_user_id RETURNING wallet_balance INTO v_balance;

  INSERT INTO bid_deposits (product_id, user_id, amount)
    VALUES (p_product_id, p_user_id, v_amount)
    RETURNING id INTO v_deposit_id;

  INSERT INTO wallet_transactions (user_id, amount, type, reference_id, balance_after, note)
    VALUES (p_user_id, -v_amount, 'payment', v_deposit_id, v_balance, 'bid deposit');

  RETURN jsonb_build_object('deposit_id', v_deposit_id, 'amount', v_amount, 'balance_after', v_balance);
END $$;

-- refund_bid_deposit: คืนมัดจำเข้า wallet (idempotent — คืนเฉพาะ status='held')
CREATE OR REPLACE FUNCTION refund_bid_deposit(p_deposit_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_deposit bid_deposits%ROWTYPE;
  v_balance numeric;
BEGIN
  SELECT * INTO v_deposit FROM bid_deposits WHERE id = p_deposit_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'deposit_not_found'; END IF;
  IF v_deposit.status <> 'held' THEN
    RETURN jsonb_build_object('already_processed', true, 'status', v_deposit.status);
  END IF;

  UPDATE profiles SET wallet_balance = wallet_balance + v_deposit.amount
    WHERE id = v_deposit.user_id RETURNING wallet_balance INTO v_balance;

  UPDATE bid_deposits SET status = 'refunded', refunded_at = now() WHERE id = p_deposit_id;

  INSERT INTO wallet_transactions (user_id, amount, type, reference_id, balance_after, note)
    VALUES (v_deposit.user_id, v_deposit.amount, 'refund', p_deposit_id, v_balance, 'bid deposit refund');

  RETURN jsonb_build_object('balance_after', v_balance);
END $$;

REVOKE ALL ON FUNCTION place_bid_deposit(uuid, uuid) FROM public;
REVOKE ALL ON FUNCTION refund_bid_deposit(uuid) FROM public;
GRANT EXECUTE ON FUNCTION place_bid_deposit(uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION refund_bid_deposit(uuid) TO service_role;

-- validate_bid: เพิ่มเช็คว่าผู้ประมูลวางมัดจำแล้ว (defense-in-depth คู่กับ UX gate ใน CardProductBid)
CREATE OR REPLACE FUNCTION public.validate_bid()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_product products%ROWTYPE;
  v_highest numeric;
  v_last_bidder uuid;
  v_kyc text;
BEGIN
  SELECT * INTO v_product
  FROM products
  WHERE id = NEW.product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'product_not_found';
  END IF;

  IF v_product.state <> 'active' THEN
    RAISE EXCEPTION 'auction_not_active';
  END IF;

  IF v_product.auction_end_time IS NULL OR v_product.auction_end_time <= now() THEN
    RAISE EXCEPTION 'auction_ended';
  END IF;

  IF v_product.seller_id = NEW.user_id THEN
    RAISE EXCEPTION 'seller_cannot_bid';
  END IF;

  SELECT is_kyc INTO v_kyc FROM profiles WHERE id = NEW.user_id;
  IF v_kyc IS DISTINCT FROM 'approved' THEN
    RAISE EXCEPTION 'bidder_kyc_not_approved';
  END IF;

  -- ต้องมีเงินมัดจำ (status='held') ก่อนจึงจะ bid ได้
  IF NOT EXISTS (
    SELECT 1 FROM bid_deposits
    WHERE product_id = NEW.product_id AND user_id = NEW.user_id AND status = 'held'
  ) THEN
    RAISE EXCEPTION 'deposit_required';
  END IF;

  IF NEW.bid_price IS NULL OR NEW.bid_price <= 0 THEN
    RAISE EXCEPTION 'invalid_bid_price';
  END IF;

  SELECT COALESCE(MAX(bid_price), v_product.start_price)
  INTO v_highest
  FROM bids
  WHERE product_id = NEW.product_id;

  IF NEW.bid_price <= v_highest THEN
    RAISE EXCEPTION 'bid_too_low';
  END IF;

  SELECT user_id INTO v_last_bidder
  FROM bids
  WHERE product_id = NEW.product_id
  ORDER BY bid_time DESC
  LIMIT 1;

  IF v_last_bidder IS NOT NULL AND v_last_bidder = NEW.user_id THEN
    RAISE EXCEPTION 'already_highest_bidder';
  END IF;

  -- กัน is_winning ถูก set จาก client ตอน insert (เป็นหน้าที่ของ /api/auction/end)
  NEW.is_winning := false;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.validate_bid() FROM public;
