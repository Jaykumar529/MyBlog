import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api";

const BlogForm = ({ mode, blogId }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(""); //for showing image
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (mode === "edit" && blogId) {
      axios.get(`/api/blogs/${blogId}`).then((res) => {
        setFormData({
          title: res.data.title,
          content: res.data.content,
        });
        setPreviewUrl(res.data.mediaUrl);
      });
    }
  }, [mode, blogId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("content", formData.content);
    if (file) form.append("media", file);

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    };

    if (mode === "add") {
      await axios.post("/api/blogs", form, config);
    } else {
      await axios.put(`/api/blogs/${blogId}`, form, config);
    }

    navigate("/admin/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white max-w-2xl mx-auto p-6 rounded shadow"
    >
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Blog Title"
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Blog Content"
        className="w-full mb-4 p-2 border rounded"
        rows="6"
        required
      />

      {/* 🟡 Image preview */}
      {previewUrl && (
        <div className="mb-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-h-32 object-contain border rounded"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {mode === "edit" ? "Update Blog" : "Create Blog"}
      </button>
    </form>
  );
};

export default BlogForm;
