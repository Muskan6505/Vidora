import React from "react";
import LikeButton from "./LikeButton";
import { Trash2, Pencil, User2, Clock } from "lucide-react";

const getDaysAgo = (date) => {
    const postedDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "Today" : `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const TweetCard = ({ tweet, isOwner = false, onDelete, onUpdate }) => {
    return (
        <div className="border-b border-gray-800 pb-4 mb-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 dark:text-white text-black">
                    {tweet.owner?.avatar ? (
                        <img
                            src={tweet.owner.avatar}
                            alt="User Avatar"
                            className="h-4 w-4 rounded-full object-cover"
                        />
                    ) : (
                        <User2 size={16} className="dark:text-gray-400 text-gray-700" />
                    )}
                    <span className="text-sm font-medium">
                        @{isOwner ? "You" : tweet.owner?.username || "Unknown"}
                    </span>
                </div>

                {isOwner && (
                    <div className="flex gap-2">
                        <button
                            onClick={onUpdate}
                            className="text-blue-400 hover:text-blue-500"
                            title="Edit"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="text-red-500 hover:text-red-600"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            <p className="dark:text-gray-300 text-gray-800 text-sm mt-1">{tweet.content}</p>

            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-1">
                    <Clock size={14} className="text-gray-500" />
                    <span>{getDaysAgo(tweet.createdAt)}</span>
                </div>
                <LikeButton tweetId={tweet._id} likes={tweet.likes} />
            </div>
        </div>
    );
};

export default TweetCard;