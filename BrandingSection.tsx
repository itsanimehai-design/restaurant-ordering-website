import React, { useState } from 'react';
import {
  Sparkles,
  Save,
  Check,
  Palette,
  Image as ImageIcon,
  DollarSign,
  Globe,
} from 'lucide-react';
import { StoreSettings } from '../../../types';

interface BrandingSectionProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: Partial<StoreSettings>) => Promise<StoreSettings>;
}

export const BrandingSection: React.FC<BrandingSectionProps> = ({
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
            Branding & Visual Identity
          </h2>
          <p className="text-xs text-stone-500">
            Control restaurant name, brand logo, favicon, tagline, and theme colors
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
              <span>{isSaving ? 'Saving Changes...' : 'Save Branding'}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Identity Fields */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900 font-serif">Brand Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-stone-800 block mb-1">Restaurant / Brand Name *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. PakBite Express"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-bold focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Currency Prefix</label>
            <input
              type="text"
              value={formData.currency || 'Rs.'}
              onChange={(e) => handleChange('currency', e.target.value)}
              placeholder="Rs."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-bold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-stone-800 block mb-1">Brand Tagline / Slogan</label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="e.g. Sizzling Deals & Authentic Pakistani Fast Food in Lahore"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Logo Image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.logo || ''}
                onChange={(e) => handleChange('logo', e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
              />
              {formData.logo && (
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-stone-300 shrink-0 bg-stone-900 p-1 flex items-center justify-center">
                  <img src={formData.logo} alt="logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Favicon URL</label>
            <input
              type="url"
              value={formData.favicon || ''}
              onChange={(e) => handleChange('favicon', e.target.value)}
              placeholder="https://..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>
        </div>
      </div>

      {/* Brand Color Theme */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Palette className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900 font-serif">Color Palette Theme</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { id: '#d97706', name: 'Warm Sizzling Amber (Default)', bg: 'bg-amber-600', ring: 'ring-amber-600' },
            { id: '#dc2626', name: 'Crimson Spicy Red', bg: 'bg-rose-600', ring: 'ring-rose-600' },
            { id: '#059669', name: 'Pakistani Emerald Green', bg: 'bg-emerald-600', ring: 'ring-emerald-600' },
            { id: '#b45309', name: 'Golden Roasted Bronze', bg: 'bg-yellow-700', ring: 'ring-yellow-700' },
          ].map((theme) => (
            <div
              key={theme.id}
              onClick={() => handleChange('primaryColor', theme.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                formData.primaryColor === theme.id ? 'border-amber-600 bg-amber-50/50 shadow-xs ring-2 ring-amber-500/20' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-4 h-4 rounded-full ${theme.bg}`} />
                <span className="font-bold text-stone-900">{theme.name.split(' ')[0]}</span>
              </div>
              <span className="text-[10px] text-stone-500 block">{theme.name}</span>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
