import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Truck, ShieldCheck, Check } from 'lucide-react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80";

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) {
  const images = product?.images && product.images.length > 0 ? product.images : [product?.image || FALLBACK_IMAGE];
  const [selectedImg, setSelectedImg] = useState(images[0]);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      onAddToCart(product);
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      padding: '20px'
    }}>
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#ffffff',
        borderRadius: 'var(--radius-md)',
        padding: '30px',
        zIndex: 111,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
      }}>
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}
        >
          <X size={20} />
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          {/* Images */}
          <div>
            <div style={{
              width: '100%',
              height: '340px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              background: '#f8f8f8',
              border: '1px solid #eee',
              marginBottom: '10px'
            }}>
              <img
                src={selectedImg || FALLBACK_IMAGE}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: selectedImg === img ? '2px solid #020919' : '1px solid #ddd',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <span className="badge-curated">{product.category}</span>
              {product.badge && <span className="badge-sale">{product.badge}</span>}
            </div>

            <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#020919', marginBottom: '10px' }}>
              {product.title}
            </h2>

            {/* Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', color: 'var(--color-star)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="var(--color-star)" color="var(--color-star)" />
                ))}
              </div>
              <span style={{ fontWeight: 700, color: '#020919' }}>{product.rating}</span>
              <span style={{ color: '#777' }}>({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#020919' }}>
                {product.price}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: '1rem', color: '#888', textDecoration: 'line-through' }}>
                  {product.originalPrice}
                </span>
              )}
            </div>

            <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#444', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} color="#020919" />
                <span>Hand-tied silk ribbon with wax seal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} color="#020919" />
                <span>Same day delivery in metro cities (Order by 4 PM)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#020919" />
                <span>100% Quality & Freshness Guarantee</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', border: 'none', padding: '8px 12px', cursor: 'pointer' }}>-</button>
                <span style={{ padding: '0 8px', fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ background: 'none', border: 'none', padding: '8px 12px', cursor: 'pointer' }}>+</button>
              </div>

              <button onClick={handleAdd} className="btn-primary" style={{ flex: 1, padding: '12px' }}>
                <ShoppingBag size={16} />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className="btn-outline"
                style={{ padding: '11px 14px' }}
                title="Wishlist"
              >
                <Heart size={18} color={isWishlisted ? '#c1121f' : '#333'} fill={isWishlisted ? '#c1121f' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
