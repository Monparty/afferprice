// Escape JSON for inline <script> tags.
// JSON.stringify ไม่ escape `<`, `>`, `&`, U+2028, U+2029
// ทำให้ attacker ที่ control field ใด ๆ ใน object ใส่ "</script>..." ได้
const LS = new RegExp(String.fromCharCode(0x2028), "g");
const PS = new RegExp(String.fromCharCode(0x2029), "g");

export function jsonLdSafe(obj) {
    return JSON.stringify(obj)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(LS, "\\u2028")
        .replace(PS, "\\u2029");
}
