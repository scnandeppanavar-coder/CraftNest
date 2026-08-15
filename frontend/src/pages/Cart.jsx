import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    cartSubtotal,
    updateCartItemQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  const [productImages, setProductImages] = useState({});

  useEffect(() => {
    const loadImages = async () => {
      const imagesMap = {};

      for (const item of cartItems) {
        try {
          const images = await productService.getProductImages(item.productId);

          imagesMap[item.productId] =
            images.length > 0
              ? images[0].imageUrl
              : 'https://via.placeholder.com/300x300?text=No+Image';
        } catch (err) {
          imagesMap[item.productId] =
            'https://via.placeholder.com/300x300?text=No+Image';
        }
      }

      setProductImages(imagesMap);
    };

    if (cartItems.length > 0) {
      loadImages();
    }
  }, [cartItems]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center max-w-md mx-auto p-8 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 rounded-3xl shadow-md my-12 animate-fade-in-up">
        <ShoppingBag className="w-14 h-14 text-primary-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Please login to view your cart</h2>
        <p className="text-sm text-secondary-500 mb-6">You need to sign in to access your shopping cart and manage your items.</p>
        <Link
          to="/login"
          state={{ from: { pathname: '/cart' } }}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold w-full active:scale-95 transition-all text-center"
        >
          Login
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <ShoppingBag className="w-14 h-14 text-primary-500 mb-4" />

        <h2 className="text-2xl font-bold">
          Your Cart is Empty
        </h2>

        <Link
          to="/products"
          className="mt-6 bg-primary-500 text-white px-6 py-3 rounded-xl"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Shopping Cart
        </h1>

        <Link
          to="/products"
          className="text-primary-500 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-4">

          {cartItems.map((item) => (

            <div
              key={item.productId}
              className="flex items-center gap-4 p-4 rounded-2xl border"
            >

              <img
                src={productImages[item.productId]}
                alt={item.productName}
                className="w-24 h-24 object-cover rounded-xl"
              />

              <div className="flex-1">

                <Link
                  to={`/products/${item.productId}`}
                  className="font-bold"
                >
                  {item.productName}
                </Link>

                <p>₹{item.price}</p>

              </div>

              <div className="flex items-center border rounded-lg">

                <button
                  onClick={() =>
                    updateCartItemQuantity(
                      item.productId,
                      item.quantity - 1
                    )
                  }
                  className="p-2"
                >
                  <Minus size={16} />
                </button>

                <span className="px-4">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateCartItemQuantity(
                      item.productId,
                      item.quantity + 1
                    )
                  }
                  className="p-2"
                >
                  <Plus size={16} />
                </button>

              </div>

              <div className="font-bold">
                ₹{item.price * item.quantity}
              </div>

              <button
                onClick={() => removeFromCart(item.productId)}
              >
                <Trash2 className="text-red-500" />
              </button>

            </div>

          ))}

        </div>

        <div className="border rounded-2xl p-6 h-fit">

          <h2 className="text-xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>₹{cartSubtotal}</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Shipping</span>
            <span>FREE</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{cartSubtotal}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full mt-6 bg-primary-500 text-white py-3 rounded-xl"
          >
            Proceed to Checkout
          </button>

        </div>

      </div>

    </div>
  );
};

export default Cart;