import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button, Logo } from "../components";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "/api/v1/users/forgot-password", 
                { value: email },
                {withCredentials:true}
            );
            localStorage.setItem("resetToken", res.data.data.token);
            setSuccess("Reset token generated! Proceed to reset password.");
            setTimeout(() => navigate("/reset-password"), 1500);
        } catch (err) {
            setError(err.response?.data?.data?.message || "Something went wrong");
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-950">
            <div className="flex flex-col items-center justify-center px-6 py-8 h-screen mx-auto md:h-screen lg:py-0">
                <Logo />
                <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-300 border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-blue-700 dark:text-blue-400">
                            Forgot your password?
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <Input
                                label="Email or Username"
                                type="text"
                                name="email"
                                placeholder="Enter your email or username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                            {success && <p className="text-green-500 text-sm font-medium">{success}</p>}
                            <Button type="submit" btn="Get Reset Token" />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
