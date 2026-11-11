import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/giftStudioData';

export default function Testimonials() {
  return (
    <section style={{
      maxWidth: '1360px',
      margin: '40px auto 60px',
      padding: '0 24px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ fontSize: '0.78rem', color: '#a11414', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Words Of Acclaim
        </span>
        <h2 className="font-heading" style={{ fontSize: '2rem', color: '#020919', fontWeight: 600, marginTop: '6px' }}>
          Celebrated Voices Echo Their Admiration
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="card-clean"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[...Array(t.stars)].map((_, idx) => (
                  <Star key={idx} size={14} fill="var(--color-star)" color="var(--color-star)" />
                ))}
              </div>
              <Quote size={18} color="#999" />
            </div>

            <p style={{
              fontSize: '0.88rem',
              color: '#444',
              fontStyle: 'italic',
              lineHeight: 1.6,
              marginBottom: '16px',
              flex: 1
            }}>
              "{t.quote}"
            </p>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#020919' }}>
                {t.author}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#888' }}>
                {t.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
