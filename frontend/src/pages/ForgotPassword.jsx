import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, HelpCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email', 'warning');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      showToast('Reset OTP sent successfully to your email.', 'success');
      navigate('/verify-forgot-password-otp', { state: { email } });
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Email not found';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 p-8 sm:p-10 rounded-3xl shadow-xl transition-colors">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 mb-4">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h2 className="font-outfit font-extrabold text-2xl text-secondary-900 dark:text-white tracking-tight">
            Forgot Password?
          </h2>
          <p className="mt-2 text-xs text-secondary-500 dark:text-secondary-400">
            Enter your registered email and we'll send you an OTP to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRequestOtp}>
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
                  Send OTP <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-secondary-400">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-primary-500 hover:text-primary-600 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
