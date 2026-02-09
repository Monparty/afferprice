import { Badge } from "antd";
import React from "react";

function UseBadge({ children, dot = false, count = null  }) {
    return (
        <div>
            <Badge dot={dot} count={count}>{children}</Badge>
        </div>
    );
}

export default UseBadge;
