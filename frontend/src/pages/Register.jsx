import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      showToast('Please fill all fields', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'warning');
      return;
    }

    setLoading(true);
    try {
      await authService.register(username, email, password, fullName);
      showToast('OTP sent successfully to your email. Please verify.', 'success');
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
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#F7F1E8] dark:bg-[#1C1917] py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1400px] flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-8 lg:gap-10">
        {/* Left Column - Background Image */}
        <div className="w-full lg:w-[54%] h-[300px] sm:h-[400px] lg:h-[650px] rounded-xl overflow-hidden shadow-sm relative shrink-0">
          <img
            src="/assets/auth_bg.jpg"
            alt="CraftNest Background"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-[#3B2A22]/5 dark:bg-black/30 pointer-events-none" />
        </div>

        {/* Right Column - Authentication Panel */}
        <div className="w-full lg:w-[42%] min-h-[550px] lg:h-[720px] bg-white dark:bg-secondary-900 rounded-xl shadow-sm flex items-center justify-center p-8 sm:p-12 lg:p-8 transition-all duration-300">
          <div className="w-full max-w-[380px] py-2 space-y-4 flex flex-col justify-center h-full">

            {/* Branding */}
            <div className="flex flex-col items-start">
              <Logo showTagline={false} iconSize="w-9 h-9" />
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#77706A] uppercase leading-none mt-3.5">
                HANDMADE • UNIQUE • FROM THE HEART
              </span>
              <div className="w-12 h-[2px] bg-[#D97752] mt-4" />
            </div>

            {/* Heading */}
            <div>
              <h2 className="font-outfit font-black text-2xl sm:text-3xl text-[#3B2A22] dark:text-white tracking-tight">
                Create your account
              </h2>
              <p className="mt-1 text-sm text-[#77706A] dark:text-secondary-400">
                Join CraftNest and discover handmade treasures.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-3" onSubmit={handleRegister}>
              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-[#3B2A22] dark:text-secondary-300 block">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Seema CN"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-4 pr-4 h-[48px] bg-white dark:bg-secondary-950 border border-secondary-200 dark:border-secondary-750 focus:border-[#D97752] focus:ring-2 focus:ring-[#D97752]/10 rounded-md text-sm focus:outline-none text-secondary-900 dark:text-white transition-all placeholder-[#77706A]/40"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-[#3B2A22] dark:text-secondary-300 block">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    required
                    placeholder="seema_cn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-4 pr-4 h-[48px] bg-white dark:bg-secondary-950 border border-secondary-200 dark:border-secondary-750 focus:border-[#D97752] focus:ring-2 focus:ring-[#D97752]/10 rounded-md text-sm focus:outline-none text-secondary-900 dark:text-white transition-all placeholder-[#77706A]/40"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#3B2A22] dark:text-secondary-300 block">
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
                    className="w-full pl-4 pr-4 h-[48px] bg-white dark:bg-secondary-950 border border-secondary-200 dark:border-secondary-750 focus:border-[#D97752] focus:ring-2 focus:ring-[#D97752]/10 rounded-md text-sm focus:outline-none text-secondary-900 dark:text-white transition-all placeholder-[#77706A]/40"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-[#3B2A22] dark:text-secondary-300 block">
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
                    className="w-full pl-4 pr-4 h-[48px] bg-white dark:bg-secondary-950 border border-secondary-200 dark:border-secondary-750 focus:border-[#D97752] focus:ring-2 focus:ring-[#D97752]/10 rounded-md text-sm focus:outline-none text-secondary-900 dark:text-white transition-all placeholder-[#77706A]/40"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1 pb-1">
                <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-[#3B2A22] dark:text-secondary-300 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-4 pr-4 h-[48px] bg-white dark:bg-secondary-950 border border-secondary-200 dark:border-secondary-750 focus:border-[#D97752] focus:ring-2 focus:ring-[#D97752]/10 rounded-md text-sm focus:outline-none text-secondary-900 dark:text-white transition-all placeholder-[#77706A]/40"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] text-sm font-bold tracking-wider text-white bg-[#D97752] hover:bg-[#c5623e] hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm rounded-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'CREATE ACCOUNT →'
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="text-sm text-secondary-500 pt-1">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#D97752] hover:text-[#c5623e] transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
