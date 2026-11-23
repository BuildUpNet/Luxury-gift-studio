import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Power
} from '../../components/FaIcons';
import { apiService } from '../../services/api';
import resolveImageUrl from '../../utils/image';

export default function FeatureCardsAdminPage() {
  const [cards, setCards] = useState([]);
  const [settings, setSettings] = useState({ is_enabled: true, min_cards_required: 5 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    badge_tag: '',
    image_url: '',
    sort_order: 0,
    is_active: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 4000);
  };

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getAdminFeatureCards();
      if (res?.success) {
        setCards(res.cards || []);
        if (res.settings) {
          setSettings(res.settings);
        }
      }
    } catch (err) {
      showError(err.message || 'Failed to fetch cards');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleToggleSection = async () => {
    setIsUpdatingSettings(true);
    const newStatus = !settings.is_enabled;
    try {
      const res = await apiService.updateMarqueeSettings({
        is_enabled: newStatus ? 1 : 0,
        min_cards_required: settings.min_cards_required || 5
      });
      if (res?.success) {
        setSettings({ ...settings, is_enabled: newStatus });
        showSuccess(newStatus ? 'Highlights section enabled on website!' : 'Highlights section disabled from website!');
      }
    } catch (err) {
      showError(err.message || 'Failed to update section visibility');
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCard(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      badge_tag: '',
      image_url: '',
      sort_order: cards.length + 1,
      is_active: 1
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (card) => {
    setEditingCard(card);
    setFormData({
      title: card.title || '',
      subtitle: card.subtitle || '',
      description: card.description || '',
      badge_tag: card.badge_tag || '',
      image_url: card.image_url || '',
      sort_order: card.sort_order || 0,
      is_active: card.is_active ? 1 : 0
    });
    setImageFile(null);
    setImagePreview(card.image_url ? resolveImageUrl(card.image_url) : '');
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showError('Title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('subtitle', formData.subtitle.trim());
      payload.append('description', formData.description.trim());
      payload.append('badge_tag', formData.badge_tag.trim());
      payload.append('sort_order', formData.sort_order || (cards.length + 1));
      payload.append('is_active', formData.is_active);

      if (imageFile) {
        payload.append('image', imageFile);
      } else if (formData.image_url) {
        payload.append('image_url', formData.image_url.trim());
      }

      if (editingCard) {
        await apiService.updateFeatureCard(editingCard.id, payload);
        showSuccess('Highlight card updated successfully!');
      } else {
        await apiService.createFeatureCard(payload);
        showSuccess('New highlight card created successfully!');
      }

      setIsModalOpen(false);
      fetchCards();
    } catch (err) {
      showError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this highlight card?')) return;
    try {
      await apiService.deleteFeatureCard(id);
      showSuccess('Card deleted successfully');
      fetchCards();
    } catch (err) {
      showError(err.message || 'Failed to delete');
    }
  };

  const handleToggleActive = async (card) => {
    try {
      await apiService.updateFeatureCard(card.id, {
        is_active: card.is_active ? 0 : 1
      });
      fetchCards();
    } catch (err) {
      showError(err.message || 'Failed to update status');
    }
  };

  const activeCardsCount = cards.filter((c) => c.is_active && c.image_url).length;
  const isSectionCurrentlyShowing = settings.is_enabled && activeCardsCount > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            <span>Brand Logos &amp; Marquee</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Infinite marquee partner &amp; client logos displayed on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleSection}
            disabled={isUpdatingSettings}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
              settings.is_enabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-stone-100 text-stone-600 border-stone-300 hover:bg-stone-200'
            }`}
          >
            <Power className={`w-4 h-4 ${settings.is_enabled ? 'text-emerald-600' : 'text-stone-400'}`} />
            <span>Section: {settings.is_enabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#182C20] text-white text-xs font-semibold rounded-xl hover:bg-[#D4AF37] hover:text-stone-900 transition shadow-xs cursor-pointer border-none"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand Logo</span>
          </button>
        </div>
      </div>

      <div
        className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
          isSectionCurrentlyShowing
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-3 h-3 rounded-full shrink-0 ${
              isSectionCurrentlyShowing ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <div>
            <strong className="block font-semibold">
              Status on Website:{' '}
              {isSectionCurrentlyShowing ? 'Visible & Active' : 'Hidden from Website'}
            </strong>
            <span className="text-[11px] opacity-80">
              {activeCardsCount} active brand logos with uploaded images.{' '}
              {!settings.is_enabled && '(Section is switched OFF by admin)'}
              {settings.is_enabled && activeCardsCount === 0 && '(Upload at least 1 brand logo image to activate the section on the website)'}
            </span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-xl animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto mb-2" />
          <p className="text-xs text-stone-500">Loading brand logos...</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center">
          <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-stone-700">No Brand Logos Created Yet</h3>
          <p className="text-xs text-stone-400 mt-1 mb-4">
            Add at least 5 brand logos so they can rotate seamlessly in the homepage marquee.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#182C20] text-white text-xs font-semibold rounded-lg hover:bg-[#D4AF37] hover:text-stone-900 transition"
          >
            Create Brand Logo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => {
            const cardImg = card.image_url ? resolveImageUrl(card.image_url) : null;
            return (
              <div
                key={card.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                  card.is_active ? 'border-stone-200' : 'border-stone-200 opacity-60 bg-stone-50'
                }`}
              >
                <div>
                  <div className="w-full h-24 rounded-xl bg-stone-50 border border-stone-200 overflow-hidden flex items-center justify-center p-3 mb-3">
                    {cardImg ? (
                      <img src={cardImg} alt={card.title} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="font-serif font-bold text-base text-[#182C20]">
                        {card.title}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug">
                      {card.title}
                    </h4>
                    <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Priority #{card.sort_order}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="text-[11px] text-stone-400">Position #{card.sort_order}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(card)}
                      title={card.is_active ? 'Active card' : 'Hidden card'}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer border-none bg-transparent"
                    >
                      {card.is_active ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(card)}
                      className="p-1.5 text-stone-400 hover:text-[#D4AF37] rounded-md cursor-pointer border-none bg-transparent"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(card.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md cursor-pointer border-none bg-transparent"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] !m-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">
              {editingCard ? 'Edit Brand Logo' : 'Add New Brand Logo'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Brand / Client Name <span className="text-red-500">*</span> <span className="text-stone-400 font-normal text-[11px]">(Internal reference only — not displayed on website UI)</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Dazzle, Mittal Group, White Clouds..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Brand Logo Image <span className="text-stone-400 font-normal">(Square or horizontal logo image)</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl border border-stone-200 overflow-hidden bg-stone-50 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-stone-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or enter logo image URL"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value });
                        if (!imageFile) setImagePreview(e.target.value);
                      }}
                      className="w-full px-2.5 py-1.5 border border-stone-200 rounded text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Sort Order (Sequence #)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    placeholder="1, 2, 3..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Lower number appears first</span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Status</label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none cursor-pointer"
                  >
                    <option value={1}>Active (Visible)</option>
                    <option value={0}>Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg text-xs font-semibold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#182C20] text-white rounded-lg text-xs font-semibold hover:bg-[#D4AF37] hover:text-stone-900 transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCard ? 'Save Changes' : 'Create Brand Logo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
