import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';

const VerifyRegistrationOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      showToast('Please fill all fields', 'warning');
      return;
    }
    if (otp.length !== 6) {
      showToast('OTP must be exactly 6 digits', 'warning');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyRegistrationOtp(email, otp);
      showToast('Registration successful! You can now login.', 'success');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Invalid or expired OTP';
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
        <div className="w-full lg:w-[42%] min-h-[500px] lg:h-[650px] bg-white dark:bg-secondary-900 rounded-xl shadow-sm flex items-center justify-center p-8 sm:p-12 lg:p-14 transition-all duration-300">
          <div className="w-full max-w-[380px] py-4 space-y-6 lg:space-y-8 flex flex-col justify-center h-full">

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
              <h2 className="font-outfit font-black text-3xl text-[#3B2A22] dark:text-white tracking-tight">
                Verify your email
              </h2>
              <p className="mt-2 text-sm text-[#77706A] dark:text-secondary-400">
                Enter the 6-digit code sent to your email.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleVerify}>
              <div className="space-y-4">
                {/* Email (readonly if passed from registration) */}
                <div className="space-y-1.5">
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
                      readOnly={!!location.state?.email}
                      className={`w-full pl-4 pr-4 h-[52px] border text-sm focus:outline-none dark:text-white transition-all rounded-md ${
                        location.state?.email
                          ? 'bg-secondary-150 dark:bg-secondary-800/20 border-secondary-200 dark:border-secondary-800 text-secondary-500 cursor-not-allowed'
                          : 'bg-white border-secondary-200 dark:border-secondary-750 focus:border-[#D97752] focus:ring-2 focus:ring-[#D97752]/10 text-secondary-900'
                      }`}
                    />
                  </div>
                </div>

                {/* OTP Code */}
                <div className="space-y-1.5">
                  <label htmlFor="otp" className="text-xs font-bold uppercase tracking-wider text-[#3B2A22] dark:text-secondary-300 block">
                    Verification OTP (6 Digits)
                  </label>
                  <div className="relative">
                    <input
                      id="otp"
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only digits
                      className="w-full pl-4 pr-4 h-[52px] bg-white dark:bg-secondary-950 border border-secondary-200 dark:border-secondary-750 focus:border-[#D97752] focus:ring-2 focus:ring-[#D97752]/10 rounded-md text-center text-lg font-bold tracking-widest focus:outline-none text-secondary-900 dark:text-white transition-all placeholder-[#77706A]/40"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] text-sm font-bold tracking-wider text-white bg-[#D97752] hover:bg-[#c5623e] hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm rounded-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'VERIFY & ACTIVATE →'
                )}
              </button>
            </form>

            {/* Footer Back link */}
            <div className="text-sm text-secondary-500 pt-1">
              <Link to="/login" className="font-bold text-[#D97752] hover:text-[#c5623e] transition-colors">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyRegistrationOtp;
