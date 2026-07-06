"use client";
import InputNumber from "@/app/components/inputs/InputNumber";
import InputText from "@/app/components/inputs/InputText";
import UseSegmented from "@/app/components/inputs/UseSegmented";
import UseSelect from "@/app/components/inputs/UseSelect";
import UseUpload from "@/app/components/inputs/UseUpload";
import {
    CameraFilled,
    CheckCircleFilled,
    CreditCardFilled,
    EditFilled,
    ExclamationCircleFilled,
    FileTextFilled,
    VideoCameraFilled,
} from "@ant-design/icons";
import UseSelectCard from "@/app/components/inputs/UseSelectCard";
import { Activity } from "react";
import UseTextArea from "@/app/components/inputs/UseTextArea";
import { handleLocalPreview } from "@/app/utils/storageHelper";
import { useWatch } from "react-hook-form";
import ListingFeePayment from "@/app/components/payment/ListingFeePayment";
import ProductEvaluation from "./ProductEvaluation";
import UseButton from "@/app/components/inputs/UseButton";

function AddProductForm({
    activeStep,
    control,
    categoryList,
    setValue,
    isKyc = "unknown",
    feePayment = null,
    refreshFeePayment,
}) {
    const watchState = useWatch({ control, name: "state" });
    const watchCategoryId = useWatch({ control, name: "categoryId" });
    const watchStartPrice = useWatch({ control, name: "startPrice" });
    const watchProductId = useWatch({ control, name: "productId" });
    const evaluationGroups = categoryList.find((c) => c.id === watchCategoryId)?.evaluation || [];
    const listingFee = Math.max(1, Math.round((Number(watchStartPrice) || 0) * 0.05));

    const feeStatus = feePayment?.payment_status ?? null;
    const isFeePaid = feeStatus === "success";
    const isFeePending = feeStatus === "pending";

    // console.log("watchState", watchState)
    return (
        <form className="flex flex-col gap-6">
            {watchState === "rejected" && (
                <div className="bg-red-50 dark:bg-red-950/40 p-6 rounded-xl border border-red-400 border-l-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                        <ExclamationCircleFilled className="text-orange-600!" />
                        สินค้าของคุณไม่ผ่านการอนุมัติเนื่องจาก
                    </h2>
                    <UseTextArea control={control} name="rejected_remark" size="large" disabled />
                </div>
            )}
            {activeStep !== 3 && (
                <>
                    <Activity mode={activeStep === 0 ? "visible" : "hidden"}>
                        <section className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <CameraFilled className="text-orange-600!" />
                                    อัปโหลดรูปภาพ
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    รูปภาพคุณภาพสูงจะช่วยเพิ่มโอกาสในการขายได้ถึง 40%
                                </p>
                            </div>
                            <UseUpload
                                control={control}
                                name="images_url"
                                title="ลากและวางรูปภาพลงที่นี่"
                                multiple
                                maxCount={10}
                                description="อัปโหลดรูปภาพอย่างน้อย 5 รูป และไม่เกิน 10 รูป"
                                isDrag
                                customRequest={(fileData) =>
                                    handleLocalPreview({ fileData: fileData, name: "images_url", setValue: setValue })
                                }
                            />
                        </section>
                        <section className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <VideoCameraFilled className="text-orange-600!" />
                                    อัปโหลด Video
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    วิดีโอตัวอย่างสินค้าจริง จะเพิ่มความมั่นใจก่อนกดสั่งซื้อ
                                </p>
                            </div>
                            <UseUpload
                                control={control}
                                name="video_url"
                                title="ลากและวาง Video ลงที่นี่"
                                multiple
                                maxCount={1}
                                isDrag
                                acceptVideo
                                textFileType="MP4"
                                textFileSize="ขนาดไฟล์ไม่เกิน 5MB ความยาว 15 - 30 วินาที"
                                customRequest={(fileData) =>
                                    handleLocalPreview({ fileData, name: "video_url", setValue, acceptVideo: true })
                                }
                            />
                        </section>
                    </Activity>
                    <Activity mode={activeStep === 1 ? "visible" : "hidden"}>
                        <section className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <EditFilled className="text-orange-600!" />
                                    ตั้งค่าการประมูล
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    ระบุรายละเอียดเบื้องต้นของสินค้า
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <InputText control={control} name="title" label="ชื่อสินค้า" size="large" />
                                <InputNumber
                                    control={control}
                                    name="startPrice"
                                    label="ราคาเริ่มต้น (บาท)"
                                    size="large"
                                    format
                                />
                            </div>
                            <UseSelectCard
                                control={control}
                                name="durationDays"
                                label="ระยะเวลาประมูล"
                                options={[
                                    { value: 0, label: "10 นาที", subTitle: "TEST" },
                                    { value: 1, label: "1 วัน", subTitle: "QUICK SALE" },
                                    { value: 5, label: "5 วัน", subTitle: "POPULAR" },
                                    { value: 7, label: "7 วัน", subTitle: "STANDARD" },
                                    { value: 10, label: "10 วัน", subTitle: "MAXIMUM" },
                                ]}
                            />
                        </section>
                        <section className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FileTextFilled className="text-orange-600!" />
                                    รายละเอียดสินค้า
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    ระบุข้อมูลให้ครบถ้วนเพื่อดึงดูดผู้ประมูล
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <UseSelect
                                    control={control}
                                    name="categoryId"
                                    label="หมวดหมู่"
                                    options={categoryList}
                                    optionLabel="name"
                                    optionValue="id"
                                    size="large"
                                />
                                <UseSegmented
                                    control={control}
                                    name="condition"
                                    label="สภาพสินค้า"
                                    options={[
                                        { value: "new", label: "ใหม่" },
                                        { value: "like_new", label: "เหมือนใหม่" },
                                        { value: "good", label: "มือ 2" },
                                    ]}
                                    size="large"
                                />
                            </div>
                            <ProductEvaluation
                                control={control}
                                setValue={setValue}
                                evaluationGroups={evaluationGroups}
                            />
                            <UseTextArea
                                control={control}
                                name="description"
                                label="รายละเอียด"
                                placeholder="กรุณาระบุรายละเอียด เช่น สภาพสินค้า, ตำหนิ, อุปกรณ์ที่ได้รับ หรือระยะเวลาประกัน"
                                size="large"
                            />
                        </section>
                    </Activity>
                </>
            )}

            <Activity mode={activeStep === 3 ? "visible" : "hidden"}>
                <section className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <CreditCardFilled className="text-orange-600!" />
                            ชำระเงินค่าประกันการขาย
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            เงินค่าประกันการขาย 5% ของราคาเริ่มต้น = ฿{listingFee.toLocaleString()}{" "}
                            (ได้รับคืนเข้ากระเป๋าเงินหากการขายไม่สำเร็จ)
                        </p>
                    </div>
                    {isKyc !== "approved" ? (
                        <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900 rounded-xl p-4 text-sm text-orange-700 dark:text-orange-300">
                            กรุณายืนยันตัวตน (KYC) และรอ admin อนุมัติก่อน จึงจะชำระเงินค่าประกันการขายได้
                        </div>
                    ) : !watchProductId ? (
                        <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900 rounded-xl p-4 text-sm text-orange-700 dark:text-orange-300">
                            กรุณาบันทึกและส่งตรวจสอบสินค้าก่อน จึงจะชำระเงินค่าประกันการขายได้
                        </div>
                    ) : isFeePaid ? (
                        <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 rounded-xl p-4 flex items-center gap-3">
                            <CheckCircleFilled className="text-2xl! text-green-600!" />
                            <div>
                                <p className="font-semibold text-green-700 dark:text-green-400">
                                    ชำระเงินค่าประกันการขายเรียบร้อยแล้ว
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    ฿{Number(feePayment.amount).toLocaleString()} •{" "}
                                    {feePayment.payment_method?.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    ) : isFeePending ? (
                        <div className="grid gap-3">
                            <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900 rounded-xl p-4 text-sm text-orange-700 dark:text-orange-300">
                                กำลังตรวจสอบการชำระเงิน หากชำระแล้วโปรดรอสักครู่หรือกดรีเฟรช
                            </div>
                            <UseButton label="รีเฟรชสถานะ" type="default" onClick={refreshFeePayment} />
                        </div>
                    ) : (
                        <ListingFeePayment
                            amount={listingFee}
                            productId={watchProductId}
                            onSuccess={refreshFeePayment}
                        />
                    )}
                </section>
            </Activity>
        </form>
    );
}

export default AddProductForm;
