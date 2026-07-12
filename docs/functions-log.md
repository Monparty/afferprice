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

## CardProductBid — KYC pending ไม่เปิด modal ซ้ำ — 2026-07-02
- **Purpose:** แก้ UX ปุ่มประมูลตอน KYC สถานะ `pending` — เดิมกดปุ่มเปิด `KycVerificationForm` modal ซ้ำได้เรื่อยๆ ทั้งที่ส่งไปรอตรวจแล้ว
- **Location:** `app/components/utils/CardProductBid.jsx`
- **Inputs/Outputs:**
  - `isKycPending = userData?.is_kyc === "pending"`
  - เมื่อ `needKyc && isKycPending` → ปุ่ม label เปลี่ยนเป็น "รอตรวจสอบการยืนยันตัวตน" + `disabled` + `onClick={undefined}` (ไม่เปิด modal)
  - สถานะ `unknown`/`rejected` (เข้า `needKyc` เหมือนกันแต่ `isKycPending` false) ยังเปิด `KycVerificationForm` modal ตามเดิม
- **Gotchas:**
  - เช็คแยกจาก `needKyc` เดิม (`needKyc` แค่บอกว่ายัง `!== 'approved'`) — `isKycPending` เป็นเงื่อนไขซ้อนเพื่อแยก UI ระหว่าง "ยังไม่เคยส่ง" กับ "ส่งแล้วรอ admin"
  - ไม่ได้แตะ logic guard ใน `onSubmit` (ที่กัน insert bid ซ้ำถ้า `is_kyc !== 'approved'`) — เปลี่ยนแค่ฝั่ง UI ปุ่ม

## Bid deposit — เงินมัดจำ 20% ก่อนประมูลครั้งแรก — 2026-07-02
- **Purpose:** ผู้ประมูลคนแรกที่จะ bid สินค้าแต่ละชิ้นต้องวางมัดจำ 20% ของราคาปัจจุบัน (ตัดจาก **wallet เท่านั้น**) ก่อนจึงจะ bid ได้ — กันคนตั้งราคาแล้วหนีไม่จ่าย; แพ้ประมูล → คืนเงินเข้า wallet อัตโนมัติตอน `/api/auction/end`; ชนะ → มัดจำถูก mark `applied` แล้วหักออกจากยอดชำระค่าประมูลทุกช่องทาง (promptpay/wallet/credit-card/truemoney/linepay)
- **Location:**
  - Migration (ใหม่): `supabase/migrations/20260702000000_bid_deposits.sql` — ตาราง `bid_deposits`, `UNIQUE(auction_results.product_id)`, RPC `place_bid_deposit`/`refund_bid_deposit`, `CREATE OR REPLACE validate_bid` (เพิ่มเช็ค deposit)
  - Route (ใหม่): `app/api/bid/deposit/route.js` — `POST { productId }`
  - Service (ใหม่): `app/services/deposits.service.js` — `getMyBidDeposit(productId)`, `placeBidDeposit(productId)`
  - `app/api/auction/end/route.js` — step ใหม่ mark applied / refund deposit ที่เหลือ
  - `app/lib/payment/resolveAmount.js` — export `DEPOSIT_RATE=0.2` + `getAppliedDepositAmount(userId, productId)`
  - `app/api/payment/promptpay/route.js`, `app/api/payment/wallet/charge/route.js` — หักมัดจำแบบเดียวกัน (inline ตาม convention เดิมของ promptpay)
  - `app/services/payment.service.js` — `getAuctionResultById` เพิ่ม `product_id` ใน select
  - `app/components/utils/CardProductBid.jsx` — เพิ่ม gate วางมัดจำ (ระหว่าง KYC gate กับปุ่ม bid จริง)
  - `app/(authenticated)/user/checkout/[id]/page.jsx`, `app/(authenticated)/user/payment/[id]/page.jsx` — แสดงบรรทัดหักมัดจำ + total หักแล้ว
  - `app/utils/supabaseErrorMap.js` — เพิ่ม `deposit_required`/`already_deposited`/`insufficient_balance`/`deposit_not_found`
- **Inputs/Outputs:**
  - `place_bid_deposit(p_user_id, p_product_id)` (RPC, SECURITY DEFINER, service_role only) — lock product `FOR UPDATE`, ตรวจ `state='active'` + ยังไม่หมดเวลา + ไม่ใช่ seller + **`profiles.is_kyc='approved'`** + ยังไม่เคยวางมัดจำ (`UNIQUE(product_id,user_id)`); ราคาปัจจุบัน = `COALESCE(MAX(bids.bid_price), start_price)` (สูตรเดียวกับ `validate_bid`); `v_amount = GREATEST(1, ROUND(current * 0.20))`; ตัด `profiles.wallet_balance` + insert `bid_deposits(status='held')` + `wallet_transactions(type='payment', note='bid deposit')`; คืน `{ deposit_id, amount, balance_after }`
  - `refund_bid_deposit(p_deposit_id)` (RPC) — idempotent: คืนเงินเฉพาะ row ที่ `status='held'` (ภายใต้ `FOR UPDATE`); เรียกซ้ำคืน `{ already_processed: true, status }` เฉยๆ ไม่ credit ซ้ำ; credit `wallet_balance` + insert `wallet_transactions(type='refund')` + update `status='refunded'`
  - `POST /api/bid/deposit` body `{ productId }` — `requireUser()` + `rateLimit(5/min, key 'bid-deposit')` (เท่า wallet/charge เพราะตัดเงินทันที) → เรียก `place_bid_deposit` RPC → broadcast `wallet-{userId}` (payload ว่าง) → คืน `{ deposit_id, amount, balance_after }` หรือ `{ error }`
  - `getMyBidDeposit(productId)` (browser client) → `bid_deposits` row ของตัวเอง (`id, amount, status`) หรือ `null` — RLS `"own deposit read"` กรองอัตโนมัติ
  - `getAppliedDepositAmount(userId, productId)` (`resolveAmount.js`, ใช้ `supabaseAdmin`) → ยอด deposit ที่ `status='applied'` (0 ถ้าไม่มี) — ใช้ลบออกจาก `amount = Math.max(1, round(final_price*1.05) - deposit)` ใน resolver (ครอบ credit-card + omise route อัตโนมัติ) และ inline ใน promptpay/wallet-charge
  - `CardProductBid`: gate chain ใหม่ = login → KYC (`needKyc`) → **`needDeposit`** (`!isSeller && !needKyc && !hasDeposit`) → ปุ่ม bid จริง. `needDeposit` → ปุ่ม "วางเงินมัดจำ 20% (฿X)"; ถ้า `walletBalance < depositAmount` → label "เติมเงินเพื่อวางมัดจำ" กดแล้ว push `/user/wallet` แทนการเรียก deposit; วางสำเร็จ (`hasDeposit`) → ข้อความเขียว "วางเงินมัดจำแล้ว ฿X" เหนือปุ่ม bid; `onSubmit` มี guard ซ้ำ `deposit?.status !== "held"` → `notifyError({message:"deposit_required"})`
  - checkout/payment page: `depositApplied = deposit?.status === "applied" ? Number(deposit.amount) : 0` → แสดงบรรทัด "หักเงินมัดจำที่วางไว้ −฿X" + `total = Math.max(0, ... - depositApplied)`
