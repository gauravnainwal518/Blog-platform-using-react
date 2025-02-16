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
  const isAuthor = post && userData ? post.userId === userData.$id : false;

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

  const deletePost = () => {
    appwriteService
      .deletePost(post.$id)
      .then((status) => {
        if (status) {
          appwriteService.deleteFile(post.featuredImage);
          navigate("/");
        }
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

  if (isLoading)
    return <div className="text-center text-gray-600">Loading...</div>;
  if (!post)
    return <div className="text-center text-gray-600">Post not found</div>;

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen py-10">
      <Container>
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
          {post.featuredImage && (
            <div className="flex justify-center mb-4">
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="w-64 h-30 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {isAuthor && (
            <div className="flex justify-end gap-3 mb-4">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-blue-500 hover:bg-blue-600 text-white">
                  Edit
                </Button>
              </Link>
              <Button
                bgColor="bg-red-500 hover:bg-red-600 text-white"
                onClick={deletePost}
              >
                Delete
              </Button>
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>
          <div className="text-gray-600 leading-relaxed">
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
