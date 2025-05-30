import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import CommentBox from "../components/CommentBox";
import { SubscriptionButton } from "../components";
import { addComment, removeComment } from "../features/commentSlice";
import { Eye, User2 } from "lucide-react"

const SingleVideo = () => {
    const { selectedVideo } = useSelector((state) => state.video);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [comments, setLocalComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [currentEditingId, setCurrentEditingId] = useState(null);

    const userId = user?.data?.user?._id;

    useEffect(() => {
        if (!selectedVideo) return;
        fetchComments();
        getSubscriber();
    }, [selectedVideo]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/api/v1/comments/${selectedVideo._id}`,
                { withCredentials: true }
            );
            setLocalComments(response.data.data.docs);
        } catch (error) {
            console.error("Fetching comments failed", error);
        } finally {
            setLoading(false);
        }
    };


    const getSubscriber = async () => {
        try {
            const response = await axios.get(
                `/api/v1/users/c/${selectedVideo.owner.username}`,
                { withCredentials: true }
            );
            
            setIsSubscribed(response.data.data.isSubscribed);
            setSubscribersCount(response.data.data.subscribersCount);
        } catch (error) {
            console.error("Getting subscribers failed", error);
        }
    };

    const getDaysAgo = (date) => {
        const postedDate = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now - postedDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 0 ? "Today" : `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    };

    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        try {
            if (currentEditingId) {
                // Update existing comment
                await axios.patch(
                    `/api/v1/comments/c/${currentEditingId}`,
                    { text: newComment },
                    { withCredentials: true }
                );

                setLocalComments((prev) =>
                    prev.map((comment) =>
                        comment._id === currentEditingId
                            ? { ...comment, content: newComment }
                            : comment
                    )
                );
                setCurrentEditingId(null);
            } else {
                // Post new comment
                const response = await axios.post(
                    `/api/v1/comments/${selectedVideo._id}`,
                    { text: newComment },
                    { withCredentials: true }
                );

                const createdComment = response.data.data;
                setLocalComments((prev) => [createdComment, ...prev]);
                dispatch(addComment(createdComment._id));
            }

            setNewComment("");
        } catch (err) {
            console.error("Comment post/update failed", err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`/api/v1/comments/c/${commentId}`, {
                withCredentials: true,
            });

            setLocalComments((prev) =>
                prev.filter((comment) => comment._id !== commentId)
            );
            dispatch(removeComment(commentId));
        } catch (err) {
            console.error("Failed to delete comment", err);
        }
    };

    const handleUpdateComment = (commentId, content) => {
        setCurrentEditingId(commentId);
        setNewComment(content);
    };

    // Sort user’s own comments on top
    const sortedComments = [...comments].sort((a, b) => {
        const aOwn = a.owner._id === userId;
        const bOwn = b.owner._id === userId;
        return aOwn === bOwn ? 0 : aOwn ? -1 : 1;
    });

    if (!selectedVideo) {
        return <div className="text-center text-white py-10">Loading...</div>;
    }


    return (
        <div className="min-h-screen bg-gray-950 text-white px-4 py-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Video Player Section */}
                <div className="md:col-span-2 space-y-6">
                    {/* Video Player */}
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
                        <video
                            src={selectedVideo.videoFile}
                            controls
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Title and Description */}
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h1>
                        <p className="text-gray-400 mb-3 text-sm">{selectedVideo.description}</p>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                            <Eye size={16} />
                            <span>
                                {selectedVideo.views} views • {getDaysAgo(selectedVideo.createdAt)}
                            </span>
                        </div>
                    </div>

                    {/* Channel Info and Subscribe */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-900">
                        <img
                            src={selectedVideo.owner.avatar}
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full object-cover border border-gray-700"
                        />
                        <div className="flex flex-col flex-grow">
                            <div className="flex items-center gap-2">
                                <User2 size={16} className="text-gray-400" />
                                <p className="text-white font-medium text-sm">@{selectedVideo.owner.username}</p>
                            </div>
                            <p className="text-xs text-gray-400">{subscribersCount} subscribers</p>
                        </div>
                        <SubscriptionButton
                            isSubscribedInitial={isSubscribed}
                            channelId={selectedVideo.owner._id}
                        />
                    </div>
                </div>

                {/* Comment Section */}
                <div className="bg-gray-900 rounded-xl p-4 shadow-lg h-full">
                    <h2 className="text-xl font-semibold mb-4">Comments</h2>

                    {/* New / Edit Comment Input */}
                    <div className="mb-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            rows="3"
                        />
                        <button
                            onClick={handlePostComment}
                            className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white text-sm"
                        >
                            {currentEditingId ? "Update Comment" : "Post Comment"}
                        </button>
                        {currentEditingId && (
                            <button
                                onClick={() => {
                                    setCurrentEditingId(null);
                                    setNewComment("");
                                }}
                                className="ml-2 mt-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white text-sm"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    {/* Render Comments */}
                    <div className="space-y-4">
                        {sortedComments.map((comment) => (
                            <CommentBox
                                key={comment._id}
                                comment={comment}
                                isOwner={comment.owner._id === userId}
                                onDelete={() => handleDeleteComment(comment._id)}
                                onUpdate={() => handleUpdateComment(comment._id, comment.content)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleVideo;
