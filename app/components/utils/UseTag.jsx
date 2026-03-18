import { Tag } from "antd";

function UseTag({ label, color, icon: Icon, variant = "filled", className }) {
    // variant = ['filled', 'solid', 'outlined']
    return (
        <Tag color={color} icon={Icon && <Icon className="text-sm" />} variant={variant} className={className}>
            {label}
        </Tag>
    );
}

export default UseTag;
