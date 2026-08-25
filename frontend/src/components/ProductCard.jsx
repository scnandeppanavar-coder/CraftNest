import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { productId, name, stock, category } = product;

  const imageUrl =
  product.imageUrl || "https://via.placeholder.com/400x400?text=No+Image";

  const wishlisted = isWishlisted(productId);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please login to add products to your wishlist.', 'warning');
      navigate('/login');
      return;
    }

    if (isAdmin) {
      showToast('Admins cannot add products to wishlist.', 'warning');
      return;
    }

    if (wishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please login to add products to your cart.', 'warning');
      navigate('/login');
      return;
    }

    if (isAdmin) {
      showToast('Admins cannot add products to cart.', 'warning');
      return;
    }

    if (stock > 0) {
      addToCart(product, 1);
      showToast('Added to cart!', 'success');
    }
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please login to add products to your cart.', 'warning');
      navigate('/login');
      return;
    }

    if (isAdmin) {
      showToast('Admins cannot place orders.', 'warning');
      return;
    }

    if (stock > 0) {
      addToCart(product, 1);
      navigate('/cart');
    }
  };

  const mockRating = 4.0 + (productId % 10) * 0.1;

  return (
    <div className="group relative bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-primary-500/5 transition-all duration-300 flex flex-col h-full animate-fade-in-up">

      {!isAdmin && (
        <button
          onClick={handleWishlistClick}
          className={`absolute top-4 right-4 z-10 p-2.5 rounded-full border shadow-sm backdrop-blur-md transition-all active:scale-90 ${
            wishlisted
              ? 'bg-rose-50 border-rose-100 text-rose-500'
              : 'bg-white border-secondary-200 text-secondary-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      )}

      {stock <= 0 && (
        <span className="absolute top-4 left-4 z-10 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
          Out of Stock
        </span>
      )}

      {/* Product Image */}
      <Link
        to={`/products/${productId}`}
        className="block relative aspect-square overflow-hidden bg-gray-100"
      >
        <img
          src={imageUrl}
          alt={name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
          <span className="bg-white rounded-full p-3">
            <Eye className="w-4 h-4" />
          </span>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-1">

        <span className="text-xs font-semibold text-primary-500">
          {category?.categoryName}
        </span>

        <Link to={`/products/${productId}`}>
          <h3 className="font-bold text-lg mt-1 mb-2">{name}</h3>
        </Link>

        <p className="text-sm text-gray-500 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-4">

          <div>
            <span className="font-bold text-xl">
              ₹{product.price}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{mockRating.toFixed(1)}</span>
          </div>

        </div>

        {!isAdmin && (
          <div className="flex gap-2 mt-5">
            <button
              onClick={handleBuyNow}
              disabled={stock <= 0}
              className="flex-1 bg-primary-500 text-white py-2 rounded-xl hover:bg-primary-600 disabled:opacity-50"
            >
              Buy Now
            </button>

            <button
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className="p-2 border rounded-xl hover:bg-gray-100 disabled:opacity-50"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default ProductCard;