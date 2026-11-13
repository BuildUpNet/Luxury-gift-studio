import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URLS } from '../config/api';
import { STORE_INFO } from '../data/giftStudioData';

export default function ContactPage() {
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

      // Clear form on success
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
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: '#FAF7F2' }}>
      {/* Shared Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 py-12 md:py-16" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Title Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#07111E] bg-gray-100 px-3 py-1 rounded-full inline-block mb-3">
              Get in Touch
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-950 tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Have a question about our bespoke hampers, corporate gifting or order delivery? We are here to help you craft unforgettable experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Contact Information Cards */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs">
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">
                  Customer Concierge
                </h2>

                <div className="space-y-6">
                  
                  {/* Phone / WhatsApp */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#07111E] text-white flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-amber-200" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Call or WhatsApp
                      </h3>
                      <a
                        href={`https://wa.me/91${STORE_INFO.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-semibold text-gray-900 hover:text-amber-800 transition no-underline block"
                      >
                        +91 {STORE_INFO.phone}
                      </a>
                      <p className="text-xs text-gray-500 mt-0.5">Mon - Sat, 9:30 AM to 7:00 PM</p>
                    </div>
                  </div>

                  {/* Email Support */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#07111E] text-white flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-amber-200" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Email Support
                      </h3>
                      <a
                        href={`mailto:${STORE_INFO.email}`}
                        className="text-base font-semibold text-gray-900 hover:text-amber-800 transition no-underline block"
                      >
                        {STORE_INFO.email}
                      </a>
                      <p className="text-xs text-gray-500 mt-0.5">We typically respond within 24 hours</p>
                    </div>
                  </div>

                  {/* Headquarters / Studio */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#07111E] text-white flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-amber-200" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Gifting Studio
                      </h3>
                      <p className="text-sm font-semibold text-gray-900">
                        The Gift Studio | Nature's Basket
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Mumbai, Delhi NCR, Bengaluru, Kolkata, Hyderabad, Pune, Chennai
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#07111E] text-white flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-amber-200" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Corporate & Bulk Orders
                      </h3>
                      <p className="text-sm text-gray-700">
                        Dedicated concierge available for custom branding and pan-India multi-address shipping.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Direct Quick WhatsApp Card */}
              <div className="bg-[#07111E] text-white rounded-xl p-6 sm:p-7 shadow-xs">
                <h3 className="font-serif text-lg font-bold mb-2">Need an instant response?</h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Chat directly with our gifting experts on WhatsApp for fast hamper recommendations and tracking updates.
                </p>
                <a
                  href={`https://wa.me/91${STORE_INFO.phone}?text=Hi,%20I%20have%20an%20enquiry%20regarding%20The%20Gift%20Studio`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition duration-200 no-underline shadow-xs"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-10 shadow-xs">
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
                  Send us a Message
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-8">
                  Fill in the details below and our team will get back to you shortly.
                </p>

                {/* Status Messages */}
                {status.success && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3 text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-bold">Thank you for reaching out!</p>
                      <p className="mt-0.5 text-xs text-emerald-800">
                        Your message has been received. A confirmation has been sent to your email, and our concierge team will respond shortly.
                      </p>
                    </div>
                  </div>
                )}

                {status.error && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-900">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-bold">Unable to send message</p>
                      <p className="mt-0.5 text-xs text-rose-800">{status.error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-5">
                  
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Full Name <span className="text-rose-600">*</span>
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
                      className={`w-full px-4 py-3 bg-[#F9F9F9] border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition ${
                        formErrors.name
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-gray-200 focus:border-gray-900'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-xs text-rose-600 mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Email Address <span className="text-rose-600">*</span>
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
                      className={`w-full px-4 py-3 bg-[#F9F9F9] border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition ${
                        formErrors.email
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-gray-200 focus:border-gray-900'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-xs text-rose-600 mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Subject <span className="text-rose-600">*</span>
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
                      className={`w-full px-4 py-3 bg-[#F9F9F9] border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition ${
                        formErrors.subject
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-gray-200 focus:border-gray-900'
                      }`}
                    />
                    {formErrors.subject && (
                      <p className="text-xs text-rose-600 mt-1">{formErrors.subject}</p>
                    )}
                  </div>

                  {/* Message / Query */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Message / Query <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={status.submitting}
                      placeholder="Please share details about your requirement, destination city, delivery dates, or specific questions..."
                      className={`w-full px-4 py-3 bg-[#F9F9F9] border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition resize-y ${
                        formErrors.message
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-gray-200 focus:border-gray-900'
                      }`}
                    />
                    {formErrors.message && (
                      <p className="text-xs text-rose-600 mt-1">{formErrors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status.submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#020919] hover:bg-[#1a2233] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-8 py-3.5 rounded-lg transition duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {status.submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
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

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}

