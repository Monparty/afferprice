"use client";
import { SearchOutlined } from "@ant-design/icons";
import InputText from "@/app/components/inputs/InputText";
import UseButton from "@/app/components/inputs/UseButton";

export const useColumnSearch = () => {
    const columnSearch = (dataIndex, control, setValue) => ({
        filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
            <div className="px-3 py-3">
                <InputText
                    control={control}
                    name={`search_${dataIndex}`}
                    icon={SearchOutlined}
                    placeholder={`ค้นหา...`}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    className="mb-3"
                    onPressEnter={confirm}
                />
                <div className="flex gap-2 justify-end">
                    <UseButton size="small" label="ค้นหา" onClick={() => confirm()} />
                    <UseButton
                        size="small"
                        label="ล้างค่า"
                        type="default"
                        onClick={() => {
                            setValue(`search_${dataIndex}`, "");
                            clearFilters?.();
                            confirm();
                        }}
                    />
                </div>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined className={`${filtered ? "text-orange-600" : null}`} />,
        onFilter: (value, record) =>
            String(record[dataIndex] ?? "")
                .toLowerCase()
                .includes(String(value).toLowerCase()),
    });

    return { columnSearch };
};
