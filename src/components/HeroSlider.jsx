import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';
import resolveImageUrl from '../utils/image';
import { getCachedData, setCachedData, CACHE_KEYS } from '../utils/cache';

const FALLBACK_SLIDES = [
  {
    id: 1,
    image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2070&auto=format&fit=crop',
    tag_text: 'THE ART OF LUXURY GIFTING',
    heading: 'Curated Hampers For Every Celebration',
    subtext: 'Discover exquisite gift hampers crafted with artisanal treats, fine confectionery, and memorable keepsakes.',
    button_text: 'GIFT NOW',
    button_link: '#shop-now',
  },
  {
    id: 2,
    image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop',
    tag_text: 'CELEBRATE SPECIAL MILESTONES',
    heading: 'Thoughtful Presents, Unforgettable Smiles',
    subtext: 'Handcrafted with warmth and presented in signature designer packaging delivered directly to their doorstep.',
    button_text: 'UNWRAP JOY',
    button_link: '#shop-now',
  },
  {
    id: 3,
    image_url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop',
    tag_text: 'CORPORATE & BESPOKE GIFTING',
    heading: 'Elevate Business Relationships with Signature Gifts',
    subtext: 'Custom-branded boxes, premium gourmet selections, and seamless multi-address Pan-India shipping.',
    button_text: 'BUILD YOUR HAMPER',
    button_link: '#build-hamper-section',
  },
];

const HeroSlider = ({ onExploreClick, onBuildCustomClick }) => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState(() => {
    const cached = getCachedData(CACHE_KEYS.HERO_SLIDES, null);
    if (Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
    return FALLBACK_SLIDES;
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch dynamic hero slides from API (Stale-While-Revalidate)
  useEffect(() => {
    let isMounted = true;
    async function loadSlides() {
      try {
        const res = await apiService.getHeroSlides();
        if (res?.success && Array.isArray(res.slides) && res.slides.length > 0 && isMounted) {
          setSlides(res.slides);
          setCachedData(CACHE_KEYS.HERO_SLIDES, res.slides);
        }
      } catch (err) {
        console.error('Failed to load hero slides for homepage slider:', err);
      }
    }

    loadSlides();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
  };

  const handleButtonClick = (slide) => {
    const link = slide.button_link || '#shop-now';

    if (link === '#build-hamper-section' || link.includes('build')) {
      if (onBuildCustomClick) {
        onBuildCustomClick();
        return;
      }
      const el = document.getElementById('build-hamper-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    if (link === '#shop-now' || link === '#shop-by-category-section') {
      if (onExploreClick) {
        onExploreClick();
        return;
      }
      const el = document.getElementById('shop-by-category-section') || document.querySelector('.product-grid-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // React router navigation for internal routes like /category or /collections/...
    if (link.startsWith('/')) {
      navigate(link);
    } else if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      if (onExploreClick) onExploreClick();
    }
  };

  return (
    <div className="relative w-full h-[430px] sm:h-[470px] md:h-[500px] lg:h-[520px] xl:h-[535px] overflow-hidden bg-[#0A101D]">
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        const resolvedImage = resolveImageUrl(slide.image_url);

        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Ken Burns Motion and Dark Gradient Overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                key={`img-${slide.id}-${isActive}`}
                src={resolvedImage}
                alt={slide.heading}
                className={`w-full h-full object-cover object-center ${
                  isActive ? 'hero-ken-burns' : 'scale-100'
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
                onError={(e) => {
                  e.currentTarget.src = '/images/gift_logo.jpeg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
            </div>

            {/* Slide Content with Staggered Entrance */}
            <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12 flex flex-col justify-center items-start text-white">
              {isActive && (
                <div key={`text-${slide.id}-${currentSlide}`} className="max-w-2xl space-y-3 sm:space-y-3.5 md:space-y-4">
                  {slide.tag_text && (
                    <span className="hero-stagger-1 inline-block text-xs md:text-sm font-semibold tracking-widest text-[#E5A823] uppercase">
                      {slide.tag_text}
                    </span>
                  )}

                  <h1 className="hero-stagger-2 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-bold leading-tight tracking-tight text-white">
                    {slide.heading}
                  </h1>

                  {slide.subtext && (
                    <p className="hero-stagger-3 text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed max-w-xl font-light">
                      {slide.subtext}
                    </p>
                  )}

                  <div className="hero-stagger-4 pt-2 sm:pt-3">
                    <button
                      onClick={() => handleButtonClick(slide)}
                      className="hero-luxury-cta inline-flex items-center justify-center px-8 sm:px-9 py-3.5 rounded-full font-bold text-xs md:text-sm tracking-widest uppercase cursor-pointer border-none"
                    >
                      {slide.button_text || 'GIFT NOW'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows with Frosted Glass Effects (shown only when multiple slides) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="hero-frosted-arrow absolute left-3 sm:left-5 top-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="hero-frosted-arrow absolute right-3 sm:right-5 top-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator with Animated Active Pill */}
          <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 transition-all duration-500 rounded-full cursor-pointer border-none p-0 ${
                  idx === currentSlide
                    ? 'w-10 bg-gradient-to-r from-[#C62828] to-[#E5A823] shadow-md shadow-red-900/40'
                    : 'w-2.5 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlider;
