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
