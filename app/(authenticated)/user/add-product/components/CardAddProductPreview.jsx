"use client";
import UseButton from "@/app/components/inputs/UseButton";
import UseCheckbox from "@/app/components/inputs/UseCheckbox";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CheckCircleFilled,
    EyeFilled,
    SafetyCertificateFilled,
} from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";
import { useWatch } from "react-hook-form";
import verifiedIcon from "../../../../../public/images/verifiedIcon.png";
import imageNotFound from "../../../../../public/images/imageNotFound.png";
import UseModal from "@/app/components/utils/UseModal";
import UseTag from "@/app/components/utils/UseTag";
import KycVerificationForm from "../../components/KycVerificationForm";

const KYC_BANNER = {
    unknown: {
        tone: "orange",
        label: "ยังไม่ได้ยืนยันตัวตน",
        desc: "ส่งเอกสาร KYC เพื่อให้ admin อนุมัติให้สินค้าเปิดประมูลได้",
        cta: "ยืนยันตัวตน",
    },
    pending: {
        tone: "orange",
        label: "รอ admin ตรวจสอบ KYC",
        desc: "บันทึกร่างได้ แต่ admin จะอนุมัติสินค้าให้เปิดประมูลได้หลัง KYC ผ่าน",
        cta: null,
    },
    rejected: {
        tone: "red",
        label: "KYC ไม่ผ่านการตรวจสอบ",
        desc: "กรุณาอัปโหลดเอกสารใหม่เพื่อให้ admin ตรวจสอบอีกครั้ง",
        cta: "ส่งเอกสารอีกครั้ง",
    },
};

