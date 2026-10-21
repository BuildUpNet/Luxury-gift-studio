import React from 'react';
import { ArrowRight, Gift, Clock, Truck, ShieldCheck, Sparkles } from 'lucide-react';

export default function HeroBanner({ onExploreClick, onBuildCustomClick }) {
  return (
    <section style={{
      background: '#faf9f6',
      borderBottom: '1px solid var(--color-border)',
      padding: '40px 24px 30px'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'center',
        gap: '40px'
      }}>
        {/* Left Column: Headlines */}
        <div>
          <span style={{
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 700,
            color: '#a11414',
            display: 'block',
            marginBottom: '8px'
          }}>
            India's Premier Luxury Hampers
          </span>

          <h1 className="font-heading" style={{
            fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
            fontWeight: 600,
            lineHeight: 1.2,
            color: '#020919',
            marginBottom: '16px'
          }}>
            Buy Premium Gifts & <br />
            Luxury Hampers Online
          </h1>

          <p style={{
            fontSize: '1rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '28px',
            maxWidth: '500px',
            lineHeight: 1.6
          }}>
            Discover hand-curated gift hampers, designer artist editions by Masaba & Anamika Khanna, and artisanal gourmet treats for every cherished moment.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={onExploreClick}
              className="btn-primary"
            >
              <span>Explore Hampers</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onBuildCustomClick}
              className="btn-outline"
            >
              <Gift size={16} />
              <span>Create Your Own Hamper</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Visual Banner */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          background: '#fff'
        }}>
          <img
            src="https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna.png?v=1768808499&width=800"
            alt="The Select by Anamika Khanna"
            style={{ width: '100%', height: '360px', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #eaeaea',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#a11414', fontWeight: 700, textTransform: 'uppercase' }}>
                Designer Edition
              </span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#020919' }}>
                The Select by Anamika Khanna
              </h4>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#020919' }}>
                ₹13,999
              </span>
              <span className="badge-sale" style={{ display: 'block', marginTop: '2px', fontSize: '0.65rem' }}>
                15% OFF
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Trust USPs */}
      <div style={{
        maxWidth: '1360px',
        margin: '36px auto 0',
        paddingTop: '24px',
        borderTop: '1px solid #e8e8e8',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={24} color="#020919" />
          <div>
            <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#020919' }}>Same-Day Delivery</h5>
            <p style={{ fontSize: '0.75rem', color: '#777' }}>Order by 4 PM in Metro Cities</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Truck size={24} color="#020919" />
          <div>
            <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#020919' }}>Pan-India Express</h5>
            <p style={{ fontSize: '0.75rem', color: '#777' }}>100% Insured Safe Transit</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Gift size={24} color="#020919" />
          <div>
            <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#020919' }}>Artisanal Packaging</h5>
            <p style={{ fontSize: '0.75rem', color: '#777' }}>Wax Seals & Satin Ribbons</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={24} color="#020919" />
          <div>
            <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#020919' }}>100% Curated Quality</h5>
            <p style={{ fontSize: '0.75rem', color: '#777' }}>Fresh Gourmet Delicacies Only</p>
          </div>
        </div>
      </div>
    </section>
  );
}