- **Gotchas:**
  - **ต้องรัน migration `20260702000000_bid_deposits.sql` ก่อนใช้งาน** — ไม่งั้นทั้ง `validate_bid` (DB gate) และ RPC `place_bid_deposit`/`refund_bid_deposit` ไม่มี → bid จะพังหรือไม่ถูก gate เลย
  - **มัดจำ fix ที่ 20% ของราคา ณ ตอนวาง ไม่ขยับตามราคาที่บิดขึ้นภายหลัง** — เป็น product decision ที่เปิดไว้ (อาจต้องบังคับ top-up มัดจำเพิ่มในอนาคตถ้าราคาสูงขึ้นมาก แต่ยังไม่ทำ)
  - ยอดที่ client แสดง (`Math.round(currentPrice*0.2)` ใน `CardProductBid`) เป็นแค่ display เพื่อโชว์ตัวเลขคร่าวๆ — ยอดจริงคำนวณใน RPC ฝั่ง DB เสมอ (กัน client ส่งค่าปลอม เพราะ RPC ไม่รับ amount จาก client)
  - **`auction_results` เพิ่ม `UNIQUE(product_id)`** เพื่อกัน `/api/auction/end` ถูกยิงซ้ำพร้อมกัน (เช่น 2 tab timer หมดพร้อมกัน) แล้ว insert `auction_results` ซ้ำ/เงินมัดจำถูกจัดการ 2 รอบ — ถ้า insert ชน unique จะ `return { ended: true }` ทันทีโดยไม่ทำ step คืนมัดจำซ้ำ (invocation แรกที่ insert สำเร็จเป็นคนจัดการมัดจำแต่ผู้เดียว)
  - **webhook Omise ไม่ต้องแก้อะไร** — `payments` row insert ด้วยยอด **net หลังหักมัดจำแล้ว** (เท่ากับยอด charge ที่สร้างจริง) ดังนั้น amount verification ใน webhook (`payment.amount === charge.amount/100`) ยัง match ปกติ
  - **resolver ยังไม่ย้าย promptpay** (ตาม convention เดิมของไฟล์นี้) — `promptpay` + `wallet/charge` route หักมัดจำแบบ inline คนละที่กับ `resolveAmount.js`; แก้กติกาหักมัดจำ/ค่าธรรมเนียมต้องแก้ทั้ง 3 จุด (`resolveAmount.js`, `promptpay/route.js`, `wallet/charge/route.js`)
  - มีช่วงเสี้ยววินาทีระหว่าง insert `auction_results` กับ mark `bid_deposits.status='applied'` ใน `/api/auction/end` (non-atomic, เป็น loop JS ไม่ใช่ transaction เดียว) — ถ้า client เข้าหน้า payment พอดีช่วงนั้นอาจเห็นยอดยังไม่หักมัดจำชั่วครู่ แต่จะถูกต้องหลัง loop จบเสมอ (ไม่กระทบเงินจริงเพราะ RPC ฝั่ง server เป็นคน mark)
  - `refund_bid_deposit` ครอบคลุมทั้งคนที่แพ้ประมูล **และ** คนที่วางมัดจำไว้แต่ไม่เคย bid จริง (deposit ค้าง `held` เฉยๆ) — loop ใน `/api/auction/end` ดึงทุก `held` deposit ของ product แล้วคืนให้ทุกคนที่ไม่ใช่ผู้ชนะ
  - ผ่าน `security-guard` audit แล้ว: ไม่มีข้อ 🔴; แก้ 🟡 ไปแล้ว 3 ข้อระหว่างทำ — เพิ่ม KYC check ใน `place_bid_deposit` RPC (กัน user KYC ไม่ผ่านมาล็อกเงินตัวเองทั้งที่ bid จริงไม่ได้), เพิ่ม `UNIQUE(auction_results.product_id)` + bail-out เมื่อ insert ชน, ปรับ rate limit เป็น 5/min (เดิมไม่มี/หลวมกว่านี้)
  - `npm run build` ผ่านหลังแก้ครบ

## Payment deadline + forfeit มัดจำ — ผู้ชนะไม่จ่ายตามกำหนด — 2026-07-03
- **Purpose:** ปิด loop มัดจำ — ผู้ชนะมีเวลา **3 วัน** หลังปิดประมูลเพื่อชำระค่าประมูล; ถ้าไม่จ่ายทัน → ยกเลิกผลประมูล (`payment_status='canceled'`) + **ริบมัดจำ** (`bid_deposits.status='forfeited'` เงินไม่คืน = ค่าปรับ) + product กลับเป็น `cancelled` + แจ้งเตือน 2 ฝั่ง
- **Location:**
  - Migration (ใหม่): `supabase/migrations/20260702100000_payment_deadline.sql` — `auction_results.payment_due_at`, `bid_deposits` เพิ่มสถานะ `forfeited` + `forfeited_at`, RPC `expire_unpaid_auction`, **`CREATE OR REPLACE charge_wallet`** (เพิ่ม lock+guard)
  - Route (ใหม่): `app/api/auction/expire-unpaid/route.js` — `POST { auctionResultId }`
  - `app/api/auction/end/route.js` — set `payment_due_at = now + 3 วัน` ตอน insert `auction_results`
  - Service: `app/services/products.service.js` — `expireUnpaidWonAuctions()` (reconcile) + เพิ่ม `payment_due_at` ใน select ของ `getProductsByState`/`getWonProductsByUser`/`getOrderProductsWonByUser`; `app/services/payment.service.js` — `getAuctionResultByProduct`/`getAuctionResultById` เพิ่ม `payment_due_at`
  - UI: `app/(authenticated)/user/selling/page.jsx` (เรียก reconcile + ส่ง `paymentDueAt`), `app/components/utils/CardSellingProduct.jsx` (countdown deadline), `app/(authenticated)/user/checkout/[id]/page.jsx` (banner + ล็อกปุ่มเมื่อเลยกำหนด)
  - Enforce ฝั่ง server: `app/lib/payment/resolveAmount.js` (auction branch), `app/api/payment/promptpay/route.js`, `app/api/payment/wallet/charge/route.js` (เช็ค `canceled`/`payment_due_at`), `app/api/payment/webhook/route.js` (flip `pending→paid` เท่านั้น)
  - `app/utils/supabaseErrorMap.js` — เพิ่ม `payment_expired`/`auction_canceled`
- **Inputs/Outputs:**
  - `expire_unpaid_auction(p_auction_result_id)` (RPC, SECURITY DEFINER, service_role only) — lock `auction_results` `FOR UPDATE`; idempotent (`payment_status<>'pending'` → `{already_processed,status}`); ยังไม่ครบกำหนด (`payment_due_at IS NULL OR > now()`) → `{not_due:true}`; มิฉะนั้น set `canceled` + ริบมัดจำผู้ชนะ (`applied`/`held`→`forfeited`+`forfeited_at`) + product `sold→cancelled` → คืน `{expired,winner_id,seller_id,product_id,deposit_amount}`
  - `POST /api/auction/expire-unpaid` — `rateLimit(30/min)`, **ไม่มี requireUser** (guard อยู่ใน RPC ทั้งหมด เหมือน `/api/auction/end`); ถ้า `expired` → insert notifications (`type='payment'`) ให้ winner (ริบมัดจำ) + seller (ผู้ซื้อไม่จ่าย)
  - `expireUnpaidWonAuctions()` (browser client) — หา `auction_results` `payment_status='pending'` + `payment_due_at < now` ทั้งฝั่งผู้ชนะ (`winner_id`) และผู้ขาย (`products!inner.seller_id`) แล้ว POST expire ทีละตัว; คืน `{expired: count}` — เรียกตอน mount `/user/selling` คู่กับ `endExpiredActiveAuctions()`
  - `CardSellingProduct`: `payDeadline` = countdown ของ `value.paymentDueAt` (`formatCountdown`, tick 1s) — แสดงใต้ tag "รอผู้ซื้อชำระเงิน" (seller) และใต้ปุ่ม "ชำระเงิน" (buyer); เลยกำหนด → "เลยกำหนดชำระเงินแล้ว" สีแดง
  - checkout: `payExpired = !isPaid && payDueAt < now` → banner ส้ม/แดง + ปุ่มเปลี่ยนเป็น "เลยกำหนดชำระเงิน" `disabled`
