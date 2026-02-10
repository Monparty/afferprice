import { Avatar } from "antd";
import React from "react";

function UseAvatar({ icon: Icon, src }) {
    return <Avatar src={src} icon={Icon && <Icon />} />;
}

export default UseAvatar;
