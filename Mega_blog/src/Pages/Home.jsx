import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Container, PostCard } from "../components";

function Home() {
  const posts = useSelector((state) => state.posts.allPosts);
  const [isHovered, setIsHovered] = useState(true);

  const handleMouseEnter = () => setIsHovered(false);
  const handleMouseLeave = () => setIsHovered(true);
  const handleBannerClick = () => {};

  return (
    <div className="w-full bg-white">
      {/* ✅ 1. Welcome Section */}
      <section className="w-full py-16 text-center bg-white px-4">
        <div className="max-w-screen-md mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800 mb-6 leading-tight whitespace-nowrap">
            ✍️ Welcome to <span className="text-blue-600">TypeNest</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8">
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

      {/* ✅ 2. Main Banner Section */}
      <section className="w-full">
        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          <div
            className={`w-full h-[60vh] flex items-center justify-center overflow-hidden rounded-xl shadow-lg bg-white transform transition-all duration-500 ${
              isHovered ? "hover:scale-105 hover:shadow-2xl" : ""
            }`}
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

      {/* ✅ 3. Two Prebuilt Banners */}
      <section className="w-full py-12 px-4">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Write Freely */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center hover:shadow-md transition">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Write Freely
            </h3>
            <p className="text-gray-600">
              At TypeNest, we believe in the freedom of expression. Your
              thoughts, ideas, and creativity are what make you unique, and our
              platform is here to give you the space to share them. Writing
              freely means not holding back, not worrying about perfection, and
              not being afraid to let your voice be heard. Whether you're
              penning down your latest project, a thought-provoking blog, or
              simply expressing your emotions, this is your platform. Unleash
              your creativity, share your passions, and let your words shape the
              world.
            </p>
          </div>

          {/* Inspire the World */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center hover:shadow-md transition">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Inspire the World
            </h3>
            <p className="text-gray-600">
              Your words have the power to spark change, ignite passions, and
              connect people across the globe. Every story shared, every idea
              voiced, has the potential to inspire and uplift. At TypeNest, we
              believe that inspiration knows no boundaries. Whether it's through
              the challenges you've overcome, the lessons you've learned, or the
              dreams you’re chasing, your unique perspective can motivate others
              to take action. Don't just write—empower, encourage, and inspire.
              Let your voice echo far and wide, and watch as it creates ripples
              of transformation in the lives of others.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ 4. Posts Section */}
      <section className="py-12">
        <Container>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            📰 Recent Posts
          </h2>

          {posts.length === 0 ? (
            <div className="text-center">
              <Link
                to="/add-post"
                className="inline-flex items-center text-blue-600 text-xl font-semibold hover:underline"
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
                    className="w-full p-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-xl bg-white hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-200"
                  >
                    <PostCard
                      title={post.title}
                      content={post.content}
                      featuredImage={post.featuredImage}
                      status={post.status}
                      userId={post.userId}
                      slug={post.$id}
                    />
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
        </Container>
      </section>
    </div>
  );
}

export default Home;
