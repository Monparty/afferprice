# Conventions & Patterns

Project-specific coding style and reusable patterns. Standard library behavior is assumed — only deviations are documented here.

## Imports & Naming

- **Imports**: `@/` alias maps to the project root (`app/`, `db/`, etc.)
- **TypeScript**: `strict: false`; most files are `.jsx` / `.js`
- **Component naming**: PascalCase files (`CardProduct.jsx`)
- **Service naming**: camelCase ending in `.service.js`
- **Supabase admin client** must never be imported in client components (marked `server-only`)

## Forms & Validation

- React Hook Form + Yup + `@hookform/resolvers`.
- Custom wrapper components (`UseButton`, `UseSelect`, `UseUpload`, etc.) live in `app/components/` — use these instead of raw Ant Design inputs.

## UI Stack

- **Ant Design 6.3.5** — Thai locale (`th_TH`), volcano color palette
- **Tailwind CSS 4** — utility classes alongside Ant Design
- **HolyLoader** — page transition bar in root layout
- Max-width container: `360px` base with responsive padding
- **⚠️ Tailwind 4 + `sr-only` gotcha**: hidden radio/checkbox visual states (`has-checked:`) don't work. For selectable cards use `<div onClick>` + conditional className driven by state (see checkout payment-method picker and address card).

## Payment-method card shell

- เปลือกการ์ดของช่องทางชำระเงินอยู่ที่ `app/components/payment/PaymentMethodCard.jsx` (`{ icon, title, subtitle, children }`) — single source ของดีไซน์ (border/padding/header). `icon` ส่งเป็น **component type** (`icon={WalletFilled}`) ไม่ใช่ element; การ์ดเป็นคนใส่ className ขนาด/สี เพื่อคุมที่เดียว.
- แต่ละ method = component `XxxListingBtn.jsx` ที่ wrap `PaymentMethodCard` (เช่น `PromptPayListingBtn`, `WalletListingBtn`) แล้วประกอบรวมใน `ListingFeePayment.jsx`.
- **เพิ่ม method ใหม่**: สร้าง `XxxListingBtn.jsx` ใช้ `PaymentMethodCard` เป็นเปลือก + ใส่เนื้อหาปุ่มของตัวเอง แล้วเพิ่มลง `ListingFeePayment` — **ห้าม copy markup การ์ด** (จะหลุด single source).
- **ช่องทางที่มี (listing fee):** `PromptPayListingBtn`, `WalletListingBtn`, `CreditCardListingBtn`, `TrueMoneyListingBtn`, `RabbitLinePayListingBtn`.
- **method ครอบ 3 flow:** ช่องทางเดียวควรเสียบได้ทั้ง `listing_fee` (ListingFeePayment), `auction` (checkout picker → payment page `[id]`), `topup` (wallet TopupModal) — ต่างกันแค่ `purpose` + id ที่ส่งเข้า route
- **คำเรียก listing fee ใน UI = "เงินค่าประกันการขาย"** (rename 2026-07-04 — คืนให้ผู้ขายเมื่อการขายไม่สำเร็จ) — ห้ามใช้ "ค่าธรรมเนียมลงขาย" ใน UI ใหม่; โค้ด/DB ยังใช้ `listing_fee` เหมือนเดิม. อย่าสับสนกับ "ค่าธรรมเนียมการประมูล 5%" ฝั่งผู้ซื้อ (`final_price*1.05`) ซึ่งเป็นคนละเงิน — คำนั้นคงเดิม.

## Client payment helpers (Omise)

- **บัตรเครดิต/เดบิต** → `app/components/payment/OmiseCardForm.jsx` — โหลด Omise.js ผ่าน `next/script`, `createToken('card', …)` ฝั่ง client (PAN ไม่เข้า server) แล้ว callback `onToken(tokenId)`; **parent เป็นคนยิง `/api/payment/credit-card`** เอง (คุม `purpose`/ids). ต้องมี env `NEXT_PUBLIC_OMISE_PUBLIC_KEY` + CSP `connect-src https://*.omise.co` (vault).
- **redirect methods (TrueMoney / Rabbit LINE Pay)** → `startOmiseRedirect(body)` ใน `app/components/payment/redirectPay.js` — POST `/api/payment/omise` แล้ว `window.location.href = authorizeUri`. Omise ส่งกลับมาที่ `/user/payment/return` (redirect ตาม `purpose`); **งานปิดจริงที่ webhook `charge.complete`** ไม่ใช่หน้า return.

