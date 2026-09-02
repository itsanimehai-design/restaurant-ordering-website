import React, { useState, useRef } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { 
  Sparkles, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Image as ImageIcon, 
  CheckCircle2, 
  Save, 
  Globe, 
  Palette, 
  Award, 
  Share2, 
  ShieldCheck,
  ExternalLink,
  Flame
} from 'lucide-react';
import { motion } from 'motion/react';

interface BrandingManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const BrandingManager: React.FC<BrandingManagerProps> = ({ onShowToast }) => {
  const { config, updateConfig } = useRestaurantData();

  const logoFileRef = useRef<HTMLInputElement>(null);
  const faviconFileRef = useRef<HTMLInputElement>(null);

  // Logo State
  const [logoImage, setLogoImage] = useState(config.branding?.logoImage || '');
  const [logoText, setLogoText] = useState(config.logoText || 'EMBER & SPICE');

  // Favicon State
  const [faviconImage, setFaviconImage] = useState(config.branding?.faviconImage || '/favicon.ico');

  // Restaurant Identity State
  const [name, setName] = useState(config.name || 'Ember & Spice');
  const [legalName, setLegalName] = useState(config.legalName || 'Ember & Spice Culinary Group Ltd.');
  const [tagline, setTagline] = useState(config.tagline || 'Heritage Wood-Fired Hearth & Spice Gastronomy');
  const [subtitle, setSubtitle] = useState(config.subtitle || 'An ode to ancient embers, fragrant botanicals and live-fire culinary artistry');
  const [established, setEstablished] = useState(config.established || 2018);
  const [michelinGuide, setMichelinGuide] = useState(config.michelinGuide || 'Selected for Michelin Guide 2024 & 2025');

  // Colors State
  const [primaryColor, setPrimaryColor] = useState(config.branding?.primaryColor || '#C5A059');
  const [accentColor, setAccentColor] = useState(config.branding?.accentColor || '#D4AF37');

  // Social Links
  const [socialInstagram, setSocialInstagram] = useState(config.social?.instagram || 'https://instagram.com/emberandspice');
  const [socialFacebook, setSocialFacebook] = useState(config.social?.facebook || 'https://facebook.com/emberandspice');
  const [socialTwitter, setSocialTwitter] = useState(config.social?.twitter || 'https://twitter.com/emberandspice');
  const [socialTikTok, setSocialTikTok] = useState(config.social?.tiktok || 'https://tiktok.com/@emberandspice');
  const [socialTripadvisor, setSocialTripadvisor] = useState(config.social?.tripadvisor || 'https://tripadvisor.com/emberandspice');

  // File Upload Handlers
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        onShowToast('File Too Large', 'Please upload a logo image under 2MB.', 'info');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoImage(event.target.result as string);
          onShowToast('Logo Loaded', 'Preview updated. Click Save Branding to persist.', 'gold');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        onShowToast('File Too Large', 'Favicon file should be under 1MB.', 'info');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFaviconImage(event.target.result as string);
          onShowToast('Favicon Loaded', 'Preview updated. Click Save Branding to persist.', 'gold');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedBranding = {
      ...(config.branding || {}),
      logoImage: logoImage.trim(),
      faviconImage: faviconImage.trim(),
      primaryColor,
      accentColor
    };

    const updatedSocial = {
      ...(config.social || {}),
      instagram: socialInstagram.trim(),
      facebook: socialFacebook.trim(),
      twitter: socialTwitter.trim(),
      tiktok: socialTikTok.trim(),
      tripadvisor: socialTripadvisor.trim()
    };

    updateConfig({
      name: name.trim(),
      legalName: legalName.trim(),
      tagline: tagline.trim(),
      subtitle: subtitle.trim(),
      logoText: logoText.trim(),
      established: Number(established) || 2018,
      michelinGuide: michelinGuide.trim(),
      branding: updatedBranding,
      social: updatedSocial
    });

    onShowToast('Branding Saved', 'Logo, favicon, brand identity and social links successfully saved.', 'gold');
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8 max-w-5xl">
      {/* Banner */}
      <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            <Sparkles className="w-4 h-4" />
            <span>Brand Identity & Visual Assets</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white mt-1">Logo, Favicon, Colors & Identity</h2>
          <p className="text-xs text-white/50 mt-1">Upload brand logo, browser favicon, and manage restaurant social footprints</p>
        </div>

        <button
          type="submit"
          className="btn-gold py-2.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20 self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Branding</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LOGO MANAGEMENT CARD */}
        <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Restaurant Logo</h3>
                <p className="text-[11px] text-white/50">Header, footer, and receipt emblem</p>
              </div>
            </div>
          </div>

