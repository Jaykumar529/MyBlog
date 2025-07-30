import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateAdminRoute from "./components/PrivateAdminRoute";
import Add_Blog from "./pages/Admin/Add_Blog";
import AdminPanel from "./pages/Admin/AdminPanel";
import Update_Blog from "./pages/Admin/Update_Blogs";
import BlogDetail from "./pages/BlogDetail";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Pages */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateAdminRoute>
              <AdminPanel />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/admin/add-blog"
          element={
            <PrivateAdminRoute>
              <Add_Blog />
            </PrivateAdminRoute>
          }
        />
        <Route
          path="/admin/edit-blog/:id"
          element={
            <PrivateAdminRoute>
              <Update_Blog />
            </PrivateAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
