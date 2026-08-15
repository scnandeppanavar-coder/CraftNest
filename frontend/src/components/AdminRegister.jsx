import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck, ArrowRight, ShieldAlert, Key } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const AdminRegister = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Multi-step states: 'form', 'otp', 'success'
  const [step, setStep] = useState('form');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState('');

  // Immediate role guard
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="mx-auto max-w-lg rounded-[30px] border border-[#FDE9E8] bg-white p-8 text-center shadow-[0_20px_50px_rgba(97,72,50,0.06)] dark:border-secondary-800 dark:bg-secondary-900/90">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FDE9E8] text-[#C75B4F] dark:bg-[#341D1D] dark:text-[#F7B1A7]">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h3 className="font-outfit text-xl font-bold text-[#C75B4F]">Access Denied</h3>
        <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
          You do not have administrative privileges to access this area.
        </p>
      </div>
    );
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAccessDeniedMessage('');

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
      await authService.registerAdmin(username, email, password, fullName);
      showToast('OTP sent successfully to the new admin email. Please verify.', 'success');
      setStep('otp');
    } catch (error) {
      console.error(error);
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        const msg = 'Access Denied: You do not have permission to register another administrator.';
        setAccessDeniedMessage(msg);
        showToast(msg, 'error');
      } else {
        const errMsg = error.response?.data?.message || 'Registration failed. Email or Username might be taken.';
        showToast(errMsg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      showToast('Please enter the OTP verification code', 'warning');
      return;
    }

    setVerifying(true);
    try {
      await authService.verifyAdminRegistrationOtp(email, otp);
      showToast('New Administrator account created successfully!', 'success');
      setStep('success');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Invalid or expired OTP code.';
      showToast(errMsg, 'error');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      {accessDeniedMessage && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 flex-shrink-0" />
          {accessDeniedMessage}
        </div>
      )}

      {step === 'form' && (
        <div className="rounded-[30px] border border-[#F0E6D8] bg-white p-6 shadow-[0_20px_50px_rgba(97,72,50,0.06)] dark:border-secondary-800 dark:bg-secondary-900/90 sm:p-8">
          <div className="mb-6 text-center">
            <h3 className="font-outfit text-2xl font-bold tracking-tight text-secondary-900 dark:text-white">
              Register New Admin
            </h3>
            <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
              Create another administrative credential securely.
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="mb-1.5 ml-1 block text-xs font-semibold text-secondary-500 dark:text-secondary-400">
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
                  className="w-full rounded-2xl border border-secondary-200 bg-secondary-50 py-3 pl-10 pr-4 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-750 dark:bg-secondary-800/50 dark:text-white"
                />
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-secondary-400" />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="mb-1.5 ml-1 block text-xs font-semibold text-secondary-500 dark:text-secondary-400">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="admin_seema"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-secondary-200 bg-secondary-50 py-3 pl-10 pr-4 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-750 dark:bg-secondary-800/50 dark:text-white"
                />
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-secondary-400" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 ml-1 block text-xs font-semibold text-secondary-500 dark:text-secondary-400">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@craftnest.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-secondary-200 bg-secondary-50 py-3 pl-10 pr-4 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-750 dark:bg-secondary-800/50 dark:text-white"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-secondary-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 ml-1 block text-xs font-semibold text-secondary-500 dark:text-secondary-400">
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
                  className="w-full rounded-2xl border border-secondary-200 bg-secondary-50 py-3 pl-10 pr-4 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-750 dark:bg-secondary-800/50 dark:text-white"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-secondary-400" />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 ml-1 block text-xs font-semibold text-secondary-500 dark:text-secondary-400">
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
                  className="w-full rounded-2xl border border-secondary-200 bg-secondary-50 py-3 pl-10 pr-4 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-750 dark:bg-secondary-800/50 dark:text-white"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-secondary-400" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#D67A57] py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-primary-500/10 transition-all hover:bg-[#c36a49] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Send Verification OTP <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'otp' && (
        <div className="rounded-[30px] border border-[#F0E6D8] bg-white p-6 shadow-[0_20px_50px_rgba(97,72,50,0.06)] dark:border-secondary-800 dark:bg-secondary-900/90 sm:p-8">
          <div className="mb-6 text-center">
            <h3 className="font-outfit text-2xl font-bold tracking-tight text-secondary-900 dark:text-white">
              Verify Admin OTP
            </h3>
            <p className="mt-2 text-xs text-secondary-500 dark:text-secondary-400">
              An OTP verification code was sent to <strong className="text-secondary-900 dark:text-white">{email}</strong>.
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label htmlFor="otp" className="mb-1.5 ml-1 block text-xs font-semibold text-secondary-500 dark:text-secondary-400">
                OTP Code
              </label>
              <div className="relative">
                <input
                  id="otp"
                  type="text"
                  required
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded-2xl border border-secondary-200 bg-secondary-50 py-3.5 pl-10 pr-4 text-center font-mono text-lg font-bold tracking-[0.25em] transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-secondary-750 dark:bg-secondary-800/50 dark:text-white"
                />
                <Key className="absolute left-3.5 top-4 h-4 w-4 text-secondary-400" />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-1/3 cursor-pointer rounded-2xl border border-secondary-200 py-3.5 text-center text-sm font-bold text-secondary-600 hover:bg-secondary-50 active:scale-[0.98] transition-all dark:border-secondary-750 dark:text-secondary-300 dark:hover:bg-secondary-800"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={verifying}
                className="flex w-2/3 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#D67A57] py-3.5 text-center text-sm font-bold text-white transition-all hover:bg-[#c36a49] active:scale-[0.98] disabled:opacity-50"
              >
                {verifying ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Verify & Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'success' && (
        <div className="rounded-[30px] border border-[#E8F6F9] bg-white p-8 text-center shadow-[0_20px_50px_rgba(97,72,50,0.06)] dark:border-secondary-800 dark:bg-secondary-900/90">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF6F1] text-[#2B8B6F] dark:bg-[#162E2A] dark:text-[#A4E3CC]">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h3 className="font-outfit text-2xl font-bold text-secondary-900 dark:text-white">
            Admin Created
          </h3>
          <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
            Admin account created successfully.
          </p>

          <div className="mt-6">
            <button
              onClick={() => navigate('/admin/login')}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#D67A57] py-3.5 px-8 text-sm font-bold text-white transition-all hover:bg-[#c36a49] active:scale-[0.98]"
            >
              Go to Admin Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegister;
