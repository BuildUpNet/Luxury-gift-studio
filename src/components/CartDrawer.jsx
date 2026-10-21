import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onCheckout
}) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 3000;
  const subtotal = cart.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);
  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || cart.length === 0;
  const shippingFee = isFreeShipping ? 0 : 250;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'LUXE10') {
      setAppliedDiscount(10);
      setCouponMessage('Code LUXE10 applied: 10% Off!');
      try { confetti({ particleCount: 40, spread: 50 }); } catch (err) {}
    } else {
      setCouponMessage('Invalid code. Try LUXE10 for 10% off.');
    }
  };

  const handleCheckoutClick = () => {
    try {
      confetti({ particleCount: 80, spread: 70 });
    } catch (err) {}
    onCheckout(grandTotal);
  };

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

      {/* Drawer */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
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
            <ShoppingBag size={18} color="#020919" />
            <h3 className="font-heading" style={{ fontSize: '1.2rem', color: '#020919', fontWeight: 600 }}>
              Shopping Cart
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#777', fontWeight: 600 }}>
              ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </span>
          </div>

          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div style={{ padding: '12px 24px', background: '#fafafa', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
            <span style={{ color: '#444', fontWeight: 600 }}>
              {isFreeShipping ? "🎉 Free Pan-India Delivery Unlocked!" : `Add ₹${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString('en-IN')} for Free Delivery`}
            </span>
            <span style={{ color: '#777' }}>₹{FREE_SHIPPING_THRESHOLD}</span>
          </div>
          <div style={{ height: '5px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
              background: '#020919',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80";
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 600, color: '#020919', lineHeight: 1.3 }}>
                      {item.title}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: 0 }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '3px' }}>
                      <button onClick={() => onUpdateQty(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>
                        <Minus size={11} />
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0 6px' }}>{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>
                        <Plus size={11} />
                      </button>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#020919' }}>
                      ₹{(item.priceNum * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <ShoppingBag size={40} color="#ccc" style={{ marginBottom: '12px' }} />
              <h4 className="font-heading" style={{ fontSize: '1.1rem', color: '#333' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Discover our exquisite curated hampers.</p>
            </div>
          )}
        </div>

        {/* Footer Checkout (Matching Original line 11850!) */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #ebebeb', background: '#fafafa' }}>
            {/* Promo */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Discount code (try LUXE10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.82rem' }}
              />
              <button type="submit" className="btn-outline" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                Apply
              </button>
            </form>

            {couponMessage && (
              <div style={{ fontSize: '0.75rem', color: appliedDiscount > 0 ? '#10b981' : '#c1121f', marginBottom: '10px' }}>
                {couponMessage}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', color: '#555', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#020919' }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span style={{ color: isFreeShipping ? '#10b981' : '#020919', fontWeight: 600 }}>
                  {isFreeShipping ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e0e0e0', fontSize: '1.05rem', fontWeight: 800, color: '#020919' }}>
                <span>Estimated Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Original Checkout Button Structure */}
            <button
              onClick={handleCheckoutClick}
              style={{
                width: '100%',
                background: '#020919',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '14px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <div style={{ letterSpacing: '0.06em' }}>CHECKOUT</div>
              <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 400, opacity: 0.85, textTransform: 'none' }}>
                Order Now for fastest delivery
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
