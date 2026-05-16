import AdminLayout from "./components/AdminLayout";

export const metadata = {
    title: "Afferprice Admin",
    description: "แหล่งรวมการประมูลสินค้าจากทั่วไทย",
};

export default function RootLayout({ children }) {
    return <AdminLayout>{children}</AdminLayout>;
}
