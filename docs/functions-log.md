# Functions Log

Append-only log of completed features/functions. Newest entries at the bottom.

## CardSellingProduct — winner payment UI — 2026-06-15
- **Purpose:** เมื่อประมูลมีผู้ชนะแต่ยังไม่ชำระเงิน แสดง UI แยกตามฝั่ง — ผู้ขายเห็น tag "รอผู้ซื้อชำระเงิน", ผู้ซื้อเห็นปุ่ม "ชำระเงิน" ที่ redirect ไป checkout
- **Location:** `app/components/utils/CardSellingProduct.jsx` — `CardSellingProduct` + helper `getPopoverAction`
- **Inputs/Outputs:**
  - ใช้ `value.stateName` (`"มีผู้ชนะ"` = ฝั่งผู้ขาย/sold tab), `value.isBuyer` (true บน won tab), `value.paymentStatus` (`pending`/`paid`), `value.id` (product id)
  - `sellerWaitingPay = stateName === "มีผู้ชนะ" && paymentStatus !== "paid"` → `<UseTag label="รอผู้ซื้อชำระเงิน" color="orange" icon={WalletOutlined} />`
  - `buyerNeedPay = isBuyer && paymentStatus !== "paid"` → `<UseButton label="ชำระเงิน" wFull>` → `router.push('/user/checkout/{id}')`
- **Gotchas:**
  - ปุ่ม/แท็ก render ใน card body (ไม่ใช่ popover) เพื่อให้เด่น
  - ย้าย action เดิม `รอชำระเงิน` (ผู้ขาย) / `ตรวจสอบ` (ผู้ซื้อ) ออกจาก popover → `getPopoverAction` คืน `null` สำหรับ 2 เคสนี้
  - popover (`⋯`) ถูกซ่อนเมื่อ `action` เป็น null (ไม่ render ปุ่มเปล่า)
  - `sellerWaitingPay` กับ `buyerNeedPay` exclusive กันอยู่แล้ว (won tab stateName = "สินค้าที่ฉันชนะ" ≠ "มีผู้ชนะ"; seller sold tab `isBuyer` = false)
  - เคส `paid` คงเดิม: ผู้ขาย "ระบุข้อมูลการจัดส่ง", ผู้ซื้อ "รอจัดส่งสินค้า"

## Admin Bids Detail — buyer/seller order info — 2026-06-16
- **Purpose:** ในหน้า `/admin/bids/[id]` ถ้าสินค้าจบประมูลแล้ว (state `sold`/`order`) แสดงการ์ด 2 ฝั่งเหนือตารางการประมูล — ข้อมูลผู้ขาย (ชื่อ/อีเมล/เบอร์/ที่อยู่/บัญชีรับเงิน) และผู้ซื้อ-ผู้ชนะ (ชื่อ/อีเมล/เบอร์/ราคาปิด/แท็กสถานะชำระเงิน/ที่อยู่จัดส่ง/ข้อมูลการจัดส่ง)
- **Location:**
  - Service: `app/services/admin/bids.service.js` — `getSoldOrderDetail(productId)`
  - UI: `app/admin/bids/[id]/page.jsx` — helper `fullName`, `InfoRow` + section render เมื่อ `orderDetail`
- **Inputs/Outputs:**
  - `getSoldOrderDetail(productId)` (`requireAdmin` + `supabaseAdmin`) คืน `{ data, error }`; `data` = `{ seller, buyer, buyerAddress, result, shipment }` หรือ `null` ถ้า state ไม่ใช่ `sold`/`order`
  - seller/buyer มาจาก `users_full` (first_name, last_name, email, phone, address, bank_*); `result` จาก `auction_results` (final_price, payment_status, winner_id); `buyerAddress` = default ของ winner ใน `user_addresses`; `shipment` จาก `shipments` (ถ้ามี)
- **Gotchas:**
  - **`auction_results` ไม่มีคอลัมน์ `created_at`** — อย่า select (ของเดิมใน `admin/auction-results.service.js` ยัง select อยู่ → จะ error ถ้าโดนเรียก)
  - **ที่อยู่จัดส่งไม่ได้ persist กับ order** — checkout ไม่บันทึก `address_id` ลง `auction_results`/`shipments`; ดึง default จาก `user_addresses` ของ winner แทน (อาจไม่ตรงกับที่เลือกตอน checkout ถ้ามีหลายที่อยู่)
  - ที่อยู่/เบอร์/บัญชีผู้ขายมาจากข้อมูล KYC ใน `profiles`/`users_full`
  - gate ด้วย state `['sold','order']` (ไม่ใช่แค่ `sold`) เพราะหลังจัดส่ง state เปลี่ยนเป็น `order` แต่ยังเป็นออเดอร์ที่จบแล้ว

## Admin Bids — คอลัมน์เวลาที่เหลือ (countdown) — 2026-06-16
- **Purpose:** หน้า `/admin/bids` (ตาราง group by product) เพิ่มคอลัมน์ "เวลาที่เหลือ" แสดงนับถอยหลัง realtime ของสินค้าที่ยัง `active`
- **Location:**
  - Service: `app/services/admin/bids.service.js` — `getBidsGroupedByProduct()` เพิ่ม `auction_end_time` ใน select ของ `products(...)`
  - UI: `app/admin/bids/page.jsx` — helper `padTwo`/`formatCountdown` + component `CountdownCell` + map field `auctionEndTime` + คอลัมน์ใหม่
- **Inputs/Outputs:**
  - `CountdownCell({ endTime })` — `useState` + `setInterval` 1s; คืน `<span>` สีแดงเมื่อนับอยู่, สีเทาเมื่อ "หมดเวลา" หรือไม่มี endTime
  - คอลัมน์ render `<CountdownCell>` เฉพาะ `record.state === "active"`; state อื่นแสดง `—`
