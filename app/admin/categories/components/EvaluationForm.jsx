"use client";
import InputText from "@/app/components/inputs/InputText";
import InputNumber from "@/app/components/inputs/InputNumber";
import UseButton from "@/app/components/inputs/UseButton";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import UseTooltip from "@/app/components/utils/UseTooltip";
import { useFieldArray } from "react-hook-form";
import UsePopconfirm from "@/app/components/utils/UsePopconfirm";

export default function EvaluationForm({ control, inputProps, isWatch }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "evaluation",
    });

    return (
        <div className={`${isWatch ? "w-full" : "w-1/2"} grid gap-4`}>
            <div className="flex items-center justify-between">
                <h2 className="text-lg">สร้างแบบประเมินสภาพสินค้า</h2>
                <UseButton
                    label="เพิ่มหัวข้อแบบประเมิน"
                    icon={PlusOutlined}
                    onClick={() => append({ heading: "", subEvaluations: [] })}
                    disabled={isWatch}
                />
            </div>
            {fields.map((item, index) => (
                <div className="grid gap-4 p-4 border rounded-xl border-gray-300" key={item.id}>
                    <div className="grid md:grid-cols-2 gap-4 items-end">
                        <InputText {...inputProps} name={`evaluation.${index}.heading`} label="ชื่อหัวข้อ" />
                        <SubEvaluationFields
                            nestIndex={index}
                            control={control}
                            inputProps={inputProps}
                            isWatch={isWatch}
                        />
                    </div>
                    {!isWatch && (
                        <div className="flex justify-end">
                            <UsePopconfirm
                                onConfirm={() => remove(index)}
                                title="ยืนยันการลบ"
                                description="ต้องการลบข้อมูลนี้ ?"
                            >
                                <UseButton label="ลบหัวข้อแบบประเมิน" icon={DeleteFilled} className="bg-red-500!" />
                            </UsePopconfirm>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function SubEvaluationFields({ nestIndex, control, inputProps, isWatch }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `evaluation.${nestIndex}.subEvaluations`,
    });

    return (
        <>
            <UseButton
                label="เพิ่มตัวเลือกแบบประเมิน"
                icon={PlusOutlined}
                type="default"
                onClick={() => append({ label: "", score: 0 })}
                disabled={isWatch}
            />
            {fields.map((item, index) => (
                <div key={item.id} className="col-span-2 grid md:grid-cols-2 gap-4 items-end">
                    <InputText
                        {...inputProps}
                        name={`evaluation.${nestIndex}.subEvaluations.${index}.label`}
                        label="ตัวเลือก"
                    />
                    <div className="flex items-end gap-4">
                        <InputNumber
                            {...inputProps}
                            name={`evaluation.${nestIndex}.subEvaluations.${index}.score`}
                            label="คะแนน"
                        />
                        {!isWatch && (
                            <UseTooltip title="ลบ">
                                <UseButton
                                    shape="circle"
                                    className="bg-red-500!"
                                    icon={DeleteFilled}
                                    onClick={() => remove(index)}
                                />
                            </UseTooltip>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}
