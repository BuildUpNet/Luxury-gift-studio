import React from 'react';
import { Search, ShoppingBag, Heart, User, X, Phone } from 'lucide-react';
import { STORE_INFO, ORIGINAL_NAV_LINKS } from '../data/giftStudioData';

export default function Navbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  searchQuery,
  setSearchQuery,
  onSelectCategory,
  activeCategory
}) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#ffffff', borderBottom: '1px solid var(--color-border)' }}>
      {/* 1. Top Announcement Bar (Matching Original) */}
      <div style={{
        background: '#020919',
        color: '#ffffff',
        padding: '8px 16px',
        fontSize: '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <span>{STORE_INFO.announcement}</span>
        <a
          href={`https://wa.me/91${STORE_INFO.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#ffffff', textDecoration: 'underline', marginLeft: '6px' }}
        >
          Chat on WhatsApp
        </a>
      </div>

      {/* 2. Main Header Bar (Logo, Search & Actions) */}
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '16px 24px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Search Bar */}
        <div style={{ width: '280px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8f8f8',
            border: '1px solid #e2e2e2',
            borderRadius: '4px',
            padding: '6px 12px'
          }}>
            <Search size={16} color="#777" style={{ marginRight: '8px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gifts, hampers..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#1a1a1a',
                fontSize: '0.82rem',
                width: '100%',
                fontFamily: 'inherit'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <X size={14} color="#777" />
              </button>
            )}
          </div>
        </div>

        {/* Center Logo: Authentic SVG */}
        <div
          onClick={() => { onSelectCategory('all'); setSearchQuery(''); }}
          style={{ cursor: 'pointer', textAlign: 'center', flex: 1, display: 'flex', justifyContent: 'center' }}
        >
          <img
            src="/the-gift-studio-logo.svg"
            alt="The Gift Studio"
            style={{ height: '38px', maxWidth: '320px', objectFit: 'contain' }}
            onError={(e) => {
              // Fallback text if SVG fails
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Right Actions: Login, Wishlist, Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '280px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => alert("Login modal / customer authentication")}
            className="btn-icon"
            title="Log in"
          >
            <User size={20} />
          </button>

          <button
            onClick={onOpenWishlist}
            className="btn-icon"
            style={{ position: 'relative' }}
            title="Wishlist"
          >
            <Heart size={20} color={wishlistCount > 0 ? '#c1121f' : 'currentColor'} fill={wishlistCount > 0 ? '#c1121f' : 'none'} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: '#c1121f',
                color: '#fff',
                fontSize: '0.62rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag */}
          <button
            onClick={onOpenCart}
            style={{
              background: '#020919',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            <ShoppingBag size={16} />
            <span>Bag</span>
            <span style={{
              background: '#ffffff',
              color: '#020919',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '2px',
              marginLeft: '2px'
            }}>
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Bottom Navigation Links (Exact Original) */}
      <nav style={{
        borderTop: '1px solid #f0f0f0',
        background: '#ffffff',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          padding: '0 24px'
        }}>
          {ORIGINAL_NAV_LINKS.map((link) => {
            const isActive = activeCategory === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectCategory(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 2px',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#020919' : '#444444',
                  borderBottom: isActive ? '2px solid #020919' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#020919';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#444444';
                }}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
