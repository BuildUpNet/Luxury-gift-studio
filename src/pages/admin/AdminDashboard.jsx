import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Settings,
  LogOut,
  Bell,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Quote,
  CalendarHeart
} from '../../components/FaIcons';

import { useAdminAuth } from '../../context/AdminAuthContext';
import ProductsPage from './ProductsPage';
import CategoriesPage from './CategoriesPage';
import FestiveBannerAndLeads from './FestiveBannerAndLeads';
import TestimonialsAdminPage from './TestimonialsAdminPage';
import SettingsAdminPage from './SettingsAdminPage';
import HeroBannersAdminPage from './HeroBannersAdminPage';
import OccasionsAdminPage from './OccasionsAdminPage';
import FeatureCardsAdminPage from './FeatureCardsAdminPage';

const VALID_TABS = [
  'dashboard',
  'hero-banners',
  'products',
  'categories',
  'occasions',
  'highlights',
  'testimonials',
  'festive-banner',
  'settings'
];

export default function AdminDashboard() {
  const { logout, adminUser } = useAdminAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tab: paramTab } = useParams();

  const getInitialTab = () => {
    if (paramTab && VALID_TABS.includes(paramTab)) return paramTab;
    const urlTab = searchParams.get('tab');
    if (urlTab && VALID_TABS.includes(urlTab)) return urlTab;
    const storedTab = localStorage.getItem('giftstudio_admin_active_tab');
    if (storedTab && VALID_TABS.includes(storedTab)) return storedTab;
    return 'dashboard';
  };

  const [currentTab, setCurrentTab] = useState(getInitialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
    localStorage.setItem('giftstudio_admin_active_tab', tabId);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const activeFromUrl = paramTab || searchParams.get('tab');
    if (activeFromUrl && VALID_TABS.includes(activeFromUrl) && activeFromUrl !== currentTab) {
      setCurrentTab(activeFromUrl);
      localStorage.setItem('giftstudio_admin_active_tab', activeFromUrl);
    } else if (!activeFromUrl && currentTab) {
      setSearchParams({ tab: currentTab }, { replace: true });
    }
  }, [paramTab, searchParams, currentTab, setSearchParams]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex text-gray-900 font-sans">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1320] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#07111E] text-white flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
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

          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'hero-banners', label: 'Hero Banners', icon: Sparkles },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'categories', label: 'Categories', icon: FolderTree },
              { id: 'occasions', label: 'Occasions', icon: CalendarHeart },
              { id: 'highlights', label: 'Marquee Highlights', icon: Sparkles },
              { id: 'testimonials', label: 'Testimonials', icon: Quote },
              { id: 'festive-banner', label: 'Festive Banner & Leads', icon: Sparkles },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
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

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
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
                {currentTab === 'dashboard'
                  ? 'Overview Dashboard'
                  : currentTab === 'hero-banners'
                  ? 'Homepage Hero Banners'
                  : currentTab === 'products'
                  ? 'Products Management'
                  : currentTab === 'categories'
                  ? 'Categories Management'
                  : currentTab === 'testimonials'
                  ? 'Customer Testimonials & Reviews'
                  : currentTab === 'festive-banner'
                  ? 'Festive Banner & Leads'
                  : `${currentTab} Management`}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Manage your luxury gifting banners, products, categories, reviews, and store settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
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

            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#07111E] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {(adminUser?.name || adminUser?.username || 'AD').substring(0, 2).toUpperCase()}
              </div>

              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-gray-900 leading-none">
                  {adminUser?.name || 'Studio Admin'}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {adminUser?.email || 'modient93@gmail.com'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-6">
                <h2 className="text-base font-bold text-gray-900 mb-2">
                  Welcome to Admin Dashboard
                </h2>
                <p className="text-xs text-gray-500 mb-6">
                  Manage your luxury gifting catalogue, products, categories, festive campaign banners, and customer hamper inquiries.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => handleTabChange('hero-banners')}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full">
                        Hero Slider
                      </span>
                    </div>
                    <div className="font-bold text-sm text-gray-900 group-hover:text-amber-900">
                      Hero Banners
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Manage dynamic carousel wallpapers, titles, subtext, and call-to-action buttons.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('products')}
                    className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-200/60 px-2 py-0.5 rounded-full">
                        Catalogue
                      </span>
                    </div>
                    <div className="font-bold text-sm text-gray-900 group-hover:text-blue-900">
                      Products
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload and manage product details, prices, stock, and images inside each category.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('categories')}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <FolderTree className="w-5 h-5 text-gray-700" />
                      <span className="text-[10px] font-bold uppercase text-gray-700 bg-gray-200 px-2 py-0.5 rounded-full">
                        Structure
                      </span>
                    </div>
                    <div className="font-bold text-sm text-gray-900 group-hover:text-black">
                      Categories
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Organize collections, occasions, subcategories, and navbar presentation.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('occasions')}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CalendarHeart className="w-5 h-5 text-amber-600" />
                      <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full">
                        Celebrations
                      </span>
                    </div>
                    <div className="font-bold text-sm text-gray-900 group-hover:text-amber-900">
                      Occasions
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Manage gifting occasions (Diwali, Corporate, Birthdays) and assign products.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('testimonials')}
                    className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Quote className="w-5 h-5 text-rose-600" />
                      <span className="text-[10px] font-bold uppercase text-rose-700 bg-rose-200/60 px-2 py-0.5 rounded-full">
                        Social Proof
                      </span>
                    </div>
                    <div className="font-bold text-sm text-gray-900 group-hover:text-rose-900">
                      Testimonials
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Manage client quotes, ratings, city locations, and photo reviews.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('festive-banner')}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full">
                        Campaign
                      </span>
                    </div>
                    <div className="font-bold text-sm text-gray-900 group-hover:text-amber-900">
                      Festive Banner & Leads
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Customize festive hero wallpapers, texts, and view customer custom hamper inquiries.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'hero-banners' && (
            <HeroBannersAdminPage onShowToast={showToast} />
          )}

          {currentTab === 'products' && (
            <ProductsPage onShowToast={showToast} />
          )}

          {currentTab === 'categories' && (
            <CategoriesPage />
          )}

          {currentTab === 'occasions' && (
            <OccasionsAdminPage onShowToast={showToast} />
          )}

          {currentTab === 'highlights' && (
            <FeatureCardsAdminPage onShowToast={showToast} />
          )}

          {currentTab === 'testimonials' && (
            <TestimonialsAdminPage onShowToast={showToast} />
          )}

          {currentTab === 'festive-banner' && (
            <FestiveBannerAndLeads onShowToast={showToast} />
          )}

          {currentTab === 'settings' && (
            <SettingsAdminPage onShowToast={showToast} />
          )}
        </main>
      </div>
    </div>
  );
}