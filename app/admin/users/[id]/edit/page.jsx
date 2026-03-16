"use client";
import { upsertProfile } from "@/app/services/admin/users.service";
import Form from "../../components/Form";
import { useParams } from "next/navigation";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";

function Page() {
    const { id } = useParams();
    const handleUpdate = async (value) => {
        const payload = {
            id: id,
            phone: value.phone,
            first_name: value.firstName,
            last_name: value.lastName,
            gender: value.gender,
            age: value.age,
            birth_date: value.birthDate,
            role: value.role,
            status: value.status ? "active" : "inactive",
        };
        const { error } = await upsertProfile(payload);
        if (error) return notifyError(error);
        notifySuccess("บันทึกข้อมูลสำเร็จ");
    };

    return <Form mode="edit" id={id} onSubmit={handleUpdate} />;
}

export default Page;
