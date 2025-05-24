import axios from 'axios';

// Toggle subscription (subscribe/unsubscribe to a channel)
export const toggleSubscription = async (channelId) => {
    try {
        const response = await axios.post(
            `/subscriptions/c/${channelId}`,
            {}, 
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Get subscribers of a channel
export const getUserChannelSubscribers = async (channelId) => {
    try {
        const response = await axios.get(`/subscriptions/u/${channelId}`, {
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

// Get channels a user has subscribed to
export const getSubscribedChannels = async (subscriberId) => {
    try {
        const response = await axios.get(`/subscriptions/c/${subscriberId}`, {
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
