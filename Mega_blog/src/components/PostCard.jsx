import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
  const [imageUrl, setImageUrl] = useState("default-image.jpg");

  useEffect(() => {
    if (featuredImage) {
      // Fetch the file preview using the featuredImage ID
      const url = appwriteService.getFilePreview(featuredImage); // Get the file URL
      setImageUrl(url); // Update the image URL with the preview
    }
  }, [featuredImage]);

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-white border border-gray-300 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
        <div className="w-full justify-center mb-4">
          <img
            src={imageUrl} // Use imageUrl state here
            alt={title}
            className="rounded-xl object-cover h-48 w-full"
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          {title}
        </h2>
      </div>
    </Link>
  );
}

export default PostCard;
