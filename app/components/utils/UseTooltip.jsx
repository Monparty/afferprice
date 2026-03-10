import { Tooltip } from "antd";

function UseTooltip({ children, title }) {
    return (
        <Tooltip
            title={title}
            arrow={false}
            placement="bottom"
            classNames={{
                container: "px-4! pt-1! pb-1.5! text-xs min-w-fit min-h-fit! bg-slate-700!",
            }}
        >
            <>{children}</>
        </Tooltip>
    );
}

export default UseTooltip;
