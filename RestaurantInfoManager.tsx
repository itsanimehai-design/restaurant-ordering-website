import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { 
  Building2, 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Share2, 
  Check, 
  Sparkles, 
  Palette,
  Truck,
  Image as ImageIcon,
  Flame,
  UtensilsCrossed,
  CupSoda,
  IceCream,
  Package,
  Layers,
  Upload
} from 'lucide-react';

interface RestaurantInfoManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const RestaurantInfoManager: React.FC<RestaurantInfoManagerProps> = ({ onShowToast }) => {
  const { config, updateConfig } = useRestaurantData();

  const [formData, setFormData] = useState({
    name: config.name || 'Ember & Spice',
    legalName: config.legalName || 'Ember & Spice Fine Dining',
    tagline: config.tagline || 'Bold Flavours. Unforgettable Moments.',
    subtitle: config.subtitle || 'A refined dining experience where fire, flavour and craftsmanship come together.',
    aboutText: config.aboutText || '',
    michelinGuide: config.michelinGuide || 'Culinary Excellence Recommended',
    currencyCode: config.currencyCode || 'PKR',
    currencySymbol: config.currencySymbol || '₨',
    branding: {
      heroHeadline: config.branding?.heroHeadline || 'Authentic Fire, Flavour & Charcoal Artistry',
      heroSubtitle: config.branding?.heroSubtitle || 'Hand-slaughtered grass-fed lamb, Shanwari Karahi, and copper-braised delicacies prepared over glowing binchotan embers.',
      primaryColor: config.branding?.primaryColor || '#d4af37',
      accentColor: config.branding?.accentColor || '#f97316',
      logoImage: config.branding?.logoImage || '',
      categoryVisuals: {
        food: config.branding?.categoryVisuals?.food || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        deals: config.branding?.categoryVisuals?.deals || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        drinks: config.branding?.categoryVisuals?.drinks || 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=80',
        desserts: config.branding?.categoryVisuals?.desserts || 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
      }
    },
    deliverySettings: {
      isEnabled: config.deliverySettings?.isEnabled !== false,
      deliveryFee: config.deliverySettings?.deliveryFee ?? 150,
      freeDeliveryThreshold: config.deliverySettings?.freeDeliveryThreshold ?? 2500,
      estimatedDeliveryMinutes: config.deliverySettings?.estimatedDeliveryMinutes || '35-45 mins',
      estimatedPickupMinutes: config.deliverySettings?.estimatedPickupMinutes || '20-25 mins',
      cancellationWindowSeconds: config.deliverySettings?.cancellationWindowSeconds ?? 180,
      minOrderAmount: config.deliverySettings?.minOrderAmount ?? 500
    },
    contact: {
      address: config.contact?.address || '',
      city: config.contact?.city || '',
      phone: config.contact?.phone || '',
      phoneClean: config.contact?.phoneClean || '',
      whatsapp: config.contact?.whatsapp || '',
      whatsappClean: config.contact?.whatsappClean || '',
      email: config.contact?.email || '',
      eventsEmail: config.contact?.eventsEmail || '',
      pressEmail: config.contact?.pressEmail || '',
    },
    social: {
      instagram: config.social?.instagram || '',
      facebook: config.social?.facebook || '',
      twitter: config.social?.twitter || '',
      tripadvisor: config.social?.tripadvisor || '',
      tiktok: config.social?.tiktok || ''
    },
    hours: config.hours ? config.hours.map(h => ({ ...h })) : [
      { days: 'Monday – Thursday', lunch: '12:30 PM – 3:30 PM', dinner: '6:30 PM – 11:30 PM' },
      { days: 'Friday', lunch: '1:30 PM – 4:00 PM', dinner: '6:30 PM – 12:30 AM' },
      { days: 'Saturday – Sunday', lunch: '12:30 PM – 4:00 PM', dinner: '6:30 PM – 12:30 AM' }
    ]
  });

