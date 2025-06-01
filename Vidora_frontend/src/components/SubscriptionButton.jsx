import React, { useEffect, useState } from "react";
import axios from "axios";

const SubscriptionButton = ({ isSubscribedInitial, channelId }) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        setIsSubscribed(() => isSubscribedInitial)
    },[isSubscribedInitial])

    const handleToggleSubscribe = async () => {
        setLoading(true);
        try {
        if (isSubscribed) {
            await axios.post(
            `/api/v1/subscriptions/u/${channelId}`,
            {},
            { withCredentials: true }
            );
            setIsSubscribed(false);
        } else {
            await axios.post(
            `/api/v1/subscriptions/u/${channelId}`,
            {},
            { withCredentials: true }
            );
            setIsSubscribed(true);
        }
        } catch (error) {
        console.error("Subscription error:", error);
        } finally {
        setLoading(false);
        }
    };

    return (
        <button
        onClick={handleToggleSubscribe}
        disabled={loading}
        className={`px-4 py-2 rounded-full font-semibold transition duration-200
            ${isSubscribed ? "dark:bg-gray-300 gray-400 text-black hover:bg-gray-400" : "bg-red-600 text-white hover:bg-red-700"}
            ${loading ? "opacity-70 cursor-not-allowed" : ""}
        `}
        >
        {loading ? "Processing..." : isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
    );
};

export default SubscriptionButton;