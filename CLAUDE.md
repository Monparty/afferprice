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

- **`notifyError(error)`** — แปล `error.message` จาก Supabase เป็นภาษาไทยอัตโนมัติผ่าน `translateSupabaseError()` ใน `app/utils/supabaseErrorMap.js` ก่อนแสดง; ถ้าไม่มีใน map จะ fallback แสดงข้อความเดิม
- **เพิ่ม error message ใหม่**: แก้เฉพาะ `errorMap` ใน `app/utils/supabaseErrorMap.js` — ไม่ต้องแตะ call sites

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
| `auction_results` | Winner + final price per auction — สร้างโดย `/api/auction/end`; `payment_status`: `pending` → `paid` (webhook อัปเมื่อจ่ายสำเร็จ) |
| `payments` | Methods: `bank`, `credit_card`, `promptpay`, `wallet` |
| `shipments` | Tracking info |
| `notifications` | Types: `bid`, `win`, `lose`, `payment`, `shipping` |
| `categories` | Hierarchical via `parent_id` |

**Product status lifecycle**: `draft` → `pending_review` → `active` → `sold` (มีผู้ชนะ) / `cancelled` (ไม่มี bid); หลังจ่ายเงิน seller ระบุจัดส่ง → `order`; `rejected` มาจาก `pending_review`. Helper: `app/utils/mapProductState.js`.

**ไม่มี `ended` state ใน flow แล้ว** — ประมูลสิ้นสุดแล้วข้ามไป `sold` หรือ `cancelled` ทันที (migration: `supabase/migrations/20260513000000_add_order_state.sql`)

**RLS บน `products`**: seller อ่านสินค้าตัวเองได้ทุก state ผ่าน policy `"seller read own products"` (migration: `supabase/migrations/20260513000001_seller_read_own_products.sql`)

**`products.start_price` หลัง bid**: ทำหน้าที่เป็น "ราคาปัจจุบัน / floor ของ bid ถัดไป" — `updateProductPrice()` ใน `products.service.js` จะ update ค่านี้ทุกครั้งที่ bid สำเร็จ ไม่มีคอลัมน์ `current_price` แยกต่างหาก

### Auction End Flow

- **Trigger**: client-side — เมื่อ timer ใน `CardProductBid` นับถอยหลังถึง 0 → `POST /api/auction/end`
- **API route**: `app/api/auction/end/route.js` (ใช้ `supabaseAdmin`)
  1. ตรวจ `auction_end_time < now()` และ `state = active` (กัน early call)
  2. Idempotency — ถ้า `auction_results` มี record อยู่แล้วให้ return ออก
  3. หา highest bid → INSERT `auction_results` + `UPDATE bids SET is_winning = true`
  4. INSERT notifications (`win` ให้ winner, `lose` ให้ bidder อื่น)
  5. UPDATE `products.state`:
     - มีผู้ชนะ → `'sold'`
     - ไม่มี bid → `'cancelled'`
- **`auction_end_time`** ถูก set โดย admin ตอน approve เท่านั้น (ไม่ set ตอน draft save)

### Favorites

- **Service**: `app/services/favorites.service.js` — `getFavorites`, `addFavorite`, `removeFavorite`, `checkIsFavorite`
- **Hook**: `app/hooks/useFavorite.js` — `useFavorite(productId)` คืน `{ isFavorited, toggle, loading }` ใช้ได้จากทุก component โดยไม่ต้องพึ่ง Redux
- **หน้า favorites**: `/user/favorites` — โหลดจาก DB จริง
- **Delete product**: `deleteProduct()` ใน `admin/products.service.js` ลบ `favorites` ก่อนเสมอเพื่อป้องกัน FK constraint

### Checkout Flow

- **URL**: `/user/checkout/[id]` — `id` คือ **`product.id`** (ไม่ใช่ `auction_result.id`)
- **Service**: `getAuctionResultByProduct(productId)` ใน `payment.service.js` — query ด้วย `product_id`
- **ที่อยู่จัดส่ง**: โหลดจาก `user_addresses` — ใช้ `CardUserAddress` prop `readonly` เพื่อซ่อนปุ่ม edit/delete/set-default; เพิ่มที่อยู่ใหม่ผ่าน modal `UserAddressForm` ใน checkout ได้เลย
- **ยอดรวม**: `final_price` + ค่าธรรมเนียม 5% + ค่าจัดส่ง (เลือกได้)
- **ปุ่มชำระ** → route ไป `/user/payment/[auctionResultId]`

