import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  SlidersHorizontal,
  PackageX,
  Sparkles,
  Loader2,
  CalendarHeart
} from '../components/FaIcons';
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
    brackets.push({
      id: `${currentMin}-${currentMax}`,
      label: `₹${currentMin.toLocaleString('en-IN')} - ₹${currentMax.toLocaleString('en-IN')}`,
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
 * Clean Occasion Product Card Component
 */
function ProductCard({ product }) {
  const [imgFailed, setImgFailed] = useState(false);

  const priceNumeric = Number(product?.priceNum || 0);
  const originalPriceNumeric = product?.originalPrice ? Number(product.originalPrice) : null;
  const hasDiscount = originalPriceNumeric !== null && originalPriceNumeric > priceNumeric;
  const discountPercent = hasDiscount
    ? Math.round(((originalPriceNumeric - priceNumeric) / originalPriceNumeric) * 100)
    : null;

  const galleryList = useMemo(() => parseGalleryImages(product), [product]);
  const primaryImg = galleryList[0] || product?.image;
  const resolvedSrc = resolveImageUrl(primaryImg);
  const productTarget = `/product/${product?.slug || product?.id}`;

  return (
    <Link
      to={productTarget}
      className="group bg-white rounded-xl border border-[#E8DFD3] overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-md hover:border-[#D8C7B2] hover:-translate-y-0.5 no-underline text-inherit cursor-pointer select-none"
    >
      <div className="relative aspect-[4/5] max-h-[270px] w-full bg-[#F8F5F0] overflow-hidden select-none">
        {hasDiscount && (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span
              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-2xs"
              style={{ backgroundColor: '#8B2635' }}
            >
              {discountPercent}% OFF
            </span>
          </div>
        )}

        {!imgFailed && resolvedSrc ? (
          <img
            src={resolvedSrc}
            alt={product?.title || 'Luxury Gift'}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#FAF7F2] to-[#F3ECE1]">
            <div className="w-10 h-10 rounded-full bg-white border border-[#E8DFD3] flex items-center justify-center text-[#8B2635] font-serif font-bold text-sm mb-1.5 shadow-2xs">
              {product?.title ? product.title.substring(0, 2).toUpperCase() : 'TG'}
            </div>
            <span className="font-serif text-[11px] text-stone-600 font-medium">The Gift Studio</span>
          </div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="font-sans text-sm font-medium text-stone-900 group-hover:text-[#8B2635] transition-colors line-clamp-1 leading-snug"
            title={product?.title}
          >
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
  const isAllOccasions = !slug || slug === 'all';

  const [allOccasions, setAllOccasions] = useState([]);
  const [occasion, setOccasion] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedPriceBracket, setSelectedPriceBracket] = useState('all');

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'instant' });

    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        setSelectedPriceBracket('all');

        if (isAllOccasions) {
          // Fetch all occasions list
          const res = await apiService.getOccasions();
          if (res?.success && isMounted) {
            setAllOccasions(res.occasions || []);
          } else {
            throw new Error(res?.message || 'Failed to load occasions');
          }
        } else {
          // Fetch specific occasion by slug
          const res = await apiService.getOccasionByIdOrSlug(slug);
          if (res?.success && isMounted) {
            setOccasion(res.occasion || null);
            setProducts(res.products || []);
          } else {
            throw new Error(res?.message || 'Occasion not found');
          }
        }
      } catch (err) {
        console.error('Failed to load occasion data:', err);
        if (isMounted) {
          setErrorMessage(err.message || 'Unable to load occasion. Please check the URL.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug, isAllOccasions]);

  // Set document title
  useEffect(() => {
    if (isAllOccasions) {
      document.title = 'All Occasions & Festivals | The Gift Studio';
    } else if (occasion?.name) {
      document.title = `${occasion.name} Gifts & Hampers | The Gift Studio`;
    }
  }, [isAllOccasions, occasion]);

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

      <main className="flex-1 w-full">
        <div className="border-b border-[#2D4737] bg-[#182C20]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-stone-400 font-medium">
              <Link to="/" className="text-stone-400 hover:text-[#D4AF37] transition no-underline">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
              <Link to="/occasion" className={`transition no-underline ${isAllOccasions ? 'text-[#D4AF37] font-semibold' : 'text-stone-400 hover:text-[#D4AF37]'}`}>
                Occasions
              </Link>
              {!isAllOccasions && occasion && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                  <span className="text-[#D4AF37] font-semibold truncate capitalize">
                    {occasion.name}
                  </span>
                </>
              )}
            </nav>
          </div>
        </div>

        {isAllOccasions && (
          <div>
            <section className="py-8 sm:py-10 border-b border-[#2D4737]" style={{ backgroundColor: '#1C3024' }}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#223B2D] border border-[#2D4737] text-[#D4AF37] text-[11px] font-bold tracking-widest uppercase mb-2.5">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>Festivals & Milestones</span>
                    </div>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white capitalize">
                      All Occasions
                    </h1>
                    <p className="mt-2 text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                      Discover handcrafted luxury hampers and celebration curations tailored for every festival, wedding, birthday, and special milestone.
                    </p>
                  </div>

                  {!isLoading && (
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="px-4 py-2 rounded-full bg-[#223B2D] border border-[#2D4737] text-white text-xs sm:text-sm font-semibold shadow-xs">
                        {allOccasions.length} {allOccasions.length === 1 ? 'Occasion' : 'Occasions'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              {isLoading ? (
                <div className="py-20 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#1B7A43] mx-auto mb-3" />
                  <p className="text-sm font-semibold text-stone-700">Loading festive occasions...</p>
                </div>
              ) : errorMessage ? (
                <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-md mx-auto">
                  <PackageX className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-stone-900 mb-1">Error Loading Occasions</h3>
                  <p className="text-xs text-stone-500 mb-4">{errorMessage}</p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B7A43] text-white text-xs font-semibold rounded-lg hover:bg-black transition no-underline"
                  >
                    Return to Store Home
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {allOccasions.map((occ) => {
                    const occCover = occ.image_url ? resolveImageUrl(occ.image_url) : null;
                    return (
                      <Link
                        key={occ.id}
                        to={`/occasion/${occ.slug || occ.id}`}
                        className="editorial-category-card group no-underline text-inherit"
                        style={{ flex: 'none', minWidth: 'unset', maxWidth: 'unset', width: '100%' }}
                      >
                        <div className="editorial-card-image-wrap">
                          {occCover ? (
                            <img
                              src={occCover}
                              alt={occ.name}
                              loading="lazy"
                              className="editorial-card-image"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none"
                              style={{
                                background: 'linear-gradient(145deg, #1C3024 0%, #15241B 100%)',
                                border: '1px solid #2D4737'
                              }}
                            >
                              <div
                                className="w-14 h-14 rounded-full flex items-center justify-center font-serif text-lg font-bold tracking-widest shadow-xs mb-2"
                                style={{
                                  background: '#223B2D',
                                  color: '#D4AF37',
                                  border: '1.5px solid rgba(212, 175, 55, 0.4)'
                                }}
                              >
                                {occ.name ? occ.name.substring(0, 2).toUpperCase() : 'TG'}
                              </div>
                              <span className="font-serif text-xs text-stone-300 italic">The Gift Studio</span>
                            </div>
                          )}

                          {occ.products_count !== undefined && occ.products_count > 0 && (
                            <span
                              className="absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md"
                              style={{ background: 'rgba(30, 30, 30, 0.78)' }}
                            >
                              {occ.products_count} Gifts
                            </span>
                          )}
                        </div>

                        <div className="pt-3.5 pb-1 px-1 text-center flex flex-col items-center justify-center">
                          <h3 className="editorial-category-title font-serif text-[1rem] font-semibold tracking-wide capitalize transition-colors duration-250 leading-snug line-clamp-1 text-stone-900">
                            {occ.name}
                          </h3>
                          <span className="text-[11px] text-[#1B7A43] font-bold tracking-wider uppercase mt-0.5 group-hover:underline">
                            View Collection
                          </span>
                        </div>

                        <span className="editorial-card-accent-bar" style={{ background: '#1B7A43' }} />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {!isAllOccasions && (
          <div>
            <section className="py-8 sm:py-10 border-b border-[#2D4737]" style={{ backgroundColor: '#1C3024' }}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#223B2D] border border-[#2D4737] text-[#D4AF37] text-[11px] font-bold tracking-widest uppercase mb-2.5 shadow-2xs">
                      <CalendarHeart className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Curated Celebration Occasion</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white capitalize leading-tight">
                      {occasion?.name || 'Curated Gifts for Every Occasion'}
                    </h1>

                    {occasion?.description && (
                      <p className="mt-2 text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                        {occasion.description}
                      </p>
                    )}
                  </div>

                  {!isLoading && (
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="px-4 py-2 rounded-full bg-[#223B2D] border border-[#2D4737] text-white text-xs sm:text-sm font-semibold shadow-xs">
                        {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'Gift' : 'Gifts'} Available
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-[#E8DFD3] gap-4">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-[#8B2635] uppercase block mb-1">
                    Handcrafted Hampers
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-stone-900">
                    Gifts for {occasion?.name || 'this Occasion'}
                  </h2>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Showing <strong className="text-stone-900">{filteredAndSortedProducts.length}</strong> of {products.length} gifts
                  </p>
                </div>

                {products.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    {priceBrackets.length > 0 && (
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
                        <label htmlFor="price-select" className="text-xs font-semibold text-stone-700">
                          Price:
                        </label>
                        <select
                          id="price-select"
                          value={selectedPriceBracket}
                          onChange={(e) => setSelectedPriceBracket(e.target.value)}
                          className="bg-white border border-[#E8DFD3] rounded-lg px-3 py-1.5 text-xs text-stone-800 font-medium focus:outline-none focus:border-[#8B2635] cursor-pointer shadow-2xs"
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

                    <div className="flex items-center gap-2">
                      <label htmlFor="sort-select" className="text-xs font-semibold text-stone-700">
                        Sort by:
                      </label>
                      <select
                        id="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-white border border-[#E8DFD3] rounded-lg px-3 py-1.5 text-xs text-stone-800 font-medium focus:outline-none focus:border-[#8B2635] cursor-pointer shadow-2xs"
                      >
                        <option value="featured">Featured Curations</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

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
                <div className="bg-[#182C20] rounded-xl border border-[#2D4737] p-12 text-center max-w-lg mx-auto">
                  <CalendarHeart className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
                  <h3 className="font-serif text-lg font-bold text-white mb-1.5">
                    New Curations Coming Soon
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed mb-6">
                    We are currently crafting and assembling exclusive gift hampers for this occasion. Explore our complete collection or request a custom hamper!
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      to="/category"
                      className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C59D5F] text-stone-950 font-bold text-xs rounded-xl shadow-sm transition hover:opacity-90 no-underline"
                    >
                      Browse All Categories
                    </Link>
                    <Link
                      to="/contact"
                      className="px-5 py-2.5 bg-[#223B2D] border border-[#2D4737] text-white text-xs font-semibold rounded-xl hover:border-[#D4AF37] transition no-underline"
                    >
                      Custom Hamper Inquiry
                    </Link>
                  </div>
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#E8DFD3] p-8 text-center max-w-md mx-auto shadow-xs">
                  <PackageX className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-stone-900 mb-1">No Gifts in this Price Range</h3>
                  <p className="text-xs text-stone-500 mb-4">Try clearing the price filter to see all gifts for this occasion.</p>
                  <button
                    type="button"
                    onClick={() => setSelectedPriceBracket('all')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#8B2635] rounded-lg hover:bg-black transition cursor-pointer border-none shadow-xs"
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
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
