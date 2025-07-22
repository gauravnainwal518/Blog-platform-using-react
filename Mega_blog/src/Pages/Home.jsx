import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PostCard } from "../components";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import dayjs from "dayjs";
import illustration from "../assets/earth-pen.png";

function Home() {
  const posts = useSelector((state) => state.posts.allPosts);
  const userData = useSelector((state) => state.auth?.userData);

  const [searchQuery, setSearchQuery] = useState("");
  const [visiblePosts, setVisiblePosts] = useState(8);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  const uniqueCategories = useMemo(
    () => [...new Set(posts.map((post) => post.category || "Uncategorized"))],
    [posts]
  );
  const uniqueTags = useMemo(
    () => [...new Set(posts.flatMap((post) => post.tags || []))],
    [posts]
  );

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (post.status !== "active") return false;
      const matchesSearch = post.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;
      const matchesTag =
        selectedTag === "all" || (post.tags || []).includes(selectedTag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [posts, searchQuery, selectedCategory, selectedTag]);

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center px-4 text-center bg-white">
        <div>
          <img
            src={illustration}
            alt="Earth and Pen"
            className="w-64 mx-auto animate-bounceSlow transition-all"
          />
          <h1 className="text-3xl sm:text-5xl font-bold mt-6 text-black animate-fadeIn">
            Create. Write. Inspire.
          </h1>
          <p className="text-lg mt-3 text-gray-700 animate-fadeIn delay-200">
            A space for your thoughts to shape the world.
          </p>
        </div>
      </section>

      {/* Welcome + Search Section */}
      <section className="w-full py-16 text-center px-4">
        <div className="max-w-screen-md mx-auto space-y-6">
          <div className="relative flex justify-center">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-xl py-3 px-5 rounded-full shadow-md text-base outline-none bg-gray-100 text-gray-800 placeholder-gray-500 transition"
              aria-label="Search posts"
            />
            <FiSearch
              size={22}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-600"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold font-playfair">
            Welcome to <span className="text-blue-600">TypeNest</span>
          </h1>
          <p className="text-lg sm:text-xl font-lora text-gray-600">
            Unleash your creativity, share your knowledge, and inspire the
            world—one blog at a time.
          </p>

          <Link
            to="/add-post"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-6 py-3 rounded-full shadow-lg transition duration-300"
          >
            Get Started <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Filters Section */}
      <section className="px-4 max-w-screen-xl mx-auto mb-10">
        <div className="flex flex-wrap gap-4 justify-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white text-gray-800"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white text-gray-800"
          >
            <option value="all">All Tags</option>
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-12 px-4 max-w-screen-xl mx-auto">
        {!userData ? (
          <div className="text-center text-lg font-semibold text-red-500">
            <Link
              to="/login"
              className="font-bold text-xl text-blue-600 hover:underline transition"
            >
              You need to log in to view your posts
            </Link>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center space-y-4">
            <p className="text-xl text-gray-500">
              No posts match your filters.
            </p>
            <Link
              to="/add-post"
              className="inline-flex items-center text-blue-600 text-xl font-semibold hover:underline"
            >
              Start writing <FiArrowRight className="ml-2" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
              {filteredPosts.slice(0, visiblePosts).map((post) => (
                <div key={post.$id}>
                  <PostCard {...post} slug={post.$id} />
                  <p className="text-sm mt-2 text-center text-gray-500">
                    {post.createdAt
                      ? dayjs(post.createdAt).format("MMM D, YYYY")
                      : "Unknown Date"}
                  </p>
                </div>
              ))}
            </div>

            {visiblePosts < filteredPosts.length && (
              <div className="text-center">
                <button
                  onClick={() => setVisiblePosts((prev) => prev + 8)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Home;
