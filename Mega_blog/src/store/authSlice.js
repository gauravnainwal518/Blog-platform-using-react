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
        state.status = true; // Set authenticated status
        state.userData = action.payload.userData; // Store user data
      }
    },
    logout: (state) => {
      state.status = false; // Set authenticated status to false
      state.userData = null; // Clear user data
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
