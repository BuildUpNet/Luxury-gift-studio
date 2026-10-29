import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/giftStudioData';

const SEED_HAMPERS = [
  {
    id: 'hamp-01',
    title: 'The Royal Sovereign Luxury Hamper Trunk',
    handle: 'the-royal-sovereign-luxury-hamper-trunk',
    brand: 'THE GIFT STUDIO',
    category: 'Hampers',
    price: '₹6,499',
    priceNum: 6499,
    originalPrice: '₹7,999',
    discountBadge: 'Sale 18%',
    rating: 4.9,
    reviews: 32,
    earliestDelivery: 'Today',
    sameDayDelivery: true,
    stock: 10,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Bespoke hand-crafted velvet hamper trunk loaded with artisanal chocolates, gourmet dry fruits, and aromatic soy candles.'
  },
  {
    id: 'hamp-02',
    title: 'The Select By Anamika Khanna',
    handle: 'the-select-by-anamika-khanna',
    brand: 'THE GIFT STUDIO',
    category: 'Hampers',
    price: '₹16,999',
    priceNum: 16999,
    originalPrice: '₹19,999',
    discountBadge: 'Sale 15%',
    rating: 4.9,
    reviews: 24,
    earliestDelivery: 'Today',
    sameDayDelivery: true,
    stock: 8,
    inStock: true,
    image: 'https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna.png?v=1768808499&width=533',
    hoverImage: 'https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna_1460095_2_1.jpg?v=1768808505&width=533',
    images: [
      'https://thegiftstudio.com/cdn/shop/files/The_Select_by_Anamika_Khanna.png?v=1768808499&width=533'
    ],
    description: 'Designer collaboration hamper featuring couture brass accessories, fine porcelain votives, and premium confectioneries.'
  },
  {
    id: 'hamp-03',
    title: 'Self Care Hamper by Masaba',
    handle: 'self-care-hamper-by-masaba',
    brand: 'THE GIFT STUDIO',
    category: 'Hampers',
    price: '₹12,599',
    priceNum: 12599,
    originalPrice: '₹14,000',
    discountBadge: 'Sale 10%',
    rating: 4.8,
    reviews: 18,
    earliestDelivery: 'Today',
    sameDayDelivery: true,
    stock: 12,
    inStock: true,
    image: 'https://thegiftstudio.com/cdn/shop/files/Self_Care_Hamper_by_Masaba_1468375_01.png?v=1784541553&width=800',
    hoverImage: 'https://thegiftstudio.com/cdn/shop/files/Self_Care_Hamper_by_Masaba_1468375_01.png?v=1784541553&width=800',
    images: [
      'https://thegiftstudio.com/cdn/shop/files/Self_Care_Hamper_by_Masaba_1468375_01.png?v=1784541553&width=800'
    ],
    description: 'Iconic self-care trunk filled with scented body elixirs, botanical bath bars, silk sleep masks, and gourmet treats.'
  },
  {
    id: 'hamp-04',
    title: 'Oppulent Gourmet Keepsake Box',
    handle: 'oppulent-gourmet-keepsake-box',
    brand: 'THE GIFT STUDIO',
    category: 'Hampers',
    price: '₹13,999',
    priceNum: 13999,
    originalPrice: '₹15,499',
    discountBadge: 'Sale 9%',
    rating: 4.7,
    reviews: 14,
    earliestDelivery: 'Today',
    sameDayDelivery: true,
    stock: 9,
    inStock: true,
    image: 'https://thegiftstudio.com/cdn/shop/files/Oppulent_Box_1451796_1.png?v=1758016118&width=533',
    hoverImage: 'https://thegiftstudio.com/cdn/shop/files/Oppulent_Box_1451796_2_1.png?v=1768807540&width=533',
    images: [
      'https://thegiftstudio.com/cdn/shop/files/Oppulent_Box_1451796_1.png?v=1758016118&width=533'
    ],
    description: 'A stately curation of imported cheeses, roasted truffled nuts, sparkling grape nectar, and keepsake wooden box.'
  },
  {
    id: 'hamp-05',
    title: 'Midnight Luxe Gift Chest',
    handle: 'midnight-luxe-gift-chest',
    brand: 'THE GIFT STUDIO',
    category: 'Hampers',
    price: '₹4,999',
    priceNum: 4999,
    originalPrice: '₹5,799',
    discountBadge: 'Sale 14%',
    rating: 4.8,
    reviews: 21,
    earliestDelivery: 'Today',
    sameDayDelivery: true,
    stock: 14,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Sleek matte black magnetic chest with gold-dusted chocolate pralines, organic honey, and brass candle snuffer.'
  },
  {
    id: 'hamp-06',
    title: 'Artful Indulgence by Paresh Maity',
    handle: 'artful-indulgence-by-paresh-maity',
    brand: 'THE GIFT STUDIO',
    category: 'Hampers',
    price: '₹5,999',
    priceNum: 5999,
    originalPrice: '₹6,999',
    discountBadge: 'Sale 14%',
    rating: 4.9,
    reviews: 19,
    earliestDelivery: 'Today',
    sameDayDelivery: true,
    stock: 11,
    inStock: true,
    image: 'https://thegiftstudio.com/cdn/shop/files/Artful_Indulgence_by_Paresh_Maity_1472899_01.jpg?v=1789036880&width=800',
    hoverImage: 'https://thegiftstudio.com/cdn/shop/files/Artful_Indulgence_by_Paresh_Maity_1472899_01.jpg?v=1789036880&width=800',
    images: [
      'https://thegiftstudio.com/cdn/shop/files/Artful_Indulgence_by_Paresh_Maity_1472899_01.jpg?v=1789036880&width=800'
    ],
    description: 'Canvas-textured artist collection box celebrating luxury sweets, Kashmiri saffron, and artisanal dry fruits.'
  }
];

