import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const AdminLogin = () => {
  const navigate = useNavigate();
const { login } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await authService.adminLogin(
        formData.email,
        formData.password
      );
      if (data.role !== "ADMIN") {
        setError("You are not authorized as an Admin.");
        return;
      }

      login(
        data.token,
        data.email,
        data.username,
        data.role,
        data.userId
      );

      showToast("Welcome Admin!", "success");

      navigate("/admin/dashboard", {
        replace: true,
      });

    } catch (err) {
      showToast(
    err.response?.data?.message ||
    "Invalid admin credentials",
    "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF7F2] via-white to-[#F8E8DD] 
      dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950 px-4 transition-colors duration-300">

      <div className="bg-white dark:bg-secondary-900 p-10 rounded-3xl shadow-2xl border border-secondary-200 
      dark:border-secondary-800 w-full max-w-md transition-all duration-300">

        <div className="text-center mb-8">

  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center text-3xl">
    🔒
  </div>

  <h2 className="font-outfit text-4xl font-black text-secondary-900 dark:text-white">
    Admin Portal
  </h2>

  <p className="text-secondary-500 dark:text-secondary-400 mt-2">
    Secure access for administrators only.
  </p>

</div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-950 
            text-secondary-900 dark:text-white px-4 py-3 mb-4 focus:ring-2 focus:ring-primary-500 outline-none transition"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mb-6"
            required
          />

          <button
            type="submit"
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl 
            font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Login as Admin
          </button>

        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-primary-500 hover:text-primary-600 font-semibold transition-colors"
          >
            ← Back to Customer Login
          </Link>
        </div>

      </div>

    </div>
  );
};

export default AdminLogin;