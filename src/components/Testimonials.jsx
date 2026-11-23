import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2
} from './FaIcons';
import { apiService } from '../services/api';
import resolveImageUrl from '../utils/image';
import { getCachedData, setCachedData, CACHE_KEYS } from '../utils/cache';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(() => {
    const cached = getCachedData(CACHE_KEYS.TESTIMONIALS, null);
    if (Array.isArray(cached) && cached.length > 0) return cached;
    return [];
  });
  const [totalCount, setTotalCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCardIdx, setHoveredCardIdx] = useState(null);

  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  // Load Featured Testimonials from Backend API
  useEffect(() => {
    let isMounted = true;
    async function loadTestimonials() {
      try {
        const res = await apiService.getTestimonials({ featured: 1 });
        if (res?.success && Array.isArray(res.testimonials) && isMounted) {
          setTestimonials(res.testimonials);
          if (res.total_count !== undefined) {
            setTotalCount(res.total_count);
          }
          setCachedData(CACHE_KEYS.TESTIMONIALS, res.testimonials);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      }
    }
    loadTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  const total = testimonials.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Timely Continuous Auto-play Slider (slides every 3.5 seconds, pauses ONLY when directly hovering a card)
  useEffect(() => {
    if (total <= 1) return;
    if (hoveredCardIdx !== null) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [total, hoveredCardIdx]);

  // Touch Swipe handlers for mobile devices
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  if (total === 0) return null;

  // Determine the 3 items to show centered: [left, center/active, right]
  const getVisibleCards = () => {
    if (total === 1) {
      return [{ item: testimonials[0], position: 'center', index: 0 }];
    }
    if (total === 2) {
      return [
        { item: testimonials[activeIndex], position: 'center', index: activeIndex },
        { item: testimonials[(activeIndex + 1) % 2], position: 'right', index: (activeIndex + 1) % 2 }
      ];
    }
    const leftIdx = (activeIndex - 1 + total) % total;
    const centerIdx = activeIndex;
    const rightIdx = (activeIndex + 1) % total;

    return [
      { item: testimonials[leftIdx], position: 'left', index: leftIdx },
      { item: testimonials[centerIdx], position: 'center', index: centerIdx },
      { item: testimonials[rightIdx], position: 'right', index: rightIdx }
    ];
  };

  const visibleCards = getVisibleCards();

  return (
    <section
      className="w-full py-14 sm:py-20 overflow-hidden relative select-none"
      style={{
        backgroundColor: '#15241B',
        borderTop: '1px solid #2D4737',
        borderBottom: '1px solid #2D4737'
      }}
    >
      {/* Luxury ambient glows */}
      <div className="absolute inset-0 bg-radial from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#182C20]/40 via-transparent to-[#111D16]/40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section matching Behance Reference Image */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C3024] border border-[#2D4737] text-xs font-semibold tracking-wider uppercase mb-3 shadow-xs">
            <span className="w-5 h-5 rounded-full bg-[#8B2635] text-white text-[10px] font-bold flex items-center justify-center">
              ★
            </span>
            <span className="text-[#D4AF37] tracking-widest font-bold text-[11px]">THEY TRUSTED US</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            We are very happy because we have happy customers.
          </h2>

          <p className="mt-2.5 text-stone-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Discover verified testimonials and reviews from clients and corporate leaders who celebrated with our bespoke hampers.
          </p>
        </div>

        {/* Carousel Slider with 3 Behance-style Zero-Gap Overlapping Cards */}
        <div
          className="relative max-w-5xl mx-auto px-2 sm:px-10"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* Navigation Controls: Left Arrow (Manual Slide) */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute -left-3 sm:-left-4 md:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1C3024] border border-[#2D4737] hover:border-[#D4AF37] hover:bg-[#D4AF37] text-white hover:text-stone-950 shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Navigation Controls: Right Arrow (Manual Slide) */}
          <button
            type="button"
            onClick={nextSlide}
            className="absolute -right-3 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1C3024] border border-[#2D4737] hover:border-[#D4AF37] hover:bg-[#D4AF37] text-white hover:text-stone-950 shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 3 Cards Container with Behance Overlap & Zero Unwanted Gap */}
          <div className="pt-8 pb-4 flex items-center justify-center -space-x-3 sm:-space-x-6 md:-space-x-8 relative">
            {visibleCards.map(({ item, position, index }) => {
              const name = item.customer_name || 'Valued Client';
              const company = item.company_name;
              const role = item.designation || (item.occasion && item.city ? `${item.occasion} • ${item.city}` : item.occasion || item.city || 'Verified Buyer');
              const quote = item.review_text || '';
              const avatar = item.avatar_url ? resolveImageUrl(item.avatar_url) : null;
              const brandLogo = item.product_image_url ? resolveImageUrl(item.product_image_url) : null;

              // Center card is naturally elevated (as in Behance); on hover, any card lifts up prominently
              const isCenter = position === 'center';
              const isCardHovered = hoveredCardIdx === index;
              const isElevated = isCardHovered || (isCenter && hoveredCardIdx === null);

              // Responsive visibility & z-index stacking (center card is always on top in Behance)
              const zIndexClass = isCardHovered ? 'z-30' : isCenter ? 'z-20' : 'z-10';

              return (
                <div
                  key={`${item.id}-${position}`}
                  onClick={() => {
                    if (!isCenter) setActiveIndex(index);
                  }}
                  onMouseEnter={() => setHoveredCardIdx(index)}
                  onMouseLeave={() => setHoveredCardIdx(null)}
                  className={`
                    w-full max-w-[310px] sm:max-w-[340px] md:max-w-[360px]
                    min-h-[300px] sm:min-h-[330px]
                    bg-white rounded-xl sm:rounded-2xl
                    p-6 sm:p-7
                    flex flex-col justify-between
                    transition-all duration-500 ease-out
                    cursor-pointer relative
                    ${zIndexClass}
                    ${
                      isElevated
                        ? '-translate-y-6 sm:-translate-y-8 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] border-2 border-[#D4AF37] scale-100 sm:scale-105'
                        : 'translate-y-0 shadow-[0_8px_20px_rgba(0,0,0,0.18)] border border-stone-200/90 scale-95 opacity-90 sm:opacity-95 hover:opacity-100'
                    }
                    ${position !== 'center' ? 'hidden md:flex' : 'flex'}
                  `}
                >
                  {/* Card Top: Brand / Company Logo or Stylized Name Centered (Matching Behance Walmart Style) */}
                  <div>
                    <div className="h-10 flex items-center justify-center mb-4">
                      {brandLogo ? (
                        <img
                          src={brandLogo}
                          alt={company || 'Brand'}
                          className="max-h-9 max-w-[150px] w-auto object-contain transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : company ? (
                        <div className="flex items-center justify-center gap-1.5 font-sans font-black text-lg text-[#0071DC] tracking-tight uppercase">
                          <span>{company}</span>
                          <span className="text-[#FFC220] text-lg">✦</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="font-serif font-black text-sm tracking-widest text-stone-900 uppercase">
                            THE GIFT STUDIO
                          </span>
                          <span className="text-[#D4AF37] text-xs">✦</span>
                        </div>
                      )}
                    </div>

                    {/* Opening Double Quote Mark */}
                    <div className="font-serif text-4xl sm:text-5xl font-black text-stone-800 leading-none mb-2 select-none">
                      “
                    </div>

                    {/* Review Body Text - Clean and Adapts Naturally to Content Length */}
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-normal text-left m-0 line-clamp-4">
                      {quote}
                    </p>
                  </div>

                  {/* Card Bottom: Customer Avatar, Name & Designation */}
                  <div className="pt-4 border-t border-stone-100 flex items-center gap-3 mt-5">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-stone-200 shrink-0 shadow-xs"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#182C20] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center font-serif font-bold text-xs shrink-0 shadow-xs">
                        {name ? name.substring(0, 2).toUpperCase() : 'TG'}
                      </div>
                    )}

                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate leading-snug m-0">
                          {name}
                        </h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Customer" />
                      </div>
                      <p className="text-[11px] text-stone-400 font-medium truncate mt-0.5 m-0">
                        {role}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dot Indicators (Manual Click to Jump) */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className="p-1 border-none bg-transparent cursor-pointer transition-all duration-300"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      height: '6px',
                      width: activeIndex === idx ? '24px' : '6px',
                      backgroundColor: activeIndex === idx ? '#D4AF37' : '#2D4737'
                    }}
                  />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Bottom Call To Action: "Show All Reviews ->" */}
        <div className="mt-8 sm:mt-10 text-center">
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 no-underline group"
            style={{ backgroundColor: '#8B2635' }}
          >
            <span>
              Show All Reviews {totalCount > 0 && `(${totalCount})`}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
