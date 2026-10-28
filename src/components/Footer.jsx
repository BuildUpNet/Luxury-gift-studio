import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import { STORE_INFO } from '../data/giftStudioData';

export default function Footer({ onSelectCategory }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#07111E] text-white">
      {/* 1. Newsletter / Subscribe Section */}
      <div className="bg-[#F9F8F6] border-t border-b border-[#E5E5E5] text-gray-900 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left max-w-xl">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-950 mb-2">
              Subscribe to The Gift Studio
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Be the first to know about new celebrity curations, festive hampers, and exclusive offers.
            </p>
          </div>

          <div className="w-full md:w-auto md:min-w-[420px]">
            {subscribed ? (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-5 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                <span>✓ Thank you for subscribing to our newsletter!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white border border-[#CCCCCC] rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-800 transition"
                />
                <button
                  type="submit"
                  className="bg-[#0B1320] hover:bg-[#1a2638] text-white text-sm font-semibold px-6 py-3 rounded-lg transition duration-200 shadow-sm whitespace-nowrap cursor-pointer active:scale-98"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Section (Rich Deep Navy-Black #07111E) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand Logo & Contacts */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-white">
                THE GIFT STUDIO
              </span>
              <span className="text-gray-600 font-light">|</span>
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                Nature's Basket
              </span>
            </div>

            <p className="text-sm text-[#D1D5DB] leading-relaxed max-w-sm">
              Buy premium gifts and luxury hampers online. Thoughtfully handcrafted celebrations, artisanal delights, and keepsake treasures delivered pan-India.
            </p>

            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/91${STORE_INFO.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-white hover:text-amber-200 transition group no-underline"
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                  <Phone className="w-4 h-4 text-[#07111E]" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] uppercase tracking-wider text-[#9CA3AF] block font-medium">Call or WhatsApp</span>
                  <span className="text-sm font-semibold text-white group-hover:text-amber-200 transition">
                    +91 {STORE_INFO.phone}
                  </span>
                </div>
              </a>

              <a
                href={`mailto:${STORE_INFO.email}`}
                className="flex items-center gap-3 text-white hover:text-amber-200 transition group no-underline"
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                  <Mail className="w-4 h-4 text-[#07111E]" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] uppercase tracking-wider text-[#9CA3AF] block font-medium">Email Support</span>
                  <span className="text-sm font-semibold text-white group-hover:text-amber-200 transition">
                    {STORE_INFO.email}
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Curated Hampers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5">
              Curated Hampers
            </h4>
            <ul className="space-y-3 text-sm text-[#D1D5DB] list-none p-0 m-0">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory('celebrity')}
                  className="hover:text-amber-200 hover:opacity-90 transition text-left cursor-pointer bg-transparent border-none p-0 text-inherit text-sm"
                >
                  Celebrity Hampers
                </button>
              </li>
              <li>
                <Link
                  to="/collections/diwali-hampers"
                  className="text-inherit hover:text-amber-200 hover:opacity-90 transition no-underline block"
                >
                  Diwali Hampers
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory('birthdays')}
                  className="hover:text-amber-200 hover:opacity-90 transition text-left cursor-pointer bg-transparent border-none p-0 text-inherit text-sm"
                >
                  Birthday Hampers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory('anniversary')}
                  className="hover:text-amber-200 hover:opacity-90 transition text-left cursor-pointer bg-transparent border-none p-0 text-inherit text-sm"
                >
                  Anniversary Hampers
                </button>
              </li>
              <li>
                <a
                  href="#build-hamper-section"
                  className="text-inherit hover:text-amber-200 hover:opacity-90 transition no-underline block"
                >
                  Create Your Own Hamper
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-[#D1D5DB] list-none p-0 m-0">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory('best-sellers')}
                  className="hover:text-amber-200 hover:opacity-90 transition text-left cursor-pointer bg-transparent border-none p-0 text-inherit text-sm"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory('corporate')}
                  className="hover:text-amber-200 hover:opacity-90 transition text-left cursor-pointer bg-transparent border-none p-0 text-inherit text-sm"
                >
                  Corporate Gifting
                </button>
              </li>
              <li>
                <Link
                  to="/collections/tgs-home"
                  className="text-inherit hover:text-amber-200 hover:opacity-90 transition no-underline block"
                >
                  Home Decor
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory('last-minute')}
                  className="hover:text-amber-200 hover:opacity-90 transition text-left cursor-pointer bg-transparent border-none p-0 text-inherit text-sm"
                >
                  Same Day Delivery
                </button>
              </li>
              <li>
                <Link
                  to="/collections/tgs-home"
                  className="text-inherit hover:text-amber-200 hover:opacity-90 transition no-underline block"
                >
                  Festive Decor & Diya Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5">
              Customer Care
            </h4>
            <ul className="space-y-3 text-sm text-[#D1D5DB] list-none p-0 m-0">
              <li>
                <span className="hover:text-amber-200 hover:opacity-90 transition cursor-pointer">
                  Track Order
                </span>
              </li>
              <li>
                <span className="hover:text-amber-200 hover:opacity-90 transition cursor-pointer">
                  Delivery Policy
                </span>
              </li>
              <li>
                <span className="hover:text-amber-200 hover:opacity-90 transition cursor-pointer">
                  Returns & Refunds
                </span>
              </li>
              <li>
                <span className="hover:text-amber-200 hover:opacity-90 transition cursor-pointer">
                  FAQs & Support
                </span>
              </li>
              <li>
                <span className="hover:text-amber-200 hover:opacity-90 transition cursor-pointer">
                  Bulk & Corporate Concierge
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. Bottom Copyright Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
          <p className="text-center sm:text-left m-0">
            © {new Date().getFullYear()} {STORE_INFO.name}. All Rights Reserved. Handcrafted with excellence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition cursor-pointer">Shipping & Delivery</span>
            <span className="hover:text-white transition cursor-pointer">Cancellation Policy</span>
            <Link to="/admin" className="hover:text-amber-300 text-gray-400 transition no-underline">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
