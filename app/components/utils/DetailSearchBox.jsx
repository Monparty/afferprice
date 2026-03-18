"use client";
import InputNumber from "@/app/components/inputs/InputNumber";
import UseButton from "@/app/components/inputs/UseButton";
import UseCheckbox from "@/app/components/inputs/UseCheckbox";
import UseRadio from "@/app/components/inputs/UseRadio";
import UseSelect from "@/app/components/inputs/UseSelect";
import { CheckCircleOutlined, ClockCircleOutlined, ProductOutlined, SwapOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";

function DetailSearchBox() {
    const { control } = useForm();
    return (
        <nav className="w-full grid gap-4 p-4 rounded-lg bg-white border shadow-lg border-slate-200">
            <UseSelect
                control={control}
                options={[
                    { label: "ยอดนิยม", value: "1" },
                    { label: "ราคา: ต่ำ-สูง", value: "2" },
                    { label: "ราคา: สูง-ต่ำ", value: "3" },
                    { label: "เวลา: ใกล้สิ้นสุด", value: "4" },
                ]}
                name="sortBy"
                placeholder="เรียงโดย"
                defaultValue="1"
            />
            <div>
                <h3 className="font-medium text-black dark::text-slate-100 mb-4 flex items-center gap-2">
                    <div className="bg-orange-600 rounded-full h-5 w-5 flex items-center justify-center">
                        <ProductOutlined className="text-white! text-xs" />
                    </div>
                    หมวดหมู่
                </h3>
                <div className="flex flex-col gap-2 ps-2">
                    <UseCheckbox control={control} name="cat1" label="ทั้งหมด" checked />
                    <UseCheckbox control={control} name="cat2" label="อิเล็กทรอนิกส์" />
                    <UseCheckbox control={control} name="cat3" label="ของสะสม" />
                    <UseCheckbox control={control} name="cat4" label="แฟชั่น &amp; แบรนด์เนม" />
                </div>
            </div>
            <div>
                <h3 className="font-medium text-black dark::text-slate-100 mb-4 flex items-center gap-2">
                    <div className="bg-orange-600 rounded-full h-5 w-5 flex items-center justify-center">
                        <SwapOutlined className="text-white! text-xs" />
                    </div>
                    ช่วงราคา (฿)
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center gap-2">
                        <InputNumber control={control} name="price" placeholder="ราคาต่ำสุด" />
                        <span className="text-black/40">-</span>
                        <InputNumber control={control} name="price" placeholder="ราคาสูงสุด" />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="font-medium text-black dark::text-slate-100 mb-4 flex items-center gap-2">
                    <div className="bg-orange-600 rounded-full h-5 w-5 flex items-center justify-center">
                        <CheckCircleOutlined className="text-white! text-xs" />
                    </div>
                    สภาพสินค้า
                </h3>
                <div className="ps-2">
                    <UseRadio
                        control={control}
                        name="state"
                        options={[
                            { value: "1", label: "ของใหม่ (New)" },
                            { value: "2", label: "เหมือนใหม่ (Like New)" },
                            { value: "3", label: "มือสองสภาพดี (Used)" },
                        ]}
                    />
                </div>
            </div>
            <div>
                <h3 className="font-medium text-black dark::text-slate-100 mb-4 flex items-center gap-2">
                    <div className="bg-orange-600 rounded-full h-5 w-5 flex items-center justify-center">
                        <ClockCircleOutlined className="text-white! text-xs" />
                    </div>
                    เวลาที่เหลือ
                </h3>
                <div className="flex flex-col gap-2 ps-2">
                    <UseCheckbox control={control} name="time1" label="น้อยกว่า 1 ชม." />
                    <UseCheckbox control={control} name="time2" label="น้อยกว่า 24 ชม." />
                </div>
            </div>
            <div className="flex gap-2">
                <UseButton label="ล้างค่า" wFull type="default" />
                <UseButton label="ค้นหา" wFull />
            </div>
        </nav>
    );
}

export default DetailSearchBox;
