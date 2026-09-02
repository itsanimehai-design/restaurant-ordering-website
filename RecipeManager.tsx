import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { SpecialRecipeItem } from '../../types';
import { 
  Plus, 
  BookOpen, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Clock, 
  Flame, 
  Upload,
  AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecipeManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const RecipeManager: React.FC<RecipeManagerProps> = ({ onShowToast }) => {
  const { 
    specialRecipes, 
    addSpecialRecipe, 
    updateSpecialRecipe, 
    deleteSpecialRecipe, 
    toggleRecipePublish,
    formatPrice,
    config
  } = useRestaurantData();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<SpecialRecipeItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Chef’s Hearth Special');
  const [price, setPrice] = useState(7500);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80');
  const [prepTime, setPrepTime] = useState('24 Hours Smoke & Marinate');
  const [cookingMethod, setCookingMethod] = useState('Oak wood open-hearth grill at 120°C');
  const [chefNotes, setChefNotes] = useState('Serve tableside with warm smoked jaggery glaze.');
  const [isPublished, setIsPublished] = useState(true);
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([
    'A5 Miyazaki Wagyu ribeye (500g)',
    'Wild kashmiri mountain saffron',
    'Oak smoked butter & sea salt'
  ]);

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setCategory('Chef’s Secret Hearth');
    setPrice(7500);
    setImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80');
    setPrepTime('24 Hours Smoke & Marinate');
    setCookingMethod('Oak wood open-hearth grill at 120°C');
    setChefNotes('Serve tableside with warm smoked glaze.');
    setIsPublished(true);
    setIngredients([
      'A5 Miyazaki Wagyu or prime lamb cut',
      'Wild botanical saffron & star anise',
      'Oak-smoked bone marrow emulsion'
    ]);
    setIsAddingNew(true);
    setEditingRecipe(null);
  };

  const handleOpenEdit = (recipe: SpecialRecipeItem) => {
    setEditingRecipe(recipe);
    setTitle(recipe.title);
    setDescription(recipe.description);
    setCategory(recipe.category);
    setPrice(recipe.price);
    setImage(recipe.image);
    setPrepTime(recipe.prepTime || '');
    setCookingMethod(recipe.cookingMethod || '');
    setChefNotes(recipe.chefNotes || '');
    setIsPublished(recipe.isPublished);
    setIngredients(recipe.ingredients || []);
    setIsAddingNew(false);
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients(prev => [...prev, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      onShowToast('Missing Fields', 'Please enter a recipe title and description.', 'info');
      return;
    }

    const payload = {
      title,
      description,
      category,
      price,
      image,
      prepTime,
      cookingMethod,
      chefNotes,
      isPublished,
      ingredients
    };

    if (editingRecipe) {
      updateSpecialRecipe(editingRecipe.id, payload);
      onShowToast('Special Recipe Updated', `${title} updated successfully.`, 'success');
      setEditingRecipe(null);
    } else {
      addSpecialRecipe(payload);
      onShowToast('Special Recipe Created', `${title} added to live menu specials.`, 'gold');
      setIsAddingNew(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteSpecialRecipe(id);
    setDeleteConfirmId(null);
    onShowToast('Recipe Deleted', 'Special dish removed.', 'info');
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
            <BookOpen className="w-5 h-5 text-[#C5A059]" />
            Recipe & Special Dish Management ({specialRecipes.length} Specials)
          </h2>
          <p className="text-xs text-[#D6CEBF] mt-1">
            Publish exclusive hearthside recipes, ingredients, prices in {config.currencyCode || 'PKR'}, and prep techniques.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Special Recipe
        </button>
      </div>

      {/* Recipe Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {specialRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className={`bg-[#14110F] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all ${
              recipe.isPublished ? 'border-white/10 hover:border-[#C5A059]/40' : 'border-white/5 opacity-65'
            }`}
          >
            <div className="p-5">
              <div className="flex gap-4">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-24 h-24 rounded-xl object-cover shrink-0 bg-[#1D1916] border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/15 px-2 py-0.5 rounded">
                      {recipe.category}
                    </span>
                    <span className="text-xs font-bold font-mono text-white">
                      {formatPrice(recipe.price)}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-white text-base truncate">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-[#D6CEBF]/80 line-clamp-2 mt-1 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>
              </div>

              {/* Ingredients & Prep */}
              <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs">
                {recipe.prepTime && (
                  <div className="flex items-center gap-2 text-[#D6CEBF]">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <span><strong>Prep / Smoke:</strong> {recipe.prepTime}</span>
                  </div>
                )}
                {recipe.cookingMethod && (
                  <div className="flex items-center gap-2 text-[#D6CEBF]">
                    <Flame className="w-3.5 h-3.5 text-[#E5C158] shrink-0" />
                    <span className="truncate"><strong>Method:</strong> {recipe.cookingMethod}</span>
                  </div>
                )}

                {recipe.ingredients && recipe.ingredients.length > 0 && (
                  <div className="mt-2">
                    <div className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider mb-1">
                      Key Ingredients ({recipe.ingredients.length}):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.map((ing, i) => (
                        <span key={i} className="text-[11px] bg-white/5 text-white/90 px-2 py-0.5 rounded-md border border-white/5">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-5 py-3 bg-[#110E0D] border-t border-white/5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleRecipePublish(recipe.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  recipe.isPublished 
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 text-white/50 border border-white/10'
                }`}
              >
                {recipe.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{recipe.isPublished ? 'Published Live' : 'Unpublished (Draft)'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(recipe)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-[#C5A059]/20 text-[#D6CEBF] hover:text-[#E5C158] transition-colors"
                  title="Edit Recipe"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(recipe.id)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-rose-950/40 text-white/50 hover:text-rose-400 transition-colors"
                  title="Delete Recipe"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Recipe Modal */}
      <AnimatePresence>
        {(isAddingNew || editingRecipe) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingNew(false); setEditingRecipe(null); }}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#14110F] border border-[#C5A059]/40 rounded-2xl p-6 shadow-2xl text-[#F5F2ED] max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => { setIsAddingNew(false); setEditingRecipe(null); }}
                className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C158]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    {editingRecipe ? `Edit Recipe: ${editingRecipe.title}` : 'Add New Special Recipe / Dish'}
                  </h3>
                  <p className="text-xs text-[#D6CEBF]">
                    Provide ingredients, preparation time, and hearth cooking technique.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Recipe Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g. 48-Hour Spiced Glaze Short Ribs"
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Chef's Secret Hearth"
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Price in {config.currencyCode || 'PKR'} ({config.currencySymbol || '₨'}) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      required
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                      Prep / Smoke Time
                    </label>
                    <input
                      type="text"
                      value={prepTime}
                      onChange={(e) => setPrepTime(e.target.value)}
                      placeholder="e.g. 24 Hours Marinade + 6 Hours Smoke"
                      className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Cooking Method / Technique
                  </label>
                  <input
                    type="text"
                    value={cookingMethod}
                    onChange={(e) => setCookingMethod(e.target.value)}
                    placeholder="e.g. Low & slow over hickory and cherry wood at 115°C"
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Description & Narrative *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Story and flavour journey of this dish..."
                    className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                {/* Ingredients Builder */}
                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Ingredients List ({ingredients.length})
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={ingredientInput}
                      onChange={(e) => setIngredientInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddIngredient(); } }}
                      placeholder="Add an ingredient (e.g. 500g Prime Rib, Kashmiri Chili)..."
                      className="flex-1 bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="px-4 py-2 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#E5C158] font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#1A1715] border border-white/5 min-h-[50px]">
                    {ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs border border-white/10"
                      >
                        <span>{ing}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(idx)}
                          className="hover:text-rose-400 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image & Photo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                    Special Dish Image (URL or Upload)
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

                {/* Publish Toggle */}
                <div className="p-3 rounded-xl bg-[#1A1715] border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Publish Status</div>
                    <div className="text-[11px] text-[#D6CEBF]">When published, this recipe appears under Chef Specials.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C5A059]"></div>
                  </label>
                </div>

                {/* Submit / Cancel */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => { setIsAddingNew(false); setEditingRecipe(null); }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#D6CEBF]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {editingRecipe ? 'Save Recipe' : 'Add Recipe Live'}
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
                  <h3 className="text-base font-bold text-white">Delete Special Recipe?</h3>
                  <p className="text-xs text-[#D6CEBF]">
                    This will permanently remove the recipe and ingredients from the restaurant catalogue.
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
