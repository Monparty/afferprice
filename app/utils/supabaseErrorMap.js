const errorMap = [
    // Auth errors
    { match: /invalid login credentials/i, thai: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
    { match: /user already registered/i, thai: "อีเมลนี้ถูกลงทะเบียนแล้ว" },
    { match: /email not confirmed/i, thai: "กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ" },
    { match: /password should be at least/i, thai: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
    { match: /email.*invalid/i, thai: "รูปแบบอีเมลไม่ถูกต้อง" },
    // DB errors
    { match: /duplicate key value/i, thai: "ข้อมูลนี้มีอยู่ในระบบแล้ว" },
    { match: /violates foreign key constraint/i, thai: "ไม่สามารถดำเนินการได้ เนื่องจากข้อมูลเชื่อมโยงกับข้อมูลอื่น" },
    { match: /value too long/i, thai: "ข้อมูลยาวเกินกว่าที่กำหนด" },
    { match: /not found/i, thai: "ไม่พบข้อมูลที่ต้องการ" },
    // Storage errors
    { match: /bucket not found/i, thai: "ไม่พบ Storage Bucket" },
    { match: /object not found/i, thai: "ไม่พบไฟล์ที่ต้องการ" },
    // KYC / business rules
    { match: /seller_kyc_not_approved/i, thai: "ไม่สามารถอนุมัติได้ เนื่องจาก KYC ของผู้ขายยังไม่ผ่านการตรวจสอบ" },
    { match: /bidder_kyc_not_approved/i, thai: "กรุณายืนยันตัวตน (KYC) ให้ผ่านการตรวจสอบก่อนเข้าร่วมประมูล" },
    { match: /missing_seller_id/i, thai: "ไม่พบข้อมูลผู้ขาย" },
    { match: /missing_(documents|kyc_fields)/i, thai: "กรุณากรอกข้อมูลและอัปโหลดเอกสารยืนยันตัวตนให้ครบถ้วน" },
    { match: /invalid_kyc_state/i, thai: "ไม่สามารถส่งยืนยันตัวตนซ้ำได้ในสถานะปัจจุบัน" },
    { match: /profiles_national_id_check/i, thai: "เลขประจำตัวประชาชนต้องเป็นตัวเลข 13 หลัก" },
    // Bid deposit
    { match: /deposit_required/i, thai: "กรุณาวางเงินมัดจำ 20% ก่อนเข้าร่วมประมูล" },
    { match: /already_deposited/i, thai: "คุณได้วางเงินมัดจำสินค้านี้แล้ว" },
    { match: /insufficient_balance/i, thai: "ยอดเงินในกระเป๋าไม่เพียงพอ กรุณาเติมเงินก่อน" },
    { match: /deposit_not_found/i, thai: "ไม่พบข้อมูลเงินมัดจำ" },
    // Payment
    { match: /already_paid/i, thai: "รายการนี้ได้ชำระเงินเรียบร้อยแล้ว" },
    { match: /payment_expired/i, thai: "เลยกำหนดชำระเงินแล้ว รายการถูกยกเลิกและริบเงินมัดจำ" },
    { match: /auction_canceled/i, thai: "รายการประมูลนี้ถูกยกเลิกแล้ว" },
    // Withdrawal
    { match: /invalid_withdrawal_amount/i, thai: "จำนวนเงินถอนไม่ถูกต้อง (ถอนขั้นต่ำ 100 บาท)" },
    { match: /bank_account_required/i, thai: "กรุณาระบุบัญชีธนาคารในข้อมูลยืนยันตัวตน (KYC) ก่อนถอนเงิน" },
    { match: /kyc_not_approved/i, thai: "ต้องยืนยันตัวตน (KYC) ให้ผ่านก่อนจึงจะถอนเงินได้" },
    { match: /invalid_amount/i, thai: "จำนวนเงินไม่ถูกต้อง (เติมได้ 20–100,000 บาท)" },
    { match: /invalid_phone_number/i, thai: "กรุณากรอกเบอร์ TrueMoney ให้ถูกต้อง (10 หลัก)" },
    { match: /(no_authorize_uri|invalid_source_type|invalid_purpose)/i, thai: "ไม่สามารถเริ่มการชำระเงินได้ กรุณาลองใหม่อีกครั้ง" },
    { match: /missing_token/i, thai: "ไม่พบข้อมูลบัตร กรุณากรอกใหม่อีกครั้ง" },
    { match: /not_found/i, thai: "ไม่พบข้อมูลที่ต้องการ" },
    { match: /^forbidden$/i, thai: "คุณไม่มีสิทธิ์ทำรายการนี้" },
];

export function translateSupabaseError(message) {
    if (!message) return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
    const found = errorMap.find(({ match }) => match.test(message));
    return found ? found.thai : message;
}
