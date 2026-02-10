import { ConfigProvider, Tabs } from "antd";
import { volcano } from "@ant-design/colors";

function UseTabs({ items, size = "middle", onChange }) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: volcano[5],
                },
            }}
        >
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} size={size} />
        </ConfigProvider>
    );
}

export default UseTabs;
