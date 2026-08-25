import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Compass,
  Leaf,
  BadgeCheck,
  Truck,
  Headphones,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductSkeleton } from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, justLoggedIn, setJustLoggedIn } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    if (justLoggedIn && user) {
      setJustLoggedIn(false);
      setShowWelcome(true);
      setIsClosing(false);

      // Start fade out at 1.7s
      const fadeOutTimer = setTimeout(() => {
        setIsClosing(true);
      }, 1700);

      // Hide popup completely at 2.0s
      const closeTimer = setTimeout(() => {
        setShowWelcome(false);
        setIsClosing(false);
      }, 2000);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [justLoggedIn, user, setJustLoggedIn]);

  // Carousel States
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Dynamic category mapping based on categories loaded from database
  const jewelleryCategory = categories.find(c => {
    const name = c.categoryName?.toLowerCase() || '';
    return name.includes('jewel') || name.includes('jewelry');
  });

  const homeDecorCategory = categories.find(c => {
    const name = c.categoryName?.toLowerCase() || '';
    return name.includes('decor') || name.includes('home') || name.includes('pottery') || name.includes('wood');
  });

  const bagsCategory = categories.find(c => {
    const name = c.categoryName?.toLowerCase() || '';
    return name.includes('bag') || name.includes('accessory') || name.includes('accessories');
  });

  const giftsCategory = categories.find(c => {
    const name = c.categoryName?.toLowerCase() || '';
    return name.includes('gift') || name.includes('card') || name.includes('thread');
  });

  const jewelleryLink = jewelleryCategory ? `/products?category=${jewelleryCategory.categoryId}` : '/products';
  const homeDecorLink = homeDecorCategory ? `/products?category=${homeDecorCategory.categoryId}` : '/products';
  const bagsLink = bagsCategory ? `/products?category=${bagsCategory.categoryId}` : '/products';
  const giftsLink = giftsCategory ? `/products?category=${giftsCategory.categoryId}` : '/products';

  const slides = [
    {
      badge: "Handmade Collection",
      heading: "Handmade Treasures, Made with Love",
      description: "Discover unique handcrafted creations made to bring warmth, beauty and personality to your everyday life.",
      buttonText: "Shop Collection",
      buttonLink: "/products",
      image: "/assets/hero_crafts.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=1200&q=80"
    },
    {
      badge: "Jewellery & Accessories",
      heading: "Add a Little Sparkle",
      description: "Discover beautiful handmade jewellery and accessories designed to make every moment special.",
      buttonText: "Explore Jewellery",
      buttonLink: jewelleryLink,
      image: "/assets/hero_jewellery.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80"
    },
    {
      badge: "Home Decor",
      heading: "Make Your Space Beautiful",
      description: "Bring warmth and character to your home with handcrafted decor made with care.",
      buttonText: "Explore Home Decor",
      buttonLink: homeDecorLink,
      image: "/assets/hero_decor.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80"
    },
    {
      badge: "Bags & Accessories",
      heading: "Style Made by Hand",
      description: "Explore unique handmade bags and accessories created for everyday style.",
      buttonText: "Explore Accessories",
      buttonLink: bagsLink,
      image: "/assets/hero_bags.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80"
    },
    {
      badge: "Gifts & Cards",
      heading: "Give Something Meaningful",
      description: "Find thoughtful handmade gifts for birthdays, celebrations and every special occasion.",
      buttonText: "Explore Gifts",
      buttonLink: giftsLink,
      image: "/assets/hero_gifts.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1512909002447-2a562abe3e3b?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Auto slide rotation (5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, isPaused]);

  // Touch handlers for mobile swipe gesture support
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % 5);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + 5) % 5);
    }
  };

  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + 5) % 5);
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % 5);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      setCurrentSlide((prev) => (prev - 1 + 5) % 5);
    } else if (e.key === 'ArrowRight') {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }
  };


  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories(),
        ]);
        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setNewsletterSubscribed(true);
      setEmailInput('');
    }
  };

  const catIcons = [
    'https://ik.imagekit.io/stringstackseema/handmade%20jewelry/bag%20and%20accessories.png?updatedAt=1786125171820',
    'https://ik.imagekit.io/stringstackseema/handmade%20jewelry/gfts%20and%20cards.png?updatedAt=1786125169898',
    'https://ik.imagekit.io/stringstackseema/handmade%20jewelry/home%20decor.png?updatedAt=1786125170253',
    'https://ik.imagekit.io/stringstackseema/handmade%20jewelry/jewelry.png?updatedAt=1786125170282',
  ];

  const trustFeatures = [
    {
      icon: Leaf,
      title: 'Eco Friendly',
      description: 'Thoughtfully sourced materials and low-impact production that respect the planet.',
    },
    {
      icon: BadgeCheck,
      title: 'Verified Makers',
      description: 'Each artisan is reviewed, authenticated, and celebrated for their craft.',
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Complimentary delivery on handcrafted essentials and gifting favorites.',
    },
    {
      icon: Headphones,
      title: 'Easy Support',
      description: 'Helpful guidance from our team to make every order feel personal and easy.',
    },
  ];

  const featuredProducts = products.slice(0, 4);
  const popularProducts = products.slice(2, 6);
  const newArrivals = [...products].reverse().slice(0, 4);

  return (
    <>
      {showWelcome && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            className={`w-[90%] max-w-md overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl transition-all duration-300 dark:bg-secondary-900 ${
              isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            {/* Elegant warm orange accent icon / header illustration */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-[#B9723D] dark:bg-primary-950/30 dark:text-[#E89E6C] shadow-inner">
              <HeartHandshake className="h-10 w-10 animate-bounce" />
            </div>

            <h2 className="font-outfit text-2xl font-black text-secondary-900 dark:text-white leading-tight">
              Welcome back,<br />
              <span className="text-[#B9723D] dark:text-[#E89E6C]">
                {user?.fullName || user?.username}! 👋
              </span>
            </h2>

            <p className="mt-4 text-sm text-secondary-500 dark:text-secondary-400 font-medium">
              We're so happy to see you again.
            </p>
            <p className="mt-1 text-xs text-secondary-400 dark:text-secondary-500">
              Explore unique handmade crafts made with love.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-20 pb-16 animate-fade-in-up">
      <section
        className="relative overflow-hidden rounded-[30px] border border-[#F1E8DD] bg-[#FAF7F2] shadow-[0_30px_80px_rgba(109,82,53,0.08)] transition-all duration-500 dark:border-secondary-800 dark:bg-secondary-950 w-full min-h-[640px] sm:min-h-[680px] lg:min-h-[520px] xl:min-h-[580px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B9723D] focus-visible:ring-offset-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex="0"
        aria-label="CraftNest Hero Carousel. Use arrow keys to navigate slides."
      >
        <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-[#F2E3C7]/60 blur-3xl dark:bg-primary-500/10 pointer-events-none" />
        <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-[#E9D7C6]/60 blur-3xl dark:bg-primary-500/10 pointer-events-none" />

        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full grid items-center gap-8 lg:gap-12 px-6 py-12 sm:px-12 lg:grid-cols-12 lg:px-16 lg:py-16 transition-all duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 pointer-events-auto z-10 scale-100"
                  : "opacity-0 pointer-events-none z-0 scale-[0.98]"
              }`}
              aria-hidden={!isActive}
            >
              {/* Left Side: Typography & Action */}
              <div className={`lg:col-span-7 space-y-6 sm:space-y-8 text-left transition-all duration-700 delay-100 ${isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#E8D9C4] bg-white/80 px-4 py-2 text-xs font-bold text-[#7C5A3A] shadow-sm backdrop-blur-sm dark:border-secondary-700 dark:bg-secondary-900/80 dark:text-primary-300">
                  <Sparkles className="h-3.5 w-3.5 text-[#B9723D]" />
                  {slide.badge}
                </span>

                <div className="space-y-4">
                  <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-[#2C241E] dark:text-white">
                    {slide.heading.split(', ')[0]}
                    {slide.heading.includes(', ') && (
                      <>
                        , <br className="hidden sm:inline" />
                        <span className="text-[#B9723D] dark:text-[#E89E6C]">
                          {slide.heading.split(', ')[1]}
                        </span>
                      </>
                    )}
                  </h1>

                  <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#5F584F] dark:text-secondary-300">
                    {slide.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    to={slide.buttonLink}
                    className="inline-flex items-center gap-2 rounded-full bg-[#B9723D] px-7 py-3.5 text-sm font-bold text-white shadow-[0_18px_35px_rgba(185,114,61,0.3)] hover:bg-[#a76331] active:scale-95 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#B9723D] focus:ring-offset-2"
                  >
                    {slide.buttonText}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Right Side: Visual Image */}
              <div className={`lg:col-span-5 flex justify-center lg:justify-end transition-all duration-700 delay-200 ${isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <div className="group relative w-full max-w-[460px] overflow-hidden rounded-[28px] border border-[#E9D9C5] bg-white/40 p-3 shadow-[0_30px_70px_rgba(92,65,45,0.12)] transition-all duration-500 hover:shadow-[0_35px_80px_rgba(92,65,45,0.18)] dark:border-secondary-800 dark:bg-secondary-900/60">
                  <div className="overflow-hidden rounded-[22px] aspect-[4/3] sm:aspect-square">
                    <img
                      src={slide.image}
                      alt={slide.heading}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = slide.fallbackImage;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[#DABF9B]/30 bg-white/60 text-[#7C5A3A] shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[#B9723D] hover:text-white dark:border-secondary-700 dark:bg-secondary-900/60 dark:text-primary-300 dark:hover:bg-[#B9723D] dark:hover:text-white cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-[#DABF9B]/30 bg-white/60 text-[#7C5A3A] shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[#B9723D] hover:text-white dark:border-secondary-700 dark:bg-secondary-900/60 dark:text-primary-300 dark:hover:bg-[#B9723D] dark:hover:text-white cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? "w-6 bg-[#B9723D] shadow-sm"
                  : "w-2.5 bg-secondary-300 hover:bg-secondary-400 dark:bg-secondary-700 dark:hover:bg-secondary-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : "false"}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {trustFeatures.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group rounded-[28px] border border-secondary-200/70 bg-white p-6 shadow-[0_18px_40px_rgba(104,82,62,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(104,82,62,0.12)] dark:border-secondary-800 dark:bg-secondary-900"
          >
            <div className="mb-5 inline-flex rounded-2xl bg-[#F8EDE3] p-3 text-[#B9723D] transition-all duration-300 group-hover:scale-105 dark:bg-primary-950/30 dark:text-primary-300">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-outfit text-xl font-bold text-secondary-900 dark:text-white">{title}</h3>
            <p className="text-sm leading-6 text-secondary-500 dark:text-secondary-400">{description}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B9723D] dark:text-primary-300">Collections</p>
            <h2 className="font-outfit text-3xl font-black tracking-[-0.04em] text-secondary-900 dark:text-white sm:text-4xl">
              Explore Handmade Categories
            </h2>
          </div>
          <Link
            to="/categories"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#B9723D] transition-colors hover:text-[#9c5c2d] dark:text-primary-300 dark:hover:text-primary-200"
          >
            See All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div key={idx} className="h-72 animate-pulse rounded-[28px] bg-secondary-100 dark:bg-secondary-800" />
                ))
            : categories.slice(0, 4).map((cat, idx) => (
                <Link
                  key={cat.categoryId}
                  to={`/products?category=${cat.categoryId}`}
                  className="group relative overflow-hidden rounded-[28px] border border-secondary-200 bg-white shadow-[0_18px_40px_rgba(124,92,64,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_50px_rgba(124,92,64,0.14)] dark:border-secondary-800 dark:bg-secondary-900"
                >
                  <div className="h-72 overflow-hidden">
                    <img
                      src={catIcons[idx % catIcons.length]}
                      alt={cat.categoryName}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/80 via-[#1c1917]/15 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                    <div>
                      <h3 className="font-outfit text-2xl font-black text-white">{cat.categoryName}</h3>
                      <p className="mt-1 text-sm text-white/75"></p>
                    </div>

                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-xl text-white backdrop-blur-sm transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#B9723D]">
                      →
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B9723D] dark:text-primary-300">Featured</p>
            <h2 className="font-outfit text-3xl font-black tracking-[-0.04em] text-secondary-900 dark:text-white sm:text-4xl">
              Best Sellers This Season
            </h2>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#B9723D] transition-colors hover:text-[#9c5c2d] dark:text-primary-300 dark:hover:text-primary-200"
          >
            View More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, idx) => <ProductSkeleton key={idx} />)
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((p) => <ProductCard key={p.productId} product={p} />)
          ) : (
            <div className="col-span-full py-12 text-center text-sm text-secondary-400">
              No products found. Run your backend or add mock items.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B9723D] dark:text-primary-300">Popular Picks</p>
            <h2 className="font-outfit text-3xl font-black tracking-[-0.04em] text-secondary-900 dark:text-white sm:text-4xl">
              Customer Favorites
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, idx) => <ProductSkeleton key={idx} />)
          ) : popularProducts.length > 0 ? (
            popularProducts.map((p) => <ProductCard key={p.productId} product={p} />)
          ) : (
            <div className="col-span-full py-12 text-center text-sm text-secondary-400">
              No products found.
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;