### Payment Page (`/user/payment/[auctionResultId]`)

- fetch ข้อมูลด้วย `getAuctionResultById(id)` ใน `payment.service.js`
- คำนวณยอด: `final_price + 5%` (ไม่รวมค่าจัดส่ง — ไม่ได้ persist จาก checkout)
- QR code: เรียก `POST /api/payment/promptpay` on mount พร้อม `{ userId, amount, auctionResultId }`

### Bid Flow (`app/components/utils/CardProductBid.jsx`)

- รับ `product` และ `onBidSuccess` prop (callback หลัง bid สำเร็จ — ใช้ refresh bid list)
- `currentPrice` state sync กับ `product.start_price` ผ่าน useEffect (เพราะ product โหลด async)
- หลัง submit: `insertBid` → `updateProductPrice` → `setCurrentPrice` → broadcast → `onBidSuccess?.()`
- `getBidsByProduct(productId)` ใน `bids.service.js` — ดึง bid history เรียงตาม `bid_time DESC`
- **Validation**: `bidPrice` ต้องมากกว่า `currentPrice` เท่านั้น (ไม่อนุญาตเท่ากัน) — `isBelowMin` ใช้ `<=`

### Realtime Bid (Supabase Broadcast)

- **ไม่ใช้ Postgres Replication** — ใช้ Supabase Broadcast แทน (ฟรี, ไม่ต้อง config Dashboard)
- **Channel name**: `bid-{product.id}` — ใช้ร่วมกันระหว่าง `CardProductBid` และ `ProductDetail`
- **Flow**:
  1. `CardProductBid` subscribe channel on mount → รับ `new_bid` event → `setCurrentPrice(payload.price)`
  2. หลัง bid สำเร็จ → `channelRef.current?.send({ type: "broadcast", event: "new_bid", payload: { price } })`
  3. `ProductDetail` subscribe channel เดียวกัน → รับ event → `fetchBids(id)` (refresh bid list)
- **ผล**: ทุก tab ที่เปิดหน้าเดียวกันเห็นราคาและรายชื่อผู้ประมูลอัปเดตทันทีโดยไม่ต้อง reload

### Admin Product Edit (`/admin/products/[id]/edit`)

- **Form** (`app/admin/products/components/Form.jsx`) โหลด product ด้วย `getProductById` แล้ว `reset()` ค่าลงฟอร์ม
- **⚠️ `seller_id` ต้องส่งใน payload เสมอ** — Supabase `upsert` ทำ full replace; ถ้าไม่ส่ง `seller_id` จะ error NOT NULL. Page component fetch `seller_id` จาก product ตอน mount แล้วเก็บใน state
- **approve** → `state = 'active'` + set `auction_end_time` จาก `durationDays`; **reject** → `state = 'rejected'` + `rejected_remark`

### Selling Page (`/user/selling`)

- `getProductsByState(state)` join `auction_results(id, payment_status, winner_id)`
- Tab พิเศษ `won` (สินค้าที่ฉันชนะ) → ใช้ `getWonProductsByUser()` query จาก `auction_results` ด้วย `winner_id`
- **`CardSellingProduct`** รับ `isBuyer`, `paymentStatus` props:
  - seller + `sold` + payment `pending` → แสดงข้อความ "รอชำระเงิน"
  - seller + `sold` + payment `paid` → ลิงก์ "ระบุข้อมูลการจัดส่ง" → `/user/checkout/[productId]`
  - buyer (`isBuyer=true`) + payment `pending` → ปุ่ม "ตรวจสอบ" → `/user/checkout/[productId]`
  - buyer + payment `paid` → ข้อความ "รอจัดส่งสินค้า"

### Shipment Flow

