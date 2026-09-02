import React, { useState, useMemo } from 'react';
import { Sparkles, Plus, Search, Tag, Users, Clock, ArrowRight, Layers, Eye } from 'lucide-react';
import { DealBox, StoreSettings } from '../types';

interface DealsSectionProps {
  deals: DealBox[];
  settings: StoreSettings;
  onSelectDeal: (deal: DealBox) => void;
  onQuickAddDeal?: (deal: DealBox) => void;
  onQuickAddToCart?: (deal: DealBox) => void;
  onOpenOwnerPortal?: () => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({
  deals = [],
  settings,
  onSelectDeal,
  onQuickAddDeal,
  onQuickAddToCart,
  onOpenOwnerPortal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleQuickAdd = (deal: DealBox) => {
    if (onQuickAddToCart) {
      onQuickAddToCart(deal);
    } else if (onQuickAddDeal) {
      onQuickAddDeal(deal);
    } else {
      onSelectDeal(deal);
    }
  };

  const safeDeals = Array.isArray(deals) ? deals : [];

  // Extract unique categories from active deals
  const categories = useMemo(() => {
    const set = new Set<string>();
    safeDeals.forEach((d) => {
      if (d && d.category) set.add(d.category);
    });
    return ['All', ...Array.from(set)];
  }, [safeDeals]);

  // Filter deals
  const filteredDeals = useMemo(() => {
    return safeDeals.filter((deal) => {
      if (!deal || !deal.isActive) return false;

      const matchesCategory =
        selectedCategory === 'All' || deal.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesName = (deal.name || '').toLowerCase().includes(q);
      const matchesDesc = (deal.description || '').toLowerCase().includes(q);
      const matchesIncluded = (deal.includedItems || []).some(
        (item) => (item?.name || '').toLowerCase().includes(q) || (item?.note || '').toLowerCase().includes(q)
      );

      return matchesCategory && (matchesName || matchesDesc || matchesIncluded);
    });
  }, [safeDeals, selectedCategory, searchQuery]);

  return (
    <section id="deals" className="py-10 sm:py-14 bg-white border-b border-stone-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md border border-amber-200/80 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unlimited Deal / Box System</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-serif">
              Food Deals & Feast Boxes
            </h2>
            <p className="text-stone-500 text-sm mt-1 max-w-2xl">
              Freshly prepared value meals loaded with burgers, fries, wings, nuggets, and drinks. Every deal is fully customizable with delicious add-ons!
            </p>
          </div>

          {/* Owner Portal Action Indicator */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenOwnerPortal}
              className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-stone-300 transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-600" />
              <span>+ Add / Manage Deals in Portal</span>
            </button>
          </div>
        </div>

        {/* Filter Controls: Search & Category Pills */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200/70 border border-stone-200/60'
                  }`}
                >
                  {cat === 'All' ? '🔥 All Deals & Boxes' : cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px] sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals, burgers, fries..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        {filteredDeals.length === 0 ? (
          <div className="text-center py-12 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
            <Layers className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="font-bold text-stone-800 text-base">No deals found in this category</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or switch categories. The owner can add unlimited new deals in the Owner Portal!
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-amber-600 hover:underline"
              >
                View All Deals
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={onOpenOwnerPortal}
                className="text-xs font-bold text-stone-800 hover:underline"
              >
                + Add New Deal in Portal
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                onClick={() => onSelectDeal(deal)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDeal(deal);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${deal.name}`}
                className="group relative bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                {/* Image Container with Badges */}
                <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                    {deal.discount && (
                      <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md shadow-sm">
                        {deal.discount}
                      </span>
                    )}
                    {deal.tag && (
                      <span className="bg-amber-500 text-stone-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {deal.tag}
                      </span>
                    )}
                    {deal.isFeatured && (
                      <span className="bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-400/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Servings & Prep time tag */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-medium">
                    {deal.servings ? (
                      <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Users className="w-3 h-3 text-amber-300" /> {deal.servings}
                      </span>
                    ) : (
                      <span></span>
                    )}
                    {deal.prepTimeMinutes && (
                      <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-300" /> ~{deal.prepTimeMinutes} mins
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">
                        {deal.name}
                      </h3>
                    </div>

                    <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                      {deal.description}
                    </p>

                    {/* Food Items Included in Deal */}
                    {deal.includedItems && deal.includedItems.length > 0 && (
                      <div className="mt-3 bg-amber-50/50 border border-amber-200/60 rounded-xl p-2.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                            <span>📦 Inside this Box:</span>
                          </span>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                            {deal.includedItems.length} items
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {deal.includedItems.map((item) => (
                            <li
                              key={item.id}
                              className="text-xs text-stone-800 flex items-center justify-between"
                            >
                              <span className="flex items-center gap-1.5 truncate">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                                <span className="truncate">{item.name}</span>
                              </span>
                              <span className="font-bold text-stone-900 text-[11px] bg-white px-1.5 py-0.2 rounded border border-amber-200/50 shrink-0 ml-2">
                                {item.quantity} {item.unit || ''}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg sm:text-xl font-extrabold text-stone-900 font-serif">
                          {settings.currency} {deal.price.toLocaleString()}
                        </span>
                        {deal.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            {settings.currency} {deal.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400 block font-medium">PKR net price</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDeal(deal);
                        }}
                        className="bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1"
                        title="Customize items, options and add-ons"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Deal</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(deal);
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-xl transition-colors shadow-xs"
                        title="Quick Add to Cart"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
