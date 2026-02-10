import { Segmented } from "antd";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";

function UseSegmented({ options, onChange }) {
    return (
        <Segmented
            options={[
                { value: "1", icon: <BarsOutlined /> },
                { value: "2", icon: <AppstoreOutlined /> },
            ]}
            onChange={(e) => {
                if (onChange === typeof "function") {
                    onChange(e);
                }
            }}
        />
    );
}

export default UseSegmented;
