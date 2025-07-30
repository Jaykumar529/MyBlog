import { FaShare } from "react-icons/fa";

const ShareButton = ({ blogId }) => {
  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${blogId}`;

    const shareData = {
      title: "Check out this blog!",
      text: "Here's a blog you might enjoy.",
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        alert("Sharing not supported in your browser.");
      }
    } catch (err) {
      console.error("Sharing failed", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="text-blue-500 text-sm flex items-center gap-1"
    >
      <FaShare /> Share
    </button>
  );
};

export default ShareButton;
