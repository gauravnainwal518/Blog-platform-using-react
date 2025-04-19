import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false, // Authentication status
  userData: null, // Placeholder for user data
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      if (action.payload && action.payload.userData) {
        state.status = true;
        state.userData = action.payload.userData;
      } else {
        console.error("User data is required for login.");
      }
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
    clearAuthData: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

export const { login, logout, clearAuthData } = authSlice.actions;

export default authSlice.reducer;
