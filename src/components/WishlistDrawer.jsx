import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onAddToCart,
  onRemoveFromWishlist
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        height: '100%',
        background: '#ffffff',
        borderLeft: '1px solid #e0e0e0',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 101
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #ebebeb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} color="#c1121f" fill="#c1121f" />
            <h3 className="font-heading" style={{ fontSize: '1.2rem', color: '#020919', fontWeight: 600 }}>
              Your Wishlist
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#777', fontWeight: 600 }}>
              ({wishlistItems.length})
            </span>
          </div>

          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid #f0f0f0',
                  alignItems: 'center'
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80";
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.86rem', fontWeight: 600, color: '#020919', lineHeight: 1.3 }}>
                    {item.title}
                  </h4>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#020919', marginTop: '4px' }}>
                    {item.price}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    onClick={() => {
                      onAddToCart(item);
                      onRemoveFromWishlist(item.id);
                    }}
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.72rem' }}
                  >
                    <ShoppingBag size={12} />
                    <span>Move</span>
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(item.id)}
                    style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', textAlign: 'center' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <Heart size={36} color="#ddd" style={{ marginBottom: '10px' }} />
              <h4 className="font-heading" style={{ fontSize: '1.1rem', color: '#333' }}>Your wishlist is empty</h4>
              <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Save items you love by tapping the heart icon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
