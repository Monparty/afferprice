"use client";
import { Avatar } from "antd";

function UseAvatarGroup({ items, size }) {
    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `#${(hash & 0x00ffffff).toString(16).padStart(6, "0")}`;
    };

    return (
        <Avatar.Group
            max={{
                count: 3,
                style: { color: "#f56a00", backgroundColor: "#fde3cf", width: "24px", height: "24px" },
            }}
        >
            {items.map((item, index) => (
                <Avatar
                    key={index}
                    style={{ backgroundColor: stringToColor(item.firstName) }}
                    size={size}
                    className="uppercase text-xs!"
                >
                    {item.firstName[0]}
                </Avatar>
            ))}
        </Avatar.Group>
    );
}

export default UseAvatarGroup;
