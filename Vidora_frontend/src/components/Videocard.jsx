import React from 'react';
import { useDispatch } from 'react-redux';
import { selectVideo } from '../features/videoSlice.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const VideoCard = ({ video }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
        dispatch(selectVideo(video));
        await axios.patch(`/api/v1/videos/increment/views/${video._id}`, {}, {
            withCredentials: true,
        });
        } catch (error) {
        console.error("Failed to increment view count:", error);
        }
        navigate(`/video/${video._id}`);
    };

    return (
        <div
        className="transition-transform hover:scale-105 duration-200"
        >
        <div className="dark:bg-gray-900 bg-gray-100 rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto border border-blue-900">
            {/* Thumbnail with Duration */}
            <div className="relative">
            <img
                onClick={handleClick}
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover rounded-t-2xl cursor-pointer"
            />
            {/* Dark overlay */}
            {/* <div className="absolute inset-0 bg-black bg-opacity-10 rounded-t-2xl" /> */}

            {/* Duration badge */}
            <span className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {formatDuration(video.duration)}
            </span>
            </div>

            {/* Text Content */}
            <div className="p-4 space-y-2">
            <h3 className="dark:text-white font-semibold text-md line-clamp-2">{video.title}</h3>
            <p className="dark:text-gray-400 text-gray-800 text-sm line-clamp-2">{video.description}</p>

            {/* Owner & Views */}
            <div className="flex items-center gap-3 mt-3">
                <img
                onClick={()=>{navigate(`/channel/${video.owner.username}`)}}
                src={video.owner.avatar}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover cursor-pointer"
                />
                <div className="flex flex-col">
                <p className="text-sm dark:text-white font-medium">@{video.owner.username}</p>
                <p className="text-xs dark:text-gray-400 text-gray-800">{video.views} views</p>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

export default VideoCard;
