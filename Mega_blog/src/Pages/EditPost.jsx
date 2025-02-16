import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";

export default function EditPost() {
  const { slug } = useParams(); // Get the slug from the URL
  const navigate = useNavigate(); // Hook to navigate
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);

  // Fetch the post data when slug changes
  useEffect(() => {
    console.log("Slug from URL:", slug); // Log the slug to confirm
    if (slug) {
      appwriteService
        .getPost(slug)
        .then((fetchedPost) => {
          console.log("Fetched Post:", fetchedPost);
          if (fetchedPost) {
            setPost(fetchedPost);
            setTitle(fetchedPost.title);
            setContent(fetchedPost.content);
            setStatus(fetchedPost.status);
            setFeaturedImage(fetchedPost.featuredImage);
          } else {
            navigate("/"); // Redirect if post not found
          }
        })
        .catch((error) => {
          console.error("Error fetching post:", error);
          navigate("/"); // Redirect if error
        });
    } else {
      navigate("/"); // Redirect if no slug in URL
    }
  }, [slug, navigate]);

  // Handle form submission (edit post)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPost = await appwriteService.updatePost(slug, {
        title,
        content,
        status,
        featuredImage,
      });
      console.log("Updated post:", updatedPost);
      navigate(`/post/${slug}`); // Redirect to the updated post page
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (!post) return <div>Loading...</div>; // Show loading state while the post is being fetched

  return (
    <Container>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label>Featured Image</label>
          <input
            type="file"
            onChange={(e) => setFeaturedImage(e.target.files[0])}
          />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </Container>
  );
}
