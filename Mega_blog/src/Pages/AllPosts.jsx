import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import Button from "../components/Button";
import parse from "html-react-parser";
import dayjs from "dayjs";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const userData = useSelector((state) => state.auth.userData);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await appwriteService.getPosts();
        console.log("Fetched Posts:", fetchedPosts); // Log fetched posts to check the response

        // Ensure fetched posts are an array before setting state
        setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);
      } catch (error) {
        console.error("Error fetching posts:", error); // Log error if any occurs
        setPosts([]); // Set an empty array in case of an error
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filtering posts based on user data
  const filteredPosts =
    filter === "mine"
      ? posts.filter((post) => post.userId === userData?.$id)
      : posts;

  //console.log("Filtered Posts:", filteredPosts); // Log filtered posts to check filtering logic

  return (
    <div
      className={`w-full min-h-screen py-10 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h1
        className={`text-4xl font-bold text-center mb-10 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {filter === "mine" ? "Your Posts" : "All Posts"}
      </h1>

      {/* Filter Buttons */}
      <div className="text-center mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 mx-2 rounded-lg ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setFilter("mine")}
          className={`px-4 py-2 mx-2 rounded-lg ${
            filter === "mine" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          My Posts
        </button>
      </div>

      {loading ? (
        <div
          className={`text-center text-lg ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          } animate-pulse`}
        >
          Loading posts...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div
          className={`text-center ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          } text-xl`}
        >
          No posts found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8">
          {filteredPosts.map((post) => {
            console.log("Post Object:", post); // Log each post object to check the 'createdAt' and other fields
            console.log("Post Date:", post.createdAt); // Log the createdAt field to check its value

            return (
              <div
                key={post.$id}
                className={`${
                  isDarkMode
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-800 border-gray-200"
                } border rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex flex-col justify-between`}
              >
                <div className="p-5">
                  {/* Removed Author Information */}
                  <div className="mb-4">
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {/* Use createdAt for date */}
                      {post.createdAt
                        ? dayjs(post.createdAt).format("MMM D, YYYY") // Format the date correctly
                        : "Unknown Date"}
                    </span>
                  </div>

                  {/* Post Title */}
                  <h2
                    className={`text-xl font-semibold mb-3 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {post.title}
                  </h2>

                  {/* Post Content */}
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    } line-clamp-3`}
                  >
                    {parse(post.content || "")}
                  </div>
                </div>

                {/* Button to Read More */}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllPosts;
