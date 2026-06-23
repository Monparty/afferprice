"use client";
import UseTable from "@/app/components/utils/UseTable";
import UseTag from "@/app/components/utils/UseTag";
import UseImage from "@/app/components/utils/UseImage";
import UseButton from "@/app/components/inputs/UseButton";
import UseTooltip from "@/app/components/utils/UseTooltip";
import { useColumnSearch } from "@/app/hooks/useColumnSearch";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getBidsByProductId, getSoldOrderDetail } from "@/app/services/admin/bids.service";
import { formatDateTime } from "@/app/utils/dateUtils";
import {
    LeftOutlined,
    ShopOutlined,
    UserOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    BankOutlined,
    CarOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

function fullName(u) {
    if (!u) return "—";
    return `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.email || "—";
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex gap-2 text-sm">
            <Icon className="text-slate-400! mt-0.5" />
            <div className="grid">
                <span className="text-slate-400 text-xs">{label}</span>
                <span className="text-slate-700 dark:text-slate-200">{value || "—"}</span>
            </div>
        </div>
    );
}

function Page() {
    const { id } = useParams();
    const router = useRouter();
    const { control, setValue } = useForm();
    const [dataSource, setDataSource] = useState([]);
    const [product, setProduct] = useState(null);
    const [orderDetail, setOrderDetail] = useState(null);
    const { columnSearch } = useColumnSearch();

    useEffect(() => {
        if (!id) return;
        getSoldOrderDetail(id).then(({ data, error }) => {
            if (error) return notifyError(error);
            setOrderDetail(data);
        });
        getBidsByProductId(id).then(({ data, error }) => {
            if (error) return notifyError(error);
            if (data?.[0]?.products) setProduct(data[0].products);
            setDataSource(
                data.map((item) => ({
                    ...item,
                    bidTime: formatDateTime(item.bid_time),
                    bidderName: item.profile
                        ? `${item.profile.first_name ?? ""} ${item.profile.last_name ?? ""}`.trim() ||
                          item.profile.email
                        : "—",
                    bidderEmail: item.profile?.email || "—",
                })),
            );
        });
    }, [id]);

    const columns = [
        {
            title: "ผู้ประมูล",
            dataIndex: "bidderName",
            key: "bidderName",
            ...columnSearch("bidderName", control, setValue),
        },
        {
            title: "อีเมล",
            dataIndex: "bidderEmail",
            key: "bidderEmail",
            ...columnSearch("bidderEmail", control, setValue),
        },
        {
            title: "ราคาประมูล",
            dataIndex: "bid_price",
            key: "bid_price",
            sorter: (a, b) => a.bid_price - b.bid_price,
            render: (_, record) => <>฿{record.bid_price?.toLocaleString()}</>,
        },
        {
            title: "วันที่ประมูล",
            dataIndex: "bidTime",
            key: "bidTime",
            sorter: (a, b) => a.bidTime.localeCompare(b.bidTime),
            defaultSortOrder: "descend",
        },
        {
            title: "สถานะ",
            dataIndex: "is_winning",
            key: "is_winning",
            render: (_, record) =>
                record.is_winning ? (
                    <UseTag label="ชนะ" color="green" variant="filled" />
                ) : (
                    <UseTag label="ไม่ชนะ" color="default" />
                ),
        },
    ];

    return (
        <main className="grid gap-4">
            <div className="flex gap-2 items-center">
                <UseTooltip title="กลับ">
                    <UseButton
                        shape="circle"
                        icon={LeftOutlined}
                        size="large"
                        type="default"
                        onClick={() => router.back()}
                    />
                </UseTooltip>
            </div>
            {product && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 flex gap-4 items-center">
                    <UseImage width={80} height={80} alt="product" src={product.images_url?.[0]?.url || null} />
                    <div className="grid gap-1">
                        <div className="text-lg font-medium">{product.title}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            ราคาเริ่มต้น ฿{product.start_price?.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">จำนวนการประมูล {dataSource.length} ครั้ง</div>
                    </div>
                </div>
            )}
            {orderDetail && (
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 grid gap-3 content-start">
                        <div className="flex items-center gap-2 font-medium text-orange-600">
                            <ShopOutlined />
                            <span>ข้อมูลผู้ขาย</span>
                        </div>
                        <InfoRow icon={UserOutlined} label="ชื่อ" value={fullName(orderDetail.seller)} />
                        <InfoRow icon={MailOutlined} label="อีเมล" value={orderDetail.seller?.email} />
                        <InfoRow icon={PhoneOutlined} label="เบอร์โทร" value={orderDetail.seller?.phone} />
                        <InfoRow icon={EnvironmentOutlined} label="ที่อยู่" value={orderDetail.seller?.address} />
                        <InfoRow
                            icon={BankOutlined}
                            label="บัญชีรับเงิน"
                            value={
                                orderDetail.seller?.bank_name
                                    ? `${orderDetail.seller.bank_name} · ${orderDetail.seller.bank_account_no ?? ""} (${orderDetail.seller.bank_account_name ?? ""})`
                                    : null
                            }
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 grid gap-3 content-start">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-medium text-blue-600">
                                <UserOutlined />
                                <span>ข้อมูลผู้ซื้อ (ผู้ชนะประมูล)</span>
                            </div>
                            {orderDetail.result &&
                                (orderDetail.result.payment_status === "paid" ? (
                                    <UseTag label="ชำระเงินแล้ว" color="green" variant="filled" />
                                ) : (
                                    <UseTag label="รอชำระเงิน" color="orange" />
                                ))}
                        </div>
                        <InfoRow icon={UserOutlined} label="ชื่อ" value={fullName(orderDetail.buyer)} />
                        <InfoRow icon={MailOutlined} label="อีเมล" value={orderDetail.buyer?.email} />
                        <InfoRow icon={PhoneOutlined} label="เบอร์โทร" value={orderDetail.buyer?.phone} />
                        {orderDetail.result && (
                            <InfoRow
                                icon={ShopOutlined}
                                label="ราคาปิดประมูล"
                                value={`฿${Number(orderDetail.result.final_price ?? 0).toLocaleString()}`}
                            />
                        )}
                        <div className="border-t border-slate-100 dark:border-slate-700 pt-3 grid gap-2">
                            <span className="text-slate-400 text-xs">ที่อยู่จัดส่ง</span>
                            {orderDetail.buyerAddress ? (
                                <div className="text-sm text-slate-700 dark:text-slate-200 grid gap-0.5">
                                    <span>
                                        {orderDetail.buyerAddress.receiver_name} · {orderDetail.buyerAddress.phone}
                                    </span>
                                    <span>{orderDetail.buyerAddress.address_line}</span>
                                    <span>
                                        {[
                                            orderDetail.buyerAddress.district,
                                            orderDetail.buyerAddress.province,
                                            orderDetail.buyerAddress.postal_code,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-sm text-slate-400">ยังไม่มีที่อยู่จัดส่ง</span>
                            )}
                        </div>
                        {orderDetail.shipment && (
                            <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                                <InfoRow
                                    icon={CarOutlined}
                                    label="การจัดส่ง"
                                    value={`${orderDetail.shipment.shipping_company} · ${orderDetail.shipment.tracking_number}`}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <UseTable columns={columns} dataSource={dataSource} />
            </div>
        </main>
    );
}

export default Page;
