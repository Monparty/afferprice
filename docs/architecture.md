# Architecture & Flows

Detailed system design for the afferprice auction platform. CLAUDE.md holds the essentials; this file holds the flows.

## Route Groups

```
app/
  (public)/         # Unauthenticated pages (listings, product detail)
  (auth)/           # Login, register
  (authenticated)/  # Checkout, payment, orders, user dashboard
  admin/            # Admin dashboard (role-gated via middleware)
```

`proxy.js` (middleware — Next.js 16 ใช้ convention ชื่อ `proxy` แทน `middleware`) guards `/admin/*` by checking `profiles.role === 'admin'` in Supabase. It also redirects authenticated users away from `/login`.

## Service Layer

All Supabase queries go through `app/services/`. Each domain has its own file (e.g. `products.service.js`, `auth.service.js`). Admin-specific services live in `app/services/admin/`.

- **Browser client**: `app/lib/supabase/client.js` (uses `ANON_KEY`)
- **Server/admin client**: `app/lib/supabase/admin.js` (uses `SERVICE_ROLE_KEY`, `server-only`)

## State Management

Redux Toolkit with a single slice: `app/features/user/userSlice.js`.

- `fetchUser` — async thunk that loads auth user + profile row
- `clearUser` — called on logout
- `setWalletBalance(number)` — sync wallet balance หลัง topup/charge (ใช้จาก AppHeader, /user/wallet, /user/payment)
- Store is provided via `app/providers/Providers.jsx` in the root layout
- **⚠️ `fetchUser` ไม่ได้ถูก dispatch ตอน app load** — มี dispatch แค่บางหน้า (CardProductBid, add-product, admin pages); หน้าใหม่ที่ต้องการ user id ให้ใช้ `supabase.auth.getUser()` ตรง ๆ แทน (pattern เดียวกับหน้า checkout)

Notifications use Ant Design's notification API, exposed through `NotificationProvider.jsx` (`notifyError()` / `notifySuccess()` helpers).

- **`notifyError(error)`** — แปล `error.message` จาก Supabase เป็นภาษาไทยอัตโนมัติผ่าน `translateSupabaseError()` ใน `app/utils/supabaseErrorMap.js` ก่อนแสดง; ถ้าไม่มีใน map จะ fallback แสดงข้อความเดิม
- **เพิ่ม error message ใหม่**: แก้เฉพาะ `errorMap` ใน `app/utils/supabaseErrorMap.js` — ไม่ต้องแตะ call sites

## Database (Supabase / PostgreSQL)

Schema defined in `db/00_schema.sql`. Key tables:

| Table | Notes |
|---|---|
| `profiles` | Extends `auth.users`; `role` = `user` \| `admin`; `is_kyc` = `unknown` \| `pending` \| `approved` \| `rejected` (default `unknown`); `kyc_remark` (admin reject reason) |
| `products` | Core auction listings; status lifecycle below |
| `product_images` | Ordered images per product |
| `bids` | Bids with `is_winning` flag — **set อัตโนมัติโดย `/api/auction/end`** เมื่อประมูลสิ้นสุด; ใช้ `getHighestBid()` ถ้าต้องการราคาสูงสุดแบบ real-time |
| `auction_results` | Winner + final price per auction — สร้างโดย `/api/auction/end`; `payment_status`: `pending` → `paid` (webhook อัปเมื่อจ่ายสำเร็จ) |
| `payments` | Methods: `bank`, `credit_card`, `promptpay`, `wallet`, `linepay`; `purpose` = `auction` \| `topup` \| `listing_fee`; `auction_result_id` nullable (topup/listing_fee); `product_id` nullable (listing_fee เก็บ link ไปยัง product) |
| `wallet_transactions` | Audit trail ของ wallet — `type`: `topup` \| `payment` \| `refund`, `amount` (+/−), `balance_after`, `reference_id` (payment.id) |
| `shipments` | Tracking info |
| `notifications` | Types: `bid`, `win`, `lose`, `payment`, `shipping`, `kyc` |
| `categories` | Hierarchical via `parent_id` |

**Product status lifecycle**: `draft` → `pending_review` → `active` → `sold` (มีผู้ชนะ) / `cancelled` (ไม่มี bid); หลังจ่ายเงิน seller ระบุจัดส่ง → `order`; `rejected` มาจาก `pending_review`. Helper: `app/utils/mapProductState.js`.

**ไม่มี `ended` state ใน flow แล้ว** — ประมูลสิ้นสุดแล้วข้ามไป `sold` หรือ `cancelled` ทันที (migration: `supabase/migrations/20260513000000_add_order_state.sql`)

**RLS บน `products`**:
- seller อ่านสินค้าตัวเองได้ทุก state ผ่าน policy `"seller read own products"` (migration: `supabase/migrations/20260513000001_seller_read_own_products.sql`)
- bidder อ่านสินค้าที่ตัวเองเคย bid ได้ทุก state ผ่าน policy `"bidder read bid products"` (migration: `supabase/migrations/20260520000000_bidder_read_bid_products.sql`) — จำเป็นสำหรับ won tab (winner อ่าน product ที่ state='sold') และ cancelled tab (lost bidder อ่านได้)

**RLS บน `auction_results`**: อ่านได้เฉพาะ winner หรือ seller (policy `"winner or seller read result"`) — lost bidder อ่านไม่ได้ → query lost ต้องไม่ join `auction_results`

**`products.start_price` หลัง bid**: ทำหน้าที่เป็น "ราคาปัจจุบัน / floor ของ bid ถัดไป" — `updateProductPrice()` ใน `products.service.js` จะ update ค่านี้ทุกครั้งที่ bid สำเร็จ ไม่มีคอลัมน์ `current_price` แยกต่างหาก

