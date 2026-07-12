-- Lookup table for product condition values (was hardcoded CHECK on products.condition
-- + hardcoded options in DetailSearchBox/AddProductForm)

CREATE TABLE IF NOT EXISTS "public"."product_condition" (
    "value" "text" NOT NULL,
    "label" "text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "product_condition_pkey" PRIMARY KEY ("value")
);

ALTER TABLE "public"."product_condition" OWNER TO "postgres";

-- seed existing values (idempotent)
INSERT INTO "public"."product_condition" ("value", "label", "sort_order") VALUES
    ('new', 'ของใหม่', 1),
    ('like_new', 'เหมือนใหม่', 2),
    ('good', 'มือสองสภาพดี', 3)
ON CONFLICT ("value") DO NOTHING;

-- replace hardcoded CHECK with FK so new conditions can be added as rows (no migration needed)
ALTER TABLE "public"."products" DROP CONSTRAINT IF EXISTS "products_condition_check";
ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_condition_fkey" FOREIGN KEY ("condition")
    REFERENCES "public"."product_condition"("value") ON DELETE RESTRICT;

-- RLS: public read only — mutations via service_role (same pattern as categories)
ALTER TABLE "public"."product_condition" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read product_condition" ON "public"."product_condition" FOR SELECT USING (true);

GRANT ALL ON TABLE "public"."product_condition" TO "anon";
GRANT ALL ON TABLE "public"."product_condition" TO "authenticated";
GRANT ALL ON TABLE "public"."product_condition" TO "service_role";
