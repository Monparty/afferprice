-- KYC full form: เพิ่มฟิลด์ที่จำเป็นตามแบบฟอร์มยืนยันตัวตน
--   national_id (เลขบัตร 13 หลัก), address, selfie_image (เซลฟี่คู่บัตร),
--   bank_name / bank_account_no / bank_account_name, pdpa_consent_at
-- selfie_image เก็บเป็น "path" ใน bucket id-cards เหมือน id_card_image (PII)

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS national_id        text,
  ADD COLUMN IF NOT EXISTS address            text,
  ADD COLUMN IF NOT EXISTS selfie_image       text,
  ADD COLUMN IF NOT EXISTS bank_name          text,
  ADD COLUMN IF NOT EXISTS bank_account_no    text,
  ADD COLUMN IF NOT EXISTS bank_account_name  text,
  ADD COLUMN IF NOT EXISTS pdpa_consent_at    timestamptz;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_national_id_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_national_id_check
  CHECK (national_id IS NULL OR national_id ~ '^[0-9]{13}$');

-- ── path validation: selfie_image ต้องเป็น "<uid>/..." เหมือน id_card_image
CREATE OR REPLACE FUNCTION public.validate_profile_paths()
RETURNS trigger
LANGUAGE plpgsql
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

-- ── submit_kyc: ต้องกรอกข้อมูล KYC ครบทุกฟิลด์ก่อน transition → pending
--    (เลิกบังคับ profile_image; ใช้ id_card_image + selfie_image แทนตามแบบฟอร์มใหม่)
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

REVOKE ALL ON FUNCTION public.submit_kyc(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_kyc(uuid) TO authenticated;

-- ── recreate users_full view เพิ่มฟิลด์ KYC ใหม่ (admin review)
CREATE OR REPLACE VIEW public.users_full WITH (security_invoker='on') AS
  SELECT u.id,
         u.email,
         p.first_name,
         p.last_name,
         p.profile_image,
         p.phone,
         p.gender,
         p.age,
         p.birth_date,
         p.role,
         p.status,
         p.created_at,
         p.id_card_image,
         p.is_kyc,
         p.kyc_remark,
         p.national_id,
         p.address,
         p.selfie_image,
         p.bank_name,
         p.bank_account_no,
         p.bank_account_name,
         p.pdpa_consent_at
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id;

REVOKE ALL ON TABLE public.users_full FROM anon, authenticated;
GRANT SELECT ON TABLE public.users_full TO service_role;
