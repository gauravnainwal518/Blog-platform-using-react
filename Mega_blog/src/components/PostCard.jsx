import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux"; // Access Redux store state

function PostCard({ $id, title, featuredImage, createdAt }) {
  // Added createdAt prop
  const [imageUrl, setImageUrl] = useState("default-image.jpg");

  // Access theme state from Redux store
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    if (featuredImage) {
      // Fetch the file preview using the featuredImage ID
      const url = appwriteService.getFilePreview(featuredImage); // Get the file URL
      setImageUrl(url); // Update the image URL with the preview
    }
  }, [featuredImage]);

  // Format date and time
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const formattedTime = new Date(createdAt).toLocaleTimeString();

  return (
    <Link to={`/post/${$id}`}>
      <div
        className={`w-full border rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out ${
          isDarkMode
            ? "bg-gray-800 border-gray-600 text-white"
            : "bg-white border-gray-300 text-gray-800"
        }`}
      >
        <div className="w-full justify-center mb-4">
          <img
            src={imageUrl} // Use imageUrl state here
            alt={title}
            className="rounded-xl object-cover h-48 w-full"
          />
        </div>
        <h2
          className={`text-xl font-semibold text-center ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {title}
        </h2>
        <p className="text-sm text-gray-400 mt-2">
          {/* Format and display createdAt */}
          Published on: {formattedDate} at {formattedTime}
        </p>
      </div>
    </Link>
  );
}

export default PostCard;
