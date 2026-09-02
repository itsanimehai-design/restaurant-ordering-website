import React, { useState } from 'react';
import { PageId, ReservationRequest, MenuItem } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { SEATING_AREAS } from '../data/restaurantData';
import { 
  CalendarCheck, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Share2,
  Bike
} from 'lucide-react';
import { motion } from 'motion/react';
import { BackButton } from '../components/BackButton';
import { AiAssistantButton } from '../components/AiAssistantButton';
import { smoothScrollTo } from '../utils/smoothScroll';
import { ScrollSideEntry } from '../components/ScrollSideEntry';

interface ReservationsPageProps {
  onNavigate: (page: PageId) => void;
  onBack?: () => void;
  wishlistItems: MenuItem[];
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const ReservationsPage: React.FC<ReservationsPageProps> = ({
  onNavigate,
  onBack,
  wishlistItems,
  onShowToast,
}) => {
  const { config, formatPrice, openOrderModal } = useRestaurantData();

  // Booking Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState('hearth-main');
  const [occasion, setOccasion] = useState('Dinner & Gastronomy');
  const [specialRequests, setSpecialRequests] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationData, setConfirmationData] = useState<ReservationRequest | null>(null);

  const timeslots = [
    '12:00', '12:30', '13:00', '13:30', '14:00',
    '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const occasionsList = [
    'Dinner & Gastronomy',
    'Romantic Anniversary',
    'Birthday Celebration',
    'Executive Business Dinner',
    'Chef Omakase Tasting',
    'Private Milestone Dinner'
  ];

