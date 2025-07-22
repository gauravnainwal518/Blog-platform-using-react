import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage, createdAt, author }) {
  const [imageUrl, setImageUrl] = useState("/default-image.jpg");

  useEffect(() => {
    if (featuredImage) {
      const url = appwriteService.getFilePreview(featuredImage);
      setImageUrl(url);
    }
  }, [featuredImage]);

  const formattedDate = new Date(createdAt).toLocaleDateString();
  const formattedTime = new Date(createdAt).toLocaleTimeString();

  // Strip HTML tags from title
  const parseHtmlToText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const cleanTitle = parseHtmlToText(title);

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full border border-gray-300 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-white text-gray-800">
        <div className="w-full justify-center mb-4">
          <img
            src={imageUrl}
            alt={cleanTitle}
            className="rounded-xl object-cover h-48 w-full"
          />
        </div>

        <h2 className="text-xl font-semibold text-center">{cleanTitle}</h2>

        <p className="text-sm text-gray-500 mt-2 text-center">
          Published on: {formattedDate} at {formattedTime}
        </p>

        {author && (
          <p className="text-sm text-gray-500 mt-1 text-center">
            Published by: <span className="font-medium">{author}</span>
          </p>
        )}
      </div>
    </Link>
  );
}

export default PostCard;
