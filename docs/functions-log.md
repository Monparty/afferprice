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
