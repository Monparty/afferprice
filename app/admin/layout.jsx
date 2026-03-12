import {
    BarChartOutlined,
    CreditCardOutlined,
    ExceptionOutlined,
    HistoryOutlined,
    InboxOutlined,
    SettingOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import AdminLayout from "./components/AdminLayout";
import { ROUTES } from "./constants/routes";

export const metadata = {
    title: "Afferprice Admin",
    description: "แหล่งรวมการประมูลสิ้นค้าจากทั่วไทย",
};

export default function RootLayout({ children }) {
    const menuList = [
        {
            url: ROUTES.ADMIN,
            label: "แดชบอร์ด",
            icon: <BarChartOutlined className="text-lg!" />,
        },
        {
            url: ROUTES.ADMIN,
            label: "จัดการสินค้าประมูล",
            icon: <ShoppingCartOutlined className="text-lg!" />,
        },
        {
            url: ROUTES.ADMIN,
            label: "ตรวจสอบการ bid",
            icon: <InboxOutlined className="text-lg!" />,
        },
        {
            url: ROUTES.ADMIN,
            label: "หลังจากประมูลจบ",
            icon: <HistoryOutlined className="text-lg!" />,
        },
        {
            url: ROUTES.ADMIN_USERS,
            label: "จัดการผู้ใช้งาน",
            icon: <UserOutlined className="text-lg!" />,
        },
        {
            url: ROUTES.ADMIN_CATEGORIES,
            label: "จัดการหมวดหมู่สินค้า",
            icon: <ShopOutlined className="text-lg!" />,
        },
        {
            url: ROUTES.ADMIN,
            label: "การชำระเงิน",
            icon: <CreditCardOutlined className="text-lg!" />,
        },
        {
            url: ROUTES.ADMIN,
            label: "ระบบแจ้งปัญหา",
            icon: <ExceptionOutlined className="text-lg!" />,
        },
        {
            url: ROUTES.ADMIN,
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
