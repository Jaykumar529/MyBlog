import BlogCard from "./BlogCard";

const BlogList = ({ blogs }) => {
  const safeBlogs = Array.isArray(blogs) ? blogs : [];
  return (
    <div className="grid  gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {safeBlogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
