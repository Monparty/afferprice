"use client";
import InputText from "@/app/components/inputs/InputText";
import { useForm } from "react-hook-form";
import { PlusOutlined, EditOutlined, LeftOutlined, SaveFilled, EyeFilled } from "@ant-design/icons";
import UseButton from "@/app/components/inputs/UseButton";
import { useRouter } from "next/navigation";
import UseInputPassword from "@/app/components/inputs/UseInputPassword";
import UseSelect from "@/app/components/inputs/UseSelect";
import UseSwitch from "@/app/components/inputs/UseSwitch";
import UseDatePicker from "@/app/components/inputs/UseDatePicker";
import InputNumber from "@/app/components/inputs/InputNumber";
import { useEffect } from "react";
import { getUserById } from "@/app/services/admin/users.service";
import { notifyError } from "@/app/providers/NotificationProvider";
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
        const onGetUserById = async () => {
            const { data, error } = await getUserById(id);
            if (error) return notifyError(error);
            const formatData = {
                ...data,
                firstName: data.first_name,
                lastName: data.last_name,
                birthDate: data.birth_date,
                status: data.status === "active",
            };
            reset(formatData);
        };
        onGetUserById();
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
                <InputText {...inputProps} name="firstName" label="ชื่อจริง" />
                <InputText {...inputProps} name="lastName" label="นามสกุล" />
                <InputText {...inputProps} name="phone" label="เบอร์โทร" />
                <UseSelect
                    {...inputProps}
                    options={[
                        { label: "ชาย", value: "M" },
                        { label: "หญิง", value: "F" },
                        { label: "อื่นๆ", value: "O" },
                    ]}
                    name="gender"
                    label="เพศ"
                />
                <InputNumber {...inputProps} name="age" label="อายุ" />
                <UseDatePicker {...inputProps} name="birthDate" label="วันเกิด" />
                <InputText {...inputProps} name="email" label="อีเมล" />
                <UseInputPassword {...inputProps} name="password" label="รหัสผ่าน" />
                <UseSelect
                    {...inputProps}
                    options={[
                        { label: "ผู้ใช้งาน", value: "user" },
                        { label: "ผู้ดูแลระบบ", value: "admin" },
                    ]}
                    name="role"
                    label="สิทธิ์"
                />
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
