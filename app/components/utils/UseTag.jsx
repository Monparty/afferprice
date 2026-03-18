import { Tag } from "antd";

function UseTag({ label, color, variant = "filled", className }) {
    // variant = ['filled', 'solid', 'outlined']
    return (
        <Tag color={color} variant={variant} className={className}>
            {label}
        </Tag>
    );
}

export default UseTag;
