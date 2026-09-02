import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { ChefMember } from '../../types';
import { 
  Plus, 
  Award, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  AlertTriangle,
  Flame,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChefManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const ChefManager: React.FC<ChefManagerProps> = ({ onShowToast }) => {
  const { chefs, addChef, updateChef, deleteChef } = useRestaurantData();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingChef, setEditingChef] = useState<ChefMember | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80');
  const [experienceYears, setExperienceYears] = useState(15);
  const [signatureDish, setSignatureDish] = useState('');
  const [accoladeInput, setAccoladeInput] = useState('');
  const [accolades, setAccolades] = useState<string[]>(['Master Chef Trained', 'Flame Guild Fellow']);

  const handleOpenAdd = () => {
    setName('');
    setRole('Senior Hearth Chef');
    setSpecialty('Live Charcoal & Spice Alchemy');
    setBio('Deeply dedicated to ancestral culinary fire methods and pristine seasonal sourcing.');
    setImage('https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=800&q=80');
    setExperienceYears(12);
    setSignatureDish('Ember-Smoked Tomahawk');
    setAccolades(['Michelin Star Awardee', 'Master of Hearth Gastronomy']);
    setIsAddingNew(true);
    setEditingChef(null);
  };

  const handleOpenEdit = (chef: ChefMember) => {
    setEditingChef(chef);
    setName(chef.name);
    setRole(chef.role);
    setSpecialty(chef.specialty);
    setBio(chef.bio);
    setImage(chef.image);
    setExperienceYears(chef.experienceYears);
    setSignatureDish(chef.signatureDish);
    setAccolades(chef.accolades || []);
    setIsAddingNew(false);
  };

  const handleAddAccolade = () => {
    if (accoladeInput.trim()) {
      setAccolades(prev => [...prev, accoladeInput.trim()]);
      setAccoladeInput('');
    }
  };

  const handleRemoveAccolade = (idx: number) => {
    setAccolades(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      onShowToast('Missing Fields', 'Please enter chef name and role.', 'info');
      return;
    }

    const payload = {
      name,
      role,
      specialty,
      bio,
      image,
      experienceYears,
      signatureDish,
      accolades,
      isPublished: true
    };

    if (editingChef) {
      updateChef(editingChef.id, payload);
      onShowToast('Chef Profile Updated', `${name}'s profile saved.`, 'success');
      setEditingChef(null);
    } else {
      addChef(payload);
      onShowToast('Chef Added', `${name} added to the culinary team.`, 'gold');
      setIsAddingNew(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteChef(id);
    setDeleteConfirmId(null);
    onShowToast('Chef Removed', 'Team member profile deleted.', 'info');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
          onShowToast('Chef Portrait Loaded', 'Photo uploaded successfully.', 'success');
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
            <Award className="w-5 h-5 text-[#C5A059]" />
            Chef & Culinary Brigade Management ({chefs.length} Chefs)
          </h2>
          <p className="text-xs text-[#D6CEBF] mt-1">
            Manage executive chef profiles, sommelier credentials, experience years, and signature dishes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Chef Profile
        </button>
      </div>

      {/* Chefs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chefs.map((chef) => (
          <div
            key={chef.id}
            className="bg-[#14110F] border border-white/10 hover:border-[#C5A059]/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
          >
            <div>
              <div className="relative aspect-[4/3] bg-[#1C1815]">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#8C5E10] text-white text-[10px] font-bold uppercase tracking-wider">
                    {chef.experienceYears}+ Years Exp.
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-3 right-3">
                  <h3 className="font-display font-bold text-white text-lg leading-tight">
                    {chef.name}
                  </h3>
                  <p className="text-xs text-[#E5C158] font-medium">{chef.role}</p>
                </div>
              </div>

              <div className="p-4 space-y-2.5">
                <div className="text-xs text-[#D6CEBF]">
                  <strong className="text-white">Specialty:</strong> {chef.specialty}
                </div>
                <p className="text-xs text-[#D6CEBF]/80 line-clamp-3 leading-relaxed">
                  {chef.bio}
                </p>

                {chef.signatureDish && (
                  <div className="text-[11px] text-[#C5A059] flex items-center gap-1 font-medium pt-2 border-t border-white/5">
                    <Flame className="w-3.5 h-3.5 shrink-0 text-[#E5C158]" />
                    <span className="truncate">Signature: {chef.signatureDish}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="px-4 py-3 bg-[#110E0D] border-t border-white/5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(chef)}
                className="p-2 rounded-lg bg-white/5 hover:bg-[#C5A059]/20 text-[#D6CEBF] hover:text-[#E5C158] transition-colors"
                title="Edit Chef Profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(chef.id)}
                className="p-2 rounded-lg bg-white/5 hover:bg-rose-950/40 text-white/50 hover:text-rose-400 transition-colors"
                title="Delete Chef Profile"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {(isAddingNew || editingChef) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingNew(false); setEditingChef(null); }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#14110F] border border-[#C5A059]/40 rounded-2xl p-6 shadow-2xl text-[#F5F2ED] max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => { setIsAddingNew(false); setEditingChef(null); }}
                className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C158]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    {editingChef ? `Edit: ${editingChef.name}` : 'Add Chef Profile'}
                  </h3>
                  <p className="text-xs text-[#D6CEBF]">
                    Appears under "Our Chefs" on the About page.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Chef Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Marcus Vance"
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Role / Title *
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      placeholder="e.g. Executive Chef & Director"
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Specialty / Firecraft
                    </label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="e.g. Open-Hearth Flame Craft"
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Signature Dish
                  </label>
                  <input
                    type="text"
                    value={signatureDish}
                    onChange={(e) => setSignatureDish(e.target.value)}
                    placeholder="e.g. 45-Day Dry Aged Tomahawk with Volcanic Salt"
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Biography & Training Background *
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                    placeholder="Where they trained, career milestones, culinary philosophy..."
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                {/* Accolades */}
                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Accolades & Awards ({accolades.length})
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={accoladeInput}
                      onChange={(e) => setAccoladeInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAccolade(); } }}
                      placeholder="e.g. Master Chef Award, Best Grill Master..."
                      className="flex-1 bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddAccolade}
                      className="px-4 py-2 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#E5C158] font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-[#1A1715] border border-white/5 min-h-[40px]">
                    {accolades.map((acc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs border border-white/10"
                      >
                        <Star className="w-3 h-3 text-[#E5C158]" />
                        <span>{acc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAccolade(idx)}
                          className="hover:text-rose-400 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Photo */}
                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Chef Portrait Photo
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
                    onClick={() => { setIsAddingNew(false); setEditingChef(null); }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#D6CEBF]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {editingChef ? 'Save Profile' : 'Publish Chef Profile'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
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
                  <h3 className="text-base font-bold text-white">Delete Chef Profile?</h3>
                  <p className="text-xs text-[#D6CEBF]">
                    This member will be removed from the team showcase.
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
