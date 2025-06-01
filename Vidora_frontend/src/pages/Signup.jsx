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
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    useEffect(() => {
        if (error || success) {
            setError(null);
            setSuccess(null);
        }
    }, [fullName, username, email, password, confirmPassword, avatar, coverImage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (password !== confirmPassword) {
            setLoading(false);
            setError("Passwords do not match");
            return;
        }

        if (!avatar) {
            setLoading(false);
            setError("Avatar is required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("fullname", fullName);
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("avatar", avatar);
            if (coverImage) formData.append("coverImage", coverImage);

            const response = await axios.post("/api/v1/users/register", formData);
            const userData = response.data;
            dispatch(login(userData));

            setSuccess("Signup successful!");
            setLoading(false);

            // Optional: clear form fields
            setFullName("");
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setAvatar(null);
            setCoverImage(null);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-950 overflow-y-scroll scrollbar-none">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-auto lg:py-0">
                <Logo />
                <div className="w-full bg-white rounded-lg shadow border sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-300 border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-blue-700 md:text-2xl dark:text-blue-400">
                            Create your account
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
                            <Input label="Full Name" type="text" name="fullName" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                            <Input label="Username" type="text" name="username" placeholder="johndoe" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            <Input label="Email" type="email" name="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <Input type="file" label="Avatar" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} required />
                            <Input label="Cover Image (optional)" name="coverImage" type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} />
                            <Input label="Password" type="password" name="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <Input label="Confirm Password" type="password" name="confirmPassword" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

                            {error && <p className="text-red-500 text-md font-semibold">{error}</p>}
                            {success && <p className="text-green-600 text-md font-semibold">{success}</p>}

                            <Button type="submit" btn={loading ? "Signing up..." : "Sign up"} disabled={loading} />
                            
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account?{" "}
                                <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-blue-600 text-blue-600">
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
