import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Star,
  Quote,
  MapPin,
  Sparkles,
  Calendar,
  CheckCircle2,
  Filter,
  MessageSquare,
  Package,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import resolveImageUrl from '../utils/image';
import { formatTimeAgo } from '../utils/date';
import { apiService } from '../services/api';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedOccasion, setSelectedOccasion] = useState('all');

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Client Reviews & Words of Acclaim | The Gift Studio';

    async function loadAllReviews() {
      setIsLoading(true);
      try {
        const res = await apiService.getTestimonials();
        if (res?.success && Array.isArray(res.testimonials)) {
          if (isMounted) setTestimonials(res.testimonials);
        } else {
          if (isMounted) setTestimonials([]);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
        if (isMounted) setTestimonials([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAllReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  // Distinct Occasions List for Filter Tabs
  const occasionsList = Array.from(
    new Set(testimonials.map((t) => t.occasion).filter(Boolean))
  );

  // Filtered reviews
  const filteredList = testimonials.filter((t) => {
    const matchRating =
      selectedRating === 'all' || Math.round(Number(t.rating || 5)) === Number(selectedRating);
    const matchOccasion =
      selectedOccasion === 'all' || t.occasion === selectedOccasion;
    return matchRating && matchOccasion;
  });

  // Calculate Average Rating
  const averageRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((acc, t) => acc + Number(t.rating || 5), 0) /
          testimonials.length
        ).toFixed(1)
      : '5.0';

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900" style={{ backgroundColor: '#FAF7F2' }}>
      {/* 1. Header Navigation */}
      <Header />

      {/* 2. Breadcrumbs */}
      <div className="border-b border-[#E8DFD3]/80 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 overflow-x-auto">
            <Link to="/" className="hover:text-[#C62828] transition font-medium whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="text-stone-900 font-semibold whitespace-nowrap">
              Customer Reviews
            </span>
          </nav>
        </div>
      </div>

      {/* 3. Hero Header Section */}
      <section className="py-10 sm:py-12 border-b border-[#E8DFD3]/70" style={{ backgroundColor: '#F3ECE1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E8DFD3] text-[#C62828] text-[11px] font-bold tracking-widest uppercase mb-3 shadow-2xs">
                <Sparkles className="w-3 h-3" />
                <span>Verified Client Acclaim</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-950">
                Words of Acclaim & Reviews
              </h1>
              <p className="mt-2.5 text-stone-600 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
                Discover authentic testimonials and heartfelt feedback from clients across India who trusted The Gift Studio with their festive celebrations, weddings, and bespoke corporate gifting.
              </p>
            </div>

            {/* Score Card Pill */}
            {!isLoading && (
              <div className="shrink-0 bg-white rounded-2xl border border-[#E8DFD3] p-4 sm:p-5 shadow-xs flex items-center gap-4">
                <div className="flex flex-col items-center justify-center pr-4 border-r border-stone-200">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-stone-950 leading-none">
                    {averageRating}
                  </span>
                  <div className="flex items-center gap-0.5 mt-1.5">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider font-semibold">
                    Overall Score
                  </span>
                </div>

                <div>
                  <span className="block text-sm font-bold text-stone-900">
                    {testimonials.length} Verified Reviews
                  </span>
                  <span className="text-xs text-stone-500 mt-0.5 block">
                    100% Genuine Client Submissions
                  </span>
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Trusted Excellence</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Main Body: Filter Bar & Reviews List */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filter Toolbar */}
        <div className="bg-white rounded-xl border border-[#E8DFD3] p-3.5 sm:p-4 mb-8 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Occasion Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedOccasion('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition border whitespace-nowrap ${
                selectedOccasion === 'all'
                  ? 'bg-[#8B2635] text-white border-[#8B2635] shadow-2xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              All Occasions
            </button>
            {occasionsList.map((occ) => (
              <button
                key={occ}
                type="button"
                onClick={() => setSelectedOccasion(occ)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition border whitespace-nowrap ${
                  selectedOccasion === occ
                    ? 'bg-[#8B2635] text-white border-[#8B2635] shadow-2xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>

          {/* Rating Dropdown Filter */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-xs text-stone-500 font-medium">Rating:</span>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:border-[#8B2635] cursor-pointer shadow-2xs"
            >
              <option value="all">All Star Ratings</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#8B2635] mx-auto mb-3" />
            <p className="font-serif text-lg text-stone-800 font-medium">Gathering client words...</p>
            <p className="text-xs text-stone-500 mt-1">Loading verified testimonials</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredList.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E8DFD3] p-12 text-center max-w-md mx-auto my-6 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
              No reviews match your selected filter
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              Try switching back to all occasions or resetting your star rating filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedOccasion('all');
                setSelectedRating('all');
              }}
              className="px-5 py-2 rounded-full text-xs font-semibold text-white cursor-pointer transition shadow-xs border-none"
              style={{ backgroundColor: '#8B2635' }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Reviews List with Side-by-Side Product/Gift Photos on the Right */}
        {!isLoading && filteredList.length > 0 && (
          <div className="space-y-5">
            {filteredList.map((t, idx) => {
              const starsCount = Math.round(Number(t.rating || 5));
              const name = t.customer_name || 'Valued Client';
              const location = t.city;
              const quote = t.review_text;
              const avatar = t.avatar_url;
              const productImg = t.product_image_url;
              const timeAgo = formatTimeAgo(t.created_at);

              return (
                <div
                  key={t.id || idx}
                  className="bg-white rounded-2xl border border-[#E8DFD3] p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-[#D8C7B2] transition duration-300 flex flex-col md:flex-row items-start justify-between gap-6"
                >
                  {/* Left Column: Customer Details, Rating, Quote & Tags */}
                  <div className="flex-1 min-w-0">
                    {/* Header Row: Avatar, Name, Verified, Time Ago & Green Rating Pill */}
                    <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-stone-100 flex-wrap">
                      <div className="flex items-center gap-3 min-w-0">
                        {avatar ? (
                          <img
                            src={resolveImageUrl(avatar)}
                            alt={name}
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-[#E8DFD3] shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = '/images/gift_logo.jpeg';
                            }}
                          />
                        ) : (
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FAF7F2] border border-[#E8DFD3] text-[#8B2635] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {name.substring(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-sm sm:text-base text-stone-900 truncate">
                              {name}
                            </h3>
                            <CheckCircle2
                              className="w-4 h-4 text-emerald-600 shrink-0"
                              title="Verified Buyer"
                            />
                          </div>
                          <span className="text-[11px] text-stone-400 block font-normal">
                            {timeAgo}
                          </span>
                        </div>
                      </div>

                      {/* FNP Style Star Rating Badge */}
                      <div className="flex items-center gap-1 bg-[#0A8754] text-white px-2.5 py-1 rounded-md text-xs font-bold shrink-0 shadow-2xs">
                        <span>{Number(t.rating || 5).toFixed(1)}</span>
                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                      </div>
                    </div>

                    {/* Review Quote Body */}
                    <div className="relative mb-4">
                      <Quote className="w-4 h-4 text-stone-300 absolute -top-1 -left-1 opacity-50" />
                      <p className="text-xs sm:text-sm text-stone-700 italic pl-3 leading-relaxed">
                        "{quote}"
                      </p>
                    </div>

                    {/* Tags: Occasion & City Location */}
                    <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                      {t.occasion && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full font-semibold text-[#8B2635] bg-[#FAF7F2] border border-[#E8DFD3] text-[11px]">
                          {t.occasion}
                        </span>
                      )}
                      {location && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-stone-600 bg-stone-50 border border-stone-200 text-[11px]">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{location}</span>
                        </span>
                      )}
                      <span className="text-[10px] text-stone-400 ml-auto italic">
                        Verified Purchase
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Featured Product/Gift Photo Showcase */}
                  {productImg ? (
                    <div className="w-full md:w-44 shrink-0 rounded-xl overflow-hidden border border-[#E8DFD3] bg-[#F8F5F0] p-2 flex flex-col items-center text-center self-stretch justify-center">
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-[#E8DFD3] bg-white mb-2">
                        <img
                          src={resolveImageUrl(productImg)}
                          alt="Delivered Hamper"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/gift_logo.jpeg';
                          }}
                        />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded backdrop-blur-2xs uppercase">
                          Delivered
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-stone-800 line-clamp-1">
                        {t.occasion ? `${t.occasion} Hamper` : 'Bespoke Hamper'}
                      </span>
                      <span className="text-[9px] text-stone-400">
                        Client photo showcase
                      </span>
                    </div>
                  ) : (
                    <div className="hidden md:flex w-36 shrink-0 rounded-xl border border-dashed border-[#E8DFD3] bg-[#FAF7F2]/50 p-4 flex-col items-center justify-center text-center self-stretch">
                      <Package className="w-6 h-6 text-stone-300 mb-1" />
                      <span className="text-[10px] text-stone-400 leading-tight">
                        Signature Box Curation
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
