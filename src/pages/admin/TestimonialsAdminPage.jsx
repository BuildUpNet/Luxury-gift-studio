import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  Quote,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Check,
  Loader2,
  Search,
  MessageSquare,
  Sparkles,
  MapPin,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { apiService } from '../../services/api';
import resolveImageUrl from '../../utils/image';

const INITIAL_FORM = {
  customer_name: '',
  avatar_url: '',
  product_image_url: '',
  rating: 5,
  review_text: '',
  occasion: '',
  city: ''
};

export default function TestimonialsAdminPage({ onShowToast }) {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Delete Confirmation Modal State
  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // File Upload State
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingProductImg, setUploadingProductImg] = useState(false);
  const avatarInputRef = useRef(null);
  const productImgInputRef = useRef(null);

  // Load Testimonials
  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getTestimonials();
      if (res?.success && Array.isArray(res.testimonials)) {
        setTestimonials(res.testimonials);
      }
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      if (onShowToast) onShowToast('Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Filtered Testimonials
  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      !searchTerm ||
      t.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.review_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.occasion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      filterRating === 'all' || Math.round(Number(t.rating)) === Number(filterRating);

    return matchesSearch && matchesRating;
  });

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      customer_name: item.customer_name || '',
      avatar_url: item.avatar_url || '',
      product_image_url: item.product_image_url || '',
      rating: Number(item.rating) || 5,
      review_text: item.review_text || '',
      occasion: item.occasion || '',
      city: item.city || ''
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value
    }));
  };

  // Handle Image Upload Helper
  const handleUploadImage = async (file, type) => {
    if (!file) return;
    const body = new FormData();
    body.append('image', file);

    if (type === 'avatar') setUploadingAvatar(true);
    if (type === 'product') setUploadingProductImg(true);

    try {
      const res = await apiService.uploadImage(body);
      if (res?.success && res.url) {
        if (type === 'avatar') {
          setFormData((prev) => ({ ...prev, avatar_url: res.url }));
        } else {
          setFormData((prev) => ({ ...prev, product_image_url: res.url }));
        }
        if (onShowToast) onShowToast('Image uploaded successfully');
      } else {
        alert(res?.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert(err.message || 'Error uploading image');
    } finally {
      if (type === 'avatar') setUploadingAvatar(false);
      if (type === 'product') setUploadingProductImg(false);
    }
  };

  // Submit Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name.trim()) {
      setErrorMessage('Customer name is required');
      return;
    }
    if (!formData.review_text.trim()) {
      setErrorMessage('Review text is required');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (editingId) {
        const res = await apiService.updateTestimonial(editingId, formData);
        if (res?.success) {
          if (onShowToast) onShowToast('Testimonial updated successfully');
          setIsModalOpen(false);
          fetchTestimonials();
        } else {
          setErrorMessage(res?.message || 'Failed to update testimonial');
        }
      } else {
        const res = await apiService.createTestimonial(formData);
        if (res?.success) {
          if (onShowToast) onShowToast('Testimonial created successfully');
          setIsModalOpen(false);
          fetchTestimonials();
        } else {
          setErrorMessage(res?.message || 'Failed to create testimonial');
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMessage(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteModalItem) return;
    setIsDeleting(true);
    try {
      const res = await apiService.deleteTestimonial(deleteModalItem.id);
      if (res?.success) {
        if (onShowToast) onShowToast('Testimonial deleted successfully');
        setDeleteModalItem(null);
        fetchTestimonials();
      } else {
        alert(res?.message || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Error deleting testimonial');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar with Stats & Add Button */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Quote className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-gray-900">Customer Testimonials & Reviews</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage authentic client reviews, ratings, occasions, and photo showcases displayed on the store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#8B2635] hover:bg-[#701E2B] transition shadow-xs cursor-pointer border-none"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Review</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, city, occasion, text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635] bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 font-medium">Rating:</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8B2635] bg-white text-gray-700"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
            </select>
          </div>

          <span className="text-xs text-gray-500 border-l border-gray-200 pl-3">
            Total: <strong className="text-gray-900">{filteredTestimonials.length}</strong>
          </span>
        </div>
      </div>

      {/* 3. Testimonials Cards / Table Grid */}
      {isLoading ? (
        <div className="py-20 text-center bg-white rounded-xl border border-[#E5E7EB]">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B2635] mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading reviews...</p>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-[#E5E7EB] p-6">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">No testimonials found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchTerm || filterRating !== 'all'
              ? 'Try adjusting your search criteria or rating filter.'
              : 'Add your first customer review to showcase on your luxury store!'}
          </p>
          {!searchTerm && filterRating === 'all' && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#8B2635] hover:opacity-90 cursor-pointer border-none"
            >
              Add Review
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTestimonials.map((item) => {
            const ratingNum = Math.round(Number(item.rating) || 5);
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition relative group"
              >
                <div>
                  {/* Card Header: Avatar + Name + Rating */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.avatar_url ? (
                        <img
                          src={resolveImageUrl(item.avatar_url)}
                          alt={item.customer_name}
                          className="w-10 h-10 rounded-full object-cover border border-[#E8DFD3] shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/images/gift_logo.jpeg';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {item.customer_name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {item.customer_name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
                          {item.city && (
                            <span className="flex items-center gap-0.5 truncate">
                              <MapPin className="w-2.5 h-2.5" />
                              {item.city}
                            </span>
                          )}
                          {item.occasion && (
                            <>
                              <span>•</span>
                              <span className="text-[#8B2635] font-medium truncate">
                                {item.occasion}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-bold text-amber-800">
                        {Number(item.rating).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="relative mb-3">
                    <Quote className="w-3.5 h-3.5 text-stone-300 absolute -top-1 -left-1 opacity-50" />
                    <p className="text-xs text-gray-700 italic pl-3 leading-relaxed line-clamp-4">
                      "{item.review_text}"
                    </p>
                  </div>

                  {/* Optional Product Showcase Image */}
                  {item.product_image_url && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-stone-200 bg-stone-50 flex items-center gap-2 p-1.5">
                      <img
                        src={resolveImageUrl(item.product_image_url)}
                        alt="Reviewed Gift"
                        className="w-12 h-12 object-cover rounded-md border border-stone-200 shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = '/images/gift_logo.jpeg';
                        }}
                      />
                      <div className="text-[10px] text-gray-500">
                        <span className="font-semibold text-gray-700 block">Featured Gift Photo</span>
                        <span>Attached to this review</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Date & Actions */}
                <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition cursor-pointer border-none bg-transparent"
                      title="Edit Review"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteModalItem(item)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer border-none bg-transparent"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CREATE / EDIT MODAL ─────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-gray-200 max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-1 rounded-full border-none bg-transparent cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B2635]">
                {editingId ? 'Modify Record' : 'New Entry'}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                {editingId ? 'Edit Customer Review' : 'Add Customer Review'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Provide client feedback details and upload custom reviewer or hamper photos.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Row 1: Customer Name + Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="e.g. Radhika Merchant"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Rating (1 to 5 Stars) *
                  </label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635] bg-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5.0 Stars - Excellent)</option>
                    <option value={4.5}>⭐⭐⭐⭐½ (4.5 Stars - Great)</option>
                    <option value={4}>⭐⭐⭐⭐ (4.0 Stars - Good)</option>
                    <option value={3.5}>⭐⭐⭐½ (3.5 Stars - Average)</option>
                    <option value={3}>⭐⭐⭐ (3.0 Stars)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Occasion + City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Occasion / Event
                  </label>
                  <input
                    type="text"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    placeholder="e.g. Diwali Gifting, Wedding, Birthday"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai, New Delhi, Bengaluru"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635]"
                  />
                </div>
              </div>

              {/* Row 3: Review Text */}
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Customer Review Quote *
                </label>
                <textarea
                  name="review_text"
                  required
                  rows={3}
                  value={formData.review_text}
                  onChange={handleChange}
                  placeholder="Share what the customer celebrated or admired about the hampers, curation, and delivery..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635]"
                />
              </div>

              {/* Row 4: Image Uploads (Avatar & Product Image) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-gray-100">
                {/* 1. Avatar Image */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Client Avatar Photo
                  </label>
                  <div className="flex items-center gap-2">
                    {formData.avatar_url ? (
                      <div className="relative group w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                        <img
                          src={resolveImageUrl(formData.avatar_url)}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, avatar_url: '' }))}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer border-none"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}

                    <div className="flex-1">
                      <input
                        type="file"
                        ref={avatarInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleUploadImage(e.target.files[0], 'avatar');
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="w-full py-1.5 px-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition text-xs font-medium cursor-pointer"
                      >
                        {uploadingAvatar ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8B2635]" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-gray-500" />
                        )}
                        <span>{formData.avatar_url ? 'Change Avatar' : 'Upload Avatar'}</span>
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    placeholder="Or paste image URL"
                    className="w-full mt-1.5 px-2.5 py-1 text-[11px] border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8B2635] text-gray-600 bg-gray-50/50"
                  />
                </div>

                {/* 2. Product Image */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Hamper / Product Photo
                  </label>
                  <div className="flex items-center gap-2">
                    {formData.product_image_url ? (
                      <div className="relative group w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        <img
                          src={resolveImageUrl(formData.product_image_url)}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, product_image_url: '' }))}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer border-none"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}

                    <div className="flex-1">
                      <input
                        type="file"
                        ref={productImgInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleUploadImage(e.target.files[0], 'product');
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => productImgInputRef.current?.click()}
                        disabled={uploadingProductImg}
                        className="w-full py-1.5 px-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition text-xs font-medium cursor-pointer"
                      >
                        {uploadingProductImg ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8B2635]" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-gray-500" />
                        )}
                        <span>{formData.product_image_url ? 'Change Photo' : 'Upload Gift Photo'}</span>
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="product_image_url"
                    value={formData.product_image_url}
                    onChange={handleChange}
                    placeholder="Or paste gift image URL"
                    className="w-full mt-1.5 px-2.5 py-1 text-[11px] border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8B2635] text-gray-600 bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#8B2635] hover:bg-[#701E2B] text-white font-semibold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 border-none"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? 'Save Changes' : 'Publish Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ─────────────────────────────────────── */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-gray-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-1">Delete Testimonial?</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to permanently delete the review from{' '}
              <strong className="text-gray-900">"{deleteModalItem.customer_name}"</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalItem(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-semibold text-white cursor-pointer flex items-center gap-1.5 border-none disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Review</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
