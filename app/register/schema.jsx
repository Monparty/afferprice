import * as yup from "yup";

export const schema = yup.object({
    email: yup.string().required("กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
    phone: yup
        .string()
        .required("กรุณากรอกเบอร์โทรศัพท์")
        .matches(/^0[0-9]{9}$/, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
    gender: yup.string().required("กรุณากรอกเพศ"),
    firstName: yup.string().required("กรุณากรอกชื่อจริง"),
    lastName: yup.string().required("กรุณากรอกนามสกุล"),
    birthDay: yup.string().required("กรุณากรอกวันเกิด"),
    birthMonth: yup.string().required("กรุณากรอกเดือนเกิด"),
    birthYear: yup.string().required("กรุณากรอกปีเกิด"),
    password: yup.string().required("กรุณากรอกรหัสผ่าน"),
});
