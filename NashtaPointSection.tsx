import React, { useState, useMemo } from 'react';
import { NashtaPointItem, PageId } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { 
  Sparkles, 
  Search, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Flame, 
  Coffee, 
  Droplets,
  Heart,
  Award,
  Layers,
  ArrowRight,
  Info,
  Plus,
  Clock,
  SunMedium,
  CheckCircle2,
  Utensils,
  Eye,
  X,
  Share2,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollSideEntry } from './ScrollSideEntry';

interface NashtaPointSectionProps {
  onNavigate?: (page: PageId) => void;
  onToggleWishlist?: (dishId: string) => void;
  wishlistIds?: string[];
  onShowToast?: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
  showHeader?: boolean;
}

type NashtaCategoryFilter = 'all' | 'chai' | 'lassi' | 'paratha' | 'eggs' | 'halwa-puri' | 'chana' | 'combos' | 'specials';

const CATEGORY_TABS: { id: NashtaCategoryFilter; label: string; icon: string }[] = [
  { id: 'all', label: 'All Breakfast Spread', icon: '☀️' },
  { id: 'chai', label: 'Chai Ritual', icon: '☕' },
  { id: 'lassi', label: 'Fresh Lassi Bar', icon: '🥛' },
  { id: 'halwa-puri', label: 'Halwa Puri Thali', icon: '🥞' },
  { id: 'paratha', label: 'Crispy Parathas', icon: '🫓' },
  { id: 'eggs', label: 'Farm Fresh Eggs', icon: '🍳' },
  { id: 'chana', label: 'Morning Chana & Gravies', icon: '🍲' },
  { id: 'combos', label: 'Grand Combos', icon: '⭐' }
];

