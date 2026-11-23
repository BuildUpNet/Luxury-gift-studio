import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import resolveImageUrl from '../utils/image';

// Pure Brand Logo display - ONLY LOGO IMAGE, NO TEXT / BRAND NAMES ON UI
function PureBrandLogo({ card }) {
  const resolvedImg = card.image_url ? resolveImageUrl(card.image_url) : null;
  const [imgError, setImgError] = useState(false);

  if (!resolvedImg || imgError) {
    return null;
  }

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <img
        src={resolvedImg}
        alt=""
        loading="lazy"
        className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none pointer-events-none"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

export default function InfiniteHighlightsMarquee() {
  const [cards, setCards] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCards = async () => {
      try {
        const res = await apiService.getFeatureCards();
        if (res?.success && isMounted) {
          setIsEnabled(res.is_enabled !== false);
          if (Array.isArray(res.cards)) {
            // ONLY keep active cards that have an uploaded image from admin
            const validImageCards = res.cards.filter(
              (c) => c.is_active !== 0 && c.image_url && String(c.image_url).trim() !== ''
            );
            setCards(validImageCards);
          }
        }
      } catch (err) {
        console.error('Failed to load marquee cards:', err);
      }
    };
    fetchCards();
    return () => {
      isMounted = false;
    };
  }, []);

  // If section is turned off in admin or no dynamic logo images uploaded yet, do not render
  if (!isEnabled || cards.length === 0) {
    return null;
  }

  // Duplicate cards enough times to guarantee seamless infinite loop
  const repeatCount = Math.max(3, Math.ceil(18 / cards.length));
  const duplicatedCards = Array(repeatCount).fill(cards).flat();

  return (
    <section
      className="w-full py-16 sm:py-20 overflow-hidden relative select-none"
      style={{
        backgroundColor: '#15241B',
        borderTop: '1px solid #2D4737',
        borderBottom: '1px solid #2D4737'
      }}
    >
      {/* Luxury ambient glows */}
      <div className="absolute inset-0 bg-radial from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#182C20]/40 via-transparent to-[#111D16]/40 pointer-events-none" />

      {/* Header section matching Image 1 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C3024] border border-[#2D4737] text-xs font-semibold tracking-wider uppercase mb-3 shadow-xs">
          <span className="w-5 h-5 rounded-full bg-[#8B2635] text-white text-[10px] font-bold flex items-center justify-center">
            01
          </span>
          <span className="text-[#D4AF37] tracking-widest font-bold text-[11px]">TRUST</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          Brands we've worked with. <span className="text-[#D4AF37]">(40+)</span>
        </h2>

        <p className="mt-3 text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          A selection of the 40+ brands we've worked with, across retail, food, education, faith, events and technology.
        </p>
      </div>

      {/* Continuous Infinite Logo Marquee */}
      <div className="relative w-full overflow-hidden marquee-container group/marquee">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-44 bg-gradient-to-r from-[#15241B] via-[#15241B]/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-[#15241B] via-[#15241B]/80 to-transparent z-10" />

        <div className="marquee-track flex items-center gap-4 sm:gap-5 py-2">
          {duplicatedCards.map((card, idx) => (
            <div
              key={`${card.id || idx}-${idx}`}
              className="shrink-0 w-32 sm:w-36 h-20 sm:h-22 bg-gradient-to-b from-[#F7F3EC] to-[#EAE2D3] rounded-xl sm:rounded-2xl border border-[#D8CEBC] shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:border-[#8B2635] hover:shadow-[0_10px_24px_rgba(139,38,53,0.22)] hover:-translate-y-0.5 hover:scale-[1.03] transition-all duration-300 flex items-center justify-center p-2.5 sm:p-3 cursor-pointer group"
            >
              <PureBrandLogo card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
