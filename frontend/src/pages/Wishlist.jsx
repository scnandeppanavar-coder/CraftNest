import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    // Construct product object matching cartService requirements
    const product = {
      productId: item.productId,
      name: item.productName,
      price: item.price,
    };
    addToCart(product, 1);
    removeFromWishlist(item.productId);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center max-w-md mx-auto p-8 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 rounded-3xl shadow-md my-12 animate-fade-in-up">
        <Heart className="w-14 h-14 text-rose-500 mb-4 fill-current" />
        <h2 className="text-2xl font-bold mb-2">Please login to view your wishlist</h2>
        <p className="text-sm text-secondary-500 mb-6">You need to sign in to access your bookmarked creations and manage your wishlist.</p>
        <Link
          to="/login"
          state={{ from: { pathname: '/wishlist' } }}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold w-full active:scale-95 transition-all text-center"
        >
          Login
        </Link>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
      React.useEffect(() => {
      console.log("Wishlist Items:", wishlistItems);
    }, [wishlistItems]);
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 rounded-3xl transition-colors shadow-sm max-w-2xl mx-auto my-12 animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 fill-current" />
        </div>
        <h2 className="font-outfit font-extrabold text-2xl text-secondary-900 dark:text-white tracking-tight">
          Your Wishlist is Empty
        </h2>
        <p className="mt-2 text-sm text-secondary-400 dark:text-secondary-500 max-w-sm">
          Bookmark items you love here! Return later to buy or move them to cart with a single click.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-bold text-sm rounded-full shadow-lg shadow-primary-500/10 hover:shadow-primary-600/20 transition-all"
        >
          Explore Unique Crafts <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="pb-4 border-b border-secondary-100 dark:border-secondary-800">
        <h1 className="font-outfit font-extrabold text-3xl text-secondary-900 dark:text-white tracking-tight">
          My Wishlist
        </h1>
        <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
          Your bookmarked craft creations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.wishlistId}
            className="group relative bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-primary-500/5 transition-all flex flex-col h-full animate-fade-in-up"
          >
            {/* Image Box */}
            <div className="relative aspect-video overflow-hidden bg-secondary-100 dark:bg-secondary-800 shrink-0">
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-550"
              />
              {/* Trash icon overlay */}
              <button
                onClick={() => removeFromWishlist(item.productId)}
                className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md rounded-full shadow border border-secondary-200 dark:border-secondary-750 text-secondary-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-5 flex flex-col justify-between flex-1 gap-4">
              <div>
                <Link
                  to={`/products/${item.productId}`}
                  className="font-outfit font-bold text-base text-secondary-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 line-clamp-1 transition-colors"
                >
                  {item.productName}
                </Link>
                <p className="text-xs text-secondary-400 mt-1">Handmade masterwork</p>
              </div>

              {/* Action and Price row */}
              <div className="flex items-center justify-between pt-3 border-t border-secondary-100 dark:border-secondary-800">
                <div className="flex flex-col">
                  <span className="text-[10px] text-secondary-400 uppercase tracking-wider">Price</span>
                  <span className="font-outfit font-extrabold text-base text-secondary-900 dark:text-white">
                    ₹{item.price}
                  </span>
                </div>
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs rounded-xl active:scale-95 transition-all shadow shadow-primary-500/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
