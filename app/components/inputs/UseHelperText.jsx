import React from "react";

function UseHelperText({ errorMessage }) {
    return <p className="text-red-500 text-xs font-medium mt-1 w-fit">{errorMessage}</p>;
}

export default UseHelperText;