- **Trigger**: seller กดลิงก์ "ระบุข้อมูลการจัดส่ง" → `/user/checkout/[productId]`
- **Checkout page** ตรวจ role: ถ้า `product.seller_id === currentUser.id` **และ** `payment_status = 'paid'` → แสดง shipment form แทน checkout flow
- **Form fields**: shipping_company, tracking_number
- **Service**: `app/services/shipment.service.js` — `createShipment({ auctionResultId, shippingCompany, trackingNumber })`
- **หลัง submit**: INSERT `shipments` → UPDATE `products.state = 'order'` → redirect `/user/selling`
- **`shipments.address_id`** เป็น nullable (migration แก้แล้ว)

### Payment (Omise)

- **Keys**: `OMISE_SECRET_KEY` (server-only), `NEXT_PUBLIC_OMISE_PUBLIC_KEY` (client)
- **DO NOT use `omise` npm package** — ESM interop broken in Next.js App Router. Use `fetch` โดยตรงผ่าน helper `omiseFetch` ใน `app/api/payment/promptpay/route.js`
- **PromptPay flow**: POST `/api/payment/promptpay` → สร้าง source + charge → คืน `qrCodeUrl`
- **Webhook**: POST `/api/payment/webhook` — รับ `charge.complete` event จาก Omise → อัป `payments.payment_status = 'success'` + UPDATE `auction_results.payment_status = 'paid'` (เฉพาะ payment ที่มี `auction_result_id`)
- **⚠️ payments row ต้องสร้างก่อน QR แสดง** — webhook หา record ด้วย `transaction_ref` (charge.id); ถ้าไม่มี row จะ update ไม่ได้
- **Component**: `app/components/payment/PromptPayQR.jsx` — รับ `userId`, `amount`, `auctionResultId?`
- **Payment page**: `/user/payment/[auctionResultId]`
- **Listing fee payment**: `PaymentBtn.jsx` ใน add-product flow — ค่าธรรมเนียม `LISTING_FEE` บาท (ไม่มี auctionResultId)
- **Local dev webhook**: ต้องใช้ ngrok — `ngrok http 3000` แล้วตั้ง endpoint ใน Omise Dashboard

### Inactivity Logout

- **Hook**: `app/hooks/useInactivityLogout.js` — track กิจกรรม (`mousemove`, `keydown`, `click`, `touchstart`, `scroll`) บันทึกลง `localStorage` key `lastActivity`
- ตรวจทุก 60 วินาที — ถ้าไม่มี activity > 2ชม. → `logout()` + `clearUser` + redirect `/login`
- ลบ `lastActivity` เมื่อ: timeout ครบ หรือ `SIGNED_OUT` event จาก Supabase (ครอบคลุม logout ปกติ + session หมดอายุ)
- **Mount point**: `<InactivityGuard />` ใน `app/providers/Providers.jsx` (ภายใน Redux Provider เพื่อเข้าถึง `dispatch`)

### Notification Bell (AppHeader)

- **Service**: `app/services/notifications.service.js` — `getMyNotifications`, `getUnreadCount`, `markAllNotificationsRead`
- **Badge count**: unread notifications + จำนวน rejected products (ดึงจาก `getSellerProducts`)
- **Drawer**: `UseDrawer` → `CardDrawer` — เปิดครั้งแรก fetch + mark all read + reset badge
- **Persistent alerts** (ไม่ mark as read): products ที่ state = `rejected` — ดึงจาก `products` table โดยตรง หายเองเมื่อ user แก้ไขแล้ว state เปลี่ยน; กดปุ่ม "แก้ไขสินค้า" → `/user/add-product/[id]/edit`
- `profiles` ไม่มี column `email` — email อยู่ใน `auth.users`; ใช้ view `users_full` เพื่อ query รวม

## Key Conventions

- **Imports**: `@/` alias maps to the project root (`app/`, `db/`, etc.)
- **TypeScript**: `strict: false`; most files are `.jsx` / `.js`
- **Component naming**: PascalCase files (`CardProduct.jsx`)
- **Service naming**: camelCase ending in `.service.js`
- **Supabase admin client** must never be imported in client components (marked `server-only`)
