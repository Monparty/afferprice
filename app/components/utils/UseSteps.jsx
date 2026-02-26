import { Steps } from "antd";

function UseSteps({ current = 0, items, orientation = "horizontal", height }) {
    if (!items?.length) return null;
    return (
        <Steps
            current={current}
            items={items}
            orientation={orientation}
            classNames={{
                itemWrapper: height && orientation === "vertical" ? height : undefined,
                itemIcon: height && orientation === "vertical" ? "bg-orange-50!" : undefined,
            }}
        />
    );
}

export default UseSteps;
