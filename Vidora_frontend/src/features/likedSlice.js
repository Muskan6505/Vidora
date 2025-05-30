import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    likedVideos : [],
}

const likedSlice = createSlice({
    name: "liked",
    initialState,
    reducers: {
        setVideos: (state, action) => {
            state.likedVideos = action.payload;
        },
        addVideo: (state, action) => {
            state.likedVideos.push(action.payload);
        },
        removeVideo: (state, action) => {
            state.likedVideos = state.likedVideos.filter(likedVideo => likedVideo.video._id !== action.payload);
        },
    }
})

export const {setVideos, addVideo, removeVideo} = likedSlice.actions
export default likedSlice.reducer