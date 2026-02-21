import { Popover } from "antd";

function UsePopover({ children, placement = undefined, content }) {
    return (
        <Popover content={content} placement={placement}>
            <div className="cursor-pointer">{children}</div>
        </Popover>
    );
}

export default UsePopover;
