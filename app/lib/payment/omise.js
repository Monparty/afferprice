import "server-only";

// Omise REST helpers — ใช้ fetch ตรง (DO NOT use the `omise` npm package — ESM interop broken)
function authHeader() {
    return "Basic " + Buffer.from(`${process.env.OMISE_SECRET_KEY}:`).toString("base64");
}

export async function omiseFetch(path, body) {
    const res = await fetch(`https://api.omise.co${path}`, {
        method: "POST",
        headers: {
            Authorization: authHeader(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.object === "error") throw new Error(data.message);
    return data;
}

export async function omiseGet(path) {
    const res = await fetch(`https://api.omise.co${path}`, {
        headers: { Authorization: authHeader() },
    });
    const data = await res.json();
    if (data.object === "error") throw new Error(data.message);
    return data;
}
