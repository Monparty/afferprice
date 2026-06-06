"use client";
import UseCheckbox from "@/app/components/inputs/UseCheckbox";
import { useEffect } from "react";
import { useWatch } from "react-hook-form";

// ประเมินคุณภาพสินค้า: เลือกได้กลุ่มละ 1 ตัวเลือก → คำนวณคะแนนรวม 0-100 แล้ว sync ลงฟอร์ม (quality_score + evaluation)
function ProductEvaluation({ control, setValue, evaluationGroups }) {
    const watchEvaluation = useWatch({ control, name: "evaluation" }) || {};

    const maxScore = evaluationGroups.reduce(
        (sum, group) => sum + Math.max(0, ...group.subEvaluations.map((s) => s.score || 0)),
        0,
    );
    const rawScore = evaluationGroups.reduce((sum, group, hIdx) => {
        const row = watchEvaluation[hIdx] || {};
        const selected = group.subEvaluations.find((_, sIdx) => row[sIdx] === true);
        return sum + (selected?.score || 0);
    }, 0);
    const qualityScore = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;

    useEffect(() => {
        setValue("quality_score", qualityScore);
    }, [qualityScore, setValue]);

    if (evaluationGroups.length === 0) return null;

    return (
        <div className="flex flex-col gap-3 mb-6">
            {evaluationGroups.map((group, headingIdx) => (
                <div key={headingIdx} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
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
                                            if (idx !== subIdx) setValue(`evaluation.${headingIdx}.${idx}`, false);
                                        });
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            ))}
            <div className="rounded-lg bg-orange-50 border border-orange-100 p-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-600">คะแนนคุณภาพสินค้า</span>
                    <span className="text-sm font-bold text-orange-500">{qualityScore} / 100</span>
                </div>
                <div className="h-2 w-full rounded-full bg-orange-100 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-orange-500 transition-all"
                        style={{ width: `${qualityScore}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export default ProductEvaluation;
