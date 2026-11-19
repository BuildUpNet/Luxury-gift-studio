import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  SlidersHorizontal,
  PackageX,
  Sparkles,
  ArrowUpDown,
  Loader2,
  CalendarHeart,
  X
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import resolveImageUrl, { parseGalleryImages } from '../utils/image';
import { apiService } from '../services/api';

/**
 * Helper to dynamically create sensible price brackets based on products
 */
function generatePriceBrackets(products = []) {
  if (!products || products.length === 0) return [];

  const prices = products
    .map((p) => Number(p?.priceNum))
    .filter((price) => !isNaN(price) && price > 0);

  if (prices.length === 0) return [];

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    return [
      {
        id: 'bracket-single',
        label: `₹${minPrice.toLocaleString('en-IN')}`,
        min: minPrice,
        max: maxPrice
      }
    ];
  }

  const range = maxPrice - minPrice;
  const candidateSteps = [500, 1000, 1500, 2000, 2500, 5000, 10000];
  let step = candidateSteps[candidateSteps.length - 1];

  for (const s of candidateSteps) {
    const count = Math.ceil(range / s);
    if (count <= 6 && count >= 2) {
      step = s;
      break;
    }
  }

  let start = Math.floor(minPrice / step) * step;
  const brackets = [];
  let currentMin = start;

  while (currentMin < maxPrice && brackets.length < 5) {
    const currentMax = currentMin + step;
    const label =
      currentMin === 0
        ? `Under ₹${currentMax.toLocaleString('en-IN')}`
        : `₹${currentMin.toLocaleString('en-IN')} - ₹${currentMax.toLocaleString('en-IN')}`;

    brackets.push({
      id: `${currentMin}-${currentMax}`,
      label,
      min: currentMin,
      max: currentMax
    });
    currentMin = currentMax;
  }

  if (currentMin <= maxPrice) {
    brackets.push({
      id: `above-${currentMin}`,
      label: `Above ₹${currentMin.toLocaleString('en-IN')}`,
      min: currentMin,
      max: Infinity
    });
  }

  return brackets;
}

/**
 * Clean Product Card Component matching category card proportions
 */
