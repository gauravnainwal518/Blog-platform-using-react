import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { PostForm } from "../components";

function EditPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center items-center min-h-screen bg-white text-gray-800">
        <p className="text-lg font-semibold">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white text-gray-800">
        <p className="text-lg font-semibold text-red-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="py-8 bg-white text-gray-800">
      <PostForm post={post} />
    </div>
  );
}

export default EditPost;
