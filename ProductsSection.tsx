import React, { useState } from 'react';
import {
  Utensils,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Flame,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  Filter,
} from 'lucide-react';
import { MenuItem, StoreSettings, CategoryItem } from '../../../types';
import { MENU_CATEGORIES } from '../../../data/defaultData';

interface ProductsSectionProps {
  menuItems: MenuItem[];
  settings: StoreSettings;
  categories: CategoryItem[];
  onOpenCreateProduct: () => void;
  onEditProduct: (item: MenuItem) => void;
  onDuplicateProduct: (item: MenuItem) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  onToggleAvailability: (item: MenuItem) => Promise<void>;
  onToggleFeatured: (item: MenuItem) => Promise<void>;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  menuItems,
  settings,
  categories,
  onOpenCreateProduct,
  onEditProduct,
  onDuplicateProduct,
  onDeleteProduct,
  onToggleAvailability,
  onToggleFeatured,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const safeItems = Array.isArray(menuItems) ? menuItems : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Extract all distinct categories
  const dynamicCategories = Array.from(
    new Set(['All', ...safeCategories.map((c) => c.name), ...safeItems.map((i) => i.category)])
  );

  const filteredItems = safeItems.filter((item) => {
    if (!item) return false;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(searchLower) ||
      (item.description && item.description.toLowerCase().includes(searchLower)) ||
      item.category.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  const handleDeleteConfirm = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This will remove it from the menu.')) {
      setDeletingId(id);
      try {
        await onDeleteProduct(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-stone-900 font-serif">
              Unlimited Menu Products
            </h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {safeItems.length} Products
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Create, edit, duplicate, and toggle unlimited single items with real-time customer menu sync
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateProduct}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Product</span>
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
              placeholder="Search products by title, description or category..."
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
          {dynamicCategories.map((cat) => (
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

      {/* Product Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400 space-y-3 shadow-2xs">
          <Utensils className="w-10 h-10 mx-auto text-stone-300" />
          <h3 className="text-sm font-bold text-stone-700">No products found</h3>
          <p className="text-xs text-stone-400">
            {search ? 'Try adjusting your search criteria.' : 'Click "+ Add New Product" to create your first food item.'}
          </p>
          <button
            type="button"
            onClick={onOpenCreateProduct}
            className="bg-stone-900 text-white font-bold px-4 py-2 rounded-xl text-xs"
          >
            + Create Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-xs ${
                item.isAvailable !== false ? 'border-stone-200' : 'border-stone-200 bg-stone-50/70 opacity-75'
              }`}
            >
              {/* Product Top: Image + Badges */}
              <div className="relative h-40 bg-stone-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                  <span className="bg-stone-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  {item.isSpicy && (
                    <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                      <Flame className="w-3 h-3" /> Spicy
                    </span>
                  )}
                  {item.isFeatured && (
                    <span className="bg-amber-500 text-stone-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <button
                    type="button"
                    onClick={() => onToggleAvailability(item)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold shadow-sm transition-all ${
                      item.isAvailable !== false
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {item.isAvailable !== false ? 'IN STOCK' : 'OUT OF STOCK'}
                  </button>
                </div>
              </div>

              {/* Product Body */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-stone-900 text-sm font-serif line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                    {item.description || 'Delicious freshly prepared recipe with authentic spices and toppings.'}
                  </p>
                </div>

                {/* Price and Portion */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black text-amber-700 font-serif">
                        {settings.currency} {item.price.toLocaleString()}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-xs text-stone-400 line-through">
                          {settings.currency} {item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {item.portion && (
                      <span className="text-[10px] text-stone-400 block">{item.portion}</span>
                    )}
                  </div>

                  {/* Actions: Edit, Duplicate, Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditProduct(item)}
                      title="Edit Product"
                      className="p-1.5 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicateProduct(item)}
                      title="Duplicate Product"
                      className="p-1.5 rounded-lg text-stone-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteConfirm(item.id)}
                      disabled={deletingId === item.id}
                      title="Delete Product"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