  const handleSubmitReservation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      onShowToast('Incomplete Reservation', 'Please provide your full name, phone number, and email address.', 'info');
      return;
    }

    setIsLoading(true);

    // Simulate luxury concierge processing
    setTimeout(() => {
      const generatedRef = `ES-${Math.floor(100000 + Math.random() * 900000)}`;
      const newReservation: ReservationRequest = {
        id: generatedRef,
        fullName,
        phone,
        email,
        date,
        time,
        guests,
        seatingArea,
        occasion,
        specialRequests,
        wishlistDishes: wishlistItems.map(d => d.name),
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConfirmationData(newReservation);
      setIsLoading(false);
      setIsConfirmed(true);
      smoothScrollTo(100);
      onShowToast('Table Reserved', `Reservation confirmation ${generatedRef} dispatched to your email.`, 'gold');
    }, 1200);
  };

  const handleDownloadCalendar = () => {
    if (!confirmationData) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Dining Reservation: ${config.name}
DESCRIPTION:Reservation Ref: ${confirmationData.id}\\nGuests: ${confirmationData.guests}\\nSeating: ${confirmationData.seatingArea}
LOCATION:${config.contact.city}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Reservation-${confirmationData.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Calendar Invite', 'Calendar event file downloaded.', 'success');
  };

  const selectedSeatingObj = SEATING_AREAS.find(s => s.id === seatingArea) || SEATING_AREAS[0];

  return (
    <div className="w-full pt-28 pb-24 bg-[#0d0b0a] min-h-screen text-[#f5efe6] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top-Left Back Navigation */}
        <div className="mb-6">
          <BackButton onClick={onBack || (() => onNavigate('home'))} />
        </div>

        {/* Page Header */}
        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181412] border border-[#d4af37]/40 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>{config.contact.city} Dining Table Reservations</span>
              </div>
              <AiAssistantButton
                context={{
                  section: 'reservations',
                  title: 'Table Reservations & Seating Options'
                }}
                variant="badge"
                label="Reservation AI"
                size="xs"
              />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#fdfbf7]">
              Reserve Your Experience
            </h1>
            <p className="text-sm sm:text-base text-[#c5bcad] leading-relaxed">
              Secure an evening at our hearth counters, intimate dining salon, or private family chamber. All reservations receive instant concierge confirmation.
            </p>
          </div>
        </ScrollSideEntry>

        {/* Confirmation State or Form Grid */}
        {isConfirmed && confirmationData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto bg-[#14110f] border border-[#d4af37] rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8"
          >
            <div className="text-center space-y-3 border-b border-[#26201a] pb-8">
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-bold block">
                Table Confirmed
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7]">
                We Look Forward to Welcoming You
              </h2>
              <p className="text-sm text-[#c5bcad] max-w-md mx-auto">
                Your reservation is secured under reference <strong className="text-[#d4af37] font-mono">{confirmationData.id}</strong>. A confirmation summary has been dispatched to {confirmationData.email}.
              </p>
            </div>

            {/* Summary Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#1a1613] border border-[#2e2620] text-center">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8c8275] block">Date</span>
                <span className="font-serif text-base font-bold text-[#fdfbf7]">{confirmationData.date}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8c8275] block">Time</span>
                <span className="font-serif text-base font-bold text-[#d4af37]">{confirmationData.time}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8c8275] block">Guests</span>
                <span className="font-serif text-base font-bold text-[#fdfbf7]">{confirmationData.guests} Diners</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8c8275] block">Ambiance</span>
                <span className="font-serif text-base font-bold text-[#d4af37] truncate block">{selectedSeatingObj.name}</span>
              </div>
            </div>

            {/* Attached Wishlist */}
            {confirmationData.wishlistDishes && confirmationData.wishlistDishes.length > 0 && (
              <div className="p-4 rounded-xl bg-[#171310] border border-[#2a221b]">
                <span className="text-xs uppercase tracking-wider text-[#d4af37] font-bold block mb-1">
                  Attached Tasting Dish Wishlist:
                </span>
                <p className="text-xs text-[#a89d8f]">
                  {confirmationData.wishlistDishes.join(' • ')}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={handleDownloadCalendar}
                className="w-full sm:w-auto btn-gold px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                Add to Calendar (.ics)
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="w-full sm:w-auto btn-outline-gold px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                Return to Homepage
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Form (8 cols) */}
            <div className="lg:col-span-8">
              <ScrollSideEntry direction="left" delay={0.15}>
                <div className="p-8 sm:p-10 rounded-3xl bg-[#14110f] border border-[#26201a] shadow-2xl">
                  <form onSubmit={handleSubmitReservation} className="space-y-8">
                    {/* Step 1: Party & Date Selection */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-xl font-semibold text-[#fdfbf7] flex items-center gap-2 border-b border-[#221c17] pb-3">
                        <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0d0b0a] text-xs font-bold flex items-center justify-center">1</span>
                        Party Size &amp; Date
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="block text-[#c5bcad] uppercase tracking-wider mb-2 font-medium">
                            Number of Guests *
                          </label>
                          <div className="flex items-center bg-[#1a1613] border border-[#2e2620] rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => setGuests(Math.max(1, guests - 1))}
                              className="w-10 h-10 rounded-lg bg-[#241d18] text-[#fdfbf7] font-bold hover:bg-[#332a22] cursor-pointer"
                            >
                              -
                            </button>
                            <span className="flex-1 text-center font-serif text-lg font-bold text-[#d4af37]">
                              {guests} {guests === 1 ? 'Guest' : 'Guests'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setGuests(Math.min(16, guests + 1))}
                              className="w-10 h-10 rounded-lg bg-[#241d18] text-[#fdfbf7] font-bold hover:bg-[#332a22] cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[#c5bcad] uppercase tracking-wider mb-2 font-medium">
                            Dining Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-sm text-[#fdfbf7] p-3 rounded-xl focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#c5bcad] uppercase tracking-wider mb-2 font-medium">
                            Dining Occasion
                          </label>
                          <select
                            value={occasion}
                            onChange={(e) => setOccasion(e.target.value)}
                            className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-sm text-[#fdfbf7] p-3 rounded-xl focus:outline-none cursor-pointer"
                          >
                            {occasionsList.map((occ) => (
                              <option key={occ} value={occ} className="bg-[#14110f] text-[#fdfbf7]">
                                {occ}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Timeslot Selection Pills */}
                      <div>
                        <label className="block text-[#c5bcad] uppercase tracking-wider mb-2 font-medium text-xs">
                          Select Available Time Slot *
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                          {timeslots.map((slot) => {
                            const isSelected = time === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setTime(slot)}
                                className={`py-2 rounded-lg text-xs font-semibold tracking-wider transition-all border cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#d4af37] text-[#0d0b0a] border-[#d4af37] shadow-md shadow-[#d4af37]/20 font-bold'
                                    : 'bg-[#1a1613] border-[#2e2620] text-[#a89d8f] hover:border-[#d4af37]/40 hover:text-[#fdfbf7]'
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Seating Area Selection */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-xl font-semibold text-[#fdfbf7] flex items-center gap-2 border-b border-[#221c17] pb-3">
                        <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0d0b0a] text-xs font-bold flex items-center justify-center">2</span>
                        Select Preferred Seating Atmosphere
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {SEATING_AREAS.map((area) => {
                          const isSelected = seatingArea === area.id;
                          const isDelivery = area.id === 'home-delivery';
                          return (
                            <motion.div
                              key={area.id}
                              whileHover={{ y: -3 }}
                              transition={{ duration: 0.2 }}
                              onClick={() => setSeatingArea(area.id)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                                isSelected
                                  ? 'bg-[#1e1814] border-[#d4af37] shadow-xl shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
                                  : 'bg-[#171412] border-[#26201a] hover:border-[#3d3228]'
                              } ${isDelivery ? 'bg-gradient-to-b from-[#1c140d] to-[#120e0b] border-[#d4af37]/40' : ''}`}
                            >
                              {isDelivery && (
                                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/60 text-[#d4af37] text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                  <Bike className="w-2.5 h-2.5 animate-bounce" />
                                  <span>Doorstep</span>
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-3 mb-2.5">
                                  <div className="relative shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-[#2a221b]">
                                    <img
                                      src={area.image}
                                      alt={area.name}
                                      className="w-full h-full object-cover"
                                    />
                                    {isDelivery && (
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <Bike className="w-5 h-5 text-[#d4af37]" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-serif text-base font-semibold text-[#fdfbf7]">
                                      {area.name}
                                    </h4>
                                    <span className="text-[11px] text-[#d4af37] font-medium block">
                                      {area.capacity}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-[#9d9385] leading-relaxed">
                                  {area.description}
                                </p>
                              </div>

                              {isDelivery && (
                                <div className="mt-3 pt-2 border-t border-[#261f18]">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openOrderModal('delivery');
                                    }}
                                    className="w-full py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-amber-500 text-black text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 cursor-pointer"
                                  >
                                    <Bike className="w-3 h-3" />
                                    <span>Order Online Now</span>
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 3: Guest Information */}
                    <div className="space-y-4">
                      <h3 className="font-serif text-xl font-semibold text-[#fdfbf7] flex items-center gap-2 border-b border-[#221c17] pb-3">
                        <span className="w-6 h-6 rounded-full bg-[#d4af37] text-[#0d0b0a] text-xs font-bold flex items-center justify-center">3</span>
                        Primary Guest &amp; Dietary Notes
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="block text-[#c5bcad] uppercase tracking-wider mb-1 font-medium">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Eleanor Vance"
                            className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-sm text-[#fdfbf7] p-3 rounded-xl focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#c5bcad] uppercase tracking-wider mb-1 font-medium">
                            Contact Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. +92 300 1234567"
                            className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-sm text-[#fdfbf7] p-3 rounded-xl focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[#c5bcad] uppercase tracking-wider mb-1 font-medium">
                            Email Confirmation *
                          </label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. eleanor@vance.com"
                            className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-sm text-[#fdfbf7] p-3 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#c5bcad] uppercase tracking-wider mb-1 font-medium text-xs">
                          Dietary Requirements, Allergies &amp; Special Requests
                        </label>
                        <textarea
                          rows={3}
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          placeholder="Please state any severe allergies (e.g. shellfish, nuts, celiac) or table preferences for the host."
                          className="w-full bg-[#1a1613] border border-[#2e2620] focus:border-[#d4af37] text-sm text-[#fdfbf7] p-3 rounded-xl focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full btn-gold py-4 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-2xl cursor-pointer"
                    >
                      {isLoading ? (
                        <span>Securing Table With Concierge...</span>
                      ) : (
                        <>
                          <CalendarCheck className="w-4 h-4" />
                          Complete Table Reservation
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </ScrollSideEntry>
            </div>

            {/* Sidebar Summary & Policies (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <ScrollSideEntry direction="right" delay={0.2}>
                {/* Dynamic Live Reservation Summary */}
                <div className="p-6 rounded-3xl bg-[#14110f] border border-[#26201a] space-y-4">
                  <h4 className="font-serif text-xl font-semibold text-[#fdfbf7] border-b border-[#221c17] pb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    Reservation Overview
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#1c1814]">
                      <span className="text-[#8c8275]">Party Size:</span>
                      <span className="font-semibold text-[#fdfbf7]">{guests} Guests</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1c1814]">
                      <span className="text-[#8c8275]">Date &amp; Time:</span>
                      <span className="font-semibold text-[#fdfbf7]">{date} at {time}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1c1814]">
                      <span className="text-[#8c8275]">Ambiance:</span>
                      <span className="font-semibold text-[#d4af37]">{selectedSeatingObj.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1c1814]">
                      <span className="text-[#8c8275]">Occasion:</span>
                      <span className="font-semibold text-[#fdfbf7]">{occasion}</span>
                    </div>
                  </div>

                  {/* Wishlist Attachment preview */}
                  {wishlistItems.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold block mb-1.5">
                        Attached Dish Wishlist ({wishlistItems.length}):
                      </span>
                      <div className="space-y-1">
                        {wishlistItems.map((item) => (
                          <div key={item.id} className="text-xs text-[#c5bcad] flex items-center justify-between">
                            <span className="truncate">{item.name}</span>
                            <span className="text-[#d4af37] font-serif">{formatPrice(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking Policy Info Card */}
                <div className="mt-6 p-6 rounded-3xl bg-[#14110f] border border-[#26201a] space-y-3 text-xs text-[#9d9385]">
                  <h5 className="font-serif text-base font-semibold text-[#fdfbf7] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                    Dining Notes &amp; Policies
                  </h5>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Tables are allocated for 2 hours for parties of up to 4; 2.5 hours for larger groups.</li>
                    <li>Smart casual dress code is politely requested.</li>
                    <li>Cancellations within 24 hours may incur a courtesy charge.</li>
                    <li>Complimentary valet available at our {config.contact.city} entrance.</li>
                  </ul>
                </div>
              </ScrollSideEntry>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
