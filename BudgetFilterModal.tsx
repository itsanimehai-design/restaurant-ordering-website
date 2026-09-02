import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  X, 
  Wallet, 
  Sparkles, 
  ShoppingBag, 
  Plus, 
  Check, 
  SlidersHorizontal,
  Flame,
  Bike
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAiAssistant } from '../context/AiAssistantContext';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { buildRealBudgetCombo } from '../utils/aiAssistantEngine';

interface BudgetFilterModalProps {
  onOpenOrderModal?: (type?: 'delivery' | 'pickup') => void;
  onAddToCart?: (item: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
    servingSize?: string;
  }) => void;
}

export const BudgetFilterModal: React.FC<BudgetFilterModalProps> = ({
  onOpenOrderModal,
  onAddToCart
}) => {
  const { 
    isBudgetFilterOpen, 
    closeBudgetFilter, 
    initialBudgetFilterValue, 
    openAssistant,
    budgetAnchorRect 
  } = useAiAssistant();
  const { menuItems, dessertBarItems = [], deals = [], addToCart } = useRestaurantData();

  const [budget, setBudget] = useState<number>(initialBudgetFilterValue || 500);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'lowest' | 'match' | 'category'>('lowest');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'items' | 'combos'>('items');

  // Positioning coordinates directly relative to the trigger button
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
    caretLeft?: number;
    placedAbove?: boolean;
  }>({
    top: 76,
    left: 16,
    width: 460,
    maxHeight: 560,
    placedAbove: false
  });

  // Calculate coordinates directly attached to the Budget Filter button
  const recalculatePosition = useCallback(() => {
    if (typeof window === 'undefined') return;

    let rect = budgetAnchorRect;
    if (!rect) {
      const defaultEl =
        document.getElementById('header-budget-filter-btn') ||
        document.getElementById('mobile-header-budget-filter-btn') ||
        document.getElementById('menu-budget-filter-trigger');
      if (defaultEl) {
        const r = defaultEl.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          rect = {
            top: r.top,
            left: r.left,
            right: r.right,
            bottom: r.bottom,
            width: r.width,
            height: r.height
          };
        }
      }
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 640;

    if (isMobile) {
      const panelWidth = Math.min(vw - 20, 440);
      const left = Math.max(10, (vw - panelWidth) / 2);
      
      let top = 70;
      let placedAbove = false;
      if (rect) {
        top = rect.bottom + 6;
      }
      
      // Clamp top to remain visible on screen without causing scroll
      if (top > vh - 300) {
        if (rect && rect.top > 320) {
          top = Math.max(8, rect.top - 460);
          placedAbove = true;
        } else {
          top = Math.max(8, vh - 500);
        }
      } else if (top < 8) {
        top = 8;
      }

      const maxHeight = Math.min(540, Math.max(300, vh - top - 12));

      setCoords({
        top,
        left,
        width: panelWidth,
        maxHeight,
        placedAbove
      });
      return;
    }

    // Desktop: attached dropdown popover layout
    const panelWidth = Math.min(470, vw - 32);
    let left = 16;
    let caretLeft = 240;
    let top = 76;
    let placedAbove = false;

    if (rect) {
      const btnCenterX = rect.left + rect.width / 2;
      
      // Align popover edge with trigger button
      if (btnCenterX > vw / 2) {
        left = rect.right - panelWidth;
      } else {
        left = rect.left;
      }

      // Clamp within safe viewport borders
      left = Math.max(16, Math.min(left, vw - panelWidth - 16));
      caretLeft = Math.max(24, Math.min(panelWidth - 28, btnCenterX - left));

      // Calculate vertical space
      const spaceBelow = vh - rect.bottom - 16;
      if (spaceBelow < 320 && rect.top > 360) {
        // Place above the button if bottom is restricted
        const targetHeight = Math.min(540, rect.top - 16);
        top = Math.max(12, rect.top - targetHeight - 8);
        placedAbove = true;
      } else {
        top = rect.bottom + 8;
        placedAbove = false;
      }
    } else {
      left = Math.max(16, vw - panelWidth - 24);
      top = 76;
    }

    const availableSpace = placedAbove && rect ? rect.top - top - 8 : vh - top - 16;
    const maxHeight = Math.min(580, Math.max(320, availableSpace));

    setCoords({
      top,
      left,
      width: panelWidth,
      maxHeight,
      caretLeft,
      placedAbove
    });
  }, [budgetAnchorRect]);

  // Keep attached when window resizes or user scrolls
  useEffect(() => {
    if (isBudgetFilterOpen) {
      recalculatePosition();
      window.addEventListener('resize', recalculatePosition);
      window.addEventListener('scroll', recalculatePosition, { passive: true });
      return () => {
        window.removeEventListener('resize', recalculatePosition);
        window.removeEventListener('scroll', recalculatePosition);
      };
    }
  }, [isBudgetFilterOpen, recalculatePosition]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isBudgetFilterOpen) {
        closeBudgetFilter();
      }
    };
    if (isBudgetFilterOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isBudgetFilterOpen, closeBudgetFilter]);

  // Sync initial budget value when modal opens
  useEffect(() => {
    if (initialBudgetFilterValue) {
      setBudget(initialBudgetFilterValue);
    }
  }, [initialBudgetFilterValue, isBudgetFilterOpen]);

  // Combine all items (Food + Desserts + Bottled Drinks)
  const allAvailableItems = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      category: string;
      categoryDisplay: string;
      description: string;
      price: number;
      image: string;
      isAvailable: boolean;
      isDrink: boolean;
      isDessert: boolean;
      pairingNote?: string;
    }> = [];
    const seenIds = new Set<string>();

    // 1. Menu items (including soft drinks, starters, grills, mains)
    menuItems.forEach(item => {
      if (item.isAvailable !== false && item.price > 0 && !seenIds.has(item.id)) {
        seenIds.add(item.id);
        let catDisplay = 'Food';
        const isDrink = item.category === 'soft-drinks' || item.category === 'signature-drinks' || item.id.startsWith('sd-') || item.id.startsWith('drink-');
        
        if (isDrink) catDisplay = 'Bottled & Cold Drink';
        else if (item.category === 'starters' || item.category === 'soups-salads') catDisplay = 'Starter & Soup';
        else if (item.category === 'main-courses' || item.category === 'grills' || item.category === 'seafood') catDisplay = 'Main & Grill';
        else if (item.category === 'burgers' || item.category === 'pasta') catDisplay = 'Burger & Bite';
        else if (item.category === 'desserts') catDisplay = 'Dessert';

        list.push({
          id: item.id,
          name: item.name,
          category: item.category,
          categoryDisplay: catDisplay,
          description: item.description,
          price: item.price,
          image: item.image,
          isAvailable: true,
          isDrink,
          isDessert: item.category === 'desserts',
          pairingNote: item.pairingNote
        });
      }
    });

    // 2. Dessert bar items (ice cream, milkshakes, sundaes)
    dessertBarItems.forEach(dessert => {
      if (dessert.isAvailable !== false && dessert.price > 0 && !seenIds.has(dessert.id)) {
        seenIds.add(dessert.id);
        list.push({
          id: dessert.id,
          name: dessert.name,
          category: dessert.category,
          categoryDisplay: dessert.category === 'milkshakes' ? 'Milkshake' : 'Ice Cream & Dessert',
          description: dessert.description || dessert.flavorNotes || 'Rich artisanal dessert',
          price: dessert.price,
          image: dessert.image,
          isAvailable: true,
          isDrink: dessert.category === 'milkshakes',
          isDessert: true
        });
      }
    });

    // 3. Meals & Deals packages
    deals.forEach(deal => {
      const dealPrice = deal.price || deal.discountedPrice || 0;
      if (deal.isAvailable !== false && dealPrice > 0 && !seenIds.has(deal.id)) {
        seenIds.add(deal.id);
        list.push({
          id: deal.id,
          name: deal.name,
          category: 'deals',
          categoryDisplay: 'Meals & Deals Combo',
          description: deal.description || (deal.includedItems ? deal.includedItems.map(i => `${i.productName || i.name} ×${i.quantity}`).join(', ') : ''),
          price: dealPrice,
          image: deal.image,
          isAvailable: true,
          isDrink: false,
          isDessert: false,
          pairingNote: (deal.serves || deal.servingSize) ? `Serves: ${deal.serves || deal.servingSize}` : undefined
        });
      }
    });

    return list;
  }, [menuItems, dessertBarItems, deals]);

  // Filter items ≤ entered budget
  const filteredItems = useMemo(() => {
    return allAvailableItems.filter(item => {
      if (item.price > budget) return false;
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'deals') return item.category === 'deals';
      if (selectedCategory === 'drinks') return item.isDrink;
      if (selectedCategory === 'desserts') return item.isDessert;
      if (selectedCategory === 'mains') return item.categoryDisplay.includes('Main') || item.categoryDisplay.includes('Grill');
      if (selectedCategory === 'burgers') return item.categoryDisplay.includes('Burger');
      if (selectedCategory === 'starters') return item.categoryDisplay.includes('Starter');
      return true;
    }).sort((a, b) => {
      if (sortBy === 'lowest') return a.price - b.price;
      if (sortBy === 'match') return b.price - a.price; // closest to budget
      return a.categoryDisplay.localeCompare(b.categoryDisplay);
    });
  }, [allAvailableItems, budget, selectedCategory, sortBy]);

  // Calculate Smart Combination under current budget
  const smartCombo = useMemo(() => {
    return buildRealBudgetCombo(budget, menuItems, dessertBarItems);
  }, [budget, menuItems, dessertBarItems]);

  if (!isBudgetFilterOpen) return null;

  const handleAddItem = (item: typeof allAvailableItems[0]) => {
    if (onAddToCart) {
      onAddToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category
      });
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category
      });
    }

    setAddedItemIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  const handleOrderNow = (item: typeof allAvailableItems[0]) => {
    handleAddItem(item);
    closeBudgetFilter();
    if (onOpenOrderModal) {
      onOpenOrderModal('delivery');
    }
  };

  const handleAddComboToCart = () => {
    if (!smartCombo) return;
    smartCombo.items.forEach(comboItem => {
      const match = allAvailableItems.find(i => i.name === comboItem.name) || {
        id: `combo-${Date.now()}-${Math.random()}`,
        name: comboItem.name,
        price: comboItem.price,
        image: ''
      };
      addToCart({
        id: match.id,
        name: match.name,
        price: match.price,
        image: match.image
      });
    });
    closeBudgetFilter();
    if (onOpenOrderModal) {
      onOpenOrderModal('delivery');
    }
  };

  const quickPresets = [150, 300, 500, 800, 1000, 1500, 2500, 3500];

  return (
    <AnimatePresence>
      {/* Lightweight non-intrusive backdrop: dismisses on click without scrolling page */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[9990] bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={closeBudgetFilter}
        aria-hidden="true"
      />

      {/* Directly Attached Popover Dropdown Panel */}
      <motion.div
        id="budget-filter-attached-popover"
        initial={{ 
          opacity: 0, 
          y: coords.placedAbove ? 8 : -8, 
          scale: 0.98 
        }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1 
        }}
        exit={{ 
          opacity: 0, 
          y: coords.placedAbove ? 8 : -8, 
          scale: 0.98 
        }}
        transition={{ 
          duration: 0.2, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        style={{
          position: 'fixed',
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          width: `${coords.width}px`,
          maxHeight: `${coords.maxHeight}px`,
          zIndex: 9991
        }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#140f0c] border border-[#d4af37]/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(212,175,55,0.18)] overflow-hidden flex flex-col will-change-transform"
        role="dialog"
        aria-label="Budget Filter Menu"
      >
        {/* Physical Connection Caret Pointer on Desktop */}
        {coords.caretLeft !== undefined && (
          !coords.placedAbove ? (
            <div 
              className="hidden sm:block absolute -top-1.5 w-3.5 h-3.5 bg-[#20150d] border-t border-l border-[#d4af37]/70 transform rotate-45 z-30 pointer-events-none"
              style={{ left: `${coords.caretLeft - 7}px` }}
            />
          ) : (
            <div 
              className="hidden sm:block absolute -bottom-1.5 w-3.5 h-3.5 bg-[#110b07] border-b border-r border-[#d4af37]/70 transform rotate-45 z-30 pointer-events-none"
              style={{ left: `${coords.caretLeft - 7}px` }}
            />
          )
        )}

        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#24170f] via-[#1a110a] to-[#120b07] border-b border-[#2d2015] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8c5e10] p-[1px] shadow-md shadow-[#d4af37]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#160f0b] rounded-[11px] flex items-center justify-center">
                <Wallet className="w-4 h-4 text-[#d4af37]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-serif text-base font-bold text-[#fdfbf7]">
                  Budget Filter
                </h2>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                  Live Menu
                </span>
              </div>
              <p className="text-[11px] text-[#a89d8f]">
                Dishes, Drinks &amp; Combos under your price
              </p>
            </div>
          </div>

          <button
            onClick={closeBudgetFilter}
            className="p-1.5 rounded-lg text-[#a89d8f] hover:text-[#fdfbf7] hover:bg-[#251910] transition-colors cursor-pointer"
            title="Close filter"
            aria-label="Close Budget Filter"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Budget Input & Quick Selector Area */}
        <div className="p-3 bg-[#1a120d] border-b border-[#281b11] shrink-0 space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] flex items-center gap-1 mb-1">
                <SlidersHorizontal className="w-3 h-3" />
                Max Budget (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#d4af37]">
                  ₨
                </span>
                <input
                  type="number"
                  min={50}
                  max={20000}
                  step={50}
                  value={budget}
                  onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#100a06] border border-[#382618] focus:border-[#d4af37] text-base font-bold text-[#fdfbf7] pl-7 pr-3 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                  placeholder="500"
                />
              </div>
            </div>

            {/* Quick Adjust Buttons */}
            <div className="flex flex-col gap-1 shrink-0 pt-4">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setBudget(prev => prev + 200)}
                  className="px-2 py-1.5 rounded-lg bg-[#251910] border border-[#3d2a1c] hover:border-[#d4af37] text-[11px] font-semibold text-[#fdfbf7] hover:text-[#d4af37] transition-all cursor-pointer"
                >
                  +₨200
                </button>
                <button
                  type="button"
                  onClick={() => setBudget(prev => prev + 500)}
                  className="px-2 py-1.5 rounded-lg bg-[#251910] border border-[#3d2a1c] hover:border-[#d4af37] text-[11px] font-semibold text-[#fdfbf7] hover:text-[#d4af37] transition-all cursor-pointer"
                >
                  +₨500
                </button>
              </div>
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1">
            <span className="text-[9px] text-[#8e8272] uppercase font-bold tracking-wider shrink-0 mr-1">
              Quick:
            </span>
            {quickPresets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setBudget(val)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                  budget === val
                    ? 'bg-[#d4af37] text-[#120d09] shadow-md shadow-[#d4af37]/20 scale-105'
                    : 'bg-[#22160f] border border-[#3a271a] text-[#c5bcad] hover:border-[#d4af37] hover:text-[#fdfbf7]'
                }`}
              >
                ₨ {val}
              </button>
            ))}
          </div>

          {/* View Switcher: Individual Items vs AI Smart Combos */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-1 p-0.5 bg-[#120c08] rounded-xl border border-[#2b1d12]">
              <button
                type="button"
                onClick={() => setActiveTab('items')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'items'
                    ? 'bg-[#291b11] text-[#d4af37] border border-[#d4af37]/50 shadow-sm'
                    : 'text-[#8e8272] hover:text-[#fdfbf7]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                All Items ({filteredItems.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('combos')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'combos'
                    ? 'bg-[#291b11] text-[#d4af37] border border-[#d4af37]/50 shadow-sm'
                    : 'text-[#8e8272] hover:text-[#fdfbf7]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                Smart Meal Combo
              </button>
            </div>

            {/* Sorting */}
            {activeTab === 'items' && (
              <div className="flex items-center gap-1 text-xs text-[#a89d8f]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#120c08] border border-[#2e1f14] text-[#d4af37] text-[11px] font-semibold rounded-lg px-1.5 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="lowest">Lowest Price</option>
                  <option value="match">Closest to Budget</option>
                  <option value="category">Category</option>
                </select>
              </div>
            )}
          </div>

          {/* Category Filter Pills (When on Items tab) */}
          {activeTab === 'items' && (
            <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pt-0.5">
              {[
                { id: 'all', label: 'All Active' },
                { id: 'deals', label: '🎁 Meals & Deals' },
                { id: 'drinks', label: '🥤 Bottled & Drinks' },
                { id: 'mains', label: '🍖 Mains & Grills' },
                { id: 'burgers', label: '🍔 Burgers' },
                { id: 'starters', label: '🥟 Starters' },
                { id: 'desserts', label: '🍨 Desserts & Shakes' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37]'
                      : 'bg-[#18110c] border border-[#2f2015] text-[#8e8272] hover:text-[#fdfbf7]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Display Area with Internal Smooth Scroll */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 custom-scrollbar bg-[#140f0c]">
          {activeTab === 'combos' ? (
            // ═══════════════════════════════════════════════════════════════
            // SMART MEAL COMBOS VIEW
            // ═══════════════════════════════════════════════════════════════
            <div className="space-y-3">
              {smartCombo ? (
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#20150d] via-[#18100a] to-[#120b07] border border-[#d4af37]/50 shadow-lg space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#2f2015]">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="font-serif text-sm font-bold text-[#fdfbf7]">
                          Curated Meal Combo under ₨ {budget.toLocaleString()}
                        </h3>
                        <p className="text-[10px] text-[#a89d8f]">
                          Dish + Bottled Drink + Sauces matched to budget
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                      {smartCombo.total <= budget ? '✓ Within Budget' : ''}
                    </span>
                  </div>

                  {/* Breakdown List */}
                  <div className="space-y-2">
                    {smartCombo.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#150e09] border border-[#2c1d12] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#d4af37]/20 text-[#d4af37] font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-[#fdfbf7]">{item.name}</span>
                            <span className="text-[11px] text-[#a89d8f] ml-1">×{item.qty}</span>
                            {item.note && (
                              <p className="text-[10px] text-[#c59b27]">{item.note}</p>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-[#d4af37] whitespace-nowrap ml-2">
                          ₨ {(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}

                    <div className="p-2 rounded-lg bg-[#1a120c]/60 border border-[#2c1d12] flex items-center justify-between text-[11px] text-[#a89d8f]">
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3 h-3 text-[#d4af37]" />
                        Signature Sauces &amp; Mint Raita
                      </span>
                      <span className="text-emerald-400 font-semibold">Included (Free)</span>
                    </div>
                  </div>

                  {/* Total & Remaining */}
                  <div className="p-2.5 rounded-lg bg-[#120b07] border border-[#3d2b1f] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#a89d8f]">
                        Total Combo Price
                      </div>
                      <div className="font-serif text-lg font-black text-[#d4af37]">
                        ₨ {smartCombo.total.toLocaleString()}
                      </div>
                    </div>

                    {smartCombo.remaining > 0 ? (
                      <div className="text-right">
                        <div className="text-[10px] text-emerald-400 font-semibold">
                          Savings / Left
                        </div>
                        <div className="text-xs font-bold text-[#fdfbf7]">
                          ₨ {smartCombo.remaining.toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-400 font-semibold">
                        Exact Budget Match!
                      </div>
                    )}
                  </div>

                  {/* Action Button: Add Entire Combo */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleAddComboToCart}
                      className="w-full btn-gold py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add Combo to Cart &amp; Order</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-[#a89d8f] space-y-2">
                  <p className="text-xs">₨ {budget} mein combo banane ke liye budget thora barha dein.</p>
                  <button
                    type="button"
                    onClick={() => setBudget(prev => prev + 250)}
                    className="px-3 py-1.5 rounded-xl bg-[#291b11] border border-[#d4af37] text-[#d4af37] text-xs font-bold cursor-pointer"
                  >
                    Increase Budget (+₨250)
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ═══════════════════════════════════════════════════════════════
            // INDIVIDUAL ITEMS VIEW (≤ Budget)
            // ═══════════════════════════════════════════════════════════════
            <div className="space-y-2.5">
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredItems.map((item) => {
                    const isAdded = !!addedItemIds[item.id];
                    return (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-[#19110c] border border-[#2b1d13] hover:border-[#d4af37]/50 transition-all flex flex-col justify-between group shadow-sm"
                      >
                        <div className="flex gap-2.5">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#24170e] shrink-0 border border-[#3a2719]">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] uppercase font-bold text-[#d4af37] tracking-wider truncate">
                                {item.categoryDisplay}
                              </span>
                              <span className="text-[11px] font-extrabold text-[#fdfbf7] whitespace-nowrap">
                                ₨ {item.price.toLocaleString()}
                              </span>
                            </div>

                            <h4 className="font-serif text-xs font-bold text-[#fdfbf7] truncate group-hover:text-[#d4af37] transition-colors">
                              {item.name}
                            </h4>

                            <p className="text-[10px] text-[#a89d8f] line-clamp-2 mt-0.5 leading-tight">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="flex items-center justify-between gap-1 mt-2 pt-1.5 border-t border-[#251910]">
                          <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> In Stock
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleAddItem(item)}
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-[#291b11] border border-[#3f2b1d] hover:border-[#d4af37] text-[#fdfbf7]'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>Add</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOrderNow(item)}
                              className="px-2 py-1 rounded-lg bg-[#d4af37] hover:bg-[#b59020] text-[#120d09] text-[11px] font-extrabold transition-all flex items-center gap-0.5 cursor-pointer"
                            >
                              <Bike className="w-3 h-3" />
                              <span>Order</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-[#a89d8f] space-y-2">
                  <p className="text-xs">
                    ₨ {budget} ke andar koi item nahi mila. Apna budget barha kar dobara check karein.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBudget(prev => prev + 250)}
                      className="px-3 py-1.5 rounded-xl bg-[#291b11] border border-[#d4af37] text-[#d4af37] text-xs font-bold cursor-pointer"
                    >
                      Increase Budget (+₨250)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudget(1000)}
                      className="px-3 py-1.5 rounded-xl bg-[#1e140d] border border-[#3a2719] text-[#fdfbf7] text-xs font-semibold cursor-pointer"
                    >
                      Set to ₨ 1,000
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className="p-2.5 bg-[#110b07] border-t border-[#251910] flex items-center justify-between text-[11px] text-[#8e8272] shrink-0">
          <span className="flex items-center gap-1 truncate">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            Need help?
            <button
              type="button"
              onClick={() => {
                closeBudgetFilter();
                openAssistant({ section: 'general', title: `Budget ₨ ${budget} Assistant` });
              }}
              className="text-[#d4af37] underline font-bold ml-1 hover:text-white cursor-pointer"
            >
              Ask AI
            </button>
          </span>

          <span className="font-bold text-[#c5bcad] whitespace-nowrap">
            Max: ₨ {budget.toLocaleString()}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
