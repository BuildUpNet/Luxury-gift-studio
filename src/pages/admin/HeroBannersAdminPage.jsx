import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle
} from '../../components/FaIcons';
import { apiService } from '../../services/api';
import resolveImageUrl from '../../utils/image';
import { clearCache, CACHE_KEYS } from '../../utils/cache';

const INITIAL_FORM = {
  image_url: '',
  tag_text: '',
  heading: '',
  subtext: '',
  button_text: 'GIFT NOW',
  button_link: '#shop-now',
  sort_order: 1
};

export default function HeroBannersAdminPage({ onShowToast }) {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Delete modal state
  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch Slides
  const fetchSlides = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getHeroSlides();
      if (res?.success && Array.isArray(res.slides)) {
        setSlides(res.slides);
      }
    } catch (err) {
      console.error('Failed to load hero slides:', err);
      if (onShowToast) onShowToast('Failed to load hero banners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...INITIAL_FORM,
      sort_order: (slides.length ? Math.max(...slides.map(s => Number(s.sort_order) || 0)) : 0) + 1
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide) => {
    setEditingId(slide.id);
    setFormData({
      image_url: slide.image_url || '',
      tag_text: slide.tag_text || '',
      heading: slide.heading || '',
      subtext: slide.subtext || '',
      button_text: slide.button_text || 'GIFT NOW',
      button_link: slide.button_link || '#shop-now',
      sort_order: Number(slide.sort_order) || 1
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'sort_order' ? Number(value) : value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append('image', file);

    setIsUploading(true);
    try {
      const res = await apiService.uploadImage(body);
      if (res?.success && res.url) {
        setFormData((prev) => ({ ...prev, image_url: res.url }));
        if (onShowToast) onShowToast('Banner image uploaded successfully');
      } else {
        alert(res?.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert(err.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_url.trim()) {
      setErrorMessage('Slide background image is required.');
      return;
    }
    if (!formData.heading.trim()) {
      setErrorMessage('Heading is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (editingId) {
        const res = await apiService.updateHeroSlide(editingId, formData);
        if (res?.success) {
          clearCache(CACHE_KEYS.HERO_SLIDES);
          if (onShowToast) onShowToast('Hero banner updated successfully');
          setIsModalOpen(false);
          fetchSlides();
        } else {
          setErrorMessage(res?.message || 'Failed to update slide');
        }
      } else {
        const res = await apiService.createHeroSlide(formData);
        if (res?.success) {
          clearCache(CACHE_KEYS.HERO_SLIDES);
          if (onShowToast) onShowToast('Hero banner added successfully');
          setIsModalOpen(false);
          fetchSlides();
        } else {
          setErrorMessage(res?.message || 'Failed to create slide');
        }
      }
    } catch (err) {
      console.error('Submit slide error:', err);
      setErrorMessage(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reorder Slide (Move Up / Down)
  const handleMoveSlide = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    // Recalculate sequential sort orders (1, 2, 3...)
    const orderPayload = newSlides.map((slide, idx) => ({
      id: slide.id,
      sort_order: idx + 1
    }));

    setSlides(newSlides);

    try {
      const res = await apiService.reorderHeroSlides(orderPayload);
      if (res?.success) {
        clearCache(CACHE_KEYS.HERO_SLIDES);
        if (onShowToast) onShowToast('Banner order updated');
      }
    } catch (err) {
      console.error('Failed to update banner order:', err);
      fetchSlides();
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalItem) return;
    setIsDeleting(true);
    try {
      const res = await apiService.deleteHeroSlide(deleteModalItem.id);
      if (res?.success) {
        clearCache(CACHE_KEYS.HERO_SLIDES);
        if (onShowToast) onShowToast('Hero banner deleted successfully');
        setDeleteModalItem(null);
        fetchSlides();
      } else {
        alert(res?.message || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete slide error:', err);
      alert(err.message || 'Error deleting slide');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <ImageIcon className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-gray-900">Homepage Hero Banners & Slider</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage dynamic luxury carousel banners, custom background images, titles, action buttons, and slide sequencing.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#8B2635] hover:bg-[#701E2B] transition shadow-xs cursor-pointer border-none"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Banner</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center bg-white rounded-xl border border-[#E5E7EB]">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B2635] mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading hero slider banners...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-[#E5E7EB] p-6">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">No Hero Banners Published</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Create your first hero slide to showcase your premier bespoke collections on the homepage.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#8B2635] hover:opacity-90 cursor-pointer border-none"
          >
            Add First Slide
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => {
            const resolvedImg = resolveImageUrl(slide.image_url);
            return (
              <div
                key={slide.id}
                className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-2xs hover:shadow-xs transition flex flex-col md:flex-row items-stretch"
              >
                <div className="md:w-72 h-44 md:h-auto relative overflow-hidden bg-stone-900 shrink-0">
                  <img
                    src={resolvedImg}
                    alt={slide.heading}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/gift_logo.jpeg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                    <span>Slide #{index + 1}</span>
                    <span className="text-amber-400">• Order: {slide.sort_order}</span>
                  </div>
                  {slide.tag_text && (
                    <div className="absolute bottom-2 left-2 right-2 text-amber-400 text-[10px] font-bold tracking-widest uppercase truncate">
                      {slide.tag_text}
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {slide.tag_text && (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B2635] block mb-1">
                        {slide.tag_text}
                      </span>
                    )}
                    <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900">
                      {slide.heading}
                    </h3>
                    {slide.subtext && (
                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed line-clamp-2">
                        {slide.subtext}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-stone-600">
                      <span className="font-bold text-gray-900 bg-stone-100 px-2.5 py-1 rounded text-[11px]">
                        CTA: {slide.button_text || 'GIFT NOW'}
                      </span>
                      <span className="text-gray-400 text-[11px] flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" />
                        <span className="truncate max-w-xs">{slide.button_link || '#shop-now'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveSlide(index, 'down')}
                        disabled={index === slides.length - 1}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(slide)}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                        title="Edit Banner"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteModalItem(slide)}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] !m-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-gray-200 max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-1 rounded-full border-none bg-transparent cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B2635]">
                {editingId ? 'Modify Banner' : 'New Hero Slide'}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                {editingId ? 'Edit Hero Slider Banner' : 'Add New Hero Banner'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Upload a high-resolution background image and customize the headline, subtext, and call-to-action button.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Background Banner Image * (1920x1080 recommended)
                </label>
                <div className="flex items-center gap-3">
                  {formData.image_url ? (
                    <div className="relative group w-24 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-stone-900">
                      <img
                        src={resolveImageUrl(formData.image_url)}
                        alt="Slide preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer border-none"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full py-2 px-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition text-xs font-medium cursor-pointer"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#8B2635]" />
                      ) : (
                        <Upload className="w-4 h-4 text-gray-500" />
                      )}
                      <span>{formData.image_url ? 'Change Banner Image' : 'Upload Banner Image'}</span>
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  name="image_url"
                  required
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="Or paste direct image URL (Unsplash, CDN, /images/...)"
                  className="w-full mt-2 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635] text-gray-600 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Tag / Subtitle Text (Golden Eyebrow)
                </label>
                <input
                  type="text"
                  name="tag_text"
                  value={formData.tag_text}
                  onChange={handleChange}
                  placeholder="e.g. THE ART OF LUXURY GIFTING"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Main Headline / Title *
                </label>
                <input
                  type="text"
                  name="heading"
                  required
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="e.g. Curated Hampers For Every Celebration"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Subtext / Description
                </label>
                <textarea
                  name="subtext"
                  rows={2}
                  value={formData.subtext}
                  onChange={handleChange}
                  placeholder="e.g. Discover exquisite gift hampers crafted with artisanal treats, fine confectionery, and memorable keepsakes."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    name="button_text"
                    value={formData.button_text}
                    onChange={handleChange}
                    placeholder="e.g. GIFT NOW"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Button Link / Target
                  </label>
                  <input
                    type="text"
                    name="button_link"
                    value={formData.button_link}
                    onChange={handleChange}
                    placeholder="e.g. /category or #build-hamper-section"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Sequence Order #
                  </label>
                  <input
                    type="number"
                    name="sort_order"
                    min="1"
                    value={formData.sort_order}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635]"
                  />
                </div>
              </div>

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
                  <span>{editingId ? 'Save Changes' : 'Publish Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModalItem && (
        <div className="fixed inset-0 z-[100] !m-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-gray-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-1">Delete Hero Banner?</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-gray-900">"{deleteModalItem.heading}"</strong>? This banner will be removed from the homepage carousel.
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
                <span>Delete Slide</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
