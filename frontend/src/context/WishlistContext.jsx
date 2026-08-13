import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !user?.userId) return;
    setLoading(true);
    try {
      const data = await wishlistService.getWishlist(user.userId);
      console.log("Wishlist API Response:", JSON.stringify(data, null, 2));
      setWishlistItems(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.userId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, fetchWishlist]);

  const addToWishlist = async (productId) => {
    if (isAdmin) {
      showToast('Admins cannot add products to wishlist.', 'warning');
      return;
    }

    if (!isAuthenticated) {
      showToast('Please login to add items to wishlist', 'warning');
      return;
    }
    try {
      await wishlistService.addToWishlist(user.userId, productId);
      showToast('Added to wishlist!', 'success');
      fetchWishlist(); // Refresh to update items and badge count
    } catch (error) {
      showToast('Failed to add to wishlist', 'error');
      console.error(error);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAdmin) {
      showToast('Admins cannot remove products from wishlist.', 'warning');
      return;
    }

    if (!isAuthenticated) return;
    try {
      await wishlistService.removeFromWishlist(user.userId, productId);
      showToast('Removed from wishlist', 'success');
      fetchWishlist(); // Refresh
    } catch (error) {
      showToast('Failed to remove from wishlist', 'error');
      console.error(error);
    }
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
