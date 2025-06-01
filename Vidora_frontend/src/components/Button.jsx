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
            className={`w-full dark:text-white text-black bg-primary-600 border-2 dark:border-white border-gray-900 hover:bg-primary-700 focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 cursor-pointer`}
            {...props}>
                {btn}
            </button>
        </div>
    )
}

export default Button;