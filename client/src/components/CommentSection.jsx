import axios from "axios";
import { useEffect, useState } from "react";

const CommentSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/blogs/${blogId}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };
    fetchComments();
  }, [blogId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;
    try {
      const res = await axios.post(
        `/api/blogs/${blogId}/comment`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, res.data]);
      setCommentText("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Comments</h2>

      {user && (
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400 text-sm sm:text-base"
            rows="4"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded-md text-sm sm:text-base"
          >
            Post Comment
          </button>
        </form>
      )}

      {comments.map((comment) => (
        <div
          key={comment._id}
          className="bg-gray-100 p-3 rounded mb-3 text-sm sm:text-base"
        >
          <p className="font-medium">{comment.author}</p>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
};


export default CommentSection;