function CardAddProductPreview({
    control,
    watch,
    activeStep,
    setActiveStep,
    onSubmit,
    isKyc = "unknown",
    isFeePaid = false,
}) {
    const [kycModalOpen, setKycModalOpen] = useState(false);
    // ใช้ที่ "/user/add-product"
    const image = useWatch({
        control,
        name: "images_url.0",
    });
    const imageUrl = image?.url || image?.thumbUrl;
    const banner = isKyc === "approved" ? null : (KYC_BANNER[isKyc] ?? KYC_BANNER.unknown);
    const bannerStyle =
        banner?.tone === "red"
            ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900"
            : "bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-900";

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-lg sticky top-12">
                <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">ตัวอย่างการแสดงผล</span>
                    <EyeFilled className="text-lg text-gray-500!" />
                </div>
                <div className="aspect-video w-full bg-slate-100 dark:bg-zinc-800 relative">
                    <Image
                        src={imageUrl || imageNotFound}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                        width={340}
                        height={195}
                        sizes="340px"
                    />
                    <div className="absolute top-2 right-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                        กำลังเริ่มเร็วๆ นี้
                    </div>
                    <div className="absolute top-2 left-2">
                        <Image src={verifiedIcon} width={28} height={28} alt="Afferprice Logo" />
                    </div>
                </div>
                <div className="p-5">
                    <h3 className="text-lg mb-1 font-bold text-slate-900 dark:text-white truncate w-60">
                        {watch("title") || "ชื่อสินค้าของคุณ..."}
                    </h3>
                    <div className={`${activeStep === 2 ? "" : "max-h-18 overflow-auto"}`}>
                        <p className="text-sm ">{watch("description")}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">ราคาเริ่มต้น</p>
                            <p className="text-xl font-bold text-primary">
                                ฿{watch("startPrice")?.toLocaleString() || "0"}{" "}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase font-bold">เวลาที่เหลือ</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {{
                                    0: "10 นาที (TEST)",
                                    1: "1 วัน",
                                    5: "5 วัน",
                                    7: "7 วัน",
                                    10: "10 วัน",
                                }[watch("durationDays")] || "00:00:00"}
                            </p>
                        </div>
                    </div>
                    <UseCheckbox
                        control={control}
                        name="isSeller"
                        label="ผู้ขาย: บัญชีของคุณ"
                        className="text-xs! text-gray-500!"
                    />
                </div>
                {banner && (
                    <div className={`mx-5 mb-3 p-3 rounded-lg border ${bannerStyle}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <SafetyCertificateFilled
                                className={banner.tone === "red" ? "text-red-500!" : "text-orange-500!"}
                            />
                            <UseTag label={banner.label} color={banner.tone} variant="filled" />
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">{banner.desc}</p>
                        {banner.cta && (
                            <UseButton label={banner.cta} type="default" onClick={() => setKycModalOpen(true)} />
                        )}
                    </div>
                )}
                {isFeePaid && (
                    <div className="mx-5 mb-1 p-3 rounded-lg border bg-green-50 dark:bg-green-950/40 border-green-300 dark:border-green-900">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircleFilled className="text-green-600!" />
                            <span className="text-sm font-semibold text-green-700 dark:text-green-400">ชำระค่าธรรมเนียมแล้ว</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            รอ admin ตรวจสอบและอนุมัติสินค้า ไม่สามารถแก้ไขหรือบันทึกเพิ่มได้
                        </p>
                    </div>
                )}
                <div className="p-5 flex flex-col gap-3 bg-slate-50 dark:bg-zinc-800/50">
                    <UseButton
                        label={
                            activeStep === 3
                                ? isFeePaid
                                    ? "รอ admin ตรวจสอบ"
                                    : isKyc === "pending"
                                      ? "รอ admin ตรวจสอบ KYC"
                                      : "การบันทึกและส่งตรวจสอบสินค้า"
                                : "ดำเนินการต่อ"
                        }
                        icon={ArrowRightOutlined}
                        iconPlacement
                        wFull
                        className="h-12!"
                        onClick={() => {
                            if (activeStep === 3) {
                                if (isFeePaid) return;
                                if (isKyc === "approved") {
                                    onSubmit("pending_review");
                                } else if (isKyc === "unknown" || isKyc === "rejected") {
                                    setKycModalOpen(true);
                                }
                                return;
                            }
                            setActiveStep(activeStep + 1);
                        }}
                        disabled={activeStep === 3 && (isKyc === "pending" || isFeePaid)}
                    />
                    {activeStep !== 0 && (
                        <UseButton
                            label="ย้อนกลับ"
                            icon={ArrowLeftOutlined}
                            wFull
                            className="h-12!"
                            type="default"
                            onClick={() => {
                                if (activeStep === 0) return;
                                setActiveStep(activeStep - 1);
                            }}
                        />
                    )}
                    <UseButton
                        label="บันทึกเป็นฉบับร่าง"
                        type="default"
                        wFull
                        className="h-12!"
                        onClick={() => onSubmit("draft")}
                        disabled={isFeePaid}
                    />
                    <p className="text-[11px] text-center text-slate-400 px-4 leading-relaxed">
                        ในการดำเนินการต่อ คุณยอมรับนโยบายผู้ขายและโครงสร้างค่าธรรมเนียมของเรา
                    </p>
                </div>
                <div className="p-4">
                    <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-xl border border-orange-200 dark:border-orange-900">
                        <h4 className="text-sm font-bold text-orange-600 flex items-center gap-2 mb-3">
                            Afferprice การันตีความปลอดภัย
                        </h4>
                        <ul className="flex flex-col gap-3">
                            <li className="flex items-start gap-2">
                                <CheckCircleFilled className="text-lg text text-orange-600!" />
                                <span className="text-[12px] text-slate-600 dark:text-slate-300">
                                    ระบบ Escrow คุ้มครองการชำระเงินสำหรับสินค้ามูลค่าสูง
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircleFilled className="text-lg text text-orange-600!" />
                                <span className="text-[12px] text-slate-600 dark:text-slate-300">
                                    สร้างใบปะหน้าพัสดุอัตโนมัติเมื่อมีการชำระเงิน
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircleFilled className="text-lg text text-orange-600!" />
                                <span className="text-[12px] text-slate-600 dark:text-slate-300">
                                    ทีมงานสนับสนุนข้อพิพาทโดยเฉพาะตลอด 24 ชม.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <UseModal
                open={kycModalOpen}
                onCancel={() => setKycModalOpen(false)}
                title="ยืนยันตัวตน (KYC)"
                isShowCancel={false}
            >
                <KycVerificationForm
                    setIsOpenModalProfile={setKycModalOpen}
                    onKycSubmitted={() => setKycModalOpen(false)}
                    onSubmitSaveProduct={() => onSubmit(isKyc === "approved" ? "pending_review" : "draft")}
                />
            </UseModal>
        </div>
    );
}

export default CardAddProductPreview;