- **Gotchas:**
  - **`formatCountdown`/`padTwo` copy logic จาก `CardSellingProduct.jsx`** (ยังไม่ได้แยกเป็น util ร่วม — ถ้าแก้ format ต้องแก้ 2 ที่)
  - countdown หมดเวลา (`active` + `auction_end_time < now`) จะค้างที่ "หมดเวลา" จนกว่า reconcile จะเปลี่ยน state (ไม่มี server cron — ดู Auction End Flow)
  - format: `> 1 วัน` → `X วัน HH ชม.`; มิฉะนั้น `HH:MM:SS`

## Wallet payment page fix — `/user/payment/[id]?method=wallet` — 2026-06-17
- **Purpose:** แก้บั๊กหน้าชำระเงินที่ wallet ตัดเงินไม่ได้ + ยอด/balance ไม่แสดง
- **Location:**
  - `app/(authenticated)/user/payment/[id]/page.jsx`
  - `app/(authenticated)/user/checkout/[id]/page.jsx` (ปุ่ม "ยืนยันการชำระเงิน")
- **Inputs/Outputs:**
  - payment page เลิกอ่าน user จาก Redux → ใช้ `supabase.auth.getUser()` (`userId` state) + `getMyWalletBalance()` (`walletBalance` state, sync Redux ผ่าน `setWalletBalance`)
  - หลัง `POST /api/payment/wallet/charge` สำเร็จ → `setWalletBalanceLocal(d.balance_after)` + `dispatch(setWalletBalance(...))`
- **Gotchas:**
  - **ต้นเหตุหลัก 2 จุด:**
    1. `fetchUser` ไม่ได้ dispatch ทุกหน้า → `state.user.data` undefined → `walletBalance` = 0 (ปุ่มกลายเป็น "เติมเงิน") + `handleWalletPay` early-return เพราะ `!user?.id` → charge ไม่เคยยิง. แก้ด้วย pattern เดียวกับ checkout/wallet (โหลดตรงจาก Supabase)
    2. checkout ส่ง `router.push('/user/payment/${id}')` โดย `id` = **product id** แต่หน้า payment เรียก `getAuctionResultById(id)` ที่ query ด้วย **auction_result.id** → `result` = null → ยอดไม่แสดง + ปุ่ม `disabled={!result}`. แก้เป็น `${result.id}` (auction_result id ตาม route `[auctionResultId]`)
  - `charge_wallet` RPC คืน `{ payment_id, balance_after }`

## Seller shipment flow — checkout seller mode + buyer address — 2026-06-17
- **Purpose:** ผู้ขายกด "ระบุข้อมูลการจัดส่ง" → เข้า `/user/checkout/[id]` เห็น checkout ปกติ (ที่อยู่ของผู้ซื้อ + สรุปออเดอร์ read-only) → กด "ระบุเลขใบเสร็จการจัดส่ง" ค่อยเปิดฟอร์มจัดส่ง
- **Location:**
  - `app/components/utils/CardSellingProduct.jsx` — `sellerNeedShip`/`buyerWaitingShip` (card body)
  - `app/(authenticated)/user/checkout/[id]/page.jsx` — `sellerShipMode`, `showShipmentForm` (state), `buyerAddress`
  - `app/services/checkout.service.js` (ใหม่) — `getBuyerShippingAddress(auctionResultId)`
- **Inputs/Outputs:**
  - **CardSellingProduct body (paid):** `sellerNeedShip = stateName==="มีผู้ชนะ" && paid` → `<UseButton "ระบุข้อมูลการจัดส่ง" icon=CarOutlined>` → `/user/checkout/{id}`; `buyerWaitingShip = isBuyer && paid` → `<UseTag "รอจัดส่งสินค้า" color=blue icon=CarOutlined>` (ย้ายจาก popover → body; `getPopoverAction` คืน null ทั้ง 2 เคส)
  - **checkout seller mode:** `sellerShipMode = isSeller && isPaid`
    - `showShipmentForm` เปลี่ยนจาก derived (auto) → **state** default `false`; ปุ่มสรุปยอด label `sellerShipMode ? "ระบุเลขใบเสร็จการจัดส่ง" → setShowShipmentForm(true) : "ยืนยันการชำระเงิน" → push payment`
    - section 2 (ที่อยู่) → แสดง `buyerAddress` read-only (หัวข้อ "ที่อยู่จัดส่งของผู้ซื้อ", ซ่อนปุ่มเพิ่มที่อยู่); section 3/4 → `pointer-events-none opacity-60 select-none`
  - **`getBuyerShippingAddress(auctionResultId)`** (`"use server"`) คืน `{ data, error }`; `data` = default address ของ winner (`user_addresses`)
- **Gotchas:**
  - **server action ใหม่ไม่ใช่ admin** — ใช้ `requireUser()` + verify `result.products.seller_id === user.id` เอง + `supabaseAdmin` bypass RLS `"user manage own address"` (seller อ่าน address ของ winner ไม่ได้ผ่าน browser client)
  - **ที่อยู่ผู้ซื้อไม่ได้ persist ตอน checkout** — `auction_results` ไม่มี `address_id` → แสดง default ของ winner (อาจไม่ตรงตัวที่เลือกถ้ามีหลายที่อยู่)
  - `sellerShipMode` ปลด requirement เลือก address ของผู้ขาย (`disabled={!result || (!sellerShipMode && !selectedAddressId)}`)
  - `sellerNeedShip`/`buyerWaitingShip` exclusive (won tab stateName ≠ "มีผู้ชนะ"; seller sold tab `isBuyer` = false)

