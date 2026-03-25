import { v4 as uuid } from "uuid";
import { getUrlAttachments, removeAttachments, uploadAttachments } from "../services/upload.service";
import { notifyError, notifySuccess } from "../providers/NotificationProvider";

// ดูตัวอย่างที่ UserProfilesForm

/*
    flow upload
        - เมื่อ upload เก็บไฟล์เข้า Buckets "attachments" ทันที
        - get url ของไฟล์และ setValue เข้า form หน้านั้น
        - กดบันทึกหน้านั้นทำ func onSubmit และนำ url ไปเก็บในตาราง
    สิ่งที่ต้องมี
        - field ในตารางสำหรับเก็บ url
        - input UseUpload และต้องระบุ name ตาม ชื่อ field ใน table
 */

export const handleUpload = async ({ file, name, setValue }) => {
    try {
        const fileName = uuid();
        const preview = URL.createObjectURL(file);
        setValue(name, [
            {
                uid: fileName,
                name: file.name,
                status: "uploading",
                thumbUrl: preview,
            },
        ]);
        const { error: uploadError } = await uploadAttachments({
            fileName,
            file,
        });
        if (uploadError) return notifyError(uploadError);
        const { data } = getUrlAttachments(fileName);
        setValue(name, [
            {
                uid: fileName,
                name: file.name,
                status: "done",
                url: data.publicUrl,
            },
        ]);
        URL.revokeObjectURL(preview);
        notifySuccess("บันทึกไฟล์สำเร็จ");
    } catch (error) {
        if (error) return notifyError(error);
    }
};

/*
    flow remove
        - เมื่อกดลบ จะลบไฟล์ออกจาก Buckets "attachments" ทันที
        - ต้องส่ง field, id, updateFunction เพื่อให้รู้ว่าจะลบข้อมูลที่ตารางไหน id อะไร
    สิ่งที่ต้องมี
        - function updateById
        - ชื่อ field url ในตารางที่จะลบ
 */

export const handleRemove = async ({ file, field, id, updateFunction }) => {
    try {
        const { error: storageError } = await removeAttachments(file);
        if (storageError) return notifyError(storageError);
        const payload = {
            [field]: null,
        };
        const { erro: profilerError } = await updateFunction(id, payload);
        if (profilerError) return notifyError(profilerError);
        notifySuccess("ลบไฟล์สำเร็จ");
    } catch (error) {
        if (error) return notifyError(error);
    }
};
