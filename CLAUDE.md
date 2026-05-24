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
- `setWalletBalance(number)` — sync wallet balance หลัง topup/charge (ใช้จาก AppHeader, /user/wallet, /user/payment)
- Store is provided via `app/providers/Providers.jsx` in the root layout
- **⚠️ `fetchUser` ไม่ได้ถูก dispatch ตอน app load** — มี dispatch แค่บางหน้า (CardProductBid, add-product, admin pages); หน้าใหม่ที่ต้องการ user id ให้ใช้ `supabase.auth.getUser()` ตรง ๆ แทน (pattern เดียวกับหน้า checkout)

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
| `payments` | Methods: `bank`, `credit_card`, `promptpay`, `wallet`, `linepay`; `purpose` = `auction` \| `topup` \| `listing_fee`; `auction_result_id` nullable (สำหรับ topup) |
| `wallet_transactions` | Audit trail ของ wallet — `type`: `topup` \| `payment` \| `refund`, `amount` (+/−), `balance_after`, `reference_id` (payment.id) |
| `shipments` | Tracking info |
| `notifications` | Types: `bid`, `win`, `lose`, `payment`, `shipping` |
| `categories` | Hierarchical via `parent_id` |

**Product status lifecycle**: `draft` → `pending_review` → `active` → `sold` (มีผู้ชนะ) / `cancelled` (ไม่มี bid); หลังจ่ายเงิน seller ระบุจัดส่ง → `order`; `rejected` มาจาก `pending_review`. Helper: `app/utils/mapProductState.js`.

**ไม่มี `ended` state ใน flow แล้ว** — ประมูลสิ้นสุดแล้วข้ามไป `sold` หรือ `cancelled` ทันที (migration: `supabase/migrations/20260513000000_add_order_state.sql`)

**RLS บน `products`**:
- seller อ่านสินค้าตัวเองได้ทุก state ผ่าน policy `"seller read own products"` (migration: `supabase/migrations/20260513000001_seller_read_own_products.sql`)
- bidder อ่านสินค้าที่ตัวเองเคย bid ได้ทุก state ผ่าน policy `"bidder read bid products"` (migration: `supabase/migrations/20260520000000_bidder_read_bid_products.sql`) — จำเป็นสำหรับ won tab (winner อ่าน product ที่ state='sold') และ cancelled tab (lost bidder อ่านได้)

**RLS บน `auction_results`**: อ่านได้เฉพาะ winner หรือ seller (policy `"winner or seller read result"`) — lost bidder อ่านไม่ได้ → query lost ต้องไม่ join `auction_results`

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
- **ช่องทางชำระเงิน**: เลือกที่ checkout ก่อน — 3 ตัวเลือก `promptpay` | `linepay` | `wallet` (state `paymentMethod`, default `promptpay`)
  - UI ใช้ `<div onClick>` + conditional className ตาม state (ไม่ใช่ `<label>` + radio `has-checked:`) เพราะ Tailwind 4 + `sr-only` ทำให้ visual state ไม่ทำงาน — pattern เดียวกับ address card ในหน้าเดียวกัน
- **ปุ่มชำระ** → route ไป `/user/payment/[auctionResultId]?method={paymentMethod}`

### Payment Page (`/user/payment/[auctionResultId]`)

- fetch ข้อมูลด้วย `getAuctionResultById(id)` ใน `payment.service.js`
- คำนวณยอด: `final_price + 5%` (ไม่รวมค่าจัดส่ง — ไม่ได้ persist จาก checkout)
- **อ่าน `method` จาก `useSearchParams()`** (default `promptpay`) → render UI แยกตาม method:
  - `promptpay` → เรียก `POST /api/payment/promptpay` on mount พร้อม `{ userId, amount, auctionResultId }` → แสดง QR จริง (Omise)
  - `linepay` → **mockup** — ปุ่ม "เปิดแอป LINE" → `createMockPayment()` insert `payments(linepay, pending)` → redirect `/user/selling`
  - `wallet` → อ่าน `walletBalance` จาก `state.user.data?.wallet_balance` (Redux) → ถ้าไม่พอ ปุ่ม redirect ไป `/user/wallet`; ถ้าพอ → `POST /api/payment/wallet/charge` (RPC `charge_wallet` atomic) → dispatch `setWalletBalance(d.balance_after)` → redirect `/user/selling`
