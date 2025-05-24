import axios from 'axios';

const config = {
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
};

export const getVideoComments = async(videoId, page = 1, limit = 10) => {
    try {
        const response = await axios.get(`/comments/${videoId}`, 
            {
                page,
                limit
            },
            config
        );

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const addComment = async(videoId, text) => {
    try {
        const response = await axios.post(`/comments/${videoId}`, 
            { text },
            config
        );

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateComment = async(commentId, text) => {
    try {
        const response = await axios.patch(`/comments/c/${commentId}`, 
            { text },
            config
        );

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteComment = async(commentId) => {
    try {
        const response = await axios.delete(`/comments/c/${commentId}`, config);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
