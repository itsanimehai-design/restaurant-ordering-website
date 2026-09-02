import React, { useState, useEffect } from 'react';
import { PageId, MenuItem } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { AtmosphericVaporEffect } from '../components/AtmosphericVaporEffect';
import { RestaurantDetailsBlock } from '../components/RestaurantDetailsBlock';
import { NashtaPointSection } from '../components/NashtaPointSection';
import cuteChefCatMascot from '../assets/images/cute_cat_mascot_1787654767169.jpg';
import { 
  Flame, 
  Sparkles, 
  Award, 
  Compass, 
  ArrowRight, 
  CalendarCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  CupSoda,
  ShieldCheck, 
  Quote, 
  ChevronLeft,
  ChevronRight,
  Eye,
  Tag,
  Percent,
  BookOpen,
  IceCream,
  Snowflake,
  Heart,
  Bookmark,
  BookmarkCheck,
  Check,
  UtensilsCrossed,
  Bike,
  Truck,
  Smile,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { ScrollSideEntry } from '../components/ScrollSideEntry';
import { ResponsiveImageSlider, SlideItem } from '../components/ResponsiveImageSlider';

interface HomePageProps {
  onNavigate: (page: PageId, tab?: string) => void;
  onOpenDishModal: (dish: MenuItem) => void;
  onToggleWishlist: (dishId: string) => void;
  wishlistIds: string[];
}

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85',
    tag: 'Live Hearth Grills',
    sub: 'Open-Wood Fire Culinary Anthology'
  },
  {
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=2000&q=85',
    tag: 'Clay Pot Karahi',
    sub: 'Desi Ghee Handi & Stone-Ground Gravies'
  },
  {
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=2000&q=85',
    tag: 'Saffron Dum Biryani',
    sub: 'Aged Basmati Rice Layered with Spiced Mutton'
  },
  {
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85',
    tag: 'Intimate Dining Salon',
    sub: 'Warm Starlit Embers & Copper Chandeliers'
  }
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenDishModal,
  onToggleWishlist,
  wishlistIds,
}) => {
  const { 
    config, 
    menuItems, 
    deals,
    specialRecipes, 
    offers, 
    galleryItems, 
    reviews, 
    chefs, 
    dessertBarItems,
    formatPrice,
    openOrderModal,
    addToCart,
    food3dConfig 
  } = useRestaurantData();

  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextHeroSlide = () => {
    setHeroSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevHeroSlide = () => {
    setHeroSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Get available featured dishes (up to 6)
  const availableDishes = menuItems.filter((item) => item.isAvailable !== false);
  const featuredDishes = (
    availableDishes.filter((item) => item.isFeatured).length > 0
      ? availableDishes.filter((item) => item.isFeatured)
      : availableDishes
  ).slice(0, 6);

  const featuredReviews = reviews.filter((r) => r.isApproved).slice(0, 3);
  const galleryPreview = galleryItems.slice(0, 6);
  const activeOffers = offers.filter((o) => o.isActive);
  const publishedRecipes = specialRecipes.filter((r) => r.isPublished).slice(0, 3);
  const headChef = chefs[0];

  return (
    <div className="w-full overflow-x-hidden">
      {/* 1. CINEMATIC FULL-SCREEN HERO WITH GPU-ACCELERATED SLIDER */}
      <section id="hero" className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
        {/* GPU-Accelerated Multi-Slide Background Track with Motion Drag/Swipe */}
        <div className="absolute inset-0 z-0 overflow-hidden select-none touch-pan-y cursor-grab active:cursor-grabbing">
          <motion.div 
            className="slider-track-hardware flex w-full h-full"
            animate={{
              x: `-${(heroSlideIndex * 100) / HERO_SLIDES.length}%`
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 32,
              mass: 0.8
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_e, { offset, velocity }) => {
              if (offset.x < -40 || velocity.x < -300) {
                nextHeroSlide();
              } else if (offset.x > 40 || velocity.x > 300) {
                prevHeroSlide();
              }
            }}
            style={{
              width: `${HERO_SLIDES.length * 100}%`,
              willChange: 'transform'
            }}
          >
            {HERO_SLIDES.map((slide, idx) => (
              <div 
                key={idx} 
                className="relative w-full h-full shrink-0 overflow-hidden"
                style={{
                  width: `${100 / HERO_SLIDES.length}%`,
                  transform: 'translate3d(0, 0, 0)',
                  willChange: 'transform, opacity',
                  contain: 'paint',
                  contentVisibility: 'auto'
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.tag}
                  className="w-full h-full object-cover pointer-events-none"
                  style={{
                    transform: 'translate3d(0, 0, 0)',
                    backfaceVisibility: 'hidden',
                    willChange: 'transform',
                    imageRendering: '-webkit-optimize-contrast'
                  }}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                />
              </div>
            ))}
          </motion.div>

          {/* Dark Vignette & Ember Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b0a] via-[#0d0b0a]/75 to-[#0d0b0a]/60 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#0d0b0a]/40 to-[#0d0b0a] pointer-events-none" />
          {/* Subtle Ember Glow Layer */}
          <div className="absolute inset-0 ember-glow opacity-80 pointer-events-none" />
        </div>

        {/* Hero Left / Right Navigation Buttons (Pure CSS cubic-bezier transition, zero jQuery) */}
        <button
          onClick={prevHeroSlide}
          aria-label="Previous hero slide"
          className="slider-nav-btn hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black items-center justify-center cursor-pointer shadow-2xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextHeroSlide}
          aria-label="Next hero slide"
          className="slider-nav-btn hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black items-center justify-center cursor-pointer shadow-2xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Hero Content with Hardware-Accelerated Text Overlay */}
        <div className="slider-text-overlay relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6">
          {/* Top Micro Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181412]/80 border border-[#d4af37]/40 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-6 shadow-xl backdrop-blur-md"
          >
            <Flame className="w-3.5 h-3.5 animate-bounce" />
            <span>{config.michelinGuide}</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.12em] font-extrabold text-[#fdfbf7] uppercase leading-none drop-shadow-2xl"
          >
            {config.name}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-serif text-lg sm:text-2xl md:text-3xl text-[#d4af37] tracking-[0.08em] font-normal italic mt-4"
          >
            {config.tagline}
          </motion.p>

          {/* Short Narrative Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-sm sm:text-base text-[#c5bcad] max-w-2xl mx-auto mt-6 leading-relaxed font-light"
          >
            {config.aboutText}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <button
              onClick={() => openOrderModal('delivery')}
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-500 text-black text-xs uppercase tracking-widest font-extrabold flex items-center justify-center gap-2 shadow-2xl group cursor-pointer hover:scale-102 transition-transform"
            >
              <Bike className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span>Order Online Delivery / Pickup</span>
            </button>
            <button
              onClick={() => onNavigate('reservations')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl btn-outline-gold text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Reserve a Table</span>
            </button>
          </motion.div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setHeroSlideIndex(idx)}
                aria-label={`Switch to hero slide ${idx + 1}: ${slide.tag}`}
                className={`h-1.5 rounded-full transition-all duration-400 cursor-pointer ${
                  idx === heroSlideIndex
                    ? 'w-8 bg-[#d4af37] shadow-[0_0_10px_#d4af37]'
                    : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Key Distinction & Service Options (3 items total) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 mt-16 max-w-4xl mx-auto pt-10 border-t border-[#2a241f]"
          >
            {/* 1. Existing Option: Hearth Method */}
            <motion.div 
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-[#14110f]/80 backdrop-blur-sm border border-white/5 hover:border-[#d4af37]/30 transition-colors text-center md:text-left flex items-center md:items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-lg bg-[#241a12] border border-[#d4af37]/20 flex-shrink-0 flex items-center justify-center text-[#d4af37]">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#a89d8f] block">Hearth Method</span>
                <span className="font-serif text-base sm:text-lg font-bold text-[#fdfbf7]">Open-Fire Wood</span>
              </div>
            </motion.div>

            {/* 2. Existing Option: Service */}
            <motion.div 
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-[#14110f]/80 backdrop-blur-sm border border-white/5 hover:border-[#d4af37]/30 transition-colors text-center md:text-left flex items-center md:items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-lg bg-[#241a12] border border-[#d4af37]/20 flex-shrink-0 flex items-center justify-center text-[#d4af37]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#a89d8f] block">Service</span>
                <span className="font-serif text-base sm:text-lg font-bold text-[#d4af37]">Michelin Standard</span>
              </div>
            </motion.div>

            {/* 3. NEW OPTION: Home Delivery (Connected to online delivery flow) */}
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => openOrderModal('delivery')}
              className="group p-4 rounded-xl bg-gradient-to-r from-[#1c140e] via-[#231810] to-[#17110d] border border-[#d4af37]/50 hover:border-[#d4af37] shadow-lg hover:shadow-xl hover:shadow-[#d4af37]/15 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#d4af37] text-black flex-shrink-0 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold block">Direct to Door</span>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors">
                      Home Delivery
                    </h4>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                  Hot &amp; Fresh
                </span>
              </div>

              <p className="text-[11px] text-[#b0a596] mt-2 line-clamp-1">
                Piping hot heritage curries, BBQ grills &amp; cold drinks delivered swiftly.
              </p>

              <div className="mt-3 pt-2 border-t border-[#d4af37]/20 flex items-center justify-between">
                <button
                  type="button"
                  className="text-xs text-[#d4af37] font-bold uppercase tracking-wider flex items-center gap-1.5 group-hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <span>Order Online</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-[10px] text-[#8c8275] font-mono">30-45 min</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PRIMARY MAIN RESTAURANT CATEGORIES (FOOD | MEALS | DRINKS | ICE CREAM & DESSERTS)
          Large prominent category cards placed together in the main category area
          ════════════════════════════════════════════════════════════════ */}
      <section id="explore-menus" className="py-16 bg-gradient-to-b from-[#0d0b0a] via-[#14100d] to-[#0d0b0a] relative border-y border-[#261f18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollSideEntry direction="left" delay={0.1}>
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Primary Menu Categories</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fdfbf7] tracking-tight">
                Explore Our Culinary World
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#a89d8f] max-w-2xl mx-auto leading-relaxed">
                Choose a dining department to explore our charcoal karahi woks, value deal packages, cold drinks, or artisanal dessert bar.
              </p>
            </div>
          </ScrollSideEntry>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. FOOD & KARAHI PRIMARY CARD */}
            <ScrollSideEntry direction="left" delay={0.05} className="h-full">
              <div
                id="home-nav-food-card"
                onClick={() => onNavigate('menu', 'food')}
                className="group relative h-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#1c140e] via-[#241710] to-[#120d09] border-2 border-[#d4af37]/40 hover:border-[#d4af37] p-6 shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-amber-500/10"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-600/20 transition-all duration-500" />
                
                <div className="space-y-4 relative z-10">
                  {/* Top Row: Circular Logo & Count Badge */}
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4af37] p-1 bg-[#120d09] shadow-lg group-hover:scale-110 transition-transform">
                        <img 
                          src={config.branding?.categoryVisuals?.food || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80"} 
                          alt="Food Category"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-md">
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#382012]/80 border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-wider">
                      {availableDishes.length}+ Dishes
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                      A La Carte &amp; Hearth
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors">
                      Food
                    </h3>
                    <p className="text-xs text-[#c5bcad] mt-2 leading-relaxed font-light line-clamp-3">
                      Organic Desi Ghee Mutton Karahi, Charcoal Seekh Kababs, Handi, Chapli Burgers, and live tandoori breads.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Mutton Karahi', 'Ember BBQ', 'Roghani Naan'].map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[#140e0a] border border-[#3d2a1c] text-[#a89d8f] text-[10px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-[#3d2a1c] flex items-center justify-between relative z-10">
                  <span className="text-[11px] text-[#a89d8f]">From ₨490</span>
                  <span className="btn-gold px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-extrabold inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Open Food</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </ScrollSideEntry>

            {/* 2. MEALS & DEALS PRIMARY CARD */}
            <ScrollSideEntry direction="left" delay={0.1} className="h-full">
              <div
                id="home-nav-meals-card"
                onClick={() => onNavigate('menu', 'meals')}
                className="group relative h-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#21160a] via-[#2d1b0a] to-[#140e06] border-2 border-orange-500/50 hover:border-orange-400 p-6 shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-orange-500/20"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/25 transition-all duration-500" />
                
                <div className="space-y-4 relative z-10">
                  {/* Top Row: Circular Logo & Count Badge */}
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-400 p-1 bg-[#140e06] shadow-lg group-hover:scale-110 transition-transform">
                        <img 
                          src={config.branding?.categoryVisuals?.deals || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80"} 
                          alt="Meals and Deals"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 text-stone-950 flex items-center justify-center shadow-md">
                        <Flame className="w-3.5 h-3.5 fill-stone-950" />
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Percent className="w-3 h-3 text-orange-400" />
                      <span>{deals.length} Value Deals</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-orange-400 font-semibold block mb-1">
                      Combos &amp; Sharing Feasts
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#fdfbf7] group-hover:text-orange-400 transition-colors">
                      Meals &amp; Deals
                    </h3>
                    <p className="text-xs text-[#c5bcad] mt-2 leading-relaxed font-light line-clamp-3">
                      Curated dining combos: Family Deals, Couple Feasts, BBQ Night Combos, Solo Executive woks, and Kids Deals with drinks.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Family Deal', 'Couple Feast', 'Save up to 25%'].map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[#190f05] border border-orange-900/50 text-orange-200/80 text-[10px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-orange-900/40 flex items-center justify-between relative z-10">
                  <span className="text-[11px] text-orange-300/80">From ₨950</span>
                  <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 text-xs uppercase tracking-wider font-extrabold inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform shadow-lg shadow-orange-950/50">
                    <span>Open Deals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </ScrollSideEntry>

            {/* 3. DRINKS PRIMARY CARD */}
            <ScrollSideEntry direction="right" delay={0.15} className="h-full">
              <div
                id="home-nav-drinks-card"
                onClick={() => onNavigate('menu', 'soft-drinks')}
                className="group relative h-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0b1b1c] via-[#0d2224] to-[#071314] border-2 border-cyan-500/40 hover:border-cyan-400 p-6 shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-cyan-500/10"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />
                
                <div className="space-y-4 relative z-10">
                  {/* Top Row: Circular Logo & Count Badge */}
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400 p-1 bg-[#071314] shadow-lg group-hover:scale-110 transition-transform">
                        <img 
                          src={config.branding?.categoryVisuals?.drinks || "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=400&q=80"} 
                          alt="Drinks Category"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-400 text-stone-950 flex items-center justify-center shadow-md">
                        <CupSoda className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Snowflake className="w-3 h-3 text-cyan-400" />
                      <span>24+ Chilled</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-cyan-400 font-semibold block mb-1">
                      Beverages &amp; Sodas
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#fdfbf7] group-hover:text-cyan-300 transition-colors">
                      Drinks
                    </h3>
                    <p className="text-xs text-[#c5bcad] mt-2 leading-relaxed font-light line-clamp-3">
                      Chilled Cans, Glass Bottles, Pakola Ice Cream Soda, Next Cola, Gourmet Sodas, Fresh Mint Lemonade, and Iced Brews.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Pakola Soda', 'Next Cola', 'Mint Lemonade'].map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[#071314] border border-cyan-900/50 text-cyan-200/80 text-[10px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-cyan-900/40 flex items-center justify-between relative z-10">
                  <span className="text-[11px] text-cyan-300/80">From ₨110</span>
                  <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-stone-950 text-xs uppercase tracking-wider font-extrabold inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform shadow-lg shadow-cyan-950/50">
                    <span>Open Drinks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </ScrollSideEntry>

            {/* 4. ICE CREAM & DESSERTS PRIMARY CARD */}
            <ScrollSideEntry direction="right" delay={0.2} className="h-full">
              <div
                id="home-nav-dessert-card"
                onClick={() => onNavigate('menu', 'dessert-bar')}
                className="group relative h-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#24131b] via-[#2d1723] to-[#170b12] border-2 border-pink-500/40 hover:border-pink-400 p-6 shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-pink-500/10"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-500/20 transition-all duration-500" />
                
                <div className="space-y-4 relative z-10">
                  {/* Top Row: Circular Logo & Count Badge */}
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-400 p-1 bg-[#170b12] shadow-lg group-hover:scale-110 transition-transform">
                        <img 
                          src={config.branding?.categoryVisuals?.desserts || "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80"} 
                          alt="Ice Cream and Desserts"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-pink-400 text-stone-950 flex items-center justify-center shadow-md">
                        <IceCream className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/40 text-pink-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-pink-400" />
                      <span>{dessertBarItems.length} Sweets</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-pink-400 font-semibold block mb-1">
                      Gelato &amp; Sizzlers
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#fdfbf7] group-hover:text-pink-300 transition-colors">
                      Ice Cream &amp; Desserts
                    </h3>
                    <p className="text-xs text-[#c5bcad] mt-2 leading-relaxed font-light line-clamp-3">
                      Slow-churned Sindhri Mango Gelato, Belgian Milkshakes, Sizzling Iron Skillet Brownies, Royal Kulfi, and Rose Falooda.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Mango Gelato', 'Sizzling Brownie', 'Falooda'].map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[#170a12] border border-pink-900/40 text-pink-200/80 text-[10px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-pink-900/40 flex items-center justify-between relative z-10">
                  <span className="text-[11px] text-pink-300/80">From ₨420</span>
                  <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs uppercase tracking-wider font-extrabold inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform shadow-lg shadow-pink-950/50">
                    <span>Open Desserts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </ScrollSideEntry>
          </div>
        </div>
      </section>

      {/* 2. SECTION A: SIGNATURE EXPERIENCE */}
      <section id="culinary-concept" className="py-24 bg-[#0d0b0a] relative border-t border-[#1f1a16] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Story Content (7 cols) - Enters from Left */}
            <ScrollSideEntry direction="left" delay={0.1} className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                <Flame className="w-4 h-4" />
                <span>The Culinary Concept</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#fdfbf7] leading-tight">
                Where Primal Fire Meets <br className="hidden sm:inline" />
                <span className="italic text-[#d4af37]">Uncompromising Craftsmanship</span>
              </h2>
              <p className="text-[#c5bcad] text-base leading-relaxed">
                At {config.name}, dining is elevated into an immersive sensory ritual. We strip away the sterility of modern fine dining, replacing it with the visceral theatre of an open 12-foot cast-iron hearth fueled by kiln-dried oak, hickory, and Japanese binchotan charcoal.
              </p>
              <p className="text-[#9d9385] text-sm leading-relaxed">
                Every cut of heritage dry-aged meat, day-boat seafood, and hand-foraged vegetable is treated as a canvas for smoke and rare botanical spices sourced directly from artisan growers across the globe.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-[#14110f] border border-[#26201a]">
                  <h4 className="font-serif text-lg font-semibold text-[#fdfbf7] mb-1">
                    Bespoke Wood Calibrations
                  </h4>
                  <p className="text-xs text-[#8c8275] leading-relaxed">
                    Five distinct wood varietals burned to specific temperatures to match individual flavor profiles.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#14110f] border border-[#26201a]">
                  <h4 className="font-serif text-lg font-semibold text-[#fdfbf7] mb-1">
                    Rare Spice Atelier
                  </h4>
                  <p className="text-xs text-[#8c8275] leading-relaxed">
                    Custom botanical rubs, cured saffron, wild sumac, and hand-roasted Tellicherry peppercorns.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="btn-outline-gold px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
                >
                  Read Our Philosophy &amp; Story
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </ScrollSideEntry>

            {/* Right Visual Composition (5 cols) - Enters from Right */}
            <ScrollSideEntry direction="right" delay={0.2} className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#2e2620] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                  alt="Open Fire Hearth Cooking"
                  className="w-full h-[460px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b0a] via-transparent to-transparent" />
                <AtmosphericVaporEffect type="steam" intensity="subtle" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#14110f]/90 backdrop-blur-md border border-white/10">
                  <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
                    {config.contact.city} Hearth
                  </span>
                  <p className="font-serif text-base text-[#fdfbf7] mt-0.5">
                    "Fire is our core ingredient, not just our heat source."
                  </p>
                </div>
              </div>
            </ScrollSideEntry>
          </div>
        </div>
      </section>

      {/* 3. SECTION B: FEATURED DISHES */}
      <section id="signature-dishes" className="py-24 bg-[#120f0d] relative border-t border-[#1f1a16] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <ScrollSideEntry direction="left" delay={0.1}>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Culinary Signatures</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#fdfbf7]">
                Featured Masterpieces
              </h2>
              <p className="text-sm text-[#9d9385] mt-2 max-w-lg">
                Selected from our daily dinner service. Click any dish to explore tasting notes, beverage pairings, and reserve your table.
              </p>
            </ScrollSideEntry>

            <ScrollSideEntry direction="right" delay={0.2}>
              <button
                onClick={() => onNavigate('menu')}
                className="btn-outline-gold px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider self-start md:self-auto inline-flex items-center gap-2 cursor-pointer"
              >
                View Full Interactive Menu
                <ArrowRight className="w-4 h-4" />
              </button>
            </ScrollSideEntry>
          </div>

          {/* 6 Featured Dish Cards Grid with Alternating Side Entry */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDishes.map((dish, idx) => {
              const isSaved = wishlistIds.includes(dish.id);
              const direction = idx % 2 === 0 ? 'left' : 'right';
              return (
                <ScrollSideEntry
                  key={dish.id}
                  direction={direction}
                  delay={(idx % 3) * 0.12}
                  className="h-full"
                >
                  <div
                    className="card-luxury rounded-2xl overflow-hidden flex flex-col group cursor-pointer h-full justify-between"
                    onClick={() => onOpenDishModal(dish)}
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

                      {/* Category Chip */}
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0d0b0a]/80 backdrop-blur-sm border border-white/10 text-[11px] font-medium uppercase tracking-wider text-[#d4af37]">
                        {dish.category.replace('-', ' ')}
                      </span>

                      {/* Special or New Badge */}
                      {dish.isChefSpecial && (
                        <span className="absolute top-4 right-14 px-2.5 py-0.5 rounded-full bg-[#8C5E10]/80 text-[#E5C158] text-[10px] font-bold uppercase tracking-wider border border-[#C5A059]/40">
                          Special
                        </span>
                      )}

                      {/* Quick View Icon on Hover */}
                      <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#0d0b0a]/80 text-[#fdfbf7] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye className="w-4 h-4 text-[#d4af37]" />
                      </div>

                      {/* Price Tag */}
                      <div className="absolute bottom-3 right-4 font-serif text-xl sm:text-2xl font-bold text-[#d4af37] drop-shadow-md">
                        {formatPrice(dish.price)}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-serif text-xl font-semibold text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors line-clamp-1">
                          {dish.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#9d9385] mt-2 line-clamp-2 leading-relaxed">
                          {dish.description}
                        </p>
                      </div>

                      {/* Pairing & Action Strip */}
                      <div className="pt-3 border-t border-[#221c17] flex items-center justify-between gap-2">
                        {dish.pairingNote ? (
                          <div className="flex items-center gap-1.5 text-xs text-[#a89d8f] truncate max-w-[150px]">
                            <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                            <span className="truncate">{dish.pairingNote}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#7a7063]">Hearth Roasted</span>
                        )}

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleWishlist(dish.id);
                            }}
                            className={`text-xs p-2 rounded-lg border font-medium transition-colors cursor-pointer ${
                              isSaved
                                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#fdfbf7]'
                                : 'bg-[#1a1613] border-[#2e2620] text-[#a89d8f] hover:text-[#d4af37] hover:border-[#d4af37]/40'
                            }`}
                            title="Save to Wishlist"
                            aria-label="Save to Wishlist"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
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
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#e6c250] text-[#120f0d] text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md shadow-[#d4af37]/20 hover:scale-102 active:scale-95 transition-all cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollSideEntry>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. ACTIVE OFFERS & DEALS SECTION (if any active offers exist) */}
      {activeOffers.length > 0 && (
        <section id="seasonal-offers" className="py-20 bg-[#0d0b0a] relative border-t border-[#1f1a16] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollSideEntry direction="left" delay={0.1}>
              <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                  <Tag className="w-4 h-4" />
                  <span>Exclusive Privilege</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#fdfbf7]">
                  Seasonal Deals &amp; Tastings
                </h2>
                <p className="text-sm text-[#9d9385]">
                  Special culinary packages and privileges curated for discerning guests.
                </p>
              </div>
            </ScrollSideEntry>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeOffers.map((offer, idx) => {
                const direction = idx % 2 === 0 ? 'left' : 'right';
                return (
                  <ScrollSideEntry
                    key={offer.id}
                    direction={direction}
                    delay={(idx % 3) * 0.12}
                    className="h-full"
                  >
                    <div
                      className="p-6 rounded-2xl bg-[#14110f] border border-[#d4af37]/30 flex flex-col justify-between space-y-4 hover:border-[#d4af37] transition-all relative overflow-hidden group h-full"
                    >
                      {offer.image && (
                        <div className="h-44 -mx-6 -mt-6 mb-2 overflow-hidden relative">
                          <img
                            src={offer.image}
                            alt={offer.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] to-transparent" />
                          <AtmosphericVaporEffect item={offer} />
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider shadow-lg">
                            {offer.discount}
                          </div>
                        </div>
                      )}

                      <div>
                        {!offer.image && (
                          <div className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase mb-2">
                            {offer.discount}
                          </div>
                        )}
                        <h3 className="font-serif text-xl font-bold text-[#fdfbf7]">{offer.title}</h3>
                        <p className="text-xs text-[#a89d8f] mt-2 leading-relaxed">{offer.description}</p>
                      </div>

                      <div className="pt-4 border-t border-[#221c17] flex items-center justify-between">
                        {offer.code ? (
                          <div className="text-xs font-mono px-2.5 py-1 rounded bg-[#1f1a16] border border-white/10 text-[#d4af37]">
                            Code: {offer.code}
                          </div>
                        ) : (
                          <span className="text-xs text-[#7a7063]">Valid at table</span>
                        )}

                        <button
                          onClick={() => onNavigate('reservations')}
                          className="btn-gold px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Claim Offer
                        </button>
                      </div>
                    </div>
                  </ScrollSideEntry>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════
          5. RESTAURANT DETAILS & TYPOGRAPHY BLOCK
          Clean premium restaurant-information block with glowing heading
          ════════════════════════════════════════════════════════════════ */}
      <RestaurantDetailsBlock 
        onNavigate={onNavigate} 
        onOpenOrderModal={openOrderModal} 
      />

      {/* ════════════════════════════════════════════════════════════════
          5.5. NASHTA POINT (CHAI, LASSI & TRADITIONAL BREAKFAST SECTION)
          Full dynamic owner-editable breakfast department
          ════════════════════════════════════════════════════════════════ */}
      <NashtaPointSection onNavigate={onNavigate} />

      {/* 6. SPECIAL RECIPES SHOWCASE (if any exist) */}
      {publishedRecipes.length > 0 && (
        <section className="py-20 bg-[#0d0b0a] relative border-t border-[#1f1a16] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollSideEntry direction="left" delay={0.1}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span>The Hearth Laboratory</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#fdfbf7]">
                    Chef's Special Recipes &amp; Secrets
                  </h2>
                </div>
              </div>
            </ScrollSideEntry>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publishedRecipes.map((recipe, idx) => {
                const direction = idx % 2 === 0 ? 'left' : 'right';
                return (
                  <ScrollSideEntry
                    key={recipe.id}
                    direction={direction}
                    delay={(idx % 3) * 0.12}
                    className="h-full"
                  >
                    <div
                      className="card-luxury rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4 h-full"
                    >
                      {recipe.image && (
                        <div className="h-44 -mx-5 -mt-5 mb-2 overflow-hidden">
                          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] block">
                          {recipe.category.replace('-', ' ')} • {recipe.prepTime || '45 mins prep'}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-white mt-1">{recipe.title}</h4>
                        <p className="text-xs text-[#a89d8f] mt-2 line-clamp-3 leading-relaxed">{recipe.description}</p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-white/60">{recipe.ingredients.length} Artisanal Ingredients</span>
                        <span className="font-bold text-[#d4af37] font-mono">{formatPrice(recipe.price)}</span>
                      </div>
                    </div>
                  </ScrollSideEntry>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6.6. ARTISANAL ICE CREAM & MILKSHAKE BAR HIGHLIGHT */}
      <section id="ice-cream-highlight" className="py-24 bg-gradient-to-b from-[#140e0a] via-[#1a120b] to-[#120d09] relative border-t border-[#d4af37]/30 overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <ScrollSideEntry direction="left" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-950/60 border border-pink-500/40 text-pink-300 text-xs font-semibold uppercase tracking-widest mb-3 backdrop-blur-md">
                <IceCream className="w-3.5 h-3.5 text-pink-400" />
                <span>The Artisan Ice Cream &amp; Milkshake Bar</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fdfbf7]">
                Velvety Gourmet Shakes &amp; Slow-Churned Gelato
              </h2>
              <p className="text-sm sm:text-base text-[#d8cebe] mt-3 max-w-2xl font-light leading-relaxed">
                Handcrafted with pure organic buffalo cream, sun-ripened Sindhri mangoes, 70% dark Belgian cocoa, stone-ground pistachios, and fresh table sizzlers.
              </p>
            </ScrollSideEntry>

            <ScrollSideEntry direction="right" delay={0.2}>
              <button
                onClick={() => onNavigate('menu', 'dessert-bar')}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs uppercase tracking-widest font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-xl shadow-pink-950/40 transition-all self-start lg:self-auto hover:scale-102"
              >
                <IceCream className="w-4 h-4" />
                <span>Explore Complete Dessert Bar ({dessertBarItems.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </ScrollSideEntry>
          </div>

          {/* Featured Dessert Grid with Alternating Side Entry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dessertBarItems.slice(0, 4).map((item, idx) => {
              const isWishlisted = wishlistIds.includes(item.id);
              const direction = idx % 2 === 0 ? 'left' : 'right';
              return (
                <ScrollSideEntry
                  key={item.id}
                  direction={direction}
                  delay={(idx % 4) * 0.1}
                  className="h-full"
                >
                  <div
                    onClick={() => onNavigate('menu')}
                    className="group relative rounded-2xl bg-[#1a130e] border border-[#33251a] hover:border-[#d4af37]/60 transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#d4af37]/10 cursor-pointer h-full justify-between"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-black">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a130e] via-transparent to-black/30" />
                      <AtmosphericVaporEffect item={item} />

                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full bg-[#120e0b]/90 backdrop-blur-md text-[10px] font-bold text-[#d4af37] border border-[#d4af37]/30">
                          {item.servingSize}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(item.id);
                          }}
                          className="pointer-events-auto w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-[#d4af37] transition-all cursor-pointer"
                        >
                          {isWishlisted ? (
                            <BookmarkCheck className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
                          {item.temperature}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-serif text-base sm:text-lg font-bold text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#a89d8f] mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#2d2117] flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-[#7a6f61] uppercase tracking-wider block">Price</span>
                          <span className="font-serif text-lg font-bold text-[#d4af37]">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#c5bcad] group-hover:text-white flex items-center gap-1">
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollSideEntry>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6.7. DRINKS & BEVERAGES SECTION (Compact & Refined, Placed Below Desserts) */}
      <section id="soft-drinks-highlight" className="py-16 bg-gradient-to-b from-[#120d09] via-[#16110e] to-[#0f0c0a] relative border-t border-[#382b1d] overflow-hidden">
        {/* Soft cool ambient light */}
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-cyan-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Smaller compact Hero/Cover Banner for Drinks */}
          <ScrollSideEntry direction="left" delay={0.1}>
            <div className="relative rounded-2xl overflow-hidden border border-[#382b1d]/70 mb-10 bg-[#16120e] shadow-xl">
              <div className="relative h-44 sm:h-52 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80"
                  alt="Chilled Artisan Drinks & Soft Beverages"
                  className="w-full h-full object-cover object-center brightness-75 scale-102"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                <AtmosphericVaporEffect type="mist" intensity="subtle" />

                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-center max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold uppercase tracking-widest mb-2 w-fit backdrop-blur-md">
                    <CupSoda className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Chilled Refreshment &amp; Beverage Bar</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#fdfbf7] leading-snug">
                    Ice-Cold Sodas, Hand-Churned Shakes &amp; Botanical Coolers
                  </h3>
                  <p className="text-xs sm:text-sm text-[#d4cbbe] mt-1.5 line-clamp-2">
                    Featuring Next Cola, Pakola, Gourmet Cola, crisp global sodas, fresh mint coolers, and iced artisanal lassis.
                  </p>
                </div>

                <div className="absolute bottom-4 right-4 hidden sm:block">
                  <button
                    onClick={() => onNavigate('menu', 'soft-drinks')}
                    className="px-5 py-2.5 rounded-lg bg-[#d4af37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <CupSoda className="w-4 h-4" />
                    <span>View All Drinks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </ScrollSideEntry>

          {/* Compact Drinks Showcase Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <ScrollSideEntry direction="left" delay={0.1}>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#fdfbf7] flex items-center gap-2">
                <span>Featured Cold Refreshments</span>
                <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">Chilled &bull; Cool Mist</span>
              </h4>
              <p className="text-xs text-[#9d9385] mt-1">
                Authentic soft drinks, milkshakes, fresh coolers, and iced drinks served freezing cold.
              </p>
            </ScrollSideEntry>

            <ScrollSideEntry direction="right" delay={0.15}>
              <button
                onClick={() => onNavigate('menu', 'soft-drinks')}
                className="px-4 py-2 rounded-lg bg-[#291b11] hover:bg-[#d4af37] hover:text-black text-[#d4af37] border border-[#d4af37]/60 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto sm:hidden"
              >
                <span>Explore All ({'12+'})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </ScrollSideEntry>
          </div>

          {/* Compact Curated Beverage Grid with Alternating Side Entry */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              {
                id: 'karak-chai',
                name: 'Dhabba Karak Chai',
                tag: 'Clay Matka',
                price: 'Rs. 120',
                size: 'Fresh Brewed',
                image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
                badgeColor: 'border-amber-700/50 bg-amber-950/60 text-amber-300'
              },
              {
                id: 'saffron-lassi',
                name: 'Royal Malai Lassi',
                tag: 'Thick & Chilled',
                price: 'Rs. 280',
                size: 'Clay Matka 450ml',
                image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=400&q=80',
                badgeColor: 'border-[#d4af37]/50 bg-[#261d12] text-[#d4af37]'
              },
              {
                id: 'mango-lassi',
                name: 'Sindhri Mango Lassi',
                tag: 'Alphonso Swirl',
                price: 'Rs. 320',
                size: 'Chilled Matka',
                image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80',
                badgeColor: 'border-amber-800/40 bg-amber-950/40 text-amber-300'
              },
              {
                id: 'kashmiri-chai',
                name: 'Kashmiri Pink Chai',
                tag: 'Pistachio Almond',
                price: 'Rs. 180',
                size: 'Steaming Cup',
                image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80',
                badgeColor: 'border-pink-800/40 bg-pink-950/40 text-pink-300'
              },
              {
                id: 'pakola-soda',
                name: 'Pakola Ice Cream Soda',
                tag: 'Heritage Gem',
                price: 'Rs. 110',
                size: '330ml Can',
                image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=400&q=80',
                badgeColor: 'border-emerald-800/40 bg-emerald-950/40 text-emerald-300'
              },
              {
                id: 'mint-margarita',
                name: 'Fresh Mint Cooler',
                tag: 'Iced Spritz',
                price: 'Rs. 350',
                size: 'Frost Glass',
                image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
                badgeColor: 'border-green-800/40 bg-green-950/40 text-green-300'
              },
            ].map((bev, idx) => {
              const direction = idx % 2 === 0 ? 'left' : 'right';
              return (
                <ScrollSideEntry
                  key={bev.id}
                  direction={direction}
                  delay={(idx % 6) * 0.08}
                  className="h-full"
                >
                  <div
                    onClick={() => onNavigate('menu', 'soft-drinks')}
                    className="group relative rounded-xl bg-[#181310] border border-[#2b2118] hover:border-[#d4af37]/60 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer shadow-md hover:shadow-lg hover:shadow-cyan-950/20 h-full justify-between"
                  >
                    {/* Beverage photo with cool mist */}
                    <div className="relative h-28 w-full overflow-hidden bg-black">
                      <img
                        src={bev.image}
                        alt={bev.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#181310] via-transparent to-transparent" />
                      <AtmosphericVaporEffect type="mist" intensity="subtle" />

                      <span className={`absolute top-2 left-2 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border backdrop-blur-md ${bev.badgeColor}`}>
                        {bev.tag}
                      </span>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="font-serif text-xs sm:text-sm font-bold text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors line-clamp-1">
                          {bev.name}
                        </h5>
                        <p className="text-[10px] text-[#8c8275] mt-0.5">{bev.size}</p>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-[#261d15] flex items-center justify-between">
                        <span className="text-[9px] text-[#7a6f61] uppercase">Chilled</span>
                        <span className="text-xs font-mono font-bold text-[#d4af37]">{bev.price}</span>
                      </div>
                    </div>
                  </div>
                </ScrollSideEntry>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('menu', 'soft-drinks')}
              className="px-6 py-2.5 rounded-lg bg-[#221812] hover:bg-[#d4af37] hover:text-black text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <CupSoda className="w-3.5 h-3.5" />
              <span>Explore Complete Soft Drinks &amp; Refreshment Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. SECTION F: CUSTOMER REVIEWS PREVIEW */}
      <section id="reviews-section" className="py-24 bg-[#120f0d] relative border-t border-[#1f1a16] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <ScrollSideEntry direction="left" delay={0.1}>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-2">
                <Star className="w-4 h-4 fill-[#d4af37]" />
                <span>Guest &amp; Critic Acclaim</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#fdfbf7]">
                Unforgettable Dining Memories
              </h2>
            </ScrollSideEntry>
            <ScrollSideEntry direction="right" delay={0.2}>
              <button
                onClick={() => onNavigate('reviews')}
                className="btn-outline-gold px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider self-start md:self-auto inline-flex items-center gap-2 cursor-pointer"
              >
                Read All Diners' Reviews
                <ArrowRight className="w-4 h-4" />
              </button>
            </ScrollSideEntry>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredReviews.map((rev, idx) => {
              const direction = idx % 2 === 0 ? 'left' : 'right';
              return (
                <ScrollSideEntry
                  key={rev.id}
                  direction={direction}
                  delay={(idx % 3) * 0.12}
                  className="h-full"
                >
                  <div
                    className="p-8 rounded-2xl bg-[#14110f] border border-[#26201a] flex flex-col justify-between space-y-6 hover:border-[#d4af37]/30 transition-all h-full"
                  >
                    <div className="space-y-4">
                      {/* Star Rating */}
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-sm text-[#c5bcad] leading-relaxed italic">
                        "{rev.review}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#221c17] flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-semibold text-[#fdfbf7]">
                          {rev.customerName}
                        </h5>
                        <span className="text-xs text-[#8c8275]">
                          {rev.roleOrCity} • {rev.source}
                        </span>
                      </div>
                      <span className="text-xs text-[#7a7063]">{rev.date}</span>
                    </div>
                  </div>
                </ScrollSideEntry>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. SECTION G: GALLERY PREVIEW */}
      <section id="gallery-section" className="py-24 bg-[#0d0b0a] relative border-t border-[#1f1a16] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollSideEntry direction="left" delay={0.1}>
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Editorial Gallery</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#fdfbf7]">
                Moments Captured in Fire
              </h2>
              <p className="text-sm text-[#9d9385]">
                A visual glimpse into our culinary artistry, ambiance, and dining celebrations.
              </p>
            </div>
          </ScrollSideEntry>

          {/* Hardware-Accelerated Responsive Slider */}
          <ScrollSideEntry direction="left" delay={0.15} className="mb-12">
            <ResponsiveImageSlider
              slides={galleryPreview.map((item) => ({
                id: item.id,
                title: item.title,
                subtitle: item.category.toUpperCase(),
                description: item.caption,
                image: item.image,
                category: item.category,
                badge: 'Anthology Highlight'
              }))}
              autoPlayInterval={6000}
              aspectRatio="cinematic"
              onImageClick={() => onNavigate('gallery')}
              showThumbnails={false}
              showIndicators={true}
            />
          </ScrollSideEntry>

          {/* Masonry-like grid with alternating side entry */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {galleryPreview.map((item, idx) => {
              const direction = idx % 2 === 0 ? 'left' : 'right';
              return (
                <ScrollSideEntry
                  key={item.id}
                  direction={direction}
                  delay={(idx % 3) * 0.1}
                >
                  <div
                    onClick={() => onNavigate('gallery')}
                    className="relative h-48 sm:h-64 rounded-xl overflow-hidden border border-[#2e2620] group cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-3 left-3 right-3 p-2 rounded-lg bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-semibold text-[#fdfbf7] truncate">{item.title}</p>
                    </div>
                  </div>
                </ScrollSideEntry>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('gallery')}
              className="btn-outline-gold px-8 py-3.5 rounded-lg text-xs font-semibold uppercase tracking-widest inline-flex items-center gap-2 cursor-pointer"
            >
              Explore Full Photography Gallery
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. SECTION H: LOCATION & HOURS SECTION */}
      <section id="hours-location" className="py-24 bg-[#120f0d] relative border-t border-[#1f1a16] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Details (6 cols) - Enters from Left */}
            <ScrollSideEntry direction="left" delay={0.1} className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Visit Us in {config.contact.city}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#fdfbf7]">
                Location &amp; Dining Hours
              </h2>
              <p className="text-sm sm:text-base text-[#c5bcad] leading-relaxed">
                Situated in <strong className="text-[#fdfbf7] font-semibold">{config.contact.city}</strong>. Valet parking available on arrival from 5:00 PM.
              </p>

              {/* Hours Card */}
              <div className="p-6 rounded-2xl bg-[#171412] border border-[#26201a] space-y-4">
                <h4 className="font-serif text-lg font-semibold text-[#fdfbf7] border-b border-[#221c17] pb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#d4af37]" />
                  Service Timings
                </h4>
                <div className="space-y-2.5 text-xs sm:text-sm">
                  {config.hours.map((h, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#a89d8f]">
                      <span className="font-semibold text-[#fdfbf7]">{h.days}:</span>
                      <span className="text-[#d4af37]">{h.lunch} | {h.dinner}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contacts Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#171412] border border-[#26201a]">
                  <span className="text-[11px] uppercase tracking-widest text-[#7a7063] block">Phone Reservations</span>
                  <a
                    href={`tel:${config.contact.phoneClean}`}
                    className="text-sm font-semibold text-[#fdfbf7] hover:text-[#d4af37] transition-colors mt-1 block"
                  >
                    {config.contact.phone}
                  </a>
                </div>
                <div className="p-4 rounded-xl bg-[#171412] border border-[#26201a]">
                  <span className="text-[11px] uppercase tracking-widest text-[#7a7063] block">WhatsApp Concierge</span>
                  <a
                    href={`https://wa.me/${config.contact.whatsappClean}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#25D366] hover:underline transition-colors mt-1 block"
                  >
                    {config.contact.whatsapp}
                  </a>
                </div>
              </div>
            </ScrollSideEntry>

            {/* Stylized Location View (6 cols) - Enters from Right */}
            <ScrollSideEntry direction="right" delay={0.2} className="lg:col-span-6">
              <div className="relative h-[420px] rounded-2xl overflow-hidden border border-[#2e2620] bg-[#1a1613] p-8 flex flex-col justify-between shadow-2xl">
                {/* Background Map Graphic Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-black/40" />

                {/* Location Card */}
                <div className="relative z-10 p-5 rounded-xl bg-[#14110f]/95 border border-[#d4af37]/40 shadow-xl max-w-sm backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#d4af37] text-[#0d0b0a] flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#fdfbf7]">{config.name}</h4>
                      <p className="text-xs text-[#e2d9cc] font-medium flex items-center gap-1 mt-0.5">
                        <span>📍</span> {config.contact.city}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="text-xs text-[#8c8275]">
                    <span>Complimentary Valet Service Available Daily</span>
                  </div>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="btn-outline-gold px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    View Contact Desk
                  </button>
                </div>
              </div>
            </ScrollSideEntry>
          </div>
        </div>
      </section>

      {/* 10. SECTION I: FINAL CTA */}
      <section id="reservation-cta" className="py-28 bg-gradient-to-b from-[#0d0b0a] via-[#140e0a] to-[#080706] relative text-center border-t border-[#1f1a16] overflow-hidden">
        {/* Subtle Ember Flare */}
        <div className="absolute inset-0 gold-glow opacity-60 pointer-events-none" />
        <ScrollSideEntry direction="left" delay={0.1} className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
            <Flame className="w-4 h-4" />
            <span>An Evening of Gastronomy</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#fdfbf7] uppercase tracking-wider font-extrabold leading-tight">
            Your Table Awaits.
          </h2>

          <p className="text-base sm:text-lg text-[#d6cebf] max-w-xl mx-auto leading-relaxed font-light">
            Whether an intimate anniversary, client banquet, or private family celebration, experience the warmth and theatre of {config.name}.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => openOrderModal('delivery')}
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-500 text-black text-xs uppercase tracking-widest font-extrabold flex items-center justify-center gap-2 shadow-2xl cursor-pointer hover:scale-102 transition-transform"
            >
              <Bike className="w-4 h-4" />
              <span>Order Online Delivery / Pickup</span>
            </button>
            <button
              onClick={() => onNavigate('reservations')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl btn-outline-gold text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Reserve a Table</span>
            </button>
          </div>
        </ScrollSideEntry>
      </section>
    </div>
  );
};
