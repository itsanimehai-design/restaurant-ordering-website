import React, { useState, useMemo } from 'react';
import { PageId, MenuCategory, MenuItem } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { SoftDrinksSection } from '../components/SoftDrinksSection';
import { DessertBarSection } from '../components/DessertBarSection';
import { DealsSection } from '../components/DealsSection';
import { NashtaPointSection } from '../components/NashtaPointSection';
import { BackButton } from '../components/BackButton';
import { AtmosphericVaporEffect } from '../components/AtmosphericVaporEffect';
import { 
  Flame, 
  Sparkles, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Printer, 
  Utensils, 
  CalendarCheck,
  Eye,
  Check,
  BookOpen,
  CupSoda,
  ShieldCheck,
  IceCream,
  Plus,
  ShoppingBag,
  Wallet,
  Users,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AiAssistantButton } from '../components/AiAssistantButton';
import { useAiAssistant } from '../context/AiAssistantContext';
import { ScrollSideEntry } from '../components/ScrollSideEntry';

interface MenuPageProps {
  onNavigate: (page: PageId) => void;
  onBack?: () => void;
  onOpenDishModal: (dish: MenuItem) => void;
  onToggleWishlist: (dishId: string) => void;
  wishlistIds: string[];
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
  initialTab?: 'standard' | 'nashta' | 'dessert-bar' | 'soft-drinks' | 'recipes' | 'food' | 'meals' | 'deals';
}

const CATEGORIES: { id: MenuCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Dishes' },
  { id: 'starters', label: 'Starters & Seekh' },
  { id: 'main-courses', label: 'Karahi & Handi' },
  { id: 'grills', label: 'Ember BBQ Grills' },
  { id: 'seafood', label: 'Seafood Specialities' },
  { id: 'burgers', label: 'Chapli Burgers' },
  { id: 'desserts', label: 'Desserts & Kulfi' },
  { id: 'soft-drinks', label: '🥤 Soft Drinks & Beverages' },
  { id: 'signature-drinks', label: 'Chai & Herbal Coolers' },
];

