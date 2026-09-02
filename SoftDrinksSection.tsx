import React, { useState, useMemo, useRef } from 'react';
import { SoftDrinkItem, DrinkSizeOption, PageId } from '../types';
import { SOFT_DRINKS } from '../data/restaurantData';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { AtmosphericVaporEffect } from './AtmosphericVaporEffect';
import { 
  Sparkles, 
  Search, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  ShieldCheck, 
  Flame, 
  CupSoda, 
  Coffee, 
  Zap, 
  Heart,
  Droplets,
  Award,
  Layers,
  ArrowRight,
  Info,
  Plus,
  Minus,
  ShoppingBag,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AiAssistantButton } from './AiAssistantButton';
import { ScrollSideEntry } from './ScrollSideEntry';

interface SoftDrinksSectionProps {
  onNavigate?: (page: PageId, subCategory?: string) => void;
  onToggleWishlist?: (dishId: string) => void;
  wishlistIds?: string[];
  onShowToast?: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
  showHeader?: boolean;
}

type CategoryFilter = 'all' | 'carbonated' | 'local-heritage' | 'diet-zero' | 'energy-refreshers' | 'traditional' | 'water-juices';

export const SoftDrinksSection: React.FC<SoftDrinksSectionProps> = ({
  onNavigate,
  onToggleWishlist,
  wishlistIds = [],
  onShowToast,
  showHeader = true,
}) => {
  const { 
    softDrinks: contextSoftDrinks, 
    formatPrice, 
    config, 
    addToCart, 
    openOrderModal 
  } = useRestaurantData();

  // Use dynamic softDrinks from context, fallback to static default
  const activeDrinkList = (contextSoftDrinks && contextSoftDrinks.length > 0) ? contextSoftDrinks : SOFT_DRINKS;

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [expandedDrinkId, setExpandedDrinkId] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Available brands for quick filter
  const allBrands = useMemo(() => {
    const brands = Array.from(new Set(activeDrinkList.map((d) => d.brand)));
    return ['all', ...brands];
  }, [activeDrinkList]);

  const filteredDrinks = useMemo(() => {
    return activeDrinkList.filter((drink) => {
      // Category filter
      if (activeCategory !== 'all' && drink.category !== activeCategory) {
        return false;
      }
      // Brand filter
      if (selectedBrandFilter !== 'all' && drink.brand !== selectedBrandFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = drink.name.toLowerCase().includes(q);
        const matchesBrand = drink.brand.toLowerCase().includes(q);
        const matchesFlavor = (drink.flavorProfile || '').toLowerCase().includes(q);
        const matchesTags = drink.tags?.some((t) => t.toLowerCase().includes(q));
        return matchesName || matchesBrand || matchesFlavor || matchesTags;
      }
      return true;
    });
  }, [activeDrinkList, activeCategory, selectedBrandFilter, searchQuery]);

  const handleSelectSize = (drinkId: string, sizeIndex: number) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [drinkId]: sizeIndex,
    }));
    setExpandedDrinkId(drinkId);

    // Auto-scroll gently only if needed (block: 'nearest')
    setTimeout(() => {
      const cardEl = cardRefs.current[drinkId];
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect();
        const isNearBottom = rect.bottom > (window.innerHeight - 80);
        if (isNearBottom) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }, 120);
  };

  const getActiveSizeOption = (drink: SoftDrinkItem): DrinkSizeOption => {
    const selectedIdx = selectedSizes[drink.id] ?? 0;
    return (drink.sizes && drink.sizes[selectedIdx]) ? drink.sizes[selectedIdx] : (drink.sizes?.[0] || { size: 'Standard', price: 140 });
  };

  const getQuantity = (drinkId: string): number => {
    return quantities[drinkId] || 1;
  };

  const handleUpdateQuantity = (drinkId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[drinkId] || 1;
      const next = Math.max(1, Math.min(20, current + delta));
      return { ...prev, [drinkId]: next };
    });
  };

  const handleAddDrinkToWishlist = (drink: SoftDrinkItem) => {
    if (onToggleWishlist) {
      onToggleWishlist(drink.id);
      const isCurrentlyIn = wishlistIds.includes(drink.id);
      if (onShowToast) {
        const sizeOption = getActiveSizeOption(drink);
        if (!isCurrentlyIn) {
          onShowToast(
            'Added to Dining Wishlist',
            `${drink.name} (${sizeOption.size}) will be chilled for your table.`,
            'gold'
          );
        } else {
          onShowToast('Removed from Wishlist', `${drink.name} removed.`, 'info');
        }
      }
    }
  };

  const handleAddToCartWithActiveSize = (drink: SoftDrinkItem) => {
    const activeSize = getActiveSizeOption(drink);
    const qty = getQuantity(drink.id);

    addToCart({
      id: `${drink.id}-${activeSize.size.replace(/\s+/g, '-').toLowerCase()}`,
      name: `${drink.name} (${activeSize.size})`,
      price: activeSize.price,
      category: 'soft-drinks',
      image: drink.image,
      servingSize: activeSize.size,
    }, qty);

    if (onShowToast) {
      onShowToast(
        'Added to Cart',
        `${qty}x ${drink.name} (${activeSize.size}) — ${formatPrice(activeSize.price * qty)} added to your order`,
        'gold'
      );
    }
  };

  const handleDirectOrderNow = (drink: SoftDrinkItem) => {
    const activeSize = getActiveSizeOption(drink);
    const qty = getQuantity(drink.id);

    const itemEntry = {
      id: `${drink.id}-${activeSize.size.replace(/\s+/g, '-').toLowerCase()}`,
      name: `${drink.name} (${activeSize.size})`,
      price: activeSize.price,
      quantity: qty,
      category: 'soft-drinks',
      image: drink.image,
      servingSize: activeSize.size,
    };

    // Open checkout modal directly with preselected item
    if (openOrderModal) {
      openOrderModal('delivery', itemEntry, 'checkout');
    }
  };

  const handleWhatsAppOrder = (drink: SoftDrinkItem) => {
    const activeSize = getActiveSizeOption(drink);
    const qty = getQuantity(drink.id);
    const totalPkr = activeSize.price * qty;
    const phone = config.contact?.whatsappClean || config.contact?.phoneClean || '923001234567';
    const text = encodeURIComponent(
      `Salam! I would like to order from ${config.name || 'SITE FOR SALE'}:\n` +
      `• Item: ${drink.name} (${activeSize.size})\n` +
      `• Quantity: ${qty}\n` +
      `• Total: ${formatPrice(totalPkr)}\n` +
      `• Temperature: ${drink.temperature || 'Ice Cold'}\n` +
      `Please confirm availability and delivery time.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleDirectPhoneCall = () => {
    const phone = config.contact?.phone || '+92 300 1234567';
    window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
  };

  return (
    <section id="soft-drinks-section" className="relative py-12">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#165b33]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      {showHeader && (
        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              {/* Chilled Refreshment Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#241a13] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold uppercase tracking-widest">
                <CupSoda className="w-4 h-4 text-[#d4af37]" />
                <span>Chilled Sodas &amp; Refreshing Beverages (100% Halal)</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#fdfbf7]">
                Soft Drinks &amp; Refreshing Beverages
              </h2>
              <p className="text-[#c5bcad] text-sm sm:text-base leading-relaxed">
                Curated with popular sodas, chilled carbonated colas, local heritage beverages, artisan chais, and handcrafted fresh coolers. Served frost-cold with crystal ice in all available size tiers.
              </p>

              {/* Quick Feature Strip */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#a89d8f]">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#d4af37]" /> 250ml Cans &amp; 345ml Glass Bottles
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#d4af37]" /> 500ml PET &amp; 1.5L Family Sharing
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4ade80]" /> 100% Halal Certified
                </span>
              </div>
            </div>
          </div>
        </ScrollSideEntry>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category & Search Navigation Bar */}
        <ScrollSideEntry direction="left" delay={0.15}>
          <div className="bg-[#181310] border border-[#2e2620] rounded-2xl p-4 sm:p-5 mb-8 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none text-xs">
                {[
                  { id: 'all', label: 'All Beverages', icon: CupSoda },
                  { id: 'carbonated', label: 'Classic Sodas', icon: Zap },
                  { id: 'local-heritage', label: 'Pakola & Heritage', icon: Award },
                  { id: 'diet-zero', label: 'Diet & Zero', icon: Sparkles },
                  { id: 'energy-refreshers', label: 'Energy & Coolers', icon: Flame },
                  { id: 'traditional', label: 'Chai & Lassi', icon: Coffee },
                  { id: 'water-juices', label: 'Water & Juices', icon: Droplets }
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as CategoryFilter)}
                      className={`px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isActive
                          ? 'bg-[#d4af37] text-[#120f0d] border-[#d4af37] shadow-md shadow-[#d4af37]/20 font-bold'
                          : 'bg-[#120f0d] text-[#c5bcad] border-[#2e2620] hover:text-[#fdfbf7] hover:border-[#4a3b30]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-[#8c7e6e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Pepsi, Sprite, 250ml..."
                  className="w-full bg-[#120f0d] border border-[#2e2620] focus:border-[#d4af37] text-xs text-[#fdfbf7] pl-9 pr-4 py-2 rounded-xl focus:outline-none placeholder-[#6b5f51]"
                />
              </div>
            </div>

            {/* Brand Quick Filter Chips */}
            <div className="pt-2 border-t border-[#2e2620]/60 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
              <span className="text-[#8c7e6e] shrink-0 font-medium text-[11px]">Filter by House:</span>
              {allBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrandFilter(brand)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                    selectedBrandFilter === brand
                      ? 'bg-[#2e2620] text-[#d4af37] border border-[#d4af37]/40 font-semibold'
                      : 'text-[#a89d8f] hover:text-[#fdfbf7] bg-[#120f0d]'
                  }`}
                >
                  {brand === 'all' ? 'All Bottlers' : brand}
                </button>
              ))}
            </div>
          </div>
        </ScrollSideEntry>

        {/* Drinks Grid */}
        {filteredDrinks.length === 0 ? (
          <div className="text-center py-16 bg-[#1a1613] rounded-2xl border border-[#2e2620] p-8 space-y-3">
            <CupSoda className="w-12 h-12 text-[#a89d8f] mx-auto stroke-1" />
            <h3 className="font-serif text-lg text-[#fdfbf7]">No beverages found</h3>
            <p className="text-xs text-[#a89d8f] max-w-sm mx-auto">
              We couldn't find any drink matching "{searchQuery}". Try searching for Pepsi, Next Cola, Gourmet, Sprite, 7UP, or Kashmiri Chai.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setSelectedBrandFilter('all');
              }}
              className="mt-2 text-xs text-[#d4af37] hover:underline font-medium cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredDrinks.map((drink, idx) => {
                const activeSize = getActiveSizeOption(drink);
                const isWishlisted = wishlistIds.includes(drink.id);
                const isExpanded = expandedDrinkId === drink.id;
                const qty = getQuantity(drink.id);

                return (
                  <ScrollSideEntry
                    key={drink.id}
                    direction={idx % 2 === 0 ? 'left' : 'right'}
                    delay={(idx % 4) * 0.06}
                    className="h-full"
                  >
                    <div
                      ref={(el) => (cardRefs.current[drink.id] = el)}
                      className="food-card group rounded-2xl overflow-hidden flex flex-col justify-between h-full bg-[#181411] border border-[#2e2620] hover:border-[#d4af37]/60 transition-all duration-300 shadow-lg"
                    >
                      {/* Visual Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#120f0d]">
                        <img
                          src={drink.image}
                          alt={drink.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181411] via-transparent to-black/40" />
                        <AtmosphericVaporEffect item={drink} />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                          {/* Temperature and Brand Tag */}
                          <div className="flex flex-col gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[#fdfbf7] text-[10px] font-medium border border-white/10">
                              <Droplets className="w-2.5 h-2.5 text-[#38bdf8]" /> {drink.temperature || 'Ice Cold'}
                            </span>
                          </div>

                          {/* Wishlist Toggle Button */}
                          <button
                            id={`wishlist-toggle-${drink.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddDrinkToWishlist(drink);
                            }}
                            aria-label={isWishlisted ? 'Remove from table wishlist' : 'Add to table wishlist'}
                            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                              isWishlisted
                                ? 'bg-[#d4af37] text-[#120f0d] shadow-lg shadow-[#d4af37]/30 scale-105'
                                : 'bg-black/60 text-[#fdfbf7] hover:bg-black/80 hover:text-[#d4af37]'
                            }`}
                          >
                            {isWishlisted ? (
                              <BookmarkCheck className="w-4 h-4" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Brand Label on Bottom Left of Image */}
                        <div className="absolute bottom-2 left-3">
                          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#d4af37] bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded border border-[#d4af37]/30">
                            {drink.brand}
                          </span>
                        </div>
                      </div>

                      {/* Drink Information & Selection Body */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          {/* Drink Title */}
                          <h3 className="font-serif text-lg sm:text-xl text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors leading-snug">
                            {drink.name}
                          </h3>

                          {/* Flavor Profile */}
                          <p className="text-xs text-[#c5bcad] line-clamp-2 leading-relaxed">
                            {drink.description}
                          </p>

                          <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#a89d8f]">
                            <Sparkles className="w-3 h-3 text-[#d4af37] shrink-0" />
                            <span className="italic truncate">{drink.flavorProfile}</span>
                          </div>
                        </div>

                        {/* STACKED SIZE SELECTOR BOXES */}
                        <div className="space-y-2 pt-2 border-t border-[#2e2620]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#a89d8f] uppercase tracking-wider font-semibold">Select Size &amp; Packaging:</span>
                            <span className="text-[#4ade80] font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                              {drink.isAvailable ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>

                          {/* Interactive Stacked Boxes Grid */}
                          <div className="grid grid-cols-2 gap-1.5">
                            {drink.sizes.map((option, sizeIdx) => {
                              const isCurrentSelected = (selectedSizes[drink.id] ?? 0) === sizeIdx;
                              return (
                                <button
                                  key={option.size}
                                  id={`size-box-${drink.id}-${sizeIdx}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectSize(drink.id, sizeIdx);
                                  }}
                                  className={`px-2.5 py-2 rounded-xl text-left text-xs transition-all cursor-pointer border relative ${
                                    isCurrentSelected
                                      ? 'bg-[#271d15] border-[#d4af37] text-[#fdfbf7] font-semibold shadow-md shadow-[#d4af37]/15 ring-1 ring-[#d4af37]/40'
                                      : 'bg-[#120f0d] border-[#2e2620] text-[#a89d8f] hover:text-[#fdfbf7] hover:border-[#4a3b30]'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[10px] truncate leading-tight font-medium">{option.size}</span>
                                    {isCurrentSelected && (
                                      <span className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0" />
                                    )}
                                  </div>
                                  <div className={`text-xs font-bold mt-1 font-mono ${isCurrentSelected ? 'text-[#d4af37]' : 'text-[#c5bcad]'}`}>
                                    {formatPrice(option.price)}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* LOCAL DETAIL & ORDERING PANEL (Physically Connected to Selected Size Box) */}
                        <div className="pt-2">
                          <div className="bg-[#14100c] border border-[#d4af37]/35 rounded-xl p-3 space-y-3">
                            {/* Panel Header */}
                            <div className="flex items-center justify-between border-b border-[#28201a] pb-2 text-xs">
                              <div>
                                <span className="text-[10px] text-[#8c7e6e] uppercase tracking-wider block">Selected Size</span>
                                <span className="font-bold text-[#fdfbf7] text-xs">{activeSize.size}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-[#8c7e6e] uppercase tracking-wider block">Unit Price</span>
                                <span className="font-mono font-bold text-sm text-[#d4af37]">{formatPrice(activeSize.price)}</span>
                              </div>
                            </div>

                            {/* Quantity Selector & Price Sum */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center bg-[#1d1611] border border-[#382b20] rounded-lg p-0.5">
                                <button
                                  onClick={() => handleUpdateQuantity(drink.id, -1)}
                                  className="w-6 h-6 rounded flex items-center justify-center text-[#c5bcad] hover:text-[#fdfbf7] hover:bg-[#2b2017] transition-colors cursor-pointer"
                                  title="Decrease quantity"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-7 text-center font-mono font-bold text-xs text-[#fdfbf7]">
                                  {qty}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(drink.id, 1)}
                                  className="w-6 h-6 rounded flex items-center justify-center text-[#c5bcad] hover:text-[#fdfbf7] hover:bg-[#2b2017] transition-colors cursor-pointer"
                                  title="Increase quantity"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-[#8c7e6e] block">Total ({qty}x)</span>
                                <span className="font-mono font-bold text-xs text-[#4ade80]">
                                  {formatPrice(activeSize.price * qty)}
                                </span>
                              </div>
                            </div>

                            {/* Primary Action Buttons (Add to Cart & Direct Order Now) */}
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              {/* Add to Cart */}
                              <button
                                id={`add-cart-${drink.id}`}
                                onClick={() => handleAddToCartWithActiveSize(drink)}
                                className="w-full py-2 px-2.5 rounded-lg bg-[#271d15] hover:bg-[#382a1e] border border-[#d4af37]/60 text-[#d4af37] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Add to Cart</span>
                              </button>

                              {/* Order Now (Direct Checkout) */}
                              <button
                                id={`order-now-${drink.id}`}
                                onClick={() => handleDirectOrderNow(drink)}
                                className="w-full py-2 px-2.5 rounded-lg bg-[#d4af37] hover:bg-[#e6c250] text-[#120f0d] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#d4af37]/25 active:scale-98"
                              >
                                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Order Now</span>
                              </button>
                            </div>

                            {/* Secondary Quick Order Channels (WhatsApp & Direct Phone & AI) */}
                            <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-[#28201a]">
                              {/* WhatsApp Order */}
                              <button
                                onClick={() => handleWhatsAppOrder(drink)}
                                className="flex-1 py-1 px-1.5 rounded-md bg-[#052e16]/60 hover:bg-[#052e16] border border-[#166534] text-[#4ade80] text-[10px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                title="Order via WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </button>

                              {/* Direct Phone Call */}
                              <button
                                onClick={handleDirectPhoneCall}
                                className="flex-1 py-1 px-1.5 rounded-md bg-[#1e1b18] hover:bg-[#2e2a26] border border-[#3e3833] text-[#c5bcad] hover:text-[#fdfbf7] text-[10px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                title="Call Restaurant Phone"
                              >
                                <Phone className="w-3 h-3 text-[#d4af37]" />
                                <span>Call Direct</span>
                              </button>

                              {/* AI Assistant Question */}
                              <AiAssistantButton
                                context={{
                                  section: 'drinks',
                                  itemId: drink.id,
                                  itemName: `${drink.name} (${activeSize.size})`,
                                  itemPrice: activeSize.price,
                                  category: drink.category,
                                  title: `${drink.name} (${activeSize.size})`
                                }}
                                variant="icon"
                                size="xs"
                                tooltipText={`Ask AI about ${drink.name} (${activeSize.size})`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollSideEntry>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Beverage Craft Banner */}
        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="mt-12 bg-gradient-to-r from-[#241911] via-[#1a1613] to-[#251e18] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37] font-bold">
                <CupSoda className="w-4 h-4" />
                <span>Chilled Refreshment Experience</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#fdfbf7]">
                Served Frost-Cold With Every Meal
              </h3>
              <p className="text-xs sm:text-sm text-[#c5bcad] max-w-2xl leading-relaxed">
                Pair your slow-cooked Karahi, smoked Seekh Kebabs, and charcoal platters with crystal-chilled sodas, gourmet milkshakes, and slow-steeped earthen chais.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              {onNavigate && (
                <button
                  id="reserve-table-from-drinks"
                  onClick={() => onNavigate('reservations')}
                  className="px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#c49f2f] text-[#120f0d] text-xs uppercase tracking-widest font-bold transition-all shadow-lg shadow-[#d4af37]/20 flex items-center gap-2 cursor-pointer"
                >
                  <span>Book a Table Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </ScrollSideEntry>
      </div>
    </section>
  );
};
