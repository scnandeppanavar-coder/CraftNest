import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Calendar, DollarSign, Eye, ArrowRight, ClipboardList } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { OrderSkeleton } from '../components/SkeletonLoader';

const Orders = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.userId) return;
      try {
        const data = await orderService.getOrders(user.userId);
        // Sort orders by orderId descending so latest order is shown first
        const sorted = data.sort((a, b) => b.orderId - a.orderId);
        setOrders(sorted);
      } catch (err) {
        console.error('Failed to load orders:', err);
        showToast('Failed to load order history', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.userId, showToast]);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED':
      case 'SUCCESS':
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-450 border border-emerald-500/20';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-450 border border-amber-500/20';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-450 border border-blue-500/20';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-455 border border-rose-500/20';
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-300 border border-secondary-600/20';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8">
        <div className="h-8 bg-secondary-200 dark:bg-secondary-800 rounded-full w-1/4 animate-pulse" />
        <div className="space-y-4">
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 rounded-3xl transition-colors shadow-sm max-w-2xl mx-auto my-12 animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-500 flex items-center justify-center mb-6">
          <ClipboardList className="w-10 h-10" />
        </div>
        <h2 className="font-outfit font-extrabold text-2xl text-secondary-900 dark:text-white tracking-tight">
          No Orders Placed Yet
        </h2>
        <p className="mt-2 text-sm text-secondary-400 dark:text-secondary-500 max-w-sm">
          You haven't placed any orders yet. Visit our craft shop and grab beautiful, handcrafted masterpieces.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-bold text-sm rounded-full shadow-lg shadow-primary-500/10 transition-all"
        >
          Browse Unique Crafts <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="pb-4 border-b border-secondary-100 dark:border-secondary-800">
        <h1 className="font-outfit font-extrabold text-3xl text-secondary-900 dark:text-white tracking-tight">
          My Order History
        </h1>
        <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
          Monitor your order status, delivery, and payment records
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const date = new Date(order.orderDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={order.orderId}
              className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-up"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary-100 dark:bg-secondary-850 rounded-2xl text-secondary-500 shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-outfit font-extrabold text-lg text-secondary-900 dark:text-white">
                      Order #{order.orderId}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-secondary-400" /> Placed on {date}
                  </p>
                  <p className="text-sm font-bold text-primary-500 dark:text-primary-400 flex items-center">
                    <DollarSign className="w-3.5 h-3.5 inline shrink-0" /> {order.totalAmount}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
               <Link
                to={`/orders/${order.orderId}`}
                className="w-full md:w-auto px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
