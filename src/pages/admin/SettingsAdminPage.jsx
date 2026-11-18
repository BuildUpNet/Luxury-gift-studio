import React, { useState, useEffect } from 'react';
import {
  Settings,
  Share2,
  Save,
  Loader2,
  Globe,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { apiService } from '../../services/api';

export default function SettingsAdminPage({ onShowToast }) {
  const [formData, setFormData] = useState({
    facebook_url: '',
    whatsapp_url: '',
    instagram_url: '',
    bulk_enquiry_phone: '',
    support_email: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Fetch current store settings
  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      setIsLoading(true);
      try {
        const res = await apiService.getSettings();
        if (res?.success && res.settings && isMounted) {
          setFormData({
            facebook_url: res.settings.facebook_url || '',
            whatsapp_url: res.settings.whatsapp_url || '',
            instagram_url: res.settings.instagram_url || '',
            bulk_enquiry_phone: res.settings.bulk_enquiry_phone || '',
            support_email: res.settings.support_email || ''
          });
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
        setStatusMessage({ type: 'error', text: 'Failed to load store settings.' });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await apiService.updateSettings(formData);
      if (res?.success) {
        setStatusMessage({ type: 'success', text: 'Store settings saved successfully!' });
        if (onShowToast) onShowToast('Settings updated successfully');
      } else {
        setStatusMessage({ type: 'error', text: res?.message || 'Failed to update settings.' });
      }
    } catch (err) {
      console.error('Settings save error:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Error updating settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center bg-white rounded-xl border border-[#E5E7EB] shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B2635] mx-auto mb-3" />
        <p className="text-xs text-gray-500">Loading store settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 1. Header Bar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-100 text-[#8B2635] rounded-lg">
              <Settings className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-gray-900">Store Settings & Social Links</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Update store-wide social profile URLs (Instagram, Facebook, WhatsApp) and concierge contact links displayed across the Navbar and Footer.
          </p>
        </div>
      </div>

      {/* 2. Alert Feedback */}
      {statusMessage.text && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-medium animate-in fade-in duration-150 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* 3. Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Social Media Channels Box */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#8B2635]" />
              <h3 className="text-sm font-bold text-gray-900">
                Navbar & Footer Social Channels
              </h3>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              Live on top-right Navbar & Footer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Instagram URL */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <i className="fa-brands fa-instagram text-[#E1306C] text-sm"></i>
                  <span>Instagram Profile URL *</span>
                </span>
                {formData.instagram_url && (
                  <a
                    href={formData.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#8B2635] hover:underline inline-flex items-center gap-1 font-normal"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </label>
              <input
                type="url"
                name="instagram_url"
                required
                value={formData.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/thegiftstudio"
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635] bg-gray-50/40"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Will open in a new tab when visitors click the Instagram icon in the navbar.
              </p>
            </div>

            {/* Facebook URL */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <i className="fa-brands fa-facebook-f text-[#1877F2] text-sm"></i>
                  <span>Facebook Page URL</span>
                </span>
                {formData.facebook_url && (
                  <a
                    href={formData.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#8B2635] hover:underline inline-flex items-center gap-1 font-normal"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </label>
              <input
                type="url"
                name="facebook_url"
                value={formData.facebook_url}
                onChange={handleChange}
                placeholder="https://facebook.com/thegiftstudio"
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635] bg-gray-50/40"
              />
            </div>

            {/* WhatsApp Link */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <i className="fa-brands fa-whatsapp text-[#25D366] text-sm"></i>
                  <span>WhatsApp Chat URL</span>
                </span>
                {formData.whatsapp_url && (
                  <a
                    href={formData.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#8B2635] hover:underline inline-flex items-center gap-1 font-normal"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </label>
              <input
                type="url"
                name="whatsapp_url"
                value={formData.whatsapp_url}
                onChange={handleChange}
                placeholder="https://wa.me/917506210892"
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635] bg-gray-50/40"
              />
            </div>
          </div>
        </div>

        {/* Concierge & Direct Contact Details */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#8B2635]" />
              <h3 className="text-sm font-bold text-gray-900">
                Concierge Contact Numbers
              </h3>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              Used for bulk corporate inquiries
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Bulk Corporate WhatsApp Number (with country code)
              </label>
              <input
                type="text"
                name="bulk_enquiry_phone"
                value={formData.bulk_enquiry_phone}
                onChange={handleChange}
                placeholder="917506210892"
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635] bg-gray-50/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Official Support / Gifting Email
              </label>
              <input
                type="email"
                name="support_email"
                value={formData.support_email}
                onChange={handleChange}
                placeholder="contact@thegiftstudio.com"
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B2635] bg-gray-50/40"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#8B2635] hover:bg-[#701E2B] transition shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50 border-none"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
