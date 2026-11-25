import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Sparkles,
  Gift,
  ShieldCheck,
  Truck,
  Star,
  MapPin,
  Quote,
  SlidersHorizontal,
  ChevronDown
} from '../components/FaIcons';
import { STORE_INFO } from '../data/giftStudioData';

// Theme Presets for Client Demonstrations
const THEMES = {
  lime: {
    id: 'lime',
    label: 'Fresh Lime Green',
    badge: '🌿 Lime Theme',
    pageBg: 'linear-gradient(180deg, #E8F3E6 0%, #E2EFE0 50%, #E8F3E6 100%)',
    pageText: '#1A2E20',
    cardBg: 'linear-gradient(135deg, #F5FAF3 0%, #E9F3E7 100%)',
    cardBorder: '#BCD8BE',
    headingColor: '#15241B',
    accentColor: '#2D6A4F',
    subTextColor: '#4A5568',
    subCardBg: 'rgba(223, 236, 224, 0.9)',
    subCardBorder: '#B5CEB7',
    subCardHoverBg: '#FFFFFF',
    subCardHoverBorder: '#2D6A4F',
    badgeBg: '#DFECE0',
    badgeText: '#2D6A4F',
    badgeBorder: '#A8CBAA',
    statNumber: '#15241B',
    statLabel: '#4A5568',
    quoteBg: '#15241B',
    quoteBorder: '#4E8B5E',
    quoteText: '#FFFFFF',
    quoteAccent: '#A3E635'
  },
  dark: {
    id: 'dark',
    label: 'Dark Emerald & Gold / Red',
    badge: '🌲 Dark & Gold/Red',
    pageBg: '#15241B',
    pageText: '#E5E7EB',
    cardBg: 'linear-gradient(135deg, #1C2F24 0%, #15241B 100%)',
    cardBorder: 'rgba(244, 201, 93, 0.45)',
    headingColor: '#FFFFFF',
    accentColor: '#FFE082',
    subTextColor: '#D1D5DB',
    subCardBg: 'rgba(17, 29, 22, 0.85)',
    subCardBorder: 'rgba(212, 175, 55, 0.35)',
    subCardHoverBg: '#223B2D',
    subCardHoverBorder: '#FFE082',
    badgeBg: '#8B2635', // Modi royal red
    badgeText: '#FFE082', // Yellowish gold
    badgeBorder: 'rgba(244, 201, 93, 0.7)',
    statNumber: '#FFE082',
    statLabel: '#CBD5E1',
    quoteBg: '#0F1A13',
    quoteBorder: '#C83232', // Red accent border
    quoteText: '#FFFFFF',
    quoteAccent: '#FFE082'
  },
  ivory: {
    id: 'ivory',
    label: 'Royal Ivory & Warm Cream',
    badge: '🥛 Royal Ivory',
    pageBg: '#FAF7F2',
    pageText: '#1A202C',
    cardBg: '#FFFFFF',
    cardBorder: '#E2D9C8',
    headingColor: '#15241B',
    accentColor: '#B8860B',
    subTextColor: '#4B5563',
    subCardBg: '#FAF7F2',
    subCardBorder: '#E5E0D8',
    subCardHoverBg: '#FFFFFF',
    subCardHoverBorder: '#B8860B',
    badgeBg: '#15241B',
    badgeText: '#D4AF37',
    badgeBorder: '#D4AF37',
    statNumber: '#15241B',
    statLabel: '#4B5563',
    quoteBg: '#15241B',
    quoteBorder: '#D4AF37',
    quoteText: '#FFFFFF',
    quoteAccent: '#FFE082'
  }
};

