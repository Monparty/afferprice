"use client";
import InputText from "@/app/components/inputs/InputText";
import { useForm } from "react-hook-form";
import { PlusOutlined, EditOutlined, LeftOutlined, SaveFilled, EyeFilled } from "@ant-design/icons";
import UseButton from "@/app/components/inputs/UseButton";
import { useRouter } from "next/navigation";
import UseSwitch from "@/app/components/inputs/UseSwitch";
import { useEffect } from "react";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getCategorieById } from "@/app/services/admin/categories.service";
import UseTooltip from "@/app/components/utils/UseTooltip";

function Form({ id, mode, onSubmit }) {
    const router = useRouter();
    const isWatch = Boolean(mode === "watch");
    const { control, handleSubmit, reset } = useForm();
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

    useEffect(() => {
        if (!id) return;
        const onGetCategorieById = async () => {
            const { data, error } = await getCategorieById(id);
            if (error) return notifyError(error);
            const formatData = {
                ...data,
                status: data.status === "active",
            };
            reset(formatData);
        };
        onGetCategorieById();
    }, [id, reset]);

    const submitForm = async (data) => {
        await onSubmit(data);
    };

    return (
        <form className="grid gap-6" onSubmit={handleSubmit(submitForm)}>
            <div className="flex gap-2 items-center">
                {Icon && <UseButton shape="circle" icon={Icon} size="large" />}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <InputText {...inputProps} name="name" label="ชื่อหมวดหมู่" />
                <InputText {...inputProps} name="description" label="คำอธิบาย" />
                <UseSwitch {...inputProps} name="status" label="สถานะการใช้งาน" />
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
                    <UseTooltip title="บันทึก">
                        <UseButton shape="circle" icon={SaveFilled} size="large" htmlType="submit" />
                    </UseTooltip>
                </div>
            )}
        </form>
    );
}

export default Form;
