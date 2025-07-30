import axios from "axios";
import { X } from "lucide-react";
import React, { useRef, useState } from "react";

const Add_Blog = ({ onClose }) => {
  const modalRef = useRef();
  const [file, setFile] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to post a blog.");
      return;
    }

    const resData = new FormData();
    resData.append("image", file);
    const formattedData = {
      ...formData,
    };
    resData.append("formData", JSON.stringify(formattedData));

    try {
      await axios.post("/api/blogs", resData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      onClose();
    } catch (error) {
      console.error("Blog post failed:", error);
      alert("Failed to post blog. Make sure you're logged in as admin.");
    }
  };

  const handleImage = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 z-50 bg-transparent bg-opacity-60 backdrop-blur-sm flex justify-center items-center px-4"
    >
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg p-8 text-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
          Add New Blog
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Image Preview */}
          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="h-24 w-auto rounded-lg object-cover mb-2"
              />
            </div>
          )}

          <input
            type="file"
            id="img"
            accept="image/*"
            name="img"
            onChange={handleImage}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            value={formData.title}
            type="text"
            placeholder="Blog Title"
            name="title"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <textarea
            value={formData.content}
            placeholder="Write your blog content..."
            name="content"
            rows={4}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />

          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-md transition"
          >
            Submit Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add_Blog;

