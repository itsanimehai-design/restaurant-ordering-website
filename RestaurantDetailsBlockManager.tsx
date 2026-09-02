import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { SubtleGlowingHeading } from '../SubtleGlowingHeading';
import { CustomRestaurantDetailItem } from '../../types';
import { 
  Building2, 
  Sparkles, 
  Flame, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Mail, 
  CalendarCheck, 
  Truck, 
  Award, 
  ShieldCheck, 
  Users, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Eye, 
  EyeOff, 
  Utensils, 
  HelpCircle,
  Layers,
  Save,
  RotateCcw
} from 'lucide-react';

interface RestaurantDetailsBlockManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const RestaurantDetailsBlockManager: React.FC<RestaurantDetailsBlockManagerProps> = ({ onShowToast }) => {
  const { 
    config, 
    updateConfig, 
    updateDetailsBlock, 
    addCustomDetail, 
    updateCustomDetail, 
    deleteCustomDetail, 
    reorderCustomDetails 
  } = useRestaurantData();

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

  const [headingText, setHeadingText] = useState(detailsBlock.heading || 'Where Gastronomy Meets Soul, Craft & Heritage');
  const [eyebrowText, setEyebrowText] = useState(detailsBlock.eyebrow || 'Restaurant Overview & Culinary Heritage');
  const [subheadingText, setSubheadingText] = useState(detailsBlock.subheading || '');
  const [cuisineTypeText, setCuisineTypeText] = useState(detailsBlock.cuisineType || config.storyDetails?.cuisineType || 'Pakistani Hearth Fine Dining & Charcoal Specialities');
  const [reservationNotes, setReservationNotes] = useState(detailsBlock.reservationNotes || '');
  const [deliveryNotes, setDeliveryNotes] = useState(detailsBlock.deliveryNotes || '');

  // Core restaurant info form state
  const [restaurantName, setRestaurantName] = useState(config.name || '');
  const [tagline, setTagline] = useState(config.tagline || '');
  const [aboutText, setAboutText] = useState(config.aboutText || '');
  const [address, setAddress] = useState(config.contact?.address || '');
  const [city, setCity] = useState(config.contact?.city || '');
  const [phone, setPhone] = useState(config.contact?.phone || '');
  const [whatsapp, setWhatsapp] = useState(config.contact?.whatsapp || '');
  const [email, setEmail] = useState(config.contact?.email || '');
  const [seatingCapacity, setSeatingCapacity] = useState(config.storyDetails?.seatingCapacity || '160 Guests');

  // New custom detail modal/inline form
  const [isAddingDetail, setIsAddingDetail] = useState(false);
  const [newDetailLabel, setNewDetailLabel] = useState('');
  const [newDetailValue, setNewDetailValue] = useState('');
  const [newDetailIcon, setNewDetailIcon] = useState<CustomRestaurantDetailItem['icon']>('flame');
  const [newDetailCategory, setNewDetailCategory] = useState<CustomRestaurantDetailItem['category']>('dining');

  const headingPresets = [
    "About Our Restaurant",
    "Our Story",
    "Welcome to Our Restaurant",
    "Experience Great Food",
    "Where Gastronomy Meets Soul, Craft & Heritage",
    "The Hearth of Authentic Pakistani Cuisine"
  ];

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // 1. Update Details Block
    updateDetailsBlock({
      eyebrow: eyebrowText,
      heading: headingText,
      subheading: subheadingText,
      cuisineType: cuisineTypeText,
      reservationNotes: reservationNotes,
      deliveryNotes: deliveryNotes
    });

