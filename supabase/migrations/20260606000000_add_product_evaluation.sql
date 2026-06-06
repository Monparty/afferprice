-- เก็บผลการประเมินคุณภาพสินค้า (ตัวเลือกที่ผู้ขายติ๊ก) + คะแนนรวม 0-100
ALTER TABLE "public"."products"
    ADD COLUMN IF NOT EXISTS "evaluation" "jsonb",
    ADD COLUMN IF NOT EXISTS "quality_score" smallint;

ALTER TABLE "public"."products"
    DROP CONSTRAINT IF EXISTS "products_quality_score_check";

ALTER TABLE "public"."products"
    ADD CONSTRAINT "products_quality_score_check"
    CHECK ("quality_score" IS NULL OR ("quality_score" >= 0 AND "quality_score" <= 100));
