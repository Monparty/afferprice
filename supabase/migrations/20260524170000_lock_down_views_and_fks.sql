-- M-9: users_full ถูก grant ให้ anon/authenticated → leak email/birth_date
-- หลัง C-2 ทุก admin service มี requireAdmin() แล้ว ใช้ผ่าน supabaseAdmin (service_role)
-- → revoke anon/authenticated ออก
REVOKE ALL ON TABLE public.users_full FROM anon, authenticated;
GRANT SELECT ON TABLE public.users_full TO service_role;

-- M-8: bids.product_id FK เป็น CASCADE → ลบ product = ลบ bid history หมด
-- เปลี่ยนเป็น RESTRICT — ห้ามลบ product ที่มี bid (audit trail)
ALTER TABLE public.bids
  DROP CONSTRAINT IF EXISTS bids_product_id_fkey;
ALTER TABLE public.bids
  ADD CONSTRAINT bids_product_id_fkey
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;

-- product_attachment ก็ควรลบทิ้งพร้อม product (CASCADE คงไว้)
-- favorites ลบ orphan ได้
-- auction_results ห้ามถูกลบ (financial record) — เปลี่ยนเป็น RESTRICT
ALTER TABLE public.auction_results
  DROP CONSTRAINT IF EXISTS auction_results_product_id_fkey;
ALTER TABLE public.auction_results
  ADD CONSTRAINT auction_results_product_id_fkey
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;
