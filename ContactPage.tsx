import React, { useState } from 'react';
import { PageId } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { FAQS } from '../data/restaurantData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  ChevronDown, 
  MessageSquare, 
  Car, 
  Train,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BackButton } from '../components/BackButton';
import { ScrollSideEntry } from '../components/ScrollSideEntry';

interface ContactPageProps {
  onNavigate: (page: PageId) => void;
  onBack?: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  onBack,
  onShowToast,
}) => {
  const { config } = useRestaurantData();
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('Private Dining & Buyout Inquiry');
  const [formMessage, setFormMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mapMode, setMapMode] = useState<'valet' | 'transit'>('valet');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) {
      onShowToast('Missing Fields', 'Please complete all required fields.', 'info');
      return;
    }

    setIsSent(true);
    onShowToast('Inquiry Dispatched', `Our ${config.contact.city} events concierge will contact you within 24 hours.`, 'gold');
    setTimeout(() => {
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormMessage('');
      setIsSent(false);
    }, 4000);
  };

  return (
    <div className="w-full pt-28 pb-24 bg-[#0d0b0a] min-h-screen text-[#f5efe6] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top-Left Back Navigation */}
        <div className="mb-6">
          <BackButton onClick={onBack || (() => onNavigate('home'))} />
        </div>

        {/* Header */}
        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181412] border border-[#d4af37]/40 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>📍 {config.contact.city} • Concierge Desk</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#fdfbf7]">
              Connect With The Hearth
            </h1>
            <p className="text-sm sm:text-base text-[#c5bcad] leading-relaxed">
              For table reservations, exclusive private cellar buyouts, bespoke corporate banquets, or inquiries, our concierge team is at your disposal.
            </p>
          </div>
        </ScrollSideEntry>

        {/* 4 Direct Contact Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Direct Phone */}
          <ScrollSideEntry direction="left" delay={0.05} className="h-full">
            <div className="p-6 rounded-2xl bg-[#14110f] border border-[#26201a] flex flex-col justify-between space-y-4 hover:border-[#d4af37]/40 transition-colors h-full">
              <div className="w-10 h-10 rounded-xl bg-[#1f1a16] border border-[#332a22] flex items-center justify-center text-[#d4af37]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#8c8275] block">
                  Direct Line
                </span>
                <h4 className="font-serif text-lg font-semibold text-[#fdfbf7] mt-0.5">
                  Hostess Concierge
                </h4>
                <a
                  href={`tel:${config.contact.phoneClean}`}
                  className="text-xs text-[#d4af37] hover:underline font-semibold block mt-1"
                >
                  {config.contact.phone}
                </a>
              </div>
            </div>
          </ScrollSideEntry>

          {/* WhatsApp */}
          <ScrollSideEntry direction="left" delay={0.12} className="h-full">
            <div className="p-6 rounded-2xl bg-[#14110f] border border-[#26201a] flex flex-col justify-between space-y-4 hover:border-[#25D366]/40 transition-colors h-full">
              <div className="w-10 h-10 rounded-xl bg-[#1f1a16] border border-[#332a22] flex items-center justify-center text-[#25D366]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#8c8275] block">
                  Instant Chat
                </span>
                <h4 className="font-serif text-lg font-semibold text-[#fdfbf7] mt-0.5">
                  WhatsApp Concierge
                </h4>
                <a
                  href={`https://wa.me/${config.contact.whatsappClean}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#25D366] hover:underline font-semibold block mt-1"
                >
                  {config.contact.whatsapp}
                </a>
              </div>
            </div>
          </ScrollSideEntry>

          {/* Email */}
          <ScrollSideEntry direction="right" delay={0.12} className="h-full">
            <div className="p-6 rounded-2xl bg-[#14110f] border border-[#26201a] flex flex-col justify-between space-y-4 hover:border-[#d4af37]/40 transition-colors h-full">
              <div className="w-10 h-10 rounded-xl bg-[#1f1a16] border border-[#332a22] flex items-center justify-center text-[#d4af37]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#8c8275] block">
                  Email Desk
                </span>
                <h4 className="font-serif text-lg font-semibold text-[#fdfbf7] mt-0.5">
                  Private Inquiries
                </h4>
                <a
                  href={`mailto:${config.contact.email}`}
                  className="text-xs text-[#d4af37] hover:underline font-semibold block mt-1 truncate"
                >
                  {config.contact.email}
                </a>
              </div>
            </div>
          </ScrollSideEntry>

          {/* Location */}
          <ScrollSideEntry direction="right" delay={0.05} className="h-full">
            <div className="p-6 rounded-2xl bg-[#14110f] border border-[#26201a] flex flex-col justify-between space-y-4 hover:border-[#d4af37]/40 transition-colors h-full">
              <div className="w-10 h-10 rounded-xl bg-[#1f1a16] border border-[#332a22] flex items-center justify-center text-[#d4af37]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#8c8275] block">
                  Location
                </span>
                <h4 className="font-serif text-lg font-semibold text-[#fdfbf7] mt-0.5">
                  📍 {config.contact.city}
                </h4>
                <p className="text-xs text-[#a89d8f] mt-1">
                  Fine Dining Sanctuary
                </p>
              </div>
            </div>
          </ScrollSideEntry>
        </div>

        {/* Main Grid: Form + Interactive Map & Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          {/* Inquiry Form (7 cols) */}
          <ScrollSideEntry direction="left" delay={0.1} className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#14110f] border border-[#26201a] shadow-2xl h-full">
              <div className="mb-6 space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                  Event Inquiry &amp; General Messages
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#fdfbf7]">
                  Send a Message to Our Concierge
                </h3>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#c5bcad] uppercase tracking-wider mb-1 font-medium">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Tariq Khan"
                      className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-sm text-[#fdfbf7] p-3 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#c5bcad] uppercase tracking-wider mb-1 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="e.g. tariq@domain.com"
                      className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-sm text-[#fdfbf7] p-3 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#c5bcad] uppercase tracking-wider mb-1 font-medium">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. +92 300 1234567"
                      className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-sm text-[#fdfbf7] p-3 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#c5bcad] uppercase tracking-wider mb-1 font-medium">
                      Inquiry Nature
                    </label>
                    <select
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-sm text-[#fdfbf7] p-3 rounded-xl focus:outline-none"
                    >
                      <option value="Private Dining & Buyout Inquiry">Private Dining Chamber / Full Buyout</option>
                      <option value="Executive Sommelier Tasting">Executive Chef Tasting Menu</option>
                      <option value="Corporate Banquet">Corporate & VIP Banquet</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#c5bcad] uppercase tracking-wider mb-1 font-medium">
                    Your Message or Event Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Include approximate party size, target date, and any special dietary or seating requests..."
                    className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-sm text-[#fdfbf7] p-3 rounded-xl focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSent}
                  className="w-full btn-gold py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Message Sent
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Dispatch Inquiry
                    </>
                  )}
                </button>
              </form>
            </div>
          </ScrollSideEntry>

          {/* Interactive Location, Transport & Hours Card (5 cols) */}
          <ScrollSideEntry direction="right" delay={0.15} className="lg:col-span-5 space-y-6">
            {/* Map Card */}
            <div className="p-6 rounded-3xl bg-[#14110f] border border-[#26201a] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-lg font-semibold text-[#fdfbf7] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  <span>📍 {config.contact.city}</span>
                </h4>
                {/* Mode Toggle */}
                <div className="flex items-center gap-1 bg-[#1a1613] p-1 rounded-lg border border-[#2e2620]">
                  <button
                    onClick={() => setMapMode('valet')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      mapMode === 'valet' ? 'bg-[#d4af37] text-[#0d0b0a]' : 'text-[#8c8275]'
                    }`}
                  >
                    <Car className="w-3 h-3" /> Valet
                  </button>
                  <button
                    onClick={() => setMapMode('transit')}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      mapMode === 'transit' ? 'bg-[#d4af37] text-[#0d0b0a]' : 'text-[#8c8275]'
                    }`}
                  >
                    <Train className="w-3 h-3" /> Transit
                  </button>
                </div>
              </div>

              {/* Stylized Location Preview */}
              <div className="relative h-48 rounded-xl overflow-hidden bg-[#1c1714] border border-[#2e2620] p-4 flex flex-col justify-between">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:14px_14px]" />
                <div className="relative z-10 p-3 rounded-lg bg-[#0d0b0a]/90 backdrop-blur-sm border border-[#d4af37]/30 max-w-xs">
                  <p className="font-serif text-sm font-bold text-[#fdfbf7]">{config.name}</p>
                  <p className="text-xs text-[#e2d9cc] font-medium flex items-center gap-1 mt-0.5">
                    <span>📍</span> {config.contact.city}
                  </p>
                </div>

                <div className="relative z-10 text-[11px] text-[#d4af37] font-medium bg-[#0d0b0a]/90 p-2 rounded-lg border border-white/10">
                  {mapMode === 'valet' ? (
                    <span>🚗 Complimentary white-glove valet available on arrival.</span>
                  ) : (
                    <span>🚇 Central transit connections easily accessible.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Hours Summary Card */}
            <div className="p-6 rounded-3xl bg-[#14110f] border border-[#26201a] space-y-3">
              <h4 className="font-serif text-lg font-semibold text-[#fdfbf7] flex items-center gap-2 border-b border-[#221c17] pb-2">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                Operating Hours
              </h4>
              <div className="space-y-2 text-xs">
                {config.hours.map((h, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-[#1c1814] text-[#a89d8f]">
                    <span className="font-semibold text-[#fdfbf7]">{h.days}:</span>
                    <span className="text-[#d4af37]">{h.lunch} / {h.dinner}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollSideEntry>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          <ScrollSideEntry direction="left" delay={0.1}>
            <div className="text-center mb-8 space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Guest Inquiries
              </span>
              <h3 className="font-serif text-3xl text-[#fdfbf7]">
                Frequently Asked Questions
              </h3>
            </div>
          </ScrollSideEntry>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              const direction = idx % 2 === 0 ? 'left' : 'right';
              return (
                <ScrollSideEntry key={idx} direction={direction} delay={(idx % 4) * 0.08}>
                  <div
                    className="rounded-2xl bg-[#14110f] border border-[#26201a] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-[#fdfbf7] hover:text-[#d4af37] transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#d4af37] transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-5 pb-5 text-xs sm:text-sm text-[#a89d8f] leading-relaxed border-t border-[#1c1814] pt-3"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollSideEntry>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