  const handleHourChange = (index: number, field: 'days' | 'lunch' | 'dinner', value: string) => {
    setFormData(prev => {
      const updatedHours = [...prev.hours];
      updatedHours[index] = { ...updatedHours[index], [field]: value };
      return { ...prev, hours: updatedHours };
    });
  };

  const handleCategoryVisualUpload = (cat: 'food' | 'deals' | 'drinks' | 'desserts', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({
            ...prev,
            branding: {
              ...prev.branding,
              categoryVisuals: {
                ...prev.branding.categoryVisuals,
                [cat]: reader.result as string
              }
            }
          }));
          onShowToast('Image Uploaded', `${cat.toUpperCase()} category visual loaded.`, 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    onShowToast('Restaurant Info & Settings Saved', 'Brand identity, category visuals, delivery rules, and contact info updated live.', 'success');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#14110F] p-5 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#C5A059]" />
            Restaurant Details &amp; Operational Controls
          </h2>
          <p className="text-xs text-[#D6CEBF] mt-1">
            Complete owner control over restaurant name, branding, circular category visuals, delivery rates, contact info, and opening hours.
          </p>
        </div>

        <button
          type="submit"
          className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-[#C5A059]/20 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          Save Live Settings
        </button>
      </div>

      {/* 1. Brand Identity & Colors */}
      <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-display font-semibold text-[#C5A059] uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          1. Brand Identity, Colors &amp; Currency
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
              Restaurant Brand Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
              Brand Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
              Quality / Michelin Guide Badge
            </label>
            <input
              type="text"
              value={formData.michelinGuide}
              onChange={(e) => setFormData(prev => ({ ...prev, michelinGuide: e.target.value }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#C5A059]" />
              Primary Brand Gold Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.branding.primaryColor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  branding: { ...prev.branding, primaryColor: e.target.value }
                }))}
                className="w-9 h-9 rounded-lg bg-transparent border border-white/20 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={formData.branding.primaryColor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  branding: { ...prev.branding, primaryColor: e.target.value }
                }))}
                className="flex-1 bg-[#1A1715] border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              Accent Ember Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.branding.accentColor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  branding: { ...prev.branding, accentColor: e.target.value }
                }))}
                className="w-9 h-9 rounded-lg bg-transparent border border-white/20 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={formData.branding.accentColor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  branding: { ...prev.branding, accentColor: e.target.value }
                }))}
                className="flex-1 bg-[#1A1715] border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
              Website Currency
            </label>
            <select
              value={formData.currencyCode}
              onChange={(e) => {
                const code = e.target.value;
                const symbol = code === 'PKR' ? '₨' : code === 'GBP' ? '£' : code === 'USD' ? '$' : '€';
                setFormData(prev => ({ ...prev, currencyCode: code, currencySymbol: symbol }));
              }}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            >
              <option value="PKR">PKR - Pakistani Rupee (₨ / PKR)</option>
              <option value="GBP">GBP - British Pound (£)</option>
              <option value="USD">USD - US Dollar ($)</option>
              <option value="EUR">EUR - Euro (€)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
            About Text &amp; Culinary Philosophy
          </label>
          <textarea
            rows={3}
            value={formData.aboutText}
            onChange={(e) => setFormData(prev => ({ ...prev, aboutText: e.target.value }))}
            className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none leading-relaxed"
          />
        </div>
      </div>

      {/* 2. Circular Category Visual Images */}
      <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-display font-semibold text-[#C5A059] uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            2. Circular Category Visuals (Homepage Circles)
          </h3>
          <p className="text-xs text-[#a89d8f] mt-1">
            Replace the round visual images displayed on the homepage category cards for each department.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Food */}
          <div className="bg-[#1A1715] border border-white/5 rounded-xl p-4 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-md relative group">
              <img
                src={formData.branding.categoryVisuals.food}
                alt="Food Preview"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="w-full">
              <span className="text-xs font-bold text-white flex items-center justify-center gap-1">
                <UtensilsCrossed className="w-3 h-3 text-[#d4af37]" />
                Food &amp; Karahi
              </span>
              <input
                type="text"
                placeholder="Image URL..."
                value={formData.branding.categoryVisuals.food}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding,
                    categoryVisuals: { ...prev.branding.categoryVisuals, food: e.target.value }
                  }
                }))}
                className="w-full mt-2 bg-[#14110F] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-[#c5bcad] outline-none"
              />
              <label className="mt-2 inline-flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-[#251d18] border border-[#d4af37]/30 text-[#d4af37] text-[10px] font-bold cursor-pointer hover:bg-[#d4af37] hover:text-black transition-colors w-full">
                <Upload className="w-3 h-3" />
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCategoryVisualUpload('food', e)} />
              </label>
            </div>
          </div>

          {/* Meals & Deals */}
          <div className="bg-[#1A1715] border border-white/5 rounded-xl p-4 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 shadow-md relative group">
              <img
                src={formData.branding.categoryVisuals.deals}
                alt="Deals Preview"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="w-full">
              <span className="text-xs font-bold text-white flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                Meals &amp; Deals
              </span>
              <input
                type="text"
                placeholder="Image URL..."
                value={formData.branding.categoryVisuals.deals}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding,
                    categoryVisuals: { ...prev.branding.categoryVisuals, deals: e.target.value }
                  }
                }))}
                className="w-full mt-2 bg-[#14110F] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-[#c5bcad] outline-none"
              />
              <label className="mt-2 inline-flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-[#2d1b0a] border border-orange-500/30 text-orange-400 text-[10px] font-bold cursor-pointer hover:bg-orange-500 hover:text-black transition-colors w-full">
                <Upload className="w-3 h-3" />
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCategoryVisualUpload('deals', e)} />
              </label>
            </div>
          </div>

          {/* Drinks */}
          <div className="bg-[#1A1715] border border-white/5 rounded-xl p-4 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400 shadow-md relative group">
              <img
                src={formData.branding.categoryVisuals.drinks}
                alt="Drinks Preview"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="w-full">
              <span className="text-xs font-bold text-white flex items-center justify-center gap-1">
                <CupSoda className="w-3 h-3 text-cyan-400" />
                Drinks &amp; Sodas
              </span>
              <input
                type="text"
                placeholder="Image URL..."
                value={formData.branding.categoryVisuals.drinks}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding,
                    categoryVisuals: { ...prev.branding.categoryVisuals, drinks: e.target.value }
                  }
                }))}
                className="w-full mt-2 bg-[#14110F] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-[#c5bcad] outline-none"
              />
              <label className="mt-2 inline-flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-[#0d2224] border border-cyan-500/30 text-cyan-400 text-[10px] font-bold cursor-pointer hover:bg-cyan-500 hover:text-black transition-colors w-full">
                <Upload className="w-3 h-3" />
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCategoryVisualUpload('drinks', e)} />
              </label>
            </div>
          </div>

          {/* Desserts */}
          <div className="bg-[#1A1715] border border-white/5 rounded-xl p-4 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-400 shadow-md relative group">
              <img
                src={formData.branding.categoryVisuals.desserts}
                alt="Desserts Preview"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="w-full">
              <span className="text-xs font-bold text-white flex items-center justify-center gap-1">
                <IceCream className="w-3 h-3 text-pink-400" />
                Ice Cream &amp; Desserts
              </span>
              <input
                type="text"
                placeholder="Image URL..."
                value={formData.branding.categoryVisuals.desserts}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding,
                    categoryVisuals: { ...prev.branding.categoryVisuals, desserts: e.target.value }
                  }
                }))}
                className="w-full mt-2 bg-[#14110F] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-[#c5bcad] outline-none"
              />
              <label className="mt-2 inline-flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-[#2d1723] border border-pink-500/30 text-pink-400 text-[10px] font-bold cursor-pointer hover:bg-pink-500 hover:text-black transition-colors w-full">
                <Upload className="w-3 h-3" />
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCategoryVisualUpload('desserts', e)} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Delivery, Pickup & Order Settings */}
      <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-display font-semibold text-[#C5A059] uppercase tracking-wider flex items-center gap-2">
          <Truck className="w-4 h-4" />
          3. Delivery, Pickup &amp; Order Policies
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
              Standard Delivery Fee (₨)
            </label>
            <input
              type="number"
              value={formData.deliverySettings.deliveryFee}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                deliverySettings: { ...prev.deliverySettings, deliveryFee: Number(e.target.value) }
              }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
              Free Delivery Order Above (₨)
            </label>
            <input
              type="number"
              value={formData.deliverySettings.freeDeliveryThreshold}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                deliverySettings: { ...prev.deliverySettings, freeDeliveryThreshold: Number(e.target.value) }
              }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
              Estimated Delivery Time
            </label>
            <input
              type="text"
              value={formData.deliverySettings.estimatedDeliveryMinutes}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                deliverySettings: { ...prev.deliverySettings, estimatedDeliveryMinutes: e.target.value }
              }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
              Cancellation Window (Seconds)
            </label>
            <input
              type="number"
              value={formData.deliverySettings.cancellationWindowSeconds}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                deliverySettings: { ...prev.deliverySettings, cancellationWindowSeconds: Number(e.target.value) }
              }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Contact & Communications */}
      <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-display font-semibold text-[#C5A059] uppercase tracking-wider flex items-center gap-2">
          <Phone className="w-4 h-4" />
          4. Direct Contacts &amp; Location
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              Telephone Number
            </label>
            <input
              type="text"
              value={formData.contact.phone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contact: { ...prev.contact, phone: e.target.value, phoneClean: e.target.value.replace(/[^0-9+]/g, '') }
              }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              WhatsApp Direct Number
            </label>
            <input
              type="text"
              value={formData.contact.whatsapp}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contact: { ...prev.contact, whatsapp: e.target.value, whatsappClean: e.target.value.replace(/[^0-9]/g, '') }
              }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
              Primary Email
            </label>
            <input
              type="email"
              value={formData.contact.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contact: { ...prev.contact, email: e.target.value }
              }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              Full Street Address
            </label>
            <input
              type="text"
              value={formData.contact.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contact: { ...prev.contact, address: e.target.value }
              }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
              City / Region
            </label>
            <input
              type="text"
              value={formData.contact.city}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contact: { ...prev.contact, city: e.target.value }
              }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Opening Hours Weekly Schedule */}
      <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-display font-semibold text-[#C5A059] uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" />
          5. Opening Hours &amp; Service Times
        </h3>

        <div className="space-y-3">
          {formData.hours.map((schedule, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-[#1A1715] border border-white/5 items-center">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#D6CEBF] mb-1">Days</label>
                <input
                  type="text"
                  value={schedule.days}
                  onChange={(e) => handleHourChange(idx, 'days', e.target.value)}
                  className="w-full bg-[#14110F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#D6CEBF] mb-1">Lunch Service</label>
                <input
                  type="text"
                  value={schedule.lunch}
                  onChange={(e) => handleHourChange(idx, 'lunch', e.target.value)}
                  className="w-full bg-[#14110F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#D6CEBF] mb-1">Dinner Service</label>
                <input
                  type="text"
                  value={schedule.dinner}
                  onChange={(e) => handleHourChange(idx, 'dinner', e.target.value)}
                  className="w-full bg-[#14110F] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Social Links */}
      <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-display font-semibold text-[#C5A059] uppercase tracking-wider flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          6. Social Media Links
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
              Instagram URL
            </label>
            <input
              type="text"
              value={formData.social.instagram}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social: { ...prev.social, instagram: e.target.value }
              }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
              Facebook URL
            </label>
            <input
              type="text"
              value={formData.social.facebook}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social: { ...prev.social, facebook: e.target.value }
              }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
              Twitter / X URL
            </label>
            <input
              type="text"
              value={formData.social.twitter}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social: { ...prev.social, twitter: e.target.value }
              }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
              TripAdvisor URL
            </label>
            <input
              type="text"
              value={formData.social.tripadvisor}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                social: { ...prev.social, tripadvisor: e.target.value }
              }))}
              className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="btn-gold px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#C5A059]/20 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          Save All Restaurant Details
        </button>
      </div>
    </form>
  );
};
