import {
    BarChartOutlined,
    CreditCardOutlined,
    ExceptionOutlined,
    FileDoneOutlined,
    HistoryOutlined,
    InboxOutlined,
    SettingOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import AdminLayout from "./components/AdminLayout";

export const metadata = {
    title: "Afferprice Admin",
    description: "แหล่งรวมการประมูลสิ้นค้าจากทั่วไทย",
};

export default function RootLayout({ children }) {
    const menuList = [
        {
            url: "/admin",
            label: "แดชบอร์ด",
            icon: <BarChartOutlined className="text-lg!" />,
        },
        {
            url: "/admin/",
            label: "จัดการสินค้าประมูล",
            icon: <ShoppingCartOutlined className="text-lg!" />,
        },
        {
            url: "/admin",
            label: "ตรวจสอบการ bid",
            icon: <InboxOutlined className="text-lg!" />,
        },
        {
            url: "/admin",
            label: "หลังจากประมูลจบ",
            icon: <HistoryOutlined className="text-lg!" />,
        },
        {
            url: "/admin/users",
            label: "จัดการผู้ใช้งาน",
            icon: <UserOutlined className="text-lg!" />,
        },
        {
            url: "/admin",
            label: "จัดการหมวดหมู่สินค้า",
            icon: <ShopOutlined className="text-lg!" />,
        },
        {
            url: "/admin",
            label: "การชำระเงิน",
            icon: <CreditCardOutlined className="text-lg!" />,
        },
        {
            url: "/admin",
            label: "ระบบแจ้งปัญหา",
            icon: <ExceptionOutlined className="text-lg!" />,
        },
        {
            url: "/admin",
            label: "การตั้งค่า",
            icon: <SettingOutlined className="text-lg!" />,
        },
    ];

    return (
        <div className="flex">
            <AdminLayout menus={menuList}>{children}</AdminLayout>
        </div>
    );
}
