# Security

Detailed security model. CLAUDE.md carries the iron rules; this file carries the implementation.

## Auth Helpers (server-only)

- [app/lib/supabase/server.js](../app/lib/supabase/server.js) — `createSupabaseServerClient()` — Supabase client ที่อ่าน session จาก cookie (สำหรับใช้ใน Route Handlers / Server Actions)
- [app/lib/auth.js](../app/lib/auth.js) — `requireUser()`, `requireAdmin()`, `AuthError`
  - throw `AuthError(401)` ถ้าไม่มี session, `AuthError(403)` ถ้าไม่ใช่ admin
  - ทุก Route Handler `try { ... } catch (err) { if (err instanceof AuthError) return NextResponse.json({error: err.message}, {status: err.status}); ... }`

## กฎเหล็กเรื่อง API/Server Actions

- **Server Action ใน `app/services/admin/*`** — ทุก export function **ต้อง** เรียก `await requireAdmin()` บรรทัดแรก (Server Action ถูก expose เป็น POST endpoint อัตโนมัติ — ไม่มี guard = ใครก็เรียกได้)
- **Route Handler ที่ทำ mutation** — ใช้ `requireUser()` แล้วเอา `user.id` จาก session, **ห้าม** trust `userId` จาก body
- **Payment routes** — amount/auction_result_id จาก client ต้อง verify กับ DB เสมอ; คำนวณยอด (final_price * 1.05) ฝั่ง server เท่านั้น
- **Topup amount** — clamp range 20–100,000 บาท ฝั่ง server
- **Omise webhook** — re-fetch charge จาก Omise API หลังรับ event (ไม่ trust body); ตรวจ `payment.amount === charge.amount / 100`

## Rate Limiting

- [app/lib/rateLimit.js](../app/lib/rateLimit.js) — `rateLimit({ key, limit, windowMs })` + `clientKey(req, suffix)`
- In-memory sliding window — works per instance; production scale ใหญ่ → switch เป็น Upstash KV
- ใช้กับ routes ทุกตัวที่เป็น public POST: webhook (60/min), auction/end (30/min), promptpay/linepay/credit-card (10/min), wallet/charge & register (5/min)

## Bid Validation (DB-side)

- Trigger `validate_bid` BEFORE INSERT บน `bids` ([20260524150000_validate_bid_trigger.sql](../supabase/migrations/20260524150000_validate_bid_trigger.sql))
- ตรวจ: product `state='active'`, `auction_end_time > now()`, seller ≠ bidder, **bidder `is_kyc='approved'`**, `bid_price > max(existing)`, ไม่ bid ติดกัน 2 ครั้ง, force `is_winning=false`
- **KYC check** ([20260606010000_bid_requires_kyc.sql](../supabase/migrations/20260606010000_bid_requires_kyc.sql)) — `CREATE OR REPLACE` `validate_bid` เพิ่มเช็ค `profiles.is_kyc`; ถ้า `IS DISTINCT FROM 'approved'` → `RAISE 'bidder_kyc_not_approved'` (มี Thai translation ใน [supabaseErrorMap.js](../app/utils/supabaseErrorMap.js)) — defense-in-depth คู่กับ UX guard ใน `CardProductBid`
- **ไม่ต้อง validate ซ้ำใน client** — แต่ก็ยังควรมี UX guard เพื่อกัน roundtrip

## Storage Buckets

| Bucket | Visibility | Use | Max size | Path scheme |
|---|---|---|---|---|
| `attachments` | public | product images/video, profile_image | 50 MB | `<uid>.<ext>` (uid = uuid v4) |
| `id-cards` | **private** | id_card_image + selfie_image (PII) | 5 MB | `<user_id>/<uid>.<ext>` |

- **RLS บน `id-cards`** ([20260524160000_*](../supabase/migrations/20260524160000_id_cards_private_bucket.sql)): owner read/write/delete ผ่าน path prefix `<auth.uid()>/`; admin read all
- **RLS บน `attachments`** ([20260524190000_*](../supabase/migrations/20260524190000_attachments_storage_policies.sql)): public SELECT, auth only INSERT, owner-only UPDATE/DELETE (`owner_id = auth.uid()`), MIME whitelist + size limit
- **id_card / selfie image flow**: เก็บ **path** (ไม่ใช่ full URL) ใน `profiles.id_card_image` + `profiles.selfie_image` → upload ผ่าน `uploadIdCard()` (bucket `id-cards`), render ผ่าน `createIdCardSignedUrl(path, 300)` (TTL 5 นาที); helper อยู่ใน [upload.service.js](../app/services/upload.service.js)
- **File validation client-side** ([app/utils/fileValidation.js](../app/utils/fileValidation.js)) — MIME + size + magic bytes (กัน .exe ที่ rename เป็น .jpg); auto-wired ใน [storageHelper.js](../app/utils/storageHelper.js) ทุก customRequest

## XSS Prevention

- **JSON-LD ใน `<script type="application/ld+json">`** — ต้องใช้ `jsonLdSafe(obj)` จาก [app/utils/jsonLdSafe.js](../app/utils/jsonLdSafe.js) แทน `JSON.stringify()` ตรง ๆ (escape `<>&` + U+2028/U+2029)
- **`dangerouslySetInnerHTML`** — ห้ามใช้กับ user-controlled content; ถ้าจำเป็น render rich text ให้ sanitize ผ่าน DOMPurify (ยังไม่ได้ install — Quill component เก่าถูกลบไปแล้ว)
- **CSP** ([next.config.mjs](../next.config.mjs)) — `frame-ancestors 'none'`, `object-src 'none'`, allow Omise/Supabase origins เท่านั้น

