import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader/loader";

function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const allUserPosts = await appwriteService.fetchUserPosts(
          userData?.$id
        );
        const userDrafts = allUserPosts.filter(
          (post) => post.status === "inactive"
        );
        setDrafts(userDrafts);
      } catch (error) {
        console.error("Failed to fetch drafts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.$id) fetchDrafts();
  }, [userData]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this draft?"
    );
    if (!confirmDelete) return;

    try {
      await appwriteService.deletePost(id);
      setDrafts((prev) => prev.filter((draft) => draft.$id !== id));
    } catch (error) {
      console.error("Failed to delete draft:", error);
      alert("Error deleting draft. Please try again.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Your Drafts</h1>

      {drafts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No drafts available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drafts.map((draft) => (
            <div
              key={draft.$id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-md hover:shadow-xl transition"
            >
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/edit-post/${draft.slug}`)}
              >
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-300">
                  {draft.title || "Untitled Draft"}
                </h2>
                <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
                  Last updated: {new Date(draft.updatedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(draft.$id)}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
              >
                Delete Draft
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Drafts;
