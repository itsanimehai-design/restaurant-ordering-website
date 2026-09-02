import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { NashtaPointItem, NashtaPointConfig } from '../../types';
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
  Clock,
  Search,
  Layers,
  SunMedium,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Sliders,
  Utensils,
  Coffee,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NashtaPointManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

const PRESET_IMAGE_LIBRARY = [
  { label: 'Clay Matka Karak Chai', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', cat: 'chai' },
  { label: 'Kashmiri Pink Chai', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80', cat: 'chai' },
  { label: 'Peshawari Doodh Patti', url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80', cat: 'chai' },
  { label: 'Saffron Malai Sweet Lassi', url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80', cat: 'lassi' },
  { label: 'Sindhri Mango Lassi', url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80', cat: 'lassi' },
  { label: 'Desi Namkeen Mint Lassi', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', cat: 'lassi' },
  { label: 'Lahori Halwa Puri Thali', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80', cat: 'halwa-puri' },
  { label: 'Golden Fried Puris', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', cat: 'halwa-puri' },
  { label: 'Zafrani Sooji Halwa', url: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80', cat: 'halwa-puri' },
  { label: 'Desi Ghee Lacha Paratha', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', cat: 'paratha' },
  { label: 'Spicy Aloo Paratha', url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80', cat: 'paratha' },
  { label: 'Mutton Keema Paratha', url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80', cat: 'paratha' },
  { label: 'Desi Masala Omelette', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80', cat: 'eggs' },
  { label: 'Lahori Khagina (Scrambled)', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80', cat: 'eggs' },
  { label: 'Double Half-Fry Eggs', url: 'https://images.unsplash.com/photo-1508253775351-be0aac8ce07e?auto=format&fit=crop&w=800&q=80', cat: 'eggs' },
  { label: 'Lahori Murgh Chana', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', cat: 'chana' },
  { label: 'Tarka Chana Masala', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', cat: 'chana' },
  { label: 'Sunday Grand Nashta Feast', url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80', cat: 'combos' }
];

export const NashtaPointManager: React.FC<NashtaPointManagerProps> = ({ onShowToast }) => {
  const { 
    nashtaConfig, 
    nashtaItems, 
    updateNashtaConfig, 
    addNashtaItem, 
    updateNashtaItem, 
    deleteNashtaItem, 
    duplicateNashtaItem, 
    toggleNashtaAvailability, 
    toggleNashtaFeatured, 
    reorderNashtaItems,
    formatPrice
  } = useRestaurantData();

  const [activeTab, setActiveTab] = useState<'items' | 'config'>('items');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<NashtaPointItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showImageLibraryModal, setShowImageLibraryModal] = useState<boolean>(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<string>('chai');
  const [formCategoryLabel, setFormCategoryLabel] = useState('Chai Ritual');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(250);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(0);
  const [formServes, setFormServes] = useState('Single Serving');
  const [formTiming, setFormTiming] = useState('7:00 AM – 1:30 PM');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formBadge, setFormBadge] = useState('☕ Clay Matka');
  const [formPairing, setFormPairing] = useState('Pairs perfectly with Desi Ghee Paratha');
  const [formDietaryGhee, setFormDietaryGhee] = useState(false);
  const [formDietaryVeg, setFormDietaryVeg] = useState(true);
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formOfferText, setFormOfferText] = useState('');

  // Config Form State
  const [cfgHeading, setCfgHeading] = useState(nashtaConfig.heading);
  const [cfgEyebrow, setCfgEyebrow] = useState(nashtaConfig.eyebrow);
  const [cfgTagline, setCfgTagline] = useState(nashtaConfig.tagline);
  const [cfgDescription, setCfgDescription] = useState(nashtaConfig.description);
  const [cfgTimingBadge, setCfgTimingBadge] = useState(nashtaConfig.timingBadge);
  const [cfgFeaturedOfferText, setCfgFeaturedOfferText] = useState(nashtaConfig.featuredOfferText || '');
  const [cfgFeaturedOfferCode, setCfgFeaturedOfferCode] = useState(nashtaConfig.featuredOfferCode || '');
  const [cfgShowOfferBanner, setCfgShowOfferBanner] = useState(nashtaConfig.showOfferBanner ?? true);
  const [cfgIsEnabled, setCfgIsEnabled] = useState(nashtaConfig.isEnabled);

  const resetForm = () => {
    setFormName('');
    setFormCategory('chai');
    setFormCategoryLabel('Chai Ritual');
    setFormDescription('');
    setFormPrice(250);
    setFormOriginalPrice(0);
    setFormServes('Single Serving');
    setFormTiming('7:00 AM – 1:30 PM');
    setFormImage('https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80');
    setFormImages([]);
    setFormBadge('');
    setFormPairing('');
    setFormDietaryGhee(false);
    setFormDietaryVeg(true);
    setFormIsAvailable(true);
    setFormIsFeatured(false);
    setFormOfferText('');
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleEditClick = (item: NashtaPointItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormCategoryLabel(item.categoryLabel || '');
    setFormDescription(item.description);
    setFormPrice(item.price);
    setFormOriginalPrice(item.originalPrice || 0);
    setFormServes(item.serves || '');
    setFormTiming(item.timing || '7:00 AM – 1:30 PM');
    setFormImage(item.featuredImage || item.image);
    setFormImages(item.images || [item.image]);
    setFormBadge(item.badge || '');
    setFormPairing(item.pairing || '');
    setFormDietaryGhee(!!item.dietary?.includes('desi-ghee'));
    setFormDietaryVeg(!!item.dietary?.includes('veg'));
    setFormIsAvailable(item.isAvailable);
    setFormIsFeatured(!!item.isFeatured);
    setFormOfferText(item.offerText || '');
    setIsAddingNew(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      onShowToast('Missing Name', 'Please enter a name for this breakfast item.', 'info');
      return;
    }

    const dietaryTags: string[] = ['halal'];
    if (formDietaryGhee) dietaryTags.push('desi-ghee');
    if (formDietaryVeg) dietaryTags.push('veg');
    else dietaryTags.push('non-veg');

    const itemPayload = {
      name: formName.trim(),
      category: formCategory,
      categoryLabel: formCategoryLabel.trim() || undefined,
      description: formDescription.trim(),
      price: Number(formPrice) || 0,
      originalPrice: formOriginalPrice > 0 ? Number(formOriginalPrice) : undefined,
      serves: formServes.trim() || undefined,
      timing: formTiming.trim() || undefined,
      image: formImage.trim(),
      images: formImages.length > 0 ? formImages : [formImage.trim()],
      featuredImage: formImage.trim(),
      badge: formBadge.trim() || undefined,
      pairing: formPairing.trim() || undefined,
      dietary: dietaryTags,
      isAvailable: formIsAvailable,
      isFeatured: formIsFeatured,
      offerText: formOfferText.trim() || undefined
    };

    if (editingItem) {
      updateNashtaItem(editingItem.id, itemPayload);
      onShowToast('Item Updated', `"${formName}" has been updated successfully.`, 'success');
    } else {
      addNashtaItem(itemPayload);
      onShowToast('Item Created', `"${formName}" has been added to Nashta Point.`, 'success');
    }

    resetForm();
  };

  const handleDeleteItem = (id: string) => {
    deleteNashtaItem(id);
    setDeleteConfirmId(null);
    onShowToast('Item Deleted', 'The breakfast item was removed.', 'info');
  };

  const handleDuplicate = (id: string) => {
    const cloned = duplicateNashtaItem(id);
    if (cloned) {
      onShowToast('Item Duplicated', `Created a copy of "${cloned.name}".`, 'success');
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateNashtaConfig({
      heading: cfgHeading,
      eyebrow: cfgEyebrow,
      tagline: cfgTagline,
      description: cfgDescription,
      timingBadge: cfgTimingBadge,
      featuredOfferText: cfgFeaturedOfferText,
      featuredOfferCode: cfgFeaturedOfferCode,
      showOfferBanner: cfgShowOfferBanner,
      isEnabled: cfgIsEnabled
    });
    onShowToast('Settings Saved', 'Nashta Point section configuration updated.', 'success');
  };

  // Filter items
  const filteredList = nashtaItems.filter((i) => {
    if (filterCategory !== 'all' && i.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.badge?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-stone-950 text-stone-100 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <SunMedium className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
                <span>Nashta Point & Breakfast Manager</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono">
                  {nashtaItems.length} Dishes
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-400">
                Manage traditional breakfast items, earthen pot chais, fresh churned lassis, crispy parathas, and breakfast banners.
              </p>
            </div>
          </div>
        </div>

        {/* Tab & Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('items'); setIsAddingNew(false); }}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'items'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Items List</span>
            </button>
            <button
              onClick={() => { setActiveTab('config'); setIsAddingNew(false); }}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'config'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Section Settings</span>
            </button>
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsAddingNew(true);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Breakfast Item</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-6">
        {/* ADD / EDIT ITEM MODAL / FORM */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-6 rounded-2xl bg-stone-900/90 border border-amber-500/40 shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white font-serif">
                    {editingItem ? `Edit Item: ${editingItem.name}` : 'Create New Nashta Item'}
                  </h3>
                </div>
                <button
                  onClick={resetForm}
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Name */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Dish / Beverage Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Saffron & Malai Sweet Lassi"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Category *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => {
                        setFormCategory(e.target.value);
                        if (e.target.value === 'chai') setFormCategoryLabel('Chai Ritual');
                        else if (e.target.value === 'lassi') setFormCategoryLabel('Fresh Lassi Bar');
                        else if (e.target.value === 'paratha') setFormCategoryLabel('Crispy Parathas');
                        else if (e.target.value === 'eggs') setFormCategoryLabel('Farm Fresh Eggs');
                        else if (e.target.value === 'halwa-puri') setFormCategoryLabel('Halwa Puri Thali');
                        else if (e.target.value === 'chana') setFormCategoryLabel('Morning Chana & Gravy');
                        else if (e.target.value === 'combos') setFormCategoryLabel('Grand Morning Combos');
                        else setFormCategoryLabel('Breakfast Special');
                      }}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="chai">☕ Chai Ritual</option>
                      <option value="lassi">🥛 Fresh Lassi Bar</option>
                      <option value="paratha">🫓 Crispy Parathas</option>
                      <option value="eggs">🍳 Farm Fresh Eggs</option>
                      <option value="halwa-puri">🥞 Halwa Puri Thali</option>
                      <option value="chana">🍲 Morning Chana & Gravies</option>
                      <option value="combos">⭐ Morning Combos</option>
                      <option value="specials">👑 Morning Specials</option>
                    </select>
                  </div>
                </div>

                {/* Price, Original Price, Serves, Timing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Original Price (Strike-through)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 550 (Optional)"
                      value={formOriginalPrice || ''}
                      onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Serving Portion</label>
                    <input
                      type="text"
                      placeholder="e.g. 450ml Clay Matka / 1-2 Persons"
                      value={formServes}
                      onChange={(e) => setFormServes(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Serving Window</label>
                    <input
                      type="text"
                      placeholder="e.g. 7:00 AM – 1:30 PM"
                      value={formTiming}
                      onChange={(e) => setFormTiming(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the aroma, ingredients, preparation technique, and texture..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Image Management Section */}
                <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" />
                      <span>Primary Image URL & Photo Gallery</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowImageLibraryModal(true)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
                    >
                      Choose from Curated Gallery Preset
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-900 border border-stone-800 shrink-0">
                      <img src={formImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <p className="text-[11px] text-stone-500">
                        Paste a custom Unsplash or web image URL, or pick from the preset library.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Badge, Pairing & Offer text */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Card Badge (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. ☕ Clay Matka / 🧈 Pure Desi Ghee"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Pairing Note (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Pairs with Saffron Lassi or Omelette"
                      value={formPairing}
                      onChange={(e) => setFormPairing(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-300">Special Offer Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Special Weekend Deal"
                      value={formOfferText}
                      onChange={(e) => setFormOfferText(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Toggles: Availability, Featured, Dietary */}
                <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-stone-800 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsAvailable}
                      onChange={(e) => setFormIsAvailable(e.target.checked)}
                      className="rounded bg-stone-950 border-stone-700 text-amber-500 focus:ring-0 w-4 h-4"
                    />
                    <span className="font-semibold text-stone-200">In Stock / Available</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="rounded bg-stone-950 border-stone-700 text-amber-500 focus:ring-0 w-4 h-4"
                    />
                    <span className="font-semibold text-amber-300">Featured Morning Signature</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formDietaryGhee}
                      onChange={(e) => setFormDietaryGhee(e.target.checked)}
                      className="rounded bg-stone-950 border-stone-700 text-amber-500 focus:ring-0 w-4 h-4"
                    />
                    <span className="text-stone-300">🧈 Prepared in Pure Desi Ghee</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formDietaryVeg}
                      onChange={(e) => setFormDietaryVeg(e.target.checked)}
                      className="rounded bg-stone-950 border-stone-700 text-amber-500 focus:ring-0 w-4 h-4"
                    />
                    <span className="text-emerald-400">Vegetarian Friendly</span>
                  </label>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingItem ? 'Save Changes' : 'Publish Dish to Nashta Point'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 1: ITEMS LIST */}
        {activeTab === 'items' && !isAddingNew && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter by name, category, or badge..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {['all', 'chai', 'lassi', 'paratha', 'eggs', 'halwa-puri', 'chana', 'combos'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                      filterCategory === cat
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Items' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Items */}
            <div className="grid grid-cols-1 gap-3">
              {filteredList.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    item.isAvailable
                      ? 'bg-stone-900/80 border-stone-800 hover:border-amber-500/30'
                      : 'bg-stone-950/60 border-rose-950/40 opacity-75'
                  }`}
                >
                  {/* Left: Reorder, Image, Title & Details */}
                  <div className="flex items-center gap-3.5 w-full md:w-auto">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => reorderNashtaItems(index, Math.max(0, index - 1))}
                        disabled={index === 0}
                        className="p-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-400 hover:text-white transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => reorderNashtaItems(index, Math.min(filteredList.length - 1, index + 1))}
                        disabled={index === filteredList.length - 1}
                        className="p-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-400 hover:text-white transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-950 border border-stone-800 shrink-0 relative">
                      <img src={item.featuredImage || item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {item.isFeatured && (
                        <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-400" title="Featured" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 uppercase tracking-wider">
                          {item.categoryLabel || item.category}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                            {item.badge}
                          </span>
                        )}
                        {!item.isAvailable && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                            Sold Out
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white truncate font-serif mt-0.5">
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-400 line-clamp-1 max-w-xl">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Price & Quick Action Buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-stone-800">
                    <div className="text-left md:text-right">
                      <div className="text-base font-bold text-amber-300 font-serif">
                        {formatPrice(item.price)}
                      </div>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="text-[11px] text-stone-500 line-through">
                          {formatPrice(item.originalPrice)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Availability Toggle */}
                      <button
                        onClick={() => toggleNashtaAvailability(item.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          item.isAvailable
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                        }`}
                        title={item.isAvailable ? 'Mark as Sold Out' : 'Mark as Available'}
                      >
                        {item.isAvailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Featured Toggle */}
                      <button
                        onClick={() => toggleNashtaFeatured(item.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          item.isFeatured
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                            : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-white'
                        }`}
                        title={item.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                      >
                        <Star className={`w-4 h-4 ${item.isFeatured ? 'fill-current' : ''}`} />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicate(item.id)}
                        className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                        title="Duplicate item"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 transition-colors"
                        title="Edit item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-2 rounded-xl bg-stone-800 hover:bg-rose-900/50 text-stone-400 hover:text-rose-300 transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SECTION SETTINGS */}
        {activeTab === 'config' && !isAddingNew && (
          <div className="max-w-4xl bg-stone-900/80 p-6 rounded-2xl border border-stone-800 shadow-xl">
            <h3 className="text-lg font-bold font-serif text-white mb-2 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>Nashta Point Block & Header Settings</span>
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Customize the section title, timing badge, morning story, and promotional banner displayed to guests.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-6">
              {/* Section Visibility */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white block">Enable Nashta Point Section</span>
                  <span className="text-xs text-stone-400">Display this section on the public homepage and menu page.</span>
                </div>
                <input
                  type="checkbox"
                  checked={cfgIsEnabled}
                  onChange={(e) => setCfgIsEnabled(e.target.checked)}
                  className="rounded bg-stone-900 border-stone-700 text-amber-500 w-5 h-5"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Eyebrow Header</label>
                  <input
                    type="text"
                    value={cfgEyebrow}
                    onChange={(e) => setCfgEyebrow(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">Section Heading *</label>
                  <input
                    type="text"
                    required
                    value={cfgHeading}
                    onChange={(e) => setCfgHeading(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:border-amber-500 font-serif font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Tagline / Subheading</label>
                <input
                  type="text"
                  value={cfgTagline}
                  onChange={(e) => setCfgTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Description</label>
                <textarea
                  rows={3}
                  value={cfgDescription}
                  onChange={(e) => setCfgDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">Breakfast Timing Badge</label>
                <input
                  type="text"
                  value={cfgTimingBadge}
                  onChange={(e) => setCfgTimingBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 focus:border-amber-500"
                />
              </div>

              {/* Promo Banner Settings */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-amber-300 block">Featured Promo / Coupon Banner</span>
                    <span className="text-xs text-stone-400">Show special morning feast deal banner inside this section.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={cfgShowOfferBanner}
                    onChange={(e) => setCfgShowOfferBanner(e.target.checked)}
                    className="rounded bg-stone-900 border-stone-700 text-amber-500 w-5 h-5"
                  />
                </div>

                {cfgShowOfferBanner && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-800">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-stone-300">Promo Headline Text</label>
                      <input
                        type="text"
                        value={cfgFeaturedOfferText}
                        onChange={(e) => setCfgFeaturedOfferText(e.target.value)}
                        className="w-full px-3.5 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-300">Promo Code (Optional)</label>
                      <input
                        type="text"
                        value={cfgFeaturedOfferCode}
                        onChange={(e) => setCfgFeaturedOfferCode(e.target.value)}
                        className="w-full px-3.5 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 font-mono focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Nashta Point Configuration</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl bg-stone-900 border border-rose-500/40 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-serif">Remove this breakfast dish?</h3>
              <p className="text-xs text-stone-400 mt-2">
                Are you sure you want to permanently delete this item from the Nashta Point menu? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteItem(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preset Image Library Modal */}
      <AnimatePresence>
        {showImageLibraryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl bg-stone-900 border border-amber-500/40 shadow-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white font-serif">Curated Breakfast Image Library</h3>
                </div>
                <button
                  onClick={() => setShowImageLibraryModal(false)}
                  className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
                {PRESET_IMAGE_LIBRARY.map((item, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => {
                      setFormImage(item.url);
                      setShowImageLibraryModal(false);
                      onShowToast('Image Selected', `Applied preset image for ${item.label}`, 'success');
                    }}
                    className="group cursor-pointer rounded-xl overflow-hidden bg-stone-950 border border-stone-800 hover:border-amber-400 transition-all shadow-md"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={item.url} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-bold">Select</span>
                      </div>
                    </div>
                    <div className="p-2.5 text-center">
                      <span className="text-xs font-medium text-stone-200 group-hover:text-amber-300 truncate block">
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
