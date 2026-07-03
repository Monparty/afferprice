-- Squashed baseline — full current schema.
-- Dumped from remote project auiowkhqygdswdkexrip on 2026-07-03 via 'supabase db dump'.
-- Storage (buckets/policies) appended manually — not captured by db dump.
-- Previous incremental migrations were squashed into this single file and removed.




SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."charge_wallet"("p_user_id" "uuid", "p_amount" numeric, "p_auction_result_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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


ALTER FUNCTION "public"."charge_wallet"("p_user_id" "uuid", "p_amount" numeric, "p_auction_result_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."charge_wallet_listing"("p_user_id" "uuid", "p_amount" numeric, "p_product_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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


ALTER FUNCTION "public"."charge_wallet_listing"("p_user_id" "uuid", "p_amount" numeric, "p_product_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."credit_seller_proceeds"("p_auction_result_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."credit_seller_proceeds"("p_auction_result_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."credit_wallet"("p_payment_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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


ALTER FUNCTION "public"."credit_wallet"("p_payment_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."expire_unpaid_auction"("p_auction_result_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."expire_unpaid_auction"("p_auction_result_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."place_bid_deposit"("p_user_id" "uuid", "p_product_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."place_bid_deposit"("p_user_id" "uuid", "p_product_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_withdrawal"("p_withdrawal_id" "uuid", "p_action" "text", "p_note" "text" DEFAULT NULL::"text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_wd withdrawal_requests%ROWTYPE;
  v_balance numeric;
BEGIN
  IF p_action NOT IN ('paid', 'rejected') THEN RAISE EXCEPTION 'invalid_action'; END IF;

  SELECT * INTO v_wd FROM withdrawal_requests WHERE id = p_withdrawal_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'withdrawal_not_found'; END IF;
  IF v_wd.status <> 'pending' THEN
    RETURN jsonb_build_object('already_processed', true, 'status', v_wd.status);
  END IF;

  IF p_action = 'rejected' THEN
    -- คืนเงินเข้า wallet
    UPDATE profiles SET wallet_balance = wallet_balance + v_wd.amount
      WHERE id = v_wd.user_id RETURNING wallet_balance INTO v_balance;
    INSERT INTO wallet_transactions (user_id, amount, type, reference_id, balance_after, note)
      VALUES (v_wd.user_id, v_wd.amount, 'refund', p_withdrawal_id, v_balance, 'withdrawal rejected refund');
  END IF;

  UPDATE withdrawal_requests
    SET status = p_action, admin_note = p_note, processed_at = now()
    WHERE id = p_withdrawal_id;

  RETURN jsonb_build_object('status', p_action, 'user_id', v_wd.user_id, 'amount', v_wd.amount);
END $$;


ALTER FUNCTION "public"."process_withdrawal"("p_withdrawal_id" "uuid", "p_action" "text", "p_note" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refund_bid_deposit"("p_deposit_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."refund_bid_deposit"("p_deposit_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."request_withdrawal"("p_user_id" "uuid", "p_amount" numeric) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_min numeric := 100;
  v_profile profiles%ROWTYPE;
  v_balance numeric;
  v_withdrawal_id uuid;
BEGIN
  IF p_amount IS NULL OR p_amount < v_min THEN
    RAISE EXCEPTION 'invalid_withdrawal_amount';
  END IF;

  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'profile_not_found'; END IF;
  IF v_profile.is_kyc IS DISTINCT FROM 'approved' THEN RAISE EXCEPTION 'kyc_not_approved'; END IF;
  IF v_profile.bank_account_no IS NULL OR v_profile.bank_account_no = '' THEN
    RAISE EXCEPTION 'bank_account_required';
  END IF;
  IF v_profile.wallet_balance < p_amount THEN RAISE EXCEPTION 'insufficient_balance'; END IF;

  UPDATE profiles SET wallet_balance = wallet_balance - p_amount
    WHERE id = p_user_id RETURNING wallet_balance INTO v_balance;

  INSERT INTO withdrawal_requests (user_id, amount, bank_name, bank_account_no, bank_account_name)
    VALUES (p_user_id, p_amount, v_profile.bank_name, v_profile.bank_account_no, v_profile.bank_account_name)
    RETURNING id INTO v_withdrawal_id;

  INSERT INTO wallet_transactions (user_id, amount, type, reference_id, balance_after, note)
    VALUES (p_user_id, -p_amount, 'withdrawal', v_withdrawal_id, v_balance, 'withdrawal request');

  RETURN jsonb_build_object('withdrawal_id', v_withdrawal_id, 'amount', p_amount, 'balance_after', v_balance);
END $$;


ALTER FUNCTION "public"."request_withdrawal"("p_user_id" "uuid", "p_amount" numeric) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."submit_kyc"("p_user_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_profile profiles%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'profile_not_found'; END IF;

  IF v_profile.id_card_image     IS NULL
     OR v_profile.selfie_image      IS NULL
     OR v_profile.national_id       IS NULL
     OR v_profile.first_name        IS NULL
     OR v_profile.address           IS NULL
     OR v_profile.phone             IS NULL
     OR v_profile.bank_name         IS NULL
     OR v_profile.bank_account_no   IS NULL
     OR v_profile.bank_account_name IS NULL
     OR v_profile.pdpa_consent_at   IS NULL THEN
    RAISE EXCEPTION 'missing_kyc_fields';
  END IF;

  IF v_profile.is_kyc NOT IN ('unknown','rejected') THEN
    RAISE EXCEPTION 'invalid_kyc_state';
  END IF;

  UPDATE profiles
    SET is_kyc = 'pending', kyc_remark = NULL
    WHERE id = p_user_id;

  RETURN jsonb_build_object('is_kyc', 'pending');
END $$;


ALTER FUNCTION "public"."submit_kyc"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_bid"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
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


ALTER FUNCTION "public"."validate_bid"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_profile_paths"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_uid text := NEW.id::text;
BEGIN
  IF NEW.profile_image IS NOT NULL THEN
    IF NEW.profile_image NOT LIKE 'https://%.supabase.co/storage/v1/object/%' THEN
      RAISE EXCEPTION 'invalid_profile_image_url';
    END IF;
  END IF;

  IF NEW.id_card_image IS NOT NULL THEN
    IF NEW.id_card_image NOT LIKE (v_uid || '/%') THEN
      RAISE EXCEPTION 'invalid_id_card_path';
    END IF;
  END IF;

  IF NEW.selfie_image IS NOT NULL THEN
    IF NEW.selfie_image NOT LIKE (v_uid || '/%') THEN
      RAISE EXCEPTION 'invalid_selfie_path';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."validate_profile_paths"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "admin_id" "uuid" NOT NULL,
    "action" "text",
    "target_table" "text",
    "target_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."admin_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."auction_results" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "winner_id" "uuid" NOT NULL,
    "final_price" numeric(10,2) NOT NULL,
    "ended_at" timestamp with time zone DEFAULT "now"(),
    "payment_status" "text" DEFAULT 'pending'::"text",
    "payment_due_at" timestamp with time zone,
    "address_id" "uuid",
    "shipping_option" "text",
    "shipping_fee" numeric(10,2) DEFAULT 0 NOT NULL,
    CONSTRAINT "auction_results_payment_status_check" CHECK (("payment_status" = ANY (ARRAY['pending'::"text", 'paid'::"text", 'canceled'::"text"])))
);


ALTER TABLE "public"."auction_results" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bid_deposits" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "status" "text" DEFAULT 'held'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "refunded_at" timestamp with time zone,
    "forfeited_at" timestamp with time zone,
    CONSTRAINT "bid_deposits_amount_check" CHECK (("amount" > (0)::numeric)),
    CONSTRAINT "bid_deposits_status_check" CHECK (("status" = ANY (ARRAY['held'::"text", 'refunded'::"text", 'applied'::"text", 'forfeited'::"text"])))
);


ALTER TABLE "public"."bid_deposits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bids" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "bid_price" numeric(10,2) NOT NULL,
    "bid_time" timestamp with time zone DEFAULT "now"(),
    "is_winning" boolean DEFAULT false
);


ALTER TABLE "public"."bids" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "parent_id" "uuid",
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "status" "text" DEFAULT 'Y'::"text",
    "evaluation" "jsonb"
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."favorites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "text",
    "title" "text",
    "message" "text",
    "is_read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "notifications_type_check" CHECK (("type" = ANY (ARRAY['bid'::"text", 'win'::"text", 'lose'::"text", 'payment'::"text", 'shipping'::"text", 'kyc'::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "auction_result_id" "uuid",
    "user_id" "uuid" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "payment_method" "text",
    "payment_status" "text" DEFAULT 'pending'::"text",
    "paid_at" timestamp with time zone,
    "transaction_ref" "text",
    "purpose" "text" DEFAULT 'auction'::"text",
    "product_id" "uuid",
    CONSTRAINT "payments_payment_method_check" CHECK (("payment_method" = ANY (ARRAY['bank'::"text", 'credit_card'::"text", 'promptpay'::"text", 'wallet'::"text", 'linepay'::"text", 'truemoney'::"text"]))),
    CONSTRAINT "payments_payment_status_check" CHECK (("payment_status" = ANY (ARRAY['pending'::"text", 'success'::"text", 'failed'::"text"]))),
    CONSTRAINT "payments_purpose_check" CHECK (("purpose" = ANY (ARRAY['auction'::"text", 'topup'::"text", 'listing_fee'::"text"])))
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_attachment" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "attachment_url" "text" NOT NULL,
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "type" "text"
);


ALTER TABLE "public"."product_attachment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "seller_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "condition" "text" NOT NULL,
    "start_price" numeric(10,2) NOT NULL,
    "buy_now_price" numeric(10,2),
    "auction_start_time" timestamp with time zone,
    "auction_end_time" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "auction_period" timestamp with time zone,
    "state" "text" DEFAULT 'draft'::"text",
    "images_url" "jsonb",
    "video_url" "jsonb",
    "duration_days" smallint,
    "is_seller" "text",
    "status" "text",
    "rejected_remark" "text",
    "evaluation" "jsonb",
    "quality_score" smallint,
    CONSTRAINT "products_condition_check" CHECK (("condition" = ANY (ARRAY['new'::"text", 'like_new'::"text", 'good'::"text"]))),
    CONSTRAINT "products_quality_score_check" CHECK ((("quality_score" IS NULL) OR (("quality_score" >= 0) AND ("quality_score" <= 100)))),
    CONSTRAINT "products_state_check" CHECK (("state" = ANY (ARRAY['draft'::"text", 'pending_review'::"text", 'rejected'::"text", 'active'::"text", 'ended'::"text", 'sold'::"text", 'order'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "phone" "text",
    "first_name" "text",
    "last_name" "text",
    "profile_image" "text",
    "gender" "text",
    "birth_date" "date",
    "role" "text" DEFAULT 'user'::"text",
    "status" "text" DEFAULT 'active'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "age" numeric,
    "id_card_image" "text",
    "wallet_balance" numeric(12,2) DEFAULT 0 NOT NULL,
    "is_kyc" "text" DEFAULT 'unknown'::"text" NOT NULL,
    "kyc_remark" "text",
    "national_id" "text",
    "address" "text",
    "selfie_image" "text",
    "bank_name" "text",
    "bank_account_no" "text",
    "bank_account_name" "text",
    "pdpa_consent_at" timestamp with time zone,
    CONSTRAINT "profiles_is_kyc_check" CHECK (("is_kyc" = ANY (ARRAY['unknown'::"text", 'pending'::"text", 'approved'::"text", 'rejected'::"text"]))),
    CONSTRAINT "profiles_national_id_check" CHECK ((("national_id" IS NULL) OR ("national_id" ~ '^[0-9]{13}$'::"text"))),
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'admin'::"text"]))),
    CONSTRAINT "profiles_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'banned'::"text"]))),
    CONSTRAINT "wallet_balance_non_negative" CHECK (("wallet_balance" >= (0)::numeric))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "reviewer_id" "uuid" NOT NULL,
    "seller_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "rating" integer NOT NULL,
    "comment" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shipments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "auction_result_id" "uuid" NOT NULL,
    "address_id" "uuid",
    "shipping_company" "text",
    "tracking_number" "text",
    "shipping_status" "text" DEFAULT 'preparing'::"text",
    "shipped_at" timestamp with time zone,
    "delivered_at" timestamp with time zone,
    "received_at" timestamp with time zone,
    "unboxing_video_url" "text",
    CONSTRAINT "shipments_shipping_status_check" CHECK (("shipping_status" = ANY (ARRAY['preparing'::"text", 'shipped'::"text", 'delivered'::"text"])))
);


ALTER TABLE "public"."shipments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_addresses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "receiver_name" "text",
    "phone" "text",
    "address_line" "text",
    "district" "text",
    "province" "text",
    "postal_code" "text",
    "is_default" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_addresses" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."users_full" WITH ("security_invoker"='on') AS
 SELECT "u"."id",
    "u"."email",
    "p"."first_name",
    "p"."last_name",
    "p"."profile_image",
    "p"."phone",
    "p"."gender",
    "p"."age",
    "p"."birth_date",
    "p"."role",
    "p"."status",
    "p"."created_at",
    "p"."id_card_image",
    "p"."is_kyc",
    "p"."kyc_remark",
    "p"."national_id",
    "p"."address",
    "p"."selfie_image",
    "p"."bank_name",
    "p"."bank_account_no",
    "p"."bank_account_name",
    "p"."pdpa_consent_at"
   FROM ("auth"."users" "u"
     LEFT JOIN "public"."profiles" "p" ON (("u"."id" = "p"."id")));


ALTER VIEW "public"."users_full" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wallet_transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "type" "text" NOT NULL,
    "reference_id" "uuid",
    "balance_after" numeric(12,2) NOT NULL,
    "note" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "wallet_transactions_type_check" CHECK (("type" = ANY (ARRAY['topup'::"text", 'payment'::"text", 'refund'::"text", 'sale'::"text", 'withdrawal'::"text"])))
);


ALTER TABLE "public"."wallet_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."withdrawal_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "bank_name" "text",
    "bank_account_no" "text",
    "bank_account_name" "text",
    "admin_note" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "processed_at" timestamp with time zone,
    CONSTRAINT "withdrawal_requests_amount_check" CHECK (("amount" > (0)::numeric)),
    CONSTRAINT "withdrawal_requests_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'paid'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."withdrawal_requests" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin_logs"
    ADD CONSTRAINT "admin_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."auction_results"
    ADD CONSTRAINT "auction_results_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."auction_results"
    ADD CONSTRAINT "auction_results_product_id_key" UNIQUE ("product_id");



ALTER TABLE ONLY "public"."bid_deposits"
    ADD CONSTRAINT "bid_deposits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bid_deposits"
    ADD CONSTRAINT "bid_deposits_product_id_user_id_key" UNIQUE ("product_id", "user_id");



ALTER TABLE ONLY "public"."bids"
    ADD CONSTRAINT "bids_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_product_id_key" UNIQUE ("user_id", "product_id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_attachment"
    ADD CONSTRAINT "product_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shipments"
    ADD CONSTRAINT "shipments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_addresses"
    ADD CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wallet_transactions"
    ADD CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."withdrawal_requests"
    ADD CONSTRAINT "withdrawal_requests_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_bid_deposits_product_status" ON "public"."bid_deposits" USING "btree" ("product_id", "status");



CREATE INDEX "idx_bids_product" ON "public"."bids" USING "btree" ("product_id");



CREATE INDEX "idx_bids_user" ON "public"."bids" USING "btree" ("user_id");



CREATE INDEX "idx_favorites_user" ON "public"."favorites" USING "btree" ("user_id");



CREATE INDEX "idx_notifications_user" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_payments_product" ON "public"."payments" USING "btree" ("product_id");



CREATE INDEX "idx_products_category" ON "public"."products" USING "btree" ("category_id");



CREATE INDEX "idx_wallet_tx_user_created" ON "public"."wallet_transactions" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_withdrawal_requests_status" ON "public"."withdrawal_requests" USING "btree" ("status");



CREATE INDEX "idx_withdrawal_requests_user_status" ON "public"."withdrawal_requests" USING "btree" ("user_id", "status");



CREATE OR REPLACE TRIGGER "bids_validate" BEFORE INSERT ON "public"."bids" FOR EACH ROW EXECUTE FUNCTION "public"."validate_bid"();



CREATE OR REPLACE TRIGGER "profiles_validate_paths" BEFORE INSERT OR UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."validate_profile_paths"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."auction_results"
    ADD CONSTRAINT "auction_results_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."user_addresses"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."auction_results"
    ADD CONSTRAINT "auction_results_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."bid_deposits"
    ADD CONSTRAINT "bid_deposits_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."bid_deposits"
    ADD CONSTRAINT "bid_deposits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."bids"
    ADD CONSTRAINT "bids_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_auction_result_id_fkey" FOREIGN KEY ("auction_result_id") REFERENCES "public"."auction_results"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."product_attachment"
    ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");



ALTER TABLE ONLY "public"."shipments"
    ADD CONSTRAINT "shipments_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."user_addresses"("id");



ALTER TABLE ONLY "public"."shipments"
    ADD CONSTRAINT "shipments_auction_result_id_fkey" FOREIGN KEY ("auction_result_id") REFERENCES "public"."auction_results"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wallet_transactions"
    ADD CONSTRAINT "wallet_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."withdrawal_requests"
    ADD CONSTRAINT "withdrawal_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT;



CREATE POLICY "admin read all profiles" ON "public"."profiles" FOR SELECT USING (((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"));



ALTER TABLE "public"."admin_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."auction_results" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bid_deposits" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "bidder read bid products" ON "public"."products" FOR SELECT USING (("id" IN ( SELECT "bids"."product_id"
   FROM "public"."bids"
  WHERE ("bids"."user_id" = "auth"."uid"()))));



ALTER TABLE "public"."bids" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "buyer insert review" ON "public"."reviews" FOR INSERT WITH CHECK ((("reviewer_id" = "auth"."uid"()) AND ("product_id" IN ( SELECT "ar"."product_id"
   FROM "public"."auction_results" "ar"
  WHERE ("ar"."winner_id" = "auth"."uid"())))));



CREATE POLICY "buyer or seller read shipment" ON "public"."shipments" FOR SELECT USING (("auction_result_id" IN ( SELECT "ar"."id"
   FROM ("public"."auction_results" "ar"
     JOIN "public"."products" "p" ON (("ar"."product_id" = "p"."id")))
  WHERE (("ar"."winner_id" = "auth"."uid"()) OR ("p"."seller_id" = "auth"."uid"())))));



ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."favorites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "own deposit read" ON "public"."bid_deposits" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "own tx read" ON "public"."wallet_transactions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "own withdrawal read" ON "public"."withdrawal_requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_attachment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "public read bids" ON "public"."bids" FOR SELECT USING (true);



CREATE POLICY "public read categories" ON "public"."categories" FOR SELECT USING (true);



CREATE POLICY "public read images" ON "public"."product_attachment" FOR SELECT USING (true);



CREATE POLICY "public read products" ON "public"."products" FOR SELECT USING (("state" = 'active'::"text"));



CREATE POLICY "public read reviews" ON "public"."reviews" FOR SELECT USING (true);



CREATE POLICY "read own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "seller insert own products" ON "public"."products" FOR INSERT TO "authenticated" WITH CHECK (("seller_id" = "auth"."uid"()));



CREATE POLICY "seller insert shipment" ON "public"."shipments" FOR INSERT WITH CHECK (("auction_result_id" IN ( SELECT "ar"."id"
   FROM ("public"."auction_results" "ar"
     JOIN "public"."products" "p" ON (("p"."id" = "ar"."product_id")))
  WHERE ("p"."seller_id" = "auth"."uid"()))));



CREATE POLICY "seller manage own images" ON "public"."product_attachment" USING (("product_id" IN ( SELECT "products"."id"
   FROM "public"."products"
  WHERE ("products"."seller_id" = "auth"."uid"()))));



CREATE POLICY "seller manage own products" ON "public"."products" FOR SELECT TO "authenticated" USING (("seller_id" = "auth"."uid"()));



CREATE POLICY "seller read own products" ON "public"."products" FOR SELECT USING (("auth"."uid"() = "seller_id"));



CREATE POLICY "seller update own products" ON "public"."products" FOR UPDATE TO "authenticated" USING (("seller_id" = "auth"."uid"())) WITH CHECK (("seller_id" = "auth"."uid"()));



ALTER TABLE "public"."shipments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK ((("auth"."uid"() = "id") AND ("role" = ( SELECT "p"."role"
   FROM "public"."profiles" "p"
  WHERE ("p"."id" = "auth"."uid"()))) AND ("status" = ( SELECT "p"."status"
   FROM "public"."profiles" "p"
  WHERE ("p"."id" = "auth"."uid"()))) AND ("is_kyc" = ( SELECT "p"."is_kyc"
   FROM "public"."profiles" "p"
  WHERE ("p"."id" = "auth"."uid"()))) AND (NOT ("kyc_remark" IS DISTINCT FROM ( SELECT "p"."kyc_remark"
   FROM "public"."profiles" "p"
  WHERE ("p"."id" = "auth"."uid"()))))));



CREATE POLICY "user insert own bid" ON "public"."bids" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "user insert own payment" ON "public"."payments" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "user manage own address" ON "public"."user_addresses" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "user manage own favorites" ON "public"."favorites" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "user read own notifications" ON "public"."notifications" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "user read own payment" ON "public"."payments" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "user update own notifications" ON "public"."notifications" FOR UPDATE USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."user_addresses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wallet_transactions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "winner or seller read result" ON "public"."auction_results" FOR SELECT USING ((("winner_id" = "auth"."uid"()) OR ("product_id" IN ( SELECT "products"."id"
   FROM "public"."products"
  WHERE ("products"."seller_id" = "auth"."uid"())))));



ALTER TABLE "public"."withdrawal_requests" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































REVOKE ALL ON FUNCTION "public"."charge_wallet"("p_user_id" "uuid", "p_amount" numeric, "p_auction_result_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."charge_wallet"("p_user_id" "uuid", "p_amount" numeric, "p_auction_result_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."charge_wallet"("p_user_id" "uuid", "p_amount" numeric, "p_auction_result_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."charge_wallet"("p_user_id" "uuid", "p_amount" numeric, "p_auction_result_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."charge_wallet_listing"("p_user_id" "uuid", "p_amount" numeric, "p_product_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."charge_wallet_listing"("p_user_id" "uuid", "p_amount" numeric, "p_product_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."charge_wallet_listing"("p_user_id" "uuid", "p_amount" numeric, "p_product_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."charge_wallet_listing"("p_user_id" "uuid", "p_amount" numeric, "p_product_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."credit_seller_proceeds"("p_auction_result_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."credit_seller_proceeds"("p_auction_result_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."credit_seller_proceeds"("p_auction_result_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."credit_seller_proceeds"("p_auction_result_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."credit_wallet"("p_payment_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."credit_wallet"("p_payment_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."credit_wallet"("p_payment_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."credit_wallet"("p_payment_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."expire_unpaid_auction"("p_auction_result_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."expire_unpaid_auction"("p_auction_result_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."expire_unpaid_auction"("p_auction_result_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."expire_unpaid_auction"("p_auction_result_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."place_bid_deposit"("p_user_id" "uuid", "p_product_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."place_bid_deposit"("p_user_id" "uuid", "p_product_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."place_bid_deposit"("p_user_id" "uuid", "p_product_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."place_bid_deposit"("p_user_id" "uuid", "p_product_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."process_withdrawal"("p_withdrawal_id" "uuid", "p_action" "text", "p_note" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."process_withdrawal"("p_withdrawal_id" "uuid", "p_action" "text", "p_note" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."process_withdrawal"("p_withdrawal_id" "uuid", "p_action" "text", "p_note" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."process_withdrawal"("p_withdrawal_id" "uuid", "p_action" "text", "p_note" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."refund_bid_deposit"("p_deposit_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."refund_bid_deposit"("p_deposit_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."refund_bid_deposit"("p_deposit_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."refund_bid_deposit"("p_deposit_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."request_withdrawal"("p_user_id" "uuid", "p_amount" numeric) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."request_withdrawal"("p_user_id" "uuid", "p_amount" numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."request_withdrawal"("p_user_id" "uuid", "p_amount" numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."request_withdrawal"("p_user_id" "uuid", "p_amount" numeric) TO "service_role";



REVOKE ALL ON FUNCTION "public"."submit_kyc"("p_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."submit_kyc"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."submit_kyc"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."submit_kyc"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."validate_bid"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."validate_bid"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_bid"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_bid"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_profile_paths"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_profile_paths"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_profile_paths"() TO "service_role";


















GRANT ALL ON TABLE "public"."admin_logs" TO "anon";
GRANT ALL ON TABLE "public"."admin_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_logs" TO "service_role";



GRANT ALL ON TABLE "public"."auction_results" TO "anon";
GRANT ALL ON TABLE "public"."auction_results" TO "authenticated";
GRANT ALL ON TABLE "public"."auction_results" TO "service_role";



GRANT ALL ON TABLE "public"."bid_deposits" TO "anon";
GRANT ALL ON TABLE "public"."bid_deposits" TO "authenticated";
GRANT ALL ON TABLE "public"."bid_deposits" TO "service_role";



GRANT ALL ON TABLE "public"."bids" TO "anon";
GRANT ALL ON TABLE "public"."bids" TO "authenticated";
GRANT ALL ON TABLE "public"."bids" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."favorites" TO "anon";
GRANT ALL ON TABLE "public"."favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."favorites" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."product_attachment" TO "anon";
GRANT ALL ON TABLE "public"."product_attachment" TO "authenticated";
GRANT ALL ON TABLE "public"."product_attachment" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."shipments" TO "anon";
GRANT ALL ON TABLE "public"."shipments" TO "authenticated";
GRANT ALL ON TABLE "public"."shipments" TO "service_role";



GRANT ALL ON TABLE "public"."user_addresses" TO "anon";
GRANT ALL ON TABLE "public"."user_addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."user_addresses" TO "service_role";



GRANT ALL ON TABLE "public"."users_full" TO "service_role";



GRANT ALL ON TABLE "public"."wallet_transactions" TO "anon";
GRANT ALL ON TABLE "public"."wallet_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."wallet_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."withdrawal_requests" TO "anon";
GRANT ALL ON TABLE "public"."withdrawal_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."withdrawal_requests" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";
































-- ============================================================
-- Storage buckets & policies (storage schema — not captured by `supabase db dump`)
-- Folded in from migrations 20260524160000 (id-cards) + 20260524190000 (attachments)
-- ============================================================

-- attachments: public bucket (product images/video, profile_image) — 50 MB
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('attachments', 'attachments', true, 52428800, ARRAY[
  'image/jpeg','image/png','image/webp','image/gif',
  'video/mp4','video/quicktime','video/webm'
])
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = 52428800,
      allowed_mime_types = ARRAY[
        'image/jpeg','image/png','image/webp','image/gif',
        'video/mp4','video/quicktime','video/webm'
      ];

DROP POLICY IF EXISTS "attachments_public_read"   ON storage.objects;
DROP POLICY IF EXISTS "attachments_auth_upload"   ON storage.objects;
DROP POLICY IF EXISTS "attachments_owner_update"  ON storage.objects;
DROP POLICY IF EXISTS "attachments_owner_delete"  ON storage.objects;

CREATE POLICY "attachments_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'attachments');

CREATE POLICY "attachments_auth_upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "attachments_owner_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'attachments' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'attachments' AND owner = auth.uid());

CREATE POLICY "attachments_owner_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'attachments' AND owner = auth.uid());

-- id-cards: private bucket (KYC PII) — 5 MB
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('id-cards', 'id-cards', false, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE
  SET public = false,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp'];

DROP POLICY IF EXISTS "id_cards_owner_upload" ON storage.objects;
DROP POLICY IF EXISTS "id_cards_owner_read"   ON storage.objects;
DROP POLICY IF EXISTS "id_cards_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "id_cards_owner_delete" ON storage.objects;
DROP POLICY IF EXISTS "id_cards_admin_read"   ON storage.objects;

CREATE POLICY "id_cards_owner_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'id-cards' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "id_cards_owner_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'id-cards' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "id_cards_owner_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'id-cards' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "id_cards_owner_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'id-cards' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "id_cards_admin_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'id-cards'
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
