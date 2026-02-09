import { Avatar } from "antd";
import React from "react";

function UseAvatar({ icon: Icon, src }) {
    return (
        <div>
            <Avatar src={src} icon={Icon && <Icon />} />
        </div>
    );
}

export default UseAvatar;
