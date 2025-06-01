import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

const SearchBar = ({ onChange }) => {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (onChange) onChange(query);
        }, 500); // debounce delay

        return () => clearTimeout(timeout);
    }, [query, onChange]);

    return (
        <div className="w-full px-4 py-2 dark:bg-gray-950 bg-gray-50 border-t-2 border-b-2 border-blue-700 shadow-md fixed top-15 z-50">
            <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-3 md:gap-6">
                <button
                    onClick={() => {
                        const sidebar = document.getElementById("sidebar");
                        if (sidebar) sidebar.classList.toggle("hidden");
                    }}
                    className="block md:hidden text-gray-300"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="flex-grow min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 dark:bg-gray-700 bg-gray-300 dark:text-white  dark:placeholder-gray-400 placeholder-gray-500"
                    />
                </div>

                <Link to="/post-video" className="flex flex-row justify-center items-center">
                    <button
                        className="md:px-4 md:py-2 px-2.5 py-1 bg-blue-600 hover:bg-blue-800 text-white rounded-full md:text-xl text-large text-center transition duration-200 cursor-pointer"
                        title="Post a video"
                    >
                        +
                    </button>
                    <span className="text-white ml-1 md:text-[20px] hidden md:block">New</span>
                </Link>
            </div>
        </div>
    );
};

export default SearchBar;