## Order tracking + ย้ายสินค้า order ไป tab การจัดส่งทั้ง 2 ฝั่ง — 2026-06-17
- **Purpose:** หลังผู้ขายระบุข้อมูลการจัดส่ง (`state`→`order`) ให้สินค้าหายจาก tab "สินค้าที่ฉันชนะ" ของผู้ซื้อ → ไปโผล่ที่ tab "การจัดส่ง" ทั้งฝั่งผู้ซื้อและผู้ขาย พร้อมปุ่ม "ตรวจสอบสถานะการจัดส่ง" → หน้า `/user/order` (ดึงข้อมูลจริง, mock timeline)
- **Location:**
  - Service: `app/services/products.service.js` — `getWonProductsByUser`/`getWonProductCountByUser` (กรอง `sold`), `getOrderProductsWonByUser` (ใหม่)
  - UI: `app/(authenticated)/user/selling/page.jsx` (tab `order` merge + render `isBuyerShape`), `app/components/utils/CardSellingProduct.jsx` (`isShipping` + ปุ่ม), `app/(authenticated)/user/order/page.jsx` (เขียนใหม่ดึงข้อมูลจริง)
- **Inputs/Outputs:**
  - `getWonProductsByUser()`/`getWonProductCountByUser()` เพิ่ม `products!inner(...)` + `.eq("products.state","sold")` → คืนเฉพาะสินค้าชนะที่ **ยังไม่จัดส่ง**
  - `getOrderProductsWonByUser()` — `auction_results` ของ winner ปัจจุบัน join `products!inner` `.eq("products.state","order")` → สินค้าที่ชนะและจัดส่งแล้ว (shape เดียวกับ won: `{ id, payment_status, final_price, products }`)
  - selling tab `order`: `Promise.all([getProductsByState("order") (ฝั่งผู้ขาย), getOrderProductsWonByUser() (ฝั่งผู้ซื้อ tag `_isBuyerOrder:true`)])` แล้ว dedupe ด้วย product id (buyer key = `ar.products.id`)
  - render: `isBuyerShape = isWonTab || item._isBuyerOrder` → ใช้ `item.products`/`item` เป็น auctionResult เหมือน won tab; `isBuyer` ส่งตาม `isBuyerShape`
  - `CardSellingProduct`: `isShipping = stateName === "การจัดส่ง"` → ปุ่ม "ตรวจสอบสถานะการจัดส่ง" (`InboxOutlined`) → `router.push('/user/order?product={value.id}')`
  - `/user/order?product={productId}`: `getAuctionResultByProduct(productId)` + `getShipmentByAuctionResult(result.id)` → แสดง ชื่อ/รูป/ราคาปิด/บริษัทขนส่ง/tracking/สถานะ; `current` ของ `UseSteps` map จาก `shipping_status` (`preparing`=0, `shipped`=2, `delivered`=3)
- **Gotchas:**
  - **count `order` รวม 2 ฝั่ง** — count effect บวก `getOrderProductsWonByUser()?.length` เข้า `counts["order"]` (เหมือน pattern `active`/`cancelled`); ถ้าลืม badge จะนับแค่ฝั่งผู้ขาย
  - **won tab ตอนนี้ = `sold` เท่านั้น** — เดิม `getWonProductsByUser` คืนทุก state ของ winner (รวม `order`); เปลี่ยนเป็น inner-join filter `sold` เพื่อไม่ให้ค้างใน won tab หลังจัดส่ง
  - `buyerNeedPay`/`buyerWaitingShip` ใน card เพิ่ม guard `&& !isShipping` (buyer order item มี `isBuyer=true`+`paid` → ถ้าไม่ guard จะโชว์ tag "รอจัดส่งสินค้า" แทนปุ่ม)
  - **order page ไม่มี per-step event ใน DB** — timeline (เวลา/สถานที่แต่ละขั้น) เป็น mock คงที่; ดึงจริงเฉพาะ field ที่มีใน `shipments`/`auction_results`; ไม่มี `?product=` หรือดึงไม่ได้ → fallback `MOCK` ทั้งก้อน
  - **`useSearchParams` ต้องอยู่ใน `<Suspense>`** — แยก `OrderContent` แล้วครอบ Suspense ใน `Page` (กัน build error prerender)
  - ปุ่มส่ง **product id** (ไม่ใช่ auction_result id) เพราะ `getAuctionResultByProduct` query ด้วย `product_id`
  - RLS รองรับอยู่แล้ว: `auction_results` `"winner or seller read result"`, `shipments` `"buyer or seller read shipment"`

## Admin menu badge counts — งานที่ admin ต้องตรวจสอบ — 2026-06-23
- **Purpose:** แสดง badge ตัวเลขบนเมนู sidebar admin บอกจำนวนงานค้างที่ต้องตรวจสอบ — ตอนนี้ 2 ตัว: สินค้ารอตรวจ (`products.state='pending_review'`) บนเมนู "จัดการสินค้าประมูล" และ KYC รอตรวจ (`profiles.is_kyc='pending'`) บนเมนู "จัดการผู้ใช้งาน"
- **Location:**
  - Service: `app/services/admin/badges.service.js` (ใหม่) — `getAdminBadgeCounts()`
  - UI: `app/admin/components/AdminLayout.jsx` — state `badgeCounts` + `useEffect` fetch + render badge ใน `menus.map`
- **Inputs/Outputs:**
  - `getAdminBadgeCounts()` (`requireAdmin` + `supabaseAdmin`) คืน object keyed by route → count เช่น `{ "/admin/products": 3, "/admin/users": 5 }`
  - นับทุก source พร้อมกันด้วย `Promise.all` (`count: "exact", head: true` — ไม่ดึง row จริง)
  - layout: `badgeCounts[menu.url] > 0` → render `<span>` ส้ม (`> 99` แสดง `99+`); refetch ทุกครั้งที่ `pathname` เปลี่ยน
- **Gotchas:**
  - **Scale ได้ง่าย:** เพิ่ม badge ใหม่ = เพิ่ม 1 entry ใน `BADGE_SOURCES` (`{ key: ROUTES.X, count: () => supabaseAdmin... }`) — ไม่ต้องแตะ layout เลย
  - **key ต้องตรงกับ `menu.url`** (ใช้ `ROUTES.*` ทั้ง 2 ฝั่ง) ไม่งั้น badge ไม่ขึ้น
  - refetch ผูกกับ `pathname` (ไม่มี polling/realtime) — badge อัปเดตเมื่อ admin เปลี่ยนหน้าเท่านั้น
  - fetch error เงียบ (`.catch(() => {})`) — ไม่ให้พังทั้ง layout

