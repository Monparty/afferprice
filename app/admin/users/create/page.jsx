"use client";
import Form from "../components/Form";
import { createAuthUser, upsertProfile, deleteAuthUser } from "@/app/services/admin/users.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../constants/routes";

function Page() {
    const router = useRouter();
    const handleCreate = async (value) => {
        const authPayload = {
            email: value.email,
            password: value.password,
            user_metadata: {
                display_name: value.firstName,
            },
            email_confirm: true, // ยืนยันให้เลยตั้งแต่อสร้าง
        };
        const { data: authData, error: authError } = await createAuthUser(authPayload);
        if (authError) return notifyError(authError);

        const userId = authData.user.id;
        const profilePayload = {
            id: userId,
            phone: value.phone,
            first_name: value.firstName,
            last_name: value.lastName,
            gender: value.gender,
            age: value.age,
            birth_date: value.birthDate,
            role: value.role,
            status: value.status ? "active" : "inactive",
        };
        const { error: profileError } = await upsertProfile(profilePayload);
        if (profileError) {
            await deleteAuthUser(userId);
            return notifyError(profileError);
        }
        notifySuccess("บันทึกข้อมูลสำเร็จ");
        router.push(ROUTES.ADMIN_USERS);
    };

    return <Form mode="create" onSubmit={handleCreate} />;
}

export default Page;
