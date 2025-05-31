import React, { useEffect, useState } from "react";
import { SubscriptionButton } from "../components/index.js"
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { selectVideo } from "../features/videoSlice.js";
import { useDispatch } from "react-redux";


export default function ChannelProfile() {
    const { username } = useParams();
    const [details, setDetails] = useState("")
    const [loading, setLoading] = useState(false);
    const [videos, setVideos] = useState([])

    useEffect(()=>{
        fetchUserDatails(),
        fetchVideos()
    },[])

    const fetchUserDatails = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/users/c/${username}`, {}, { withCredentials: true });
            const channel = res.data.data
            setDetails(channel);

        } catch (error) {
            console.error("Fetching user details failed", error);
        } finally {
            setLoading(false);
        }

    };

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/videos`, 
                {
                    page: 1,
                    limit: 20,
                    userId: details._id
                },
                {withCredentials: true
            });
            const videoList = res.data.data.docs;
            setVideos(videoList);

        } catch (error) {
            console.error("Fetching videos failed", error);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div  style={{overflow:"scroll", scrollbarWidth: "none"}} className="dark:bg-gray-950">
        <div className="w-full h-screen max-w-5xl mx-auto pt-5 dark:bg-gray-900">
        {/* Cover Image */}
        <div className="w-full h-60 bg-gray-400 overflow-hidden rounded-xl text-center">
            {details.coverImage? <img
            src={details.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
            />:
            "Cover Image"}
        </div>

        {/* Profile Header */}
        <div className="flex items-center justify-between px-4 -mt-12">
            <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-blue-600 shadow-lg">
                <img
                src={details.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
                />
            </div>
            <div>
                <h2 className="text-2xl font-bold">{details.fullname}</h2>
                <p className="text-gray-500 dark:text-gray-200">@{details.username}</p>
                <p className="text-sm text-gray-600 dark:text-gray-200">{details.subscribersCount} subscribers</p>
            </div>
            </div>
            <SubscriptionButton
            isSubscribedInitial={details.isSubscribed}
            channelId={details._id}
            />
        </div>

        <div className="border-2 rounded-xl border-blue-600 mt-8"></div>

        {/* Video Section */}
        <div className="px-4 mt-10">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Videos</h3>
            <div style={{overflow:"scroll", scrollbarWidth: "none"}} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video) => (
                <div

                key={video.id}
                className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                >
                <img
                    onClick={()=>{handleClick(video)}}
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover cursor-pointer"
                />
                <div className="p-3">
                    <p className="text-base font-medium truncate dark:text-white">{video.title}</p>
                    <p className="text-base line-clamp-2 dark:text-gray-300">{video.description}</p>

                    <p className="text-sm text-gray-400">{video.views} views | {video.likes} likes</p>

                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
        </div>
    );
}