- **Gotchas:**
  - **ต้องรัน migration `20260702100000_payment_deadline.sql` ก่อน** — ไม่งั้น `payment_due_at`/`expire_unpaid_auction`/สถานะ `forfeited` ไม่มี → reconcile พังหรือ update column error
  - **backfill ผ่อนผัน 3 วันจากตอน migrate** (`payment_due_at = now() + interval '3 days'` ให้ทุก pending เดิม) — ไม่ริบย้อนหลังทันทีตอน deploy
  - **มัดจำที่ริบตอนนี้ platform เก็บไว้** (เงินถูกตัดจาก wallet ผู้ชนะตั้งแต่ตอนวางแล้ว, forfeit = แค่เปลี่ยน status ไม่ move เงิน) — **ยังไม่ credit ให้ผู้ขาย** (จะทำตอน seller payout) [[seller-payout]]
  - **ปิด TOCTOU race กับ payment 2 จุด** (money-correctness):
    1. `charge_wallet` เดิมไม่ lock/เช็ค `auction_results` เลย → ถ้า expire แทรกกลางระหว่าง route SELECT กับ RPC ผู้ชนะอาจโดนตัดค่าประมูล **และ** ริบมัดจำพร้อมกัน. แก้ด้วย `CREATE OR REPLACE charge_wallet` เพิ่ม `SELECT ... FOR UPDATE` auction_results + เช็ค `paid`/`canceled`/`payment_due_at` (serialize กับ `expire_unpaid_auction` ที่ lock row เดียวกัน)
    2. webhook เดิม set `auction_results='paid'` แบบไม่มีเงื่อนไข → charge async (promptpay/บัตร/redirect) ที่สำเร็จหลัง auction ถูก cancel จะปลุกกลับเป็น paid. แก้เป็น `.eq("payment_status","pending")` (flip เฉพาะ pending→paid); ถ้า 0 row → log error (charge สำเร็จบน auction ที่ยกเลิกแล้ว = ต้อง refund มือ — รอ refund infra)
  - **การ enforce deadline อยู่ 4 จุด** — resolver (ครอบ credit-card+omise), promptpay route (inline), wallet route (inline) + `charge_wallet` RPC (ชั้นลึกสุด); แก้กติกา deadline ต้องดูให้ครบ (pattern เดียวกับ deposit ที่กระจาย 3 จุด)
  - **ไม่มี server cron** — expire พึ่ง client เปิด `/user/selling` เหมือน end-auction (ค้างได้ถ้าไม่มีใครเปิด) [[server-cron]]
  - หลัง expire product เป็น `cancelled` → หายจาก won tab ผู้ซื้อ (filter `sold`) + ไปโผล่ cancelled tab ผู้ขาย; ผู้ซื้อรู้ผ่าน notification
  - `npm run build` ผ่าน

## Seller payout — เครดิตเงินขายเข้า wallet ผู้ขาย — 2026-07-03
- **Purpose:** ปิดวงจรเงินไปหาผู้ขาย — ผู้ซื้อชำระค่าประมูลสำเร็จ → ผู้ขายได้ `final_price` เข้า wallet อัตโนมัติ (platform เก็บค่าธรรมเนียม 5% + listing fee); ผู้ซื้อผิดนัด (forfeit) → มัดจำที่ริบ credit ให้ผู้ขายเป็นค่าชดเชย
- **Location:**
  - Migration (ใหม่): `supabase/migrations/20260703000000_seller_payout.sql` — เพิ่ม type `'sale'`/`'withdrawal'` ใน `wallet_transactions_type_check` + RPC `credit_seller_proceeds` + `CREATE OR REPLACE expire_unpaid_auction` (เพิ่ม seller compensation)
  - Lib (ใหม่): `app/lib/payment/sellerPayout.js` — `settleSellerProceeds(auctionResultId)`
  - `app/api/payment/wallet/charge/route.js` (เรียกหลัง charge สำเร็จ) + `app/api/payment/webhook/route.js` (เรียกหลัง flip paid) + `app/api/auction/expire-unpaid/route.js` (broadcast seller หลัง forfeit)
  - `app/(authenticated)/user/wallet/page.jsx` + `app/admin/wallet/page.jsx` — label/สี type `sale`/`withdrawal`
- **Inputs/Outputs:**
  - `credit_seller_proceeds(p_auction_result_id)` (RPC, SECURITY DEFINER, service_role) — lock `auction_results` `FOR UPDATE`; ต้อง `payment_status='paid'`; idempotent (`EXISTS wallet_transactions WHERE reference_id=auction_result_id AND type='sale'`); credit `final_price` เข้า wallet ผู้ขาย + insert `wallet_transactions(type='sale')` → คืน `{seller_id, amount, balance_after}`
  - `settleSellerProceeds(auctionResultId)` — เรียก RPC; ถ้า credit ใหม่ (ไม่ใช่ already_credited/skipped) → broadcast `wallet-{seller}` + notify ผู้ขาย
  - `expire_unpaid_auction` — หลัง forfeit มัดจำ ถ้า `deposit_amount > 0` → credit ให้ผู้ขาย + `wallet_transactions(type='sale', note='forfeited deposit compensation')`
- **Gotchas:**
  - **ต้องรัน migration `20260703000000_seller_payout.sql`** — ไม่งั้น type `sale`/`withdrawal` insert ไม่ผ่าน constraint + RPC ไม่มี
  - **ผู้ขายได้ `final_price` เท่านั้น** — **ค่าจัดส่ง (shipping_fee) + ค่าธรรมเนียม 5% platform เก็บ** (open decision: ยังไม่ reimburse ค่าส่งให้ผู้ขายทั้งที่ผู้ขายเป็นคนส่งเอง — เปลี่ยนได้ทีหลังเป็น 1 บรรทัดใน RPC หลังมี column shipping_fee)
  - **idempotent ต่อ auction_result** ผ่าน `reference_id + type='sale'` — paid (final_price) กับ forfeit (deposit compensation) exclusive กัน (paid vs canceled คนละสถานะ) จึงไม่มี double 'sale'
  - เงินขายเข้า wallet ผู้ขาย → ถอนออกผ่าน withdrawal flow [[wallet-withdrawal]]
  - `npm run build` ผ่าน

## Wallet withdrawal — ถอนเงินจาก wallet เข้าบัญชีธนาคาร — 2026-07-03
- **Purpose:** ผู้ใช้ (ผู้ขายที่มียอด wallet) ถอนเงินเข้าบัญชีธนาคารที่ให้ไว้ตอน KYC — ตัด wallet ทันทีตอนขอ (ล็อกเงิน) → admin ตรวจ+โอนจริง mark `paid` หรือปฏิเสธ `rejected` (คืนเงิน)
- **Location:**
  - Migration (ใหม่): `supabase/migrations/20260703010000_wallet_withdrawal.sql` — ตาราง `withdrawal_requests` + RLS own-read + RPC `request_withdrawal`/`process_withdrawal`
  - Route (ใหม่): `app/api/wallet/withdraw/route.js` — `POST { amount }`
  - Service: `app/services/wallet.service.js` — `getMyWithdrawals()`, `requestWithdrawal(amount)`; `app/services/admin/withdrawals.service.js` (ใหม่) — `getWithdrawals()`, `processWithdrawal(id, action, note)`
  - UI: `app/(authenticated)/user/wallet/page.jsx` (ปุ่ม+`WithdrawModal`+รายการคำขอ); Admin page ใหม่ `app/admin/withdrawals/page.jsx` + `routes.js` `ADMIN_WITHDRAWALS` + menu ใน `AdminLayout` + badge ใน `badges.service.js`
  - `app/utils/supabaseErrorMap.js` — `invalid_withdrawal_amount`/`bank_account_required`/`kyc_not_approved`
- **Inputs/Outputs:**
  - `request_withdrawal(p_user_id, p_amount)` (RPC) — lock profiles; guard `amount >= 100` + KYC approved + มี `bank_account_no` + `balance >= amount`; ตัด wallet + insert `withdrawal_requests(pending, snapshot bank_*)` + `wallet_transactions(type='withdrawal', -amount)` → `{withdrawal_id, amount, balance_after}`
  - `process_withdrawal(p_withdrawal_id, p_action, p_note)` (RPC) — idempotent (เฉพาะ `pending`); `paid` → set status; `rejected` → คืนเงิน + `wallet_transactions(type='refund')`
  - `POST /api/wallet/withdraw` — `requireUser` + `rateLimit(5/min)` → RPC + broadcast `wallet-{user}`
  - admin `processWithdrawal` (`requireAdmin`) → RPC + notify ผู้ใช้ + broadcast (rejected)
