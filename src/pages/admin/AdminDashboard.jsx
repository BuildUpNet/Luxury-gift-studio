import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  Trash2,
  Edit3,
  AlertCircle,
  Truck,
  IndianRupee,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

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

  // 2. Dynamic Orders State (persisted in localStorage, default: empty array)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('giftstudio_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist orders
  useEffect(() => {
    try {
      localStorage.setItem('giftstudio_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 3. Dynamic Stat Calculations (Directly connected to real state & products)
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const totalOrders = orders.length;
    const sameDayDeliveries = orders.filter(
      (order) => order.deliveryType === 'same-day' && order.status !== 'Delivered'
    ).length;
    const outOfStock = products.filter(
      (product) => Number(product.stock ?? 0) <= 0 || product.inStock === false
    ).length;

    return {
      revenue: totalRevenue,
      orders: totalOrders,
      sameDayDeliveries: sameDayDeliveries,
      outOfStock: outOfStock
    };
  }, [orders, products]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Home Decor',
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
      if (categoryFilter === 'Home Decor') {
        matchCategory =
          p.category &&
          (p.category.toLowerCase().includes('home decor') ||
            p.category.toLowerCase().includes('decor') ||
            p.category.toLowerCase().includes('pooja') ||
            p.category.toLowerCase().includes('tableware') ||
            p.category.toLowerCase().includes('candle') ||
            p.category.toLowerCase().includes('frames'));
      } else if (categoryFilter === 'Diwali') {
        matchCategory = p.category && p.category.toLowerCase().includes('diwali');
      } else if (categoryFilter === 'Hampers') {
        matchCategory =
          p.category &&
          (p.category.toLowerCase().includes('hamper') ||
            p.category.toLowerCase().includes('box') ||
            p.category.toLowerCase().includes('celebrity'));
      }

      return matchSearch && matchCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData({
      title: '',
      category: 'Home Decor',
      originalPrice: '',
      priceNum: '',
      stock: 10,
      inStock: true,
      sameDayDelivery: true,
      image: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProductId(product.id);
    setFormData({
      title: product.title,
      category: product.category,
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

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.priceNum) return;

    if (editingProductId) {
      updateProduct(editingProductId, formData);
      showToast('Product updated in shared catalogue');
    } else {
      addProduct(formData);
      showToast('New product added to shared catalogue');
    }

    setIsModalOpen(false);
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

  // Orders Actions
  const handleCreateTestOrder = () => {
    const testOrder = {
      id: `TGS-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: 'Aarav Sharma',
      itemsCount: 2,
      total: 2499,
      deliveryType: 'same-day',
      status: 'Processing',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setOrders((prev) => [testOrder, ...prev]);
    showToast(`Created order #${testOrder.id}`);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId} marked as ${newStatus}`);
  };

  const handleClearOrders = () => {
    setOrders([]);
    showToast('Orders cleared');
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
              {
                id: 'orders',
                label: 'Orders',
                icon: ShoppingCart,
                badge: stats.orders > 0 ? String(stats.orders) : null
              },
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

            {/* Notification Bell with Dropdown (No fake alerts) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-gray-600 hover:text-black rounded-full hover:bg-gray-100 relative cursor-pointer border-none bg-transparent"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {(stats.sameDayDeliveries > 0 || stats.outOfStock > 0) && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E5E7EB] rounded-xl shadow-xl p-4 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                    <span className="font-bold text-gray-900">Notifications</span>
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-gray-400 hover:text-black"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {stats.sameDayDeliveries === 0 && stats.outOfStock === 0 ? (
                    <p className="text-gray-500 py-3 text-center">No pending alerts</p>
                  ) : (
                    <div className="space-y-2">
                      {stats.sameDayDeliveries > 0 && (
                        <div className="p-2 bg-amber-50 text-amber-900 rounded-lg flex items-start gap-2">
                          <Truck className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                          <span>{stats.sameDayDeliveries} same-day order(s) pending dispatch</span>
                        </div>
                      )}
                      {stats.outOfStock > 0 && (
                        <div className="p-2 bg-rose-50 text-rose-900 rounded-lg flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                          <span>{stats.outOfStock} product(s) are currently out of stock</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin User Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#07111E] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {(adminUser?.name || adminUser?.username || 'AD').substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-gray-900 leading-none">{adminUser?.name || 'Studio Admin'}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{adminUser?.email || 'admin@thegiftstudio.com'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* 3. Main Body Content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          {/* Stat Cards (Directly connected to real state / localStorage) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* 1. Total Revenue */}
            <div className="bg-white rounded-xl p-5 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">
                  ₹{stats.revenue.toLocaleString('en-IN')}
                </h3>
                <span className="text-[11px] text-gray-400 mt-1.5 block">
                  From confirmed orders
                </span>
              </div>
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>

            {/* 2. Total Orders */}
            <div className="bg-white rounded-xl p-5 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">
                  {stats.orders}
                </h3>
                <span className="text-[11px] text-gray-400 mt-1.5 block">
                  Lifetime orders placed
                </span>
              </div>
              <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>

            {/* 3. Same-Day Deliveries */}
            <div className="bg-white rounded-xl p-5 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Same-Day Deliveries</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">
                  {stats.sameDayDeliveries}
                </h3>
                <span className="text-[11px] text-gray-400 mt-1.5 block">
                  Pending dispatch today
                </span>
              </div>
              <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
            </div>

            {/* 4. Out of Stock */}
            <div className="bg-white rounded-xl p-5 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Out of Stock</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-950 mt-1">
                  {stats.outOfStock}
                </h3>
                <span className="text-[11px] text-gray-400 mt-1.5 block">
                  {stats.outOfStock > 0 ? 'Requires restocking' : 'All inventory in stock'}
                </span>
              </div>
              <div className="w-11 h-11 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Conditional Views based on Tab */}
          {currentTab === 'orders' ? (
            /* Orders Management View */
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Orders Management</h2>
                  <p className="text-xs text-gray-500">Live order queue from store checkout</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCreateTestOrder}
                    className="bg-[#0B1320] hover:bg-[#1a2638] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Test Order</span>
                  </button>
                  {orders.length > 0 && (
                    <button
                      onClick={handleClearOrders}
                      className="text-xs text-gray-500 hover:text-rose-600 px-2 py-1.5 cursor-pointer bg-transparent border-none"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Delivery</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-gray-700">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="py-12 text-center text-gray-400">
                          No orders placed yet. Place an order on the storefront or click "Create Test Order".
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/80">
                          <td className="py-3 px-4 font-semibold text-gray-900">{order.id}</td>
                          <td className="py-3 px-4">{order.customerName}</td>
                          <td className="py-3 px-4 text-gray-500">{order.date}</td>
                          <td className="py-3 px-4">{order.itemsCount} items</td>
                          <td className="py-3 px-4 font-semibold text-gray-900">
                            ₹{Number(order.total).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="capitalize text-emerald-700 font-medium">{order.deliveryType}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : 'bg-amber-50 text-amber-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {order.status !== 'Delivered' ? (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer border-none bg-transparent"
                              >
                                Mark Delivered
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs">Completed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Products Catalogue Table (Main / Products Tab) */
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
                    {['All', 'Home Decor', 'Diwali', 'Hampers'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-md font-medium transition cursor-pointer border-none ${
                          categoryFilter === cat
                            ? 'bg-white text-gray-900 shadow-xs font-semibold'
                            : 'bg-transparent text-gray-600 hover:text-black'
                        }`}
                      >
                        {cat}
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
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-xs text-gray-700">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-gray-400">
                          No products found matching "{searchQuery}".
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const stockQty = Number(p.stock ?? 0);
                        const isStockAvailable = stockQty > 0 && p.inStock;

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

                            {/* Stock Status Button */}
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => handleToggleStockStatus(p.id)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer border-none transition ${
                                  isStockAvailable
                                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                }`}
                                title="Click to toggle stock"
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isStockAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                                  }`}
                                />
                                {isStockAvailable ? 'In Stock' : 'Out of Stock'}
                              </button>
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
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white"
                >
                  <option value="Home Decor">Home Decor</option>
                  <option value="Diwali">Diwali</option>
                  <option value="Hampers">Hampers</option>
                  <option value="Tableware & Serving">Tableware & Serving</option>
                  <option value="Corporate Gifts">Corporate Gifts</option>
                </select>
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
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
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black rounded-lg transition cursor-pointer border-none bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0B1320] hover:bg-[#1a2638] text-white text-xs font-semibold px-5 py-2 rounded-lg transition shadow-xs cursor-pointer"
                >
                  {editingProductId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
