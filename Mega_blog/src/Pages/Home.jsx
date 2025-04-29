import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PostCard } from "../components";
import dayjs from "dayjs";

function Home() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const posts = useSelector((state) => state.posts.allPosts);
  const userData = useSelector((state) => state.auth?.userData);
  const [isHovered, setIsHovered] = useState(true);

  const handleMouseEnter = () => setIsHovered(false);
  const handleMouseLeave = () => setIsHovered(true);
  const handleBannerClick = () => {};

  return (
    <div
      className={`w-full min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/*  1. Welcome Section */}
      <section className="w-full py-16 text-center px-4 welcome-animation">
        <div className="max-w-screen-md mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight font-playfair">
            ✍️ Welcome to{" "}
            <span className="text-blue-600 dark:text-blue-400">TypeNest</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 font-lora dark:text-gray-300 text-gray-800">
            Unleash your creativity, share your knowledge, and inspire the world
            one blog at a time 🚀
          </p>
          <a
            href="/add-post"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300"
          >
            🚀 Get Started
          </a>
        </div>
      </section>

      {/*   Main Banner Section */}
      <section className="w-full">
        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          <div
            className={`w-full h-[60vh] flex items-center justify-center overflow-hidden rounded-xl shadow-lg transform transition-all duration-500 animate-zoom-in ${
              isHovered ? "hover:scale-105 hover:shadow-2xl" : ""
            } cursor-pointer active:scale-95`}
            onClick={handleBannerClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src="/banner.png"
              alt="Banner"
              className="max-h-full max-w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/*  Two Prebuilt Image Banners */}
      <section className="w-full py-12 px-4">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Write Freely Image */}
          <div className="rounded-xl overflow-hidden shadow-md transition transform hover:scale-105 hover:shadow-2xl">
            <img
              src="/ban1.png"
              alt="Write Freely"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Inspire the World Image */}
          <div className="rounded-xl overflow-hidden shadow-md transition transform hover:scale-105 hover:shadow-2xl">
            <img
              src="/ban2.png"
              alt="Inspire the World"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/*   Posts Section */}
      <section className="py-12 px-4">
        {userData && posts.length > 0 && (
          <h2 className="text-3xl font-bold mb-8 text-center">
            📰 Recent Posts
          </h2>
        )}

        {!userData ? (
          <div className="text-center text-lg font-semibold text-red-500">
            <Link
              to="/login"
              className="font-bold text-xl text-blue-600 dark:text-blue-400 hover:underline transition"
            >
              You need to log in to view your posts
            </Link>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center">
            <Link
              to="/add-post"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 text-xl font-semibold hover:underline"
            >
              Let’s start with us <span className="ml-2">→</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
              {posts.slice(0, 8).map((post) => (
                <div
                  key={post.$id}
                  className={`w-full p-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-xl ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800"
                      : "bg-white hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-200"
                  }`}
                >
                  <PostCard
                    title={post.title}
                    content={post.content}
                    featuredImage={post.featuredImage}
                    status={post.status}
                    userId={post.userId}
                    slug={post.$id}
                    createdAt={post.createdAt}
                  />
                  <div className="mt-2 text-sm text-center">
                    {/* Fix the date formatting issue here */}
                    {post.createdAt
                      ? dayjs(post.createdAt).format("MMM D, YYYY")
                      : "Unknown Date"}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/all-posts"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-6 rounded-full transition duration-300"
              >
                View All Posts →
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Home;
