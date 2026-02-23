import { Button } from "antd";

function UseButton({
    icon: Icon,
    type = "primary", // "default" | "link" | "text" | "primary" | "dashed"
    label = "",
    onClick,
    shape = "default",
    iconPlacement = false, // icon end
    size = "middle",
    wFull = false,
    disabled = false,
    className,
    htmlType = "button",
}) {
    return (
        <Button
            className={`${className} ${wFull ? "w-full" : "w-fit"}`}
            type={type}
            onClick={onClick}
            htmlType={htmlType}
            shape={shape}
            icon={Icon && <Icon style={{ fontSize: "16px" }} />}
            iconPlacement={iconPlacement ? "end" : "start"}
            size={size}
            disabled={disabled}
        >
            {label}
        </Button>
    );
}

export default UseButton;
