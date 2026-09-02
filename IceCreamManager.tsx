import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { DessertBarItem } from '../../types';
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
  IceCream2, 
  Sparkles, 
  Flame, 
  Snowflake,
  ShieldCheck,
  Award,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IceCreamManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const IceCreamManager: React.FC<IceCreamManagerProps> = ({ onShowToast }) => {
  const { 
    dessertBarItems, 
    addDessertItem, 
    updateDessertItem, 
    deleteDessertItem, 
    duplicateDessertItem, 
    toggleDessertAvailability,
    config 
  } = useRestaurantData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<DessertBarItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DessertBarItem['category']>('ice-creams');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(380);
  const [servingSize, setServingSize] = useState('2 Gourmet Scoops');
  const [flavorNotes, setFlavorNotes] = useState('Rich Belgian Cocoa & Bourbon Vanilla');
  const [temperature, setTemperature] = useState<DessertBarItem['temperature']>('Frost Cold');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isChefSpecial, setIsChefSpecial] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [toppingsInput, setToppingsInput] = useState('Warm Hot Fudge, Crushed Pistachios, Waffle Crisp');

  const currency = config?.currencySymbol || '₨';

  // Quick Preset Flavors
  const applyPreset = (type: 'belgian' | 'sundae' | 'kulfi' | 'mango' | 'cone' | 'tub') => {
    switch (type) {
      case 'belgian':
        setName('Double Belgian Chocolate Artisan Gelato');
        setCategory('ice-creams');
        setDescription('70% dark Belgian cocoa blended into silky churned cream, topped with shaved chocolate curls and roasted hazelnuts.');
        setPrice(420);
        setServingSize('2 Dense Scoops');
        setFlavorNotes('Dark Cocoa, Hazelnut & Velvety Cream');
        setTemperature('Frost Cold');
        setImage('https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80');
        setToppingsInput('Shaved Dark Chocolate, Roasted Hazelnuts, Cocoa Drizzle');
        break;
      case 'sundae':
        setName('Sizzling Skillet Warm Brownie Sundae');
        setCategory('sundaes-warm');
        setDescription('Freshly baked molten dark chocolate brownie on a cast iron sizzler, topped with Madagascar vanilla gelato and hot fudge.');
        setPrice(650);
        setServingSize('Serves 2-3 Persons');
        setFlavorNotes('Warm Molten Fudge, Cold Vanilla & Toasted Pecans');
        setTemperature('Warm & Sizzling');
        setImage('https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80');
        setToppingsInput('Hot Sizzling Fudge, Salted Caramel Sauce, Crushed Walnuts');
        break;
      case 'kulfi':
        setName('Royal Shahi Matka Kulfi Falooda');
        setCategory('falooda-kulfi');
        setDescription('Traditional slow-reduced whole milk kulfi infused with saffron and green cardamom, served over rose vermicelli and basil seeds.');
        setPrice(490);
        setServingSize('1 Traditional Clay Matka');
        setFlavorNotes('Saffron, Cardamom, Rose Syrup & Khoya');
        setTemperature('Frost Cold');
        setImage('https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80');
        setToppingsInput('Crushed Almonds, Sliced Pistachios, Rose Water Syrup, Basil Seeds');
        break;
      case 'mango':
        setName('Chaunsa Mango Swirl Gelato');
        setCategory('ice-creams');
        setDescription('Made from fresh summer Chaunsa mango pulp and sweet cream, finished with mango purée ribbons.');
        setPrice(390);
        setServingSize('2 Generous Scoops');
        setFlavorNotes('Pure Mango Pulp & Honey Cream');
        setTemperature('Frost Cold');
        setImage('https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=600&q=80');
        setToppingsInput('Fresh Mango Compote, Mint Leaves, White Chocolate Curls');
        break;
      case 'cone':
        setName('Artisan Waffle Cone Double Scoop');
        setCategory('ice-creams');
        setDescription('Freshly baked cinnamon-vanilla waffle cone filled with your choice of Cookie & Cream and Roasted Pistachio scoops.');
        setPrice(460);
        setServingSize('1 Giant Waffle Cone');
        setFlavorNotes('Crunchy Waffle, Oreo Crumbs & Pistachio Cream');
        setTemperature('Frost Cold');
        setImage('https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80');
        setToppingsInput('Caramel Drizzle, Rainbow Sprinkles, Waffle Fan');
        break;
      case 'tub':
        setName('Family Feast Ice Cream Party Tub');
        setCategory('ice-creams');
        setDescription('1 Litre insulated family sharing tub of mixed trio flavors (Dark Chocolate, Mango Mania, and Bourbon Vanilla).');
        setPrice(1250);
        setServingSize('1 Litre Tub (Serves 5-6)');
        setFlavorNotes('Trio Gourmet Medley');
        setTemperature('Frost Cold');
        setImage('https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80');
        setToppingsInput('3 Waffle Cones, Chocolate Syrup Bottle, Crushed Nuts Pack');
        break;
    }
  };

  const openNewForm = () => {
    setName('');
    setCategory('ice-creams');
    setDescription('');
    setPrice(380);
    setServingSize('2 Gourmet Scoops');
    setFlavorNotes('Rich Belgian Cocoa & Bourbon Vanilla');
    setTemperature('Frost Cold');
    setImage('https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80');
    setIsAvailable(true);
    setIsChefSpecial(false);
    setIsVegetarian(true);
    setIsGlutenFree(false);
    setToppingsInput('Warm Hot Fudge, Crushed Pistachios');
    setEditingItem(null);
    setIsAddingNew(true);
  };

  const openEditForm = (item: DessertBarItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setDescription(item.description);
    setPrice(item.price);
    setServingSize(item.servingSize);
    setFlavorNotes(item.flavorNotes);
    setTemperature(item.temperature || 'Frost Cold');
    setImage(item.image);
    setIsAvailable(item.isAvailable !== false);
    setIsChefSpecial(!!item.isChefSpecial);
    setIsVegetarian(item.isVegetarian !== false);
    setIsGlutenFree(!!item.isGlutenFree);
    setToppingsInput(item.toppingsIncluded ? item.toppingsIncluded.join(', ') : '');
    setIsAddingNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const toppingsList = toppingsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload: Omit<DessertBarItem, 'id'> = {
      name: name.trim(),
      category,
      description: description.trim(),
      price: Number(price) || 0,
      servingSize: servingSize.trim() || '1 Portion',
      flavorNotes: flavorNotes.trim() || 'Sweet & Creamy',
      temperature,
      image: image.trim() || 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80',
      isAvailable,
      isChefSpecial,
      isVegetarian,
      isGlutenFree,
      toppingsIncluded: toppingsList
    };

    if (editingItem) {
      updateDessertItem(editingItem.id, payload);
      onShowToast('Dessert Updated', `${name} details saved.`, 'gold');
    } else {
      addDessertItem(payload);
      onShowToast('Dessert Added', `${name} is now on the dessert bar menu.`, 'success');
    }

    setIsAddingNew(false);
    setEditingItem(null);
  };

  const handleDuplicate = (item: DessertBarItem) => {
    duplicateDessertItem(item);
    onShowToast('Dessert Duplicated', `Created a copy of ${item.name}.`, 'info');
  };

  const handleDelete = (id: string, itemName: string) => {
    deleteDessertItem(id);
    setDeleteConfirmId(null);
    onShowToast('Dessert Deleted', `${itemName} was removed.`, 'info');
  };

  const filteredItems = dessertBarItems.filter(item => {
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.flavorNotes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterCategory === 'all') return matchesQuery;
    return matchesQuery && item.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            <IceCream2 className="w-4 h-4" />
            <span>Artisan Dessert & Gelato Bar</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white mt-1">Ice Cream, Sundaes, Scoops & Falooda</h2>
          <p className="text-xs text-white/50 mt-1">Manage single/double scoops, warm brownie skillets, family tubs, and custom toppings</p>
        </div>

        <button
          type="button"
          onClick={openNewForm}
          className="btn-gold py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Ice Cream / Dessert</span>
        </button>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ice creams, sundaes, toppings..."
            className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/30 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Desserts' },
            { id: 'ice-creams', label: 'Ice Creams & Scoops' },
            { id: 'sundaes-warm', label: 'Warm Sundaes' },
            { id: 'falooda-kulfi', label: 'Kulfi & Falooda' },
            { id: 'milkshakes', label: 'Dessert Shakes' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'bg-[#181411] text-white/60 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`bg-[#14100D] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all ${
              item.isAvailable === false ? 'opacity-60 border-white/5' : 'border-white/10 hover:border-[#C5A059]/40'
            }`}
          >
            <div>
              <div className="relative h-44 bg-black/40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14100D] via-transparent to-black/40" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/15 text-[10px] font-bold uppercase text-[#C5A059]">
                    {item.category?.replace('-', ' ')}
                  </span>
                  {item.isChefSpecial && (
                    <span className="px-2 py-0.5 rounded-md bg-[#C5A059] text-black text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Chef Pick
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleDessertAvailability(item.id)}
                    title={item.isAvailable !== false ? 'Available' : 'Unavailable'}
                    className={`p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
                      item.isAvailable !== false
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                    }`}
                  >
                    {item.isAvailable !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-[#C5A059]/40 px-2.5 py-1 rounded-lg text-[#C5A059] font-bold text-sm">
                  {currency}{item.price}
                </div>
              </div>

              <div className="p-4 space-y-2.5">
                <div>
                  <h3 className="text-base font-bold text-white font-display">{item.name}</h3>
                  <div className="text-xs text-[#C5A059] font-medium mt-0.5">{item.flavorNotes}</div>
                  <p className="text-xs text-white/50 line-clamp-2 mt-1.5">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-white/60">
                  <span>Portion: <strong className="text-white font-medium">{item.servingSize}</strong></span>
                  <span className="text-[11px] text-[#C5A059]">{item.temperature || 'Frost Cold'}</span>
                </div>

                {item.toppingsIncluded && item.toppingsIncluded.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1">
                    {item.toppingsIncluded.slice(0, 3).map((top, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-white/70 border border-white/5">
                        +{top}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditForm(item)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-[#C5A059]" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicate(item)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="Duplicate Dessert"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {deleteConfirmId === item.id ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.name)}
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
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-1.5 rounded-lg text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Dessert"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-[#14100D] border border-white/5 rounded-2xl">
          <IceCream2 className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-sm text-white/60">No ice creams or desserts match your filter.</p>
        </div>
      )}

      {/* Modal */}
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
                    <IceCream2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-white">
                      {editingItem ? 'Edit Ice Cream / Dessert' : 'Add Ice Cream / Dessert'}
                    </h3>
                    <p className="text-xs text-white/50">Configure flavor profile, portion size, and included toppings</p>
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

              {/* Presets */}
              {!editingItem && (
                <div className="mb-5 p-3 rounded-xl bg-[#181411] border border-white/5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Quick Dessert Presets:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => applyPreset('belgian')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition-colors">Belgian Cocoa Gelato</button>
                    <button type="button" onClick={() => applyPreset('sundae')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition-colors">Sizzling Brownie Sundae</button>
                    <button type="button" onClick={() => applyPreset('kulfi')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition-colors">Matka Kulfi Falooda</button>
                    <button type="button" onClick={() => applyPreset('mango')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition-colors">Chaunsa Mango Swirl</button>
                    <button type="button" onClick={() => applyPreset('cone')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition-colors">Waffle Cone Double</button>
                    <button type="button" onClick={() => applyPreset('tub')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition-colors">Party Tub (1 Litre)</button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Dessert Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Belgian Chocolate Gelato, Molten Brownie Sundae"
                      className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as DessertBarItem['category'])}
                      className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    >
                      <option value="ice-creams">Artisan Ice Creams & Scoops</option>
                      <option value="sundaes-warm">Sundaes & Warm Skillets</option>
                      <option value="falooda-kulfi">Royal Kulfi & Falooda</option>
                      <option value="milkshakes">Dessert Gelato Shakes</option>
                      <option value="cold-refreshers">Cold Refreshers</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Price ({currency}) *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-bold text-[#C5A059]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Serving Portion</label>
                    <input
                      type="text"
                      value={servingSize}
                      onChange={(e) => setServingSize(e.target.value)}
                      placeholder="e.g. 2 Scoops, 1 Skillet, 1L Tub"
                      className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Temperature</label>
                    <select
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value as any)}
                      className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    >
                      <option value="Frost Cold">Frost Cold (-5°C)</option>
                      <option value="Ice Chilled">Ice Chilled (0°C)</option>
                      <option value="Warm & Sizzling">Warm & Sizzling (Skillet)</option>
                      <option value="Velvety Chilled">Velvety Chilled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Flavor Notes</label>
                  <input
                    type="text"
                    value={flavorNotes}
                    onChange={(e) => setFlavorNotes(e.target.value)}
                    placeholder="e.g. 70% Dark Cocoa, Madagascar Bourbon Vanilla"
                    className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Artisan preparation details..."
                    className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">Included Toppings & Garnishes (comma-separated)</label>
                  <input
                    type="text"
                    value={toppingsInput}
                    onChange={(e) => setToppingsInput(e.target.value)}
                    placeholder="e.g. Hot Fudge, Crushed Pistachios, Roasted Pecans, Waffle Crisp"
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
                      checked={isChefSpecial}
                      onChange={(e) => setIsChefSpecial(e.target.checked)}
                      className="accent-[#C5A059] w-4 h-4 rounded"
                    />
                    <span>Chef's Signature Pick</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVegetarian}
                      onChange={(e) => setIsVegetarian(e.target.checked)}
                      className="accent-[#C5A059] w-4 h-4 rounded"
                    />
                    <span>100% Vegetarian</span>
                  </label>
                </div>

                {/* Action Buttons */}
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
                    <span>{editingItem ? 'Save Changes' : 'Add to Dessert Menu'}</span>
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
