"use client";
import InputNumber from "@/app/components/inputs/InputNumber";
import UseButton from "@/app/components/inputs/UseButton";
import UseCheckbox from "@/app/components/inputs/UseCheckbox";
import UseRadio from "@/app/components/inputs/UseRadio";
import UseSelect from "@/app/components/inputs/UseSelect";
import { getParentCategories } from "@/app/services/categories.service";
import { CheckCircleOutlined, ClockCircleOutlined, ProductOutlined, SwapOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function DetailSearchBox({ onSearch }) {
    const [categories, setCategories] = useState([]);
    const { control, handleSubmit, reset } = useForm({ defaultValues: { sortBy: "1" } });

    useEffect(() => {
        getParentCategories().then(({ data }) => setCategories(data || []));
    }, []);

    const onSubmit = (values) => {
        const categoryIds = categories.filter((c) => values[`cat_${c.id}`]).map((c) => c.id);
        onSearch?.({
            sortBy: values.sortBy,
            categoryIds,
            priceMin: values.price1 ?? null,
            priceMax: values.price2 ?? null,
            condition: values.condition || null,
            timeMaxHours: values.time1 ? 1 : values.time2 ? 24 : null,
        });
    };

    const handleReset = () => {
        reset({ sortBy: "1" });
        onSearch?.(null);
    };

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
            />
            <div>
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                    <div className="bg-orange-600 rounded-full h-5 w-5 flex items-center justify-center">
                        <ProductOutlined className="text-white! text-xs" />
                    </div>
                    หมวดหมู่
                </h3>
                <div className="flex flex-col gap-2 ps-2">
                    {categories.map((c) => (
                        <UseCheckbox key={c.id} control={control} name={`cat_${c.id}`} label={c.name} />
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                    <div className="bg-orange-600 rounded-full h-5 w-5 flex items-center justify-center">
                        <SwapOutlined className="text-white! text-xs" />
                    </div>
                    ช่วงราคา (฿)
                </h3>
                <div className="flex justify-between items-center gap-2">
                    <InputNumber control={control} name="price1" placeholder="ราคาต่ำสุด" min={0} />
                    <span className="text-black/40">-</span>
                    <InputNumber control={control} name="price2" placeholder="ราคาสูงสุด" min={0} />
                </div>
            </div>
            <div>
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
                    <div className="bg-orange-600 rounded-full h-5 w-5 flex items-center justify-center">
                        <CheckCircleOutlined className="text-white! text-xs" />
                    </div>
                    สภาพสินค้า
                </h3>
                <div className="ps-2">
                    <UseRadio
                        control={control}
                        name="condition"
                        options={[
                            { value: "new", label: "ของใหม่ (New)" },
                            { value: "like_new", label: "เหมือนใหม่ (Like New)" },
                            { value: "good", label: "มือสองสภาพดี (Used)" },
                        ]}
                    />
                </div>
            </div>
            <div>
                <h3 className="font-medium text-black mb-4 flex items-center gap-2">
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
                <UseButton label="ล้างค่า" onClick={handleReset} wFull type="default" />
                <UseButton label="ค้นหา" onClick={handleSubmit(onSubmit)} wFull />
            </div>
        </nav>
    );
}

export default DetailSearchBox;
