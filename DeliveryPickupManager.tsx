import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { DeliverySettings, RestaurantContact } from '../../types';
import { 
  Truck, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Save, 
  Plus, 
  X, 
  Check, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface DeliveryPickupManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const DeliveryPickupManager: React.FC<DeliveryPickupManagerProps> = ({ onShowToast }) => {
  const { config, updateConfig } = useRestaurantData();

  const currentDelivery: DeliverySettings = config.deliverySettings || {
    isEnabled: true,
    deliveryFee: 150,
    freeDeliveryThreshold: 2500,
    minOrderAmount: 500,
    estimatedDeliveryMinutes: '35 - 50 mins',
    estimatedPickupMinutes: '15 - 25 mins',
    cancellationWindowSeconds: 180,
    deliveryAreas: ['Gulberg', 'DHA Phase 1-6', 'Model Town', 'Cantt', 'Johar Town', 'Garden Town']
  };

  const currentContact: RestaurantContact = config.contact || {
    phone: '+92 300 1234567',
    phoneClean: '+923001234567',
    cleanPhone: '+923001234567',
    whatsapp: '+92 300 1234567',
    whatsappClean: '923001234567',
    cleanWhatsapp: '923001234567',
    email: 'info@emberandspice.com',
    eventsEmail: 'events@emberandspice.com',
    pressEmail: 'press@emberandspice.com',
    address: 'Plot 12-C, MM Alam Road, Gulberg III',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '54660',
    googleMapsEmbedUrl: ''
  };

  // Delivery State
  const [isDeliveryEnabled, setIsDeliveryEnabled] = useState(currentDelivery.isEnabled !== false);
  const [deliveryFee, setDeliveryFee] = useState<number>(currentDelivery.deliveryFee ?? 150);
  const [freeThreshold, setFreeThreshold] = useState<number>(currentDelivery.freeDeliveryThreshold ?? 2500);
  const [minOrder, setMinOrder] = useState<number>(currentDelivery.minOrderAmount ?? 500);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(currentDelivery.estimatedDeliveryMinutes || '35 - 50 mins');
  const [estimatedPickupTime, setEstimatedPickupTime] = useState(currentDelivery.estimatedPickupMinutes || '15 - 25 mins');
  const [cancellationWindowSec, setCancellationWindowSec] = useState<number>(currentDelivery.cancellationWindowSeconds ?? 180);

  // Delivery Areas
  const [deliveryAreas, setDeliveryAreas] = useState<string[]>(
    currentDelivery.deliveryAreas || ['Gulberg', 'DHA Phase 1-6', 'Model Town', 'Cantt', 'Johar Town', 'Garden Town']
  );
  const [newAreaInput, setNewAreaInput] = useState('');

  // Ordering Contact Channels
  const [phone, setPhone] = useState(currentContact.phone || '+92 300 1234567');
  const [cleanPhone, setCleanPhone] = useState(currentContact.cleanPhone || '+923001234567');
  const [whatsapp, setWhatsapp] = useState(currentContact.whatsapp || '+92 300 1234567');
  const [cleanWhatsapp, setCleanWhatsapp] = useState(currentContact.cleanWhatsapp || '923001234567');
  const [address, setAddress] = useState(currentContact.address || 'Plot 12-C, MM Alam Road, Gulberg III');
  const [city, setCity] = useState(currentContact.city || 'Lahore');

  const currency = config?.currencySymbol || '₨';

  const handleAddArea = () => {
    if (!newAreaInput.trim()) return;
    const trimmed = newAreaInput.trim();
    if (!deliveryAreas.includes(trimmed)) {
      setDeliveryAreas([...deliveryAreas, trimmed]);
    }
    setNewAreaInput('');
  };

  const handleRemoveArea = (area: string) => {
    setDeliveryAreas(deliveryAreas.filter(a => a !== area));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedDelivery: DeliverySettings = {
      ...currentDelivery,
      isEnabled: isDeliveryEnabled,
      deliveryFee: Number(deliveryFee) || 0,
      freeDeliveryThreshold: Number(freeThreshold) || 0,
      minOrderAmount: Number(minOrder) || 0,
      estimatedDeliveryMinutes: estimatedDeliveryTime.trim(),
      estimatedPickupMinutes: estimatedPickupTime.trim(),
      cancellationWindowSeconds: Number(cancellationWindowSec) || 180,
      deliveryAreas
    };

    const updatedContact: RestaurantContact = {
      ...currentContact,
      phone: phone.trim(),
      cleanPhone: cleanPhone.trim(),
      whatsapp: whatsapp.trim(),
      cleanWhatsapp: cleanWhatsapp.trim(),
      address: address.trim(),
      city: city.trim()
    };

    updateConfig({
      deliverySettings: updatedDelivery,
      contact: updatedContact
    });

    onShowToast('Settings Saved', 'Delivery fees, coverage areas and order hotlines updated.', 'gold');
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8 max-w-5xl">
      {/* Banner */}
      <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            <Truck className="w-4 h-4" />
            <span>Fulfillment & Dispatch Engine</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white mt-1">Delivery, Takeaway & Order Hotlines</h2>
          <p className="text-xs text-white/50 mt-1">Configure home delivery charges, free delivery limits, delivery sectors, and WhatsApp/Phone ordering</p>
        </div>

        <button
          type="submit"
          className="btn-gold py-2.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20 self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Fulfillment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HOME DELIVERY CONFIG */}
        <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Home Delivery Service</h3>
                <p className="text-[11px] text-white/50">Rates and turnaround duration</p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input
                type="checkbox"
                checked={isDeliveryEnabled}
                onChange={(e) => setIsDeliveryEnabled(e.target.checked)}
                className="accent-[#C5A059] w-4 h-4 rounded cursor-pointer"
              />
              <span className="font-semibold">{isDeliveryEnabled ? 'Active' : 'Disabled'}</span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                  Delivery Fee ({currency})
                </label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs text-white font-bold text-[#C5A059] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                  Free Delivery Above ({currency})
                </label>
                <input
                  type="number"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(Number(e.target.value))}
                  placeholder="e.g. 2500"
                  className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs text-white font-bold text-emerald-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                  Min. Order Amount ({currency})
                </label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                  Est. Delivery Time
                </label>
                <input
                  type="text"
                  value={estimatedDeliveryTime}
                  onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                  placeholder="35 - 50 mins"
                  className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                Order Cancellation Grace Period (Seconds)
              </label>
              <input
                type="number"
                value={cancellationWindowSec}
                onChange={(e) => setCancellationWindowSec(Number(e.target.value))}
                placeholder="180 (3 mins)"
                className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
              <p className="text-[10px] text-white/40 mt-1">Diners can cancel their order within this window before kitchen starts grilling</p>
            </div>
          </div>
        </div>

        {/* PICKUP & TAKEAWAY CONFIG */}
        <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Takeaway / Express Pickup</h3>
                <p className="text-[11px] text-white/50">Curbside and counter collection</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                Est. Pickup Prep Time
              </label>
              <input
                type="text"
                value={estimatedPickupTime}
                onChange={(e) => setEstimatedPickupTime(e.target.value)}
                placeholder="15 - 25 mins"
                className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                Pickup Address / Counter Location
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* COVERAGE AREAS */}
      <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delivery Coverage Sectors & Towns</h3>
              <p className="text-[11px] text-white/50">Listed sectors eligible for delivery</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {deliveryAreas.map(area => (
            <div
              key={area}
              className="px-3 py-1.5 rounded-xl bg-[#181411] border border-white/10 text-xs text-white flex items-center gap-2"
            >
              <span>{area}</span>
              <button
                type="button"
                onClick={() => handleRemoveArea(area)}
                className="text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 max-w-md pt-2">
          <input
            type="text"
            value={newAreaInput}
            onChange={(e) => setNewAreaInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddArea(); } }}
            placeholder="Add new sector (e.g. Wapda Town)"
            className="flex-1 bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
          />
          <button
            type="button"
            onClick={handleAddArea}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

      {/* WHATSAPP & PHONE HOTLINES */}
      <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Direct Order Hotlines & WhatsApp</h3>
              <p className="text-[11px] text-white/50">Click-to-call and click-to-WhatsApp direct contact numbers</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
              Phone Hotline Display
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 300 1234567"
              className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
              Phone Clean Number (for tel: link)
            </label>
            <input
              type="text"
              value={cleanPhone}
              onChange={(e) => setCleanPhone(e.target.value)}
              placeholder="+923001234567"
              className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
              WhatsApp Display Number
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+92 300 1234567"
              className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
              WhatsApp Clean Digits (for wa.me/ link)
            </label>
            <input
              type="text"
              value={cleanWhatsapp}
              onChange={(e) => setCleanWhatsapp(e.target.value)}
              placeholder="923001234567"
              className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-gold py-3 px-8 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#C5A059]/25 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Fulfillment & Hotlines</span>
        </button>
      </div>
    </form>
  );
};
