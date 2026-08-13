import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  // Load guest cart from localStorage
  const getGuestCart = () => {
    const saved = localStorage.getItem('guest_cart');
    return saved ? JSON.parse(saved) : [];
  };

  // Merge items by productId and sum quantities
  const mergeCartItems = (items) => {
    const merged = items.reduce((acc, item) => {
      const existingIndex = acc.findIndex((i) => i.productId === item.productId);
      if (existingIndex > -1) {
        acc[existingIndex].quantity += item.quantity;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);
    return merged.filter((item) => item.quantity > 0);
  };

  // Fetch from database and merge
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user?.userId) return;
    setLoading(true);
    try {
      const data = await cartService.getCart(user.userId);
      // Data is a list of CartDto (which represents database rows).
      // We must merge rows by productId
      const merged = mergeCartItems(data);
      setCartItems(merged);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.userId]);

  // Sync guest cart to database upon login
  useEffect(() => {
    const syncGuestCart = async () => {
      if (isAuthenticated && user?.userId) {
        const guestItems = getGuestCart();
        if (guestItems.length > 0) {
          setLoading(true);
          try {
            for (const item of guestItems) {
              await cartService.addToCart(user.userId, item.productId, item.quantity);
            }
            localStorage.removeItem('guest_cart');
            showToast('Merged your local cart with your account', 'success');
          } catch (err) {
            console.error('Failed to sync guest cart:', err);
          }
        }
        fetchCart();
      } else {
        // Load guest cart
        setCartItems(getGuestCart());
      }
    };
    syncGuestCart();
  }, [isAuthenticated, user?.userId, fetchCart]);

  // Add Item
  const addToCart = async (product, quantity = 1) => {
    const { productId, name, price } = product;

    if (isAdmin) {
      showToast('Admins cannot add items to cart.', 'warning');
      return;
    }

    if (isAuthenticated && user?.userId) {
      try {
        await cartService.addToCart(user.userId, productId, quantity);
        showToast(`Added ${name} to cart!`, 'success');
        fetchCart();
      } catch (error) {
        showToast('Failed to add to cart', 'error');
        console.error(error);
      }
    } else {
      // Guest User
      const currentGuest = getGuestCart();
      const updated = [...currentGuest, { productId, productName: name, price, quantity }];
      const merged = mergeCartItems(updated);
      localStorage.setItem('guest_cart', JSON.stringify(merged));
      setCartItems(merged);
      showToast(`Added ${name} to cart!`, 'success');
    }
  };

  // Update quantity (Delta offset strategy for backend)
  const updateCartItemQuantity = async (productId, newQuantity) => {
    if (isAdmin) {
      showToast('Admins cannot update cart items.', 'warning');
      return;
    }

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const currentItem = cartItems.find((item) => item.productId === productId);
    if (!currentItem) return;

    const delta = newQuantity - currentItem.quantity;
    if (delta === 0) return;

    if (isAuthenticated && user?.userId) {
      try {
        await cartService.addToCart(user.userId, productId, delta);
        fetchCart();
      } catch (error) {
        showToast('Failed to update quantity', 'error');
        console.error(error);
      }
    } else {
      // Guest User
      const currentGuest = getGuestCart();
      const itemIndex = currentGuest.findIndex((i) => i.productId === productId);
      if (itemIndex > -1) {
        currentGuest[itemIndex].quantity = newQuantity;
      }
      localStorage.setItem('guest_cart', JSON.stringify(currentGuest));
      setCartItems(currentGuest);
    }
  };

  // Remove Item (Negative offset matching total quantity)
  const removeFromCart = async (productId) => {
    if (isAdmin) {
      showToast('Admins cannot remove cart items.', 'warning');
      return;
    }

    const currentItem = cartItems.find((item) => item.productId === productId);
    if (!currentItem) return;

    if (isAuthenticated && user?.userId) {
      try {
        // Send a negative quantity equal to the current quantity to make the sum 0
        await cartService.addToCart(user.userId, productId, -currentItem.quantity);
        showToast('Item removed from cart', 'success');
        fetchCart();
      } catch (error) {
        showToast('Failed to remove from cart', 'error');
        console.error(error);
      }
    } else {
      // Guest User
      const currentGuest = getGuestCart();
      const filtered = currentGuest.filter((item) => item.productId !== productId);
      localStorage.setItem('guest_cart', JSON.stringify(filtered));
      setCartItems(filtered);
      showToast('Item removed from cart', 'success');
    }
  };

  // Clear Cart Local (after order placement)
  const clearCartLocal = () => {
    setCartItems([]);
    localStorage.removeItem('guest_cart');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        loading,
        fetchCart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCartLocal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
