import React, { useState, useMemo } from 'react';
import { PageId, DessertBarItem, DessertBarCategory } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { AtmosphericVaporEffect } from './AtmosphericVaporEffect';
import { 
  Sparkles, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  CalendarCheck, 
  ShieldCheck, 
  Flame, 
  Check, 
  Info,
  Layers,
  Heart,
  Snowflake,
  Star,
  Coffee,
  X,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AiAssistantButton } from './AiAssistantButton';
import { ScrollSideEntry } from './ScrollSideEntry';

interface DessertBarSectionProps {
  onNavigate: (page: PageId) => void;
  onToggleWishlist: (dishId: string) => void;
  wishlistIds: string[];
  onShowToast: (title: string, message: string, type?: 'gold' | 'emerald' | 'amber') => void;
  showHeader?: boolean;
}

const CATEGORY_TABS: { id: DessertBarCategory; label: string; icon: string; countDesc: string }[] = [
  { id: 'all', label: 'All Desserts & Shakes', icon: '✨', countDesc: 'Full Sweet Collection' },
  { id: 'milkshakes', label: 'Thick Gourmet Milkshakes', icon: '🥤', countDesc: 'Fresh Fruit & Belgian Cocoa' },
  { id: 'ice-creams', label: 'Artisanal Ice Creams', icon: '🍨', countDesc: 'Slow-Churned Waffle Bowls' },
  { id: 'sundaes-warm', label: 'Sundaes & Warm Skillets', icon: '🔥', countDesc: 'Sizzling Brownies & Floats' },
  { id: 'falooda-kulfi', label: 'Royal Falooda & Kulfi', icon: '👑', countDesc: 'Heritage Rabri & Terracotta Pots' },
  { id: 'cold-refreshers', label: 'Cold Brews & Lemonades', icon: '🍋', countDesc: 'Mint Coolers & Iced Espresso' },
];

