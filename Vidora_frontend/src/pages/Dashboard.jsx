import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Navbar } from '../components';

export default function Dashboard() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const userDetail = user?.user?.data?.user;

    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState({});
    const [videos, setVideos] = useState([]);
    const [totalLikes, setTotalLikes] = useState(0);
    const [totalViews, setTotalViews] = useState(0);
    const [showVideos, setShowVideos] = useState(false);
    const [editingVideo, setEditingVideo] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', thumbnail: '' });

    const userId = userDetail?._id;

    const fetchUserDatails = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/users/c/${userDetail.username}`, {}, { withCredentials: true });
            setDetails(res.data.data);
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
                    userId: userId
                },
                {withCredentials: true
            });
            const videoList = res.data.data.docs;
            setVideos(videoList);

            const likes = videoList.reduce((sum, v) => sum + (v.likes || 0), 0);
            const views = videoList.reduce((sum, v) => sum + (v.views || 0), 0);
            setTotalLikes(likes);
            setTotalViews(views);
        } catch (error) {
            console.error("Fetching videos failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (videoId) => {
        try {
            await axios.delete(`/api/v1/videos/${videoId}`, { withCredentials: true });
            setVideos(videos.filter((v) => v._id !== videoId));
        } catch (error) {
            console.error("Failed to delete video", error);
        }
    };

    const handleEditClick = (video) => {
        setEditingVideo(video._id);
        setEditForm({
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail || ''
        });
    };

    const handleSave = async () => {
        try {
            await axios.put(
                `/api/v1/videos/${editingVideo}`,
                {
                    title: editForm.title,
                    description: editForm.description,
                    thumbnail: editForm.thumbnail
                },
                { withCredentials: true }
            );

            setVideos((prev) =>
                prev.map((v) =>
                    v._id === editingVideo
                        ? { ...v, ...editForm }
                        : v
                )
            );
            setEditingVideo(null);
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    useEffect(() => {
        fetchUserDatails();
        fetchVideos();
    }, []);

    return (
        <div style={{ overflow: 'scroll', scrollbarWidth: 'none' }} className='h-screen w-full bg-gray-950 overflow-y-scroll pt-5'>
            <div className="max-w-4xl mx-auto p-4 rounded-2xl shadow-md bg-gray-900">

                {/* Cover Image */}
                <div className="w-full h-48 bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center text-gray-300 text-lg">
                    {details?.coverImage ? (
                        <img src={details.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        "Cover Image Unavailable"
                    )}
                </div>

                {/* Avatar, Name, Username */}
                <div className="flex items-center mt-[-2rem] px-4">
                    <img
                        src={details.avatar}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                    />
                    <div className="ml-4">
                        <h1 className="text-xl font-semibold text-white">{details.fullname}</h1>
                        <p className="text-gray-400">@{details.username}</p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 text-center mt-6">
                    <div>
                        <p className="text-lg font-bold text-white">{details.subscribersCount || 0}</p>
                        <p className="text-gray-400">Subscribers</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-white">{totalViews}</p>
                        <p className="text-gray-400">Total Views</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-white">{totalLikes}</p>
                        <p className="text-gray-400">Total Likes</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex justify-around">
                    <button
                        className="px-4 py-2 border border-gray-300 text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                        onClick={() => setShowVideos(!showVideos)}
                    >
                        {showVideos ? "Hide Videos" : "Your Videos"}
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        onClick={() => navigate("/post-video")}
                    >
                        Post Video
                    </button>
                </div>

                {/* Video List */}
                {showVideos && (
                    <div className="mt-6 grid gap-4">
                        {videos.length === 0 ? (
                            <p className="text-center text-gray-500">No videos uploaded yet.</p>
                        ) : (
                            videos.map((video) => (
                                <div
                                    key={video._id}
                                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-800 text-white"
                                >
                                    {editingVideo === video._id ? (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                className="w-full p-2 rounded bg-gray-700 text-white"
                                                value={editForm.title}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, title: e.target.value })
                                                }
                                                placeholder="Title"
                                            />
                                            <textarea
                                                className="w-full p-2 rounded bg-gray-700 text-white"
                                                value={editForm.description}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, description: e.target.value })
                                                }
                                                placeholder="Description"
                                            />
                                            <input
                                                type="text"
                                                className="w-full p-2 rounded bg-gray-700 text-white"
                                                value={editForm.thumbnail}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, thumbnail: e.target.value })
                                                }
                                                placeholder="Thumbnail URL"
                                            />
                                            {editForm.thumbnail && (
                                                <img
                                                    src={editForm.thumbnail}
                                                    alt="Thumbnail Preview"
                                                    className="w-full h-32 object-cover rounded mt-2"
                                                />
                                            )}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSave}
                                                    className="px-3 py-1 bg-green-500 text-black rounded hover:bg-green-600"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingVideo(null)}
                                                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-gray-900 p-4 rounded-lg shadow-2xl text-white">
                                            {/* Thumbnail */}
                                            {video.thumbnail && (
                                                <img
                                                    src={video.thumbnail}
                                                    alt="Thumbnail"
                                                    className="w-32 h-20 md:w-48 md:h-28 object-cover rounded-md"
                                                />
                                            )}

                                            {/* Title, Description, Stats */}
                                            <div className="flex flex-col flex-1 justify-center">
                                                <h3 className="text-lg font-semibold">{video.title}</h3>
                                                <p className="text-sm text-gray-300">{video.description}</p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Views: {video.views} | Likes: {video.likes}
                                                </p>
                                            </div>

                                            {/* Edit/Delete Buttons */}
                                            <div className="flex flex-row md:flex-col gap-2 justify-center">
                                                <button
                                                    onClick={() => handleEditClick(video)}
                                                    className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(video._id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}