import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Eye,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Gift,
  Building,
  Check,
  ChevronDown
} from 'lucide-react';
import { apiService } from '../../services/api';
import { resolveImageUrl } from '../../utils/image';

const PRESET_FESTIVE_IMAGES = [
  {
    name: 'Diwali & Festive Glow',
    url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Christmas & Holiday Luxury',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Royal Wedding & Celebration',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Corporate & Gourmet Black Tie',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop'
  }
];

export default function FestiveBannerAndLeads({ onShowToast }) {
  // Banner config state
  const [bannerConfig, setBannerConfig] = useState({
    eyebrow: 'BESPOKE GIFTING & BULK ORDERS',
    heading: 'Curate Your Custom Gift Hamper',
    subheading: 'Celebrate Diwali, weddings, and corporate milestones with handcrafted luxury hampers tailored to your taste.',
    button_text: 'Request Custom Quote →',
    bg_image: '',
    overlay_opacity: 0.65,
    is_active: 1
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [isSavingBanner, setIsSavingBanner] = useState(false);
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);

  // Inquiries state
  const [inquiries, setInquiries] = useState([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [activeSubTab, setActiveSubTab] = useState('banner'); // 'banner' | 'leads'

  const fileInputRef = useRef(null);

  // Fetch initial banner settings and customer inquiries
  const loadData = async () => {
    try {
      setIsLoadingBanner(true);
      const bannerRes = await apiService.getGiftingBanner();
      if (bannerRes && bannerRes.success && bannerRes.banner) {
        setBannerConfig(bannerRes.banner);
      }
    } catch (err) {
      console.warn('Failed to fetch banner config:', err);
    } finally {
      setIsLoadingBanner(false);
    }

    try {
      setIsLoadingInquiries(true);
      const inqRes = await apiService.getAdminGiftingInquiries();
      if (inqRes && inqRes.success && Array.isArray(inqRes.inquiries)) {
        setInquiries(inqRes.inquiries);
      }
    } catch (err) {
      console.warn('Failed to fetch inquiries:', err);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle banner image file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (onShowToast) onShowToast('Please select a valid image file');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
  };

  // Select a preset image
  const handleSelectPreset = (presetUrl) => {
    setSelectedFile(null);
    setFilePreview('');
    setBannerConfig((prev) => ({ ...prev, bg_image: presetUrl }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Save Banner Config via API
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      setIsSavingBanner(true);

      const formData = new FormData();
      formData.append('eyebrow', bannerConfig.eyebrow);
      formData.append('heading', bannerConfig.heading);
      formData.append('subheading', bannerConfig.subheading);
      formData.append('button_text', bannerConfig.button_text);
      formData.append('overlay_opacity', bannerConfig.overlay_opacity);
      formData.append('is_active', bannerConfig.is_active ? 1 : 0);

      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (bannerConfig.bg_image) {
        formData.append('bg_image', bannerConfig.bg_image);
      }

      const res = await apiService.updateGiftingBanner(formData);
      if (res && res.success) {
        setBannerConfig(res.banner);
        setSelectedFile(null);
        setFilePreview('');
        if (onShowToast) onShowToast('Festive banner updated successfully!');
      } else {
        if (onShowToast) onShowToast(res?.message || 'Failed to update banner');
      }
    } catch (err) {
      if (onShowToast) onShowToast(err?.message || 'Error updating banner');
    } finally {
      setIsSavingBanner(false);
    }
  };

  // Update Status of an inquiry
  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      const res = await apiService.updateGiftingInquiryStatus(inquiryId, newStatus);
      if (res && res.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiryId ? { ...item, status: newStatus } : item))
        );
        if (onShowToast) onShowToast(`Lead #${inquiryId} updated to ${newStatus}`);
      }
    } catch (err) {
      if (onShowToast) onShowToast('Failed to update status');
    }
  };

  // Delete an inquiry
  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm(`Are you sure you want to delete lead inquiry #${inquiryId}?`)) {
      return;
    }
    try {
      const res = await apiService.deleteGiftingInquiry(inquiryId);
      if (res && res.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== inquiryId));
        if (onShowToast) onShowToast(`Inquiry #${inquiryId} deleted`);
      }
    } catch (err) {
      if (onShowToast) onShowToast('Failed to delete inquiry');
    }
  };

  // Filtered inquiries list
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesSearch =
        !searchQuery.trim() ||
        (inq.name && inq.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inq.email && inq.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inq.phone && inq.phone.includes(searchQuery)) ||
        (inq.city_pincode && inq.city_pincode.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
      const matchesType = typeFilter === 'All' || inq.gifting_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [inquiries, searchQuery, statusFilter, typeFilter]);

  const currentPreviewImage = filePreview || resolveImageUrl(bannerConfig.bg_image);

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Header */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Festive Banner & Gifting Leads</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage your homepage promotional banner, upload seasonal festival themes, and track custom hamper leads.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveSubTab('banner')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer border-none ${
              activeSubTab === 'banner'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'bg-transparent text-gray-600 hover:text-black'
            }`}
          >
            Banner Configuration
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('leads')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer border-none flex items-center gap-1.5 ${
              activeSubTab === 'leads'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'bg-transparent text-gray-600 hover:text-black'
            }`}
          >
            <span>Customer Inquiries</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-gray-950">
              {inquiries.length}
            </span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. BANNER CONFIGURATION SUB-TAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'banner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Edit Texts, Upload & Settings */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-6 space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Banner Content & Festive Settings</h3>
              <p className="text-xs text-gray-400 mt-0.5">Customize texts, overlay opacity & festive wallpaper</p>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              {/* Eyebrow Badge */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Eyebrow Badge Text
                </label>
                <input
                  type="text"
                  value={bannerConfig.eyebrow}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, eyebrow: e.target.value })}
                  placeholder="e.g. BESPOKE GIFTING & BULK ORDERS"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              {/* Main Heading */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Main Heading <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bannerConfig.heading}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, heading: e.target.value })}
                  placeholder="e.g. Curate Your Custom Gift Hamper"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black font-medium"
                />
              </div>

              {/* Subheading */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Subtitle Description
                </label>
                <textarea
                  rows="3"
                  value={bannerConfig.subheading}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, subheading: e.target.value })}
                  placeholder="e.g. Celebrate Diwali, weddings, and corporate milestones..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black leading-relaxed"
                />
              </div>

              {/* Button Text */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={bannerConfig.button_text}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, button_text: e.target.value })}
                  placeholder="e.g. Request Custom Quote →"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              {/* Festive Wallpaper Upload (Multer) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Upload Festive Background Image
                </label>
                <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50/50 hover:bg-gray-50 transition text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="banner-image-upload"
                  />
                  <label
                    htmlFor="banner-image-upload"
                    className="flex flex-col items-center justify-center gap-1 cursor-pointer py-2"
                  >
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-700">
                      {selectedFile ? selectedFile.name : 'Choose Festive Image (Diwali, Christmas, etc.)'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      JPEG, PNG, WebP, AVIF up to 5MB. Saved directly in images/ folder.
                    </span>
                  </label>
                </div>
              </div>

              {/* Curated Festive Themes Presets */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Or Quick Select Festive Theme:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_FESTIVE_IMAGES.map((preset) => {
                    const isSelected = bannerConfig.bg_image === preset.url && !selectedFile;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        className={`p-2 rounded-lg text-left text-xs transition border cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 text-amber-900 font-semibold'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="line-clamp-1">{preset.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Overlay Opacity Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Dark Overlay Opacity</span>
                  <span className="text-gray-500 font-mono">
                    {Math.round((parseFloat(bannerConfig.overlay_opacity) || 0.65) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.95"
                  step="0.05"
                  value={bannerConfig.overlay_opacity}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, overlay_opacity: parseFloat(e.target.value) })}
                  className="w-full accent-black cursor-pointer"
                />
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Higher opacity improves contrast on vibrant Diwali/festive images.
                </span>
              </div>

              {/* Is Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <span className="text-xs font-semibold text-gray-900 block">Show Banner on Homepage</span>
                  <span className="text-[10px] text-gray-500">Toggle visibility on the live store</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBannerConfig({ ...bannerConfig, is_active: bannerConfig.is_active ? 0 : 1 })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                    bannerConfig.is_active ? 'bg-black' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      bannerConfig.is_active ? 'translate-x-[18px]' : 'translate-x-[2px]'
                    }`}
                  />
                </button>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isSavingBanner}
                className="w-full bg-[#0B1320] hover:bg-[#1a2638] text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {isSavingBanner ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Festive Banner...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Banner Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Live Preview: Shows exact live look */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-5">
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Live Banner Preview (Store View)
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                  {bannerConfig.is_active ? 'Active on Store' : 'Hidden on Store'}
                </span>
              </div>

              {/* Render simulated banner */}
              <div
                className="relative rounded-xl overflow-hidden shadow-lg p-5 sm:p-7 min-h-[360px] flex flex-col justify-between"
                style={{
                  backgroundColor: '#0d0d0d',
                  border: '1px solid rgba(244, 201, 93, 0.35)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* Background image preview */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                  style={{
                    backgroundImage: `url("${currentPreviewImage}")`
                  }}
                />

                {/* Directional Dark Gradient Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(10, 10, 14, 0.88) 0%, rgba(10, 10, 14, 0.65) 55%, rgba(10, 10, 14, 0.45) 100%)'
                  }}
                />

                {/* Secondary Opacity Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: `rgba(10, 10, 14, ${Math.max(0.15, parseFloat(bannerConfig.overlay_opacity || 0.65) * 0.4)})`
                  }}
                />

                {/* Preview Content */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Left preview */}
                  <div className="md:col-span-5 space-y-2.5">
                    <span className="inline-block text-[9px] font-bold tracking-[0.14em] text-[#FFE082] uppercase px-2.5 py-1 rounded-full bg-[#F4C95D]/10 border border-[#F4C95D]/40">
                      {bannerConfig.eyebrow || 'BESPOKE GIFTING & BULK ORDERS'}
                    </span>
                    <h3
                      className="font-heading text-lg sm:text-xl font-bold leading-tight"
                      style={{ textShadow: '0 2px 14px rgba(0, 0, 0, 0.75)' }}
                    >
                      <span className="text-white">Curate Your </span>
                      <span className="text-[#FFE082]">Custom Gift Hamper</span>
                    </h3>
                    <p
                      className="text-[11px] text-[#F3F4F6] line-clamp-3 leading-relaxed"
                      style={{ textShadow: '0 1px 8px rgba(0, 0, 0, 0.6)' }}
                    >
                      {bannerConfig.subheading}
                    </p>
                  </div>

                  {/* Right simulated form preview */}
                  <div
                    className="md:col-span-7 p-4 rounded-xl border border-white/15 space-y-2.5"
                    style={{
                      background: 'rgba(15, 15, 20, 0.78)',
                      backdropFilter: 'blur(16px)',
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 10px 25px rgba(0,0,0,0.3)'
                    }}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-6 rounded bg-white/[0.06] border border-white/20 text-[9px] text-white/70 flex items-center px-2">
                        Priya Sharma
                      </div>
                      <div className="h-6 rounded bg-white/[0.06] border border-white/20 text-[9px] text-white/70 flex items-center px-2">
                        priya@example.com
                      </div>
                      <div className="h-6 rounded bg-white/[0.06] border border-white/20 text-[9px] text-white/70 flex items-center px-2">
                        +91 98765 43210
                      </div>
                      <div className="h-6 rounded bg-white/[0.06] border border-white/20 text-[9px] text-white/70 flex items-center px-2">
                        Mumbai 400001
                      </div>
                    </div>

                    <div className="h-10 rounded bg-white/[0.06] border border-white/20 text-[9px] text-white/60 p-1.5 line-clamp-2">
                      Message: Need 50 festive luxury hampers for our corporate annual gala...
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <span className="text-[8px] text-slate-300 max-w-[140px] leading-tight">
                        Terms &amp; Privacy agreed
                      </span>
                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-full text-[10px] font-bold text-[#111] bg-[#F4C95D] hover:bg-[#ffcf66] border-none shadow-xs"
                      >
                        {bannerConfig.button_text || 'Request Custom Quote →'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-2 flex items-center justify-between text-[10px] text-white/75 border-t border-white/10">
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-[#FFE082]" /> Artisanal Gourmet</span>
                  <span className="flex items-center gap-1"><Gift className="w-3 h-3 text-[#FFE082]" /> Bespoke Curation</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-[#FFE082]" /> Pan-India Delivery</span>
                </div>
              </div>
            </div>

            {/* Quick stats on banner */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-4 text-center">
                <span className="text-[11px] text-gray-500 block">Total Inquiries</span>
                <span className="text-xl font-bold text-gray-900 mt-0.5 block">{inquiries.length}</span>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-4 text-center">
                <span className="text-[11px] text-gray-500 block">New Leads</span>
                <span className="text-xl font-bold text-amber-600 mt-0.5 block">
                  {inquiries.filter((i) => i.status === 'New').length}
                </span>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-4 text-center">
                <span className="text-[11px] text-gray-500 block">Converted</span>
                <span className="text-xl font-bold text-emerald-600 mt-0.5 block">
                  {inquiries.filter((i) => i.status === 'Converted').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. CUSTOMER INQUIRIES & LEADS SUB-TAB */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'leads' && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Custom Hamper Inquiries</h3>
              <p className="text-xs text-gray-500">
                {filteredInquiries.length} inquiries found {statusFilter !== 'All' ? `with status "${statusFilter}"` : ''}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search leads by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black bg-white cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black bg-white cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Festive / Personal">Festive / Personal</option>
                <option value="Corporate / Bulk">Corporate / Bulk</option>
              </select>

              {/* Reload Button */}
              <button
                type="button"
                onClick={loadData}
                disabled={isLoadingInquiries}
                className="p-1.5 text-gray-600 hover:text-black border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                title="Refresh leads list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInquiries ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Requirements</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5E7EB] text-xs text-gray-700">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-gray-400">
                      {isLoadingInquiries ? 'Loading inquiries...' : 'No customer inquiries found.'}
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inq) => {
                    const cleanPhone = (inq.phone || '').replace(/\D/g, '');
                    const waLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                      `Hello ${inq.name}, thank you for your custom hamper inquiry with The Gift Studio. We would be thrilled to assist you!`
                    )}`;

                    return (
                      <tr key={inq.id} className="hover:bg-gray-50/80 transition">
                        {/* Customer */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-900">{inq.name}</div>
                          <div className="text-[10px] text-gray-400">Lead #{inq.id}</div>
                        </td>

                        {/* Contact details */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-gray-800 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <a href={`tel:${inq.phone}`} className="hover:underline text-gray-800">
                              {inq.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mt-0.5">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <a href={`mailto:${inq.email}`} className="hover:underline text-gray-500">
                              {inq.email}
                            </a>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 text-gray-700">
                            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                            <span>{inq.city_pincode}</span>
                          </div>
                        </td>

                        {/* Requirements / Message */}
                        <td className="py-3.5 px-4 max-w-xs">
                          {inq.message ? (
                            <span className="text-gray-800 text-[11px] line-clamp-2 leading-relaxed" title={inq.message}>
                              {inq.message}
                            </span>
                          ) : inq.gifting_type || inq.delivery_timeline ? (
                            <span className="text-gray-500 text-[11px]">
                              {[inq.gifting_type, inq.delivery_timeline].filter(Boolean).join(' • ')}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[11px] italic">No specific message</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                          {inq.created_at ? new Date(inq.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : '—'}
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3.5 px-4">
                          <select
                            value={inq.status || 'New'}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-md border cursor-pointer ${
                              inq.status === 'New'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : inq.status === 'Contacted'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : inq.status === 'Proposal Sent'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : inq.status === 'Converted'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Converted">Converted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp Direct Chat */}
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>

                            {/* Delete inquiry */}
                            <button
                              type="button"
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition cursor-pointer border-none bg-transparent"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
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
    </div>
  );
}

