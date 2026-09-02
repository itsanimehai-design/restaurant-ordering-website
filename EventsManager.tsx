import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { EventItem } from '../../types';
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EventsManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const EventsManager: React.FC<EventsManagerProps> = ({ onShowToast }) => {
  const { events, addEvent, updateEvent, deleteEvent, formatPrice } = useRestaurantData();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-09-15');
  const [time, setTime] = useState('7:30 PM - 11:00 PM');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1200&q=80');
  const [bookingStatus, setBookingStatus] = useState<EventItem['bookingStatus']>('RSVP Open');
  const [price, setPrice] = useState('18,500 PKR Per Guest');
  const [location, setLocation] = useState('The Ember Vault & Hearth Dining Room');

  const handleOpenAdd = () => {
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('8:00 PM - 11:30 PM');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1200&q=80');
    setBookingStatus('RSVP Open');
    setPrice('18,500 PKR Per Guest');
    setLocation('The Ember Vault & Hearth Dining Room');
    setIsAddingNew(true);
    setEditingEvent(null);
  };

  const handleOpenEdit = (evt: EventItem) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDate(evt.date);
    setTime(evt.time);
    setDescription(evt.description);
    setImage(evt.image);
    setBookingStatus(evt.bookingStatus);
    setPrice(evt.price || '');
    setLocation(evt.location || '');
    setIsAddingNew(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      onShowToast('Missing Fields', 'Please fill in the event title and description.', 'info');
      return;
    }

    const payload = {
      title,
      date,
      time,
      description,
      image,
      bookingStatus,
      price,
      location,
      isPublished: true
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, payload);
      onShowToast('Event Updated', `${title} saved.`, 'success');
      setEditingEvent(null);
    } else {
      addEvent(payload);
      onShowToast('Event Created', `${title} is now scheduled on the website.`, 'gold');
      setIsAddingNew(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    setDeleteConfirmId(null);
    onShowToast('Event Deleted', 'Event removed from calendar.', 'info');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
          onShowToast('Image Uploaded', 'Event banner loaded successfully.', 'success');
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
            <Calendar className="w-5 h-5 text-[#C5A059]" />
            Events & Private Dining Management ({events.length} Events)
          </h2>
          <p className="text-xs text-[#D6CEBF] mt-1">
            Create tasting evenings, sommelier masterclasses, and manage RSVP availability status.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Schedule Event
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-[#14110F] border border-white/10 hover:border-[#C5A059]/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
          >
            <div>
              <div className="relative aspect-[16/9] bg-[#1C1815]">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-2.5 left-2.5">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    evt.bookingStatus === 'open' 
                      ? 'bg-emerald-600 text-white' 
                      : evt.bookingStatus === 'limited' 
                      ? 'bg-[#C5A059] text-black' 
                      : evt.bookingStatus === 'sold-out'
                      ? 'bg-rose-700 text-white'
                      : 'bg-[#8C5E10] text-white'
                  }`}>
                    {evt.bookingStatus === 'open' ? 'RSVP Open' : evt.bookingStatus === 'limited' ? 'Limited Seats' : evt.bookingStatus === 'sold-out' ? 'Sold Out' : 'Private Inquiry'}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[11px] font-mono text-[#E5C158] border border-[#C5A059]/30">
                    {evt.price}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-[11px] text-[#C5A059] font-medium flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {evt.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {evt.time}
                  </span>
                </div>

                <h3 className="font-display font-bold text-white text-base leading-tight">
                  {evt.title}
                </h3>
                <p className="text-xs text-[#D6CEBF]/80 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>

                {evt.location && (
                  <div className="text-[11px] text-[#D6CEBF]/60 flex items-center gap-1 pt-2 border-t border-white/5">
                    <MapPin className="w-3 h-3 text-[#C5A059]" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="px-4 py-3 bg-[#110E0D] border-t border-white/5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(evt)}
                className="p-2 rounded-lg bg-white/5 hover:bg-[#C5A059]/20 text-[#D6CEBF] hover:text-[#E5C158] transition-colors"
                title="Edit Event"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(evt.id)}
                className="p-2 rounded-lg bg-white/5 hover:bg-rose-950/40 text-white/50 hover:text-rose-400 transition-colors"
                title="Delete Event"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {(isAddingNew || editingEvent) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingNew(false); setEditingEvent(null); }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#14110F] border border-[#C5A059]/40 rounded-2xl p-6 shadow-2xl text-[#F5F2ED] max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => { setIsAddingNew(false); setEditingEvent(null); }}
                className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C158]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    {editingEvent ? `Edit: ${editingEvent.title}` : 'Schedule Event / Tasting'}
                  </h3>
                  <p className="text-xs text-[#D6CEBF]">
                    Enter schedule, pricing per guest, and seat availability.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Vintage Reserve & Fire Masterclass"
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Service Time *
                    </label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      placeholder="e.g. 7:30 PM - 11:00 PM"
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Pricing / Admission
                    </label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 18,500 PKR Per Guest"
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Booking Status
                    </label>
                    <select
                      value={bookingStatus}
                      onChange={(e) => setBookingStatus(e.target.value as EventItem['bookingStatus'])}
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    >
                      <option value="RSVP Open" className="bg-[#14110F]">RSVP Open</option>
                      <option value="Limited Seats" className="bg-[#14110F]">Limited Seats Remaining</option>
                      <option value="Sold Out" className="bg-[#14110F]">Sold Out</option>
                      <option value="By Inquiry" className="bg-[#14110F]">By Private Inquiry Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Location / Salon
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. The Ember Vault Private Room"
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Event Narrative & Experience *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Describe courses, guest master chefs, rare vintages, and seating arrangements..."
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Event Banner Photo
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

                {/* Submit & Cancel */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => { setIsAddingNew(false); setEditingEvent(null); }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#D6CEBF]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {editingEvent ? 'Save Event' : 'Publish Event'}
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
                  <h3 className="text-base font-bold text-white">Cancel / Delete Event?</h3>
                  <p className="text-xs text-[#D6CEBF]">
                    This event will be removed from the public event calendar.
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
