import React from "react";
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import { Link } from "react-router-dom";
import { Navbar } from "../components/index.js";
import { useSelector } from "react-redux";
import {Home} from './index.js'
const Welcome = () => {

    const user = useSelector((state) => state.user);
    return (
        <>
        { !user.user ? 
            <div>
                <Navbar/>
                <div className="min-h-screen pt-20 dark:bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-gray-50 px-6 py-10 flex flex-col md:flex-row-reverse flex-wrap items-center justify-center gap-6 overflow-hidden">
                
                {/* Text Section */}
                <div className="text-center md:text-left max-w-2xl animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-6">
                    Welcome to Vidora
                    </h1>
                    <p className="text-lg md:text-xl dark:text-gray-300 text-gray-600 leading-relaxed">
                    Discover, share, and enjoy a world of videos curated just for you. 🎬
                    <br /> <span className="dark:text-blue-300 text-blue-500 font-medium">Watch. Upload. Connect.</span>
                    <br /> Your creative journey starts here.
                    <Link
                        to="/login"
                        className="bg-blue-600 text-white px-4 md:px-8 py-1 md:py-2 rounded-full hover:bg-blue-700 text-sm md:text-[20px] font-medium mx-5 shadow-md hover:scale-105 hover:shadow-blue-500"
                        >
                        Login
                    </Link>
                    </p>
                    
                </div>

                {/* Image Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full animate-fade-in">
                    <div className="flex flex-col gap-4">
                    {[img1, img2].map((img, idx) => (
                        <div key={idx} className="rounded-2xl overflow-hidden shadow-xl transform transition duration-500 hover:scale-105 hover:shadow-blue-500/50">
                        <img src={img} alt={`img${idx + 1}`} className="w-full h-52 object-cover" />
                        </div>
                    ))}
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-xl transform transition duration-500 hover:scale-105 hover:shadow-pink-500/50">
                    <img src={img3} alt="img3" className="w-full h-full object-cover max-h-[460px]" />
                    </div>
                </div>
                </div>
            </div>
        :
            <Home/>
        }
        </>
    );
};

export default Welcome;
