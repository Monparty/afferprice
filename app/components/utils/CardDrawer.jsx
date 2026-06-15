"use client";
import { useEffect, useState } from "react";
import {
    BellOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SmileOutlined,
    FrownOutlined,
    CreditCardOutlined,
} from "@ant-design/icons";
import { getMyNotifications, markAllNotificationsRead } from "@/app/services/notifications.service";
import { getSellerProducts } from "@/app/services/products.service";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";
import UseButton from "../inputs/UseButton";

dayjs.extend(relativeTime);
dayjs.locale("th");

const TYPE_CONFIG = {
    win: { icon: SmileOutlined, bg: "bg-green-50 dark:bg-green-950/40", text: "text-green-500 dark:text-green-400", border: "border-green-100 dark:border-green-900" },
    lose: { icon: FrownOutlined, bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-500 dark:text-red-400", border: "border-red-100 dark:border-red-900" },
    bid: { icon: BellOutlined, bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-500 dark:text-blue-400", border: "border-blue-100 dark:border-blue-900" },
    payment: { icon: CreditCardOutlined, bg: "bg-green-50 dark:bg-green-950/40", text: "text-green-500 dark:text-green-400", border: "border-green-100 dark:border-green-900" },
};

const DEFAULT_CONFIG = { icon: BellOutlined, bg: "bg-slate-50 dark:bg-zinc-800", text: "text-slate-400", border: "border-slate-100 dark:border-zinc-700" };

function CardDrawer({ open, onClose, onRead }) {
    const [notifications, setNotifications] = useState([]);
    const [rejectedProducts, setRejectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        Promise.all([getMyNotifications(), getSellerProducts()]).then(([{ data: notifs }, { data: products }]) => {
            setNotifications(notifs ?? []);
            setRejectedProducts((products ?? []).filter((p) => p.state === "rejected"));
            setLoading(false);
        });
        markAllNotificationsRead().then(() => onRead?.());
    }, [open]);

    if (loading) {
        return (
            <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
                ))}
            </div>
        );
    }

    if (notifications.length === 0 && rejectedProducts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                <BellOutlined style={{ fontSize: 32 }} />
                <p className="text-sm">ยังไม่มีการแจ้งเตือน</p>
            </div>
        );
    }

    return (
        <>
            {rejectedProducts.map((product) => (
                <div
                    key={product.id}
                    className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 hover:shadow-md transition-all"
                >
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-500 dark:text-red-400 shrink-0">
                            <CloseCircleOutlined style={{ fontSize: "18px" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5 gap-2">
                                <h3 className="text-slate-900 dark:text-slate-100 font-bold text-sm">สินค้าไม่ผ่านการอนุมัติ</h3>
                                <span className="text-[10px] bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400 font-bold px-1.5 py-0.5 rounded shrink-0">
                                    ต้องแก้ไข
                                </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-3 truncate">{product.title}</p>
                            <UseButton
                                label="แก้ไขสินค้า"
                                onClick={() => {
                                    router.push(`/user/add-product/${product.id}/edit`);
                                    onClose?.();
                                }}
                                className="bg-red-500! hover:bg-red-400!"
                            />
                        </div>
                    </div>
                </div>
            ))}
            {notifications.map((n) => {
                const cfg = TYPE_CONFIG[n.type] ?? DEFAULT_CONFIG;
                const Icon = cfg.icon;
                return (
                    <div
                        key={n.id}
                        className={`p-4 rounded-xl bg-white dark:bg-zinc-900 border ${cfg.border} hover:shadow-md transition-all ${!n.is_read ? "ring-1 ring-primary/20" : ""}`}
                    >
                        <div className="flex gap-4">
                            <div
                                className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center ${cfg.text} shrink-0`}
                            >
                                <Icon style={{ fontSize: "18px" }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5 gap-2">
                                    <h3 className="text-slate-900 dark:text-slate-100 font-bold text-sm leading-tight">{n.title}</h3>
                                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                                        {dayjs(n.created_at).fromNow()}
                                    </span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{n.message}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export default CardDrawer;
