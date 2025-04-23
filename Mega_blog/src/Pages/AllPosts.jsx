import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import Button from "../components/Button";
import parse from "html-react-parser";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (userData?.$id) {
          const fetchedPosts = await appwriteService.getPostsByUser(
            userData.$id
          );
          setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userData]);

  return (
    <div
      className={`w-full min-h-screen py-10  ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h1
        className={`text-4xl font-bold text-center mb-10 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Your Posts
      </h1>

      {loading ? (
        <div
          className={`text-center text-lg ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          } animate-pulse`}
        >
          Loading posts...
        </div>
      ) : posts.length === 0 ? (
        <div
          className={`text-center ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          } text-xl`}
        >
          You haven't written any posts yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8">
          {posts.map((post) => (
            <div
              key={post.$id}
              className={`${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-800 border-gray-200"
              } border rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex flex-col justify-between`}
            >
              <div className="p-5">
                <h2
                  className={`text-xl font-semibold mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {post.title}
                </h2>
                <div
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } line-clamp-3`}
                >
                  {parse(post.content || "")}
                </div>
              </div>

              <div className="px-5 pb-5 mt-auto">
                <Link to={`/post/${post.slug}`}>
                  <Button
                    bgColor={`${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white w-full`}
                  >
                    Read More
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPosts;
