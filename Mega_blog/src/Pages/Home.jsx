import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Container, PostCard } from "../components";

function Home() {
  const posts = useSelector((state) => state.posts.allPosts); // 🔥 Use Redux state

  // State to control hover effect
  const [isHovered, setIsHovered] = useState(true);

  // Handle mouse enter on the banner to stop hover effect
  const handleMouseEnter = () => {
    setIsHovered(false); // Disable hover effect for the banner
  };

  // Handle mouse leave to re-enable hover effect
  const handleMouseLeave = () => {
    setIsHovered(true); // Re-enable hover effect when mouse leaves
  };

  // Handle banner click (no change to scroll behavior)
  const handleBannerClick = () => {
    // No changes needed here, just ensuring no scroll pause
  };

  return (
    <div className="w-full">
      {/* ✅ 1. Hero Banner */}
      <section className="w-full">
        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          {/* Increased max width here */}
          <div
            className={`w-full h-[60vh] flex items-center justify-center overflow-hidden rounded-xl shadow-lg bg-white transform transition-all duration-500 ${
              isHovered ? "hover:scale-105 hover:shadow-2xl" : ""
            }`}
            onClick={handleBannerClick} // Banner click handler
            onMouseEnter={handleMouseEnter} // Disable hover when mouse enters
            onMouseLeave={handleMouseLeave} // Re-enable hover when mouse leaves
          >
            <img
              src="/banner.png"
              alt="Banner"
              className="max-h-full max-w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ✅ 2. Quote Section */}
      <section className="py-16 bg-cover bg-center text-center px-6 relative overflow-hidden mt-[-1px] bg-gradient-to-r from-blue-100 via-green-100 to-yellow-100">
        {/* Background Overlay with gradient */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 rounded-lg"></div>

        {/* Combined Quote Section with no containers */}
        <div className="w-full max-w-screen-xl mx-auto py-6 relative z-10">
          {/* Heading with stylish font */}
          <h2 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 leading-tight shadow-xl">
            “Your Blog. Your Stage. Your Impact.”
          </h2>

          {/* Subheading with different font and background */}
          <p className="text-2xl italic font-semibold text-gray-800 max-w-3xl mx-auto py-4 px-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg shadow-xl">
            A space to share your ideas and inspire others.
          </p>
        </div>

        {/* Optional Decorative Element */}
        <div className="absolute top-0 right-0 p-4 text-4xl text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0l-3-3m3 3l3-3"
            />
          </svg>
        </div>
      </section>

      {/* ✅ 3. Posts Grid */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-white">
        <Container>
          {posts.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-500 text-xl mb-4">No posts found yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {posts.map((post) => (
                <div
                  key={post.$id}
                  className="w-full p-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-xl bg-white hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-200"
                >
                  <PostCard
                    title={post.title}
                    content={post.content}
                    featuredImage={post.featuredImage}
                    status={post.status}
                    userId={post.userId}
                  />
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

export default Home;
