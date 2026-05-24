-- M-6: ป้องกัน user set profile_image / id_card_image เป็น URL arbitrary
-- (defacement / phishing / point ไปไฟล์ของคนอื่น)
-- Trigger ตรวจว่า value ต้องเป็น:
--   * null
--   * หรือ ขึ้นต้นด้วย Supabase storage URL ของเรา
--   * หรือ เป็น storage path ของตัวเอง (id-cards/<uid>/...)

CREATE OR REPLACE FUNCTION public.validate_profile_paths()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_uid text := NEW.id::text;
BEGIN
  -- profile_image: ต้องเป็น URL Supabase storage ของเรา หรือ null
  IF NEW.profile_image IS NOT NULL THEN
    IF NEW.profile_image NOT LIKE 'https://%.supabase.co/storage/v1/object/%' THEN
      RAISE EXCEPTION 'invalid_profile_image_url';
    END IF;
  END IF;

  -- id_card_image: เก็บเป็น "path" รูปแบบ "<uid>/<uuid>.<ext>" เท่านั้น (ไม่ใช่ full URL)
  IF NEW.id_card_image IS NOT NULL THEN
    IF NEW.id_card_image NOT LIKE (v_uid || '/%') THEN
      RAISE EXCEPTION 'invalid_id_card_path';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_validate_paths ON public.profiles;
CREATE TRIGGER profiles_validate_paths
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_paths();
