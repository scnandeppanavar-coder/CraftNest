import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Sparkles } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { CategorySkeleton } from '../components/SkeletonLoader';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  const images = [
    'https://ik.imagekit.io/stringstackseema/handmade%20jewelry/bag%20and%20accessories.png?updatedAt=1786125171820', // Clay Pottery
    'https://ik.imagekit.io/stringstackseema/handmade%20jewelry/gfts%20and%20cards.png?updatedAt=1786125169898', // Hand-woven Threads
    'https://ik.imagekit.io/stringstackseema/handmade%20jewelry/home%20decor.png?updatedAt=1786125170253', // Wooden Crafts
    'https://ik.imagekit.io/stringstackseema/handmade%20jewelry/jewelry.png?updatedAt=1786125170282', // Canvas Painting
    'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=500&q=80', // Jewelry / Beads
    'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=500&q=80', // Leather crafts
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20">
          <Sparkles className="w-3 h-3" /> Materials & Categories
        </span>
        <h1 className="font-outfit font-black text-3xl sm:text-4xl text-secondary-900 dark:text-white tracking-tight">
          Explore by Category
        </h1>
        <p className="text-sm text-secondary-400 dark:text-secondary-500">
          Each craft represents the meticulous hands of creators shaping organic materials like clay, teak, cotton, and leather.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(6)
            .fill(0)
            .map((_, idx) => (
              <CategorySkeleton key={idx} />
            ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <button
              key={cat.categoryId}
              onClick={() => handleCategoryClick(cat.categoryId)}
              className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-primary-500/5 transition-all text-left border border-secondary-200/50 dark:border-secondary-800 cursor-pointer animate-fade-in-up"
            >
              {/* Card Image */}
              <img
                src={images[idx % images.length]}
                alt={cat.categoryName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-950/90 via-secondary-950/20 to-transparent transition-opacity" />

              {/* Title info */}
              <div className="absolute bottom-6 left-6 right-6 space-y-1">
                <span className="inline-flex items-center gap-1 bg-white/10 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  <LayoutGrid className="w-3.5 h-3.5" /> Category
                </span>
                <h3 className="font-outfit font-extrabold text-xl text-white tracking-tight">
                  {cat.categoryName}
                </h3>
                <p className="text-xs text-secondary-300 font-medium">
                  Browse unique pieces crafted with {cat.categoryName.toLowerCase()} elements.
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-secondary-900 border border-secondary-200/60 dark:border-secondary-800 rounded-3xl">
          <p className="text-sm text-secondary-500">No categories found in the database. Please start the backend database server.</p>
        </div>
      )}
    </div>
  );
};

export default Category;