export const MenuPage: React.FC<MenuPageProps> = ({
  onNavigate,
  onBack,
  onOpenDishModal,
  onToggleWishlist,
  wishlistIds,
  onShowToast,
  initialTab = 'standard',
}) => {
  const { 
    menuItems, 
    deals,
    specialRecipes, 
    formatPrice, 
    config, 
    dessertBarItems,
    nashtaItems,
    openOrderModal,
    addToCart,
    cartItems
  } = useRestaurantData();
  const { openBudgetFilter } = useAiAssistant();
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'gf' | 'chef' | 'new'>('all');
  const [activeTab, setActiveTab] = useState<'standard' | 'nashta' | 'meals' | 'dessert-bar' | 'soft-drinks' | 'recipes'>(
    initialTab === 'nashta'
      ? 'nashta'
      : initialTab === 'dessert-bar' 
      ? 'dessert-bar' 
      : initialTab === 'soft-drinks' 
      ? 'soft-drinks'
      : initialTab === 'meals' || initialTab === 'deals'
      ? 'meals'
      : initialTab === 'recipes'
      ? 'recipes'
      : 'standard'
  );

  // Sync if initialTab prop changes
  React.useEffect(() => {
    if (initialTab === 'nashta') {
      setActiveTab('nashta');
    } else if (initialTab === 'dessert-bar') {
      setActiveTab('dessert-bar');
    } else if (initialTab === 'soft-drinks') {
      setActiveTab('soft-drinks');
    } else if (initialTab === 'meals' || initialTab === 'deals') {
      setActiveTab('meals');
    } else if (initialTab === 'recipes') {
      setActiveTab('recipes');
    } else if (initialTab === 'food' || initialTab === 'standard') {
      setActiveTab('standard');
    }
  }, [initialTab]);

  const filteredDishes = useMemo(() => {
    return menuItems.filter((dish) => {
      // Must be available
      if (dish.isAvailable === false) return false;

      // Category check
      if (selectedCategory !== 'all' && dish.category !== selectedCategory) {
        return false;
      }
      // Dietary check
      if (dietaryFilter === 'veg' && !dish.isVegetarian && !dish.isVegan) {
        return false;
      }
      if (dietaryFilter === 'gf' && !dish.isGlutenFree) {
        return false;
      }
      if (dietaryFilter === 'chef' && !dish.isChefSpecial) {
        return false;
      }
      if (dietaryFilter === 'new' && !dish.isNew) {
        return false;
      }
      // Search check
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(q);
        const matchesDesc = dish.description.toLowerCase().includes(q);
        const matchesCat = dish.category.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesCat;
      }
      return true;
    });
  }, [menuItems, selectedCategory, dietaryFilter, searchQuery]);

  const handlePrintMenu = () => {
    window.print();
    onShowToast('Print Menu', 'Opening print preview of tasting menu.', 'info');
  };

  const publishedRecipes = specialRecipes.filter((r) => r.isPublished);

  const categoriesList = useMemo(() => {
    const custom = (config.customCategories || []).map(c => ({ id: c.id as any, label: c.name }));
    return [...CATEGORIES, ...custom];
  }, [config.customCategories]);

  return (
    <div className="w-full pt-28 pb-24 bg-[#0d0b0a] min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top-Left Back Navigation */}
        <div className="mb-6">
          <BackButton onClick={onBack || (() => onNavigate('home'))} />
        </div>

        {/* Page Header */}
        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181412] border border-[#d4af37]/40 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>Culinary Repertoire</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#fdfbf7]">
              The Gastronomic Menu
            </h1>
            <p className="text-sm sm:text-base text-[#c5bcad] leading-relaxed">
              Every dish is cooked to order over live binchotan embers and seasoned with botanical spices from ancient trade routes. Save your favorites to your booking wishlist.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {/* Toggle primary categories: Food vs Meals & Deals vs Drinks vs Dessert Bar vs Recipes */}
              <div className="bg-[#14110f] p-1.5 rounded-2xl border border-[#2e2620] flex flex-wrap items-center justify-center gap-1.5 shadow-xl">
                <button
                  id="tab-a-la-carte"
                  onClick={() => setActiveTab('standard')}
                  className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'standard'
                      ? 'bg-[#d4af37] text-black shadow-md font-extrabold'
                      : 'text-[#c5bcad] hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Food ({menuItems.filter(m => m.isAvailable !== false).length})</span>
                </button>
                <button
                  id="tab-nashta-point"
                  onClick={() => setActiveTab('nashta')}
                  className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'nashta'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-extrabold shadow-lg shadow-amber-500/20'
                      : 'text-amber-300 hover:text-white hover:bg-amber-950/40'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Nashta Point &amp; Chai ({nashtaItems.length})</span>
                </button>
                <button
                  id="tab-meals-deals"
                  onClick={() => setActiveTab('meals')}
                  className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'meals'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 font-extrabold shadow-lg shadow-orange-500/20'
                      : 'text-orange-300 hover:text-white hover:bg-orange-950/40'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Meals &amp; Deals ({deals.length})</span>
                </button>
                <button
                  id="tab-soft-drinks"
                  onClick={() => setActiveTab('soft-drinks')}
                  className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'soft-drinks'
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-stone-950 font-extrabold shadow-lg shadow-cyan-500/20'
                      : 'text-cyan-300 hover:text-white hover:bg-cyan-950/40'
                  }`}
                >
                  <CupSoda className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Drinks</span>
                </button>
                <button
                  id="tab-dessert-bar"
                  onClick={() => setActiveTab('dessert-bar')}
                  className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'dessert-bar'
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white font-extrabold shadow-lg shadow-pink-900/30'
                      : 'text-pink-300 hover:text-white hover:bg-pink-950/40'
                  }`}
                >
                  <IceCream className="w-3.5 h-3.5 text-pink-300" />
                  <span>Ice Cream &amp; Desserts ({dessertBarItems.length})</span>
                </button>
                {publishedRecipes.length > 0 && (
                  <button
                    id="tab-special-recipes"
                    onClick={() => setActiveTab('recipes')}
                    className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'recipes'
                        ? 'bg-[#d4af37] text-black shadow-md font-extrabold'
                        : 'text-[#c5bcad] hover:text-white hover:bg-stone-800/50'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Special Recipes ({publishedRecipes.length})</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => openOrderModal('delivery')}
                className="px-4 py-2 rounded-lg bg-[#291b11] border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Order Delivery / Pickup</span>
              </button>

              <button
                onClick={handlePrintMenu}
                className="btn-outline-gold px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Menu
              </button>
              <button
                onClick={() => onNavigate('reservations')}
                className="btn-gold px-5 py-2 rounded-lg text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                Reserve Table
              </button>
            </div>
          </div>
        </ScrollSideEntry>

        {activeTab === 'nashta' ? (
          /* Dedicated Nashta Point (Chai & Traditional Breakfast) */
          <div className="pt-2">
            <NashtaPointSection onNavigate={onNavigate} />
          </div>
        ) : activeTab === 'meals' ? (
          /* Dedicated Meals & Deals Combos Section */
          <DealsSection />
        ) : activeTab === 'dessert-bar' ? (
          /* Dedicated Gourmet Ice Cream & Milkshake Bar Experience */
          <DessertBarSection
            onNavigate={onNavigate}
            onToggleWishlist={onToggleWishlist}
            wishlistIds={wishlistIds}
            onShowToast={(title, msg, type) => onShowToast(title, msg, type === 'amber' ? 'info' : 'gold')}
            showHeader={false}
          />
        ) : activeTab === 'soft-drinks' ? (
          /* Dedicated 100% Halal Soft Drinks & Pakistani Beverages Experience */
          <SoftDrinksSection
            onNavigate={onNavigate}
            onToggleWishlist={onToggleWishlist}
            wishlistIds={wishlistIds}
            onShowToast={onShowToast}
            showHeader={false}
          />
        ) : activeTab === 'recipes' ? (
          /* Special Recipes View */
          <div className="space-y-8">
            <ScrollSideEntry direction="left" delay={0.1}>
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="font-serif text-2xl sm:text-3xl text-white">Chef's Secret Laboratory &amp; Signature Recipes</h2>
                <p className="text-xs text-[#a89d8f] mt-1">
                  Detailed breakdowns of our most revered wood-fired recipes, artisan ingredients, and preparation techniques.
                </p>
              </div>
            </ScrollSideEntry>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedRecipes.map((recipe, idx) => (
                <ScrollSideEntry
                  key={recipe.id}
                  direction={idx % 2 === 0 ? 'left' : 'right'}
                  delay={(idx % 3) * 0.08}
                  className="h-full"
                >
                  <div
                    className="card-luxury rounded-2xl overflow-hidden p-6 flex flex-col justify-between space-y-5 h-full"
                  >
                    <div>
                      {recipe.image && (
                        <div className="h-52 -mx-6 -mt-6 mb-4 overflow-hidden relative">
                          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-transparent to-transparent" />
                          <AtmosphericVaporEffect type="steam" />
                          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] uppercase font-bold text-[#d4af37] border border-white/10">
                            {recipe.category.replace('-', ' ')}
                          </span>
                          {recipe.prepTime && (
                            <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-[#181412]/90 text-[10px] text-white border border-[#d4af37]/30 font-mono">
                              {recipe.prepTime}
                            </span>
                          )}
                        </div>
                      )}

                      <h3 className="font-serif text-2xl font-bold text-white">{recipe.title}</h3>
                      <p className="text-xs sm:text-sm text-[#c5bcad] mt-2 leading-relaxed">{recipe.description}</p>

                      {/* Ingredients list */}
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-[#d4af37] block mb-2">
                          Artisan Ingredients:
                        </span>
                        <ul className="space-y-1">
                          {recipe.ingredients.map((ing, ingIdx) => (
                            <li key={ingIdx} className="text-xs text-[#a89d8f] flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
                              {ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-white/50 uppercase block font-bold">Experience Price</span>
                        <span className="font-serif text-xl font-bold text-[#d4af37]">{formatPrice(recipe.price)}</span>
                      </div>

                      <button
                        onClick={() => onNavigate('reservations')}
                        className="btn-gold px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Taste at Table
                      </button>
                    </div>
                  </div>
                </ScrollSideEntry>
              ))}
            </div>
          </div>
        ) : (
          /* Standard A La Carte Menu View */
          <>
            {/* Chef's Selection Banner */}
            <ScrollSideEntry direction="right" delay={0.15}>
              <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#171310] via-[#201812] to-[#171310] border border-[#d4af37]/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs uppercase tracking-widest text-[#d4af37] font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>Chef’s Imperial Dawat Highlights</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#fdfbf7]">
                    The Grand Ember Royal Feast
                  </h3>
                  <p className="text-xs sm:text-sm text-[#c5bcad] max-w-xl">
                    Curated by Executive Chef Tariq Al-Hashmi. Features Live Charcoal Mutton Seekh, Silken Malai Boti, Shanwari Mutton Karahi, Dum Pukht Saffron Biryani, and Warm Shahi Tukra with Rabri foam.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <span className="font-serif text-2xl font-bold text-[#d4af37]">
                    {formatPrice(4850)} <span className="text-xs font-sans text-[#a89d8f] font-normal">/ guest</span>
                  </span>
                  <button
                    onClick={() => onNavigate('reservations')}
                    className="btn-gold px-6 py-3 rounded-lg text-xs uppercase tracking-widest font-bold cursor-pointer"
                  >
                    Book Imperial Table
                  </button>
                </div>
              </div>
            </ScrollSideEntry>

            {/* Controls Bar: Search & Dietary Toggles */}
            <ScrollSideEntry direction="left" delay={0.1}>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
                {/* Search & Budget Filter Input Group */}
                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <div className="relative flex-1 lg:w-80">
                    <Search className="w-4 h-4 text-[#7a7063] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search dishes, ingredients, spices..."
                      className="w-full bg-[#14110f] border border-[#26201a] focus:border-[#d4af37] text-xs text-[#fdfbf7] pl-10 pr-4 py-3 rounded-xl focus:outline-none transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-xs text-[#7a7063] hover:text-[#fdfbf7] absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <button
                    id="menu-budget-filter-trigger"
                    type="button"
                    onClick={(e) => openBudgetFilter(500, e.currentTarget)}
                    className="px-3.5 py-3 rounded-xl bg-gradient-to-r from-[#2a1d12] to-[#1a120c] border border-[#d4af37]/70 text-[#d4af37] text-xs font-bold hover:bg-[#342416] hover:border-[#d4af37] transition-all flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer ai-assistant-glow"
                    title="Filter menu and bottled drinks by maximum budget"
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="hidden sm:inline text-[#fdfbf7]">Budget Filter</span>
                  </button>
                </div>

                {/* Dietary Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  {[
                    { id: 'all', label: 'All Diets' },
                    { id: 'chef', label: "Chef's Special" },
                    { id: 'new', label: 'New Dishes' },
                    { id: 'veg', label: 'Vegetarian' },
                    { id: 'gf', label: 'Gluten-Free' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDietaryFilter(d.id as any)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-all border cursor-pointer ${
                        dietaryFilter === d.id
                          ? 'bg-[#d4af37] text-[#0d0b0a] border-[#d4af37] font-semibold shadow-lg'
                          : 'bg-[#14110f] text-[#a89d8f] border-[#26201a] hover:border-[#d4af37]/40 hover:text-[#fdfbf7]'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollSideEntry>

            {/* Category Scrollable Navigation Tabs */}
            <ScrollSideEntry direction="right" delay={0.1}>
              <div className="overflow-x-auto pb-4 mb-10 scrollbar-none">
                <div className="flex items-center gap-2 min-w-max">
                  {categoriesList.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          if (cat.id === 'soft-drinks') {
                            setActiveTab('soft-drinks');
                          } else {
                            setSelectedCategory(cat.id);
                          }
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#fdfbf7] shadow-lg shadow-[#d4af37]/10'
                            : 'bg-[#14110f] border-[#26201a] text-[#8c8275] hover:text-[#fdfbf7] hover:border-[#3a3028]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollSideEntry>

            {/* Dishes Grid */}
            {filteredDishes.length === 0 ? (
              <div className="text-center py-20 bg-[#14110f] rounded-2xl border border-[#26201a] p-8">
                <Utensils className="w-12 h-12 text-[#d4af37] mx-auto opacity-50 mb-3" />
                <h3 className="font-serif text-2xl text-[#fdfbf7]">No Dishes Matched Your Filter</h3>
                <p className="text-xs text-[#9d9385] mt-1 max-w-sm mx-auto">
                  Try adjusting your search query or dietary preferences to explore our full menu.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setDietaryFilter('all');
                  }}
                  className="mt-6 btn-outline-gold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence>
                  {filteredDishes.map((dish, index) => {
                    const isSaved = wishlistIds.includes(dish.id);
                    return (
                      <ScrollSideEntry
                        key={dish.id}
                        direction={index % 2 === 0 ? 'left' : 'right'}
                        delay={(index % 3) * 0.08}
                        className="h-full"
                      >
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25 }}
                          onClick={() => onOpenDishModal(dish)}
                          className="card-luxury rounded-2xl overflow-hidden flex flex-col group cursor-pointer h-full"
                        >
                          {/* Dish Image Container */}
                          <div className="relative h-60 w-full overflow-hidden bg-[#0c0a09]">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-transparent to-black/20" />
                            <AtmosphericVaporEffect item={dish} />

                            {/* Top Badges */}
                            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#0d0b0a]/80 backdrop-blur-sm border border-white/10 text-[10px] font-medium uppercase tracking-wider text-[#d4af37]">
                                {dish.category.replace('-', ' ')}
                              </span>
                              {dish.isChefSpecial && (
                                <span className="px-2 py-0.5 rounded-full bg-[#d4af37] text-[#0d0b0a] text-[10px] font-bold uppercase tracking-wider">
                                  Chef Special
                                </span>
                              )}
                              {dish.isNew && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-wider">
                                  New
                                </span>
                              )}
                            </div>

                            {/* Price Badge */}
                            <div className="absolute bottom-3 right-4 font-serif text-xl sm:text-2xl font-bold text-[#d4af37] drop-shadow">
                              {formatPrice(dish.price)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <h3 className="font-serif text-xl font-semibold text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors line-clamp-1">
                                {dish.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-[#9d9385] mt-2 line-clamp-2 leading-relaxed">
                                {dish.description}
                              </p>
                            </div>

                            {/* Dietary Indicators & Pairing */}
                            <div className="pt-3 border-t border-[#221c17] flex items-center justify-between gap-2">
                              {dish.pairingNote ? (
                                <div className="flex items-center gap-1.5 text-xs text-[#a89d8f] truncate max-w-[150px]">
                                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                                  <span className="truncate">{dish.pairingNote}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-xs text-[#7a7063]">
                                  {dish.isVegetarian && <span className="text-emerald-400">Vegetarian</span>}
                                  {dish.isGlutenFree && <span className="text-amber-400">Gluten-Free</span>}
                                </div>
                              )}

                              <div className="flex items-center gap-1.5">
                                {/* AI Dish Assistant Button */}
                                <AiAssistantButton
                                  context={{
                                    section: 'food',
                                    itemId: dish.id,
                                    itemName: dish.name,
                                    itemPrice: dish.price,
                                    category: dish.category,
                                    title: dish.name
                                  }}
                                  variant="icon"
                                  size="xs"
                                  tooltipText={`Ask AI about ${dish.name}`}
                                />

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleWishlist(dish.id);
                                  }}
                                  className={`text-xs p-2 rounded-lg border font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                                    isSaved
                                      ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#fdfbf7]'
                                      : 'bg-[#1a1613] border-[#2e2620] text-[#a89d8f] hover:text-[#d4af37] hover:border-[#d4af37]/40'
                                  }`}
                                  title={isSaved ? 'Saved to Table Wishlist' : 'Save to Dining Wishlist'}
                                  aria-label="Save to wishlist"
                                >
                                  {isSaved ? (
                                    <BookmarkCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                                  ) : (
                                    <Bookmark className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart({
                                      id: dish.id,
                                      name: dish.name,
                                      price: dish.price,
                                      category: dish.category,
                                      image: dish.image,
                                    });
                                    onShowToast('Added to Cart', `${dish.name} added to your order`, 'gold');
                                  }}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#e6c250] text-[#120f0d] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#d4af37]/20 hover:scale-102 active:scale-95 transition-all cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Add to Cart</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </ScrollSideEntry>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
