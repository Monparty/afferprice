import * as yup from "yup";

// ฟิลด์ที่ต้องกรอกครบต่อ step — ใช้กับ trigger() ก่อนกดไป step ถัดไป
export const STEP_FIELDS = {
    0: ["images_url"],
    1: ["title", "startPrice", "durationDays", "categoryId", "condition", "description"],
    2: ["images_url", "title", "startPrice", "durationDays", "categoryId", "condition", "description"],
};

const emptyToUndefined = (value, original) =>
    original === "" || original === null ? undefined : value;

export const addProductSchema = yup.object({
    images_url: yup
        .array()
        .of(yup.object())
        .min(1, "กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป")
        .required("กรุณาอัปโหลดรูปภาพ"),
    title: yup.string().trim().required("กรุณากรอกชื่อสินค้า"),
    startPrice: yup
        .number()
        .transform(emptyToUndefined)
        .typeError("กรุณากรอกราคาเริ่มต้น")
        .required("กรุณากรอกราคาเริ่มต้น")
        .moreThan(0, "ราคาเริ่มต้นต้องมากกว่า 0"),
    durationDays: yup
        .number()
        .transform(emptyToUndefined)
        .typeError("กรุณาเลือกระยะเวลาประมูล")
        .required("กรุณาเลือกระยะเวลาประมูล"),
    categoryId: yup.string().required("กรุณาเลือกหมวดหมู่"),
    condition: yup.string().required("กรุณาเลือกสภาพสินค้า"),
    // description: yup.string().trim().required("กรุณากรอกรายละเอียดสินค้า"),
});
