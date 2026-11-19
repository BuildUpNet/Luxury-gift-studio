import React, { useState, useEffect, useRef } from 'react';
import {
  CalendarHeart,
  Plus,
  Trash2,
  Edit3,
  Search,
  Upload,
  Image as ImageIcon,
  Check,
  Package,
  X,
  AlertCircle,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { apiService } from '../../services/api';
import resolveImageUrl from '../../utils/image';

export default function OccasionsAdminPage({ onShowToast }) {
  const [occasions, setOccasions] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    slug: '',
    image_url: '',
    description: '',
    product_ids: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);

  // Product Assignment State
  const [assignedProductIds, setAssignedProductIds] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [isSavingAssignments, setIsSavingAssignments] = useState(false);

  const notify = (msg) => {
    if (onShowToast) onShowToast(msg);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [occRes, prodRes] = await Promise.allSettled([
        apiService.getOccasions(),
        apiService.getProducts()
      ]);

      if (occRes.status === 'fulfilled' && occRes.value?.success) {
        setOccasions(occRes.value.occasions || []);
      } else {
        throw new Error('Failed to load occasions');
      }

      if (prodRes.status === 'fulfilled' && prodRes.value?.success) {
        setProducts(prodRes.value.products || []);
      }
    } catch (err) {
      console.error('Error loading occasions:', err);
      setError(err.message || 'Failed to load occasions catalogue.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Occasions
  const filteredOccasions = occasions.filter((occ) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      occ.name?.toLowerCase().includes(q) ||
      occ.slug?.toLowerCase().includes(q) ||
      occ.description?.toLowerCase().includes(q)
    );
  });

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setFormData({
      id: null,
      name: '',
      slug: '',
      image_url: '',
      description: '',
      product_ids: []
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (occ) => {
    setFormData({
      id: occ.id,
      name: occ.name || '',
      slug: occ.slug || '',
      image_url: occ.image_url || '',
      description: occ.description || '',
      product_ids: []
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  // Open Product Assignment Modal
  const handleOpenAssignModal = async (occ) => {
    setSelectedOccasion(occ);
    setProductSearch('');
    try {
      const res = await apiService.getOccasionByIdOrSlug(occ.id);
      if (res?.success) {
        const assignedIds = (res.products || []).map((p) => p.id);
        setAssignedProductIds(assignedIds);
      } else {
        setAssignedProductIds([]);
      }
    } catch (err) {
      console.warn('Could not fetch assigned products:', err);
      setAssignedProductIds([]);
    }
    setIsAssignModalOpen(true);
  };

  // Toggle Product in Assignment List
  const toggleProductAssignment = (productId) => {
    setAssignedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Save Product Assignments
  const handleSaveAssignments = async () => {
    if (!selectedOccasion) return;
    setIsSavingAssignments(true);
    try {
      const res = await apiService.assignProductsToOccasion(selectedOccasion.id, assignedProductIds);
      if (res?.success) {
        const assignedCount = assignedProductIds.length;
        notify(`Updated products for "${selectedOccasion.name}" (${assignedCount} assigned)`);
        
        // Optimistically update the occasion's products_count in local state immediately
        setOccasions((prev) =>
          prev.map((o) =>
            o.id === selectedOccasion.id
              ? { ...o, products_count: assignedCount }
              : o
          )
        );

        setIsAssignModalOpen(false);
        await loadData();
      } else {
        throw new Error(res?.message || 'Failed to update assignments');
      }
    } catch (err) {
      alert(err.message || 'Error updating product assignments');
    } finally {
      setIsSavingAssignments(false);
    }
  };

  // Open Delete Confirmation
  const handleOpenDeleteModal = (occ) => {
    setSelectedOccasion(occ);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!selectedOccasion) return;
    setIsSubmitting(true);
    try {
      const res = await apiService.deleteOccasion(selectedOccasion.id);
      if (res?.success) {
        notify(`Occasion "${selectedOccasion.name}" deleted successfully.`);
        setIsDeleteModalOpen(false);
        loadData();
      } else {
        throw new Error(res?.message || 'Failed to delete occasion');
      }
    } catch (err) {
      alert(err.message || 'Error deleting occasion');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setFormError('Image size exceeds 4MB. Please select a smaller photo.');
      return;
    }

    setIsUploading(true);
    setFormError('');

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);
      const res = await apiService.uploadImage(uploadData);
      if (res?.success && res.url) {
        setFormData((prev) => ({ ...prev, image_url: res.url }));
        notify('Cover image uploaded successfully');
      } else {
        throw new Error(res?.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setFormError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Submit Occasion Form (Create or Update)
  const handleSubmitOccasion = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Occasion name is required.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      let res;
      if (formData.id) {
        res = await apiService.updateOccasion(formData.id, formData);
      } else {
        res = await apiService.createOccasion(formData);
      }

      if (res?.success) {
        notify(formData.id ? 'Occasion updated successfully' : 'New occasion created successfully');
        setIsEditModalOpen(false);
        loadData();
      } else {
        throw new Error(res?.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Error saving occasion:', err);
      setFormError(err.message || 'Failed to save occasion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <CalendarHeart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Occasions Management
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage luxury gifting occasions (Diwali, Corporate, Birthdays, Weddings) and assign specific products to each.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0B1320] hover:bg-[#1a2638] transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add New Occasion</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search occasions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 bg-gray-50/50"
            />
          </div>
          <div className="text-[11px] text-gray-500">
            Total Occasions: <strong className="text-gray-900">{filteredOccasions.length}</strong>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-3 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Occasions Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
          <Loader2 className="w-7 h-7 animate-spin mx-auto text-amber-600 mb-2" />
          <p className="text-xs">Loading occasions catalogue...</p>
        </div>
      ) : filteredOccasions.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-xl border border-gray-200">
          <CalendarHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-800">No Occasions Found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'No occasions matched your search criteria.'
              : 'Add your first festive or milestone occasion to organize gifts.'}
          </p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B1320] text-white text-xs font-semibold rounded-lg hover:bg-black transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Create Occasion</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOccasions.map((occ) => {
            const coverImg = resolveImageUrl(occ.image_url);

            return (
              <div
                key={occ.id}
                className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-amber-300/80 transition group"
              >
                <div>
                  {/* Image Cover */}
                  <div className="relative h-44 bg-gradient-to-br from-stone-800 to-stone-900 overflow-hidden">
                    {coverImg ? (
                      <img
                        src={coverImg}
                        alt={occ.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 select-none">
                        <CalendarHeart className="w-8 h-8 text-amber-500/80 mb-1" />
                        <span className="text-[11px] font-medium tracking-wider uppercase">The Gift Studio</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-800 uppercase tracking-wider border border-white/40">
                      /occasion/{occ.slug}
                    </div>

                    {/* Products Counter Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white">
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                      <span>{occ.products_count} Assigned Gifts</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif text-base font-bold text-gray-900 group-hover:text-amber-800 transition">
                      {occ.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {occ.description || 'No description provided for this occasion.'}
                    </p>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenAssignModal(occ)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5 text-amber-700" />
                    <span>Assign Products ({occ.products_count})</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(occ)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition cursor-pointer"
                      title="Edit Occasion"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDeleteModal(occ)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete Occasion"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Add / Edit Occasion Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  {formData.id ? 'Edit Occasion' : 'Create New Occasion'}
                </h3>
                <p className="text-xs text-gray-500">
                  Set occasion name, URL slug, custom cover photo, and overview description
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-black p-1 rounded-md cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitOccasion} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Occasion Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Gifting, Corporate Milestones"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      slug: prev.id ? prev.slug : name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
                    }));
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="bg-gray-100 text-gray-500 px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg text-xs">
                    /occasion/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="diwali-gifting"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-r-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Cover Image Upload / URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cover Image
                </label>
                <div className="space-y-2">
                  {formData.image_url && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <img
                        src={resolveImageUrl(formData.image_url)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer border border-gray-200 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image</span>
                        </>
                      )}
                    </button>
                    <input
                      type="text"
                      placeholder="Or enter image URL directly"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short description highlighting the luxury items and themes of this occasion..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black rounded-lg transition cursor-pointer bg-transparent border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#0B1320] hover:bg-[#1a2638] rounded-lg transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{formData.id ? 'Save Changes' : 'Create Occasion'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Product Assignment Modal */}
      {isAssignModalOpen && selectedOccasion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  Assign Products to "{selectedOccasion.name}"
                </h3>
                <p className="text-xs text-gray-500">
                  Select products that belong to this occasion. Selected: <strong className="text-amber-800">{assignedProductIds.length}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="text-gray-400 hover:text-black p-1 rounded-md cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Search & Select Controls */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3 bg-gray-50/50">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter products catalogue..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAssignedProductIds(products.map((p) => p.id))}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setAssignedProductIds([])}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 bg-white border border-gray-200 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Product Checkboxes List */}
            <div className="p-6 overflow-y-auto flex-1 divide-y divide-gray-100">
              {products
                .filter((p) => {
                  const q = productSearch.toLowerCase().trim();
                  if (!q) return true;
                  return (
                    p.title?.toLowerCase().includes(q) ||
                    p.category?.toLowerCase().includes(q)
                  );
                })
                .map((product) => {
                  const isChecked = assignedProductIds.includes(product.id);
                  const prodImg = resolveImageUrl(product.image);

                  return (
                    <div
                      key={product.id}
                      onClick={() => toggleProductAssignment(product.id)}
                      className={`py-3 px-3 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition select-none ${
                        isChecked ? 'bg-amber-50/70 border border-amber-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                          <img
                            src={prodImg}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/gift_logo.jpeg';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">
                            {product.title}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {product.category || 'Gift'} • ₹{Number(product.priceNum).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                          isChecked
                            ? 'bg-amber-600 border-amber-600 text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <span className="text-xs text-gray-500">
                {assignedProductIds.length} products assigned
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black cursor-pointer bg-transparent border-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAssignments}
                  disabled={isSavingAssignments}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#0B1320] hover:bg-[#1a2638] rounded-lg transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSavingAssignments && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Product Assignments</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedOccasion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-1">
              Delete Occasion?
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Are you sure you want to delete <strong className="text-gray-900">"{selectedOccasion.name}"</strong>? Products linked to this occasion will remain safe in the catalogue.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black cursor-pointer border border-gray-200 rounded-lg bg-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
