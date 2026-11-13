import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomeCarousels({
  categories = [],
  activeCategory,
  onSelectCategory
}) {
  const categoryScrollRef = useRef(null);
  const occasionScrollRef = useRef(null);

  const [canScrollCategoryLeft, setCanScrollCategoryLeft] = useState(false);
  const [canScrollCategoryRight, setCanScrollCategoryRight] = useState(true);
  const [categoryScrollRatio, setCategoryScrollRatio] = useState(0);

  // Smooth scroll helper
  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollCategoryLeft(scrollLeft > 15);
      setCanScrollCategoryRight(scrollLeft < scrollWidth - clientWidth - 15);
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setCategoryScrollRatio(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
      }
    }
  };

  useEffect(() => {
    handleCategoryScroll();
    window.addEventListener('resize', handleCategoryScroll);
    return () => window.removeEventListener('resize', handleCategoryScroll);
  }, [categories]);

  // Top-level categories filtered by section_type
  const shopByCategories = (categories || []).filter(
    (c) => (c.parent_id === null || c.parent_id === undefined) && (c.section_type === 'category' || !c.section_type)
  );

  const shopByOccasions = (categories || []).filter(
    (c) => (c.parent_id === null || c.parent_id === undefined) && c.section_type === 'occasion'
  );

  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category.slug || category.id);
      const el = document.getElementById('shop-by-category-section') || document.querySelector('.editorial-category-card');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Indicators count for Shop by Category
  const indicatorCount = Math.min(5, Math.max(2, Math.ceil(shopByCategories.length / 2)));
  const activeCategoryDot = Math.min(
    indicatorCount - 1,
    Math.round(categoryScrollRatio * (indicatorCount - 1))
  );

  const scrollToCategoryIndex = (idx) => {
    if (categoryScrollRef.current) {
      const { scrollWidth, clientWidth } = categoryScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const target = (idx / (indicatorCount - 1)) * maxScroll;
      categoryScrollRef.current.scrollTo({ left: target, behavior: 'smooth' });
    }
  };

  // Taller, Editorial Category Card Component (Reference: Gargian Layout)
  const EditorialCategoryCard = ({ category }) => {
    const isSelected = activeCategory === category.slug || String(activeCategory) === String(category.id);
    const [imgFailed, setImgFailed] = useState(false);

    return (
      <div
        onClick={() => handleCategoryClick(category)}
        className={`editorial-category-card group ${isSelected ? 'selected ring-2 ring-[#C62828]/60' : ''}`}
      >
        {/* Tall Image Frame with 3:4 Aspect Ratio */}
        <div className="editorial-card-image-wrap">
          {category.image_url && !imgFailed ? (
            <img
              src={category.image_url}
              alt={category.name}
              loading="lazy"
              className="editorial-card-image"
              onError={() => setImgFailed(true)}
            />
          ) : (
            /* Luxury Champagne Fallback Placeholder */
            <div
              className="w-full h-full flex flex-col items-center justify-between p-6 relative select-none"
              style={{
                background: 'linear-gradient(145deg, #FDF8F2 0%, #F3E6D8 100%)'
              }}
            >
              {/* Decorative Corner Inset Frame */}
              <div
                className="absolute inset-3 rounded-lg border pointer-events-none"
                style={{ borderColor: 'rgba(198, 40, 40, 0.15)' }}
              />
              <div
                className="absolute inset-4 rounded-md border pointer-events-none"
                style={{ borderColor: 'rgba(229, 168, 35, 0.25)' }}
              />

              <span
                className="text-[10px] uppercase font-bold tracking-widest pt-2 z-10"
                style={{ color: '#1B7A43' }}
              >
                Signature Collection
              </span>

              {/* Monogram Badge */}
              <div className="my-auto flex flex-col items-center z-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-serif text-xl font-bold tracking-widest shadow-xs transition-transform duration-500 group-hover:scale-110"
                  style={{
                    background: '#FFFFFF',
                    color: '#C62828',
                    border: '1.5px solid rgba(198, 40, 40, 0.3)'
                  }}
                >
                  {category.name ? category.name.substring(0, 2).toUpperCase() : 'TG'}
                </div>
                <span className="font-serif italic text-xs text-stone-600 mt-2.5 tracking-wider">
                  The Gift Studio
                </span>
              </div>

              <span
                className="text-[11px] font-semibold tracking-wider uppercase pb-1 z-10 transition-colors group-hover:underline"
                style={{ color: '#C62828' }}
              >
                Explore Collection
              </span>
            </div>
          )}

          {/* Product count tag */}
          {category.product_count !== undefined && category.product_count > 0 && (
            <span
              className="absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md"
              style={{ background: 'rgba(30, 30, 30, 0.78)' }}
            >
              {category.product_count} Gifts
            </span>
          )}
        </div>

        {/* Clean White Card Footer with Category Title */}
        <div className="pt-3.5 pb-1 px-1 text-center flex flex-col items-center justify-center">
          <h3
            className="editorial-category-title font-serif text-[1.05rem] font-semibold tracking-wide capitalize transition-colors duration-250 leading-snug line-clamp-1"
            style={{
              color: isSelected ? '#C62828' : '#1E1E1E'
            }}
          >
            {category.name}
          </h3>
          <span className="text-[11px] text-stone-400 font-medium tracking-wider uppercase mt-0.5">
            View Collection
          </span>
        </div>

        {/* Bottom Crimson Accent Bar on Hover */}
        <span className="editorial-card-accent-bar" />
      </div>
    );
  };

  // Luxury Card Component for Occasions
  const CategoryCard = ({ category, isOccasion = false }) => {
    const isSelected = activeCategory === category.slug || String(activeCategory) === String(category.id);

    return (
      <div
        onClick={() => handleCategoryClick(category)}
        className="group flex flex-col items-center shrink-0 w-36 sm:w-44 md:w-48 cursor-pointer select-none transition-transform duration-300 hover:-translate-y-1"
      >
        {/* Card Image Container */}
        <div
          className={`relative w-full aspect-square rounded-2xl overflow-hidden bg-[#f7f6f4] border transition-all duration-300 ${
            isSelected
              ? 'border-gray-900 shadow-lg ring-2 ring-gray-900'
              : 'border-gray-200/80 shadow-xs group-hover:border-gray-400 group-hover:shadow-md'
          }`}
        >
          {category.image_url ? (
            <img
              src={category.image_url}
              alt={category.name}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-[#fcfbf9] to-gray-100 p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#07111E] text-white flex items-center justify-center font-serif text-base font-bold mb-2 shadow-xs group-hover:scale-110 transition-transform">
                {category.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">
                {isOccasion ? 'Occasion' : 'Collection'}
              </span>
            </div>
          )}

          {/* Subtle gold badge for product count */}
          {category.product_count !== undefined && category.product_count > 0 && (
            <span className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {category.product_count} gifts
            </span>
          )}
        </div>

        {/* Centered Title */}
        <div className="mt-3 text-center px-1">
          <h4
            className={`font-serif text-xs sm:text-sm tracking-wide transition-colors line-clamp-1 ${
              isSelected ? 'font-bold text-black' : 'font-semibold text-gray-800 group-hover:text-black'
            }`}
          >
            {category.name}
          </h4>
          <span className="text-[11px] text-gray-400 font-medium tracking-wider uppercase mt-0.5 block">
            Explore
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-12">
      {/* ── 1. SHOP BY CATEGORY (TALL EDITORIAL CAROUSEL) ────────────────── */}
      {shopByCategories.length > 0 && (
        <section
          id="shop-by-category-section"
          className="w-full py-12"
          style={{
            backgroundColor: '#F3ECE1',
            borderTop: '1px solid #E8DFD3',
            borderBottom: '1px solid #E8DFD3'
          }}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-5">
              <span className="text-[11px] font-bold tracking-widest uppercase block mb-1" style={{ color: '#C62828' }}>
                Curated Hampers
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-950 tracking-tight">
                Shop by Category
              </h2>
            </div>

            {/* Carousel Viewport with Floating Edge Arrows */}
            <div className="relative group/category-carousel">
              {/* Left Floating Edge Arrow */}
              {canScrollCategoryLeft && (
                <button
                  type="button"
                  onClick={() => scroll(categoryScrollRef, 'left')}
                  className="category-floating-arrow -left-3 sm:-left-4 lg:-left-5"
                  aria-label="Previous categories"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Scroll Track (Hidden Native Scrollbar) */}
              <div
                ref={categoryScrollRef}
                onScroll={handleCategoryScroll}
                className="category-scroll-track"
              >
                {shopByCategories.map((category) => (
                  <EditorialCategoryCard key={category.id} category={category} />
                ))}
              </div>

              {/* Right Floating Edge Arrow */}
              {canScrollCategoryRight && (
                <button
                  type="button"
                  onClick={() => scroll(categoryScrollRef, 'right')}
                  className="category-floating-arrow -right-3 sm:-right-4 lg:-right-5"
                  aria-label="Next categories"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Minimal Bottom Indicator Dots */}
            {shopByCategories.length > 4 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                {[...Array(indicatorCount)].map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToCategoryIndex(idx)}
                    className="p-1 border-none bg-transparent cursor-pointer transition-all duration-300"
                    aria-label={`Go to category slide ${idx + 1}`}
                  >
                    <span
                      className="block rounded-full transition-all duration-300"
                      style={{
                        height: '6px',
                        width: activeCategoryDot === idx ? '22px' : '6px',
                        backgroundColor: activeCategoryDot === idx ? '#C62828' : '#D8CDBC'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 2. SHOP BY OCCASION ─────────────────────────────────────────── */}
      {shopByOccasions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="flex items-end justify-between mb-5">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase block mb-1" style={{ color: '#1B7A43' }}>
                Festivals & Milestones
              </span>
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-gray-950 tracking-tight">
                Shop by Occasion
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll(occasionScrollRef, 'left')}
                className="w-9 h-9 rounded-full border border-[#E8DFD3] bg-white hover:bg-[#FAF7F2] hover:text-[#C62828] text-gray-700 flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll(occasionScrollRef, 'right')}
                className="w-9 h-9 rounded-full border border-[#E8DFD3] bg-white hover:bg-[#FAF7F2] hover:text-[#C62828] text-gray-700 flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={occasionScrollRef}
            className="flex items-start gap-4 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {shopByOccasions.map((category) => (
              <CategoryCard key={category.id} category={category} isOccasion={true} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

