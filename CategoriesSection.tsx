import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Utensils,
  Coffee,
  IceCream,
  Flame,
  ShoppingBag,
} from 'lucide-react';
import { CategoryItem } from '../../../types';

interface CategoriesSectionProps {
  categories: CategoryItem[];
  onCreateCategory: (cat: Partial<CategoryItem>) => Promise<CategoryItem>;
  onUpdateCategory: (id: string, updates: Partial<CategoryItem>) => Promise<CategoryItem>;
  onDeleteCategory: (id: string) => Promise<boolean>;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const safeCategories = Array.isArray(categories) ? categories : [];

  // Form states for create
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'menu' | 'deals' | 'both'>('both');
  const [newIcon, setNewIcon] = useState('Utensils');
  const [newDisplayOrder, setNewDisplayOrder] = useState<number>(safeCategories.length + 1);

  // Form states for edit
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<'menu' | 'deals' | 'both'>('both');
  const [editDisplayOrder, setEditDisplayOrder] = useState<number>(1);

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditType(cat.type || 'both');
    setEditDisplayOrder(cat.displayOrder || 1);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    await onUpdateCategory(id, {
      name: editName.trim(),
      type: editType,
      displayOrder: Number(editDisplayOrder),
    });
    setEditingId(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await onCreateCategory({
      name: newName.trim(),
      type: newType,
      icon: newIcon,
      displayOrder: Number(newDisplayOrder),
      isActive: true,
    });
    setNewName('');
    setIsCreating(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      await onDeleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-stone-900 font-serif">
              Unlimited Menu & Deal Categories
            </h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {safeCategories.length} Categories
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Categorize your food menu and deals/boxes for fast navigation and search
          </p>
        </div>

        {!isCreating && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Category</span>
          </button>
        )}
      </div>

      {/* Inline Create Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-amber-50/70 border border-amber-200 p-4 sm:p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Create New Category
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-stone-800 block mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Crispy Platters, Desserts, Chai"
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Applies To</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
              >
                <option value="both">Both Deals & Menu Products</option>
                <option value="deals">Deals & Boxes Only</option>
                <option value="menu">Single Menu Items Only</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Display Sort Order</label>
              <input
                type="number"
                min={1}
                value={newDisplayOrder}
                onChange={(e) => setNewDisplayOrder(Number(e.target.value))}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 border border-stone-300 rounded-xl text-xs font-semibold text-stone-600 bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Category</span>
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="divide-y divide-stone-100">
          {safeCategories.length === 0 ? (
            <div className="p-8 text-center text-stone-400 space-y-2">
              <Layers className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-xs font-semibold">No categories registered yet.</p>
            </div>
          ) : (
            safeCategories.map((cat, idx) => (
              <div
                key={cat.id || idx}
                className="p-4 hover:bg-stone-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                {editingId === cat.id ? (
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-900"
                    />
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as any)}
                      className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-900"
                    >
                      <option value="both">Both Deals & Menu</option>
                      <option value="deals">Deals & Boxes Only</option>
                      <option value="menu">Single Menu Only</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={editDisplayOrder}
                        onChange={(e) => setEditDisplayOrder(Number(e.target.value))}
                        className="w-16 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(cat.id)}
                        className="bg-amber-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="border border-stone-300 px-2 py-1.5 rounded-xl text-xs text-stone-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 font-black flex items-center justify-center font-mono text-xs">
                        #{cat.displayOrder || idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 text-sm">{cat.name}</div>
                        <div className="text-[11px] text-stone-400 capitalize">
                          Applies to: {cat.type === 'deals' ? 'Deals & Boxes' : cat.type === 'menu' ? 'Single Products' : 'All Products & Deals'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-amber-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
