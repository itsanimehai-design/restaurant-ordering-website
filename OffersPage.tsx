import React, { useState } from 'react';
import { PageId, OfferItem } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  ArrowRight, 
  MessageCircle, 
  Flame, 
  Gift
} from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { ScrollSideEntry } from '../components/ScrollSideEntry';
import { scrollToTop } from '../utils/smoothScroll';

interface OffersPageProps {
  onNavigate: (page: PageId) => void;
  onBack?: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onNavigate, onBack, onShowToast }) => {
  const { offers, config } = useRestaurantData();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code?: string) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    onShowToast('Promo Code Copied!', `Use code "${code}" when booking your table or presenting to your host.`, 'gold');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const activeOffers = offers.filter(o => o.isActive !== false);

  return (
    <div className="pt-24 pb-20 bg-[#0d0b0a] text-[#f5efe6] min-h-screen overflow-x-hidden">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#241e19] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#181310]/80 via-[#0d0b0a]/90 to-[#0d0b0a] pointer-events-none" />
        <div className="absolute -top-32 left-1/3 w-96 h-96 bg-[#c59b27]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top-Left Back Navigation */}
        <div className="relative max-w-5xl mx-auto mb-8">
          <BackButton onClick={onBack || (() => onNavigate('home'))} />
        </div>

        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="relative max-w-5xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1713] border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
              <Gift className="w-3.5 h-3.5" />
              Seasonal Privileges &amp; Curated Deals
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-[#fdfbf7] tracking-tight">
              Exclusive <span className="text-gradient-gold">Dining Privileges</span>
            </h1>

            <p className="text-base sm:text-lg text-[#c5bcad] max-w-3xl mx-auto font-light leading-relaxed">
              Experience our master charcoal gastronomy and fine Pakistani hospitality with curated banquets, weekday lunch dawats, and seasonal privileges.
            </p>
          </div>
        </ScrollSideEntry>
      </section>

      {/* Offers Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeOffers.map((offer, idx) => {
            const direction = idx % 2 === 0 ? 'left' : 'right';
            return (
              <ScrollSideEntry
                key={offer.id}
                direction={direction}
                delay={(idx % 2) * 0.12}
                className="h-full"
              >
                <div
                  className="group bg-[#15110e] border border-[#26201a] hover:border-[#d4af37]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl h-full"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#15110e] via-black/20 to-transparent" />

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#996e13] text-[#0d0b0a] font-extrabold text-xs tracking-wider uppercase shadow-lg flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {offer.discount}
                      </div>
                    </div>

                    {offer.code && (
                      <div className="absolute bottom-4 right-4 bg-[#0d0b0a]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#d4af37]/40 flex items-center gap-2">
                        <span className="text-[10px] uppercase text-[#8c8273] tracking-widest font-mono">CODE:</span>
                        <span className="text-xs font-bold font-mono text-[#d4af37]">{offer.code}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div>
                      <div className="flex items-center gap-4 text-xs text-[#8c8273] mb-2 font-mono">
                        <span className="flex items-center gap-1 text-[#d4af37]">
                          <Calendar className="w-3.5 h-3.5" />
                          {offer.startDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {offer.endDate}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-display font-bold text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors">
                        {offer.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#a69c8d] mt-2.5 leading-relaxed font-light">
                        {offer.description}
                      </p>

                      {offer.terms && (
                        <div className="mt-4 pt-3 border-t border-[#201a15] text-[11px] text-[#736a5c]">
                          <strong className="text-[#8c8273]">Terms:</strong> {offer.terms}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#221c17] flex flex-wrap items-center justify-between gap-3">
                      {offer.code ? (
                        <button
                          onClick={() => handleCopyCode(offer.code)}
                          className="px-4 py-2 rounded-lg bg-[#1e1814] hover:bg-[#2a221c] border border-[#d4af37]/30 text-xs font-bold text-[#d4af37] flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          {copiedCode === offer.code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Code Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Promo Code</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-[#8c8273]">No code required • Automatic benefit</span>
                      )}

                      <button
                        onClick={() => {
                          onNavigate('reservations');
                          scrollToTop();
                        }}
                        className="btn-gold px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        Claim at Table <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollSideEntry>
            );
          })}
        </div>
      </section>

      {/* Membership & VIP Dawat Privilege Banner */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="bg-gradient-to-br from-[#181310] via-[#120e0b] to-[#1a1410] border border-[#d4af37]/30 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#d4af37] font-bold">
                <Flame className="w-4 h-4" />
                VIP Dawat Circle
              </div>
              <h3 className="text-2xl font-display font-bold text-[#fdfbf7]">
                Are you planning a recurring corporate or family dawat?
              </h3>
              <p className="text-xs text-[#a69c8d] max-w-xl">
                Connect directly with our hospitality desk for personalized corporate billing, prioritized weekend seating, and customized banquet tasting sessions.
              </p>
            </div>

            <a
              href={`https://wa.me/${config.contact.whatsappClean}?text=${encodeURIComponent('Hello! I would like to inquire about joining the VIP Dawat Circle.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-6 py-3.5 rounded-xl bg-[#25d366]/15 hover:bg-[#25d366]/25 border border-[#25d366]/40 text-[#25d366] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp VIP Desk
            </a>
          </div>
        </ScrollSideEntry>
      </section>
    </div>
  );
};
