import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { SoftDrinkItem, SoftDrinkPackagingOption } from '../../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  CupSoda, 
  Coffee, 
  Sparkles, 
  Flame, 
  Snowflake,
  ShieldCheck,
  GlassWater,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SoftDrinksManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const SoftDrinksManager: React.FC<SoftDrinksManagerProps> = ({ onShowToast }) => {
  const { 
    softDrinks, 
    addSoftDrink, 
    updateSoftDrink, 
    deleteSoftDrink, 
    toggleSoftDrinkAvailability,
    config 
  } = useRestaurantData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingDrink, setEditingDrink] = useState<SoftDrinkItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [flavor, setFlavor] = useState('');
  const [drinkType, setDrinkType] = useState<SoftDrinkItem['drinkType']>('cold_soda');
  const [description, setDescription] = useState('');
  const [servingTemp, setServingTemp] = useState('Chilled (2°C - 4°C)');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isHalal, setIsHalal] = useState(true);
  const [packagingOptions, setPackagingOptions] = useState<SoftDrinkPackagingOption[]>([
    { id: 'opt-1', label: '250ml Slim Can', volumeMl: 250, packagingType: 'can', price: 160, isDefault: false },
    { id: 'opt-2', label: '345ml Glass Bottle', volumeMl: 345, packagingType: 'glass_bottle', price: 190, isDefault: true },
    { id: 'opt-3', label: '500ml PET Bottle', volumeMl: 500, packagingType: 'pet_bottle', price: 240, isDefault: false },
    { id: 'opt-4', label: '1.5L Family Sharing', volumeMl: 1500, packagingType: 'family_pet', price: 420, isDefault: false }
  ]);

  const currency = config?.currencySymbol || '₨';

  // Preset quick-fills
  const applyPreset = (preset: 'cola' | 'chai' | 'lemonade' | 'shake' | 'kashmiri' | 'water') => {
    switch (preset) {
      case 'cola':
        setName('Vintage Ember Craft Cola');
        setFlavor('Classic Caramel & Botanical Citrus');
        setDrinkType('cold_soda');
        setDescription('Ice-cold sparkling cola infused with organic cane sugar and subtle hints of warm cinnamon and clove.');
        setServingTemp('Ice Cold (1°C)');
        setImage('https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80');
        setPackagingOptions([
          { id: 'opt-1', label: '250ml Slim Can', volumeMl: 250, packagingType: 'can', price: 160, isDefault: false },
          { id: 'opt-2', label: '345ml Glass Bottle', volumeMl: 345, packagingType: 'glass_bottle', price: 190, isDefault: true },
          { id: 'opt-3', label: '500ml PET Bottle', volumeMl: 500, packagingType: 'pet_bottle', price: 240, isDefault: false },
          { id: 'opt-4', label: '1.5L Family Sharing', volumeMl: 1500, packagingType: 'family_pet', price: 420, isDefault: false }
        ]);
        break;
      case 'chai':
        setName('Royal Karak Doodh Patti Chai');
        setFlavor('Cardamom, Saffron & Pure Buffalo Milk');
        setDrinkType('hot_tea');
        setDescription('Slow-simmered over live charcoal with crushed green cardamoms and rich full-cream milk.');
        setServingTemp('Piping Hot (85°C)');
        setImage('https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80');
        setPackagingOptions([
          { id: 'opt-1', label: 'Traditional Clay Matka Cup', volumeMl: 200, packagingType: 'cup', price: 180, isDefault: true },
          { id: 'opt-2', label: 'Double Ceramic Mug', volumeMl: 350, packagingType: 'cup', price: 280, isDefault: false },
          { id: 'opt-3', label: 'Insulated Flask (Serves 4)', volumeMl: 800, packagingType: 'dispenser', price: 650, isDefault: false }
        ]);
        break;
      case 'lemonade':
        setName('Fresh Mint Lemonade Cooler');
        setFlavor('Crushed Mint Leaves & Fresh Lemon Juice');
        setDrinkType('fresh_cooler');
        setDescription('Freshly squeezed lemons muddled with aromatic mountain mint and crushed glacier ice.');
        setServingTemp('Frosty Sub-Zero (0°C)');
        setImage('https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80');
        setPackagingOptions([
          { id: 'opt-1', label: 'Regular Tall Glass', volumeMl: 350, packagingType: 'cup', price: 290, isDefault: true },
          { id: 'opt-2', label: 'Large Mason Jar', volumeMl: 500, packagingType: 'cup', price: 390, isDefault: false },
          { id: 'opt-3', label: 'Family Pitcher (1.2L)', volumeMl: 1200, packagingType: 'dispenser', price: 790, isDefault: false }
        ]);
        break;
      case 'shake':
        setName('Belgian Chocolate Oreo Gourmet Shake');
        setFlavor('Dark Cocoa, Crushed Oreos & Gelato');
        setDrinkType('gourmet_shake');
        setDescription('Creamy hand-spun milkshake loaded with premium chocolate gelato and topped with whipped foam.');
        setServingTemp('Thick Chilled (-2°C)');
        setImage('https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80');
        setPackagingOptions([
          { id: 'opt-1', label: 'Standard Shake Cup', volumeMl: 350, packagingType: 'cup', price: 490, isDefault: true },
          { id: 'opt-2', label: 'Grand Deluxe Jar', volumeMl: 550, packagingType: 'cup', price: 690, isDefault: false }
        ]);
        break;
      case 'kashmiri':
        setName('Kashmiri Pink Chai (Noon Chai)');
        setFlavor('Pistachio, Almond & Himalayan Salt');
        setDrinkType('hot_tea');
        setDescription('Brewed for hours to natural rosy hue, garnished with sliced pistachios and crushed green almonds.');
        setServingTemp('Hot (80°C)');
        setImage('https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80');
        setPackagingOptions([
          { id: 'opt-1', label: 'Clay Khulhar Cup', volumeMl: 220, packagingType: 'cup', price: 240, isDefault: true },
          { id: 'opt-2', label: 'Royal Gold Rim Mug', volumeMl: 360, packagingType: 'cup', price: 360, isDefault: false }
        ]);
        break;
      case 'water':
        setName('Himalayan Natural Mineral Water');
        setFlavor('Pure Natural Spring Water');
        setDrinkType('mineral_water');
        setDescription('Naturally filtered glacial spring water with essential electrolytes and pure clean taste.');
        setServingTemp('Chilled or Ambient');
        setImage('https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80');
        setPackagingOptions([
          { id: 'opt-1', label: '500ml Compact Bottle', volumeMl: 500, packagingType: 'pet_bottle', price: 90, isDefault: true },
          { id: 'opt-2', label: '1.5L Family Bottle', volumeMl: 1500, packagingType: 'family_pet', price: 160, isDefault: false }
        ]);
        break;
    }
  };

  const openNewForm = () => {
    setName('');
    setFlavor('');
    setDrinkType('cold_soda');
    setDescription('');
    setServingTemp('Chilled (2°C - 4°C)');
    setImage('https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80');
    setIsAvailable(true);
    setIsFeatured(false);
    setIsHalal(true);
    setPackagingOptions([
      { id: 'opt-1', label: '250ml Slim Can', volumeMl: 250, packagingType: 'can', price: 160, isDefault: false },
      { id: 'opt-2', label: '345ml Glass Bottle', volumeMl: 345, packagingType: 'glass_bottle', price: 190, isDefault: true },
      { id: 'opt-3', label: '500ml PET Bottle', volumeMl: 500, packagingType: 'pet_bottle', price: 240, isDefault: false },
      { id: 'opt-4', label: '1.5L Family Sharing', volumeMl: 1500, packagingType: 'family_pet', price: 420, isDefault: false }
    ]);
    setEditingDrink(null);
    setIsAddingNew(true);
  };

  const openEditForm = (drink: SoftDrinkItem) => {
    setEditingDrink(drink);
    setName(drink.name);
    setFlavor(drink.flavor);
    setDrinkType(drink.drinkType || 'cold_soda');
    setDescription(drink.description);
    setServingTemp(drink.servingTemperature || 'Chilled');
    setImage(drink.image);
    setIsAvailable(drink.isAvailable !== false);
    setIsFeatured(!!drink.isFeatured);
    setIsHalal(drink.isHalalCertified !== false);
    setPackagingOptions(drink.packagingOptions && drink.packagingOptions.length > 0 ? drink.packagingOptions : [
      { id: 'opt-1', label: '345ml Glass Bottle', volumeMl: 345, packagingType: 'glass_bottle', price: 190, isDefault: true }
    ]);
    setIsAddingNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const drinkPayload: Omit<SoftDrinkItem, 'id'> = {
      name: name.trim(),
      brand: name.trim(),
      category: 'carbonated',
      flavorProfile: flavor.trim() || 'Classic Refreshment',
      flavor: flavor.trim() || 'Classic Refreshment',
      drinkType,
      description: description.trim(),
      temperature: (servingTemp.includes('Ice') ? 'Ice Cold' : 'Chilled') as any,
      servingTemperature: servingTemp.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
      isAvailable,
      isFeatured,
      isHalalCertified: isHalal,
      sizes: packagingOptions,
      packagingOptions
    };

    if (editingDrink) {
      updateSoftDrink(editingDrink.id, drinkPayload);
      onShowToast('Beverage Updated', `${name} details have been saved.`, 'gold');
    } else {
      addSoftDrink(drinkPayload);
      onShowToast('Beverage Added', `${name} has been added to the drinks menu.`, 'success');
    }

    setIsAddingNew(false);
    setEditingDrink(null);
  };

  const handleDuplicate = (drink: SoftDrinkItem) => {
    const opts = drink.packagingOptions || drink.sizes || [];
    const copyData: Omit<SoftDrinkItem, 'id'> = {
      ...drink,
      name: `${drink.name} (Copy)`,
      sizes: opts.map(p => ({ ...p, id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 3)}` })),
      packagingOptions: opts.map(p => ({ ...p, id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 3)}` }))
    };
    addSoftDrink(copyData);
    onShowToast('Beverage Duplicated', `Created a copy of ${drink.name}.`, 'info');
  };

  const handleDelete = (id: string, drinkName: string) => {
    deleteSoftDrink(id);
    setDeleteConfirmId(null);
    onShowToast('Beverage Removed', `${drinkName} was deleted from database.`, 'info');
  };

  // Packaging option helpers
  const handleAddOption = () => {
    const newOpt: SoftDrinkPackagingOption = {
      id: `opt-${Date.now()}`,
      label: 'New Size / Packaging',
      volumeMl: 350,
      packagingType: 'can',
      price: 200,
      isDefault: packagingOptions.length === 0
    };
    setPackagingOptions([...packagingOptions, newOpt]);
  };

  const handleUpdateOption = (index: number, updates: Partial<SoftDrinkPackagingOption>) => {
    setPackagingOptions(prev => prev.map((opt, i) => i === index ? { ...opt, ...updates } : opt));
  };

  const handleRemoveOption = (index: number) => {
    if (packagingOptions.length <= 1) return;
    setPackagingOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetDefaultOption = (index: number) => {
    setPackagingOptions(prev => prev.map((opt, i) => ({
      ...opt,
      isDefault: i === index
    })));
  };

  const filteredDrinks = softDrinks.filter(drink => {
    const matchesQuery = drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drink.flavor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drink.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesQuery;
    return matchesQuery && drink.drinkType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            <CupSoda className="w-4 h-4" />
            <span>Beverage Bar Management</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white mt-1">Drinks, Sodas, Hot Chai & Fresh Coolers</h2>
          <p className="text-xs text-white/50 mt-1">Manage packaging options (Can, Glass, PET, Matka Cup) with individual pricing</p>
        </div>

        <button
          type="button"
          onClick={openNewForm}
          className="btn-gold py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Beverage</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search beverages by name, flavor, or packaging..."
            className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/30 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Drinks' },
            { id: 'cold_soda', label: 'Cold Sodas' },
            { id: 'hot_tea', label: 'Chai & Tea' },
            { id: 'hot_coffee', label: 'Coffee' },
            { id: 'fresh_cooler', label: 'Fresh Juices' },
            { id: 'gourmet_shake', label: 'Shakes' },
            { id: 'mineral_water', label: 'Water' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'bg-[#181411] text-white/60 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drinks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDrinks.map(drink => (
          <div
            key={drink.id}
            className={`bg-[#14100D] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all ${
              drink.isAvailable === false ? 'opacity-60 border-white/5' : 'border-white/10 hover:border-[#C5A059]/40'
            }`}
          >
            {/* Image & Header */}
            <div>
              <div className="relative h-44 bg-black/40 overflow-hidden">
                <img
                  src={drink.image}
                  alt={drink.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14100D] via-transparent to-black/40" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/15 text-[10px] font-bold uppercase text-[#C5A059]">
                    {drink.drinkType?.replace('_', ' ') || 'Drink'}
                  </span>
                  {drink.isHalalCertified !== false && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5" /> 100% Halal
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleSoftDrinkAvailability(drink.id)}
                    title={drink.isAvailable !== false ? 'Currently Available' : 'Currently Unavailable'}
                    className={`p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
                      drink.isAvailable !== false
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                    }`}
                  >
                    {drink.isAvailable !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white font-display">{drink.name}</h3>
                  <div className="text-xs text-[#C5A059] font-medium mt-0.5">{drink.flavor}</div>
                  <p className="text-xs text-white/50 line-clamp-2 mt-1.5">{drink.description}</p>
                </div>

                {/* Packaging Sizes Stack */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Available Sizes & Prices:</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(drink.packagingOptions || drink.sizes || []).map((opt, idx) => (
                      <div
                        key={opt.id || idx}
                        className={`p-2 rounded-lg border text-xs flex flex-col justify-between ${
                          opt.isDefault
                            ? 'bg-[#C5A059]/10 border-[#C5A059]/40 text-white'
                            : 'bg-white/5 border-white/5 text-white/80'
                        }`}
                      >
                        <div className="font-semibold truncate text-[11px]">{opt.label || opt.size}</div>
                        <div className="text-[#C5A059] font-bold text-xs mt-1">
                          {currency}{opt.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditForm(drink)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-[#C5A059]" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicate(drink)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="Duplicate Beverage"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {deleteConfirmId === drink.id ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDelete(drink.id, drink.name)}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(null)}
                    className="p-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(drink.id)}
                  className="p-1.5 rounded-lg text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Beverage"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredDrinks.length === 0 && (
        <div className="text-center py-16 bg-[#14100D] border border-white/5 rounded-2xl">
          <CupSoda className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-sm text-white/60">No beverages match your search or filter.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isAddingNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingNew(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-[#14100D] border border-[#C5A059]/40 rounded-2xl shadow-2xl p-6 overflow-y-auto text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
                    <CupSoda className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-white">
                      {editingDrink ? 'Edit Beverage Item' : 'Add New Beverage'}
                    </h3>
                    <p className="text-xs text-white/50">Configure drink info, temperature and size packaging</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Presets Row */}
              {!editingDrink && (
                <div className="mb-5 p-3 rounded-xl bg-[#181411] border border-white/5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Quick Drink Presets:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => applyPreset('cola')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition-colors">Vintage Cola</button>
                    <button type="button" onClick={() => applyPreset('chai')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition-colors">Karak Doodh Patti</button>
                    <button type="button" onClick={() => applyPreset('lemonade')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition-colors">Mint Lemonade</button>
                    <button type="button" onClick={() => applyPreset('shake')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition-colors">Oreo Shake</button>
                    <button type="button" onClick={() => applyPreset('kashmiri')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition-colors">Pink Kashmiri Chai</button>
                    <button type="button" onClick={() => applyPreset('water')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition-colors">Mineral Water</button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Beverage Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Royal Karak Chai, Vintage Cola"
                      className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Flavor / Aroma Subtitle</label>
                    <input
                      type="text"
                      value={flavor}
                      onChange={(e) => setFlavor(e.target.value)}
                      placeholder="e.g. Cardamom, Saffron & Pure Buffalo Milk"
                      className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Category Type</label>
                    <select
                      value={drinkType}
                      onChange={(e) => setDrinkType(e.target.value as SoftDrinkItem['drinkType'])}
                      className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    >
                      <option value="cold_soda">Cold Soda / Fizzy Soft Drink</option>
                      <option value="hot_tea">Hot Chai & Specialty Tea</option>
                      <option value="hot_coffee">Hot Gourmet Coffee</option>
                      <option value="fresh_cooler">Fresh Juice & Fruit Cooler</option>
                      <option value="gourmet_shake">Gelato Milkshake</option>
                      <option value="mineral_water">Pure Mineral Water</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Serving Temperature Note</label>
                    <input
                      type="text"
                      value={servingTemp}
                      onChange={(e) => setServingTemp(e.target.value)}
                      placeholder="e.g. Ice Cold (2°C) or Piping Hot (85°C)"
                      className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Brief description of brewing method, taste profile and ingredients..."
                    className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Image URL</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>

                {/* Packaging Sizes Builder */}
                <div className="p-4 rounded-xl bg-[#181411] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-white">Packaging & Size Options</div>
                      <div className="text-[11px] text-white/50">Each option represents a selectable box on customer site</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="px-2.5 py-1 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#E5C158] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Size
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {packagingOptions.map((opt, idx) => (
                      <div key={opt.id || idx} className="p-3 rounded-lg bg-[#14100D] border border-white/5 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                        <div className="sm:col-span-4">
                          <label className="block text-[10px] text-white/40 uppercase mb-0.5">Label</label>
                          <input
                            type="text"
                            value={opt.label}
                            onChange={(e) => handleUpdateOption(idx, { label: e.target.value })}
                            placeholder="e.g. 345ml Glass Bottle"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] text-white/40 uppercase mb-0.5">Packaging Type</label>
                          <select
                            value={opt.packagingType || 'can'}
                            onChange={(e) => handleUpdateOption(idx, { packagingType: e.target.value as any })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                          >
                            <option value="can">Can</option>
                            <option value="glass_bottle">Glass Bottle</option>
                            <option value="pet_bottle">PET Bottle</option>
                            <option value="family_pet">Family PET</option>
                            <option value="cup">Cup / Mug</option>
                            <option value="dispenser">Dispenser / Flask</option>
                          </select>
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] text-white/40 uppercase mb-0.5">Price ({currency})</label>
                          <input
                            type="number"
                            value={opt.price}
                            onChange={(e) => handleUpdateOption(idx, { price: Number(e.target.value) || 0 })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-bold text-[#C5A059]"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-end gap-1.5 pt-4 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => handleSetDefaultOption(idx)}
                            title="Set as Default Pre-selected"
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                              opt.isDefault
                                ? 'bg-[#C5A059] text-black'
                                : 'bg-white/5 text-white/50 hover:text-white'
                            }`}
                          >
                            {opt.isDefault ? 'Default' : 'Set Default'}
                          </button>
                          {packagingOptions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(idx)}
                              className="p-1.5 rounded-lg text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="accent-[#C5A059] w-4 h-4 rounded"
                    />
                    <span>Available in Live Menu</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isHalal}
                      onChange={(e) => setIsHalal(e.target.checked)}
                      className="accent-[#C5A059] w-4 h-4 rounded"
                    />
                    <span>100% Halal Certified</span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold py-2.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingDrink ? 'Save Changes' : 'Create Beverage'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