          {/* Logo Preview Box */}
          <div className="p-6 rounded-xl bg-[#181411] border border-white/10 flex flex-col items-center justify-center min-h-[160px] relative">
            {logoImage ? (
              <img
                src={logoImage}
                alt="Brand Logo Preview"
                className="max-h-24 max-w-full object-contain filter drop-shadow-md"
              />
            ) : (
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#8C5E10] to-[#D4AF37] border-2 border-[#C5A059] flex items-center justify-center text-black font-bold text-lg font-serif">
                  E&S
                </div>
                <div className="text-xs text-white/50 font-display font-semibold tracking-widest">{logoText}</div>
              </div>
            )}
          </div>

          {/* Logo Controls */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">Logo Image URL</label>
              <input
                type="text"
                value={logoImage}
                onChange={(e) => setLogoImage(e.target.value)}
                placeholder="https://... or upload below"
                className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">Brand Text Fallback</label>
              <input
                type="text"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                placeholder="e.g. EMBER & SPICE"
                className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="file"
                ref={logoFileRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoFileRef.current?.click()}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Upload Logo File</span>
              </button>

              {logoImage && (
                <button
                  type="button"
                  onClick={() => setLogoImage('')}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs transition-colors cursor-pointer"
                  title="Remove Custom Logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FAVICON MANAGEMENT CARD */}
        <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Browser Tab Favicon</h3>
                <p className="text-[11px] text-white/50">Icon shown in browser tabs & bookmarks</p>
              </div>
            </div>
          </div>

          {/* Favicon Browser Simulation Preview */}
          <div className="p-4 rounded-xl bg-[#181411] border border-white/10 space-y-3">
            <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Browser Tab Simulation:</div>
            <div className="bg-[#0F0D0B] border border-white/10 rounded-lg p-2.5 flex items-center gap-2.5 max-w-xs shadow-inner">
              <div className="w-5 h-5 rounded bg-[#181411] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {faviconImage ? (
                  <img
                    src={faviconImage}
                    alt="Favicon"
                    className="w-4 h-4 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/favicon.ico';
                    }}
                  />
                ) : (
                  <Flame className="w-3.5 h-3.5 text-[#C5A059]" />
                )}
              </div>
              <div className="text-xs text-white font-medium truncate">
                {name} — Fine Dining
              </div>
            </div>
          </div>

          {/* Favicon Controls */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">Favicon Image URL</label>
              <input
                type="text"
                value={faviconImage}
                onChange={(e) => setFaviconImage(e.target.value)}
                placeholder="https://... or /favicon.ico"
                className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="file"
                ref={faviconFileRef}
                onChange={handleFaviconUpload}
                accept="image/x-icon,image/png,image/svg+xml"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => faviconFileRef.current?.click()}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Upload Favicon</span>
              </button>

              <button
                type="button"
                onClick={() => setFaviconImage('/favicon.ico')}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                title="Reset to Default Favicon"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RESTAURANT IDENTITY & TAGLINES */}
      <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Restaurant Identity & Honors</h3>
              <p className="text-xs text-white/50">Official names, legal registration, and gastronomic awards</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Restaurant Display Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Legal Company Name</label>
            <input
              type="text"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Tagline</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Subtitle / Culinary Philosophy</label>
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Year Established</label>
            <input
              type="number"
              value={established}
              onChange={(e) => setEstablished(Number(e.target.value))}
              className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Guide Honors</label>
            <input
              type="text"
              value={michelinGuide}
              onChange={(e) => setMichelinGuide(e.target.value)}
              className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* SOCIAL LINKS */}
      <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Social Media Channels</h3>
              <p className="text-xs text-white/50">Links rendered in footer and diner contact cards</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Instagram URL</label>
            <input
              type="url"
              value={socialInstagram}
              onChange={(e) => setSocialInstagram(e.target.value)}
              className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Facebook URL</label>
            <input
              type="url"
              value={socialFacebook}
              onChange={(e) => setSocialFacebook(e.target.value)}
              className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Twitter / X URL</label>
            <input
              type="url"
              value={socialTwitter}
              onChange={(e) => setSocialTwitter(e.target.value)}
              className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">TikTok URL</label>
            <input
              type="url"
              value={socialTikTok}
              onChange={(e) => setSocialTikTok(e.target.value)}
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
          <span>Save Brand Configuration</span>
        </button>
      </div>
    </form>
  );
};
