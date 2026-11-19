import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { apiService } from '../services/api';
import { getCachedData, setCachedData, CACHE_KEYS } from '../utils/cache';

export default function Navbar({
  onSelectCategory,
  activeCategory: propActiveCategory
}) {
  const location = useLocation();
  const isContactActive = location.pathname === '/contact';

  const categoryMatch = location.pathname.match(/^\/category\/?([^/]*)/);
  const urlCategorySlug = categoryMatch ? (categoryMatch[1] || 'all') : null;
  const activeCategory = propActiveCategory !== undefined ? propActiveCategory : (urlCategorySlug || 'all');

  const [categories, setCategories] = useState(() => {
    const cached = getCachedData(CACHE_KEYS.CATEGORIES, null);
    return Array.isArray(cached) ? cached : [];
  });
  const [isLoading, setIsLoading] = useState(() => {
    const cached = getCachedData(CACHE_KEYS.CATEGORIES, null);
    return !Array.isArray(cached) || cached.length === 0;
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const data = await apiService.getCategories();
        if (data.success && isMounted) {
          const fetchedCats = data.categories || [];
          setCategories(fetchedCats);
          setIsLoading(false);
          setCachedData(CACHE_KEYS.CATEGORIES, fetchedCats);
        }
      } catch (err) {
        console.error('Navbar: failed to fetch categories', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Top-level categories shown in navbar (strictly product categories, show_in_navbar = 1, max 10)
  const navbarCategories = categories
    .filter(c => (c.parent_id === null || c.parent_id === undefined) && Boolean(c.show_in_navbar) && (c.section_type === 'category' || !c.section_type))
    .slice(0, 10);

  // Group subcategories by parent_id
  const subcategoriesByParent = {};
  categories.forEach(c => {
    if (c.parent_id !== null && c.parent_id !== undefined) {
      if (!subcategoriesByParent[c.parent_id]) {
        subcategoriesByParent[c.parent_id] = [];
      }
      subcategoriesByParent[c.parent_id].push(c);
    }
  });

  const handleCategoryClick = (catSlugOrId) => {
    setActiveDropdown(null);
    if (onSelectCategory) {
      onSelectCategory(catSlugOrId);
      const el = document.getElementById('shop-now') || document.querySelector('.product-grid-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const primaryRow = navbarCategories.slice(0, 6);
  const overflowRow = navbarCategories.slice(6);
  const hasOverflow = navbarCategories.length > 6;

  return (
    <nav
      aria-label="Main Store Navigation"
      className="relative z-40"
      style={{ backgroundColor: '#FDFBF7', borderTop: '1px solid rgba(198, 40, 40, 0.14)', borderBottom: '1px solid rgba(198, 40, 40, 0.14)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center gap-6 py-3.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-4 bg-stone-200/60 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Primary Row: First 6 categories */}
            <ul className="flex items-center justify-center gap-6 xl:gap-8 text-xs xl:text-sm font-medium text-stone-700 list-none m-0 p-0 flex-wrap">
              {primaryRow.map((cat) => {
                const subcats = subcategoriesByParent[cat.id] || [];
                const hasSubcats = subcats.length > 0;
                const isActive = activeCategory === cat.slug || String(activeCategory) === String(cat.id);
                const isOpen = activeDropdown === cat.id;

                return (
                  <li
                    key={cat.id}
                    className="relative py-3 group"
                    onMouseEnter={() => hasSubcats && setActiveDropdown(cat.id)}
                    onMouseLeave={() => hasSubcats && setActiveDropdown(null)}
                  >
                    <Link
                      to={`/category/${cat.slug || cat.id}`}
                      onClick={() => setActiveDropdown(null)}
                      className={`nav-category-link inline-flex items-center gap-1.5 text-inherit font-inherit p-0 tracking-wide no-underline ${
                        isActive ? 'active' : ''
                      }`}
                    >
                      <span className="relative">
                        {cat.name}
                        <span className="category-underline" />
                      </span>
                      {hasSubcats && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-250 ${
                            isOpen ? 'rotate-180 text-[#C62828]' : 'text-stone-400 group-hover:rotate-180 group-hover:text-[#C62828]'
                          }`}
                        />
                      )}
                    </Link>

                    {/* Subcategory Dropdown */}
                    {hasSubcats && isOpen && (
                      <div className="absolute top-full left-0 min-w-48 bg-white border border-[#E8DFD3] shadow-xl rounded-b-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <Link
                          to={`/category/${cat.slug || cat.id}`}
                          onClick={() => setActiveDropdown(null)}
                          className="block w-full text-left px-4 py-2 text-xs font-semibold text-stone-900 hover:bg-[#FAF7F2] hover:text-[#C62828] transition border-b border-[#E8DFD3]/60 no-underline"
                        >
                          All in {cat.name}
                        </Link>
                        {subcats.map((subcat) => (
                          <Link
                            key={subcat.id}
                            to={`/category/${subcat.slug || subcat.id}`}
                            onClick={() => setActiveDropdown(null)}
                            className="block w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#C62828] transition no-underline"
                          >
                            {subcat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}

              {/* View All / Show Less Button */}
              {hasOverflow && (
                <li className="py-3">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-full transition cursor-pointer border ${
                      isExpanded
                        ? 'bg-[#C62828] text-white border-[#C62828]'
                        : 'bg-[#FAF7F2] text-stone-800 hover:text-[#C62828] border-[#E8DFD3] hover:border-[#C62828]'
                    }`}
                  >
                    <span>{isExpanded ? 'Show Less' : 'View All'}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </li>
              )}

              {/* Contact Us Link */}
              <li className="relative py-3">
                <Link
                  to="/contact"
                  className={`nav-category-link inline-flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-inherit font-inherit p-0 tracking-wide no-underline ${
                    isContactActive ? 'active' : ''
                  }`}
                >
                  <span className="relative">
                    Contact Us
                    <span className="category-underline" />
                  </span>
                </Link>
              </li>
            </ul>

            {/* Expandable Row for categories 7 to 10 */}
            {hasOverflow && isExpanded && (
              <div
                className="border-t border-[#E8DFD3] py-3 animate-in fade-in slide-in-from-top-1 duration-150"
                style={{ backgroundColor: '#FDFBF7' }}
              >
                <ul className="flex items-center justify-center gap-8 text-xs xl:text-sm font-medium text-stone-700 list-none m-0 p-0 flex-wrap">
                  {overflowRow.map((cat) => {
                    const subcats = subcategoriesByParent[cat.id] || [];
                    const hasSubcats = subcats.length > 0;
                    const isActive = activeCategory === cat.slug || String(activeCategory) === String(cat.id);
                    const isOpen = activeDropdown === cat.id;

                    return (
                      <li
                        key={cat.id}
                        className="relative py-1 group"
                        onMouseEnter={() => hasSubcats && setActiveDropdown(cat.id)}
                        onMouseLeave={() => hasSubcats && setActiveDropdown(null)}
                      >
                        <Link
                          to={`/category/${cat.slug || cat.id}`}
                          onClick={() => setActiveDropdown(null)}
                          className={`nav-category-link inline-flex items-center gap-1.5 text-inherit font-inherit p-0 tracking-wide no-underline ${
                            isActive ? 'active' : ''
                          }`}
                        >
                          <span className="relative">
                            {cat.name}
                            <span className="category-underline" />
                          </span>
                          {hasSubcats && (
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-250 ${
                                isOpen ? 'rotate-180 text-[#C62828]' : 'text-stone-400 group-hover:rotate-180 group-hover:text-[#C62828]'
                              }`}
                            />
                          )}
                        </Link>

                        {hasSubcats && isOpen && (
                          <div className="absolute top-full left-0 min-w-48 bg-white border border-[#E8DFD3] shadow-xl rounded-b-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                            <Link
                              to={`/category/${cat.slug || cat.id}`}
                              onClick={() => setActiveDropdown(null)}
                              className="block w-full text-left px-4 py-2 text-xs font-semibold text-stone-900 hover:bg-[#FAF7F2] hover:text-[#C62828] transition border-b border-[#E8DFD3]/60 no-underline"
                            >
                              All in {cat.name}
                            </Link>
                            {subcats.map((subcat) => (
                              <Link
                                key={subcat.id}
                                to={`/category/${subcat.slug || subcat.id}`}
                                onClick={() => setActiveDropdown(null)}
                                className="block w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#C62828] transition no-underline"
                              >
                                {subcat.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
