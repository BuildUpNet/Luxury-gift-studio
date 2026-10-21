import React from 'react';
import { Sparkles, Crown, Package, Heart, Briefcase, Coffee, Wine, Gift } from 'lucide-react';
import { CATEGORIES } from '../data/giftStudioData';

const iconMap = {
  Sparkles,
  Crown,
  Package,
  Heart,
  Briefcase,
  Coffee,
  Wine,
  Gift
};

export default function CategoryTabs({ activeCategory, onSelectCategory }) {
  return (
    <div style={{
      maxWidth: '1360px',
      margin: '0 auto',
      padding: '24px 24px 10px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
      {CATEGORIES.map((cat) => {
        const IconComponent = iconMap[cat.icon] || Sparkles;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-full)',
              border: isActive ? '1px solid var(--gold-primary)' : '1px solid var(--gold-border)',
              background: isActive 
                ? 'var(--gold-gradient)' 
                : 'rgba(255, 255, 255, 0.03)',
              color: isActive ? '#0b0c10' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)',
              boxShadow: isActive ? '0 4px 15px rgba(212, 175, 55, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'var(--gold-border-bright)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'var(--gold-border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }
            }}
          >
            <IconComponent size={16} color={isActive ? '#0b0c10' : 'var(--gold-primary)'} />
            <span>{cat.name}</span>
            {cat.count && (
              <span style={{
                fontSize: '0.72rem',
                opacity: 0.8,
                background: isActive ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)'
              }}>
                {cat.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
