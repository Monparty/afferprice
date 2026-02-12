import { ConfigProvider, Steps } from "antd";
import React from "react";
import { volcano } from "@ant-design/colors";

function UseSteps({ current = 0, items, orientation = "horizontal", height }) {
    if (!items?.length) return null;
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: volcano[5],
                },
            }}
        >
            <Steps
                current={current}
                items={items}
                orientation={orientation}
                classNames={{
                    itemWrapper: height && orientation === "vertical" ? height : undefined,
                    itemIcon: height && orientation === "vertical" ? "bg-orange-50!" : undefined,
                }}
            />
        </ConfigProvider>
    );
}

export default UseSteps;
