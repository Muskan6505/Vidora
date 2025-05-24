import axios from 'axios';

// Get all playlists of a user
export const getUserPlaylists = async (userId) => {
    try {
        const response = await axios.get(`/playlist/user/${userId}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Create a new playlist
export const createPlaylist = async (data) => {
    try {
        const response = await axios.post('/playlist', data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get a playlist by ID
export const getPlaylistById = async (playlistId) => {
    try {
        const response = await axios.get(`/playlist/${playlistId}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update a playlist
export const updatePlaylist = async (playlistId, data) => {
    try {
        const response = await axios.patch(`/playlist/${playlistId}`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Delete a playlist
export const deletePlaylist = async (playlistId) => {
    try {
        const response = await axios.delete(`/playlist/${playlistId}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Add a video to a playlist
export const addVideoToPlaylist = async (videoId, playlistId) => {
    try {
        const response = await axios.patch(`/playlist/add/${videoId}/${playlistId}`, {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Remove a video from a playlist
export const removeVideoFromPlaylist = async (videoId, playlistId) => {
    try {
        const response = await axios.patch(`/playlist/remove/${videoId}/${playlistId}`, {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
