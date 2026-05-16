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
];

export function translateSupabaseError(message) {
    if (!message) return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
    const found = errorMap.find(({ match }) => match.test(message));
    return found ? found.thai : message;
}
