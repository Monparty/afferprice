import { ConfigProvider, Table } from "antd";
import { volcano } from "@ant-design/colors";

function UseTable({ dataSource, columns }) {
    if (!dataSource?.length && !columns?.length) return null;
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
