import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Quote,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from './FaIcons';
import { apiService } from '../services/api';
import resolveImageUrl from '../utils/image';
import { formatTimeAgo } from '../utils/date';
import { getCachedData, setCachedData, CACHE_KEYS } from '../utils/cache';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(() => {
    const cached = getCachedData(CACHE_KEYS.TESTIMONIALS, null);
    if (Array.isArray(cached) && cached.length > 0) return cached;
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTestimonials() {
      try {
        const res = await apiService.getTestimonials({ limit: 6 });
        if (res?.success && Array.isArray(res.testimonials)) {
          if (isMounted) {
            setTestimonials(res.testimonials);
            setCachedData(CACHE_KEYS.TESTIMONIALS, res.testimonials);
          }
        }
      } catch (err) {
        console.error('Failed to load testimonials for frontend:', err);
      }
    }

    loadTestimonials();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayList = testimonials.slice(0, 3);
  if (displayList.length === 0) return null;

  return (
    <section
      className="w-full py-16 sm:py-20"
      style={{
        backgroundColor: '#E4EDE5',
        borderTop: '1px solid #BACBBD',
        borderBottom: '1px solid #BACBBD'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#D5E4D8] text-[#1B7A43] text-[11px] font-bold tracking-widest uppercase mb-2.5 shadow-2xs">
            <Sparkles className="w-3 h-3" />
            <span>Words Of Acclaim</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
            Celebrated Voices Echo Their Admiration
          </h2>
          <p className="mt-2 text-stone-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Read verified experiences from delighted clients who celebrated birthdays, Diwali, and grand milestones with our bespoke luxury hampers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((t, i) => {
            const starsCount = Math.round(Number(t.rating || t.stars || 5));
            const name = t.customer_name || t.author || 'Valued Client';
            const location = t.city || t.location;
            const quote = t.review_text || t.quote;
            const avatar = t.avatar_url;
            const timeAgo = formatTimeAgo(t.created_at);

            return (
              <div
                key={t.id || i}
                className="bg-gradient-to-br from-[#FFFFFF] via-[#F8FCF9] to-[#EEF5F0] rounded-2xl border border-[#D0E0D4] p-5 sm:p-6 flex flex-col justify-between shadow-[0_4px_16px_-4px_rgba(20,50,30,0.06)] hover:shadow-[0_24px_48px_-12px_rgba(27,122,67,0.18),0_8px_20px_rgba(0,0,0,0.06)] hover:border-[#1B7A43]/70 hover:-translate-y-2 hover:scale-[1.015] transition-all duration-300 ease-out relative group overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#1B7A43] to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-4 pb-3.5 border-b border-[#E1ECE3]">
                    <div className="flex items-center gap-3 min-w-0">
                      {avatar ? (
                        <img
                          src={resolveImageUrl(avatar)}
                          alt={name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-[#D0E0D4] group-hover:border-[#1B7A43] group-hover:scale-105 transition-all duration-300 shrink-0 shadow-2xs"
                          onError={(e) => {
                            e.currentTarget.src = '/images/gift_logo.jpeg';
                          }}
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[#EAF3ED] border-2 border-[#D0E0D4] text-[#1B7A43] group-hover:border-[#1B7A43] group-hover:scale-105 transition-all duration-300 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {name.substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-xs sm:text-sm text-stone-900 group-hover:text-[#1B7A43] transition-colors truncate">
                            {name}
                          </h4>
                          <CheckCircle2
                            className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                            title="Verified Reviewer"
                          />
                        </div>
                        <span className="text-[11px] text-stone-500 block font-normal">
                          {timeAgo}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-[#0A8754] text-white px-2 py-0.5 rounded text-[11px] font-bold shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                      <span>{Number(t.rating || 5).toFixed(1)}</span>
                      <Star className="w-3 h-3 fill-white text-white" />
                    </div>
                  </div>

                  <div className="relative mb-5">
                    <div className="w-7 h-7 rounded-full bg-[#EAF3ED] border border-[#D0E0D4] text-[#1B7A43] flex items-center justify-center mb-2.5 group-hover:bg-[#1B7A43] group-hover:text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-2xs">
                      <Quote className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 italic leading-relaxed line-clamp-4 font-normal">
                      "{quote}"
                    </p>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-[#E1ECE3] flex items-center justify-between gap-2 flex-wrap text-[11px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {t.occasion && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold text-[#1B7A43] bg-[#EAF3ED] border border-[#D0E0D4] group-hover:border-[#1B7A43]/50 transition-colors">
                        {t.occasion}
                      </span>
                    )}
                    {location && (
                      <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full font-medium text-stone-700 bg-[#F4FAF5] border border-[#D8E6DC]">
                        <MapPin className="w-2.5 h-2.5 text-stone-500" />
                        <span>{location}</span>
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-stone-500 font-medium italic">
                    Verified Buyer
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 no-underline group"
            style={{ backgroundColor: '#8B2635' }}
          >
            <span>Show All Reviews</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
