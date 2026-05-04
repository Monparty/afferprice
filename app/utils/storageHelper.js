import { getUrlAttachments, removeAttachments, uploadAttachments } from "../services/upload.service";
import { notifyError, notifySuccess } from "../providers/NotificationProvider";

const getPublicUrls = (files = []) => {
    return files.map((file) => {
        const { data } = getUrlAttachments(file.uid);
        return {
            ...file,
            status: "done",
            url: data.publicUrl,
            thumbUrl: data.publicUrl,
        };
    });
};

export const handleLocalPreview = ({ fileData, name, setValue }) => {
    const { options, fileListData } = fileData;
    const previewList = fileListData.map((item) => ({
        uid: item.uid,
        name: item.name,
        status: "done",
        thumbUrl: item.thumbUrl || (item.originFileObj ? URL.createObjectURL(item.originFileObj) : null),
        url: item.url || item.thumbUrl || null,
        originFileObj: item.originFileObj || null,
    }));
    setValue(name, previewList);
    options.onSuccess?.({});
};

export const removeDeletedFiles = async (originalFiles = [], currentFiles = []) => {
    const currentUids = new Set(currentFiles.map((f) => f.uid));
    const toDelete = originalFiles.filter((f) => f.uid && !currentUids.has(f.uid));
    for (const file of toDelete) {
        await removeAttachments(file.uid);
    }
};

export const uploadPendingFiles = async (files = []) => {
    const results = [];
    for (const file of files) {
        if (file.originFileObj) {
            const { error } = await uploadAttachments({ fileName: file.uid, file: file.originFileObj });
            if (error) throw error;
            const { data } = getUrlAttachments(file.uid);
            results.push({ uid: file.uid, name: file.name, url: data.publicUrl });
        } else {
            results.push({ uid: file.uid, name: file.name, url: file.url || file.thumbUrl });
        }
    }
    return results;
};

export const handleUpload = async ({ fileData, name, setValue }) => {
    try {
        const { options, fileListData } = fileData;
        const uploadingList = fileListData.map((item) => {
            const preview = item.originFileObj ? URL.createObjectURL(item.originFileObj) : item.thumbUrl;
            return {
                uid: item.uid,
                name: item.name,
                status: "done",
                thumbUrl: preview,
                _objectUrl: preview,
            };
        });
        setValue(name, uploadingList);

        const file = options.file;
        const { error: uploadError } = await uploadAttachments({
            fileName: file.uid,
            file,
        });
        if (uploadError) return notifyError(uploadError);

        const fileName = uploadingList.map((item) => item);
        const urlResults = getPublicUrls(fileName);
        setValue(name, urlResults);
        uploadingList.forEach((item) => {
            if (item._objectUrl) {
                URL.revokeObjectURL(item._objectUrl);
            }
        });
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

export const handleRemove = async ({ file, field, id, updateFunction, setValue }) => {
    try {
        const { error: storageError } = await removeAttachments(file);
        if (storageError) return notifyError(storageError);
        const payload = {
            [field]: null,
        };
        const { erro: profilerError } = await updateFunction(id, payload);
        if (profilerError) return notifyError(profilerError);
        setValue(field, null);
        notifySuccess("ลบไฟล์สำเร็จ");
    } catch (error) {
        if (error) return notifyError(error);
    }
};
