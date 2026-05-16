"use client";
import InputNumber from "@/app/components/inputs/InputNumber";
import InputText from "@/app/components/inputs/InputText";
import UseSegmented from "@/app/components/inputs/UseSegmented";
import UseSelect from "@/app/components/inputs/UseSelect";
import UseUpload from "@/app/components/inputs/UseUpload";
import {
    CameraFilled,
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
import PromptPayQR from "@/app/components/payment/PromptPayQR";
import UseButton from "@/app/components/inputs/UseButton";
import UseCheckbox from "@/app/components/inputs/UseCheckbox";

function Form({ activeStep, control, categoryList, setValue }) {
    const watchState = useWatch({ control, name: "state" });
    const watchCategoryId = useWatch({ control, name: "categoryId" });
    const evaluationGroups = categoryList.find((c) => c.id === watchCategoryId)?.evaluation || [];
    const watchEvaluation = useWatch({ control, name: "evaluation" }) || {};
    const totalScore = evaluationGroups.reduce((sum, group, hIdx) => {
        const row = watchEvaluation[hIdx] || {};
        const selected = group.subEvaluations.find((_, sIdx) => row[sIdx] === true);
        return sum + (selected?.score || 0);
    }, 0);
    return (
        <form className="flex flex-col gap-6">
            {watchState === "rejected" && (
                <div className="bg-red-50 p-6 rounded-xl border border-red-400 border-l-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                        <ExclamationCircleFilled className="text-orange-600!" />
                        สินค้าของคุณไม่ผ่านการอนุมัติเนื่องจาก
                    </h2>
                    <UseTextArea control={control} name="rejected_remark" size="large" disabled />
                </div>
            )}
            {activeStep !== 3 && (
                <>
                    <Activity mode={activeStep === 0 ? "visible" : "hidden"}>
                        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <CameraFilled className="text-orange-600!" />
                                    อัปโหลดรูปภาพ
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">
                                    รูปภาพคุณภาพสูงจะช่วยเพิ่มโอกาสในการขายได้ถึง 40%
                                </p>
                            </div>
                            <UseUpload
                                control={control}
                                name="images_url"
                                title="ลากและวางรูปภาพลงที่นี่"
                                multiple
                                maxCount={6}
                                isDrag
                                customRequest={(fileData) =>
                                    handleLocalPreview({ fileData: fileData, name: "images_url", setValue: setValue })
                                }
                            />
                        </section>
                        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <VideoCameraFilled className="text-orange-600!" />
                                    อัปโหลด Video
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">
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
                                customRequest={(fileData) =>
                                    handleLocalPreview({ fileData: fileData, name: "video_url", setValue: setValue })
                                }
                            />
                        </section>
                    </Activity>
                    <Activity mode={activeStep === 1 ? "visible" : "hidden"}>
                        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <EditFilled className="text-orange-600!" />
                                    ตั้งค่าการประมูล
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">ระบุรายละเอียดเบื้องต้นของสินค้า</p>
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
                                    { value: 1, label: "1 วัน", subTitle: "QUICK SALE" },
                                    { value: 5, label: "5 วัน", subTitle: "POPULAR" },
                                    { value: 7, label: "7 วัน", subTitle: "STANDARD" },
                                    { value: 10, label: "10 วัน", subTitle: "MAXIMUM" },
                                ]}
                            />
                        </section>
                        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <FileTextFilled className="text-orange-600!" />
                                    รายละเอียดสินค้า
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">ระบุข้อมูลให้ครบถ้วนเพื่อดึงดูดผู้ประมูล</p>
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
                            {evaluationGroups.length > 0 && (
                                // ทำให้ save ได้ และเมื่อกลับมาแก้ไขต้อง ติ๊กอันเดิม
                                <div className="flex flex-col gap-3 mb-6">
                                    {evaluationGroups.map((group, headingIdx) => (
                                        <div
                                            key={headingIdx}
                                            className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                                        >
                                            <p className="font-semibold text-slate-700 mb-2">{group.heading}</p>
                                            <div className="flex flex-col gap-2 pl-3 w-fit">
                                                {group.subEvaluations.map((sub, subIdx) => (
                                                    <UseCheckbox
                                                        key={subIdx}
                                                        control={control}
                                                        name={`evaluation.${headingIdx}.${subIdx}`}
                                                        label={sub.label}
                                                        onChange={(checked) => {
                                                            if (checked) {
                                                                group.subEvaluations.forEach((_, idx) => {
                                                                    if (idx !== subIdx)
                                                                        setValue(
                                                                            `evaluation.${headingIdx}.${idx}`,
                                                                            false,
                                                                        );
                                                                });
                                                            }
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-end px-1">
                                        <span className="text-xs text-slate-400">คะแนนรวม</span>
                                        <span className="text-sm font-semibold text-orange-500 ml-2">
                                            {totalScore} คะแนน
                                        </span>
                                    </div>
                                </div>
                            )}
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
                <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <CreditCardFilled className="text-orange-600!" />
                            ชำระค่าธรรมเนียม
                        </h2>
                    </div>
                    <div className="grid gap-2">
                        <PromptPayQR />
                        <UseButton label="ชําระด้วย TrueMoney" />
                        <UseButton label="ชําระด้วย Line Pay" />
                    </div>
                </section>
            </Activity>
        </form>
    );
}

export default Form;