## Security Headers ([next.config.mjs](../next.config.mjs))

- `Content-Security-Policy` (full policy)
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## Profile Field Constraints (trigger)

- Trigger `profiles_validate_paths` ([20260524180000_*](../supabase/migrations/20260524180000_profile_image_validation.sql)):
  - `profile_image` ต้องเริ่มด้วย `https://*.supabase.co/storage/v1/object/`
  - `id_card_image` ต้องเริ่มด้วย `<user_id>/...` เท่านั้น
- กัน user ตั้ง URL ของไฟล์คนอื่นใส่ profile ตัวเอง (defacement / impersonation)

## FK / Audit Trail

- `bids.product_id` → `ON DELETE RESTRICT` (ห้ามลบ product ที่มี bid — เก็บ audit trail)
- `auction_results.product_id` → `ON DELETE RESTRICT` (financial record)
- `product_attachment` ยัง CASCADE (ลบรูปได้พร้อม product)

## Profiles RLS (สำคัญ)

- **`update own profile`** ([20260502000000_fix_critical_rls.sql](../supabase/migrations/20260502000000_fix_critical_rls.sql) + [20260526000001_kyc_rls_and_view.sql](../supabase/migrations/20260526000001_kyc_rls_and_view.sql)) มี `WITH CHECK` กัน user แก้ `role` / `status` / `is_kyc` / `kyc_remark` ตัวเอง — KYC transition ทำผ่าน `submit_kyc` RPC (SECURITY DEFINER) เท่านั้น
- **`admin read all profiles`** อ่าน role จาก `auth.jwt() -> 'app_metadata' ->> 'role'`
  - ตอน promote user เป็น admin ต้อง update **ทั้ง 2 ที่**:
    1. `profiles.role = 'admin'` (สำหรับ proxy + requireAdmin check)
    2. `auth.users.raw_app_meta_data ||= '{"role":"admin"}'::jsonb` (สำหรับ RLS policy)

## View Security

- `users_full` — **revoke จาก anon/authenticated** ([20260524170000_*](../supabase/migrations/20260524170000_lock_down_views_and_fks.sql)); ใช้ผ่าน `supabaseAdmin` (service_role) ใน admin services เท่านั้น

## Password Policy

- min 8, ต้องมีตัวอักษร + ตัวเลข, max 72 — [(auth)/register/schema.js](<../app/(auth)/register/schema.js>)

## Realtime Broadcast

- Channel name = public (anon subscribe ได้) — **ห้ามใส่ข้อมูล sensitive ใน payload**
- `wallet-{userId}` event `update` → payload ว่าง `{}` เท่านั้น (client re-fetch ผ่าน session)
- `bid-{productId}` ส่งราคา public ได้ (ราคา auction เป็นข้อมูลสาธารณะอยู่แล้ว)

## Env Vars (security-relevant)

- `SUPABASE_SERVICE_ROLE_KEY` — bypass RLS, **server-only**
- `OMISE_SECRET_KEY` — server-only
- `OMISE_WEBHOOK_USER` / `OMISE_WEBHOOK_PASSWORD` — optional Basic Auth สำหรับ webhook
- `NEXT_PUBLIC_*` — ทุกตัวที่ขึ้นต้นแบบนี้จะ expose ฝั่ง client; อย่าใส่ secret

## กฎเขียนโค้ดใหม่

1. **Route handler ที่ทำ mutation** → `requireUser()` + verify ownership จาก DB ก่อนทุกครั้ง
2. **Admin Server Action ใหม่** → `await requireAdmin()` บรรทัดแรกของฟังก์ชัน
3. **คำนวณยอดเงิน/ราคา** → ฝั่ง server โดยอ้างอิงข้อมูลจาก DB; ห้ามรับจาก client body
4. **Inline JSON ใน `<script>`** → `jsonLdSafe()` เท่านั้น
5. **อัปโหลดไฟล์** → ผ่าน `handleLocalPreview`/`handleUpload`/`uploadPendingFiles` (auto-validate); PII (เช่น id_card) → bucket `id-cards`
6. **เพิ่ม env var ใหม่** → ถ้าเป็น secret อย่าตั้งชื่อ `NEXT_PUBLIC_*`
7. **เพิ่ม endpoint POST ใหม่** → ใส่ `rateLimit()` ด้วย
8. **เพิ่ม column ที่ user ห้ามแก้เอง** → เพิ่มใน `WITH CHECK` ของ `"update own profile"` policy + ทำ RPC SECURITY DEFINER (มี caller guard) สำหรับ transition ที่อนุญาตเฉพาะกรณี
9. **State transition ใน admin service ที่ผูกกับ business rule** → check rule ภายใน service function (เช่น `upsertProduct` ตรวจ seller KYC ก่อนเปลี่ยน state) + เพิ่ม error code ใน [supabaseErrorMap.js](../app/utils/supabaseErrorMap.js) ให้ user เห็นข้อความภาษาไทย
