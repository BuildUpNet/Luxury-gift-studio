import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onQuickView,
  activeCategoryName,
  searchQuery,
  onClearFilters
}) {
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(16);

  // Sorting
  const sortedProducts = useMemo(() => {
    let list = [...products];

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.priceNum - a.priceNum);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, sortBy]);

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  return (
    <section id="shop-now" className="product-grid-section">
      {/* Top Header & Sort Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '24px',
        paddingBottom: '14px',
        borderBottom: '1px solid #ebebeb',
        width: '100%'
      }}>
        <div>
          <h2 className="font-heading" style={{ fontSize: '1.6rem', color: '#020919', fontWeight: 600 }}>
            {searchQuery ? `Search results for "${searchQuery}"` : activeCategoryName}
          </h2>
          <span style={{ fontSize: '0.82rem', color: '#777' }}>
            {products.length} Products
          </span>
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: '#666' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid #ccc',
              borderRadius: 'var(--radius-sm)',
              background: '#fff',
              color: '#020919',
              fontSize: '0.82rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {displayedProducts.length > 0 ? (
        <>
          <div className="product-grid">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                onQuickView={onQuickView}
              />
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < products.length && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                onClick={() => setVisibleCount((prev) => prev + 16)}
                className="btn-outline"
                style={{ padding: '10px 32px' }}
              >
                Load More Products ({products.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed #ddd', borderRadius: '8px' }}>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No products found</h3>
          <p style={{ color: '#777', fontSize: '0.88rem', marginBottom: '16px' }}>Try searching with different keywords.</p>
          <button onClick={onClearFilters} className="btn-primary">
            View All Hampers
          </button>
        </div>
      )}
    </section>
  );
}