- **`createMockPayment()`** ใน `payment.service.js` — insert จาก client (RLS `"user insert own payment"` อนุญาต); `transaction_ref` = `MOCK-{METHOD}-{timestamp}`
- **Migration**: `supabase/migrations/20260524000000_add_linepay_payment_method.sql` — เพิ่ม `linepay` ใน `payments_payment_method_check` constraint

### Bid Flow (`app/components/utils/CardProductBid.jsx`)

- รับ `product` และ `onBidSuccess` prop (callback หลัง bid สำเร็จ — ใช้ refresh bid list)
- `currentPrice` state sync กับ `product.start_price` ผ่าน useEffect (เพราะ product โหลด async)
- หลัง submit: `insertBid` → `updateProductPrice` → `setCurrentPrice` → `setHighestBidderId` → broadcast → `onBidSuccess?.()`
- `getBidsByProduct(productId)` ใน `bids.service.js` — ดึง bid history เรียงตาม `bid_time DESC`
- **Validation**: `bidPrice` ต้องมากกว่า `currentPrice` เท่านั้น (ไม่อนุญาตเท่ากัน) — `isBelowMin` ใช้ `<=`
- **ห้าม bid ติดกัน 2 ครั้ง**: ผู้ที่เป็น highest bidder อยู่ตอนนี้กดประมูลซ้ำไม่ได้ ต้องรอ user คนอื่นมา bid ก่อน
  - state `highestBidderId` เก็บ user id ของผู้ bid สูงสุด — set จาก `getHighestBid()` ตอน mount + จาก broadcast payload `userId`
  - `isHighestBidder = userData.id === highestBidderId` → disable ปุ่ม + เปลี่ยน label เป็น "รอผู้อื่นเสนอราคา"
  - `getHighestBid()` ใน `bids.service.js` คืน `{ bid_price, user_id }` (เพิ่ม `user_id`)
  - broadcast `new_bid` payload: `{ price, userId }` — sync `highestBidderId` ทุก tab
- **Bid history UI** (`ProductDetail.jsx`): highlight bid ของ user ปัจจุบัน — ดึง `currentUserId` จาก Redux (`state.user.data?.id`) แล้วเทียบกับ `bid.user_id` → avatar สีน้ำเงิน "ME", ชื่อ `"คุณ"`, แท็กสีน้ำเงิน, พื้นหลังแถวสีน้ำเงินอ่อน

### Realtime Bid (Supabase Broadcast)

- **ไม่ใช้ Postgres Replication** — ใช้ Supabase Broadcast แทน (ฟรี, ไม่ต้อง config Dashboard)
- **Channel name**: `bid-{product.id}` — ใช้ร่วมกันระหว่าง `CardProductBid`, `ProductDetail` และ listing cards ทุกหน้า
- **Flow**:
  1. `CardProductBid` subscribe channel on mount → รับ `new_bid` event → `setCurrentPrice(payload.price)`
  2. หลัง bid สำเร็จ → `channelRef.current?.send({ type: "broadcast", event: "new_bid", payload: { price } })`
  3. `ProductDetail` subscribe channel เดียวกัน → รับ event → `fetchBids(id)` (refresh bid list)
- **ผล**: ทุก tab ที่เปิดหน้าเดียวกันเห็นราคาและรายชื่อผู้ประมูลอัปเดตทันทีโดยไม่ต้อง reload

### useRealtimePrice Hook

- **File**: `app/hooks/useRealtimePrice.js`
- **Usage**: `const livePrice = useRealtimePrice(productId, initialPrice)`
- Subscribe `bid-{productId}` broadcast channel → รับ `new_bid` event → update `livePrice` state อัตโนมัติ
- **ใช้ใน**: `CardProduct`, `CardProductLive`, `CardZoomImage`, `CardHighlight` — ทุก listing card ที่แสดงราคา
- **Client**: ใช้ `supabase` singleton จาก `app/lib/supabase/client.js` (ไม่ต้อง import `createClient` จาก `@supabase/supabase-js` โดยตรง)

