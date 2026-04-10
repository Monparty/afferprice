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
    FileTextFilled,
    TruckFilled,
    VideoCameraFilled,
} from "@ant-design/icons";
import UseSelectCard from "@/app/components/inputs/UseSelectCard";
import { Activity } from "react";
import UseTextArea from "@/app/components/inputs/UseTextArea";
import { handleUpload } from "@/app/utils/storageHelper";

function Form({ activeStep, control, categoryList, setValue }) {
    return (
        <form className="flex flex-col gap-6">
            {activeStep !== 3 && (
                <>
                    <Activity mode={activeStep === 0 ? "visible" : "hidden"}>
                        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
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
                                    handleUpload({ fileData: fileData, name: "images_url", setValue: setValue })
                                }
                                // onRemove={(file) =>
                                //     handleRemove({
                                //         file: file,
                                //         field: "images_url",
                                //         id: id,
                                //         updateFunction: updateProfileById,
                                //     })
                                // }
                            />
                        </section>
                        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
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
                                    handleUpload({ fileData: fileData, name: "video_url", setValue: setValue })
                                }
                                // onRemove={(file) =>
                                //     handleRemove({
                                //         file: file,
                                //         field: "images_url",
                                //         id: id,
                                //         updateFunction: updateProfileById,
                                //     })
                                // }
                            />
                        </section>
                    </Activity>
                    <Activity mode={activeStep === 1 ? "visible" : "hidden"}>
                        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
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
                            <div className="flex gap-4 w-full">
                                <UseSelectCard
                                    control={control}
                                    name="durationDays"
                                    options={[
                                        { value: 1, label: "1 วัน", subTitle: "QUICK SALE" },
                                        { value: 5, label: "5 วัน", subTitle: "POPULAR" },
                                        { value: 7, label: "7 วัน", subTitle: "STANDARD" },
                                        { value: 10, label: "10 วัน", subTitle: "MAXIMUM" },
                                    ]}
                                />
                            </div>
                        </section>
                        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
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
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <CreditCardFilled className="text-orange-600!" />
                            ชำระค่าธรรมเนียม
                        </h2>
                    </div>
                    ชำระค่าธรรมเนียม
                </section>
            </Activity>
        </form>
    );
}

export default Form;
