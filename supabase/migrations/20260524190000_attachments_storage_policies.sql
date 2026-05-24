-- H-2 Phase 2: Harden attachments bucket
-- เก็บเป็น "public" เพราะ SEO/landing/opengraph ต้องการ public read
-- แต่ปิดช่องโหว่:
--   * anon ห้าม upload
--   * เจ้าของไฟล์ (owner_id) เท่านั้นที่ update/delete ได้
--   * จำกัด MIME + size

UPDATE storage.buckets
SET file_size_limit = 52428800,                                   -- 50 MB
    allowed_mime_types = ARRAY[
      'image/jpeg','image/png','image/webp','image/gif',
      'video/mp4','video/quicktime','video/webm'
    ]
WHERE id = 'attachments';

DROP POLICY IF EXISTS "attachments_public_read"   ON storage.objects;
DROP POLICY IF EXISTS "attachments_auth_upload"   ON storage.objects;
DROP POLICY IF EXISTS "attachments_owner_update"  ON storage.objects;
DROP POLICY IF EXISTS "attachments_owner_delete"  ON storage.objects;

-- อ่านเข้าถึงได้สาธารณะ (รูปสินค้า, opengraph, SEO)
CREATE POLICY "attachments_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'attachments');

-- upload ต้อง authenticated
CREATE POLICY "attachments_auth_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'attachments');

-- เจ้าของไฟล์เท่านั้นแก้ไขได้
CREATE POLICY "attachments_owner_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'attachments' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'attachments' AND owner = auth.uid());

CREATE POLICY "attachments_owner_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'attachments' AND owner = auth.uid());
