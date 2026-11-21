import React, { useState, useEffect } from 'react';
import { API_URLS } from '../config/api';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import HomeCarousels from '../components/HomeCarousels';
import GiftingBannerSection from '../components/GiftingBannerSection';
import Testimonials from '../components/Testimonials';
import InfiniteHighlightsMarquee from '../components/InfiniteHighlightsMarquee';
import Footer from '../components/Footer';
import { getCachedData, setCachedData, CACHE_KEYS } from '../utils/cache';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(() => {
    const cached = getCachedData(CACHE_KEYS.CATEGORIES, null);
    return Array.isArray(cached) ? cached : [];
  });
  const [isLoadingCategories, setIsLoadingCategories] = useState(() => {
    const cached = getCachedData(CACHE_KEYS.CATEGORIES, null);
    return !Array.isArray(cached) || cached.length === 0;
  });

  const handleCategorySelect = (id) => {
    setActiveCategory(id);
    setSearchQuery('');
  };

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URLS.getCategories());
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && isMounted) {
            const fetchedCats = data.categories || [];
            setCategories(fetchedCats);
            setIsLoadingCategories(false);
            setCachedData(CACHE_KEYS.CATEGORIES, fetchedCats);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        if (isMounted) setIsLoadingCategories(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: '#E4EDE5' }}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={handleCategorySelect}
        activeCategory={activeCategory}
      />

      <HeroSlider
        onExploreClick={() => {
          setActiveCategory('all');
          const el = document.getElementById('shop-by-category-section') || document.querySelector('.editorial-category-card');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {isLoadingCategories && categories.length === 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-[460px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="w-28 h-4 bg-stone-200/80 rounded animate-pulse mb-2" />
              <div className="w-64 h-7 bg-stone-200/80 rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="w-9 h-9 rounded-full bg-stone-200/80 animate-pulse" />
              <div className="w-9 h-9 rounded-full bg-stone-200/80 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="w-full aspect-[3/4] bg-stone-200/70 rounded-xl animate-pulse" />
                <div className="w-3/4 h-4 bg-stone-200/80 rounded animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <HomeCarousels
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
        />
      )}

      <GiftingBannerSection />

      <Testimonials />

      <InfiniteHighlightsMarquee />

      <Footer onSelectCategory={handleCategorySelect} />
    </div>
  );
}