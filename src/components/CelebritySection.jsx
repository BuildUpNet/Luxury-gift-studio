import React from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { CELEBRITIES } from '../data/giftStudioData';

export default function CelebritySection({ onSelectDesigner }) {
  return (
    <section style={{
      background: '#faf9f6',
      borderTop: '1px solid #ebebeb',
      borderBottom: '1px solid #ebebeb',
      padding: '50px 24px 60px'
    }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.78rem', color: '#a11414', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Exclusive Collaborations
          </span>
          <h2 className="font-heading" style={{ fontSize: '2rem', color: '#020919', fontWeight: 600, marginTop: '6px' }}>
            The Celebrity & Artist Collection
          </h2>
          <p style={{ color: '#666', maxWidth: '600px', margin: '8px auto 0', fontSize: '0.9rem' }}>
            Exclusive designer curations by Masaba Gupta, Anamika Khanna & master artist Paresh Maity.
          </p>
        </div>

        {/* Celebrity Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {CELEBRITIES.map((celeb, idx) => (
            <div
              key={idx}
              className="card-clean"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <div style={{ height: '240px', position: 'relative', overflow: 'hidden', background: '#eaeaea' }}>
                <img
                  src={celeb.image}
                  alt={celeb.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80";
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 80%)',
                  pointerEvents: 'none'
                }} />
                <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px', color: '#fff', pointerEvents: 'none' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.9, color: '#f3c06b', fontWeight: 700 }}>
                    {celeb.role}
                  </span>
                  <h3 className="font-heading" style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 600 }}>
                    {celeb.name}
                  </h3>
                </div>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <Quote size={18} color="#a11414" style={{ flexShrink: 0, opacity: 0.8 }} />
                  <p style={{ fontSize: '0.86rem', color: '#444', fontStyle: 'italic', lineHeight: 1.55 }}>
                    "{celeb.quote}"
                  </p>
                </div>

                <div style={{
                  marginTop: 'auto',
                  paddingTop: '14px',
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Signature Hamper</span>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#020919' }}>
                      {celeb.highlightHamper}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectDesigner(celeb.name)}
                    className="btn-outline"
                    style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                  >
                    <span>View Hampers</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
