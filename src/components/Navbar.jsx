import React from 'react';
import { Search, X } from 'lucide-react';
import { STORE_INFO, ORIGINAL_NAV_LINKS } from '../data/giftStudioData';

export default function Navbar({
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

        {/* Right Actions: Facebook & WhatsApp FA Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '280px', justifyContent: 'flex-end' }}>
          <a
            href="https://facebook.com/thegiftstudio"
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Facebook"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f8f8f8',
              border: '1px solid #e2e2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1877F2',
              textDecoration: 'none',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          >
            <i className="fa-brands fa-facebook-f"></i>
          </a>

          <a
            href={`https://wa.me/91${STORE_INFO.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f8f8f8',
              border: '1px solid #e2e2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#25D366',
              textDecoration: 'none',
              fontSize: '1.2rem',
              transition: 'all 0.2s'
            }}
          >
            <i className="fa-brands fa-whatsapp"></i>
          </a>
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