### Admin Menu & Pages

- **Menu config**: `app/admin/components/AdminLayout.jsx` (array `menus`) — แต่ละรายการ `{ url, label, icon }`; highlight active ผ่าน `pathname.split("/")[2]` เทียบกับ `menu.url.split("/")[2]`
- **Routes**: `app/admin/constants/routes.js` — เพิ่ม route ใหม่ที่นี่ก่อนใช้ใน menu/page
- **Pages ที่มีอยู่**:
  - `/admin` — แดชบอร์ด (stats + recent products + recent bids)
  - `/admin/products` — จัดการสินค้าประมูล (CRUD)
  - `/admin/bids` — ตรวจสอบการประมูล (group by product)
  - `/admin/auction-results` — สินค้าที่ประมูลจบ (ผู้ขาย, ผู้ชนะ, ราคาปิด, payment status)
  - `/admin/shipments` — รายการจัดส่ง (บริษัทขนส่ง, tracking, status)
  - `/admin/payments` — รายการชำระเงิน (transaction_ref, method, status — รองรับ promptpay/linepay/wallet/credit_card/bank)
  - `/admin/wallet` — กระเป๋าเงิน (ยอดรวมในระบบ + balance รายผู้ใช้ + ตาราง wallet_transactions)
  - `/admin/users` — จัดการผู้ใช้ (CRUD)
  - `/admin/categories` — จัดการหมวดหมู่ (CRUD)
  - `/admin/notifications` — รายการการแจ้งเตือนทั้งระบบ
  - `/admin/reports` — สรุปรายงาน (รายได้ + ค่าธรรมเนียม 5% + ยอดรายเดือน)
  - `/admin/issues` — placeholder (ยังไม่มี table ใน DB)
  - `/admin/settings` — placeholder อ่านอย่างเดียว (ค่าธรรมเนียม / การประมูล / การชำระเงิน / ระบบ)
- **Pattern หน้า list admin ใหม่**: `"use client"` → `useEffect` fetch service → map → `UseTable` ใน wrapper `bg-white rounded-xl shadow-sm border border-slate-100`
- **Services**: ทุก admin page ใช้ service จาก `app/services/admin/*.service.js` (มี `"use server"`) — query ผ่าน `supabaseAdmin` + manual join กับ `users_full` view (ไม่ใช้ FK join เพราะ `auth.users` แตะไม่ได้)

### Admin Bids (`/admin/bids`)

- **List page** (`app/admin/bids/page.jsx`) — 1 แถวต่อ 1 product (group bids by product_id) แสดง: รูป, ชื่อสินค้า, จำนวนผู้ประมูล (distinct user_id), จำนวนการประมูล, ราคาสูงสุด, สถานะสินค้า, ประมูลล่าสุด
- **Detail page** (`app/admin/bids/[id]/page.jsx`) — `id` คือ **`product_id`**; แสดงข้อมูลสินค้า + ตารางผู้ประมูลทั้งหมด (ชื่อ, อีเมล, ราคา, เวลา, สถานะชนะ/ไม่ชนะ)
- **Navigation**: ปุ่ม "ดูรายละเอียดการประมูล" (icon `EyeFilled` สีฟ้า) ในคอลัมน์ "จัดการ" ท้ายตาราง → `/admin/bids/[product_id]`
- **Service** (`app/services/admin/bids.service.js`):
  - `getBidsGroupedByProduct()` — query bids + join `products`, group ฝั่ง JS เป็น Map ตาม `product_id`, คำนวณ `bidders_count` (Set ของ user_id), `bids_count`, `highest_price`, `latest_bid_time`
  - `getBidsByProductId(productId)` — query bids ของ product เดียว + join `users_full` เพื่อดึงชื่อ/อีเมลผู้ประมูล
  - `getAllBids()` — legacy, ยังอยู่แต่ไม่ใช้ในหน้านี้แล้ว
