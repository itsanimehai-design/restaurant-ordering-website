import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Sparkles, 
  ShoppingBag, 
  CheckCircle2, 
  Search, 
  SlidersHorizontal, 
  UtensilsCrossed, 
  Flame, 
  Percent, 
  Star, 
  Zap, 
  Heart,
  Info,
  Clock,
  Wine,
  IceCream,
  CircleDot
} from 'lucide-react';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { DealItem, DealIncludedProduct } from '../types';

interface DealsSectionProps {
  onOrderNow?: (deal: DealItem) => void;
}

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All Combos & Deals', icon: Sparkles },
  { id: 'family', label: 'Family Deals', icon: Users },
  { id: 'couple', label: 'Couple Feasts', icon: Heart },
  { id: 'friends', label: 'Friends & BBQ', icon: Flame },
  { id: 'single', label: 'Solo & Executive', icon: Zap },
  { id: 'party', label: 'Party & Dawat', icon: Star },
  { id: 'kids', label: 'Kids Specials', icon: UtensilsCrossed },
];

export const DealsSection: React.FC<DealsSectionProps> = ({ onOrderNow }) => {
  const { deals, formatPrice, addToCart, openOrderModal } = useRestaurantData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<number>(12000);
  const [addedDealId, setAddedDealId] = useState<string | null>(null);
  const [likedDeals, setLikedDeals] = useState<Record<string, boolean>>({});

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      // Category match
      if (selectedCategory !== 'all' && deal.category !== selectedCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = deal.name.toLowerCase().includes(q);
        const matchesDesc = deal.description.toLowerCase().includes(q);
        const matchesItems = deal.includedItems?.some((i) => i.name.toLowerCase().includes(q));
        const matchesBadge = deal.badge?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesItems && !matchesBadge) {
          return false;
        }
      }
      // Budget match
      if (deal.price > maxBudget) {
        return false;
      }
      return true;
    });
  }, [deals, selectedCategory, searchQuery, maxBudget]);

  const handleAddToCart = (deal: DealItem) => {
    const includedSummary = deal.includedItems?.map(i => `${i.quantity}x ${i.name}`).join(', ');
    addToCart({
      id: deal.id,
      name: deal.name,
      price: deal.price,
      category: 'Meals & Deals',
      image: deal.image,
      servingSize: deal.serves || includedSummary
    }, 1);

    setAddedDealId(deal.id);
    setTimeout(() => {
      setAddedDealId((curr) => (curr === deal.id ? null : curr));
    }, 2000);
  };

  const handleDirectOrder = (deal: DealItem) => {
    if (onOrderNow) {
      onOrderNow(deal);
    } else {
      const includedSummary = deal.includedItems?.map(i => `${i.quantity}x ${i.name}`).join(', ');
      openOrderModal('delivery', {
        id: deal.id,
        name: deal.name,
        price: deal.price,
        quantity: 1,
        servingSize: deal.serves || includedSummary,
        image: deal.image
      });
    }
  };

  const toggleLike = (dealId: string) => {
    setLikedDeals(prev => ({ ...prev, [dealId]: !prev[dealId] }));
  };

  const getItemCategoryIcon = (category?: string) => {
    if (category === 'drink') return <Wine className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />;
    if (category === 'dessert') return <IceCream className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />;
    return <CircleDot className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />;
  };

  return (
    <div id="meals-deals-section" className="w-full">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-10 border border-amber-500/20 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Crafted Deal Packages & Combos</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-100 mb-3 tracking-tight">
            Meals & Deals
          </h2>
          <p className="text-stone-300 text-sm md:text-base leading-relaxed mb-6">
            Curated dining combinations featuring signature Shanwari woks, charcoal grill platters, tandoori breads, chilled drinks, and royal desserts. Designed for unbeatable value and convenience.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-3 text-center">
              <span className="text-xl font-bold text-amber-400 block">{deals.length}</span>
              <span className="text-xs text-stone-400 uppercase font-medium">Ready Combos</span>
            </div>
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-3 text-center">
              <span className="text-xl font-bold text-amber-400 block">Up to 25%</span>
              <span className="text-xs text-stone-400 uppercase font-medium">Bundle Savings</span>
            </div>
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-3 text-center">
              <span className="text-xl font-bold text-amber-400 block">1 - 10+</span>
              <span className="text-xs text-stone-400 uppercase font-medium">Persons Servings</span>
            </div>
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-3 text-center">
              <span className="text-xl font-bold text-emerald-400 block">100% Halal</span>
              <span className="text-xs text-stone-400 uppercase font-medium">Freshly Cooked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-900/70 border border-stone-800/80 rounded-2xl p-4 md:p-6 mb-8 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORY_OPTIONS.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`deal-tab-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-500/20'
                      : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-stone-950' : 'text-amber-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="deal-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deals, dishes, drinks..."
              className="w-full bg-stone-950/80 border border-stone-800 text-stone-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-amber-500/60 transition-colors placeholder:text-stone-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Budget Filter Slider Subrow */}
        <div className="mt-4 pt-4 border-t border-stone-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Filter by Max Budget: <strong className="text-amber-400 font-semibold">{formatPrice(maxBudget)}</strong></span>
          </div>
          <div className="w-full sm:w-64 flex items-center gap-3">
            <span className="text-stone-500">₨500</span>
            <input
              type="range"
              min="500"
              max="12000"
              step="250"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="text-stone-500">₨12k</span>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      {filteredDeals.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-stone-900/40 border border-stone-800">
          <UtensilsCrossed className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-300 mb-1">No Deals Match Your Filter</h3>
          <p className="text-sm text-stone-500 mb-4">Try adjusting your category selection, search terms, or budget limit.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setMaxBudget(12000);
            }}
            className="px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold hover:bg-amber-500/30 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDeals.map((deal, index) => {
              const isAdded = addedDealId === deal.id;
              const isLiked = !!likedDeals[deal.id];

              return (
                <motion.div
                  key={deal.id}
                  id={`deal-card-${deal.id}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`group flex flex-col justify-between rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 ${
                    deal.isFeatured 
                      ? 'border-amber-500/40 hover:border-amber-400' 
                      : 'border-stone-800 hover:border-stone-700'
                  }`}
                >
                  {/* Card Top: Image & Overlay Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-950">
                    <img
                      src={deal.image}
                      alt={deal.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                    {/* Top Left: Custom Badge */}
                    {deal.badge && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500/90 text-stone-950 text-xs font-bold shadow-lg backdrop-blur-sm">
                        {deal.badge}
                      </div>
                    )}

                    {/* Top Right: Wishlist and AI Rating */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      {deal.showAiRating && deal.aiRating && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-950/80 border border-amber-500/30 text-amber-400 text-xs font-bold backdrop-blur-md">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{deal.aiRating}</span>
                        </div>
                      )}
                      <button
                        onClick={() => toggleLike(deal.id)}
                        className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                          isLiked 
                            ? 'bg-rose-500/80 text-white' 
                            : 'bg-stone-950/60 text-stone-300 hover:text-white'
                        }`}
                        title="Save to favorites"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom overlay: Servings & Savings */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/90 border border-stone-700 text-stone-200 font-medium backdrop-blur-md">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>{deal.serves || 'Multiple Servings'}</span>
                      </div>

                      {deal.savingsText && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-semibold backdrop-blur-md">
                          <Percent className="w-3 h-3" />
                          <span>{deal.savingsText}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body: Details & Included Products */}
                  <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold font-serif text-stone-100 group-hover:text-amber-400 transition-colors">
                          {deal.name}
                        </h3>
                      </div>

                      <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                        {deal.description}
                      </p>

                      {/* Included Items Box */}
                      <div className="bg-stone-950/70 border border-stone-800/80 rounded-2xl p-3.5 mb-5">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center justify-between">
                          <span>Included in this Combo:</span>
                          <span className="text-stone-500 font-normal">{deal.includedItems?.length || 0} Items</span>
                        </div>

                        <ul className="space-y-1.5">
                          {deal.includedItems?.map((item: DealIncludedProduct, idx: number) => (
                            <li key={idx} className="flex items-center justify-between text-xs text-stone-300">
                              <div className="flex items-center gap-2 truncate pr-2">
                                {getItemCategoryIcon(item.category)}
                                <span className="truncate">{item.name}</span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded bg-stone-800 text-amber-400 font-mono text-[11px] font-bold flex-shrink-0">
                                {item.quantity}x
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Card Footer: Pricing & CTAs */}
                    <div className="pt-4 border-t border-stone-800/80">
                      <div className="flex items-baseline justify-between mb-4">
                        <div>
                          <div className="text-xs text-stone-500 font-medium uppercase">Total Deal Price</div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-amber-400 font-serif">
                              {formatPrice(deal.price)}
                            </span>
                            {deal.originalPrice && deal.originalPrice > deal.price && (
                              <span className="text-xs text-stone-500 line-through">
                                {formatPrice(deal.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            deal.isAvailable 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${deal.isAvailable ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            {deal.isAvailable ? 'Freshly Available' : 'Sold Out Today'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons: Add to Cart & Direct Order Now */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          id={`add-cart-deal-${deal.id}`}
                          disabled={!deal.isAvailable}
                          onClick={() => handleAddToCart(deal)}
                          className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                            !deal.isAvailable
                              ? 'bg-stone-900 border-stone-800 text-stone-600 cursor-not-allowed'
                              : isAdded
                              ? 'bg-emerald-500 text-stone-950 border-emerald-400'
                              : 'bg-stone-900 hover:bg-stone-800 border-stone-700 hover:border-amber-500/50 text-stone-200 hover:text-white'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-stone-950" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>

                        <button
                          id={`order-now-deal-${deal.id}`}
                          disabled={!deal.isAvailable}
                          onClick={() => handleDirectOrder(deal)}
                          className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                            !deal.isAvailable
                              ? 'bg-stone-800 text-stone-600 cursor-not-allowed'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold shadow-amber-500/20 hover:shadow-amber-500/30'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5 fill-stone-950" />
                          <span>Order Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
