import React, { useState } from 'react';
import { Phone, Mail, Send } from 'lucide-react';
import { STORE_INFO } from '../data/giftStudioData';

export default function Footer({ onSelectCategory }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{
      background: '#f8f9fa',
      borderTop: '1px solid #e5e5e5',
      color: '#555555',
      paddingTop: '50px'
    }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 24px' }}>
        {/* Top Newsletter */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: 'var(--radius-md)',
          padding: '28px 32px',
          marginBottom: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div>
            <h3 className="font-heading" style={{ fontSize: '1.4rem', color: '#020919', marginBottom: '6px' }}>
              Subscribe to The Gift Studio
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#777' }}>
              Be the first to know about new celebrity curations, festive hampers, and exclusive offers.
            </p>
          </div>

          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
            {subscribed ? (
              <div style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>
                ✓ Thank you for subscribing!
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}>
                  <span>Subscribe</span>
                </button>
              </>
            )}
          </form>
        </div>

        {/* 4 Footer Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          {/* Logo & Info */}
          <div>
            <img
              src="/the-gift-studio-logo.svg"
              alt="The Gift Studio"
              style={{ height: '32px', marginBottom: '14px' }}
            />
            <p style={{ fontSize: '0.84rem', color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
              Buy premium gifts and luxury hampers online. Thoughtfully handcrafted celebrations delivered across India.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <a
                href={`https://wa.me/91${STORE_INFO.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#020919', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
              >
                <Phone size={14} color="#020919" />
                <span>WhatsApp: {STORE_INFO.phone}</span>
              </a>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#777' }}>
                <Mail size={14} />
                <span>{STORE_INFO.email}</span>
              </span>
            </div>
          </div>

          {/* Hampers */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#020919', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Curated Hampers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <li><span onClick={() => onSelectCategory('celebrity')} style={{ cursor: 'pointer', color: '#555' }}>Celebrity Hampers</span></li>
              <li><span onClick={() => onSelectCategory('diwali')} style={{ cursor: 'pointer', color: '#555' }}>Diwali Hampers</span></li>
              <li><span onClick={() => onSelectCategory('birthdays')} style={{ cursor: 'pointer', color: '#555' }}>Birthday Hampers</span></li>
              <li><span onClick={() => onSelectCategory('anniversary')} style={{ cursor: 'pointer', color: '#555' }}>Anniversary Hampers</span></li>
              <li><a href="#build-hamper-section" style={{ color: '#555', textDecoration: 'none' }}>Create Your Own Hamper</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#020919', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <li><span onClick={() => onSelectCategory('best-sellers')} style={{ cursor: 'pointer', color: '#555' }}>Best Sellers</span></li>
              <li><span onClick={() => onSelectCategory('corporate')} style={{ cursor: 'pointer', color: '#555' }}>Corporate Gifting</span></li>
              <li><span onClick={() => onSelectCategory('home-decor')} style={{ cursor: 'pointer', color: '#555' }}>Home Decor</span></li>
              <li><span onClick={() => onSelectCategory('last-minute')} style={{ cursor: 'pointer', color: '#555' }}>Same Day Delivery</span></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#020919', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Customer Care
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <li><span style={{ color: '#555' }}>Track Order</span></li>
              <li><span style={{ color: '#555' }}>Delivery Policy</span></li>
              <li><span style={{ color: '#555' }}>Returns & Refunds</span></li>
              <li><span style={{ color: '#555' }}>FAQs & Contact Us</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          padding: '20px 0',
          borderTop: '1px solid #e5e5e5',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.78rem',
          color: '#888'
        }}>
          <div>
            © {new Date().getFullYear()} {STORE_INFO.name}. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
