import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    comments: [],
    isLoading: false,
};

const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        setComments: (state, action) => {
            state.comments = action.payload;
        },
        addComment: (state, action) => {
            state.comments.push(action.payload);
        },
        removeComment: (state, action) => {
            state.comments = state.comments.filter(comment => comment.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
});

export const { setComments, addComment, removeComment, setLoading } = commentSlice.actions;
export default commentSlice.reducer;