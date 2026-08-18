import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Sparkles, ShieldAlert, Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import Logo from "../components/Logo";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authService.adminLogin(
        formData.email,
        formData.password
      );
      if (data.role !== "ADMIN") {
        setError("You are not authorized as an Admin.");
        setLoading(false);
        return;
      }

      login(
        data.token,
        data.email,
        data.username,
        data.fullName,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#F7F1E8] dark:bg-[#1C1917] py-12 lg:py-16 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-12 rounded-[30px] border border-[#F1E8DD] bg-[#FAF7F2] dark:border-secondary-800 dark:bg-secondary-950 shadow-[0_30px_80px_rgba(109,82,53,0.08)] overflow-hidden transition-all duration-500">

        {/* Left Column: Visual Image & Portal Info */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-gradient-to-b from-[#F2E3C7]/40 to-[#E9D7C6]/40 dark:from-[#3d1b10]/20 dark:to-secondary-950/40 border-r border-[#F1E8DD]/80 dark:border-secondary-800/80">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#F2E3C7]/60 blur-3xl pointer-events-none dark:bg-primary-500/10" />
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-[#E9D7C6]/60 blur-3xl pointer-events-none dark:bg-primary-500/10" />

          <Logo showTagline={true} iconSize="w-9 h-9" />

          {/* Decorative craft image */}
          <div className="relative w-full overflow-hidden rounded-[28px] border border-[#E9D9C5] bg-white/40 p-2.5 shadow-[0_20px_50px_rgba(92,65,45,0.08)] dark:border-secondary-800 dark:bg-secondary-900/60 transition-all duration-500 hover:shadow-[0_25px_60px_rgba(92,65,45,0.12)]">
            <div className="overflow-hidden rounded-[20px] aspect-[4/3]">
              <img
                src="/assets/hero_crafts.jpg"
                alt="CraftNest Admin Portal"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>
          </div>

          <div className="space-y-3 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8D9C4] bg-white/95 px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-[#7C5A3A] shadow-sm backdrop-blur-sm dark:border-secondary-700 dark:bg-secondary-900/90 dark:text-primary-300">
              <Sparkles className="h-3.5 w-3.5 text-[#B9723D]" />
              ADMIN PORTAL
            </span>
            <p className="text-xs leading-relaxed text-[#5F584F] dark:text-secondary-450 font-medium">
              Manage products, orders, customers, and your store from one secure place.
            </p>
          </div>
        </div>

        {/* Right Column: Admin Login Form */}
        <div className="lg:col-span-7 bg-white dark:bg-secondary-900 p-8 sm:p-12 lg:p-16 flex flex-col justify-center transition-colors duration-300">

          {/* Logo visible on mobile/tablet */}
          <div className="lg:hidden flex justify-center mb-6">
            <Logo showTagline={false} iconSize="w-8 h-8" />
          </div>

          {/* Admin Badging */}
          <div className="flex justify-center lg:justify-start mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8D9C4] bg-[#FAF7F2] px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-[#7C5A3A] uppercase dark:border-secondary-750 dark:bg-secondary-950 dark:text-primary-300">
              <span className="h-2 w-2 rounded-full bg-[#B9723D] animate-pulse" />
              Admin Portal
            </span>
          </div>

          {/* Heading */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="font-outfit text-3xl sm:text-4xl font-black tracking-tight text-[#2C241E] dark:text-white leading-tight">
              Welcome Back, <span className="text-[#B9723D] dark:text-[#E89E6C]">Admin</span>
            </h2>
            <p className="mt-2 text-sm text-[#5F584F] dark:text-secondary-400">
              Manage your CraftNest store with ease.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-400 p-4 rounded-2xl mb-6 text-sm flex items-start gap-2.5 animate-fade-in-up">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleLogin}>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#7C5A3A] dark:text-secondary-400 block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="admin@craftnest.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 h-[52px] bg-[#FAF7F2]/50 dark:bg-secondary-950 border border-[#F1E8DD] dark:border-secondary-800 focus:border-[#B9723D] focus:ring-2 focus:ring-[#B9723D]/10 rounded-2xl text-sm focus:outline-none text-secondary-900 dark:text-white transition-all placeholder-secondary-400/70"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-[#7C5A3A] dark:text-secondary-400">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-[#B9723D] hover:text-[#a76331] transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-11 h-[52px] bg-[#FAF7F2]/50 dark:bg-secondary-950 border border-[#F1E8DD] dark:border-secondary-800 focus:border-[#B9723D] focus:ring-2 focus:ring-[#B9723D]/10 rounded-2xl text-sm focus:outline-none text-secondary-900 dark:text-white transition-all placeholder-secondary-400/70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-[#7C5A3A] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] text-sm font-bold tracking-wider text-white bg-[#B9723D] hover:bg-[#a76331] rounded-full shadow-[0_12px_28px_rgba(185,114,61,0.2)] hover:shadow-[0_16px_32px_rgba(185,114,61,0.3)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer pt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  SIGN IN
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Links back */}
          <div className="text-center mt-8">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7C5A3A] hover:text-[#B9723D] transition-colors"
            >
              ← Back to Customer Login
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminLogin;