import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductGrid from './components/ProductGrid';
import CelebritySection from './components/CelebritySection';
import HamperBuilder from './components/HamperBuilder';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import ProductModal from './components/ProductModal';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

import { PRODUCTS, ORIGINAL_NAV_LINKS } from './data/giftStudioData';

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('giftstudio_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('giftstudio_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('giftstudio_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('giftstudio_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    showToast(`Added "${product.title}" to your bag`);
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from Wishlist`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Added to Wishlist ❤️`);
        return [...prev, product];
      }
    });
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

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

  const handleCheckout = (total) => {
    alert(`Order placed! Total: ₹${total.toLocaleString('en-IN')}. Redirecting to secure checkout...`);
    setCart([]);
    setIsCartOpen(false);
  };

  // Filter products based on search & category
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
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
    return navItem ? navItem.label : "All Hampers";
  }, [activeCategory]);

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#020919',
          color: '#ffffff',
          padding: '10px 22px',
          borderRadius: '4px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          zIndex: 200,
          fontWeight: 600,
          fontSize: '0.85rem'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Navbar with authentic logo and navigation */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={handleCategorySelect}
        activeCategory={activeCategory}
      />

      {/* Hero Banner */}
      <HeroBanner
        onExploreClick={() => {
          setActiveCategory('all');
          window.scrollTo({ top: 580, behavior: 'smooth' });
        }}
        onBuildCustomClick={scrollToHamperBuilder}
      />

      {/* Main Products Grid */}
      <ProductGrid
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        wishlistIds={wishlist.map((p) => p.id)}
        onQuickView={(product) => setQuickViewProduct(product)}
        activeCategoryName={activeCategoryName}
        searchQuery={searchQuery}
        onClearFilters={() => {
          setActiveCategory('all');
          setSearchQuery('');
        }}
      />

      {/* Celebrity Designers Collection */}
      <CelebritySection
        onSelectDesigner={handleDesignerSelect}
      />

      {/* Create Your Own Hamper Studio */}
      <HamperBuilder
        onAddCustomHamperToCart={(customHamper) => {
          handleAddToCart(customHamper);
          setIsCartOpen(true);
        }}
      />

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer
        onSelectCategory={handleCategorySelect}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleRemoveFromWishlist}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlist.some((p) => p.id === quickViewProduct.id)}
        />
      )}
    </div>
  );
}
