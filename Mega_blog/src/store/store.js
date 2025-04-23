import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import postSlice from './postSlice';
import themeReducer from './themeSlice'; 

const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postSlice,
    theme: themeReducer, 
  },
});

export default store;
