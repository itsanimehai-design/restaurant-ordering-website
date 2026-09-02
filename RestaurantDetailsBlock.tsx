import React, { useState } from 'react';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { SubtleGlowingHeading } from './SubtleGlowingHeading';
import { PageId } from '../types';
import { 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Mail, 
  CalendarCheck, 
  Truck, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Users, 
  Flame, 
  Star, 
  Heart, 
  Info,
  Utensils,
  ChevronRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

interface RestaurantDetailsBlockProps {
  onNavigate: (page: PageId, subTab?: string) => void;
  onOpenOrderModal?: (type: 'delivery' | 'pickup') => void;
}

export const RestaurantDetailsBlock: React.FC<RestaurantDetailsBlockProps> = ({
  onNavigate,
  onOpenOrderModal
}) => {
  const { config, formatPrice } = useRestaurantData();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const detailsBlock = config.detailsBlock || {
    eyebrow: 'Restaurant Overview & Culinary Heritage',
    heading: 'Where Gastronomy Meets Soul, Craft & Heritage',
    subheading: 'A tribute to the ancient mastery of open-wood fire cooking, heirloom spices, and authentic hospitality.',
    cuisineType: 'Pakistani Hearth Fine Dining & Charcoal Specialities',
    reservationNotes: 'Advance reservations recommended for evening dinners and private VIP suites.',
    deliveryNotes: 'Temperature-controlled insulated packaging ensuring sizzling hearth quality to your doorstep.',
    showCuisineBadge: true,
    showLocationCard: true,
    showHoursCard: true,
    showContactCard: true,
    showReservationCard: true,
    showDeliveryCard: true,
    showCustomDetails: true,
    customDetails: []
  };

  const customDetailsList = (detailsBlock.customDetails || []).filter(d => d.isPublished !== false);

  const handleCopy = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getDetailIcon = (iconName?: string) => {
    switch (iconName) {
      case 'flame': return <Flame className="w-4 h-4 text-[#d4af37]" />;
      case 'sparkles': return <Sparkles className="w-4 h-4 text-[#d4af37]" />;
      case 'shield-check': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'award': return <Award className="w-4 h-4 text-[#d4af37]" />;
      case 'users': return <Users className="w-4 h-4 text-amber-400" />;
      case 'clock': return <Clock className="w-4 h-4 text-[#d4af37]" />;
      case 'map-pin': return <MapPin className="w-4 h-4 text-rose-400" />;
      case 'phone': return <Phone className="w-4 h-4 text-emerald-400" />;
      case 'mail': return <Mail className="w-4 h-4 text-sky-400" />;
      case 'truck': return <Truck className="w-4 h-4 text-amber-400" />;
      case 'calendar': return <CalendarCheck className="w-4 h-4 text-[#d4af37]" />;
      case 'star': return <Star className="w-4 h-4 text-[#d4af37]" />;
      case 'heart': return <Heart className="w-4 h-4 text-rose-400" />;
      case 'utensils': return <Utensils className="w-4 h-4 text-[#d4af37]" />;
      default: return <Info className="w-4 h-4 text-[#d4af37]" />;
    }
  };

  return (
    <section 
      id="restaurant-details-block" 
      className="py-20 sm:py-24 bg-[#0d0b0a] text-[#fdfbf7] relative border-t border-[#1f1a16] overflow-hidden"
    >
      {/* Background subtle ambient warmth */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* ══════════════════════════════════════════════════════════════
            1. SECTION HEADER (Editable Eyebrow, Glowing Heading & Subtitle)
            ══════════════════════════════════════════════════════════════ */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1612] border border-[#d4af37]/35 text-[#d4af37] text-xs font-semibold uppercase tracking-widest shadow-sm">
            <Flame className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{detailsBlock.eyebrow || 'Restaurant Overview & Culinary Heritage'}</span>
          </div>

          {/* Editable Main Heading with Subtle Animated Glow and Micro Letter Movement */}
          <div className="pt-1">
            <SubtleGlowingHeading
              text={detailsBlock.heading || 'Where Gastronomy Meets Soul, Craft & Heritage'}
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#fdfbf7] leading-tight"
            />
          </div>

          {/* Subheading / Tagline */}
          <p className="text-sm sm:text-base text-[#c5bcad] leading-relaxed font-light pt-1">
            {detailsBlock.subheading || config.tagline || 'A refined dining experience where fire, flavour and craftsmanship come together.'}
          </p>

          {/* Cuisine Type Pill */}
          {detailsBlock.showCuisineBadge !== false && (
            <div className="pt-2 flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#241a13] border border-[#d4af37]/40 text-[#d4af37] text-xs font-medium tracking-wide">
                <Utensils className="w-3.5 h-3.5" />
                <span>{detailsBlock.cuisineType || config.storyDetails?.cuisineType || 'Pakistani Hearth Fine Dining & Charcoal Specialities'}</span>
              </span>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. MAIN RESTAURANT INFORMATION GRID
            ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Identity, Story & Philosophy (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Identity & About Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#14110f] border border-[#2d241d] shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#fdfbf7]">
                    {config.name}
                  </h3>
                  <p className="text-xs text-[#d4af37] font-medium tracking-wider uppercase mt-0.5">
                    {config.legalName || config.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-[#a89d8d] uppercase tracking-wider block">Established</span>
                  <span className="font-serif text-lg font-bold text-[#d4af37]">{config.established || 2020}</span>
                </div>
              </div>

              <p className="text-sm text-[#c5bcad] leading-relaxed font-light">
                {config.aboutText || 'Every dish is a tribute to the ancient mastery of open-wood fire cooking. We source hand-selected heritage spices and farm-fresh ingredients to craft an unforgettable Pakistani fine dining experience.'}
              </p>

              {/* Philosophy Quote Box */}
              <div className="p-4 rounded-2xl bg-[#1a1512] border-l-2 border-[#d4af37] border-y border-r border-white/5 space-y-1.5">
                <p className="font-serif text-xs sm:text-sm text-[#fdfbf7] italic leading-relaxed">
                  "{config.storyDetails?.culinaryPhilosophy || 'We cook with flame because living fire cannot be replicated by machinery.'}"
                </p>
                <span className="text-[11px] text-[#d4af37] font-medium block">
                  — The Hearth Philosophy
                </span>
              </div>

              {/* Quick Action Navigation Buttons */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('menu')}
                  className="btn-gold flex-1 py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Explore Menu</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="btn-outline-gold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Our Story</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Custom Amenities & Features Grid */}
            {detailsBlock.showCustomDetails !== false && customDetailsList.length > 0 && (
              <div className="p-6 rounded-3xl bg-[#14110f] border border-[#2d241d] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Restaurant Highlights &amp; Standards</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customDetailsList.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#1a1512] border border-white/5 space-y-1 hover:border-[#d4af37]/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#fdfbf7]">
                        {getDetailIcon(item.icon)}
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[11px] text-[#a89d8d] leading-relaxed">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Guest Service Details Bento (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Location & Address Card */}
            {detailsBlock.showLocationCard !== false && (
              <div className="p-6 rounded-3xl bg-[#14110f] border border-[#2d241d] space-y-4 flex flex-col justify-between hover:border-[#d4af37]/40 transition-colors">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${config.contact.address}, ${config.contact.city}`, 'address')}
                      className="text-[11px] text-[#a89d8d] hover:text-[#d4af37] flex items-center gap-1 transition-colors"
                      title="Copy Address"
                    >
                      {copiedField === 'address' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#fdfbf7]">
                      Location &amp; Landmark
                    </h4>
                    <p className="text-xs text-[#a89d8d] mt-1 font-mono">
                      {config.contact.address || 'Ilahiabad, Pakistan'}
                    </p>
                    <p className="text-xs text-[#d4af37] font-semibold mt-0.5">
                      {config.contact.city || 'Ilahiabad, Pakistan'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-[#8c8273]">Valet parking available</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="text-xs text-[#d4af37] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>View Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. Operating Hours Card */}
            {detailsBlock.showHoursCard !== false && (
              <div className="p-6 rounded-3xl bg-[#14110f] border border-[#2d241d] space-y-4 flex flex-col justify-between hover:border-[#d4af37]/40 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-amber-950/40 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                      <Clock className="w-4 h-4" />
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                      Open Daily
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#fdfbf7]">
                      Operating Hours
                    </h4>
                    <div className="mt-2 space-y-2">
                      {(config.hours || []).slice(0, 3).map((h, i) => (
                        <div key={i} className="text-xs flex justify-between items-start border-b border-white/5 pb-1 last:border-0 last:pb-0">
                          <span className="text-[#a89d8d] font-medium">{h.days}</span>
                          <span className="text-right text-[#fdfbf7] font-mono text-[11px]">
                            {h.dinner || h.lunch}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <p className="text-[11px] text-[#8c8273]">
                    Kitchen closes 30 mins before closing
                  </p>
                </div>
              </div>
            )}

            {/* 3. Direct Contact & Communication Card */}
            {detailsBlock.showContactCard !== false && (
              <div className="p-6 rounded-3xl bg-[#14110f] border border-[#2d241d] space-y-4 flex flex-col justify-between hover:border-[#d4af37]/40 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <span className="text-[11px] text-[#a89d8d]">Direct Inquiry</span>
                  </div>

                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#fdfbf7]">
                      Contact &amp; Support
                    </h4>
                    <p className="text-xs text-[#a89d8d] mt-1">
                      Instant assistance for reservations, corporate events, and inquiries.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    {config.contact.phone && (
                      <a
                        href={`tel:${config.contact.phoneClean || config.contact.phone}`}
                        className="p-2.5 rounded-xl bg-[#1a1512] border border-white/5 hover:border-[#d4af37]/40 flex items-center justify-between text-xs text-[#fdfbf7] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-mono">{config.contact.phone}</span>
                        </span>
                        <span className="text-[10px] text-[#d4af37] uppercase font-bold">Call</span>
                      </a>
                    )}

                    {config.contact.whatsapp && (
                      <a
                        href={`https://wa.me/${config.contact.whatsappClean || '923000000000'}?text=${encodeURIComponent(`Hello ${config.name}, I would like to inquire about dining.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-[#1a1512] border border-white/5 hover:border-emerald-500/40 flex items-center justify-between text-xs text-[#fdfbf7] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp Concierge</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 uppercase font-bold">Chat</span>
                      </a>
                    )}
                  </div>
                </div>

                {config.contact.email && (
                  <div className="pt-2 border-t border-white/5">
                    <a 
                      href={`mailto:${config.contact.email}`}
                      className="text-[11px] text-[#8c8273] hover:text-[#d4af37] flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{config.contact.email}</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* 4. Table Reservation Information Card */}
            {detailsBlock.showReservationCard !== false && (
              <div className="p-6 rounded-3xl bg-[#14110f] border border-[#2d241d] space-y-4 flex flex-col justify-between hover:border-[#d4af37]/40 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                      <CalendarCheck className="w-4 h-4" />
                    </span>
                    <span className="text-[11px] text-[#d4af37] font-semibold">
                      {config.storyDetails?.seatingCapacity || '160 Guests'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#fdfbf7]">
                      Table Reservations
                    </h4>
                    <p className="text-xs text-[#c5bcad] mt-1 leading-relaxed">
                      {detailsBlock.reservationNotes || config.storyDetails?.reservationNotice || 'Advance reservations recommended for dinner seatings and private VIP rooms. Walk-ins welcomed subject to table availability.'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => onNavigate('reservations')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#241a13] border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-[#0d0b0a] text-[#d4af37] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Reserve a Table</span>
                  </button>
                </div>
              </div>
            )}

            {/* 5. Delivery & Takeaway Service Card */}
            {detailsBlock.showDeliveryCard !== false && (
              <div className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-r from-[#17120e] via-[#1c1510] to-[#140e0a] border border-[#d4af37]/30 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-amber-950/60 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
                      <Truck className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#fdfbf7]">
                        Direct Hearth Delivery &amp; Takeaway
                      </h4>
                      <p className="text-xs text-[#a89d8d] mt-0.5">
                        {detailsBlock.deliveryNotes || 'Temperature-sealed insulated delivery keeping dishes sizzling hot to your doorstep.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenOrderModal) onOpenOrderModal('delivery');
                        else onNavigate('menu');
                      }}
                      className="btn-gold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Order Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenOrderModal) onOpenOrderModal('pickup');
                        else onNavigate('menu');
                      }}
                      className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-[#d4af37] text-xs font-semibold text-[#fdfbf7] transition-colors cursor-pointer"
                    >
                      Self-Pickup
                    </button>
                  </div>
                </div>

                {/* Delivery Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#120d0a] border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-[#8c8273] block">Delivery Fee</span>
                    <span className="font-mono font-bold text-[#d4af37]">{formatPrice(config.deliverySettings?.deliveryFee ?? 150)}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#120d0a] border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-[#8c8273] block">Free Delivery Over</span>
                    <span className="font-mono font-bold text-emerald-400">{formatPrice(config.deliverySettings?.freeDeliveryThreshold ?? 2500)}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#120d0a] border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-[#8c8273] block">Est. Delivery</span>
                    <span className="font-mono font-semibold text-[#fdfbf7]">{config.deliverySettings?.estimatedDeliveryMinutes || '35-45 mins'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#120d0a] border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-[#8c8273] block">Est. Pickup</span>
                    <span className="font-mono font-semibold text-[#fdfbf7]">{config.deliverySettings?.estimatedPickupMinutes || '20-25 mins'}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
