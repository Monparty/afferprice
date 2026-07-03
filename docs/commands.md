# Commands & Scripts

```bash
npm run dev      # Start Next.js dev server (port 3000)
npm run build    # Production build
npm run lint     # ESLint (Next.js Core Web Vitals)
npm start        # Run production build
```

- No test runner is configured.
- **⚠️ `npm run lint` reports errors internally but exits 0** — it cannot be trusted to fail CI. Verify real breakage with `npm run build`.

## Local Omise webhook

- Webhook needs a public URL. Run `ngrok http 3000`, then set the forwarding URL as the endpoint in the Omise Dashboard.
- Webhook route: `POST /api/payment/webhook` (see [architecture.md](architecture.md#payment-omise)).

## Auction reconcile cron

- Endpoint: `GET|POST /api/cron/reconcile` — ปิดประมูลที่หมดเวลา (`endAuction`) + ยกเลิกผลที่ผู้ชนะไม่จ่ายตามกำหนด (`expireUnpaidAuction`) ทั้งระบบ (`app/lib/auction/reconcile.js`).
- **ต้องตั้ง env `CRON_SECRET`** (server-only) ก่อน ไม่งั้น endpoint คืน 501; auth ผ่าน header `Authorization: Bearer <CRON_SECRET>` หรือ query `?key=<CRON_SECRET>`.
- ตั้งเวลาเรียกจาก external scheduler ทุก ~5–15 นาที:
  - **Vercel Cron**: เพิ่ม `vercel.json` → `{ "crons": [{ "path": "/api/cron/reconcile", "schedule": "*/10 * * * *" }] }` (Vercel ส่ง `Authorization: Bearer $CRON_SECRET` ให้อัตโนมัติเมื่อตั้ง env)
  - **cron-job.org / GitHub Actions**: ยิง URL พร้อม `?key=<CRON_SECRET>`
- Client reconcile เดิม (บน `/user/selling` mount) ยังทำงานอยู่ — cron เป็น safety net เมื่อไม่มีใครเปิดหน้า

## Local Supabase (test env)

Environment ทดสอบแยกจาก production 100% — Supabase stack เต็มบนเครื่อง (Docker). โครงสร้าง DB = ไฟล์เดียว `supabase/migrations/20260703040000_schema.sql` (squash). รายละเอียดการตั้งค่าดู [functions-log.md](functions-log.md).

**Prerequisites (ทุกครั้งก่อนเริ่ม):**
- เปิด **Docker Desktop** ให้ daemon รันก่อน (เช็ค: `docker info`)
- CLI ไม่ได้ลง global → เรียกผ่าน **`npx supabase ...`**

### Lifecycle

```bash
npx supabase start      # เปิด stack ทั้งหมด + apply migrations (ครั้งแรก pull image นาน) → พิมพ์ keys/URLs
npx supabase stop       # หยุด stack (ข้อมูลใน volume ยังอยู่)
npx supabase stop --no-backup   # หยุด + ลบข้อมูลทั้งหมด
npx supabase status     # ดู URLs + keys ของ stack ที่รันอยู่
npx supabase db reset   # drop DB → รัน migrations ใหม่ทั้งหมด + seed (ล้างข้อมูลกลับเป็นศูนย์)
```

### URLs (หลัง start)

| Service | URL |
|---|---|
| Studio (จัดการ DB) | http://localhost:54323 |
| API | http://127.0.0.1:54321 |
| Postgres | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |
| Mailpit (ดู auth email / OTP / magic link) | http://localhost:54324 |

### สลับ env (local ↔ prod)

```bash
# ไป local: .env.local ชี้ local อยู่แล้ว (prod อยู่ที่ .env.local.prod.bak)
# กลับ prod:
cp .env.local.prod.bak .env.local   # (PowerShell: copy .env.local.prod.bak .env.local)
```
- ต้อง **restart `npm run dev`** ทุกครั้งที่สลับ (ให้โหลด `.env.local` ใหม่)

### Docker (ตรวจ/debug stack)

```bash
docker ps --filter name=supabase                 # ดู container ทั้งหมดของ stack
docker logs supabase_db_afferprice --tail 50      # log ของ Postgres
docker exec -it supabase_db_afferprice psql -U postgres -d postgres   # เข้า psql ตรง
docker stats --no-stream                          # ดู CPU/RAM ที่ใช้
```

### แก้ schema ต่อจากนี้

```bash
npx supabase migration new <name>   # สร้างไฟล์ migration ใหม่ (ต่อจาก squash — อย่าแก้ไฟล์ squash)
npx supabase db diff -f <name>      # generate migration จาก diff ที่แก้ใน Studio
npx supabase db dump -f out.sql     # dump schema จาก remote (ต้อง SUPABASE_DB_PASSWORD)
```
- **⚠️ ห้าม `supabase db push` ไฟล์ squash ขึ้น remote prod เดิม** (prod มี migration history เดิม → ชนกัน). squash ใช้กับ local/โปรเจกต์ใหม่เท่านั้น
- **local DB ว่างเปล่า** — promote admin เอง:
  ```sql
  update profiles set role='admin' where id='<uuid>';
  update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb where id='<uuid>';
  ```
