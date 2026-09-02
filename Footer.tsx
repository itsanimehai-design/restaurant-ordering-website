import React, { useState } from 'react';
import { PageId } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { Flame, Mail, Phone, MapPin, Clock, Send, ArrowUpRight, Award, Check, Lock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
  onOpenOwnerLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onShowToast, onOpenOwnerLogin }) => {
  const { config, ownerSession, isOwnerMode, toggleOwnerMode } = useRestaurantData();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      onShowToast('Invalid Email', 'Please enter a valid email address.', 'info');
      return;
    }
    setSubscribed(true);
    onShowToast('Welcome to the Epicurean Club', 'You will receive seasonal tasting menus and private tasting invitations.', 'gold');
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#080706] text-[#c5bcad] border-t border-[#221c17] relative z-10">
      {/* Top Banner / Accreditation Ribbon */}
      <div className="border-b border-[#1c1814] bg-[#0c0a09]/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs tracking-wider uppercase">
          <div className="flex items-center gap-2 text-[#d4af37]">
            <Award className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{config.michelinGuide}</span>
            <span className="text-[#594f45]">•</span>
            <span className="text-[#a89d8f]">{config.awards[0]}</span>
          </div>
          <div className="flex items-center gap-6 text-[#8c8275]">
            <span className="hidden sm:inline">Complimentary Valet from 5:00 PM</span>
            <button
              onClick={() => onNavigate('reservations')}
              className="text-[#d4af37] hover:text-[#fdfbf7] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              Book Ahead (60-Day Window)
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              {/* Perfectly Circular / Round Logo Container */}
              <div className="w-11 h-11 rounded-full aspect-square bg-gradient-to-br from-[#d4af37] via-[#f59e0b] to-[#8c5e10] p-[1.5px] shadow-lg shadow-[#d4af37]/30 shrink-0 overflow-hidden">
                <div className="w-full h-full bg-[#120f0d] rounded-full flex items-center justify-center overflow-hidden">
                  {config.branding?.logoImage ? (
                    <img 
                      src={config.branding.logoImage} 
                      alt={config.name} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Flame className="w-5 h-5 text-[#d4af37]" />
                  )}
                </div>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-[0.18em] text-[#fdfbf7] uppercase block">
                  {config.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] block font-sans">
                  Fine Dining &amp; Hearth
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#a89d8f] leading-relaxed">
              {config.aboutText}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {config.social.instagram && (
                <a
                  href={config.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#14110f] border border-[#2a241f] flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0b0a] transition-all text-xs font-bold"
                  aria-label="Instagram"
                >
                  IG
                </a>
              )}
              {config.social.facebook && (
                <a
                  href={config.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#14110f] border border-[#2a241f] flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0b0a] transition-all text-xs font-bold"
                  aria-label="Facebook"
                >
                  FB
                </a>
              )}
              {config.social.tripadvisor && (
                <a
                  href={config.social.tripadvisor}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#14110f] border border-[#2a241f] flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0b0a] transition-all text-xs font-bold"
                  aria-label="TripAdvisor"
                >
                  TA
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#fdfbf7] font-semibold border-b border-[#221c17] pb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#a89d8f]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Home Experience
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  A La Carte &amp; Karahi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-[#4ade80] text-emerald-400/90 transition-colors cursor-pointer font-medium">
                  🥤 Soft Drinks (100% Halal)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('chefs')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Our Chefs &amp; Masters
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('offers')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Exclusive Offers &amp; Deals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('events')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Bespoke Banquets &amp; Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Our Culinary Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Atmosphere &amp; Dishes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reviews')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Patron Reviews
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reservations')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Table Reservations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#d4af37] transition-colors cursor-pointer">
                  Location &amp; Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Hours Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#fdfbf7] font-semibold border-b border-[#221c17] pb-2">
              Service Hours
            </h4>
            <div className="space-y-3 text-xs text-[#a89d8f]">
              {config.hours.map((schedule, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[#d4af37] font-semibold block">{schedule.days}</span>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8c8275]">Lunch:</span>
                    <span>{schedule.lunch}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8c8275]">Dinner:</span>
                    <span>{schedule.dinner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#fdfbf7] font-semibold border-b border-[#221c17] pb-2">
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs text-[#a89d8f]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span className="font-medium text-[#e2d9cc]">{config.contact.city}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`tel:${config.contact.phoneClean}`} className="hover:text-[#d4af37] transition-colors">
                  {config.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`mailto:${config.contact.email}`} className="hover:text-[#d4af37] transition-colors">
                  {config.contact.email}
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold block mb-2">
                Private Cellar Dispatch
              </span>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter guest email..."
                  className="flex-1 bg-[#14110f] border border-[#2a241f] focus:border-[#d4af37] rounded-lg px-3 py-2 text-xs text-[#fdfbf7] placeholder-[#665c52] outline-none"
                />
                <button
                  type="submit"
                  className="btn-gold px-3.5 py-2 rounded-lg text-xs font-bold shrink-0 flex items-center justify-center cursor-pointer"
                  aria-label="Subscribe"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Discreet Owner Access Bar */}
        <div className="border-t border-[#1c1814] mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7a7063]">
          <div className="flex flex-wrap items-center gap-4 text-center sm:text-left">
            <span>
              &copy; {new Date().getFullYear()} {config.legalName}. All rights reserved.
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Crafted by {config.agencyCredit.name}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {ownerSession ? (
              <button
                onClick={() => toggleOwnerMode(true)}
                className="text-[#d4af37] hover:text-white flex items-center gap-1 font-bold transition-colors cursor-pointer bg-[#d4af37]/10 px-2.5 py-1 rounded-lg border border-[#d4af37]/30"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Owner Dashboard</span>
              </button>
            ) : (
              <button
                onClick={onOpenOwnerLogin}
                className="text-[#665c52] hover:text-[#d4af37] flex items-center gap-1 transition-colors cursor-pointer py-1"
                title="Restaurant Owner CMS Portal"
              >
                <Lock className="w-3 h-3 text-[#594f45]" />
                <span>Owner Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
