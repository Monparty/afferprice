"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { getProfileById } from "@/app/services/profile.service";
import UseModal from "@/app/components/utils/UseModal";
import KycVerificationForm from "../user/components/KycVerificationForm";

function KycGate() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        checkKyc();
    }, []);

    const checkKyc = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await getProfileById(user.id);
        if ((profile?.is_kyc ?? "unknown") === "unknown") setOpen(true);
    };

    return (
        <UseModal open={open} onCancel={() => setOpen(false)} title="ยืนยันตัวตน (KYC)" isShowCancel={false}>
            <KycVerificationForm
                setIsOpenModalProfile={setOpen}
                onKycSubmitted={() => setOpen(false)}
                onSubmitSaveProduct={() => {}}
            />
        </UseModal>
    );
}

export default KycGate;
