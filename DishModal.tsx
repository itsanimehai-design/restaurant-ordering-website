import React from 'react';
import { MenuItem, PageId } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { AtmosphericVaporEffect } from './AtmosphericVaporEffect';
import { X, Flame, AlertCircle, Bookmark, BookmarkCheck, CalendarCheck, Sparkles, CupSoda, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AiAssistantButton } from './AiAssistantButton';

interface DishModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (dishId: string) => void;
  onNavigate: (page: PageId) => void;
}

export const DishModal: React.FC<DishModalProps> = ({
  dish,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onNavigate,
}) => {
  const { formatPrice, addToCart, openOrderModal } = useRestaurantData();

  if (!dish) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#14110f] border border-[#2e2620] rounded-2xl overflow-hidden shadow-2xl z-10 my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#0d0b0a]/70 hover:bg-[#0d0b0a] text-[#f5efe6] border border-white/10 transition-colors cursor-pointer"
            aria-label="Close dish preview"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dish Image Header */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#0c0a09]">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-transparent to-black/30" />
            <AtmosphericVaporEffect item={dish} />

            {/* Badges on Image */}
            <div className="absolute bottom-4 left-6 flex flex-wrap items-center gap-2">
              {dish.isChefSpecial && (
                <span className="px-3 py-1 rounded-full bg-[#d4af37] text-[#0d0b0a] text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  Chef's Special
                </span>
              )}
              {dish.isNew && (
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-xs font-bold uppercase tracking-wider shadow-lg">
                  New Dish
                </span>
              )}
              {dish.isVegetarian && (
                <span className="px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                  Vegetarian
                </span>
              )}
              {dish.isGlutenFree && (
                <span className="px-3 py-1 rounded-full bg-amber-900/80 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                  Gluten-Free
                </span>
              )}
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#26201a] pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#c59b27] font-semibold block mb-1">
                  {dish.category.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#fdfbf7]">
                    {dish.name}
                  </h3>
                  <AiAssistantButton
                    context={{
                      section: 'food',
                      itemId: dish.id,
                      itemName: dish.name,
                      itemPrice: dish.price,
                      category: dish.category,
                      title: dish.name
                    }}
                    variant="pill"
                    label="Ask AI"
                    size="xs"
                  />
                </div>
              </div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#d4af37]">
                {formatPrice(dish.price)}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#c5bcad] leading-relaxed">
              {dish.description}
            </p>

            {/* Beverage Pairing Recommendation */}
            {dish.pairingNote && (
              <div className="p-4 rounded-xl bg-[#1c1714] border border-[#d4af37]/20 flex items-start gap-3">
                <CupSoda className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block">
                    Chef’s Recommended Beverage Pairing (100% Halal)
                  </span>
                  <p className="text-sm text-[#f5efe6] font-medium mt-0.5">
                    {dish.pairingNote}
                  </p>
                </div>
              </div>
            )}

            {/* Spice & Allergen Notes */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-[#9d9385] pt-2">
              {dish.spiceLevel !== undefined && dish.spiceLevel > 0 && (
                <div className="flex items-center gap-1.5 text-[#e67e22]">
                  <Flame className="w-4 h-4" />
                  <span>
                    Ember Spice Level: <strong>{dish.spiceLevel} of 3</strong>
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[#9d9385]">
                <AlertCircle className="w-4 h-4 text-[#7a7063]" />
                <span>Made fresh to order in our open hearth kitchen</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#26201a]">
              <button
                onClick={() => onToggleWishlist(dish.id)}
                className={`w-full sm:w-auto px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  isWishlisted
                    ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#fdfbf7]'
                    : 'bg-[#1a1613] border-[#362c24] text-[#c5bcad] hover:text-[#fdfbf7] hover:border-[#d4af37]/40'
                }`}
              >
                {isWishlisted ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-[#d4af37]" />
                    Wishlisted
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    Save Wishlist
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  addToCart({
                    id: dish.id,
                    name: dish.name,
                    price: dish.price,
                    category: dish.category,
                    image: dish.image,
                  });
                  onClose();
                }}
                className="w-full sm:flex-1 py-3 rounded-xl bg-[#2a1e14] hover:bg-[#38281b] text-[#fdfbf7] border border-[#d4af37]/60 text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#d4af37] stroke-[2.5]" />
                <span>Add to Cart ({formatPrice(dish.price)})</span>
              </button>

              <button
                onClick={() => {
                  addToCart({
                    id: dish.id,
                    name: dish.name,
                    price: dish.price,
                    category: dish.category,
                    image: dish.image,
                  });
                  onClose();
                  openOrderModal('delivery', undefined, 'checkout');
                }}
                className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#d4af37] hover:brightness-110 text-[#120f0d] text-xs uppercase tracking-widest font-black flex items-center justify-center gap-1.5 shadow-lg shadow-[#d4af37]/25 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Checkout Now</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
