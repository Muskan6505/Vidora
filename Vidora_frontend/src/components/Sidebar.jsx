import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/userSlice";

const Sidebar = ({className="" }) => {
    const user = useSelector((state) => state.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const logoutHandeler = async() => {
        try {
            const res = await axios.post(
                "/api/v1/users/logout",
                {},
                {withCredentials: true }
            )
            dispatch(logout())
            navigate("/")
            return res;
        } catch (err) {
            console.error("Signout Failed", err)
        }
    }


    useEffect(() => {
        if (!user.user || !user.user.data.user._id) {
        navigate("/");
        }
    }, [user]);


    return (
        <div id="sidebar" className="hidden md:block">
        <div
        className={`w-55 h-screen bg-white dark:bg-gray-900 shadow-lg p-4 flex flex-col ${className} border-r-2 border-blue-700 `}>
        {/* Profile Section */}
        <Link to="/profile" className="flex flex-col items-center mb-8">
            <img
            src= {user.user.data.user.avatar}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover mb-2"
            />
            <h2 className="text-lg font-semibold text-gray-100">{user.user.data.user.fullname}</h2>
            <p className="text-sm text-gray-200">@{user.user.data.user.username}</p>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4">
            <Link to="/" className=" text-white hover:text-blue-600 font-medium">
            Home
            </Link>
            <Link to="/dashboard" className="text-white hover:text-blue-500 font-medium ">
            Dashboard
            </Link>
            <Link to="/subscriptions" className="text-white hover:text-blue-500 font-medium ">
            Subscriptions
            </Link>
            <Link to="/tweets" className="text-white hover:text-blue-500 font-medium ">
            Tweets
            </Link>
            <Link to="/playlists" className="text-white hover:text-blue-500 font-medium ">
            Playlists
            </Link>
            <Link to="/watch-history" className="text-white hover:text-blue-500 font-medium ">
            Watch History
            </Link>
            <Link to="/liked-videos" className="text-white hover:text-blue-500 font-medium ">
            Liked Videos
            </Link>
            <button onClick={logoutHandeler} className="text-red-600 font-medium hover:underline text-left cursor-pointer">
            Sign Out
            </button>
        </nav>

        </div>
        </div>

    );
};

export default Sidebar;
