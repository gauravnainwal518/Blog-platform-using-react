import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import parse from "html-react-parser";
import dayjs from "dayjs";

import { setPosts } from "../store/postSlice";
import appwriteService from "../appwrite/config";

const AllPosts = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const posts = useSelector((state) => state.posts.allPosts);
  const userData = useSelector((state) => state.auth.userData);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    appwriteService.getAllPosts().then((res) => {
      if (res && res.documents) {
        dispatch(setPosts(res.documents));
      }
      setLoading(false);
    });
  }, [dispatch]);

  const filteredPosts =
    filter === "mine"
      ? posts.filter((post) => post.userId === userData?.$id)
      : posts;

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
        <div className="text-center text-lg animate-pulse">
          Loading posts...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center text-xl">No posts found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8">
          {filteredPosts.map((post) => (
            <div
              key={post.$id}
              className={`border rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex flex-col justify-between ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-800 border-gray-200"
              }`}
            >
              <div className="p-5">
                <div className="mb-4 text-sm">
                  {post.createdAt
                    ? dayjs(post.createdAt).format("MMM D, YYYY")
                    : "Unknown Date"}
                </div>
                <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                <div className="text-sm line-clamp-3">
                  {parse(post.content || "")}
                </div>
              </div>
              <div className="px-5 pb-5 mt-auto">
                <Link to={`/post/${post.slug}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
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
