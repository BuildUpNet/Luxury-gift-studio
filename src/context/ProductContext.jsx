import React, { createContext, useContext, useState, useCallback } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/giftStudioData';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(false);
    setError(null);
  }, []);

  const addProduct = (newProduct) => {
    const stockQty = Number(newProduct.stock ?? 10);
    const priceNumeric = Number(newProduct.priceNum || 0);

    const product = {
      id: Date.now(),
      title: newProduct.title.trim(),
      category: newProduct.category || 'Home Decor',
      category_id: newProduct.category_id || null,
      priceNum: priceNumeric,
      price: `₹${priceNumeric.toLocaleString('en-IN')}`,
      originalPrice: newProduct.originalPrice ? Number(String(newProduct.originalPrice).replace(/[^0-9]/g, '')) : null,
      stock: stockQty,
      inStock: newProduct.inStock !== false,
      sameDayDelivery: newProduct.sameDayDelivery !== false,
      image: newProduct.image?.trim() || '',
      description: newProduct.description?.trim() || '',
      rating: newProduct.rating || 4.8,
      reviews: newProduct.reviews || 8,
      brand: newProduct.brand || 'THE GIFT STUDIO',
      discountBadge: newProduct.discountBadge || ''
    };

    setProducts((prev) => [product, ...prev]);
    return { success: true, product };
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    return { success: true };
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    return { success: true };
  };

  const refreshProducts = async () => {
    await loadProducts();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;