## Listing fee payment — reusable payment-method components — 2026-06-23
- **Purpose:** รวม UI ช่องทางชำระค่าธรรมเนียมลงขาย (PromptPay + Wallet) ให้เป็น component ที่ reuse ได้ + แชร์เปลือกการ์ดเดียวกัน เพื่อให้แก้ดีไซน์ที่เดียวมีผลทุก method
- **Location:**
  - `app/components/payment/PaymentMethodCard.jsx` (ใหม่) — เปลือกการ์ดร่วม
  - `app/components/payment/PromptPayListingBtn.jsx` (ใหม่) — การ์ด PromptPay (wrap `PromptPayQR`)
  - `app/components/payment/WalletListingBtn.jsx` — refactor ใช้ `PaymentMethodCard`
  - `app/components/payment/ListingFeePayment.jsx` (ใหม่) — ประกอบ 2 ปุ่มเข้าด้วยกัน
  - `app/components/payment/PromptPayQR.jsx` — เพิ่ม prop `wFull` (ส่งต่อให้ `UseButton`)
  - ใช้งานใน `app/(authenticated)/user/add-product/components/AddProductForm.jsx` (step 3) → `<ListingFeePayment amount={listingFee} productId={watchProductId} onSuccess={refreshFeePayment} />`
- **Inputs/Outputs:**
  - `PaymentMethodCard({ icon, title, subtitle, children })` — `icon` เป็น **component type** (เช่น `WalletFilled`) render เป็น `<Icon className="text-2xl! text-orange-500!" />`; การ์ด `bg-white border rounded-xl p-4` + header `flex gap-3 mb-3`
  - `PromptPayListingBtn({ productId, amount })` → `<PaymentMethodCard icon={QrcodeOutlined} ...>` + `<PromptPayQR purpose="listing_fee" wFull />`
  - `WalletListingBtn({ productId, amount, onSuccess })` — subtitle = `ยอดคงเหลือ` (dynamic), children = warning ยอดไม่พอ + `UseButton wFull` (logic wallet เดิมไม่เปลี่ยน)
  - `ListingFeePayment({ amount, productId, onSuccess })` → `grid gap-3` ครอบ 2 ปุ่ม
- **Gotchas:**
  - **เพิ่ม method ใหม่ (เช่น บัตรเครดิต/LinePay):** สร้าง `XxxListingBtn.jsx` ที่ใช้ `PaymentMethodCard` เป็นเปลือก (icon/title/subtitle + เนื้อหาปุ่มของตัวเอง) แล้วเพิ่มลงใน `ListingFeePayment` — **ห้าม copy markup การ์ด** (จะหลุด single source)
  - **`paid` state ของ `WalletListingBtn` ไม่ได้ใช้ `PaymentMethodCard`** — เป็นการ์ดเขียวสำเร็จคนละแบบ (ตั้งใจ); การ์ดมาตรฐานคือเคสยังไม่จ่าย
  - `wFull` ของ `PromptPayQR` default `false` — ที่อื่น (topup/auction) ปุ่มยังเป็นขนาดปกติเหมือนเดิม ไม่กระทบ
  - `icon` ส่งเป็น type ไม่ใช่ element (`icon={WalletFilled}` ไม่ใช่ `icon={<WalletFilled/>}`) — `PaymentMethodCard` เป็นคนใส่ className ขนาด/สี เพื่อให้คุมที่เดียว

## Admin notification bell drawer — 2026-06-23
- **Purpose:** กด `BellOutlined` บน header ของ admin → เปิด `UseDrawer` แสดงการแจ้งเตือนระบบ (system-wide feed ทุก user) — เทียบเท่า notification bell ฝั่ง user แต่ดึงทั้งระบบผ่าน admin service
- **Location:**
  - `app/components/utils/UseDrawer.jsx` — เพิ่ม prop `title` + `children` (override เนื้อหา)
  - `app/admin/components/AdminNotificationDrawer.jsx` (ใหม่) — fetch + render การ์ดเป็น children ของ `UseDrawer`
  - `app/admin/components/AdminLayout.jsx` — state `openNoti` + `BellOutlined` clickable + render `<AdminNotificationDrawer>`
- **Inputs/Outputs:**
  - `UseDrawer({ onClose, open, loading, onRead, title?, children? })` — ถ้าส่ง `children` จะ render แทน filter chips + `CardDrawer` เดิม (backward-compatible: `AppHeader` ไม่ส่ง children → ใช้ของเดิม); `title` default `"การแจ้งเตือนกิจกรรม"`
  - `AdminNotificationDrawer({ open, onClose })` — on `open` เรียก `getAllNotifications({ limit: 50 })` (admin service, `requireAdmin` + `supabaseAdmin`, enrich ชื่อผู้รับจาก `users_full`) → render การ์ด (icon ตาม `TYPE_CONFIG` รวม `kyc`/`shipping`, เวลา `dayjs().fromNow()`, บรรทัด "ถึง: {ชื่อผู้รับ}")
- **Gotchas:**
  - bell แสดง **feed ทั้งระบบ** ไม่ใช่งานค้างของ admin (งานค้าง = badge counts บน sidebar ผ่าน `getAdminBadgeCounts()`) — คนละ source กัน
  - ไม่มี mark-as-read / unread badge บน bell (feed รวมทุก user → count จะ noisy) ต่างจาก `CardDrawer` ฝั่ง user ที่ `markAllNotificationsRead()` on open
  - `TYPE_CONFIG` ใน `AdminNotificationDrawer` ไม่มี dark-mode variant (admin UI เป็น light เท่านั้น) ต่างจาก `CardDrawer` ที่มี `dark:` — ถ้าก๊อปต้องระวัง
  - children-override ของ `UseDrawer` ยังคง footer ปุ่ม "ดูประวัติกิจกรรมทั้งหมด" (ยังไม่มี onClick) ไว้เหมือนเดิม