export const INITIAL_PRODUCTS = [
  ...PRODUCTS.map((p) => ({
    ...p,
    stock: p.stock ?? 15,
    inStock: p.inStock !== false,
    sameDayDelivery: p.sameDayDelivery ?? true
  })),
  ...SEED_HAMPERS
];

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('tgs_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load tgs_products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('tgs_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save tgs_products to localStorage', e);
    }
  }, [products]);

  const addProduct = (newProduct) => {
    const stockQty = Number(newProduct.stock ?? 10);
    const priceNumeric = Number(newProduct.priceNum || 0);
    const item = {
      id: newProduct.id || `prod-${Date.now().toString().slice(-6)}`,
      brand: newProduct.brand || 'THE GIFT STUDIO',
      title: newProduct.title.trim(),
      category: newProduct.category || 'Home Decor',
      price: newProduct.price || `₹${priceNumeric.toLocaleString('en-IN')}`,
      priceNum: priceNumeric,
      originalPrice: newProduct.originalPrice
        ? (newProduct.originalPrice.startsWith('₹') ? newProduct.originalPrice : `₹${Number(newProduct.originalPrice).toLocaleString('en-IN')}`)
        : '',
      discountBadge: newProduct.discountBadge || '',
      stock: stockQty,
      inStock: stockQty > 0 && newProduct.inStock !== false,
      sameDayDelivery: newProduct.sameDayDelivery !== false,
      earliestDelivery: newProduct.sameDayDelivery !== false ? 'Today' : 'Tomorrow',
      rating: newProduct.rating || 4.8,
      reviews: newProduct.reviews || 8,
      image: newProduct.image?.trim() || 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop&q=80',
      hoverImage: newProduct.hoverImage || newProduct.image,
      images: newProduct.images || [newProduct.image],
      description: newProduct.description?.trim() || ''
    };

    setProducts((prev) => [item, ...prev]);
    return item;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const stockQty = Number(updatedFields.stock !== undefined ? updatedFields.stock : p.stock);
          const priceNumeric = Number(updatedFields.priceNum !== undefined ? updatedFields.priceNum : p.priceNum);
          return {
            ...p,
            ...updatedFields,
            priceNum: priceNumeric,
            price: `₹${priceNumeric.toLocaleString('en-IN')}`,
            originalPrice: updatedFields.originalPrice
              ? (String(updatedFields.originalPrice).startsWith('₹') ? updatedFields.originalPrice : `₹${Number(updatedFields.originalPrice).toLocaleString('en-IN')}`)
              : '',
            stock: stockQty,
            inStock: stockQty > 0 && updatedFields.inStock !== false
          };
        }
        return p;
      })
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateStockQty = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const currentStock = Number(p.stock ?? (p.inStock ? 1 : 0));
          const newQty = Math.max(0, currentStock + delta);
          return {
            ...p,
            stock: newQty,
            inStock: newQty > 0
          };
        }
        return p;
      })
    );
  };

  const toggleStockStatus = (id) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextInStock = !p.inStock;
          return {
            ...p,
            inStock: nextInStock,
            stock: nextInStock ? (p.stock > 0 ? p.stock : 10) : 0
          };
        }
        return p;
      })
    );
  };

  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem('tgs_products', JSON.stringify(INITIAL_PRODUCTS));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStockQty,
        toggleStockStatus,
        resetProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
