import React, { useState } from 'react';
import { PageId, ReviewItem } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { 
  Star, 
  Sparkles, 
  Quote, 
  Award, 
  PlusCircle, 
  CheckCircle2, 
  X, 
  Send, 
  CalendarCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BackButton } from '../components/BackButton';
import { ScrollSideEntry } from '../components/ScrollSideEntry';

interface ReviewsPageProps {
  onNavigate: (page: PageId) => void;
  onBack?: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  onNavigate,
  onBack,
  onShowToast,
}) => {
  const { reviews, addReview, config } = useRestaurantData();
  const [filterSource, setFilterSource] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New review form state
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formReview, setFormReview] = useState('');
  const [formDishes, setFormDishes] = useState('');

  const approvedReviews = reviews.filter((r) => r.isApproved);
  const featuredReview = approvedReviews.find((r) => r.isFeatured) || approvedReviews[0] || {
    customerName: 'Culinary Heritage Inspector',
    roleOrCity: 'Gourmet Gastronomy',
    rating: 5,
    review: 'A revelatory celebration of fire and rare spice that sets a new high watermark for modern dining.',
    source: 'Culinary Guide 2025'
  };

  const filteredReviews = approvedReviews.filter((r) => {
    if (filterSource === 'all') return true;
    if (filterSource === 'critic') return r.source?.toLowerCase().includes('critic') || r.source?.toLowerCase().includes('inspector') || r.source?.toLowerCase().includes('guide');
    if (filterSource === 'verified') return r.source?.toLowerCase().includes('verified') || r.source?.toLowerCase().includes('diner');
    if (filterSource === 'private') return r.source?.toLowerCase().includes('private');
    return true;
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formReview.trim()) {
      onShowToast('Missing Fields', 'Please provide your name and review message.', 'info');
      return;
    }

    addReview({
      customerName: formName,
      roleOrCity: formRole || `${config.contact.city} Guest`,
      rating: formRating,
      review: formReview,
      date: 'Just now',
      source: 'Verified Diner',
      orderedDishes: formDishes ? formDishes.split(',').map((d) => d.trim()) : ['Tasting Menu Selection'],
      isApproved: true,
      isFeatured: false
    });

    setIsModalOpen(false);
    setFormName('');
    setFormRole('');
    setFormReview('');
    setFormDishes('');
    onShowToast('Review Published', 'Thank you for sharing your dining experience with us.', 'gold');
  };

  return (
    <div className="w-full pt-28 pb-24 bg-[#0d0b0a] min-h-screen text-[#f5efe6] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top-Left Back Navigation */}
        <div className="mb-6">
          <BackButton onClick={onBack || (() => onNavigate('home'))} />
        </div>

        {/* Header */}
        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181412] border border-[#d4af37]/40 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
              <span>Critic &amp; Diner Acclaim</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#fdfbf7]">
              Words From Our Diners
            </h1>
            <p className="text-sm sm:text-base text-[#c5bcad] leading-relaxed">
              Honored with global accolades, {config.michelinGuide} recognition, and the cherished memories of guests who gather around our open fire.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-gold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Share Your Dining Experience
              </button>
            </div>
          </div>
        </ScrollSideEntry>

        {/* Rating Summary Bar & Michelin Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          {/* Left Stats (5 cols) */}
          <ScrollSideEntry direction="left" delay={0.1} className="lg:col-span-5 h-full">
            <div className="p-8 rounded-2xl bg-[#14110f] border border-[#26201a] flex flex-col justify-between space-y-6 h-full">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#a89d8f] font-semibold block">
                  Overall Guest Satisfaction
                </span>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="font-serif text-5xl font-bold text-[#d4af37]">4.9</span>
                  <span className="text-sm text-[#8c8275]">out of 5.0</span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 my-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#d4af37] text-[#d4af37]" />
                  ))}
                </div>
                <p className="text-xs text-[#9d9385]">
                  Based on {reviews.length}+ verified dining reviews across Michelin Guide, AA Rosettes, and Table Logbooks.
                </p>
              </div>

              {/* Breakdown Bars */}
              <div className="space-y-2 pt-4 border-t border-[#221c17] text-xs">
                <div className="flex items-center justify-between gap-4 text-[#c5bcad]">
                  <span>Food &amp; Hearth Flavour</span>
                  <div className="w-32 bg-[#221c17] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#d4af37] h-full w-[98%]" />
                  </div>
                  <span className="font-bold text-[#d4af37]">4.98</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-[#c5bcad]">
                  <span>Ambiance &amp; Acoustics</span>
                  <div className="w-32 bg-[#221c17] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#d4af37] h-full w-[96%]" />
                  </div>
                  <span className="font-bold text-[#d4af37]">4.94</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-[#c5bcad]">
                  <span>Beverages &amp; Hospitality</span>
                  <div className="w-32 bg-[#221c17] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#d4af37] h-full w-[95%]" />
                  </div>
                  <span className="font-bold text-[#d4af37]">4.92</span>
                </div>
              </div>
            </div>
          </ScrollSideEntry>

          {/* Right Featured Review (7 cols) */}
          <ScrollSideEntry direction="right" delay={0.15} className="lg:col-span-7 h-full">
            <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#1c1612] via-[#14110f] to-[#0e0c0a] border border-[#d4af37]/30 flex flex-col justify-between relative shadow-2xl h-full">
              <Quote className="w-12 h-12 text-[#d4af37]/20 absolute top-6 right-6" />
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37] font-bold">
                  <Award className="w-4 h-4" />
                  <span>Critical Acclaim Highlight</span>
                </div>
                <p className="font-serif text-xl sm:text-2xl text-[#fdfbf7] italic leading-relaxed">
                  "{featuredReview.review}"
                </p>
              </div>

              <div className="pt-6 border-t border-[#2a241f] flex flex-wrap items-center justify-between gap-4 relative z-10">
                <div>
                  <h4 className="font-semibold text-[#fdfbf7] text-base">
                    {featuredReview.customerName}
                  </h4>
                  <span className="text-xs text-[#a89d8f]">
                    {featuredReview.roleOrCity} • {featuredReview.source}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(featuredReview.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                  ))}
                </div>
              </div>
            </div>
          </ScrollSideEntry>
        </div>

        {/* Source Filters */}
        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: 'All Reviews' },
                { id: 'critic', label: 'Critics & Guides' },
                { id: 'verified', label: 'Verified Diners' },
                { id: 'private', label: 'Private Dining' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterSource(f.id)}
                  className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all border cursor-pointer ${
                    filterSource === f.id
                      ? 'bg-[#d4af37] text-[#0d0b0a] border-[#d4af37] font-bold shadow-lg'
                      : 'bg-[#14110f] border-[#26201a] text-[#a89d8f] hover:text-[#fdfbf7] hover:border-[#3a3028]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-[#8c8275]">
              Showing {filteredReviews.length} curated testimonials
            </span>
          </div>
        </ScrollSideEntry>

        {/* Reviews Masonry-like Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev, idx) => {
            const direction = idx % 2 === 0 ? 'left' : 'right';
            return (
              <ScrollSideEntry
                key={rev.id}
                direction={direction}
                delay={(idx % 3) * 0.08}
                className="h-full"
              >
                <div
                  className="p-6 rounded-2xl bg-[#14110f] border border-[#26201a] flex flex-col justify-between space-y-6 hover:border-[#d4af37]/40 transition-all duration-300 h-full"
                >
                  <div className="space-y-4">
                    {/* Rating & Source Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                        ))}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1e1915] border border-[#332a22] text-[#d4af37] font-medium">
                        {rev.source}
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-xs sm:text-sm text-[#c5bcad] leading-relaxed italic">
                      "{rev.review}"
                    </p>

                    {/* Ordered Dishes Tags */}
                    {rev.orderedDishes && rev.orderedDishes.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] uppercase tracking-widest text-[#7a7063] block mb-1.5 font-semibold">
                          Tasted:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {rev.orderedDishes.map((dish, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-[#1c1815] text-[10px] text-[#a89d8f] border border-[#2a241f]"
                            >
                              {dish}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Author Strip */}
                  <div className="pt-4 border-t border-[#221c17] flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-semibold text-[#fdfbf7]">
                        {rev.customerName}
                      </h5>
                      <span className="text-[11px] text-[#8c8275]">
                        {rev.roleOrCity}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#665c52]">{rev.date}</span>
                  </div>
                </div>
              </ScrollSideEntry>
            );
          })}
        </div>
      </div>

      {/* Add Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#14110f] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl z-10"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-[#8c8275] hover:text-[#fdfbf7] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center mx-auto mb-2">
                  <Star className="w-5 h-5 fill-[#d4af37]" />
                </div>
                <h3 className="font-serif text-2xl text-[#fdfbf7]">Share Your Experience</h3>
                <p className="text-xs text-[#a89d8f] mt-1">
                  We cherish feedback from our esteemed patrons and food connoisseurs.
                </p>
              </div>

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#a89d8f] font-semibold block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Lord Harrington or Sarah Jenkins"
                    className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-xs text-[#fdfbf7] p-3 rounded-lg outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#a89d8f] font-semibold block mb-1">
                      City / Title
                    </label>
                    <input
                      type="text"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="e.g. Verified Patron, Ilahiabad"
                      className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-xs text-[#fdfbf7] p-3 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#a89d8f] font-semibold block mb-1">
                      Rating
                    </label>
                    <select
                      value={formRating}
                      onChange={(e) => setFormRating(Number(e.target.value))}
                      className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-xs text-[#fdfbf7] p-3 rounded-lg outline-none cursor-pointer"
                    >
                      <option value={5}>★★★★★ 5 Stars (Exceptional)</option>
                      <option value={4}>★★★★☆ 4 Stars (Excellent)</option>
                      <option value={3}>★★★☆☆ 3 Stars (Good)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#a89d8f] font-semibold block mb-1">
                    Dishes You Enjoyed
                  </label>
                  <input
                    type="text"
                    value={formDishes}
                    onChange={(e) => setFormDishes(e.target.value)}
                    placeholder="e.g. Wagyu Ribeye, Ember Scallops, Smoked Soufflé"
                    className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-xs text-[#fdfbf7] p-3 rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#a89d8f] font-semibold block mb-1">
                    Review Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formReview}
                    onChange={(e) => setFormReview(e.target.value)}
                    placeholder="Describe your dining atmosphere, flavours, signature beverage pairing, or hospitality..."
                    className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-xs text-[#fdfbf7] p-3 rounded-lg outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#a89d8f] hover:text-[#fdfbf7]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
