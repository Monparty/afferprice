// JSON POST helper สำหรับเรียก /api/* ภายในจากฝั่ง client
// สำเร็จ → คืน parsed JSON; HTTP !ok → throw Error(message = error code จาก server)
// เพื่อให้ notifyError(err) แปลเป็นภาษาไทยผ่าน supabaseErrorMap ได้ทันที
export async function apiPost(url, body = {}) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "");
    return data;
}

// แบบไม่ throw — คืน { data, error } ตาม convention ของ service layer
export async function apiPostSafe(url, body) {
    try {
        return { data: await apiPost(url, body), error: null };
    } catch (err) {
        return { data: null, error: { message: err.message } };
    }
}
