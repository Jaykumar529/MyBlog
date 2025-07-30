// server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import { login, register } from "./middleware/authMiddleware.js";
import parser from "./middleware/multer.js";
import Blog from "./models/Blog.js";
import Comment from "./models/Comment.js";

dotenv.config();

const app = express();
connectDB();
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from this origin
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now req.user has { id, role }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// Auth Routes 

app.post("/api/auth/register", register);
app.post("/api/auth/login", login);

app.post(
  "/api/blogs",
  verifyToken,
  isAdmin,
  parser.single("image"),
  async (req, res) => {
    try {
      const { formData } = req.body;
      const parsedData = JSON.parse(formData); // this gives title, content

      const blog = new Blog({
        title: parsedData.title,
        content: parsedData.content,
        mediaUrl: req.file.path,
        mediaType: req.file.mimetype,
        author: req.user.id, // or req.user._id
      });

      await blog.save();
      res.status(201).json(blog);
    } catch (err) {
      console.error("❌ Blog creation error:", err.message);
      res.status(500).json({ message: "Server error while creating blog" });
    }
  }
);
app.put(
  "/api/blogs/:id",
  verifyToken,
  isAdmin,
  parser.single("image"),
  async (req, res) => {
    try {
      const { formData } = req.body;
      const parsedData = JSON.parse(formData);

      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        {
          title: parsedData.title,
          content: parsedData.content,
          mediaUrl: req.file ? req.file.path : parsedData.mediaUrl,
          mediaType: req.file ? req.file.mimetype : undefined,
        },
        { new: true }
      );

      res.json(updatedBlog);
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: "Update failed" });
    }
  }
);

app.get("/getBlogItem", async (req, res) => {
  const blogs = await Blog.find(); // Or whatever collection you're fetching
  res.json(blogs);
});

app.delete("/api/blogs/:id", verifyToken, isAdmin, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ---------------------
// Public Blog Routes
// ---------------------
app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

app.get("/api/blogs/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});

// ---------------------Likes ---------------------
app.post("/api/blogs/:id/like", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.user.id;
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      // If already liked, remove like (toggle)
      blog.likes.pull(userId);
    } else {
      // Else add like
      blog.likes.push(userId);
    }

    await blog.save();
    res
      .status(200)
      .json({ liked: !alreadyLiked, totalLikes: blog.likes.length });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: "Failed to like/unlike" });
  }
});

// ---------------- Comment ---------------------
app.post("/api/blogs/:id/comment", verifyToken, async (req, res) => {
  try {
    const blogId = req.params.id;
    const { text } = req.body;

    const comment = new Comment({
      blog: blogId,
      user: req.user.id,
      text,
    });

    await comment.save();

    const populated = await comment.populate("user", "username"); // populate username

    res.status(201).json({
      _id: populated._id,
      text: populated.text,
      author: populated.user.username,
      createdAt: populated.createdAt,
    });
  } catch (err) {
    console.error("❌ Comment creation failed:", err.message);
    res.status(500).json({ message: "Failed to post comment" });
  }
});

app.get("/api/blogs/:id/comments", async (req, res) => {
  try {
    const blogId = req.params.id;

    const comments = await Comment.find({ blog: blogId })
      .populate("user", "username")
      .sort({ createdAt: 1 });

    const formatted = comments.map((c) => ({
      _id: c._id,
      text: c.text,
      author: c.user.username,
      createdAt: c.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// ================== Run Server ==================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
