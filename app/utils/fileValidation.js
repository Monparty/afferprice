export const IMAGE_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const VIDEO_MIME = ["video/mp4", "video/quicktime", "video/webm"];
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;   // 5 MB
export const VIDEO_MAX_BYTES = 50 * 1024 * 1024;  // 50 MB

const IMAGE_MAGIC = [
    { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
    { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
    { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
    { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
];

function matchesMagic(buffer, expected) {
    for (let i = 0; i < expected.length; i++) {
        if (buffer[i] !== expected[i]) return false;
    }
    return true;
}

async function readMagic(file, n = 12) {
    const slice = file.slice(0, n);
    const buf = new Uint8Array(await slice.arrayBuffer());
    return buf;
}

export async function validateImageFile(file) {
    if (!file) return "no_file";
    if (!IMAGE_MIME.includes(file.type)) return "invalid_image_type";
    if (file.size > IMAGE_MAX_BYTES) return "image_too_large";
    const head = await readMagic(file);
    const ok = IMAGE_MAGIC.some((m) => matchesMagic(head, m.bytes));
    if (!ok) return "invalid_image_signature";
    return null;
}

export async function validateVideoFile(file) {
    if (!file) return "no_file";
    if (!VIDEO_MIME.includes(file.type)) return "invalid_video_type";
    if (file.size > VIDEO_MAX_BYTES) return "video_too_large";
    return null;
}

export function fileErrorMessage(code) {
    switch (code) {
        case "invalid_image_type":
            return "ไฟล์ต้องเป็น JPG / PNG / WEBP / GIF เท่านั้น";
        case "image_too_large":
            return "ไฟล์รูปเกิน 5 MB";
        case "invalid_image_signature":
            return "ไฟล์ดูเหมือนถูกแก้ไขนามสกุล";
        case "invalid_video_type":
            return "ไฟล์ต้องเป็น MP4 / MOV / WEBM";
        case "video_too_large":
            return "ไฟล์วิดีโอเกิน 50 MB";
        default:
            return "ไฟล์ไม่ถูกต้อง";
    }
}