## Auction End Flow

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
- **⚠️ Trigger เป็น client-side อย่างเดียว** → ถ้าหมดเวลาแต่ไม่มีใครเปิดหน้า product detail สถานะจะค้างที่ `active`. **Reconciliation**: `endExpiredActiveAuctions()` ใน `products.service.js` หาสินค้า `state='active'` ที่ `auction_end_time < now()` (สินค้าตัวเอง + สินค้าที่ user เคย bid) แล้วยิง `/api/auction/end` ให้ครบ — เรียกตอน mount หน้า `/user/selling`; ถ้า `ended > 0` bump `refreshKey` re-fetch list + counts (ยังไม่มี server-side cron — ค้างได้ถ้าไม่มีใครเปิดหน้า selling/detail เลย)
- **`auction_results` มี `UNIQUE(product_id)`** (migration `20260702000000_bid_deposits.sql`) — กัน endpoint ถูกยิงซ้ำพร้อมกัน (เช่น timer หมดพร้อมกันหลาย tab) สร้าง `auction_results` ซ้ำ; ถ้า insert ชน unique → return `{ ended: true }` ทันทีไม่ทำ step ถัดไปซ้ำ
- **จัดการเงินมัดจำ (bid deposit)** — หลัง set `is_winning`/insert notifications: ดึง `bid_deposits` ที่ `status='held'` ของ product ทั้งหมด → ของผู้ชนะ mark `status='applied'` (หักออกจากยอดชำระภายหลัง), ที่เหลือ (คนแพ้ + คนวางมัดจำไว้แต่ไม่เคย bid จริง) เรียก RPC `refund_bid_deposit` คืนเข้า wallet + insert notification (`type='payment'`, "คืนเงินมัดจำแล้ว") + broadcast `wallet-{userId}` ดู [Bid Deposit](#bid-deposit-เงินมัดจำก่อนประมูล)

## Favorites

- **Service**: `app/services/favorites.service.js` — `getFavorites`, `addFavorite`, `removeFavorite`, `checkIsFavorite`
- **Hook**: `app/hooks/useFavorite.js` — `useFavorite(productId)` คืน `{ isFavorited, toggle, loading }` ใช้ได้จากทุก component โดยไม่ต้องพึ่ง Redux
- **หน้า favorites**: `/user/favorites` — โหลดจาก DB จริง
- **Delete product**: `deleteProduct()` ใน `admin/products.service.js` ลบ `favorites` ก่อนเสมอเพื่อป้องกัน FK constraint

## Checkout Flow

- **URL**: `/user/checkout/[id]` — `id` คือ **`product.id`** (ไม่ใช่ `auction_result.id`)
- **Service**: `getAuctionResultByProduct(productId)` ใน `payment.service.js` — query ด้วย `product_id`
- **ที่อยู่จัดส่ง**: โหลดจาก `user_addresses` — ใช้ `CardUserAddress` prop `readonly` เพื่อซ่อนปุ่ม edit/delete/set-default; เพิ่มที่อยู่ใหม่ผ่าน modal `UserAddressForm` ใน checkout ได้เลย
- **ยอดรวม**: `final_price` + ค่าธรรมเนียม 5% + ค่าจัดส่ง (เลือกได้) − เงินมัดจำที่วางไว้ (ถ้ามี, ดู [Bid Deposit](#bid-deposit-เงินมัดจำก่อนประมูล)) — `total = Math.max(0, final_price + fee + shipping - depositApplied)`; ดึงมัดจำผ่าน `getMyBidDeposit(productId)` (RLS คืนเฉพาะของผู้ซื้อ ฝั่ง seller ไม่มี row)
- **ช่องทางชำระเงิน**: เลือกที่ checkout ก่อน — 5 ตัวเลือก `promptpay` | `credit_card` | `truemoney` | `linepay` | `wallet` (state `paymentMethod`, default `promptpay`); ส่งต่อเป็น `?method=` ไปหน้า payment
  - UI ใช้ `<div onClick>` + conditional className ตาม state (ไม่ใช่ `<label>` + radio `has-checked:`) เพราะ Tailwind 4 + `sr-only` ทำให้ visual state ไม่ทำงาน — pattern เดียวกับ address card ในหน้าเดียวกัน
- **ปุ่มชำระ** → route ไป `/user/payment/${result.id}?method={paymentMethod}` (**`result.id` = auction_result.id ไม่ใช่ `id` ที่เป็น product.id** — หน้า payment เรียก `getAuctionResultById` ที่ query ด้วย auction_result.id)
- **Seller ship mode** (`sellerShipMode = isSeller && payment_status==='paid'`): ผู้ขายเปิด checkout เดียวกันแต่เห็นมุมผู้ขาย
  - section 2 แสดง **ที่อยู่ของผู้ซื้อ** (`getBuyerShippingAddress` ใน `checkout.service.js`) แบบ read-only; section 3 (รูปแบบจัดส่ง) + 4 (ช่องทางชำระ) `pointer-events-none` (ดูได้อย่างเดียว)
  - ปุ่มสรุปยอดเปลี่ยนเป็น "ระบุเลขใบเสร็จการจัดส่ง" → `setShowShipmentForm(true)` (state) → เปิดฟอร์มจัดส่ง (ไม่ route ไป payment)
  - `getBuyerShippingAddress(auctionResultId)` = `"use server"` action: `requireUser()` + verify seller ownership + `supabaseAdmin` bypass RLS ดึง default address ของ winner (RLS `"user manage own address"` บล็อก seller อ่าน address คนอื่น)

## Payment Page (`/user/payment/[auctionResultId]`)

- fetch ข้อมูลด้วย `getAuctionResultById(id)` ใน `payment.service.js` (select เพิ่ม `product_id` — ใช้หาเงินมัดจำ)
- คำนวณยอด: `final_price + 5%` (ไม่รวมค่าจัดส่ง — ไม่ได้ persist จาก checkout) **− เงินมัดจำที่วางไว้** (ถ้า `bid_deposits.status='applied'`, ดู [Bid Deposit](#bid-deposit-เงินมัดจำก่อนประมูล)) → `total = Math.max(0, final_price + fee - depositApplied)`; หักซ้ำอีกชั้นฝั่ง server ใน `getAppliedDepositAmount()` (promptpay/wallet-charge/credit-card/omise route ทุกตัว) — ตัวเลขหน้านี้เป็นแค่ display
- **อ่าน `method` จาก `useSearchParams()`** (default `promptpay`) → render UI แยกตาม method:
  - `promptpay` → เรียก `POST /api/payment/promptpay` on mount พร้อม `{ userId, amount, auctionResultId }` → แสดง QR จริง (Omise)
  - `credit_card` → `OmiseCardForm` → token → POST `/api/payment/credit-card` (`purpose:'auction'`) → redirect `/user/selling` (รอ webhook ปิด)
  - `truemoney` → input เบอร์ + `startOmiseRedirect({ sourceType:'truemoney', purpose:'auction' })` → redirect ออก Omise
  - `linepay` → `startOmiseRedirect({ sourceType:'rabbit_linepay', purpose:'auction' })` → redirect ออก Omise (Rabbit LINE Pay จริง — **เลิกใช้ mockup `createMockPayment` แล้ว**)
  - `wallet` → อ่าน `walletBalance` จาก `state.user.data?.wallet_balance` (Redux) → ถ้าไม่พอ ปุ่ม redirect ไป `/user/wallet`; ถ้าพอ → `POST /api/payment/wallet/charge` (RPC `charge_wallet` atomic) → dispatch `setWalletBalance(d.balance_after)` → redirect `/user/selling`
- **`createMockPayment()`** ใน `payment.service.js` — ยังอยู่แต่**ไม่ถูกเรียกแล้ว** (linepay เป็นของจริง); เก็บไว้เผื่อ method mock อื่น
- **Migration**: `supabase/migrations/20260524000000_add_linepay_payment_method.sql` (เพิ่ม `linepay`) + `20260623120000_add_omise_payment_methods.sql` (เพิ่ม `truemoney`)

## Bid Flow (`app/components/utils/CardProductBid.jsx`)

- รับ `product` และ `onBidSuccess` prop (callback หลัง bid สำเร็จ — ใช้ refresh bid list)
- `currentPrice` state sync กับ `product.start_price` ผ่าน useEffect (เพราะ product โหลด async)
- หลัง submit: `insertBid` → `updateProductPrice` → `setCurrentPrice` → `setHighestBidderId` → broadcast → `onBidSuccess?.()`
- `getBidsByProduct(productId)` ใน `bids.service.js` — ดึง bid history เรียงตาม `bid_time DESC`
- **Validation**: `bidPrice` ต้องมากกว่า `currentPrice` เท่านั้น (ไม่อนุญาตเท่ากัน) — `isBelowMin` ใช้ `<=`
- **🔒 KYC gate ก่อนประมูล**: `needKyc = login + ไม่ใช่ seller + userData.is_kyc !== 'approved'`
  - `needKyc` → ปุ่มเปลี่ยนเป็น "ยืนยันตัวตนก่อนประมูล" (`SafetyCertificateFilled`) → เปิด `UseModal` ที่ render `<KycVerificationForm>` แทนปุ่มประมูล (ส่ง `onSubmitSaveProduct={() => {}}` no-op) — เฉพาะสถานะ `unknown`/`rejected`
  - **`isKycPending = userData?.is_kyc === "pending"`** → ปุ่มเปลี่ยน label เป็น "รอตรวจสอบการยืนยันตัวตน" + `disabled` + ไม่มี `onClick` (ไม่เปิด modal ซ้ำ เพราะส่งไปรอ admin ตรวจอยู่แล้ว)
  - `onSubmit` มี guard ซ้ำ: ถ้า `is_kyc !== 'approved'` → เด้ง modal ไม่ insert bid
  - หลังส่ง KYC สถานะเป็น `pending` → ยังประมูลไม่ได้จนกว่า admin approve (`KycVerificationForm` dispatch `fetchUser` ให้ Redux อัปเดต)
- **🔒 Bid deposit gate (มัดจำ 20%)** — ต้องผ่าน KYC gate ก่อนถึงจะเจอ gate นี้ (ดู [Bid Deposit](#bid-deposit-เงินมัดจำก่อนประมูล) สำหรับรายละเอียดเต็ม): `needDeposit = login + ไม่ใช่ seller + ผ่าน KYC + ยังไม่มี `bid_deposits` row `status='held'` ของ product นี้` → แสดงปุ่ม "วางเงินมัดจำ 20% (฿X)" แทนปุ่ม bid จริง; wallet ไม่พอ → ปุ่ม redirect `/user/wallet` แทน
- **ห้าม bid ติดกัน 2 ครั้ง**: ผู้ที่เป็น highest bidder อยู่ตอนนี้กดประมูลซ้ำไม่ได้ ต้องรอ user คนอื่นมา bid ก่อน
  - state `highestBidderId` เก็บ user id ของผู้ bid สูงสุด — set จาก `getHighestBid()` ตอน mount + จาก broadcast payload `userId`
  - `isHighestBidder = userData.id === highestBidderId` → disable ปุ่ม + เปลี่ยน label เป็น "รอผู้อื่นเสนอราคา"
  - `getHighestBid()` ใน `bids.service.js` คืน `{ bid_price, user_id }` (เพิ่ม `user_id`)
  - broadcast `new_bid` payload: `{ price, userId }` — sync `highestBidderId` ทุก tab
- **Bid history UI** (`app/(public)/product/[id]/BidHistory.jsx`): component แยกออกจาก `ProductDetail.jsx` — รับ props `bids` + `currentUserId`
  - แสดง 5 รายการแรกใน sidebar; ถ้า `bids.length > 5` แสดงปุ่ม "ดูประวัติทั้งหมด N รายการ" → เปิด `UseModal` แสดงทั้งหมด (scrollable `max-h-[60vh]`)
  - sub-component `BidRow` ใช้ร่วมระหว่าง list หลักกับ modal (กัน duplicate markup)
  - highlight bid ของ user ปัจจุบัน — เทียบ `bid.user_id` กับ `currentUserId` → avatar สีน้ำเงิน "ME", ชื่อ `"คุณ"`, พื้นหลังแถวสีน้ำเงินอ่อน
  - `currentUserId` ดึงจาก Redux (`state.user.data?.id`) ใน `ProductDetail.jsx` แล้วส่งเป็น prop

## Bid Deposit (เงินมัดจำก่อนประมูล)

- **Migration**: `supabase/migrations/20260702000000_bid_deposits.sql` — ตาราง `bid_deposits` (`product_id`, `user_id`, `amount`, `status` ∈ `held`/`refunded`/`applied`, `UNIQUE(product_id, user_id)`, FK `ON DELETE RESTRICT`) + RLS SELECT เฉพาะของตัวเอง (`"own deposit read"`, mutation ผ่าน RPC เท่านั้น) + `auction_results` เพิ่ม `UNIQUE(product_id)` (ดู [Auction End Flow](#auction-end-flow)) + `CREATE OR REPLACE validate_bid` เพิ่มเช็ค deposit
- **Rule**: ผู้ประมูลที่ยังไม่เคยวางมัดจำสินค้านั้นต้องวางมัดจำ **20% ของราคาปัจจุบัน** (ตัดจาก **wallet เท่านั้น** — ไม่มีช่องทางอื่น) ก่อนจึงจะ bid ครั้งแรกได้; วางแล้วใช้ซ้ำได้กับทุก bid ถัดไปของสินค้าเดียวกัน (ไม่ต้องวางซ้ำทุกครั้ง)
- **RPC `place_bid_deposit(p_user_id, p_product_id)`** (SECURITY DEFINER, grant `service_role` เท่านั้น) — lock product `FOR UPDATE` แล้วตรวจ `state='active'` + ยังไม่หมดเวลา + ไม่ใช่ seller + **`profiles.is_kyc='approved'`** + ยังไม่เคยวางมัดจำ (unique constraint กันซ้ำ); ราคาปัจจุบัน = `COALESCE(MAX(bids.bid_price), start_price)` (สูตรเดียวกับ `validate_bid`); `amount = GREATEST(1, ROUND(current_price * 0.20))`; ตัด `profiles.wallet_balance` → insert `bid_deposits(status='held')` + `wallet_transactions(type='payment', note='bid deposit')` → คืน `{ deposit_id, amount, balance_after }`
- **RPC `refund_bid_deposit(p_deposit_id)`** — idempotent (คืนเงินเฉพาะ row ที่ยัง `status='held'` ภายใต้ `FOR UPDATE`; เรียกซ้ำคืน `{ already_processed: true, status }` เฉยๆ) → credit `wallet_balance` + insert `wallet_transactions(type='refund')` + update `status='refunded'`
- **`validate_bid` trigger** เพิ่มเช็ค: ต้องมี `bid_deposits` row `status='held'` ของ `(product_id, user_id)` นั้น ไม่งั้น `RAISE 'deposit_required'` (defense-in-depth คู่กับ UX gate ใน `CardProductBid`)
- **API**: `POST /api/bid/deposit` (`app/api/bid/deposit/route.js`) body `{ productId }` — `requireUser()` + `rateLimit(5/min)` (เท่า `wallet/charge` เพราะตัดเงินทันที) → เรียก `place_bid_deposit` RPC → broadcast `wallet-{userId}` (payload ว่าง, client re-fetch balance เอง) → คืนผลจาก RPC ตรงๆ
- **Service**: `app/services/deposits.service.js` — `getMyBidDeposit(productId)` (browser client, อ่าน `bid_deposits` ของตัวเอง ผ่าน RLS), `placeBidDeposit(productId)` (fetch wrapper เรียก API ข้างบน)
- **UI gate** (`CardProductBid`, ดู [Bid Flow](#bid-flow-appcomponentsutilscardproductbidjsx)): เรียงเป็น login → KYC → **deposit** → ปุ่ม bid จริง; ยอด wallet ไม่พอ → ปุ่มเปลี่ยนเป็น "เติมเงินเพื่อวางมัดจำ" push `/user/wallet`; วางสำเร็จ → ข้อความเขียว "วางเงินมัดจำแล้ว ฿X" เหนือปุ่ม bid; `onSubmit` guard ซ้ำถ้า `deposit?.status !== 'held'`
- **ตอนแพ้/ชนะประมูล** — ผูกกับ `/api/auction/end` (ดู [Auction End Flow](#auction-end-flow)): ผู้ชนะ mark `status='applied'`, ที่เหลือ (แพ้ + วางมัดจำไว้แต่ไม่เคย bid จริง) refund อัตโนมัติเข้า wallet
- **หักออกจากยอดชำระ** — `getAppliedDepositAmount(userId, productId)` ใน `app/lib/payment/resolveAmount.js` คืนยอด `status='applied'` (0 ถ้าไม่มี) แล้วลบออกจาก `amount = Math.max(1, round(final_price*1.05) - deposit)`; ใช้ผ่าน resolver ใน `credit-card`/`omise` route และ inline (ตาม convention เดิม) ใน `promptpay`/`wallet/charge` route; ฝั่ง UI แสดงบรรทัด "หักเงินมัดจำที่วางไว้ −฿X" ทั้งใน checkout และ payment page
- **⚠️ มัดจำ fix ที่ 20% ของราคา ณ ตอนวาง** — ไม่ขยับตามราคาที่ถูกบิดขึ้นภายหลัง (ยังไม่บังคับ top-up เพิ่ม — เป็น decision ที่เปิดไว้)
- **⚠️ ยอด deposit ที่ client แสดงเป็นแค่ display** — คำนวณจริงเสมอฝั่ง DB ใน `place_bid_deposit` RPC (client ไม่ส่ง amount ไปได้)
- **ถ้าผู้ชนะไม่จ่ายตามกำหนด** → มัดจำถูกริบ (`status='forfeited'`) ดู [Payment Deadline & Forfeit](#payment-deadline--forfeit-ผู้ชนะไม่จ่ายตามกำหนด)

## Payment Deadline & Forfeit (ผู้ชนะไม่จ่ายตามกำหนด)

- **Migration**: `supabase/migrations/20260702100000_payment_deadline.sql` — `auction_results.payment_due_at timestamptz` + `bid_deposits` เพิ่มสถานะ `'forfeited'` + `forfeited_at` + RPC `expire_unpaid_auction` + **`CREATE OR REPLACE charge_wallet`** (เพิ่ม lock+guard)
- **Rule**: ผู้ชนะมีเวลา **3 วัน** หลังปิดประมูล (set `payment_due_at = now + 3 วัน` ตอน insert `auction_results` ใน `/api/auction/end`) เพื่อชำระค่าประมูล; เกินกำหนดยังไม่จ่าย → ยกเลิก
- **RPC `expire_unpaid_auction(p_auction_result_id)`** (SECURITY DEFINER, service_role เท่านั้น) — lock `auction_results` `FOR UPDATE`; idempotent (`payment_status<>'pending'` → `{already_processed}`); ยังไม่ครบกำหนด → `{not_due:true}`; มิฉะนั้น: `payment_status='canceled'` + ริบมัดจำผู้ชนะ (`applied`/`held`→`forfeited`) + product `sold→cancelled` → คืน `{expired, winner_id, seller_id, product_id, deposit_amount}`
- **API**: `POST /api/auction/expire-unpaid` (`app/api/auction/expire-unpaid/route.js`) — `rateLimit(30/min)`, **ไม่มี requireUser** (guard อยู่ใน RPC ทั้งหมด เหมือน `/api/auction/end` — client ส่ง id ปลอมไม่มีผลเพราะ RPC เช็ค due_at+status); `expired=true` → insert notifications ให้ winner + seller
- **Reconcile**: `expireUnpaidWonAuctions()` ใน `products.service.js` — หา pending + overdue ทั้งฝั่ง `winner_id` และ `products.seller_id` แล้ว POST expire; เรียกตอน mount `/user/selling` คู่กับ `endExpiredActiveAuctions()` (**ไม่มี server cron** — ค้างได้ถ้าไม่มีใครเปิดหน้า)
- **UI**: `CardSellingProduct` countdown `paymentDueAt` (ใต้ tag ผู้ขาย / ใต้ปุ่มผู้ซื้อ); checkout banner + ล็อกปุ่มเมื่อ `payExpired`
- **Enforce ฝั่ง server 4 จุด** (กันจ่ายหลังเลยกำหนด/ยกเลิก): `resolveAmount.js` (auction), `promptpay` route, `wallet/charge` route (เช็ค `canceled` + `payment_due_at < now`) + **`charge_wallet` RPC** (ชั้นลึกสุด, lock row)
- **⚠️ TOCTOU race ที่ปิดไปแล้ว**:
  1. `charge_wallet` เพิ่ม `SELECT ... FOR UPDATE auction_results` + เช็คสถานะ (serialize กับ `expire_unpaid_auction` ที่ lock row เดียวกัน) — กันผู้ชนะโดนตัดค่าประมูล "และ" ริบมัดจำพร้อมกัน
  2. webhook flip `pending→paid` เท่านั้น (`.eq("payment_status","pending")`) — กัน charge async ที่สำเร็จหลัง cancel ปลุก auction กลับมา paid; 0 row → log (ต้อง refund มือ)
- **⚠️ มัดจำที่ริบ platform เก็บไว้** — ยังไม่ credit ให้ผู้ขาย (จะทำตอน seller payout)

## Realtime Bid (Supabase Broadcast)

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

## Admin Menu & Pages

- **Menu config**: `app/admin/components/AdminLayout.jsx` (array `menus`) — แต่ละรายการ `{ url, label, icon }`; highlight active ผ่าน `pathname.split("/")[2]` เทียบกับ `menu.url.split("/")[2]`
- **Menu badge counts**: `app/services/admin/badges.service.js` — `getAdminBadgeCounts()` คืน object keyed by route → count งานค้างที่ admin ต้องตรวจสอบ (ปัจจุบัน: `pending_review` products บน `/admin/products`, `is_kyc='pending'` profiles บน `/admin/users`); AdminLayout fetch ใน `useEffect([pathname])` แล้ว render badge เมื่อ `badgeCounts[menu.url] > 0`. **เพิ่ม badge ใหม่ = เพิ่ม entry ใน `BADGE_SOURCES`** (`{ key: ROUTES.X, count }`) ไม่ต้องแตะ layout
- **Notification bell (header)**: `BellOutlined` บน header เปิด `AdminNotificationDrawer` (`app/admin/components/AdminNotificationDrawer.jsx`) ที่ fetch `getAllNotifications({ limit: 50 })` (system-wide feed) แล้ว render เป็น children ของ `UseDrawer` (`UseDrawer` รับ prop `children` + `title` เพื่อ override เนื้อหา; ไม่ส่ง children → ใช้ `CardDrawer` ฝั่ง user เหมือนเดิม). เป็น feed รวมทุก user — ต่างจาก badge counts ที่เป็นงานค้าง; ไม่มี mark-as-read/unread badge
- **Routes**: `app/admin/constants/routes.js` — เพิ่ม route ใหม่ที่นี่ก่อนใช้ใน menu/page
- **Pages ที่มีอยู่**:
  - `/admin` — แดชบอร์ด (stats + recent products + recent bids)
  - `/admin/products` — จัดการสินค้าประมูล (CRUD)
  - `/admin/bids` — ตรวจสอบการประมูล (group by product)
  - `/admin/auction-results` — สินค้าที่ประมูลจบ (ผู้ขาย, ผู้ชนะ, ราคาปิด, payment status)
  - `/admin/shipments` — รายการจัดส่ง (บริษัทขนส่ง, tracking, status)
  - `/admin/payments` — รายการชำระเงิน (transaction_ref, method, status — รองรับ promptpay/linepay/wallet/credit_card/bank)
  - `/admin/wallet` — กระเป๋าเงิน (ยอดรวมในระบบ + balance รายผู้ใช้ + ตาราง wallet_transactions)
  - `/admin/users` — จัดการผู้ใช้ (CRUD) + ตรวจสอบ KYC ผ่าน `KycReviewModal` (ปุ่ม `SafetyCertificateFilled` สีส้มใน `BtnActionGroup`)
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
- **🔒 ปุ่มอนุมัติ gate ด้วยค่าธรรมเนียม** ([Form.jsx](../app/admin/products/components/Form.jsx)) — `isFeePaid = feePayment?.payment_status === 'success'`; ถ้ายังไม่ชำระ → ปุ่มอนุมัติ `disabled` + tooltip "ผู้ขายยังไม่ชำระค่าธรรมเนียม" (UI gate ฝั่ง admin เท่านั้น — ยังไม่มี server-side check ใน `upsertProduct`)
- **🔒 KYC gate ใน `upsertProduct`** ([app/services/admin/products.service.js](../app/services/admin/products.service.js)) — ถ้า `data.state` ∈ `['pending_review', 'active']` → fetch `profiles.is_kyc` ของ seller; ถ้าไม่ใช่ `'approved'` → return `{ error: 'seller_kyc_not_approved' }` (มี Thai translation ใน [supabaseErrorMap.js](../app/utils/supabaseErrorMap.js)) — **reject ไม่ติด gate** (admin reject ได้แม้ KYC ยังไม่ผ่าน)
- **ค่าธรรมเนียมลงขาย (read-only)** — Form โหลด `getListingFeePayment(productId)` ([admin/products.service.js](../app/services/admin/products.service.js) — `requireAdmin` + `supabaseAdmin` bypass RLS เพราะ payment เป็นของ seller) แล้วโชว์การ์ด: จำนวนเงิน, ช่องทาง, สถานะ (เขียว/ส้ม/แดง), วันที่ชำระ, `transaction_ref`; ไม่มี payment → "ยังไม่มีการชำระค่าธรรมเนียม"

## Selling Page (`/user/selling`)

- **Auto-reconcile สถานะค้าง**: on mount เรียก `endExpiredActiveAuctions()` ปิดประมูลที่หมดเวลาแต่ค้างที่ `active` (ดู [Auction End Flow](#auction-end-flow)); ถ้ามีการเปลี่ยนสถานะ bump `refreshKey` → effect fetch products + counts re-run (ทั้ง 2 effect depend on `refreshKey`)
- `getProductsByState(state)` join `auction_results(id, payment_status, winner_id)` + `bids(id, bid_price, user_id)` (user_id ใช้คำนวณจำนวนผู้ประมูล distinct)
- Tab พิเศษ:
  - `won` (สินค้าที่ฉันชนะ) → `getWonProductsByUser()` query `auction_results` ด้วย `winner_id` + **`products!inner` filter `state='sold'`** (เฉพาะที่ผู้ขายยังไม่จัดส่ง — จัดส่งแล้วย้ายไป tab `order`)
  - `order` (การจัดส่ง) merge สินค้าตัวเองที่จัดส่งแล้ว (`getProductsByState("order")`) + สินค้าที่ user ชนะและผู้ขายจัดส่งแล้ว (`getOrderProductsWonByUser()` query `winner_id` + `state='order'`) — tag `_isBuyerOrder: true` ฝั่งผู้ซื้อ, dedupe ด้วย product id; **count `order` บวกทั้ง 2 ฝั่ง** (เหมือน `active`/`cancelled`)
  - `active` merge สินค้าที่เป็นเจ้าของ + สินค้าที่ user เคย bid (ไม่ใช่เจ้าของ) ผ่าน `getActiveProductsBidByUser()` — tag `_isBidder: true` สำหรับ bid product → การ์ดแสดงป้าย "คุณได้ร่วมประมูล" สีน้ำเงิน
  - `cancelled` merge สินค้าที่ยกเลิกของเจ้าของ + สินค้าที่ user bid แต่ไม่ชนะ ผ่าน `getLostBidProductsByUser()` — tag `_isLost: true` → การ์ดแสดงป้าย "ประมูลไม่ชนะ" สีแดง
- **render shape**: `isBuyerShape = isWonTab || item._isBuyerOrder` → ใช้ `item.products` เป็น product, `item` เป็น auction_result (เหมือนกันทั้ง won tab และ buyer order item)
- **`getLostBidProductsByUser`** คำนวณ lost = `bid product ids` − `won product ids` (2 query แยก) แล้ว query products `state='sold'` `seller_id != user.id` — ไม่ join `auction_results` เพราะ RLS บล็อก
- **`CardSellingProduct`** (`"use client"`) รับ props:
  - `isBuyer`, `paymentStatus`:
    - seller + `sold` + payment `pending` → ข้อความ "รอชำระเงิน"
    - seller + `sold` + payment `paid` → ลิงก์ "ระบุข้อมูลการจัดส่ง" → `/user/checkout/[productId]`
    - buyer (`isBuyer=true`) + payment `pending` → ปุ่ม "ตรวจสอบ" → `/user/checkout/[productId]`
    - buyer + payment `paid` → ข้อความ "รอจัดส่งสินค้า" (เฉพาะ `state='sold'`; gate ด้วย `!isShipping`)
    - **`isShipping = stateName === "การจัดส่ง"`** (state `order` — ทั้งผู้ขาย/ผู้ซื้อ) → ปุ่ม "ตรวจสอบสถานะการจัดส่ง" → `/user/order?product={id}`
  - `isBidder` → ป้าย "คุณได้ร่วมประมูล"
  - `isLost` → stateName "ประมูลไม่ชนะ" + popover "ดูสินค้า"
  - `bidders_count` → จำนวนผู้ประมูลแบบ distinct (`new Set(bids.map(b => b.user_id))`)
  - `auction_end_time` → countdown แบบ realtime (`setInterval` 1s) — `> 1 วัน`: `X วัน HH ชม.`; มิฉะนั้น `HH:MM:SS`; หมดเวลา: `หมดเวลา`

## Shipment Flow

- **Trigger**: seller กดลิงก์ "ระบุข้อมูลการจัดส่ง" → `/user/checkout/[productId]`
- **Checkout page** ตรวจ role: ถ้า `product.seller_id === currentUser.id` **และ** `payment_status = 'paid'` (`sellerShipMode`) → แสดง checkout ปกติ (ที่อยู่ผู้ซื้อ read-only + section จัดส่ง/ชำระเงิน disabled) ปุ่มเป็น "ระบุเลขใบเสร็จการจัดส่ง" → กดแล้ว `setShowShipmentForm(true)` ค่อยแสดง shipment form (ดู [Checkout Flow](#checkout-flow))
- **Form fields**: shipping_company, tracking_number
- **Service**: `app/services/shipment.service.js` — `createShipment({ auctionResultId, shippingCompany, trackingNumber })`
- **หลัง submit**: INSERT `shipments` → UPDATE `products.state = 'order'` → redirect `/user/selling`
- **`shipments.address_id`** เป็น nullable (migration แก้แล้ว)
- **Order tracking page** (`/user/order?product={productId}`): เปิดจากปุ่ม "ตรวจสอบสถานะการจัดส่ง" ใน `CardSellingProduct` (tab การจัดส่ง ทั้งผู้ซื้อ/ผู้ขาย)
  - `getAuctionResultByProduct(productId)` + `getShipmentByAuctionResult(result.id)` → ดึง ชื่อ/รูป/ราคาปิด/บริษัทขนส่ง/tracking/`shipping_status` จริง
  - `UseSteps` 4 ขั้น (เตรียมจัดส่ง → ขนส่งรับพัสดุ → กำลังนำจ่าย → จัดส่งสำเร็จ); `current` map จาก `shipping_status`: `preparing`=0, `shipped`=2, `delivered`=3
  - **timeline (เวลา/สถานที่แต่ละขั้น) เป็น mock คงที่** — `shipments` ไม่มี per-step event; ไม่มี `?product=` หรือดึงไม่ได้ → fallback `MOCK` ทั้งก้อน
  - `useSearchParams` ต้องอยู่ใน `<Suspense>` (แยก `OrderContent`) กัน build error prerender
- **ผู้ซื้อยืนยันรับสินค้า + วิดีโอแกะกล่อง** (migration `20260625000000_shipment_receipt.sql` เพิ่ม `shipments.received_at` + `unboxing_video_url`):
  - order page fetch user (`supabase.auth.getUser()`) + `getAuctionResultByProduct` (เพิ่ม `winner_id` ใน select) → `isBuyer = currentUserId === winner_id`; ปุ่ม "ยืนยันรับสินค้า" + อัปโหลดวิดีโอ (optional) แสดงเฉพาะ `isBuyer && shipping_status !== 'delivered'`
  - วิดีโอ upload เข้า bucket `attachments` (`uploadAttachments`+`getUrlAttachments`) → เรียก `confirmReceipt({ auctionResultId, videoUrl })` ใน [order.service.js](../app/services/order.service.js) (`"use server"`): `requireUser()` + verify `auction_results.winner_id === user.id` + `supabaseAdmin` update `shipping_status='delivered'`/`received_at`/`unboxing_video_url` + notify seller (`type='shipping'`)
  - **product.state คงเป็น `order`** — "จัดส่งสำเร็จ" ขับด้วย `shipping_status='delivered'` ล้วน (ไม่เพิ่ม product state ใหม่); 48 ชม. เป็นคำแนะนำ ไม่ได้ enforce; ไม่มีอะไรขยับ `preparing`→`shipped` (ปุ่มผู้ซื้อกระโดดเป็น `delivered` ตรง)

## Payment (Omise)

- **Keys**: `OMISE_SECRET_KEY` (server-only), `NEXT_PUBLIC_OMISE_PUBLIC_KEY` (client — ใช้ tokenize บัตรฝั่ง browser)
- **DO NOT use `omise` npm package** — ESM interop broken in Next.js App Router. Use `fetch` ผ่าน helper `omiseFetch`/`omiseGet` ใน `app/lib/payment/omise.js` (shared; `promptpay`/`webhook` route ยังมี copy inline เดิม)
- **Shared amount resolver**: `app/lib/payment/resolveAmount.js` — `resolvePaymentAmount({ user, purpose, auctionResultId?, productId?, clientAmount? })` คืน `{ amount, auctionResultId, productId }` หรือ throw `PaymentError(code, status)`; รวม verify ownership/KYC/already-paid + clamp topup. ใช้ใน `credit-card` + `omise` route (promptpay ยัง inline)
- **PromptPay flow**: POST `/api/payment/promptpay` body `{ auctionResultId?, productId?, amount?, purpose? }` (default `auction`) → server ดึง `final_price` จาก DB + verify winner (auction); topup ใช้ amount จาก body (range 20–100,000); `listing_fee` ดึง `start_price` จาก `products` ของ seller (verify ownership) + คำนวณ 5% ฝั่ง server + เช็คซ้ำว่ายังไม่มี success payment ของ product+purpose (`already_paid` 409); สร้าง source + charge + insert `payments` (`product_id` ถ้า listing_fee) → คืน `qrCodeUrl`
- **Webhook**: POST `/api/payment/webhook` — รับ `charge.complete` → **re-fetch charge จาก Omise** (ไม่ trust body) → update `payments.payment_status='success'` ถ้า amount ตรง → branch ตาม `payment.purpose`:
  - `topup` → `rpc('credit_wallet', { p_payment_id })` + broadcast `wallet-{userId}` event `update` (payload ว่าง)
  - `auction` (default) → UPDATE `auction_results.payment_status = 'paid'`
  - `listing_fee` → ไม่มี side-effect เพิ่มเติม (frontend poll/refresh เอง)
  - Optional auth: ถ้ามี `OMISE_WEBHOOK_USER`/`OMISE_WEBHOOK_PASSWORD` ใน env → ตรวจ Basic Auth header
- **⚠️ payments row ต้องสร้างก่อน QR แสดง** — webhook หา record ด้วย `transaction_ref` (charge.id); ถ้าไม่มี row จะ update ไม่ได้
- **Component**: `app/components/payment/PromptPayQR.jsx` — รับ props `{ amount, purpose, productId?, auctionResultId?, label? }` (ไม่มี LISTING_FEE constant แล้ว — ใช้ 5% calc แทน)
- **Payment page**: `/user/payment/[auctionResultId]` — อ่าน `method` จาก query → render UI ต่อ method (`promptpay` QR / `wallet` ตัดทันที / `credit_card` `OmiseCardForm` / `truemoney`+`linepay` redirect)
- **Listing fee payment** (add-product step 3): ค่าธรรมเนียม = **5% ของ `start_price`** (calc ทั้ง server & client ตรงกัน); รองรับ 5 ช่องทาง: PromptPay, Wallet, บัตร, TrueMoney, Rabbit LINE Pay; ถ้ามี success payment แล้ว → backend RAISE `already_paid` / 409, frontend ซ่อนปุ่มแล้วโชว์ "ชำระเรียบร้อยแล้ว"
- **Local dev webhook**: ต้องใช้ ngrok — `ngrok http 3000` แล้วตั้ง endpoint ใน Omise Dashboard

### Omise payment methods — Card / TrueMoney / Rabbit LINE Pay

- **Migration**: `20260623120000_add_omise_payment_methods.sql` — เพิ่ม `truemoney` ใน `payments_payment_method_check` (Rabbit LINE Pay เก็บเป็น `linepay` เดิม ไม่เพิ่มค่าใหม่)
- **ครอบ 3 purpose** (`listing_fee`/`auction`/`topup`) ทุก method ผ่าน entry: ListingFeePayment (ลงขาย), checkout picker → payment page `[id]` (ประมูล), wallet TopupModal (เติมเงิน)
- **บัตรเครดิต/เดบิต** (`payment_method='credit_card'`): tokenize ฝั่ง client (`OmiseCardForm` → Omise.js `createToken`) → POST `/api/payment/credit-card` `{ omiseToken, purpose, auctionResultId?, productId? }` → charge ตรง → insert `payments(pending)` → **webhook ปิดเป็น success** (ไม่ instant). ต้องตั้ง CSP `connect-src https://*.omise.co` (vault) — มิฉะนั้น `createToken` โดนบล็อก
- **TrueMoney + Rabbit LINE Pay** (redirect): POST `/api/payment/omise` `{ sourceType: 'truemoney'|'rabbit_linepay', purpose, …, phoneNumber? }` → สร้าง source + charge พร้อม `return_uri` → คืน `authorizeUri` → client `window.location.href` ไป Omise → จ่ายเสร็จ Omise redirect กลับ `/user/payment/return` → หน้านั้น redirect ตาม `purpose` (topup→wallet, listing_fee→add-product edit, auction→selling). **TrueMoney บังคับ `phone_number`** (validate `/^0\d{9}$/` client+server)
- **webhook generic** — ทุก method ปิดงานที่ `charge.complete` ผ่าน branch `purpose` เดิม (ไม่ต้องแก้). mockup `/api/payment/linepay` + `/confirm` ยังอยู่แต่เลิกเรียกแล้ว (LINE Pay = `rabbit_linepay` จริงทุก flow)
- **⚠️ ต้องเปิดใช้ TrueMoney Wallet + Rabbit LINE Pay ใน Omise Dashboard** ก่อน source creation ถึงจะไม่ error

## Wallet System

- **Migrations** (`supabase/migrations/`):
  - `20260524130000_add_wallet_to_profiles.sql` — `profiles.wallet_balance numeric(12,2) DEFAULT 0` + CHECK `>= 0`
  - `20260524130100_create_wallet_transactions.sql` — table + RLS (`SELECT WHERE auth.uid() = user_id`; **no INSERT policy** — service_role/RPC only)
  - `20260524130200_payments_allow_topup.sql` — `auction_result_id` nullable + `purpose` column
  - `20260524130300_wallet_rpcs.sql` — `credit_wallet` + `charge_wallet` (SECURITY DEFINER, granted to service_role)
  - `20260526000003_charge_wallet_listing.sql` — เพิ่ม `payments.product_id` (nullable FK) + RPC `charge_wallet_listing` สำหรับชำระค่าธรรมเนียม listing
  - `20260702000000_bid_deposits.sql` — ตาราง `bid_deposits` + RPC `place_bid_deposit`/`refund_bid_deposit` สำหรับเงินมัดจำก่อนประมูล (ดู [Bid Deposit](#bid-deposit-เงินมัดจำก่อนประมูล))
- **RPCs** (เรียกผ่าน `supabaseAdmin.rpc()` จาก API route เท่านั้น):
  - `credit_wallet(p_payment_id)` — ใช้ตอน topup สำเร็จ; idempotent ผ่าน `EXISTS wallet_transactions WHERE reference_id = payment_id AND type='topup'` กัน double-credit เมื่อ webhook ส่งซ้ำ
  - `charge_wallet(p_user_id, p_amount, p_auction_result_id)` — atomic deduction; **lock `auction_results` `FOR UPDATE` + เช็ค `paid`/`canceled`/`payment_due_at`** (migration `20260702100000` — serialize กับ `expire_unpaid_auction`) → `SELECT FOR UPDATE` profiles + ราคา < balance + insert `payments(wallet, success)` + insert `wallet_transactions(payment, -amount)` + update `auction_results.payment_status='paid'`
  - `charge_wallet_listing(p_user_id, p_amount, p_product_id)` — atomic ตัด wallet ชำระค่า listing fee; idempotent ผ่าน `EXISTS payments WHERE product_id AND purpose='listing_fee' AND payment_status='success'` (RAISE `already_paid` ถ้าจ่ายแล้ว) + insert `payments(wallet, success, listing_fee, product_id)` + insert `wallet_transactions`
  - `place_bid_deposit(p_user_id, p_product_id)` — atomic ตัด wallet วางมัดจำ 20% ของราคาปัจจุบัน ก่อนประมูลครั้งแรก; `charge_wallet_listing` และตัวนี้ต่างกันที่ผูกกับ `bid_deposits` แทน `payments` (คนละ audit trail)
  - `refund_bid_deposit(p_deposit_id)` — idempotent คืนมัดจำเข้า wallet (เฉพาะ `status='held'`); เรียกจาก `/api/auction/end` ตอนปิดประมูล (ดู [Bid Deposit](#bid-deposit-เงินมัดจำก่อนประมูล))
- **Service**: `app/services/wallet.service.js` — `getMyWalletBalance()`, `getMyTransactions({limit})`, `subscribeWallet(userId, onUpdate)` (broadcast channel `wallet-{userId}`)
- **API routes**:
  - `POST /api/payment/wallet/charge` — เรียก `charge_wallet` RPC + broadcast `wallet-{userId}` update
  - `POST /api/payment/wallet/listing-fee` — body `{ productId }`; server verify seller_id ตรงกับ session + calc 5% ของ `start_price` → เรียก `charge_wallet_listing` RPC + broadcast `wallet-{userId}` update
  - `POST /api/payment/promptpay` (extended) — รับ `purpose: 'topup' | 'listing_fee'` แล้ว insert payments แม้ไม่มี `auctionResultId`
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

## Seller Payout & Wallet Withdrawal

- **Seller payout** (migration `20260703000000_seller_payout.sql`) — ผู้ซื้อชำระค่าประมูลสำเร็จ → ผู้ขายได้ `final_price` เข้า wallet อัตโนมัติ (platform เก็บค่าธรรมเนียม 5% + shipping fee + listing fee)
  - RPC `credit_seller_proceeds(p_auction_result_id)` (service_role) — lock auction_results, ต้อง `payment_status='paid'`, idempotent ผ่าน `wallet_transactions(reference_id=auction_result_id, type='sale')`, credit `final_price` + insert `wallet_transactions(type='sale')`
  - helper `settleSellerProceeds()` ใน `app/lib/payment/sellerPayout.js` — เรียก RPC + broadcast `wallet-{seller}` + notify; เรียกจาก **wallet/charge route** (หลัง charge) และ **webhook** (หลัง flip paid)
  - **forfeit** → `expire_unpaid_auction` credit มัดจำที่ริบให้ผู้ขาย (`type='sale'`, "forfeited deposit compensation")
  - `wallet_transactions.type` เพิ่ม `'sale'`/`'withdrawal'` (label/สีใน user + admin wallet page)
  - **⚠️ ผู้ขายได้ `final_price` เท่านั้น** — shipping_fee + 5% platform เก็บ (open decision: ยังไม่ reimburse ค่าส่งให้ผู้ขาย)
- **Wallet withdrawal** (migration `20260703010000_wallet_withdrawal.sql`) — ถอนเงินเข้าบัญชีธนาคาร (จาก KYC)
  - ตาราง `withdrawal_requests` (`status`: `pending`/`paid`/`rejected`, snapshot `bank_*`), RLS own-read, mutation ผ่าน RPC
  - RPC `request_withdrawal(p_user_id, p_amount)` — guard `amount>=100` + KYC approved + มีบัญชี + `balance>=amount`; **ตัด wallet ทันที** (ล็อกเงิน) + `wallet_transactions(type='withdrawal')`
  - RPC `process_withdrawal(p_withdrawal_id, p_action, p_note)` (admin) idempotent — `paid` mark จ่าย, `rejected` คืนเงิน (`type='refund'`)
  - `POST /api/wallet/withdraw` (requireUser + rateLimit 5/min); admin `processWithdrawal()` (requireAdmin) + notify
  - หน้า `/admin/withdrawals` (badge = pending count); user wallet page มีปุ่ม + `WithdrawModal` + รายการคำขอ
  - **⚠️ ไม่มี real bank transfer** — admin โอนมือแล้ว mark `paid`

## Server Reconcile Cron

- **`app/lib/auction/reconcile.js`** — `endAuction(productId)`, `expireUnpaidAuction(auctionResultId)`, `reconcileAll()` (shared logic; `/api/auction/end` + `/api/auction/expire-unpaid` เรียกใช้แทน logic เดิม inline)
- **`GET|POST /api/cron/reconcile`** — reconcile ทั้งระบบ (ปิดประมูลหมดเวลา + ยกเลิกผลที่ผู้ชนะไม่จ่าย); auth ด้วย env `CRON_SECRET` (`Authorization: Bearer` หรือ `?key=`); ไม่ตั้ง → 501
- ตั้ง external scheduler (Vercel Cron/cron-job.org) เรียกทุก ~10 นาที (ดู [commands.md](commands.md#auction-reconcile-cron)); client reconcile บน `/user/selling` mount ยังทำงานเป็น safety net คู่กัน

## Inactivity Logout

- **Hook**: `app/hooks/useInactivityLogout.js` — track กิจกรรม (`mousemove`, `keydown`, `click`, `touchstart`, `scroll`) บันทึกลง `localStorage` key `lastActivity`
- ตรวจทุก 60 วินาที — ถ้าไม่มี activity > 2ชม. → `logout()` + `clearUser` + redirect `/login`
- ลบ `lastActivity` เมื่อ: timeout ครบ หรือ `SIGNED_OUT` event จาก Supabase (ครอบคลุม logout ปกติ + session หมดอายุ)
- **Mount point**: `<InactivityGuard />` ใน `app/providers/Providers.jsx` (ภายใน Redux Provider เพื่อเข้าถึง `dispatch`)

## Notification Bell (AppHeader)

- **Service**: `app/services/notifications.service.js` — `getMyNotifications`, `getUnreadCount`, `markAllNotificationsRead`
- **Badge count**: unread notifications + จำนวน rejected products (ดึงจาก `getSellerProducts`)
- **Drawer**: `UseDrawer` → `CardDrawer` — เปิดครั้งแรก fetch + mark all read + reset badge
- **Persistent alerts** (ไม่ mark as read): products ที่ state = `rejected` — ดึงจาก `products` table โดยตรง หายเองเมื่อ user แก้ไขแล้ว state เปลี่ยน; กดปุ่ม "แก้ไขสินค้า" → `/user/add-product/[id]/edit`
- `profiles` ไม่มี column `email` — email อยู่ใน `auth.users`; ใช้ view `users_full` เพื่อ query รวม

## KYC Verification

- **Migrations** (`supabase/migrations/`):
  - `20260526000000_add_kyc_to_profiles.sql` — `profiles.is_kyc text NOT NULL DEFAULT 'unknown'` + CHECK `IN ('unknown','pending','approved','rejected')` + `profiles.kyc_remark text`
  - `20260526000001_kyc_rls_and_view.sql` — แก้ `"update own profile"` policy เพิ่ม `is_kyc` + `kyc_remark` ใน `WITH CHECK` (lock เหมือน role/status) + recreate `users_full` view เพิ่ม `id_card_image`, `is_kyc`, `kyc_remark` (REVOKE จาก anon/authenticated เหมือนเดิม)
  - `20260526000002_submit_kyc_rpc.sql` — RPC `submit_kyc(p_user_id)` (SECURITY DEFINER, grant authenticated) — transition `unknown`/`rejected` → `pending` + state ปัจจุบันต้อง ∈ `('unknown','rejected')`; guard เดิมเช็ค `profile_image` + `id_card_image`
  - `20260526000004_notification_type_kyc.sql` — เพิ่ม `'kyc'` ใน `notifications_type_check`
  - `20260615000000_kyc_full_fields.sql` — **KYC form เต็ม**: เพิ่ม `profiles.national_id` (CHECK 13 หลัก), `address`, `selfie_image` (path ใน bucket `id-cards`), `bank_name`, `bank_account_no`, `bank_account_name`, `pdpa_consent_at`; ขยาย `validate_profile_paths` trigger ให้ตรวจ `selfie_image` = `<uid>/...`; **`CREATE OR REPLACE submit_kyc`** — guard ใหม่บังคับ `id_card_image` + `selfie_image` + `national_id` + `first_name` + `address` + `phone` + `bank_*` + `pdpa_consent_at` ครบ (เลิกบังคับ `profile_image`); recreate `users_full` view เพิ่มฟิลด์ KYC ใหม่ทั้งหมด
- **State transitions**:
  - `unknown` → user กรอกฟอร์ม KYC ครบ (ข้อมูลส่วนตัว + บัตร + เซลฟี่ + บัญชีธนาคาร + PDPA) → submit_kyc RPC → `pending`
  - `pending` → admin approve → `approved` / admin reject + remark → `rejected`
  - `rejected` → user แก้ไข/re-upload → submit_kyc RPC → `pending` (วน loop ได้)
  - `approved` → terminal (เว้นแต่ admin จะ manual change ผ่าน supabaseAdmin)
- **User UI** — KYC ใช้ `app/(authenticated)/user/components/KycVerificationForm.jsx` (แยกออกจาก `UserProfilesForm` ที่ใช้แก้โปรไฟล์ทั่วไป); ทุกจุดที่เคยใช้ `<UserProfilesForm kycMode>` เปลี่ยนมาใช้ `<KycVerificationForm>` แล้ว
  - แสดงแท็กสถานะด้านบน (`KYC_TAG`) + กล่องแดง `kyc_remark` เมื่อ `rejected`
  - ฟอร์ม 5 ส่วนตามดีไซน์: ① ข้อมูลส่วนบุคคล (ชื่อ-นามสกุล/เลขบัตร 13 หลัก/วันเกิด/เพศ) ② การติดต่อ (โทร/อีเมล disabled/ที่อยู่) ③ อัปโหลด (ภาพหน้าบัตร = `id_card_image`, เซลฟี่คู่บัตร = `selfie_image` — ทั้งคู่เข้า bucket `id-cards`) ④ บัญชีธนาคาร (`bankList` ใน [dataSelect.js](../app/utils/dataSelect.js)) ⑤ PDPA 2 checkbox (`oneOf([true])`)
  - ใช้ `kycFullSchema` (yup) ใน [schema.js](../app/(authenticated)/user/components/schema.js); `full_name` แตกเป็น `first_name`/`last_name` ตอน save (split ช่องว่างแรก) และ join กลับตอน reset; `birth_date` เก็บเป็น `YYYY-MM-DD`
  - props: `setIsOpenModalProfile`, `onKycSubmitted`, `onSubmitSaveProduct`; หลัง update สำเร็จ → `supabase.rpc("submit_kyc")` → `dispatch(fetchUser())` → เรียก `onKycSubmitted?.()` + `onSubmitSaveProduct?.()`
  - ปุ่ม disabled เมื่อ `is_kyc ∈ ('pending','approved')`
- **Global KYC gate** (`app/(authenticated)/components/KycGate.jsx`) — mount ใน [(authenticated)/layout.jsx](<../app/(authenticated)/layout.jsx>) ครอบทุกหน้าใน authenticated group; on mount `supabase.auth.getUser()` + `getProfileById` → ถ้า `is_kyc === 'unknown'` เด้ง `UseModal` (`<KycVerificationForm>`) อัตโนมัติให้บันทึก KYC (ปิดได้ผ่าน X, ไม่ block แบบ hard)
- **Add product KYC gate / submit flow** (`app/(authenticated)/user/add-product/components/CardAddProductPreview.jsx`) — `isKyc` + `isFeePaid` รับจาก `AddProductLayout`:
  - **ปุ่มหลัก step 3** แยกตาม `isKyc`: `approved` → `onSubmit("pending_review")` (ส่งตรวจสอบได้เลย); `unknown`/`rejected` → เปิด KYC modal (`<KycVerificationForm />`) — หลังส่ง KYC `onSubmitSaveProduct` save เป็น `draft` (เพราะ is_kyc ยังไม่ approved); `pending` → ปุ่ม disabled label "รอ admin ตรวจสอบ KYC"
  - **"บันทึกเป็นฉบับร่าง"** save `draft` ได้เสมอ (ไม่ block)
  - แสดง KYC banner เมื่อ `isKyc !== 'approved'` (`unknown`/`rejected` มีปุ่มเปิด modal; `pending` banner อย่างเดียว)
  - **🔒 จ่ายค่าธรรมเนียมได้เฉพาะ `approved`** — กล่องจ่ายใน `Form.jsx` gate ด้วย `isKyc === 'approved' && productId` (ดู [Add Product Listing Fee](#add-product-listing-fee)); server เช็คซ้ำอีกชั้น
  - **จ่ายค่าธรรมเนียมแล้ว (`isFeePaid`) → ล็อก**: ปุ่มหลัก + "บันทึกฉบับร่าง" disabled, ปุ่มหลัก label "รอ admin ตรวจสอบ" + banner เขียว "ชำระค่าธรรมเนียมแล้ว"; ปุ่ม "ย้อนกลับ" ยังกดได้
- **Admin KYC review** (`app/admin/users/components/KycReviewModal.jsx`):
  - เปิดผ่านปุ่มไอคอน `SafetyCertificateFilled` สีส้มใน `BtnActionGroup` (prop ใหม่ `onViewKyc` — optional, render เฉพาะถ้ามี)
  - โหลด user ผ่าน `getUserById(userId)` (admin service, ใช้ `users_full` view) + signed URL ของ `id_card_image` + `selfie_image` ผ่าน `getIdCardSignedUrlAdmin(path, 300)`
  - แสดงรายละเอียด KYC (national_id, phone, address, bank_*) + รูปภาพถ่ายหน้าบัตร + เซลฟี่คู่บัตร (anchor `target="_blank"` คลิกขยายได้)
  - ปุ่ม approve/reject แสดงเฉพาะ `is_kyc='pending'`
  - reject → sub-modal `<UseModal>` ขอ remark (`Input.TextArea`) → `rejectKyc(userId, remark)`
  - useEffect ล้าง state เมื่อ `open=false` หรือ `userId` เปลี่ยน (กันข้อมูลเก่าค้าง)
- **Admin services** (`app/services/admin/users.service.js`):
  - `approveKyc(userId)` — UPDATE `is_kyc='approved'`, `kyc_remark=null` + INSERT notification (`type='kyc'`)
  - `rejectKyc(userId, remark)` — UPDATE `is_kyc='rejected'`, `kyc_remark=remark` + INSERT notification
  - `getIdCardSignedUrlAdmin(path, expiresIn=300)` — admin sign URL จาก bucket `id-cards` (admin RLS policy อนุญาตอ่านทุก path)
- **Admin product gate**: admin ไม่สามารถ transition product → `pending_review` / `active` ได้ถ้า seller ยังไม่ `approved` (ดู [Admin Product Edit](#admin-product-edit-adminproductsidedit) ด้านบน)

## Add Product Listing Fee

- **Calc**: `5% ของ start_price` (calc ทั้ง server-side ใน `/api/payment/promptpay` + `/api/payment/wallet/listing-fee` และ client-side ใน [Form.jsx](<../app/(authenticated)/user/add-product/components/Form.jsx>) — ค่าต้องตรงกันเพื่อ UI แสดงถูก)
- **🔒 จ่ายได้เฉพาะ seller ที่ `is_kyc='approved'`** — เช็ค 2 ชั้น:
  - **UI** (`Form.jsx`): `isKyc !== 'approved'` → กล่องส้มให้ KYC ก่อน (ซ่อนปุ่มจ่าย)
  - **Server**: ทั้ง `/api/payment/promptpay` (branch `listing_fee`) + `/api/payment/wallet/listing-fee` fetch `profiles.is_kyc` ของ session user; ไม่ใช่ `approved` → 403 `seller_kyc_not_approved`
- **Fee state เป็น single source ใน [AddProductLayout.jsx](<../app/(authenticated)/user/add-product/components/AddProductLayout.jsx>)** — fetch `getListingFeePayment(effectiveProductId)` (`= watch("productId") || productId` ครอบทั้ง add/edit) แล้วส่ง `feePayment` + `refreshFeePayment` ให้ `Form`, ส่ง `isFeePaid` ให้ `CardAddProductPreview` (ไม่ fetch ซ้ำ 2 ที่ → ปุ่ม save ล็อกพร้อมกล่องจ่าย); edit page เซ็ต `productId: data.id` ตอน reset เพื่อให้รู้ productId ตั้งแต่โหลด
- **Step 3 conditional render ใน [Form.jsx](<../app/(authenticated)/user/add-product/components/Form.jsx>)** (รับ `feePayment` เป็น prop):
  - **`isKyc !== 'approved'`** → กล่องส้ม "ยืนยันตัวตน + รอ admin อนุมัติก่อน"
  - **ไม่มี `productId`** → กล่องส้ม "บันทึกและส่งตรวจสอบก่อน"
  - **`payment_status='success'`** → กล่องเขียว "ชำระเรียบร้อยแล้ว" (ซ่อนทุกปุ่ม)
  - **`payment_status='pending'`** → กล่องส้ม "กำลังตรวจสอบ" + ปุ่ม "รีเฟรชสถานะ" (`refreshFeePayment` prop)
  - **null** → แสดง `<PromptPayQR purpose="listing_fee" />` + `<WalletListingBtn onSuccess={refreshFeePayment} />`
- **`WalletListingBtn`** ([app/components/payment/WalletListingBtn.jsx](../app/components/payment/WalletListingBtn.jsx)) — load balance ผ่าน `getMyWalletBalance()` + subscribe `wallet-{userId}` (mounted flag กัน race); balance < amount → ปุ่ม redirect `/user/wallet`

## Product Quality Evaluation (Add Product Step 2)

- **Source**: แบบประเมินมาจาก `categories.evaluation` (jsonb) — array ของ `{ heading, subEvaluations: [{ label, score }] }` ที่ admin สร้างใน `/admin/categories` ([EvaluationForm.jsx](../app/admin/categories/components/EvaluationForm.jsx)); ดึงผ่าน `getParentCategories()` (select รวม `evaluation`)
- **Component**: [ProductEvaluation.jsx](<../app/(authenticated)/user/add-product/components/ProductEvaluation.jsx>) — รับ `{ control, setValue, evaluationGroups }`; แต่ละ heading เลือกได้ **1 ตัวเลือก** (ติ๊กใหม่ → `setValue` เคลียร์ตัวอื่นในกลุ่ม false); render เฉพาะเมื่อ category มี evaluation
- **Form field `evaluation`**: object `{ [headingIdx]: { [subIdx]: boolean } }` — เก็บลง `products.evaluation` (jsonb) ตรง ๆ เพื่อ round-trip; ตอน edit `getProductById` (`select("*")`) คืนค่ากลับ → `reset()` ติ๊กเดิมอัตโนมัติ (**ต้องเป็น category เดิม** เพราะ map ด้วย index)
- **`quality_score`** (0-100): normalize = `round(rawScore / maxScore * 100)` โดย `rawScore` = ผลรวม score ของตัวเลือกที่เลือก, `maxScore` = ผลรวม max score ต่อ heading; sync ลงฟอร์มผ่าน `setValue("quality_score", ...)` ใน `useEffect` → เก็บลง `products.quality_score` (smallint, CHECK 0-100)
- **Migration**: [20260606000000_add_product_evaluation.sql](../supabase/migrations/20260606000000_add_product_evaluation.sql) — เพิ่ม `products.evaluation` (jsonb) + `products.quality_score` (smallint, CHECK 0-100)
- **Payload**: [AddProductLayout.jsx](<../app/(authenticated)/user/add-product/components/AddProductLayout.jsx>) `onSubmit` ส่ง `evaluation` + `quality_score` (default `null`)
