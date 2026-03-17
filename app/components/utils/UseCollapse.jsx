import { Collapse } from "antd";

function UseCollapse({ items, defaultActiveKey, size }) {
    if (!items?.length) return null;
    return <Collapse items={items} defaultActiveKey={[defaultActiveKey]} size={size} />;
}

export default UseCollapse;
