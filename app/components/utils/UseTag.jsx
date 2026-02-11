import { Tag } from "antd";

function UseTag({ label, color, variant }) {
    // variants = ['filled', 'solid', 'outlined']
    return <Tag color={color} variant={variant}>{label}</Tag>;
}

export default UseTag;
