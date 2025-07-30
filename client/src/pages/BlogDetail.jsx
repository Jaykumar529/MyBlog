import { useEffect, useState } from "react";

import axios from "axios";
import { useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LikeButton from "../components/LikeButton";
import ShareButton from "../components/ShareButton";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err.message);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <p>Loading...</p>;
  return (
    <>
      <Header />
      <main className="px-4 py-6 bg-gray-100 min-h-screen">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 max-w-5xl mx-auto">
          <img
            src={blog.mediaUrl}
            alt={blog.title}
            className="w-full h-80 object-cover mb-4 rounded"
          />
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{blog.title}</h1>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-line">
            {blog.content}
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <LikeButton blogId={id} />
            <ShareButton blogId={id} />
          </div>

          <CommentSection blogId={id} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogDetail;
