"use client";
import UseButton from "@/app/components/inputs/UseButton";
import { PlusOutlined } from "@ant-design/icons";
import CardUserAddress from "../components/CardUserAddress";
import UseModal from "@/app/components/utils/UseModal";
import { useState } from "react";
import UserAddressForm from "../components/UserAddressForm";

function Page() {
    const [modalAddress, setModalAddress] = useState({
        isOpen: false,
        title: "",
    });

    const handleOpenModal = (title) => {
        setModalAddress({ isOpen: true, title: title });
    };

    const handleCloseModal = () => {
        setModalAddress({ ...modalAddress, isOpen: false });
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900">ที่อยู่ของฉัน</h1>
                    <p className="text-slate-500 text-base font-normal">ที่อยู่สำหรับการจัดส่ง</p>
                </div>
                <UseButton label="เพิ่มที่อยู่" icon={PlusOutlined} onClick={() => handleOpenModal("ที่อยู่ใหม่")} />
            </div>
            <div className="grid gap-6">
                <CardUserAddress onEditAddress={() => handleOpenModal("แก้ไขที่อยู่")} />
            </div>
            <UseModal
                title={modalAddress.title}
                open={modalAddress.isOpen}
                onOk={handleCloseModal}
                onCancel={handleCloseModal}
            >
                <UserAddressForm />
            </UseModal>
        </>
    );
}

export default Page;
