import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email || !newPassword || !confirmPassword) {
      showToast('Please fill all fields', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(email, newPassword, confirmPassword);
      showToast('Password reset successfully! Log in with your new credentials.', 'success');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Password reset failed';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 p-8 sm:p-10 rounded-3xl shadow-xl transition-colors">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-600 mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-secondary-900 dark:text-white tracking-tight">
            Reset Your Password
          </h2>
          <p className="mt-2 text-xs text-secondary-500 dark:text-secondary-400">
            Please enter your email and specify a secure new password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleReset}>
          <div className="space-y-4">
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
                  readOnly={!!location.state?.email}
                  className={`w-full pl-10 pr-4 py-3 border rounded-2xl text-sm focus:outline-none dark:text-white transition-all ${
                    location.state?.email
                      ? 'bg-secondary-100 dark:bg-secondary-800/20 border-secondary-200 dark:border-secondary-800 text-secondary-500'
                      : 'bg-secondary-50 dark:bg-secondary-800/50 border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                  }`}
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary-400" />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary-400" />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary-400" />
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
                'Reset Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
