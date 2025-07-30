import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col w-64 h-80">
      <Link to={`/blog/${blog._id}`}>
        <img
          src={blog.mediaUrl}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow justify-between">
        <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
        <p className="text-sm  text-gray-600">
          {blog.content ? blog.content.slice(0, 100) + "..." : "No content"}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <LikeButton blogId={blog._id} />
          <ShareButton blogId={blog._id} />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