export default function AboutPage() {
  const [currentThemeKey, setCurrentThemeKey] = useState('lime');
  const [isDemoBarOpen, setIsDemoBarOpen] = useState(true);

  const t = THEMES[currentThemeKey] || THEMES.lime;

  useEffect(() => {
    document.title = `About Us (${t.label}) | The Gift Studio`;
  }, [t]);

  return (
    <div
      id="about-page-root"
      className="min-h-screen w-full flex flex-col font-sans transition-colors duration-500"
      style={{
        background: t.pageBg,
        color: t.pageText
      }}
    >
      <Header />

      <main className="flex-1 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-16">

          {/* 1. Hero & Breadcrumb Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest mb-2 font-semibold opacity-75">
              <Link to="/" className="hover:opacity-100 no-underline transition" style={{ color: t.subTextColor }}>
                Home
              </Link>
              <span>/</span>
              <span style={{ color: t.accentColor }} className="font-bold">About Us</span>
            </div>

            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full shadow-xs transition-all duration-300"
              style={{
                backgroundColor: t.badgeBg,
                color: t.badgeText,
                border: `1px solid ${t.badgeBorder}`
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: t.accentColor }} />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase">
                New Modi Enterprises • Since Inception
              </span>
            </div>

            <h1
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight transition-colors duration-300"
              style={{ color: t.headingColor }}
            >
              Crafting Thoughtful Connections &amp; <span style={{ color: t.accentColor }}>Bespoke Luxury</span>
            </h1>

            <p
              className="text-sm sm:text-base leading-relaxed font-normal transition-colors duration-300"
              style={{ color: t.subTextColor }}
            >
              Welcome to <strong>The Gift Studio</strong> by New Modi Enterprises. We specialize in handcrafted luxury gift hampers, corporate prestige collections, and bespoke celebration sets designed to celebrate life's most cherished milestones.
            </p>
          </div>

          {/* 2. Brand Story & Heritage Card */}
          <section
            id="story-heritage-section"
            className="rounded-3xl p-6 sm:p-10 lg:p-12 shadow-lg relative overflow-hidden transition-all duration-500 hover:shadow-xl"
            style={{
              background: t.cardBg,
              border: `1px solid ${t.cardBorder}`
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Left Column: Story narrative */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div
                  className="inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase transition-colors"
                  style={{
                    backgroundColor: t.badgeBg,
                    color: t.badgeText,
                    border: `1px solid ${t.badgeBorder}`
                  }}
                >
                  Our Heritage &amp; Vision
                </div>

                <h2
                  className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug transition-colors duration-300"
                  style={{ color: t.headingColor }}
                >
                  Gifting is Not an Obligation, <br className="hidden sm:inline" />
                  <span style={{ color: t.accentColor }}>It is an Art of Heartfelt Expression.</span>
                </h2>

                <p className="text-sm sm:text-base leading-relaxed" style={{ color: t.subTextColor }}>
                  Located in the historic craft hub of <strong>Patiala, Punjab</strong>, <strong>New Modi Enterprises</strong> established <strong>The Gift Studio</strong> with a clear vision: to redefine modern Indian gifting. Whether it is a grand wedding celebration, Diwali corporate gifting, a milestone anniversary, or an intimate birthday, our creations turn every occasion into a sensory celebration.
                </p>

                <p className="text-sm sm:text-base leading-relaxed" style={{ color: t.subTextColor }}>
                  Every hamper is conceptualized with passion — combining hand-picked artisanal treats, custom leatherette accessories, designer keepsake boxes, and personalized notes that leave a lasting emotional impression on your loved ones and corporate associates.
                </p>

                {/* Atelier Location Bar with Interactive Hover Effect */}
                <div
                  id="atelier-hub-bar"
                  className="p-4 rounded-2xl transition-all duration-300 hover:translate-x-1.5 group cursor-pointer"
                  style={{
                    backgroundColor: t.subCardBg,
                    border: `1px solid ${t.subCardBorder}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = t.subCardHoverBg;
                    e.currentTarget.style.borderColor = t.subCardHoverBorder;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = t.subCardBg;
                    e.currentTarget.style.borderColor = t.subCardBorder;
                  }}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110"
                      style={{
                        backgroundColor: t.badgeBg,
                        color: t.badgeText,
                        border: `1px solid ${t.badgeBorder}`
                      }}
                    >
                      <MapPin className="w-5 h-5 transition-transform duration-300" />
                    </div>
                    <div className="text-xs sm:text-sm">
                      <span
                        className="font-bold block mb-0.5 transition-colors"
                        style={{ color: t.headingColor }}
                      >
                        Atelier &amp; Manufacturing Hub
                      </span>
                      <span className="leading-relaxed block" style={{ color: t.subTextColor }}>
                        {STORE_INFO.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Brand Card & 4 Key Stat Boxes */}
              <div className="lg:col-span-5 space-y-4">
                <div
                  className="relative rounded-2xl overflow-hidden shadow-md group"
                  style={{ border: `1px solid ${t.cardBorder}` }}
                >
                  <img
                    src="/images/gift_logo.jpeg"
                    alt="The Gift Studio Showcase"
                    className="w-full h-64 sm:h-72 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6">
                    <span className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: t.accentColor }}>
                      Pure Craftsmanship
                    </span>
                    <h3 className="text-white font-serif text-xl font-bold">
                      The Gift Studio Experience
                    </h3>
                  </div>
                </div>

                {/* 4 Interactive Impact Stat Boxes with Dynamic Theme & Hover Effects */}
                <div id="stat-boxes-container" className="grid grid-cols-2 gap-3 pt-1">
                  
                  {/* Box 1 */}
                  <div
                    className="stat-card transition-all duration-300 rounded-xl p-4 text-center group cursor-default hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      backgroundColor: t.subCardBg,
                      border: `1px solid ${t.subCardBorder}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = t.subCardHoverBg;
                      e.currentTarget.style.borderColor = t.subCardHoverBorder;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = t.subCardBg;
                      e.currentTarget.style.borderColor = t.subCardBorder;
                    }}
                  >
                    <div
                      className="font-serif text-2xl sm:text-3xl font-extrabold transition-colors"
                      style={{ color: t.statNumber }}
                    >
                      10,000+
                    </div>
                    <div
                      className="text-[11px] sm:text-xs font-semibold mt-1 transition-colors"
                      style={{ color: t.statLabel }}
                    >
                      Hampers Delivered
                    </div>
                  </div>

                  {/* Box 2 */}
                  <div
                    className="stat-card transition-all duration-300 rounded-xl p-4 text-center group cursor-default hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      backgroundColor: t.subCardBg,
                      border: `1px solid ${t.subCardBorder}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = t.subCardHoverBg;
                      e.currentTarget.style.borderColor = t.subCardHoverBorder;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = t.subCardBg;
                      e.currentTarget.style.borderColor = t.subCardBorder;
                    }}
                  >
                    <div
                      className="font-serif text-2xl sm:text-3xl font-extrabold transition-colors"
                      style={{ color: t.statNumber }}
                    >
                      100%
                    </div>
                    <div
                      className="text-[11px] sm:text-xs font-semibold mt-1 transition-colors"
                      style={{ color: t.statLabel }}
                    >
                      Bespoke Curation
                    </div>
                  </div>

                  {/* Box 3 */}
                  <div
                    className="stat-card transition-all duration-300 rounded-xl p-4 text-center group cursor-default hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      backgroundColor: t.subCardBg,
                      border: `1px solid ${t.subCardBorder}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = t.subCardHoverBg;
                      e.currentTarget.style.borderColor = t.subCardHoverBorder;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = t.subCardBg;
                      e.currentTarget.style.borderColor = t.subCardBorder;
                    }}
                  >
                    <div
                      className="font-serif text-2xl sm:text-3xl font-extrabold transition-colors"
                      style={{ color: t.statNumber }}
                    >
                      500+
                    </div>
                    <div
                      className="text-[11px] sm:text-xs font-semibold mt-1 transition-colors"
                      style={{ color: t.statLabel }}
                    >
                      Corporate Partners
                    </div>
                  </div>

                  {/* Box 4 */}
                  <div
                    className="stat-card transition-all duration-300 rounded-xl p-4 text-center group cursor-default hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      backgroundColor: t.subCardBg,
                      border: `1px solid ${t.subCardBorder}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = t.subCardHoverBg;
                      e.currentTarget.style.borderColor = t.subCardHoverBorder;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = t.subCardBg;
                      e.currentTarget.style.borderColor = t.subCardBorder;
                    }}
                  >
                    <div
                      className="font-serif text-2xl sm:text-3xl font-extrabold transition-colors flex items-center justify-center gap-1"
                      style={{ color: t.statNumber }}
                    >
                      <span>4.9</span>
                      <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37] group-hover:scale-125 transition-transform duration-300" />
                    </div>
                    <div
                      className="text-[11px] sm:text-xs font-semibold mt-1 transition-colors"
                      style={{ color: t.statLabel }}
                    >
                      Client Satisfaction
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* 3. The 4 Pillars of Our Craft */}
          <section id="pillars-section" className="space-y-8 text-center">
            <div className="max-w-2xl mx-auto space-y-2">
              <span
                className="text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full inline-block shadow-2xs transition-colors"
                style={{
                  backgroundColor: t.badgeBg,
                  color: t.badgeText,
                  border: `1px solid ${t.badgeBorder}`
                }}
              >
                Why Choose Us
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold transition-colors" style={{ color: t.headingColor }}>
                The Pillars of The Gift Studio
              </h2>
              <p className="text-xs sm:text-sm transition-colors" style={{ color: t.subTextColor }}>
                Four uncompromising values that guide every box we pack and every ribbon we tie.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Pillar 1 */}
              <div
                className="pillar-card rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group cursor-default"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.cardBorder}`
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center mb-4 shadow-xs group-hover:scale-110"
                  style={{
                    backgroundColor: t.badgeBg,
                    color: t.accentColor,
                    border: `1px solid ${t.badgeBorder}`
                  }}
                >
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold mb-2 transition-colors" style={{ color: t.headingColor }}>
                  Bespoke Curation
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed m-0" style={{ color: t.subTextColor }}>
                  Tailored to your specific occasion, color palette, recipient taste, and budget. No cookie-cutter packages — each hamper is uniquely customized.
                </p>
              </div>

              {/* Pillar 2 */}
              <div
                className="pillar-card rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group cursor-default"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.cardBorder}`
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center mb-4 shadow-xs group-hover:scale-110"
                  style={{
                    backgroundColor: t.badgeBg,
                    color: t.accentColor,
                    border: `1px solid ${t.badgeBorder}`
                  }}
                >
                  <Gift className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold mb-2 transition-colors" style={{ color: t.headingColor }}>
                  Artisanal Excellence
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed m-0" style={{ color: t.subTextColor }}>
                  From genuine leatherette goods and custom keychains to handmade boxes and gold-stamped branding, craftsmanship is at our core.
                </p>
              </div>

              {/* Pillar 3 */}
              <div
                className="pillar-card rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group cursor-default"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.cardBorder}`
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center mb-4 shadow-xs group-hover:scale-110"
                  style={{
                    backgroundColor: t.badgeBg,
                    color: t.accentColor,
                    border: `1px solid ${t.badgeBorder}`
                  }}
                >
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold mb-2 transition-colors" style={{ color: t.headingColor }}>
                  Signature Packaging
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed m-0" style={{ color: t.subTextColor }}>
                  Prestige rigid gift trunks, satin ribbons, personalized seal monograms, and tamper-proof safety packaging ensuring an awe-inspiring unboxing.
                </p>
              </div>

              {/* Pillar 4 */}
              <div
                className="pillar-card rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group cursor-default"
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.cardBorder}`
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center mb-4 shadow-xs group-hover:scale-110"
                  style={{
                    backgroundColor: t.badgeBg,
                    color: t.accentColor,
                    border: `1px solid ${t.badgeBorder}`
                  }}
                >
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold mb-2 transition-colors" style={{ color: t.headingColor }}>
                  Pan-India Delivery
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed m-0" style={{ color: t.subTextColor }}>
                  Reliable express shipping across all states, metro cities, and regional hubs. We guarantee every gift arrives fresh, intact, and right on schedule.
                </p>
              </div>

            </div>
          </section>

          {/* 4. What We Specialize In (The 6 Cards) */}
          <section
            id="craft-perfection-section"
            className="rounded-3xl p-6 sm:p-10 lg:p-12 shadow-lg space-y-8 transition-all duration-500"
            style={{
              background: t.cardBg,
              border: `1px solid ${t.cardBorder}`
            }}
          >
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span
                className="text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full inline-block transition-colors"
                style={{
                  backgroundColor: t.badgeBg,
                  color: t.badgeText,
                  border: `1px solid ${t.badgeBorder}`
                }}
              >
                Collections &amp; Offerings
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold transition-colors" style={{ color: t.headingColor }}>
                What We Craft With Perfection
              </h2>
              <p className="text-xs sm:text-sm transition-colors" style={{ color: t.subTextColor }}>
                Explore the breadth of our bespoke gifting solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 01 */}
              <div
                className="offering-card p-5 rounded-2xl transition-all duration-300 space-y-3 group cursor-pointer hover:-translate-y-2 hover:shadow-xl"
                style={{
                  backgroundColor: t.subCardBg,
                  border: `1px solid ${t.subCardBorder}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = t.subCardHoverBg;
                  e.currentTarget.style.borderColor = t.subCardHoverBorder;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = t.subCardBg;
                  e.currentTarget.style.borderColor = t.subCardBorder;
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg transition-all duration-300 flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      backgroundColor: t.badgeBg,
                      color: t.accentColor,
                      border: `1px solid ${t.badgeBorder}`
                    }}
                  >
                    01
                  </div>
                  <h3 className="font-serif text-base font-bold transition-colors m-0" style={{ color: t.headingColor }}>
                    Festivals &amp; Celebrations
                  </h3>
                </div>
                <p className="text-xs leading-relaxed m-0 transition-colors" style={{ color: t.subTextColor }}>
                  Diwali gourmet boxes, New Year luxury hampers, Rakhi collections, and celebratory holiday baskets curated with traditional grace.
                </p>
              </div>

              {/* Card 02 */}
              <div
                className="offering-card p-5 rounded-2xl transition-all duration-300 space-y-3 group cursor-pointer hover:-translate-y-2 hover:shadow-xl"
                style={{
                  backgroundColor: t.subCardBg,
                  border: `1px solid ${t.subCardBorder}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = t.subCardHoverBg;
                  e.currentTarget.style.borderColor = t.subCardHoverBorder;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = t.subCardBg;
                  e.currentTarget.style.borderColor = t.subCardBorder;
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg transition-all duration-300 flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      backgroundColor: t.badgeBg,
                      color: t.accentColor,
                      border: `1px solid ${t.badgeBorder}`
                    }}
                  >
                    02
                  </div>
                  <h3 className="font-serif text-base font-bold transition-colors m-0" style={{ color: t.headingColor }}>
                    Corporate &amp; Bulk Orders
                  </h3>
                </div>
                <p className="text-xs leading-relaxed m-0 transition-colors" style={{ color: t.subTextColor }}>
                  Executive welcome kits, client appreciation boxes, team rewards, and corporate summit favors featuring custom brand embossing.
                </p>
              </div>

              {/* Card 03 */}
              <div
                className="offering-card p-5 rounded-2xl transition-all duration-300 space-y-3 group cursor-pointer hover:-translate-y-2 hover:shadow-xl"
                style={{
                  backgroundColor: t.subCardBg,
                  border: `1px solid ${t.subCardBorder}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = t.subCardHoverBg;
                  e.currentTarget.style.borderColor = t.subCardHoverBorder;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = t.subCardBg;
                  e.currentTarget.style.borderColor = t.subCardBorder;
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg transition-all duration-300 flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      backgroundColor: t.badgeBg,
                      color: t.accentColor,
                      border: `1px solid ${t.badgeBorder}`
                    }}
                  >
                    03
                  </div>
                  <h3 className="font-serif text-base font-bold transition-colors m-0" style={{ color: t.headingColor }}>
                    Weddings &amp; Milestones
                  </h3>
                </div>
                <p className="text-xs leading-relaxed m-0 transition-colors" style={{ color: t.subTextColor }}>
                  Trousseau packaging, wedding invitation favors, bridesmaids &amp; groomsmen hampers customized with names and monograms.
                </p>
              </div>

              {/* Card 04 */}
              <div
                className="offering-card p-5 rounded-2xl transition-all duration-300 space-y-3 group cursor-pointer hover:-translate-y-2 hover:shadow-xl"
                style={{
                  backgroundColor: t.subCardBg,
                  border: `1px solid ${t.subCardBorder}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = t.subCardHoverBg;
                  e.currentTarget.style.borderColor = t.subCardHoverBorder;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = t.subCardBg;
                  e.currentTarget.style.borderColor = t.subCardBorder;
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg transition-all duration-300 flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      backgroundColor: t.badgeBg,
                      color: t.accentColor,
                      border: `1px solid ${t.badgeBorder}`
                    }}
                  >
                    04
                  </div>
                  <h3 className="font-serif text-base font-bold transition-colors m-0" style={{ color: t.headingColor }}>
                    Hand Bags &amp; Carry Bags
                  </h3>
                </div>
                <p className="text-xs leading-relaxed m-0 transition-colors" style={{ color: t.subTextColor }}>
                  Durable, reusable luxury carry bags and handcrafted lifestyle tote bags for corporate events and celebration distributions.
                </p>
              </div>

              {/* Card 05 */}
              <div
                className="offering-card p-5 rounded-2xl transition-all duration-300 space-y-3 group cursor-pointer hover:-translate-y-2 hover:shadow-xl"
                style={{
                  backgroundColor: t.subCardBg,
                  border: `1px solid ${t.subCardBorder}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = t.subCardHoverBg;
                  e.currentTarget.style.borderColor = t.subCardHoverBorder;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = t.subCardBg;
                  e.currentTarget.style.borderColor = t.subCardBorder;
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg transition-all duration-300 flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      backgroundColor: t.badgeBg,
                      color: t.accentColor,
                      border: `1px solid ${t.badgeBorder}`
                    }}
                  >
                    05
                  </div>
                  <h3 className="font-serif text-base font-bold transition-colors m-0" style={{ color: t.headingColor }}>
                    Keychains &amp; Accessories
                  </h3>
                </div>
                <p className="text-xs leading-relaxed m-0 transition-colors" style={{ color: t.subTextColor }}>
                  Metallic &amp; leatherette premium keychains, executive cardholders, and customized utility gifts with fine engraving.
                </p>
              </div>

              {/* Card 06 */}
              <div
                className="offering-card p-5 rounded-2xl transition-all duration-300 space-y-3 group cursor-pointer hover:-translate-y-2 hover:shadow-xl"
                style={{
                  backgroundColor: t.subCardBg,
                  border: `1px solid ${t.subCardBorder}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = t.subCardHoverBg;
                  e.currentTarget.style.borderColor = t.subCardHoverBorder;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = t.subCardBg;
                  e.currentTarget.style.borderColor = t.subCardBorder;
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg transition-all duration-300 flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      backgroundColor: t.badgeBg,
                      color: t.accentColor,
                      border: `1px solid ${t.badgeBorder}`
                    }}
                  >
                    06
                  </div>
                  <h3 className="font-serif text-base font-bold transition-colors m-0" style={{ color: t.headingColor }}>
                    Desk Sets &amp; Table Calendars
                  </h3>
                </div>
                <p className="text-xs leading-relaxed m-0 transition-colors" style={{ color: t.subTextColor }}>
                  Gold-foiled desk calendars, bespoke planner sets, and luxury stationery crafted to elevate workspaces year-round.
                </p>
              </div>

            </div>
          </section>

          {/* 5. Founder's Philosophy Quote */}
          <section
            id="founder-quote-section"
            className="relative text-center max-w-4xl mx-auto py-10 px-6 sm:px-12 rounded-3xl shadow-xl transition-all duration-500"
            style={{
              backgroundColor: t.quoteBg,
              color: t.quoteText,
              border: `2px solid ${t.quoteBorder}`
            }}
          >
            <div
              className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4 shadow-md transition-colors"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: t.quoteAccent,
                border: `1px solid ${t.quoteBorder}`
              }}
            >
              <Quote className="w-5 h-5" />
            </div>
            <blockquote className="font-serif text-xl sm:text-2xl italic font-medium leading-relaxed m-0 max-w-2xl mx-auto">
              “A gift from The Gift Studio is not just an item — it is a lasting sentiment of warmth, gratitude, and refined prestige.”
            </blockquote>
            <div className="mt-4">
              <span className="font-bold text-sm tracking-wide block transition-colors" style={{ color: t.quoteAccent }}>
                The Gift Studio Team
              </span>
              <span className="text-xs opacity-75">
                New Modi Enterprises • Patiala
              </span>
            </div>
          </section>

        </div>
      </main>

      <Footer />

      {/* ------------------------------------------------------------- */}
      {/* Interactive Client Demo Floating Theme Switcher Bar           */}
      {/* Allows instant 1-click theme demonstration to client          */}
      {/* ------------------------------------------------------------- */}
      <div
        id="client-theme-switcher"
        className="fixed bottom-4 right-4 z-50 transition-all duration-300"
      >
        {isDemoBarOpen ? (
          <div
            className="rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md flex flex-col gap-2.5 max-w-xs sm:max-w-md animate-in fade-in slide-in-from-bottom-2 duration-200"
            style={{
              background: 'rgba(15, 23, 18, 0.92)',
              border: '1.5px solid rgba(244, 201, 93, 0.6)',
              boxShadow: '0 12px 36px rgba(0,0,0,0.5), 0 0 20px rgba(244, 201, 93, 0.2)'
            }}
          >
            <div className="flex items-center justify-between gap-3 pb-1 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#F4C95D]" />
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Client Live Demo: Theme
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDemoBarOpen(false)}
                className="text-stone-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-white/10 transition border-none bg-transparent cursor-pointer"
                title="Minimize Theme Switcher"
              >
                Hide ✕
              </button>
            </div>

            <p className="text-[10px] text-stone-300 m-0 leading-tight">
              Click to instantly preview how color combinations look for the client:
            </p>

            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {Object.keys(THEMES).map((key) => {
                const item = THEMES[key];
                const isActive = currentThemeKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCurrentThemeKey(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer border ${
                      isActive
                        ? 'bg-[#F4C95D] text-stone-900 border-[#FFE082] shadow-sm scale-105'
                        : 'bg-white/10 text-stone-200 hover:text-white hover:bg-white/20 border-white/15'
                    }`}
                  >
                    {item.badge}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsDemoBarOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full font-bold text-xs bg-[#15241B] text-[#F4C95D] border border-[#F4C95D]/60 shadow-xl hover:scale-105 transition cursor-pointer"
            title="Open Client Theme Demo Tool"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#F4C95D]" />
            <span>🎨 Theme: {t.label.split(' ')[0]}</span>
          </button>
        )}
      </div>

    </div>
  );
}
