import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import ProductGrid from '../components/ProductGrid';
import CelebritySection from '../components/CelebritySection';
import HamperBuilder from '../components/HamperBuilder';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import { useProducts } from '../context/ProductContext';
import { PRODUCTS, ORIGINAL_NAV_LINKS } from '../data/giftStudioData';

export default function HomePage({
  onQuickView
}) {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter products based on search & category
  const filteredProducts = useMemo(() => {
    let list = products && products.length > 0 ? products : PRODUCTS;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== 'all') {
      const navItem = ORIGINAL_NAV_LINKS.find((l) => l.id === activeCategory);
      if (navItem && !navItem.isBuilder) {
        list = list.filter((p) => p.category.toLowerCase() === navItem.label.toLowerCase());
      }
    }

    return list;
  }, [searchQuery, activeCategory]);

  const activeCategoryName = useMemo(() => {
    const navItem = ORIGINAL_NAV_LINKS.find((l) => l.id === activeCategory);
    return navItem ? navItem.label : 'All Hampers';
  }, [activeCategory]);

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
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
          const el = document.getElementById('shop-now') || document.querySelector('.product-grid-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onBuildCustomClick={scrollToHamperBuilder}
      />

      {/* Main Products Grid (General hampers / regular catalog) */}
      <ProductGrid
        products={filteredProducts}
        onQuickView={onQuickView}
        activeCategoryName={activeCategoryName}
        searchQuery={searchQuery}
        onClearFilters={() => {
          setActiveCategory('all');
          setSearchQuery('');
        }}
      />

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
