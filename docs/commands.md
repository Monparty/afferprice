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

## รันทั้งโปรเจกต์ผ่าน Docker (ให้เพื่อนรันเองบนเครื่อง)

Backend ใช้ Supabase CLI เดิม (Docker) + ตัวแอป Next.js อยู่ใน `docker-compose.yml` (hybrid) — ต่อกันผ่าน `host.docker.internal`. ไฟล์: [Dockerfile](../Dockerfile), [docker-compose.yml](../docker-compose.yml), [.dockerignore](../.dockerignore).

**เพื่อนต้องมี:** Docker Desktop + Node.js + ไฟล์ `.env` (เจ้าของส่งให้ หรือ `cp .env.example .env` แล้วเติม key — ดู [.env.example](../.env.example))

```bash
git clone <repo> && cd afferprice
cp .env.example .env     # แล้วเติม key (หรือใช้ .env ที่เจ้าของส่งให้)
npm install              # ให้มี supabase CLI ผ่าน npx
npm run docker:up        # = npx supabase start && docker compose up --build
# เปิด http://localhost:3000  (Supabase Studio: http://localhost:54323)
npm run docker:down      # หยุดทั้ง app + supabase
```

- **secrets ไม่ commit** — `SUPABASE_SERVICE_ROLE_KEY` + `OMISE_SECRET_KEY` อยู่ใน `.env` (gitignored) ที่ compose อ่าน `${...}`; ค่าอื่น (NEXT_PUBLIC_*, host URL) ฝังใน `docker-compose.yml`
- **DB เพื่อนเปล่า** — สมัคร user ที่ `/register` แล้ว promote admin เอง (SQL ด้านบน) + สร้างหมวดหมู่/สินค้าเอง; ยังไม่มี `supabase/seed.sql`
- **ทำไม hybrid ไม่ใช่ `docker compose up` เดียว:** backend มาจาก `npx supabase start` (ใช้ migration/seed เดิม ไม่ drift) — `npm run docker:up` รวมให้เป็นคำสั่งเดียว
- **กลไก networking:** browser ยิง Supabase ที่ `127.0.0.1:54321` (baked ตอน build), ส่วน server-code ในคอนเทนเนอร์ยิง `host.docker.internal:54321` ผ่าน env `SUPABASE_INTERNAL_URL` (6 จุดฝั่ง server มี fallback — ไม่ตั้ง = พฤติกรรมเดิม prod/dev)
- **CSP + next/image** ใน [next.config.mjs](../next.config.mjs) derive origin จาก `NEXT_PUBLIC_SUPABASE_URL` แล้ว (รองรับทั้ง local http + prod https); `upgrade-insecure-requests` ปิดอัตโนมัติเมื่อ Supabase เป็น http
- **Windows/Mac:** `extra_hosts: host.docker.internal:host-gateway` ทำให้ใช้ได้ทั้ง Docker Desktop และ Linux
- **แก้โค้ดแล้วต้อง rebuild image:** `docker compose up --build` (โค้ดถูก build เข้า image ไม่ได้ mount — ต่างจาก `npm run dev`)
