-- บังคับให้ผู้ประมูลต้องผ่าน KYC (is_kyc='approved') ก่อนจึงจะ bid ได้
-- (defense-in-depth คู่กับ UX guard ใน CardProductBid)

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
