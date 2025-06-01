import React from "react";
import { Link } from "react-router-dom";
import LOGO from "../assets/logo.png"; 

const Logo = ({ textClassName = "text-2xl mb-6", imgClassName = "w-9 h-9" }) => {
    return (
        <div>
            <Link to="/" className={`flex items-center font-semibold dark:text-white text-black ${textClassName}`}>
                <img className={`mr-2 ${imgClassName}`} src={LOGO} alt="logo" />
                Vidora
            </Link>
        </div>
    );
};

export default Logo;