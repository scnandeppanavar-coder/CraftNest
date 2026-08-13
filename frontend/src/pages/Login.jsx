import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Please fill all fields', 'warning');
      return;
    }

    setLoading(true);

    try {
      const data = await authService.login(email, password);
      console.log("Login Response:", data);

      // Allow only CUSTOMER login
      if (data.role !== "CUSTOMER") {
        showToast("Please use the Admin Login page.", "error");
        setLoading(false);
        return;
      }

      login(
        data.token,
        data.email,
        data.username,
        data.role,
        data.userId
      );
      console.log(sessionStorage.getItem("token"));
      console.log(sessionStorage.getItem("user"));

      showToast("Welcome back!", "success");

      navigate("/home", { replace: true });

    } catch (error) {
      console.error(error);

      const errMsg =
        error.response?.data?.message ||
        "Invalid email or password";

      showToast(errMsg, "error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 p-8 sm:p-10 rounded-3xl shadow-xl transition-colors">

        <div className="text-center">
          <h2 className="font-outfit font-extrabold text-3xl text-secondary-900 dark:text-white tracking-tight">
            Customer Login
          </h2>

          <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
            Welcome back to CraftNest
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>

          <div className="space-y-4 rounded-md">

            {/* Email */}

            <div className="relative">

              <label
                htmlFor="email"
                className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1"
              >
                Email Address
              </label>

              <div className="relative">

                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all"
                />

                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary-400" />

              </div>

            </div>

            {/* Password */}

            <div className="relative">

              <div className="flex justify-between items-center mb-1.5 ml-1">

                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-primary-500 hover:text-primary-600"
                >
                  Forgot Password?
                </Link>

              </div>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all"
                />

                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary-400" />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-secondary-400 hover:text-secondary-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

              </div>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        <div className="text-center text-sm text-secondary-500 space-y-4">

          <div>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-primary-500 hover:text-primary-600"
            >
              Register Now
            </Link>
          </div>

          <div>
            <Link
              to="/admin/login"
              className="font-bold text-red-600 hover:text-red-700"
            >
              Login as Administrator
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;