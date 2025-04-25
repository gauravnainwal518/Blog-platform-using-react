import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { login, logout } from "./store/authSlice";
import { clearPosts, setPosts } from "./store/postSlice";
import { Footer, Header } from "./components";
import { Outlet } from "react-router-dom";
import service from "./appwrite/config";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Access dark mode from Redux store
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  // Log dark mode value when it changes
  useEffect(() => {
    // console.log("Is dark mode enabled?", isDarkMode);
  }, [isDarkMode]);

  const fetchPosts = async (userId) => {
    try {
      const userPosts = await service.getPostsByUser(userId);
      if (Array.isArray(userPosts)) {
        dispatch(setPosts(userPosts));
      } else {
        dispatch(clearPosts());
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      dispatch(clearPosts());
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await service.account.get();
        if (userData) {
          dispatch(login({ userData }));
          fetchPosts(userData.$id);
        } else {
          dispatch(logout());
          dispatch(clearPosts());
          console.log("Posts cleared!");
        }
      } catch (error) {
        console.error("Error during user data fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch]);

  return !loading ? (
    <div className={`app-container ${isDarkMode ? "dark" : "light"}`}>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : (
    <div className="loading">Loading...</div>
  );
}

export default App;
