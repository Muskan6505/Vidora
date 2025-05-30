import React from "react";

const Button = (
    {
        type="submit",
        btn= "",
        className="",
        ...props
    }
) => {
    return (
        <div>
            <button
            type={type}
            className={`w-full text-white bg-primary-600 border-2 border-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
            {...props}>
                {btn}
            </button>
        </div>
    )
}

export default Button;