import { Popconfirm } from "antd";

function UsePopconfirm({ children, title, description, onConfirm }) {
    return (
        <>
            <Popconfirm
                title={title}
                description={description}
                onConfirm={onConfirm}
                okText="ยืนยัน"
                cancelText="ยกเลิก"
                placement="topRight"
            >
                <>{children}</>
            </Popconfirm>
        </>
    );
}

export default UsePopconfirm;
