import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  FolderOpen,
  Users,
  ClipboardList,
  Plus,
  Trash2,
  Edit2,
  ShieldAlert,
  Settings,
  LogOut,
  Search,
  Eye,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Boxes,
  ReceiptText,
  Warehouse,
} from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';
import AdminRegister from '../components/AdminRegister';

const AdminDashboard = ({ initialTab = 'overview' }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab || 'overview');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editProductMode, setEditProductMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productCatId, setProductCatId] = useState('');
  const [productActive, setProductActive] = useState(true);
  const [productImages, setProductImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editCategoryMode, setEditCategoryMode] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState('all');
  const [productPage, setProductPage] = useState(1);

  const sidebarItems = [
    { key: 'overview', path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'products', path: '/admin/products', label: 'Products', icon: ShoppingBag },
    { key: 'categories', path: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { key: 'orders', path: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { key: 'customers', path: '/admin/customers', label: 'Users', icon: Users },
    { key: 'admins', path: '/admin/register', label: 'Register New Admin', icon: ShieldAlert },
    { key: 'inventory', path: '/admin/inventory', label: 'Inventory/Stock', icon: Warehouse },
    { key: 'settings', path: '/admin/dashboard', label: 'Settings', icon: Settings },
    { key: 'logout', path: '/admin/login', label: 'Logout', icon: LogOut },
  ];

  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const catIcons = [
    'https://ik.imagekit.io/stringstackseema/handmade%20jewelry/bag%20and%20accessories.png?updatedAt=1786125171820',
    'https://ik.imagekit.io/stringstackseema/handmade%20jewelry/gfts%20and%20cards.png?updatedAt=1786125169898',
    'https://ik.imagekit.io/stringstackseema/handmade%20jewelry/home%20decor.png?updatedAt=1786125170253',
    'https://ik.imagekit.io/stringstackseema/handmade%20jewelry/jewelry.png?updatedAt=1786125170282',
  ];

  const getCategoryImage = (categoryName, index) => {
    const normalized = String(categoryName || '').toLowerCase();
    if (normalized.includes('jewel')) return catIcons[3];
    if (normalized.includes('gift') || normalized.includes('card')) return catIcons[1];
    if (normalized.includes('home') || normalized.includes('decor')) return catIcons[2];
    if (normalized.includes('bag') || normalized.includes('accessory')) return catIcons[0];
    return catIcons[index % catIcons.length];
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prodData, catData, adminOrderData, dashboardSummary, userData] = await Promise.all([
        productService.getAdminProducts(),
        categoryService.getAllCategories(),
        orderService.getAdminOrders(),
        orderService.getDashboardSummary(),
        userService.getAllUsers(),
      ]);

      setProducts(prodData || []);
      setCategories(catData || []);
      setOrders(adminOrderData || []);
      setUsers((userData || []).filter((user) => user.role === 'CUSTOMER') || []);

      if (dashboardSummary) {
        const summaryOrders = Number(dashboardSummary.totalOrders || adminOrderData?.length || 0);
        const summaryCustomers = Number(dashboardSummary.registeredCustomers || userData?.filter((user) => user.role === 'CUSTOMER').length || 0);
        const summaryRevenue = Number(dashboardSummary.revenue || 0);

        if (!adminOrderData || adminOrderData.length === 0) {
          setOrders([]);
        }

        if (!userData || userData.filter((user) => user.role === 'CUSTOMER').length === 0) {
          setUsers([]);
        }

        if (summaryOrders > 0 || summaryCustomers > 0 || summaryRevenue > 0) {
          setOrders((adminOrderData || []).length > 0 ? adminOrderData : []);
          setUsers((userData || []).filter((user) => user.role === 'CUSTOMER'));
        }
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to load catalog summaries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tabFromPath = location.pathname.replace('/admin/', '') || 'dashboard';
    let resolvedTab = tabFromPath === 'dashboard' ? 'overview' : tabFromPath;
    if (resolvedTab === 'register') {
      resolvedTab = 'admins';
    }
    setActiveTab(resolvedTab);
    loadDashboardData();
  }, [location.pathname]);

  const handleOpenAddProduct = () => {
    setEditProductMode(false);
    setProductName('');
    setProductDesc('');
    setProductPrice('');
    setProductStock('');
    setProductCatId(categories[0]?.categoryId || '');
    setProductActive(true);
    setProductImages([]);
    setNewImageUrl('');
    setProductFormOpen(true);
  };

  const handleOpenEditProduct = (p) => {
    setEditProductMode(true);
    setEditingProductId(p.productId);
    setProductName(p.name);
    setProductDesc(p.description || '');
    setProductPrice(p.price.toString());
    setProductStock(p.stock.toString());
    setProductCatId(p.category?.categoryId || '');
    setProductActive(p.active !== false);
    setProductImages(p.images || []);
    setNewImageUrl('');
    setProductFormOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productName || !productPrice || !productStock || !productCatId) {
      showToast('Please fill all fields', 'warning');
      return;
    }

    const price = parseFloat(productPrice);
    const stock = parseInt(productStock);
    const selectedCat = categories.find((c) => c.categoryId === parseInt(productCatId));

    const productPayload = {
      name: productName,
      description: productDesc,
      price,
      stock,
      category: selectedCat ? { categoryId: selectedCat.categoryId, categoryName: selectedCat.categoryName } : null,
      active: productActive,
      images: productImages.map((img) => ({ imageUrl: img.imageUrl, isPrimary: !!img.isPrimary })),
    };

    try {
      if (editProductMode) {
        await productService.updateProduct(editingProductId, productPayload);
        showToast('Product updated successfully', 'success');
      } else {
        await productService.createProduct(productPayload);
        showToast('Product added successfully', 'success');
      }
      setProductFormOpen(false);
      loadDashboardData();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        showToast('Product deleted successfully', 'success');
        loadDashboardData();
      } catch (err) {
        console.error(err);
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const handleOpenAddCategory = () => {
    setEditCategoryMode(false);
    setCategoryNameInput('');
    setCategoryFormOpen(true);
  };

  const handleOpenEditCategory = (c) => {
    setEditCategoryMode(true);
    setEditingCategoryId(c.categoryId);
    setCategoryNameInput(c.categoryName);
    setCategoryFormOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) {
      showToast('Please enter category name', 'warning');
      return;
    }

    const categoryPayload = {
      categoryName: categoryNameInput.trim(),
    };

    try {
      if (editCategoryMode) {
        await categoryService.updateCategory(editingCategoryId, categoryPayload);
        showToast('Category updated successfully', 'success');
      } else {
        await categoryService.createCategory(categoryPayload);
        showToast('Category added successfully', 'success');
      }
      setCategoryFormOpen(false);
      loadDashboardData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.deleteCategory(categoryId);
        showToast('Category deleted successfully', 'success');
        loadDashboardData();
      } catch (err) {
        console.error(err);
        showToast('Failed to delete category', 'error');
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchesStatus =
      productStatusFilter === 'all' ||
      (productStatusFilter === 'active' && product.active !== false) ||
      (productStatusFilter === 'inactive' && product.active === false);
    return matchesSearch && matchesStatus;
  });

  const productPageSize = 5;
  const totalProductPages = Math.max(1, Math.ceil(filteredProducts.length / productPageSize));
  const safeProductPage = Math.min(productPage, totalProductPages);
  const paginatedProducts = filteredProducts.slice((safeProductPage - 1) * productPageSize, safeProductPage * productPageSize);

  useEffect(() => {
    setProductPage(1);
  }, [productSearch, productStatusFilter]);

  const LOW_STOCK_THRESHOLD = 5;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const dashboardTotalOrders = orders.length || 0;
  const dashboardRegisteredCustomers = users.length || 0;
  const pendingOrders = orders.filter((order) => order.status && String(order.status).toLowerCase() === 'pending').length;
  const lowStockProducts = products.filter((product) => Number(product.stock || 0) < LOW_STOCK_THRESHOLD);

  const overviewStats = [
    {
      label: 'Total Products',
      value: products.length,
      change: 'Live',
      icon: ShoppingBag,
      tint: 'bg-[#F7E9DF] text-[#D67A57] dark:bg-[#2D1D17] dark:text-[#F5C3A7]',
    },
    {
      label: 'Total Categories',
      value: categories.length,
      change: 'Live',
      icon: FolderOpen,
      tint: 'bg-[#EEF6F1] text-[#2B8B6F] dark:bg-[#162E2A] dark:text-[#A4E3CC]',
    },
    {
      label: 'Total Orders',
      value: dashboardTotalOrders,
      change: 'Live',
      icon: ClipboardList,
      tint: 'bg-[#F3E9FF] text-[#7D5FBC] dark:bg-[#201B2E] dark:text-[#D8C6FF]',
    },
    {
      label: 'Registered Customers',
      value: dashboardRegisteredCustomers,
      change: 'Live',
      icon: Users,
      tint: 'bg-[#E8F6F9] text-[#2C7F95] dark:bg-[#132A31] dark:text-[#A9E9F5]',
    },
    {
      label: 'Revenue',
      value: currencyFormatter.format(totalRevenue),
      change: 'Real',
      icon: Boxes,
      tint: 'bg-[#FFF4D9] text-[#C48B2F] dark:bg-[#342A1D] dark:text-[#F4D59B]',
    },
    {
      label: 'Low Stock',
      value: lowStockProducts.length,
      change: 'Watch',
      icon: ReceiptText,
      tint: 'bg-[#FDE9E8] text-[#C75B4F] dark:bg-[#341D1D] dark:text-[#F7B1A7]',
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D67A57] border-t-transparent" />
        <p className="text-sm text-secondary-500 dark:text-secondary-400">Loading Admin Center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 text-secondary-900 dark:bg-secondary-950 dark:text-white lg:p-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 lg:flex-row">
        <aside className="w-full rounded-[30px] border border-[#F0E6D8] bg-white/80 p-4 shadow-[0_20px_50px_rgba(97,72,50,0.06)] backdrop-blur-sm dark:border-secondary-800 dark:bg-secondary-900/90 lg:w-[280px] lg:p-5">
          <div className="mb-8 flex items-center gap-3 border-b border-secondary-100 pb-5 dark:border-secondary-800">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5E9E0] text-[#D67A57] dark:bg-[#2A1C17] dark:text-[#F2C2A6] overflow-hidden">
              <img src="https://ik.imagekit.io/stringstackseema/handmade%20jewelry/logo.png" alt="CraftNest Logo" className="h-5 w-5 object-contain" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-secondary-400">Craft</p>
              <h2 className="font-outfit text-xl font-black">Nest Admin</h2>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map(({ key, path, label, icon: Icon }) => {
              const isActive = activeTab === key;
              const isLogout = key === 'logout';

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (isLogout) {
                      navigate('/admin/login');
                      return;
                    }
                    navigate(path);
                    setActiveTab(key);
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#F8E9DE] text-[#B8633F] shadow-sm dark:bg-[#2A1D18] dark:text-[#F3C8AF]'
                      : isLogout
                        ? 'text-secondary-500 hover:bg-secondary-50 dark:text-secondary-400 dark:hover:bg-secondary-800'
                        : 'text-secondary-600 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:bg-secondary-800'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  {isActive && <ArrowRight className="h-4 w-4" />}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[24px] bg-[#F9F2EA] p-4 dark:bg-secondary-800">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B56A42] dark:text-[#F1C8AE]">Today</p>
            <h3 className="mt-2 font-outfit text-2xl font-black text-secondary-900 dark:text-white">₹{currencyFormatter.format(totalRevenue).replace('₹', '')}</h3>
            <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">Sales generated across handmade collections</p>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="rounded-[30px] border border-[#F0E6D8] bg-white/80 p-5 shadow-[0_20px_50px_rgba(97,72,50,0.06)] backdrop-blur-sm dark:border-secondary-800 dark:bg-secondary-900/90">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B56A42] dark:text-[#F1C8AE]">Overview</p>
                <h1 className="mt-2 font-outfit text-3xl font-black tracking-[-0.04em] text-secondary-900 dark:text-white">
                  {activeTab === 'overview' && 'Dashboard'}
                  {activeTab === 'products' && 'Products'}
                  {activeTab === 'categories' && 'Categories'}
                  {activeTab === 'orders' && 'Orders'}
                  {activeTab === 'customers' && 'Customers'}
                  {activeTab === 'inventory' && 'Inventory'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="inline-flex items-center gap-2 rounded-full bg-[#D67A57] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(214,122,87,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c96e4c]"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddCategory}
                  className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-white px-4 py-2.5 text-sm font-semibold text-secondary-700 transition-all duration-300 hover:border-[#D67A57] hover:text-[#B8633F] dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:border-[#D67A57] dark:hover:text-[#F3C8AF]"
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </button>
              </div>
            </div>
          </header>

          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in-up">
              <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {overviewStats.map(({ label, value, change, icon: Icon, tint }) => {
                  const cardPath =
                    label === 'Total Products' ? '/admin/products' :
                    label === 'Total Categories' ? '/admin/categories' :
                    label === 'Total Orders' ? '/admin/orders' :
                    label === 'Registered Customers' ? '/admin/customers' :
                    label === 'Revenue' ? '/admin/orders' :
                    label === 'Low Stock' ? '/admin/inventory' : '/admin/dashboard';

                  return (
                    <div
                      key={label}
                      onClick={() => {
                        if (label === 'Low Stock') {
                          navigate('/admin/inventory', { state: { lowStockOnly: true } });
                          return;
                        }
                        navigate(cardPath);
                      }}
                      className="cursor-pointer rounded-[28px] border border-secondary-200/70 bg-white p-5 shadow-[0_18px_35px_rgba(125,92,65,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(125,92,65,0.09)] dark:border-secondary-800 dark:bg-secondary-900"
                    >
                      <div className="mb-5 flex items-start justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tint}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-300">
                          {change}
                        </span>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-400">{label}</p>
                      <h3 className="mt-3 font-outfit text-3xl font-black tracking-[-0.04em] text-secondary-900 dark:text-white">{value}</h3>
                    </div>
                  );
                })}
              </section>

              <section className="rounded-[30px] border border-[#F0E6D8] bg-[#FFFDFB] p-5 shadow-[0_18px_35px_rgba(125,92,65,0.04)] dark:border-secondary-800 dark:bg-secondary-900">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B56A42] dark:text-[#F1C8AE]">Inventory</p>
                    <h3 className="mt-2 font-outfit text-2xl font-black text-secondary-900 dark:text-white">Stock Snapshot</h3>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {products.slice(0, 6).map((product) => (
                    <div key={product.productId} className="rounded-[22px] border border-secondary-200 bg-white p-4 dark:border-secondary-800 dark:bg-secondary-900">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0]?.imageUrl || getCategoryImage(product.category?.categoryName, 0)} alt={product.name} className="h-12 w-12 rounded-2xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-secondary-900 dark:text-white">{product.name}</p>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400">{product.category?.categoryName || 'General'}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-secondary-500 dark:text-secondary-400">Available</span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${Number(product.stock || 0) > 5 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-amber-500/10 text-amber-600 dark:text-amber-300'}`}>
                          {product.stock || 0} units
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-start gap-3 rounded-[22px] border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
                  <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-300" />
                  <p className="text-sm leading-7 text-amber-800 dark:text-amber-200">
                    Product and category changes are handled through the existing browser-side CRUD flow while keeping the backend APIs untouched. The dashboard remains fully responsive and supports both light and dark themes.
                  </p>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-5 rounded-[30px] border border-secondary-200/70 bg-white p-5 shadow-[0_18px_35px_rgba(125,92,65,0.05)] dark:border-secondary-800 dark:bg-secondary-900 animate-fade-in-up">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative w-full max-w-md">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-2xl border border-secondary-200 bg-secondary-50 py-3 pl-11 pr-4 text-sm text-secondary-800 outline-none transition-all focus:border-[#D67A57] focus:bg-white dark:border-secondary-700 dark:bg-secondary-800 dark:text-white dark:focus:border-[#D67A57]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-400">Filter</label>
                  <select
                    value={productStatusFilter}
                    onChange={(e) => setProductStatusFilter(e.target.value)}
                    className="rounded-2xl border border-secondary-200 bg-secondary-50 px-3 py-2.5 text-sm text-secondary-700 outline-none transition-all focus:border-[#D67A57] dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-200"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-secondary-200 dark:border-secondary-800">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-secondary-50 text-secondary-500 dark:bg-secondary-800 dark:text-secondary-300">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Product</th>
                        <th className="px-4 py-3 font-semibold">Category</th>
                        <th className="px-4 py-3 font-semibold">Price</th>
                        <th className="px-4 py-3 font-semibold">Stock</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800">
                      {paginatedProducts.map((product) => (
                        <tr key={product.productId} className="transition-colors hover:bg-secondary-50/80 dark:hover:bg-secondary-800/60">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images?.[0]?.imageUrl || catIcons[0]}
                                alt={product.name}
                                className="h-12 w-12 rounded-2xl object-cover"
                              />
                              <div>
                                <p className="font-bold text-secondary-900 dark:text-white">{product.name}</p>
                                <p className="text-xs text-secondary-400">#{product.productId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-secondary-600 dark:text-secondary-300">{product.category?.categoryName || 'General'}</td>
                          <td className="px-4 py-4 font-bold text-[#B8633F] dark:text-[#F1C8AE]">{currencyFormatter.format(product.price)}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${product.stock > 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-600 dark:text-rose-300'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${product.active !== false ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-secondary-200 text-secondary-600 dark:bg-secondary-700 dark:text-secondary-200'}`}>
                              {product.active !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => navigate(`/products/${product.productId}`)}
                                className="rounded-xl border border-secondary-200 p-2 text-secondary-600 transition-all hover:border-[#D67A57] hover:text-[#B8633F] dark:border-secondary-700 dark:text-secondary-300 dark:hover:border-[#D67A57] dark:hover:text-[#F1C8AE]"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(product)}
                                className="rounded-xl border border-secondary-200 p-2 text-secondary-600 transition-all hover:border-[#D67A57] hover:text-[#B8633F] dark:border-secondary-700 dark:text-secondary-300 dark:hover:border-[#D67A57] dark:hover:text-[#F1C8AE]"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(product.productId)}
                                className="rounded-xl border border-rose-200 p-2 text-rose-500 transition-all hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950/20"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col gap-3 pb-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Showing {Math.min(filteredProducts.length, (safeProductPage - 1) * productPageSize + 1)}-{Math.min(filteredProducts.length, safeProductPage * productPageSize)} of {filteredProducts.length} products
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setProductPage((prev) => Math.max(1, prev - 1))}
                    disabled={safeProductPage === 1}
                    className="rounded-xl border border-secondary-200 p-2 text-secondary-600 transition-all hover:border-[#D67A57] hover:text-[#B8633F] disabled:cursor-not-allowed disabled:opacity-40 dark:border-secondary-700 dark:text-secondary-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-secondary-600 dark:text-secondary-300">{safeProductPage}/{totalProductPages}</span>
                  <button
                    type="button"
                    onClick={() => setProductPage((prev) => Math.min(totalProductPages, prev + 1))}
                    disabled={safeProductPage === totalProductPages}
                    className="rounded-xl border border-secondary-200 p-2 text-secondary-600 transition-all hover:border-[#D67A57] hover:text-[#B8633F] disabled:cursor-not-allowed disabled:opacity-40 dark:border-secondary-700 dark:text-secondary-300"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-5 rounded-[30px] border border-secondary-200/70 bg-white p-5 shadow-[0_18px_35px_rgba(125,92,65,0.05)] dark:border-secondary-800 dark:bg-secondary-900 animate-fade-in-up">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {categories.map((cat, index) => {
                  const productCount = products.filter((product) => product.category?.categoryId === cat.categoryId).length;
                  return (
                    <div key={cat.categoryId} className="group overflow-hidden rounded-[26px] border border-secondary-200 bg-white shadow-[0_20px_40px_rgba(125,92,65,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(125,92,65,0.09)] dark:border-secondary-800 dark:bg-secondary-900">
                      <div className="h-52 overflow-hidden">
                        <img src={catIcons[index % catIcons.length]} alt={cat.categoryName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-outfit text-xl font-black text-secondary-900 dark:text-white">{cat.categoryName}</h3>
                          <span className="rounded-full bg-[#F7E9DF] px-2 py-1 text-[10px] font-bold text-[#B8633F] dark:bg-[#2A1C17] dark:text-[#F3C8AF]">{productCount} items</span>
                        </div>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">Curated designs for artisan storytelling and elevated gifting.</p>
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCategory(cat)}
                            className="rounded-xl border border-secondary-200 p-2 text-secondary-600 transition-all hover:border-[#D67A57] hover:text-[#B8633F] dark:border-secondary-700 dark:text-secondary-300"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.categoryId)}
                            className="rounded-xl border border-rose-200 p-2 text-rose-500 transition-all hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950/20"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="rounded-[30px] border border-secondary-200/70 bg-white p-5 shadow-[0_18px_35px_rgba(125,92,65,0.05)] dark:border-secondary-800 dark:bg-secondary-900 animate-fade-in-up">
              <div className="overflow-hidden rounded-[24px] border border-secondary-200 dark:border-secondary-800">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-secondary-50 text-secondary-500 dark:bg-secondary-800 dark:text-secondary-300">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Order ID</th>
                        <th className="px-4 py-3 font-semibold">Customer</th>
                        <th className="px-4 py-3 font-semibold">Customer Email</th>
                        <th className="px-4 py-3 font-semibold">Order Date</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Amount</th>
                        <th className="px-4 py-3 text-right font-semibold">View Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800">
                      {orders.map((order) => {
                        const customer = {
                          username: order.customerName || 'Registered Customer',
                          email: order.customerEmail || 'unknown@example.com',
                        };
                        const statusClasses = {
                          DELIVERED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
                          PENDING: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
                          SHIPPED: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
                          PROCESSING: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
                          CANCELLED: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
                        };

                        return (
                          <tr key={order.orderId} className="transition-colors hover:bg-secondary-50/80 dark:hover:bg-secondary-800/60">
                            <td className="px-4 py-4 font-bold text-secondary-900 dark:text-white">#{order.orderId}</td>
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-semibold text-secondary-900 dark:text-white">{customer.username}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-secondary-600 dark:text-secondary-300">{customer.email}</td>
                            <td className="px-4 py-4 text-secondary-600 dark:text-secondary-300">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses[order.status] || 'bg-secondary-200 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-200'}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-bold text-[#B8633F] dark:text-[#F1C8AE]">{currencyFormatter.format(order.totalAmount)}</td>
                            <td className="px-4 py-4 text-right">
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-white px-3 py-2 text-xs font-bold text-secondary-700 transition-all hover:border-[#D67A57] hover:text-[#B8633F] dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-200"
                              >
                                View Details
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3 animate-fade-in-up">
              {users.map((user) => {
                const totalOrderCount = orders.filter((order) => order.userId === user.userId).length;
                return (
                  <div key={user.userId} className="rounded-[28px] border border-secondary-200/70 bg-white p-5 shadow-[0_18px_35px_rgba(125,92,65,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(125,92,65,0.09)] dark:border-secondary-800 dark:bg-secondary-900">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7E9DF] text-lg font-black text-[#B8633F] dark:bg-[#2A1C17] dark:text-[#F3C8AF]">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-outfit text-xl font-black text-secondary-900 dark:text-white">{user.username}</h3>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">{user.role}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-secondary-600 dark:text-secondary-300">
                      <div className="flex items-center justify-between gap-4">
                        <span>Email</span>
                        <span className="font-medium text-secondary-800 dark:text-secondary-100">{user.email}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Total Orders</span>
                        <span className="font-bold text-[#B8633F] dark:text-[#F1C8AE]">{totalOrderCount}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Joined</span>
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="rounded-[30px] border border-secondary-200/70 bg-white p-5 shadow-[0_18px_35px_rgba(125,92,65,0.05)] dark:border-secondary-800 dark:bg-secondary-900 animate-fade-in-up">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B56A42] dark:text-[#F1C8AE]">Inventory</p>
                  <h3 className="mt-2 font-outfit text-2xl font-black text-secondary-900 dark:text-white">
                    {location.state?.lowStockOnly ? 'Low Stock Items' : 'Stock Snapshot'}
                  </h3>
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-secondary-200 dark:border-secondary-800">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-secondary-50 text-secondary-500 dark:bg-secondary-800 dark:text-secondary-300">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Product</th>
                        <th className="px-4 py-3 font-semibold">Category</th>
                        <th className="px-4 py-3 font-semibold">Available Stock</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800">
                      {(() => {
                        const inventoryProducts = location.state?.lowStockOnly
                          ? products.filter((product) => Number(product.stock || 0) < LOW_STOCK_THRESHOLD)
                          : products;

                        return inventoryProducts.length > 0 ? (
                          inventoryProducts.map((product) => (
                            <tr key={product.productId} className="transition-colors hover:bg-secondary-50/80 dark:hover:bg-secondary-800/60">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <img src={product.images?.[0]?.imageUrl || getCategoryImage(product.category?.categoryName, 0)} alt={product.name} className="h-12 w-12 rounded-2xl object-cover" />
                                  <div>
                                    <p className="font-bold text-secondary-900 dark:text-white">{product.name}</p>
                                    <p className="text-xs text-secondary-500 dark:text-secondary-400">#{product.productId}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-secondary-600 dark:text-secondary-300">{product.category?.categoryName || 'General'}</td>
                              <td className="px-4 py-4 font-bold text-[#B8633F] dark:text-[#F1C8AE]">{product.stock ?? 0}</td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${Number(product.stock || 0) >= LOW_STOCK_THRESHOLD ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-amber-500/10 text-amber-600 dark:text-amber-300'}`}>
                                  {Number(product.stock || 0) >= LOW_STOCK_THRESHOLD ? 'In Stock' : 'Low Stock'}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-secondary-600 dark:text-secondary-300">
                                {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '—'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-4 py-12 text-center text-sm text-secondary-500 dark:text-secondary-400">
                              {location.state?.lowStockOnly ? 'No low stock products found in the current catalog.' : 'No products available in inventory.'}
                            </td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="animate-fade-in-up">
              <AdminRegister />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="rounded-[30px] border border-secondary-200/70 bg-white p-5 shadow-[0_18px_35px_rgba(125,92,65,0.05)] dark:border-secondary-800 dark:bg-secondary-900 animate-fade-in-up">
              <div className="rounded-[26px] border border-dashed border-secondary-300 bg-secondary-50 p-8 text-center dark:border-secondary-700 dark:bg-secondary-800">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B56A42] dark:text-[#F1C8AE]">Settings</p>
                <h3 className="mt-3 font-outfit text-3xl font-black text-secondary-900 dark:text-white">Customization Center</h3>
                <p className="mt-3 text-sm text-secondary-500 dark:text-secondary-400">This area is reserved for future admin preferences, storefront branding, and shipping configurations.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {productFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[30px] border border-secondary-200 bg-white p-6 shadow-2xl dark:border-secondary-800 dark:bg-secondary-900 sm:p-8">
            <h3 className="border-b border-secondary-100 pb-3 font-outfit text-xl font-black text-secondary-900 dark:border-secondary-800 dark:text-white">
              {editProductMode ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary-500 dark:text-secondary-400">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handmade Blue Pottery Vase"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full rounded-2xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-800 outline-none transition-all focus:border-[#D67A57] focus:bg-white dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary-500 dark:text-secondary-400">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details about craftsmanship and materials..."
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  className="w-full resize-none rounded-2xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-800 outline-none transition-all focus:border-[#D67A57] focus:bg-white dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary-500 dark:text-secondary-400">Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="1250"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full rounded-2xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-800 outline-none transition-all focus:border-[#D67A57] focus:bg-white dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary-500 dark:text-secondary-400">Stock</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    className="w-full rounded-2xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-800 outline-none transition-all focus:border-[#D67A57] focus:bg-white dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary-500 dark:text-secondary-400">Category</label>
                <select
                  value={productCatId}
                  onChange={(e) => setProductCatId(e.target.value)}
                  className="w-full rounded-2xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-800 outline-none transition-all focus:border-[#D67A57] focus:bg-white dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 rounded-2xl border border-secondary-200 p-3 dark:border-secondary-700">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary-500 dark:text-secondary-400">Product Images</label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste image URL..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 rounded-2xl border border-secondary-200 bg-secondary-50 px-4 py-2.5 text-sm text-secondary-800 outline-none transition-all focus:border-[#D67A57] focus:bg-white dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newImageUrl.trim()) {
                        setProductImages([...productImages, { imageUrl: newImageUrl.trim(), isPrimary: productImages.length === 0 }]);
                        setNewImageUrl('');
                      }
                    }}
                    className="rounded-2xl bg-secondary-900 px-3 py-2.5 text-xs font-bold text-white dark:bg-white dark:text-secondary-900"
                  >
                    Add URL
                  </button>
                </div>

                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setUploadingFiles(true);
                        const formData = new FormData();
                        for (const file of e.target.files) {
                          formData.append('files', file);
                        }
                        try {
                          const urls = await productService.uploadImages(formData);
                          const newImgs = urls.map((url, index) => ({
                            imageUrl: url,
                            isPrimary: productImages.length === 0 && index === 0,
                          }));
                          setProductImages([...productImages, ...newImgs]);
                          showToast('Images uploaded successfully', 'success');
                        } catch (err) {
                          console.error(err);
                          showToast('Failed to upload images', 'error');
                        } finally {
                          setUploadingFiles(false);
                        }
                      }
                    }}
                    className="w-full text-xs text-secondary-500 file:mr-4 file:rounded-xl file:border-0 file:bg-[#F7E9DF] file:px-4 file:py-2 file:text-xs file:font-bold file:text-[#B8633F] hover:file:bg-[#F0D9CB] dark:text-secondary-300 dark:file:bg-[#2A1C17] dark:file:text-[#F3C8AF] dark:hover:file:bg-[#311F1A]"
                  />
                  {uploadingFiles && <p className="mt-2 text-[10px] font-semibold text-[#B8633F]">Uploading images...</p>}
                </div>

                {productImages.length > 0 && (
                  <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded-2xl border border-secondary-200 bg-secondary-50 p-2 dark:border-secondary-700 dark:bg-secondary-800">
                    {productImages.map((img, index) => (
                      <div key={`${img.imageUrl}-${index}`} className="flex items-center gap-2 rounded-2xl border border-secondary-200 bg-white p-2 dark:border-secondary-700 dark:bg-secondary-900">
                        <img src={img.imageUrl} alt={`thumb-${index}`} className="h-10 w-10 rounded-xl object-cover" />
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary-500 dark:text-secondary-400">
                          <input
                            type="radio"
                            name="primary-image"
                            checked={!!img.isPrimary}
                            onChange={() => {
                              const updated = productImages.map((productImage, idx) => ({
                                ...productImage,
                                isPrimary: idx === index,
                              }));
                              setProductImages(updated);
                            }}
                            className="h-3.5 w-3.5 text-[#D67A57]"
                          />
                          Primary
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = productImages.filter((_, idx) => idx !== index);
                            if (img.isPrimary && updated.length > 0) {
                              updated[0].isPrimary = true;
                            }
                            setProductImages(updated);
                          }}
                          className="ml-auto rounded-lg p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="product-active"
                  checked={productActive}
                  onChange={(e) => setProductActive(e.target.checked)}
                  className="h-4 w-4 text-[#D67A57]"
                />
                <label htmlFor="product-active" className="text-xs font-semibold text-secondary-700 dark:text-secondary-300">Product is Active (visible to customers)</label>
              </div>

              <div className="flex justify-end gap-3 border-t border-secondary-100 pt-5 dark:border-secondary-800">
                <button
                  type="button"
                  onClick={() => setProductFormOpen(false)}
                  className="rounded-2xl border border-secondary-200 px-4 py-2.5 text-sm font-bold text-secondary-600 transition-all hover:bg-secondary-50 dark:border-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-[#D67A57] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(214,122,87,0.3)] transition-all hover:bg-[#c96e4c]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categoryFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[30px] border border-secondary-200 bg-white p-6 shadow-2xl dark:border-secondary-800 dark:bg-secondary-900">
            <h3 className="border-b border-secondary-100 pb-3 font-outfit text-xl font-black text-secondary-900 dark:border-secondary-800 dark:text-white">
              {editCategoryMode ? 'Edit Category' : 'Add New Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-secondary-500 dark:text-secondary-400">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Textiles, Woodwork"
                  value={categoryNameInput}
                  onChange={(e) => setCategoryNameInput(e.target.value)}
                  className="w-full rounded-2xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-800 outline-none transition-all focus:border-[#D67A57] focus:bg-white dark:border-secondary-700 dark:bg-secondary-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-secondary-100 pt-5 dark:border-secondary-800">
                <button
                  type="button"
                  onClick={() => setCategoryFormOpen(false)}
                  className="rounded-2xl border border-secondary-200 px-4 py-2.5 text-sm font-bold text-secondary-600 transition-all hover:bg-secondary-50 dark:border-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-[#D67A57] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(214,122,87,0.3)] transition-all hover:bg-[#c96e4c]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