- **`UseTable`** (`app/components/utils/UseTable.jsx`) รองรับ prop `onRow` (Ant Design pass-through) เพื่อให้ใส่ row event handler ได้

### Admin Product Edit (`/admin/products/[id]/edit`)

- **Form** (`app/admin/products/components/Form.jsx`) โหลด product ด้วย `getProductById` แล้ว `reset()` ค่าลงฟอร์ม
- **⚠️ `seller_id` ต้องส่งใน payload เสมอ** — Supabase `upsert` ทำ full replace; ถ้าไม่ส่ง `seller_id` จะ error NOT NULL. Page component fetch `seller_id` จาก product ตอน mount แล้วเก็บใน state
- **approve** → `state = 'active'` + set `auction_end_time` จาก `durationDays`; **reject** → `state = 'rejected'` + `rejected_remark`

### Selling Page (`/user/selling`)

- `getProductsByState(state)` join `auction_results(id, payment_status, winner_id)` + `bids(id, bid_price, user_id)` (user_id ใช้คำนวณจำนวนผู้ประมูล distinct)
- Tab พิเศษ:
  - `won` (สินค้าที่ฉันชนะ) → `getWonProductsByUser()` query จาก `auction_results` ด้วย `winner_id`
  - `active` merge สินค้าที่เป็นเจ้าของ + สินค้าที่ user เคย bid (ไม่ใช่เจ้าของ) ผ่าน `getActiveProductsBidByUser()` — tag `_isBidder: true` สำหรับ bid product → การ์ดแสดงป้าย "คุณได้ร่วมประมูล" สีน้ำเงิน
  - `cancelled` merge สินค้าที่ยกเลิกของเจ้าของ + สินค้าที่ user bid แต่ไม่ชนะ ผ่าน `getLostBidProductsByUser()` — tag `_isLost: true` → การ์ดแสดงป้าย "ประมูลไม่ชนะ" สีแดง
- **`getLostBidProductsByUser`** คำนวณ lost = `bid product ids` − `won product ids` (2 query แยก) แล้ว query products `state='sold'` `seller_id != user.id` — ไม่ join `auction_results` เพราะ RLS บล็อก
- **`CardSellingProduct`** (`"use client"`) รับ props:
  - `isBuyer`, `paymentStatus`:
    - seller + `sold` + payment `pending` → ข้อความ "รอชำระเงิน"
    - seller + `sold` + payment `paid` → ลิงก์ "ระบุข้อมูลการจัดส่ง" → `/user/checkout/[productId]`
    - buyer (`isBuyer=true`) + payment `pending` → ปุ่ม "ตรวจสอบ" → `/user/checkout/[productId]`
    - buyer + payment `paid` → ข้อความ "รอจัดส่งสินค้า"
  - `isBidder` → ป้าย "คุณได้ร่วมประมูล"
  - `isLost` → stateName "ประมูลไม่ชนะ" + popover "ดูสินค้า"
  - `bidders_count` → จำนวนผู้ประมูลแบบ distinct (`new Set(bids.map(b => b.user_id))`)
  - `auction_end_time` → countdown แบบ realtime (`setInterval` 1s) — `> 1 วัน`: `X วัน HH ชม.`; มิฉะนั้น `HH:MM:SS`; หมดเวลา: `หมดเวลา`

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
- **PromptPay flow**: POST `/api/payment/promptpay` body `{ userId, amount, auctionResultId?, purpose? }` → สร้าง source + charge → คืน `qrCodeUrl`; insert `payments` ถ้า `auctionResultId` มีอยู่ **หรือ** `purpose === 'topup'`
- **Webhook**: POST `/api/payment/webhook` — รับ `charge.complete` → update `payments.payment_status='success'` → branch ตาม `payment.purpose`:
  - `topup` → `rpc('credit_wallet', { p_payment_id })` + broadcast `wallet-{userId}` event `update`
  - `auction` (default) → UPDATE `auction_results.payment_status = 'paid'`