function ProductCard({ product }) {
  const [imgFailed, setImgFailed] = useState(false);

  const priceNumeric = Number(product?.priceNum || 0);
  const originalPriceNumeric = product?.originalPrice ? Number(product.originalPrice) : null;
  const hasDiscount = originalPriceNumeric && originalPriceNumeric > priceNumeric;

  const gallery = parseGalleryImages(product);
  const primaryImage = gallery[0] || product?.image;
  const resolvedImageUrl = resolveImageUrl(primaryImage);

  return (
    <Link
      to={`/product/${product?.slug || product?.id}`}
      className="group bg-white rounded-xl border border-[#E8DFD3]/80 hover:border-[#8B2635]/40 transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md flex flex-col no-underline text-inherit"
    >
      {/* Product Image Frame: Standardized aspect-[4/5] container (max-h-[260px]) */}
      <div className="relative w-full aspect-[4/5] max-h-[260px] bg-[#F7F5F0] overflow-hidden">
        {resolvedImageUrl && !imgFailed ? (
          <img
            src={resolvedImageUrl}
            alt={product?.title || 'Gift Product'}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#FAF7F2] to-[#F3ECE1]">
            <div className="w-10 h-10 rounded-full bg-white border border-[#E8DFD3] flex items-center justify-center text-[#8B2635] font-serif font-bold text-sm mb-1.5 shadow-2xs">
              {product?.title ? product.title.substring(0, 2).toUpperCase() : 'TG'}
            </div>
            <span className="font-serif text-[11px] text-stone-600 font-medium">The Gift Studio</span>
          </div>
        )}

        {product?.category && (
          <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {product.category}
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-sans text-sm font-medium text-stone-900 group-hover:text-[#8B2635] transition-colors line-clamp-1 leading-snug" title={product?.title}>
            {product?.title || 'Untitled Gift'}
          </h3>

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-sans text-sm font-bold text-stone-950">
              ₹{priceNumeric.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-stone-400 line-through">
                ₹{originalPriceNumeric.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function OccasionPage() {
  const { slug } = useParams();

  const [occasion, setOccasion] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedPriceBracket, setSelectedPriceBracket] = useState('all');

  useEffect(() => {
    let isMounted = true;
    async function fetchOccasionDetails() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        setSelectedPriceBracket('all');

        const res = await apiService.getOccasionByIdOrSlug(slug);
        if (res?.success && isMounted) {
          setOccasion(res.occasion || null);
          setProducts(res.products || []);
        } else {
          throw new Error(res?.message || 'Occasion not found');
        }
      } catch (err) {
        console.error('Failed to load occasion details:', err);
        if (isMounted) {
          setErrorMessage(err.message || 'Unable to load occasion. Please check the URL.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (slug) {
      fetchOccasionDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Set document title
  useEffect(() => {
    if (occasion?.name) {
      document.title = `${occasion.name} Gifts & Hampers | The Gift Studio`;
    }
  }, [occasion]);

  // Dynamic price brackets
  const priceBrackets = useMemo(() => {
    return generatePriceBrackets(products);
  }, [products]);

  // Filtered and Sorted Products
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Price bracket filter
    if (selectedPriceBracket !== 'all') {
      const activeBracket = priceBrackets.find((b) => b.id === selectedPriceBracket);
      if (activeBracket) {
        list = list.filter((p) => {
          const price = Number(p?.priceNum);
          return price >= activeBracket.min && price <= activeBracket.max;
        });
      }
    }

    // Sort order
    if (sortBy === 'price-low') {
      list.sort((a, b) => Number(a.priceNum || 0) - Number(b.priceNum || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => Number(b.priceNum || 0) - Number(a.priceNum || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }
    return list;
  }, [products, selectedPriceBracket, priceBrackets, sortBy]);

  const coverUrl = occasion?.image_url ? resolveImageUrl(occasion.image_url) : null;

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: '#FAF7F2' }}>
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* 1. Breadcrumbs */}
        <div className="border-b border-[#E8DFD3]/60 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <Link to="/" className="text-stone-500 hover:text-[#C62828] transition no-underline">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <Link to="/#shop-by-occasion-section" className="text-stone-500 hover:text-[#C62828] transition no-underline">
                Occasions
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-[#C62828] font-semibold truncate">
                {occasion?.name || 'Occasion Details'}
              </span>
            </nav>
          </div>
        </div>

        {/* 2. Hero Cover Banner */}
        <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden bg-gradient-to-r from-[#0B1320] via-[#1A2638] to-[#0B1320]">
          {coverUrl && (
            <img
              src={coverUrl}
              alt={occasion?.name || 'Occasion'}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/30" />

          {/* Banner Text Overlay */}
          <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-12 text-white">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-[#E5A823]/20 border border-[#E5A823]/40 text-[#E5A823] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-xs">
                <CalendarHeart className="w-3.5 h-3.5" />
                <span>Curated Celebration Occasion</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white capitalize leading-tight">
                {occasion?.name || 'Curated Gifts for Every Occasion'}
              </h1>

              {occasion?.description && (
                <p className="text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed font-light max-w-xl pt-1">
                  {occasion.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 3. Products Grid Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Header Bar with Count & Sort & Price Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-[#E8DFD3] gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#C62828] uppercase block mb-1">
                Handcrafted Hampers
              </span>
              <h2 className="font-serif text-2xl font-bold text-gray-950">
                Gifts for {occasion?.name || 'this Occasion'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Showing <strong>{filteredAndSortedProducts.length}</strong> of {products.length} gifts
              </p>
            </div>

            {/* Sorting & Filter Controls */}
            {products.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {/* Price Bracket Dropdown */}
                {priceBrackets.length > 0 && (
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
                    <label htmlFor="price-select" className="text-xs font-semibold text-stone-600">
                      Price:
                    </label>
                    <select
                      id="price-select"
                      value={selectedPriceBracket}
                      onChange={(e) => setSelectedPriceBracket(e.target.value)}
                      className="bg-white border border-[#E8DFD3] rounded-lg px-3 py-1.5 text-xs text-stone-800 font-medium focus:outline-none focus:border-[#C62828] cursor-pointer"
                    >
                      <option value="all">All Prices</option>
                      {priceBrackets.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                  <label htmlFor="sort-select" className="text-xs font-semibold text-stone-600">
                    Sort By:
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-[#E8DFD3] rounded-lg px-3 py-1.5 text-xs text-stone-800 font-medium focus:outline-none focus:border-[#C62828] cursor-pointer"
                  >
                    <option value="featured">Featured Curations</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Active Price Filter Chip */}
          {selectedPriceBracket !== 'all' && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-stone-500 font-medium">Active filter:</span>
              <button
                type="button"
                onClick={() => setSelectedPriceBracket('all')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-200/70 text-stone-800 hover:bg-stone-300 transition cursor-pointer border-none"
              >
                <span>{priceBrackets.find((b) => b.id === selectedPriceBracket)?.label}</span>
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#C62828] mx-auto mb-3" />
              <p className="text-sm font-semibold text-stone-700">Curating gift collection for this occasion...</p>
            </div>
          ) : errorMessage ? (
            <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-md mx-auto">
              <PackageX className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-900 mb-1">Occasion Not Found</h3>
              <p className="text-xs text-stone-500 mb-4">{errorMessage}</p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C62828] text-white text-xs font-semibold rounded-lg hover:bg-black transition no-underline"
              >
                Return to Store Home
              </Link>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E8DFD3] p-12 text-center max-w-lg mx-auto">
              <CalendarHeart className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-900 mb-1">
                New Curations Coming Soon
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-6">
                We are currently crafting and assembling exclusive gift hampers for this occasion. Explore our complete collection or request a custom hamper!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/category"
                  className="px-4 py-2.5 bg-[#C62828] text-white text-xs font-semibold rounded-lg hover:bg-[#8B2635] transition no-underline"
                >
                  Browse All Categories
                </Link>
                <Link
                  to="/contact"
                  className="px-4 py-2.5 bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg hover:bg-stone-200 transition no-underline"
                >
                  Custom Hamper Inquiry
                </Link>
              </div>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E8DFD3] p-8 text-center max-w-md mx-auto">
              <PackageX className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-stone-900 mb-1">No Gifts in this Price Range</h3>
              <p className="text-xs text-stone-500 mb-4">Try clearing the price filter to see all gifts for this occasion.</p>
              <button
                type="button"
                onClick={() => setSelectedPriceBracket('all')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#C62828] rounded-lg hover:bg-black transition cursor-pointer border-none"
              >
                Reset Price Filter
              </button>
            </div>
          ) : (
            /* 4-column desktop grid matching Category Collection Page */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
