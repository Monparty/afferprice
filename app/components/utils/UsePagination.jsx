import { Pagination } from "antd";
import React from "react";

function UsePagination({ align = "center" }) {
    return <Pagination defaultCurrent={1} total={50} align={align} />;
}

export default UsePagination;
