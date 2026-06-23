"use client";
import { useEffect, useState } from "react";
import {
    BellOutlined,
    SmileOutlined,
    FrownOutlined,
    CreditCardOutlined,
    CarOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";
import UseDrawer from "@/app/components/utils/UseDrawer";
import { getAllNotifications } from "@/app/services/admin/notifications.service";
import { notifyError } from "@/app/providers/NotificationProvider";

dayjs.extend(relativeTime);
dayjs.locale("th");

const TYPE_CONFIG = {
    win: { icon: SmileOutlined, bg: "bg-green-50", text: "text-green-500", border: "border-green-100" },
    lose: { icon: FrownOutlined, bg: "bg-red-50", text: "text-red-500", border: "border-red-100" },
    bid: { icon: BellOutlined, bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-100" },
    payment: { icon: CreditCardOutlined, bg: "bg-green-50", text: "text-green-500", border: "border-green-100" },
    shipping: { icon: CarOutlined, bg: "bg-purple-50", text: "text-purple-500", border: "border-purple-100" },
    kyc: { icon: SafetyCertificateOutlined, bg: "bg-orange-50", text: "text-orange-500", border: "border-orange-100" },
};

const DEFAULT_CONFIG = { icon: BellOutlined, bg: "bg-slate-50", text: "text-slate-400", border: "border-slate-100" };

function AdminNotificationDrawer({ open, onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        getAllNotifications({ limit: 50 }).then(({ data, error }) => {
            if (error) {
                notifyError(error);
            } else {
                setNotifications(data ?? []);
            }
            setLoading(false);
        });
    }, [open]);

    return (
        <UseDrawer open={open} onClose={onClose} title="การแจ้งเตือนระบบ">
            {loading ? (
                [1, 2, 3].map((i) => (
                    <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-700/50 animate-pulse" />
                ))
            ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                    <BellOutlined style={{ fontSize: 32 }} />
                    <p className="text-sm">ยังไม่มีการแจ้งเตือน</p>
                </div>
            ) : (
                notifications.map((n) => {
                    const cfg = TYPE_CONFIG[n.type] ?? DEFAULT_CONFIG;
                    const Icon = cfg.icon;
                    const userName =
                        [n.user?.first_name, n.user?.last_name].filter(Boolean).join(" ") || n.user?.email || "ระบบ";
                    return (
                        <div
                            key={n.id}
                            className={`p-4 rounded-xl bg-white dark:bg-slate-800 border ${cfg.border} dark:border-slate-700 hover:shadow-md transition-all ${!n.is_read ? "ring-1 ring-primary/20" : ""}`}
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
                                    <p className="text-[10px] text-slate-400 mt-1.5">ถึง: {userName}</p>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </UseDrawer>
    );
}

export default AdminNotificationDrawer;
