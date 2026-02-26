import { Table } from "antd";

function UseTable({ dataSource, columns }) {
    if (!dataSource?.length && !columns?.length) return null;
    return <Table dataSource={dataSource} columns={columns} />;
}

export default UseTable;
