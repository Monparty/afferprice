"use client";
import Form from "../components/Form";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../constants/routes";
import { upsertProduct } from "@/app/services/admin/products.service";
import { uploadPendingFiles } from "@/app/utils/storageHelper";
import { useDispatch, useSelector } from "react-redux";
import UseSkeleton from "@/app/components/utils/UseSkeleton";
import { useEffect } from "react";
import { fetchUser } from "@/app/features/user/userSlice";
import dayjs from "dayjs";

function Page() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    const handleCreate = async (value) => {
        try {
            const uploadedImages = await uploadPendingFiles(value?.images_url || []);
            const uploadedVideos = await uploadPendingFiles(value?.video_url || []);
            const formatEndTime = dayjs().add(value.durationDays, "day").toISOString();

            const payload = {
                id: undefined,
                seller_id: data?.id,
                category_id: value.categoryId,
                title: value.title,
                description: value.description,
                condition: value.condition || "new",
                start_price: value.startPrice,
                auction_end_time: formatEndTime,
                state: "draft",
                images_url: uploadedImages,
                video_url: uploadedVideos,
                duration_days: value.durationDays,
                is_seller: value.isSeller ? "Y" : "N",
                status: value.status ? "active" : "inactive",
            };
            const { error: upsertError } = await upsertProduct(payload);
            if (upsertError) return notifyError(upsertError);
            notifySuccess("บันทึกข้อมูลสำเร็จ");
            router.push(ROUTES.ADMIN_PRODUCT);
        } catch (error) {
            notifyError(error);
        }
    };

    if (loading) {
        return (
            <div className="grid gap-6">
                <UseSkeleton />
                <UseSkeleton />
            </div>
        );
    }
    if (error) return <p>Error: {error}</p>;

    return <Form mode="create" onSubmit={handleCreate} />;
}

export default Page;
