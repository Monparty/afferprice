# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Response Rules

- Answer shortly
- No unnecessary explanation
- Code first
- Bullet points only
- Ask before giving long examples

## Commands

```bash
npm run dev      # Start Next.js dev server (port 3000)
npm run build    # Production build
npm run lint     # ESLint (Next.js Core Web Vitals)
npm start        # Run production build
```

No test runner is configured.

## Architecture Overview

Thai-language auction/marketplace platform built with **Next.js App Router** (v16.2.4). The app is in early-to-mid development — auth, DB schema, and admin dashboard skeleton are in place; payment and shipping flows are still being built.

### Route Groups

```
app/
  (public)/         # Unauthenticated pages (listings, product detail)
  (auth)/           # Login, register
  (authenticated)/  # Checkout, payment, orders, user dashboard
  admin/            # Admin dashboard (role-gated via middleware)
```

`proxy.js` (middleware) guards `/admin/*` by checking `profiles.role === 'admin'` in Supabase. It also redirects authenticated users away from `/login`.

### Service Layer

All Supabase queries go through `app/services/`. Each domain has its own file (e.g. `products.service.js`, `auth.service.js`). Admin-specific services live in `app/services/admin/`.

- **Browser client**: `app/lib/supabase/client.js` (uses `ANON_KEY`)
- **Server/admin client**: `app/lib/supabase/admin.js` (uses `SERVICE_ROLE_KEY`, `server-only`)

### State Management

Redux Toolkit with a single slice: `app/features/user/userSlice.js`.

- `fetchUser` — async thunk that loads auth user + profile row
- `clearUser` — called on logout
- Store is provided via `app/providers/Providers.jsx` in the root layout

Notifications use Ant Design's notification API, exposed through `NotificationProvider.jsx` (`notifyError()` / `notifySuccess()` helpers).

### Forms & Validation

React Hook Form + Yup + `@hookform/resolvers`. Custom wrapper components (`UseButton`, `UseSelect`, `UseUpload`, etc.) live in `app/components/`.

### UI Stack

- **Ant Design 6.3.5** — Thai locale (`th_TH`), volcano color palette
- **Tailwind CSS 4** — utility classes alongside Ant Design
- **HolyLoader** — page transition bar in root layout
- Max-width container: `360px` base with responsive padding

### Database (Supabase / PostgreSQL)

Schema defined in `db/00_schema.sql`. Key tables:

| Table | Notes |
|---|---|
| `profiles` | Extends `auth.users`; `role` = `user` \| `admin` |
| `products` | Core auction listings; status lifecycle below |
| `product_images` | Ordered images per product |
| `bids` | Bids with `is_winning` flag — **set อัตโนมัติโดย `/api/auction/end`** เมื่อประมูลสิ้นสุด; ใช้ `getHighestBid()` ถ้าต้องการราคาสูงสุดแบบ real-time |
| `auction_results` | Winner + final price per auction — สร้างโดย `/api/auction/end` เมื่อ `state` เปลี่ยนเป็น `ended` |
| `payments` | Methods: `bank`, `credit_card`, `promptpay`, `wallet` |
| `shipments` | Tracking info |
| `notifications` | Types: `bid`, `win`, `lose`, `payment`, `shipping` |
| `categories` | Hierarchical via `parent_id` |

**Product status lifecycle**: `draft` → `pending_review` → `active` → `ended` / `sold` / `cancelled`; can also move to `rejected` from `pending_review`. Helper: `app/utils/mapProductState.js`.

**`products.start_price` หลัง bid**: ทำหน้าที่เป็น "ราคาปัจจุบัน / floor ของ bid ถัดไป" — `updateProductPrice()` ใน `products.service.js` จะ update ค่านี้ทุกครั้งที่ bid สำเร็จ ไม่มีคอลัมน์ `current_price` แยกต่างหาก

### Auction End Flow

