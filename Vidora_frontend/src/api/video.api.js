import axios from 'axios';

// Get all videos (with pagination, search, sorting, user filter)
export const getAllVideos = async (params) => {
    try {
        const response = await axios.get('/videos/', {
            params,
            headers: {
                credentials: true,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get video by ID
export const getVideoById = async (videoId) => {
    try {
        const response = await axios.get(`/videos/${videoId}`, {
            headers: {
                credentials: true,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Publish a new video
export const publishAVideo = async (formData) => {
    try {
        const response = await axios.post('/videos/', formData, {
            headers: {
                credentials: true,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update video (title, description, optional new thumbnail)
export const updateVideo = async (videoId, formData) => {
    try {
        const response = await axios.patch(`/videos/${videoId}`, formData, {
            headers: {
                credentials: true,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete video
export const deleteVideo = async (videoId) => {
    try {
        const response = await axios.delete(`/videos/${videoId}`, {
            headers: {
                credentials: true,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Toggle publish status
export const togglePublishStatus = async (videoId) => {
    try {
        const response = await axios.patch(`/videos/toggle/publish/${videoId}`, {}, {
            headers: {
                credentials: true,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
