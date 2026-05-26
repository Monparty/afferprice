-- Lock down: user ห้ามแก้ is_kyc / kyc_remark ตัวเอง (admin / RPC submit_kyc เท่านั้น)
DROP POLICY IF EXISTS "update own profile" ON public.profiles;
CREATE POLICY "update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role       = (SELECT p.role       FROM public.profiles p WHERE p.id = auth.uid())
    AND status     = (SELECT p.status     FROM public.profiles p WHERE p.id = auth.uid())
    AND is_kyc     = (SELECT p.is_kyc     FROM public.profiles p WHERE p.id = auth.uid())
    AND kyc_remark IS NOT DISTINCT FROM
                     (SELECT p.kyc_remark FROM public.profiles p WHERE p.id = auth.uid())
  );

-- Recreate users_full view เพิ่ม is_kyc, kyc_remark, id_card_image
-- (admin KycReviewModal ต้องใช้ id_card_image; list column ต้องใช้ is_kyc)
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
         p.kyc_remark
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id;

-- รักษา grant pattern เดิม (20260524170000_lock_down_views_and_fks)
REVOKE ALL ON TABLE public.users_full FROM anon, authenticated;
GRANT SELECT ON TABLE public.users_full TO service_role;
