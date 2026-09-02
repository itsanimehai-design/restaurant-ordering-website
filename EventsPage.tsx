import React, { useState } from 'react';
import { PageId, EventItem } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  Check, 
  ArrowRight, 
  MessageCircle, 
  Send, 
  GlassWater, 
  PartyPopper, 
  HeartHandshake, 
  Building2, 
  UtensilsCrossed 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BackButton } from '../components/BackButton';
import { AiAssistantButton } from '../components/AiAssistantButton';
import { ScrollSideEntry } from '../components/ScrollSideEntry';

interface EventsPageProps {
  onNavigate: (page: PageId) => void;
  onBack?: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onNavigate, onBack, onShowToast }) => {
  const { events, config, formatPrice } = useRestaurantData();

  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryGuests, setInquiryGuests] = useState('25-50');
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquiryCategory, setInquiryCategory] = useState('Wedding / Mehndi Reception');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const eventTypes = [
    { id: 'all', label: 'All Occasions' },
    { id: 'weddings', label: 'Weddings & Mehndi' },
    { id: 'corporate', label: 'Corporate Banquets' },
    { id: 'private', label: 'Private Family Dawats' },
    { id: 'eid', label: 'Ramadan & Eid' }
  ];

  const packages = [
    {
      id: 'pkg-royal',
      title: 'The Imperial Dawat Banquet',
      suitableFor: 'Weddings, Receptions & Milestone Anniversaries',
      guestRange: '50 to 250 Guests',
      pricePerHead: 4850,
      badge: 'Most Celebrated',
      features: [
        'Live Charcoal BBQ & Tandoori skewer stations',
        'Choice of 3 Signature Karahis & Dum Pukht Biryani',
        'Grand Dessert Table: Shahi Tukra, Rose Kunafa & Matka Kulfi',
        'Welcome Mocktails & Unlimited Karak / Kashmiri Chai',
        'Dedicated VIP Hostess Brigade & Bespoke Table Settings',
        'Complimentary Executive Valet Parking'
      ]
    },
    {
      id: 'pkg-heritage',
      title: 'Executive Hearth Gathering',
      suitableFor: 'Corporate Dinners, Board Meetings & Business Dawats',
      guestRange: '15 to 60 Guests',
      pricePerHead: 3850,
      badge: 'Corporate Preferred',
      features: [
        'Private Dining Chamber with AV presentation support',
        'Multi-course plated dinner or royal buffet setup',
        'Prime Mutton Chops & Charcoal Seekh Kebabs',
        'Slow-Braised Nihari & Artisanal Naan Baskets',
        'Premium Mineral Waters, Fresh Juices & Cardamom Chai',
        'Personalized menu stationery with company branding'
      ]
    },
    {
      id: 'pkg-intimate',
      title: 'Private Family Dawat Suite',
      suitableFor: 'Birthdays, Family Reunions & Eid Celebrations',
      guestRange: '10 to 30 Guests',
      pricePerHead: 3200,
      badge: 'Family Favorite',
      features: [
        'Secluded banquet chamber for ultimate family privacy',
        'Grand BBQ Platter & Shanwari Mutton Karahi centerpieces',
        'Fresh Clay Oven Breads & Mint Raita accompaniments',
        'Hot Gulab Jamun with Cardamom Cream',
        'Traditional Karak Chai Service in clay cups',
        'Customized flower arrangements and ambient lighting'
      ]
    }
  ];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      onShowToast('Missing Details', 'Please provide your name and contact phone number.', 'info');
      return;
    }

    setIsSubmitted(true);
    onShowToast(
      'Event Inquiry Dispatched',
      'Our Private Dining Concierge will contact you within 2 business hours.',
      'gold'
    );
  };

  const whatsappMessage = encodeURIComponent(
    `Hello! I would like to inquire about hosting a private event / banquet for approximately ${inquiryGuests} guests.`
  );

  return (
    <div className="pt-24 pb-20 bg-[#0d0b0a] text-[#f5efe6] min-h-screen overflow-x-hidden">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#241e19] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#181310]/80 via-[#0d0b0a]/90 to-[#0d0b0a] pointer-events-none" />
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#c59b27]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top-Left Back Navigation */}
        <div className="relative max-w-5xl mx-auto mb-8">
          <BackButton onClick={onBack || (() => onNavigate('home'))} />
        </div>

        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="relative max-w-5xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1713] border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
              <PartyPopper className="w-3.5 h-3.5" />
              Private Dining &amp; Bespoke Banquets
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-[#fdfbf7] tracking-tight">
              Celebrate In <span className="text-gradient-gold">Royal Pakistani Style</span>
            </h1>

            <p className="text-base sm:text-lg text-[#c5bcad] max-w-3xl mx-auto font-light leading-relaxed">
              From intimate Mehndi and wedding dawats to high-level corporate banquets, our private dining chambers and master chefs bring theatrical live charcoal cooking and warm hospitality to your celebrations.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#inquiry-section"
                className="btn-gold px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Request Event Quote
              </a>
              <a
                href={`https://wa.me/${config.contact.whatsappClean}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-[#25d366]/15 hover:bg-[#25d366]/25 border border-[#25d366]/40 text-[#25d366] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Banquet Desk
              </a>
            </div>
          </div>
        </ScrollSideEntry>
      </section>

      {/* Published Events & Masterclasses */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#241e19]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] block mb-1">
                Curated Gatherings
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#fdfbf7]">
                Upcoming Events &amp; Seasonal Dawat Series
              </h2>
            </div>
            <div className="text-xs text-[#8c8273]">
              Custom private reservations available daily upon inquiry
            </div>
          </div>
        </ScrollSideEntry>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.filter(e => e.isPublished !== false).map((evt, idx) => {
            const direction = idx % 2 === 0 ? 'left' : 'right';
            return (
              <ScrollSideEntry
                key={evt.id}
                direction={direction}
                delay={(idx % 2) * 0.12}
                className="h-full"
              >
                <div
                  className="group bg-[#15110e] border border-[#26201a] hover:border-[#d4af37]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#15110e] via-transparent to-black/40" />

                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                        evt.bookingStatus === 'open' 
                          ? 'bg-emerald-600/90 text-white backdrop-blur-sm' 
                          : evt.bookingStatus === 'limited' 
                          ? 'bg-[#c59b27] text-black font-extrabold' 
                          : 'bg-[#8c5e10] text-white'
                      }`}>
                        {evt.bookingStatus === 'open' ? 'Inquiries Open' : evt.bookingStatus === 'limited' ? 'Limited Availability' : 'Bespoke Package'}
                      </span>
                    </div>

                    {evt.price && (
                      <div className="absolute bottom-3 right-3 bg-[#0d0b0a]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold font-mono">
                        Starting from {formatPrice(evt.price)} / head
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#c5bcad] mb-2">
                        <span className="flex items-center gap-1.5 text-[#d4af37]">
                          <Calendar className="w-3.5 h-3.5" />
                          {evt.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {evt.time}
                        </span>
                        {evt.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {evt.location}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-display font-bold text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-[#a69c8d] mt-2 leading-relaxed font-light">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#221c17] flex items-center justify-between">
                      <a
                        href="#inquiry-section"
                        onClick={() => {
                          setInquiryCategory(evt.title);
                        }}
                        className="text-xs font-bold text-[#d4af37] hover:text-[#fdfbf7] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        Inquire for this Event <ArrowRight className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={`https://wa.me/${config.contact.whatsappClean}?text=${encodeURIComponent(`Hi, I am inquiring about ${evt.title}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#1f1a16] hover:bg-[#25d366]/20 border border-[#2a241f] text-[#25d366] transition-colors"
                        title="Direct WhatsApp Inquiry"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollSideEntry>
            );
          })}
        </div>
      </section>

      {/* Banquet Packages */}
      <section className="py-16 bg-[#110d0b] border-y border-[#241e19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollSideEntry direction="left" delay={0.1}>
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                Curated Event Tiers
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#fdfbf7]">
                Royal Banquet Packages
              </h2>
              <p className="text-xs sm:text-sm text-[#a69c8d]">
                Every package is fully customizable. Our culinary brigade creates bespoke menus tailored to your guests' taste preferences and dietary requirements.
              </p>
            </div>
          </ScrollSideEntry>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg, pIdx) => {
              const direction = pIdx % 2 === 0 ? 'left' : 'right';
              return (
                <ScrollSideEntry
                  key={pkg.id}
                  direction={direction}
                  delay={(pIdx % 3) * 0.12}
                  className="h-full"
                >
                  <div
                    className={`relative bg-[#15110e] rounded-2xl p-7 border flex flex-col justify-between transition-all duration-300 h-full ${
                      pkg.badge === 'Most Celebrated'
                        ? 'border-[#d4af37] shadow-xl shadow-[#d4af37]/10'
                        : 'border-[#26201a] hover:border-[#d4af37]/40'
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#d4af37] text-[#0d0b0a] text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                        {pkg.badge}
                      </div>
                    )}

                    <div>
                      <div className="text-center pb-6 border-b border-[#241e19]">
                        <h3 className="text-xl font-display font-bold text-[#fdfbf7]">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-[#c59b27] font-medium mt-1">
                          {pkg.suitableFor}
                        </p>

                        <div className="mt-4">
                          <span className="text-3xl font-display font-bold text-[#fdfbf7]">
                            {formatPrice(pkg.pricePerHead)}
                          </span>
                          <span className="text-xs text-[#8c8273] block mt-0.5">
                            per person • {pkg.guestRange}
                          </span>
                        </div>
                      </div>

                      <ul className="py-6 space-y-3 text-xs text-[#c5bcad]">
                        {pkg.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 border-t border-[#241e19]">
                      <a
                        href="#inquiry-section"
                        onClick={() => setInquiryCategory(pkg.title)}
                        className="w-full btn-gold py-3 rounded-lg text-xs uppercase tracking-wider font-bold text-center block cursor-pointer"
                      >
                        Select {pkg.title}
                      </a>
                    </div>
                  </div>
                </ScrollSideEntry>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inquiry Form & WhatsApp Booking */}
      <section id="inquiry-section" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="bg-[#15110e] border border-[#2a241f] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                Private Banquet Concierge
              </span>
              <h2 className="text-3xl font-display font-bold text-[#fdfbf7]">
                Plan Your Celebration
              </h2>
              <p className="text-xs sm:text-sm text-[#a69c8d]">
                Fill in your party requirements below. Our Executive Dining Director will prepare a customized proposal with menu tastings.
              </p>
            </div>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-[#1c1713] border border-[#d4af37]/40 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] flex items-center justify-center mx-auto">
                <Check className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-bold text-[#fdfbf7]">
                Banquet Inquiry Dispatched
              </h3>
              <p className="text-xs text-[#c5bcad] max-w-md mx-auto">
                Thank you, <span className="text-[#fdfbf7] font-semibold">{inquiryName}</span>. Our hospitality team has received your request for <span className="text-[#d4af37]">{inquiryCategory}</span> ({inquiryGuests} guests). We will reach out to you via <span className="text-[#fdfbf7] font-mono">{inquiryPhone}</span> shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="btn-gold px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Submit Another Request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#c5bcad] uppercase tracking-wider mb-2">
                    Host / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Chaudhry Asad / Tech Corp"
                    className="w-full bg-[#0d0b0a] border border-[#2a241f] focus:border-[#d4af37] rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c5bcad] uppercase tracking-wider mb-2">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="e.g. +92 300 1234567"
                    className="w-full bg-[#0d0b0a] border border-[#2a241f] focus:border-[#d4af37] rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#c5bcad] uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="e.g. contact@domain.com"
                    className="w-full bg-[#0d0b0a] border border-[#2a241f] focus:border-[#d4af37] rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c5bcad] uppercase tracking-wider mb-2">
                    Estimated Guests
                  </label>
                  <select
                    value={inquiryGuests}
                    onChange={(e) => setInquiryGuests(e.target.value)}
                    className="w-full bg-[#0d0b0a] border border-[#2a241f] focus:border-[#d4af37] rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors cursor-pointer"
                  >
                    <option value="10-25">10 to 25 Guests (Private Suite)</option>
                    <option value="25-50">25 to 50 Guests (Dawat Salon)</option>
                    <option value="50-100">50 to 100 Guests (Terrace &amp; Hall)</option>
                    <option value="100+">100 to 250+ Guests (Full Venue Buyout)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c5bcad] uppercase tracking-wider mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={inquiryDate}
                    onChange={(e) => setInquiryDate(e.target.value)}
                    className="w-full bg-[#0d0b0a] border border-[#2a241f] focus:border-[#d4af37] rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c5bcad] uppercase tracking-wider mb-2">
                  Event Category / Theme
                </label>
                <input
                  type="text"
                  value={inquiryCategory}
                  onChange={(e) => setInquiryCategory(e.target.value)}
                  placeholder="e.g. Wedding Reception, Corporate Dinner, Eid Dawat, Birthday Banquet"
                  className="w-full bg-[#0d0b0a] border border-[#2a241f] focus:border-[#d4af37] rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c5bcad] uppercase tracking-wider mb-2">
                  Special Notes &amp; Custom Menu Requests
                </label>
                <textarea
                  rows={3}
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  placeholder="Tell us about your required setup, dietary considerations (mutton vs chicken preferences, live charcoal stations), or decorative preferences..."
                  className="w-full bg-[#0d0b0a] border border-[#2a241f] focus:border-[#d4af37] rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-[11px] text-[#8c8273]">
                  All meat is 100% Halal and fresh. Executive valet included for private events.
                </p>

                <button
                  type="submit"
                  className="w-full sm:w-auto btn-gold px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Event Request
                </button>
              </div>
            </form>
          )}
          </div>
        </ScrollSideEntry>
      </section>
    </div>
  );
};
