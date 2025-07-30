import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Api = import.meta.env.VITE_BACKEND_URL;
const Update_Blogs = ({ onClose, oldData }) => {
  const modalRef = useRef();
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mediaUrl: "",
  });

  // Close modal on background click
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  // Set initial data when modal opens
  useEffect(() => {
    if (oldData) {
      setFormData({
        title: oldData.title || "",
        content: oldData.content || "",
        mediaUrl: oldData.mediaUrl || "",
      });
    }
  }, [oldData]);

  // Handle image selection and preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit updated blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      if (image) {
        form.append("image", image);
      }

      form.append(
        "formData",
        JSON.stringify({
          ...formData,
          imgId: oldData.imgId,
        })
      );

      const token = localStorage.getItem("token");

      await axios.put(`${Api}/api/blogs/${oldData._id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Blog updated successfully!");
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 z-50 bg-transparent bg-opacity-60 backdrop-blur-sm flex justify-center items-center p-4"
    >
      <div className="relative bg-white text-black rounded-xl shadow-xl max-w-lg w-full p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-red-500"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center text-green-700">
          Update Blog
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Image Preview */}
          {(preview || formData.mediaUrl) && (
            <div className="flex justify-center">
              <img
                src={preview || formData.mediaUrl}
                alt="Preview"
                className="h-32 w-auto rounded-lg object-cover"
              />
            </div>
          )}

          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full p-2 border rounded-md"
          />

          {/* Title Input */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            className="w-full p-2 border rounded-md"
            required
          />

          {/* Content Input */}
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter content"
            rows={4}
            className="w-full p-2 border rounded-md resize-none"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update_Blogs;
