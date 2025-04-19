import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config"; // ✅ Make sure this is correct
import Button from "../components/Button";
import parse from "html-react-parser";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get current logged-in user from Redux
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (userData?.$id) {
          // ✅ Get posts only for current user
          const fetchedPosts = await appwriteService.getPostsByUser(
            userData.$id
          );
          setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userData]);

  return (
    <div className="all-posts-container p-8">
      <h1 className="text-3xl font-bold text-center mb-6">All Posts</h1>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="post-list flex flex-wrap gap-6 justify-center">
          {posts.length === 0 ? (
            <p>No posts available</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.$id}
                className="post-item w-72 p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {post.title}
                </h2>
                <div className="text-gray-600 mb-4 line-clamp-3">
                  {parse(post.content || "")}
                </div>

                {/* Log the slug for each post */}
                {/*console.log("Post Slug:", post.slug)*/}
                <Link to={`/post/${post.slug}`}>
                  <Button bgColor="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    Read More
                  </Button>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AllPosts;
