-- Phase 1: private bucket สำหรับ id_card_image (PII)
-- ใช้ "id-cards" bucket แยกจาก attachments

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('id-cards', 'id-cards', false, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE
  SET public = false,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp'];

-- ลบ policy เก่า (ถ้ามี)
DROP POLICY IF EXISTS "id_cards_owner_upload" ON storage.objects;
DROP POLICY IF EXISTS "id_cards_owner_read"   ON storage.objects;
DROP POLICY IF EXISTS "id_cards_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "id_cards_owner_delete" ON storage.objects;

-- เจ้าของไฟล์เท่านั้น: path ต้องขึ้นต้นด้วย <auth.uid()>/...
CREATE POLICY "id_cards_owner_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'id-cards'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "id_cards_owner_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'id-cards'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "id_cards_owner_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'id-cards'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "id_cards_owner_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'id-cards'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin อ่านได้ทั้งหมด (สำหรับ verify KYC)
DROP POLICY IF EXISTS "id_cards_admin_read" ON storage.objects;
CREATE POLICY "id_cards_admin_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'id-cards'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
