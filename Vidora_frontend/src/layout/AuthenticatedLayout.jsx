import React from "react";
import Navbar from "../components/Header/Navbar";
import { Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";

const AuthenticatedLayout = () => {
    const user = useSelector((state) => state.user)
    const isAuthenticated = user.isLoggedIn;

    return (
        isAuthenticated?
        <>
        <Navbar />
        <div className="pt-15">
            <Outlet />
        </div>
        </>
        :
        <Navigate to="/" />
    );
};

export default AuthenticatedLayout;