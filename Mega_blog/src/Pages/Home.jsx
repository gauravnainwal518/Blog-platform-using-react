import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PostCard, Loader } from "../components";

import { FiSearch, FiArrowRight } from "react-icons/fi";
import appwriteService from "../appwrite/config";
import illustration from "../assets/earth-pen.png";

const POSTS_PER_PAGE = 8;

function HomePage() {
  const posts = useSelector((state) => state.posts.allPosts);
  const userData = useSelector((state) => state.auth?.userData);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      const activePosts = posts.filter((post) => post.status === "active");
      const sortedPosts = activePosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFeaturedPost(sortedPosts[0]);
    }
  }, [posts]);

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
        .includes(debouncedQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;
      const matchesTag =
        selectedTag === "all" || (post.tags || []).includes(selectedTag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [posts, debouncedQuery, selectedCategory, selectedTag]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 transition-all">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-20">
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
          <h1 className="text-4xl sm:text-6xl font-bold text-black font-playfair">
            Create. Write. Inspire.
          </h1>
          <p className="text-lg text-gray-600">
            Share your thoughts, reach minds, and shape the future with
            TypeNest.
          </p>
          <div className="relative w-full max-w-md mx-auto lg:mx-0">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-5 rounded-full bg-gray-100 shadow-sm text-base text-gray-800 placeholder-gray-500"
            />
            <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
          </div>
          <Link
            to="/add-post"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-6 py-3 rounded-full shadow-lg transition"
          >
            Get Started <FiArrowRight className="ml-2" />
          </Link>
        </div>
        <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
          <img
            src={illustration}
            alt="Earth and Pen"
            className="w-[90%] mx-auto animate-bounceSlow"
          />
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 font-playfair">
          Why Choose TypeNest?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Easy Publishing",
              desc: "Create and publish posts with our user-friendly editor.",
            },
            {
              title: "Reach the World",
              desc: "Connect with a global audience of curious readers.",
            },
            {
              title: "Build a Community",
              desc: "Engage readers and grow your presence through blogs.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Section (Visible only when logged in) */}
      {userData && (
        <section className="px-4 max-w-screen-xl mx-auto mt-8 mb-10 text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-md border bg-white text-gray-800"
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
              className="px-4 py-2 rounded-md border bg-white text-gray-800"
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
      )}

      {/* Posts Section */}
      <section className="py-12 px-4 max-w-screen-xl mx-auto">
        {!userData ? (
          <div className="text-center text-lg font-semibold text-red-500">
            <Link
              to="/login"
              className="font-bold text-xl text-blue-600 hover:underline"
            >
              Log in to access your posts and discover more.
            </Link>
          </div>
        ) : paginatedPosts.length === 0 ? (
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
              {paginatedPosts.map((post) => (
                <div key={post.$id}>
                  <PostCard {...post} slug={post.$id} />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-4 py-2 rounded-md text-sm font-medium border shadow-sm ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default HomePage;
