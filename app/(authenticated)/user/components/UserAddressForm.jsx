"use client";
import InputText from "@/app/components/inputs/InputText";
import UseCheckbox from "@/app/components/inputs/UseCheckbox";
import UseSelect from "@/app/components/inputs/UseSelect";
import UseTextArea from "@/app/components/inputs/UseTextArea";
import { useForm } from "react-hook-form";

function UserAddressForm() {
    const { control } = useForm();
    return (
        <form className="grid gap-4">
            <div className="flex gap-4 items-start">
                <InputText control={control} name="name" label="เบอร์โทรศัพท์" size="large" />
                <InputText control={control} name="phone" label="เบอร์โทรศัพท์" size="large" />
            </div>
            <div className="flex gap-4 items-start">
                <UseSelect control={control} name="province" label="จังหวัด" size="large" options={[]} />
                <UseSelect control={control} name="district" label="อำเภอ" size="large" options={[]} />
                <UseSelect control={control} name="subdistrict" label="ตำบล" size="large" options={[]} />
            </div>
            <UseTextArea control={control} name="address" label="ที่อยู่" />
            <UseCheckbox control={control} name="isDefault" label="เลือกเป็นที่อยู่ตั้งต้น" className="w-fit" />
        </form>
    );
}

export default UserAddressForm;
