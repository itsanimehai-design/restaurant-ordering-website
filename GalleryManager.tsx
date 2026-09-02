import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { GalleryItem } from '../../types';
import { 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Check, 
  X, 
  AlertTriangle,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

const GALLERY_CATEGORIES: { id: GalleryItem['category']; label: string }[] = [
  { id: 'dishes', label: 'Culinary Dishes' },
  { id: 'interior', label: 'Interior & Salon' },
  { id: 'chef', label: 'Chef & Hearth' },
  { id: 'experience', label: 'Atmosphere & Fresh Drinks' },
  { id: 'events', label: 'Private Dining & Events' }
];

export const GalleryManager: React.FC<GalleryManagerProps> = ({ onShowToast }) => {
  const { 
    galleryItems, 
    addGalleryItem, 
    updateGalleryItem, 
    deleteGalleryItem, 
    reorderGalleryItem 
  } = useRestaurantData();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('dishes');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80');
  const [aspectRatio, setAspectRatio] = useState<'tall' | 'wide' | 'square'>('wide');

  const filteredItems = galleryItems.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  const handleOpenAdd = () => {
    setTitle('');
    setCaption('');
    setCategory('dishes');
    setImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80');
    setAspectRatio('wide');
    setIsAddingNew(true);
    setEditingItem(null);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCaption(item.caption);
    setCategory(item.category);
    setImage(item.image);
    setAspectRatio(item.aspectRatio || 'wide');
    setIsAddingNew(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      onShowToast('Missing Information', 'Please provide a title and image.', 'info');
      return;
    }

    const payload = {
      title,
      caption,
      category,
      image,
      aspectRatio
    };

    if (editingItem) {
      updateGalleryItem(editingItem.id, payload);
      onShowToast('Photo Updated', 'Gallery caption and details saved.', 'success');
      setEditingItem(null);
    } else {
      addGalleryItem(payload);
      onShowToast('Photo Added', 'Image published to public gallery.', 'gold');
      setIsAddingNew(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteGalleryItem(id);
    setDeleteConfirmId(null);
    onShowToast('Image Deleted', 'Photo removed from gallery.', 'info');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
          onShowToast('Photo Loaded', 'Image uploaded successfully.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#14110F] p-5 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#C5A059]" />
            Gallery Management ({galleryItems.length} Photos)
          </h2>
          <p className="text-xs text-[#D6CEBF] mt-1">
            Upload new photography, edit captions, and change the display order of visual showcases.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Upload Image
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            selectedFilter === 'all'
              ? 'bg-[#C5A059] text-[#0D0D0D] font-bold'
              : 'bg-[#181512] text-[#D6CEBF] hover:text-white border border-white/5'
          }`}
        >
          All Photos ({galleryItems.length})
        </button>
        {GALLERY_CATEGORIES.map(cat => {
          const count = galleryItems.filter(g => g.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFilter === cat.id
                  ? 'bg-[#C5A059] text-[#0D0D0D] font-bold'
                  : 'bg-[#181512] text-[#D6CEBF] hover:text-white border border-white/5'
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid of gallery items with Reorder controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="bg-[#14110F] border border-white/10 hover:border-[#C5A059]/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
          >
            <div>
              <div className="relative aspect-[16/10] bg-[#1C1815]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] uppercase font-bold text-[#C5A059] border border-[#C5A059]/30">
                    {GALLERY_CATEGORIES.find(c => c.id === item.category)?.label || item.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-display font-semibold text-white text-sm mb-1 truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-[#D6CEBF]/80 line-clamp-2 leading-relaxed">
                  {item.caption || 'No caption provided.'}
                </p>
              </div>
            </div>

            {/* Bottom Bar with Move Up / Move Down & Delete */}
            <div className="px-4 py-2.5 bg-[#110E0D] border-t border-white/5 flex items-center justify-between">
              {/* Reorder Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => reorderGalleryItem(item.id, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C5A059]/20 disabled:opacity-30 disabled:hover:bg-white/5 text-[#D6CEBF] transition-colors"
                  title="Move Image Earlier in Order"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => reorderGalleryItem(item.id, 'down')}
                  disabled={index === filteredItems.length - 1}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C5A059]/20 disabled:opacity-30 disabled:hover:bg-white/5 text-[#D6CEBF] transition-colors"
                  title="Move Image Later in Order"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Edit / Delete */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C5A059]/20 text-[#D6CEBF] hover:text-[#E5C158] transition-colors"
                  title="Edit Caption"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-950/40 text-white/50 hover:text-rose-400 transition-colors"
                  title="Delete Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {(isAddingNew || editingItem) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingNew(false); setEditingItem(null); }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#14110F] border border-[#C5A059]/40 rounded-2xl p-6 shadow-2xl text-[#F5F2ED]"
            >
              <button
                onClick={() => { setIsAddingNew(false); setEditingItem(null); }}
                className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C158]">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    {editingItem ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
                  </h3>
                  <p className="text-xs text-[#D6CEBF]">
                    Choose category and enter descriptive caption.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Photo Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Hearth Flame Seared Wagyu"
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Gallery Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as GalleryItem['category'])}
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    >
                      {GALLERY_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-[#14110F]">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Layout Aspect
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as 'tall' | 'wide' | 'square')}
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    >
                      <option value="wide" className="bg-[#14110F]">Wide (16:9)</option>
                      <option value="tall" className="bg-[#14110F]">Tall (Portrait)</option>
                      <option value="square" className="bg-[#14110F]">Square (1:1)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Image Source (URL or Upload)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      required
                      className="flex-1 bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
                    />
                    <label className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 cursor-pointer text-xs flex items-center gap-1 text-[#E5C158]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Editorial Caption
                  </label>
                  <textarea
                    rows={2}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Short description of the technique, ambiance, or ingredients shown..."
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                {/* Submit & Cancel */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => { setIsAddingNew(false); setEditingItem(null); }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#D6CEBF]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {editingItem ? 'Save Photo' : 'Publish Photo'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full max-w-md bg-[#14110F] border border-rose-500/40 rounded-2xl p-6 shadow-2xl text-[#F5F2ED]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Delete Photo?</h3>
                  <p className="text-xs text-[#D6CEBF]">
                    This image will be removed from the gallery and lightboxes.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
