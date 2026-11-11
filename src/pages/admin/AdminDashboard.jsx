import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  Trash2,
  Edit3,
  AlertCircle,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

import { useProducts } from '../../context/ProductContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { API_BASE_URL } from '../../config/api';
import CategoriesPage from './CategoriesPage';

export default function AdminDashboard() {
  const { logout, adminUser } = useAdminAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  // 1. Shared Unified Products Context
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStockQty,
    toggleStockStatus
  } = useProducts();

  // 2. Dynamic Orders State (persisted in localStorage, default: empty array) - REMOVED
  // Orders management functionality has been disabled

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 3. Dynamic Stat Calculations (removed - stats cards deleted)
  // Stats were removed from the dashboard

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Categories state for dynamic dropdown
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Home Decor',
    category_id: null,
    originalPrice: '',
    priceNum: '',
    stock: 10,
    inStock: true,
    sameDayDelivery: true,
    image: '',
    description: ''
  });

  // Filtered Products for catalogue table
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchCategory = true;

      if (categoryFilter !== 'All') {
        // Filter by exact category name match
        matchCategory = p.category === categoryFilter;
      }

      return matchSearch && matchCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const token = localStorage.getItem('giftstudio_admin_token');

        const response = await fetch(`${API_BASE_URL}/api/categories`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (response.ok) {
          const data = await response.json();

          if (data.success) {
            setCategories(data.categories || []);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProductId(null);

    setFormData({
      title: '',
      category: categories.length > 0 ? categories[0].name : 'Home Decor',
      category_id: categories.length > 0 ? categories[0].id : null,
      originalPrice: '',
      priceNum: '',
      stock: 10,
      inStock: true,
      sameDayDelivery: true,
      image: '',
      description: ''
    });

    setUploadError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProductId(product.id);

    // Find the category in our categories list or default to first category
    let categoryId = null;
    let categoryName = product.category || 'Home Decor';

    if (product.category_name && categories.length > 0) {
      const foundCategory = categories.find(cat => cat.name === product.category_name);

      if (foundCategory) {
        categoryId = foundCategory.id;
        categoryName = foundCategory.name;
      }
    }

    setFormData({
      title: product.title,
      category: categoryName,
      category_id: categoryId,
      originalPrice: product.originalPrice ? String(product.originalPrice).replace(/[^0-9]/g, '') : '',
      priceNum: product.priceNum,
      stock: product.stock ?? (product.inStock ? 10 : 0),
      inStock: product.inStock !== false && Number(product.stock ?? 1) > 0,
      sameDayDelivery: product.sameDayDelivery !== false,
      image: product.image || '',
      description: product.description || ''
    });

    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.title.trim() || !formData.priceNum || !formData.image) {
      showToast('Product title, price, and image are required');
      return;
    }

    // Find category_id from the selected category name
    let categoryId = formData.category_id;

    if (!categoryId && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.name === formData.category);

      if (selectedCategory) {
        categoryId = selectedCategory.id;
      } else {
        categoryId = categories[0].id; // Default to first category
      }
    }

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        category_id: categoryId
      };

      if (editingProductId) {
        await updateProduct(editingProductId, productData);
        showToast('Product updated successfully');
      } else {
        await addProduct(productData);
        showToast('Product added successfully');
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Error saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = (id) => {
    deleteProduct(id);
    showToast('Product removed from shared catalogue');
  };

  const handleUpdateStockQty = (id, delta) => {
    updateStockQty(id, delta);
  };

  const handleToggleStockStatus = (id) => {
    toggleStockStatus(id);
  };

  // Image Upload Handler - AVIF support added
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isAvif = file.type === 'image/avif' || /\.avif$/i.test(file.name);

    if (!isImage && !isAvif) {
      setUploadError('Please select a valid image file (AVIF is supported).');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setUploadError('');

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formDataUpload
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const imageUrl = `${API_BASE_URL}${data.url}`;
        setFormData({ ...formData, image: imageUrl });
        showToast('Image uploaded successfully');
      } else {
        setUploadError(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex text-gray-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1320] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* 1. Left Sidebar (Dark Navy #07111E) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#07111E] text-white flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-wider text-white">
                THE GIFT STUDIO
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-400">
                Admin Panel
              </span>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'categories', label: 'Categories', icon: FolderTree },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer border-none text-left ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="bg-amber-400 text-gray-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition no-underline"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
            <span>View Public Store</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/20 transition cursor-pointer border-none bg-transparent text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Top Bar */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-black rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 capitalize">
                {currentTab === 'dashboard' ? 'Overview Dashboard' : `${currentTab} Management`}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Manage your luxury gifting catalogue, stock & orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick Search */}
            <div className="relative hidden md:block w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gray-400"
              />
            </div>

            {/* Notification Bell - Disabled */}
            <div className="relative">
              <button
                type="button"
                className="p-2 text-gray-600 hover:text-black rounded-full hover:bg-gray-100 relative cursor-pointer border-none bg-transparent"
                title="Notifications"
                disabled
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>

            {/* Admin User Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#07111E] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {(adminUser?.name || adminUser?.username || 'AD').substring(0, 2).toUpperCase()}
              </div>

              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-gray-900 leading-none">
                  {adminUser?.name || 'Studio Admin'}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {adminUser?.email || 'admin@thegiftstudio.com'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* 3. Main Body Content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          {/* Dashboard Tab */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4">
                  Welcome to Admin Dashboard
                </h2>
                <p className="text-xs text-gray-500">
                  Manage your luxury gifting catalogue, categories, and store settings from here.
                </p>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {currentTab === 'categories' && (
            <CategoriesPage />
          )}

          {/* Products Catalogue Table (Main / Products Tab) */}
          {currentTab === 'products' && (
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
              {/* Header Controls */}
              <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Products Catalogue</h2>
                  <p className="text-xs text-gray-500">
                    Total {filteredProducts.length} items matching current filters
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search */}
                  <div className="relative w-full sm:w-48">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs">
                    <button
                      key="All"
                      type="button"
                      onClick={() => setCategoryFilter('All')}
                      className={`px-3 py-1 rounded-md font-medium transition cursor-pointer border-none ${
                        categoryFilter === 'All'
                          ? 'bg-white text-gray-900 shadow-xs font-semibold'
                          : 'bg-transparent text-gray-600 hover:text-black'
                      }`}
                    >
                      All
                    </button>

                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setCategoryFilter(category.name)}
                        className={`px-3 py-1 rounded-md font-medium transition cursor-pointer border-none ${
                          categoryFilter === category.name
                            ? 'bg-white text-gray-900 shadow-xs font-semibold'
                            : 'bg-transparent text-gray-600 hover:text-black'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>

                  {/* "+ Add Product" Button */}
                  <button
                    onClick={handleOpenAddModal}
                    className="bg-[#0B1320] hover:bg-[#1a2638] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price (₹)</th>
                      <th className="py-3.5 px-4">Stock Qty</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#E5E7EB] text-xs text-gray-700">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-12 text-gray-400">
                          No products found matching "{searchQuery}".
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const stockQty = Number(p.stock ?? 0);

                        return (
                          <tr key={p.id} className="hover:bg-gray-50/80 transition">
                            {/* Product info */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image}
                                  alt={p.title}
                                  className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80';
                                  }}
                                />

                                <div>
                                  <p className="font-semibold text-gray-900 line-clamp-1">{p.title}</p>
                                  <p className="text-[11px] text-gray-400">ID: {p.id}</p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-4">
                              <span className="inline-block bg-gray-100 text-gray-700 text-[11px] font-medium px-2 py-0.5 rounded">
                                {p.category}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-3 px-4 font-semibold text-gray-900">
                              ₹{Number(p.priceNum).toLocaleString('en-IN')}
                              {p.originalPrice && (
                                <span className="text-[11px] text-gray-400 line-through block font-normal">
                                  ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                                </span>
                              )}
                            </td>

                            {/* Stock Quantity Controls */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStockQty(p.id, -1)}
                                  className="w-6 h-6 rounded border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center font-bold cursor-pointer"
                                  title="Decrease stock"
                                >
                                  -
                                </button>

                                <span className="w-8 text-center font-semibold text-gray-900">
                                  {stockQty}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleUpdateStockQty(p.id, 1)}
                                  className="w-6 h-6 rounded border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center font-bold cursor-pointer"
                                  title="Increase stock"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditModal(p)}
                                  className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition cursor-pointer border-none bg-transparent"
                                  title="Edit Product"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition cursor-pointer border-none bg-transparent"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-gray-500">Enter product information and inventory</p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Title *
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. Sleek Wire Candle Prism"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>

                {isLoadingCategories ? (
                  <div className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    Loading categories...
                  </div>
                ) : categories.length === 0 ? (
                  <div className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    No categories available. Please add categories first.
                  </div>
                ) : (
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const selectedCategory = categories.find(cat => cat.name === e.target.value);

                      setFormData({ 
                        ...formData, 
                        category: e.target.value,
                        category_id: selectedCategory ? selectedCategory.id : null
                      });
                    }}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Selling Price (₹) *
                  </label>

                  <input
                    type="number"
                    required
                    placeholder="1499"
                    value={formData.priceNum}
                    onChange={(e) => setFormData({ ...formData, priceNum: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Original Price (₹)
                  </label>

                  <input
                    type="number"
                    placeholder="1699"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Stock Units *
                  </label>

                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Product Image *
                </label>

                <div className="space-y-2">
                  {/* File Upload */}
                  <label className="flex items-center justify-center px-3 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition">
                    <input
                      type="file"
                      accept="image/*,.avif,image/avif"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                      required={!formData.image}
                    />

                    <span className="text-xs font-medium text-gray-600">
                      {isUploading ? '⏳ Uploading...' : '📸 Click to upload'}
                    </span>
                  </label>

                  {/* Error Message */}
                  {uploadError && (
                    <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
                      {uploadError}
                    </div>
                  )}

                  {/* Image Status */}
                  {formData.image && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                      <span className="text-xs font-medium text-green-700">✓ Image ready</span>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="text-xs text-green-600 hover:text-green-800 underline cursor-pointer border-none bg-transparent"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sameDayDelivery}
                    onChange={(e) =>
                      setFormData({ ...formData, sameDayDelivery: e.target.checked })
                    }
                    className="rounded text-black focus:ring-0"
                  />
                  <span className="text-xs font-medium text-gray-700">Same Day Delivery</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded text-black focus:ring-0"
                  />
                  <span className="text-xs font-medium text-gray-700">In Stock</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>

                <textarea
                  rows="3"
                  placeholder="Product description and craftsmanship..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black rounded-lg transition cursor-pointer border-none bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="bg-[#0B1320] hover:bg-[#1a2638] text-white text-xs font-semibold px-5 py-2 rounded-lg transition shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : editingProductId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}