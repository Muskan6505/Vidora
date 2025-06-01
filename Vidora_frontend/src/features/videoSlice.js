import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videos: [],
    selectedVideo: null,
    loading: false,
};

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setVideos: (state, action) => {
            state.videos = action.payload;
        },
        selectVideo: (state, action) => {
            state.selectedVideo = action.payload;
        },
        appendVideos: (state, action) => {
            const newVideos = action.payload;
            const existingIds = new Set(state.videos.map((v) => v._id));
            const filtered = newVideos.filter((v) => !existingIds.has(v._id));
            state.videos.push(...filtered);
        },

        clearSelectedVideo: (state) => {
            state.selectedVideo = null;
        },
        addVideo: (state, action) => {
            state.videos.push(action.payload);
        },
        deleteVideo: (state, action) => {
            state.videos = state.videos.filter(
                (video) => video._id !== action.payload
            );
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
});

export const {
    setVideos,
    selectVideo,
    clearSelectedVideo,
    addVideo,
    deleteVideo,
    setLoading,
    appendVideos
} = videoSlice.actions;

export default videoSlice.reducer;