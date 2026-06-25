import { Table } from "antd";

function UseTable({ dataSource, columns, onRow, scroll }) {
    if (!dataSource?.length && !columns?.length) return null;
    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            onRow={onRow}
            scroll={{ x: "max-content", ...scroll }}
            classNames={{
                header: {
                    cell: "rounded-none!",
                },
            }}
            showSorterTooltip={{ target: "sorter-icon" }}
        />
    );
}

export default UseTable;
