import axios from 'axios';

export const toggleVideoLike = async (videoId) => {
    try {
        const response = await axios.post(`/likes/toggle/v/${videoId}`,
            {withCredentials: true}
        )

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const toggleCommentLike = async (commentId) => {
    try {
        const response = await axios.post(`/likes/toggle/c/${commentId}`,
            {withCredentials: true}
        )

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const toggleTweetLike = async (tweetId) => {
    try {
        const response = await axios.post(`/likes/toggle/t/${tweetId}`,
            {withCredentials: true}
        )

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const getLikedVideos = async () => {
    try {
        const response = await axios.post('/likes/videos',
            {withCredentials: true}
        )

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}