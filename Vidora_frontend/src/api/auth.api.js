import axios from 'axios'; 
// Register new user with avatar and coverImage
export const registerUser = async (formData) => {
    try {
        const response = await axios.post('/users/register', formData, {
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

// Login user
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post('/users/login', credentials, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Logout user
export const logoutUser = async () => {
    try {
        const response = await axios.post('/users/logout', null, {
            withCredentials: true
            
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Refresh access token
export const refreshToken = async () => {
    try {
        const response = await axios.post('/users/refresh-token', null, {
        withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Change password
export const changePassword = async (data) => {
    try {
        const response = await axios.patch('/users/change-password', data, {
        withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