## Omise payment methods — Card / TrueMoney / Rabbit LINE Pay (ทุก flow) — 2026-06-23
- **Purpose:** เพิ่มช่องทางชำระเงินผ่าน Omise 3 ช่องทาง (บัตรเครดิต/เดบิต, TrueMoney Wallet, Rabbit LINE Pay) ให้ครบทั้ง 3 flow: ค่าธรรมเนียมลงขาย (`listing_fee`), จ่ายค่าประมูล (`auction`), เติมเงิน (`topup`). **LINE Pay เปลี่ยนจาก mockup เดิม → Omise source `rabbit_linepay` จริง** (redirect)
- **Location:**
  - Migration: `supabase/migrations/20260623120000_add_omise_payment_methods.sql` (เพิ่ม `truemoney` ใน `payments_payment_method_check`)
  - Backend lib (ใหม่): `app/lib/payment/omise.js` (`omiseFetch`/`omiseGet`), `app/lib/payment/resolveAmount.js` (`resolvePaymentAmount` + `PaymentError`)
  - Routes: `app/api/payment/omise/route.js` (ใหม่ — source-based redirect), `app/api/payment/credit-card/route.js` (extend `listing_fee` + ใช้ resolver)
  - Client components: `app/components/payment/OmiseCardForm.jsx`, `redirectPay.js`, `CreditCardListingBtn.jsx`, `TrueMoneyListingBtn.jsx`, `RabbitLinePayListingBtn.jsx` (ทั้งหมดใหม่) + `ListingFeePayment.jsx`
  - Pages: `app/(authenticated)/user/payment/[id]/page.jsx`, `.../checkout/[id]/page.jsx`, `.../wallet/page.jsx` (TopupModal), `.../payment/return/page.jsx` (ใหม่)
  - อื่นๆ: `next.config.mjs` (CSP), `app/utils/supabaseErrorMap.js` (error ภาษาไทย)
- **Inputs/Outputs:**
  - `resolvePaymentAmount({ user, purpose, auctionResultId, productId, clientAmount })` → `{ amount, auctionResultId, productId }` (id ที่ไม่เกี่ยว = null) หรือ throw `PaymentError(code, status)`; รวม verify ownership/KYC/already-paid + clamp topup 20–100,000 ที่เคยซ้ำใน promptpay+credit-card
  - `POST /api/payment/omise` body `{ sourceType: 'truemoney'|'rabbit_linepay', purpose, auctionResultId?, productId?, amount?, phoneNumber? }` → สร้าง source + charge (พร้อม `return_uri`) → คืน `{ chargeId, authorizeUri }`; `payment_method` map: `truemoney`→`truemoney`, `rabbit_linepay`→`linepay`
  - `startOmiseRedirect(body)` (client helper `redirectPay.js`) → POST `/api/payment/omise` → `window.location.href = authorizeUri`
  - `OmiseCardForm({ amount, onToken, submitLabel })` — โหลด Omise.js (`next/script`), `Omise.setPublicKey` + `createToken('card', {...})` → `onToken(tokenId)`; **parent ยิง `/api/payment/credit-card` เอง** (คุม purpose/ids)
  - credit-card route รับ `{ omiseToken, purpose, auctionResultId?, productId? }` → charge ตรง → insert `payments(credit_card, pending)` → คืน `{ chargeId, status, authorizeUri }`
- **Gotchas:**
  - **redirect methods (truemoney/rabbit_linepay) → charge `pending` จนลูกค้า authorize → webhook `charge.complete` ปิดงาน** (ไม่มี polling). `/user/payment/return` แค่พาผู้ใช้ไปหน้าที่ refresh เอง (topup→`/user/wallet`, listing_fee→`/user/add-product/{id}/edit`, auction→`/user/selling`) ด้วย `setTimeout` 1.5s + `<Suspense>` (มี `useSearchParams`)
  - **webhook ไม่ต้องแก้** — branch ตาม `purpose` อยู่แล้ว (topup→`credit_wallet`, auction→`auction_results.paid`, listing_fee→ไม่มี side effect); ทุก method สร้าง `payments` row ที่ webhook หาเจอด้วย `transaction_ref = charge.id`
  - **Rabbit LINE Pay เก็บ `payment_method='linepay'`** (ไม่เพิ่มค่าใหม่ใน constraint) — reuse label/แอดมินเดิม; mockup routes `/api/payment/linepay` + `/confirm` **ยังอยู่แต่เลิกเรียกแล้ว** (topup/auction ใช้ของจริงหมด)
  - **TrueMoney บังคับ `phone_number`** (Omise) — validate `/^0\d{9}$/` ทั้ง client + server; ทุก entry (listing btn / payment page / topup modal) มี input เบอร์เฉพาะตอนเลือก truemoney
  - **บัตร tokenize ฝั่ง client เท่านั้น** (PAN ไม่เข้า server) — ต้องตั้ง env `NEXT_PUBLIC_OMISE_PUBLIC_KEY`; **CSP `connect-src` ขยายเป็น `https://*.omise.co`** (เดิม `api.omise.co` อย่างเดียว → `vault.omise.co` ที่ `createToken` ยิงไปโดนบล็อก)
  - **card charge ไม่ instant** — insert `pending` แล้วรอ webhook (เหมือน promptpay); ต่างจาก wallet ที่ตัดเงินทันที. listing_fee ฝั่ง UI จะเห็น "กำลังตรวจสอบ" จน webhook ปิด
  - **resolver ยังไม่ย้าย promptpay มาใช้** — promptpay เก็บ logic inline เดิม (ลดความเสี่ยง path หลักที่ใช้บ่อยสุด); ใช้ resolver เฉพาะ credit-card + omise route → ถ้าแก้กติกาคิดเงินต้องแก้ทั้ง resolver **และ** promptpay route
  - **ต้องเปิดใช้ TrueMoney Wallet + Rabbit LINE Pay ใน Omise Dashboard** ก่อน ไม่งั้น source creation error
  - checkout picker เป็น 5 ตัวเลือก (`grid-cols-3` wrap 2 แถว); topup modal เป็น 4 (`grid-cols-4`)

