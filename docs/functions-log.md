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
