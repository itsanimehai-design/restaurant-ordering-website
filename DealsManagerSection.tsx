import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Flame,
  Layers,
} from 'lucide-react';
import { DealBox, StoreSettings } from '../../../types';

interface DealsManagerSectionProps {
  deals: DealBox[];
  settings: StoreSettings;
  onOpenCreateDeal: () => void;
  onEditDeal: (deal: DealBox) => void;
  onDuplicateDeal: (deal: DealBox) => Promise<void>;
  onDeleteDeal: (id: string) => Promise<boolean>;
  onToggleAvailability: (deal: DealBox) => Promise<void>;
  onToggleActive: (deal: DealBox) => Promise<void>;
  onToggleFeatured: (deal: DealBox) => Promise<void>;
  onReorder: (orderedIds: string[]) => Promise<boolean>;
}

export const DealsManagerSection: React.FC<DealsManagerSectionProps> = ({
  deals,
  settings,
  onOpenCreateDeal,
  onEditDeal,
  onDuplicateDeal,
  onDeleteDeal,
  onToggleAvailability,
  onToggleActive,
  onToggleFeatured,
  onReorder,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const safeDeals = Array.isArray(deals) ? [...deals].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) : [];

  const categories = ['All', ...Array.from(new Set(safeDeals.map((d) => d.category)))];

  const filteredDeals = safeDeals.filter((deal) => {
    if (!deal) return false;
    const matchesCategory = selectedCategory === 'All' || deal.category === selectedCategory;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      deal.name.toLowerCase().includes(searchLower) ||
      (deal.description && deal.description.toLowerCase().includes(searchLower)) ||
      (deal.includedItems || []).some((item) => item?.name?.toLowerCase().includes(searchLower));
    return matchesCategory && matchesSearch;
  });

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= safeDeals.length) return;

    const newDeals = [...safeDeals];
    const temp = newDeals[index];
    newDeals[index] = newDeals[targetIndex];
    newDeals[targetIndex] = temp;

    const orderedIds = newDeals.map((d) => d.id);
    await onReorder(orderedIds);
  };

  const handleDeleteConfirm = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete deal "${name}"? This action cannot be undone.`)) {
      setDeletingId(id);
      try {
        await onDeleteDeal(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-stone-900 font-serif">
              Unlimited Food Deals & Value Boxes
            </h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {safeDeals.length} Deals
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Design combo boxes with multiple items, savings badges, and custom add-ons
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateDeal}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Deal Box</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search deals by title, included food items, or keywords..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 px-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Cards Grid */}
      {filteredDeals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400 space-y-3 shadow-2xs">
          <Sparkles className="w-10 h-10 mx-auto text-stone-300" />
          <h3 className="text-sm font-bold text-stone-700">No deals found</h3>
          <p className="text-xs text-stone-400">
            {search ? 'Try adjusting your search keywords.' : 'Click "+ Create New Deal Box" to build your first meal package.'}
          </p>
          <button
            type="button"
            onClick={onOpenCreateDeal}
            className="bg-stone-900 text-white font-bold px-4 py-2 rounded-xl text-xs"
          >
            + Create Deal Box
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeals.map((deal, idx) => (
            <div
              key={deal.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-xs ${
                deal.isActive && deal.isAvailable !== false ? 'border-stone-200' : 'border-stone-200 bg-stone-50/70 opacity-80'
              }`}
            >
              {/* Top Image + Badges */}
              <div className="relative h-44 bg-stone-100 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                  <span className="bg-stone-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {deal.category}
                  </span>
                  {deal.discount && (
                    <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                      {deal.discount}
                    </span>
                  )}
                  {deal.tag && (
                    <span className="bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-md">
                      {deal.tag}
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
                  <button
                    type="button"
                    onClick={() => onToggleAvailability(deal)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold shadow-sm transition-all ${
                      deal.isAvailable !== false ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {deal.isAvailable !== false ? 'IN STOCK' : 'OUT OF STOCK'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleActive(deal)}
                    className={`px-2 py-0.5 rounded-md text-[9px] font-bold shadow-xs ${
                      deal.isActive ? 'bg-stone-900 text-white' : 'bg-stone-300 text-stone-700'
                    }`}
                  >
                    {deal.isActive ? 'Published' : 'Hidden'}
                  </button>
                </div>
              </div>

              {/* Deal Content & Included Items */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-stone-900 text-sm font-serif">
                      {deal.name}
                    </h3>
                  </div>

                  <p className="text-stone-500 text-xs line-clamp-2">
                    {deal.description}
                  </p>

                  {/* Included Items Pills */}
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Box Contents ({deal.includedItems?.length || 0} Items)
                    </span>
                    <div className="space-y-0.5">
                      {deal.includedItems?.map((inc, i) => (
                        <div key={i} className="text-[11px] text-stone-700 flex items-center justify-between">
                          <span>&bull; {inc.quantity}x {inc.name}</span>
                          {inc.note && <span className="text-[10px] text-stone-400">({inc.note})</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meta stats */}
                  <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-1">
                    {deal.servings && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-stone-400" /> {deal.servings}
                      </span>
                    )}
                    {deal.prepTimeMinutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" /> {deal.prepTimeMinutes} mins
                      </span>
                    )}
                    {deal.addons && deal.addons.length > 0 && (
                      <span>&bull; {deal.addons.length} Add-ons</span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Price & Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black text-amber-700 font-serif">
                        {settings.currency} {deal.price.toLocaleString()}
                      </span>
                      {deal.originalPrice && deal.originalPrice > deal.price && (
                        <span className="text-xs text-stone-400 line-through">
                          {settings.currency} {deal.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col mr-1">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-0.5 text-stone-400 hover:text-stone-700 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === safeDeals.length - 1}
                        className="p-0.5 text-stone-400 hover:text-stone-700 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onEditDeal(deal)}
                      title="Edit Deal"
                      className="p-1.5 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-amber-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicateDeal(deal)}
                      title="Duplicate Deal"
                      className="p-1.5 rounded-lg text-stone-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteConfirm(deal.id, deal.name)}
                      disabled={deletingId === deal.id}
                      title="Delete Deal"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
