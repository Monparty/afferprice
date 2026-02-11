import * as yup from "yup";

export const schema = yup.object({
    fname: yup.string().required("กรุณาระบุ ชื่อ"),
    age: yup
    .number()
    .required('กรุณาระบุ ระหัสผ่าน')
    .min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร'),
});
