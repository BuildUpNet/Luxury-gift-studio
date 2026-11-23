import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from './FaIcons';
import { STORE_INFO } from '../data/giftStudioData';
import { apiService } from '../services/api';
import { getCachedData, CACHE_KEYS } from '../utils/cache';

const DEFAULT_SETTINGS = {
  facebook_url: 'https://facebook.com/thegiftstudio',
  whatsapp_url: 'https://wa.me/917506210892',
  instagram_url: 'https://instagram.com/thegiftstudio',
  bulk_enquiry_phone: '917506210892',
  support_email: 'modient93@gmail.com'
};

export default function Footer() {
  const [storeSettings, setStoreSettings] = useState(() => {
    return getCachedData(CACHE_KEYS.STORE_SETTINGS, DEFAULT_SETTINGS);
  });

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      try {
        const res = await apiService.getSettings();
        if (res?.success && res?.settings && isMounted) {
          setStoreSettings(res.settings);
        }
      } catch (err) {
        // Fallback silently to cached / default settings
      }
    };
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const phoneNum = storeSettings.bulk_enquiry_phone || STORE_INFO.phone;
  const emailAddr = storeSettings.support_email || STORE_INFO.email;
  const waUrl = storeSettings.whatsapp_url || `https://wa.me/91${phoneNum}`;
  const fbUrl = storeSettings.facebook_url || 'https://facebook.com';
  const igUrl = storeSettings.instagram_url || 'https://instagram.com';

  return (
    <footer className="w-full bg-[#111D16] text-stone-300 font-sans text-sm border-t border-[#2D4737]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="md:col-span-5 lg:col-span-5 space-y-4">
            <Link to="/" className="inline-block no-underline">
              <div className="flex items-center gap-3">
                <img
                  src="/images/gift_logo.jpeg"
                  alt={STORE_INFO.name}
                  className="h-10 w-auto object-contain rounded bg-white p-1"
                />
                <span className="text-white font-serif font-bold text-lg tracking-wide">
                  {STORE_INFO.name}
                </span>
              </div>
            </Link>

            <h3 className="text-white text-base font-semibold tracking-wide pt-1">
              About us
            </h3>

            <p className="text-[#9e9e9e] text-sm leading-relaxed max-w-md m-0">
              {STORE_INFO.name} brings you bespoke luxury hampers, curated gourmet celebration boxes, and unforgettable artisanal gifts crafted with excellence for every special occasion.
            </p>
          </div>

          <div className="md:col-span-3 lg:col-span-3">
            <h3 className="text-white text-base font-semibold tracking-wide mb-4">
              Information
            </h3>
            <ul className="space-y-2.5 list-none p-0 m-0 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-xs text-gray-500">○</span>
                <Link
                  to="/"
                  className="text-[#b0b0b0] hover:text-white transition-colors duration-200 no-underline"
                >
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xs text-gray-500">○</span>
                <Link
                  to="/category"
                  className="text-[#b0b0b0] hover:text-white transition-colors duration-200 no-underline"
                >
                  All Categories
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xs text-gray-500">○</span>
                <Link
                  to="/testimonials"
                  className="text-[#b0b0b0] hover:text-white transition-colors duration-200 no-underline"
                >
                  Client Reviews & Stories
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xs text-gray-500">○</span>
                <Link
                  to="/contact"
                  className="text-[#b0b0b0] hover:text-white transition-colors duration-200 no-underline"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-4 space-y-4">
            <h3 className="text-white text-base font-semibold tracking-wide mb-4">
              Our Contacts
            </h3>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-[#b0b0b0] leading-snug">
                  Aggarwal Street, Lehragaga, Punjab 148031
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a
                  href={`mailto:${emailAddr}`}
                  className="text-[#b0b0b0] hover:text-[#D4AF37] transition-colors duration-200 no-underline"
                >
                  {emailAddr}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a
                  href={`tel:+91${phoneNum}`}
                  className="text-[#b0b0b0] hover:text-[#D4AF37] transition-colors duration-200 no-underline"
                >
                  +91 {phoneNum}
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-[#2e2e2e]/60 flex items-center gap-3">
          {fbUrl && (
            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-[#1C3024] border border-[#2D4737] text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#223B2D] flex items-center justify-center transition-all duration-200 no-underline shadow-xs hover:scale-105"
            >
              <i className="fa-brands fa-facebook-f text-sm"></i>
            </a>
          )}
          {igUrl && (
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-[#1C3024] border border-[#2D4737] text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#223B2D] flex items-center justify-center transition-all duration-200 no-underline shadow-xs hover:scale-105"
            >
              <i className="fa-brands fa-instagram text-sm"></i>
            </a>
          )}
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-8 h-8 rounded-full bg-[#1C3024] border border-[#2D4737] text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#223B2D] flex items-center justify-center transition-all duration-200 no-underline shadow-xs hover:scale-105"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
            </a>
          )}
        </div>
      </div>

      <div className="bg-[#181818] py-4 border-t border-[#2a2a2a] text-xs text-[#737373]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="m-0">
            © {new Date().getFullYear()} {STORE_INFO.name}. All Rights Reserved.
          </p>
          <p className="m-0 text-[#666]">
            Crafted with excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}
