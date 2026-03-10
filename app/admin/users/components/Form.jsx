import React from "react";

function Form({ id }) {
    const isEdit = Boolean(id);
    
    const handleSubmit = async (data) => {
        if (id) {
            await updateUser(id, data);
        } else {
            await createUser(data);
        }
    };

    return <div>หน้า {isEdit ? "Edit User" + id : "Create User"}</div>;
}

export default Form;
