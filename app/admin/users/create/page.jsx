"use client";
import Form from "../components/Form";
import { createAuthUser, createProfile, deleteAuthUser } from "@/app/services/admin/users.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../constants/routes";

function Page() {
    const router = useRouter();
    const handleCreate = async (value) => {
        const { data: authData, error: authError } = await createAuthUser({
            email: value.email,
            password: value.password,
            displayName: value.firstName,
        });
        if (authError) return notifyError(authError);
        const userId = authData.user.id;
        const payload = {
            id: userId,
            phone: value.phone,
            firstName: value.firstName,
            lastName: value.lastName,
            gender: value.gender,
            birthDate: value.birthDate,
            role: value.role,
            status: value.status ? "active" : "inactive",
        };
        const { error: profileError } = await createProfile(payload);
        if (profileError) {
            await deleteAuthUser(userId);
            return notifyError(profileError);
        }
        notifySuccess("บันทึกข้อมูลสำเร็จ");
        router.push(ROUTES.ADMIN_USERS);
    };

    return <Form mode="create" handleCreate={handleCreate} />;
}

export default Page;
