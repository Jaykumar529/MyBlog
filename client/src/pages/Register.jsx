  import axios from "axios";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";

  import Footer from "../components/Footer";
  import Header from "../components/Header";

  const Register = () => {
    const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post("/api/auth/register", formData);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/admin/dashboard");
      } catch (error) {
        alert("Registration failed");
      }
    };

    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 px-4">
        <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Create a New Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Register
            </button>
            </form>
            </div>
        </main>
        <Footer />
      </>
    );
  };

  export default Register;