- **⚠️ payments row ต้องสร้างก่อน QR แสดง** — webhook หา record ด้วย `transaction_ref` (charge.id); ถ้าไม่มี row จะ update ไม่ได้
- **Component**: `app/components/payment/PromptPayQR.jsx` — รับ `userId`, `amount`, `auctionResultId?`
- **Payment page**: `/user/payment/[auctionResultId]`
- **Listing fee payment**: `PaymentBtn.jsx` ใน add-product flow — ค่าธรรมเนียม `LISTING_FEE` บาท (ไม่มี auctionResultId)
- **Local dev webhook**: ต้องใช้ ngrok — `ngrok http 3000` แล้วตั้ง endpoint ใน Omise Dashboard

### Wallet System

- **Migrations** (`supabase/migrations/`):
  - `20260524130000_add_wallet_to_profiles.sql` — `profiles.wallet_balance numeric(12,2) DEFAULT 0` + CHECK `>= 0`
  - `20260524130100_create_wallet_transactions.sql` — table + RLS (`SELECT WHERE auth.uid() = user_id`; **no INSERT policy** — service_role/RPC only)
  - `20260524130200_payments_allow_topup.sql` — `auction_result_id` nullable + `purpose` column
  - `20260524130300_wallet_rpcs.sql` — `credit_wallet` + `charge_wallet` (SECURITY DEFINER, granted to service_role)
- **RPCs** (เรียกผ่าน `supabaseAdmin.rpc()` จาก API route เท่านั้น):
  - `credit_wallet(p_payment_id)` — ใช้ตอน topup สำเร็จ; idempotent ผ่าน `EXISTS wallet_transactions WHERE reference_id = payment_id AND type='topup'` กัน double-credit เมื่อ webhook ส่งซ้ำ
  - `charge_wallet(p_user_id, p_amount, p_auction_result_id)` — atomic deduction; `SELECT FOR UPDATE` lock + ราคา < balance + insert `payments(wallet, success)` + insert `wallet_transactions(payment, -amount)` + update `auction_results.payment_status='paid'`
- **Service**: `app/services/wallet.service.js` — `getMyWalletBalance()`, `getMyTransactions({limit})`, `subscribeWallet(userId, onUpdate)` (broadcast channel `wallet-{userId}`)
- **API routes**:
  - `POST /api/payment/wallet/charge` — เรียก `charge_wallet` RPC + broadcast `wallet-{userId}` update
  - `POST /api/payment/promptpay` (extended) — รับ `purpose: 'topup'` แล้ว insert payments แม้ไม่มี `auctionResultId`
  - `POST /api/payment/linepay` + `POST /api/payment/linepay/confirm` — **mockup** topup (insert pending → confirm trigger `credit_wallet`)
  - `POST /api/payment/credit-card` — Omise charge ด้วย card token (รอ frontend Omise.js tokenize)
- **AppHeader pill** (`app/components/layout/AppHeader.jsx`):
  - Local state `walletBalance` (ไม่พึ่ง Redux เพราะ AppHeader load ก่อน fetchUser)
  - `fetchWallet()` → `getMyWalletBalance()` + `dispatch(setWalletBalance(bal))` (sync Redux ให้หน้าอื่นใช้)
  - Subscribe `wallet-{user.id}` channel ใน useEffect ที่ depend on `user` → refresh on broadcast
  - Pill แสดงระหว่าง DarkModeToggle และ notification bell, link → `/user/wallet`
- **หน้า wallet** (`app/(authenticated)/user/wallet/page.jsx`):
  - **ใช้ `supabase.auth.getUser()` ตรง ๆ** — ไม่พึ่ง Redux เพราะ `fetchUser` ไม่ได้ถูก dispatch ทุกหน้า
  - 3 sections: balance card (gradient orange), top-up modal, transaction list
  - **TopupModal** — preset chips `[100, 500, 1000, 5000]` + custom input + method radio (`promptpay`/`linepay`/`credit_card`)
  - หลัง topup สำเร็จ broadcast → wallet page + AppHeader refresh อัตโนมัติ
- **UserNavbar** (`app/(authenticated)/user/components/UserNavbar.jsx`) — มี nav item "กระเป๋าเงิน" → `/user/wallet`

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