## Claude Code subagents — scribe + security-guard (dev tooling) — 2026-06-23
- **Purpose:** เพิ่ม subagent ให้ Claude Code ช่วยงาน dev — `scribe` ทำ workflow "จด" อัตโนมัติ (บันทึก feature ลง docs), `security-guard` ตรวจโค้ดกับกฎเหล็กความปลอดภัยก่อน commit
- **Location:**
  - `.claude/agents/scribe.md` (ใหม่)
  - `.claude/agents/security-guard.md` (ใหม่)
- **Inputs/Outputs:**
  - **scribe** — frontmatter `name/description/tools: Read,Edit,Grep,Glob,Bash/model: sonnet`; system prompt สั่งให้ อ่าน `git diff` + format เดิมใน `functions-log.md` → append entry ตาม format CLAUDE.md (append-only, ภาษาไทย) → อัปเดต `conventions.md`/`architecture.md` ถ้าจำเป็น; auto-delegate เมื่อผู้ใช้พิมพ์ "จด" หรือบอกว่าทำ feature เสร็จ
  - **security-guard** — frontmatter `tools: Read,Grep,Glob,Bash/model: sonnet`; read-only auditor: อ่าน `docs/security.md` + `git diff` → ตรวจ checklist (requireAdmin/requireUser, ห้าม trust userId จาก body, payment server-side, rateLimit, RLS `WITH CHECK`, jsonLdSafe, PII bucket ฯลฯ) → รายงาน ✅/❌ พร้อม `file:line` + fix จัดลำดับ 🔴/🟡; auto-delegate เมื่อแก้ route/server action/admin service/migration RLS/payment flow
- **Gotchas:**
  - **agent ที่สร้างใหม่ไม่ถูกโหลดในเซสชันที่กำลังรันอยู่** — ต้อง restart Claude Code ก่อน `scribe`/`security-guard` ถึงจะขึ้นใน available agents (เซสชันที่สร้างจะ spawn ไม่ได้ → "agent type not found")
  - **auto-delegate ไม่การันตี 100%** — ขึ้นกับว่า `description` match งานแค่ไหน; ถ้าอยากชัวร์เรียกชื่อตรง ๆ (`ใช้ scribe จด...`)
  - **subagent เริ่ม context เปล่าทุกครั้ง** — ไม่เห็นบทสนทนาก่อนหน้า เลยสั่ง prompt ให้อ่าน `git diff` + docs เองก่อนทำงาน
  - `security-guard` เป็น **read-only** — เสนอ fix เท่านั้น ไม่แก้โค้ดเองเว้นแต่ผู้ใช้สั่ง (กันแก้พลาดในขั้นตรวจ)
  - `model: sonnet` ทั้งคู่ (งาน docs/audit ไม่ต้อง opus) — ปรับได้ใน frontmatter

## LandingPage2 — ต่อข้อมูลจริงทุก section (เลิก mock) — 2026-06-25
- **Purpose:** เปลี่ยน `LandingPage2.jsx` (design handoff ที่ทุก section อ่านจาก array hardcode) ให้ดึงข้อมูลจริงจาก Supabase ครบทุกส่วน: hero, กำลังประมูลสด (sidebar), ใกล้ปิดประมูล, stats, หมวด+จำนวน, product grid, ขายแล้วล่าสุด
- **Location:**
  - Service (ใหม่): `app/services/landing.service.js` (`"use server"`) — `getRecentlySoldPublic(limit)`, `getPlatformStats()`
  - UI: `app/components/utils/LandingPage2.jsx` (รื้อ data layer + ลบ mock arrays `LIVE_ITEMS`/`ENDING_ITEMS`/`STATS`/`PRODUCTS`/`SOLD`/`PH_CLASSES`)
  - `app/services/products.service.js` — `getActiveProductsWithDetails` เพิ่ม `user_id` ใน `bids(...)` (ใช้นับ distinct bidders)
- **Inputs/Outputs:**
  - **active products** (hero/live/ending/grid/หมวด) ใช้ browser client `getActiveProductsWithDetails()` (anon อ่านได้ — RLS `public read products` state=active); derive ใน component ด้วย `useMemo` (กรอง endTime > now, sort by bids/endTime, filter ตามหมวดที่เลือก)
  - **หมวด chip** = `getParentCategories()` + นับจำนวน active ต่อ `category_id` ฝั่ง client; chip แรก "ทั้งหมด" (`id:null`) → คลิกกรอง grid
  - `getRecentlySoldPublic(limit=6)` (`supabaseAdmin`) คืน `[{ id, title, image, finalPrice, endTime }]` จาก products `state in (sold,order)` join `auction_results(final_price)` order by `auction_end_time desc`
  - `getPlatformStats()` (`supabaseAdmin`) คืน `{ totalAuctions, activeCollectors, monthlyValue, successRate, soldCount }` — count แบบ `head:true`; `monthlyValue` = ผลรวม `final_price` ของ sold/order ที่ `auction_end_time >= ต้นเดือน`; `successRate` = sold/(sold+cancelled)*100
  - countdown เดินจริงทุก 1 วิ ผ่าน state `now` (setInterval) ส่งเข้า `<Countdown endTime now>`; รูปจริงผ่าน `<Thumb image fallback>` (ไม่มีรูป → gradient `ap-ph-*` เดิม); ทุกการ์ด `<Link href="/product/{id}">`
