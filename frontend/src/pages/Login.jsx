import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Please fill all fields', 'warning');
      return;
    }

    const getWelcomeName = (username) => {
      if (!username) return '';
      const lower = username.toLowerCase();
      if (lower === 'user' || lower === 'null' || lower === 'undefined') return '';
      return username
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    setLoading(true);

    try {
      const data = await authService.login(email, password);
      console.log("Login Response:", data);

      if (data.role !== "CUSTOMER") {
        showToast("Please use the Admin Login page.", "error");
        setLoading(false);
        return;
      }

      login(
        data.token,
        data.email,
        data.username,
        data.fullName,
        data.role,
        data.userId,
        data.profilePic
      );

      const welcomeName = getWelcomeName(data.fullName || data.username);
      showToast(welcomeName ? `Welcome, ${welcomeName}!` : "Welcome back!", "success");

      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });

    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Invalid email or password";
      showToast(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#F7F1E8] dark:bg-[#1C1917] py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 lg:gap-8">
        {/* Left Column - Background Image */}
        <div className="w-full lg:w-[54%] h-[300px] sm:h-[400px] lg:h-[630px] rounded overflow-hidden shadow-sm relative shrink-0">
          <img
            src="/assets/auth_bg.jpg"
            alt="CraftNest Background"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-[#3B2A22]/5 dark:bg-black/30 pointer-events-none" />
        </div>

        {/* Right Column - Authentication Panel */}
        <div className="w-full lg:w-[42%] min-h-[500px] lg:h-[630px] bg-white dark:bg-secondary-900 rounded shadow-sm flex items-center justify-center p-8 sm:p-12 lg:p-14 transition-all duration-300">
          <div className="w-full max-w-[360px] py-2 space-y-6 flex flex-col justify-center h-full">

            {/* Branding */}
            <div className="flex flex-col items-center text-center">
              <Logo showTagline={false} iconSize="w-10 h-10" className="mx-auto" />
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#77706A] dark:text-[#E89E6C] uppercase leading-none mt-3.5">
                HANDMADE • UNIQUE • FROM THE HEART
              </span>
              {/* Leaf Separator */}
              <div className="flex items-center w-full justify-center gap-3 mt-4">
                <div className="w-16 h-[1px] bg-secondary-200 dark:bg-secondary-800" />
                <span className="text-[#c55f3c] text-xs">🍂</span>
                <div className="w-16 h-[1px] bg-secondary-200 dark:bg-secondary-800" />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center">
              <h2 className="font-serif font-medium text-3xl text-[#3B2A22] dark:text-white tracking-tight">
                Hi, welcome back
              </h2>
              <p className="mt-1.5 text-xs text-[#77706A] dark:text-secondary-400">
                Sign in to continue to CraftNest
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleLogin}>
              {/* Email Address */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-secondary-750 dark:text-secondary-300 block"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 h-[50px] bg-white dark:bg-secondary-950 border border-secondary-200 dark:border-secondary-750 focus:border-[#c55f3c] focus:ring-2 focus:ring-[#c55f3c]/10 rounded text-sm focus:outline-none text-secondary-900 dark:text-white transition-all placeholder-[#77706A]/40"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-secondary-750 dark:text-secondary-300 block"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-11 h-[50px] bg-white dark:bg-secondary-950 border border-secondary-200 dark:border-secondary-750 focus:border-[#c55f3c] focus:ring-2 focus:ring-[#c55f3c]/10 rounded text-sm focus:outline-none text-secondary-900 dark:text-white transition-all placeholder-[#77706A]/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-650"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Forgot Password below input */}
                <div className="text-right mt-1.5">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#c55f3c] hover:text-[#a44b2d] transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[50px] text-sm font-bold tracking-wider text-white bg-[#c55f3c] hover:bg-[#a44b2d] rounded transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'SIGN IN →'
                )}
              </button>
            </form>

            {/* Links */}
            <div className="text-sm text-secondary-500 space-y-4 pt-1 text-center">
              <div>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-[#c55f3c] hover:text-[#a44b2d] transition-colors"
                >
                  Create Account
                </Link>
              </div>
              <div className="pt-3 border-t border-secondary-100 dark:border-secondary-800">
                <Link
                  to="/admin/login"
                  className="text-xs font-bold text-secondary-400 hover:text-red-500 transition-colors"
                >
                  Login as Administrator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;