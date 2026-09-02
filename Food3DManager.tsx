import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { Food3DConfig, Food3DModelPreset } from '../../types';
import { Food3DVisual } from '../Food3DVisual';
import { 
  Sparkles, 
  Flame, 
  RotateCw, 
  Layers, 
  Check, 
  Sliders, 
  Eye, 
  Zap, 
  Info,
  Link as LinkIcon,
  RefreshCw,
  Save,
  CheckCircle2,
  Tv
} from 'lucide-react';

interface Food3DManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const Food3DManager: React.FC<Food3DManagerProps> = ({ onShowToast }) => {
  const { food3dConfig, updateFood3DConfig, menuItems, formatPrice, publishAllChanges } = useRestaurantData();

  const [formData, setFormData] = useState<Food3DConfig>({ ...food3dConfig });
  const [isSaved, setIsSaved] = useState(false);

  const modelPresets: { id: Food3DModelPreset; label: string; desc: string; icon: string }[] = [
    { id: 'karahi', label: 'Shinwari Mutton Karahi', desc: 'Live iron wok with bubbling butter, ginger slivers & hearth embers', icon: '🍲' },
    { id: 'burger', label: 'Charcoal Angus Burger', desc: 'Brioche sesame bun, melted cheddar drip & smoked beef patty', icon: '🍔' },
    { id: 'pizza', label: 'Artisanal Stone-Oven Pizza', desc: 'Blistered woodfired crust, melted mozzarella & fresh basil', icon: '🍕' },
    { id: 'steak', label: 'Prime Tomahawk Steak', desc: 'Charcoal grill-marked beef slab, rosemary sprig & herb butter', icon: '🥩' },
    { id: 'lamb-chops', label: 'Copper-Braised Lamb Chops', desc: 'Flame-seared French-trimmed cutlets with pistachio crust', icon: '🍖' },
    { id: 'dessert-skillet', label: 'Sizzling Iron Brownie', desc: 'Hot cast-iron skillet, chocolate pool & vanilla gelato scoop', icon: '🍨' },
    { id: 'cocktail', label: 'Iced Botanical Mocktail', desc: 'Glowing crystal glass, translucent elixir & cool ice cubes', icon: '🍹' },
    { id: 'custom', label: 'Custom Hearth Pedestal', desc: 'Golden revolving crown centerpiece with atmospheric flame', icon: '✨' }
  ];

  const particleEffects: { id: Food3DConfig['particleEffect']; label: string; desc: string }[] = [
    { id: 'embers', label: '🔥 Golden Hearth Embers', desc: 'Fiery glowing ember particles rising dynamically' },
    { id: 'steam', label: '💨 Aromatic Sizzling Steam', desc: 'Soft rising vapor mist simulating fresh heat' },
    { id: 'spicedust', label: '✨ Golden Spice Dust', desc: 'Shimmering saffron and heirloom spice glints' },
    { id: 'sparkles', label: '⭐ Starlight Sparkles', desc: 'Crisp twinkling luxury specks' },
    { id: 'none', label: '🚫 No Particles', desc: 'Clean pure 3D model without floating effects' }
  ];

  const glowIntensities: { id: Food3DConfig['glowIntensity']; label: string; color: string }[] = [
    { id: 'subtle', label: 'Subtle Gold (Warm Amber)', color: '#d4af37' },
    { id: 'radiant', label: 'Radiant Glow (Sunfire)', color: '#f59e0b' },
    { id: 'fiery', label: 'Fiery Crimson (Live Coals)', color: '#ff4500' },
    { id: 'ember', label: 'Ember Orange (Smoldering)', color: '#ea580c' }
  ];

