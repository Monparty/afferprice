import { Button, ConfigProvider } from "antd";
import React from "react";
import { volcano } from "@ant-design/colors";

function UseButton({
    icon: Icon,
    type = "primary",
    label = "",
    onClick,
    shape = "default",
    iconPlacement = false, // icon end
    size = "middle",
    wFull = false,
    disabled = false,
    className
}) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: volcano[5],
                },
            }}
        >
            <Button
                className={`${className} ${wFull ? "w-full" : "w-fit"}`}
                type={type}
                onClick={onClick}
                shape={shape}
                icon={Icon && <Icon style={{ fontSize: "16px" }} />}
                iconPlacement={iconPlacement ? "end" : "start"}
                size={size}
                disabled={disabled}
            >
                {label}
            </Button>
        </ConfigProvider>
    );
}

export default UseButton;
