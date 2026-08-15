import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { addressService } from '../services/addressService';
import { reviewService } from '../services/reviewService';
import { orderService } from '../services/orderService';
import {
  User,
  Mail,
  Shield,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Check,
  Package,
  Calendar,
  DollarSign,
  Heart,
  ShoppingCart,
  Star,
  MessageSquare,
  ChevronRight,
  UserPen,
  ClipboardList
} from 'lucide-react';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Active Tab State: 'details', 'addresses', 'orders', 'wishlist', 'reviews'
  const [activeTab, setActiveTab] = useState('details');

  // ==========================================
  // TABS MANAGEMENT & INLINE FORMS
  // ==========================================

  // Details States
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [editDetailsMode, setEditDetailsMode] = useState(false);
  const [updatingDetails, setUpdatingDetails] = useState(false);

  // Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Addresses States
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // AddressDto when editing
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [addressSubmitting, setAddressSubmitting] = useState(false);

  // Orders States
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Reviews States
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Synchronize Details when user context changes
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setFullName(user.fullName || '');
    }
  }, [user]);

  // Fetch Addresses
  const fetchAddresses = async () => {
    if (!user?.userId) return;
    setAddressesLoading(true);
    try {
      const data = await addressService.getAddresses(user.userId);
      setAddresses(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load saved addresses', 'error');
    } finally {
      setAddressesLoading(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    if (!user?.userId) return;
    setOrdersLoading(true);
    try {
      const data = await orderService.getOrders(user.userId);
      setOrders(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load order history', 'error');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Reviews
  const fetchReviews = async () => {
    if (!user?.userId) return;
    setReviewsLoading(true);
    try {
      const data = await reviewService.getUserReviews(user.userId);
      setReviews(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load reviews', 'error');
    } finally {
      setReviewsLoading(false);
    }
  };

  // Trigger loading based on active tab
  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab, user?.userId]);

  // ==========================================
  // PROFILE EDIT DETAILS ACTIONS
  // ==========================================
  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      showToast('Name and Email cannot be empty', 'warning');
      return;
    }
    setUpdatingDetails(true);
    try {
      const updated = await userService.updateProfile(user.userId, { username, email, fullName });
      updateUser({ username: updated.username, email: updated.email, fullName: updated.fullName });
      showToast('Profile details updated successfully', 'success');
      setEditDetailsMode(false);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Failed to update details. Email or Username might be taken.';
      showToast(errMsg, 'error');
    } finally {
      setUpdatingDetails(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('Please fill all password fields', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setChangingPassword(true);
    try {
      await authService.changePassword(user.email, oldPassword, newPassword, confirmPassword);
      showToast('Password updated successfully!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Failed to change password. Verify old password.';
      showToast(errMsg, 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  // ==========================================
  // ADDRESS CRUD ACTIONS
  // ==========================================
  const openAddAddressForm = () => {
    setEditingAddress(null);
    setAddrName('');
    setAddrPhone('');
    setAddrStreet('');
    setAddrCity('');
    setAddrState('');
    setAddrZip('');
    setAddrIsDefault(addresses.length === 0);
    setAddressFormOpen(true);
  };

  const openEditAddressForm = (addr) => {
    setEditingAddress(addr);
    setAddrName(addr.name);
    setAddrPhone(addr.phone);
    setAddrStreet(addr.streetAddress);
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrZip(addr.zipCode);
    setAddrIsDefault(addr.isDefault);
    setAddressFormOpen(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addrName || !addrPhone || !addrStreet || !addrCity || !addrState || !addrZip) {
      showToast('Please fill all address fields', 'warning');
      return;
    }

    setAddressSubmitting(true);
    const addressPayload = {
      name: addrName,
      phone: addrPhone,
      streetAddress: addrStreet,
      city: addrCity,
      state: addrState,
      zipCode: addrZip,
      isDefault: addrIsDefault,
    };

    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.addressId, addressPayload);
        showToast('Address updated successfully', 'success');
      } else {
        await addressService.addAddress(user.userId, addressPayload);
        showToast('Address added successfully', 'success');
      }
      setAddressFormOpen(false);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      showToast('Failed to save address', 'error');
    } finally {
      setAddressSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressService.deleteAddress(addressId);
      showToast('Address deleted successfully', 'success');
      fetchAddresses();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete address', 'error');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await addressService.setDefaultAddress(user.userId, addressId);
      showToast('Default address updated', 'success');
      fetchAddresses();
    } catch (err) {
      console.error(err);
      showToast('Failed to update default address', 'error');
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================
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

  const handleMoveToCart = (item) => {
    const product = {
      productId: item.productId,
      name: item.productName,
      price: item.price,
    };
    addToCart(product, 1);
    removeFromWishlist(item.productId);
    showToast('Moved item to cart', 'success');
  };

  // Sidebar Menu Items
  const menuItems = [
    { id: 'details', label: 'My Details', icon: User },
    { id: 'addresses', label: 'My Addresses', icon: MapPin },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart },
    { id: 'reviews', label: 'My Reviews', icon: MessageSquare },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="pb-4 border-b border-secondary-100 dark:border-secondary-800 flex justify-between items-center">
        <div>
          <h1 className="font-outfit font-extrabold text-3xl text-secondary-900 dark:text-white tracking-tight">
            Account Dashboard
          </h1>
          <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
            Redesigned e-commerce panel to manage details, addresses, and orders
          </p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-500 font-bold text-xs rounded-xl border border-rose-200/50 dark:border-rose-900/40 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-1 space-y-4">
          {/* User Brief Card */}
          <div className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 rounded-3xl text-center space-y-4 shadow-sm transition-colors">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-500 flex items-center justify-center border-4 border-white dark:border-secondary-900 shadow-sm">
              <User className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="font-outfit font-bold text-base text-secondary-900 dark:text-white truncate">
                {user?.username}
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20">
                <Shield className="w-3 h-3" /> {user?.role}
              </span>
            </div>
          </div>

          {/* Navigation Options */}
          <div className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 rounded-3xl p-3 shadow-sm transition-colors">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setAddressFormOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-md shadow-primary-500/10'
                        : 'text-secondary-500 hover:text-primary-500 hover:bg-secondary-50 dark:hover:bg-secondary-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'rotate-90' : 'opacity-50'}`} />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="lg:col-span-3">
          <div className="animate-fade-in-up">
            
            {/* ====================================================
                TAB: DETAILS & ACCOUNT
                ==================================================== */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Details Form Card */}
                <div className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 sm:p-8 rounded-3xl shadow-sm transition-colors space-y-6">
                  <div className="flex justify-between items-center border-b border-secondary-100 dark:border-secondary-800 pb-3">
                    <h3 className="font-outfit font-bold text-base text-secondary-900 dark:text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-primary-500" /> Personal Information
                    </h3>
                    {!editDetailsMode ? (
                      <button
                        onClick={() => setEditDetailsMode(true)}
                        className="text-xs text-primary-500 hover:text-primary-600 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" /> Edit Info
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditDetailsMode(false);
                          setUsername(user?.username || '');
                          setEmail(user?.email || '');
                          setFullName(user?.fullName || '');
                        }}
                        className="text-xs text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleUpdateDetails} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        disabled={!editDetailsMode}
                        placeholder="Not set"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 bg-secondary-50 disabled:opacity-75 disabled:bg-secondary-100/50 dark:bg-secondary-800/50 dark:disabled:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-xs focus:outline-none dark:text-white transition-all"
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                        Username
                      </label>
                      <input
                        type="text"
                        required
                        disabled={!editDetailsMode}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-secondary-50 disabled:opacity-75 disabled:bg-secondary-100/50 dark:bg-secondary-800/50 dark:disabled:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-xs focus:outline-none dark:text-white transition-all"
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
                        disabled={!editDetailsMode}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-secondary-50 disabled:opacity-75 disabled:bg-secondary-100/50 dark:bg-secondary-800/50 dark:disabled:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-xs focus:outline-none dark:text-white transition-all"
                      />
                    </div>

                    {editDetailsMode && (
                      <button
                        type="submit"
                        disabled={updatingDetails}
                        className="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold text-xs rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary-500/10"
                      >
                        {updatingDetails ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          'Save Personal Details'
                        )}
                      </button>
                    )}
                  </form>
                </div>

                {/* Change Password Card */}
                <div className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 sm:p-8 rounded-3xl shadow-sm transition-colors space-y-6">
                  <h3 className="font-outfit font-bold text-base text-secondary-900 dark:text-white border-b border-secondary-100 dark:border-secondary-800 pb-3 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-primary-500" /> Security & Password
                  </h3>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showOld ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-xs focus:outline-none dark:text-white transition-all"
                        />
                        <Lock className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-secondary-400" />
                        <button
                          type="button"
                          onClick={() => setShowOld(!showOld)}
                          className="absolute right-3.5 top-3.5 text-secondary-400 hover:text-secondary-650 transition-colors cursor-pointer"
                        >
                          {showOld ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNew ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-xs focus:outline-none dark:text-white transition-all"
                        />
                        <Lock className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-secondary-400" />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3.5 top-3.5 text-secondary-400 hover:text-secondary-650 transition-colors cursor-pointer"
                        >
                          {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 block mb-1.5 ml-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-2xl text-xs focus:outline-none dark:text-white transition-all"
                        />
                        <Lock className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-secondary-400" />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3.5 top-3.5 text-secondary-400 hover:text-secondary-650 transition-colors cursor-pointer"
                        >
                          {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-bold text-xs rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary-500/10"
                    >
                      {changingPassword ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ====================================================
                TAB: ADDRESSES
                ==================================================== */}
            {activeTab === 'addresses' && (
              <div className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 sm:p-8 rounded-3xl shadow-sm transition-colors space-y-6">
                <div className="flex justify-between items-center border-b border-secondary-100 dark:border-secondary-800 pb-4">
                  <div>
                    <h3 className="font-outfit font-bold text-base text-secondary-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary-500" /> Delivery Addresses
                    </h3>
                    <p className="text-[10px] text-secondary-400 dark:text-secondary-500 mt-0.5">
                      Configure your shipping addresses permanently for speedier checkout
                    </p>
                  </div>
                  {!addressFormOpen && (
                    <button
                      onClick={openAddAddressForm}
                      className="px-3.5 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Address
                    </button>
                  )}
                </div>

                {/* Inline Address Creation/Edit Form */}
                {addressFormOpen && (
                  <form onSubmit={handleAddressSubmit} className="p-5 bg-secondary-50 dark:bg-secondary-950 rounded-2xl border border-secondary-200/50 dark:border-secondary-850 space-y-4">
                    <h4 className="font-outfit font-bold text-xs text-secondary-800 dark:text-secondary-200 uppercase tracking-wider">
                      {editingAddress ? 'Modify Shipping Address' : 'Register New Address'}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="text-[10px] font-bold text-secondary-450 dark:text-secondary-400 block mb-1">
                          Recipient Full Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={addrName}
                          onChange={(e) => setAddrName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 focus:border-primary-500 rounded-xl text-xs focus:outline-none dark:text-white"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="text-[10px] font-bold text-secondary-450 dark:text-secondary-400 block mb-1">
                          Recipient Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 focus:border-primary-500 rounded-xl text-xs focus:outline-none dark:text-white"
                        />
                      </div>

                      {/* Street Address */}
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-secondary-450 dark:text-secondary-400 block mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Apartment, House no, Building, Street"
                          value={addrStreet}
                          onChange={(e) => setAddrStreet(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 focus:border-primary-500 rounded-xl text-xs focus:outline-none dark:text-white"
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="text-[10px] font-bold text-secondary-450 dark:text-secondary-400 block mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mumbai"
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 focus:border-primary-500 rounded-xl text-xs focus:outline-none dark:text-white"
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="text-[10px] font-bold text-secondary-450 dark:text-secondary-400 block mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Maharashtra"
                          value={addrState}
                          onChange={(e) => setAddrState(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 focus:border-primary-500 rounded-xl text-xs focus:outline-none dark:text-white"
                        />
                      </div>

                      {/* ZIP Code */}
                      <div>
                        <label className="text-[10px] font-bold text-secondary-450 dark:text-secondary-400 block mb-1">
                          ZIP / PIN Code
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="e.g. 400001"
                          value={addrZip}
                          onChange={(e) => setAddrZip(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 focus:border-primary-500 rounded-xl text-xs focus:outline-none dark:text-white"
                        />
                      </div>

                      {/* Default Toggle */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          disabled={!editingAddress && addresses.length === 0} // Always default if it's the only address
                          checked={addrIsDefault}
                          onChange={(e) => setAddrIsDefault(e.target.checked)}
                          className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 dark:bg-secondary-900 border-secondary-300 dark:border-secondary-700"
                        />
                        <label htmlFor="isDefault" className="text-xs font-semibold text-secondary-650 dark:text-secondary-450">
                          Set as Default Address
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-secondary-100 dark:border-secondary-850">
                      <button
                        type="button"
                        onClick={() => setAddressFormOpen(false)}
                        className="px-4 py-2 bg-secondary-200 hover:bg-secondary-300 dark:bg-secondary-800 dark:hover:bg-secondary-750 text-secondary-700 dark:text-secondary-250 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addressSubmitting}
                        className="px-5 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-primary-500/10"
                      >
                        {addressSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          'Save Address'
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Addresses List */}
                {addressesLoading ? (
                  <div className="py-12 flex justify-center">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-850 text-secondary-400 flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-outfit font-bold text-sm text-secondary-800 dark:text-secondary-200">
                        No Saved Addresses
                      </p>
                      <p className="text-xs text-secondary-450 dark:text-secondary-500 max-w-xs mx-auto">
                        Please save a shipping address. It will be pre-filled automatically during your purchases.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.addressId}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                          addr.isDefault
                            ? 'bg-primary-500/5 border-primary-500/35 dark:border-primary-500/20 shadow-sm'
                            : 'bg-white dark:bg-secondary-900 border-secondary-200/60 dark:border-secondary-800'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-outfit font-extrabold text-sm text-secondary-900 dark:text-white truncate">
                              {addr.name}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary-500 text-white uppercase tracking-wider shrink-0 shadow-sm">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-secondary-550 dark:text-secondary-400 leading-relaxed font-medium">
                            {addr.streetAddress},<br />
                            {addr.city}, {addr.state} - {addr.zipCode}
                          </p>
                          <p className="text-xs font-semibold text-secondary-500 dark:text-secondary-450">
                            Phone: {addr.phone}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-secondary-100 dark:border-secondary-800">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEditAddressForm(addr)}
                              className="p-1.5 bg-secondary-50 dark:bg-secondary-850 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg text-secondary-400 transition-colors cursor-pointer"
                              title="Edit address"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.addressId)}
                              className="p-1.5 bg-secondary-50 dark:bg-secondary-850 hover:text-rose-500 dark:hover:text-rose-455 rounded-lg text-secondary-400 transition-colors cursor-pointer"
                              title="Delete address"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.addressId)}
                              className="text-[10px] font-bold text-primary-500 hover:text-primary-600 flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" /> Set Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ====================================================
                TAB: ORDERS HISTORY
                ==================================================== */}
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 sm:p-8 rounded-3xl shadow-sm transition-colors space-y-6">
                <div className="border-b border-secondary-100 dark:border-secondary-800 pb-4">
                  <h3 className="font-outfit font-bold text-base text-secondary-900 dark:text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary-500" /> My Purchases & Orders
                  </h3>
                  <p className="text-[10px] text-secondary-400 dark:text-secondary-500 mt-0.5">
                    View tracking, receipting, and transaction info for your orders
                  </p>
                </div>

                {ordersLoading ? (
                  <div className="py-12 flex justify-center">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-850 text-secondary-400 flex items-center justify-center">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-outfit font-bold text-sm text-secondary-800 dark:text-secondary-200">
                        No Orders Placed
                      </p>
                      <p className="text-xs text-secondary-450 dark:text-secondary-500 max-w-xs mx-auto mb-2">
                        You have not placed any orders yet. Click below to browse beautiful handmade creations.
                      </p>
                      <Link
                        to="/products"
                        className="inline-flex items-center gap-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs rounded-xl active:scale-95 transition-all shadow-md shadow-primary-500/10"
                      >
                        Explore Crafts <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
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
                          className="bg-secondary-50 dark:bg-secondary-950 border border-secondary-200/50 dark:border-secondary-850 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-white dark:bg-secondary-900 rounded-xl border border-secondary-200/30 dark:border-secondary-800 text-secondary-500 shrink-0 shadow-sm">
                              <Package className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-outfit font-extrabold text-sm text-secondary-900 dark:text-white">
                                  Order #{order.orderId}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-[10px] text-secondary-450 dark:text-secondary-400 flex items-center gap-1 font-medium">
                                <Calendar className="w-3 h-3 text-secondary-400" /> {date}
                              </p>
                              <p className="text-xs font-bold text-primary-500 dark:text-primary-400 flex items-center">
                                <DollarSign className="w-3 h-3 inline shrink-0" /> {order.totalAmount}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center">
                            <Link
                              to={`/orders/${order.orderId}`}
                              className="w-full md:w-auto px-4 py-2 bg-white dark:bg-secondary-900 hover:bg-secondary-100 dark:hover:bg-secondary-850 text-secondary-800 dark:text-white border border-secondary-200 dark:border-secondary-750 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5 text-secondary-500" /> Details
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ====================================================
                TAB: WISHLIST
                ==================================================== */}
            {activeTab === 'wishlist' && (
              <div className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 sm:p-8 rounded-3xl shadow-sm transition-colors space-y-6">
                <div className="border-b border-secondary-100 dark:border-secondary-800 pb-4">
                  <h3 className="font-outfit font-bold text-base text-secondary-900 dark:text-white flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Bookmarked Wishlist
                  </h3>
                  <p className="text-[10px] text-secondary-400 dark:text-secondary-500 mt-0.5">
                    Creations you have saved to purchase later
                  </p>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-850 text-secondary-400 flex items-center justify-center">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-outfit font-bold text-sm text-secondary-800 dark:text-secondary-200">
                        Wishlist is Empty
                      </p>
                      <p className="text-xs text-secondary-450 dark:text-secondary-500 max-w-xs mx-auto mb-2">
                        Browse our unique collections and tap the heart icon to save crafts here.
                      </p>
                      <Link
                        to="/products"
                        className="inline-flex items-center gap-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs rounded-xl active:scale-95 transition-all shadow-md shadow-primary-500/10"
                      >
                        Find Unique Crafts <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.wishlistId}
                        className="group bg-secondary-50 dark:bg-secondary-950 border border-secondary-200/50 dark:border-secondary-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full"
                      >
                        <div className="relative aspect-video bg-secondary-100 dark:bg-secondary-800 overflow-hidden">
                          <img
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=300&q=80'}
                            alt={item.productName}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                          <button
                            onClick={() => {
                              removeFromWishlist(item.productId);
                              showToast('Removed from wishlist', 'info');
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-secondary-900/90 backdrop-blur border border-secondary-200/30 dark:border-secondary-800 rounded-full hover:text-rose-500 text-secondary-450 transition-colors shadow cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                          <div>
                            <Link
                              to={`/products/${item.productId}`}
                              className="font-outfit font-bold text-xs text-secondary-900 dark:text-white hover:text-primary-500 line-clamp-1 transition-colors"
                            >
                              {item.productName}
                            </Link>
                            <p className="text-[10px] text-secondary-400">Unique Craft Item</p>
                          </div>

                          <div className="flex items-center justify-between pt-2.5 border-t border-secondary-100 dark:border-secondary-850">
                            <span className="font-outfit font-extrabold text-xs text-secondary-950 dark:text-white">
                              ₹{item.price}
                            </span>
                            <button
                              onClick={() => handleMoveToCart(item)}
                              className="px-2.5 py-1.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-[10px] rounded-lg active:scale-95 transition-all shadow-sm shadow-primary-500/10 flex items-center gap-1 cursor-pointer"
                            >
                              <ShoppingCart className="w-3 h-3" /> Move
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ====================================================
                TAB: REVIEWS
                ==================================================== */}
            {activeTab === 'reviews' && (
              <div className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 sm:p-8 rounded-3xl shadow-sm transition-colors space-y-6">
                <div className="border-b border-secondary-100 dark:border-secondary-800 pb-4">
                  <h3 className="font-outfit font-bold text-base text-secondary-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary-500" /> My Submitted Reviews
                  </h3>
                  <p className="text-[10px] text-secondary-400 dark:text-secondary-500 mt-0.5">
                    Your opinions and reviews on crafts you've purchased
                  </p>
                </div>

                {reviewsLoading ? (
                  <div className="py-12 flex justify-center">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-850 text-secondary-400 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-outfit font-bold text-sm text-secondary-800 dark:text-secondary-200">
                        No Reviews Submitted
                      </p>
                      <p className="text-xs text-secondary-450 dark:text-secondary-500 max-w-xs mx-auto">
                        You have not reviewed any products yet. Purchase products and write your feedback on their detail pages!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => {
                      const date = new Date(rev.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      });
                      return (
                        <div
                          key={rev.reviewId}
                          className="p-5 bg-secondary-50 dark:bg-secondary-950 border border-secondary-200/50 dark:border-secondary-850 rounded-2xl flex gap-4"
                        >
                          <div className="w-12 h-12 bg-white dark:bg-secondary-900 border border-secondary-200/35 dark:border-secondary-800 rounded-xl overflow-hidden shrink-0 shadow-sm">
                            <img
                              src={rev.productImageUrl || 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=100&q=80'}
                              alt={rev.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-2">
                              <Link
                                to={`/products/${rev.productId}`}
                                className="font-outfit font-extrabold text-sm text-secondary-900 dark:text-white hover:text-primary-500 transition-colors"
                              >
                                {rev.productName}
                              </Link>
                              <span className="text-[10px] text-secondary-400 font-medium">
                                Review written on {date}
                              </span>
                            </div>

                            {/* Stars */}
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star
                                  key={idx}
                                  className={`w-3.5 h-3.5 ${
                                    idx < rev.rating
                                      ? 'text-amber-500 fill-amber-500'
                                      : 'text-secondary-300 dark:text-secondary-750'
                                  }`}
                                />
                              ))}
                            </div>

                            <p className="text-xs text-secondary-650 dark:text-secondary-400 italic pt-1 leading-relaxed">
                              "{rev.comment}"
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