- **Gotchas:**
  - **SOLD + STATS ต้องผ่าน server action (`supabaseAdmin`)** เพราะ RLS: `public read products` เปิดเฉพาะ `state='active'` และ `auction_results` อ่านได้แค่ winner/seller → anon/ผู้ใช้ทั่วไปอ่าน sold ไม่ได้. landing.service.js คืนเฉพาะ field public-safe (ราคา auction เป็นข้อมูลสาธารณะ ไม่มี PII) — **ไม่มี `requireUser`** (public read-only) ต่างจาก server action อื่นที่ user-gated
  - **ชื่อผู้ประมูลในการ์ดแสดงไม่ได้** — RLS ไม่เปิด `profiles` ให้ public → แสดง "N ผู้ร่วมประมูล" + avatar เปล่า (distinct จาก `bids.user_id`); ต้องมี `user_id` ใน select (เพิ่งเพิ่ม) ไม่งั้น distinct เพี้ยน
  - 2 ตัวเลขใน panel "ผู้ขาย" (`+18%` ยอดเฉลี่ย, `5.2 วัน`) ยังคง static — DB ไม่มีข้อมูล; section marketing (STEPS/TRUST/REVIEWS/FAQ) คง static
  - `page.jsx` render `<LandingPage/>` ซึ่ง render `<LandingPage2/>` ต่อท้าย → หน้าแรกมี 2 ดีไซน์ซ้อน (มีอยู่ก่อนแล้ว ไม่ได้แตะ)

## Buyer confirm receipt + วิดีโอแกะกล่อง → จัดส่งสำเร็จ — 2026-06-25
- **Purpose:** ปิด flow จัดส่ง — ผู้ซื้อ (ผู้ชนะ) กด "ยืนยันรับสินค้า" + แนบวิดีโอแกะกล่อง (optional, แนะนำภายใน 48 ชม.) → `shipping_status='delivered'` → ทั้ง 2 ฝั่งเห็นสถานะ "จัดส่งสำเร็จ"
- **Location:**
  - Migration (ใหม่): `supabase/migrations/20260625000000_shipment_receipt.sql` — `shipments` + `received_at timestamptz`, `unboxing_video_url text`
  - Service (ใหม่): `app/services/order.service.js` (`"use server"`) — `confirmReceipt({ auctionResultId, videoUrl })`
  - UI: `app/(authenticated)/user/order/page.jsx` — ปุ่มยืนยัน + อัปโหลดวิดีโอ + การ์ดสถานะ
  - `app/services/payment.service.js` — `getAuctionResultByProduct` เพิ่ม `winner_id` ใน select
- **Inputs/Outputs:**
  - `confirmReceipt({ auctionResultId, videoUrl=null })` — `requireUser()` + verify `auction_results.winner_id === user.id` + `supabaseAdmin` update `shipments(shipping_status='delivered', received_at, unboxing_video_url)` + insert `notifications(type='shipping')` ให้ seller; คืน `{ error }` (`not_found`/`forbidden`/null)
  - order page: on mount `supabase.auth.getUser()` + `getAuctionResultByProduct` → `isBuyer = currentUserId === winner_id`; ปุ่ม "ยืนยันรับสินค้า" แสดงเฉพาะ `isBuyer && shipping_status !== 'delivered'`; เลือกวิดีโอ (optional) → upload `attachments` (`uploadAttachments`+`getUrlAttachments`, ชื่อ `crypto.randomUUID().ext`) → `confirmReceipt` → set delivered ใน state
- **Gotchas:**
  - **update shipments ผ่าน server action เท่านั้น** — RLS `shipments` เปิดแค่ SELECT (buyer/seller); ผู้ซื้อ update เองผ่าน browser client ไม่ได้ → ใช้ `supabaseAdmin` หลัง verify winner เอง (pattern เดียวกับ `getBuyerShippingAddress`)
  - **product.state คงเป็น `order`** — ไม่เพิ่ม state ใหม่; "จัดส่งสำเร็จ" ขับด้วย `shipping_status='delivered'` ล้วน (map ใน `STATUS_CONFIG` order page = step 3) เพื่อไม่ต้องแตะ `mapProductState`/selling tabs
  - **48 ชม. ไม่ได้ enforce** — เป็นคำแนะนำ + เก็บ `received_at` ไว้อ้างอิง; วิดีโอ optional (RLS bucket `attachments` enforce MIME/size ฝั่ง server, client magic-byte validation ถูก bypass เพราะเรียก `uploadAttachments` ตรง)
  - **ต้องรัน migration ก่อน** ไม่งั้น update คอลัมน์ `received_at`/`unboxing_video_url` error
  - ไม่มีอะไรขยับ `preparing`→`shipped` ในระบบ (seller สร้าง shipment เป็น `preparing`) — ปุ่มยืนยันของผู้ซื้อกระโดดเป็น `delivered` ตรง (ผู้ซื้อยืนยันว่าได้รับ)

## Email OTP login — 2026-06-25
- **Purpose:** เพิ่มทางเลือกเข้าสู่ระบบด้วยรหัส OTP 6 หลักทางอีเมล (นอกจาก password/Google) — เฉพาะบัญชีที่มีอยู่แล้ว
- **Location:**
  - `app/services/auth.service.js` — `sendEmailOtp(email)`, `verifyEmailOtp(email, token)`
  - `app/(auth)/login/page.jsx` — toggle โหมด `password`/`otp`
- **Inputs/Outputs:**
  - `sendEmailOtp(email)` = `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } })` (ไม่สร้าง user ใหม่ — login เท่านั้น)
  - `verifyEmailOtp(email, token)` = `supabase.auth.verifyOtp({ email, token, type: "email" })` → มี session → `router.push("/")`
  - login page: `mode` state; โหมด otp ใช้ `useForm` แยก (`otpEmail`/`otpCode`) → ส่งรหัส (`otpSent=true`) → กรอกรหัส → ยืนยัน; มีปุ่ม "ส่งรหัสอีกครั้ง" + "ใช้รหัสผ่านแทน"
- **Gotchas:**
  - **ต้องเพิ่ม `{{ .Token }}` ใน Supabase email template** (Auth → Email Templates → Magic Link) ไม่งั้นอีเมลมีแค่ลิงก์ ไม่มีรหัส 6 หลักให้กรอก (default template ไม่มี token)
  - `shouldCreateUser:false` → กรอกอีเมลที่ไม่มีบัญชีจะ error (ตั้งใจ — หน้านี้คือ login)
  - แยก `useForm` ออกจากฟอร์ม password (yup schema บังคับ password → ถ้าใช้ control เดียวกัน `isValid` จะ false ในโหมด otp)

