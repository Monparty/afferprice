import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://auiowkhqygdswdkexrip.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1aW93a2hxeWdkc3dka2V4cmlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMzNTI5NywiZXhwIjoyMDg2OTExMjk3fQ.ovTOEsvzhdiJlxb-eMSnq7ccndDCBCVP4SlAVxHD3PM"
);

// ดึง user และ product ที่มีอยู่
const { data: users } = await supabase.from("profiles").select("id").limit(1);
const { data: products } = await supabase.from("products").select("id").limit(3);

if (!users?.length) { console.error("ไม่มี user ใน profiles"); process.exit(1); }
if (!products?.length) { console.error("ไม่มี product ใน products"); process.exit(1); }

const winnerId = users[0].id;
const rows = products.slice(0, 3).map((p, i) => ({
    product_id: p.id,
    winner_id: winnerId,
    final_price: [500, 1200, 3500][i],
    payment_status: "pending",
}));

const { data, error } = await supabase.from("auction_results").insert(rows).select();
if (error) { console.error("Error:", error.message); process.exit(1); }

console.log("✓ inserted auction_results:");
data.forEach(r => console.log(`  id=${r.id}  price=${r.final_price}`));
