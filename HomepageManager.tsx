import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { 
  LayoutTemplate, 
  Sparkles, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  Check, 
  Save, 
  ExternalLink, 
  Sliders, 
  SlidersHorizontal,
  Flame,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomepageManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const HomepageManager: React.FC<HomepageManagerProps> = ({ onShowToast }) => {
  const { config, updateConfig } = useRestaurantData();

  const branding = config.branding || {};
  const [heroHeadline, setHeroHeadline] = useState(branding.heroHeadline || 'AN ODE TO LIVE FIRE & ANCIENT SPICE');
  const [heroSubtitle, setHeroSubtitle] = useState(branding.heroSubtitle || 'Where heritage charcoal hearth cooking meets modern culinary sophistication.');
  const [heroBackground, setHeroBackground] = useState(branding.heroBackground || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85');

  const [primaryBtnText, setPrimaryBtnText] = useState(branding.heroButtons?.primaryText || 'Explore Menu & Order');
  const [primaryBtnLink, setPrimaryBtnLink] = useState(branding.heroButtons?.primaryLink || '#menu');
  const [secondaryBtnText, setSecondaryBtnText] = useState(branding.heroButtons?.secondaryText || 'Reserve a Table');
  const [secondaryBtnLink, setSecondaryBtnLink] = useState(branding.heroButtons?.secondaryLink || '#reservation');

  // Section Visibilities
  const defaultVisibilities = {
    hero: true,
    featured: true,
    promo: true,
    food: true,
    deals: true,
    nashta: true,
    drinks: true,
    desserts: true,
    recipes: true,
    chefs: true,
    events: true,
    gallery: true,
    reviews: true,
    about: true,
    ...branding.sectionsVisibility
  };

  const [sectionsVisibility, setSectionsVisibility] = useState(defaultVisibilities);

  const toggleSection = (sectionKey: string) => {
    setSectionsVisibility(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey as keyof typeof prev]
    }));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedBranding = {
      ...branding,
      heroHeadline: heroHeadline.trim(),
      heroSubtitle: heroSubtitle.trim(),
      heroBackground: heroBackground.trim(),
      heroButtons: {
        primaryText: primaryBtnText.trim(),
        primaryLink: primaryBtnLink.trim(),
        secondaryText: secondaryBtnText.trim(),
        secondaryLink: secondaryBtnLink.trim()
      },
      sectionsVisibility
    };

    updateConfig({ branding: updatedBranding });
    onShowToast('Homepage Updated', 'Hero content and section visibility preferences saved.', 'gold');
  };

  const presetHeroImages = [
    { label: 'Charcoal Hearth Flame', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85' },
    { label: 'Gourmet Feast Table', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=2000&q=85' },
    { label: 'Fine Dining Ambience', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85' },
    { label: 'Live Grill & Embers', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=2000&q=85' }
  ];

  return (
    <form onSubmit={handleSaveAll} className="space-y-8 max-w-5xl">
      {/* Header Banner */}
      <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            <LayoutTemplate className="w-4 h-4" />
            <span>Homepage Design & Layout Engine</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white mt-1">Hero Section, Banners & Section Visibility</h2>
          <p className="text-xs text-white/50 mt-1">Update headline, description, hero background, and control visible sections without writing code</p>
        </div>

        <button
          type="submit"
          className="btn-gold py-2.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20 self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Homepage</span>
        </button>
      </div>

      {/* Hero Content Section */}
      <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hero Showcase Content</h3>
              <p className="text-xs text-white/50">The primary banner guests see on entering your website</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
              Hero Main Headline
            </label>
            <input
              type="text"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              placeholder="e.g. AN ODE TO LIVE FIRE & ANCIENT SPICE"
              className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-4 py-2.5 text-sm text-white font-display tracking-wider outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
              Hero Subtitle / Description
            </label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={2}
              placeholder="e.g. Where heritage charcoal hearth cooking meets modern culinary sophistication..."
              className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-4 py-2.5 text-xs text-white outline-none leading-relaxed"
            />
          </div>

          {/* Hero Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#181411] border border-white/5 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">Primary CTA Button</div>
              <div>
                <label className="block text-[10px] text-white/40 uppercase mb-1">Button Text</label>
                <input
                  type="text"
                  value={primaryBtnText}
                  onChange={(e) => setPrimaryBtnText(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-white/40 uppercase mb-1">Target Section / Link</label>
                <input
                  type="text"
                  value={primaryBtnLink}
                  onChange={(e) => setPrimaryBtnLink(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#181411] border border-white/5 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-white/70">Secondary CTA Button</div>
              <div>
                <label className="block text-[10px] text-white/40 uppercase mb-1">Button Text</label>
                <input
                  type="text"
                  value={secondaryBtnText}
                  onChange={(e) => setSecondaryBtnText(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-white/40 uppercase mb-1">Target Section / Link</label>
                <input
                  type="text"
                  value={secondaryBtnLink}
                  onChange={(e) => setSecondaryBtnLink(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Hero Background Image */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
              Hero Background Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={heroBackground}
                onChange={(e) => setHeroBackground(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-4 py-2 text-xs text-white font-mono outline-none"
              />
            </div>

            {/* Presets */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-[10px] uppercase font-bold text-white/40 flex items-center gap-1 self-center mr-1">
                <Sparkles className="w-3 h-3 text-[#C5A059]" /> Presets:
              </span>
              {presetHeroImages.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setHeroBackground(p.url)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs border border-white/5 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Live Preview */}
            <div className="mt-4 relative h-36 rounded-xl overflow-hidden border border-white/10 bg-black">
              <img
                src={heroBackground}
                alt="Hero Preview"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
                <div className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Live Banner Preview</div>
                <div className="text-sm font-bold text-white font-display">{heroHeadline || 'Hero Headline'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Visibility Switchboard */}
      <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Homepage Sections Visibility</h3>
              <p className="text-xs text-white/50">Toggle specific sections on or off for diners</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 'hero', name: 'Hero Welcome Banner', desc: 'Main headline & hero visual' },
            { id: 'featured', name: 'Featured Charcoal Dishes', desc: '3D rotating dish visualizer' },
            { id: 'promo', name: 'Promotional Banners & Deals', desc: 'Limited-time discounts' },
            { id: 'food', name: 'Main Food Menu', desc: 'Full culinary catalog' },
            { id: 'deals', name: 'Family Deals & Party Boxes', desc: 'Pre-bundled combo packages' },
            { id: 'nashta', name: 'Nashta Point & Breakfast', desc: 'Morning halwa puri & chai' },
            { id: 'drinks', name: 'Beverages & Soft Drinks', desc: 'Sodas, hot chai & fresh juices' },
            { id: 'desserts', name: 'Artisan Gelato & Dessert Bar', desc: 'Ice cream scoops & sundaes' },
            { id: 'recipes', name: 'Secret Culinary Recipes', desc: 'Interactive recipe explorer' },
            { id: 'chefs', name: 'Executive Master Chefs', desc: 'Culinary team bios' },
            { id: 'events', name: 'Events & Live Evenings', desc: 'Live music and special nights' },
            { id: 'gallery', name: 'Ambiance Gallery', desc: 'High-res photography showcase' },
            { id: 'reviews', name: 'Verified Diner Reviews', desc: 'Customer testimonials & stars' },
            { id: 'about', name: 'Restaurant Heritage & Hours', desc: 'Location, contact & story' }
          ].map(sec => {
            const isVisible = sectionsVisibility[sec.id as keyof typeof sectionsVisibility] !== false;
            return (
              <div
                key={sec.id}
                onClick={() => toggleSection(sec.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isVisible
                    ? 'bg-[#181411] border-[#C5A059]/30 text-white'
                    : 'bg-black/30 border-white/5 text-white/40'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{sec.name}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">{sec.desc}</div>
                </div>

                <button
                  type="button"
                  className={`p-1.5 rounded-lg transition-colors ${
                    isVisible
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/5 text-white/30'
                  }`}
                >
                  {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-gold py-3 px-8 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#C5A059]/25 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Homepage Configuration</span>
        </button>
      </div>
    </form>
  );
};
