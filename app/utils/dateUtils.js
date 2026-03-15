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
