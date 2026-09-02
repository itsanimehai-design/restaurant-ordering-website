import React, { useState, useMemo } from 'react';
import { Flame, Plus, Search, IceCream, Coffee, Utensils, Sparkles, Pizza, Layers } from 'lucide-react';
import { MenuItem, StoreSettings } from '../types';
import { MENU_CATEGORIES } from '../data/defaultData';

interface MenuSectionProps {
  menuItems?: MenuItem[];
  items?: MenuItem[];
  settings: StoreSettings;
  onSelectItem?: (item: MenuItem) => void;
  onQuickAddItem?: (item: MenuItem) => void;
  onQuickAddToCart?: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  items,
  settings,
  onSelectItem,
  onQuickAddItem,
  onQuickAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Menu');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const rawList = menuItems && menuItems.length > 0 ? menuItems : items;
  const safeMenuItems = Array.isArray(rawList) ? rawList : [];

  const handleQuickAdd = onQuickAddToCart || onQuickAddItem || (() => {});

  const dynamicCategories = useMemo(() => {
    const fromItems = safeMenuItems.map((i) => i.category).filter(Boolean);
    const combined = ['All Menu', ...MENU_CATEGORIES.filter((c) => c !== 'All Menu'), ...fromItems];
    return Array.from(new Set(combined));
  }, [safeMenuItems]);

  const filteredItems = useMemo(() => {
    return safeMenuItems.filter((item) => {
      if (!item) return false;
      const matchesCategory =
        selectedCategory === 'All Menu' || (item.category || '').toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      return (
        matchesCategory &&
        ((item.name || '').toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q))
      );
    });
  }, [safeMenuItems, selectedCategory, searchQuery]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Spicy Food':
        return <Flame className="w-3.5 h-3.5 text-rose-500" />;
      case 'Ice Cream':
        return <IceCream className="w-3.5 h-3.5 text-pink-500" />;
      case 'Drinks':
        return <Coffee className="w-3.5 h-3.5 text-blue-500" />;
      case 'Pizza':
        return <Pizza className="w-3.5 h-3.5 text-amber-500" />;
      case 'Burgers & Fast Food':
      case 'Burgers':
        return <Layers className="w-3.5 h-3.5 text-orange-500" />;
      default:
        return <Utensils className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <section id="menu" className="py-10 sm:py-14 bg-stone-50 border-b border-stone-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100/70 px-3 py-1 rounded-md border border-amber-300/60 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>A La Carte & Specialties</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-serif">
              Full Restaurant Menu
            </h2>
            <p className="text-stone-500 text-sm mt-1 max-w-2xl">
              Explore our individual burgers, hot broast meals, fiery spicy delicacies, gourmet milkshakes, and chilled ice cream sundaes.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px] sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search regular menu..."
              className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem && onSelectItem(item)}
              className="group bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-lg transition-all p-4 flex gap-4 items-center justify-between cursor-pointer"
            >
              {/* Item Info */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.isSpicy && (
                    <span className="bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-rose-600" /> Hot
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider bg-stone-100 px-1.5 py-0.2 rounded">
                    {item.category}
                  </span>
                  {item.tag && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded">
                      {item.tag}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">
                  {item.name}
                </h3>

                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-base font-extrabold text-stone-900 font-serif">
                    {settings.currency} {item.price.toLocaleString()}
                  </span>
                  {item.originalPrice && (
                    <span className="text-xs text-stone-400 line-through">
                      {settings.currency} {item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Item Image & Quick Add */}
              <div className="flex flex-col items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-100 shadow-2xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickAdd(item)}
                  className="w-full bg-amber-50 hover:bg-amber-600 text-amber-900 hover:text-white border border-amber-200 text-xs font-bold py-1 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
