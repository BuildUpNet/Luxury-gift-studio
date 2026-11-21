import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit3,
  Search,
  Upload,
  Image as ImageIcon,
  X,
  Save,
  AlertCircle,
  Check,
  RefreshCw,
  ExternalLink,
  Star,
  Loader2
} from '../../components/FaIcons';
import { apiService, API_BASE_URL } from '../../services/api';
import resolveImageUrl, { parseGalleryImages } from '../../utils/image';

export default function ProductsPage({ onShowToast }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [localToast, setLocalToast] = useState('');

  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [modalError, setModalError] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const initialFormState = {
    title: '',
    category_id: '',
    category: '',
    occasion_id: '',
    occasion_ids: [],
    priceNum: '',
    originalPrice: '',
    stock: 10,
    images: [],
    description: '',
    rating: 4.8,
    reviews: 8,
    brand: 'THE GIFT STUDIO',
    discountBadge: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const notify = (msg) => {
    if (onShowToast) {
      onShowToast(msg);
    } else {
      setLocalToast(msg);
      setTimeout(() => setLocalToast(''), 3000);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const data = await apiService.getCategories();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch all occasions
  const fetchOccasions = async () => {
    try {
      const data = await apiService.getOccasions();
      if (data.success && Array.isArray(data.occasions)) {
        setOccasions(data.occasions);
      }
    } catch (err) {
      console.error('Error fetching occasions:', err);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await apiService.getProducts();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchOccasions();
    fetchProducts();
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Filter by category
      let matchesCategory = true;
      if (selectedCategory !== 'All') {
        const catIdMatch = String(p.category_id) === String(selectedCategory);
        const catNameMatch = p.category?.toLowerCase() === selectedCategory.toLowerCase();
        const catSlugMatch = p.category_slug?.toLowerCase() === selectedCategory.toLowerCase();
        matchesCategory = catIdMatch || catNameMatch || catSlugMatch;
      }

      // Filter by search query (title, brand, id)
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = p.title?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        const idMatch = String(p.id) === q;
        matchesSearch = titleMatch || descMatch || catMatch || idMatch;
      }

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Open modal for new product
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setUploadError('');
    setModalError('');
    setCustomUrlInput('');

    // In new product mode, keep category selection completely optional
    let defaultCatId = '';
    let defaultCatName = '';

    if (selectedCategory !== 'All') {
      const found = categories.find(
        (c) => String(c.id) === String(selectedCategory) || c.name === selectedCategory
      );
      if (found) {
        defaultCatId = found.id;
        defaultCatName = found.name;
      }
    }

    setFormData({
      ...initialFormState,
      category_id: defaultCatId,
      category: defaultCatName,
      occasion_id: '',
      occasion_ids: [],
      images: []
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing product
  const handleOpenEditModal = (product) => {
    setEditingProductId(product.id);
    setUploadError('');
    setModalError('');
    setCustomUrlInput('');

    // Parse existing images safely (handles JSON strings, arrays, or single image fallback)
    const existingImages = parseGalleryImages(product);

    // Resolve occasion IDs
    let currentOccasionIds = [];
    if (Array.isArray(product.occasion_ids)) {
      currentOccasionIds = product.occasion_ids;
    } else if (product.occasion_id) {
      currentOccasionIds = [Number(product.occasion_id)];
    }

    setFormData({
      title: product.title || '',
      category_id: product.category_id || '',
      category: product.category || product.category_name || 'Home Decor',
      occasion_id: product.occasion_id || (currentOccasionIds[0] || ''),
      occasion_ids: currentOccasionIds,
      priceNum: product.priceNum !== undefined && product.priceNum !== null ? String(product.priceNum) : '',
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      stock: product.stock !== undefined ? product.stock : 10,
      images: existingImages,
      description: product.description || '',
      rating: product.rating || 4.8,
      reviews: product.reviews || 8,
      brand: product.brand || 'THE GIFT STUDIO',
      discountBadge: product.discountBadge || ''
    });

    setIsModalOpen(true);
  };

  // Multi-Image Upload handler using /api/upload-multiple (1-7 images)
  const handleImageFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentCount = formData.images.length;
    const remainingSlots = 7 - currentCount;

    if (remainingSlots <= 0) {
      setUploadError('Maximum of 7 images already reached. Remove an existing image before adding new ones.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      notify(`Only uploading ${remainingSlots} image(s) to stay within the 7-image limit.`);
    }

    // Check size limit (5MB per file)
    const oversized = filesToUpload.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      setUploadError(`"${oversized.name}" exceeds the 5MB size limit.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploadingImage(true);
    setUploadError('');

    try {
      const uploadFormData = new FormData();
      filesToUpload.forEach((file) => {
        uploadFormData.append('images', file);
      });

      const res = await apiService.uploadMultipleImages(uploadFormData);
      const newUrls = Array.isArray(res) ? res : (res?.urls || []);

      if (newUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...newUrls].slice(0, 7)
        }));
        notify(`Uploaded ${newUrls.length} product image${newUrls.length > 1 ? 's' : ''}`);
      } else {
        throw new Error(res?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Multi-image upload failed:', err);
      setUploadError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Set an image as primary (moves it to index 0)
  const handleSetPrimary = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const updated = [...prev.images];
      const [selected] = updated.splice(index, 1);
      updated.unshift(selected);
      return { ...prev, images: updated };
    });
    notify('Cover / Primary image updated');
  };

  // Remove an image from gallery
  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: updated };
    });
    setUploadError('');
  };

  // Add custom image URL manually
  const handleAddCustomUrl = (e) => {
    e.preventDefault();
    const url = customUrlInput.trim();
    if (!url) return;

    if (formData.images.length >= 7) {
      setUploadError('Maximum of 7 images reached.');
      return;
    }

    if (formData.images.includes(url)) {
      setUploadError('This image URL is already in the gallery.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url]
    }));
    setCustomUrlInput('');
    setUploadError('');
    notify('Image URL added to gallery');
  };

  // Form submit (Add / Edit)
  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.title.trim()) {
      notify('Product title is required');
      return;
    }

    if (!formData.priceNum || isNaN(formData.priceNum) || Number(formData.priceNum) <= 0) {
      notify('Please enter a valid selling price');
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      notify('At least 1 product image is required (maximum 7).');
      return;
    }

    if (formData.images.length > 7) {
      notify('A maximum of 7 images is allowed per product.');
      return;
    }

    // Resolve category name and id (optional)
    let resolvedCatId = formData.category_id ? Number(formData.category_id) : null;
    let resolvedCatName = null;

    if (resolvedCatId && categories.length > 0) {
      const found = categories.find((c) => c.id === resolvedCatId);
      if (found) resolvedCatName = found.name;
    } else if (formData.category && categories.length > 0) {
      const found = categories.find((c) => c.name.toLowerCase() === formData.category.toLowerCase());
      if (found) {
        resolvedCatId = found.id;
        resolvedCatName = found.name;
      }
    }

    // Resolve occasion IDs (optional)
    const normalizedOccasionIds = Array.isArray(formData.occasion_ids)
      ? formData.occasion_ids.map((id) => Number(id)).filter((id) => !isNaN(id) && id > 0)
      : (formData.occasion_id ? [Number(formData.occasion_id)] : []);

    const primaryCoverImage = formData.images[0];
    const payload = {
      title: formData.title.trim(),
      category_id: resolvedCatId,
      category: resolvedCatName,
      occasion_id: normalizedOccasionIds[0] || null,
      occasion_ids: normalizedOccasionIds,
      priceNum: Number(formData.priceNum),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      stock: Math.max(0, parseInt(formData.stock, 10) || 0),
      image: primaryCoverImage,
      images: formData.images,
      description: formData.description.trim(),
      rating: Number(formData.rating) || 4.8,
      reviews: parseInt(formData.reviews, 10) || 8,
      brand: formData.brand.trim() || 'THE GIFT STUDIO',
      discountBadge: formData.discountBadge.trim()
    };

    setIsSubmitting(true);
    setModalError('');
    try {
      if (editingProductId) {
        const res = await apiService.updateProduct(editingProductId, payload);
        if (res && res.success === false) {
          throw new Error(res.message || 'Failed to update product');
        }
        notify('Product updated successfully');
      } else {
        const res = await apiService.createProduct(payload);
        if (res && res.success === false) {
          throw new Error(res.message || 'Failed to create product');
        }
        notify('Product created successfully');
      }

      setIsModalOpen(false);
      await fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      const msg = err.message || 'Error saving product';
      setModalError(msg);
      notify(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Stock adjustments directly in table
  const handleQuickStockChange = async (product, delta) => {
    const currentStock = Number(product.stock ?? 0);
    const newStock = Math.max(0, currentStock + delta);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
    );

    try {
      await apiService.updateProduct(product.id, {
        stock: newStock
      });
    } catch (err) {
      console.error('Failed to update stock:', err);
      notify('Failed to update stock');
      fetchProducts();
    }
  };

  // Delete product
  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      return;
    }

    try {
      await apiService.deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      notify(`Product "${product.title}" deleted`);
    } catch (err) {
      console.error('Failed to delete product:', err);
      notify(err.message || 'Failed to delete product');
      fetchProducts();
    }
  };

  return (
    <div className="space-y-6">
      {localToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1320] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {localToast}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900">Product Management</h2>
              <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {products.length} total
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Select a category to view and upload products with prices, stock, and images
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                fetchCategories();
                fetchProducts();
              }}
              title="Refresh Products"
              className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition border border-gray-200 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="bg-[#0B1320] hover:bg-[#1a2638] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <label htmlFor="filter-cat" className="text-xs font-semibold text-gray-700 shrink-0">
                Category:
              </label>
              <select
                id="filter-cat"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-800 font-medium focus:outline-none focus:border-black cursor-pointer min-w-[160px]"
              >
                <option value="All">All Categories ({products.length})</option>
                {categories.map((c) => {
                  const count = products.filter(
                    (p) => String(p.category_id) === String(c.id) || p.category === c.name
                  ).length;
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title, ID, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-black"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer border-none bg-transparent"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="text-[11px] text-gray-500 shrink-0">
            Showing <strong className="text-gray-900">{filteredProducts.length}</strong> matching products
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="text-xs mt-3">Loading products catalogue...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">No products found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your category filter or search terms.'
                : 'Get started by adding your first luxury gifting product.'}
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0B1320] hover:bg-[#1a2638] rounded-lg transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Product</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Stock Units</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs text-gray-700">
                {filteredProducts.map((p) => {
                  const resolvedImg = resolveImageUrl(p.image);
                  const galleryList = parseGalleryImages(p);

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 shrink-0">
                            <img
                              src={resolvedImg}
                              alt={p.title}
                              className="w-11 h-11 rounded-lg object-cover bg-gray-100 border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.src = '/images/gift_logo.jpeg';
                              }}
                            />
                            {galleryList.length > 1 && (
                              <span
                                className="absolute -top-1 -right-1 bg-[#0B1320] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-2xs"
                                title={`${galleryList.length} gallery images`}
                              >
                                {galleryList.length}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <p className="font-semibold text-gray-900 truncate" title={p.title}>
                              {p.title}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              ID: {p.id} {p.brand ? `· ${p.brand}` : ''}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="inline-block bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-medium px-2 py-0.5 rounded-md">
                            {p.category || p.category_name || 'Home Decor'}
                          </span>
                          {p.occasion_names ? (
                            <div className="text-[10px] text-amber-800 font-medium">
                              🎉 {p.occasion_names}
                            </div>
                          ) : null}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">
                          ₹{Number(p.priceNum || 0).toLocaleString('en-IN')}
                        </div>
                        {p.originalPrice && Number(p.originalPrice) > Number(p.priceNum) && (
                          <div className="text-[11px] text-gray-400 line-through">
                            ₹{Number(p.originalPrice).toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickStockChange(p, -1)}
                            className="w-6 h-6 rounded border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 cursor-pointer transition text-xs"
                            title="Decrease stock"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900 text-xs">
                            {p.stock ?? 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickStockChange(p, 1)}
                            className="w-6 h-6 rounded border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 cursor-pointer transition text-xs"
                            title="Increase stock"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition cursor-pointer border-none bg-transparent"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition cursor-pointer border-none bg-transparent"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] !m-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  {editingProductId ? 'Edit Product Details' : 'Upload & Add New Product'}
                </h3>
                <p className="text-xs text-gray-500">
                  Fill in the details below to upload or update this product
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black p-1 rounded-md cursor-pointer border-none bg-transparent"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {modalError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Unable to save product</p>
                    <p className="text-[11px] text-red-600 mt-0.5">{modalError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalError('')}
                    className="text-red-400 hover:text-red-700 p-0.5 cursor-pointer bg-transparent border-none"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Assign Category <span className="text-gray-400 font-normal">(Optional Product Category)</span>
                  </label>
                  {formData.category_id && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, category_id: '', category: '' })}
                      className="text-[11px] text-rose-600 hover:underline cursor-pointer bg-transparent border-none p-0"
                    >
                      Clear Category
                    </button>
                  )}
                </div>
                <select
                  value={formData.category_id}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const catObj = categories.find((c) => String(c.id) === String(selectedId));
                    setFormData({
                      ...formData,
                      category_id: selectedId,
                      category: catObj ? catObj.name : ''
                    });
                  }}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white"
                >
                  <option value="">
                    -- None (Do not assign to a Navbar Product Category) --
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Optional: Select a product category if this item should appear under a navbar category.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Assign Occasion(s) <span className="text-gray-400 font-normal">(Optional, Select multiple)</span>
                  </label>
                  {formData.occasion_ids && formData.occasion_ids.length > 0 && (
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {formData.occasion_ids.length} selected
                    </span>
                  )}
                </div>

                {occasions.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No occasions created yet.</p>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-2.5 bg-gray-50/50 max-h-36 overflow-y-auto space-y-1.5">
                    {occasions.map((occ) => {
                      const isChecked = Array.isArray(formData.occasion_ids) && formData.occasion_ids.includes(occ.id);
                      return (
                        <label
                          key={occ.id}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition text-xs select-none ${
                            isChecked ? 'bg-amber-100/70 text-amber-950 font-medium' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData((prev) => {
                                  const current = Array.isArray(prev.occasion_ids) ? prev.occasion_ids : [];
                                  const next = checked
                                    ? [...current, occ.id]
                                    : current.filter((id) => id !== occ.id);
                                  return {
                                    ...prev,
                                    occasion_ids: next,
                                    occasion_id: next[0] || ''
                                  };
                                });
                              }}
                              disabled={isSubmitting}
                              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                            />
                            <span>{occ.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-400">/occasion/{occ.slug}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
                <p className="text-[11px] text-gray-400 mt-1">
                  Tag this product to festive or milestone occasions (e.g. Diwali, Corporate, New Year).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Silver Plated Peacock Diya"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="1499"
                    value={formData.priceNum}
                    onChange={(e) => setFormData({ ...formData, priceNum: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="1999 (optional strike)"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Product Gallery Images * <span className="text-gray-400 font-normal">(1 to 7 images required)</span>
                  </label>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    formData.images.length === 0
                      ? 'bg-rose-100 text-rose-700'
                      : formData.images.length === 7
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {formData.images.length} / 7 selected
                  </span>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.jpg,.jpeg,.png,.webp,.avif"
                      onChange={handleImageFilesChange}
                      disabled={isUploadingImage || isSubmitting || formData.images.length >= 7}
                      className="hidden"
                      id="product-images-upload-input"
                    />
                    <label
                      htmlFor={formData.images.length >= 7 || isUploadingImage || isSubmitting ? undefined : "product-images-upload-input"}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition border ${
                        formData.images.length >= 7
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'bg-[#0B1320] hover:bg-[#1a2638] text-white border-[#0B1320] cursor-pointer shadow-xs active:scale-98'
                      }`}
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading Files...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>{formData.images.length === 0 ? 'Upload Product Images' : 'Add More Images (Up to 7)'}</span>
                        </>
                      )}
                    </label>

                    <span className="text-[11px] text-gray-400">
                      {7 - formData.images.length > 0
                        ? `${7 - formData.images.length} slot(s) remaining (Max 5MB each)`
                        : 'Maximum 7 images limit reached'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-gray-200/80">
                    <input
                      type="text"
                      placeholder="Or enter direct image URL (/images/... or https://...)"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomUrl(e);
                        }
                      }}
                      disabled={isSubmitting || formData.images.length >= 7}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-black font-mono text-gray-700 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomUrl}
                      disabled={!customUrlInput.trim() || isSubmitting || formData.images.length >= 7}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Add URL
                    </button>
                  </div>

                  {uploadError && (
                    <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-md">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>

                {formData.images.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Image Gallery ({formData.images.length}/7) — First image is Primary Cover
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                      {formData.images.map((imgUrl, index) => {
                        const isPrimary = index === 0;

                        return (
                          <div
                            key={`${imgUrl}-${index}`}
                            className={`relative group rounded-lg overflow-hidden border-2 bg-white flex flex-col transition shadow-xs ${
                              isPrimary
                                ? 'border-[#C62828] ring-2 ring-[#C62828]/20'
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                              <img
                                src={resolveImageUrl(imgUrl)}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/gift_logo.jpeg';
                                }}
                              />

                              {isPrimary && (
                                <div className="absolute top-1 left-1 bg-[#C62828] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5 z-10">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  <span>Cover</span>
                                </div>
                              )}

                              <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs z-10">
                                #{index + 1}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-full cursor-pointer border-none transition z-20 shadow-sm"
                                title="Remove this image"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="p-1 bg-gray-50 border-t border-gray-100 text-center">
                              {isPrimary ? (
                                <span className="text-[10px] font-bold text-[#C62828] flex items-center justify-center gap-1 py-0.5">
                                  <Check className="w-3 h-3" /> Primary
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimary(index)}
                                  className="text-[10px] font-medium text-gray-700 hover:text-[#C62828] hover:bg-red-50 p-1 rounded transition border border-gray-200 cursor-pointer w-full flex items-center justify-center gap-1 bg-white"
                                  title="Make this image the primary cover (images[0])"
                                >
                                  <Star className="w-2.5 h-2.5" /> Make Cover
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-center py-4 px-3 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <ImageIcon className="w-7 h-7 text-gray-300 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-600">No images added yet</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Upload 1 to 7 product photos. The first image will be the primary storefront cover.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Detailed craftsmanship, materials, dimensions, or gifting significance..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black rounded-lg transition cursor-pointer border-none bg-transparent disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="bg-[#0B1320] hover:bg-[#1a2638] text-white text-xs font-semibold px-5 py-2 rounded-lg transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : editingProductId ? (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