## Responsive — filter ฝั่งซ้ายหน้า /categories — 2026-06-25
- **Purpose:** ทำ filter sidebar หน้า `/categories` ให้ responsive — มือถือ stack เต็มกว้างด้านบน, จอใหญ่อยู่ซ้าย sticky เหมือนเดิม
- **Location:** `app/(public)/categories/CategoriesPage.jsx` (wrapper layout)
- **Inputs/Outputs:** `flex` → `flex flex-col lg:flex-row`; filter `w-1/4 sticky top-12` → `w-full lg:w-1/4 lg:sticky lg:top-12`; ฝั่ง grid เพิ่ม `min-w-0` กันล้น
- **Gotchas:**
  - ตัว `DetailSearchBox` เองเป็น `w-full grid` อยู่แล้ว (ไม่ต้องแก้ภายใน) — ปัญหาอยู่ที่ wrapper บีบเป็น 1/4 บนมือถือ
  - scope รอบนี้เฉพาะ /categories; หน้าอื่น responsive ยังเป็นงานค้าง

## Add-product UX — สินค้าแรก + KYC พร้อมกัน (คงพฤติกรรม draft) — 2026-06-25
- **Purpose:** แก้ความสับสนเคส user ใหม่สร้างสินค้าครั้งแรกพร้อมส่ง KYC → สินค้าถูกเซฟเป็น `draft` (เพราะ KYC ยังไม่ approved) แต่ user ไม่รู้ว่าต้องกลับมากดส่งตรวจหลัง KYC ผ่าน — **ไม่เปลี่ยน behavior** (ไม่ auto-submit, ไม่แตะ gate) แค่สื่อสารให้ชัด
- **Location:**
  - `app/(authenticated)/user/add-product/components/CardAddProductPreview.jsx` — banner `pending` + ส่ง flag `viaKyc`
  - `app/(authenticated)/user/add-product/components/AddProductLayout.jsx` — `onSubmit(state, opts)` เลือกข้อความ notify
- **Inputs/Outputs:**
  - KYC modal `onSubmitSaveProduct` → `onSubmit(... "draft", { viaKyc: true })`
  - `onSubmit(state, opts={})`: `pending_review` → "ส่งตรวจสอบสินค้าสำเร็จ"; `draft`+`opts.viaKyc` → ข้อความอธิบายให้กลับมากด "ส่งตรวจสอบสินค้า" อีกครั้งหลัง KYC ผ่าน; draft ปกติ → "บันทึกร่างสำเร็จ"
  - banner `pending` (`KYC_BANNER`) แก้ข้อความให้ตรงสถานการณ์เดียวกัน
- **Gotchas:**
  - **เหตุที่ค้าง draft = by design** — server `upsertProduct` reject `pending_review` ถ้า seller `is_kyc !== 'approved'` (KYC ตอนส่งเป็น `pending`); ตอน `onSubmitSaveProduct` ทำงาน prop `isKyc` ยังเป็น unknown/pending ด้วย → save draft. ทางเลือก auto-submit (ต้อง marker column) ถูกตัดออกตามที่ผู้ใช้เลือก "คงเดิม"
  - หลัง admin อนุมัติ KYC → ปุ่มหลักกลับมา enable label "การบันทึกและส่งตรวจสอบสินค้า" → กดเองเพื่อ `pending_review`

## Proxy middleware — fix session หลุดตอน soft-navigate หลัง login — 2026-06-26
- **Purpose:** แก้บั๊ก login เสร็จแล้วกดปุ่มเข้า `/user/add-product` (หรือ `/user/*`, `/checkout`, `/payment`, `/order` ใดๆ) ครั้งแรก → โดนเด้งกลับ `/login` ทั้งที่ login แล้ว; reload เต็มหน้าเข้าได้ปกติ
- **Location:** `proxy.js` (Next 16 middleware)
- **Inputs/Outputs:**
  - `NextResponse.next()` → `NextResponse.next({ request: req })`
  - `setAll` เดิมเขียน cookie แค่ลง `response` → เปลี่ยนเป็นเขียนลงทั้ง `req.cookies` (ใช้ต่อใน middleware) และสร้าง `response` ใหม่จาก request แล้วเซ็ต cookie ลง response (ส่งกลับ browser)
  - เพิ่ม helper `redirectTo(path)` → `NextResponse.redirect` + copy `response.cookies.getAll()` ลง redirect ทุกครั้ง; ใช้แทน `NextResponse.redirect` ตรงๆ ทั้ง 4 จุด (login→/admin, admin guard→/login, non-admin→/, authed guard→/login)
- **Gotchas:**
  - **ต้นเหตุ:** หลัง login (client `signInWithPassword`) soft-navigate เข้า `/user/*` ครั้งแรก SSR client หมุน (refresh) token → cookie ใหม่ถูกเซ็ตลง `response` แต่ `NextResponse.redirect` เดิมสร้าง response ใหม่ที่ **ทิ้ง cookie ที่ refresh แล้ว** → `getUser()` รอบถัดไปคืน `null` → เด้ง login; reload เต็มหน้า browser อ่าน cookie ที่ลงตัวแล้วเลยผ่าน
  - **กฎ Supabase SSR middleware:** ต้องเขียน cookie ที่ refresh ลงทั้ง request + response และ redirect ทุกตัวต้อง copy cookie ไปด้วย ไม่งั้น session race หลุด
  - หน้า `/` ไม่อยู่ใน `matcher` → ไม่ผ่าน middleware (ครั้งแรกที่เจอ middleware คือตอนเข้า protected path ครั้งแรก = จุดที่เคยพัง)
  - ปัญหาอยู่ที่ middleware ล้วน — หน้า add-product/layout ไม่มี client-side redirect ไป login
