import React, { useState, useEffect } from 'react';
import { API_URLS } from '../config/api';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import HomeCarousels from '../components/HomeCarousels';
import GiftingBannerSection from '../components/GiftingBannerSection';
import CelebritySection from '../components/CelebritySection';
import HamperBuilder from '../components/HamperBuilder';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const scrollToHamperBuilder = () => {
    const el = document.getElementById('build-hamper-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (id) => {
    if (id === 'create-own') {
      scrollToHamperBuilder();
    } else {
      setActiveCategory(id);
      setSearchQuery('');
    }
  };

  const handleDesignerSelect = (designerName) => {
    setSearchQuery(designerName);
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  // Fetch categories dynamically from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetch(API_URLS.getCategories());
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCategories(data.categories || []);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: '#FAF7F2' }}>
      {/* Shared Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={handleCategorySelect}
        activeCategory={activeCategory}
      />

      {/* Hero Slider */}
      <HeroSlider
        onExploreClick={() => {
          setActiveCategory('all');
          const el = document.getElementById('shop-by-category-section') || document.querySelector('.editorial-category-card');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onBuildCustomClick={scrollToHamperBuilder}
      />

      {/* Dynamic Luxury Carousels: Shop by Category & Shop by Occasion */}
      {!isLoadingCategories && (
        <HomeCarousels
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
        />
      )}

      {/* Dynamic Festive Promotional Banner & Custom Gifting Inquiry Section */}
      <GiftingBannerSection />

      {/* Celebrity Designers Collection */}
      <CelebritySection onSelectDesigner={handleDesignerSelect} />

      {/* Create Your Own Hamper Studio */}
      <HamperBuilder />

      {/* Testimonials */}
      <Testimonials />

      {/* Shared Footer */}
      <Footer onSelectCategory={handleCategorySelect} />
    </div>
  );
}