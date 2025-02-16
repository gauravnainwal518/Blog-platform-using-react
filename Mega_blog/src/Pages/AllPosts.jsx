import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config"; // ✅ Correct import
import Button from "../components/Button";
import parse from "html-react-parser"; // ✅ For parsing HTML content

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await appwriteService.getPosts(); // ✅ Now it exists!
        setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
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
                  {parse(post.content || "")} {/* ✅ Safely parse content */}
                </div>
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
