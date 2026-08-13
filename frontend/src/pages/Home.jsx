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
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductSkeleton } from '../components/SkeletonLoader';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

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
    <div className="space-y-20 pb-16 animate-fade-in-up">
      <section className="relative overflow-hidden rounded-[30px] border border-[#F1E8DD] bg-[#FAF7F2] shadow-[0_30px_80px_rgba(109,82,53,0.08)] transition-all duration-500 dark:border-secondary-800 dark:bg-secondary-950">
        <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-[#F2E3C7]/60 blur-3xl dark:bg-primary-500/10" />
        <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-[#E9D7C6]/60 blur-3xl dark:bg-primary-500/10" />

        <div className="relative grid items-center gap-10 px-6 py-8 sm:px-10 md:px-12 lg:grid-cols-2 lg:px-16 lg:py-16">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E8D9C4] bg-white/80 px-4 py-2 text-sm font-bold text-[#7C5A3A] shadow-sm backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02] dark:border-secondary-700 dark:bg-secondary-900/80 dark:text-primary-300">
              <Sparkles className="h-4 w-4" />
              100% Handmade & Sustainable
            </span>

            <div className="space-y-4">
              <h1 className="font-outfit text-4xl font-black leading-[1.05] tracking-[-0.04em] text-[#2C241E] dark:text-white sm:text-5xl lg:text-6xl">
                Discover Authentic
                <span className="mt-2 block text-[#C88652] dark:text-primary-400">Handmade Crafts</span>
              </h1>

              <p className="max-w-xl text-base leading-8 text-[#5F584F] dark:text-secondary-300">
                Handpicked pieces made with soul, skill, and lasting quality. Explore artisan treasures designed to bring warmth, character, and story into everyday life.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#B9723D] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_35px_rgba(185,114,61,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a76331]"
              >
                Shop Collection
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-full border border-[#DABF9B] bg-white/80 px-6 py-3 text-sm font-bold text-[#533C2E] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B9723D] hover:bg-[#F8EDE3] dark:border-secondary-700 dark:bg-secondary-900/80 dark:text-primary-300 dark:hover:bg-secondary-800"
              >
                Explore Categories
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="group relative w-full max-w-[560px] overflow-hidden rounded-[28px] border border-[#E9D9C5] bg-white/40 p-3 shadow-[0_30px_70px_rgba(92,65,45,0.12)] transition-all duration-500 hover:shadow-[0_35px_80px_rgba(92,65,45,0.18)] dark:border-secondary-800 dark:bg-secondary-900/60">
              <div className="overflow-hidden rounded-[24px]">
                <img
                  src="https://images.openai.com/static-rsc-4/tqryxT7d0BCc659BvA5hSIEPwAsqrkbrbCBkJ_2lWzL2jmXNx2h-0dmbrfzWmD-pV7cF5ONnFJy51LVvW8E4ueIRjxdCj6UIHGIDPI4yKsotlrlyGSt7xKoD7uV9tP7mWIAArfols5Nqw5BGXIn6JKS9YkngbZyzJcQxX-D-i3MhVeAbrVDVRrnu6Y__3KNe?purpose=fullsize"
                  alt="Artisan Craft"
                  className="h-[440px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[520px]"
                />
              </div>
              
            </div>
          </div>
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
  );
};

export default Home;