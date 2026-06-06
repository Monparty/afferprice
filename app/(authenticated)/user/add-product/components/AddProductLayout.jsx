"use client";
import { useForm } from "react-hook-form";
import CardAddProductPreview from "@/app/(authenticated)/user/add-product/components/CardAddProductPreview";
import { useEffect, useRef, useState } from "react";
import { getParentCategories } from "@/app/services/categories.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { getProductById, upsertProduct } from "@/app/services/products.service";
import { getListingFeePayment } from "@/app/services/payment.service";
import { uploadPendingFiles, removeDeletedFiles } from "@/app/utils/storageHelper";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/app/features/user/userSlice";
import Form from "./Form";
import AddProductSteps from "./AddProductSteps";
import UseSkeleton from "@/app/components/utils/UseSkeleton";

function AddProductLayout({ productId }) {
    const [activeStep, setActiveStep] = useState(0);
    const originalFilesRef = useRef({ images: [], video: [] });
    const [categoryList, setCategoryList] = useState([]);
    const { watch, control, getValues, setValue, reset } = useForm({
        defaultValues: {
            isSeller: true,
        },
    });
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.user);

    const watchProductId = watch("productId");
    const effectiveProductId = watchProductId || productId;
    const [feePayment, setFeePayment] = useState(null);

    const refreshFeePayment = async () => {
        if (!effectiveProductId) {
            setFeePayment(null);
            return;
        }
        const { data: fee } = await getListingFeePayment(effectiveProductId);
        setFeePayment(fee || null);
    };

    useEffect(() => {
        refreshFeePayment();
    }, [effectiveProductId]);

    const isFeePaid = feePayment?.payment_status === "success";

    useEffect(() => {
        dispatch(fetchUser());

        const onGetParentCategories = async () => {
            const { data, error } = await getParentCategories();
            if (error) return notifyError(error);
            setCategoryList(data);
        };
        onGetParentCategories();
    }, [dispatch]);

    useEffect(() => {
        if (!productId) return;
        const onGetProductById = async () => {
            const { data, error } = await getProductById(productId);
            if (error) return notifyError(error);

            const formatData = {
                ...data,
                productId: data.id,
                title: data.title,
                categoryId: data.category_id,
                condition: data.condition,
                description: data.description,
                isSeller: data.is_seller === "Y",
                startPrice: data.start_price,
                durationDays: data.duration_days,
                images_url: data?.images_url?.map((item) => ({
                    ...item,
                    status: "done",
                })),
                video_url: data?.video_url?.map((item) => ({
                    ...item,
                    status: "done",
                    thumbUrl: "/images/videoThumb.png",
                })),
            };
            originalFilesRef.current = {
                images: formatData.images_url || [],
                video: formatData.video_url || [],
            };
            reset(formatData);
        };
        onGetProductById();
    }, [productId]);

    const onSubmit = async (state) => {
        try {
            const value = getValues();
            const uploadedImages = await uploadPendingFiles(value?.images_url || []);
            const uploadedVideos = await uploadPendingFiles(value?.video_url || []);

            const payload = {
                id: value?.productId ?? productId ?? undefined,
                seller_id: data?.id,
                category_id: value.categoryId,
                title: value.title,
                description: value.description,
                condition: value.condition || "new",
                start_price: value.startPrice,
                state: state,
                images_url: uploadedImages,
                video_url: uploadedVideos,
                duration_days: value.durationDays,
                is_seller: value.isSeller ? "Y" : "N",
                evaluation: value.evaluation ?? null,
                quality_score: value.quality_score ?? null,
            };

            const { data: productData, error: productError } = await upsertProduct(payload);
            if (productError) return notifyError(productError);
            await removeDeletedFiles(originalFilesRef.current.images, value?.images_url || []);
            await removeDeletedFiles(originalFilesRef.current.video, value?.video_url || []);
            if (productData) {
                setValue("productId", productData.id);
            }
            notifySuccess(state === "pending_review" ? "ส่งตรวจสอบสินค้าสำเร็จ" : "บันทึกร่างสำเร็จ");
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

    return (
        <main className="w-full flex flex-col gap-6">
            <AddProductSteps activeStep={activeStep} />
            <div className="flex justify-center gap-6">
                <div className={`flex-2 ${activeStep === 2 ? "hidden" : ""}`}>
                    <Form
                        activeStep={activeStep}
                        control={control}
                        categoryList={categoryList}
                        setValue={setValue}
                        isKyc={data?.is_kyc ?? "unknown"}
                        feePayment={feePayment}
                        refreshFeePayment={refreshFeePayment}
                    />
                </div>
                <div className={`${activeStep === 2 ? "w-1/2" : "flex-1"}`}>
                    <CardAddProductPreview
                        watch={watch}
                        control={control}
                        activeStep={activeStep}
                        setActiveStep={setActiveStep}
                        onSubmit={onSubmit}
                        isKyc={data?.is_kyc ?? "unknown"}
                        isFeePaid={isFeePaid}
                    />
                </div>
            </div>
        </main>
    );
}

export default AddProductLayout;
