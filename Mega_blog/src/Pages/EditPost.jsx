import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { PostForm } from "../components";
import { useSelector } from "react-redux"; // To get the darkMode state

function EditPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get the darkMode state from Redux or context
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((fetchedPost) => {
        if (fetchedPost) {
          setPost(fetchedPost);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <p className="text-lg font-semibold">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <p className="text-lg font-semibold text-red-500">Post not found</p>
      </div>
    );
  }

  return (
    <div
      className={`py-8 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <PostForm post={post} />
    </div>
  );
}

export default EditPost;
