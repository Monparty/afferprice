import { Badge } from "antd";
import React from "react";

function UseBadge({ children, dot = false, count = null }) {
    return (
        <Badge
            dot={dot}
            count={count}
            size="small"
            classNames={{
                indicator: "text-[10px]!",
            }}
        >
            {children}
        </Badge>
    );
}

export default UseBadge;
