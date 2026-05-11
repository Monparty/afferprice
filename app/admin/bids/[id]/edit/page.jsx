"use client";
import Form from "../../components/Form";
import { useParams } from "next/navigation";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import UseSkeleton from "@/app/components/utils/UseSkeleton";
import { fetchUser } from "@/app/features/user/userSlice";
import { upsertProduct } from "@/app/services/admin/products.service";
import { uploadPendingFiles } from "@/app/utils/storageHelper";

function Page() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    const handleUpdate = async (value, state) => {
        try {
            const uploadedImages = await uploadPendingFiles(value?.images_url || []);
            const uploadedVideos = await uploadPendingFiles(value?.video_url || []);
            const formatEndTime = dayjs().add(value.durationDays, "day").toISOString();

            const payload = {
                id: id,
                seller_id: data?.id,
                category_id: value.categoryId,
                title: value.title,
                description: value.description,
                condition: value.condition || "new",
                start_price: value.startPrice,
                auction_end_time: formatEndTime,
                state: state,
                rejected_remark: value.rejectedRemark,
                images_url: uploadedImages,
                video_url: uploadedVideos,
                duration_days: value.durationDays,
                is_seller: value.isSeller ? "Y" : "N",
                status: value.status ? "active" : "inactive",
            };

            const { error: upsertError } = await upsertProduct(payload);
            if (upsertError) return notifyError(upsertError);
            notifySuccess("บันทึกข้อมูลสำเร็จ");
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

    return <Form mode="edit" id={id} onSubmit={handleUpdate} />;
}

export default Page;
