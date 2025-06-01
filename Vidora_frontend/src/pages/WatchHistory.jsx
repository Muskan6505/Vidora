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
            const cleanData = res.data.data.filter(v => v?.video || v?._id); 
            cleanData.reverse();
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
            <div className="h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-2xl text-gray-300">No video watched yet.</p>
            </div>
        );
    }

    return (
        <div style={{overflow:"scroll", scrollbarWidth:"none"}} className="min-h-screen dark:bg-gray-950 bg-gray-50 p-6 z-60">
            {loading ? (
                <div className="h-screen flex items-center justify-center">
                    <p className="text-2xl font-bold dark:text-gray-200 text-black">Loading...</p>
                </div>
            ) : (
                <>
                    <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-400 mb-8">Watch History</h2>
                    <div className="flex flex-col gap-6">
                        {videos.map((video) => (
                            <div
                                key={video._id} 
                                className="flex flex-row rounded-xl overflow-hidden shadow-md hover:scale-[1.01] transition-transform cursor-pointer dark:bg-gray-900 bg-gray-300 p-4 mx-8 "
                            >
                                <img
                                onClick={() => handleClick(video)}
                                    src={video.thumbnail || ""}
                                    alt={video.title}
                                    className="w-25 md:w-60 md:h-31 h-20 object-cover rounded-xl border border-gray-600"
                                />
                                <div className="md:p-4 ml-2 flex flex-col justify-between w-full rounded-xl border-1 dark:border-gray-300 border-gray-700 dark:bg-gray-950 bg-gray-200">
                                    <div>
                                        <h3 className="md:text-xl ml-1 text-[1rem] font-semibold dark:text-white text-black">{video.title}</h3>
                                        <p className="text-sm dark:text-gray-300 text-gray-800 ml-1 md:mt-1 line-clamp-2">{video.description}</p>
                                    </div>
                                    <div className="flex items-center md:gap-3 gap-1 md: mt-4 ">
                                        <img
                                            onClick={()=>{navigate(`/channel/${video?.owner?.username}`)}}
                                            src={video?.owner?.avatar}
                                            alt={video?.owner?.username}
                                            className="md:w-6 md:h-6 ml-2 w-3 h-3 rounded-full"
                                        />
                                        <span className="dark:text-gray-400 text-gray-700 text-sm">@{video.owner?.username}</span>
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
