"use client";
import InputText from "@/app/components/inputs/InputText";
import UseCheckbox from "@/app/components/inputs/UseCheckbox";
import UseTextArea from "@/app/components/inputs/UseTextArea";
import UseButton from "@/app/components/inputs/UseButton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { upsertAddress } from "@/app/services/address.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { supabase } from "@/app/lib/supabase/client";

const schema = yup.object({
    name: yup.string().required("กรุณากรอกชื่อ-นามสกุล"),
    phone: yup.string().required("กรุณากรอกเบอร์โทรศัพท์"),
    province: yup.string().required("กรุณากรอกจังหวัด"),
    district: yup.string().required("กรุณากรอกอำเภอ/เขต"),
    postalCode: yup.string().required("กรุณากรอกรหัสไปรษณีย์"),
    address: yup.string().required("กรุณากรอกที่อยู่"),
});

function UserAddressForm({ editData, onSuccess, onClose }) {
    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (editData) {
            reset({
                id: editData.id,
                name: editData.receiver_name,
                phone: editData.phone,
                province: editData.province,
                district: editData.district,
                postalCode: editData.postal_code,
                address: editData.address_line,
                isDefault: editData.is_default,
            });
        } else {
            reset({});
        }
    }, [editData, reset]);

    const onSubmit = async (values) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        const payload = {
            ...(values.id ? { id: values.id } : {}),
            user_id: user.id,
            receiver_name: values.name,
            phone: values.phone,
            province: values.province,
            district: values.district,
            postal_code: values.postalCode,
            address_line: values.address,
            is_default: values.isDefault ?? false,
        };
        const { error } = await upsertAddress(payload);
        if (error) return notifyError(error);
        notifySuccess("บันทึกที่อยู่สำเร็จ");
        reset({});
        onSuccess?.();
        onClose?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="flex gap-4 items-start">
                <InputText control={control} name="name" label="ชื่อ-นามสกุล" size="large" />
                <InputText control={control} name="phone" label="เบอร์โทรศัพท์" size="large" />
            </div>
            <div className="flex gap-4 items-start">
                <InputText control={control} name="province" label="จังหวัด" size="large" />
                <InputText control={control} name="district" label="อำเภอ/เขต" size="large" />
                <InputText control={control} name="postalCode" label="รหัสไปรษณีย์" size="large" />
            </div>
            <UseTextArea control={control} name="address" label="ที่อยู่" />
            <UseCheckbox control={control} name="isDefault" label="เลือกเป็นที่อยู่ตั้งต้น" className="w-fit" />
            <div className="flex justify-end gap-2">
                <UseButton
                    type="default"
                    label="ปิด"
                    onClick={() => {
                        onClose();
                        reset({});
                    }}
                />
                <UseButton label="บันทึก" htmlType="submit" />
            </div>
        </form>
    );
}

export default UserAddressForm;
