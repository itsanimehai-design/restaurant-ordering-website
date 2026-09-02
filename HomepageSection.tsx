import React, { useState } from 'react';
import {
  Layers,
  Save,
  Check,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Sparkles,
  Type,
  LayoutTemplate,
} from 'lucide-react';
import { StoreSettings } from '../../../types';
import { SAMPLE_FOOD_IMAGES } from '../../../data/defaultData';

interface HomepageSectionProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: Partial<StoreSettings>) => Promise<StoreSettings>;
}

export const HomepageSection: React.FC<HomepageSectionProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: 'hero' | 'sections' | 'homepageText', key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [key]: value,
      },
    }));
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
            Homepage & Hero Section Editor
          </h2>
          <p className="text-xs text-stone-500">
            Customize main banners, hero headlines, featured media, button texts and section visibility
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
              <span>{isSaving ? 'Saving Changes...' : 'Save Homepage Settings'}</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Banner Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900 font-serif">Hero Banner & Typography</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-stone-800 block mb-1">Top Hero Badge</label>
            <input
              type="text"
              value={formData.hero?.badge || ''}
              onChange={(e) => handleNestedChange('hero', 'badge', e.target.value)}
              placeholder="e.g. 🔥 HOT CRISPY & SIZZLING"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Highlighted Headline Accent Word</label>
            <input
              type="text"
              value={formData.hero?.headlineHighlight || ''}
              onChange={(e) => handleNestedChange('hero', 'headlineHighlight', e.target.value)}
              placeholder="e.g. Mastered, Fresh, Crispy"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-stone-800 block mb-1">Main Hero Headline</label>
            <input
              type="text"
              value={formData.hero?.headline || ''}
              onChange={(e) => handleNestedChange('hero', 'headline', e.target.value)}
              placeholder="e.g. Authentic Pakistani Fast Food & Crispy Fried Chicken"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-bold focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-stone-800 block mb-1">Hero Subheadline / Paragraph</label>
            <textarea
              rows={2}
              value={formData.hero?.subheadline || ''}
              onChange={(e) => handleNestedChange('hero', 'subheadline', e.target.value)}
              placeholder="Describe your quality, freshness, speedy delivery..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Primary CTA Button Label</label>
            <input
              type="text"
              value={formData.hero?.ctaButtonText || ''}
              onChange={(e) => handleNestedChange('hero', 'ctaButtonText', e.target.value)}
              placeholder="e.g. Order Deals & Boxes"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Secondary Button Label</label>
            <input
              type="text"
              value={formData.hero?.secondaryButtonText || ''}
              onChange={(e) => handleNestedChange('hero', 'secondaryButtonText', e.target.value)}
              placeholder="e.g. View Full Menu"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-800">Hero Main Image / Banner URL</label>
              <button
                type="button"
                onClick={() => setShowImagePicker(!showImagePicker)}
                className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 text-[11px]"
              >
                <ImageIcon className="w-3 h-3" />
                <span>{showImagePicker ? 'Hide Presets' : 'Choose Hero Photo Preset'}</span>
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.heroImage || ''}
                onChange={(e) => handleChange('heroImage', e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
              />
              {formData.heroImage && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-300 shrink-0">
                  <img src={formData.heroImage} alt="hero" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
            </div>

            {showImagePicker && (
              <div className="mt-2 p-2 bg-stone-100 rounded-xl border border-stone-200 grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto">
                {SAMPLE_FOOD_IMAGES.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      handleChange('heroImage', sample.url);
                      setShowImagePicker(false);
                    }}
                    className="cursor-pointer rounded-md overflow-hidden border hover:border-amber-500 h-12"
                  >
                    <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Visibility & Display Toggles */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <LayoutTemplate className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900 font-serif">Homepage Sections Visibility</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {[
            { key: 'showHero', label: 'Hero Banner Section', desc: 'Top big banner with CTA buttons' },
            { key: 'showDeals', label: 'Deals & Boxes Section', desc: 'Featured & unlimited deal boxes' },
            { key: 'showFullMenu', label: 'Full Menu Section', desc: 'Single food products & drink menu' },
            { key: 'showDeliveryInfo', label: 'Delivery Guarantee Banner', desc: 'Delivery time, min order, rates' },
            { key: 'showFeatures', label: 'Brand Badges Strip', desc: 'Freshness, authentic taste badges' },
            { key: 'showAnnouncementBar', label: 'Top Announcement Strip', desc: 'Header promotional notice' },
          ].map((sec) => (
            <label
              key={sec.key}
              className="p-3 bg-stone-50 rounded-xl border border-stone-200 hover:border-amber-300 transition-all flex items-start gap-2.5 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(formData.sections as any)?.[sec.key] !== false}
                onChange={(e) => handleNestedChange('sections', sec.key, e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded mt-0.5"
              />
              <div>
                <span className="font-bold text-stone-900 block">{sec.label}</span>
                <span className="text-[10px] text-stone-500">{sec.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Section Headings Customization */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Type className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900 font-serif">Section Titles & Subtitles</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-stone-800 block mb-1">Deals Section Title</label>
            <input
              type="text"
              value={formData.homepageText?.dealsTitle || ''}
              onChange={(e) => handleNestedChange('homepageText', 'dealsTitle', e.target.value)}
              placeholder="e.g. Exclusive Deals & Value Boxes"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Deals Section Subtitle</label>
            <input
              type="text"
              value={formData.homepageText?.dealsSubtitle || ''}
              onChange={(e) => handleNestedChange('homepageText', 'dealsSubtitle', e.target.value)}
              placeholder="e.g. Perfect combinations for family, friends and solo cravings"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Menu Section Title</label>
            <input
              type="text"
              value={formData.homepageText?.menuTitle || ''}
              onChange={(e) => handleNestedChange('homepageText', 'menuTitle', e.target.value)}
              placeholder="e.g. Explore Full Pakistani Menu"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Menu Section Subtitle</label>
            <input
              type="text"
              value={formData.homepageText?.menuSubtitle || ''}
              onChange={(e) => handleNestedChange('homepageText', 'menuSubtitle', e.target.value)}
              placeholder="e.g. Freshly made burgers, spicy wings, desserts and cold beverages"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
