import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from database via centralized apiService
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getProducts();

      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('ProductContext: Error loading products from API:', err.message);
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = async (newProduct) => {
    const stockQty = Number(newProduct.stock ?? 10);
    const priceNumeric = Number(newProduct.priceNum || 0);

    const payload = {
      title: newProduct.title.trim(),
      category: newProduct.category || 'Home Decor',
      category_id: newProduct.category_id || null,
      priceNum: priceNumeric,
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

    const data = await apiService.createProduct(payload);

    if (data.success && data.product) {
      setProducts((prev) => [data.product, ...prev]);
      return { success: true, product: data.product };
    }

    throw new Error(data.message || 'Failed to add product');
  };

  const updateProduct = async (id, updatedFields) => {
    const payload = {
      ...updatedFields,
      priceNum: updatedFields.priceNum !== undefined ? Number(updatedFields.priceNum) : undefined,
      originalPrice: updatedFields.originalPrice ? Number(String(updatedFields.originalPrice).replace(/[^0-9]/g, '')) : null,
      stock: updatedFields.stock !== undefined ? Number(updatedFields.stock) : undefined
    };

    const data = await apiService.updateProduct(id, payload);

    if (data.success && data.product) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data.product } : p))
      );
      return { success: true, product: data.product };
    }

    throw new Error(data.message || 'Failed to update product');
  };

  const deleteProduct = async (id) => {
    const data = await apiService.deleteProduct(id);

    if (data.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    }

    throw new Error(data.message || 'Failed to delete product');
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
