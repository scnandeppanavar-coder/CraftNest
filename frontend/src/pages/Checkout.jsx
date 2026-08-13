import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';
import { cartService } from '../services/cartService';
import { addressService } from '../services/addressService';

const Checkout = () => {
  const { cartItems, cartSubtotal, clearCartLocal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressSelect, setShowAddressSelect] = useState(false);
  
  const [paymentStatus, setPaymentStatus] = useState('PENDING'); // PENDING, SUCCESS, FAILED
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user?.userId) return;
      try {
        const list = await addressService.getAddresses(user.userId);
        setSavedAddresses(list);
        
        // Find default address
        const defaultAddr = list.find(addr => addr.isDefault);
        if (defaultAddr) {
          setName(defaultAddr.name);
          setPhone(defaultAddr.phone);
          setAddress(`${defaultAddr.streetAddress}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.zipCode}`);
        }
      } catch (err) {
        console.error('Failed to load saved addresses for checkout:', err);
      }
    };
    loadAddresses();
  }, [user?.userId]);

  const handleSelectAddress = (addr) => {
    setName(addr.name);
    setPhone(addr.phone);
    setAddress(`${addr.streetAddress}, ${addr.city}, ${addr.state} - ${addr.zipCode}`);
    setShowAddressSelect(false);
    showToast(`Shipping details updated to: ${addr.name}`, 'success');
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please sign in to proceed with payment', 'warning');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (user?.role === 'ADMIN') {
      showToast('Admins cannot place orders or checkout.', 'warning');
      navigate('/admin/dashboard');
      return;
    }

    if (!name || !email || !phone || !address) {
      showToast('Please fill all customer details', 'warning');
      return;
    }

    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'warning');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Razorpay order via Backend
      const orderData = await paymentService.createRazorpayOrder(cartSubtotal);
      
      const { orderId, amount, currency, key } = orderData;

      if (!window.Razorpay) {
        showToast('Razorpay SDK failed to load. Please check your network.', 'error');
        setLoading(false);
        return;
      }

      // 2. Configure Razorpay checkout options
      const options = {
        key: key, // Enter the Key ID generated from the Dashboard
        amount: amount * 100, // Amount is in currency subunits. (In Rupees * 100 paise)
        currency: currency,
        name: 'CraftNest',
        description: 'CraftNest Purchase',
        image: 'https://ik.imagekit.io/stringstackseema/handmade%20jewelry/logo.png',
        order_id: orderId, // Passed Razorpay Order ID from backend
        handler: async function (response) {
          // Razorpay callback on payment success
          setPaymentStatus('SUCCESS');
          showToast('Payment Successful! Processing Order...', 'success');

          try {
            // Place the order in the backend database
            // Note: Since cartItems are synced with database cart, placing the order clears the DB cart
            const orderPlacementResult = await orderService.placeOrder(user.userId);
            
            // Clear local React/localStorage cart
            clearCartLocal();
            
            // Extract or generate an order ID for display (since backend returns "Order placed successfully")
            const dateStr = new Date().toLocaleDateString();
            const orderDisplayId = response.razorpay_order_id || 'AC_' + Date.now();

            navigate('/order-success', {
              state: {
                orderId: orderDisplayId,
                paymentId: response.razorpay_payment_id,
                amount: amount,
                date: dateStr,
                status: 'SUCCESS',
              },
            });
          } catch (err) {
            console.error('Failed to place order in backend:', err);
            showToast('Payment succeeded but order logging failed. Contact support.', 'warning');
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        theme: {
          color: '#d67a57', // primary-500
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setPaymentStatus('FAILED');
            showToast('Payment Cancelled', 'warning');
          },
        },
      };

      // 3. Open Razorpay checkout portal
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setPaymentStatus('FAILED');
        showToast('Payment Failed. Please retry.', 'error');
        setLoading(false);
        console.error(response.error);
      });

      rzp.open();
    } catch (error) {
      console.error('Error initiating checkout:', error);
      showToast('Network error while initiating payment order.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-secondary-100 dark:border-secondary-800">
        <h1 className="font-outfit font-extrabold text-3xl text-secondary-900 dark:text-white tracking-tight">
          Checkout
        </h1>
        <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
          Complete your billing address and initiate payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left: Customer & Address Form */}
        <form onSubmit={handleCheckout} className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 sm:p-8 rounded-3xl transition-colors shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-secondary-100 dark:border-secondary-800 pb-3">
              <h3 className="font-outfit font-bold text-lg text-secondary-900 dark:text-white">
                Shipping & Customer Details
              </h3>
              {savedAddresses.length > 0 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAddressSelect(!showAddressSelect)}
                    className="px-3.5 py-1.5 border border-secondary-200 dark:border-secondary-750 hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-700 dark:text-white font-bold text-[10px] rounded-xl active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3 h-3" /> Select Saved Address
                  </button>
                  {showAddressSelect && (
                    <div className="absolute top-9 right-0 z-20 w-64 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-2xl shadow-xl p-2.5 space-y-1.5">
                      <p className="text-[9px] font-bold text-secondary-400 dark:text-secondary-500 uppercase tracking-wider px-1.5">
                        Your Addresses
                      </p>
                      <div className="max-h-[150px] overflow-y-auto space-y-1">
                        {savedAddresses.map((addr) => (
                          <button
                            key={addr.addressId}
                            type="button"
                            onClick={() => handleSelectAddress(addr)}
                            className="w-full text-left p-2 hover:bg-secondary-50 dark:hover:bg-secondary-800/60 border border-secondary-100 dark:border-secondary-850 rounded-xl transition-all flex flex-col gap-0.5 cursor-pointer"
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[10px] font-bold text-secondary-850 dark:text-white truncate max-w-[120px]">
                                {addr.name}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[7px] font-bold bg-primary-500 text-white px-1 py-0.2 rounded uppercase tracking-wider">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-secondary-500 dark:text-secondary-400 truncate">
                              {addr.streetAddress}, {addr.city}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all"
                />
              </div>

              {/* Phone */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                  Shipping Address
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="House No, Street, City, State, ZIP Code"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-sm focus:outline-none dark:text-white transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Link
              to="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary-500 hover:text-primary-500 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back To Cart
            </Link>

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="px-6 py-3.5 bg-primary-500 hover:bg-primary-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-500/10 hover:shadow-primary-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Securing Connection...
                </>
              ) : (
                <>
                  Proceed To Payment <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right: Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 rounded-3xl shadow-sm transition-colors space-y-6">
            <h3 className="font-outfit font-bold text-base text-secondary-900 dark:text-white border-b border-secondary-100 dark:border-secondary-800 pb-3">
              Order Items ({cartItems.length})
            </h3>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-850 rounded-xl overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=100&q=80"
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-secondary-800 dark:text-white truncate">
                      {item.productName}
                    </p>
                    <p className="text-[10px] text-secondary-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-secondary-900 dark:text-white">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-secondary-100 dark:border-secondary-800 pt-4 space-y-3">
              <div className="flex justify-between text-xs text-secondary-500">
                <span>Shipping Fees</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-outfit font-extrabold text-sm text-secondary-900 dark:text-white">
                <span>Grand Total</span>
                <span>₹{cartSubtotal}</span>
              </div>
            </div>

            <div className="p-4 bg-secondary-50 dark:bg-secondary-950 border border-secondary-200/50 dark:border-secondary-850 rounded-2xl flex gap-3 items-center">
              <ShieldCheck className="w-8 h-8 text-primary-500 shrink-0" />
              <div className="text-[10px] text-secondary-400 leading-relaxed">
                Your payment is secure. We verify order logs immediately upon payment verification using industry-standard SSL encryption.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
