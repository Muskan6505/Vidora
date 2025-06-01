import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {selectVideo} from "../features/videoSlice"

export default function Playlists() {
    const [playlists, setPlaylists] = useState([]);
    const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);
    const [videos, setVideos] = useState([]);
    const [editData, setEditData] = useState({ name: "", description: "", id: null });
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" });

    const user = useSelector((state) => state.user);
    const userId = user?.user?.data?.user?._id;
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const fetchPlaylists = async () => {
        try {
            const { data } = await axios.get(`/api/v1/playlist/user/${userId}`);
            setPlaylists(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPlaylistVideos = async (playlistId) => {
        try {
            const { data } = await axios.get(
                `/api/v1/playlist/${playlistId}`, 
                {}, 
                {withCredentials:true}
            );
            setVideos(data.data.videos || []);
            setExpandedPlaylistId(playlistId);
        } catch (err) {
            console.error(err);
        }
    };

    const removeVideo = async (videoId, playlistId) => {
        try {
            await axios.patch(`/api/v1/playlist/remove/${videoId}/${playlistId}`);
            fetchPlaylistVideos(playlistId);
        } catch (err) {
            console.error(err);
        }
    };

    const openEditModal = (playlist) => {
        setEditData({ name: playlist.name, description: playlist.description, id: playlist._id });
        setShowEditModal(true);
    };

    const updatePlaylist = async () => {
        try {
            await axios.patch(`/api/v1/playlist/${editData.id}`, {
                name: editData.name,
                description: editData.description,
            });
            setShowEditModal(false);
            fetchPlaylists();
        } catch (err) {
            console.error(err);
        }
    };

    const createPlaylist = async () => {
        try {
            await axios.post(`/api/v1/playlist`, {
                name: newPlaylist.name,
                description: newPlaylist.description,
                user: userId,
            });
            setShowCreateModal(false);
            setNewPlaylist({ name: "", description: "" });
            fetchPlaylists();
        } catch (err) {
            console.error(err);
        }
    };

    const deletePlaylist = async (playlistId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this playlist?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/api/v1/playlist/${playlistId}`);
            fetchPlaylists();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchPlaylists();
        }
    }, [userId]);


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

    if (!userId) {
        return <div className="text-center mt-10 text-red-500">User not logged in.</div>;
    }

    return (
        <div className="w-full mx-auto p-4 space-y-6 dark:bg-gray-950 bg-gray-50 min-h-screen pt-5">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-blue-400 text-blue-900">Your Playlists</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Create Playlist
                </button>
            </div>
            <div className="w-full border-b border-blue-600 mb-4"></div>

            {playlists.length === 0 ? (
                <div className="flex items-center justify-center h-60">
                    <h1 className="text-2xl font-bold dark:text-gray-200">No playlists yet</h1>
                </div>
            ) : (
                playlists.map((playlist) => (
                    <div key={playlist._id} className="border rounded-xl p-4 shadow dark:bg-gray-800 bg-gray-200 space-y-2 ">
                        <div className="flex justify-between items-start">
                            <div onClick={() => fetchPlaylistVideos(playlist._id)} className="cursor-pointer">
                                <h2 className="text-xl font-semibold dark:text-gray-100 text-gray-900">{playlist.name}</h2>
                                <p className="dark:text-gray-400 text-gray-700">{playlist.description}</p>
                            </div>
                            <div className="flex flex-col gap-1 text-sm">
                                <button
                                    onClick={() => openEditModal(playlist)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deletePlaylist(playlist._id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {expandedPlaylistId === playlist._id && (
                            <div className="mt-4 space-y-3">
                                {videos.length === 0 ? (
                                    <p className="text-sm dark:text-gray-500 text-gray-700">No videos in this playlist.</p>
                                ) : (
                                    videos.map((video) => (
                                        <div
                                            key={video._id}
                                            className="flex flex-row rounded-xl  overflow-hidden shadow-md hover:scale-[1.01] transition-transform cursor-pointer"
                                        >
                                            <img
                                                onClick={() => handleClick(video)}
                                                src={video.thumbnail || ""}
                                                alt={video.title}
                                                className="w-25 md:w-60 md:h-30 h-20 object-cover rounded-xl"
                                            />
                                            <div className="md:p-4 ml-2 flex flex-col justify-between w-full rounded-xl border-1 border-black dark:bg-gray-900 bg-gray-100">
                                                <div>
                                                    <h3 className="md:text-xl ml-1 text-[1rem] font-semibold dark:text-white">{video.title}</h3>
                                                    <p className="text-sm dark:text-gray-300 text-gray-800 ml-1 md:mt-1 line-clamp-2">{video.description}</p>
                                                </div>
                                                <div className="flex items-center md:gap-3 gap-1 md: mt-4 ">
                                                    <img
                                                        onClick={() =>{
                                                            navigate(`/channel/${video.owner.username}`)
                                                        }}
                                                        src={video?.owner?.avatar}
                                                        alt={video?.owner?.username}
                                                        className="md:w-6 md:h-6 ml-2 w-3 h-3 rounded-full"
                                                    />
                                                    <span className="dark:text-gray-400 text-gray-700 text-sm">@{video.owner?.username}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeVideo(video._id, playlist._id)}
                                                className="text-red-500 hover:text-red-700 ml-2 mr-1 cursor-pointer"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* Edit Playlist Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
                        <h2 className="text-xl font-semibold">Edit Playlist</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <textarea
                            placeholder="Description"
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowEditModal(false)} className="text-gray-500">
                                Cancel
                            </button>
                            <button
                                onClick={updatePlaylist}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Playlist Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
                        <h2 className="text-xl font-semibold">Create Playlist</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newPlaylist.name}
                            onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <textarea
                            placeholder="Description"
                            value={newPlaylist.description}
                            onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-500">
                                Cancel
                            </button>
                            <button
                                onClick={createPlaylist}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
