import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

function UseBreadcrumb({ items }) {
    return (
        <div className="mb-4">
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
