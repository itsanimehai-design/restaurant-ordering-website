import React from 'react';
import { MenuItem, PageId } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { X, Trash2, CalendarCheck, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: MenuItem[];
  onRemoveItem: (dishId: string) => void;
  onClearWishlist: () => void;
  onProceedToReservation: () => void;
  onNavigate: (page: PageId) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveItem,
  onClearWishlist,
  onProceedToReservation,
  onNavigate,
}) => {
  const { formatPrice } = useRestaurantData();
  const totalPrice = wishlistItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-[#120f0d] border-l border-[#2e2620] shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#26201a] flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#fdfbf7]">
                    Dining Wishlist
                  </h3>
                  <p className="text-xs text-[#9d9385] mt-0.5">
                    {wishlistItems.length} curated {wishlistItems.length === 1 ? 'dish' : 'dishes'} saved for your reservation
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-[#9d9385] hover:text-[#fdfbf7] hover:bg-[#1f1a16] transition-colors cursor-pointer"
                  aria-label="Close wishlist"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlistItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                    <div className="w-16 h-16 rounded-full bg-[#1a1613] border border-[#2e2620] flex items-center justify-center mb-4 text-[#d4af37]">
                      <UtensilsCrossed className="w-8 h-8 opacity-60" />
                    </div>
                    <h4 className="font-serif text-lg text-[#fdfbf7]">Your Wishlist is Empty</h4>
                    <p className="text-xs text-[#9d9385] mt-1.5 max-w-xs leading-relaxed">
                      Browse our tasting menu to save your desired dishes. They will automatically be attached to your table booking request.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigate('menu');
                      }}
                      className="mt-6 btn-outline-gold px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                    >
                      Explore The Menu
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                        Selected Flavours
                      </span>
                      <button
                        onClick={onClearWishlist}
                        className="text-xs text-[#8c8275] hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Clear All
                      </button>
                    </div>

                    <div className="space-y-3">
                      {wishlistItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[#181412] border border-[#26201a] group hover:border-[#d4af37]/30 transition-all"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover bg-[#0d0b0a] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-[#fdfbf7] truncate">
                              {item.name}
                            </h5>
                            <span className="text-xs text-[#9d9385] block capitalize">
                              {item.category.replace('-', ' ')}
                            </span>
                            <span className="text-xs font-semibold text-[#d4af37]">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1.5 rounded-md text-[#7a7063] hover:text-rose-400 hover:bg-[#221c17] transition-colors cursor-pointer"
                            aria-label={`Remove ${item.name} from wishlist`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer */}
              {wishlistItems.length > 0 && (
                <div className="p-6 border-t border-[#26201a] bg-[#171412] space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#c5bcad]">Tasting Selection Estimate:</span>
                    <span className="font-serif text-xl font-bold text-[#d4af37]">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onProceedToReservation();
                    }}
                    className="w-full btn-gold py-3.5 rounded-lg text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    Book Table with This Selection
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
