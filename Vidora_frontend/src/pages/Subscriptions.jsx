import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { SubscriptionButton } from "../components";
import { Link } from "react-router-dom";

const Subscriptions = () => {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.user);
    const userId = user?.data?.user?._id;

    const fetchSubscribedChannels = async () => {
        setLoading(true);
        try {
        const res = await axios.get(`/api/v1/subscriptions/c/${userId}`, {
            withCredentials: true,
        });
        setChannels(res.data.data);
        } catch (error) {
        console.error("Fetching subscribed channels failed:", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchSubscribedChannels();
    }, [userId]);

    return (
        <div className="min-h-screen dark:bg-gray-950 bg-gray-50  p-6">
        <h2 className="text-3xl font-bold mb-6 text-center dark:text-blue-400 text-blue-800">Your Subscriptions</h2>

        {loading ? (
            <div className="flex justify-center items-center h-60">
            <p className="text-xl dark:text-gray-300 text-gray-900 animate-pulse">Loading...</p>
            </div>
        ) : channels.length === 0 ? (
            <div className="flex justify-center items-center h-60">
            <p className="text-xl dark:text-gray-400 text-gray-700">You haven’t subscribed to any channels yet.</p>
            </div>
        ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {channels.map((channel) => (
                <div
                key={channel._id}
                className="dark:bg-gray-900  bg-gray-200 rounded-xl shadow-md flex items-center p-4 gap-4 hover:scale-[1.01] transition-transform border border-gray-400"
                >
                <Link to={`/channel/${channel.channel.username}`}>
                    <img
                        src={channel.channel.avatar}
                        alt={channel.channel.username}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                </Link>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold dark:text-white text-black">{channel.channel.fullname}</h3>
                    <p className="text-sm dark:text-gray-400 text-gray-700">{channel.channel.username}</p>
                </div>
                <SubscriptionButton isSubscribedInitial={true} channelId={channel.channel._id} />
                </div>
            ))}
            </div>
        )}
        </div>
    );
};

export default Subscriptions;
