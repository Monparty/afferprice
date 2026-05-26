-- KYC verification: เพิ่มสถานะการยืนยันตัวตน + remark สำหรับ admin reject
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_kyc text NOT NULL DEFAULT 'unknown';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS kyc_remark text;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_is_kyc_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_is_kyc_check
  CHECK (is_kyc IN ('unknown','pending','approved','rejected'));
