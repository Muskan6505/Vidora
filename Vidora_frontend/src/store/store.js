import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import videoReducer from '../features/videoSlice';
import tweetReducer from '../features/tweetSlice';
import commentReducer from '../features/commentSlice';
import LikedReducers from '../features/likedSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        video: videoReducer,
        tweet: tweetReducer,
        comment: commentReducer,
        liked : LikedReducers,
    },
});