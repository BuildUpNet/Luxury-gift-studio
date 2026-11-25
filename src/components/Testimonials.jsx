import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

const COPIES_COUNT = 5; // buffer copies for infinite smooth loop

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(() => {
    const cached = getCachedData(CACHE_KEYS.TESTIMONIALS, null);
    if (Array.isArray(cached) && cached.length > 0) return cached;
    return [];
  });
  const [totalCount, setTotalCount] = useState(0);
  const [hoveredTrackId, setHoveredTrackId] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const total = testimonials.length;
  const initialTrackIdx = total > 0 ? 2 * total : 0; // middle buffer copy
  const [trackIndex, setTrackIndex] = useState(initialTrackIdx);

  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const trackRef = useRef(null);

  // Resize listener for responsive card dimensions
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          if (res.testimonials.length > 0) {
            setTrackIndex(2 * res.testimonials.length);
          }
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

  // Continuous track items (repeated buffer for infinite seamless slide)
  const trackItems = useMemo(() => {
    if (total === 0) return [];
    const list = [];
    for (let c = 0; c < COPIES_COUNT; c++) {
      for (let i = 0; i < total; i++) {
        list.push({
          ...testimonials[i],
          trackId: `copy-${c}-item-${testimonials[i].id || i}`,
          origIndex: i
        });
      }
    }
    return list;
  }, [testimonials, total]);

  // Next Slide handler (smooth physical movement from right to left)
  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setIsTransitioning(true);
    setTrackIndex((prev) => prev + 1);
  }, [total]);

  // Prev Slide handler (smooth physical movement from left to right)
  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setIsTransitioning(true);
    setTrackIndex((prev) => prev - 1);
  }, [total]);

  // Jump to specific original index via dot indicators
  const goToOriginalIndex = useCallback((targetOrigIdx) => {
    if (total <= 1) return;
    const currentOrig = ((trackIndex % total) + total) % total;
    let diff = targetOrigIdx - currentOrig;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    setIsTransitioning(true);
    setTrackIndex((prev) => prev + diff);
  }, [total, trackIndex]);

  // Seamless infinite loop normalization on transition end
  const handleTransitionEnd = (e) => {
    if (e.target !== trackRef.current || total <= 1) return;

    const midCopy = Math.floor(COPIES_COUNT / 2);
    const origIdx = ((trackIndex % total) + total) % total;
    const normalizedIdx = midCopy * total + origIdx;

    // Reset silently to middle copy without animation if drifted towards buffer edges
    if (trackIndex < total || trackIndex >= (COPIES_COUNT - 1) * total) {
      setIsTransitioning(false);
      setTrackIndex(normalizedIdx);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  };

  // Timely Continuous Auto-play Slider (slides every 3.5 seconds, pauses when hovering any card)
  useEffect(() => {
    if (total <= 1) return;
    if (hoveredTrackId !== null) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTrackIndex((prev) => prev + 1);
    }, 3500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [total, hoveredTrackId]);

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

  const currentActiveOrigIdx = total > 0 ? ((trackIndex % total) + total) % total : 0;

  // Responsive card dimensions (overlapping design matching original Behance layout)
  const cardWidth = isMobile ? 300 : 350;
  const cardStep = isMobile ? 312 : 310; // 40px overlap on desktop

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
        
        {/* Header Section */}
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

        {/* Carousel Slider with Real Sliding Track */}
        <div
          className="relative max-w-5xl mx-auto px-2 sm:px-10"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* Navigation Controls: Left Arrow */}
          {total > 1 && (
            <button
              type="button"
              onClick={prevSlide}
              className="absolute -left-2 sm:-left-4 md:-left-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1C3024] border border-[#2D4737] hover:border-[#D4AF37] hover:bg-[#D4AF37] text-white hover:text-stone-950 shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Navigation Controls: Right Arrow */}
          {total > 1 && (
            <button
              type="button"
              onClick={nextSlide}
              className="absolute -right-2 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1C3024] border border-[#2D4737] hover:border-[#D4AF37] hover:bg-[#D4AF37] text-white hover:text-stone-950 shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Sliding Track Viewport: left: 50% ensures exact centering of active card */}
          <div className="pt-12 sm:pt-14 pb-8 overflow-hidden relative">
            <div
              ref={trackRef}
              onTransitionEnd={handleTransitionEnd}
              className="flex items-center"
              style={{
                position: 'relative',
                left: '50%',
                transform: `translateX(-${trackIndex * cardStep + cardWidth / 2}px)`,
                transition: isTransitioning ? 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
                willChange: 'transform'
              }}
            >
              {trackItems.map((item, i) => {
                const name = item.customer_name || 'Valued Client';
                const company = item.company_name;
                const role = item.designation || (item.occasion && item.city ? `${item.occasion} • ${item.city}` : item.occasion || item.city || 'Verified Buyer');
                const quote = item.review_text || '';
                const avatar = item.avatar_url ? resolveImageUrl(item.avatar_url) : null;
                const topPhotoUrl = item.product_image_url
                  ? resolveImageUrl(item.product_image_url)
                  : '/images/modi_logo_transparent.png';

                const dist = Math.abs(i - trackIndex);
                const isCenter = dist === 0;
                const isSideCard = isMobile ? false : dist === 1;
                const isVisibleSlot = isCenter || isSideCard;

                const isLeftCard = !isMobile && i === trackIndex - 1;
                const isRightCard = !isMobile && i === trackIndex + 1;

                // Adjust internal padding so the overlapping center card does not cover side card content
                let paddingClasses = 'p-6 sm:p-7';
                if (isLeftCard) {
                  paddingClasses = 'py-6 sm:py-7 pl-5 sm:pl-6 pr-12 sm:pr-14';
                } else if (isRightCard) {
                  paddingClasses = 'py-6 sm:py-7 pr-5 sm:pr-6 pl-12 sm:pl-14';
                }

                const isCardHovered = hoveredTrackId === item.trackId;
                // Center card stays elevated; hovering another card elevates that card
                const isElevated = isCardHovered || (isCenter && hoveredTrackId === null);
                const zIndexClass = isCardHovered ? 'z-30' : isCenter ? 'z-20' : 'z-10';

                return (
                  <div
                    key={item.trackId}
                    style={{
                      width: `${cardWidth}px`,
                      minWidth: `${cardWidth}px`,
                      maxWidth: `${cardWidth}px`,
                      marginRight: `${cardStep - cardWidth}px`,
                      opacity: isVisibleSlot ? 1 : 0,
                      pointerEvents: isVisibleSlot ? 'auto' : 'none',
                      transition: 'opacity 350ms ease'
                    }}
                    className="shrink-0 flex justify-center py-2"
                  >
                    <div
                      onClick={() => {
                        if (!isCenter && isVisibleSlot) {
                          setIsTransitioning(true);
                          setTrackIndex(i);
                        }
                      }}
                      onMouseEnter={() => {
                        if (isVisibleSlot) setHoveredTrackId(item.trackId);
                      }}
                      onMouseLeave={() => setHoveredTrackId(null)}
                      className={`
                        w-full
                        min-h-[350px] sm:min-h-[380px]
                        bg-white rounded-xl sm:rounded-2xl
                        ${paddingClasses}
                        flex flex-col justify-between
                        transition-all duration-500 ease-out
                        cursor-pointer relative
                        ${zIndexClass}
                        ${
                          isElevated
                            ? '-translate-y-6 sm:-translate-y-8 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] border-2 border-[#D4AF37] scale-100 sm:scale-105'
                            : 'translate-y-0 shadow-[0_8px_20px_rgba(0,0,0,0.18)] border border-stone-200/90 scale-95 opacity-90 hover:opacity-100'
                        }
                      `}
                    >
                      {/* Card Top: Featured Gift Photo from Backend or Modi Enterprises Logo */}
                      <div>
                        <div className="h-20 sm:h-24 flex items-center justify-center mb-3">
                          <img
                            src={topPhotoUrl}
                            alt={company || `${name} Gift Review`}
                            className="max-h-20 sm:max-h-24 max-w-[200px] sm:max-w-[220px] w-auto h-auto object-contain rounded-lg shadow-2xs transition-transform duration-300 hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = '/images/gift_logo.jpeg';
                            }}
                          />
                        </div>

                        {/* Opening Double Quote Mark */}
                        <div className="font-serif text-4xl sm:text-5xl font-black text-stone-800 leading-none mb-2 select-none">
                          “
                        </div>

                        {/* Review Body Text */}
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
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dot Indicators */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToOriginalIndex(idx)}
                  className="p-1 border-none bg-transparent cursor-pointer transition-all duration-300"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      height: '6px',
                      width: currentActiveOrigIdx === idx ? '24px' : '6px',
                      backgroundColor: currentActiveOrigIdx === idx ? '#D4AF37' : '#2D4737'
                    }}
                  />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Bottom Link to Full Reviews Page */}
        <div className="text-center mt-10">
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase text-stone-200 hover:text-white bg-[#1C3024] hover:bg-[#233D2E] border border-[#2D4737] hover:border-[#D4AF37] transition-all duration-300 no-underline shadow-xs hover:shadow-md hover:scale-102 group"
          >
            <span>Read All Client Stories & Reviews</span>
            {totalCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#223B2D] text-[#D4AF37] text-[11px] font-bold">
                {totalCount}
              </span>
            )}
            <ArrowRight className="w-4 h-4 text-[#D4AF37] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