## Payment amount resolver (server)

- คำนวณยอด + verify (ownership/KYC/already-paid/clamp topup) ฝั่ง server รวมที่ `app/lib/payment/resolveAmount.js` → `resolvePaymentAmount({ user, purpose, … })` คืน `{ amount, auctionResultId, productId }` หรือ throw `PaymentError(code, status)`. ใช้ใน `credit-card` + `omise` route. **`promptpay` route ยังมี logic inline เดิม** (ยังไม่ย้าย) — แก้กติกาคิดเงินต้องแก้ทั้ง 2 ที่. `omiseFetch`/`omiseGet` อยู่ที่ `app/lib/payment/omise.js` (อย่า copy ลง route ใหม่).

## Admin list page pattern

`"use client"` → `useEffect` fetch service → map → `UseTable` inside wrapper `bg-white rounded-xl shadow-sm border border-slate-100`.

- All admin pages use a service from `app/services/admin/*.service.js` (`"use server"`) — queries go through `supabaseAdmin` + manual join with the `users_full` view (no FK join because `auth.users` is untouchable).
- `UseTable` (`app/components/utils/UseTable.jsx`) supports the `onRow` prop (Ant Design pass-through) for row event handlers.

## Server actions (non-admin)

- เมื่อ client ต้องอ่านข้อมูลที่ RLS บล็อก แต่ผู้เรียก**ไม่ใช่ admin** (เช่น seller อ่านที่อยู่ของ buyer) → server action ใน `app/services/*.service.js` (`"use server"`) ที่ `requireUser()` + **verify ownership เอง** จาก DB + `supabaseAdmin` bypass RLS. ห้าม trust id จาก argument โดยไม่เช็ค (action ถูก expose เป็น POST endpoint อัตโนมัติ).
- ตัวอย่าง: `getBuyerShippingAddress()` ใน `app/services/checkout.service.js` — verify `auction_results.products.seller_id === user.id` ก่อนคืน address ของ winner.
- ต่างจาก `app/services/admin/*` ที่ใช้ `requireAdmin()` (role-gated); อันนี้ user-gated ตาม ownership.
- **3 ประเภท server action ที่ใช้ `supabaseAdmin`:**
  1. **admin** (`app/services/admin/*`) → `requireAdmin()` บรรทัดแรก
  2. **user-gated** (เช่น `checkout.service.js`, `order.service.js` `confirmReceipt`) → `requireUser()` + verify ownership เอง
  3. **public-safe** (เช่น `landing.service.js` `getRecentlySoldPublic`/`getPlatformStats`) → **ไม่มี `requireUser`** เพราะเป็นข้อมูลสาธารณะ (ราคา auction, count รวม) ที่ RLS บล็อก anon — **ต้องคืนเฉพาะ field ที่เปิดเผยได้ ห้ามมี PII** (ชื่อ/อีเมล/ที่อยู่). ใช้กับหน้า landing ที่ anon เปิดได้
- mutation ที่ผู้ใช้ทำเอง (เช่น ผู้ซื้อกดยืนยันรับสินค้า) ก็ใช้ pattern user-gated ได้ — `confirmReceipt` verify `winner_id === user.id` ก่อน update `shipments` ด้วย `supabaseAdmin` (RLS เปิดแค่ SELECT)

## Notifications

- Use `notifyError()` / `notifySuccess()` from `NotificationProvider.jsx`.
- `notifyError(error)` auto-translates Supabase `error.message` to Thai via `translateSupabaseError()` in `app/utils/supabaseErrorMap.js`. Add new messages **only** to `errorMap` there — never touch call sites.
