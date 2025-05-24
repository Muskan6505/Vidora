import axios from 'axios';

// Get current user
export const getCurrentUser = async () => {
    try {
        const response = await axios.get('/users/current-user', {
        withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update account details
export const updateAccountDetails = async (data) => {
    try {
        const response = await axios.patch('/users/update-account-details', data, {
        withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update avatar
export const updateAvatar = async (formData) => {
    try {
        const response = await axios.patch('/users/update-avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update cover image
export const updateCoverImage = async (formData) => {
    try {
        const response = await axios.patch('/users/update-coverimage', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Remove cover image
export const removeCoverImage = async () => {
    try {
        const response = await axios.patch('/users/remove-coverimage', null, {
        withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get user channel profile by username
export const getUserChannelProfile = async (username) => {
    try {
        const response = await axios.get(`/users/c/${username}`, {
        withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get watch history
export const getWatchHistory = async () => {
    try {
        const response = await axios.get('/users/history', {
        withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
