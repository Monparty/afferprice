import * as yup from "yup";

export const schema = yup.object({
    email: yup.string().required("กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: yup
        .string()
        .transform((v) => (v === "" ? undefined : v))
        .notRequired()
        .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

export const kycSchema = yup.object({
    profile_image: yup
        .array()
        .of(yup.object())
        .min(1, "กรุณาอัปโหลดรูปโปรไฟล์")
        .required("กรุณาอัปโหลดรูปโปรไฟล์"),
    id_card_image: yup
        .array()
        .of(yup.object())
        .min(1, "กรุณาอัปโหลดสำเนาบัตรประชาชน")
        .required("กรุณาอัปโหลดสำเนาบัตรประชาชน"),
});

export const kycFullSchema = yup.object({
    full_name: yup.string().trim().required("กรุณากรอกชื่อ-นามสกุล"),
    national_id: yup
        .string()
        .required("กรุณากรอกเลขประจำตัวประชาชน")
        .matches(/^[0-9]{13}$/, "เลขประจำตัวประชาชนต้องเป็นตัวเลข 13 หลัก"),
    birth_date: yup.string().nullable().required("กรุณาเลือกวันเดือนปีเกิด"),
    gender: yup.string().required("กรุณาเลือกเพศ"),
    phone: yup
        .string()
        .required("กรุณากรอกเบอร์โทรศัพท์")
        .matches(/^0[0-9]{8,9}$/, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
    address: yup.string().trim().required("กรุณาเลือกที่อยู่ปัจจุบัน"),
    id_card_image: yup
        .array()
        .of(yup.object())
        .min(1, "กรุณาอัปโหลดภาพถ่ายหน้าบัตรประชาชน")
        .required("กรุณาอัปโหลดภาพถ่ายหน้าบัตรประชาชน"),
    selfie_image: yup
        .array()
        .of(yup.object())
        .min(1, "กรุณาอัปโหลดภาพเซลฟี่คู่กับบัตรประชาชน")
        .required("กรุณาอัปโหลดภาพเซลฟี่คู่กับบัตรประชาชน"),
    bank_name: yup.string().required("กรุณาเลือกธนาคาร"),
    bank_account_no: yup
        .string()
        .required("กรุณากรอกเลขที่บัญชี")
        .matches(/^[0-9]{10,15}$/, "เลขที่บัญชีไม่ถูกต้อง"),
    bank_account_name: yup.string().trim().required("กรุณากรอกชื่อบัญชี"),
    pdpa_consent: yup.boolean().oneOf([true], "กรุณายอมรับการเก็บข้อมูลส่วนบุคคล"),
    pdpa_accuracy: yup.boolean().oneOf([true], "กรุณายืนยันความถูกต้องของข้อมูล"),
});
