import CategoriesPage from "./CategoriesPage";

export const metadata = {
    title: "สินค้าทั้งหมด — ค้นหาและกรองสินค้าประมูล",
    description:
        "ค้นหาสินค้าประมูลจากทุกหมวดหมู่ กรองตามราคา สภาพสินค้า และเวลาที่เหลือ พบสินค้าที่ใช่สำหรับคุณ",
    alternates: { canonical: "https://www.afferprice.com/categories" },
    openGraph: {
        title: "สินค้าทั้งหมด | Afferprice",
        description: "ค้นหาสินค้าประมูลจากทุกหมวดหมู่ กรองตามราคาและสภาพสินค้า",
        url: "https://www.afferprice.com/categories",
    },
};

export default function Page() {
    return <CategoriesPage />;
}
