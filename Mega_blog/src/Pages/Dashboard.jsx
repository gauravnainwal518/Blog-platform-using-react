import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import dayjs from "dayjs";

function Dashboard() {
  const userData = useSelector((state) => state.auth.userData);
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

  const publishedPosts = posts.filter((post) => post.status === "active");
  const draftPosts = posts.filter((post) => post.status === "inactive");

  const renderLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl p-4 animate-pulse space-y-3 shadow-md h-56 bg-white"
        >
          <div className="w-1/2 h-4 rounded bg-gray-400/60"></div>
          <div className="w-2/3 h-6 rounded bg-gray-500/50"></div>
          <div className="h-10 w-full rounded bg-gray-300/40"></div>
        </div>
      ))}
    </div>
  );

  const renderPostCard = (post, isDraft = false) => (
    <div
      key={post.$id}
      className="p-5 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between bg-white"
    >
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">
            {dayjs(post.createdAt).format("MMM D, YYYY")}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isDraft
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {isDraft ? "Draft" : "Published"}
          </span>
        </div>
        <h3 className="text-lg font-bold truncate mb-1">{post.title}</h3>
      </div>
      <div className="mt-4 flex gap-4 text-sm">
        {isDraft ? (
          <>
            <Link
              to={`/edit-post/${post.slug}`}
              className="text-yellow-500 font-medium hover:underline"
            >
              Edit
            </Link>
            <Link
              to={`/post/${post.slug}`}
              className="text-blue-500 font-medium hover:underline"
            >
              Preview
            </Link>
          </>
        ) : (
          <Link
            to={`/post/${post.slug}`}
            className="text-blue-600 font-medium hover:underline"
          >
            View
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 tracking-tight">
          Your Dashboard
        </h1>

        {loading ? (
          renderLoader()
        ) : (
          <div className="space-y-14">
            {/* Published Posts */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Published Posts
                </h2>
                <span className="text-sm font-medium bg-green-100 text-green-700 px-3 py-0.5 rounded-full">
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Draft Posts
                </h2>
                <span className="text-sm font-medium bg-yellow-100 text-yellow-800 px-3 py-0.5 rounded-full">
                  {draftPosts.length} drafts
                </span>
              </div>
              {draftPosts.length === 0 ? (
                <p className="text-gray-400">No draft posts available.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {draftPosts.map((post) => renderPostCard(post, true))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
