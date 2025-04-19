import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    allPosts: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.allPosts = action.payload;
    },
    clearPosts: (state) => {
      state.allPosts = [];
    },
    addPost: (state, action) => {
      state.allPosts.unshift(action.payload); // Adds new post to the beginning
    },
  },
});

export const { setPosts, clearPosts, addPost } = postSlice.actions;
export default postSlice.reducer;
