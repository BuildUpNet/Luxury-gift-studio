import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Package
} from './FaIcons';
import { apiService } from '../services/api';
import { getCachedData, setCachedData, CACHE_KEYS } from '../utils/cache';
import resolveImageUrl from '../utils/image';

const DEFAULT_SETTINGS = {
  facebook_url: 'https://www.facebook.com/share/1JdovZsxve/?mibextid=wwXIfr',
  whatsapp_url: 'https://wa.me/919855840007',
  instagram_url: 'https://www.instagram.com/new_modi_enterprises?avpt=MTUzYXFrbTQxZmhscA%3D%3D&utm_source=qr',
  bulk_enquiry_phone: '9855840007'
};

const Header = ({
  searchQuery = '',
  setSearchQuery,
  onSelectCategory,
  activeCategory: propActiveCategory
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isContactActive = location.pathname === '/contact';

  // Automatically extract active category from URL /category/:slug if not explicitly provided
  const categoryMatch = location.pathname.match(/^\/category\/?([^/]*)/);
  const urlCategorySlug = categoryMatch ? (categoryMatch[1] || 'all') : null;
  const activeCategory = propActiveCategory !== undefined ? propActiveCategory : (urlCategorySlug || 'all');

  const [categories, setCategories] = useState(() => {
    const cached = getCachedData(CACHE_KEYS.CATEGORIES, null);
    return Array.isArray(cached) ? cached : [];
  });
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(() => {
    const cached = getCachedData(CACHE_KEYS.CATEGORIES, null);
    return !Array.isArray(cached) || cached.length === 0;
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [storeSettings, setStoreSettings] = useState(() => {
    return getCachedData(CACHE_KEYS.STORE_SETTINGS, DEFAULT_SETTINGS);
  });

  // Live Search state
  const [internalSearch, setInternalSearch] = useState(searchQuery || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchWrapRef = useRef(null);

  useEffect(() => {
    setInternalSearch(searchQuery || '');
  }, [searchQuery]);

  // Close live search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced live product suggestions fetch
  useEffect(() => {
    const term = (internalSearch || '').trim();
    if (!term) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await apiService.getProducts({ search: term });
        if (res?.success && Array.isArray(res.products)) {
          setSuggestions(res.products.slice(0, 6));
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Failed to fetch search suggestions:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [internalSearch]);

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setShowDropdown(false);
    const q = (internalSearch || '').trim();
    if (setSearchQuery) setSearchQuery(q);
    if (q) {
      navigate(`/category?search=${encodeURIComponent(q)}`);
    } else {
      navigate('/category');
    }
  };

  const handleSelectSuggestion = (product) => {
    setShowDropdown(false);
    if (product.slug) {
      navigate(`/product/${product.slug}`);
    } else if (product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  // Fetch categories and store settings dynamically (Stale-While-Revalidate)
  useEffect(() => {
    let isMounted = true;
    const loadHeaderData = async () => {
      try {
        const [catData, settingsData] = await Promise.allSettled([
          apiService.getCategories(),
          apiService.getSettings()
        ]);

        if (catData.status === 'fulfilled' && catData.value?.success && isMounted) {
          const fetchedCats = catData.value.categories || [];
          setCategories(fetchedCats);
          setIsCategoriesLoading(false);
          setCachedData(CACHE_KEYS.CATEGORIES, fetchedCats);
        }

        if (settingsData.status === 'fulfilled' && settingsData.value?.success && settingsData.value?.settings && isMounted) {
          setStoreSettings(settingsData.value.settings);
          setCachedData(CACHE_KEYS.STORE_SETTINGS, settingsData.value.settings);
        }
      } catch (err) {
        console.error('Header: failed to fetch categories or settings', err);
      } finally {
        if (isMounted) setIsCategoriesLoading(false);
      }
    };
    loadHeaderData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter top-level categories that have show_in_navbar = 1 (strictly product categories, max 10)
  const navbarCategories = categories
    .filter(c => (c.parent_id === null || c.parent_id === undefined) && Boolean(c.show_in_navbar) && (c.section_type === 'category' || !c.section_type))
    .slice(0, 10);

  // Map subcategories by parent_id
  const subcategoriesByParent = {};
  categories.forEach(c => {
    if (c.parent_id !== null && c.parent_id !== undefined) {
      if (!subcategoriesByParent[c.parent_id]) {
        subcategoriesByParent[c.parent_id] = [];
      }
      subcategoriesByParent[c.parent_id].push(c);
    }
  });

  const handleCategoryClick = (categorySlugOrId) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);

    if (categorySlugOrId === 'all') {
      navigate('/category');
    } else {
      navigate(`/category/${categorySlugOrId}`);
    }
  };

  // Row splitting: first 6 in primary row, 7-10 in expandable row
  const primaryRow = navbarCategories.slice(0, 6);
  const overflowRow = navbarCategories.slice(6);
  const hasOverflow = navbarCategories.length > 6;

  return (
    <header className="w-full sticky top-0 z-50 shadow-md backdrop-blur-xs" style={{ backgroundColor: '#182C20', borderBottom: '1px solid #2D4737' }}>
      <div style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-stone-200 hover:text-white hover:bg-[#223B2D] rounded-md cursor-pointer border-none bg-transparent"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <Link
              to="/"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('all');
                if (setSearchQuery) setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center text-left bg-transparent border-none cursor-pointer p-0 no-underline text-inherit group"
            >
              <div className="p-1 sm:p-1.5 bg-white rounded-xl shadow-md border-2 border-[#D4AF37]/80 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_16px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center justify-center">
                <img
                  src="/images/modi_logo_transparent.png"
                  alt="The Gift Studio Logo"
                  className="h-10 sm:h-12 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/images/gift_logo.jpeg';
                  }}
                />
              </div>
            </Link>
          </div>

          <div ref={searchWrapRef} className="flex-1 max-w-md hidden md:block relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-[#223B2D] hover:bg-[#284635] focus-within:bg-[#284635] border border-[#2D4737] focus-within:border-[#D4AF37] shadow-sm rounded-full px-4 py-2 transition shadow-2xs">
              <button
                type="submit"
                aria-label="Submit search"
                className="bg-transparent border-none p-0 cursor-pointer text-[#D4AF37] mr-2 shrink-0 flex items-center"
              >
                <Search className="w-4 h-4" />
              </button>
              <input
                type="text"
                className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-[#8EA696] focus:outline-none"
                value={internalSearch}
                onChange={(e) => {
                  const val = e.target.value;
                  setInternalSearch(val);
                  if (setSearchQuery) setSearchQuery(val);
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowDropdown(true);
                }}
                placeholder="Search Gifts, Hampers, Occasions..."
                className="w-full bg-transparent text-sm text-stone-900 placeholder-stone-500 focus:outline-none"
              />
              {internalSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setInternalSearch('');
                    if (setSearchQuery) setSearchQuery('');
                    setSuggestions([]);
                    setShowDropdown(false);
                  }}
                  className="text-stone-400 hover:text-black ml-1 cursor-pointer bg-transparent border-none p-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {showDropdown && internalSearch.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#BACBBD] overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-[#1B7A43] border-t-transparent rounded-full animate-spin" />
                    Searching gifts...
                  </div>
                ) : suggestions.length > 0 ? (
                  <div>
                    <div className="px-4 py-2 bg-[#EAF2EC] border-b border-[#BACBBD]/40 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#145E33] uppercase tracking-wider">
                        Products ({suggestions.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="text-[11px] font-semibold text-[#145E33] hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
                      >
                        View all results <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    <ul className="divide-y divide-stone-100 max-h-72 overflow-y-auto m-0 p-0 list-none">
                      {suggestions.map((prod) => (
                        <li key={prod.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectSuggestion(prod)}
                            className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[#F2F7F3] transition cursor-pointer bg-transparent border-none"
                          >
                            <img
                              src={resolveImageUrl(prod.image || (Array.isArray(prod.images) ? prod.images[0] : null))}
                              alt={prod.title}
                              className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-stone-900 truncate m-0">
                                {prod.title}
                              </p>
                              <p className="text-[11px] text-stone-500 truncate m-0">
                                {prod.category || 'Luxury Gift'}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-[#145E33] shrink-0">
                              {prod.price || (prod.priceNum ? `₹${Number(prod.priceNum).toLocaleString('en-IN')}` : '')}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="p-2.5 bg-stone-50 border-t border-stone-100 text-center">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full py-1.5 rounded-lg bg-[#145E33] hover:bg-[#0D4423] text-white text-xs font-semibold cursor-pointer transition border-none shadow-xs flex items-center justify-center gap-1.5"
                      >
                        Search for "{internalSearch}" <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 text-center">
                    <p className="text-xs font-semibold text-stone-700 m-0">No gifts found for "{internalSearch}"</p>
                    <p className="text-[11px] text-stone-500 mt-1 mb-3">Try searching for keywords like "carry bags", "diwali", "hampers"</p>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="px-4 py-1.5 rounded-full bg-[#145E33] text-white text-xs font-semibold border-none cursor-pointer hover:bg-[#0D4423]"
                    >
                      Browse All Categories
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/contact"
              className={`inline-flex items-center justify-center text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 no-underline cursor-pointer border ${
                isContactActive
                  ? 'bg-[#D4AF37] text-stone-900 border-[#D4AF37] shadow-xs'
                  : 'bg-[#223B2D] hover:bg-[#D4AF37] text-[#E4EFE7] hover:text-stone-900 border-[#2D4737] hover:border-[#D4AF37] shadow-2xs'
              }`}
            >
              Contact Us
            </Link>

            <a
              href={storeSettings.facebook_url || 'https://www.facebook.com/share/1JdovZsxve/?mibextid=wwXIfr'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#223B2D] hover:bg-[#D4AF37] border border-[#2D4737] hover:border-[#D4AF37] text-[#E4EFE7] hover:text-stone-900 flex items-center justify-center transition-all duration-200 no-underline shadow-2xs hover:scale-105 cursor-pointer"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook-f text-base"></i>
            </a>

            <a
              href={storeSettings.instagram_url || 'https://www.instagram.com/new_modi_enterprises?avpt=MTUzYXFrbTQxZmhscA%3D%3D&utm_source=qr'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#223B2D] hover:bg-[#D4AF37] border border-[#2D4737] hover:border-[#D4AF37] text-[#E4EFE7] hover:text-stone-900 flex items-center justify-center transition-all duration-200 no-underline shadow-2xs hover:scale-105 cursor-pointer"
              aria-label="Instagram"
            >
              <i className="fa-brands fa-instagram text-lg"></i>
            </a>

            <a
              href={storeSettings.whatsapp_url || 'https://wa.me/919855840007'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#223B2D] hover:bg-[#D4AF37] border border-[#2D4737] hover:border-[#D4AF37] text-[#E4EFE7] hover:text-stone-900 flex items-center justify-center transition-all duration-200 no-underline shadow-2xs hover:scale-105 cursor-pointer"
              aria-label="WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
            </a>
          </div>
        </div>

        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#223B2D] border border-[#2D4737] rounded-full px-4 py-2">
            <button
              type="submit"
              aria-label="Submit search"
              className="bg-transparent border-none p-0 cursor-pointer text-stone-500 hover:text-[#145E33] mr-2 shrink-0 flex items-center"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={internalSearch}
              onChange={(e) => {
                const val = e.target.value;
                setInternalSearch(val);
                if (setSearchQuery) setSearchQuery(val);
              }}
              placeholder="Search Gifts, Hampers, Occasions..."
              className="w-full bg-transparent text-sm text-stone-900 placeholder-stone-500 focus:outline-none"
            />
            {internalSearch && (
              <button
                type="button"
                onClick={() => {
                  setInternalSearch('');
                  if (setSearchQuery) setSearchQuery('');
                  setSuggestions([]);
                }}
                className="text-stone-400 hover:text-black ml-1 bg-transparent border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      <nav
        aria-label="Main Navigation"
        className="hidden lg:block relative min-h-[48px] shadow-xs select-none"
        style={{
          background: 'linear-gradient(180deg, #FAF6EE 0%, #EFE7D8 50%, #E6DCB8 100%)',
          borderTop: '1px solid rgba(212, 175, 55, 0.4)',
          borderBottom: '2px solid rgba(212, 175, 55, 0.55)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isCategoriesLoading && navbarCategories.length === 0 ? (
            /* Fixed-height Skeleton loader matching exact navbar row dimensions */
            <div className="flex items-center justify-center gap-3 py-2 h-[48px]">
              <div className="w-24 h-6 bg-[#C8DACB]/60 rounded-full animate-pulse" />
              <div className="w-28 h-6 bg-[#C8DACB]/60 rounded-full animate-pulse" />
              <div className="w-20 h-6 bg-[#C8DACB]/60 rounded-full animate-pulse" />
              <div className="w-32 h-6 bg-[#C8DACB]/60 rounded-full animate-pulse" />
              <div className="w-24 h-6 bg-[#C8DACB]/60 rounded-full animate-pulse" />
              <div className="w-28 h-6 bg-[#C8DACB]/60 rounded-full animate-pulse" />
              <div className="w-20 h-6 bg-[#C8DACB]/60 rounded-full animate-pulse" />
            </div>
          ) : (
            /* Primary Row: First 6 categories + optional "View All" */
            <ul className="flex items-center justify-center gap-2 xl:gap-3 text-sm font-bold text-[#15241B] list-none m-0 py-1.5 flex-wrap min-h-[48px]">
              {primaryRow.map((cat) => {
                const subcats = subcategoriesByParent[cat.id] || [];
                const hasSubcats = subcats.length > 0;
                const isActive = activeCategory === cat.slug || String(activeCategory) === String(cat.id);
                const isOpen = activeDropdown === cat.id;

                return (
                  <li
                    key={cat.id}
                    className="relative group"
                    onMouseEnter={() => hasSubcats && setActiveDropdown(cat.id)}
                    onMouseLeave={() => hasSubcats && setActiveDropdown(null)}
                  >
                    <Link
                      to={`/category/${cat.slug || cat.id}`}
                      onClick={() => {
                        setActiveDropdown(null);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`nav-category-link inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-[13px] xl:text-[14px] tracking-wide font-bold capitalize transition-all duration-300 cursor-pointer no-underline border ${
                        isActive
                          ? 'active text-[#15241B] font-extrabold bg-[#D4AF37] border-[#D4AF37] shadow-sm'
                          : 'text-[#15241B] hover:text-[#15241B] hover:bg-[#D4AF37] hover:border-[#D4AF37] border-transparent font-bold'
                      }`}
                    >
                      <span className="relative">
                        {cat.name}
                        <span className="category-underline" />
                      </span>
                      {hasSubcats && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#15241B]' : 'text-[#15241B] group-hover:rotate-180'
                          }`}
                        />
                      )}
                    </Link>

                    {hasSubcats && isOpen && (
                      <div className="absolute top-full left-0 mt-1 min-w-48 bg-[#182C20] border border-[#2D4737] shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <Link
                          to={`/category/${cat.slug || cat.id}`}
                          onClick={() => {
                            setActiveDropdown(null);
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-xs font-bold text-[#D4AF37] hover:bg-[#223B2D] hover:text-white transition no-underline border-b border-[#2D4737] capitalize"
                        >
                          All in {cat.name}
                        </Link>

                        {subcats.map((subcat) => (
                          <Link
                            key={subcat.id}
                            to={`/category/${subcat.slug || subcat.id}`}
                            onClick={() => {
                              setActiveDropdown(null);
                              setIsMobileMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-xs text-[#E4EFE7] hover:bg-[#223B2D] hover:text-[#D4AF37] transition no-underline capitalize"
                          >
                            {subcat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}

              {hasOverflow && (
                <li>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`inline-flex items-center gap-1.5 text-xs tracking-wider font-semibold uppercase px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer border ${
                      isExpanded
                        ? 'bg-[#D4AF37] text-stone-900 border-[#D4AF37] shadow-xs'
                        : 'bg-stone-200/70 text-stone-800 hover:text-stone-900 hover:bg-[#D4AF37] border-stone-300 hover:border-[#D4AF37]'
                    }`}
                  >
                    <span>{isExpanded ? 'Close' : 'View All'}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-stone-900' : 'text-stone-600'
                      }`}
                    />
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>

        {hasOverflow && (
          <div
            className={`absolute top-full left-0 w-full z-40 border-b border-[#2D4737] shadow-xl transition-all duration-300 ease-in-out ${
              isExpanded
                ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                : 'opacity-0 -translate-y-2 pointer-events-none invisible'
            }`}
            style={{ backgroundColor: '#182C20' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold tracking-wider text-[#D4AF37] uppercase">
                  More Categories
                </span>
                <span className="text-[11px] text-stone-400">
                  {overflowRow.length} additional curated collections
                </span>
              </div>
              <div className="flex items-center justify-center gap-2.5 flex-wrap">
                {overflowRow.map((cat) => {
                  const subcats = subcategoriesByParent[cat.id] || [];
                  const hasSubcats = subcats.length > 0;
                  const isActive = activeCategory === cat.slug || String(activeCategory) === String(cat.id);
                  const isOpen = activeDropdown === cat.id;

                  return (
                    <div
                      key={cat.id}
                      className="relative group"
                      onMouseEnter={() => hasSubcats && setActiveDropdown(cat.id)}
                      onMouseLeave={() => hasSubcats && setActiveDropdown(null)}
                    >
                      <Link
                        to={`/category/${cat.slug || cat.id}`}
                        onClick={() => {
                          setActiveDropdown(null);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`nav-category-link inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide capitalize transition-all duration-200 cursor-pointer no-underline border ${
                          isActive
                            ? 'bg-[#D4AF37] text-stone-900 border-[#D4AF37] shadow-sm font-semibold'
                            : 'bg-[#223B2D] text-white border-[#2D4737] hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-stone-900 hover:shadow-xs'
                        }`}
                      >
                        <span className="font-medium relative">
                          {cat.name}
                        </span>
                        {hasSubcats && (
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-stone-900' : 'text-[#8EA696] group-hover:rotate-180 group-hover:text-stone-900'
                            }`}
                          />
                        )}
                      </Link>

                      {hasSubcats && isOpen && (
                        <div className="absolute top-full left-0 mt-1 min-w-48 bg-white border border-[#BACBBD] shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                          <Link
                            to={`/category/${cat.slug || cat.id}`}
                            onClick={() => {
                              setActiveDropdown(null);
                              setIsMobileMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-xs font-bold text-stone-900 hover:bg-[#C4D9C8] hover:text-[#145E33] transition no-underline border-b border-[#BACBBD]/60 capitalize"
                          >
                            All in {cat.name}
                          </Link>
                          {subcats.map((subcat) => (
                            <Link
                              key={subcat.id}
                              to={`/category/${subcat.slug || subcat.id}`}
                              onClick={() => {
                                setActiveDropdown(null);
                                setIsMobileMenuOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-[#C4D9C8] hover:text-[#145E33] transition no-underline capitalize"
                            >
                              {subcat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-[#2D4737] px-4 py-4 space-y-3 max-h-[75vh] overflow-y-auto" style={{ backgroundColor: '#182C20' }}>
          <div className="space-y-1 text-sm font-medium text-gray-200">
            {navbarCategories.map((cat) => {
              const subcats = subcategoriesByParent[cat.id] || [];
              const hasSubcats = subcats.length > 0;

              if (!hasSubcats) {
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug || cat.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left py-2 hover:text-[#D4AF37] font-medium text-[#E4EFE7] capitalize no-underline transition"
                  >
                    {cat.name}
                  </Link>
                );
              }

              return (
                <details key={cat.id} className="group">
                  <summary className="flex items-center justify-between py-2 cursor-pointer list-none font-medium text-[#E4EFE7] hover:text-[#D4AF37] capitalize transition">
                    <span>{cat.name}</span>
                    <ChevronDown className="w-4 h-4 text-stone-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pl-4 pb-2 space-y-1.5 text-xs text-stone-300">
                    <Link
                      to={`/category/${cat.slug || cat.id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-left py-1 font-semibold text-[#D4AF37] hover:text-white capitalize no-underline"
                    >
                      All in {cat.name}
                    </Link>
                    {subcats.map((subcat) => (
                      <Link
                        key={subcat.id}
                        to={`/category/${subcat.slug || subcat.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-left py-1 hover:text-[#D4AF37] text-stone-300 capitalize no-underline"
                      >
                        {subcat.name}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            })}

            <div className="pt-2 border-t border-[#2D4737] space-y-1">
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left py-2 hover:text-[#D4AF37] font-semibold no-underline text-[#E4EFE7]"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left py-2 hover:text-[#D4AF37] font-semibold no-underline text-[#E4EFE7]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
