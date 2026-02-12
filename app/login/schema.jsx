import * as yup from "yup";

export const schema = yup.object({
    email: yup.string().required("กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
    phone: yup
        .string()
        .required("กรุณากรอกเบอร์โทรศัพท์")
        .matches(/^0[0-9]{9}$/, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
});
