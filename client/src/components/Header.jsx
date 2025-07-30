import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("token");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md px-4 sm:px-6 lg:px-10 py-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-blue-600">
          MyBlog
        </Link>

        {/* Hamburger for small screens */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-700 font-medium">
                Hi, {user?.username || "User"}
              </span>
              {role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="text-blue-600 hover:underline"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={logout}
                className="text-red-500 hover:underline font-medium"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Dropdown Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 space-y-2 flex flex-col">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-700 font-medium">
                Hi, {user?.username || "User"}
              </span>
              {role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="text-blue-600 hover:underline"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={logout}
                className="text-red-500 hover:underline font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
