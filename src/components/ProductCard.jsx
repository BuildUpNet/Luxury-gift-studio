import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80";

export default function ProductCard({
  product,
  onQuickView
}) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [product.image || FALLBACK_IMAGE];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="card-clean"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Badges */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        {product.badge ? (
          <span className="badge-sale" style={{ pointerEvents: 'auto' }}>
            {product.badge}
          </span>
        ) : (
          <span className="badge-curated" style={{ pointerEvents: 'auto' }}>
            Curated
          </span>
        )}
      </div>

      {/* Image Container with Slider */}
      <div
        onClick={() => onQuickView(product)}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%', // 1:1 Aspect Ratio
          background: '#f9f9f9',
          cursor: 'pointer',
          overflow: 'hidden'
        }}
      >
        <img
          src={images[currentImgIndex] || FALLBACK_IMAGE}
          alt={product.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        {/* Carousel arrows */}
        {images.length > 1 && isHovered && (
          <>
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.85)',
                color: '#1a1a1a',
                border: '1px solid #ddd',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 5
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.85)',
                color: '#1a1a1a',
                border: '1px solid #ddd',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 5
              }}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Quick View Button on Hover */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          right: '10px',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.25s ease',
          zIndex: 6
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: 'var(--radius-sm)',
              color: '#020919',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Eye size={15} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left' }}>
        {/* Rating Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', color: 'var(--color-star)' }}>
            <Star size={13} fill="var(--color-star)" color="var(--color-star)" />
          </div>
          <span style={{ fontWeight: 700, color: '#020919' }}>{product.rating}</span>
          <span style={{ color: '#888' }}>({product.reviews})</span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onQuickView(product)}
          style={{
            fontSize: '0.94rem',
            fontWeight: 600,
            color: '#020919',
            marginBottom: '10px',
            lineHeight: 1.35,
            cursor: 'pointer',
            minHeight: '2.5em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.title}
        </h3>

        {/* Pricing & Add to Cart Button */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '10px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#020919' }}>
                {product.price}
              </span>
              {product.originalPrice && product.originalPrice !== product.price && (
                <span style={{ fontSize: '0.82rem', color: '#999', textDecoration: 'line-through' }}>
                  {product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onQuickView(product)}
            style={{
              background: '#020919',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '7px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all var(--transition)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#020919'}
          >
            <Eye size={14} />
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );
}
