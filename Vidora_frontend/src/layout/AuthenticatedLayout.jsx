import React from "react";
import Navbar from "../components/Header/Navbar";
import { Outlet } from "react-router-dom";

const AuthenticatedLayout = () => {
    return (
        <>
        <Navbar />
        <div className="pt-15">
            <Outlet />
        </div>
        </>
    );
};

export default AuthenticatedLayout;