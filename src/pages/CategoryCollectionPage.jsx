import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ChevronRight,
  Filter,
  X,
  SlidersHorizontal,
  Sparkles,
  RotateCcw,
  PackageX,
  ArrowUpDown,
  Send,
  MessageCircle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  Images
} from '../components/FaIcons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import resolveImageUrl, { parseGalleryImages } from '../utils/image';
import { apiService } from '../services/api';

/**
 * Auto-generates 5 to 7 clean, human-friendly price brackets
 * adapting dynamically to whatever minimum and maximum prices exist in the category.
 */
function generatePriceBrackets(products) {
  const prices = (products || [])
    .map((p) => Number(p?.priceNum))
    .filter((p) => !isNaN(p) && p > 0);

  if (prices.length === 0) return [];

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (maxPrice <= minPrice) {
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
  const candidateSteps = [50, 100, 200, 250, 500, 1000, 1500, 2000, 2500, 5000, 10000, 25000, 50000];
  let step = candidateSteps[candidateSteps.length - 1];

  for (const s of candidateSteps) {
    const count = Math.ceil(range / s);
    if (count <= 7 && count >= 3) {
      step = s;
      break;
    }
  }

  let start = Math.floor(minPrice / step) * step;
  const brackets = [];
  let currentMin = start;

  while (currentMin < maxPrice && brackets.length < 6) {
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
 * Clean Product Card Component rendering strictly genuine DB fields
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

        {galleryList.length > 1 && (
          <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
              <Images className="w-3 h-3" />
              <span>{galleryList.length}</span>
            </span>
          </div>
        )}

        {!imgFailed ? (
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

export default function CategoryCollectionPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const isAllCategories = !slug || slug === 'all';

  // State
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Filters & Sorting
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(true);
  const [selectedPriceBracket, setSelectedPriceBracket] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [showProductsOverride, setShowProductsOverride] = useState(false);

  // Sync searchQuery when URL query param changes
  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  // Pagination (16 items per page for clean 4-column responsive grid)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 16;

  // Inquire Modal State
  const [inquireModalProduct, setInquireModalProduct] = useState(null);
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

  // Fetch category & products whenever URL slug changes
  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'instant' });

    async function loadCategoryData() {
      setIsLoading(true);
      setErrorMessage('');
      setSelectedPriceBracket('all');
      setSelectedCategoryFilter(slug || 'all');
      setSortBy('featured');
      setShowProductsOverride(false);

      try {
        // Fetch categories list for filters & navigation
        try {
          const catsRes = await apiService.getCategories();
          if (catsRes?.success && Array.isArray(catsRes.categories) && isMounted) {
            setAllCategories(catsRes.categories);
          }
        } catch (catErr) {
          console.error('Failed to load categories list:', catErr);
        }

        if (isAllCategories) {
          if (!isMounted) return;
          setCategory({ name: 'All Categories', slug: 'all' });

          const prodRes = await apiService.getProducts();
          if (isMounted) {
            if (prodRes?.success && Array.isArray(prodRes.products)) {
              setProducts(prodRes.products);
            } else {
              setProducts([]);
            }
          }
        } else {
          const catRes = await apiService.getCategoryBySlug(slug);
          if (!catRes?.success || !catRes?.category) {
            throw new Error(catRes?.message || 'Category not found');
          }

          if (!isMounted) return;
          setCategory(catRes.category);

          const prodRes = await apiService.getCategoryProducts(slug);
          if (isMounted) {
            if (prodRes?.success && Array.isArray(prodRes.products)) {
              setProducts(prodRes.products);
            } else {
              setProducts([]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load category collection:', err);
        if (isMounted) {
          setErrorMessage(err.message || 'Failed to load category.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCategoryData();

    return () => {
      isMounted = false;
    };
  }, [slug, isAllCategories]);

  // Dynamic SEO Title and Meta Description
  useEffect(() => {
    if (isAllCategories) {
      document.title = 'All Categories & Luxury Gifts | The Gift Studio';

      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute(
        'content',
        'Explore our complete collection of bespoke hampers and luxury gifts across all categories at The Gift Studio. Handcrafted celebrations with express delivery.'
      );
    } else if (category?.name) {
      document.title = `${category.name} Gifts & Hampers | The Gift Studio`;

      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute(
        'content',
        `Explore our luxury curated ${category.name} collection at The Gift Studio. Handcrafted bespoke hampers, artisanal treats, and memorable gift sets with express delivery.`
      );
    }
  }, [category, isAllCategories]);

  // Top-level categories for filter sidebar
  const filterableCategories = useMemo(() => {
    return (allCategories || []).filter(
      (c) => c.parent_id === null || c.parent_id === undefined
    );
  }, [allCategories]);

  // Current category subcategories (if this is a parent category with children)
  const currentCategorySubcategories = useMemo(() => {
    if (isAllCategories || !category?.id) return [];
    return (allCategories || []).filter(
      (c) => c.parent_id === category.id
    );
  }, [allCategories, category, isAllCategories]);

  // Live item counts per category (for /category All Categories mode)
  const categoryCounts = useMemo(() => {
    const counts = { all: (products || []).length };
    (allCategories || []).forEach((c) => {
      counts[c.id] = (products || []).filter((p) => {
        return (
          String(p.category_id) === String(c.id) ||
          p.category?.toLowerCase() === c.name?.toLowerCase() ||
          p.category_slug === c.slug
        );
      }).length;
    });
    return counts;
  }, [products, allCategories]);

  // Dynamically generated price brackets based on loaded products
  const priceBrackets = useMemo(() => {
    return generatePriceBrackets(products);
  }, [products]);

  // Pre-calculate product counts for each bracket
  const bracketCounts = useMemo(() => {
    const counts = { all: (products || []).length };
    priceBrackets.forEach((bracket) => {
      counts[bracket.id] = (products || []).filter((p) => {
        const price = Number(p?.priceNum);
        return price >= bracket.min && price <= bracket.max;
      }).length;
    });
    return counts;
  }, [products, priceBrackets]);

  // Filtered & Sorted products list
  const filteredProducts = useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];

    // Category filter (in All Categories mode)
    if (isAllCategories && selectedCategoryFilter !== 'all') {
      list = list.filter((p) => {
        const matchId = String(p.category_id) === String(selectedCategoryFilter);
        const matchSlug = p.category_slug === selectedCategoryFilter;
        const matchName = p.category?.toLowerCase() === String(selectedCategoryFilter).toLowerCase();
        return matchId || matchSlug || matchName;
      });
    }

    // Search query filter (if user typed in search bar)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p?.title?.toLowerCase().includes(q) ||
          p?.description?.toLowerCase().includes(q)
      );
    }

    // Dynamic price bracket filter
    if (selectedPriceBracket !== 'all') {
      const activeBracket = priceBrackets.find((b) => b.id === selectedPriceBracket);
      if (activeBracket) {
        list = list.filter((p) => {
          const price = Number(p?.priceNum);
          return price >= activeBracket.min && price <= activeBracket.max;
        });
      }
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => Number(a?.priceNum || 0) - Number(b?.priceNum || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => Number(b?.priceNum || 0) - Number(a?.priceNum || 0));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0));
    }

    return list;
  }, [products, isAllCategories, selectedCategoryFilter, selectedPriceBracket, sortBy, searchQuery, priceBrackets]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryFilter, selectedPriceBracket, sortBy, searchQuery, slug]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const el = document.getElementById('collection-grid-top');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Reset filters helper
  const handleResetFilters = () => {
    setSelectedCategoryFilter('all');
    setSelectedPriceBracket('all');
    setSortBy('featured');
    setSearchQuery('');
    setSearchParams({});
    setCurrentPage(1);
  };

  // Open Inquiry Modal for a specific product
  const handleOpenInquireModal = (product) => {
    setInquireModalProduct(product);
    setInquirySuccess(false);
    setInquiryError('');
    setInquireForm({
      name: '',
      phone: '',
      email: '',
      city_pincode: '',
      message: `Hi, I am interested in inquiring about "${product.title}" (₹${Number(product.priceNum).toLocaleString('en-IN')}).`
    });
  };

  const handleCloseInquireModal = () => {
    setInquireModalProduct(null);
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
        message: `${inquireForm.message.trim()} [Product ID: ${inquireModalProduct?.id}, Category: ${category?.name || slug}]`,
        gifting_type: inquireModalProduct?.title || 'Product Inquiry'
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

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900" style={{ backgroundColor: '#E4EDE5' }}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={isAllCategories ? 'all' : slug}
        onSelectCategory={(targetSlug) => {
          if (targetSlug === 'all') {
            navigate('/category');
          } else {
            navigate(`/category/${targetSlug}`);
          }
        }}
      />

      <div className="border-b border-[#BACBBD]/80 bg-[#DBE6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 overflow-x-auto">
            <Link to="/" className="hover:text-[#C62828] transition font-medium whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <Link
              to="/category"
              className={`hover:text-[#C62828] transition font-medium whitespace-nowrap ${
                isAllCategories ? 'text-stone-900 font-semibold' : 'text-stone-500'
              }`}
            >
              Categories
            </Link>
            {!isAllCategories && category?.parent_id && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <Link
                  to={`/category/${allCategories.find((c) => String(c.id) === String(category.parent_id))?.slug || category.parent_id}`}
                  className="hover:text-[#C62828] transition font-medium whitespace-nowrap text-stone-500 capitalize"
                >
                  {allCategories.find((c) => String(c.id) === String(category.parent_id))?.name || 'Parent Category'}
                </Link>
              </>
            )}
            {!isAllCategories && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-stone-900 font-semibold capitalize whitespace-nowrap">
                  {category?.name || slug}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <section className="py-8 sm:py-10 border-b border-[#BACBBD]" style={{ backgroundColor: '#DBE6DC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-[#E8DFD3] text-[#C62828] text-[11px] font-bold tracking-widest uppercase mb-2.5">
                <Sparkles className="w-3 h-3" />
                <span>Curated Luxury Gifting</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-950 capitalize">
                {isAllCategories ? 'All Categories' : (category?.name || slug)}
              </h1>
              <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                {isAllCategories
                  ? 'Explore our complete collection of gift categories, crafted to elevate every celebration.'
                  : `Discover our signature collection of handcrafted ${category?.name || 'luxury gifts'}, specially selected to elevate every celebration.`}
              </p>
            </div>

            {!isLoading && (
              <div className="shrink-0 flex items-center gap-2">
                <span className="px-4 py-2 rounded-full bg-white border border-[#E8DFD3] text-stone-800 text-xs sm:text-sm font-semibold shadow-xs">
                  {isAllCategories
                    ? `${filterableCategories.length} ${filterableCategories.length === 1 ? 'Category' : 'Categories'}`
                    : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'Gift' : 'Gifts'} Available`}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 border-3 border-[#C62828] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-serif text-lg text-stone-800 font-medium">Curating collection...</p>
            <p className="text-stone-500 text-xs mt-1">Fetching the finest gift hampers</p>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="text-center py-20 px-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#C62828] flex items-center justify-center mx-auto mb-4 border border-red-200">
              <PackageX className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">Collection Not Found</h2>
            <p className="text-stone-600 text-sm mb-6">{errorMessage}</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: '#C62828' }}
            >
              Back to Home
            </Link>
          </div>
        )}

        {!isLoading && !errorMessage && isAllCategories && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filterableCategories.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug || cat.id}`}
                    className="editorial-category-card group no-underline text-inherit"
                    style={{ flex: 'none', minWidth: 'unset', maxWidth: 'unset', width: '100%' }}
                  >
                    <div className="editorial-card-image-wrap">
                      {cat.image_url ? (
                        <img
                          src={resolveImageUrl(cat.image_url)}
                          alt={cat.name}
                          loading="lazy"
                          className="editorial-card-image"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none"
                          style={{
                            background: 'linear-gradient(145deg, #F4FAF5 0%, #DBE6DC 100%)'
                          }}
                        >
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center font-serif text-lg font-bold tracking-widest shadow-xs mb-2"
                            style={{
                              background: '#FFFFFF',
                              color: '#C62828',
                              border: '1.5px solid rgba(198, 40, 40, 0.3)'
                            }}
                          >
                            {cat.name ? cat.name.substring(0, 2).toUpperCase() : 'TG'}
                          </div>
                          <span className="font-serif text-xs text-stone-600 italic">The Gift Studio</span>
                        </div>
                      )}

                      {count > 0 && (
                        <span
                          className="absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md"
                          style={{ background: 'rgba(30, 30, 30, 0.78)' }}
                        >
                          {count} Gifts
                        </span>
                      )}
                    </div>

                    <div className="pt-3.5 pb-1 px-1 text-center flex flex-col items-center justify-center">
                      <h3 className="editorial-category-title font-serif text-[1rem] font-semibold tracking-wide capitalize transition-colors duration-250 leading-snug line-clamp-1 text-stone-900">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] text-stone-400 font-medium tracking-wider uppercase mt-0.5">
                        View Collection
                      </span>
                    </div>

                    <span className="editorial-card-accent-bar" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {!isLoading && !errorMessage && !isAllCategories && currentCategorySubcategories.length > 0 && !showProductsOverride && (
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase block mb-1 text-[#8B2635]">
                  Subcategories in {category?.name}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Explore Specific Collections
                </h2>
              </div>

              {products.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowProductsOverride(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D5C2AD] bg-white text-stone-800 text-xs font-semibold hover:border-[#8B2635] hover:text-[#8B2635] transition shadow-2xs self-start sm:self-auto cursor-pointer"
                >
                  <span>View All {products.length} Products</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {currentCategorySubcategories.map((subcat) => {
                const subcount = categoryCounts[subcat.id] || 0;
                return (
                  <Link
                    key={subcat.id}
                    to={`/category/${subcat.slug || subcat.id}`}
                    className="editorial-category-card group no-underline text-inherit"
                    style={{ flex: 'none', minWidth: 'unset', maxWidth: 'unset', width: '100%' }}
                  >
                    <div className="editorial-card-image-wrap">
                      {subcat.image_url ? (
                        <img
                          src={resolveImageUrl(subcat.image_url)}
                          alt={subcat.name}
                          loading="lazy"
                          className="editorial-card-image"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none"
                          style={{
                            background: 'linear-gradient(145deg, #F4FAF5 0%, #DBE6DC 100%)'
                          }}
                        >
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center font-serif text-base font-bold tracking-widest shadow-xs mb-2 bg-white text-[#8B2635] border border-[#8B2635]/20"
                          >
                            {subcat.name ? subcat.name.substring(0, 2).toUpperCase() : 'TG'}
                          </div>
                          <span className="font-serif text-[11px] text-stone-600 italic">{category?.name}</span>
                        </div>
                      )}

                      {subcount > 0 && (
                        <span
                          className="absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md"
                          style={{ background: 'rgba(30, 30, 30, 0.78)' }}
                        >
                          {subcount} Gifts
                        </span>
                      )}
                    </div>

                    <div className="pt-3 pb-1 px-1 text-center flex flex-col items-center justify-center">
                      <h3 className="editorial-category-title font-serif text-[0.95rem] font-semibold tracking-wide capitalize transition-colors duration-250 leading-snug line-clamp-1 text-stone-900">
                        {subcat.name}
                      </h3>
                      <span className="text-[11px] text-stone-400 font-medium tracking-wider uppercase mt-0.5">
                        Browse Subcategory
                      </span>
                    </div>

                    <span className="editorial-card-accent-bar" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {!isLoading && !errorMessage && !isAllCategories && (currentCategorySubcategories.length === 0 || showProductsOverride) && (
          <div>
            {currentCategorySubcategories.length > 0 && showProductsOverride && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowProductsOverride(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#D5C2AD] bg-white text-xs font-semibold text-stone-700 hover:text-[#8B2635] hover:border-[#8B2635] transition shadow-2xs cursor-pointer mb-2"
                >
                  <span>← Back to Subcategories</span>
                </button>
              </div>
            )}
            <div id="collection-grid-top" className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#E8DFD3]/80 scroll-mt-28">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8DFD3] bg-white text-xs font-medium text-stone-800 shadow-2xs cursor-pointer hover:bg-stone-50"
                >
                  <Filter className="w-3.5 h-3.5 text-[#8B2635]" />
                  <span>
                    Filters
                    {((selectedPriceBracket !== 'all' ? 1 : 0) +
                      (isAllCategories && selectedCategoryFilter !== 'all' ? 1 : 0)) > 0
                      ? ` (${
                          (selectedPriceBracket !== 'all' ? 1 : 0) +
                          (isAllCategories && selectedCategoryFilter !== 'all' ? 1 : 0)
                        })`
                      : ''}
                  </span>
                </button>

                <span className="text-xs text-stone-600 font-normal">
                  Showing{' '}
                  <strong className="font-semibold text-stone-900">
                    {filteredProducts.length === 0
                      ? '0'
                      : totalPages > 1
                      ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                          currentPage * ITEMS_PER_PAGE,
                          filteredProducts.length
                        )} of ${filteredProducts.length}`
                      : filteredProducts.length}
                  </strong>{' '}
                  items
                </span>

                {selectedPriceBracket !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF7F2] border border-[#8B2635]/30 text-[#8B2635]">
                    <span>{priceBrackets.find((b) => b.id === selectedPriceBracket)?.label}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedPriceBracket('all')}
                      className="hover:opacity-75 cursor-pointer bg-transparent border-none p-0 text-[#8B2635]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-stone-500 font-normal">Sort:</span>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#E8DFD3] text-stone-800 text-xs font-normal rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#8B2635] cursor-pointer shadow-2xs"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Just Arrived</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-6">
              <aside className="hidden lg:block w-60 shrink-0 self-start sticky top-24 space-y-3">
                <div className="border border-[#E8DFD3] rounded-xl bg-white shadow-2xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                    className="w-full flex items-center justify-between text-left cursor-pointer border-none bg-transparent py-2.5 px-4 select-none group"
                  >
                    <span className="text-xs font-semibold text-stone-900 tracking-wide">
                      Price Range
                    </span>
                    <div className="flex items-center gap-1.5">
                      {selectedPriceBracket !== 'all' && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPriceBracket('all');
                          }}
                          className="text-[10px] font-medium text-[#8B2635] hover:underline cursor-pointer"
                        >
                          Reset
                        </span>
                      )}
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 group-hover:text-stone-900 ${
                          isPriceFilterOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isPriceFilterOpen && (
                    <div className="pt-2 pb-3 px-4 border-t border-[#E8DFD3]/60 max-h-56 overflow-y-auto space-y-1">
                      <label className="flex items-center justify-between py-1 px-1 rounded-sm cursor-pointer hover:bg-stone-50 text-xs transition select-none">
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="radio"
                            name="price-range"
                            value="all"
                            checked={selectedPriceBracket === 'all'}
                            onChange={() => setSelectedPriceBracket('all')}
                            className="w-3.5 h-3.5 accent-[#8B2635] cursor-pointer shrink-0"
                          />
                          <span
                            className={`text-xs truncate ${
                              selectedPriceBracket === 'all'
                                ? 'text-stone-900 font-medium'
                                : 'text-stone-600 font-normal'
                            }`}
                          >
                            All Prices
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-normal pl-2 shrink-0">
                          ({bracketCounts.all})
                        </span>
                      </label>

                      {priceBrackets.map((bracket) => {
                        const count = bracketCounts[bracket.id] || 0;
                        const isSelected = selectedPriceBracket === bracket.id;

                        return (
                          <label
                            key={bracket.id}
                            className="flex items-center justify-between py-1 px-1 rounded-sm cursor-pointer hover:bg-stone-50 text-xs transition select-none"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <input
                                type="radio"
                                name="price-range"
                                value={bracket.id}
                                checked={isSelected}
                                onChange={() => setSelectedPriceBracket(bracket.id)}
                                className="w-3.5 h-3.5 accent-[#8B2635] cursor-pointer shrink-0"
                              />
                              <span
                                className={`text-xs truncate ${
                                  isSelected
                                    ? 'text-stone-900 font-medium'
                                    : 'text-stone-600 font-normal'
                                }`}
                              >
                                {bracket.label}
                              </span>
                            </div>
                            <span
                              className={`text-[11px] font-normal pl-2 shrink-0 ${
                                isSelected ? 'text-[#8B2635] font-medium' : 'text-stone-400'
                              }`}
                            >
                              ({count})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </aside>

              <div className="flex-1 w-full min-w-0">
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#E8DFD3] p-12 text-center my-2">
                    <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                      <PackageX className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                      No gifts match the selected filters
                    </h3>
                    <p className="text-stone-500 text-xs sm:text-sm max-w-sm mx-auto mb-5">
                      {isAllCategories
                        ? "We couldn't find any items matching your selected filters. Try choosing another category or resetting filters."
                        : `We couldn't find any items in this price bracket for ${category?.name}. Try selecting another bracket or resetting filters.`}
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-xs font-semibold shadow-xs cursor-pointer hover:opacity-90 transition"
                      style={{ backgroundColor: '#8B2635' }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {paginatedProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-8 pt-6 border-t border-[#E8DFD3]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-xs text-stone-500 font-normal order-2 sm:order-1">
                          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} gifts
                        </span>

                        <div className="flex items-center gap-1.5 order-1 sm:order-2">
                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-lg border border-[#E8DFD3] text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                          >
                            Prev
                          </button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            if (
                              totalPages > 7 &&
                              page !== 1 &&
                              page !== totalPages &&
                              Math.abs(page - currentPage) > 1
                            ) {
                              if (page === 2 || page === totalPages - 1) {
                                return (
                                  <span key={page} className="px-1 text-xs text-stone-400 select-none">
                                    ...
                                  </span>
                                );
                              }
                              return null;
                            }

                            const isActive = page === currentPage;
                            return (
                              <button
                                key={page}
                                type="button"
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center ${
                                  isActive
                                    ? 'bg-[#8B2635] text-white shadow-2xs'
                                    : 'bg-white border border-[#E8DFD3] text-stone-700 hover:bg-stone-50 shadow-2xs'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}

                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-[#E8DFD3] text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between p-4 border-b border-[#E8DFD3]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#8B2635]" />
                <h3 className="font-serif text-base font-bold text-stone-900">
                  {isAllCategories ? 'Filters' : 'Price Range'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-800 rounded-md cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-6">
              {isAllCategories && filterableCategories.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                    Categories
                  </h4>
                  <div className="space-y-1.5">
                    <label
                      className={`flex items-center justify-between py-2 px-2.5 rounded-lg cursor-pointer border ${
                        selectedCategoryFilter === 'all'
                          ? 'bg-[#FAF7F2] border-[#8B2635]/40 text-[#8B2635] font-medium'
                          : 'border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="mobile-category"
                          value="all"
                          checked={selectedCategoryFilter === 'all'}
                          onChange={() => setSelectedCategoryFilter('all')}
                          className="w-3.5 h-3.5 accent-[#8B2635] cursor-pointer shrink-0"
                        />
                        <span className="text-xs">All Categories</span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">
                        ({categoryCounts.all || 0})
                      </span>
                    </label>

                    {filterableCategories.map((cat) => {
                      const count = categoryCounts[cat.id] || 0;
                      const isSelected = String(selectedCategoryFilter) === String(cat.id);

                      return (
                        <label
                          key={cat.id}
                          className={`flex items-center justify-between py-2 px-2.5 rounded-lg cursor-pointer border ${
                            isSelected
                              ? 'bg-[#FAF7F2] border-[#8B2635]/40 text-[#8B2635] font-medium'
                              : 'border-stone-200 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="mobile-category"
                              value={cat.id}
                              checked={isSelected}
                              onChange={() => setSelectedCategoryFilter(cat.id)}
                              className="w-3.5 h-3.5 accent-[#8B2635] cursor-pointer shrink-0"
                            />
                            <span className="text-xs">{cat.name}</span>
                          </div>
                          <span className="text-[11px] text-stone-400 font-mono">({count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Price Range
                </h4>
                <div className="space-y-1.5">
                  <label
                    className={`flex items-center justify-between py-2 px-2.5 rounded-lg cursor-pointer border ${
                      selectedPriceBracket === 'all'
                        ? 'bg-[#FAF7F2] border-[#8B2635]/40 text-[#8B2635] font-medium'
                        : 'border-stone-200 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mobile-price"
                        value="all"
                        checked={selectedPriceBracket === 'all'}
                        onChange={() => setSelectedPriceBracket('all')}
                        className="w-3.5 h-3.5 accent-[#8B2635] cursor-pointer shrink-0"
                      />
                      <span className="text-xs">All Prices</span>
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono">({bracketCounts.all})</span>
                  </label>

                  {priceBrackets.map((bracket) => {
                    const count = bracketCounts[bracket.id] || 0;
                    const isSelected = selectedPriceBracket === bracket.id;

                    return (
                      <label
                        key={bracket.id}
                        className={`flex items-center justify-between py-2 px-2.5 rounded-lg cursor-pointer border ${
                          isSelected
                            ? 'bg-[#FAF7F2] border-[#8B2635]/40 text-[#8B2635] font-medium'
                            : 'border-stone-200 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="mobile-price"
                            value={bracket.id}
                            checked={isSelected}
                            onChange={() => setSelectedPriceBracket(bracket.id)}
                            className="w-3.5 h-3.5 accent-[#8B2635] cursor-pointer shrink-0"
                          />
                          <span className="text-xs">{bracket.label}</span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-mono">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E8DFD3] flex gap-3">
              <button
                type="button"
                onClick={() => {
                  handleResetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-full border border-[#E8DFD3] text-stone-700 text-xs font-semibold cursor-pointer hover:bg-stone-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-full text-white text-xs font-semibold cursor-pointer shadow-xs hover:opacity-90"
                style={{ backgroundColor: '#C62828' }}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {inquireModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={handleCloseInquireModal}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden z-10 border border-[#E8DFD3] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD3] bg-[#FAF7F2]">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#C62828] block">
                  Bespoke Inquiry
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Inquire About This Gift
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseInquireModal}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/60 mb-5">
                <img
                  src={resolveImageUrl(inquireModalProduct.image)}
                  alt={inquireModalProduct.title}
                  className="w-14 h-14 object-cover rounded-lg border border-stone-200 bg-white"
                  onError={(e) => {
                    e.currentTarget.src = '/images/gift_logo.jpeg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-semibold text-stone-900 truncate">
                    {inquireModalProduct.title}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-sm font-bold text-stone-900">
                      ₹{Number(inquireModalProduct.priceNum || 0).toLocaleString('en-IN')}
                    </span>
                    {inquireModalProduct.originalPrice &&
                      Number(inquireModalProduct.originalPrice) > Number(inquireModalProduct.priceNum) && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{Number(inquireModalProduct.originalPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {inquirySuccess ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#1B7A43] flex items-center justify-center mx-auto mb-3 border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-stone-900 mb-1">
                    Inquiry Received!
                  </h4>
                  <p className="text-stone-600 text-xs sm:text-sm max-w-xs mx-auto mb-6 leading-relaxed">
                    Thank you! Our concierge team will reach out to you within 2 hours with availability and custom options.
                  </p>
                  <button
                    type="button"
                    onClick={handleCloseInquireModal}
                    className="px-6 py-2 rounded-full text-white text-xs font-semibold shadow-xs cursor-pointer hover:opacity-90 transition"
                    style={{ backgroundColor: '#C62828' }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* Inquiry Form */
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
                      href={`https://wa.me/917506210892?text=${encodeURIComponent(
                        `Hi, I am inquiring about "${inquireModalProduct.title}" (₹${Number(
                          inquireModalProduct.priceNum || 0
                        ).toLocaleString('en-IN')}) from the ${category?.name || slug} collection.`
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
        </div>
      )}

      <Footer />
    </div>
  );
}
