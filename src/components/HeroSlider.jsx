import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlider = ({ onExploreClick, onBuildCustomClick }) => {
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2070&auto=format&fit=crop',
      subtitle: 'THE ART OF LUXURY GIFTING',
      title: 'Curated Hampers For Every Celebration',
      description: 'Discover exquisite gift hampers crafted with artisanal treats, fine confectionery, and memorable keepsakes.',
      buttonText: 'GIFT NOW',
      action: 'explore',
      link: '#shop-now',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop',
      subtitle: 'CELEBRATE SPECIAL MILESTONES',
      title: 'Thoughtful Presents, Unforgettable Smiles',
      description: 'Handcrafted with warmth and presented in signature designer packaging delivered directly to their doorstep.',
      buttonText: 'UNWRAP JOY',
      action: 'explore',
      link: '#shop-now',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop',
      subtitle: 'CORPORATE & BESPOKE GIFTING',
      title: 'Elevate Business Relationships with Signature Gifts',
      description: 'Custom-branded boxes, premium gourmet selections, and seamless multi-address Pan-India shipping.',
      buttonText: 'BUILD YOUR HAMPER',
      action: 'build',
      link: '#build-hamper-section',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleButtonClick = (slide) => {
    if (slide.action === 'build' && onBuildCustomClick) {
      onBuildCustomClick();
    } else if (onExploreClick) {
      onExploreClick();
    }
  };

  return (
    <div className="relative w-full h-[430px] sm:h-[470px] md:h-[500px] lg:h-[520px] xl:h-[535px] overflow-hidden bg-[#0A101D]">
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Ken Burns Motion and Dark Gradient Overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                key={`img-${slide.id}-${isActive}`}
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover object-center ${
                  isActive ? 'hero-ken-burns' : 'scale-100'
                }`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
            </div>

            {/* Slide Content with Staggered Entrance */}
            <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12 flex flex-col justify-center items-start text-white">
              {isActive && (
                <div key={`text-${slide.id}-${currentSlide}`} className="max-w-2xl space-y-3 sm:space-y-3.5 md:space-y-4">
                  <span className="hero-stagger-1 inline-block text-xs md:text-sm font-semibold tracking-widest text-[#E5A823] uppercase">
                    {slide.subtitle}
                  </span>

                  <h1 className="hero-stagger-2 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-bold leading-tight tracking-tight text-white">
                    {slide.title}
                  </h1>

                  <p className="hero-stagger-3 text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed max-w-xl font-light">
                    {slide.description}
                  </p>

                  <div className="hero-stagger-4 pt-2 sm:pt-3">
                    <button
                      onClick={() => handleButtonClick(slide)}
                      className="hero-luxury-cta inline-flex items-center justify-center px-8 sm:px-9 py-3.5 rounded-full font-bold text-xs md:text-sm tracking-widest uppercase"
                    >
                      {slide.buttonText}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows with Frosted Glass Effects */}
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
    </div>
  );
};

export default HeroSlider;
