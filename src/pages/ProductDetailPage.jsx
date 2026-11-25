import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  Send,
  MessageCircle,
  CheckCircle2,
  Loader2,
  PackageX,
  X,
  Sparkles,
  ArrowLeft
} from '../components/FaIcons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import resolveImageUrl, { parseGalleryImages } from '../utils/image';
import { apiService } from '../services/api';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  // Inquire Modal State
  const [isInquireModalOpen, setIsInquireModalOpen] = useState(false);
  const [inquireForm, setInquireForm] = useState({
    name: '',
    phone: '',
    email: '',
    city_pincode: '',
    message: ''
  });
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // Fetch product and categories on mount or slug change
  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'instant' });

    async function loadData() {
      if (!slug) return;
      setIsLoading(true);
      setErrorMessage('');
      setActiveImageIndex(0);
      setImgFailed(false);

      try {
        const [prodRes, catRes] = await Promise.all([
          apiService.getProductById(slug),
          apiService.getCategories().catch(() => ({ success: false }))
        ]);

        if (!prodRes?.success || !prodRes?.product) {
          throw new Error(prodRes?.message || 'Product not found');
        }

        if (isMounted) {
          setProduct(prodRes.product);
          if (catRes?.success && Array.isArray(catRes.categories)) {
            setCategories(catRes.categories);
          }
        }
      } catch (err) {
        console.error('Failed to load product details from API:', err);
        if (isMounted) {
          setErrorMessage(err.message || 'Product could not be loaded.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Dynamic Document Title
  useEffect(() => {
    if (product?.title) {
      document.title = `${product.title} | The Gift Studio`;
    }
  }, [product]);

  // Gallery images list (safe parser for arrays, JSON strings, single strings, fallback)
  const galleryImages = useMemo(() => {
    return parseGalleryImages(product);
  }, [product]);

  // Pricing calculations
  const priceNumeric = Number(product?.priceNum || 0);
  const originalPriceNumeric = product?.originalPrice ? Number(product.originalPrice) : null;
  const hasDiscount = originalPriceNumeric !== null && originalPriceNumeric > priceNumeric;
  const discountPercent = hasDiscount
    ? Math.round(((originalPriceNumeric - priceNumeric) / originalPriceNumeric) * 100)
    : null;

  // Active main image (safe bounds checking)
  const safeActiveIndex =
    activeImageIndex >= 0 && activeImageIndex < galleryImages.length ? activeImageIndex : 0;
  const currentImageUrl =
    galleryImages[safeActiveIndex] || galleryImages[0] || product?.image;

  // Open Inquiry Modal
  const handleOpenInquire = () => {
    if (!product) return;
    setInquirySuccess(false);
    setInquiryError('');
    setInquireForm({
      name: '',
      phone: '',
      email: '',
      city_pincode: '',
      message: `Hi, I am interested in inquiring about "${product.title}" (₹${priceNumeric.toLocaleString('en-IN')}).`
    });
    setIsInquireModalOpen(true);
  };

  const handleCloseInquire = () => {
    setIsInquireModalOpen(false);
    setInquirySuccess(false);
    setInquiryError('');
  };

  // Submit Inquiry to backend
  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!inquireForm.name.trim() || !inquireForm.phone.trim()) {
      setInquiryError('Please provide your name and phone number.');
      return;
    }

    setIsSubmittingInquiry(true);
    setInquiryError('');

    try {
      const payload = {
        name: inquireForm.name.trim(),
        phone: inquireForm.phone.trim(),
        email: inquireForm.email.trim() || 'not_provided@giftstudio.in',
        city_pincode: inquireForm.city_pincode.trim() || 'Pan India',
        message: `${inquireForm.message.trim()} [Product ID: ${product?.id}, Category: ${product?.category}]`,
        gifting_type: product?.title || 'Product Inquiry'
      };

      const res = await apiService.submitGiftingInquiry(payload);
      if (res?.success) {
        setInquirySuccess(true);
      } else {
        setInquiryError(res?.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Inquiry submission error:', err);
      setInquiryError(err.message || 'Failed to submit inquiry.');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  const directCategory = categories.find(
    (c) =>
      (product?.category_id && String(c.id) === String(product.category_id)) ||
      (product?.category_slug && c.slug === product.category_slug) ||
      (product?.category && c.name?.toLowerCase() === product.category.toLowerCase())
  );

  const parentCategory = directCategory?.parent_id
    ? categories.find((c) => String(c.id) === String(directCategory.parent_id))
    : null;

  const categorySlug =
    directCategory?.slug ||
    product?.category_slug ||
    (product?.category ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '');

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900" style={{ backgroundColor: '#FAF7F2' }}>
      <Header />

      <div className="border-b border-[#2D4737] bg-[#182C20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-400 overflow-x-auto">
            <Link to="/" className="hover:text-[#D4AF37] transition font-medium whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <Link to="/category" className="hover:text-[#D4AF37] transition font-medium whitespace-nowrap">
              Categories
            </Link>
            {parentCategory && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <Link
                  to={`/category/${parentCategory.slug || parentCategory.id}`}
                  className="hover:text-[#D4AF37] transition font-medium whitespace-nowrap capitalize text-stone-400"
                >
                  {parentCategory.name}
                </Link>
              </>
            )}
            {directCategory ? (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <Link
                  to={`/category/${directCategory.slug || directCategory.id}`}
                  className="hover:text-[#D4AF37] transition font-medium whitespace-nowrap capitalize text-stone-400"
                >
                  {directCategory.name}
                </Link>
              </>
            ) : product?.category ? (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span className="text-stone-400 capitalize">{product.category}</span>
              </>
            ) : null}
            <ChevronRight className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span className="text-[#D4AF37] font-semibold truncate max-w-xs sm:max-w-md">
              {product?.title || 'Product'}
            </span>
          </nav>
        </div>
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-10 h-10 border-3 border-[#C62828] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="font-serif text-base text-stone-800 font-medium">Curating gift presentation...</p>
            <p className="text-stone-500 text-xs mt-1">Fetching bespoke product details</p>
          </div>
        )}

        {!isLoading && (errorMessage || !product) && (
          <div className="text-center py-16 px-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-red-50 text-[#C62828] flex items-center justify-center mx-auto mb-3 border border-red-200">
              <PackageX className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">Gift Not Found</h2>
            <p className="text-stone-600 text-xs sm:text-sm mb-5">
              {errorMessage || 'The luxury gift you are looking for might have been retired or moved.'}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs sm:text-sm font-semibold shadow-sm transition hover:opacity-90 no-underline"
              style={{ backgroundColor: '#C62828' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Collections</span>
            </Link>
          </div>
        )}

        {!isLoading && product && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3.5 items-start">
              
              {galleryImages.length > 1 && (
                <div
                  className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto w-full sm:w-14 shrink-0 max-h-[460px] pb-1 sm:pb-0 select-none scrollbar-thin"
                  role="tablist"
                  aria-label="Product image gallery thumbnails"
                >
                  {galleryImages.map((imgUrl, idx) => {
                    const isActive = idx === safeActiveIndex;
                    const resolvedThumb = resolveImageUrl(imgUrl);

                    return (
                      <button
                        key={`${imgUrl}-${idx}`}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`View photo ${idx + 1} of ${galleryImages.length}`}
                        onClick={() => {
                          setActiveImageIndex(idx);
                          setImgFailed(false);
                        }}
                        onMouseEnter={() => {
                          setActiveImageIndex(idx);
                          setImgFailed(false);
                        }}
                        className={`relative aspect-square w-14 h-14 rounded-lg overflow-hidden border-2 bg-[#F8F5F0] cursor-pointer transition-all duration-200 shrink-0 p-0 ${
                          isActive
                            ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-xs'
                            : 'border-[#2D4737] hover:border-[#D4AF37] opacity-80 hover:opacity-100'
                        }`}
                        title={`View photo ${idx + 1}`}
                      >
                        <img
                          src={resolvedThumb}
                          alt={`${product.title || 'Product'} thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/gift_logo.jpeg';
                          }}
                        />
                        {idx === 0 && (
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[7px] font-bold text-center py-0.5 tracking-wider uppercase backdrop-blur-2xs">
                            Cover
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex-1 w-full h-[360px] sm:h-[440px] max-h-[460px] rounded-xl overflow-hidden border border-[#E8DFD3] bg-[#F8F5F0] relative shadow-xs flex items-center justify-center group">
                {hasDiscount && (
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
                      style={{ backgroundColor: '#8B2635' }}
                    >
                      {discountPercent}% OFF
                    </span>
                  </div>
                )}

                {!imgFailed && currentImageUrl ? (
                  <img
                    src={resolveImageUrl(currentImageUrl)}
                    alt={product.title}
                    className="w-full h-full object-cover object-center transition-all duration-300"
                    onError={() => setImgFailed(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FAF7F2] to-[#F3ECE1]">
                    <div className="w-12 h-12 rounded-full bg-white border border-[#E8DFD3] flex items-center justify-center text-[#8B2635] font-serif font-bold text-lg mb-2 shadow-xs">
                      {product.title ? product.title.substring(0, 2).toUpperCase() : 'TG'}
                    </div>
                    <span className="font-serif text-xs text-stone-600 font-medium">The Gift Studio</span>
                  </div>
                )}

                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) =>
                          prev <= 0 ? galleryImages.length - 1 : prev - 1
                        );
                        setImgFailed(false);
                      }}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center shadow-md backdrop-blur-xs transition opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105 cursor-pointer z-10 border border-stone-200/50"
                      aria-label="Previous gallery image"
                      title="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) =>
                          prev >= galleryImages.length - 1 ? 0 : prev + 1
                        );
                        setImgFailed(false);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center shadow-md backdrop-blur-xs transition opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105 cursor-pointer z-10 border border-stone-200/50"
                      aria-label="Next gallery image"
                      title="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {galleryImages.length > 1 && (
                  <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs select-none">
                    {safeActiveIndex + 1} / {galleryImages.length}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              
              <div>
                {product.brand && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B2635] mb-1 block">
                    {product.brand}
                  </span>
                )}
                
                <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight leading-snug">
                  {product.title}
                </h1>

                {product.category && (
                  <div className="mt-2">
                    <Link
                      to={categorySlug ? `/category/${categorySlug}` : '/'}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#223B2D] hover:bg-[#284635] text-stone-200 hover:text-white transition no-underline border border-[#2D4737]"
                    >
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span className="capitalize">{product.category}</span>
                    </Link>
                  </div>
                )}
              </div>

              <div className="py-3.5 px-4 rounded-xl bg-[#182C20] border border-[#2D4737] shadow-sm">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    ₹{priceNumeric.toLocaleString('en-IN')}
                  </span>
                  
                  {hasDiscount && (
                    <>
                      <span className="text-sm sm:text-base text-stone-400 line-through">
                        ₹{originalPriceNumeric.toLocaleString('en-IN')}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: '#8B2635' }}
                      >
                        Save {discountPercent}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-stone-300 mt-1.5">
                  Inclusive of all taxes · Handcrafted luxury packaging included
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={handleOpenInquire}
                  className="w-full py-3 px-6 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition hover:scale-[1.01] active:scale-99 border-none bg-gradient-to-r from-[#D4AF37] to-[#C59D5F] hover:from-[#DFBD4B] hover:to-[#D4AF37] text-stone-950"
                >
                  <Send className="w-4 h-4 text-stone-900" />
                  <span>Inquire About This Gift</span>
                </button>

                <a
                  href={`https://wa.me/919855840007?text=${encodeURIComponent(
                    `Hi, I am interested in inquiring about "${product.title}" (₹${priceNumeric.toLocaleString('en-IN')}) from The Gift Studio.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 no-underline shadow-xs hover:border-[#25D366] transition bg-[#1C3024] hover:bg-[#233D2E] border border-[#2D4737]"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {product.description && (
                <div className="pt-4 border-t border-[#E8DFD3]">
                  <h3 className="font-serif text-sm font-bold text-stone-900 mb-2">
                    Product Details & Craftsmanship
                  </h3>
                  <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line space-y-1.5">
                    {product.description}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}
      </main>

      {isInquireModalOpen && product && (
        <div className="fixed inset-0 z-[100] !m-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-[#E8DFD3] max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={handleCloseInquire}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 p-1 rounded-full transition cursor-pointer border-none bg-transparent"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C62828]">
                Concierge Assistance
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
                Inquire About Gift
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Share your details and our concierge team will reach out with availability, customization, and delivery options.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/70 mb-5">
              <img
                src={resolveImageUrl(product.image)}
                alt={product.title}
                className="w-12 h-12 rounded-lg object-cover bg-white border border-stone-200 shrink-0"
                onError={(e) => {
                  e.currentTarget.src = '/images/gift_logo.jpeg';
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-xs text-stone-900 truncate">
                  {product.title}
                </p>
                <p className="text-xs font-bold text-[#C62828] mt-0.5">
                  ₹{priceNumeric.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {inquirySuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-900">
                  Inquiry Received!
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Thank you! Our concierge team has received your query and will connect with you via phone or WhatsApp shortly.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCloseInquire}
                    className="px-6 py-2 rounded-full text-xs font-semibold text-white cursor-pointer transition shadow-xs border-none"
                    style={{ backgroundColor: '#C62828' }}
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmitInquiry} className="space-y-3.5">
                {inquiryError && (
                  <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                    {inquiryError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={inquireForm.name}
                      onChange={(e) => setInquireForm({ ...inquireForm, name: e.target.value })}
                      placeholder="e.g. Aditi Sharma"
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={inquireForm.phone}
                      onChange={(e) => setInquireForm({ ...inquireForm, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inquireForm.email}
                      onChange={(e) => setInquireForm({ ...inquireForm, email: e.target.value })}
                      placeholder="e.g. aditi@example.com"
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      City / Pincode
                    </label>
                    <input
                      type="text"
                      value={inquireForm.city_pincode}
                      onChange={(e) => setInquireForm({ ...inquireForm, city_pincode: e.target.value })}
                      placeholder="e.g. Mumbai, 400001"
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Message / Special Requests
                  </label>
                  <textarea
                    rows={2}
                    value={inquireForm.message}
                    onChange={(e) => setInquireForm({ ...inquireForm, message: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C62828] resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className="w-full sm:flex-1 py-2.5 rounded-full text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition disabled:opacity-60 border-none"
                    style={{ backgroundColor: '#C62828' }}
                  >
                    {isSubmittingInquiry ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://wa.me/919855840007?text=${encodeURIComponent(
                      `Hi, I am inquiring about "${product.title}" (₹${priceNumeric.toLocaleString('en-IN')}) from The Gift Studio.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-full text-xs font-semibold text-white flex items-center justify-center gap-1.5 no-underline shadow-xs hover:opacity-90 transition"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
