import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Filter,
  Check,
  Star,
  Eye,
  Truck,
  Sparkles,
  ChevronRight,
  X,
  ShieldCheck,
  Gift,
  HelpCircle,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useProducts } from '../../context/ProductContext';
import {
  HOME_DECOR_PRICE_TIERS,
  HOME_DECOR_SORT_OPTIONS,
  HOME_DECOR_SEO_CONTENT
} from '../../data/giftStudioData';

export default function HomeDecorPage({
  onQuickView
}) {
  const { products } = useProducts();

  const homeDecorProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.category) return false;
      const cat = p.category.toLowerCase();
      return (
        cat.includes('home decor') ||
        cat.includes('decor') ||
        cat.includes('pooja') ||
        cat.includes('tableware') ||
        cat.includes('candle') ||
        cat.includes('frames')
      );
    });
  }, [products]);

  const [selectedPriceTier, setSelectedPriceTier] = useState('all');
  const [customMin, setCustomMin] = useState('');
  const [customMax, setCustomMax] = useState('');
  const [appliedCustomRange, setAppliedCustomRange] = useState(null);
  const [isPricePopoverOpen, setIsPricePopoverOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(0);
  const [hoveredProductImage, setHoveredProductImage] = useState({});

  const popoverRef = useRef(null);
  const sortRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsPricePopoverOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate count for each price tier dynamically
  const tierCounts = useMemo(() => {
    const counts = {};
    HOME_DECOR_PRICE_TIERS.forEach((tier) => {
      counts[tier.id] = homeDecorProducts.filter(
        (p) => p.priceNum >= tier.min && p.priceNum <= tier.max
      ).length;
    });
    return counts;
  }, [homeDecorProducts]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let list = [...homeDecorProducts];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Custom price range takes precedence if set
    if (appliedCustomRange) {
      const { min, max } = appliedCustomRange;
      list = list.filter(
        (p) =>
          (min === null || p.priceNum >= min) &&
          (max === null || p.priceNum <= max)
      );
    } else if (selectedPriceTier !== 'all') {
      const tier = HOME_DECOR_PRICE_TIERS.find((t) => t.id === selectedPriceTier);
      if (tier) {
        list = list.filter((p) => p.priceNum >= tier.min && p.priceNum <= tier.max);
      }
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.priceNum - b.priceNum);
        break;
      case 'price-desc':
        list.sort((a, b) => b.priceNum - a.priceNum);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'bestselling':
        list.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'featured':
      default:
        // Keep original curated sequence
        break;
    }

    return list;
  }, [homeDecorProducts, searchQuery, selectedPriceTier, appliedCustomRange, sortBy]);

  const handleApplyCustomRange = (e) => {
    e.preventDefault();
    const minVal = customMin.trim() !== '' ? Number(customMin) : null;
    const maxVal = customMax.trim() !== '' ? Number(customMax) : null;
    if (minVal !== null || maxVal !== null) {
      setAppliedCustomRange({ min: minVal, max: maxVal });
      setSelectedPriceTier('custom');
      setIsPricePopoverOpen(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedPriceTier('all');
    setCustomMin('');
    setCustomMax('');
    setAppliedCustomRange(null);
    setSearchQuery('');
  };

  const isFilterActive = selectedPriceTier !== 'all' || appliedCustomRange !== null || searchQuery.trim() !== '';

  const activePriceLabel = useMemo(() => {
    if (appliedCustomRange) {
      const { min, max } = appliedCustomRange;
      if (min !== null && max !== null) return `₹${min} - ₹${max}`;
      if (min !== null) return `Min ₹${min}`;
      if (max !== null) return `Max ₹${max}`;
    }
    const current = HOME_DECOR_PRICE_TIERS.find((t) => t.id === selectedPriceTier);
    return current && current.id !== 'all' ? current.label : null;
  }, [appliedCustomRange, selectedPriceTier]);

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col text-gray-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Header & Navigation with active Category 'home-decor' */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory="home-decor"
      />

      {/* 2. Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-black transition no-underline text-gray-500">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">Collections</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900 font-semibold">Home Decor</span>
          </nav>
        </div>
      </div>

      {/* 3. Centered Page Header */}
      <section className="bg-gradient-to-b from-white via-[#fdfcfb] to-[#fafaf9] pt-10 pb-8 px-4 sm:px-6 text-center border-b border-gray-200/70">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-900 text-[11px] font-semibold tracking-widest uppercase mb-3 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Curated Living & Gifting</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-950 mb-3">
            Home Decor
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Elevate living spaces with hand-carved marble cheese boards, gleaming pure brass diyas,
            fragrant bell jar candles, and mother-of-pearl photo frames.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-5 text-xs text-gray-500 font-medium">
            <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              Earliest Delivery: Today
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300" />
            <span className="hidden sm:inline">100% Artisanal Craftsmanship</span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300" />
            <span className="hidden sm:inline">Pan-India Express Shipping</span>
          </div>
        </div>
      </section>

      {/* 4. Filter Bar (Price Dropdown Aligned to Left) */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left Aligned: Filter Bar with "Price" Dropdown Filter Button */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative" ref={popoverRef}>
              <button
                type="button"
                onClick={() => setIsPricePopoverOpen(!isPricePopoverOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer border ${
                  activePriceLabel
                    ? 'bg-amber-50 text-amber-950 border-amber-300 shadow-xs'
                    : 'bg-white text-gray-700 hover:text-black hover:bg-gray-50 border-gray-300'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
                <span>Price</span>
                {activePriceLabel && (
                  <span className="bg-amber-200/80 text-amber-950 font-bold text-[11px] px-1.5 py-0.2 rounded">
                    {activePriceLabel}
                  </span>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                    isPricePopoverOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Price Filter Dropdown Popover */}
              {isPricePopoverOpen && (
                <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                      Filter by Price
                    </span>
                    {(selectedPriceTier !== 'all' || appliedCustomRange) && (
                      <button
                        onClick={() => {
                          setSelectedPriceTier('all');
                          setAppliedCustomRange(null);
                          setCustomMin('');
                          setCustomMax('');
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer border-none bg-transparent p-0"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Standard Tiers */}
                  <div className="space-y-1">
                    {HOME_DECOR_PRICE_TIERS.map((tier) => {
                      const isSelected = selectedPriceTier === tier.id && !appliedCustomRange;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => {
                            setSelectedPriceTier(tier.id);
                            setAppliedCustomRange(null);
                            setIsPricePopoverOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm text-left transition cursor-pointer border-none ${
                            isSelected
                              ? 'bg-amber-50 font-bold text-amber-950'
                              : 'bg-transparent text-gray-700 hover:bg-gray-50 hover:text-black'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-gray-300'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span>{tier.label}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            ({tierCounts[tier.id] || 0})
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Price Range Inputs */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                      Custom Range (INR)
                    </span>
                    <form onSubmit={handleApplyCustomRange} className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                          <input
                            type="number"
                            placeholder="Min"
                            value={customMin}
                            onChange={(e) => setCustomMin(e.target.value)}
                            className="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black"
                          />
                        </div>
                        <span className="text-gray-400 text-xs">-</span>
                        <div className="flex-1 relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={customMax}
                            onChange={(e) => setCustomMax(e.target.value)}
                            className="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-black hover:bg-gray-800 text-white text-xs font-semibold py-2 rounded-md transition cursor-pointer"
                      >
                        Apply Price Filter
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Active Filter Pill Badge */}
            {isFilterActive && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer border-none"
                title="Clear all filters"
              >
                <span>Clear Filters</span>
                <X className="w-3 h-3 text-gray-500" />
              </button>
            )}
          </div>

          {/* Right Aligned: Product Count & Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:inline">
              Showing <strong className="text-gray-900">{filteredProducts.length}</strong> items
            </span>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 transition cursor-pointer"
              >
                <span className="text-gray-400 text-xs">Sort:</span>
                <span className="font-semibold text-gray-900">
                  {HOME_DECOR_SORT_OPTIONS.find((s) => s.id === sortBy)?.label || 'Featured'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {isSortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50">
                  {HOME_DECOR_SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.id);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm transition cursor-pointer border-none bg-transparent ${
                        sortBy === opt.id
                          ? 'font-bold text-black bg-amber-50/60'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Responsive 4-Column Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs max-w-lg mx-auto">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
              No Home Décor items match this filter
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Try adjusting your price range or search terms to explore our full artisanal catalogue.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((product) => {
              const currentImage =
                hoveredProductImage[product.id] && product.hoverImage
                  ? product.hoverImage
                  : product.image;

              return (
                <article
                  key={product.id}
                  className="group relative bg-white rounded-xl border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
                >
                  {/* Image Container with Uniform Aspect Ratio */}
                  <div
                    className="relative w-full aspect-square bg-[#f5f5f4] overflow-hidden cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredProductImage((prev) => ({ ...prev, [product.id]: true }))
                    }
                    onMouseLeave={() =>
                      setHoveredProductImage((prev) => ({ ...prev, [product.id]: false }))
                    }
                    onClick={() => onQuickView && onQuickView(product)}
                  >
                    <img
                      src={currentImage}
                      alt={product.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80';
                      }}
                    />

                    {/* Discount Sale Badge (Top Left) */}
                    {product.discountBadge && (
                      <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-xs z-10">
                        {product.discountBadge}
                      </span>
                    )}

                    {/* Quick View Button Hover Overlay */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView && onQuickView(product);
                        }}
                        className="flex-1 bg-white/95 hover:bg-white text-gray-900 text-xs font-semibold py-2 rounded-lg shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer border-none"
                      >
                        <Eye className="w-3.5 h-3.5 text-gray-600" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Details Section */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Brand Subtext */}
                      <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
                        {product.brand || 'THE GIFT STUDIO'}
                      </p>

                      {/* Product Title */}
                      <h2
                        onClick={() => onQuickView && onQuickView(product)}
                        className="text-sm font-semibold text-gray-900 group-hover:text-amber-900 line-clamp-2 leading-snug cursor-pointer transition mb-2"
                        title={product.title}
                      >
                        {product.title}
                      </h2>

                      {/* Star Rating with Review Count */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : i < product.rating
                                  ? 'fill-amber-400/50 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-medium text-gray-500">
                          ({product.reviews || 8})
                        </span>
                      </div>

                      {/* Price in INR with strike-through and discount badge */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-base sm:text-lg font-bold text-gray-950">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                        {product.discountBadge && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {product.discountBadge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Section: Delivery Badge & Add to Bag */}
                    <div className="space-y-2.5 pt-2 border-t border-gray-100">
                      {/* Delivery Truck Badge Pill */}
                      <div className="inline-flex items-center gap-1.5 bg-emerald-50/90 text-emerald-800 text-[11px] font-semibold px-2.5 py-1 rounded-full w-full justify-center border border-emerald-200/50">
                        <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Earliest delivery: {product.earliestDelivery || 'Today'}</span>
                      </div>

                      {/* View Details Button */}
                      <button
                        type="button"
                        onClick={() => onQuickView && onQuickView(product)}
                        className="w-full bg-black hover:bg-gray-800 text-white text-xs font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-300" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* 6. Content & SEO Section (Below Grid) */}
      <section className="bg-white border-t border-gray-200 mt-12 py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Main Editorial Heading & Introductory Paragraphs */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 block mb-2">
              The Gift Studio Journal
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-950 mb-4 leading-tight">
              {HOME_DECOR_SEO_CONTENT.mainHeading}
            </h2>
            <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-6" />
            <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed text-left sm:text-center max-w-3xl mx-auto">
              {HOME_DECOR_SEO_CONTENT.introParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* Why Choose Our Home Décor Presents? */}
          <div className="mb-14 bg-gradient-to-br from-[#fcfbf9] to-[#faf8f5] rounded-2xl p-6 sm:p-10 border border-amber-200/40">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center sm:text-left">
              {HOME_DECOR_SEO_CONTENT.whyChooseHeading}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {HOME_DECOR_SEO_CONTENT.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-5 border border-gray-200/70 shadow-xs hover:border-amber-300 transition"
                >
                  <h4 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {feat.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive FAQs Accordion */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Frequently Asked Questions</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                Home Décor Gifting Guidance
              </h3>
            </div>

            <div className="space-y-3">
              {HOME_DECOR_SEO_CONTENT.faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white transition"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm text-gray-900 hover:text-black transition cursor-pointer bg-transparent border-none"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-amber-700' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 pt-10 border-t border-gray-200 text-center">
            <div className="space-y-1.5">
              <ShieldCheck className="w-6 h-6 text-amber-600 mx-auto" />
              <p className="text-xs font-bold text-gray-900">100% Genuine Materials</p>
              <p className="text-[11px] text-gray-500">Brass, Marble & Natural Agate</p>
            </div>
            <div className="space-y-1.5">
              <Truck className="w-6 h-6 text-amber-600 mx-auto" />
              <p className="text-xs font-bold text-gray-900">Same Day Dispatch</p>
              <p className="text-[11px] text-gray-500">Across Key Indian Metros</p>
            </div>
            <div className="space-y-1.5">
              <Gift className="w-6 h-6 text-amber-600 mx-auto" />
              <p className="text-xs font-bold text-gray-900">Signature Luxury Wrap</p>
              <p className="text-[11px] text-gray-500">Free Bespoke Greeting Note</p>
            </div>
            <div className="space-y-1.5">
              <RotateCcw className="w-6 h-6 text-amber-600 mx-auto" />
              <p className="text-xs font-bold text-gray-900">Zero Transit Breakage</p>
              <p className="text-[11px] text-gray-500">Instant Replacement Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
