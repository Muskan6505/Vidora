import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components";

const NotFound = () => {
    return (
        <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 pt-20">
            <div className="text-center">
            <h1 className="text-7xl font-extrabold text-gray-800 dark:text-white">404</h1>
            <p className="text-2xl mt-4 text-gray-600 dark:text-gray-300">Oops! Page not found.</p>
            <p className="text-md mt-2 text-gray-500 dark:text-gray-400">
                The page you're looking for doesn't exist or has been moved.
            </p>

            <Link
                to="/"
                className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
                Back to Home
            </Link>
            </div>
        </div>
        </div>
    );
};

export default NotFound;
