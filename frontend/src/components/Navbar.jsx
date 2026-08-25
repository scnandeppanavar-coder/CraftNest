import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Sun, Moon, Menu, X, ChevronDown, Package, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { productService } from '../services/productService';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { toggleTheme, isDark } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Clear suggestions on route change
  useEffect(() => {
    setShowSuggestions(false);
    setSearchQuery('');
    setIsOpen(false);
  }, [location]);

  // Live search autocomplete suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const results = await productService.searchProducts(searchQuery);
        setSuggestions(results.slice(0, 5)); // cap at 5 recommendations
      } catch (err) {
        console.error('Failed to load suggestions:', err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/products/${productId}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-secondary-900 border-b border-secondary-100 dark:border-secondary-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Logo />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 xl:gap-8 mx-auto">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/'
                  ? 'text-[#B9723D]'
                  : 'text-secondary-600 dark:text-secondary-300 hover:text-[#B9723D] dark:hover:text-[#E89E6C]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/categories"
              className={`text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/categories')
                  ? 'text-[#B9723D]'
                  : 'text-secondary-600 dark:text-secondary-300 hover:text-[#B9723D] dark:hover:text-[#E89E6C]'
              }`}
            >
              Categories
            </Link>
            <Link
              to="/products"
              className={`text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/products') && !location.pathname.includes('categories')
                  ? 'text-[#B9723D]'
                  : 'text-secondary-600 dark:text-secondary-300 hover:text-[#B9723D] dark:hover:text-[#E89E6C]'
              }`}
            >
              Products
            </Link>
            <Link
              to="/about"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/about'
                  ? 'text-[#B9723D]'
                  : 'text-secondary-600 dark:text-secondary-300 hover:text-[#B9723D] dark:hover:text-[#E89E6C]'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/contact'
                  ? 'text-[#B9723D]'
                  : 'text-secondary-600 dark:text-secondary-300 hover:text-[#B9723D] dark:hover:text-[#E89E6C]'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Large Rounded Search bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs xl:max-w-sm mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full" ref={searchRef}>
              <input
                type="text"
                placeholder="Search unique crafts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-secondary-50 dark:bg-secondary-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B9723D]/30 border border-secondary-200 dark:border-secondary-700 focus:border-[#B9723D] dark:text-white transition-all placeholder-secondary-400"
              />
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-secondary-400" />
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-13 left-0 right-0 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto z-50 animate-fade-in-up">
                  {suggestions.map((p) => (
                    <button
                      key={p.productId}
                      onClick={() => handleSuggestionClick(p.productId)}
                      className="w-full text-left px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 flex items-center gap-3 border-b border-secondary-100 dark:border-secondary-700/30 last:border-0 transition-colors cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-secondary-800 dark:text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-secondary-400">{p.category?.categoryName || 'Product'}</p>
                      </div>
                      <span className="text-xs font-bold text-[#B9723D]">₹{p.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-[#B9723D] dark:hover:text-[#E89E6C] transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {!isAdmin && (
              <>
                <Link
                  to="/wishlist"
                  className="relative p-2 rounded-full text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-rose-500 dark:hover:text-rose-400 transition-all"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-secondary-900 animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="relative p-2 rounded-full text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:text-[#B9723D] dark:hover:text-[#E89E6C] transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-[#B9723D] text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-secondary-900">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}


            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 p-1 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-full transition-all cursor-pointer"
                >
                  <span className="bg-primary-50 dark:bg-primary-950/30 p-1.5 rounded-full text-[#B9723D] dark:text-[#E89E6C]">
                    <User className="w-4 h-4" />
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-secondary-500" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-secondary-850 rounded-2xl shadow-xl border border-secondary-100 dark:border-secondary-750 py-2 animate-fade-in-up z-50">
                    <div className="px-4 py-2 border-b border-secondary-100 dark:border-secondary-700/50">
                      <p className="text-xs font-semibold text-secondary-900 dark:text-white truncate">
                        {user?.username}
                      </p>
                      <p className="text-[10px] text-secondary-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
                    >
                      <User className="w-3.5 h-3.5" /> Profile
                    </Link>

                    {isAdmin ? (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-[#B9723D] dark:text-[#E89E6C] font-semibold hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" /> Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
                      >
                        <Package className="w-3.5 h-3.5" /> My Orders
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left border-t border-secondary-100 dark:border-secondary-700/50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-5 py-2 text-xs font-bold text-white bg-[#B9723D] hover:bg-[#a76331] active:scale-95 rounded-full shadow-md shadow-[#B9723D]/10 hover:shadow-[#B9723D]/20 transition-all cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-2 text-xs font-bold border border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-200 bg-white dark:bg-transparent hover:bg-secondary-50 dark:hover:bg-secondary-800 active:scale-95 rounded-full transition-all cursor-pointer"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 md:hidden rounded-full hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-600 dark:text-secondary-300 cursor-pointer"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-secondary-100 dark:border-secondary-800 px-4 py-4 space-y-3 bg-white dark:bg-secondary-900 shadow-xl animate-fade-in-up">

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search unique crafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-full focus:outline-none dark:text-white"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-secondary-400" />
          </form>

          <div className="flex flex-col gap-1.5 pt-2">
            <Link to="/" className="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-200">
              Home
            </Link>
            <Link to="/categories" className="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-200">
              Categories
            </Link>
            <Link to="/products" className="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-200">
              Products
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-200">
              About
            </Link>
            <Link to="/contact" className="px-3 py-2 rounded-xl text-sm font-semibold hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-200">
              Contact
            </Link>
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-3 border-t border-secondary-100 dark:border-secondary-800">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 text-sm font-bold text-white bg-[#B9723D] hover:bg-[#a76331] rounded-full transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 text-sm font-bold border border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-200 bg-white dark:bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
