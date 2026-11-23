import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock } from '../components/FaIcons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URLS } from '../config/api';
import { STORE_INFO } from '../data/giftStudioData';

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact Us | The Gift Studio';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Name cannot exceed 100 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    } else if (formData.email.trim().length > 254) {
      errors.email = 'Email cannot exceed 254 characters';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    } else if (formData.subject.trim().length > 200) {
      errors.subject = 'Subject cannot exceed 200 characters';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length > 5000) {
      errors.message = 'Message cannot exceed 5000 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (status.error) {
      setStatus((prev) => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setStatus({ submitting: true, success: false, error: null });

    try {
      const response = await fetch(API_URLS.submitContact(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim()
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send your message. Please try again later.');
      }

      setStatus({
        submitting: false,
        success: true,
        error: null
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setFormErrors({});
    } catch (err) {
      setStatus({
        submitting: false,
        success: false,
        error: err.message || 'An unexpected error occurred. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#15241B]">
      <Header />

      <main className="flex-1 py-12 md:py-16 bg-[#15241B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] bg-[#223B2D] border border-[#2D4737] px-3.5 py-1 rounded-full inline-block mb-3 shadow-2xs">
              Get in Touch
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              Have a question about our bespoke hampers, gifting solutions or order delivery? We are here to help you craft unforgettable experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xl">
                <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
                  Customer Concierge
                </h2>

                <div className="space-y-3.5">
                  
                  <div className="flex items-start gap-4 p-4 rounded-xl border border-stone-100 hover:border-[#D4AF37]/50 hover:bg-[#FAF7F2] hover:shadow-md transition-all duration-300 hover:translate-x-1.5 group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-[#15241B] text-[#D4AF37] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[#8B2635] group-hover:text-white group-hover:scale-110 shadow-sm">
                      <Phone className="w-5 h-5 transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                        Call or WhatsApp
                      </h3>
                      <a
                        href={`https://wa.me/91${STORE_INFO.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold text-stone-900 hover:text-[#8B2635] transition-colors no-underline block"
                      >
                        +91 {STORE_INFO.phone}
                      </a>
                      <p className="text-xs text-stone-500 mt-0.5 m-0">Mon - Sat, 9:30 AM to 7:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl border border-stone-100 hover:border-[#D4AF37]/50 hover:bg-[#FAF7F2] hover:shadow-md transition-all duration-300 hover:translate-x-1.5 group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-[#15241B] text-[#D4AF37] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[#8B2635] group-hover:text-white group-hover:scale-110 shadow-sm">
                      <Mail className="w-5 h-5 transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                        Email Support
                      </h3>
                      <a
                        href={`mailto:${STORE_INFO.email}`}
                        className="text-base font-bold text-stone-900 hover:text-[#8B2635] transition-colors no-underline block"
                      >
                        {STORE_INFO.email}
                      </a>
                      <p className="text-xs text-stone-500 mt-0.5 m-0">We typically respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl border border-stone-100 hover:border-[#D4AF37]/50 hover:bg-[#FAF7F2] hover:shadow-md transition-all duration-300 hover:translate-x-1.5 group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-[#15241B] text-[#D4AF37] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[#8B2635] group-hover:text-white group-hover:scale-110 shadow-sm">
                      <MapPin className="w-5 h-5 transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                        Gifting Studio
                      </h3>
                      <p className="text-sm font-semibold text-stone-800 m-0">
                        Aggarwal Street, Lehragaga, Punjab 148031
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="bg-gradient-to-br from-[#1C3024] to-[#122018] text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-[#2D4737] transition-all duration-300 hover:shadow-2xl hover:border-emerald-500/40">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Instant Concierge
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2 tracking-wide">
                  Need an instant response?
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-5">
                  Chat directly with our gifting experts on WhatsApp for fast hamper recommendations, personalized curation and tracking updates.
                </p>
                <a
                  href={`https://wa.me/91${STORE_INFO.phone}?text=Hi,%20I%20have%20an%20enquiry%20regarding%20The%20Gift%20Studio`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0f7a6e] text-white text-sm font-bold py-3.5 px-5 rounded-xl transition-all duration-300 no-underline shadow-md hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] border border-white/10"
                >
                  <i className="fa-brands fa-whatsapp text-lg shrink-0"></i>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-10 shadow-2xl">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                  Send us a Message
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mb-8">
                  Fill in the details below and our team will get back to you shortly.
                </p>

                {status.success && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-900 shadow-sm animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-bold">Thank you for reaching out!</p>
                      <p className="mt-0.5 text-xs text-emerald-800">
                        Your message has been received. A notification has been delivered directly to modient93@gmail.com, and our concierge team will respond shortly.
                      </p>
                    </div>
                  </div>
                )}

                {status.error && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-900 shadow-sm animate-in fade-in">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-bold">Unable to send message</p>
                      <p className="mt-0.5 text-xs text-rose-800">{status.error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-5">
                  
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="off"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={status.submitting}
                      placeholder="e.g. Ananya Sharma"
                      className={`w-full px-4 py-3 bg-[#F9FAFB] hover:bg-white focus:bg-white border rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#15241B] focus:ring-2 focus:ring-[#D4AF37]/30 transition shadow-2xs ${
                        formErrors.name
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-stone-300'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-xs text-rose-500 font-medium mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="off"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={status.submitting}
                      placeholder="e.g. ananya@example.com"
                      className={`w-full px-4 py-3 bg-[#F9FAFB] hover:bg-white focus:bg-white border rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#15241B] focus:ring-2 focus:ring-[#D4AF37]/30 transition shadow-2xs ${
                        formErrors.email
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-stone-300'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-xs text-rose-500 font-medium mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      autoComplete="new-subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={status.submitting}
                      placeholder="e.g. Inquiry about Custom Corporate Hamper"
                      className={`w-full px-4 py-3 bg-[#F9FAFB] hover:bg-white focus:bg-white border rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#15241B] focus:ring-2 focus:ring-[#D4AF37]/30 transition shadow-2xs ${
                        formErrors.subject
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-stone-300'
                      }`}
                    />
                    {formErrors.subject && (
                      <p className="text-xs text-rose-500 font-medium mt-1">{formErrors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Message / Query <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={status.submitting}
                      placeholder="Please share details about your requirement, destination city, delivery dates, or specific questions..."
                      className={`w-full px-4 py-3 bg-[#F9FAFB] hover:bg-white focus:bg-white border rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#15241B] focus:ring-2 focus:ring-[#D4AF37]/30 transition resize-y shadow-2xs ${
                        formErrors.message
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-stone-300'
                      }`}
                    />
                    {formErrors.message && (
                      <p className="text-xs text-rose-500 font-medium mt-1">{formErrors.message}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status.submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#8B2635] hover:bg-[#721F2B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl hover:scale-102 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
                    >
                      {status.submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-white" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

