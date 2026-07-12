import { Collapse } from "antd";

function UseCollapse({ items, defaultActiveKey, size, ...rest }) {
    if (!items?.length) return null;
    const defaultKeys = Array.isArray(defaultActiveKey) ? defaultActiveKey : [defaultActiveKey];
    return <Collapse items={items} defaultActiveKey={defaultKeys} size={size} {...rest} />;
}

export default UseCollapse;
