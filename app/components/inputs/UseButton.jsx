import { Button, ConfigProvider } from "antd";
import React from "react";
import { volcano } from "@ant-design/colors";

function UseButton({
    icon: Icon,
    type = "primary",
    label = "",
    onClick,
    shape = "default",
    iconPlacement = false,
    size = "middle",
}) {
    return (
        <div>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: volcano[5],
                    },
                }}
            >
                <Button
                    className={`w-full`}
                    type={type}
                    onClick={onClick}
                    shape={shape}
                    icon={Icon && <Icon style={{ fontSize: "16px" }} />}
                    iconPlacement={iconPlacement ? "end" : "start"}
                    size={size}
                >
                    {label}
                </Button>
            </ConfigProvider>
        </div>
    );
}

export default UseButton;
