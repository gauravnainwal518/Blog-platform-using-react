import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import { login, logout } from "./store/authSlice";
import { clearPosts, setPosts } from "./store/postSlice"; // Import Redux actions
import { Footer, Header } from "./components";
import { Outlet } from "react-router-dom";
import service from "./appwrite/config"; // Import the Service from config.js

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchPosts = async (userId) => {
    try {
      const userPosts = await service.getPostsByUser(userId);

      // If posts are returned successfully (even empty), set them
      if (Array.isArray(userPosts)) {
        dispatch(setPosts(userPosts));
      } else {
        // In case of any unexpected result, clear posts
        dispatch(clearPosts());
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      dispatch(clearPosts()); // Make sure to clear old posts on error
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await service.account.get(); // Access the account correctly using `service.account`
        if (userData) {
          dispatch(login({ userData }));
          fetchPosts(userData.$id); // Fetch posts if the user is logged in
        } else {
          dispatch(logout());
          dispatch(clearPosts()); // Clear posts when no user is logged in
          console.log("Posts cleared!");
        }
      } catch (error) {
        console.error("Error during user data fetch:", error); // Handle the error
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchUserData(); // Call the function to fetch user data
  }, [dispatch]);

  return !loading ? (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : (
    <div className="loading">Loading...</div> // Show a loading state while the user data is being fetched
  );
}

export default App;
