import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ListOrdered, Calendar, CreditCard, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const details = location.state || {
    orderId: 'AC_' + Date.now(),
    paymentId: 'pay_' + Math.random().toString(36).substr(2, 9),
    amount: 0,
    date: new Date().toLocaleDateString(),
    status: 'SUCCESS',
  };

  useEffect(() => {
    // Show a success message on mount
    showToast('Your order has been recorded!', 'success');
  }, [showToast]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 p-8 sm:p-10 rounded-3xl shadow-xl transition-colors text-center relative overflow-hidden animate-fade-in-up">
        {/* Decorative sparkles */}
        <div className="absolute -top-10 -left-10 text-primary-500/10 animate-pulse">
          <Sparkles className="w-32 h-32" />
        </div>
        
        <div className="space-y-4 relative z-10">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 mb-4 animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="font-outfit font-black text-2xl sm:text-3xl text-secondary-900 dark:text-white tracking-tight">
            Order Placed!
          </h2>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Payment has been successfully processed and your artisan crafts are now being prepared.
          </p>
        </div>

        {/* Invoice details */}
        <div className="bg-secondary-50 dark:bg-secondary-950/60 border border-secondary-200/40 dark:border-secondary-850 p-6 rounded-2xl text-left space-y-3 relative z-10 text-xs sm:text-sm">
          <div className="flex justify-between items-center text-secondary-500">
            <span className="flex items-center gap-1"><ListOrdered className="w-3.5 h-3.5" /> Order ID</span>
            <span className="font-bold text-secondary-900 dark:text-white">{details.orderId}</span>
          </div>
          <div className="flex justify-between items-center text-secondary-500">
            <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Payment ID</span>
            <span className="font-bold text-secondary-900 dark:text-white truncate max-w-[150px]">{details.paymentId}</span>
          </div>
          <div className="flex justify-between items-center text-secondary-500">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date</span>
            <span className="font-bold text-secondary-900 dark:text-white">{details.date}</span>
          </div>
          <div className="flex justify-between items-center text-secondary-500">
            <span>Payment Status</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20">
              {details.status}
            </span>
          </div>
          <div className="border-t border-secondary-200 dark:border-secondary-800 pt-3 flex justify-between items-center font-outfit font-extrabold text-sm sm:text-base text-secondary-900 dark:text-white">
            <span>Paid Amount</span>
            <span>₹{details.amount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 relative z-10">
          <Link
            to="/products"
            className="flex-1 py-3 px-4 font-bold text-xs text-white bg-primary-500 hover:bg-primary-600 active:scale-95 rounded-2xl shadow transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="flex-1 py-3 px-4 font-bold text-xs border border-secondary-200 dark:border-secondary-800 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 active:scale-95 rounded-2xl transition-all flex items-center justify-center gap-1.5"
          >
            <ListOrdered className="w-3.5 h-3.5" /> View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
