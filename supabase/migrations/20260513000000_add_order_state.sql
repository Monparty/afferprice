-- เพิ่ม state 'order' ใน products และทำให้ shipments.address_id เป็น nullable
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_state_check;
ALTER TABLE products ADD CONSTRAINT products_state_check
  CHECK (state IN ('draft', 'pending_review', 'rejected', 'active', 'ended', 'sold', 'order', 'cancelled'));

ALTER TABLE shipments ALTER COLUMN address_id DROP NOT NULL;

-- seller สามารถ insert shipment สำหรับสินค้าของตัวเองได้
CREATE POLICY "seller insert shipment" ON "public"."shipments"
  FOR INSERT
  WITH CHECK (
    auction_result_id IN (
      SELECT ar.id FROM auction_results ar
      JOIN products p ON p.id = ar.product_id
      WHERE p.seller_id = auth.uid()
    )
  );
