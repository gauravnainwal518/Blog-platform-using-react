import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: false,  // Default to light mode
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.isDarkMode = !state.isDarkMode; // Toggle between dark and light mode
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
