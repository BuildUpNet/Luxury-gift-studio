import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const Header = ({
  searchQuery = '',
  setSearchQuery,
  onSelectCategory,
  activeCategory = 'all'
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dropdown items data
  const standardDropdowns = {
    diwali: {
      title: 'Diwali',
      items: ['Diwali Hampers', 'Home Decor', 'View All'],
    },
    birthdays: {
      title: 'Birthdays',
      items: [
        'Curated Hampers',
        'Plants & Flowers',
        'Balloons',
        'For Her',
        'For Him',
        'View All',
      ],
    },
    anniversary: {
      title: 'Anniversary',
      items: [
        'Curated Hampers',
        'Plants & Flowers',
        'Jewellery',
        'Personalised',
        'View All',
      ],
    },
    corporateGifts: {
      title: 'Corporate Gifts',
      items: [
        'Writing & Stationery',
        'Bags & Travel',
        'Apparel',
        'Tech Accessories',
        'Branded Merchandise',
        'Explore All',
      ],
    },
    moreGifts: {
      title: 'More Gifts',
      items: [
        'Home Decor',
        'Baby & Kids',
        'Personalised Games',
        'Fashion & Personal Care',
        'For Him',
        'For Her',
        'Personal Care & Grooming',
        'Balloons',
        'Corporate Gifting',
        'Wedding Gifts',
        'Jewellery',
      ],
    },
  };

  // Best Sellers 6-Column Mega Menu Data
  const bestSellersMegaMenu = [
    {
      title: 'View All Hampers',
      items: [
        'All Gift Hampers',
        'Festive Bestsellers',
        'Luxury Keepsake Hampers',
        'Signature Wooden Boxes',
        'Gourmet Delicacies',
        'View All Hampers',
      ],
    },
    {
      title: 'Hampers By Features',
      items: ['Bestsellers', 'Featured', 'View All'],
    },
    {
      title: 'Hampers By Type',
      items: [
        'Build Your Own Hamper',
        'Chocolates & Candy',
        'Snacks & Munchies',
        'Tea & Coffee',
        'Dry Fruits',
        'View All Hampers',
      ],
    },
    {
      title: 'Hampers By Occasion',
      items: [
        'Sorry Hamper',
        'Love & Romance',
        'Birthday',
        'Housewarming',
        'Wedding',
        'Farewell',
        'Congratulations',
        'Anniversary',
        'Date Night',
        'Movie Night',
      ],
    },
    {
      title: 'Hampers For Recipient',
      items: [
        'For Him',
        'For Her',
        'Parents',
        'Corporate Hampers',
        'Employee Onboarding',
        'Rewards & Appreciation',
        'Promotion & Appraisal',
        'View All',
      ],
    },
    {
      title: 'Hampers By Price',
      items: [
        'Under 1500',
        'Rs. 1500 - Rs. 3000',
        'Rs. 3000 - Rs. 5000',
        'Rs. 5000 - Rs. 7000',
        'View All',
      ],
    },
  ];

  const cities = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Pune', 'Chennai'];

  const handleItemClick = (categoryKey, term) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);

    if (categoryKey === 'create-own' || term === 'Build Your Own Hamper') {
      const el = document.getElementById('build-hamper-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (categoryKey === 'celebrity' || term === 'Celebrity Hampers') {
      const el = document.getElementById('celebrity-hampers');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    if (term) {
      if (setSearchQuery) {
        setSearchQuery(term);
        const el = document.getElementById('shop-now') || document.querySelector('.product-grid-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (categoryKey && onSelectCategory) {
      onSelectCategory(categoryKey);
      const el = document.getElementById('shop-now') || document.querySelector('.product-grid-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full bg-white relative z-40 shadow-sm">
      {/* 1. Top Announcement Bar */}
      <div className="bg-black text-white text-xs md:text-sm py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span>FOR QUERIES PLEASE CALL OR WHATSAPP: 7506210892</span>
        <a
          href="https://wa.me/917506210892"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-amber-300 hover:text-white transition ml-1"
        >
          Chat on WhatsApp
        </a>
      </div>

      {/* 2. Main Navbar */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-gray-700 hover:text-black hover:bg-gray-100 rounded-md"
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
              className="flex items-center gap-2 text-left bg-transparent border-none cursor-pointer p-0 no-underline text-inherit"
            >
              <span className="font-serif text-lg sm:text-xl md:text-2xl font-bold tracking-wider text-gray-950">
                THE GIFT STUDIO
              </span>
              <span className="hidden sm:inline text-gray-300 font-light">|</span>
              <span className="hidden sm:inline text-xs sm:text-sm font-medium text-emerald-800 tracking-wide">
                Nature's Basket
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

          {/* Right: Actions */}
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

              {/* City Selection Dropdown */}
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

            {/* Black Pill Button: Bulk/Corporate Enquiry */}
            <a
              href="https://wa.me/917506210892?text=Hi,%20I%20am%20interested%20in%20Bulk%20Corporate%20Gifting"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition shadow-sm whitespace-nowrap text-decoration-none"
            >
              Bulk/Corporate Enquiry
            </a>

            {/* Social FA Icons: Facebook & WhatsApp */}
            <a
              href="https://facebook.com/thegiftstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#1877F2] flex items-center justify-center transition no-underline shadow-xs hover:scale-105"
              aria-label="Facebook"
              title="Follow us on Facebook"
            >
              <i className="fa-brands fa-facebook-f text-base"></i>
            </a>

            <a
              href="https://wa.me/917506210892"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#25D366] flex items-center justify-center transition no-underline shadow-xs hover:scale-105"
              aria-label="WhatsApp"
              title="Chat with us on WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
            </a>
          </div>
        </div>

        {/* Mobile Search Bar (visible on small screens) */}
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

      {/* 3. Navigation Links & Dropdowns (Desktop) */}
      <nav className="hidden lg:block border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between text-xs xl:text-sm font-medium text-gray-700 list-none m-0 p-0">
            
            {/* 1. Diwali Dropdown (Links to Home Decor Collection) */}
            <li
              className="relative py-3.5 group cursor-pointer"
              onMouseEnter={() => setActiveDropdown('diwali')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to="/collections/tgs-home"
                className={`flex items-center gap-1 bg-transparent border-none cursor-pointer text-inherit font-inherit p-0 hover:text-black transition no-underline ${
                  activeCategory === 'diwali' ? 'font-bold text-black border-b-2 border-black' : ''
                }`}
              >
                Diwali <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
              </Link>
              {activeDropdown === 'diwali' && (
                <div className="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-b-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    to="/collections/tgs-home"
                    onClick={() => setActiveDropdown(null)}
                    className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-amber-950 bg-amber-50/70 hover:bg-amber-100/70 transition no-underline flex items-center justify-between"
                  >
                    <span>Home Decor</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">Featured</span>
                  </Link>
                  <Link
                    to="/collections/diwali-hampers"
                    onClick={() => setActiveDropdown(null)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition no-underline"
                  >
                    Diwali Hampers
                  </Link>
                  <Link
                    to="/collections/tgs-home"
                    onClick={() => setActiveDropdown(null)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition no-underline"
                  >
                    View All
                  </Link>
                </div>
              )}
            </li>

            {/* 2. Celebrity Hampers */}
            <li className="py-3.5">
              <button
                onClick={() => handleItemClick('celebrity')}
                className={`bg-transparent border-none cursor-pointer text-inherit font-inherit p-0 hover:text-black transition ${
                  activeCategory === 'celebrity' ? 'font-bold text-black border-b-2 border-black' : ''
                }`}
              >
                Celebrity Hampers
              </button>
            </li>

            {/* 3. Birthdays Dropdown */}
            <li
              className="relative py-3.5 group cursor-pointer"
              onMouseEnter={() => setActiveDropdown('birthdays')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleItemClick('birthdays')}
                className={`flex items-center gap-1 bg-transparent border-none cursor-pointer text-inherit font-inherit p-0 hover:text-black transition ${
                  activeCategory === 'birthdays' ? 'font-bold text-black border-b-2 border-black' : ''
                }`}
              >
                Birthdays <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              {activeDropdown === 'birthdays' && (
                <div className="absolute top-full left-0 w-52 bg-white border border-gray-100 shadow-xl rounded-b-lg py-2 z-50">
                  {standardDropdowns.birthdays.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleItemClick('birthdays', item === 'View All' ? '' : item)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition border-none bg-transparent cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </li>

            {/* 4. Anniversary Dropdown */}
            <li
              className="relative py-3.5 group cursor-pointer"
              onMouseEnter={() => setActiveDropdown('anniversary')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleItemClick('anniversary')}
                className={`flex items-center gap-1 bg-transparent border-none cursor-pointer text-inherit font-inherit p-0 hover:text-black transition ${
                  activeCategory === 'anniversary' ? 'font-bold text-black border-b-2 border-black' : ''
                }`}
              >
                Anniversary <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              {activeDropdown === 'anniversary' && (
                <div className="absolute top-full left-0 w-52 bg-white border border-gray-100 shadow-xl rounded-b-lg py-2 z-50">
                  {standardDropdowns.anniversary.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleItemClick('anniversary', item === 'View All' ? '' : item)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition border-none bg-transparent cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </li>

            {/* 5. Last Minute Gifting */}
            <li className="py-3.5">
              <button
                onClick={() => handleItemClick('last-minute')}
                className={`bg-transparent border-none cursor-pointer text-inherit font-inherit p-0 hover:text-black transition ${
                  activeCategory === 'last-minute' ? 'font-bold text-black border-b-2 border-black' : ''
                }`}
              >
                Last Minute Gifting
              </button>
            </li>

            {/* 6. Best Sellers - 6 COLUMN MEGA MENU */}
            <li
              className="py-3.5 group cursor-pointer"
              onMouseEnter={() => setActiveDropdown('bestSellers')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleItemClick('best-sellers')}
                className={`flex items-center gap-1 font-semibold text-black hover:text-gray-600 transition bg-transparent border-none cursor-pointer p-0 text-inherit font-inherit ${
                  activeCategory === 'best-sellers' ? 'border-b-2 border-black' : ''
                }`}
              >
                Best Sellers <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Mega Menu Container */}
              {activeDropdown === 'bestSellers' && (
                <div className="absolute left-0 right-0 top-full bg-white border-t border-b border-gray-200 shadow-2xl py-8 px-6 lg:px-12 z-50">
                  <div className="max-w-7xl mx-auto grid grid-cols-6 gap-6 text-left">
                    {bestSellersMegaMenu.map((column, colIdx) => (
                      <div key={colIdx} className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-1 border-b border-gray-100">
                          {column.title}
                        </h4>
                        <ul className="space-y-2 list-none p-0 m-0">
                          {column.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <button
                                onClick={() => handleItemClick('best-sellers', item)}
                                className="text-xs text-gray-600 hover:text-black hover:translate-x-0.5 inline-block transition bg-transparent border-none p-0 cursor-pointer text-left"
                              >
                                {item}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>

            {/* 7. Create Your Own Hamper */}
            <li className="py-3.5">
              <button
                onClick={() => handleItemClick('create-own')}
                className={`bg-transparent border-none cursor-pointer text-inherit font-inherit p-0 hover:text-black transition ${
                  activeCategory === 'create-own' ? 'font-bold text-black border-b-2 border-black' : ''
                }`}
              >
                Create Your Own Hamper
              </button>
            </li>

            {/* 8. Corporate Gifts Dropdown */}
            <li
              className="relative py-3.5 group cursor-pointer"
              onMouseEnter={() => setActiveDropdown('corporateGifts')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleItemClick('corporate')}
                className={`flex items-center gap-1 bg-transparent border-none cursor-pointer text-inherit font-inherit p-0 hover:text-black transition ${
                  activeCategory === 'corporate' ? 'font-bold text-black border-b-2 border-black' : ''
                }`}
              >
                Corporate Gifts <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              {activeDropdown === 'corporateGifts' && (
                <div className="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-b-lg py-2 z-50">
                  {standardDropdowns.corporateGifts.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleItemClick('corporate', item === 'Explore All' ? '' : item)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition border-none bg-transparent cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </li>

            {/* 9. Home Decor */}
            <li className="py-3.5">
              <Link
                to="/collections/tgs-home"
                className={`bg-transparent border-none cursor-pointer text-inherit font-inherit p-0 hover:text-black transition no-underline inline-block ${
                  activeCategory === 'home-decor' ? 'font-bold text-black border-b-2 border-black pb-0.5' : ''
                }`}
              >
                Home Decor
              </Link>
            </li>

            {/* 10. More Gifts Dropdown */}
            <li
              className="relative py-3.5 group cursor-pointer"
              onMouseEnter={() => setActiveDropdown('moreGifts')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <span className="flex items-center gap-1 hover:text-black transition">
                More Gifts <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
              </span>
              {activeDropdown === 'moreGifts' && (
                <div className="absolute top-full right-0 w-64 bg-white border border-gray-100 shadow-xl rounded-b-lg py-2 z-50">
                  {standardDropdowns.moreGifts.items.map((item, idx) => {
                    if (item === 'Home Decor') {
                      return (
                        <Link
                          key={idx}
                          to="/collections/tgs-home"
                          onClick={() => setActiveDropdown(null)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition no-underline"
                        >
                          Home Decor
                        </Link>
                      );
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handleItemClick(null, item)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition border-none bg-transparent cursor-pointer"
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              )}
            </li>

          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white px-4 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="pb-2 border-b border-gray-100">
            <a
              href="https://wa.me/917506210892?text=Hi,%20I%20am%20interested%20in%20Bulk%20Corporate%20Gifting"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-black text-white text-sm font-medium py-2.5 rounded-full text-decoration-none"
            >
              Bulk / Corporate Enquiry
            </a>
          </div>

          <div className="space-y-2 text-sm font-medium text-gray-800">
            {/* Mobile Diwali */}
            <details className="group">
              <summary className="flex items-center justify-between py-2 cursor-pointer list-none">
                <span>Diwali</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="pl-4 pb-2 space-y-1.5 text-sm text-gray-600">
                {standardDropdowns.diwali.items.map((item, idx) => {
                  if (item === 'Diwali Hampers') {
                    return (
                      <Link
                        key={idx}
                        to="/collections/diwali-hampers"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setActiveDropdown(null);
                        }}
                        className="block w-full text-left py-1.5 font-medium text-gray-700 hover:text-amber-800 no-underline"
                      >
                        Diwali Hampers
                      </Link>
                    );
                  }
                  if (item === 'Home Decor' || item === 'View All') {
                    return (
                      <Link
                        key={idx}
                        to="/collections/tgs-home"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setActiveDropdown(null);
                        }}
                        className="block w-full text-left py-1.5 font-medium text-amber-950 hover:text-amber-800 no-underline"
                      >
                        {item}
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleItemClick('diwali', item === 'View All' ? '' : item)}
                      className="block w-full text-left py-1 hover:text-black bg-transparent border-none cursor-pointer"
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </details>

            <button
              onClick={() => handleItemClick('celebrity')}
              className="block w-full text-left py-2 hover:text-black bg-transparent border-none cursor-pointer font-medium"
            >
              Celebrity Hampers
            </button>

            {/* Mobile Birthdays */}
            <details className="group">
              <summary className="flex items-center justify-between py-2 cursor-pointer list-none">
                <span>Birthdays</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="pl-4 pb-2 space-y-1.5 text-sm text-gray-600">
                {standardDropdowns.birthdays.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleItemClick('birthdays', item === 'View All' ? '' : item)}
                    className="block w-full text-left py-1 hover:text-black bg-transparent border-none cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </details>

            {/* Mobile Anniversary */}
            <details className="group">
              <summary className="flex items-center justify-between py-2 cursor-pointer list-none">
                <span>Anniversary</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="pl-4 pb-2 space-y-1.5 text-sm text-gray-600">
                {standardDropdowns.anniversary.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleItemClick('anniversary', item === 'View All' ? '' : item)}
                    className="block w-full text-left py-1 hover:text-black bg-transparent border-none cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </details>

            <button
              onClick={() => handleItemClick('last-minute')}
              className="block w-full text-left py-2 hover:text-black bg-transparent border-none cursor-pointer font-medium"
            >
              Last Minute Gifting
            </button>

            {/* Mobile Best Sellers Mega */}
            <details className="group">
              <summary className="flex items-center justify-between py-2 cursor-pointer list-none font-semibold text-black">
                <span>Best Sellers (All Categories)</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="pl-4 pb-3 space-y-3 text-xs text-gray-600">
                {bestSellersMegaMenu.map((col, idx) => (
                  <div key={idx}>
                    <p className="font-semibold text-gray-900 mb-1">{col.title}</p>
                    <div className="space-y-1 pl-2">
                      {col.items.map((subItem, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleItemClick('best-sellers', subItem)}
                          className="block w-full text-left py-0.5 hover:text-black bg-transparent border-none cursor-pointer"
                        >
                          {subItem}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <button
              onClick={() => handleItemClick('create-own')}
              className="block w-full text-left py-2 hover:text-black bg-transparent border-none cursor-pointer font-medium"
            >
              Create Your Own Hamper
            </button>

            {/* Mobile Corporate Gifts */}
            <details className="group">
              <summary className="flex items-center justify-between py-2 cursor-pointer list-none">
                <span>Corporate Gifts</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="pl-4 pb-2 space-y-1.5 text-sm text-gray-600">
                {standardDropdowns.corporateGifts.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleItemClick('corporate', item === 'Explore All' ? '' : item)}
                    className="block w-full text-left py-1 hover:text-black bg-transparent border-none cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </details>

            <Link
              to="/collections/tgs-home"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveDropdown(null);
              }}
              className="block w-full text-left py-2 hover:text-black font-medium no-underline text-gray-800"
            >
              Home Decor
            </Link>

            {/* Mobile More Gifts */}
            <details className="group">
              <summary className="flex items-center justify-between py-2 cursor-pointer list-none">
                <span>More Gifts</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="pl-4 pb-2 space-y-1.5 text-sm text-gray-600">
                {standardDropdowns.moreGifts.items.map((item, idx) => {
                  if (item === 'Home Decor') {
                    return (
                      <Link
                        key={idx}
                        to="/collections/tgs-home"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setActiveDropdown(null);
                        }}
                        className="block w-full text-left py-1 hover:text-black no-underline text-gray-700"
                      >
                        Home Decor
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleItemClick(null, item)}
                      className="block w-full text-left py-1 hover:text-black bg-transparent border-none cursor-pointer"
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </details>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