- **Trigger**: client-side — เมื่อ timer ใน `CardProductBid` นับถอยหลังถึง 0 → `POST /api/auction/end`
- **API route**: `app/api/auction/end/route.js` (ใช้ `supabaseAdmin`)
  1. ตรวจ `auction_end_time < now()` และ `state = active` (กัน early call)
  2. Idempotency — ถ้า `auction_results` มี record อยู่แล้วให้ return ออก
  3. หา highest bid → INSERT `auction_results` + `UPDATE bids SET is_winning = true`
  4. INSERT notifications (`win` ให้ winner, `lose` ให้ bidder อื่น)
  5. UPDATE `products.state = 'ended'`
- **State lifecycle**: `active` → `ended` (ประมูลสิ้นสุด) → `sold` (หลังชำระเงิน)
- **`auction_end_time`** ถูก set โดย admin ตอน approve เท่านั้น (ไม่ set ตอน draft save)

### Favorites

- **Service**: `app/services/favorites.service.js` — `getFavorites`, `addFavorite`, `removeFavorite`, `checkIsFavorite`
- **Hook**: `app/hooks/useFavorite.js` — `useFavorite(productId)` คืน `{ isFavorited, toggle, loading }` ใช้ได้จากทุก component โดยไม่ต้องพึ่ง Redux
- **หน้า favorites**: `/user/favorites` — โหลดจาก DB จริง

### Checkout Flow

- **URL**: `/checkout/[id]` — `id` คือ **`product.id`** (ไม่ใช่ `auction_result.id`)
- **Service**: `getAuctionResultByProduct(productId)` ใน `payment.service.js` — query ด้วย `product_id`
- **ยอดรวม**: `final_price` + ค่าธรรมเนียม 5% + ค่าจัดส่ง (เลือกได้)
- **ปุ่มชำระ** → route ไป `/user/payment/[auctionResultId]`

### Bid Flow (`app/components/utils/CardProductBid.jsx`)

- รับ `product` และ `onBidSuccess` prop (callback หลัง bid สำเร็จ — ใช้ refresh bid list)
- `currentPrice` state sync กับ `product.start_price` ผ่าน useEffect (เพราะ product โหลด async)
- หลัง submit: `insertBid` → `updateProductPrice` → `setCurrentPrice` → `onBidSuccess?.()`
- `getBidsByProduct(productId)` ใน `bids.service.js` — ดึง bid history เรียงตาม `bid_time DESC`

### Payment (Omise)

- **Keys**: `OMISE_SECRET_KEY` (server-only), `NEXT_PUBLIC_OMISE_PUBLIC_KEY` (client)
- **DO NOT use `omise` npm package** — ESM interop broken in Next.js App Router. Use `fetch` โดยตรงผ่าน helper `omiseFetch` ใน `app/api/payment/promptpay/route.js`
- **PromptPay flow**: POST `/api/payment/promptpay` → สร้าง source + charge → คืน `qrCodeUrl`
- **Webhook**: POST `/api/payment/webhook` — รับ `charge.complete` event จาก Omise → อัป `payments.payment_status`
- **Component**: `app/components/payment/PromptPayQR.jsx` — รับ `userId`, `amount`, `auctionResultId?`
- **Payment page**: `/user/payment/[auctionResultId]`
- **Listing fee payment**: `PaymentBtn.jsx` ใน add-product flow — ค่าธรรมเนียม `LISTING_FEE` บาท (ไม่มี auctionResultId)
- **Local dev webhook**: ต้องใช้ ngrok — `ngrok http 3000` แล้วตั้ง endpoint ใน Omise Dashboard

## Key Conventions

- **Imports**: `@/` alias maps to the project root (`app/`, `db/`, etc.)
- **TypeScript**: `strict: false`; most files are `.jsx` / `.js`
- **Component naming**: PascalCase files (`CardProduct.jsx`)
- **Service naming**: camelCase ending in `.service.js`
- **Supabase admin client** must never be imported in client components (marked `server-only`)
