import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage if available
const savedAuthState = JSON.parse(localStorage.getItem("authState"));

const initialState = savedAuthState || {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      if (action.payload && action.payload.userData) {
        state.status = true;
        state.userData = action.payload.userData;
        localStorage.setItem("authState", JSON.stringify(state));  // Save to localStorage
      } else {
        console.error("User data is required for login.");
      }
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      localStorage.removeItem("authState");  // Clear from localStorage
    },
    clearAuthData: (state) => {
      state.status = false;
      state.userData = null;
      localStorage.removeItem("authState");  // Clear from localStorage
    },
  },
});

export const { login, logout, clearAuthData } = authSlice.actions;

export default authSlice.reducer;
