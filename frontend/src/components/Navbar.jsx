import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Sun, Moon, Menu, X, ChevronDown, Package, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { productService } from '../services/productService';

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
    <nav className="sticky top-0 z-40 bg-secondary-50/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
  to={isAuthenticated ? "/home" : "/"}
  className="flex items-center gap-2 group"
>
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 p-2 rounded-xl text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <img src="https://ik.imagekit.io/stringstackseema/handmade%20jewelry/logo.png" alt="CraftNest Logo" className="w-5 h-5 object-contain" />
              </span>
              <span className="font-outfit font-extrabold text-xl tracking-tight bg-gradient-to-r from-secondary-900 to-secondary-700 dark:from-white dark:to-secondary-300 bg-clip-text text-transparent">
                Craft<span className="text-primary-500 dark:text-primary-400">Nest</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to={isAuthenticated ? "/home" : "/"} className="text-sm font-semibold hover:text-primary-500 dark:hover:text-primary-400 text-secondary-600 dark:text-secondary-300 transition-colors">
  Home
</Link>
            <Link to="/categories" className="text-sm font-semibold hover:text-primary-500 dark:hover:text-primary-400 text-secondary-600 dark:text-secondary-300 transition-colors">
              Categories
            </Link>
            <Link to="/products" className="text-sm font-semibold hover:text-primary-500 dark:hover:text-primary-400 text-secondary-600 dark:text-secondary-300 transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-sm font-semibold hover:text-primary-500 dark:hover:text-primary-400 text-secondary-600 dark:text-secondary-300 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-semibold hover:text-primary-500 dark:hover:text-primary-400 text-secondary-600 dark:text-secondary-300 transition-colors">
              Contact
            </Link>
          </div>

          {/* Search bar & Icons */}
          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-sm mx-8">
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
                className="w-full pl-10 pr-4 py-2 text-sm bg-secondary-100 dark:bg-secondary-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-transparent focus:border-primary-500 dark:text-white transition-all"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-secondary-400" />
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
                  {suggestions.map((p) => (
                    <button
                      key={p.productId}
                      onClick={() => handleSuggestionClick(p.productId)}
                      className="w-full text-left px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 flex items-center gap-3 border-b border-secondary-100 dark:border-secondary-700/30 last:border-0 transition-colors"
                    >
                      <Search className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-secondary-800 dark:text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-secondary-400">{p.category?.categoryName || 'Product'}</p>
                      </div>
                      <span className="text-xs font-bold text-primary-500">₹{p.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:text-primary-500 dark:hover:text-primary-400 transition-all"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {!isAdmin && (
              <>
                <Link
                  to="/wishlist"
                  className="relative p-2 rounded-xl text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:text-rose-500 dark:hover:text-rose-400 transition-all"
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
                  className="relative p-2 rounded-xl text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:text-primary-500 dark:hover:text-primary-400 transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-primary-500 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-secondary-900">
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
                  className="flex items-center gap-1 p-1 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl transition-all"
                >
                  <span className="bg-primary-100 dark:bg-primary-950/50 p-1.5 rounded-xl text-primary-500 dark:text-primary-400">
                    <User className="w-4 h-4" />
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-secondary-500" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-850 rounded-2xl shadow-xl border border-secondary-200 dark:border-secondary-750 py-2 animate-fade-in-up">
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
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-primary-600 dark:text-primary-400 font-semibold hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
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
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left border-t border-secondary-100 dark:border-secondary-700/50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 active:scale-95 rounded-full shadow-md shadow-primary-500/10 hover:shadow-primary-600/20 transition-all"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 md:hidden rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-600 dark:text-secondary-300"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-secondary-100 dark:border-secondary-800 px-4 py-4 space-y-3 bg-white dark:bg-secondary-900 shadow-xl">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-secondary-100 dark:bg-secondary-800 rounded-full focus:outline-none dark:text-white"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-secondary-400" />
          </form>

          <div className="flex flex-col gap-2 pt-2">
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
               <div className="hidden sm:flex items-center gap-2">

                 <Link
                   to="/login"
                   className="px-4 py-2 text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-full transition-all"
                 >
                   Customer Login
                 </Link>

                 <Link
                   to="/admin/login"
                   className="px-4 py-2 text-xs font-bold text-white bg-secondary-800 hover:bg-secondary-900 rounded-full transition-all"
                 >
                   Admin Login
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
