import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { 
  Flame, 
  Menu, 
  X, 
  Bookmark, 
  Phone, 
  CalendarCheck, 
  ShieldCheck, 
  IceCream, 
  ShoppingBag, 
  Bike, 
  Sparkles,
  UtensilsCrossed,
  Clock,
  Wallet,
  CupSoda,
  Lock,
  KeyRound,
  Crown,
  LogOut,
  LayoutDashboard,
  Eye,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HeaderLiveClock } from './HeaderLiveClock';
import { ThemeToggle } from './ThemeToggle';
import { AiAssistantButton } from './AiAssistantButton';
import { useAiAssistant } from '../context/AiAssistantContext';
import { scrollToTop } from '../utils/smoothScroll';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId, tab?: string) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  wishlistCount,
  onOpenWishlist,
}) => {
  const { 
    config, 
    ownerSession, 
    authSession,
    isOwnerMode, 
    isOwnerModeActive,
    setIsOwnerModeActive,
    toggleOwnerMode, 
    setIsLoginModalOpen,
    logoutOwner,
    cartItems, 
    activeOrder,
    openOrderModal,
    openOwnerPortal,
    setOwnerActiveTab
  } = useRestaurantData();
  const { openAssistant, openBudgetFilter } = useAiAssistant();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Food Menu' },
    { id: 'chefs', label: 'Chefs' },
    { id: 'offers', label: 'Offers' },
    { id: 'events', label: 'Events' },
    { id: 'about', label: 'About' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (page: PageId, tab?: string) => {
    onNavigate(page, tab);
    setMobileMenuOpen(false);
    scrollToTop(450);
  };

  const handleOpenOwnerPortal = () => {
    setMobileMenuOpen(false);
    if (openOwnerPortal) {
      openOwnerPortal('code-workspace');
    } else {
      if (setOwnerActiveTab) setOwnerActiveTab('code-workspace');
      if (authSession?.isAuthenticated) {
        setIsOwnerModeActive(true);
      } else {
        setIsLoginModalOpen(true);
      }
    }
  };

  const totalCartQty = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <>
      <header
        className={`fixed-header-hardware fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0d0b0a]/95 backdrop-blur-md border-b border-[#2a241f] py-2.5 shadow-xl shadow-black/50'
            : 'bg-gradient-to-b from-[#0d0b0a]/95 via-[#0d0b0a]/60 to-transparent py-4'
        }`}
        style={{
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          contain: 'layout paint'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Live Digital Clock Container */}
          <div className="flex flex-col items-start select-none">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded-full p-0.5 cursor-pointer"
              aria-label={`${config.name} Home`}
            >
              {/* Perfectly Circular / Round Logo Container */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square bg-gradient-to-br from-[#d4af37] via-[#f59e0b] to-[#8c5e10] p-[1.5px] shadow-lg shadow-[#d4af37]/25 group-hover:shadow-[#d4af37]/50 transition-all duration-300 shrink-0 overflow-hidden">
                <div className="w-full h-full bg-[#120f0d] rounded-full flex items-center justify-center overflow-hidden">
                  {config.branding?.logoImage ? (
                    <img 
                      src={config.branding.logoImage} 
                      alt={config.name} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Flame className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
              </div>
              <div>
                <span className="font-display tracking-[0.18em] sm:tracking-[0.2em] text-base sm:text-lg font-bold text-[#fdfbf7] block leading-none">
                  {config.name}
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#c59b27] font-medium block mt-1">
                  FINE DINING • {config.contact.city.toUpperCase()}
                </span>
              </div>
            </button>

            {/* Live Digital Clock directly underneath logo */}
            <HeaderLiveClock />
          </div>

          {/* ════════════════════════════════════════════════════════════════
              PROMINENT CATEGORY NAVIGATION CONTROLS (DESKTOP)
              ════════════════════════════════════════════════════════════════ */}
          <div className="hidden lg:flex items-center gap-1.5">
            {/* Prominent FOOD Navigation Button */}
            <button
              id="nav-prominent-food"
              onClick={() => handleNavClick('menu', 'food')}
              className={`group px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                activePage === 'menu'
                  ? 'bg-[#291b10] border-[#d4af37] text-white shadow-lg shadow-[#d4af37]/20 ring-1 ring-[#d4af37]/50'
                  : 'bg-[#18130f]/80 border-[#382b1e] text-[#fdfbf7] hover:border-[#d4af37]/60 hover:bg-[#241a12]'
              }`}
            >
              <span className="w-5 h-5 rounded-md bg-[#2b180d] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <UtensilsCrossed className="w-3 h-3 text-[#d4af37]" />
              </span>
              <span className="text-[11px] uppercase font-bold tracking-wider">Food</span>
            </button>

            {/* Prominent MEALS & DEALS Navigation Button */}
            <button
              id="nav-prominent-meals"
              onClick={() => handleNavClick('menu', 'meals')}
              className="group px-3 py-1.5 rounded-xl border border-orange-500/40 bg-orange-950/40 hover:bg-orange-900/60 hover:border-orange-500 text-[#fdfbf7] flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span className="w-5 h-5 rounded-md bg-orange-950/80 border border-orange-500/50 flex items-center justify-center text-orange-400">
                <Flame className="w-3 h-3 text-orange-400" />
              </span>
              <span className="text-[11px] uppercase font-bold tracking-wider text-orange-200">Meals/Deals</span>
            </button>

            {/* Prominent ICE CREAM & DESSERTS Navigation Button */}
            <button
              id="nav-prominent-desserts"
              onClick={() => handleNavClick('menu', 'dessert-bar')}
              className="group px-3 py-1.5 rounded-xl border border-pink-900/40 bg-[#1f1217]/80 hover:bg-[#2e1622] hover:border-pink-500/50 text-[#fdfbf7] flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span className="w-5 h-5 rounded-md bg-pink-950/60 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <IceCream className="w-3 h-3 text-pink-300" />
              </span>
              <span className="text-[11px] uppercase font-bold tracking-wider text-pink-100">Desserts</span>
            </button>
          </div>

          {/* Standard Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.filter(l => l.id !== 'menu').map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-2.5 py-2 text-xs tracking-wider uppercase font-medium transition-colors duration-200 focus:outline-none rounded cursor-pointer ${
                    isActive
                      ? 'text-[#fdfbf7] font-bold'
                      : 'text-[#c5bcad] hover:text-[#fdfbf7]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Theme Toggle (Dark / Light Mode) */}
            <ThemeToggle variant="navbar" />

            {/* Paired Primary Controls: [ Ask AI ] [ Budget Filter ] */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#18110b]/90 border border-[#d4af37]/35 shadow-inner">
              {/* Ask AI Button */}
              <AiAssistantButton
                context={{ section: 'general', title: `${config.name} Restaurant Guide` }}
                variant="pill"
                label="Ask AI"
                size="sm"
              />

              {/* Budget Filter Button */}
              <button
                id="header-budget-filter-btn"
                type="button"
                onClick={(e) => openBudgetFilter(500, e.currentTarget)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#2a1d12] to-[#1a120c] border border-[#d4af37]/70 text-[#d4af37] text-xs font-bold hover:bg-[#382618] hover:border-[#d4af37] hover:scale-105 transition-all duration-300 shadow-md cursor-pointer ai-assistant-glow"
                title="Search food, bottled drinks & desserts by budget"
              >
                <Wallet className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="tracking-wide whitespace-nowrap text-[#fdfbf7]">Budget Filter</span>
              </button>
            </div>

            {/* Owner quick dashboard toggle if logged in */}
            {authSession?.isAuthenticated && (
              <button
                onClick={() => setIsOwnerModeActive(!isOwnerModeActive)}
                className="px-2.5 py-1.5 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#d4af37] hover:text-black transition-all cursor-pointer shadow-sm"
                title="Toggle Owner Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isOwnerModeActive ? 'Live Site' : 'Owner Panel'}</span>
              </button>
            )}

            {/* ORDER ONLINE & CANCELLATION BUTTON */}
            <button
              id="nav-order-online-btn"
              onClick={() => openOrderModal('delivery')}
              className={`relative px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeOrder && activeOrder.status !== 'cancelled' && activeOrder.status !== 'completed'
                  ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 shadow-lg shadow-emerald-950/50 animate-pulse'
                  : 'bg-[#291b11] border border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37] hover:text-black shadow-md'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>
                {activeOrder && activeOrder.status !== 'cancelled' && activeOrder.status !== 'completed'
                  ? `Track #${activeOrder.id}`
                  : 'Order Online'}
              </span>
              {totalCartQty > 0 && !activeOrder && (
                <span className="w-4 h-4 rounded-full bg-[#d4af37] text-black text-[10px] font-black flex items-center justify-center">
                  {totalCartQty}
                </span>
              )}
            </button>

            {/* Wishlist quick drawer button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-xl text-[#c5bcad] hover:text-[#fdfbf7] hover:bg-[#1f1a16] border border-[#2a241f] transition-colors duration-200 cursor-pointer"
              title="View Reservation Dish Wishlist"
              aria-label={`View Wishlist with ${wishlistCount} items`}
            >
              <Bookmark className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d4af37] text-[#0d0b0a] text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Reserve Button */}
            <button
              onClick={() => handleNavClick('reservations')}
              className="btn-gold px-3.5 py-2 rounded-xl text-xs tracking-wider uppercase font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Book Table</span>
            </button>

            {/* Desktop 3-Line (☰) Menu Trigger */}
            <button
              id="desktop-header-3line-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#181412] text-[#fdfbf7] border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#261d15] focus:outline-none transition-all flex items-center gap-1.5 cursor-pointer shadow-md group"
              aria-label="Toggle navigation and Owner Portal menu"
              title="Open Navigation Menu & Owner Portal (☰)"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-[#d4af37]" />
              ) : (
                <Menu className="w-4 h-4 text-[#d4af37] group-hover:scale-110 transition-transform" />
              )}
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#d4af37] pr-0.5">
                {mobileMenuOpen ? 'Close' : 'Menu'}
              </span>
            </button>
          </div>

          {/* Mobile Action Controls & Menu Trigger */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {/* Quick Theme Toggle on Mobile Header */}
            <ThemeToggle variant="compact" />

            {/* Paired Mobile Primary Controls: [ Ask AI ] [ Budget Filter ] */}
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#140e0a]/90 border border-[#d4af37]/35 shadow-inner">
              {/* Header AI Button: Compact on Mobile */}
              <AiAssistantButton
                context={{ section: 'general', title: `${config.name} Restaurant Guide` }}
                variant="pill"
                label="Ask AI"
                size="xs"
              />

              {/* Mobile Budget Filter Button */}
              <button
                id="mobile-header-budget-filter-btn"
                type="button"
                onClick={(e) => openBudgetFilter(500, e.currentTarget)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-[#2a1d12] to-[#1a120c] border border-[#d4af37]/70 text-[#d4af37] text-[11px] font-bold hover:bg-[#342416] hover:border-[#d4af37] transition-all cursor-pointer ai-assistant-glow shrink-0 shadow-sm"
                title="Filter by Budget"
              >
                <Wallet className="w-3 h-3 text-[#d4af37]" />
                <span className="whitespace-nowrap text-[#fdfbf7]">Budget Filter</span>
              </button>
            </div>

            {/* Quick Order Online on Mobile Header */}
            <button
              onClick={() => openOrderModal('delivery')}
              className="px-2 py-1.5 rounded-xl bg-[#291b11] border border-[#d4af37]/60 text-[#d4af37] text-[11px] font-bold uppercase flex items-center gap-1"
            >
              <Bike className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Order</span>
            </button>

            {/* Mobile 3-line (☰) Menu Trigger */}
            <button
              id="mobile-header-3line-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-[#181412] text-[#fdfbf7] border border-[#d4af37]/40 hover:border-[#d4af37] focus:outline-none transition-all flex items-center justify-center cursor-pointer"
              aria-label="Toggle 3-line navigation menu"
              title="Open Navigation Menu & Owner Portal (☰)"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#d4af37]" /> : <Menu className="w-5 h-5 text-[#d4af37]" />}
            </button>
          </div>
        </div>
      </header>

      {/* 3-Line (☰) Menu Navigation Drawer (Universal Mobile & Desktop) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/75 backdrop-blur-sm transition-opacity"
            />

            {/* Drawer Content Window */}
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed inset-x-0 top-[60px] lg:top-[70px] lg:inset-x-auto lg:right-6 lg:w-[450px] z-40 bg-[#0d0b0a]/98 border-b lg:border border-[#2a241f] lg:border-[#d4af37]/40 lg:rounded-2xl backdrop-blur-2xl px-5 py-6 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Top Bar inside Drawer: Title & Close */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#221c17]">
                <div className="flex items-center gap-2">
                  <Menu className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-serif text-sm font-bold tracking-wider text-[#fdfbf7] uppercase">
                    Navigation &amp; Portals
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#a89d8f] hover:text-[#fdfbf7] hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ════════════════════════════════════════════════════════════════
                  EXECUTIVE OWNER PORTAL ACCESS CARD (PROMINENT HIGHLIGHT)
                  ════════════════════════════════════════════════════════════════ */}
              <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-[#1e150f] via-[#140e0a] to-[#24170e] border-2 border-[#d4af37]/60 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-start justify-between gap-3 relative z-10 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#2d1e12] border border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-inner shrink-0">
                      {authSession?.isAuthenticated ? (
                        <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                      ) : (
                        <KeyRound className="w-5 h-5 text-[#d4af37]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Crown className="w-3 h-3 text-[#d4af37]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                          Restaurant Owner Portal
                        </span>
                      </div>
                      <h4 className="text-sm font-serif font-bold text-[#fdfbf7]">
                        {authSession?.isAuthenticated
                          ? `Logged in: ${authSession.username}`
                          : 'Executive Management Access'}
                      </h4>
                    </div>
                  </div>

                  {authSession?.isAuthenticated && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[9px] font-bold uppercase tracking-wider shrink-0">
                      Active
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#c5bcad] mb-3.5 leading-relaxed relative z-10">
                  {authSession?.isAuthenticated
                    ? 'Manage live incoming orders, edit dishes & pricing, configure discounts, halal soft drinks, and brand settings.'
                    : 'Access real-time kitchen orders, menu pricing, 3D showcases, breakfast point, soft drinks, deals, and settings.'}
                </p>

                {/* Primary Action Button */}
                <div className="flex items-center gap-2 relative z-10">
                  {authSession?.isAuthenticated ? (
                    <>
                      <button
                        id="drawer-open-owner-dashboard-btn"
                        type="button"
                        onClick={handleOpenOwnerPortal}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#b38927] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Open Owner Dashboard</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          logoutOwner();
                          setMobileMenuOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-[#261a14] border border-rose-500/40 text-rose-300 hover:bg-rose-950/80 transition-colors cursor-pointer"
                        title="Sign Out Owner"
                        aria-label="Sign Out of Owner Portal"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      id="drawer-owner-login-btn"
                      type="button"
                      onClick={handleOpenOwnerPortal}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#c59b27] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Owner Portal / Owner Login</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Theme Toggle within Drawer */}
              <div className="mb-4">
                <ThemeToggle variant="drawer" />
              </div>

              {/* Prominent Discovery Cards for 4 Main Categories */}
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <button
                  onClick={() => handleNavClick('menu', 'food')}
                  className="p-3 rounded-2xl bg-[#24170e] border border-[#d4af37]/40 text-left space-y-1.5 flex flex-col justify-between hover:bg-[#301f13] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#382012] flex items-center justify-center text-[#d4af37]">
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-xs text-[#fdfbf7]">Food</div>
                    <div className="text-[9px] text-[#a89d8f]">Karahi &amp; BBQ</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('menu', 'meals')}
                  className="p-3 rounded-2xl bg-[#2b160b] border border-orange-500/40 text-left space-y-1.5 flex flex-col justify-between hover:bg-[#381c0e] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-950/80 flex items-center justify-center text-orange-400">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-xs text-orange-200">Meals &amp; Deals</div>
                    <div className="text-[9px] text-orange-400/80">Family &amp; Combos</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('menu', 'soft-drinks')}
                  className="p-3 rounded-2xl bg-[#0e1d24] border border-cyan-500/40 text-left space-y-1.5 flex flex-col justify-between hover:bg-[#152a34] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-950/80 flex items-center justify-center text-cyan-300">
                    <CupSoda className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-xs text-cyan-200">Drinks</div>
                    <div className="text-[9px] text-cyan-400/80">Chai &amp; Beverages</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('menu', 'dessert-bar')}
                  className="p-3 rounded-2xl bg-[#201018] border border-pink-500/40 text-left space-y-1.5 flex flex-col justify-between hover:bg-[#2b1520] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-pink-950/80 flex items-center justify-center text-pink-300">
                    <IceCream className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-xs text-pink-200">Ice Cream &amp; Desserts</div>
                    <div className="text-[9px] text-pink-300/80">Gelato &amp; Shakes</div>
                  </div>
                </button>
              </div>

              {/* Smart Discovery Row: [ Ask AI ] [ Budget Filter ] in Drawer */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAssistant({ section: 'general', title: `${config.name} Restaurant Guide` });
                  }}
                  className="p-3 rounded-2xl bg-[#1e150f] border border-[#d4af37]/50 flex items-center gap-2.5 text-left ai-assistant-glow cursor-pointer hover:bg-[#291b12] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#2d1e14] border border-[#d4af37] flex items-center justify-center text-[#d4af37] shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#fdfbf7]">Ask AI</div>
                    <div className="text-[10px] text-[#c5bcad]">Instant Answers</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    openBudgetFilter(500, e.currentTarget);
                  }}
                  className="p-3 rounded-2xl bg-[#1e150f] border border-[#d4af37]/50 flex items-center gap-2.5 text-left ai-assistant-glow cursor-pointer hover:bg-[#291b12] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#2d1e14] border border-[#d4af37] flex items-center justify-center text-[#d4af37] shrink-0">
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#fdfbf7]">Budget Filter</div>
                    <div className="text-[10px] text-[#c5bcad]">Find Meals &amp; Drinks</div>
                  </div>
                </button>
              </div>

              {/* Navlinks List with Owner Portal Link Included */}
              <div className="space-y-2 divide-y divide-[#221c17]">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id)}
                      className={`block w-full text-left py-2 text-sm uppercase tracking-widest font-serif transition-colors cursor-pointer ${
                        activePage === link.id ? 'text-[#d4af37] font-bold pl-2 border-l-2 border-[#d4af37]' : 'text-[#c5bcad] hover:text-[#fdfbf7]'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}

                  {/* Explicit Owner Portal / Login Menu Item in Link List */}
                  <button
                    id="drawer-nav-owner-portal-link"
                    type="button"
                    onClick={handleOpenOwnerPortal}
                    className="w-full text-left py-2.5 px-3 my-1 rounded-xl bg-[#1f1610] border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] flex items-center justify-between text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm group"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#d4af37] group-hover:scale-110 transition-transform" />
                      <span>{authSession?.isAuthenticated ? 'Owner Dashboard (Active)' : 'Owner Portal / Login'}</span>
                    </div>
                    <span className="text-[10px] text-[#c5bcad] font-sans lowercase">
                      {authSession?.isAuthenticated ? 'switch view' : 'admin'}
                    </span>
                  </button>
                </div>

                <div className="pt-4 space-y-2.5">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openOrderModal('delivery');
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Bike className="w-4 h-4" />
                    Order Online Delivery / Pickup
                  </button>

                  <button
                    onClick={() => handleNavClick('reservations')}
                    className="w-full py-3 rounded-xl bg-[#1f1711] border border-[#d4af37]/40 text-[#d4af37] text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    Reserve a Table
                  </button>

                  <a
                    href={`tel:${config.contact.phoneClean}`}
                    className="w-full py-2.5 rounded-xl bg-[#140f0c] border border-[#261e18] text-[#a89d8f] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                    Call: {config.contact.phone}
                  </a>

                  <div className="pt-1 text-center text-xs text-[#e2d9cc] font-medium flex items-center justify-center gap-1.5">
                    <span>📍</span>
                    <span>{config.contact.city}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};



