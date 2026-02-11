import { ConfigProvider, Steps } from "antd";
import React from "react";
import { volcano } from "@ant-design/colors";

function UseSteps({ current = 0, items }) {
    if (!items?.length) return null;
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: volcano[5],
                },
            }}
        >
            <Steps current={current} items={items} />
        </ConfigProvider>
    );
}

export default UseSteps;
