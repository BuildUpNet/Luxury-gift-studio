import React, { useState, useEffect } from 'react';
import { Sparkles, Crown, Package, Heart, Briefcase, Coffee, Wine, Gift } from 'lucide-react';

// Icon mapping for dynamic categories
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

// Fallback icons when database category doesn't have a mapped icon
const getIconComponent = (iconName) => {
  return iconMap[iconName] || Sparkles;
};

export default function CategoryTabs({ activeCategory, onSelectCategory, categories = [] }) {
  const [isLoading, setIsLoading] = useState(false);
  
  // If categories are passed as props, use them; otherwise show loading state
  const displayCategories = categories.length > 0 ? categories : [];
  const isEmpty = displayCategories.length === 0;

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
      {isEmpty ? (
        // Fallback: Show "All Hampers" tab when no categories loaded
        <button
          key="all"
          onClick={() => onSelectCategory('all')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            border: activeCategory === 'all' ? '1px solid var(--gold-primary)' : '1px solid var(--gold-border)',
            background: activeCategory === 'all' 
              ? 'var(--gold-gradient)' 
              : 'rgba(255, 255, 255, 0.03)',
            color: activeCategory === 'all' ? '#0b0c10' : 'var(--text-secondary)',
            fontWeight: activeCategory === 'all' ? 700 : 500,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all var(--transition-fast)',
            boxShadow: activeCategory === 'all' ? '0 4px 15px rgba(212, 175, 55, 0.3)' : 'none'
          }}
        >
          <Package size={16} color={activeCategory === 'all' ? '#0b0c10' : 'var(--gold-primary)'} />
          <span>All Hampers</span>
        </button>
      ) : (
        // Render "All Hampers" first, then dynamic categories
        <>
          <button
            key="all"
            onClick={() => onSelectCategory('all')}
            style={{
              padding: '10px 18px',
              borderRadius: 'var(--radius-full)',
              border: activeCategory === 'all' ? '1px solid var(--gold-primary)' : '1px solid var(--gold-border)',
              background: activeCategory === 'all' 
                ? 'var(--gold-gradient)' 
                : 'rgba(255, 255, 255, 0.03)',
              color: activeCategory === 'all' ? '#0b0c10' : 'var(--text-secondary)',
              fontWeight: activeCategory === 'all' ? 700 : 500,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)',
              boxShadow: activeCategory === 'all' ? '0 4px 15px rgba(212, 175, 55, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== 'all') {
                e.currentTarget.style.borderColor = 'var(--gold-border-bright)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== 'all') {
                e.currentTarget.style.borderColor = 'var(--gold-border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }
            }}
          >
            <Package size={16} color={activeCategory === 'all' ? '#0b0c10' : 'var(--gold-primary)'} />
            <span>All Hampers</span>
          </button>

          {/* Dynamic categories from database */}
          {displayCategories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            const isActive = activeCategory === category.slug || activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.slug || category.id)}
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
                <span>{category.name}</span>
                {category.product_count !== undefined && (
                  <span style={{
                    fontSize: '0.72rem',
                    opacity: 0.8,
                    background: isActive ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {category.product_count}
                  </span>
                )}
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}