    // 2. Update Global Restaurant Config
    updateConfig({
      name: restaurantName,
      tagline: tagline,
      aboutText: aboutText,
      contact: {
        ...config.contact,
        address: address,
        city: city,
        phone: phone,
        phoneClean: phone.replace(/[^0-9+]/g, ''),
        whatsapp: whatsapp,
        whatsappClean: whatsapp.replace(/[^0-9]/g, ''),
        email: email
      },
      storyDetails: {
        ...(config.storyDetails || {
          heroTitle: '',
          heroSubtitle: '',
          storyChapter1Title: '',
          storyChapter1Content: '',
          storyChapter2Title: '',
          storyChapter2Content: '',
          culinaryPhilosophy: '',
          cuisineType: '',
          amenities: [],
          seatingCapacity: '',
          seatingDescription: '',
          reservationNotice: '',
          coverImage: '',
          interiorImage: '',
          hearthImage: ''
        }),
        cuisineType: cuisineTypeText,
        seatingCapacity: seatingCapacity
      }
    });

    onShowToast('Details Block Saved', 'Restaurant details and glowing heading updated successfully.', 'gold');
  };

  const handleCreateCustomDetail = () => {
    if (!newDetailLabel.trim() || !newDetailValue.trim()) {
      onShowToast('Missing Fields', 'Please provide both label and value for the highlight.', 'info');
      return;
    }

    addCustomDetail({
      label: newDetailLabel.trim(),
      value: newDetailValue.trim(),
      icon: newDetailIcon,
      category: newDetailCategory,
      order: (detailsBlock.customDetails || []).length + 1,
      isPublished: true
    });

    setNewDetailLabel('');
    setNewDetailValue('');
    setIsAddingDetail(false);
    onShowToast('Highlight Added', 'New restaurant detail item created.', 'success');
  };

  const customDetails = detailsBlock.customDetails || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Top Banner & Description */}
      <div className="p-6 rounded-3xl bg-[#14110f] border border-[#2d241d] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#fdfbf7]">
                Restaurant Details &amp; Typography Block
              </h2>
              <p className="text-xs text-[#a89d8d]">
                Customize your public restaurant information section, glowing headings, service cards, and amenities.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#d4af37]/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Details</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          1. SECTION HEADING & GLOWING TITLE CUSTOMIZER
          ══════════════════════════════════════════════════════════════ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14110f] border border-[#2d241d] space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5 text-[#d4af37]">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-serif text-lg font-bold text-[#fdfbf7]">
              1. Editable Heading &amp; Subtle Glow Effect
            </h3>
          </div>
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#1c1612] border border-[#d4af37]/30 text-[#d4af37]">
            95% Stable + 5% Light Motion
          </span>
        </div>

        {/* Live Preview Box */}
        <div className="p-6 rounded-2xl bg-[#0d0b0a] border border-[#2d241d] text-center space-y-3 relative overflow-hidden">
          <div className="absolute top-2 right-3 text-[10px] uppercase font-bold tracking-wider text-[#d4af37]/60">
            Live Preview
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1612] border border-[#d4af37]/35 text-[#d4af37] text-[11px] font-semibold uppercase tracking-widest">
            <Flame className="w-3 h-3 text-[#d4af37]" />
            <span>{eyebrowText || 'Restaurant Overview'}</span>
          </div>

          <div className="py-1">
            <SubtleGlowingHeading
              text={headingText || 'About Our Restaurant'}
              as="h2"
              className="text-2xl sm:text-3xl md:text-4xl text-[#fdfbf7]"
            />
          </div>

          <p className="text-xs text-[#c5bcad] max-w-xl mx-auto italic">
            {subheadingText || tagline || 'A refined dining experience where fire, flavour and craftsmanship come together.'}
          </p>
        </div>

        {/* Heading Quick Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89d8d]">
            Quick Heading Presets (Click to apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {headingPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setHeadingText(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                  headingText === preset
                    ? 'bg-[#d4af37] text-[#0d0b0a] font-bold shadow-md'
                    : 'bg-[#1a1512] text-[#c5bcad] border border-white/10 hover:border-[#d4af37]/40'
                }`}
              >
                "{preset}"
              </button>
            ))}
          </div>
        </div>

        {/* Heading Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-1.5">
              Section Eyebrow Text
            </label>
            <input
              type="text"
              value={eyebrowText}
              onChange={(e) => setEyebrowText(e.target.value)}
              placeholder="e.g. Restaurant Overview & Culinary Heritage"
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-1.5">
              Main Section Heading (Supports Organic Micro-Motion)
            </label>
            <input
              type="text"
              value={headingText}
              onChange={(e) => setHeadingText(e.target.value)}
              placeholder="e.g. About Our Restaurant"
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-serif text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#d4af37] mb-1.5">
              Section Subtitle / Tagline Description
            </label>
            <input
              type="text"
              value={subheadingText}
              onChange={(e) => setSubheadingText(e.target.value)}
              placeholder="e.g. A tribute to the ancient mastery of open-wood fire cooking and warm Pakistani hospitality."
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. CORE RESTAURANT IDENTITY & ABOUT STORY
          ══════════════════════════════════════════════════════════════ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14110f] border border-[#2d241d] space-y-6">
        <div className="flex items-center gap-2.5 text-[#d4af37] border-b border-white/5 pb-4">
          <Building2 className="w-5 h-5 text-[#d4af37]" />
          <h3 className="font-serif text-lg font-bold text-[#fdfbf7]">
            2. Core Restaurant Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89d8d] mb-1.5">
              Restaurant Name
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89d8d] mb-1.5">
              Short Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89d8d] mb-1.5">
              Cuisine Type &amp; Culinary Character
            </label>
            <input
              type="text"
              value={cuisineTypeText}
              onChange={(e) => setCuisineTypeText(e.target.value)}
              placeholder="e.g. Pakistani Hearth Fine Dining & Charcoal Specialities"
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89d8d] mb-1.5">
              Restaurant Description / About Paragraph
            </label>
            <textarea
              rows={4}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl p-3.5 text-xs text-white outline-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. LOCATION & CONTACT INFORMATION
          ══════════════════════════════════════════════════════════════ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14110f] border border-[#2d241d] space-y-6">
        <div className="flex items-center gap-2.5 text-[#d4af37] border-b border-white/5 pb-4">
          <MapPin className="w-5 h-5 text-[#d4af37]" />
          <h3 className="font-serif text-lg font-bold text-[#fdfbf7]">
            3. Location &amp; Contact Details
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89d8d] mb-1.5">
              Street Address / Landmark
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89d8d] mb-1.5">
              City / State / Country
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89d8d] mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89d8d] mb-1.5">
              WhatsApp Number (Format: 923001234567)
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89d8d] mb-1.5">
              Contact Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. RESERVATION & DELIVERY INFORMATION
          ══════════════════════════════════════════════════════════════ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14110f] border border-[#2d241d] space-y-6">
        <div className="flex items-center gap-2.5 text-[#d4af37] border-b border-white/5 pb-4">
          <CalendarCheck className="w-5 h-5 text-[#d4af37]" />
          <h3 className="font-serif text-lg font-bold text-[#fdfbf7]">
            4. Reservation &amp; Delivery Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89d8d] mb-1.5">
              Seating Capacity
            </label>
            <input
              type="text"
              value={seatingCapacity}
              onChange={(e) => setSeatingCapacity(e.target.value)}
              placeholder="e.g. 160 Guests"
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89d8d] mb-1.5">
              Reservation Notice &amp; Notes
            </label>
            <input
              type="text"
              value={reservationNotes}
              onChange={(e) => setReservationNotes(e.target.value)}
              placeholder="e.g. Advance booking recommended for dinner seatings."
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89d8d] mb-1.5">
              Delivery Quality &amp; Packaging Notes
            </label>
            <input
              type="text"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="e.g. Temperature-sealed insulated packaging ensuring sizzling hearth quality."
              className="w-full bg-[#1a1512] border border-white/10 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          5. CUSTOM RESTAURANT DETAILS & HIGHLIGHTS (Add/Remove/Reorder)
          ══════════════════════════════════════════════════════════════ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14110f] border border-[#2d241d] space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5 text-[#d4af37]">
            <Layers className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-serif text-lg font-bold text-[#fdfbf7]">
              5. Custom Restaurant Details &amp; Highlights ({customDetails.length})
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingDetail(true)}
            className="btn-gold px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Detail</span>
          </button>
        </div>

        {/* Add Detail Inline Card */}
        {isAddingDetail && (
          <div className="p-5 rounded-2xl bg-[#1a1512] border border-[#d4af37]/40 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Create New Restaurant Highlight</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#a89d8d] mb-1">
                  Highlight Title
                </label>
                <input
                  type="text"
                  value={newDetailLabel}
                  onChange={(e) => setNewDetailLabel(e.target.value)}
                  placeholder="e.g. Valet Parking & Concierge"
                  className="w-full bg-[#14110f] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#a89d8d] mb-1">
                  Icon
                </label>
                <select
                  value={newDetailIcon}
                  onChange={(e) => setNewDetailIcon(e.target.value as any)}
                  className="w-full bg-[#14110f] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="flame">Flame (Live Hearth)</option>
                  <option value="sparkles">Sparkles (Spices / Signature)</option>
                  <option value="shield-check">Shield Check (Halal / Quality)</option>
                  <option value="award">Award (VIP / Luxury)</option>
                  <option value="users">Users (Family / Capacity)</option>
                  <option value="utensils">Utensils (Dining / Chef)</option>
                  <option value="map-pin">Map Pin (Location)</option>
                  <option value="truck">Truck (Delivery)</option>
                  <option value="clock">Clock (Timing)</option>
                  <option value="star">Star (Rating)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-[#a89d8d] mb-1">
                  Highlight Description / Value
                </label>
                <input
                  type="text"
                  value={newDetailValue}
                  onChange={(e) => setNewDetailValue(e.target.value)}
                  placeholder="e.g. Complimentary valet parking service for all dining and event guests."
                  className="w-full bg-[#14110f] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAddingDetail(false)}
                className="px-4 py-1.5 rounded-lg border border-white/10 text-xs text-[#a89d8d] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCustomDetail}
                className="btn-gold px-5 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              >
                Add Highlight
              </button>
            </div>
          </div>
        )}

        {/* Existing Custom Details List */}
        <div className="space-y-3">
          {customDetails.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#1a1512] border border-dashed border-white/10 space-y-2">
              <p className="text-xs text-[#a89d8d]">No custom highlights added yet.</p>
              <button
                type="button"
                onClick={() => setIsAddingDetail(true)}
                className="text-xs text-[#d4af37] font-semibold hover:underline"
              >
                + Add your first restaurant highlight
              </button>
            </div>
          ) : (
            customDetails.map((detail, idx) => (
              <div 
                key={detail.id}
                className="p-4 rounded-2xl bg-[#1a1512] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#d4af37]/30 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#fdfbf7]">{detail.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#14110f] border border-white/10 text-[#d4af37]">
                      {detail.icon || 'info'}
                    </span>
                  </div>
                  <p className="text-xs text-[#a89d8d]">{detail.value}</p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* Reorder Up */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => reorderCustomDetails(idx, idx - 1)}
                    className="p-1.5 rounded-lg bg-[#14110f] border border-white/10 text-[#a89d8d] hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Reorder Down */}
                  <button
                    type="button"
                    disabled={idx === customDetails.length - 1}
                    onClick={() => reorderCustomDetails(idx, idx + 1)}
                    className="p-1.5 rounded-lg bg-[#14110f] border border-white/10 text-[#a89d8d] hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    type="button"
                    onClick={() => updateCustomDetail(detail.id, { isPublished: !detail.isPublished })}
                    className={`p-1.5 rounded-lg border cursor-pointer ${
                      detail.isPublished !== false 
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
                        : 'bg-zinc-900 border-white/10 text-zinc-500'
                    }`}
                    title={detail.isPublished !== false ? 'Published' : 'Hidden'}
                  >
                    {detail.isPublished !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => {
                      deleteCustomDetail(detail.id);
                      onShowToast('Highlight Removed', 'Custom restaurant detail removed.', 'info');
                    }}
                    className="p-1.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-400 hover:bg-rose-900/50 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Save All Details Bottom Bar */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={() => handleSaveAll()}
          className="btn-gold px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#d4af37]/20 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Save All Restaurant Details</span>
        </button>
      </div>

    </div>
  );
};
