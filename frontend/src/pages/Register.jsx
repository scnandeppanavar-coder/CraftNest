import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('COUSTMER');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !role) {
      showToast('Please fill all fields', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    setLoading(true);
    try {
      await authService.register(username, email, password);
      showToast('OTP sent successfully to your email. Please verify.', 'success');
      // Redirect to OTP verification page with the email in state
      navigate('/verify-registration-otp', { state: { email } });
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Registration failed';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 p-8 sm:p-10 rounded-3xl shadow-xl transition-colors">
        <div className="text-center">
          <h2 className="font-outfit font-extrabold text-3xl text-secondary-900 dark:text-white tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
            Join CraftNest to explore and shop
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all"
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary-400" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
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
            <div>
              <label htmlFor="password" className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary-400" />
              </div>
            </div>

            {/* Role selection */}
            <div>
              <label htmlFor="role" className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                Register As
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all appearance-none cursor-pointer"
                >
                  <option value="CUSTOMER" className="dark:bg-secondary-800">Customer</option>
                </select>
                <Shield className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary-400" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 rounded-2xl shadow-lg shadow-primary-500/10 hover:shadow-primary-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Register <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-secondary-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary-500 hover:text-primary-600 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
