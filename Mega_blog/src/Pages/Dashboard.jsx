import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import dayjs from "dayjs";

function Dashboard() {
  const userData = useSelector((state) => state.auth.userData);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await appwriteService.fetchUserPosts(
          userData?.$id
        );
        setPosts(fetchedPosts || []);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.$id) {
      fetchUserPosts();
    }
  }, [userData]);

  const publishedPosts =
    posts?.filter((post) => post.status === "active") || [];
  const draftPosts = posts?.filter((post) => post.status === "inactive") || [];

  const renderLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`rounded-lg p-4 animate-pulse space-y-3 shadow-md h-60 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="w-1/3 h-4 rounded bg-gray-400/60"></div>
          <div className="w-2/3 h-6 rounded bg-gray-500/50"></div>
          <div className="h-10 w-full rounded bg-gray-300/40"></div>
        </div>
      ))}
    </div>
  );

  const renderPostCard = (post, isDraft = false) => (
    <div
      key={post.$id}
      className={`p-5 border rounded-xl shadow-md transition hover:shadow-lg flex flex-col justify-between ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div>
        <div className="text-xs mb-1 text-gray-400">
          {dayjs(post.createdAt).format("MMM D, YYYY")}
        </div>
        <h3 className="text-lg font-semibold truncate mb-2">{post.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
          {post.content}
        </p>
      </div>
      <div className="mt-4 flex gap-4 text-sm">
        {isDraft ? (
          <>
            <Link
              to={`/edit-post/${post.slug}`}
              className="text-yellow-500 hover:underline"
            >
              Edit Draft
            </Link>
            <Link
              to={`/post/${post.slug}`}
              className="text-blue-500 hover:underline"
            >
              Preview
            </Link>
          </>
        ) : (
          <Link
            to={`/post/${post.slug}`}
            className="text-blue-500 hover:underline"
          >
            View Post
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen px-6 py-10 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold text-center mb-8">Your Dashboard</h1>

      {loading ? (
        renderLoader()
      ) : (
        <div className="space-y-12">
          {/* Published Posts */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold border-b pb-1 border-gray-500">
                Published Posts
              </h2>
              <span className="text-sm font-medium bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                {publishedPosts.length} posts
              </span>
            </div>
            {publishedPosts.length === 0 ? (
              <p className="text-gray-400">No published posts yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedPosts.map((post) => renderPostCard(post))}
              </div>
            )}
          </section>

          {/* Draft Posts */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold border-b pb-1 border-gray-500">
                Draft Posts
              </h2>
              <span className="text-sm font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                {draftPosts.length} drafts
              </span>
            </div>
            {draftPosts.length === 0 ? (
              <p className="text-gray-400">No drafts yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {draftPosts.map((post) => renderPostCard(post, true))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
