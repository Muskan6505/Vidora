import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, Loader2 } from "lucide-react";

const LikeButton = ({ videoId = "", commentId = "", tweetId = "", likes }) => {
    const [loading, setLoading] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);

    const toggleLike = async () => {
        if (loading) return;
        setLoading(true);

        try {
            let res;

            if (videoId) {
                res = await axios.post(`/api/v1/likes/toggle/v/${videoId}`, {}, { withCredentials: true });
                setLikeCount(res.data?.data?.updatedVideo?.likes || 0);
                setLiked(res.data?.data?.isLiked);
            } else if (commentId) {
                res = await axios.post(`/api/v1/likes/toggle/c/${commentId}`, {}, { withCredentials: true });
                setLikeCount(res.data?.data?.updatedComment?.likes || 0);
                setLiked(res.data?.data?.isLiked);
            } else if (tweetId) {
                res = await axios.post(`/api/v1/likes/toggle/t/${tweetId}`, {}, { withCredentials: true });
                setLikeCount(res.data?.data?.updatedTweet?.likes || 0);
                setLiked(res.data?.data?.isLiked);
            }
        } catch (err) {
            console.error("Like/unlike failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleLike}
            disabled={loading}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition 
                ${liked ? "bg-pink-600 text-white" : "dark:bg-gray-200 bg-gray-300 text-gray-900 hover:bg-gray-400"} 
                ${loading ? "opacity-70 cursor-not-allowed" : ""}
            `}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Heart className={`w-4 h-4 ${liked ? "fill-white" : "stroke-pink-600"}`} />
            )}
            <span>{likeCount}</span>
        </button>
    );
};

export default LikeButton;