export const NashtaPointSection: React.FC<NashtaPointSectionProps> = ({
  onNavigate,
  onToggleWishlist,
  wishlistIds = [],
  onShowToast,
  showHeader = true
}) => {
  const { nashtaConfig, nashtaItems, formatPrice, addToCart, isOwnerModeActive } = useRestaurantData();
  const [activeCategory, setActiveCategory] = useState<NashtaCategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'desi-ghee' | 'veg' | 'featured'>('all');
  const [selectedItemForModal, setSelectedItemForModal] = useState<NashtaPointItem | null>(null);
  const [activeModalImageIdx, setActiveModalImageIdx] = useState<number>(0);

  const filteredItems = useMemo(() => {
    return nashtaItems.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Dietary / Featured filter
      if (dietaryFilter === 'featured' && !item.isFeatured) return false;
      if (dietaryFilter === 'desi-ghee' && !item.dietary?.includes('desi-ghee') && !item.badge?.toLowerCase().includes('ghee')) return false;
      if (dietaryFilter === 'veg' && !item.dietary?.includes('veg')) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCategory = item.categoryLabel?.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        const matchBadge = item.badge?.toLowerCase().includes(q);
        return matchName || matchDesc || matchCategory || matchBadge;
      }

      return true;
    });
  }, [nashtaItems, activeCategory, dietaryFilter, searchQuery]);

  const handleAddToCart = (item: NashtaPointItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.categoryLabel || 'Nashta Point',
      image: item.image,
      servingSize: item.serves
    });
    if (onShowToast) {
      onShowToast('Added to Cart', `${item.name} has been added to your breakfast order.`, 'success');
    }
  };

  const handleQuickView = (item: NashtaPointItem) => {
    setSelectedItemForModal(item);
    setActiveModalImageIdx(0);
  };

  if (!nashtaConfig.isEnabled && !isOwnerModeActive) {
    return null;
  }

  return (
    <section id="nashta-point-section" className="relative py-24 bg-[#0a0705] text-[#f7f4ef] overflow-hidden">
      {/* Background Ambience & Morning Light Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-600/15 via-orange-500/5 to-transparent rounded-full blur-3xl transform -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[650px] h-[650px] bg-gradient-to-tl from-yellow-600/10 via-amber-500/5 to-transparent rounded-full blur-3xl transform translate-y-1/3" />
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:36px_36px] opacity-10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {showHeader && (
          <ScrollSideEntry direction="up" className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-4 shadow-sm backdrop-blur-md">
              <SunMedium className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{nashtaConfig.eyebrow}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              {nashtaConfig.heading}
            </h2>

            <p className="mt-3 text-lg font-serif italic text-amber-200/90 max-w-2xl mx-auto">
              {nashtaConfig.tagline}
            </p>

            <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
              {nashtaConfig.description}
            </p>

            {/* Timing Badge */}
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900/90 border border-amber-500/20 text-stone-200 text-xs sm:text-sm font-medium shadow-inner">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{nashtaConfig.timingBadge}</span>
            </div>
          </ScrollSideEntry>
        )}

        {/* Featured Offer Banner (if configured) */}
        {nashtaConfig.showOfferBanner && nashtaConfig.featuredOfferText && (
          <ScrollSideEntry direction="up" className="mb-10">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/70 via-stone-900/90 to-amber-950/70 border border-amber-500/40 p-5 sm:p-6 shadow-xl backdrop-blur-md">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl" />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 text-left">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-300">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500 text-[#14110f] text-[10px] font-black tracking-wider uppercase mb-1">
                      BREAKFAST SPECIAL
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {nashtaConfig.featuredOfferText}
                    </h3>
                  </div>
                </div>

                {nashtaConfig.featuredOfferCode && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/60 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-wider shrink-0">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>CODE: {nashtaConfig.featuredOfferCode}</span>
                  </div>
                )}
              </div>
            </div>
          </ScrollSideEntry>
        )}

        {/* Controls: Category Tabs, Search Bar, Dietary Filters */}
        <div className="space-y-6 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              const count = tab.id === 'all' 
                ? nashtaItems.length 
                : nashtaItems.filter((i) => i.category === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`group relative whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-[#14110f] font-bold shadow-lg shadow-amber-500/20'
                      : 'bg-stone-900/80 text-stone-300 border border-stone-800 hover:border-amber-500/40 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-black/20 text-[#14110f]' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Dietary Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/60 p-3 sm:p-4 rounded-2xl border border-stone-800/80 backdrop-blur-md">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search Chai, Lassi, Paratha, Chana..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-950/80 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Dietary Filters */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  dietaryFilter === 'all'
                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                    : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
                }`}
              >
                All Varieties ({nashtaItems.length})
              </button>
              <button
                onClick={() => setDietaryFilter('featured')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  dietaryFilter === 'featured'
                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                    : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
                }`}
              >
                <Award className="w-3 h-3 text-amber-400" />
                <span>Featured Signatures</span>
              </button>
              <button
                onClick={() => setDietaryFilter('desi-ghee')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  dietaryFilter === 'desi-ghee'
                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                    : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
                }`}
              >
                <span>🧈 Pure Desi Ghee</span>
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                    : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Vegetarian</span>
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-stone-900/40 border border-stone-800">
            <Coffee className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-stone-300">No breakfast items found</h3>
            <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
              Try adjusting your search query or switching category filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setDietaryFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => {
              const isWishlisted = wishlistIds.includes(item.id);
              const hasDiscount = item.originalPrice && item.originalPrice > item.price;
              const savingsAmount = hasDiscount ? item.originalPrice! - item.price : 0;

              return (
                <ScrollSideEntry
                  key={item.id}
                  direction="up"
                  delay={idx * 0.04}
                  className="h-full"
                >
                  <div className="group h-full flex flex-col rounded-2xl bg-stone-900/80 border border-stone-800/90 hover:border-amber-500/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/5">
                    {/* Image Area */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-950 cursor-pointer" onClick={() => handleQuickView(item)}>
                      <img
                        src={item.featuredImage || item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[80%]">
                        {item.badge && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-[#14110f] text-[10px] font-black tracking-wide uppercase shadow-md flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>{item.badge}</span>
                          </span>
                        )}
                        {item.isFeatured && !item.badge?.includes('Signature') && (
                          <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-semibold">
                            Chef Selection
                          </span>
                        )}
                      </div>

                      {/* Top Right: Wishlist & Quick View */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {onToggleWishlist && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleWishlist(item.id);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                              isWishlisted
                                ? 'bg-amber-500 text-stone-950'
                                : 'bg-black/60 text-stone-300 hover:text-white hover:bg-black/80'
                            }`}
                            title="Save to favorites"
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                          </button>
                        )}
                      </div>

                      {/* Bottom Banner on Image: Serves & Timing */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-stone-300">
                        {item.serves && (
                          <span className="px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-md border border-stone-800 text-stone-300 font-medium">
                            {item.serves}
                          </span>
                        )}
                        {item.timing && (
                          <span className="text-[10px] text-amber-300/90 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{item.timing}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Category Label */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400/90">
                            {item.categoryLabel || item.category}
                          </span>
                          {!item.isAvailable && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300">
                              Sold Out
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 
                          onClick={() => handleQuickView(item)}
                          className="text-base sm:text-lg font-serif font-bold text-white hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
                        >
                          {item.name}
                        </h4>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Pairing Note */}
                        {item.pairing && (
                          <div className="mt-3 p-2 rounded-lg bg-amber-500/5 border border-amber-500/15 flex items-start gap-2">
                            <Utensils className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span className="text-[11px] text-amber-200/90 italic">
                              {item.pairing}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Price & Add Button */}
                      <div className="pt-4 mt-4 border-t border-stone-800/80 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg sm:text-xl font-bold font-serif text-white">
                              {formatPrice(item.price)}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-stone-500 line-through">
                                {formatPrice(item.originalPrice!)}
                              </span>
                            )}
                          </div>
                          {hasDiscount && (
                            <span className="text-[10px] text-emerald-400 font-semibold">
                              Save {formatPrice(savingsAmount)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuickView(item)}
                            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => handleAddToCart(item, e)}
                            disabled={!item.isAvailable}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                              item.isAvailable
                                ? 'bg-amber-500 hover:bg-amber-400 text-[#14110f] shadow-md shadow-amber-500/10 active:scale-95'
                                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollSideEntry>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick View / Dish Specifications Modal */}
      <AnimatePresence>
        {selectedItemForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-3xl bg-stone-900 border border-amber-500/30 overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItemForModal(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-stone-300 hover:text-white flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Modal Left Image View */}
                <div className="md:w-1/2 relative bg-stone-950 aspect-[4/3] md:aspect-auto">
                  <img
                    src={
                      selectedItemForModal.images && selectedItemForModal.images.length > 0
                        ? selectedItemForModal.images[activeModalImageIdx] || selectedItemForModal.image
                        : selectedItemForModal.image
                    }
                    alt={selectedItemForModal.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent md:hidden" />

                  {/* Multi-image thumbnail selector */}
                  {selectedItemForModal.images && selectedItemForModal.images.length > 1 && (
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 overflow-x-auto pb-1">
                      {selectedItemForModal.images.map((imgUrl, iIdx) => (
                        <button
                          key={iIdx}
                          onClick={() => setActiveModalImageIdx(iIdx)}
                          className={`w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                            activeModalImageIdx === iIdx
                              ? 'border-amber-400 scale-105'
                              : 'border-white/30 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modal Right Content */}
                <div className="p-6 md:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                        {selectedItemForModal.categoryLabel || selectedItemForModal.category}
                      </span>
                      {selectedItemForModal.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-[#14110f] text-[10px] font-black uppercase">
                          {selectedItemForModal.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                      {selectedItemForModal.name}
                    </h3>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-bold font-serif text-white">
                        {formatPrice(selectedItemForModal.price)}
                      </span>
                      {selectedItemForModal.originalPrice && (
                        <span className="text-sm text-stone-500 line-through">
                          {formatPrice(selectedItemForModal.originalPrice)}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-stone-300 mt-4 leading-relaxed">
                      {selectedItemForModal.description}
                    </p>

                    {/* Specifications List */}
                    <div className="mt-4 space-y-2 pt-3 border-t border-stone-800 text-xs text-stone-300">
                      {selectedItemForModal.serves && (
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400">Serving Size:</span>
                          <span className="font-semibold text-white">{selectedItemForModal.serves}</span>
                        </div>
                      )}
                      {selectedItemForModal.timing && (
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400">Serving Window:</span>
                          <span className="font-semibold text-amber-300">{selectedItemForModal.timing}</span>
                        </div>
                      )}
                      {selectedItemForModal.pairing && (
                        <div className="pt-2">
                          <span className="text-stone-400 block mb-1">Recommended Pairing:</span>
                          <span className="text-amber-200/90 italic">{selectedItemForModal.pairing}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <div className="pt-6 mt-6 border-t border-stone-800 flex items-center gap-3">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedItemForModal);
                        setSelectedItemForModal(null);
                      }}
                      disabled={!selectedItemForModal.isAvailable}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        selectedItemForModal.isAvailable
                          ? 'bg-amber-500 hover:bg-amber-400 text-[#14110f] shadow-lg shadow-amber-500/20'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Breakfast Order • {formatPrice(selectedItemForModal.price)}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
