-- submit_kyc: user transition unknown/rejected → pending (เมื่อ upload เอกสารครบ)
-- SECURITY DEFINER bypass RLS lock บน is_kyc; ตรวจ caller = self
CREATE OR REPLACE FUNCTION public.submit_kyc(p_user_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_profile profiles%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'profile_not_found'; END IF;

  IF v_profile.profile_image IS NULL OR v_profile.id_card_image IS NULL THEN
    RAISE EXCEPTION 'missing_documents';
  END IF;

  IF v_profile.is_kyc NOT IN ('unknown','rejected') THEN
    RAISE EXCEPTION 'invalid_kyc_state';
  END IF;

  UPDATE profiles
    SET is_kyc = 'pending', kyc_remark = NULL
    WHERE id = p_user_id;

  RETURN jsonb_build_object('is_kyc', 'pending');
END $$;

REVOKE ALL ON FUNCTION public.submit_kyc(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_kyc(uuid) TO authenticated;
