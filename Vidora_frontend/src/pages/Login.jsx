import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../features/userSlice.js";
import { Logo, Input, Button } from "../components/index.js";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (error) setError(null);
    }, [email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/v1/users/login", {
                email,
                password,
            });
            const userData = response.data;
            dispatch(login(userData));
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-950">
            <div className="flex flex-col items-center justify-center px-6 py-8 h-screen mx-auto md:h-screen lg:py-0">
                <Logo />
                <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-300 border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-blue-700 md:text-2xl dark:text-blue-400">
                            Sign in to your account
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {error && <p className="text-red-500 text-md font-semibold">{error}</p>}
                            <div className="flex items-center justify-between">
                                <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline text-blue-600">
                                    Forgot password?
                                </Link>
                            </div>
                            <Button type="submit" btn="Sign in" />
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet?{" "}
                                <Link to="/register" className="font-medium text-primary-600 hover:underline text-blue-600">
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
