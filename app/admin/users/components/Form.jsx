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
import { getUsersById } from "@/app/services/admin/users.service";
import { notifyError } from "@/app/providers/NotificationProvider";

function Form({ id, mode, handleCreate }) {
    const router = useRouter();
    const isEdit = Boolean(id);
    const isWatch = Boolean(mode === "watch");
    const { control, handleSubmit, watch, setValue, reset } = useForm();
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
        const onGetUsersById = async () => {
            const { data, error } = await getUsersById(id);
            if (error) return notifyError(error);
            const formatData = {
                ...data,
                firstName: data.first_name,
                lastName: data.last_name,
                createdAt: data.created_at,
            };
            console.log("formatData", formatData)
            reset(formatData);
        };
        onGetUsersById();
    }, [id, reset]);

    const SubmitFrom = async (data) => {
        // console.log("data", data);
        if (isEdit) {
            alert("edit");
            // await updateUser(id, data);
        } else {
            // alert("create");
            handleCreate(data);
        }
    };

    // console.log("watch", watch());

    return (
        <form className="grid gap-6" onSubmit={handleSubmit(SubmitFrom)}>
            <div className="flex gap-2 items-center">
                {Icon && <UseButton shape="circle" icon={Icon} size="large" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <InputText {...inputProps} name="firstName" label="ชื่อจริง" />
                <InputText {...inputProps} name="lastName" label="นามสกุล" />
                <InputText {...inputProps} name="phone" label="เบอร์โทร" />
                <InputNumber {...inputProps} name="gender" label="อายุ" />
                <UseDatePicker {...inputProps} name="birthDate" label="วันเกิด" size="large" />
                <UseSelect
                    {...inputProps}
                    options={[
                        { label: "ผู้ใช้งาน", value: "user" },
                        { label: "ผู้ดูแลระบบ", value: "admin" },
                    ]}
                    name="role"
                    label="สิทธิ์"
                    size="large"
                    disabled={isWatch}
                />
                <InputText {...inputProps} name="email" label="อีเมล" />
                <UseInputPassword {...inputProps} name="password" label="รหัสผ่าน" />
                <UseSwitch {...inputProps} name="status" label="สถานะการใช้งาน" />
            </div>
            {!isWatch && (
                <div className="flex gap-2 items-center justify-end">
                    <UseButton
                        shape="circle"
                        icon={LeftOutlined}
                        size="large"
                        type="default"
                        onClick={() => router.back()}
                    />
                    <UseButton shape="circle" icon={SaveFilled} size="large" htmlType="submit" />
                </div>
            )}
        </form>
    );
}

export default Form;
