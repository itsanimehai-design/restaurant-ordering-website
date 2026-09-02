import React, { useState } from 'react';
import {
  Store,
  Save,
  Check,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquareQuote,
  Megaphone,
} from 'lucide-react';
import { StoreSettings } from '../../../types';

interface RestaurantInfoSectionProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: Partial<StoreSettings>) => Promise<StoreSettings>;
}

export const RestaurantInfoSection: React.FC<RestaurantInfoSectionProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-stone-900 font-serif">
            Restaurant Information & Contact Details
          </h2>
          <p className="text-xs text-stone-500">
            Control branch location, contact phones, operating hours, and top promotional announcement
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Info'}</span>
            </>
          )}
        </button>
      </div>

      {/* Live Store Status Switch */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 text-sm">Live Store Status</span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  formData.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {formData.isOpen ? 'ONLINE & ACCEPTING ORDERS' : 'STORE CLOSED'}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              When turned off, customers will see a polite notification that the kitchen is closed.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isOpen}
              onChange={(e) => handleChange('isOpen', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
          </label>
        </div>
      </div>

      {/* Contact & Hours Fields */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Store className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900 font-serif">Branch & Operating Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-stone-800 block mb-1">Customer Helpline Phone</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Official WhatsApp Business Number</label>
            <div className="relative">
              <MessageSquareQuote className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.whatsappNumber || ''}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Support Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="orders@pakbite.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Opening Hours Schedule</label>
            <div className="relative">
              <Clock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.openingHours || ''}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                placeholder="12:00 PM - 02:00 AM (Daily)"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-stone-800 block mb-1">Physical Restaurant Branch Address</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g. Shop 14, Main Boulevard, Gulberg III, Lahore, Pakistan"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Header Announcement Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Megaphone className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900 font-serif">Top Announcement Strip</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-stone-800 block mb-1">Announcement Message Text</label>
            <input
              type="text"
              value={formData.announcementText || ''}
              onChange={(e) => handleChange('announcementText', e.target.value)}
              placeholder="e.g. ⚡ FREE Delivery on orders above Rs. 1,500! Hot & Fresh at your doorstep."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
