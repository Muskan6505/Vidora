import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../features/userSlice.js";
import { Logo, Input, Button } from "../components/index.js";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    useEffect(() => {
        if (error) setError(null);
    }, [fullName, username, email, password, confirmPassword, avatar, coverImage]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!avatar) {
            setError("Avatar is required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("avatar", avatar);
            if (coverImage) formData.append("coverImage", coverImage);

            const response = await axios.post("/api/v1/users/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const userData = response.data;
            dispatch(login(userData));
            navigate("/");
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 overflow-y-scroll scrollbar-none">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-auto lg:py-0">
                <Logo />
                <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create your account
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
                            <Input
                                label="Full Name"
                                type="text"
                                name="fullName"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                            <Input
                                label="Username"
                                type="text"
                                name="username"
                                placeholder="johndoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
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
                            type="file" 
                            label="Avatar" 
                            accept="image/*" 
                            onChange={(e) => setAvatar(e.target.files[0])} required 
                            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                            />
                            
                            <Input 
                            label="Cover Image (optional)"
                            name="coverImage"
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setCoverImage(e.target.files[0])} 
                            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
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
                            <Input
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            {error && <p className="text-red-500 text-md font-semibold">{error}</p>}
                            <Button type="submit" btn="Sign up" />
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account?{" "}
                                <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-blue-600">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;
