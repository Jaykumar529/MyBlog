import axios from "axios";
import { useEffect, useState } from "react";
import BlogList from "../components/BlogList";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Api = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get(`${Api}/api/blogs`)
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <BlogList blogs={blogs} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
