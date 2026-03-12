"use client";
import InputText from "@/app/components/inputs/InputText";
import { useForm } from "react-hook-form";
import { PlusOutlined, EditOutlined, LeftOutlined, SaveFilled, EyeFilled } from "@ant-design/icons";
import UseButton from "@/app/components/inputs/UseButton";
import { useRouter } from "next/navigation";

function Form({ id, mode }) {
    const router = useRouter();
    const isEdit = Boolean(id);
    const isWatch = Boolean(mode === "watch");
    const { control, handleSubmit } = useForm();
    const modeIcons = {
        watch: EyeFilled,
        create: PlusOutlined,
        edit: EditOutlined,
    };
    const Icon = modeIcons[mode];

    const SubmitFrom = async (data) => {
        // console.log("data", data);
        if (isEdit) {
            alert("edit");
            // await updateUser(id, data);
        } else {
            alert("create");
            // await createUser(data);
        }
    };

    return (
        <form className="grid gap-6" onSubmit={handleSubmit(SubmitFrom)}>
            <div className="flex gap-2 items-center">
                {Icon && <UseButton shape="circle" icon={Icon} size="large" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <InputText control={control} name="firstName" label="ชื่อจริง" size="large" disabled={isWatch} />
                <InputText control={control} name="firstName" label="ชื่อจริง" size="large" disabled={isWatch} />
                <InputText control={control} name="firstName" label="ชื่อจริง" size="large" disabled={isWatch} />
                <InputText control={control} name="firstName" label="ชื่อจริง" size="large" disabled={isWatch} />
                <InputText control={control} name="firstName" label="ชื่อจริง" size="large" disabled={isWatch} />
                <InputText control={control} name="firstName" label="ชื่อจริง" size="large" disabled={isWatch} />
                <InputText control={control} name="firstName" label="ชื่อจริง" size="large" disabled={isWatch} />
                <InputText control={control} name="firstName" label="ชื่อจริง" size="large" disabled={isWatch} />
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
