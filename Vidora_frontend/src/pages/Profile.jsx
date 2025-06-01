import React, { useState, useEffect } from "react";
import axios from "axios"
import {Link} from "react-router-dom"

const Profile = () => {
    const [userDetails, setUserDetails] = useState({
        fullname: "",
        email: "",
        username: "",
    });

    const [editing, setEditing] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async() => {
        try {
            const res = await axios.get("/api/v1/users/current-user",
                {},
                {withCredentials: true}
            );
            setUserDetails({
                fullname: res.data.data.username,
                email: res.data.data.email,
                username: res.data.data.username
            })
            setAvatarPreview(res.data.data.avatar)
        } catch (error) {
            console.error("getting user details failed.", error)
        }
    }

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const res = await axios.patch(
            "/api/v1/users/update-avatar",
            formData,
            {
                withCredentials: true,
                headers: {
                "Content-Type": "multipart/form-data",
                },
            }
            );
            console.log("Avatar updated successfully", res.data);
            // Optional: re-fetch user details to update avatar preview from backend
        } catch (error) {
            console.error("Failed to upload avatar:", error);
        }
    };


    const handleSave = async() => {    
        try {
            const res = await axios.patch("/api/v1/users/update-account-details",
                {   
                    fullname: userDetails.fullname,
                    email: userDetails.email
                },
                {withCredentials: true}
            )
        } catch (error) {
            console.error("saving failed", error)
        }
        setEditing(false);
    };

    return (
        <div className="min-h-screen dark:bg-gray-950 bg-gray-50 py-10 px-4 top-0 ">
        <div className="max-w-4xl mx-auto dark:bg-gray-900 bg-gray-200 shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 dark:text-white">
            My Profile
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative group">
                <img
                    src={avatarPreview || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-36 h-36 rounded-full border-4 border-blue-300 object-cover transition duration-300 group-hover:brightness-90"
                />
                <label className="absolute bottom-0 left-0 right-0 text-center text-xs text-blue-600 bg-white bg-opacity-80 py-1 cursor-pointer rounded-b-full group-hover:visible dark:text-blue-700 dark:bg-gray-200">
                    Change
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    />
                </label>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-300">Edit Profile Picture</span>
            </div>

            {/* Details Form */}
            <div className="flex-1 space-y-4">
                <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400">Full Name</label>
                <input
                    type="text"
                    value={userDetails.fullname}
                    disabled={!editing}
                    onChange={(e) =>
                    setUserDetails({ ...userDetails, fullname: e.target.value })
                    }
                    className={`w-full px-4 py-2 mt-1 rounded-lg border ${
                    editing
                        ? "border-blue-400 focus:ring-2 focus:ring-blue-300"
                        : "bg-gray-100 text-gray-600"
                    } transition dark:bg-gray-300 dark:border-blue-700 dark:text-black`}
                />
                </div>
                <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400">Email</label>
                <input
                    type="email"
                    value={userDetails.email}
                    disabled={!editing}
                    onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                    }
                    className={`w-full px-4 py-2 mt-1 rounded-lg border ${
                    editing
                        ? "border-blue-400 focus:ring-2 focus:ring-blue-300"
                        : "bg-gray-100 text-gray-600"
                    } transition dark:bg-gray-300 dark:border-blue-700 dark:text-black`}
                />
                </div>
                <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400">Username</label>
                <input
                    type="text"
                    value={userDetails.username}
                    disabled
                    className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-300 dark:border-blue-700 dark:text-black"
                />
                </div>

                <div className="mt-4 flex gap-4">
                {editing ? (
                    <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                    Save
                    </button>
                ) : (
                    <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                    Edit Details
                    </button>
                )}
                <Link
                    to="/change-password"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ml-5"
                    >
                    Change Password
                </Link>
                </div>
            </div>
            </div>

            {/* Separator */}
            <hr className="my-8 border-t-2 border-gray-200" />

            {/* Links Section */}
            <div className="grid md:grid-cols-2 gap-4 text-center text-lg font-medium text-blue-600">
            <Link
                to="/playlists"
                className="hover:underline hover:text-blue-800 transition"
            >
                🎵 Playlists
            </Link>
            <Link
                to="/watch-history"
                className="hover:underline hover:text-blue-800 transition"
            >
                📺 Watch History
            </Link>
            <Link
                to="/tweets"
                className="hover:underline hover:text-blue-800 transition"
            >
                🐦 My Tweets
            </Link>
            <Link
                to="/liked-videos"
                className="hover:underline hover:text-blue-800 transition"
            >
                ❤️ Liked Videos
            </Link>
            </div>
        </div>
        </div>
    );
};

export default Profile;
