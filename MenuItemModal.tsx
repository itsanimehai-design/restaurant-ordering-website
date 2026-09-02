import React, { useState, useEffect } from 'react';
import { X, Check, Flame, Sparkles, Image as ImageIcon } from 'lucide-react';
import { MenuItem, StoreSettings } from '../../types';
import { MENU_CATEGORIES, SAMPLE_FOOD_IMAGES } from '../../data/defaultData';

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Partial<MenuItem>) => Promise<void>;
  itemToEdit: MenuItem | null;
  settings: StoreSettings;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
  settings,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [category, setCategory] = useState('Deal Meal');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [image, setImage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);
  const [tag, setTag] = useState('');
  const [portion, setPortion] = useState('Standard Portion');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setDescription(itemToEdit.description);
      setPrice(itemToEdit.price);
      setOriginalPrice(itemToEdit.originalPrice || '');
      if (MENU_CATEGORIES.includes(itemToEdit.category)) {
        setCategory(itemToEdit.category);
        setIsCustomCategory(false);
      } else {
        setIsCustomCategory(true);
        setCustomCategory(itemToEdit.category);
      }
      setImage(itemToEdit.image);
      setIsAvailable(itemToEdit.isAvailable !== false);
      setIsFeatured(itemToEdit.isFeatured === true);
      setIsSpicy(itemToEdit.isSpicy === true);
      setTag(itemToEdit.tag || '');
      setPortion(itemToEdit.portion || 'Standard Portion');
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setOriginalPrice('');
      setCategory('Deal Meal');
      setIsCustomCategory(false);
      setCustomCategory('');
      setImage('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80');
      setIsAvailable(true);
      setIsFeatured(false);
      setIsSpicy(false);
      setTag('');
      setPortion('Standard Portion');
    }
  }, [itemToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category: isCustomCategory ? customCategory.trim() || 'Menu Item' : category,
        image: image.trim() || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        isAvailable,
        isFeatured,
        isSpicy,
        tag: tag.trim() || undefined,
        portion: portion.trim() || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 font-serif">
                {itemToEdit ? `Edit Product: ${itemToEdit.name}` : '+ Create Unlimited Product'}
              </h2>
              <p className="text-[11px] text-stone-500">Live updating customer-facing store</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-bold text-stone-800 block mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Flaming Pepper Zinger, Karak Chai, Nutella Shake"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">Category</label>
              {!isCustomCategory ? (
                <select
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomCategory(true);
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  {MENU_CATEGORIES.filter((c) => c !== 'All Menu').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__custom__">+ Custom Category...</option>
                </select>
              ) : (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="New category..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-stone-900 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(false)}
                    className="bg-stone-200 px-2 rounded-lg text-[10px] font-semibold"
                  >
                    List
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Price in PKR (Rs.) *</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-stone-400">Rs.</span>
                <input
                  type="number"
                  required
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="490"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-2 text-stone-900 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">Original Price (Strike-through)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-stone-400">Rs.</span>
                <input
                  type="number"
                  min={1}
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  placeholder="580"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-2 text-stone-700"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Portion / Serving Info</label>
              <input
                type="text"
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                placeholder="e.g. Single Burger, 500ml Bottle, Cup"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe delicious taste, marinade & ingredients..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-800">Product Image URL</label>
              <button
                type="button"
                onClick={() => setShowImagePicker(!showImagePicker)}
                className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 text-[11px]"
              >
                <ImageIcon className="w-3 h-3" />
                <span>{showImagePicker ? 'Hide Presets' : 'Choose Photo Preset'}</span>
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
              />
              {image && (
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-stone-300 shrink-0">
                  <img src={image} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
            </div>

            {showImagePicker && (
              <div className="mt-2 p-2 bg-stone-100 rounded-xl border border-stone-200 grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto">
                {SAMPLE_FOOD_IMAGES.map((sample, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setImage(sample.url);
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

          <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isSpicy}
                onChange={(e) => setIsSpicy(e.target.checked)}
                className="w-3.5 h-3.5 text-rose-600 rounded"
              />
              <span className="font-bold text-stone-800 flex items-center gap-1 text-[11px]">
                <Flame className="w-3 h-3 text-rose-600" /> Spicy
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-3.5 h-3.5 text-amber-600 rounded"
              />
              <span className="font-bold text-stone-800 text-[11px]">Featured</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-3.5 h-3.5 text-emerald-600 rounded"
              />
              <span className="font-bold text-stone-800 text-[11px]">In Stock</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl font-semibold text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Save Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
