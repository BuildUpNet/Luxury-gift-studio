import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Filter,
  Check,
  Star,
  ShoppingBag,
  Heart,
  Eye,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Calendar,
  ArrowRight
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { DIWALI_HAMPERS, DIWALI_GIFTING_IDEAS } from '../../data/diwaliHampersData';

// Price tier definitions matching requirements
const PRICE_TIERS = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: '1000-1499', label: '₹1,000 - ₹1,499', shortLabel: '1000 - 1499', min: 1000, max: 1499 },
  { id: '1500-3499', label: '₹1,500 - ₹3,499', shortLabel: '1500 - 3499', min: 1500, max: 3499 },
  { id: '3500-4999', label: '₹3,500 - ₹4,999', shortLabel: '3500 - 4999', min: 3500, max: 4999 },
  { id: 'above-5000', label: 'Above ₹5,000', shortLabel: 'Above 5000', min: 5000, max: Infinity }
];

export default function DiwaliHampersPage({
  cart,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  onOpenCart,
  onOpenWishlist,
  onQuickView
}) {
  // Filters & Sorting state
  const [selectedPriceTier, setSelectedPriceTier] = useState('all');
  const [isPricePopoverOpen, setIsPricePopoverOpen] = useState(false);
  const [sortBy, setSortBy] = useState('just-arrived'); // default Just Arrived
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSeoExpanded, setIsSeoExpanded] = useState(false);
  const [activeImageIndices, setActiveImageIndices] = useState({});

  const popoverRef = useRef(null);
  const sortRef = useRef(null);

  // Close popovers on click outside
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



  // Calculate count for each price tier
  const tierCounts = useMemo(() => {
    const counts = {};
    PRICE_TIERS.forEach((tier) => {
      counts[tier.id] = DIWALI_HAMPERS.filter(
        (p) => p.priceNum >= tier.min && p.priceNum <= tier.max
      ).length;
    });
    return counts;
  }, []);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    let list = [...DIWALI_HAMPERS];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Price tier filter
    if (selectedPriceTier !== 'all') {
      const tier = PRICE_TIERS.find((t) => t.id === selectedPriceTier);
      if (tier) {
        list = list.filter((p) => p.priceNum >= tier.min && p.priceNum <= tier.max);
      }
    }

    // Sorting
    if (sortBy === 'just-arrived') {
      list.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
    } else if (sortBy === 'price-low') {
      list.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.priceNum - a.priceNum);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedPriceTier, sortBy, searchQuery]);

  const activeTierObj = PRICE_TIERS.find((t) => t.id === selectedPriceTier);

  const handleNextImage = (e, productId, totalImages) => {
    e.stopPropagation();
    setActiveImageIndices((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const handlePrevImage = (e, productId, totalImages) => {
    e.stopPropagation();
    setActiveImageIndices((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      {/* 1. Shared Header */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={onOpenCart}
        onOpenWishlist={onOpenWishlist}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory="diwali"
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-[#faf9f6] border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-black transition">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">Collections</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900 font-medium">Diwali Gift Hampers</span>
          </nav>
        </div>
      </div>

      {/* 2. Page Hero / Title */}
      <section className="bg-gradient-to-b from-[#faf9f6] via-[#fcfbf9] to-white py-12 px-4 sm:px-6 text-center border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-900 text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Festive Season 2026</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-950 mb-4">
            Diwali Gift Hampers
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Celebrate the auspicious festival of lights with our thoughtfully curated luxury hampers.
            Featuring artisanal sweets, slow-roasted nuts, pure brass diyas, and keepsake gift trunks.
          </p>

          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Earliest Delivery: Tomorrow
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300" />
            <span className="hidden sm:inline">Handcrafted & Temperature Protected</span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-300" />
            <span className="hidden sm:inline">Pan-India Express Shipping</span>
          </div>
        </div>
      </section>

      {/* 3. Filter Bar & Controls */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Price Dropdown Popover */}
            <div className="relative" ref={popoverRef}>
              <button
                type="button"
                onClick={() => setIsPricePopoverOpen(!isPricePopoverOpen)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition cursor-pointer ${
                  selectedPriceTier !== 'all'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                aria-expanded={isPricePopoverOpen}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>
                  {selectedPriceTier !== 'all'
                    ? `Price: ${activeTierObj?.shortLabel}`
                    : 'Price'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isPricePopoverOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Price Popover Panel */}
              {isPricePopoverOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Filter by Price
                    </span>
                    {selectedPriceTier !== 'all' && (
                      <button
                        onClick={() => setSelectedPriceTier('all')}
                        className="text-xs text-amber-700 hover:text-amber-900 font-semibold cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {PRICE_TIERS.map((tier) => {
                      const isSelected = selectedPriceTier === tier.id;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => {
                            setSelectedPriceTier(tier.id);
                            setIsPricePopoverOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer text-left ${
                            isSelected
                              ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                                isSelected
                                  ? 'border-amber-600 bg-amber-600'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span>{tier.label}</span>
                          </div>
                          <span className="text-[11px] text-gray-400 font-normal">
                            ({tierCounts[tier.id]})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sort Pill: "Just Arrived" */}
            <button
              type="button"
              onClick={() => {
                // If already just-arrived, toggles or reconfirms
                setSortBy('just-arrived');
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition cursor-pointer ${
                sortBy === 'just-arrived'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Just Arrived</span>
              {sortBy === 'just-arrived' && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-1" />
              )}
            </button>

            {/* Additional Sort Options Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition cursor-pointer"
              >
                <span>
                  {sortBy === 'just-arrived'
                    ? 'Sort: Just Arrived'
                    : sortBy === 'price-low'
                    ? 'Price: Low to High'
                    : sortBy === 'price-high'
                    ? 'Price: High to Low'
                    : 'Highest Rated'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {isSortDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50">
                  {[
                    { id: 'just-arrived', label: 'Just Arrived' },
                    { id: 'price-low', label: 'Price: Low to High' },
                    { id: 'price-high', label: 'Price: High to Low' },
                    { id: 'rating', label: 'Highest Rated' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSortBy(option.id);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition cursor-pointer ${
                        sortBy === option.id
                          ? 'bg-amber-50 text-amber-900 font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters Button if filtered */}
            {selectedPriceTier !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedPriceTier('all')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer border border-red-200"
              >
                <span>Clear Price</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Right: Products Count */}
          <div className="text-xs text-gray-500 font-medium">
            Showing <strong className="text-gray-900">{filteredProducts.length}</strong> Diwali Hampers
          </div>
        </div>
      </section>

      {/* 4. Product Grid Section (4-column responsive grid) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-7">
            {filteredProducts.map((product) => {
              const images = product.images && product.images.length > 0 ? product.images : [product.image];
              const currentIndex = activeImageIndices[product.id] || 0;
              const isWishlisted = wishlist.some((item) => item.id === product.id);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
                >
                  {/* Top Badges (Festive badge + Wishlist Button) */}
                  <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                    <span className="pointer-events-auto px-2.5 py-1 rounded bg-slate-900/90 text-white text-[11px] font-bold tracking-wide uppercase shadow-sm backdrop-blur-sm">
                      {product.badge || 'Diwali Special'}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-gray-200 flex items-center justify-center text-gray-700 shadow-sm transition hover:scale-110 cursor-pointer"
                      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        className={`w-4 h-4 transition ${
                          isWishlisted ? 'text-red-600 fill-red-600' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Image Container */}
                  <div
                    onClick={() => onQuickView(product)}
                    className="relative w-full pt-[100%] bg-gray-50 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={images[currentIndex] || product.image}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://thegiftstudio.com/cdn/shop/files/Savoir_Faire_1456433_01.png?v=1768807625&width=533";
                      }}
                    />

                    {/* Image Carousel Arrows (shown on hover if multiple images) */}
                    {images.length > 1 && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={(e) => handlePrevImage(e, product.id, images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-gray-800 border border-gray-200 flex items-center justify-center shadow-md cursor-pointer transition z-10"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleNextImage(e, product.id, images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-gray-800 border border-gray-200 flex items-center justify-center shadow-md cursor-pointer transition z-10"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Quick View Button on Hover */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView(product);
                        }}
                        className="w-full py-2 bg-white/95 hover:bg-white text-gray-900 text-xs font-bold rounded shadow-md border border-gray-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Brand Name */}
                    <div className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-1">
                      {product.brand || 'THE GIFT STUDIO'}
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onQuickView(product)}
                      className="text-sm font-semibold text-gray-900 group-hover:text-amber-800 transition line-clamp-2 min-h-[2.5rem] leading-snug cursor-pointer mb-2"
                      title={product.title}
                    >
                      {product.title}
                    </h3>

                    {/* Star Ratings */}
                    <div className="flex items-center gap-1 mb-3 text-xs">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </div>
                      <span className="font-bold text-gray-800">{product.rating}</span>
                      <span className="text-gray-400 text-[11px]">({product.reviews})</span>
                    </div>

                    {/* "Earliest delivery: Tomorrow" Badge */}
                    <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-100/80 text-emerald-800 text-[11px] font-semibold">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{product.deliveryBadge || 'Earliest delivery: Tomorrow'}</span>
                    </div>

                    {/* Pricing & Add to Bag */}
                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-extrabold text-gray-950">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
              No Diwali Hampers match your filter
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Try adjusting your price range or search terms to explore our collection.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedPriceTier('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wide uppercase hover:bg-slate-800 transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* 5. SEO / Description Section */}
      <section className="bg-[#fbfaf8] border-t border-b border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-left sm:text-center">
          <span className="text-xs font-bold tracking-widest text-amber-700 uppercase mb-2 block">
            Festive Heritage & Gifting Excellence
          </span>
          
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-950 mb-3">
            Diwali Gifts and Hampers
          </h2>

          <p className="text-base sm:text-lg text-amber-900/80 font-medium mb-6">
            Celebrate the Festival of Lights with the Best Diwali Gifts and Hampers
          </p>

          <div className="text-sm text-gray-600 leading-relaxed space-y-4 text-left sm:text-center">
            <p>
              Diwali is the pinnacle celebration of light overcoming darkness, prosperity welcoming good fortune,
              and heartfelt bonds renewed across families, friends, and corporate associates. At The Gift Studio,
              every Diwali gift hamper is hand-assembled to reflect timeless Indian festive rituals combined with
              contemporary luxury aesthetics.
            </p>

            {isSeoExpanded && (
              <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                <p>
                  From gold-foiled artisanal dry fruit caskets and slow-churned mithai delicacies to hand-poured soy
                  scented candles and authentic brass diyas, our collection offers exquisite choices for every celebration.
                  Whether you are planning personal gifting for beloved relatives or curated corporate gifting for valued
                  clients and hardworking team members, our temperature-guaranteed packaging ensures freshness at every doorstep.
                </p>
                <p>
                  Enjoy seamless pan-India delivery, earliest next-day delivery options across major cities, and custom
                  festive greetings to make every gift an unforgettable experience. Light up every home and heart with
                  thoughtful indulgence from The Gift Studio.
                </p>
              </div>
            )}

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => setIsSeoExpanded(!isSeoExpanded)}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-amber-950 border-b border-amber-800 pb-0.5 transition cursor-pointer"
              >
                <span>{isSeoExpanded ? 'SHOW LESS -' : 'SHOW MORE +'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Gifting Ideas Section (3-card blog grid) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-amber-700 uppercase block mb-2">
            Festive Journal & Inspiration
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-950 mb-3">
            Diwali Gifting Ideas
          </h2>
          <p className="text-sm text-gray-600">
            Expert guides and inspirational ideas to elevate your festive gifting this season.
          </p>
        </div>

        {/* 3-card blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DIWALI_GIFTING_IDEAS.map((idea) => (
            <article
              key={idea.id}
              className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Blog Image */}
              <div className="relative w-full h-52 overflow-hidden bg-gray-100">
                <img
                  src={idea.image}
                  alt={idea.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-gray-900 text-[11px] font-bold tracking-wide uppercase backdrop-blur-sm shadow-sm">
                  {idea.category}
                </span>
              </div>

              {/* Blog Body */}
              <div className="p-6 flex flex-col flex-1">
                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold mb-2.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{idea.date}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-400 font-normal">{idea.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-amber-800 transition line-clamp-2 mb-3 leading-snug">
                  {idea.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-gray-600 leading-relaxed mb-6 line-clamp-3">
                  {idea.excerpt}
                </p>

                {/* Read Action */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 group-hover:text-amber-700 transition flex items-center gap-1">
                    Read Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. Shared Footer */}
      <Footer />
    </div>
  );
}
