import AuctionPage from "./AuctionPage";

export const metadata = {
    title: "ประมูล Live — สินค้ากำลังประมูลทั้งหมด",
    description:
        "รายการสินค้าที่กำลังประมูลอยู่ตอนนี้ อัปเดตแบบ real-time เสนอราคาได้ทันที ก่อนหมดเวลา",
    alternates: { canonical: "https://www.afferprice.com/auction" },
    openGraph: {
        title: "ประมูล Live | Afferprice",
        description: "สินค้ากำลังประมูลอยู่ตอนนี้ รีบเสนอราคาก่อนหมดเวลา",
        url: "https://www.afferprice.com/auction",
    },
};

export default function Page() {
    return <AuctionPage />;
}
