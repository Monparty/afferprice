"use client";
import Form from "../components/Form";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../constants/routes";
import { upsertCategorie } from "@/app/services/admin/categories.service";

function Page() {
    const router = useRouter();
    const handleCreate = async (value) => {
        const payload = {
            name: value.name,
            description: value.description,
            status: value.status ? "active" : "inactive",
        };
        const { error } = await upsertCategorie(payload);
        if (error) return notifyError(error);
        notifySuccess("บันทึกข้อมูลสำเร็จ");
        router.push(ROUTES.ADMIN_PRODUCT);
    };

    return <Form mode="create" onSubmit={handleCreate} />;
}

export default Page;
