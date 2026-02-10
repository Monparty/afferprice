import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

function UseBreadcrumb({ items }) {
    return (
        <div className="mb-3">
            <Breadcrumb
                items={[
                    {
                        href: "/",
                        title: <HomeOutlined />,
                    },
                    ...items,
                ]}
            />
        </div>
    );
}

export default UseBreadcrumb;
