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

  const current = slides[currentSlide];

  const handleButtonClick = (slide) => {
    if (slide.action === 'build' && onBuildCustomClick) {
      onBuildCustomClick();
      return;
    }
    if (slide.action === 'explore' && onExploreClick) {
      onExploreClick();
      return;
    }
    const target = document.querySelector(slide.link) || document.getElementById('shop-now') || document.querySelector('.product-grid-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[500px] sm:h-[560px] md:h-[620px] overflow-hidden bg-gray-900 select-none">
      {/* Background Image with smooth fade and subtle dark overlay */}
      <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
        <img
          src={current.image}
          alt={current.title}
          className="w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-black/45 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full max-w-5xl mx-auto px-6 sm:px-12 flex flex-col items-center justify-center text-center text-white z-10">
        
        {/* Subtitle */}
        <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-amber-300 uppercase mb-3">
          {current.subtitle}
        </p>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-wide text-white mb-4 max-w-3xl leading-tight">
          {current.title}
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-gray-200 font-light max-w-2xl mb-8 leading-relaxed">
          {current.description}
        </p>

        {/* Outlined Rectangular Button */}
        <div>
          <button
            onClick={() => handleButtonClick(current)}
            className="inline-block border-2 border-white hover:bg-white hover:text-gray-950 text-white text-xs sm:text-sm font-semibold tracking-[0.2em] px-8 py-3.5 uppercase transition-colors duration-300 bg-transparent cursor-pointer"
          >
            {current.buttonText}
          </button>
        </div>
      </div>

      {/* Left Arrow Button */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-sm transition-all duration-200 cursor-pointer border-none"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Right Arrow Button */}
      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-sm transition-all duration-200 cursor-pointer border-none"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2.5">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 h-2 rounded-full border-none cursor-pointer p-0 ${
              currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
