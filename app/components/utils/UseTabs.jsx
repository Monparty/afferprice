import { Tabs } from "antd";

function UseTabs({ items, size = "middle", onChange }) {
    return <Tabs defaultActiveKey="1" items={items} onChange={(activeKey) => onChange(activeKey)} size={size} />;
}

export default UseTabs;