export const DessertBarSection: React.FC<DessertBarSectionProps> = ({
  onNavigate,
  onToggleWishlist,
  wishlistIds,
  onShowToast,
  showHeader = true,
}) => {
  const { dessertBarItems, formatPrice, isOwnerMode, toggleDessertAvailability, addToCart } = useRestaurantData();
  const [selectedCategory, setSelectedCategory] = useState<DessertBarCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPreference, setFilterPreference] = useState<'all' | 'special' | 'warm' | 'frost' | 'gf'>('all');
  const [selectedItemDetail, setSelectedItemDetail] = useState<DessertBarItem | null>(null);

  const filteredItems = useMemo(() => {
    return dessertBarItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesFlavor = item.flavorNotes.toLowerCase().includes(q);
        const matchesTags = item.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesFlavor && !matchesTags) {
          return false;
        }
      }

      // Preference filters
      if (filterPreference === 'special' && !item.isChefSpecial) return false;
      if (filterPreference === 'warm' && item.temperature !== 'Warm & Sizzling') return false;
      if (filterPreference === 'frost' && item.temperature !== 'Frost Cold') return false;
      if (filterPreference === 'gf' && !item.isGlutenFree) return false;

      return true;
    });
  }, [dessertBarItems, selectedCategory, searchQuery, filterPreference]);

  return (
    <div id="dessert-milkshake-bar" className="space-y-12">
      {showHeader && (
        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a120b] via-[#24170d] to-[#120d09] border border-[#d4af37]/30 p-8 sm:p-12 shadow-2xl">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3d2414]/70 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-4 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Gourmet Ice Cream &amp; Milkshake Bar</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#fdfbf7] tracking-tight leading-tight">
                Velvety Shakes &amp; Artisanal Gelato
              </h1>

              <p className="text-sm sm:text-base text-[#d8cebe] mt-4 leading-relaxed font-light">
                Crafted fresh with pure organic cream, sun-ripened Sindhri mangoes, 70% dark Belgian chocolate, roasted Iranian pistachios, and slow-churned rabri malai.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-8">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#140e0a]/80 border border-white/10 text-xs text-[#d8cebe]">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Organic Cream &amp; Real Fruit</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#140e0a]/80 border border-white/10 text-xs text-[#d8cebe]">
                  <Snowflake className="w-4 h-4 text-cyan-400" />
                  <span>Sub-Zero Chilled &amp; Frosted Goblets</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#140e0a]/80 border border-white/10 text-xs text-[#d8cebe]">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Freshly Baked Table Sizzlers</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollSideEntry>
      )}

      {/* SEARCH AND CATEGORY CONTROLS */}
      <ScrollSideEntry direction="right" delay={0.1}>
        <div className="space-y-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            const count = tab.id === 'all' 
              ? dessertBarItems.length 
              : dessertBarItems.filter(i => i.category === tab.id).length;

            return (
              <button
                key={tab.id}
                id={`dessert-tab-${tab.id}`}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2.5 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#d4af37] text-[#120f0d] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 font-bold'
                    : 'bg-[#18130f]/80 text-[#c5bcad] border-[#2e241c] hover:border-[#d4af37]/40 hover:text-white'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-[#120f0d]/20 text-[#120f0d]' : 'bg-[#261e17] text-[#a89d8f]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Bar: Search and Quick Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#140f0c] p-4 rounded-2xl border border-[#2b221a]">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#8c8072] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="dessert-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shakes, gelato, falooda, kulfi..."
              className="w-full pl-10 pr-4 py-2 bg-[#1c1510] border border-[#33271d] rounded-xl text-xs text-[#fdfbf7] placeholder-[#7d7265] focus:outline-none focus:border-[#d4af37] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8c8072] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterPreference('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                filterPreference === 'all'
                  ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]'
                  : 'bg-[#1c1510] text-[#9c9183] border border-[#2e231a] hover:text-white'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilterPreference('special')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 transition-all ${
                filterPreference === 'special'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60'
                  : 'bg-[#1c1510] text-[#9c9183] border border-[#2e231a] hover:text-white'
              }`}
            >
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Chef's Choice</span>
            </button>
            <button
              onClick={() => setFilterPreference('warm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 transition-all ${
                filterPreference === 'warm'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/60'
                  : 'bg-[#1c1510] text-[#9c9183] border border-[#2e231a] hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-orange-400" />
              <span>Hot Sizzlers</span>
            </button>
            <button
              onClick={() => setFilterPreference('frost')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 transition-all ${
                filterPreference === 'frost'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                  : 'bg-[#1c1510] text-[#9c9183] border border-[#2e231a] hover:text-white'
              }`}
            >
              <Snowflake className="w-3 h-3 text-cyan-400" />
              <span>Frost Cold</span>
            </button>
            <button
              onClick={() => setFilterPreference('gf')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 transition-all ${
                filterPreference === 'gf'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60'
                  : 'bg-[#1c1510] text-[#9c9183] border border-[#2e231a] hover:text-white'
              }`}
            >
              <span>Gluten-Free</span>
            </button>
          </div>
        </div>
      </div>
    </ScrollSideEntry>

      {/* ITEMS GRID */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-[#16100c] rounded-3xl border border-[#261e17]">
          <p className="text-lg text-[#d8cebe] font-serif">No sweet treats match your filter</p>
          <p className="text-xs text-[#8c8072] mt-1">Try clearing search terms or resetting category filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterPreference('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#d4af37] text-[#120f0d] text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#e6c250]"
          >
            Show All Desserts
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, idx) => {
            const isWishlisted = wishlistIds.includes(item.id);

            return (
              <ScrollSideEntry
                key={item.id}
                direction={idx % 2 === 0 ? 'left' : 'right'}
                delay={(idx % 3) * 0.08}
                className="h-full"
              >
                <motion.div
                  id={`dessert-card-${item.id}`}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="food-card group relative rounded-2xl flex flex-col overflow-hidden h-full cursor-pointer"
                >
                {/* Image Container with Hover Zoom */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#100c09]">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17110d] via-transparent to-black/40" />
                  <AtmosphericVaporEffect item={item} />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.isChefSpecial && (
                        <span className="px-2.5 py-1 rounded-full bg-[#d4af37] text-[#120f0d] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md shadow-black/50">
                          <Star className="w-3 h-3 fill-[#120f0d]" />
                          <span>Chef Special</span>
                        </span>
                      )}
                      {item.temperature === 'Warm & Sizzling' && (
                        <span className="px-2.5 py-1 rounded-full bg-orange-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md shadow-black/50">
                          <Flame className="w-3 h-3" />
                          <span>Sizzling</span>
                        </span>
                      )}
                      {item.temperature === 'Frost Cold' && (
                        <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md shadow-black/50">
                          <Snowflake className="w-3 h-3" />
                          <span>Frost Cold</span>
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(item.id);
                        onShowToast(
                          isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist',
                          `${item.name} ${isWishlisted ? 'removed' : 'added'} to your table wishlist.`,
                          'gold'
                        );
                      }}
                      className="pointer-events-auto w-9 h-9 rounded-full bg-[#140e0a]/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-[#d4af37] hover:scale-110 transition-all cursor-pointer shadow-lg"
                      title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      {isWishlisted ? (
                        <BookmarkCheck className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Serving Size Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-[#120e0b]/90 backdrop-blur-md text-[11px] font-mono text-[#d4af37] border border-[#d4af37]/30">
                      {item.servingSize}
                    </span>

                    {/* Availability Status */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#120e0b]/90 backdrop-blur-md border border-white/10 text-[11px]">
                      <span className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
                      <span className={item.isAvailable ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                        {item.isAvailable ? 'Available' : 'Sold Out'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors leading-snug">
                        {item.name}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#b8ad9e] mt-2 line-clamp-3 leading-relaxed font-light">
                      {item.description}
                    </p>

                    {/* Flavor Notes Quote */}
                    <div className="mt-3 p-2.5 rounded-xl bg-[#211812]/70 border border-[#36271c] flex items-center gap-2 text-xs text-[#d8cebe]">
                      <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <span className="truncate italic font-serif">{item.flavorNotes}</span>
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#2a1e16] text-[#9e9182] text-[10px] font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Price & Actions */}
                  <div className="pt-4 border-t border-[#261d16] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-[#8c8072] uppercase tracking-wider block">Price</span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-[#d4af37]">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* AI Dessert Assistant Button */}
                      <AiAssistantButton
                        context={{
                          section: 'desserts',
                          itemId: item.id,
                          itemName: item.name,
                          itemPrice: item.price,
                          category: item.category,
                          title: item.name
                        }}
                        variant="icon"
                        size="xs"
                        tooltipText={`Ask AI about ${item.name}`}
                      />

                      <button
                        onClick={() => setSelectedItemDetail(item)}
                        className="p-2 rounded-xl bg-[#241a13] hover:bg-[#33251c] text-[#e0d6c8] border border-[#3d2b1f] text-xs font-semibold tracking-wider transition-all cursor-pointer"
                        title="View details & presentation"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => {
                          onToggleWishlist(item.id);
                          onShowToast('Table Reservation Paired', `Added ${item.name} to your dining wishlist!`, 'gold');
                        }}
                        className={`p-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 border ${
                          isWishlisted
                            ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#fdfbf7]'
                            : 'bg-[#1a1410] border-[#33251c] text-[#a89d8f] hover:text-[#d4af37]'
                        }`}
                        title="Save to Dining Wishlist"
                        aria-label="Save to wishlist"
                      >
                        {isWishlisted ? (
                          <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            category: item.category,
                            image: item.image,
                          });
                          onShowToast('Added to Cart', `${item.name} added to your order`, 'gold');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e6c250] text-[#120f0d] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#d4af37]/20 hover:scale-102 active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>

                  {/* Owner Controls */}
                  {isOwnerMode && (
                    <div className="pt-2 border-t border-dashed border-[#d4af37]/30 flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-mono">Owner Management</span>
                      <button
                        onClick={() => {
                          toggleDessertAvailability(item.id);
                          onShowToast(
                            'Status Updated',
                            `${item.name} is now marked as ${item.isAvailable ? 'Sold Out' : 'Available'}.`,
                            'amber'
                          );
                        }}
                        className="px-2 py-1 rounded bg-[#2e2015] hover:bg-[#3d2b1d] text-white cursor-pointer"
                      >
                        Toggle Availability
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </ScrollSideEntry>
          );
        })}
        </div>
      )}

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedItemDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#18110c] border border-[#d4af37]/40 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-[#d4af37] flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Banner */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
                <img
                  src={selectedItemDetail.image}
                  alt={selectedItemDetail.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18110c] via-transparent to-black/30" />

                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-[#d4af37] text-[#120f0d] text-[10px] font-extrabold uppercase tracking-wider">
                      {selectedItemDetail.servingSize}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
                      {selectedItemDetail.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#a89d8f] uppercase block">Price</span>
                    <span className="font-serif text-2xl font-bold text-[#d4af37]">
                      {formatPrice(selectedItemDetail.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                    Culinary Description &amp; Craft
                  </h4>
                  <p className="text-sm text-[#d8cebe] leading-relaxed mt-2 font-light">
                    {selectedItemDetail.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#211710] border border-[#38271a] space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-[#a89d8f] font-semibold block">
                    Flavor Profile &amp; Tasting Notes
                  </span>
                  <p className="text-sm text-[#fdfbf7] font-serif italic">
                    "{selectedItemDetail.flavorNotes}"
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#140e0a] border border-[#2b1f15]">
                    <span className="text-[#8c8072] block">Temperature</span>
                    <span className="text-cyan-400 font-semibold mt-0.5 block">{selectedItemDetail.temperature}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#140e0a] border border-[#2b1f15]">
                    <span className="text-[#8c8072] block">Halal Guarantee</span>
                    <span className="text-emerald-400 font-semibold mt-0.5 block">100% Halal &amp; Pure</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#140e0a] border border-[#2b1f15] col-span-2 sm:col-span-1">
                    <span className="text-[#8c8072] block">Availability</span>
                    <span className={selectedItemDetail.isAvailable ? 'text-emerald-400 font-semibold mt-0.5 block' : 'text-red-400 font-semibold mt-0.5 block'}>
                      {selectedItemDetail.isAvailable ? 'Ready to Serve' : 'Sold Out for Service'}
                    </span>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="pt-4 border-t border-[#2d2016] flex flex-wrap items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      onToggleWishlist(selectedItemDetail.id);
                      onShowToast('Table Item Added', `${selectedItemDetail.name} saved to wishlist.`, 'gold');
                    }}
                    className="px-4 py-3 rounded-xl bg-[#241a13] hover:bg-[#33251c] text-[#c5bcad] hover:text-white border border-[#3d2b1f] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Save to Wishlist
                  </button>
                  <button
                    onClick={() => {
                      addToCart({
                        id: selectedItemDetail.id,
                        name: selectedItemDetail.name,
                        price: selectedItemDetail.price,
                        category: selectedItemDetail.category,
                        image: selectedItemDetail.image,
                      });
                      onShowToast('Added to Cart', `${selectedItemDetail.name} added to your order`, 'gold');
                      setSelectedItemDetail(null);
                    }}
                    className="px-6 py-3 rounded-xl bg-[#d4af37] text-[#120f0d] font-bold text-xs uppercase tracking-wider hover:bg-[#e6c250] transition-all cursor-pointer shadow-lg shadow-[#d4af37]/20 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart ({formatPrice(selectedItemDetail.price)})</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItemDetail(null);
                      onNavigate('reservations');
                    }}
                    className="px-5 py-3 rounded-xl bg-[#2b1e15] hover:bg-[#3d2a1d] text-white border border-[#4a3424] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Book Table
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
