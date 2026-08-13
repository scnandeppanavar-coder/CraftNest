import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductSkeleton } from '../components/SkeletonLoader';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active filters
  const [keyword, setKeyword] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('nameAsc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sync state with URL search params on mount / route change
  useEffect(() => {
    setKeyword(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Load Categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch filtered products
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const filters = {
        keyword: keyword || undefined,
        categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy: sortBy || undefined,
      };

      const data = await productService.filterProducts(filters);
      setProducts(data);
      setCurrentPage(1); // reset to page 1 on filter changes
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch products when filters or sort change
  useEffect(() => {
    fetchFilteredProducts();
  }, [keyword, selectedCategory, minPrice, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('nameAsc');
    setSearchParams({});
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 rounded-3xl transition-colors shadow-sm">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl text-secondary-900 dark:text-white tracking-tight">
            Craft Catalog
          </h1>
          <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
            Showing {products.length} unique handcrafted creations
          </p>
        </div>

        {/* Top level search input */}
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search catalog by name or keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-750 focus:border-primary-500 rounded-2xl text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary-400" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 rounded-3xl space-y-8 h-fit shadow-sm transition-colors">
          <div className="flex items-center justify-between border-b border-secondary-100 dark:border-secondary-800 pb-4">
            <h3 className="font-outfit font-extrabold text-base text-secondary-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary-500" /> Filters
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Categories Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider block">
              Categories
            </label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === ''
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/10'
                    : 'bg-secondary-50 dark:bg-secondary-800 text-secondary-650 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-750'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.categoryId}
                  onClick={() => setSelectedCategory(cat.categoryId.toString())}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat.categoryId.toString()
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/10'
                      : 'bg-secondary-50 dark:bg-secondary-800 text-secondary-650 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-750'
                  }`}
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider block">
              Price Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-750 rounded-xl focus:outline-none dark:text-white"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-750 rounded-xl focus:outline-none dark:text-white"
              />
            </div>
          </div>

          {/* Sort By Filter */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider block">
              Sort By
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-xs bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-750 rounded-xl focus:outline-none dark:text-white cursor-pointer appearance-none"
              >
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
              <ArrowUpDown className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-secondary-400" />
            </div>
          </div>
        </aside>

        {/* Catalog Grid */}
        <div className="flex-1 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, idx) => (
                  <ProductSkeleton key={idx} />
                ))}
            </div>
          ) : currentProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map((p) => (
                  <ProductCard key={p.productId} product={p} />
                ))}
              </div>

              {/* Reusable Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-secondary-200 dark:border-secondary-800 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-800 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-secondary-600 dark:text-secondary-300" />
                  </button>
                  {Array(totalPages)
                    .fill(0)
                    .map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePageChange(idx + 1)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          currentPage === idx + 1
                            ? 'bg-primary-500 text-white shadow-md shadow-primary-500/10'
                            : 'border border-secondary-200 dark:border-secondary-850 hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-600 dark:text-secondary-300'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-secondary-200 dark:border-secondary-800 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-800 disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-secondary-600 dark:text-secondary-300" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 rounded-3xl space-y-3">
              <p className="text-sm font-semibold text-secondary-650 dark:text-secondary-300">
                No items match your active filters.
              </p>
              <p className="text-xs text-secondary-400">
                Try loosening your price sliders, changing categories, or clearing search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 text-xs font-bold text-white bg-primary-500 rounded-xl shadow-md"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
