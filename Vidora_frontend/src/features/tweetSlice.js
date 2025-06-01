import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tweets: [],
    isLoading: false,
}

const tweetSlice = createSlice({
    name: "tweet",
    initialState,
    reducers: {
        setTweets: (state, action) => {
            state.tweets = action.payload;
        },
        addTweet: (state, action) => {
            state.tweets.push(action.payload);
        },
        removeTweet: (state, action) => {
            state.tweets = state.tweets.filter(tweet => tweet.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
});

export const { setTweets, addTweet, removeTweet, setLoading } = tweetSlice.actions;
export default tweetSlice.reducer;