import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectVideo } from "../features/videoSlice";

const WatchHistory = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = async (video) => {
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

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/v1/users/history", { withCredentials: true });
            const cleanData = res.data.data.filter(v => v?.video || v?._id); // Defensive check
            setVideos(cleanData);
        } catch (err) {
            console.error("fetching history failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (!videos.length && !loading) {
        return (
            <div className="h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-2xl text-gray-300">No video watched yet.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6 overflow-y-scroll ">
            {loading ? (
                <div className="h-screen flex items-center justify-center">
                    <p className="text-2xl font-bold text-gray-200">Loading...</p>
                </div>
            ) : (
                <>
                    <h2 className="text-3xl font-bold text-center text-white mb-8">Watch History</h2>
                    <div className="flex flex-col gap-6">
                        {videos.map((video) => (
                            <div
                                key={video._id}
                                onClick={() => handleClick(video)}
                                className="flex flex-row rounded-xl overflow-hidden shadow-md hover:scale-[1.01] transition-transform cursor-pointer"
                            >
                                <img
                                    src={video.thumbnail || ""}
                                    alt={video.title}
                                    className="w-25 md:w-60 md:h-30 h-20 object-cover rounded-xl"
                                />
                                <div className="md:p-4 ml-2 flex flex-col justify-between w-full rounded-xl border-1 border-black">
                                    <div>
                                        <h3 className="md:text-xl ml-1 text-[1rem] font-semibold text-white">{video.title}</h3>
                                        <p className="text-sm text-gray-300 ml-1 md:mt-1 line-clamp-2">{video.description}</p>
                                    </div>
                                    <div className="flex items-center md:gap-3 gap-1 md: mt-4 ">
                                        <img
                                            src={video?.owner?.avatar}
                                            alt={video?.owner?.username}
                                            className="md:w-6 md:h-6 ml-2 w-3 h-3 rounded-full"
                                        />
                                        <span className="text-gray-400 text-sm">@{video.owner?.username}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default WatchHistory;
