"use client";
import { useForm } from "react-hook-form";
import CardAddProductPreview from "@/app/components/utils/CardAddProductPreview";
import { useEffect, useState } from "react";
import { getCategories } from "@/app/services/categories.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { upsertProduct } from "@/app/services/products.service";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/app/features/user/userSlice";
import dayjs from "dayjs";
import Form from "./Form";
import AddProductSteps from "./AddProductSteps";

function AddProductLayout() {
    const [activeStep, setActiveStep] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const { watch, control, getValues, setValue } = useForm();
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUser());

        const fetchCategories = async () => {
            const { data, error } = await getCategories();
            if (error) return notifyError(error);
            setCategoryList(data);
        };
        fetchCategories();
    }, [dispatch]);

    const onSubmit = async () => {
        const value = getValues();
        const formatEndTime = dayjs().add(value.auctionEndTime, "day").toISOString();
        const formatImageUrl = value?.image_url?.map((file) => ({
            uid: file.uid,
            name: file.name,
            url: file.url || file.thumbUrl,
        }));
        const formatVideoUrl = value?.video_url?.map((file) => ({
            uid: file.uid,
            name: file.name,
            url: file.url || file.thumbUrl,
        }));

        const payload = {
            id: value?.productId ?? undefined,
            seller_id: data?.id,
            category_id: value.categoryId,
            title: value.title,
            description: value.description,
            condition: value.condition,
            start_price: value.startPrice,
            auction_end_time: formatEndTime,
            status: "draft",
            images_url: formatImageUrl,
            video_url: formatVideoUrl,
        };

        const { data: productData, error: productError } = await upsertProduct(payload);
        if (productError) return notifyError(productError);
        if (productData) {
            setValue("productId", productData.id);
        }
        notifySuccess("บันทึกร่างสำเร็จ");
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <main className="w-full flex flex-col gap-6">
            <AddProductSteps activeStep={activeStep} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Form activeStep={activeStep} control={control} categoryList={categoryList} />
                <CardAddProductPreview
                    watch={watch}
                    control={control}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    onSubmit={onSubmit}
                />
            </div>
        </main>
    );
}

export default AddProductLayout;
