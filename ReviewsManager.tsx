import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { ReviewItem } from '../../types';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Star, 
  X, 
  Check, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReviewsManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const ReviewsManager: React.FC<ReviewsManagerProps> = ({ onShowToast }) => {
  const { reviews, addReview, updateReview, deleteReview, toggleReviewApproval } = useRestaurantData();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [source, setSource] = useState<any>('Verified Diner');
  const [roleOrCity, setRoleOrCity] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }));
  const [isApproved, setIsApproved] = useState(true);

  const handleOpenAdd = () => {
    setCustomerName('');
    setRating(5);
    setReview('');
    setSource('Verified Diner');
    setRoleOrCity('Ilahiabad');
    setDate(new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }));
    setIsApproved(true);
    setIsAddingNew(true);
    setEditingReview(null);
  };

  const handleOpenEdit = (rev: ReviewItem) => {
    setEditingReview(rev);
    setCustomerName(rev.customerName);
    setRating(rev.rating);
    setReview(rev.review);
    setSource(rev.source || 'Verified Diner');
    setRoleOrCity(rev.roleOrCity || '');
    setDate(rev.date);
    setIsApproved(rev.isApproved !== false);
    setIsAddingNew(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !review.trim()) {
      onShowToast('Missing Fields', 'Please enter diner name and their review quote.', 'info');
      return;
    }

    const payload = {
      customerName,
      rating,
      review,
      source,
      roleOrCity,
      date,
      isApproved
    };

    if (editingReview) {
      updateReview(editingReview.id, payload);
      onShowToast('Review Updated', 'Testimonial details saved.', 'success');
      setEditingReview(null);
    } else {
      addReview(payload);
      onShowToast('Review Added', 'Testimonial published live.', 'gold');
      setIsAddingNew(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteReview(id);
    setDeleteConfirmId(null);
    onShowToast('Review Deleted', 'Testimonial removed.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#14110F] p-5 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#C5A059]" />
            Reviews &amp; Testimonials Moderation ({reviews.length} Total)
          </h2>
          <p className="text-xs text-[#D6CEBF] mt-1">
            Moderate diner feedback, toggle public visibility, or add prestigious critic quotes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Guest Review
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`bg-[#14110F] border rounded-2xl p-5 flex flex-col justify-between transition-all ${
              rev.isApproved !== false
                ? 'border-white/10 hover:border-[#C5A059]/40' 
                : 'border-white/5 opacity-55 bg-[#0D0B0A]'
            }`}
          >
            <div>
              {/* Star Rating & Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-[#C5A059] text-[#C5A059]' : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  rev.isApproved !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50'
                }`}>
                  {rev.isApproved !== false ? 'Approved Live' : 'Hidden / Draft'}
                </span>
              </div>

              <blockquote className="text-xs text-white/90 italic leading-relaxed mb-4 line-clamp-4">
                "{rev.review}"
              </blockquote>

              <div className="pt-3 border-t border-white/5">
                <h4 className="font-display font-semibold text-white text-sm">
                  {rev.customerName}
                </h4>
                <div className="text-[11px] text-[#D6CEBF]/70 flex items-center justify-between mt-0.5">
                  <span>{rev.source || rev.roleOrCity || 'Verified Patron'}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => toggleReviewApproval(rev.id)}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  rev.isApproved !== false
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 text-white/40 border border-white/10'
                }`}
              >
                {rev.isApproved !== false ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{rev.isApproved !== false ? 'Public' : 'Hidden'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(rev)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C5A059]/20 text-[#D6CEBF] hover:text-[#E5C158] transition-colors cursor-pointer"
                  title="Edit Review"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(rev.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-950/40 text-white/50 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Delete Review"
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
        {(isAddingNew || editingReview) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingNew(false); setEditingReview(null); }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#14110F] border border-[#C5A059]/40 rounded-2xl p-6 shadow-2xl text-[#F5F2ED] max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => { setIsAddingNew(false); setEditingReview(null); }}
                className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C158]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    {editingReview ? `Edit Review from ${editingReview.customerName}` : 'Add Diner Testimonial'}
                  </h3>
                  <p className="text-xs text-[#D6CEBF]">
                    Displayed on the guest experience section of the website.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Guest / Critic Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      placeholder="e.g. Lord Alistair Montgomery"
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Source / Credential
                    </label>
                    <select
                      value={source}
                      onChange={(e) => setSource(e.target.value as any)}
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="Verified Diner">Verified Diner</option>
                      <option value="Michelin Guide Inspector">Michelin Guide Inspector</option>
                      <option value="Gastronomy Critic">Gastronomy Critic</option>
                      <option value="Private Dining Guest">Private Dining Guest</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Star Rating (1 to 5)
                    </label>
                    <div className="flex items-center gap-2 p-2 bg-[#1A1715] border border-white/10 rounded-xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating ? 'fill-[#C5A059] text-[#C5A059]' : 'text-white/20'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs text-white font-bold ml-2">{rating} / 5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Review Date
                    </label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="e.g. Aug 2026"
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Review Quote / Testimonial *
                  </label>
                  <textarea
                    rows={4}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                    placeholder="Guest's dining impressions, remarks on hearth smoke flavour, sommelier service..."
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none leading-relaxed resize-none"
                  />
                </div>

                {/* Approved Toggle */}
                <div className="p-3 rounded-xl bg-[#1A1715] border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Approve for Public Website</div>
                    <div className="text-[11px] text-[#D6CEBF]">When checked, this review appears in testimonials.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isApproved}
                    onChange={(e) => setIsApproved(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#C5A059] cursor-pointer"
                  />
                </div>

                {/* Submit & Cancel */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => { setIsAddingNew(false); setEditingReview(null); }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#D6CEBF] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    {editingReview ? 'Save Testimonial' : 'Publish Testimonial'}
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
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#14110F] border border-rose-500/40 rounded-2xl p-6 shadow-2xl text-[#F5F2ED]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Delete Testimonial?</h3>
                  <p className="text-xs text-[#D6CEBF]">
                    This review will be permanently deleted from the database.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
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
