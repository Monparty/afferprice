-- Lookup table for auction duration options (was hardcoded in admin/user product forms)
-- value = จำนวนวัน; 0 = 10 นาที (TEST) — convention เดิมของ durationDays

CREATE TABLE IF NOT EXISTS "public"."auction_duration" (
    "value" smallint NOT NULL,
    "label" "text" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "auction_duration_pkey" PRIMARY KEY ("value")
);

ALTER TABLE "public"."auction_duration" OWNER TO "postgres";

-- seed options (idempotent)
INSERT INTO "public"."auction_duration" ("value", "label", "sort_order") VALUES
    (0, '10 นาที (TEST)', 1),
    (1, '1 วัน', 2),
    (5, '5 วัน', 3),
    (7, '7 วัน', 4),
    (10, '10 วัน', 5)
ON CONFLICT ("value") DO NOTHING;

-- duration_days ไม่เคยมี CHECK — กัน FK fail โดย seed ค่าที่ products ใช้อยู่จริงแต่ไม่อยู่ใน list
INSERT INTO "public"."auction_duration" ("value", "label", "sort_order")
SELECT DISTINCT "duration_days", "duration_days" || ' วัน', 100
FROM "public"."products"
WHERE "duration_days" IS NOT NULL
ON CONFLICT ("value") DO NOTHING;

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_duration_days_fkey" FOREIGN KEY ("duration_days")
    REFERENCES "public"."auction_duration"("value") ON DELETE RESTRICT;

-- RLS: public read only — mutations via service_role (same pattern as product_condition/categories)
ALTER TABLE "public"."auction_duration" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read auction_duration" ON "public"."auction_duration" FOR SELECT USING (true);

GRANT ALL ON TABLE "public"."auction_duration" TO "anon";
GRANT ALL ON TABLE "public"."auction_duration" TO "authenticated";
GRANT ALL ON TABLE "public"."auction_duration" TO "service_role";
