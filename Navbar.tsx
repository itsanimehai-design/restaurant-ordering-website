import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  UtensilsCrossed,
  Shield,
  Phone,
  Clock,
  Truck,
  Store,
  Menu as MenuIcon,
  X,
  MoreVertical,
  MessageCircle,
  Info,
  LogOut,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';
import { StoreSettings, CartItem } from '../types';

interface NavbarProps {
  settings: StoreSettings;
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenOwnerPortal: () => void;
  isOwnerMode: boolean;
  orderType: 'delivery' | 'pickup';
  onToggleOrderType: (type: 'delivery' | 'pickup') => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cart,
  onOpenCart,
  onOpenOwnerPortal,
  isOwnerMode,
  orderType,
  onToggleOrderType,
  activeSection,
  onSelectSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [threeDotOpen, setThreeDotOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close 3-dot menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setThreeDotOpen(false);
      }
    };
    if (threeDotOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [threeDotOpen]);

  const safeCart = Array.isArray(cart) ? cart : [];
  const totalCartItems = safeCart.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  const cartSubtotal = safeCart.reduce((sum, item) => sum + (item?.itemTotal || 0), 0);

  const navLinks = [
    { id: 'deals', label: '🔥 Deals & Boxes', href: '#deals' },
    { id: 'deal-meal', label: '🍗 Deal Meals', href: '#menu-deal-meal' },
    { id: 'spicy', label: '🌶️ Spicy Food', href: '#menu-spicy-food' },
    { id: 'ice-cream', label: '🍦 Ice Cream', href: '#menu-ice-cream' },
    { id: 'drinks', label: '🥤 Drinks', href: '#menu-drinks' },
    { id: 'burgers', label: '🍔 Burgers', href: '#menu-burgers' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Announcement Strip */}
      {settings.announcement && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white text-xs sm:text-sm font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
          <span>{settings.announcement}</span>
          <span className="hidden md:inline-block bg-white/20 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
            Call: {settings.phone}
          </span>
        </div>
      )}

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
          
          {/* Brand Logo, Back button & Name */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Responsive Back Button (←) */}
            <button
              type="button"
              onClick={() => {
                if (activeSection !== 'all') {
                  onSelectSection('all');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-1.5 h-9 w-9 sm:h-auto sm:w-auto p-1.5 sm:px-3 sm:py-2 rounded-xl bg-stone-100 hover:bg-amber-50 active:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200/90 shadow-xs transition-all active:scale-95 shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              title="Back to Top / Menu"
              aria-label="Back to main menu"
            >
              <ArrowLeft className="w-4 h-4 text-stone-700 hover:text-amber-900 shrink-0" />
              <span className="hidden sm:inline-block text-xs font-bold tracking-tight">Back</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0" onClick={() => onSelectSection('all')}>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0 font-bold text-base sm:text-lg">
                <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 truncate">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-stone-900 font-serif truncate">
                    {settings.name}
                  </span>
                  {settings.isOpen ? (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Open
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                      Closed
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 hidden sm:flex items-center gap-3 truncate">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" /> {settings.estimatedDeliveryTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-stone-400" /> Free delivery over {settings.currency} {settings.freeDeliveryThreshold}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectSection(link.id);
                  const el = document.querySelector(link.href);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeSection === link.id
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Delivery / Pickup Switch */}
            <div className="hidden sm:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onToggleOrderType('delivery')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                  orderType === 'delivery'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleOrderType('pickup')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                  orderType === 'pickup'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Takeaway</span>
              </button>
            </div>

            {/* Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-amber-500/25 transition-all transform active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-rose-600 text-white text-[10px] font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold">
                {cartSubtotal > 0 ? `${settings.currency} ${cartSubtotal.toLocaleString()}` : 'Cart'}
              </span>
            </button>

            {/* Three-Dot (⋮) Menu Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setThreeDotOpen(!threeDotOpen)}
                className={`p-2 rounded-xl border transition-all ${
                  threeDotOpen || isOwnerMode
                    ? 'bg-stone-900 text-amber-400 border-stone-800 shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                }`}
                title="More Options"
                aria-label="More options"
                aria-expanded={threeDotOpen}
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Three-Dot Dropdown Menu */}
              {threeDotOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-stone-800">
                    <p className="text-[11px] font-medium text-stone-400">Store Quick Menu</p>
                  </div>

                  <div className="py-1">
                    {/* Owner Portal Access inside 3-dot */}
                    <button
                      type="button"
                      onClick={() => {
                        setThreeDotOpen(false);
                        onOpenOwnerPortal();
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold transition-colors ${
                        isOwnerMode
                          ? 'text-rose-400 hover:bg-rose-950/40'
                          : 'text-stone-200 hover:text-white hover:bg-stone-800'
                      }`}
                    >
                      {isOwnerMode ? (
                        <>
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>Close Owner Portal</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 text-amber-400" />
                          <span>Owner Portal</span>
                        </>
                      )}
                    </button>

                    {/* WhatsApp Us Quick Action */}
                    {settings.whatsappNumber && (
                      <a
                        href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hi ${settings.name}, I want to check your menu and special deals.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setThreeDotOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:bg-stone-800 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    )}

                    {/* Call Restaurant Quick Action */}
                    {settings.phone && (
                      <a
                        href={`tel:${settings.phone}`}
                        onClick={() => setThreeDotOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-amber-500" />
                        <span>Call Store: {settings.phone}</span>
                      </a>
                    )}
                  </div>

                  <div className="pt-1.5 pb-0.5 px-3 border-t border-stone-800/80 text-[10px] text-stone-500">
                    <span>{settings.openingHours || '12:00 PM - 02:00 AM'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 py-3 space-y-2">
            <div className="flex sm:hidden items-center justify-between p-2 bg-stone-100 rounded-lg">
              <span className="text-xs font-semibold text-stone-600">Order Method:</span>
              <div className="flex gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => onToggleOrderType('delivery')}
                  className={`px-2 py-1 rounded font-medium ${orderType === 'delivery' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
                >
                  Delivery
                </button>
                <button
                  type="button"
                  onClick={() => onToggleOrderType('pickup')}
                  className={`px-2 py-1 rounded font-medium ${orderType === 'pickup' ? 'bg-amber-600 text-white' : 'text-stone-700'}`}
                >
                  Takeaway
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectSection(link.id);
                    setMobileMenuOpen(false);
                    const el = document.querySelector(link.href);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-stone-100 text-stone-800 hover:bg-amber-50 hover:text-amber-900"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-stone-500 border-t border-stone-100">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-600" /> {settings.phone}
              </span>
              <span className="text-[11px] font-medium text-emerald-700">
                {settings.isOpen ? 'Accepting Orders' : 'Currently Closed'}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

