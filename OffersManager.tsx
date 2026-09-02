import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { OfferItem } from '../../types';
import { 
  Plus, 
  Tag, 
  Edit3, 
  Trash2, 
  Calendar, 
  Sparkles, 
  Check, 
  X, 
  Upload,
  AlertTriangle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OffersManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const OffersManager: React.FC<OffersManagerProps> = ({ onShowToast }) => {
  const { 
    offers, 
    addOffer, 
    updateOffer, 
    deleteOffer, 
    toggleOfferActive 
  } = useRestaurantData();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('20% OFF');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [code, setCode] = useState('EMBER20');
  const [terms, setTerms] = useState('Valid for dine-in with advance booking.');
  const [isActive, setIsActive] = useState(true);

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setDiscount('25% OFF');
    setImage('https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80');
    setStartDate(new Date().toISOString().split('T')[0]);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 2);
    setEndDate(nextMonth.toISOString().split('T')[0]);
    setCode('EMBERDEAL');
    setTerms('Valid with advance table reservation.');
    setIsActive(true);
    setIsAddingNew(true);
    setEditingOffer(null);
  };

  const handleOpenEdit = (offer: OfferItem) => {
    setEditingOffer(offer);
    setTitle(offer.title);
    setDescription(offer.description);
    setDiscount(offer.discount);
    setImage(offer.image);
    setStartDate(offer.startDate);
    setEndDate(offer.endDate);
    setCode(offer.code || '');
    setTerms(offer.terms || '');
    setIsActive(offer.isActive);
    setIsAddingNew(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !discount.trim()) {
      onShowToast('Missing Fields', 'Please complete title, description, and discount.', 'info');
      return;
    }

    const payload = {
      title,
      description,
      discount,
      image,
      startDate,
      endDate,
      code,
      terms,
      isActive
    };

    if (editingOffer) {
      updateOffer(editingOffer.id, payload);
      onShowToast('Offer Updated', `${title} modified successfully.`, 'success');
      setEditingOffer(null);
    } else {
      addOffer(payload);
      onShowToast('Offer Created', `${title} is now active on the website.`, 'gold');
      setIsAddingNew(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteOffer(id);
    setDeleteConfirmId(null);
    onShowToast('Offer Removed', 'Promotional deal deleted.', 'info');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
          onShowToast('Banner Uploaded', 'Offer image loaded.', 'success');
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
            <Tag className="w-5 h-5 text-[#C5A059]" />
            Offers & Deals Management ({offers.length} Promotions)
          </h2>
          <p className="text-xs text-[#D6CEBF] mt-1">
            Create seasonal discounts, dining passes, and promo codes for diners.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Offer
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`bg-[#14110F] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all ${
              offer.isActive ? 'border-white/10 hover:border-[#C5A059]/40' : 'border-white/5 opacity-60 bg-[#0F0D0C]'
            }`}
          >
            <div>
              {/* Image & Discount Banner */}
              <div className="relative aspect-[16/9] bg-[#1C1815]">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-[#8C5E10] text-white text-[11px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E5C158]" />
                    {offer.discount}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5">
                  {offer.code && (
                    <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-[#E5C158] border border-[#C5A059]/40">
                      CODE: {offer.code}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-display font-semibold text-white text-base mb-1">
                  {offer.title}
                </h3>
                <p className="text-xs text-[#D6CEBF]/80 line-clamp-2 leading-relaxed mb-3">
                  {offer.description}
                </p>

                <div className="text-[11px] text-[#D6CEBF]/70 flex items-center gap-1.5 pt-2 border-t border-white/5">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Valid: {offer.startDate} to {offer.endDate}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="px-4 py-3 bg-[#110E0D] border-t border-white/5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleOfferActive(offer.id)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                  offer.isActive
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 text-white/40 border border-white/10'
                }`}
              >
                {offer.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                <span>{offer.isActive ? 'Active' : 'Disabled'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(offer)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C5A059]/20 text-[#D6CEBF] hover:text-[#E5C158] transition-colors"
                  title="Edit Offer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(offer.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-950/40 text-white/50 hover:text-rose-400 transition-colors"
                  title="Delete Offer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Offer Modal */}
      <AnimatePresence>
        {(isAddingNew || editingOffer) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingNew(false); setEditingOffer(null); }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#14110F] border border-[#C5A059]/40 rounded-2xl p-6 shadow-2xl text-[#F5F2ED] max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => { setIsAddingNew(false); setEditingOffer(null); }}
                className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C158]">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    {editingOffer ? 'Edit Special Offer' : 'Create Special Deal / Promotion'}
                  </h3>
                  <p className="text-xs text-[#D6CEBF]">
                    Displayed on the public website when active.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Offer Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. 7-Course Hearth Tasting Special"
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Discount / Tagline *
                    </label>
                    <input
                      type="text"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      required
                      placeholder="e.g. 25% OFF or RS. 4,500 SET MENU"
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Promo Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. EMBERVIP"
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Offer Description *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Details about the promotion, inclusions, and experience..."
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Banner Photo (URL or Upload)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
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
                    Terms & Conditions
                  </label>
                  <input
                    type="text"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="e.g. Valid Tuesday to Thursday with advance table reservation."
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                {/* Active Toggle */}
                <div className="p-3 rounded-xl bg-[#1A1715] border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Active on Live Site</div>
                    <div className="text-[11px] text-[#D6CEBF]">When enabled, diners see this offer on the live site.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#C5A059]"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => { setIsAddingNew(false); setEditingOffer(null); }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#D6CEBF]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {editingOffer ? 'Save Offer' : 'Publish Offer Live'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
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
                  <h3 className="text-base font-bold text-white">Delete Offer?</h3>
                  <p className="text-xs text-[#D6CEBF]">
                    This deal will immediately vanish from the public site.
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
