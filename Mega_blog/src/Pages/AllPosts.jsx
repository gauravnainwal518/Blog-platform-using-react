import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import parse from "html-react-parser";
import dayjs from "dayjs";

import { setPosts } from "../store/postSlice";
import appwriteService from "../appwrite/config";

const LoaderCard = ({ isDarkMode }) => (
  <div
    className={`h-60 animate-pulse rounded-xl p-5 space-y-4 shadow ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    <div className="h-4 w-1/3 rounded bg-gray-400/50"></div>
    <div className="h-6 w-2/3 rounded bg-gray-500/50"></div>
    <div className="h-16 w-full rounded bg-gray-300/40"></div>
    <div className="h-10 w-full rounded bg-gray-400/40"></div>
  </div>
);

const AllPosts = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(true);

  const posts = useSelector((state) => state.posts.allPosts);
  const userData = useSelector((state) => state.auth.userData);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    appwriteService.getAllPosts().then((res) => {
      if (res && res.documents) {
        const publishedPosts = res.documents.filter(
          (post) => post.status === "active" // or 'published' based on your Appwrite schema
        );
        dispatch(setPosts(publishedPosts));
      }
      setLoading(false);
    });
  }, [dispatch]);

  const filterPosts = () => {
    let filtered = [...posts];

    if (filter === "mine") {
      filtered = filtered.filter((post) => post.userId === userData?.$id);
    }

    if (sortBy === "latest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  };

  const filteredPosts = filterPosts();

  return (
    <div
      className={`w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-4xl font-bold text-center mb-10">
        {filter === "mine" ? "Your Posts" : "All Posts"}
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 rounded-full font-medium transition ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : isDarkMode
              ? "bg-gray-800 text-white border border-gray-700"
              : "bg-white text-gray-900 border border-gray-300"
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setFilter("mine")}
          className={`px-5 py-2 rounded-full font-medium transition ${
            filter === "mine"
              ? "bg-blue-600 text-white"
              : isDarkMode
              ? "bg-gray-800 text-white border border-gray-700"
              : "bg-white text-gray-900 border border-gray-300"
          }`}
        >
          My Posts
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`px-4 py-2 rounded-md border ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <option value="latest">Sort by Latest</option>
          <option value="oldest">Sort by Oldest</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoaderCard key={i} isDarkMode={isDarkMode} />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center text-xl font-medium mt-10">
          No posts found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <div
              key={post.$id}
              className={`rounded-xl shadow-md transition hover:shadow-lg flex flex-col justify-between ${
                isDarkMode
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              <div className="p-5">
                <div className="mb-2 text-sm opacity-70">
                  {post.createdAt
                    ? dayjs(post.createdAt).format("MMM D, YYYY")
                    : "Unknown Date"}
                </div>
                <h2 className="text-xl font-bold mb-3 truncate">
                  {post.title}
                </h2>
                <div className="text-sm line-clamp-3 overflow-hidden">
                  {parse(post.content || "<i>No content available.</i>")}
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
