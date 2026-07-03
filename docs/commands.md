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
