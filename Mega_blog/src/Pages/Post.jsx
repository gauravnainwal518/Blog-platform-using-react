import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import CommentSection from "../components/commentSection";
import dayjs from "dayjs";

export default function Post() {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const isAuthor =
    post && userData && String(post.userId) === String(userData.$id);

  const deletePost = () => {
    if (!post) return;
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        if (post.featuredImage) {
          appwriteService.deleteFile(post.featuredImage).catch(console.error);
        }
        navigate("/");
        window.location.reload();
      }
    });
  };

  const handleLike = () => {
    appwriteService
      .likePost(post.$id, userData.$id)
      .then((updatedPost) => {
        setLikes(updatedPost.likedBy.length);
        setUserHasLiked(updatedPost.likedBy.includes(userData.$id));
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (slug) {
      appwriteService
        .getPost(slug)
        .then((fetchedPost) => {
          if (fetchedPost) {
            setPost(fetchedPost);
            setLikes(fetchedPost.likedBy.length || 0);
            setUserHasLiked(fetchedPost.likedBy.includes(userData.$id));
          } else {
            navigate("/");
          }
        })
        .catch(() => navigate("/"))
        .finally(() => setIsLoading(false));
    } else {
      navigate("/");
    }
  }, [slug, navigate, userData]);

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-lg font-medium animate-pulse ${
          isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-600"
        }`}
      >
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-lg font-medium ${
          isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-600"
        }`}
      >
        Post not found.
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-10 px-4 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className={`max-w-4xl mx-auto p-6 md:p-10 rounded-2xl shadow-2xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } transition-all duration-300`}
      >
        {post.featuredImage && (
          <div className="w-full mb-8 overflow-hidden rounded-xl">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="w-full h-auto max-h-[400px] object-cover"
            />
          </div>
        )}

        {/* Author Controls */}
        {isAuthor && (
          <div className="flex justify-end gap-3 mb-6">
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
        <p className="text-sm text-gray-400 mb-6">
          Published by{" "}
          <span
            className={`font-medium ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {post.author}
          </span>{" "}
          on {dayjs(post.createdAt).format("MMMM D, YYYY")}
        </p>

        {/* Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {typeof post.content === "string" ? (
            parse(post.content)
          ) : (
            <p>No content available.</p>
          )}
        </div>

        {/* Likes */}
        <div className="flex items-center gap-3 mt-8">
          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
              userHasLiked
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {userHasLiked ? "Unlike" : "Like"}
          </button>
          <span className="text-sm">
            {likes} {likes === 1 ? "Like" : "Likes"}
          </span>
        </div>

        {/* Comments */}
        <div className="mt-10 border-t pt-8">
          <CommentSection postId={post.$id} />
        </div>
      </div>
    </div>
  );
}
