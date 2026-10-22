import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DiwaliHampersPage from './pages/collections/diwali-hampers';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import ProductModal from './components/ProductModal';

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

  const handleCheckout = (total) => {
    alert(`Order placed! Total: ₹${total.toLocaleString('en-IN')}. Redirecting to secure checkout...`);
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
        {/* Global Toast */}
        {toastMessage && (
          <div
            style={{
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
            }}
          >
            {toastMessage}
          </div>
        )}

        {/* Application Routes */}
        <Routes>
          {/* 1. Dedicated Home Page Route (Original Landing Sections Only) */}
          <Route
            path="/"
            element={
              <HomePage
                cart={cart}
                wishlist={wishlist}
                onAddToCart={handleAddToCart}
                onUpdateQty={handleUpdateQty}
                onRemoveFromCart={handleRemoveFromCart}
                onToggleWishlist={handleToggleWishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenWishlist={() => setIsWishlistOpen(true)}
                onQuickView={(product) => setQuickViewProduct(product)}
              />
            }
          />

          {/* 2. Dedicated Diwali Gift Hampers Collection Page */}
          <Route
            path="/collections/diwali-hampers"
            element={
              <DiwaliHampersPage
                cart={cart}
                wishlist={wishlist}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenWishlist={() => setIsWishlistOpen(true)}
                onQuickView={(product) => setQuickViewProduct(product)}
              />
            }
          />

          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <HomePage
                cart={cart}
                wishlist={wishlist}
                onAddToCart={handleAddToCart}
                onUpdateQty={handleUpdateQty}
                onRemoveFromCart={handleRemoveFromCart}
                onToggleWishlist={handleToggleWishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenWishlist={() => setIsWishlistOpen(true)}
                onQuickView={(product) => setQuickViewProduct(product)}
              />
            }
          />
        </Routes>

        {/* Shared Drawers & Modals */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />

        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          wishlistItems={wishlist}
          onAddToCart={handleAddToCart}
          onRemoveFromWishlist={handleRemoveFromWishlist}
        />

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
    </Router>
  );
}
