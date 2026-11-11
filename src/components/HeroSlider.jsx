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
    <div className="relative w-full h-[540px] md:h-[620px] lg:h-[680px] overflow-hidden bg-[#0A101D]">
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
            {/* Background Image with Dark Gradient Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-10000 ease-out"
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: isActive ? 'scale(1)' : 'scale(1.05)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
            </div>

            {/* Slide Content */}
            <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-center items-start text-white">
              <div className="max-w-2xl space-y-4 md:space-y-6">
                <span className="inline-block text-xs md:text-sm font-semibold tracking-widest text-[#E5A823] uppercase">
                  {slide.subtitle}
                </span>

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
                  {slide.title}
                </h1>

                <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-xl font-light">
                  {slide.description}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => handleButtonClick(slide)}
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-[#C59D5F] hover:bg-[#b08b50] text-[#0A101D] font-bold text-xs md:text-sm tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition border border-white/20 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition border border-white/20 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer border-none ${
              idx === currentSlide ? 'w-8 bg-[#C59D5F]' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