  const handleChange = <K extends keyof Food3DConfig>(field: K, value: Food3DConfig[K]) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    updateFood3DConfig({ [field]: value });
  };

  // Bind to an existing menu item
  const handleLinkMenuItem = (dishId: string) => {
    const dish = menuItems.find(m => m.id === dishId);
    if (!dish) return;

    let preset: Food3DModelPreset = 'karahi';
    if (dish.category === 'burgers') preset = 'burger';
    else if (dish.category === 'main-courses' || dish.name.toLowerCase().includes('karahi')) preset = 'karahi';
    else if (dish.category === 'grills' || dish.name.toLowerCase().includes('steak')) preset = 'steak';
    else if (dish.category === 'desserts') preset = 'dessert-skillet';
    else if (dish.category === 'soft-drinks' || dish.category === 'signature-drinks') preset = 'cocktail';

    const updated: Food3DConfig = {
      ...formData,
      linkedDishId: dishId,
      title: dish.name,
      subtitle: dish.pairingNote || 'Signature chef creation prepared over live hearth fire',
      description: dish.description,
      price: dish.price,
      tag: dish.isChefSpecial ? "Chef's Signature Hearth" : 'Featured Culinary Dish',
      modelPreset: dish.food3dPreset || preset,
      customImageUrl: dish.image
    };

    setFormData(updated);
    updateFood3DConfig(updated);
    onShowToast('Linked to Menu Item', `3D spotlight successfully linked to "${dish.name}".`, 'gold');
  };

  const handleSave = () => {
    updateFood3DConfig(formData);
    publishAllChanges();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    onShowToast('3D Settings Published', 'Changes to the 3D food showcase are now live on the website.', 'success');
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1c140e] via-[#241a12] to-[#16100c] border border-[#d4af37]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Food Showcase Engine</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
            3D Food Visual &amp; Spotlight Manager
          </h2>
          <p className="text-xs sm:text-sm text-[#c5bcad] mt-1 max-w-2xl">
            Configure the real-time 3D floating food model, particle dynamics, rotation physics, and featured dish presentation displayed on the restaurant website.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b59226] text-black font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 shadow-lg shadow-[#d4af37]/20 hover:scale-102 transition-all cursor-pointer shrink-0"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Published Live' : 'Publish 3D Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Quick Binding to Menu Item */}
          <div className="p-6 rounded-2xl bg-[#14100c] border border-[#2e241c] space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                <span>Link Featured 3D Dish to Existing Menu Item</span>
              </label>
              <span className="text-[10px] text-[#8c8275]">Auto-populates text &amp; price</span>
            </div>

            <select
              value={formData.linkedDishId || ''}
              onChange={(e) => handleLinkMenuItem(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#1d1712] border border-[#3d2f22] text-white text-sm focus:border-[#d4af37] focus:outline-none"
            >
              <option value="">-- Choose a dish to showcase in 3D --</option>
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({formatPrice(item.price)}) — {item.category}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Select 3D Model Preset */}
          <div className="p-6 rounded-2xl bg-[#14100c] border border-[#2e241c] space-y-4">
            <label className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block">
              1. Select 3D Food Model Geometry Preset
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {modelPresets.map((preset) => {
                const isSelected = formData.modelPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleChange('modelPreset', preset.id)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2a1d12] border-[#d4af37] shadow-lg shadow-[#d4af37]/15 ring-1 ring-[#d4af37]'
                        : 'bg-[#18120e] border-[#2d2218] hover:border-[#4d3a2a]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{preset.icon}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#d4af37]" />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-[#e5dcce]'}`}>
                        {preset.label}
                      </h4>
                      <p className="text-[11px] text-[#9c9182] mt-1 leading-snug">{preset.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Text & Details Display */}
          <div className="p-6 rounded-2xl bg-[#14100c] border border-[#2e241c] space-y-5">
            <label className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block">
              2. Headline, Description &amp; Tagline
            </label>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] text-[#a89d8f] uppercase font-semibold mb-1">
                  Spotlight Tag (Badge)
                </label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => handleChange('tag', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1d1712] border border-[#3d2f22] text-white text-sm focus:border-[#d4af37] focus:outline-none"
                  placeholder="e.g. Signature Hearth Showpiece"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#a89d8f] uppercase font-semibold mb-1">
                  Dish Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1d1712] border border-[#3d2f22] text-white text-sm font-bold focus:border-[#d4af37] focus:outline-none"
                  placeholder="e.g. Live Shinwari Charcoal Mutton Karahi"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#a89d8f] uppercase font-semibold mb-1">
                  Subtitle / Cooking Method
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1d1712] border border-[#3d2f22] text-white text-sm focus:border-[#d4af37] focus:outline-none"
                  placeholder="e.g. Slow-simmered in pure organic butter over glowing binchotan coals"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#a89d8f] uppercase font-semibold mb-1">
                  Detailed Story / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1d1712] border border-[#3d2f22] text-white text-sm focus:border-[#d4af37] focus:outline-none"
                  placeholder="Describe the aromatic flavors, preparation, and culinary experience..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-[#a89d8f] uppercase font-semibold mb-1">
                    Featured Price
                  </label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => handleChange('price', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1d1712] border border-[#3d2f22] text-[#d4af37] font-mono font-bold text-sm focus:border-[#d4af37] focus:outline-none"
                    placeholder="3450"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#a89d8f] uppercase font-semibold mb-1">
                    Custom 2D Fallback Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.customImageUrl || ''}
                    onChange={(e) => handleChange('customImageUrl', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1d1712] border border-[#3d2f22] text-white text-xs focus:border-[#d4af37] focus:outline-none font-mono"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Particle Effects & Atmospheric Glow */}
          <div className="p-6 rounded-2xl bg-[#14100c] border border-[#2e241c] space-y-6">
            <label className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block">
              3. Visual Particles &amp; Glow Atmosphere
            </label>

            {/* Particle Selector */}
            <div className="space-y-2">
              <span className="text-[11px] text-[#a89d8f] uppercase font-semibold block">Particle System Effect</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {particleEffects.map((p) => {
                  const isSelected = formData.particleEffect === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleChange('particleEffect', p.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#291b10] border-[#d4af37] text-white font-bold'
                          : 'bg-[#18120e] border-[#2e2218] text-[#c5bcad]'
                      }`}
                    >
                      <div className="font-semibold">{p.label}</div>
                      <div className="text-[10px] text-[#8c8173] mt-0.5">{p.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Glow Intensity */}
            <div className="space-y-2">
              <span className="text-[11px] text-[#a89d8f] uppercase font-semibold block">Under-Dish Hearth Glow</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {glowIntensities.map((g) => {
                  const isSelected = formData.glowIntensity === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleChange('glowIntensity', g.id)}
                      className={`p-2.5 rounded-xl border text-center text-xs transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#291b10] border-[#d4af37] text-white font-bold'
                          : 'bg-[#18120e] border-[#2e2218] text-[#a89d8f]'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                      <span className="text-[10px]">{g.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. 3D Animation & Physics Controls */}
          <div className="p-6 rounded-2xl bg-[#14100c] border border-[#2e241c] space-y-6">
            <label className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block">
              4. Animation Physics &amp; Speed Sliders
            </label>

            {/* Rotation Speed Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#a89d8f] font-semibold">3D Auto-Rotation Speed</span>
                <span className="text-[#d4af37] font-mono font-bold">{formData.rotationSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={formData.rotationSpeed}
                onChange={(e) => handleChange('rotationSpeed', parseFloat(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer"
              />
            </div>

            {/* Floating Distance Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#a89d8f] font-semibold">Vertical Floating Altitude</span>
                <span className="text-[#d4af37] font-mono font-bold">{formData.floatingDistance}px</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={formData.floatingDistance}
                onChange={(e) => handleChange('floatingDistance', parseInt(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer"
              />
            </div>

            {/* Feature Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label className="p-3 rounded-xl bg-[#1a140f] border border-[#2d2218] flex items-center justify-between cursor-pointer">
                <span className="text-xs text-[#d6cebf]">Auto-Rotate</span>
                <input
                  type="checkbox"
                  checked={formData.enableAutoRotate}
                  onChange={(e) => handleChange('enableAutoRotate', e.target.checked)}
                  className="accent-[#d4af37] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="p-3 rounded-xl bg-[#1a140f] border border-[#2d2218] flex items-center justify-between cursor-pointer">
                <span className="text-xs text-[#d6cebf]">360° Drag Orbit</span>
                <input
                  type="checkbox"
                  checked={formData.enableInteractiveDrag}
                  onChange={(e) => handleChange('enableInteractiveDrag', e.target.checked)}
                  className="accent-[#d4af37] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="p-3 rounded-xl bg-[#1a140f] border border-[#2d2218] flex items-center justify-between cursor-pointer">
                <span className="text-xs text-[#d6cebf]">Steam / Embers</span>
                <input
                  type="checkbox"
                  checked={formData.enableSteamOrEmbers}
                  onChange={(e) => handleChange('enableSteamOrEmbers', e.target.checked)}
                  className="accent-[#d4af37] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Live 3D Interactive Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-28 p-6 rounded-3xl bg-gradient-to-b from-[#18120e] via-[#120d0a] to-[#0d0907] border border-[#d4af37]/40 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                <Eye className="w-4 h-4" />
                <span>Live Interactive 3D Preview</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                Real-Time WebGL
              </span>
            </div>

            {/* Embedded Live 3D Canvas */}
            <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-[#332417] h-[400px] flex items-center justify-center">
              <Food3DVisual config={formData} showControls={true} />
            </div>

            {/* Card Information Preview */}
            <div className="mt-5 space-y-3 pt-4 border-t border-[#261c14]">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#291b10] text-[10px] font-bold text-[#d4af37] border border-[#d4af37]/40 uppercase tracking-wider">
                  {formData.tag || 'Showpiece'}
                </span>
                {formData.price && (
                  <span className="font-mono text-lg font-bold text-[#d4af37]">
                    {formatPrice(formData.price)}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-xl font-bold text-[#fdfbf7]">
                {formData.title || 'Featured Dish'}
              </h3>
              <p className="text-xs text-[#a89d8f] line-clamp-3 leading-relaxed">
                {formData.description}
              </p>

              <div className="pt-2 text-[11px] text-[#7a6f62] italic flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Drag inside the 3D window to inspect model from all angles.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
