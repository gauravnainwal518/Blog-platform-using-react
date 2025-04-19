import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600 text-xl animate-pulse">
        Loading...
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-xl">
        Post not found
      </div>
    );

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-b from-gray-50 to-gray-200 py-10">
      <Container>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-300">
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
          <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none text-gray-700">
            {typeof post.content === "string" ? (
              parse(post.content)
            ) : (
              <p>No Content Available</p>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
