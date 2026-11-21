import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Grid, CalendarHeart } from './FaIcons';
import resolveImageUrl from '../utils/image';
import { apiService } from '../services/api';
import { getCachedData, setCachedData, CACHE_KEYS } from '../utils/cache';

export default function HomeCarousels({
  categories = [],
  activeCategory,
  onSelectCategory
}) {
  const categoryScrollRef = useRef(null);
  const occasionScrollRef = useRef(null);

  const [occasions, setOccasions] = useState(() => {
    const cached = getCachedData(CACHE_KEYS.OCCASIONS, null);
    return Array.isArray(cached) ? cached : [];
  });

  const [canScrollCategoryLeft, setCanScrollCategoryLeft] = useState(false);
  const [canScrollCategoryRight, setCanScrollCategoryRight] = useState(true);
  const [categoryScrollRatio, setCategoryScrollRatio] = useState(0);

  const [canScrollOccasionLeft, setCanScrollOccasionLeft] = useState(false);
  const [canScrollOccasionRight, setCanScrollOccasionRight] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOccasions = async () => {
      try {
        const res = await apiService.getOccasions();
        if (res?.success && Array.isArray(res.occasions) && isMounted) {
          setOccasions(res.occasions);
          setCachedData(CACHE_KEYS.OCCASIONS, res.occasions);
        }
      } catch (err) {
        console.error('Failed to load occasions for home carousel:', err);
      }
    };
    fetchOccasions();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleOccasionScroll = () => {
    if (occasionScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = occasionScrollRef.current;
      setCanScrollOccasionLeft(scrollLeft > 15);
      setCanScrollOccasionRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  };

  useEffect(() => {
    handleCategoryScroll();
    handleOccasionScroll();
    window.addEventListener('resize', handleCategoryScroll);
    window.addEventListener('resize', handleOccasionScroll);
    return () => {
      window.removeEventListener('resize', handleCategoryScroll);
      window.removeEventListener('resize', handleOccasionScroll);
    };
  }, [categories, occasions]);

  // Top-level product categories for Shop by Category, ordered strictly by priority (sort_order)
  const shopByCategories = (categories || [])
    .filter(
      (c) => (c.parent_id === null || c.parent_id === undefined) && (c.section_type === 'category' || !c.section_type)
    )
    .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));

  // Occasions ordered strictly by priority (sort_order)
  const sortedOccasions = [...(occasions || [])].sort(
    (a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0)
  );

  const indicatorCount = Math.min(5, Math.max(2, Math.ceil((shopByCategories?.length || 0) / 2)));
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

  // Occasion Card Component matching exact editorial category card styling
  const EditorialOccasionCard = ({ occasion }) => {
    const [imgFailed, setImgFailed] = useState(false);
    const occasionTarget = `/occasion/${occasion.slug || occasion.id}`;
    const coverUrl = resolveImageUrl(occasion.image_url);

    return (
      <Link
        to={occasionTarget}
        className="editorial-category-card group no-underline text-inherit"
      >
        <div className="editorial-card-image-wrap">
          {occasion.image_url && !imgFailed ? (
            <img
              src={coverUrl}
              alt={occasion.name}
              loading="lazy"
              className="editorial-card-image"
              onError={() => setImgFailed(true)}
            />
          ) : (
            /* Luxury Occasion Champagne Fallback Placeholder */
            <div
              className="w-full h-full flex flex-col items-center justify-between p-6 relative select-none"
              style={{
                background: 'linear-gradient(145deg, #F4FAF5 0%, #DBE6DC 100%)'
              }}
            >
              <div
                className="absolute inset-3 rounded-lg border pointer-events-none"
                style={{ borderColor: 'rgba(27, 122, 67, 0.25)' }}
              />
              <div
                className="absolute inset-4 rounded-md border pointer-events-none"
                style={{ borderColor: 'rgba(229, 168, 35, 0.25)' }}
              />

              <span
                className="text-[10px] uppercase font-bold tracking-widest pt-2 z-10"
                style={{ color: '#C59D5F' }}
              >
                Celebration Collection
              </span>

              <div className="my-auto flex flex-col items-center z-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-serif text-xl font-bold tracking-widest shadow-xs transition-transform duration-500 group-hover:scale-110"
                  style={{
                    background: '#FFFFFF',
                    color: '#C62828',
                    border: '1.5px solid rgba(27, 122, 67, 0.35)'
                  }}
                >
                  {occasion.name ? occasion.name.substring(0, 2).toUpperCase() : 'OC'}
                </div>
                <span className="font-serif italic text-xs text-stone-600 mt-2.5 tracking-wider">
                  The Gift Studio
                </span>
              </div>

              <span
                className="text-[11px] font-semibold tracking-wider uppercase pb-1 z-10 transition-colors group-hover:underline"
                style={{ color: '#8B2635' }}
              >
                Explore Occasion
              </span>
            </div>
          )}

          {occasion.products_count !== undefined && occasion.products_count > 0 && (
            <span
              className="absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md"
              style={{ background: 'rgba(30, 30, 30, 0.78)' }}
            >
              {occasion.products_count} Gifts
            </span>
          )}
        </div>

        <div className="pt-3.5 pb-1 px-1 text-center flex flex-col items-center justify-center">
          <h3
            className="editorial-category-title font-serif text-[1.05rem] font-semibold tracking-wide capitalize transition-colors duration-250 leading-snug line-clamp-1"
            style={{ color: '#1E1E1E' }}
          >
            {occasion.name}
          </h3>
          <span className="text-[11px] text-stone-400 font-medium tracking-wider uppercase mt-0.5">
            VIEW COLLECTION
          </span>
        </div>

        <span className="editorial-card-accent-bar" />
      </Link>
    );
  };

  // Taller, Editorial Category Card Component (Reference: Gargian Layout)
  const EditorialCategoryCard = ({ category }) => {
    const isSelected = activeCategory === category.slug || String(activeCategory) === String(category.id);
    const [imgFailed, setImgFailed] = useState(false);
    const categoryTarget = `/category/${category.slug || category.id}`;

    return (
      <Link
        to={categoryTarget}
        onClick={() => {
          if (onSelectCategory) {
            onSelectCategory(category.slug || category.id);
          }
        }}
        className={`editorial-category-card group no-underline text-inherit ${isSelected ? 'selected ring-2 ring-[#8B2635]/60' : ''}`}
      >
        <div className="editorial-card-image-wrap">
          {category.image_url && !imgFailed ? (
            <img
              src={resolveImageUrl(category.image_url)}
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
                background: 'linear-gradient(145deg, #F4FAF5 0%, #DBE6DC 100%)'
              }}
            >
              <div
                className="absolute inset-3 rounded-lg border pointer-events-none"
                style={{ borderColor: 'rgba(27, 122, 67, 0.25)' }}
              />
              <div
                className="absolute inset-4 rounded-md border pointer-events-none"
                style={{ borderColor: 'rgba(229, 168, 35, 0.25)' }}
              />

              <span
                className="text-[10px] uppercase font-bold tracking-widest pt-2 z-10"
                style={{ color: '#C59D5F' }}
              >
                Signature Collection
              </span>

              <div className="my-auto flex flex-col items-center z-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-serif text-xl font-bold tracking-widest shadow-xs transition-transform duration-500 group-hover:scale-110"
                  style={{
                    background: '#FFFFFF',
                    color: '#C62828',
                    border: '1.5px solid rgba(27, 122, 67, 0.35)'
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
                style={{ color: '#8B2635' }}
              >
                Explore Collection
              </span>
            </div>
          )}

          {category.product_count !== undefined && category.product_count > 0 && (
            <span
              className="absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md"
              style={{ background: 'rgba(30, 30, 30, 0.78)' }}
            >
              {category.product_count} Gifts
            </span>
          )}
        </div>

        <div className="pt-3.5 pb-1 px-1 text-center flex flex-col items-center justify-center">
          <h3
            className="editorial-category-title font-serif text-[1.05rem] font-semibold tracking-wide capitalize transition-colors duration-250 leading-snug line-clamp-1"
            style={{
              color: isSelected ? '#8B2635' : '#1E1E1E'
            }}
          >
            {category.name}
          </h3>
          <span className="text-[11px] text-stone-400 font-medium tracking-wider uppercase mt-0.5">
            View Collection
          </span>
        </div>

        <span className="editorial-card-accent-bar" />
      </Link>
    );
  };

  return (
    <div className="w-full">
      {shopByCategories.length > 0 && (
        <section
          id="shop-by-category-section"
          className="w-full py-12"
          style={{
            backgroundColor: '#E4EDE5',
            borderBottom: '1px solid #BACBBD'
          }}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-5">
              <span className="text-[11px] font-bold tracking-widest uppercase block mb-1" style={{ color: '#8B2635' }}>
                Curated Hampers
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-950 tracking-tight">
                Shop by Category
              </h2>
            </div>

            <div className="relative group/category-carousel">
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

              <div
                ref={categoryScrollRef}
                onScroll={handleCategoryScroll}
                className="category-scroll-track"
              >
                {shopByCategories.map((category) => (
                  <EditorialCategoryCard key={category.id} category={category} />
                ))}

                <Link
                  to="/category"
                  className="editorial-category-card group no-underline text-inherit"
                >
                  <div className="editorial-card-image-wrap flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br from-[#E6F0E8] via-[#DAE7DC] to-[#CCDDCF]">
                    <div className="w-16 h-16 rounded-full bg-white border border-[#C59D5F]/30 flex items-center justify-center text-[#8B2635] mb-3 shadow-sm group-hover:scale-110 group-hover:bg-[#8B2635] group-hover:text-white transition-all duration-300">
                      <Grid className="w-7 h-7" />
                    </div>
                    <span className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#8B2635] transition-colors">
                      View All
                    </span>
                    <span className="text-xs text-stone-500 mt-1">
                      Explore All Categories
                    </span>
                    <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8B2635] text-white text-xs font-semibold shadow-xs group-hover:bg-[#C59D5F] transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="pt-3.5 pb-1 px-1 text-center flex flex-col items-center justify-center">
                    <h3 className="editorial-category-title font-serif text-[1.05rem] font-semibold tracking-wide capitalize transition-colors duration-250 leading-snug line-clamp-1 text-stone-900">
                      All Categories
                    </h3>
                    <span className="text-[11px] text-[#8B2635] font-bold tracking-wider uppercase mt-0.5 group-hover:underline">
                      See Everything →
                    </span>
                  </div>

                  <span className="editorial-card-accent-bar" />
                </Link>
              </div>

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
                        backgroundColor: activeCategoryDot === idx ? '#8B2635' : '#BACBBD'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {sortedOccasions.length > 0 && (
        <section
          id="shop-by-occasion-section"
          className="w-full py-12"
          style={{
            backgroundColor: '#E4EDE5',
            borderBottom: '1px solid #BACBBD'
          }}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-5">
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase block mb-1" style={{ color: '#C59D5F' }}>
                  Festivals & Milestones
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-950 tracking-tight">
                  Shop by Occasion
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll(occasionScrollRef, 'left')}
                  className="w-9 h-9 rounded-full border border-[#BACBBD] bg-white hover:bg-[#C4D9C8] hover:text-[#8B2635] text-gray-700 flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95 disabled:opacity-40"
                  disabled={!canScrollOccasionLeft}
                  aria-label="Scroll occasions left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll(occasionScrollRef, 'right')}
                  className="w-9 h-9 rounded-full border border-[#BACBBD] bg-white hover:bg-[#C4D9C8] hover:text-[#8B2635] text-gray-700 flex items-center justify-center transition shadow-xs cursor-pointer active:scale-95 disabled:opacity-40"
                  disabled={!canScrollOccasionRight}
                  aria-label="Scroll occasions right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative group/occasion-carousel">
              {canScrollOccasionLeft && (
                <button
                  type="button"
                  onClick={() => scroll(occasionScrollRef, 'left')}
                  className="category-floating-arrow -left-3 sm:-left-4 lg:-left-5"
                  aria-label="Previous occasions"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <div
                ref={occasionScrollRef}
                onScroll={handleOccasionScroll}
                className="category-scroll-track"
              >
                {sortedOccasions.map((occasion) => (
                  <EditorialOccasionCard key={occasion.id} occasion={occasion} />
                ))}

                <Link
                  to="/occasion"
                  className="editorial-category-card group no-underline text-inherit"
                >
                  <div className="editorial-card-image-wrap flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br from-[#E6F0E8] via-[#DAE7DC] to-[#CCDDCF]">
                    <div className="w-16 h-16 rounded-full bg-white border border-[#C59D5F]/25 flex items-center justify-center text-[#C59D5F] mb-3 shadow-sm group-hover:scale-110 group-hover:bg-[#C59D5F] group-hover:text-white transition-all duration-300">
                      <CalendarHeart className="w-7 h-7" />
                    </div>
                    <span className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#C59D5F] transition-colors">
                      View All
                    </span>
                    <span className="text-xs text-stone-500 mt-1">
                      Explore All Occasions
                    </span>
                    <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C59D5F] text-white text-xs font-semibold shadow-xs group-hover:bg-[#8B2635] transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="pt-3.5 pb-1 px-1 text-center flex flex-col items-center justify-center">
                    <h3 className="editorial-category-title font-serif text-[1.05rem] font-semibold tracking-wide capitalize transition-colors duration-250 leading-snug line-clamp-1 text-stone-900">
                      All Occasions
                    </h3>
                    <span className="text-[11px] text-[#C59D5F] font-bold tracking-wider uppercase mt-0.5 group-hover:underline">
                      See Everything →
                    </span>
                  </div>

                  <span className="editorial-card-accent-bar" style={{ background: '#C59D5F' }} />
                </Link>
              </div>

              {canScrollOccasionRight && (
                <button
                  type="button"
                  onClick={() => scroll(occasionScrollRef, 'right')}
                  className="category-floating-arrow -right-3 sm:-right-4 lg:-right-5"
                  aria-label="Next occasions"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

