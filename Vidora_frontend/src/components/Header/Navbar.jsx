import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {Logo} from "../index.js";

const Navbar = () => {
    const user = useSelector((state) => state.user.user); 
    const user1 = user?.data?.user;
    // console.log(user)

    return (
        <nav className="bg-gray-200 dark:bg-gray-950 shadow-md px-4 py-3 flex items-center justify-between border-b-2 border-blue-600 fixed top-0 left-0 w-full z-52">
        <Logo textClassName="text-2xl "/>
        <div className="flex items-center space-x-6">
            {user ? (
                
            <>
                <span className="dark:text-gray-200 text-black font-medium">{user1.fullname}</span>
                <Link to="/profile">
                <img
                src={user1?.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
                />
                </Link>
            </>
            ) : (
            <>
                <Link
                to="/login"
                className="text-sm text-blue-600 font-medium md:text-[18px] hover:underline"
                >
                Login
                </Link>
                <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 text-sm md:text-[18px] font-medium"
                >
                Signup
                </Link>
            </>
            )}
        </div>
        </nav>
    );
};

export default Navbar;