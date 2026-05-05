"use client";
import UseButton from "@/app/components/inputs/UseButton";
import { PlusOutlined } from "@ant-design/icons";
import CardUserAddress from "../components/CardUserAddress";
import UseModal from "@/app/components/utils/UseModal";
import { useEffect, useState } from "react";
import UserAddressForm from "../components/UserAddressForm";
import { deleteAddress, getMyAddresses, setDefaultAddress } from "@/app/services/address.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";

function Page() {
    const [modalAddress, setModalAddress] = useState({ isOpen: false, title: "" });
    const [addresses, setAddresses] = useState([]);
    const [editData, setEditData] = useState(null);

    const fetchAddresses = async () => {
        const { data, error } = await getMyAddresses();
        if (error) return notifyError(error);
        setAddresses(data);
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleOpenModal = (title, data = null) => {
        setEditData(data);
        setModalAddress({ isOpen: true, title });
    };

    const handleCloseModal = () => {
        setEditData(null);
        setModalAddress((prev) => ({ ...prev, isOpen: false }));
    };

    const handleDelete = async (id) => {
        const { error } = await deleteAddress(id);
        if (error) return notifyError(error);
        notifySuccess("ลบที่อยู่สำเร็จ");
        fetchAddresses();
    };

    const handleSetDefault = async (id) => {
        const { error } = await setDefaultAddress(id);
        if (error) return notifyError(error);
        fetchAddresses();
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
                {addresses.map((address) => (
                    <CardUserAddress
                        key={address.id}
                        address={address}
                        onEdit={(data) => handleOpenModal("แก้ไขที่อยู่", data)}
                        onDelete={handleDelete}
                        onSetDefault={handleSetDefault}
                    />
                ))}
            </div>
            <UseModal
                title={modalAddress.title}
                open={modalAddress.isOpen}
                onCancel={handleCloseModal}
                isShowCancel={false}
            >
                <UserAddressForm
                    editData={editData}
                    onSuccess={fetchAddresses}
                    onClose={handleCloseModal}
                />
            </UseModal>
        </>
    );
}

export default Page;