- **Gotchas:**
  - **ต้องรัน migration `20260703010000_wallet_withdrawal.sql`** — ต้องมาหลัง `20260703000000` (ต้องการ type `withdrawal` ใน constraint)
  - **ตัดเงินทันทีตอนขอ** (ล็อกเงิน กันถอนซ้ำ/ใช้เงินที่ขอถอนไปแล้ว) — reject → คืน; ไม่มี real bank transfer integration → admin โอนมือแล้ว mark `paid`
  - badge `/admin/withdrawals` นับ `status='pending'` (เพิ่ม entry ใน `BADGE_SOURCES`)
  - `npm run build` ผ่าน

## Server cron — reconcile ประมูลฝั่ง server + refactor shared lib — 2026-07-03
- **Purpose:** เลิกพึ่ง client เปิด `/user/selling` อย่างเดียว — เพิ่ม cron endpoint reconcile ทั้งระบบ (ปิดประมูลหมดเวลา + ยกเลิกผลที่ผู้ชนะไม่จ่าย) + refactor logic ซ้ำออกเป็น shared lib
- **Location:**
  - Lib (ใหม่): `app/lib/auction/reconcile.js` — `endAuction(productId)`, `expireUnpaidAuction(auctionResultId)`, `reconcileAll()`
  - Route (ใหม่): `app/api/cron/reconcile/route.js` — `GET|POST`, auth ด้วย `CRON_SECRET`
  - Refactor: `app/api/auction/end/route.js` + `app/api/auction/expire-unpaid/route.js` → เรียก shared lib (logic ย้ายไป `reconcile.js`)
  - Docs: `docs/commands.md` — วิธีตั้ง cron
- **Inputs/Outputs:**
  - `reconcileAll()` — หา products `state='active'` `auction_end_time<now` → `endAuction` ทีละตัว; หา `auction_results` `pending` `payment_due_at<now` → `expireUnpaidAuction` ทีละตัว → `{endedCount, expiredCount}`
  - `GET|POST /api/cron/reconcile` — ต้องตั้ง env `CRON_SECRET` (ไม่ตั้ง → 501); auth `Authorization: Bearer <secret>` หรือ `?key=<secret>` → เรียก `reconcileAll()`
- **Gotchas:**
  - **ต้องตั้ง env `CRON_SECRET`** + external scheduler (Vercel Cron/cron-job.org/GitHub Actions) เรียกทุก ~10 นาที (ดู `docs/commands.md`); ไม่มี `vercel.json` ในโปรเจกต์ (ยังไม่ผูก Vercel)
  - client reconcile เดิม (selling mount) **ยังอยู่** — cron เป็น safety net
  - **refactor ลด duplication** — logic auction end/expire อยู่ที่ `reconcile.js` ที่เดียว (route + cron เรียกซ้ำได้); `endAuction`/`expireUnpaidAuction` คืน `{error, status}` ให้ route wrap เป็น NextResponse
  - `npm run build` ผ่าน

## Persist checkout shipping — ที่อยู่+ค่าจัดส่งลง auction_results — 2026-07-03
- **Purpose:** แก้ปัญหาที่ checkout เลือกที่อยู่+รูปแบบจัดส่งแล้วไม่ persist → payment page/charge คิดยอดไม่รวมค่าส่ง + ผู้ขาย/แอดมินเห็นแค่ default address (อาจส่งผิดที่)
- **Location:**
  - Migration (ใหม่): `supabase/migrations/20260703020000_persist_checkout_shipping.sql` — `auction_results` เพิ่ม `address_id`/`shipping_option`/`shipping_fee`
  - Service: `app/services/checkout.service.js` — `saveCheckoutShipping()` (ใหม่) + `getBuyerShippingAddress` ใช้ persisted address ก่อน; `app/services/payment.service.js` `getAuctionResultById` เพิ่ม `shipping_fee`; `app/services/admin/bids.service.js` `getSoldOrderDetail` ใช้ persisted address
  - UI: `app/(authenticated)/user/checkout/[id]/page.jsx` (ปุ่มยืนยัน → `saveCheckoutShipping` ก่อน push payment), `.../payment/[id]/page.jsx` (แสดง+รวมค่าส่งใน total)
  - Payment amount: `resolveAmount.js` + `promptpay` + `wallet/charge` route เพิ่ม `+ shipping_fee`
- **Inputs/Outputs:**
  - `saveCheckoutShipping(auctionResultId, addressId, shippingOption)` (`"use server"`, user-gated) — verify `winner_id===user.id` + address เป็นของ user; ค่าจัดส่งจาก `SHIPPING_FEES` server-side (`express:80/standard:40/pickup:0`) → update `auction_results`; guard `payment_status!=='paid'`
  - ยอดชำระทุกช่องทาง = `max(1, round(final*1.05) + shipping_fee − applied_deposit)`
- **Gotchas:**
  - **ต้องรัน migration `20260703020000`** ก่อน — ไม่งั้น select/update `shipping_fee`/`address_id` error
  - **`SHIPPING_FEES` (server) ต้องตรงกับ `SHIPPING_OPTIONS` (checkout page display)** — คนละที่ ถ้าแก้ราคาต้องแก้ทั้งคู่
  - **ค่าส่งถูกเก็บใน column แล้ว** — payment routes อ่าน `shipping_fee` ตรง ไม่ต้อง re-derive (ยอดตรงกันทุกจุด client/server; กัน wallet balance check เพี้ยน)
  - เดิม shipping ไม่ถูก charge เลย (payment page ทิ้งค่าส่ง) — ตอนนี้ charge ตาม intent ที่ checkout แสดงไว้
  - **seller ship mode ไม่เรียก `saveCheckoutShipping`** (ปุ่มเป็น `setShowShipmentForm`) — เฉพาะ buyer path เท่านั้น
  - `npm run build` ผ่าน

