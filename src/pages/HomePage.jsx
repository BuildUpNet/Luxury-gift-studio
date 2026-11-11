import React, { useState, useMemo, useEffect } from 'react';
import { API_URLS } from '../config/api';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import CategoryTabs from '../components/CategoryTabs';
import ProductGrid from '../components/ProductGrid';
import CelebritySection from '../components/CelebritySection';
import HamperBuilder from '../components/HamperBuilder';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import { useProducts } from '../context/ProductContext';
import { ORIGINAL_NAV_LINKS } from '../data/giftStudioData';

export default function HomePage({
  onQuickView
}) {
  const { products, isLoading: isLoadingProducts, error: productsError } = useProducts();
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

  // Filter products based on search & category
  const filteredProducts = useMemo(() => {
    let list = products && Array.isArray(products) ? products : [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== 'all') {
      // First check if it's a database category (by slug)
      const dbCategory = categories.find(cat => cat.slug === activeCategory);
      if (dbCategory) {
        list = list.filter((p) => p.category.toLowerCase() === dbCategory.name.toLowerCase());
      } else {
        // Fallback to original nav links for backward compatibility
        const navItem = ORIGINAL_NAV_LINKS.find((l) => l.id === activeCategory);
        if (navItem && !navItem.isBuilder) {
          list = list.filter((p) => p.category.toLowerCase() === navItem.label.toLowerCase());
        }
      }
    }

    return list;
  }, [products, searchQuery, activeCategory, categories]);

  const activeCategoryName = useMemo(() => {
    if (activeCategory === 'all') return 'All Hampers';
    
    const dbCategory = categories.find(cat => cat.slug === activeCategory);
    if (dbCategory) return dbCategory.name;
    
    const navItem = ORIGINAL_NAV_LINKS.find((l) => l.id === activeCategory);
    return navItem ? navItem.label : 'All Hampers';
  }, [activeCategory, categories]);

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

      {/* Category Tabs - Dynamic from Database */}
      {!isLoadingCategories && (
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
          categories={categories}
        />
      )}

      {/* Main Products Grid */}
      <ProductGrid
        products={filteredProducts}
        isLoading={isLoadingProducts}
        error={productsError}
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