import React, { useEffect, useState } from 'react';
import { Sparkles } from './FaIcons';
import { apiService } from '../services/api';
import resolveImageUrl from '../utils/image';

export default function InfiniteHighlightsMarquee() {
  const [cards, setCards] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCards = async () => {
      try {
        const res = await apiService.getFeatureCards();
        if (res?.success && isMounted) {
          // Check if section is enabled and meets minimum cards requirement (5+ cards)
          if (res.is_visible && Array.isArray(res.cards) && res.cards.length >= (res.min_cards_required || 5)) {
            setCards(res.cards);
            setIsVisible(true);
          } else {
            setCards([]);
            setIsVisible(false);
          }
        }
      } catch (err) {
        console.error('Failed to load marquee cards:', err);
        if (isMounted) setIsVisible(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCards();
    return () => {
      isMounted = false;
    };
  }, []);

  // If loading or section is not visible (less than 5 cards OR toggled OFF by admin), do not render
  if (loading || !isVisible || cards.length < 5) {
    return null;
  }

  // Duplicate cards for seamless continuous infinite marquee
  const duplicatedCards = [...cards, ...cards, ...cards, ...cards];

  return (
    <section
      className="w-full py-14 sm:py-18 overflow-hidden relative select-none"
      style={{
        backgroundColor: '#EFE8DC',
        borderTop: '1px solid #E5DED5',
        borderBottom: '1px solid #E5DED5'
      }}
    >
      <div className="absolute inset-0 bg-radial from-emerald-600/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#D5E4D8] text-[#1B7A43] text-[11px] font-bold tracking-widest uppercase mb-2 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Gift Studio Experience</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Exceptional Craftsmanship &amp; Trust
        </h2>
      </div>

      <div className="relative w-full overflow-hidden marquee-container group/marquee">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-36 bg-gradient-to-r from-[#EFE8DC] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-36 bg-gradient-to-l from-[#EFE8DC] to-transparent z-10" />

        <div className="marquee-track flex items-stretch gap-6 py-3">
          {duplicatedCards.map((card, idx) => {
            const resolvedImg = card.image_url ? resolveImageUrl(card.image_url) : null;
            return (
              <div
                key={`${card.id}-${idx}`}
                className="highlight-card shrink-0 w-[290px] sm:w-[330px] bg-gradient-to-br from-[#FFFFFF] via-[#F8FCF9] to-[#EEF5F0] rounded-2xl border border-[#D0E0D4] p-5 shadow-[0_4px_16px_-4px_rgba(20,50,30,0.06)] hover:shadow-[0_22px_45px_-10px_rgba(27,122,67,0.2),0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:scale-[1.03] hover:border-[#1B7A43] flex items-start gap-4 cursor-pointer relative overflow-hidden group/card"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#1B7A43] to-emerald-400 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

                <div className="shrink-0 w-14 h-14 rounded-full bg-[#EAF3ED] border-2 border-[#CFE1D3] p-1 overflow-hidden shadow-2xs group-hover/card:scale-110 group-hover/card:rotate-3 group-hover/card:border-[#1B7A43] group-hover/card:shadow-md transition-all duration-300 flex items-center justify-center">
                  {resolvedImg ? (
                    <img
                      src={resolvedImg}
                      alt={card.title}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#EAF3ED] text-[#1B7A43] font-serif font-bold text-base flex items-center justify-center">
                      {card.title ? card.title.substring(0, 2).toUpperCase() : 'TG'}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover/card:text-[#1B7A43] transition-colors truncate">
                      {card.title}
                    </h3>
                    {card.badge_tag && (
                      <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100/70 text-[#1B7A43] border border-emerald-300/80 group-hover/card:bg-[#1B7A43] group-hover/card:text-white transition-all duration-300">
                        {card.badge_tag}
                      </span>
                    )}
                  </div>

                  {card.subtitle && (
                    <p className="text-xs font-semibold text-stone-700 truncate mb-1">
                      {card.subtitle}
                    </p>
                  )}

                  {card.description && (
                    <p className="text-[12px] text-stone-600 leading-relaxed line-clamp-2 m-0 font-normal">
                      {card.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
