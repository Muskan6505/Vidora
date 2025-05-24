import axios from "axios";

// Create a new tweet
export const createTweet = async (content) => {
    try {
        const response = await axios.post(
            "/tweets",
            { content },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get tweets of a specific user
export const getUserTweets = async (userId) => {
    try {
        const response = await axios.get(`/tweets/user/${userId}`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Update a tweet
export const updateTweet = async (tweetId, content) => {
    try {
        const response = await axios.patch(
            `/tweets/${tweetId}`,
            { content },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Delete a tweet
export const deleteTweet = async (tweetId) => {
    try {
        const response = await axios.delete(`/tweets/${tweetId}`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
