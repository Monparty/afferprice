"use client";
import InputText from "@/app/components/inputs/InputText";
import { useForm, useWatch } from "react-hook-form";
import {
    PlusOutlined,
    EditOutlined,
    LeftOutlined,
    SaveFilled,
    EyeFilled,
    CloseCircleFilled,
    CheckCircleFilled,
} from "@ant-design/icons";
import UseButton from "@/app/components/inputs/UseButton";
import { useRouter } from "next/navigation";
import UseSwitch from "@/app/components/inputs/UseSwitch";
import { useEffect, useRef, useState } from "react";
import { notifyError } from "@/app/providers/NotificationProvider";
import UseUpload from "@/app/components/inputs/UseUpload";
import InputNumber from "@/app/components/inputs/InputNumber";
import UseSelect from "@/app/components/inputs/UseSelect";
import UseTextArea from "@/app/components/inputs/UseTextArea";
import { getParentCategories } from "@/app/services/categories.service";
import { getProductById } from "@/app/services/admin/products.service";
import UseTooltip from "@/app/components/utils/UseTooltip";
import UseModal from "@/app/components/utils/UseModal";
import { handleLocalPreview, removeDeletedFiles } from "@/app/utils/storageHelper";

function Form({ id, mode, onSubmit }) {
    const router = useRouter();
    const isWatch = Boolean(mode === "watch");
    const isCreate = Boolean(mode === "create");
    const { control, handleSubmit, setValue, getValues, reset } = useForm();
    const modeIcons = {
        watch: EyeFilled,
        create: PlusOutlined,
        edit: EditOutlined,
    };
    const Icon = modeIcons[mode];
    const inputProps = {
        control: control,
        size: "large",
        disabled: !isCreate,
    };

    const originalFilesRef = useRef({ images: [], video: [] });
    const [modalRejected, setModalRejected] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const watchState = useWatch({ control, name: "state" });

    useEffect(() => {
        const onGetParentCategories = async () => {
            const { data, error } = await getParentCategories();
            if (error) return notifyError(error);
            setCategoryList(data);
        };
        onGetParentCategories();
    }, []);

    useEffect(() => {
        if (!id) return;
        onGetProductById();
    }, [id, reset]);

    const onGetProductById = async () => {
        const { data, error } = await getProductById(id);
        if (error) return notifyError(error);
        const formatData = {
            ...data,
            title: data.title,
            categoryId: data.category_id,
            condition: data.condition,
            description: data.description,
            isSeller: data.is_seller === "Y",
            startPrice: data.start_price,
            durationDays: data.duration_days,
            rejectedRemark: data.rejected_remark,
            images_url: data?.images_url?.map((item) => ({
                ...item,
                status: "done",
            })),
            video_url: data?.video_url?.map((item) => ({
                ...item,
                status: "done",
                thumbUrl: "/images/videoThumb.png",
            })),
            status: data.status === "active",
        };
        originalFilesRef.current = {
            images: formatData.images_url || [],
            video: formatData.video_url || [],
        };
        reset(formatData);
    };

    const submitForm = async (data, state) => {
        await onSubmit(data, state);
        await removeDeletedFiles(originalFilesRef.current.images, data.images_url || []);
        await removeDeletedFiles(originalFilesRef.current.video, data.video_url || []);
    };

    return (
        <form className="grid gap-6" onSubmit={handleSubmit(submitForm)}>
            <div className="flex gap-2 items-center">
                {Icon && <UseButton shape="circle" icon={Icon} size="large" />}
            </div>
            <div className="grid md:grid-cols-2 gap-4 items-start">
                <UseUpload
                    {...inputProps}
                    name="images_url"
                    label="อัปโหลดรูปภาพ"
                    multiple
                    maxCount={6}
                    customRequest={(fileData) =>
                        handleLocalPreview({ fileData: fileData, name: "images_url", setValue: setValue })
                    }
                />
                <UseUpload
                    {...inputProps}
                    name="video_url"
                    label="อัปโหลด Video"
                    multiple
                    maxCount={6}
                    acceptVideo
                    customRequest={(fileData) =>
                        handleLocalPreview({ fileData: fileData, name: "video_url", setValue: setValue })
                    }
                />
                <InputText {...inputProps} name="title" label="ชื่อสินค้า" />
                <InputNumber {...inputProps} name="startPrice" label="ราคาเริ่มต้น (บาท)" />
                <UseSelect
                    {...inputProps}
                    name="durationDays"
                    label="ระยะเวลาประมูล"
                    options={[
                        { value: 1, label: "1 วัน" },
                        { value: 5, label: "5 วัน" },
                        { value: 7, label: "7 วัน" },
                        { value: 10, label: "10 วัน" },
                    ]}
                />
                <UseSelect
                    {...inputProps}
                    name="categoryId"
                    label="หมวดหมู่"
                    options={categoryList}
                    optionLabel="name"
                    optionValue="id"
                />
                <UseTextArea {...inputProps} name="description" label="รายละเอียด" />
                <UseSelect
                    {...inputProps}
                    name="condition"
                    label="สภาพสินค้า"
                    options={[
                        { value: "new", label: "ใหม่" },
                        { value: "like_new", label: "เหมือนใหม่" },
                        { value: "good", label: "มือ 2" },
                    ]}
                />
                <UseSelect
                    {...inputProps}
                    name="state"
                    label="สถานะสินค้า"
                    options={[
                        { value: "draft", label: "บันทึกร่าง" },
                        { value: "pending_review", label: "รออนุมัติ" },
                        { value: "rejected", label: "ไม่อนุมัติ" },
                        { value: "active", label: "กำลังประมูล" },
                        { value: "ended", label: "หมดเวลาประมูล" },
                        { value: "sold", label: "มีผู้ชนะ" },
                        { value: "cancelled", label: "ยกเลิก" },
                    ]}
                />
                <UseSwitch {...inputProps} name="status" label="สถานะการใช้งาน" />
                {watchState === "rejected" && (
                    <UseTextArea {...inputProps} name="rejectedRemark" label="เหตุผลที่ไม่อนุมัติ" />
                )}
            </div>
            {!isWatch && (
                <div className="flex gap-2 items-center justify-end">
                    <UseTooltip title="กลับ">
                        <UseButton
                            shape="circle"
                            icon={LeftOutlined}
                            size="large"
                            type="default"
                            onClick={() => router.back()}
                        />
                    </UseTooltip>
                    {watchState === "draft" && (
                        <UseTooltip title="ตรวจสอบสินค้า">
                            <UseButton
                                shape="circle"
                                icon={CheckCircleFilled}
                                className="bg-blue-500! text-white!"
                                size="large"
                                type="default"
                                onClick={async () => {
                                    await submitForm(getValues(), "pending_review");
                                    onGetProductById();
                                }}
                            />
                        </UseTooltip>
                    )}
                    {watchState === "pending_review" && (
                        <UseTooltip title="ไม่อนุมัติ">
                            <UseButton
                                shape="circle"
                                icon={CloseCircleFilled}
                                className="bg-red-500! text-white!"
                                size="large"
                                type="default"
                                onClick={() => setModalRejected(true)}
                            />
                        </UseTooltip>
                    )}
                    {watchState === "pending_review" && (
                        <UseTooltip title="อนุมัติ">
                            <UseButton
                                shape="circle"
                                icon={CheckCircleFilled}
                                className="bg-green-500! text-white!"
                                size="large"
                                type="default"
                                onClick={async () => {
                                    await submitForm(getValues(), "active");
                                    onGetProductById();
                                }}
                            />
                        </UseTooltip>
                    )}
                    {mode === "create" && (
                        <UseTooltip title="บันทึก">
                            <UseButton shape="circle" icon={SaveFilled} size="large" htmlType="submit" />
                        </UseTooltip>
                    )}
                </div>
            )}
            <UseModal
                open={modalRejected}
                onCancel={() => setModalRejected(false)}
                onOk={async () => {
                    await submitForm(getValues(), "rejected");
                    setModalRejected(false);
                    onGetProductById();
                }}
                title="เหตุผลที่ไม่อนุมัติ"
            >
                <UseTextArea {...inputProps} name="rejectedRemark" label="เหตุผล" disabled={false} />
            </UseModal>
        </form>
    );
}

export default Form;
