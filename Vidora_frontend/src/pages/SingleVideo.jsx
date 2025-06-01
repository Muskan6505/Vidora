import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import CommentBox from "../components/CommentBox";
import { LikeButton, SubscriptionButton } from "../components";
import { addComment, removeComment } from "../features/commentSlice";
import { Eye, User2 } from "lucide-react"
import { useNavigate } from "react-router-dom";

const SingleVideo = () => {
    const { selectedVideo } = useSelector((state) => state.video);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [comments, setLocalComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [currentEditingId, setCurrentEditingId] = useState(null);

    const userId = user?.data?.user?._id;

    const [showPlaylists, setShowPlaylists] = useState(false);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [userPlaylists, setUserPlaylists] = useState([])

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

    const handleAddToPlaylist = async() => {
        try {
            const { data } = await axios.get(`/api/v1/playlist/user/${userId}`);
            setUserPlaylists(data.data);
        } catch (err) {
            console.error(err);
        }
        setShowPlaylists(true);
    }

    const videoId = selectedVideo._id
    const handleSelectPlaylist = async(playlistId) => {
        setSelectedPlaylistId(playlistId);
        setShowPlaylists(false);

        try {
            const res = await axios.patch(`/api/v1/playlist/add/${videoId}/${playlistId}`, 
                {}, 
                {withCredentials:true}
            )
            console.log(res)
        } catch (error) {
            console.error("Video couldn't added!", error);
        }
    }

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
        <div className="min-h-screen dark:bg-gray-950 bg-gray-50 text-white px-4 py-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Video Player Section */}
                    <div className="md:col-span-2 space-y-6">
                    {/* Video Player */}
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
                        <video
                            src={selectedVideo.videoFile}
                            controls
                            className="w-full h-full object-contain border border-blue-500"
                        />
                    </div>

                    {/* Title and Description */}
                    <div>
                        <h1 className="text-2xl font-bold dark:text-white text-black mb-2">{selectedVideo.title}</h1>
                        <p className="dark:text-gray-400 text-gray-700 mb-3 text-sm">{selectedVideo.description}</p>
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500 gap-2">
                                <Eye size={16} />
                                <span>
                                    {selectedVideo.views} views • {getDaysAgo(selectedVideo.createdAt)}
                                </span>
                            </div>
                            <div className="flex gap-3 items-center">
                                <LikeButton videoId={selectedVideo._id} likes={selectedVideo.likes} />
                                <button
                                    onClick={handleAddToPlaylist}
                                    className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-white text-sm"
                                >
                                    Add to playlist
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Channel Info and Subscribe */}
                    <div className="flex items-center gap-4 p-3 rounded-lg dark:bg-gray-900 bg-gray-200">
                        <img
                            onClick={()=>{navigate(`/channel/${selectedVideo.owner.username}`)}}
                            src={selectedVideo.owner.avatar}
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full object-cover border border-gray-700"
                        />
                        <div className="flex flex-col flex-grow">
                            <div className="flex items-center gap-2">
                                <User2 size={16} className="dark:text-gray-400 text-gray-700" />
                                <p className="dark:text-white text-gray-800 font-medium text-sm">@{selectedVideo.owner.username}</p>
                            </div>
                            <p className="text-xs dark:text-gray-400 text-gray-500">{subscribersCount} subscribers</p>
                        </div>
                        <SubscriptionButton
                            isSubscribedInitial={isSubscribed}
                            channelId={selectedVideo.owner._id}
                        />
                    </div>

                    {/* Playlist Dropdown Modal */}
                    {showPlaylists && (
                        <div className="fixed inset-0   bg-opacity-60 z-50 flex justify-center items-center">
                            <div className="dark:bg-white bg-gray-100 rounded-lg w-80 max-h-96 overflow-y-auto p-4 shadow-xl">
                                <h3 className="text-lg font-semibold mb-4 text-blue-900">Select Playlist</h3>
                                <ul className="space-y-2">
                                    {userPlaylists.map((playlist) => (
                                        <li
                                            key={playlist._id}
                                            className="cursor-pointer hover:bg-gray-400 p-2 rounded text-black"
                                            onClick={() => handleSelectPlaylist(playlist._id)}
                                        >
                                            {playlist.name}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => setShowPlaylists(false)}
                                    className="mt-4 w-full text-sm text-gray-500 hover:text-gray-800 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Comment Section */}
                <div className="dark:bg-gray-900 bg-gray-200 rounded-xl p-4 shadow-lg h-full">
                    <h2 className="text-xl font-semibold mb-4 dark:text-blue-400 text-blue-900">Comments</h2>

                    {/* New / Edit Comment Input */}
                    <div className="mb-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full px-3 py-2 rounded-lg dark:bg-gray-800 bg-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 border border-gray-700 dark:text-white text-black focus:outline-none focus:ring-2 focus:ring-blue-600"
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
