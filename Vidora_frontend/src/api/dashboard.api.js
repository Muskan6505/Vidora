import axios from 'axios';

export const getChannelStats = async() => {
    try {
        const response = await axios.get('/dashboard/stats', {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export const getChannelVideos = async() => {
    try {
        const response = await axios.get('/dashboard/videos', {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}