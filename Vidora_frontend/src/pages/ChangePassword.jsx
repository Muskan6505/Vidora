import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Logo, Input, Button } from "../components/index.js";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const user = useSelector((state) => state.user.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match");
            return;
        }

        try {
            const response = await axios.post(
                "/api/v1/users/change-password",
                {
                    currentPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        credentials: "true",
                    },
                }
            );
            setSuccess(response.data.message || "Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (err) {
            setError(err.response?.data?.message || "Password change failed");
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-950">
            <div className="flex flex-col items-center justify-center px-6 py-8 h-screen mx-auto md:h-screen lg:py-0">
                <Logo />
                <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-300 border-gray-800">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-blue-700 md:text-2xl dark:text-blue-400">
                            Change Password
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <Input
                                label="Current Password"
                                type="password"
                                name="currentPassword"
                                placeholder="••••••••"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                            <Input
                                label="New Password"
                                type="password"
                                name="newPassword"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <Input
                                label="Confirm New Password"
                                type="password"
                                name="confirmNewPassword"
                                placeholder="••••••••"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                            />
                            {error && <p className="text-red-500 text-md font-semibold">{error}</p>}
                            {success && <p className="text-green-500 text-md font-semibold">{success}</p>}
                            <Button type="submit" btn="Change Password" />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChangePassword;
