"use client";
import InputText from "@/app/components/inputs/InputText";
import { useForm } from "react-hook-form";
import { PlusOutlined, EditOutlined, LeftOutlined, SaveFilled, EyeFilled, CloseCircleFilled } from "@ant-design/icons";
import UseButton from "@/app/components/inputs/UseButton";
import { useRouter } from "next/navigation";
import UseSwitch from "@/app/components/inputs/UseSwitch";
import { useEffect, useState } from "react";
import { notifyError } from "@/app/providers/NotificationProvider";
import UseUpload from "@/app/components/inputs/UseUpload";
import InputNumber from "@/app/components/inputs/InputNumber";
import UseSelect from "@/app/components/inputs/UseSelect";
import UseTextArea from "@/app/components/inputs/UseTextArea";
import { getParentCategories } from "@/app/services/categories.service";
import { getProductById } from "@/app/services/admin/products.service";
import UseTooltip from "@/app/components/utils/UseTooltip";
import UseModal from "@/app/components/utils/UseModal";
import { handleUpload } from "@/app/utils/storageHelper";

function Form({ id, mode, onSubmit }) {
    const router = useRouter();
    const isWatch = Boolean(mode === "watch");
    const { control, handleSubmit, setValue, reset } = useForm();
    const modeIcons = {
        watch: EyeFilled,
        create: PlusOutlined,
        edit: EditOutlined,
    };
    const Icon = modeIcons[mode];
    const inputProps = {
        control: control,
        size: "large",
        disabled: isWatch,
    };

    const [modalRejected, setModalRejected] = useState(false);
    const [categoryList, setCategoryList] = useState([]);

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
            reset(formatData);
        };
        onGetProductById();
    }, [id, reset]);

    const submitForm = async (data) => {
        await onSubmit(data);
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
                        handleUpload({ fileData: fileData, name: "images_url", setValue: setValue })
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
                        handleUpload({ fileData: fileData, name: "video_url", setValue: setValue })
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
                <UseSwitch {...inputProps} name="status" label="สถานะการใช้งาน" />
                <UseModal
                    open={modalRejected}
                    onCancel={() => setModalRejected(false)}
                    onOk={() => {}}
                    title="เหตุผลที่ไม่อนุมัติ"
                >
                    <UseTextArea {...inputProps} name="rejectedRemark" label="เหตุผล" />
                </UseModal>
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
                    {mode === "edit" && (
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
                    <UseTooltip title="บันทึก">
                        <UseButton shape="circle" icon={SaveFilled} size="large" htmlType="submit" />
                    </UseTooltip>
                </div>
            )}
        </form>
    );
}

export default Form;
