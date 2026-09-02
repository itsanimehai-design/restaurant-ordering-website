import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { CustomCategoryItem } from '../../types';
import { 
  FolderTree, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  Layers, 
  Sparkles,
  Save,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface CategoriesManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const CategoriesManager: React.FC<CategoriesManagerProps> = ({ onShowToast }) => {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    reorderCategories, 
    menuItems,
    publishAllChanges 
  } = useRestaurantData();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Category Form State
  const [newCat, setNewCat] = useState({
    name: '',
    slug: '',
    description: '',
    badgeText: '',
    iconName: 'UtensilsCrossed',
    imageUrl: ''
  });

  // Edit Category Form State
  const [editForm, setEditForm] = useState<Partial<CustomCategoryItem>>({});

  const handleStartEdit = (cat: CustomCategoryItem) => {
    setEditingId(cat.id);
    setEditForm({ ...cat });
  };

  const handleSaveEdit = (id: string) => {
    if (!editForm.name) {
      onShowToast('Name Required', 'Category name cannot be empty.', 'info');
      return;
    }
    updateCategory(id, editForm);
    setEditingId(null);
    onShowToast('Category Updated', `Updated "${editForm.name}" successfully.`, 'success');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name.trim()) {
      onShowToast('Name Required', 'Please enter a category title.', 'info');
      return;
    }

    const slug = newCat.slug.trim() || newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addCategory({
      name: newCat.name.trim(),
      slug,
      description: newCat.description.trim(),
      badgeText: newCat.badgeText.trim() || undefined,
      iconName: newCat.iconName,
      imageUrl: newCat.imageUrl.trim() || undefined,
      order: categories.length + 1,
      isPublished: true
    });

    setNewCat({ name: '', slug: '', description: '', badgeText: '', iconName: 'UtensilsCrossed', imageUrl: '' });
    setIsAddingNew(false);
    onShowToast('Category Added', `Created new category "${newCat.name}".`, 'gold');
  };

  const handleDelete = (cat: CustomCategoryItem) => {
    const itemsInCategory = menuItems.filter(m => m.category === cat.slug || m.category === cat.id);
    if (itemsInCategory.length > 0) {
      if (!confirm(`Warning: There are ${itemsInCategory.length} dishes in "${cat.name}". Are you sure you want to delete this category?`)) {
        return;
      }
    }
    deleteCategory(cat.id);
    onShowToast('Category Deleted', `"${cat.name}" has been removed.`, 'info');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      reorderCategories(index, index - 1);
    } else if (direction === 'down' && index < categories.length - 1) {
      reorderCategories(index, index + 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1c140e] via-[#241a12] to-[#16100c] border border-[#d4af37]/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Category Taxonomy &amp; Ordering</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
            Menu Category Manager
          </h2>
          <p className="text-xs sm:text-sm text-[#c5bcad] mt-1">
            Add unlimited categories, reorder menu tabs, assign promotional badges, and organize your dining experience.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b59226] text-black font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 shadow-lg shadow-[#d4af37]/20 hover:scale-102 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Add New Category Modal / Expandable Box */}
      {isAddingNew && (
        <div className="p-6 rounded-2xl bg-[#18120e] border border-[#d4af37]/50 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-[#2e2319] pb-3">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#d4af37]" />
              <span>Create New Category</span>
            </h3>
            <button
              onClick={() => setIsAddingNew(false)}
              className="text-[#8c8275] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#a89d8f] uppercase mb-1">
                Category Title *
              </label>
              <input
                type="text"
                required
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#110d0a] border border-[#382b1e] text-white text-sm focus:border-[#d4af37] focus:outline-none"
                placeholder="e.g. Sizzling Karahi & Handi"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a89d8f] uppercase mb-1">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={newCat.slug}
                onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#110d0a] border border-[#382b1e] text-white text-sm focus:border-[#d4af37] focus:outline-none"
                placeholder="e.g. karahi-handi"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a89d8f] uppercase mb-1">
                Short Description
              </label>
              <input
                type="text"
                value={newCat.description}
                onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#110d0a] border border-[#382b1e] text-white text-sm focus:border-[#d4af37] focus:outline-none"
                placeholder="e.g. Slow-cooked over charcoal with heirloom herbs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a89d8f] uppercase mb-1">
                Highlight Badge (Optional)
              </label>
              <input
                type="text"
                value={newCat.badgeText}
                onChange={(e) => setNewCat({ ...newCat, badgeText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#110d0a] border border-[#382b1e] text-white text-sm focus:border-[#d4af37] focus:outline-none"
                placeholder="e.g. Hearth Signature, Trending, Chef Special"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 rounded-xl bg-[#221a14] border border-[#382b1e] text-[#c5bcad] text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#b59226] transition-colors"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((cat, index) => {
          const isEditing = editingId === cat.id;
          const itemCount = menuItems.filter(m => m.category === cat.slug || m.category === cat.id).length;

          return (
            <div
              key={cat.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isEditing
                  ? 'bg-[#1f1711] border-[#d4af37]'
                  : 'bg-[#14100c] border-[#291f16] hover:border-[#3d2f22]'
              }`}
            >
              {isEditing ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-[#8c8275] uppercase font-bold block mb-1">Name</label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#110d0a] border border-[#382b1e] text-white text-xs font-bold focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8c8275] uppercase font-bold block mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={editForm.badgeText || ''}
                        onChange={(e) => setEditForm({ ...editForm, badgeText: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#110d0a] border border-[#382b1e] text-white text-xs focus:border-[#d4af37] focus:outline-none"
                        placeholder="e.g. Popular"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8c8275] uppercase font-bold block mb-1">Description</label>
                      <input
                        type="text"
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#110d0a] border border-[#382b1e] text-white text-xs focus:border-[#d4af37] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#2e2319]">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg bg-[#221a14] text-[#c5bcad] text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(cat.id)}
                      className="px-4 py-1.5 rounded-lg bg-[#d4af37] text-black text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMove(index, 'up')}
                        className={`p-1 rounded bg-[#201812] text-[#8c8275] hover:text-white ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        disabled={index === categories.length - 1}
                        onClick={() => handleMove(index, 'down')}
                        className={`p-1 rounded bg-[#201812] text-[#8c8275] hover:text-white ${index === categories.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base font-bold text-[#fdfbf7]">
                          {cat.name}
                        </span>
                        {cat.badgeText && (
                          <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-bold border border-[#d4af37]/40 uppercase">
                            {cat.badgeText}
                          </span>
                        )}
                        <span className="text-[11px] text-[#8c8275] font-mono">
                          ({itemCount} {itemCount === 1 ? 'dish' : 'dishes'})
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-xs text-[#a89d8f] mt-0.5">{cat.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="px-3 py-1.5 rounded-lg bg-[#201812] border border-[#382b1e] text-[#c5bcad] hover:text-white hover:border-[#d4af37] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 rounded-lg bg-[#201812] border border-rose-900/40 text-rose-400 hover:bg-rose-950/50 transition-colors cursor-pointer"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
