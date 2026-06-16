import dayjs from "dayjs";

// format ที่ได้มาเป็นแบบนี้ ("2026-03-13 15:46:39")
export const getDate = (data) => {
    if (!data) return null;
    return String(data).split(" ")[0];
};

export const getTime = (data) => {
    if (!data) return null;
    return String(data).split(" ")[1];
};

export const formatDateTime = (data) => (data ? dayjs(data).format("YYYY-MM-DD HH:mm:ss") : null);

const padTwo = (n) => String(n).padStart(2, "0");

// นับถอยหลังถึง endTime → { ended, text }; null ถ้าไม่มี endTime
// > 1 วัน → "X วัน HH ชม."; มิฉะนั้น "HH:MM:SS"; หมดเวลา → "หมดเวลา"
export const formatCountdown = (endTime) => {
    if (!endTime) return null;
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return { ended: true, text: "หมดเวลา" };
    const total = Math.floor(diff / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    if (days > 0) return { ended: false, text: `${days} วัน ${padTwo(hours)} ชม.` };
    return { ended: false, text: `${padTwo(hours)}:${padTwo(minutes)}:${padTwo(seconds)}` };
};
