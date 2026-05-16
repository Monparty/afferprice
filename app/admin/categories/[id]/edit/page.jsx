"use client";
import Form from "../../components/Form";
import { useParams } from "next/navigation";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { upsertCategorie } from "@/app/services/admin/categories.service";

function Page() {
    const { id } = useParams();
    const handleUpdate = async (value) => {
        const payload = {
            id: id,
            name: value.name,
            description: value.description,
            evaluation: value.evaluation,
            status: value.status ? "active" : "inactive",
        };
        const { error } = await upsertCategorie(payload);
        if (error) return notifyError(error);
        notifySuccess("บันทึกข้อมูลสำเร็จ");
    };

    return <Form mode="edit" id={id} onSubmit={handleUpdate} />;
}

export default Page;
