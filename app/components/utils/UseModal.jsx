import { Modal } from "antd";

function UseModal({ children, open, onOk, onCancel, title, okText = "บันทึก", cancelText = "ปิด" }) {
    return (
        <Modal
            title={title}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            okText={okText}
            cancelText={cancelText}
            width={{
                xs: "90%",
                sm: "80%",
                md: "70%",
                lg: "60%",
                xl: "50%",
                xxl: "40%",
            }}
        >
            <>{children}</>
        </Modal>
    );
}

export default UseModal;