## Local Supabase test environment — squash schema + local dev — 2026-07-03
- **Purpose:** ตั้ง environment ทดสอบแยกจาก production 100% — รัน Supabase stack เต็มบนเครื่อง (Docker) เพื่อเทสต์ DB/RLS/RPC/Storage โดยไม่แตะข้อมูลจริง; รวม migration ให้เหลือไฟล์เดียวที่เป็นโครงสร้างล่าสุด
- **Location:**
  - `supabase/migrations/20260703040000_schema.sql` (ใหม่ — squash ไฟล์เดียว) — โครงสร้างเต็มปัจจุบัน
  - `supabase/config.toml` (ใหม่ จาก `supabase init`) — ตั้ง `[analytics] enabled = false`
  - `.env.local` → ชี้ local (`127.0.0.1:54321`); `.env.local.prod.bak` → สำรอง prod (gitignored ทั้งคู่ผ่าน `.env*`)
  - **ลบ:** `schema.sql` (root เดิม) + migrations เก่า 30 ไฟล์ทั้งหมด
  - คำสั่งใช้งานทั้งหมด → [commands.md](commands.md#local-supabase-test-env)
- **สิ่งที่ทำ / Inputs-Outputs:**
  - รวม migrations ทั้งหมด → 1 ไฟล์: `supabase db dump` จาก remote prod (public schema เต็ม) + เติม storage buckets/policies (`id-cards` + `attachments`) เขียนมือต่อท้าย เพราะ `db dump` ไม่ดึง `storage` schema
  - `supabase start` apply ผ่าน exit 0 → verify: 16 tables (รวม `bid_deposits`/`withdrawal_requests`), 13 RPC, buckets `attachments`+`id-cards`, 28 public + 9 storage policies
- **Gotchas:**
  - **analytics ต้องปิดบน Windows** — container `supabase_analytics` unhealthy → `supabase start` exit 1 ถ้าไม่ปิด (ต้อง expose Docker daemon บน `tcp://localhost:2375` ไม่งั้นพัง); ปิด `enabled=false` คือ workaround มาตรฐาน — migration ไม่เกี่ยว
  - **`db dump` ไม่ดึง `storage` schema** — bucket/policy ต้องเติมเองในไฟล์ squash; `attachments` เปลี่ยน `UPDATE`→`INSERT ... ON CONFLICT` เพื่อให้ env ใหม่สร้าง bucket ได้ (ของเดิม assume bucket ถูกสร้างมือใน dashboard)
  - **⚠️ ห้าม `supabase db push` ไฟล์ squash ขึ้น remote prod เดิม** — prod apply migration เก่าไปหมดแล้ว (มี history ใน `schema_migrations`) → push squash จะชน/ซ้ำ; squash ใช้กับ **local / โปรเจกต์ใหม่** เท่านั้น
  - **local DB ว่างเปล่า** — ไม่มี seed/admin/หมวดหมู่; สมัคร user แล้ว promote admin เอง (ทั้ง `profiles.role` + `auth.users.raw_app_meta_data`) หรือทำ `supabase/seed.sql`
  - CLI ไม่ได้ลง global → เรียกผ่าน `npx supabase ...`; ต้องเปิด Docker Desktop ก่อนทุกคำสั่ง supabase local
  - โครงสร้างใหม่หลังจากนี้ = migration ไฟล์ใหม่ต่อจาก squash (`npx supabase migration new <name>`) — อย่าแก้ไฟล์ squash

## เงินค่าประกันการขาย — refund listing fee เมื่อการขายไม่สำเร็จ + rename — 2026-07-04
- **Purpose:** เปลี่ยนความหมาย listing fee 5% จาก "ค่าธรรมเนียม" (platform เก็บเสมอ) เป็น **"เงินค่าประกันการขาย"** — คืนเข้า wallet ผู้ขายอัตโนมัติเมื่อการขายไม่สำเร็จ 2 เคส: ① ไม่มีคน bid จนหมดเวลา (`endAuction` → `cancelled`) ② ผู้ชนะไม่ชำระเงินตามกำหนด (`expire_unpaid_auction` → `cancelled`); ขายสำเร็จ → platform เก็บเหมือนเดิม; state lifecycle ไม่เปลี่ยน + rename คำใน UI ทุกจุดที่หมายถึง listing fee
- **Location:**
  - Migration (ใหม่): `supabase/migrations/20260704000000_refund_listing_fee.sql` — RPC `refund_listing_fee(p_product_id)`
  - `app/lib/auction/reconcile.js` — helper `refundListingFee(productId)` + call site ใน `endAuction` (branch `!winningBid`) และ `expireUnpaidAuction` (หลัง `data.expired`)
  - Rename UI: `app/(authenticated)/user/add-product/components/AddProductForm.jsx` (step 3 + เพิ่มคำอธิบาย "ได้รับคืนเข้ากระเป๋าเงินหากการขายไม่สำเร็จ"), `AddProductSteps.jsx`, `CardAddProductPreview.jsx`, `app/components/payment/WalletListingBtn.jsx`, `app/admin/products/components/Form.jsx` (การ์ด + tooltip ปุ่มอนุมัติ), `app/admin/settings/page.jsx`
- **Inputs/Outputs:**
  - `refund_listing_fee(p_product_id)` (RPC, SECURITY DEFINER, **service_role เท่านั้น** — REVOKE anon/authenticated) — หา `payments` `purpose='listing_fee'` + `payment_status='success'` ล่าสุดของ product → lock `FOR UPDATE` (serialize การเรียกซ้ำพร้อมกัน) → idempotent ผ่าน `EXISTS wallet_transactions WHERE reference_id=payment.id AND type='refund'` → credit `wallet_balance` ผู้ขาย + insert `wallet_transactions(type='refund', note='listing fee refund')` → คืน `{refunded, seller_id, amount, balance_after}` หรือ `{no_payment}`/`{already_processed}`
  - `refundListingFee(productId)` (reconcile.js) — เรียก RPC; ถ้า `refunded` → insert `notifications(type='payment', "คืนเงินค่าประกันการขายแล้ว")` + broadcast `wallet-{seller}`
- **Gotchas:**
  - **ต้องรัน migration `20260704000000` ก่อน** — ไม่งั้น RPC ไม่มี → refund fail เงียบ (log error แต่ auction จบปกติ)
  - **idempotent ผูกกับ payment.id** ใน `wallet_transactions.reference_id` — reconcile ถูกยิงซ้ำ (client + cron พร้อมกัน) ไม่ credit ซ้ำ
  - **"ค่าธรรมเนียมการประมูล 5%" ฝั่งผู้ซื้อ (checkout/payment/reports) ไม่ถูก rename** — คนละเงินกับ listing fee
  - **⚠️ พบระหว่างทำ (ยังไม่แก้):** RPC เงินตัวอื่นใน squash schema (`refund_bid_deposit`, `place_bid_deposit`, ฯลฯ) มี `GRANT ... TO anon, authenticated` — user ที่ login เรียก `supabase.rpc('refund_bid_deposit', ...)` ตรงได้ → **คืนมัดจำตัวเองก่อนประมูลจบ = หนี forfeit ได้** ขัดกับ docs ที่บอก grant service_role เท่านั้น; RPC ใหม่ทั้ง 2 ไฟล์วันนี้ REVOKE แล้ว แต่ตัวเก่าค้างเป็นงาน audit [[rpc-grants-audit]]
  - `npm run build` ผ่าน

## Forfeit deposit split — มัดจำที่ริบแบ่ง 15% platform / 5% ผู้ขาย — 2026-07-04
- **Purpose:** เคสผู้ชนะไม่ชำระเงินตามกำหนด: เดิมมัดจำ 20% ที่ริบถูก credit ให้ผู้ขาย**เต็มจำนวน** → เปลี่ยนเป็นแบ่งตามสัดส่วนของราคาสินค้า: **15% เข้าแพลตฟอร์ม + 5% ให้ผู้ขาย** (ผู้ขายได้ 5/20 = 1/4 ของยอดมัดจำ); รวมกับ feature ก่อนหน้า สรุปผู้ขายได้ 2 ก้อน: เงินค่าประกันการขายคืน + 5% จากมัดจำผู้ซื้อ
- **Location:**
  - Migration (ใหม่): `supabase/migrations/20260704010000_forfeit_deposit_split.sql` — `CREATE OR REPLACE expire_unpaid_auction` + REVOKE anon/authenticated
  - `app/lib/auction/reconcile.js` — `expireUnpaidAuction()` notification ผู้ขายใช้ `seller_compensation`
- **Inputs/Outputs:**
  - `expire_unpaid_auction` เดิม credit `v_deposit_amount` เต็ม → เปลี่ยนเป็น `v_seller_comp = ROUND(deposit × 5.0/20.0, 2)`; insert `wallet_transactions(type='sale', note='forfeited deposit compensation (5% of 20%)')`; return เพิ่ม `seller_compensation` (ควบคู่ `deposit_amount` เดิม)
  - reconcile.js: notification ผู้ชนะยังแจ้ง**ริบเต็มยอด** (`deposit_amount`); notification ผู้ขายแจ้ง `"ระบบโอนค่าชดเชย ฿X (ส่วนแบ่ง 5% จากเงินมัดจำผู้ซื้อ)"`; broadcast `wallet-{seller}` ผูกกับ `sellerComp > 0`
- **Gotchas:**
  - **5% คิดจากยอดมัดจำจริง ณ ตอนวาง** (มัดจำ fix ที่ 20% ของราคาตอนวาง ไม่ขยับตามราคาที่บิดขึ้น) — ถ้าราคาปิดสูงกว่าตอนวางมัดจำ ส่วนแบ่งผู้ขายจะน้อยกว่า 5% ของราคาปิด
  - **migration ต้องรันตามลำดับ** — `20260704000000` (refund_listing_fee) ก่อน `20260704010000`
  - **ไม่ชน idempotency ของ `credit_seller_proceeds`** — ทั้งคู่ใช้ `type='sale'` + `reference_id=auction_result_id` แต่ paid vs canceled เป็น path exclusive กัน (ไม่มีทางเกิดทั้งคู่)
  - เงินฝั่ง platform (15%) **ไม่ move ที่ไหน** — เงินถูกตัดจาก wallet ผู้ชนะตั้งแต่ตอนวางมัดจำแล้ว การ "เก็บ" = แค่ไม่ credit ให้ใคร (ไม่มี platform ledger)
  - `npm run build` ผ่าน

## CardSellingProduct — client trigger ปิดประมูลทันทีเมื่อ countdown ถึง 0 บน /user/selling — 2026-07-07
- **Purpose:** แก้บั๊ก "ไม่มีคน bid จนหมดเวลาแต่เงินค่าประกันการขายไม่คืนผู้ขาย" — สืบแล้วพบว่า `refundListingFee`/RPC `refund_listing_fee` ทำงานถูกต้อง (ยืนยันด้วยการยิง `POST /api/auction/end` มือให้สินค้าเทสจริงบน prod → เงิน ฿250 คืนเข้า wallet ผู้ขายสำเร็จ) แต่**การปิดประมูลไม่เคยถูก trigger เลย** เพราะไม่มี server cron ตั้งอยู่ (`CRON_SECRET` ไม่ได้ตั้ง) และ trigger ฝั่ง client เดิมมีแค่ 2 จุด (timer ใน `CardProductBid` ต้องเปิดหน้า product detail ค้างไว้ตอนหมดเวลา, `endExpiredActiveAuctions()` ที่ยิงแค่ตอน mount `/user/selling`) — นั่งเปิดหน้า selling ค้างไว้จนหมดเวลาจะไม่มีอะไรยิงเลย การ์ดโชว์ "หมดเวลา" เฉยๆ ค้าง state `active`. เพิ่ม trigger จุดที่ 3: การ์ดสินค้าเองตรวจ countdown ถึง 0 แล้วยิงปิดประมูลทันที
- **Location:**
  - `app/components/utils/CardSellingProduct.jsx` — เพิ่ม prop `onAuctionEnded` + `useEffect` ใหม่ (guard ด้วย `endFiredRef`)
  - `app/(authenticated)/user/selling/page.jsx` — ส่ง `onAuctionEnded={() => setRefreshKey((k) => k + 1)}` ให้ทุก `CardSellingProduct`
- **Inputs/Outputs:**
  - `CardSellingProduct({ value, onAuctionEnded })` — `useEffect` deps `[countdown?.ended, value.stateName, value.id, onAuctionEnded]`: เมื่อ `countdown?.ended === true` และ `value.stateName === "กำลังประมูล"` (product state `active`) และยังไม่เคยยิง (`endFiredRef.current === false`) → set ref เป็น `true` แล้ว `fetch POST /api/auction/end` body `{ productId: value.id }` → `.then(() => onAuctionEnded?.())` `.catch(() => {})` (เงียบ, ไม่แสดง error ให้ user)
  - `onAuctionEnded` → parent (`/user/selling`) bump `setRefreshKey((k) => k + 1)` → effect fetch products + counts re-run (เหมือน pattern `endExpiredActiveAuctions`) → สินค้าย้ายไป tab "ไม่สำเร็จ"/"มีผู้ชนะ" อัตโนมัติ
- **Gotchas:**
  - **endpoint `/api/auction/end` idempotent อยู่แล้ว** — ยิงซ้ำ/ชนกับ `endExpiredActiveAuctions()` ตอน mount ไม่เป็นไร (unique constraint บน `auction_results.product_id` กันสร้างซ้ำ) แต่มี `rateLimit(30/min)` ต่อ client — ถ้ามีการ์ด active หมดเวลาค้างจำนวนมากพร้อมกัน การยิงจะซ้ำ 2 ทาง (mount reconcile + card trigger) เปลืองโควต้าไม่จำเป็น
  - trigger ทำงานทั้งการ์ดสินค้าของตัวเอง **และ** การ์ดสินค้าที่ user เคย bid (`_isBidder` — `stateName` เป็น `"กำลังประมูล"` เหมือนกัน ไม่ได้แยก) — ฝั่งไหน mount การ์ดก่อนก็ยิงได้ก่อน (idempotent เลยไม่ต้องแคร์ว่าใครยิง)
  - guard ด้วย `stateName === "กำลังประมูล"` (Thai state name จาก `mapProductState`) — การ์ด tab อื่น (won/lost/order/sold) ไม่ยิง
  - **เคสสลับ tab กลับมาแล้วการ์ด mount ใหม่พร้อม countdown ที่หมดเวลาไปแล้ว → ยิงทันทีตอน mount effect รอบแรก** (ครอบเคส reconcile ตอน mount หน้าพลาดไปด้วยในตัว)
  - **การ์ด listing อื่น (`CardProduct`/`LandingPage2`/`categories`) ยังไม่มี trigger นี้** — ตั้งใจจำกัด scope แค่หน้า `/user/selling` (มีแค่ owner/bidder เห็นการ์ดตัวเอง กันไม่ให้ anon จำนวนมากยิง endpoint พร้อมกันถ้าใส่ทุกหน้า)
  - เคสไม่มีใครเปิดหน้าไหนเลย (ไม่ product detail, ไม่ selling) ยังต้องพึ่ง cron `/api/cron/reconcile` เหมือนเดิม (`CRON_SECRET` ยังไม่ได้ตั้งบน env จริง ณ ตอนนี้)
  - wallet pill บน `AppHeader` อัปเดตเองผ่าน broadcast `wallet-{seller}` ที่ `refundListingFee` ใน `reconcile.js` ยิงอยู่แล้ว (ดู entry "เงินค่าประกันการขาย" ด้านบน) — ไม่ต้องแก้เพิ่มฝั่งนี้
  - `npm run build` ผ่าน

## Client API helper — `apiPost`/`apiPostSafe` รวม fetch("/api/...") boilerplate ฝั่ง client — 2026-07-08
- **Purpose:** ตัด boilerplate `fetch(url, {method:"POST", headers, body: JSON.stringify(...)})` + `res.json()` + เช็ค `res.ok` ที่ซ้ำอยู่ ~16 จุดฝั่ง client ให้เหลือ helper กลาง 2 ตัว — เกิดจากคำถาม "ควรเปลี่ยนไปใช้ Axios ไหม" แล้วสรุปว่าไม่คุ้ม (Next.js 16 ผูก caching/revalidate กับ `fetch` เนทีฟ, จุดขายของ axios เช่น interceptor/cancel token ไม่ได้ใช้ในโปรเจกต์นี้, เพิ่ม bundle ~11KB โดยเปล่าประโยชน์) จึงทำ thin wrapper รอบ `fetch` แทน
- **Location:** ไฟล์ใหม่ [app/lib/api.js](../app/lib/api.js)
  - `apiPost(url, body = {})` — POST JSON ไป `/api/*` ภายในเท่านั้น (relative URL); parse `res.json()` แบบ safe (`.catch(() => ({}))` กัน body ว่าง/ไม่ใช่ JSON) → สำเร็จคืน parsed data ตรง ๆ; `!res.ok` → `throw new Error(data?.error || "")`
  - `apiPostSafe(url, body)` — wrap `apiPost` ด้วย try/catch ไม่ throw → คืน `{ data, error: null }` หรือ `{ data: null, error: { message: err.message } }` (ตาม convention `{data,error}` ของ service layer เดิม)
  - รีแฟกเตอร์ให้ใช้ helper นี้ 11 ไฟล์: `app/services/deposits.service.js` (`placeBidDeposit`), `app/services/wallet.service.js` (`requestWithdrawal`) — ทั้งคู่ apiPostSafe ตรง ๆ; `app/services/auth.service.js` (`register`) — apiPost + try/catch คืน `{error: err}`; `app/services/products.service.js` (`endExpiredActiveAuctions`/`expireUnpaidWonAuctions`) — apiPost fire-and-forget `.catch(() => {})`; `app/components/payment/redirectPay.js` (`startOmiseRedirect`); `app/components/payment/PromptPayQR.jsx`, `CreditCardListingBtn.jsx`, `WalletListingBtn.jsx`; `app/components/utils/CardSellingProduct.jsx`, `CardProductBid.jsx` (ยิง `/api/auction/end`); `app/(authenticated)/user/wallet/page.jsx` (promptpay topup/test-topup/card token), `.../payment/[id]/page.jsx` (promptpay QR effect/wallet charge/card token)
- **Inputs/Outputs:** ดู signature ข้างบน — คืน parsed JSON (throw ver.) หรือ `{data,error}` (safe ver.); ไม่มี generic type/validation เพิ่มเติม เป็นแค่ wrapper ลด boilerplate
- **Gotchas:**
  - **client-side เท่านั้น** (relative URL `/api/...`, ใช้ `fetch` ของ browser) — ฝั่ง server ที่ยิงออกไป Omise โดยตรง (`webhook`/`promptpay` route) ยังใช้ `omiseFetch`/`omiseGet` ใน `app/lib/payment/omise.js` (หรือ copy inline เดิมในบางไฟล์) ตามเดิม ไม่แตะ — คนละ helper คนละ layer
  - **แก้บั๊กเดิมไปด้วยระหว่างรีแฟกเตอร์**: บาง call site เดิม (`payment/[id]/page.jsx` wallet charge) เรียก `notifyError(d.error)` โดย `d.error` เป็น **string** (ไม่ใช่ `Error` object) → `translateSupabaseError()` เทียบ `.message` undefined → เคยโชว์ข้อความ generic แทนคำแปลไทยจริงจาก error code; ตอนนี้ throw เป็น `Error` object เสมอ (`.message` = error code) → `notifyError(err)` แปลถูกตัว
  - **fallback message เปลี่ยนไปจากเดิม**: บางจุดเดิม fallback เป็น `"internal_error"` (ไม่มีใน `errorMap` → โชว์ raw string) หรือ hardcode ไทย (`"ชำระเงินไม่สำเร็จ"`, `"เกิดข้อผิดพลาด"`); ตอนนี้ error ไม่มี code จาก server จะได้ `Error("")` → `notifyError` fallback เป็นข้อความ generic "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" แทน (ยังคง user-friendly แต่ข้อความเปลี่ยน — ถ้าเทียบ snapshot/screenshot เก่าจะไม่ตรง)
  - `CardProductBid` เดิมยิง `/api/auction/end` แบบ fire-and-forget ไม่มี `.catch` เลย (unhandled promise rejection เงียบ ๆ) → เพิ่ม `.catch(() => {})` ตอนย้ายมาใช้ `apiPost`
  - `CardSellingProduct`: `onAuctionEnded?.()` ตอนนี้เรียก **เฉพาะเมื่อ `apiPost` resolve สำเร็จ** (เดิม logic เก่าก่อนหน้านี้เรียกทุก HTTP response แม้ error) — ถ้า `/api/auction/end` fail การ์ดจะไม่ trigger parent refresh ทันที แต่ reconcile (mount `/user/selling` หรือ cron) จะเก็บตกให้ภายหลังเสมอ ไม่ทำให้ auction ค้าง permanent
  - **route ภายในทุกตัวต้องคืน error เป็น string code** (`{ error: "some_code" }`) ไม่ใช่ object — `apiPost` ทำ `data?.error || ""` ตรง ๆ ไม่ serialize; ถ้า route ใหม่คืน `error` เป็น object จะได้ `Error("[object Object]")` แทนที่จะแปลผ่าน `errorMap` ได้ — เขียน route ใหม่ต้องคืน error เป็น string เสมอ (สอดคล้อง convention เดิมของทุก route อยู่แล้ว)
  - `npm run build` ผ่าน

## Lookup tables `product_condition` + `auction_duration` — ย้าย option ที่ hardcode เข้า DB — 2026-07-12
- **Purpose:** ย้าย option "สภาพสินค้า" (`new`/`like_new`/`good`) และ "ระยะเวลาประมูล" (`0`/`1`/`5`/`7`/`10` วัน) ที่เคย hardcode เป็น array ซ้ำกันหลายไฟล์ (label ไม่ตรงกันด้วย — user-facing ใช้ "ของใหม่ (New)"/"ใหม่", admin ใช้ "ใหม่"/"มือ 2") ให้ดึงจาก lookup table กลางใน DB แทน — เพิ่ม/แก้ label ใหม่ทำที่ตาราง (Studio/service_role) อย่างเดียว ไม่ต้องแก้โค้ด/deploy
- **Location:**
  - Migration (ใหม่): `supabase/migrations/20260712000000_product_condition.sql`, `supabase/migrations/20260712010000_auction_duration.sql`
  - Service กลาง: `app/services/products.service.js` — `getProductConditions()`, `getAuctionDurations()`
  - ทุกจุดที่เลิก hardcode: `app/components/utils/DetailSearchBox.jsx` (radio filter สภาพสินค้า), `app/(authenticated)/user/add-product/components/AddProductForm.jsx` (step เลือกสภาพ + ระยะเวลาประมูล), `app/(authenticated)/user/add-product/components/CardAddProductPreview.jsx` (label "เวลาที่เหลือ"), `app/admin/products/components/Form.jsx` + `app/admin/bids/components/Form.jsx` (select สภาพ + ระยะเวลา), `app/(public)/product/[id]/ProductDetail.jsx` (เซลล์ "สภาพสินค้า"/"ระยะเวลาประมูล")
- **Inputs/Outputs:**
  - `product_condition(value text PK, label text, sort_order int, created_at)` — seed 3 แถว: `new`="ของใหม่", `like_new`="เหมือนใหม่", `good`="มือสองสภาพดี"
  - `auction_duration(value smallint PK, label text, sort_order int, created_at)` — `value` = จำนวนวัน (`0` = 10 นาที TEST ตาม convention เดิมของ `duration_days`); seed: `0`="10 นาที (TEST)", `1`="1 วัน", `5`="5 วัน", `7`="7 วัน", `10`="10 วัน"
  - `getProductConditions()` / `getAuctionDurations()` (browser client, ไม่มี `requireUser`) — `select("value, label").order("sort_order")` คืน `{ data, error }`; อ่านได้แม้ anon เพราะ RLS policy public read (`USING(true)`)
  - ทุก component ที่ใช้: `useState([])` + `useEffect` fetch ตอน mount → `.map()` เป็น `options` ของ `UseRadio`/`UseSegmented`/`UseSelectCard`/`UseSelect` แทน array hardcode เดิม
- **Gotchas:**
  - **DROP CHECK constraint `products_condition_check` (เดิมมาจาก squash schema) → แทนด้วย FK** `products.condition → product_condition(value) ON DELETE RESTRICT` — เพิ่ม/ลบ condition ใหม่ = insert/delete row ในตาราง ไม่ต้องออก migration ใหม่อีก (แต่ลบ value ที่ยังมี product อ้างอิงอยู่จะโดน `RESTRICT` บล็อก)
  - **`duration_days` เดิมไม่มี CHECK เลย** (เป็น smallint เปล่า) — migration กัน FK fail ตอน apply บน prod ด้วยการ `INSERT ... SELECT DISTINCT duration_days FROM products WHERE duration_days IS NOT NULL` (ไม่ได้กรอง "ที่ยังไม่อยู่ใน seed" ด้วย WHERE NOT IN — พึ่ง `ON CONFLICT (value) DO NOTHING` แทน; label auto-gen `"X วัน"`, sort_order 100) ก่อนค่อย `ADD CONSTRAINT ... FOREIGN KEY`
  - **ต้อง apply migration ทั้ง 2 ไฟล์ก่อนใช้งาน** (`npx supabase db reset` สำหรับ local) — ไม่งั้น `getProductConditions()`/`getAuctionDurations()` คืน error/empty เงียบๆ (ทุก call site ทำ `.then(({ data }) => setX(data || []))` ไม่เช็ค error) → radio/select ในทุกฟอร์มว่างเปล่าโดยไม่มี error โชว์ให้เห็น
  - **แก้ label หรือเพิ่มตัวเลือกใหม่ = แก้ข้อมูลในตาราง (ผ่าน Studio/service_role) ไม่ต้องแตะโค้ด** ยกเว้น `DURATION_SUBTITLES` (const ใน `AddProductForm.jsx`) — subtitle การตลาด (TEST/QUICK SALE/POPULAR/STANDARD/MAXIMUM) เป็น client-side map แยกจาก DB (ไม่มีคอลัมน์ subtitle ใน `auction_duration`); duration ใหม่ที่เพิ่มใน DB จะไม่มี subTitle (แสดงแค่ label เฉยๆ, `undefined` ไม่ throw) จนกว่าจะเพิ่ม key ใน `DURATION_SUBTITLES` ด้วยมือ
  - **RLS/GRANT pattern เดียวกับ `categories`** — public SELECT policy `USING(true)` + `GRANT ALL` ให้ `anon`/`authenticated`/`service_role` แต่ไม่มี INSERT/UPDATE/DELETE policy ใดๆ → เขียนได้จริงเฉพาะ `service_role` (bypass RLS) ทั้งที่ GRANT ดู "ALL" เผินๆ (เป็น pattern เดิมของโปรเจกต์ ไม่ใช่ bug ใหม่)
  - **`ProductDetail.jsx` เซลล์ "หมวดหมู่" + "ราคาเริ่มต้น" ยัง mock อยู่** (นอก scope งานนี้ — เดิมชื่อเซลล์ "ปีที่ผลิต"/"การจัดส่ง" ถูกเปลี่ยน label ไปแล้วแต่ค่าใน `<p>` ยังเป็น mock string เดิม `x2023`/`รับประกันทั่วโลก`); มี `console.log('product', product)` หลุดค้างอยู่ในไฟล์นี้ด้วย (debug leftover ยังไม่ได้ลบ)
  - `npm run build` ผ่าน

## Fix realtime channel ชนกัน — wallet pill + ราคา bid ค้างจนต้อง reload — 2026-07-13
- **Purpose:** แก้บั๊ก wallet pill บน `AppHeader` หยุดรับ broadcast หลังออกจากหน้า `/user/wallet` และราคา realtime บนหน้าสินค้า/listing ค้างหลังปิด modal zoom หรือเปลี่ยน filter หมวด — ต้อง reload ถึงจะอัปเดตต่อ; รวมศูนย์ subscription ของ channel `wallet-{userId}` และ `bid-{productId}` ให้ทุก component แชร์ channel เดียวกันแทนที่จะสร้าง/ทำลายเอง
- **Location:**
  - `app/services/wallet.service.js` — `subscribeWallet(userId, onUpdate)` (แก้เป็น module-level shared channel)
  - `app/services/bids.service.js` — `subscribeBidChannel(productId, onNewBid)` + `sendBidBroadcast(productId, payload)` (ใหม่)
  - `app/components/layout/AppHeader.jsx` — sync `walletBalance` จาก Redux เพิ่ม
  - `app/hooks/useRealtimePrice.js`, `app/components/utils/CardProductBid.jsx`, `app/(public)/product/[id]/ProductDetail.jsx` — เปลี่ยนมาเรียก helper แทน `supabase.channel()`/`removeChannel()` ตรง ๆ
- **Inputs/Outputs:**
  - **ต้นเหตุ:** `@supabase/supabase-js` 2.105 (`realtime-js`) — `supabase.channel(topic)` **คืน channel instance เดิมถ้า topic ซ้ำ** (`RealtimeClient.js`: `getChannels().find(c => c.topic === realtimeTopic)`) แต่เดิมหลาย component สร้าง channel topic เดียวกันแล้วต่างคน `removeChannel()` เองตอน unmount → ตัวที่ unmount ก่อนฆ่า channel ที่ตัวอื่นยังฟังอยู่ (`wallet-{userId}`: AppHeader+/user/wallet+WalletListingBtn; `bid-{productId}`: ProductDetail+CardProductBid+CardZoomImage(ผ่าน useRealtimePrice) หน้าเดียวกัน, หรือ LandingPage2 สินค้าเดียวกันหลาย section). broadcast ฝั่ง server ทำงานถูกอยู่แล้วทุก flow — ปัญหาอยู่ที่ client subscription ล้วน
  - **`subscribeWallet(userId, onUpdate)`** — module-level `walletChannel`/`walletChannelUserId` + `Set` ของ listeners; unsubscribe = ถอด listener ออกเฉย ๆ ไม่ `removeChannel`; สร้าง channel ใหม่เฉพาะเมื่อ `userId` เปลี่ยน (login คนใหม่ → `removeChannel` ตัวเก่าก่อน); signature เดิมไม่เปลี่ยน call site ทั้ง 3 (AppHeader, `/user/wallet`, `WalletListingBtn`) ไม่ต้องแก้
  - **`subscribeBidChannel(productId, onNewBid)`** — `Map` key `productId` → `{ ch, listeners:Set, removeTimer }`; หลาย subscriber ของสินค้าเดียวกันแชร์ channel; **ref-count + หน่วง 1 วิ (`setTimeout`) ก่อน `removeChannel` จริงเมื่อ listener หมด** (ต่างจาก wallet ที่ปล่อย channel ค้างได้เพราะมีตัวเดียวต่อ user — bid มีหลายสินค้าพร้อมกันบน listing page ปล่อยค้างไม่ได้); คืน unsubscribe function
  - **`sendBidBroadcast(productId, payload)`** — ยิง event `new_bid` ผ่าน channel ใน Map (ผู้ส่งไม่ได้รับ event ตัวเอง — call site set state เองอยู่แล้ว behavior เดิม)
  - `AppHeader`: เพิ่ม `useSelector((state) => state.user.data?.wallet_balance)` + `useEffect` sync ลง `walletBalanceLocal` เมื่อค่า Redux เปลี่ยน — หน้าที่ dispatch `setWalletBalance` เอง (เช่น payment page หลังตัด wallet) เห็น pill เปลี่ยนทันทีไม่ต้องรอ broadcast
  - call sites เปลี่ยนมาใช้ `subscribeBidChannel`/`sendBidBroadcast`: `useRealtimePrice.js` (การ์ด listing ทุกใบ: `CardProduct`/`CardProductLive`/`CardZoomImage`/`CardHighlight`), `CardProductBid.jsx` (ตัด `channelRef`/`useRef`/import `supabase` ออก ยิง bid ด้วย `sendBidBroadcast(product.id, {...})`), `ProductDetail.jsx` (refresh bid list ผ่าน callback แทน `.on()` ตรง)
- **Gotchas:**
  - **`removeTimer` 1 วินาทีใน `subscribeBidChannel` กันเคส remove-แล้ว-subscribe-ซ้ำทันที** (React strict mode double-effect / เปลี่ยนหน้าเร็ว) — ถ้า subscribe กลับมาก่อน timer หมด `clearTimeout` แล้วใช้ channel เดิมต่อ ไม่สร้างใหม่ (เพราะ realtime-js จะคืน instance เก่าที่กำลังจะตายถ้าสร้างซ้ำ topic เดิมทันที)
  - **`subscribeWallet` ไม่หน่วงก่อนลบ** เพราะมี channel เดียวต่อ user เท่านั้น (ไม่มี many-topic แบบ bid) — ปล่อยไว้ไม่ remove เลยจนกว่า userId จะเปลี่ยนก็ไม่มีปัญหา (ไม่สะสมเหมือน per-product channel)
  - **`AppHeader` sync จาก Redux ใช้งานได้เฉพาะหลัง `fetchUser` เคย dispatch แล้ว** (`setWalletBalance` reducer no-op ถ้า `state.user.data` เป็น null) — ไม่กระทบ path หลักเพราะหน้าที่ dispatch `setWalletBalance` เอง (payment/checkout) ก็เป็นหน้าที่ต้อง login/มี user data อยู่แล้ว
  - **ตอนนี้ไม่มีจุดไหนใน `app/` เรียก `supabase.channel("bid-*")`/`"wallet-*"` ตรง ๆ อีก** (grep ยืนยันแล้ว) — topic ใหม่ในอนาคตที่มีโอกาส subscribe จากหลาย component พร้อมกันต้องทำ pattern เดียวกัน (ดู [conventions.md](conventions.md#realtime-broadcast-channel-subscription))
  - `npm run build` ผ่านทั้ง 2 รอบ (หลังแก้ wallet และหลังแก้ bid channel)
