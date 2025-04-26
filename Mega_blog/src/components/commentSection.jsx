import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Import Redux hook
import service from "../appwrite/config"; // Your Appwrite service

const CommentSection = ({ postId }) => {
  const [commentText, setCommentText] = useState(""); // For adding a new comment
  const [comments, setComments] = useState([]); // For holding comments
  const [currentUserId, setCurrentUserId] = useState(null); // For storing the current user ID
  const [editingCommentId, setEditingCommentId] = useState(null); // For tracking which comment is being edited
  const [editedCommentText, setEditedCommentText] = useState(""); // For storing edited comment text

  const isDarkMode = useSelector((state) => state.theme.isDarkMode); // Get theme from Redux

  // Fetch comments for the given postId
  const fetchComments = async () => {
    try {
      const response = await service.fetchCommentsByArticleId(postId);
      setComments(response);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      const user = await service.getUserData();
      setCurrentUserId(user?.$id);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // Add a new comment
  const handleAddComment = async () => {
    if (!commentText.trim() || !postId || !currentUserId) return;

    const limitedContent = commentText.trim().substring(0, 255); // Limit the content length

    try {
      await service.createComment({
        content: String(limitedContent), // Ensure it's a string
        articleId: postId,
        userId: currentUserId,
      });

      setCommentText(""); // Clear input after submitting
      fetchComments(); // Fetch updated comments
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId, userId) => {
    if (userId !== currentUserId && currentUserId !== "admin") {
      console.error("You don't have permission to delete this comment.");
      return;
    }

    try {
      await service.deleteComment(commentId);
      fetchComments(); // Fetch updated comments after deletion
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Update an existing comment
  const handleUpdateComment = async (commentId, newContent) => {
    if (!newContent.trim()) return;

    const limitedContent = newContent.trim().substring(0, 255);
    console.log("Updating comment with content:", limitedContent); // Log the content before updating

    try {
      const oldComment = comments.find((comment) => comment.$id === commentId);

      if (!oldComment) {
        console.error("Comment not found locally.");
        return;
      }

      // Ensure the content is a string
      const updatedData = {
        ...oldComment,
        content: String(limitedContent), // Explicitly convert to string
      };

      await service.updateComment(commentId, updatedData.content); // Pass the string content

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.$id === commentId
            ? { ...comment, content: limitedContent }
            : comment
        )
      );

      setEditingCommentId(null);
      setEditedCommentText("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Start editing a comment
  const handleEditComment = (commentId, content) => {
    if (typeof content !== "string") {
      content = String(content); // Ensure it's a string
    }

    setEditingCommentId(commentId);
    setEditedCommentText(content);
  };

  // Fetch comments and user data when component mounts
  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
  }, [postId]);

  return (
    <div
      className={`p-4 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } rounded`}
    >
      <h3 className="text-lg font-bold mb-4">Comments</h3>

      <div className="space-y-2 mb-4">
        {comments.map((comment) => (
          <div
            key={comment.$id}
            className={`p-2 rounded ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            {editingCommentId === comment.$id ? (
              <div>
                <input
                  type="text"
                  value={editedCommentText}
                  onChange={(e) => setEditedCommentText(e.target.value)}
                  className={`border p-2 mb-2 rounded w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-black border-gray-300"
                  }`}
                />
                <button
                  onClick={() =>
                    handleUpdateComment(comment.$id, editedCommentText)
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                  disabled={!editedCommentText.trim()}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCommentId(null)}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <p>{comment.content}</p>
                <div className="flex space-x-2 mt-2">
                  {(comment.userId === currentUserId ||
                    currentUserId === "admin") && (
                    <>
                      <button
                        onClick={() =>
                          handleEditComment(comment.$id, comment.content)
                        }
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteComment(comment.$id, comment.userId)
                        }
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className={`border p-2 flex-1 rounded ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!commentText.trim() || !currentUserId}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
