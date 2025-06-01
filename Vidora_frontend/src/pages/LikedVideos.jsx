import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVideos, removeVideo } from "../features/likedSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { selectVideo } from "../features/videoSlice";

const LikedVideos = () => {
    const dispatch = useDispatch();
    const likedVideos = useSelector((state) => state.liked.likedVideos);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLikedVideos();
    }, [dispatch]);

    const fetchLikedVideos = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/v1/likes/videos", { withCredentials: true });

            // Filter out deleted videos
            const validVideos = response.data.data.filter(item => item.video !== null);

            if (validVideos.length < response.data.data.length) {
                console.warn("Some liked videos were deleted and could not be fetched.");
            }

            dispatch(setVideos(validVideos));
        } catch (error) {
            console.error("Failed to fetch liked videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            await axios.post(`/api/v1/likes/toggle/v/${id}`, {}, { withCredentials: true });
            dispatch(removeVideo(id));
        } catch (error) {
            console.error("Unlike video failed:", error);
        }
    };

    const handleClick = async (video) => {
        try {
            dispatch(selectVideo(video));
            await axios.patch(`/api/v1/videos/increment/views/${video._id}`, {}, {
                withCredentials: true,
            });
            navigate(`/video/${video._id}`);
        } catch (error) {
            console.error("Failed to increment view count:", error);
        }
    };

    if (!likedVideos.length && !loading) {
        return (
            <div className="h-screen dark:bg-gray-950 bg-gray-50 flex items-center justify-center">
                <p className="text-2xl dark:text-gray-300 text-black">No liked videos yet.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen dark:bg-gray-950 bg-gray-100 p-6">
            {loading ? (
                <div className="h-screen dark:bg-gray-950 bg-gray-100 flex items-center justify-center">
                    <p className="text-2xl font-bold dark:text-gray-200">Loading...</p>
                </div>
            ) : (
                <>
                    <h2 className="text-3xl font-bold text-center dark:text-blue-400 text-blue-900 mb-8">
                        Liked Videos
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-5">
                        {likedVideos.map(({ video }) => (
                            <div
                                key={video._id}
                                className="dark:bg-gray-900 bg-gray-50 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105"
                            >
                                <img
                                    onClick={() => handleClick(video)}
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-50 object-cover cursor-pointer"
                                />
                                <div className="p-1">
                                    <h3 className="text-lg font-semibold dark:text-white">
                                        {video.title}
                                    </h3>
                                    <p className="text-sm dark:text-gray-300 text-gray-800 line-clamp-2 mb-1">
                                        {video.description}
                                    </p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <img
                                            onClick={() => {
                                                navigate(`/channel/${video?.owner?.username}`);
                                            }}
                                            src={video.owner.avatar}
                                            alt={video.owner.username}
                                            className="w-6 h-6 rounded-full cursor-pointer"
                                        />
                                        <span className="dark:text-gray-400 text-gray-800 text-sm">
                                            @{video.owner.username}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(video._id)}
                                        className="text-red-500 text-sm hover:underline cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default LikedVideos;
