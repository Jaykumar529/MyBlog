import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";

const Api = import.meta.env.VITE_BACKEND_URL;

const LikeButton = ({ blogId, initialLikes = 0 }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");


   useEffect(() => {
     const fetchLikes = async () => {
       try {
         const res = await axios.get(`${Api}/api/blogs/${blogId}`);
         setLikes(res.data.likes.length);
         const userId = localStorage.getItem("userId"); 
         setLiked(res.data.likes.includes(userId));
       } catch (err) {
         console.error("Failed to fetch like data", err);
       }
     };
     fetchLikes();
   }, [blogId, userId]);

  const handleLike = async () => {
    if (!token) {
      alert("Please login to like posts.");
      return;
    }

    try {
      const res  = await axios.post(`${Api}/api/blogs/${blogId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLiked(res.data.liked);
      setLikes(res.data.totalLikes);
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1 text-sm${
        liked ? "text-red-600" : "text-gray-500"
      }`}
    >
      {liked ? <FaHeart /> : <FaRegHeart />} {likes}
    </button>
  );
};

export default LikeButton;
