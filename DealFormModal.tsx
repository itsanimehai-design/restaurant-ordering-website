import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Sparkles, Image as ImageIcon, Check, Eye, HelpCircle, Layers } from 'lucide-react';
import { DealBox, IncludedItem, DealAddon, DealOptionGroup, StoreSettings } from '../../types';
import { SAMPLE_FOOD_IMAGES, DEAL_CATEGORIES } from '../../data/defaultData';

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dealData: Partial<DealBox>) => Promise<void>;
  dealToEdit: DealBox | null;
  settings: StoreSettings;
}

export const DealFormModal: React.FC<DealFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dealToEdit,
  settings,
}) => {
  if (!isOpen) return null;

  // Form states
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('Family Deals');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [servings, setServings] = useState('');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number | ''>(20);
  const [tag, setTag] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number | ''>(1);

  // Included Items list (Dynamic)
  const [includedItems, setIncludedItems] = useState<IncludedItem[]>([
    { id: 'inc-1', name: 'Crunch Zinger Burgers', quantity: 2, unit: 'pcs', note: 'Spicy' },
    { id: 'inc-2', name: 'Jumbo Crispy Fries', quantity: 1, unit: 'box' },
    { id: 'inc-3', name: 'Golden Chicken Nuggets', quantity: 4, unit: 'pcs' },
    { id: 'inc-4', name: 'Chilled Cold Drinks (500ml)', quantity: 2, unit: 'bottles' },
  ]);

  // Add-ons list (Dynamic)
  const [addons, setAddons] = useState<DealAddon[]>([
    { id: 'add-1', name: 'Extra Cheddar Cheese Slice', price: 60, isAvailable: true },
    { id: 'add-2', name: 'Spicy Peri-Peri Dip Cup', price: 50, isAvailable: true },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (dealToEdit) {
      setName(dealToEdit.name);
      setImage(dealToEdit.image);
      setDescription(dealToEdit.description || '');
      setPrice(dealToEdit.price);
      setOriginalPrice(dealToEdit.originalPrice || '');
      setDiscount(dealToEdit.discount || '');
      if (DEAL_CATEGORIES.includes(dealToEdit.category)) {
        setCategory(dealToEdit.category);
        setIsCustomCategory(false);
      } else {
        setIsCustomCategory(true);
        setCustomCategory(dealToEdit.category);
      }
      setServings(dealToEdit.servings || '');
      setPrepTimeMinutes(dealToEdit.prepTimeMinutes || 20);
      setTag(dealToEdit.tag || '');
      setIsAvailable(dealToEdit.isAvailable !== false);
      setIsFeatured(dealToEdit.isFeatured === true);
      setIsActive(dealToEdit.isActive !== false);
      setDisplayOrder(dealToEdit.displayOrder || 1);
      setIncludedItems(dealToEdit.includedItems && dealToEdit.includedItems.length > 0 ? dealToEdit.includedItems : []);
      setAddons(dealToEdit.addons && dealToEdit.addons.length > 0 ? dealToEdit.addons : []);
    } else {
      // Defaults for brand new deal
      setName('');
      setImage('https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=80');
      setDescription('');
      setPrice('');
      setOriginalPrice('');
      setDiscount('');
      setCategory('Family Deals');
      setIsCustomCategory(false);
      setCustomCategory('');
      setServings('Serves 3-4');
      setPrepTimeMinutes(20);
      setTag('');
      setIsAvailable(true);
      setIsFeatured(false);
      setIsActive(true);
      setDisplayOrder(1);
      setIncludedItems([
        { id: `inc-${Date.now()}-1`, name: 'Crispy Zinger Burgers', quantity: 2, unit: 'pcs', note: '' },
        { id: `inc-${Date.now()}-2`, name: 'Large Seasoned Fries', quantity: 1, unit: 'box', note: '' },
        { id: `inc-${Date.now()}-3`, name: 'Chilled Drinks', quantity: 2, unit: 'cans', note: '' },
      ]);
      setAddons([
        { id: `add-${Date.now()}-1`, name: 'Extra Cheese Slice', price: 60, isAvailable: true },
      ]);
    }
  }, [dealToEdit, isOpen]);

  // Dynamic Included Items Handlers
  const addIncludedItem = () => {
    setIncludedItems((prev) => [
      ...prev,
      {
        id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        name: '',
        quantity: 1,
        unit: 'pcs',
        note: '',
      },
    ]);
  };

  const updateIncludedItem = (id: string, field: keyof IncludedItem, value: any) => {
    setIncludedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeIncludedItem = (id: string) => {
    setIncludedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Dynamic Add-ons Handlers
  const addAddon = () => {
    setAddons((prev) => [
      ...prev,
      {
        id: `add-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        name: '',
        price: 50,
        isAvailable: true,
      },
    ]);
  };

  const updateAddon = (id: string, field: keyof DealAddon, value: any) => {
    setAddons((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const removeAddon = (id: string) => {
    setAddons((prev) => prev.filter((a) => a.id !== id));
  };

  // Auto-calculate discount percentage when original price is provided
  const handlePriceChange = (newPrice: number) => {
    setPrice(newPrice);
    if (originalPrice && typeof originalPrice === 'number' && originalPrice > newPrice) {
      const pct = Math.round(((originalPrice - newPrice) / originalPrice) * 100);
      setDiscount(`${pct}% OFF`);
    }
  };

  const handleOriginalPriceChange = (newOrig: number) => {
    setOriginalPrice(newOrig);
    if (price && typeof price === 'number' && newOrig > price) {
      const pct = Math.round(((newOrig - price) / newOrig) * 100);
      setDiscount(`${pct}% OFF`);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Deal / Box Name is required';
    if (!price || Number(price) <= 0) errs.price = 'Valid price in PKR is required';
    if (!image.trim()) errs.image = 'Deal image URL is required';
    if (includedItems.length === 0 || includedItems.every((i) => !i.name.trim())) {
      errs.includedItems = 'Please add at least one included food item inside this deal';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const validIncluded = includedItems.filter((i) => i.name.trim().length > 0);
      const validAddons = addons.filter((a) => a.name.trim().length > 0);

      const dealData: Partial<DealBox> = {
        name: name.trim(),
        image: image.trim(),
        description: description.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        discount: discount.trim() || undefined,
        category: isCustomCategory ? customCategory.trim() || 'Custom Box' : category,
        servings: servings.trim() || undefined,
        prepTimeMinutes: prepTimeMinutes ? Number(prepTimeMinutes) : 20,
        tag: tag.trim() || undefined,
        isAvailable,
        isFeatured,
        isActive,
        displayOrder: displayOrder ? Number(displayOrder) : 1,
        includedItems: validIncluded,
        addons: validAddons,
      };

      await onSave(dealData);
      onClose();
    } catch (err) {
      console.error('Error saving deal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold font-serif">
                {dealToEdit ? `Edit Deal: ${dealToEdit.name}` : '+ Create Unlimited Food Deal / Box'}
              </h2>
              <p className="text-xs text-stone-400">
                Configure food contents, quantities, pricing, add-ons, and instant website visibility.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-stone-800">
          
          {/* SECTION 1: Basic Deal Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 border-b border-amber-200 pb-1.5">
              <span>1. Deal Overview & Presentation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Deal Name */}
              <div className="sm:col-span-2">
                <label className="font-bold text-stone-900 block mb-1">
                  Deal / Box Name * <span className="text-stone-400 font-normal">(e.g. Mega Family Feast Box, Duo Zinger Combo, Midnight Pizza Box)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="Enter deal name..."
                  className={`w-full bg-stone-50 border rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-rose-500 ring-rose-200' : 'border-stone-200 focus:border-amber-500 focus:ring-amber-500/20'
                  }`}
                />
                {errors.name && <p className="text-[10px] text-rose-600 mt-1">{errors.name}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="font-bold text-stone-900 block mb-1">Deal Category</label>
                {!isCustomCategory ? (
                  <div className="flex gap-2">
                    <select
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setIsCustomCategory(true);
                        } else {
                          setCategory(e.target.value);
                        }
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      {DEAL_CATEGORIES.filter((c) => c !== 'All Deals & Boxes').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__custom__">+ Add Custom Category...</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Ramadan Specials, Weekend Feasts..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(false)}
                      className="bg-stone-200 text-stone-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                    >
                      Presets
                    </button>
                  </div>
                )}
              </div>

              {/* Tag / Badge */}
              <div>
                <label className="font-bold text-stone-900 block mb-1">
                  Tag Badge <span className="text-stone-400 font-normal">(e.g. Bestseller, Hot Deal, Save Rs. 300)</span>
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Bestseller / Hot Deal"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="font-bold text-stone-900 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the mouth-watering items in this box..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Image URL & Preset Picker */}
              <div className="sm:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-900">
                    Deal / Box Image URL *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(!showImagePicker)}
                    className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{showImagePicker ? 'Hide Photo Presets' : 'Choose from Curated Photos'}</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => {
                      setImage(e.target.value);
                      if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className={`flex-1 bg-stone-50 border rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 ${
                      errors.image ? 'border-rose-500 ring-rose-200' : 'border-stone-200 focus:border-amber-500 focus:ring-amber-500/20'
                    }`}
                  />
                  {image && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-300 shrink-0 bg-stone-100">
                      <img src={image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
                {errors.image && <p className="text-[10px] text-rose-600">{errors.image}</p>}

                {/* Preset Image Gallery */}
                {showImagePicker && (
                  <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 space-y-2">
                    <p className="text-[11px] font-bold text-stone-700">Click any image to select for this deal:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {SAMPLE_FOOD_IMAGES.map((sample, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setImage(sample.url);
                            setShowImagePicker(false);
                          }}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 relative group transition-all ${
                            image === sample.url ? 'border-amber-600 ring-2 ring-amber-400' : 'border-transparent hover:border-amber-400'
                          }`}
                        >
                          <img src={sample.url} alt={sample.label} className="w-full h-16 object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold text-center px-1">
                            {sample.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: FOOD ITEMS INCLUDED INSIDE THE DEAL */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <span>2. Food Items Included Inside This Deal / Box</span>
              </h3>
              <button
                type="button"
                onClick={addIncludedItem}
                className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1 rounded-lg text-[11px] shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Included Item</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-500">
              Specify all burgers, sides, nuggets, drinks, and wings packed inside this box. The owner can add unlimited items!
            </p>

            {errors.includedItems && <p className="text-[10px] text-rose-600 font-bold">{errors.includedItems}</p>}

            <div className="space-y-2">
              {includedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  {/* Item Name */}
                  <div className="flex-1 min-w-[140px]">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateIncludedItem(item.id, 'name', e.target.value)}
                      placeholder="e.g. Zinger Burgers, Large Fries, Wings..."
                      className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="w-20">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateIncludedItem(item.id, 'quantity', Number(e.target.value))}
                      placeholder="Qty"
                      className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-xs text-center font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Unit Label */}
                  <div className="w-24">
                    <input
                      type="text"
                      value={item.unit || ''}
                      onChange={(e) => updateIncludedItem(item.id, 'unit', e.target.value)}
                      placeholder="Unit (pcs, can)"
                      className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Optional Note */}
                  <div className="flex-1 min-w-[120px]">
                    <input
                      type="text"
                      value={item.note || ''}
                      onChange={(e) => updateIncludedItem(item.id, 'note', e.target.value)}
                      placeholder="Note (e.g. Spicy / Flame grilled)"
                      className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-xs text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  {/* Delete Item Row */}
                  <button
                    type="button"
                    onClick={() => removeIncludedItem(item.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-200 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: PRICING & DISCOUNTS */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 border-b border-amber-200 pb-1.5">
              <span>3. Pricing in PKR (Rs.) & Value Savings</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Deal Price */}
              <div>
                <label className="font-bold text-stone-900 block mb-1">Deal Price in PKR (Rs.) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">Rs.</span>
                  <input
                    type="number"
                    min={1}
                    value={price}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    placeholder="2499"
                    className={`w-full bg-stone-50 border rounded-xl pl-10 pr-3 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 ${
                      errors.price ? 'border-rose-500 ring-rose-200' : 'border-stone-200 focus:border-amber-500 focus:ring-amber-500/20'
                    }`}
                  />
                </div>
                {errors.price && <p className="text-[10px] text-rose-600 mt-1">{errors.price}</p>}
              </div>

              {/* Original Price */}
              <div>
                <label className="font-bold text-stone-900 block mb-1">
                  Original Price <span className="text-stone-400 font-normal">(Strike-through)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">Rs.</span>
                  <input
                    type="number"
                    min={1}
                    value={originalPrice}
                    onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                    placeholder="3450"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Discount Ribbon text */}
              <div>
                <label className="font-bold text-stone-900 block mb-1">Discount Tag / Text</label>
                <input
                  type="text"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="e.g. 28% OFF / Save Rs. 350"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Servings */}
              <div>
                <label className="font-bold text-stone-900 block mb-1">Servings Info</label>
                <input
                  type="text"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  placeholder="e.g. Serves 4-5 Persons"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Prep Time */}
              <div>
                <label className="font-bold text-stone-900 block mb-1">Prep Time (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  value={prepTimeMinutes}
                  onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                  placeholder="20"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="font-bold text-stone-900 block mb-1">Display Sort Order</label>
                <input
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  placeholder="1"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: ADD-ONS & UPSELLS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <span>4. Customer Add-ons & Upsell Options</span>
              </h3>
              <button
                type="button"
                onClick={addAddon}
                className="inline-flex items-center gap-1 bg-stone-800 hover:bg-stone-900 text-white font-bold px-3 py-1 rounded-lg text-[11px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Add-on</span>
              </button>
            </div>

            <div className="space-y-2">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={addon.name}
                    onChange={(e) => updateAddon(addon.id, 'name', e.target.value)}
                    placeholder="Addon name (e.g. Extra Cheese Slice, Dip Sauce)"
                    className="flex-1 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-900"
                  />
                  <div className="w-28 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-[11px]">Rs.</span>
                    <input
                      type="number"
                      min={0}
                      value={addon.price}
                      onChange={(e) => updateAddon(addon.id, 'price', Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded-lg pl-8 pr-2 py-1.5 text-xs font-bold text-stone-900 text-right"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAddon(addon.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: VISIBILITY & FEATURED CONTROLS */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              5. Availability & Live Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Active Toggle (Show/Hide on site) */}
              <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                <div>
                  <span className="font-bold text-xs text-stone-900 block">Active on Website</span>
                  <span className="text-[10px] text-stone-500">Show/Hide deal from customers</span>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
              </label>

              {/* Featured Toggle */}
              <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                <div>
                  <span className="font-bold text-xs text-stone-900 block">Mark as Featured</span>
                  <span className="text-[10px] text-stone-500">Highlight in Hero Banner</span>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
              </label>

              {/* In Stock Toggle */}
              <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                <div>
                  <span className="font-bold text-xs text-stone-900 block">In Stock / Available</span>
                  <span className="text-[10px] text-stone-500">Accept customer orders</span>
                </div>
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-700 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-amber-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Deal...' : dealToEdit ? 'Save Changes' : '+ Publish New Deal to Site'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
