export const mapProductState = (state) => {
    const dataConfig = {
        draft: { name: "บันทึกร่าง", color: "gray" },
        pending_review: { name: "รออนุมัติ", color: "blue" },
        rejected: { name: "ไม่อนุมัติ", color: "red" },
        active: { name: "กำลังประมูล", color: "darkgreen" },
        ended: { name: "หมดเวลาประมูล", color: "pink" },
        sold: { name: "มีผู้ชนะ", color: "orange" },
        order: { name: "การจัดส่ง", color: "cyan" },
        cancelled: { name: "ยกเลิก", color: "yellow" },
    };
    const { name, color } = dataConfig[state] || {
        name: "-",
        color: "#ffffff",
    };
    return { name, color };
};
