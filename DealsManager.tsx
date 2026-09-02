import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { DealItem, DealIncludedProduct } from '../../types';
import { 
  Plus, 
  Tag, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Check, 
  X, 
  Copy,
  ArrowUp,
  ArrowDown,
  Star,
  Eye,
  EyeOff,
  ShoppingBag,
  Users,
  Percent,
  Search,
  Package,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DealsManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const DealsManager: React.FC<DealsManagerProps> = ({ onShowToast }) => {
  const { 
    deals, 
    addDeal, 
    updateDeal, 
    deleteDeal, 
    duplicateDeal, 
    toggleDealAvailability, 
    toggleDealFeatured, 
    reorderDeals,
    menuItems,
    config
  } = useRestaurantData();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingDeal, setEditingDeal] = useState<DealItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DealItem['category']>('family');
  const [originalPrice, setOriginalPrice] = useState<number>(3500);
  const [discountedPrice, setDiscountedPrice] = useState<number>(2999);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80');
  const [servingSize, setServingSize] = useState('4-5 Persons');
  const [badge, setBadge] = useState('Family Saver');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [includedItems, setIncludedItems] = useState<DealIncludedProduct[]>([
    { productName: 'Chicken Karahi Full', quantity: 1, note: '1kg' },
    { productName: 'Seekh Kabab', quantity: 4 },
    { productName: 'Roghni Naan', quantity: 4 },
    { productName: 'Pepsi 1.5L', quantity: 1 }
  ]);

  // Quick Preset Templates
  const applyPreset = (type: 'family' | 'couple' | 'friends' | 'single' | 'party' | 'kids') => {
    switch (type) {
      case 'family':
        setName('Family Feast Package');
        setTagline('Grand dinner for the whole family');
        setDescription('1 Full Chicken Karahi, 4 Mutton Seekh Kababs, 4 Fresh Roghni Naans, Mint Raita, Fresh Salad, and 1.5L Chilled Soft Drink.');
        setCategory('family');
        setOriginalPrice(3800);
        setDiscountedPrice(2999);
        setServingSize('4-5 Persons');
        setBadge('Best Family Value');
        setImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80');
        setIncludedItems([
          { productName: 'Chicken Karahi (Full)', quantity: 1 },
          { productName: 'Seekh Kabab', quantity: 4 },
          { productName: 'Roghni Naan', quantity: 4 },
          { productName: 'Fresh Salad & Raita', quantity: 1 },
          { productName: 'Pepsi 1.5L', quantity: 1 }
        ]);
        break;
      case 'couple':
        setName('Couple Special Combo');
        setTagline('Romantic candlelit dinner combo');
        setDescription('Half Chicken Makhni Handi, 2 Reshmi Kababs, 2 Garlic Butter Naans, and 2 Gourmet Milkshakes.');
        setCategory('couple');
        setOriginalPrice(2200);
        setDiscountedPrice(1750);
        setServingSize('2 Persons');
        setBadge('Couple Favorite');
        setImage('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80');
        setIncludedItems([
          { productName: 'Chicken Handi (Half)', quantity: 1 },
          { productName: 'Reshmi Kabab', quantity: 2 },
          { productName: 'Garlic Naan', quantity: 2 },
          { productName: 'Gourmet Shake / Drink', quantity: 2 }
        ]);
        break;
      case 'friends':
        setName('Friends BBQ Hangout');
        setTagline('Spicy grill platter for friends group');
        setDescription('Malai Boti 8pcs, Seekh Kabab 4pcs, Wings 6pcs, 4 Roghni Naan, and 1.5L Drink.');
        setCategory('friends');
        setOriginalPrice(3200);
        setDiscountedPrice(2599);
        setServingSize('3-4 Persons');
        setBadge('Hot Seller');
        setImage('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80');
        setIncludedItems([
          { productName: 'Malai Boti (8 Pcs)', quantity: 1 },
          { productName: 'Seekh Kabab (4 Pcs)', quantity: 1 },
          { productName: 'BBQ Wings', quantity: 6 },
          { productName: 'Roghni Naan', quantity: 4 },
          { productName: 'Soft Drink 1.5L', quantity: 1 }
        ]);
        break;
      case 'single':
        setName('Solo Deluxe Meal');
        setTagline('Quick, hearty lunch or dinner for one');
        setDescription('1 Gourmet Smash Burger, Loaded Cheesy Fries, and 1 Chilled Soft Drink 345ml.');
        setCategory('single');
        setOriginalPrice(1100);
        setDiscountedPrice(850);
        setServingSize('1 Person');
        setBadge('Solo Saver');
        setImage('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80');
        setIncludedItems([
          { productName: 'Ember Smash Burger', quantity: 1 },
          { productName: 'Seasoned Fries', quantity: 1 },
          { productName: 'Bottled Drink 345ml', quantity: 1 }
        ]);
        break;
      case 'party':
        setName('Grand Mega Party Feast');
        setTagline('Ideal for celebrations & large gatherings');
        setDescription('2 Full Chicken Karahi, 12 Seekh Kababs, 10 Roghni Naans, 2 Large Soft Drinks & Kulfi Dessert.');
        setCategory('party');
        setOriginalPrice(7500);
        setDiscountedPrice(5999);
        setServingSize('8-10 Persons');
        setBadge('Party Mega Deal');
        setImage('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80');
        setIncludedItems([
          { productName: 'Chicken Karahi Full', quantity: 2 },
          { productName: 'Seekh Kabab Platter', quantity: 12 },
          { productName: 'Fresh Roghni Naan', quantity: 10 },
          { productName: 'Soft Drink 1.5L', quantity: 2 },
          { productName: 'Traditional Kulfi', quantity: 4 }
        ]);
        break;
      case 'kids':
        setName('Junior Kids Meal Box');
        setTagline('Fun mild meal loved by children');
        setDescription('Crispy Chicken Nuggets (6pcs), Curly Fries, Fresh Juice & Toy Mascot Sticker.');
        setCategory('kids');
        setOriginalPrice(750);
        setDiscountedPrice(550);
        setServingSize('1 Child');
        setBadge('Kids Favorite');
        setImage('https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80');
        setIncludedItems([
          { productName: 'Crispy Nuggets (6 Pcs)', quantity: 1 },
          { productName: 'Curly Fries', quantity: 1 },
          { productName: 'Fresh Mango / Apple Juice', quantity: 1 }
        ]);
        break;
    }
  };

  const handleOpenAdd = () => {
    setName('');
    setTagline('');
    setDescription('');
    setCategory('family');
    setOriginalPrice(3200);
    setDiscountedPrice(2499);
    setServingSize('3-4 Persons');
    setBadge('Value Deal');
    setImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80');
    setIsAvailable(true);
    setIsFeatured(true);
    setIncludedItems([
      { productName: 'Chicken Karahi Half', quantity: 1 },
      { productName: 'Roghni Naan', quantity: 2 },
      { productName: 'Cold Drink 1.5L', quantity: 1 }
    ]);
    setIsAddingNew(true);
    setEditingDeal(null);
  };

  const handleOpenEdit = (deal: DealItem) => {
    setEditingDeal(deal);
    setName(deal.name);
    setTagline(deal.tagline || '');
    setDescription(deal.description);
    setCategory(deal.category || 'family');
    setOriginalPrice(deal.originalPrice || deal.price || 0);
    setDiscountedPrice(deal.price || deal.discountedPrice || 0);
    setServingSize(deal.serves || deal.servingSize || '2-3 Persons');
    setBadge(deal.badge || '');
    setImage(deal.image);
    setIsAvailable(deal.isAvailable !== false);
    setIsFeatured(deal.isFeatured || false);
    setIncludedItems(deal.includedItems && deal.includedItems.length > 0 ? deal.includedItems.map(i => ({
      productName: i.productName || i.name || '',
      quantity: i.quantity || 1,
      note: i.note
    })) : [
      { productName: 'Deal Included Item', quantity: 1 }
    ]);
    setIsAddingNew(false);
  };

  const handleAddIncludedItem = () => {
    setIncludedItems(prev => [...prev, { productName: '', quantity: 1 }]);
  };

  const handleRemoveIncludedItem = (index: number) => {
    setIncludedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateIncludedItem = (index: number, field: string, value: any) => {
    setIncludedItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      onShowToast('Missing Required Fields', 'Please provide a deal name and description.', 'info');
      return;
    }
    if (discountedPrice <= 0) {
      onShowToast('Invalid Price', 'Discounted deal price must be greater than 0.', 'info');
      return;
    }

    const cleanedItems = includedItems
      .filter(item => (item.productName || item.name || '').trim().length > 0)
      .map(item => ({
        name: (item.productName || item.name || '').trim(),
        productName: (item.productName || item.name || '').trim(),
        quantity: item.quantity || 1,
        note: item.note
      }));

    if (cleanedItems.length === 0) {
      onShowToast('Missing Included Products', 'Please add at least 1 included product in this deal combo.', 'info');
      return;
    }

    const payload = {
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      category,
      price: Number(discountedPrice),
      discountedPrice: Number(discountedPrice),
      originalPrice: Number(originalPrice) || Number(discountedPrice),
      serves: servingSize.trim(),
      servingSize: servingSize.trim(),
      badge: badge.trim(),
      image: image.trim(),
      isAvailable,
      isFeatured,
      includedItems: cleanedItems
    };

    if (editingDeal) {
      updateDeal(editingDeal.id, payload);
      onShowToast('Deal Updated Successfully', `${name} modified live.`, 'success');
      setEditingDeal(null);
    } else {
      addDeal(payload);
      onShowToast('New Deal Created', `${name} is now live on the Meals & Deals section.`, 'gold');
      setIsAddingNew(false);
    }
  };

  const handleDuplicate = (id: string, dealName: string) => {
    duplicateDeal(id);
    onShowToast('Deal Duplicated', `Created a copy of ${dealName}.`, 'info');
  };

  const handleDelete = (id: string, dealName: string) => {
    deleteDeal(id);
    setDeleteConfirmId(null);
    onShowToast('Deal Deleted', `${dealName} was removed.`, 'info');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < deals.length) {
      reorderDeals(index, targetIndex);
      onShowToast('Deals Reordered', 'Updated display sequence on live website.', 'info');
    }
  };

  // Filtered List
  const filteredDeals = deals.filter(deal => {
    if (filterCategory !== 'all' && deal.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        deal.name.toLowerCase().includes(q) ||
        deal.description.toLowerCase().includes(q) ||
        (deal.badge && deal.badge.toLowerCase().includes(q)) ||
        deal.includedItems.some(i => i.productName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const curr = config.currencySymbol || '₨';

  return (
    <div className="space-y-6">
      {/* Header Banner & Stats */}
      <div className="bg-gradient-to-r from-[#20150d] via-[#1a110a] to-[#120b07] p-5 sm:p-6 rounded-2xl border border-[#d4af37]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 shadow-md">
              <Package className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#fdfbf7]">
              Meals &amp; Deals Manager
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
              {deals.length} Active Deals
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#a89d8f] mt-1 max-w-2xl">
            Create, edit, price, and customize restaurant meal packages (Family Deals, Couple Combos, Friends BBQ Feasts, Solo Packs). Fully connected to Live Menu, Online Ordering, and AI Assistant.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Deal</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#150e09] p-3 rounded-xl border border-[#2b1d12]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8e8272]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals by name, included items or badge..."
            className="w-full bg-[#100a06] border border-[#2e1f14] focus:border-[#d4af37] text-xs text-[#fdfbf7] pl-9 pr-3 py-2 rounded-lg focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {[
            { id: 'all', label: 'All Deals' },
            { id: 'family', label: '👨‍👩‍👧‍👦 Family' },
            { id: 'couple', label: '💑 Couple' },
            { id: 'friends', label: '👥 Friends' },
            { id: 'single', label: '🍔 Solo' },
            { id: 'party', label: '🎉 Party' },
            { id: 'kids', label: '👶 Kids' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-[#d4af37] text-[#120b07] font-bold shadow-md shadow-[#d4af37]/20'
                  : 'bg-[#1e130b] text-[#a89d8f] border border-[#2f2015] hover:text-[#fdfbf7]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Create / Edit Deal Drawer Modal */}
      <AnimatePresence>
        {(isAddingNew || editingDeal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#18110b] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#281a10] to-[#160f0a] border-b border-[#302115] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#d4af37]/20 text-[#d4af37]">
                    <Tag className="w-4 h-4" />
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#fdfbf7]">
                    {editingDeal ? `Edit Deal: ${editingDeal.name}` : 'Create New Meal Deal / Combo'}
                  </h3>
                </div>
                <button
                  onClick={() => { setIsAddingNew(false); setEditingDeal(null); }}
                  className="p-1.5 rounded-lg text-[#8e8272] hover:text-[#fdfbf7] hover:bg-[#251910] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {/* Quick Presets (Only when adding) */}
                {isAddingNew && (
                  <div className="p-3 rounded-xl bg-[#120b07] border border-[#2b1d12] space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Quick Template Presets
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => applyPreset('family')}
                        className="px-2.5 py-1 rounded-md bg-[#251910] hover:bg-[#d4af37]/20 border border-[#3d2a1c] hover:border-[#d4af37] text-[11px] text-[#fdfbf7] font-semibold transition-all cursor-pointer"
                      >
                        👨‍👩‍👧‍👦 Family Feast
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset('couple')}
                        className="px-2.5 py-1 rounded-md bg-[#251910] hover:bg-[#d4af37]/20 border border-[#3d2a1c] hover:border-[#d4af37] text-[11px] text-[#fdfbf7] font-semibold transition-all cursor-pointer"
                      >
                        💑 Couple Special
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset('friends')}
                        className="px-2.5 py-1 rounded-md bg-[#251910] hover:bg-[#d4af37]/20 border border-[#3d2a1c] hover:border-[#d4af37] text-[11px] text-[#fdfbf7] font-semibold transition-all cursor-pointer"
                      >
                        👥 Friends BBQ
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset('single')}
                        className="px-2.5 py-1 rounded-md bg-[#251910] hover:bg-[#d4af37]/20 border border-[#3d2a1c] hover:border-[#d4af37] text-[11px] text-[#fdfbf7] font-semibold transition-all cursor-pointer"
                      >
                        🍔 Solo Meal
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset('party')}
                        className="px-2.5 py-1 rounded-md bg-[#251910] hover:bg-[#d4af37]/20 border border-[#3d2a1c] hover:border-[#d4af37] text-[11px] text-[#fdfbf7] font-semibold transition-all cursor-pointer"
                      >
                        🎉 Mega Party
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset('kids')}
                        className="px-2.5 py-1 rounded-md bg-[#251910] hover:bg-[#d4af37]/20 border border-[#3d2a1c] hover:border-[#d4af37] text-[11px] text-[#fdfbf7] font-semibold transition-all cursor-pointer"
                      >
                        👶 Kids Box
                      </button>
                    </div>
                  </div>
                )}

                {/* Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#fdfbf7] mb-1">
                      Deal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Royal Family Karahi Feast"
                      className="w-full bg-[#100a06] border border-[#2f2015] focus:border-[#d4af37] text-xs text-[#fdfbf7] px-3 py-2 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#fdfbf7] mb-1">
                      Tagline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Best for 4-5 Persons Dinner"
                      className="w-full bg-[#100a06] border border-[#2f2015] focus:border-[#d4af37] text-xs text-[#fdfbf7] px-3 py-2 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category & Badge & Serving Size */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#fdfbf7] mb-1">
                      Category Type
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-[#100a06] border border-[#2f2015] focus:border-[#d4af37] text-xs text-[#d4af37] px-3 py-2 rounded-lg focus:outline-none"
                    >
                      <option value="family">Family Deal</option>
                      <option value="couple">Couple Deal</option>
                      <option value="friends">Friends Deal</option>
                      <option value="single">Single Deal</option>
                      <option value="party">Party Deal</option>
                      <option value="kids">Kids Deal</option>
                      <option value="custom">Custom Deal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#fdfbf7] mb-1">
                      Serving Size
                    </label>
                    <input
                      type="text"
                      value={servingSize}
                      onChange={(e) => setServingSize(e.target.value)}
                      placeholder="e.g. 4-5 Persons"
                      className="w-full bg-[#100a06] border border-[#2f2015] focus:border-[#d4af37] text-xs text-[#fdfbf7] px-3 py-2 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#fdfbf7] mb-1">
                      Promotional Badge
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="e.g. 25% OFF / Best Seller"
                      className="w-full bg-[#100a06] border border-[#2f2015] focus:border-[#d4af37] text-xs text-[#fdfbf7] px-3 py-2 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#fdfbf7] mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what makes this deal special..."
                    className="w-full bg-[#100a06] border border-[#2f2015] focus:border-[#d4af37] text-xs text-[#fdfbf7] px-3 py-2 rounded-lg focus:outline-none"
                  />
                </div>

                {/* Pricing & Savings calculation */}
                <div className="p-3 rounded-xl bg-[#120b07] border border-[#2b1d12] grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-semibold text-[#a89d8f] mb-1">
                      Original Value ({curr})
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full bg-[#100a06] border border-[#2f2015] text-xs text-[#a89d8f] px-3 py-1.5 rounded-lg line-through"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#d4af37] mb-1">
                      Deal Price ({curr}) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={discountedPrice}
                      onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                      className="w-full bg-[#100a06] border border-[#d4af37] text-sm font-bold text-[#d4af37] px-3 py-1.5 rounded-lg"
                    />
                  </div>

                  <div className="text-right sm:text-center p-2 rounded-lg bg-[#1a110a] border border-[#352316]">
                    <span className="text-[10px] text-[#8e8272] uppercase tracking-wider block">
                      Customer Saves
                    </span>
                    <span className="font-bold text-sm text-emerald-400">
                      {originalPrice > discountedPrice
                        ? `${curr} ${(originalPrice - discountedPrice).toLocaleString()} (${Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)}% OFF)`
                        : 'Special Combo Price'}
                    </span>
                  </div>
                </div>

                {/* Included Products Dynamic Builder */}
                <div className="space-y-2 p-3 rounded-xl bg-[#120b07] border border-[#2b1d12]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#fdfbf7] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                      Included Products in Package ({includedItems.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddIncludedItem}
                      className="px-2 py-1 rounded-md bg-[#251910] hover:bg-[#d4af37]/20 text-[#d4af37] text-[11px] font-bold border border-[#3d2a1c] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Product
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {includedItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#170f0a] p-2 rounded-lg border border-[#2b1d13]">
                        <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        <input
                          type="text"
                          required
                          value={item.productName}
                          onChange={(e) => handleUpdateIncludedItem(idx, 'productName', e.target.value)}
                          placeholder="e.g. Chicken Karahi 1kg"
                          className="flex-1 bg-[#100a06] border border-[#2e1f14] text-xs text-[#fdfbf7] px-2.5 py-1 rounded focus:outline-none"
                        />

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-[#8e8272]">Qty:</span>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={item.quantity}
                            onChange={(e) => handleUpdateIncludedItem(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-12 bg-[#100a06] border border-[#2e1f14] text-xs text-[#d4af37] font-bold text-center py-1 rounded focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveIncludedItem(idx)}
                          disabled={includedItems.length <= 1}
                          className="p-1 text-[#8e8272] hover:text-red-400 disabled:opacity-30 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image URL & Preview */}
                <div>
                  <label className="block text-xs font-semibold text-[#fdfbf7] mb-1">
                    Deal Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-[#100a06] border border-[#2f2015] focus:border-[#d4af37] text-xs text-[#fdfbf7] px-3 py-2 rounded-lg focus:outline-none"
                    />
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#251910] border border-[#3d2a1c] shrink-0">
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Toggles (Available & Featured) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#120b07] border border-[#2b1d12] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="rounded border-[#3a271a] text-[#d4af37] focus:ring-[#d4af37] w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#fdfbf7] block">In Stock &amp; Active</span>
                      <span className="text-[10px] text-[#8e8272]">Customers can order this deal</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#120b07] border border-[#2b1d12] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded border-[#3a271a] text-[#d4af37] focus:ring-[#d4af37] w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#fdfbf7] block">Featured on Home &amp; Deals</span>
                      <span className="text-[10px] text-[#8e8272]">Highlight prominently on cards</span>
                    </div>
                  </label>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2d1e13]">
                  <button
                    type="button"
                    onClick={() => { setIsAddingNew(false); setEditingDeal(null); }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8e8272] hover:text-[#fdfbf7] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingDeal ? 'Save Deal Changes' : 'Publish Deal Package'}</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#18110b] border border-red-500/40 rounded-2xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-red-950 text-red-400 border border-red-500/30">
                  <Trash2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#fdfbf7]">
                    Delete Meal Deal?
                  </h3>
                  <p className="text-xs text-[#a89d8f]">
                    This deal combo will be permanently removed from the website menu.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#8e8272] hover:text-[#fdfbf7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = deals.find(d => d.id === deleteConfirmId);
                    if (target) handleDelete(target.id, target.name);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-lg"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deals Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDeals.map((deal, index) => {
          const dealPrice = deal.price || deal.discountedPrice || 0;
          const origPrice = deal.originalPrice || 0;
          const savings = origPrice > dealPrice ? origPrice - dealPrice : 0;

          return (
            <motion.div
              key={deal.id}
              layout
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group ${
                deal.isAvailable !== false
                  ? 'bg-gradient-to-br from-[#1b120c] to-[#120b07] border-[#2c1d12] hover:border-[#d4af37]/60 shadow-md'
                  : 'bg-[#140e0a] border-[#251910] opacity-60'
              }`}
            >
              <div>
                {/* Image & Badges Banner */}
                <div className="relative h-44 rounded-xl overflow-hidden bg-[#24170e] border border-[#352317] mb-3">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                    {deal.badge && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#d4af37] text-[#120b07] shadow-lg">
                        {deal.badge}
                      </span>
                    )}
                    {deal.isFeatured && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-black flex items-center gap-1 shadow-md">
                        <Star className="w-2.5 h-2.5 fill-current" /> Featured
                      </span>
                    )}
                    {deal.isAvailable === false && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-500/40">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Reorder Buttons in banner */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white disabled:opacity-30 transition-all cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === deals.length - 1}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white disabled:opacity-30 transition-all cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider block">
                        {deal.category ? `${deal.category.toUpperCase()} PACKAGE` : 'MEAL COMBO'}
                      </span>
                      <h3 className="font-serif text-base font-bold text-white leading-tight">
                        {deal.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      {origPrice > dealPrice && (
                        <span className="text-[11px] text-stone-400 line-through block">
                          {curr} {origPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="font-serif text-lg font-black text-[#d4af37]">
                        {curr} {dealPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtitle & Serving */}
                <div className="flex items-center justify-between text-xs text-[#a89d8f] mb-2">
                  <span className="flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                    {deal.serves || deal.servingSize || '2-3 Persons'}
                  </span>
                  {savings > 0 && (
                    <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      Save {curr} {savings.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#a89d8f] line-clamp-2 mb-3">
                  {deal.description}
                </p>

                {/* Included Items Pills */}
                <div className="p-2.5 rounded-xl bg-[#120b07] border border-[#291b11] mb-3 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] block">
                    Included Items ({deal.includedItems?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {deal.includedItems?.map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-[#1d130c] border border-[#332215] text-[11px] text-[#fdfbf7] font-medium"
                      >
                        {item.productName || item.name} <strong className="text-[#d4af37]">×{item.quantity}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-[#291b11] gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleDealAvailability(deal.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      deal.isAvailable !== false
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                        : 'bg-red-950/80 text-red-300 border border-red-500/40 hover:bg-red-900'
                    }`}
                    title="Toggle Stock Availability"
                  >
                    {deal.isAvailable !== false ? (
                      <>
                        <Eye className="w-3.5 h-3.5" /> In Stock
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Hidden
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleDealFeatured(deal.id)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      deal.isFeatured
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-[#1a110a] text-[#8e8272] border-[#2f2015] hover:text-[#fdfbf7]'
                    }`}
                    title="Toggle Featured"
                  >
                    <Star className={`w-3.5 h-3.5 ${deal.isFeatured ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicate(deal.id, deal.name)}
                    className="p-1.5 rounded-lg bg-[#1e130b] border border-[#352316] text-[#c5bcad] hover:text-[#fdfbf7] hover:border-[#d4af37] transition-all cursor-pointer"
                    title="Duplicate Deal"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(deal)}
                    className="px-3 py-1.5 rounded-lg bg-[#291b11] border border-[#3f2b1d] hover:border-[#d4af37] text-xs font-bold text-[#fdfbf7] flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d4af37]" /> Edit
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(deal.id)}
                    className="p-1.5 rounded-lg bg-[#1e130b] border border-[#352316] text-red-400 hover:bg-red-950 transition-all cursor-pointer"
                    title="Delete Deal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-12 bg-[#150e09] rounded-2xl border border-[#2b1d12] space-y-3">
          <Package className="w-10 h-10 text-[#8e8272] mx-auto opacity-50" />
          <h3 className="font-serif text-base font-bold text-[#fdfbf7]">
            No Deals Found
          </h3>
          <p className="text-xs text-[#a89d8f] max-w-sm mx-auto">
            No deals matched your search or category filter. Try clearing filters or create a new deal package.
          </p>
          <button
            onClick={handleOpenAdd}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" /> Create First Deal
          </button>
        </div>
      )}
    </div>
  );
};
