import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Star, ShieldAlert, Sparkles, Check, HeartHandshake } from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAdmin } = useAuth();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const wishlisted = isWishlisted(product?.productId);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const prodData = await productService.getProductById(parseInt(id));
        setProduct(prodData);

        // Try to fetch images from backend
        let imgData = [];
        try {
          imgData = await productService.getProductImages(parseInt(id));
        } catch (e) {
          console.log('No images available from backend, using fallback.');
        }

        // Generate fallbacks
        const finalImages =
  imgData.length > 0
    ? imgData.map((img) => img.imageUrl)
    : ["https://via.placeholder.com/600x600?text=No+Image"];
        setImages(finalImages);
        setSelectedImage(finalImages[0]);
      } catch (err) {
        console.error('Failed to load product:', err);
        showToast('Product not found', 'error');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, navigate]);

  const handleWishlistToggle = () => {
    if (isAdmin) {
      showToast('Admins cannot add products to wishlist.', 'warning');
      return;
    }

    if (wishlisted) {
      removeFromWishlist(product.productId);
    } else {
      addToWishlist(product.productId);
    }
  };

  const handleAddToCart = () => {
    if (isAdmin) {
      showToast('Admins cannot add products to cart.', 'warning');
      return;
    }

    if (product && product.stock > 0) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (isAdmin) {
      showToast('Admins cannot place orders.', 'warning');
      return;
    }

    if (product && product.stock > 0) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-secondary-500">Loading mastercraft details...</p>
      </div>
    );
  }

  if (!product) return null;

  const mockRating = 4.0 + (product.productId % 10) * 0.1;

  return (
    <div className="space-y-10 pb-16">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary-500 hover:text-primary-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-secondary-100 dark:bg-secondary-800 rounded-3xl overflow-hidden border border-secondary-200/60 dark:border-secondary-800 shadow-sm relative group">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all"
            />
            {product.stock <= 0 && (
              <span className="absolute top-4 left-4 z-10 px-3 py-1.5 text-xs font-extrabold tracking-wider uppercase bg-secondary-950 text-white rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 aspect-square rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedImage === img
                      ? 'border-primary-500 scale-95'
                      : 'border-secondary-200 hover:border-secondary-400 dark:border-secondary-850 dark:hover:border-secondary-700'
                  }`}
                >
                  <img src={img} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info and Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 bg-primary-100 dark:bg-primary-950/40 text-primary-650 dark:text-primary-400 rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Handcrafted
            </span>
            <h1 className="font-outfit font-extrabold text-3xl sm:text-4xl text-secondary-900 dark:text-white leading-tight tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-sm mt-2">
              <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg text-amber-600 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {mockRating.toFixed(1)}
              </div>
              <span className="text-secondary-300 dark:text-secondary-750">|</span>
              <span className="text-secondary-500 dark:text-secondary-400 font-semibold">
                Category: {product.category?.categoryName || 'General Craft'}
              </span>
            </div>
          </div>

          <div className="bg-secondary-50 dark:bg-secondary-900/60 p-5 rounded-2xl border border-secondary-200/50 dark:border-secondary-800 transition-colors">
            <span className="text-xs text-secondary-400 font-semibold block mb-1">Price</span>
            <span className="font-outfit font-black text-3xl text-secondary-900 dark:text-white">
              ₹{product.price}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2 border-b border-secondary-100 dark:border-secondary-800 pb-6">
            <h3 className="font-outfit font-bold text-secondary-900 dark:text-white text-base">Description</h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed">
              {product.description || 'This magnificent craft creation highlights artisan brilliance using organic textures and raw compositions. Painstakingly designed, it provides a distinctive rustic luxury statement.'}
            </p>
          </div>

          {/* Stock state */}
          <div className="flex items-center gap-3 py-1.5 text-sm font-semibold">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1.5 text-emerald-600">
                <Check className="w-4 h-4" /> In Stock ({product.stock} units available)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-3 py-1 rounded-xl">
                <ShieldAlert className="w-4 h-4" /> Out of stock
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 py-2">
              <span className="text-sm font-bold text-secondary-600 dark:text-secondary-300">Quantity:</span>
              <div className="flex items-center border border-secondary-200 dark:border-secondary-800 rounded-2xl overflow-hidden bg-white dark:bg-secondary-900">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-secondary-50 dark:hover:bg-secondary-800 font-bold dark:text-white transition-colors"
                >
                  -
                </button>
                <span className="px-4 text-sm font-extrabold dark:text-white w-12 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-4 py-2 hover:bg-secondary-50 dark:hover:bg-secondary-800 font-bold dark:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {!isAdmin && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 px-6 font-bold text-sm text-white bg-primary-500 hover:bg-primary-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 rounded-2xl shadow-lg shadow-primary-500/20 transition-all cursor-pointer"
              >
                Buy It Now
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="px-6 py-3.5 font-bold text-sm border border-secondary-200 dark:border-secondary-800 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 active:scale-95 disabled:opacity-50 disabled:active:scale-100 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-3.5 rounded-2xl border transition-all active:scale-90 flex items-center justify-center cursor-pointer ${
                  wishlisted
                    ? 'bg-rose-50 border-rose-100 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900'
                    : 'border-secondary-200 dark:border-secondary-800 text-secondary-500 hover:text-rose-500 dark:text-secondary-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
