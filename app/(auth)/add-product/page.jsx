"use client";
import InputNumber from "@/app/components/inputs/InputNumber";
import InputText from "@/app/components/inputs/InputText";
import UseReactQuill from "@/app/components/inputs/UseReactQuill";
import UseSegmented from "@/app/components/inputs/UseSegmented";
import UseSelect from "@/app/components/inputs/UseSelect";
import UseUploadDragger from "@/app/components/inputs/UseUploadDragger";
import UseSteps from "@/app/components/utils/UseSteps";
import { CameraFilled, DollarOutlined, EditFilled, FileTextFilled, TruckFilled } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import UseSelectCard from "@/app/components/inputs/UseSelectCard";
import CardAddProductPreview from "@/app/components/utils/CardAddProductPreview";
import { Activity, useEffect, useState } from "react";
import { getCategories } from "@/app/services/categories.service";
import { notifyError } from "@/app/providers/NotificationProvider";

function Page() {
    const [activeStep, setActiveStep] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const { handleSubmit, watch, control } = useForm({
        shouldUnregister: false,
    });
    const items = [
        {
            title: "รูปภาพ",
            // content: "ระบุรูปภาพและวีดีโอของสินค้า",
            // subTitle: "Left 00:00:08",
        },
        {
            title: "รายละเอียดสินค้า",
        },
        {
            title: "การตั้งค่าประมูล",
        },
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await getCategories();
            if (error) notifyError(error);
            setCategoryList(data);
        };
        fetchCategories();
    }, []);

    console.log("watch", watch());

    return (
        <main className="w-full flex flex-col gap-8">
            <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-accent">
                            ขั้นตอนที่ 
                            {{
                                0: "1",
                                1: "2",
                                2: "3",
                            }[activeStep] || "1"}
                             จาก 3
                        </span>
                        <span className="text-sm text-slate-400">•</span>
                        <span className="text-sm font-medium text-slate-600">
                            {{
                                0: "อัปโหลดรูปภาพ",
                                1: "ระบุรายละเอียดสินค้า",
                                2: "การตั้งค่าประมูล",
                            }[activeStep] || "1"}{" "}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-slate-400">
                        สำเร็จแล้ว{" "}
                        {{
                            0: "0",
                            1: "33",
                            2: "80",
                        }[activeStep] || "0"}
                        %
                    </span>
                </div>
                <UseSteps items={items} current={activeStep} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Activity mode={activeStep === 0 ? "visible" : "hidden"}>
                        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <CameraFilled className="text-orange-600!" />
                                    อัปโหลดรูปภาพ
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">
                                    รูปภาพคุณภาพสูงจะช่วยเพิ่มโอกาสในการขายได้ถึง 40%
                                </p>
                            </div>
                            <UseUploadDragger control={control} name="myFile" multiple maxCount={3} />
                        </section>
                        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <EditFilled className="text-orange-600!" />
                                    การตั้งค่าประมูล
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">ระบุรายละเอียดเบื้องต้นของสินค้า</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <InputText
                                    control={control}
                                    name="title"
                                    label="ชื่อสินค้า"
                                    size="large"
                                    variant="filled"
                                />
                                <InputNumber
                                    control={control}
                                    name="startPrice"
                                    label="ราคาเริ่มต้น (บาท)"
                                    size="large"
                                    format
                                    variant="filled"
                                    icon={DollarOutlined}
                                />
                            </div>
                            <div className="flex gap-4 w-full">
                                <UseSelectCard
                                    control={control}
                                    name="periodBid"
                                    options={[
                                        { value: "1", label: "1 วัน", subTitle: "QUICK SALE" },
                                        { value: "2", label: "5 วัน", subTitle: "POPULAR" },
                                        { value: "3", label: "7 วัน", subTitle: "STANDARD" },
                                        { value: "4", label: "10 วัน", subTitle: "MAXIMUM" },
                                    ]}
                                />
                            </div>
                        </section>
                    </Activity>
                    <Activity mode={activeStep === 1 ? "visible" : "hidden"}>
                        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <FileTextFilled className="text-orange-600!" />
                                    รายละเอียดสินค้า
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">ระบุข้อมูลให้ครบถ้วนเพื่อดึงดูดผู้ประมูล</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <UseSelect
                                    control={control}
                                    name="category_id"
                                    label="หมวดหมู่"
                                    options={categoryList}
                                    optionLabel="name"
                                    optionValue="id"
                                    size="large"
                                    variant="filled"
                                />
                                <UseSegmented
                                    control={control}
                                    name="condition"
                                    label="สภาพสินค้า"
                                    options={[
                                        { value: "1", label: "ใหม่" },
                                        { value: "2", label: "เหมือนใหม่" },
                                        { value: "3", label: "ดี" },
                                        { value: "4", label: "พอใช้" },
                                        { value: "5", label: "มือ 2" },
                                    ]}
                                />
                            </div>
                            <UseReactQuill
                                control={control}
                                name="desc"
                                placeholder="กรุณาระบุรายละเอียด เช่น สภาพสินค้า, ตำหนิ, อุปกรณ์ที่ได้รับ หรือระยะเวลาประกัน"
                            />
                        </section>
                    </Activity>
                    <Activity mode={activeStep === 2 ? "visible" : "hidden"}>
                        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <TruckFilled className="text-orange-600!" />
                                    ตัวเลือกการจัดส่ง
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <UseSegmented
                                    control={control}
                                    name="periodBid"
                                    label="สภาพสินค้า"
                                    options={[
                                        { value: "1", label: "ไปรษนี" },
                                        { value: "2", label: "standard" },
                                        { value: "3", label: "เจอกันนอกจอ" },
                                    ]}
                                />
                            </div>
                        </section>
                    </Activity>
                </div>
                <CardAddProductPreview
                    watch={watch}
                    control={control}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                />
            </div>
        </main>
    );
}

export default Page;
