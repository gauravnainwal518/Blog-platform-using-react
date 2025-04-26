import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import CommentSection from "../components/commentSection";

export default function Post() {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const isAuthor =
    post && userData ? String(post.userId) === String(userData.$id) : false;

  const deletePost = () => {
    if (post) {
      appwriteService
        .deletePost(post.$id)
        .then((status) => {
          if (status) {
            if (post.featuredImage) {
              appwriteService
                .deleteFile(post.featuredImage)
                .catch((error) =>
                  console.error("Error deleting image:", error)
                );
            }
            navigate("/");
            window.location.reload();
          }
        })
        .catch((error) => console.error("Error deleting post:", error));
    }
  };

  useEffect(() => {
    if (slug) {
      appwriteService
        .getPost(slug)
        .then((fetchedPost) => {
          if (fetchedPost) {
            setPost(fetchedPost);
          } else {
            navigate("/");
          }
        })
        .catch(() => navigate("/"))
        .finally(() => setIsLoading(false));
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  if (isLoading)
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-xl animate-pulse ${
          isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
        }`}
      >
        Loading...
      </div>
    );

  if (!post)
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-xl ${
          isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
        }`}
      >
        Post not found
      </div>
    );

  return (
    <div
      className={`min-h-screen mt-0 py-10 ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-gray-50 to-gray-200"
      }`}
    >
      <div
        className={`max-w-4xl mx-auto rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-300 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {post.featuredImage && (
          <div className="w-full mb-8 flex justify-center">
            <div className="w-full max-w-2xl overflow-hidden rounded-xl shadow-md">
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="w-full h-auto max-h-[350px] object-cover object-center"
              />
            </div>
          </div>
        )}

        {/* Author-only buttons */}
        {isAuthor && (
          <div className="flex justify-end gap-4 mb-6">
            <Link to={`/edit-post/${post.slug}`}>
              <Button bgColor="bg-blue-600 hover:bg-blue-700 text-white">
                Edit
              </Button>
            </Link>
            <Button
              bgColor="bg-red-600 hover:bg-red-700 text-white"
              onClick={deletePost}
            >
              Delete
            </Button>
          </div>
        )}

        {/* Post Title */}
        <h1
          className={`text-4xl font-bold mb-6 leading-tight ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {post.title}
        </h1>

        {/* Post Content */}
        <div
          className={`prose prose-lg max-w-none ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {typeof post.content === "string" ? (
            parse(post.content)
          ) : (
            <p>No Content Available</p>
          )}
        </div>

        {/* Comment Section */}
        <div className="mt-8">
          <CommentSection postId={post.$id} />
        </div>
      </div>
    </div>
  );
}
