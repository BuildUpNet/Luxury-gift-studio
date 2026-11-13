import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, MessageCircle, Gift, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';
import { resolveImageUrl } from '../utils/image';

export default function GiftingBannerSection() {
  const [bannerConfig, setBannerConfig] = useState({
    eyebrow: 'BESPOKE GIFTING & BULK ORDERS',
    heading: 'Curate Your Custom Gift Hamper',
    subheading: 'Celebrate Diwali, weddings, and corporate milestones with handcrafted luxury hampers tailored to your taste.',
    button_text: 'Request Custom Quote →',
    bg_image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop',
    overlay_opacity: 0.65,
    is_active: 1
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city_pincode: '',
    message: '',
    agreedToTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Fetch active banner config on mount
  useEffect(() => {
    let isMounted = true;
    const fetchBanner = async () => {
      try {
        const data = await apiService.getGiftingBanner();
        if (data && data.success && data.banner && isMounted) {
          setBannerConfig((prev) => ({
            ...prev,
            ...data.banner
          }));
        }
      } catch (err) {
        console.warn('Using default gifting banner config:', err.message);
      }
    };

    fetchBanner();
    return () => {
      isMounted = false;
    };
  }, []);

  // Form input change handlers
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Client-side quick validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (!formData.phone.trim() || cleanPhone.length < 8) {
      setSubmitError('Please enter a valid mobile number (min 8 digits).');
      return;
    }
    if (!formData.city_pincode.trim()) {
      setSubmitError('Please enter your delivery city or pincode.');
      return;
    }
    if (!formData.agreedToTerms) {
      setSubmitError('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city_pincode: formData.city_pincode.trim(),
        message: formData.message.trim(),
        agreed_to_terms: formData.agreedToTerms
      };
      const res = await apiService.submitGiftingInquiry(payload);
      if (res && res.success) {
        setSubmittedData({
          ...formData,
          inquiryId: res.inquiryId || res.inquiry?.id
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          city_pincode: '',
          message: '',
          agreedToTerms: false
        });
      } else {
        setSubmitError(res?.message || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      setSubmitError(err?.data?.message || err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If set to inactive by admin, don't display
  if (bannerConfig.is_active === 0 || bannerConfig.is_active === false) {
    return null;
  }

  const bgImageUrl = resolveImageUrl(
    bannerConfig.bg_image,
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop'
  );

  const overlayOpacity = Math.max(0, Math.min(1, parseFloat(bannerConfig.overlay_opacity) || 0.65));

  // Dynamic high-contrast luxury heading rendering
  const renderLuxuryHeading = (rawHeading) => {
    const text = (rawHeading || 'Curate Your Custom Gift Hamper').trim();
    if (text.toLowerCase() === 'curate your custom gift hamper') {
      return (
        <>
          <span className="text-[#FFFFFF]">Curate Your </span>
          <span
            className="text-[#FFE082] block sm:inline font-bold"
            style={{ textShadow: '0 2px 14px rgba(0, 0, 0, 0.75)' }}
          >
            Custom Gift Hamper
          </span>
        </>
      );
    }

    const words = text.split(' ');
    if (words.length > 2) {
      const firstPart = words.slice(0, 2).join(' ') + ' ';
      const secondPart = words.slice(2).join(' ');
      return (
        <>
          <span className="text-[#FFFFFF]">{firstPart}</span>
          <span
            className="text-[#FFE082] block sm:inline font-bold"
            style={{ textShadow: '0 2px 14px rgba(0, 0, 0, 0.75)' }}
          >
            {secondPart}
          </span>
        </>
      );
    }

    return (
      <span
        className="text-[#FFE082] font-bold"
        style={{ textShadow: '0 2px 14px rgba(0, 0, 0, 0.75)' }}
      >
        {text}
      </span>
    );
  };

  return (
    <section
      id="custom-gifting-banner"
      className="w-full my-6 sm:my-10"
      style={{
        maxWidth: '1360px',
        margin: '28px auto',
        padding: '0 24px',
        boxSizing: 'border-box'
      }}
    >
      {/* Banner Frame with Hairline Gold Border & Soft Ambient Box-Shadow */}
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: '#0d0d0d',
          minHeight: '520px',
          border: '1px solid rgba(244, 201, 93, 0.35)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Dynamic Background Image with Smooth Slow Zoom Micro-interaction */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            backgroundImage: `url("${bgImageUrl}")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Directional Dark Gradient Overlay: Left-to-right ensures crisp text contrast over any festive photo */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              'linear-gradient(90deg, rgba(10, 10, 14, 0.88) 0%, rgba(10, 10, 14, 0.65) 55%, rgba(10, 10, 14, 0.45) 100%)'
          }}
        />

        {/* Secondary Overlay Respecting Admin Opacity Config */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: `rgba(10, 10, 14, ${Math.max(0.15, overlayOpacity * 0.4)})`
          }}
        />

        {/* Ambient Warm-Gold Glow Accent */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, #F4C95D 0%, transparent 70%)' }}
        />

        {/* Content Grid: Left Column 38% Branding & Text / Right Column 62% Interactive Form */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12 items-center">
          
          {/* Left Column (approx 38% width on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-5 text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full w-fit bg-[#F4C95D]/10 border border-[#F4C95D]/40 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FFE082]" />
              <span className="text-[11px] font-bold tracking-[0.14em] text-[#FFE082] uppercase">
                {bannerConfig.eyebrow || 'BESPOKE GIFTING & BULK ORDERS'}
              </span>
            </div>

            {/* Main Heading: Pure White + Luminous Champagne-Gold (#FFE082) */}
            <h2
              className="font-heading font-bold tracking-tight leading-[1.15]"
              style={{
                fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.75)'
              }}
            >
              {renderLuxuryHeading(bannerConfig.heading)}
            </h2>

            {/* Subtitle in High-Contrast Warm Off-White (#F3F4F6) */}
            <p
              className="text-[#F3F4F6] text-sm sm:text-base leading-relaxed font-normal max-w-lg"
              style={{ textShadow: '0 1px 8px rgba(0, 0, 0, 0.6)' }}
            >
              {bannerConfig.subheading ||
                'Celebrate Diwali, weddings, and corporate milestones with handcrafted luxury hampers tailored to your taste.'}
            </p>

            {/* 3 Sleek Dark-Glass Badges with Gold Icons */}
            <div className="pt-2 sm:pt-4 flex flex-wrap gap-2.5">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 224, 130, 0.35)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFE082] shrink-0" />
                <span className="text-xs text-white font-medium tracking-wide">Artisanal Gourmet</span>
              </div>

              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 224, 130, 0.35)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
                }}
              >
                <Gift className="w-3.5 h-3.5 text-[#FFE082] shrink-0" />
                <span className="text-xs text-white font-medium tracking-wide">Bespoke Curation</span>
              </div>

              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 224, 130, 0.35)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
                }}
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#FFE082] shrink-0" />
                <span className="text-xs text-white font-medium tracking-wide">Pan-India Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column (approx 62% width on desktop — Interactive Glass Form) */}
          <div className="lg:col-span-7">
            <div
              className="rounded-2xl p-6 sm:p-8 transition-all duration-300"
              style={{
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                background: 'rgba(15, 15, 20, 0.78)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 45px rgba(0, 0, 0, 0.45)'
              }}
            >
              {submittedData ? (
                /* Celebratory Thank You & Confirmation Card */
                <div className="py-6 sm:py-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#F4C95D]/20 text-[#FFE082] mx-auto flex items-center justify-center border border-[#F4C95D]/50 shadow-[0_0_24px_rgba(244,201,93,0.35)]">
                    <CheckCircle2 className="w-9 h-9 text-[#FFE082]" />
                  </div>

                  <div>
                    <h3
                      className="font-heading text-xl sm:text-2xl font-bold tracking-wide"
                      style={{
                        color: '#FFFFFF',
                        textShadow: '0 2px 14px rgba(0, 0, 0, 0.75)'
                      }}
                    >
                      <span style={{ color: '#FFFFFF' }}>Quote Request Received</span>
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto mt-2 leading-relaxed">
                      Our gifting concierge will reach out within 24 hours & we've sent a confirmation to{' '}
                      <span className="text-[#FFE082] font-semibold">{submittedData.email}</span>.
                    </p>
                  </div>

                  {/* Summary of Submitted Details */}
                  <div
                    className="max-w-md mx-auto rounded-xl p-4 text-left border border-white/10 text-xs space-y-2.5"
                    style={{ background: 'rgba(255, 255, 255, 0.04)' }}
                  >
                    <div className="text-[10px] uppercase font-bold text-[#FFE082] tracking-wider border-b border-white/10 pb-1.5 flex items-center justify-between">
                      <span>Inquiry Summary</span>
                      {submittedData.inquiryId && (
                        <span className="text-slate-400">ID #{submittedData.inquiryId}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Client Name:</span>
                      <span className="text-white font-medium">{submittedData.name}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Mobile Number:</span>
                      <span className="text-white font-medium">{submittedData.phone}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Delivery Location:</span>
                      <span className="text-white font-medium">{submittedData.city_pincode}</span>
                    </div>
                    {submittedData.message && (
                      <div className="flex flex-col gap-1 text-slate-300 pt-1 border-t border-white/5">
                        <span className="text-[11px] text-slate-400">Message / Requirements:</span>
                        <span className="text-white font-normal whitespace-pre-wrap leading-relaxed bg-white/[0.03] p-2 rounded border border-white/10">
                          {submittedData.message}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmittedData(null)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-[#0d0d0d] bg-[#F4C95D] hover:bg-[#FFE082] transition-all transform hover:scale-105 shadow-[0_4px_16px_rgba(244,201,93,0.35)] cursor-pointer border-none"
                    >
                      <span>Submit Another Request</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive Hamper Inquiry Form */
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {/* Error Notification */}
                  {submitError && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* 2x2 Grid of Input Fields with Floating Micro-Labels & High Contrast */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* 1. Full Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                        Your Full Name <span className="text-[#FFE082]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-slate-300/75 bg-white/[0.06] border border-white/25 focus:border-[#F4C95D] focus:bg-white/[0.1] focus:outline-none transition-all duration-200 hover:border-white/40 hover:-translate-y-[1px]"
                        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 3px rgba(244, 201, 93, 0.2)')}
                        onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      />
                    </div>

                    {/* 2. Email Address */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-[#FFE082]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-slate-300/75 bg-white/[0.06] border border-white/25 focus:border-[#F4C95D] focus:bg-white/[0.1] focus:outline-none transition-all duration-200 hover:border-white/40 hover:-translate-y-[1px]"
                        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 3px rgba(244, 201, 93, 0.2)')}
                        onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      />
                    </div>

                    {/* 3. Mobile Number */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                        Mobile Number <span className="text-[#FFE082]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Enter mobile number"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-slate-300/75 bg-white/[0.06] border border-white/25 focus:border-[#F4C95D] focus:bg-white/[0.1] focus:outline-none transition-all duration-200 hover:border-white/40 hover:-translate-y-[1px]"
                        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 3px rgba(244, 201, 93, 0.2)')}
                        onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      />
                    </div>

                    {/* 4. Delivery City or Pincode */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                        Delivery City / Pincode <span className="text-[#FFE082]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter delivery city or pincode"
                        value={formData.city_pincode}
                        onChange={(e) => handleChange('city_pincode', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-slate-300/75 bg-white/[0.06] border border-white/25 focus:border-[#F4C95D] focus:bg-white/[0.1] focus:outline-none transition-all duration-200 hover:border-white/40 hover:-translate-y-[1px]"
                        onFocus={(e) => (e.target.style.boxShadow = '0 0 0 3px rgba(244, 201, 93, 0.2)')}
                        onBlur={(e) => (e.target.style.boxShadow = 'none')}
                      />
                    </div>
                  </div>

                  {/* Full-Width Message / Requirements Textarea */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                      Message / Requirements
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Tell us about your occasion, quantity, budget, or custom hamper preferences..."
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-slate-300/75 bg-white/[0.06] border border-white/25 focus:border-[#F4C95D] focus:bg-white/[0.1] focus:outline-none transition-all duration-200 hover:border-white/40 resize-y"
                      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 3px rgba(244, 201, 93, 0.2)')}
                      onBlur={(e) => (e.target.style.boxShadow = 'none')}
                    />
                  </div>

                  {/* Mandatory Terms & Conditions Checkbox */}
                  <div className="pt-0.5">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-200 hover:text-white transition select-none">
                      <input
                        type="checkbox"
                        required
                        checked={formData.agreedToTerms}
                        onChange={(e) => handleChange('agreedToTerms', e.target.checked)}
                        className="w-4 h-4 rounded border-white/30 text-[#F4C95D] focus:ring-[#F4C95D]/40 bg-white/10 cursor-pointer accent-[#F4C95D]"
                      />
                      <span className="font-medium text-[11px] sm:text-xs">
                        I agree to all Terms &amp; Conditions and Privacy Policy. <span className="text-[#FFE082]">*</span>
                      </span>
                    </label>
                  </div>

                  {/* Submit Button Row */}
                  <div className="pt-2 border-t border-white/10 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.agreedToTerms}
                      className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-[#111111] bg-[#F4C95D] hover:bg-[#ffcf66] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_22px_rgba(244,201,93,0.4)] hover:shadow-[0_8px_32px_rgba(244,201,93,0.6)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none cursor-pointer border-none"
                    >
                      {/* Diagonal Shimmer Sweep Animation on Hover */}
                      <span
                        className="absolute inset-0 w-full h-full pointer-events-none transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent)'
                        }}
                      />

                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
                          <span className="relative z-10">Submitting Quote Request...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10">{bannerConfig.button_text || 'Request Custom Quote'}</span>
                          <ArrowRight className="w-4 h-4 text-[#111111] transition-transform duration-300 group-hover:translate-x-1.5 relative z-10" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
