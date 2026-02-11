import { ConfigProvider, Table } from "antd";
import { volcano } from "@ant-design/colors";

function UseTable({ dataSource, columns }) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: volcano[5],
                },
            }}
        >
            <Table dataSource={dataSource} columns={columns} />
        </ConfigProvider>
    );
}

export default UseTable;
