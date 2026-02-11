import { Segmented } from "antd";

function UseSegmented({ options, onChange }) {
    if (!options?.length) return null;
    return (
        <Segmented
            options={options}
            onChange={(e) => {
                if (onChange === typeof "function") {
                    onChange(e);
                }
            }}
            classNames={{
                root: " py-1!",
                item: "mx-1!",
            }}
        />
    );
}

export default UseSegmented;
