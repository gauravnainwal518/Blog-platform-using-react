import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function PostCard({ $id, title, featuredImage, createdAt, author }) {
  const [imageUrl, setImageUrl] = useState("default-image.jpg");
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    if (featuredImage) {
      const url = appwriteService.getFilePreview(featuredImage);
      setImageUrl(url);
    }
  }, [featuredImage]);

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
            src={imageUrl}
            alt={title}
            className="rounded-xl object-cover h-48 w-full"
          />
        </div>
        <h2 className="text-xl font-semibold text-center">{title}</h2>

        <p className="text-sm text-gray-400 mt-2 text-center">
          Published on: {formattedDate} at {formattedTime}
        </p>

        {author && (
          <p className="text-sm text-gray-400 mt-1 text-center">
            Published by: <span className="font-medium">{author}</span>
          </p>
        )}
      </div>
    </Link>
  );
}

export default PostCard;
