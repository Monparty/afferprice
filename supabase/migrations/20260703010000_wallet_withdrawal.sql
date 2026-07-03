-- Wallet withdrawal: ผู้ใช้ถอนเงินจาก wallet เข้าบัญชีธนาคาร (ที่ให้ไว้ตอน KYC)
-- flow: ผู้ใช้ขอถอน → ตัด wallet ทันที (ล็อกเงิน) + สร้างคำขอ 'pending'
--       → admin โอนเงินจริงแล้ว mark 'paid'  หรือ  ปฏิเสธ → คืนเงินเข้า wallet ('rejected')

CREATE TABLE withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'rejected')),
  -- snapshot บัญชีธนาคาร ณ ตอนขอ (เผื่อผู้ใช้แก้ KYC ภายหลัง)
  bank_name text,
  bank_account_no text,
  bank_account_name text,
  admin_note text,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

CREATE INDEX idx_withdrawal_requests_user_status ON withdrawal_requests(user_id, status);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);

ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- อ่านได้เฉพาะคำขอของตัวเอง; INSERT/UPDATE ผ่าน RPC (service_role) เท่านั้น
CREATE POLICY "own withdrawal read" ON withdrawal_requests
  FOR SELECT USING (auth.uid() = user_id);

-- ขั้นต่ำการถอน
-- request_withdrawal: ตัด wallet + สร้างคำขอ (atomic)
CREATE OR REPLACE FUNCTION request_withdrawal(p_user_id uuid, p_amount numeric)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

-- process_withdrawal: admin อนุมัติ (paid) หรือปฏิเสธ (rejected → คืนเงิน) — idempotent เฉพาะ pending
CREATE OR REPLACE FUNCTION process_withdrawal(p_withdrawal_id uuid, p_action text, p_note text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

REVOKE ALL ON FUNCTION request_withdrawal(uuid, numeric) FROM public;
REVOKE ALL ON FUNCTION process_withdrawal(uuid, text, text) FROM public;
GRANT EXECUTE ON FUNCTION request_withdrawal(uuid, numeric) TO service_role;
GRANT EXECUTE ON FUNCTION process_withdrawal(uuid, text, text) TO service_role;
