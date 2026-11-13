import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { apiService } from '../services/api';

const Header = ({
  searchQuery = '',
  setSearchQuery,
  onSelectCategory,
  activeCategory = 'all'
}) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch categories dynamically
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const data = await apiService.getCategories();
        if (data.success && isMounted) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Header: failed to fetch categories', err);
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter top-level categories that have show_in_navbar = 1 (max 10)
  const navbarCategories = categories
    .filter(c => (c.parent_id === null || c.parent_id === undefined) && Boolean(c.show_in_navbar))
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

  const cities = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Pune', 'Chennai'];

  const handleCategoryClick = (categorySlugOrId) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);

    if (onSelectCategory) {
      onSelectCategory(categorySlugOrId);
      const el = document.getElementById('shop-now') || document.querySelector('.product-grid-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  // Row splitting: first 6 in primary row, 7-10 in expandable row
  const primaryRow = navbarCategories.slice(0, 6);
  const overflowRow = navbarCategories.slice(6);
  const hasOverflow = navbarCategories.length > 6;

  return (
    <header className="w-full relative z-50 shadow-xs" style={{ backgroundColor: '#FDFBF7', borderBottom: '1px solid rgba(198, 40, 40, 0.14)' }}>
      {/* Main Brand / Search / City Bar */}
      <div style={{ borderBottom: '1px solid rgba(198, 40, 40, 0.10)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-gray-700 hover:text-black hover:bg-stone-100 rounded-md cursor-pointer border-none bg-transparent"
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
              className="flex items-center gap-3 text-left bg-transparent border-none cursor-pointer p-0 no-underline text-inherit group"
            >
              <img
                src="/images/gift_logo.jpeg"
                alt="The Gift Studio Logo"
                className="transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ height: '46px', width: 'auto', objectFit: 'contain' }}
              />
              <span className="hidden sm:inline-block h-6 w-px" style={{ background: 'rgba(198, 40, 40, 0.25)' }} />
              <span
                className="hidden sm:inline-block font-serif text-xs sm:text-sm font-bold tracking-wide italic"
                style={{ color: '#C62828', letterSpacing: '0.04em' }}
              >
                Premium Gifting Solutions
              </span>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative flex items-center bg-gray-100 hover:bg-gray-50 focus-within:bg-white border border-transparent focus-within:border-gray-300 rounded-full px-4 py-2 transition">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                placeholder="Search Gifts"
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery && setSearchQuery('')}
                  className="text-gray-400 hover:text-black ml-1 cursor-pointer bg-transparent border-none p-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right: City Selector & Contact Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Location Pill */}
            <div className="relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs sm:text-sm text-gray-700 transition cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="font-medium">{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Select City
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition cursor-pointer border-none bg-transparent ${
                        selectedCity === city ? 'font-semibold text-black bg-gray-50' : 'text-gray-700'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bulk / Corporate Enquiry Button */}
            <a
              href="https://wa.me/917506210892?text=Hi,%20I%20am%20interested%20in%20Bulk%20Corporate%20Gifting"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 shadow-sm whitespace-nowrap no-underline cursor-pointer"
              style={{
                backgroundColor: '#C62828',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1B7A43';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#C62828';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Bulk/Corporate Enquiry
            </a>

            {/* Social Icons */}
            <a
              href="https://facebook.com/thegiftstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#1877F2] flex items-center justify-center transition no-underline shadow-xs hover:scale-105"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook-f text-base"></i>
            </a>

            <a
              href="https://wa.me/917506210892"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#25D366] flex items-center justify-center transition no-underline shadow-xs hover:scale-105"
              aria-label="WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
            </a>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              placeholder="Search Gifts"
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery && setSearchQuery('')}
                className="text-gray-400 hover:text-black ml-1 bg-transparent border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Semantic Top Navbar (Desktop) */}
      <nav
        aria-label="Main Navigation"
        className="hidden lg:block relative"
        style={{ backgroundColor: '#FDFBF7', borderBottom: '1px solid rgba(198, 40, 40, 0.14)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Primary Row: First 6 categories + optional "View All" */}
          <ul className="flex items-center justify-center gap-2 xl:gap-3 text-xs xl:text-sm font-medium text-gray-700 list-none m-0 py-1.5 flex-wrap">
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
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat.slug || cat.id)}
                    className={`nav-category-link inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs xl:text-[13px] tracking-wide font-medium capitalize transition-all duration-200 cursor-pointer border border-transparent ${
                      isActive
                        ? 'active text-[#C62828] font-semibold bg-red-50/70 border-red-200/50 shadow-xs'
                        : 'text-stone-700 hover:text-[#C62828] hover:bg-red-50/40 hover:border-red-100'
                    }`}
                  >
                    <span className="relative">
                      {cat.name}
                      <span className="category-underline" />
                    </span>
                    {hasSubcats && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#C62828]' : 'text-stone-400 group-hover:rotate-180 group-hover:text-[#C62828]'
                        }`}
                      />
                    )}
                  </button>

                  {/* Dropdown Menu for Subcategories */}
                  {hasSubcats && isOpen && (
                    <div className="absolute top-full left-0 mt-1 min-w-48 bg-white border border-[#E8DFD3] shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      {/* Parent category 'View All' link */}
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(cat.slug || cat.id)}
                        className="block w-full text-left px-4 py-2 text-xs font-bold text-stone-900 hover:bg-[#FAF7F2] hover:text-[#C62828] transition border-none bg-transparent cursor-pointer border-b border-[#E8DFD3]/60 capitalize"
                      >
                        All in {cat.name}
                      </button>

                      {/* Subcategory items */}
                      {subcats.map((subcat) => (
                        <button
                          key={subcat.id}
                          type="button"
                          onClick={() => handleCategoryClick(subcat.slug || subcat.id)}
                          className="block w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#C62828] transition border-none bg-transparent cursor-pointer capitalize"
                        >
                          {subcat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}

            {/* "View All" / "Close" toggle button when more than 6 categories are active */}
            {hasOverflow && (
              <li>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`inline-flex items-center gap-1.5 text-xs tracking-wider font-semibold uppercase px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer border ${
                    isExpanded
                      ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs'
                      : 'bg-[#FAF7F2] text-stone-800 hover:text-[#C62828] hover:bg-white border-[#E8DFD3] hover:border-[#C62828]'
                  }`}
                >
                  <span>{isExpanded ? 'Close' : 'View All'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-white' : 'text-stone-500'
                    }`}
                  />
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Expandable Category Drawer for categories 7+ (Absolute Overlay) */}
        {hasOverflow && (
          <div
            className={`absolute top-full left-0 w-full z-40 border-b border-[#E8DFD3] shadow-xl transition-all duration-300 ease-in-out ${
              isExpanded
                ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                : 'opacity-0 -translate-y-2 pointer-events-none invisible'
            }`}
            style={{ backgroundColor: '#FDFBF7' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold tracking-wider text-[#C62828] uppercase">
                  More Categories
                </span>
                <span className="text-[11px] text-stone-500">
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
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(cat.slug || cat.id)}
                        className={`nav-category-link inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide capitalize transition-all duration-200 cursor-pointer border ${
                          isActive
                            ? 'bg-[#C62828] text-white border-[#C62828] shadow-sm font-semibold'
                            : 'bg-white text-stone-800 border-[#E8DFD3] hover:border-[#C62828] hover:text-[#C62828] hover:shadow-xs'
                        }`}
                      >
                        <span className="font-medium relative">
                          {cat.name}
                          {!isActive && <span className="category-underline" />}
                        </span>
                        {hasSubcats && (
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-[#C62828]' : 'text-stone-400 group-hover:rotate-180 group-hover:text-[#C62828]'
                            }`}
                          />
                        )}
                      </button>

                      {/* Dropdown for Subcategories in overflow row */}
                      {hasSubcats && isOpen && (
                        <div className="absolute top-full left-0 mt-1 min-w-48 bg-white border border-[#E8DFD3] shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                          <button
                            type="button"
                            onClick={() => handleCategoryClick(cat.slug || cat.id)}
                            className="block w-full text-left px-4 py-2 text-xs font-bold text-stone-900 hover:bg-[#FAF7F2] hover:text-[#C62828] transition border-none bg-transparent cursor-pointer border-b border-[#E8DFD3]/60 capitalize"
                          >
                            All in {cat.name}
                          </button>
                          {subcats.map((subcat) => (
                            <button
                              key={subcat.id}
                              type="button"
                              onClick={() => handleCategoryClick(subcat.slug || subcat.id)}
                              className="block w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#C62828] transition border-none bg-transparent cursor-pointer capitalize"
                            >
                              {subcat.name}
                            </button>
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

      {/* 4. Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E8DFD3] px-4 py-4 space-y-3 max-h-[75vh] overflow-y-auto" style={{ backgroundColor: '#FDFBF7' }}>
          <div className="pb-2 border-b border-[#E8DFD3]">
            <a
              href="https://wa.me/917506210892?text=Hi,%20I%20am%20interested%20in%20Bulk%20Corporate%20Gifting"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-white text-sm font-semibold py-2.5 rounded-full no-underline transition-colors shadow-sm"
              style={{ backgroundColor: '#C62828' }}
            >
              Bulk / Corporate Enquiry
            </a>
          </div>

          <div className="space-y-1 text-sm font-medium text-gray-800">
            {navbarCategories.map((cat) => {
              const subcats = subcategoriesByParent[cat.id] || [];
              const hasSubcats = subcats.length > 0;

              if (!hasSubcats) {
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.slug || cat.id)}
                    className="block w-full text-left py-2 hover:text-black bg-transparent border-none cursor-pointer font-medium text-gray-800 capitalize"
                  >
                    {cat.name}
                  </button>
                );
              }

              return (
                <details key={cat.id} className="group">
                  <summary className="flex items-center justify-between py-2 cursor-pointer list-none font-medium text-gray-800 capitalize">
                    <span>{cat.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pl-4 pb-2 space-y-1.5 text-xs text-gray-600">
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(cat.slug || cat.id)}
                      className="block w-full text-left py-1 font-semibold text-gray-900 bg-transparent border-none cursor-pointer capitalize"
                    >
                      All in {cat.name}
                    </button>
                    {subcats.map((subcat) => (
                      <button
                        key={subcat.id}
                        type="button"
                        onClick={() => handleCategoryClick(subcat.slug || subcat.id)}
                        className="block w-full text-left py-1 hover:text-black bg-transparent border-none cursor-pointer capitalize"
                      >
                        {subcat.name}
                      </button>
                    ))}
                  </div>
                </details>
              );
            })}

            {/* Mobile Contact Us */}
            <div className="pt-2 border-t border-gray-100">
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left py-2 hover:text-black font-medium no-underline text-gray-800"
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
