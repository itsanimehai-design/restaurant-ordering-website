import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { MenuItem, MenuCategory } from '../../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Flame, 
  Sparkles, 
  Utensils, 
  Image as ImageIcon,
  DollarSign,
  AlertTriangle,
  Upload,
  Copy,
  Archive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MenuManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

const DEFAULT_CATEGORIES: { id: string; label: string }[] = [
  { id: 'starters', label: 'Starters & Seekh' },
  { id: 'main-courses', label: 'Karahi & Handi' },
  { id: 'grills', label: 'Grills & BBQ' },
  { id: 'seafood', label: 'Seafood Specialities' },
  { id: 'burgers', label: 'Chapli & Gourmet Burgers' },
  { id: 'desserts', label: 'Desserts & Kulfi' },
  { id: 'soft-drinks', label: 'Soft Drinks & Beverages (100% Halal)' },
  { id: 'signature-drinks', label: 'Chai & Herbal Coolers' },
  { id: 'specials', label: 'Chef Specials' }
];

const PRESET_IMAGES = [
  { label: 'Tomahawk Ribeye Steak', url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80' },
  { label: 'Charred Octopus Starter', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { label: 'Wagyu Beef Carpaccio', url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pan-Seared Sea Bass', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80' },
  { label: 'Smoked Burrata & Figs', url: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a5c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Truffle Tagliolini Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80' },
  { label: 'Gourmet Wagyu Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chocolate Sphere Dessert', url: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Wood-Fired Jumbo Prawns', url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ember Smoked Herbal Cooler', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80' },
];

export const MenuManager: React.FC<MenuManagerProps> = ({ onShowToast }) => {
  const { 
    menuItems, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem,
    duplicateMenuItem,
    archiveMenuItem,
    toggleDishAvailability,
    toggleDishChefSpecial,
    toggleDishNew,
    formatPrice,
    config
  } = useRestaurantData();

  const allCategories = [
    ...DEFAULT_CATEGORIES,
    ...(config.customCategories || []).map(c => ({ id: c.id, label: c.name }))
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formState, setFormState] = useState<Partial<MenuItem>>({
    name: '',
    category: 'starters',
    description: '',
    price: 3500,
    image: PRESET_IMAGES[0].url,
    isChefSpecial: false,
    isNew: true,
    isAvailable: true,
    isVegetarian: false,
    isGlutenFree: false,
    spiceLevel: 0,
    pairingNote: ''
  });

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setFormState({
      name: '',
      category: 'starters',
      description: '',
      price: 3500,
      image: PRESET_IMAGES[0].url,
      isChefSpecial: false,
      isNew: true,
      isAvailable: true,
      isVegetarian: false,
      isGlutenFree: false,
      spiceLevel: 0,
      pairingNote: ''
    });
    setIsAddingNew(true);
    setEditingItem(null);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormState({ ...item });
    setIsAddingNew(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name?.trim() || !formState.description?.trim()) {
      onShowToast('Missing Fields', 'Please enter a dish name and description.', 'info');
      return;
    }

    if (editingItem) {
      updateMenuItem(editingItem.id, formState);
      onShowToast('Dish Updated', `${formState.name} has been updated live on the website.`, 'success');
      setEditingItem(null);
    } else {
      addMenuItem(formState as Omit<MenuItem, 'id'>);
      onShowToast('New Dish Added', `${formState.name} is now live on the menu!`, 'gold');
      setIsAddingNew(false);
    }
  };

  const handleDelete = (id: string) => {
    const item = menuItems.find(m => m.id === id);
    deleteMenuItem(id);
    setDeleteConfirmId(null);
    onShowToast('Dish Removed', `${item?.name || 'Dish'} has been removed from the menu.`, 'info');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormState(prev => ({ ...prev, image: reader.result as string }));
          onShowToast('Image Uploaded', 'Custom photo loaded successfully.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#14110F] p-5 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#C5A059]" />
            Menu Management ({menuItems.length} Total Dishes)
          </h2>
          <p className="text-xs text-[#D6CEBF] mt-1">
            Add, update prices in {config.currencyCode || 'PKR'}, toggle chef specials, and manage dish availability.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Dish
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes by name, spice, or ingredient..."
            className="w-full bg-[#181512] border border-white/10 focus:border-[#C5A059] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#C5A059] text-[#0D0D0D] font-bold'
                : 'bg-[#181512] text-[#D6CEBF] hover:text-white border border-white/5'
            }`}
          >
            All Categories ({menuItems.length})
          </button>
          {allCategories.map(cat => {
            const count = menuItems.filter(m => m.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#C5A059] text-[#0D0D0D] font-bold'
                    : 'bg-[#181512] text-[#D6CEBF] hover:text-white border border-white/5'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Dishes Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-[#14110F] border rounded-2xl p-4 flex flex-col justify-between transition-all ${
              item.isAvailable !== false
                ? 'border-white/10 hover:border-[#C5A059]/40'
                : 'border-white/5 opacity-60 bg-[#0F0D0C]'
            }`}
          >
            <div>
              {/* Dish Image & Badges */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-[#1D1916]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#0D0D0D]/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#C5A059] border border-[#C5A059]/30">
                    {allCategories.find(c => c.id === item.category)?.label || item.category}
                  </span>
                  {item.isChefSpecial && (
                    <span className="px-2 py-0.5 rounded-md bg-[#8C5E10] text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1 shadow-sm">
                      <Flame className="w-2.5 h-2.5 text-[#E5C158]" /> Special
                    </span>
                  )}
                  {item.isNew && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-[10px] font-bold uppercase tracking-wider text-white">
                      New
                    </span>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-base font-bold text-white font-mono bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                    {formatPrice(item.price)}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.isAvailable !== false ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {item.isAvailable !== false ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-display font-semibold text-white text-base mb-1">
                {item.name}
              </h3>
              <p className="text-xs text-[#D6CEBF]/80 line-clamp-2 leading-relaxed mb-3">
                {item.description}
              </p>
            </div>

            {/* Controls Bar */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
              {/* Fast Toggles */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleDishAvailability(item.id)}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                    item.isAvailable !== false
                      ? 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60'
                      : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/60'
                  }`}
                  title={item.isAvailable !== false ? 'Click to Mark Unavailable' : 'Click to Mark Available'}
                >
                  {item.isAvailable !== false ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  <span className="text-[10px]">{item.isAvailable !== false ? 'In Stock' : 'Sold Out'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleDishChefSpecial(item.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    item.isChefSpecial
                      ? 'bg-[#C5A059]/20 text-[#E5C158]'
                      : 'bg-white/5 text-white/40 hover:text-white'
                  }`}
                  title="Toggle Chef Special"
                >
                  <Flame className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => toggleDishNew(item.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    item.isNew
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-white/5 text-white/40 hover:text-white'
                  }`}
                  title="Toggle New Item Badge"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    duplicateMenuItem(item.id);
                    onShowToast('Dish Duplicated', `Created clone of ${item.name}`, 'gold');
                  }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-[#C5A059]/20 text-[#D6CEBF] hover:text-[#E5C158] transition-colors"
                  title="Duplicate Dish"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    archiveMenuItem(item.id);
                    onShowToast(item.isAvailable === false ? 'Dish Restored' : 'Dish Archived', `${item.name} status updated`, 'info');
                  }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-amber-950/40 text-[#D6CEBF] hover:text-amber-400 transition-colors"
                  title="Archive / Hide Dish"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-[#C5A059]/20 text-[#D6CEBF] hover:text-[#E5C158] transition-colors"
                  title="Edit Dish Content & Price"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-rose-950/40 text-white/50 hover:text-rose-400 transition-colors"
                  title="Delete Dish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-[#14110F] border border-white/5 rounded-2xl">
          <Utensils className="w-8 h-8 text-white/20 mx-auto mb-2" />
          <p className="text-sm text-white/60">No dishes match your query.</p>
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      <AnimatePresence>
        {(isAddingNew || editingItem) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingNew(false); setEditingItem(null); }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#14110F] border border-[#C5A059]/40 rounded-2xl p-6 shadow-2xl text-[#F5F2ED] max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => { setIsAddingNew(false); setEditingItem(null); }}
                className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C158]">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    {editingItem ? `Edit: ${editingItem.name}` : 'Add New Menu Dish'}
                  </h3>
                  <p className="text-xs text-[#D6CEBF]">
                    Enter dish details. Changes reflect live on the website immediately.
                  </p>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Dish Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Dish Name *
                    </label>
                    <input
                      type="text"
                      value={formState.name || ''}
                      onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="e.g. Charred Lamb Chops"
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={formState.category || 'starters'}
                      onChange={(e) => setFormState(prev => ({ ...prev, category: e.target.value as MenuCategory }))}
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    >
                      {allCategories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-[#14110F]">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Spice Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Price in {config.currencyCode || 'PKR'} ({config.currencySymbol || '₨'}) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={formState.price || 0}
                        onChange={(e) => setFormState(prev => ({ ...prev, price: Number(e.target.value) }))}
                        required
                        className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Spice Level (0 to 3)
                    </label>
                    <select
                      value={formState.spiceLevel || 0}
                      onChange={(e) => setFormState(prev => ({ ...prev, spiceLevel: Number(e.target.value) as 0 | 1 | 2 | 3 }))}
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    >
                      <option value={0} className="bg-[#14110F]">0 - Mild / No Chili</option>
                      <option value={1} className="bg-[#14110F]">1 - Gentle Warmth (Ember)</option>
                      <option value={2} className="bg-[#14110F]">2 - Medium Spice</option>
                      <option value={3} className="bg-[#14110F]">3 - Bold Fire & Chili</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Gastronomic Description *
                  </label>
                  <textarea
                    rows={3}
                    value={formState.description || ''}
                    onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                    required
                    placeholder="Describe textures, hearth smoke methods, and key culinary ingredients..."
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none leading-relaxed"
                  />
                </div>

                {/* Image Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Dish Photo Image (URL or Preset)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={formState.image || ''}
                      onChange={(e) => setFormState(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://..."
                      className="flex-1 bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono"
                    />
                    <label className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 cursor-pointer text-xs flex items-center gap-1 text-[#E5C158]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Preset Image Swatches */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-[10px] text-white/40 uppercase whitespace-nowrap">Presets:</span>
                    {PRESET_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormState(prev => ({ ...prev, image: img.url }))}
                        className={`w-12 h-9 rounded-lg overflow-hidden border shrink-0 transition-all ${
                          formState.image === img.url ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40' : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                        title={img.label}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sommelier Pairing Note */}
                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Sommelier Pairing / Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={formState.pairingNote || ''}
                    onChange={(e) => setFormState(prev => ({ ...prev, pairingNote: e.target.value }))}
                    placeholder="e.g. Vintage Barolo DOCG 2019 or Fresh Mint Citrus Sparkler"
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                {/* Toggles (Chef Special, New, Available, Vegetarian, Gluten Free) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-[#1A1715] border border-white/5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.isChefSpecial || false}
                      onChange={(e) => setFormState(prev => ({ ...prev, isChefSpecial: e.target.checked }))}
                      className="rounded accent-[#C5A059]"
                    />
                    <span className="text-white">Chef's Special</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.isNew || false}
                      onChange={(e) => setFormState(prev => ({ ...prev, isNew: e.target.checked }))}
                      className="rounded accent-[#C5A059]"
                    />
                    <span className="text-white">Mark as New</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.isAvailable !== false}
                      onChange={(e) => setFormState(prev => ({ ...prev, isAvailable: e.target.checked }))}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-white">Available (In Stock)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.isVegetarian || false}
                      onChange={(e) => setFormState(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-[#D6CEBF]">Vegetarian</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.isGlutenFree || false}
                      onChange={(e) => setFormState(prev => ({ ...prev, isGlutenFree: e.target.checked }))}
                      className="rounded accent-amber-500"
                    />
                    <span className="text-[#D6CEBF]">Gluten-Free</span>
                  </label>
                </div>

                {/* Submit & Cancel */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => { setIsAddingNew(false); setEditingItem(null); }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#D6CEBF]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
                  >
                    <Check className="w-4 h-4" />
                    {editingItem ? 'Save Changes' : 'Publish Dish Live'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#14110F] border border-rose-500/40 rounded-2xl p-6 shadow-2xl text-[#F5F2ED]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Delete Menu Dish?</h3>
                  <p className="text-xs text-[#D6CEBF]">
                    This action will immediately remove the dish from the public website.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
