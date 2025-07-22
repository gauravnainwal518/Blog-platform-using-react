import React, { useState, useEffect } from "react";
import service from "../appwrite/config";

const CommentSection = ({ postId }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  const fetchComments = async () => {
    try {
      const response = await service.fetchCommentsByArticleId(postId);
      setComments(response);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await service.getUserData();
      setCurrentUserId(user?.$id);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !postId || !currentUserId) return;

    const limitedContent = commentText.trim().substring(0, 255);

    try {
      await service.createComment({
        content: String(limitedContent),
        articleId: postId,
        userId: currentUserId,
      });

      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId, userId) => {
    if (userId !== currentUserId && currentUserId !== "admin") {
      console.error("You don't have permission to delete this comment.");
      return;
    }

    try {
      await service.deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleUpdateComment = async (commentId, newContent) => {
    if (!newContent.trim()) return;

    const limitedContent = newContent.trim().substring(0, 255);

    try {
      const oldComment = comments.find((comment) => comment.$id === commentId);

      if (!oldComment) {
        console.error("Comment not found locally.");
        return;
      }

      const updatedData = {
        ...oldComment,
        content: String(limitedContent),
      };

      await service.updateComment(commentId, updatedData.content);

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

  const handleEditComment = (commentId, content) => {
    if (typeof content !== "string") {
      content = String(content);
    }

    setEditingCommentId(commentId);
    setEditedCommentText(content);
  };

  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
  }, [postId]);

  return (
    <div className="p-4 bg-white text-black rounded">
      <h3 className="text-lg font-bold mb-4">Comments</h3>

      <div className="space-y-2 mb-4">
        {comments.map((comment) => (
          <div key={comment.$id} className="p-2 rounded bg-gray-100">
            {editingCommentId === comment.$id ? (
              <div>
                <input
                  type="text"
                  value={editedCommentText}
                  onChange={(e) => setEditedCommentText(e.target.value)}
                  className="border p-2 mb-2 rounded w-full bg-white text-black border-gray-300"
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
          className="border p-2 flex-1 rounded bg-white text-black border-gray-300"
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
