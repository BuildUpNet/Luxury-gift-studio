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
} from 'lucide-react';
import { TESTIMONIALS as FALLBACK_TESTIMONIALS } from '../data/giftStudioData';
import { apiService } from '../services/api';
import resolveImageUrl from '../utils/image';
import { formatTimeAgo } from '../utils/date';
import { getCachedData, setCachedData, CACHE_KEYS } from '../utils/cache';

const INITIAL_FALLBACK = FALLBACK_TESTIMONIALS.map((t, idx) => ({
  id: `fallback-${idx}`,
  customer_name: t.author,
  city: t.location,
  review_text: t.quote,
  rating: t.stars || 5,
  occasion: 'Celebration',
  created_at: new Date(Date.now() - (idx + 1) * 86400000 * 3).toISOString()
}));

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(() => {
    const cached = getCachedData(CACHE_KEYS.TESTIMONIALS, null);
    if (Array.isArray(cached) && cached.length > 0) return cached;
    return INITIAL_FALLBACK;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTestimonials() {
      try {
        const res = await apiService.getTestimonials({ limit: 6 });
        if (res?.success && Array.isArray(res.testimonials) && res.testimonials.length > 0) {
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

  const displayList = testimonials.length > 0 ? testimonials.slice(0, 3) : FALLBACK_TESTIMONIALS;

  return (
    <section className="max-w-7xl mx-auto my-14 sm:my-20 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8DFD3] text-[#C62828] text-[11px] font-bold tracking-widest uppercase mb-2.5 shadow-2xs">
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

      {/* Testimonials FNP-Style Cards Grid */}
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
              className="bg-white rounded-2xl border border-[#E8DFD3] p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-[#D8C7B2] transition duration-300 relative group"
            >
              <div>
                {/* 1. Header Row: Customer Avatar, Name, Verified Badge, Time Ago */}
                <div className="flex items-center justify-between gap-3 mb-3.5 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3 min-w-0">
                    {avatar ? (
                      <img
                        src={resolveImageUrl(avatar)}
                        alt={name}
                        className="w-11 h-11 rounded-full object-cover border border-[#E8DFD3] shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = '/images/gift_logo.jpeg';
                        }}
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#FAF7F2] border border-[#E8DFD3] text-[#8B2635] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        {name.substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                          {name}
                        </h4>
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                          title="Verified Reviewer"
                        />
                      </div>
                      <span className="text-[11px] text-stone-400 block font-normal">
                        {timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* FNP Style Star Rating Pill (Green Background or Star Group) */}
                  <div className="flex items-center gap-1 bg-[#0A8754] text-white px-2 py-0.5 rounded text-[11px] font-bold shrink-0 shadow-2xs">
                    <span>{Number(t.rating || 5).toFixed(1)}</span>
                    <Star className="w-3 h-3 fill-white text-white" />
                  </div>
                </div>

                {/* 2. Review Text Quote */}
                <div className="relative mb-4">
                  <Quote className="w-4 h-4 text-stone-300 absolute -top-1 -left-1 opacity-50" />
                  <p className="text-xs sm:text-sm text-stone-700 italic pl-3 leading-relaxed line-clamp-4">
                    "{quote}"
                  </p>
                </div>
              </div>

              {/* 3. Footer: Occasion Tag & City Tag */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap text-[11px]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {t.occasion && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold text-[#8B2635] bg-[#FAF7F2] border border-[#E8DFD3]">
                      {t.occasion}
                    </span>
                  )}
                  {location && (
                    <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full font-medium text-stone-600 bg-stone-50 border border-stone-200">
                      <MapPin className="w-2.5 h-2.5 text-stone-400" />
                      <span>{location}</span>
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-stone-400 italic">
                  Verified Buyer
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. "Show All Reviews" Button */}
      <div className="mt-10 sm:mt-12 text-center">
        <Link
          to="/testimonials"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200 hover:opacity-95 no-underline group"
          style={{ backgroundColor: '#8B2635' }}
        >
          <span>Show All Reviews</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
