-- Hardening: RPC เงินทั้งหมดต้องเรียกผ่าน server (service_role) เท่านั้น
-- ปัญหา: squash schema (จาก db dump) มี GRANT EXECUTE ให้ anon/authenticated ติดมากับทุก function
-- → user ที่ login เรียก supabase.rpc(...) ตรงจาก browser ได้ เช่น:
--   - refund_bid_deposit: bidder คืนมัดจำตัวเองก่อนประมูลจบ → หนี forfeit
--   - charge_wallet / place_bid_deposit / request_withdrawal: ส่ง p_user_id ของคนอื่น → ตัดเงิน wallet คนอื่น
--   - process_withdrawal: user ธรรมดา approve/reject คำขอถอนเงิน (งาน admin)
-- ยกเว้น submit_kyc: browser เรียกจริง + มี caller guard (auth.uid() = p_user_id) → คง authenticated ไว้
-- (refund_listing_fee + expire_unpaid_auction ถูก lock ไปแล้วใน 20260704000000 / 20260704010000)

-- charge_wallet — ตัด wallet จ่ายค่าประมูล (เรียกจาก /api/payment/wallet/charge)
REVOKE ALL ON FUNCTION "public"."charge_wallet"("p_user_id" "uuid", "p_amount" numeric, "p_auction_result_id" "uuid") FROM PUBLIC;
REVOKE ALL ON FUNCTION "public"."charge_wallet"("p_user_id" "uuid", "p_amount" numeric, "p_auction_result_id" "uuid") FROM anon;
REVOKE ALL ON FUNCTION "public"."charge_wallet"("p_user_id" "uuid", "p_amount" numeric, "p_auction_result_id" "uuid") FROM authenticated;
GRANT ALL ON FUNCTION "public"."charge_wallet"("p_user_id" "uuid", "p_amount" numeric, "p_auction_result_id" "uuid") TO service_role;

-- charge_wallet_listing — ตัด wallet จ่ายเงินค่าประกันการขาย (เรียกจาก /api/payment/wallet/listing-fee)
REVOKE ALL ON FUNCTION "public"."charge_wallet_listing"("p_user_id" "uuid", "p_amount" numeric, "p_product_id" "uuid") FROM PUBLIC;
REVOKE ALL ON FUNCTION "public"."charge_wallet_listing"("p_user_id" "uuid", "p_amount" numeric, "p_product_id" "uuid") FROM anon;
REVOKE ALL ON FUNCTION "public"."charge_wallet_listing"("p_user_id" "uuid", "p_amount" numeric, "p_product_id" "uuid") FROM authenticated;
GRANT ALL ON FUNCTION "public"."charge_wallet_listing"("p_user_id" "uuid", "p_amount" numeric, "p_product_id" "uuid") TO service_role;

-- credit_seller_proceeds — เครดิตเงินขายให้ผู้ขาย (เรียกจาก sellerPayout.js)
REVOKE ALL ON FUNCTION "public"."credit_seller_proceeds"("p_auction_result_id" "uuid") FROM PUBLIC;
REVOKE ALL ON FUNCTION "public"."credit_seller_proceeds"("p_auction_result_id" "uuid") FROM anon;
REVOKE ALL ON FUNCTION "public"."credit_seller_proceeds"("p_auction_result_id" "uuid") FROM authenticated;
GRANT ALL ON FUNCTION "public"."credit_seller_proceeds"("p_auction_result_id" "uuid") TO service_role;

-- credit_wallet — เครดิต topup (เรียกจาก webhook / linepay confirm / test-topup)
REVOKE ALL ON FUNCTION "public"."credit_wallet"("p_payment_id" "uuid") FROM PUBLIC;
REVOKE ALL ON FUNCTION "public"."credit_wallet"("p_payment_id" "uuid") FROM anon;
REVOKE ALL ON FUNCTION "public"."credit_wallet"("p_payment_id" "uuid") FROM authenticated;
GRANT ALL ON FUNCTION "public"."credit_wallet"("p_payment_id" "uuid") TO service_role;

-- place_bid_deposit — ตัด wallet วางมัดจำ (เรียกจาก /api/bid/deposit)
REVOKE ALL ON FUNCTION "public"."place_bid_deposit"("p_user_id" "uuid", "p_product_id" "uuid") FROM PUBLIC;
REVOKE ALL ON FUNCTION "public"."place_bid_deposit"("p_user_id" "uuid", "p_product_id" "uuid") FROM anon;
REVOKE ALL ON FUNCTION "public"."place_bid_deposit"("p_user_id" "uuid", "p_product_id" "uuid") FROM authenticated;
GRANT ALL ON FUNCTION "public"."place_bid_deposit"("p_user_id" "uuid", "p_product_id" "uuid") TO service_role;

-- process_withdrawal — admin จ่าย/ปฏิเสธคำขอถอน (เรียกจาก admin/withdrawals.service)
REVOKE ALL ON FUNCTION "public"."process_withdrawal"("p_withdrawal_id" "uuid", "p_action" "text", "p_note" "text") FROM PUBLIC;
REVOKE ALL ON FUNCTION "public"."process_withdrawal"("p_withdrawal_id" "uuid", "p_action" "text", "p_note" "text") FROM anon;
REVOKE ALL ON FUNCTION "public"."process_withdrawal"("p_withdrawal_id" "uuid", "p_action" "text", "p_note" "text") FROM authenticated;
GRANT ALL ON FUNCTION "public"."process_withdrawal"("p_withdrawal_id" "uuid", "p_action" "text", "p_note" "text") TO service_role;

-- refund_bid_deposit — คืนมัดจำ (เรียกจาก reconcile.js ตอนปิดประมูลเท่านั้น)
REVOKE ALL ON FUNCTION "public"."refund_bid_deposit"("p_deposit_id" "uuid") FROM PUBLIC;
REVOKE ALL ON FUNCTION "public"."refund_bid_deposit"("p_deposit_id" "uuid") FROM anon;
REVOKE ALL ON FUNCTION "public"."refund_bid_deposit"("p_deposit_id" "uuid") FROM authenticated;
GRANT ALL ON FUNCTION "public"."refund_bid_deposit"("p_deposit_id" "uuid") TO service_role;

-- request_withdrawal — ขอถอนเงิน (เรียกจาก /api/wallet/withdraw)
REVOKE ALL ON FUNCTION "public"."request_withdrawal"("p_user_id" "uuid", "p_amount" numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION "public"."request_withdrawal"("p_user_id" "uuid", "p_amount" numeric) FROM anon;
REVOKE ALL ON FUNCTION "public"."request_withdrawal"("p_user_id" "uuid", "p_amount" numeric) FROM authenticated;
GRANT ALL ON FUNCTION "public"."request_withdrawal"("p_user_id" "uuid", "p_amount" numeric) TO service_role;
