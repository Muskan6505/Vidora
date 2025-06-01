import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button, Logo } from "../components";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("resetToken");
        if (!token) {
            setError("Reset token missing.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await axios.post("/api/v1/users/reset-password", {
                token,
                password,
            });
            localStorage.removeItem("resetToken");
            setSuccess("Password successfully updated!");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Reset failed");
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-950">
            <div className="flex flex-col items-center justify-center px-6 py-8 h-screen mx-auto md:h-screen lg:py-0">
                <Logo />
                <div className="w-full bg-white rounded-lg shadow border sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-300 border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-blue-700 md:text-2xl dark:text-blue-400">
                            Reset your password
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <Input
                                label="New Password"
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="Re-enter new password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                            />
                            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                            {success && <p className="text-green-500 text-sm font-medium">{success}</p>}
                            <Button type="submit" btn="Reset Password" />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
