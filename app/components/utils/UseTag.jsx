import { Tag } from "antd";

function UseTag({ label, color, variant, style }) {
    // variants = ['filled', 'solid', 'outlined']
    return (
        <Tag color={color} variant={variant} style={style}>
            {label}
        </Tag>
    );
}

export default UseTag;
