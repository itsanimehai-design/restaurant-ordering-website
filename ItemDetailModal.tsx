import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Zap, ArrowLeft } from 'lucide-react';
import { MenuItem, StoreSettings, CartItem } from '../types';

interface ItemDetailModalProps {
  item: MenuItem | null;
  settings: StoreSettings;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
  onOrderNow?: (cartItem: CartItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  settings,
  onClose,
  onAddToCart,
  onOrderNow,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const createCartItem = (): CartItem => ({
    cartId: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    itemType: 'menu_item',
    referenceId: item.id,
    name: item.name,
    image: item.image,
    basePrice: item.price,
    unitPrice: item.price,
    quantity,
    selectedAddons: [],
    selectedOptions: [],
    specialInstructions: specialInstructions.trim() || undefined,
    itemTotal: item.price * quantity,
  });

  const handleAdd = () => {
    onAddToCart(createCartItem());
    onClose();
  };

  const handleOrder = () => {
    if (onOrderNow) {
      onOrderNow(createCartItem());
    } else {
      onAddToCart(createCartItem());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Top Header Controls with Back & Close */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95 border border-stone-200/60"
            aria-label="Back to menu"
          >
            <ArrowLeft className="w-4 h-4 text-stone-800" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 flex items-center justify-center shadow-md transition-colors border border-stone-200/60"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative h-48 bg-stone-100">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-3 left-4 text-white">
            <span className="text-[10px] font-bold bg-amber-600 px-2 py-0.5 rounded uppercase">
              {item.category}
            </span>
            <h3 className="text-lg font-bold mt-1">{item.name}</h3>
          </div>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <p className="text-stone-600 leading-relaxed">{item.description}</p>

          <div className="flex items-center justify-between py-2 border-y border-stone-100">
            <span className="font-bold text-stone-700">Price per unit:</span>
            <span className="text-lg font-extrabold text-stone-900 font-serif">
              {settings.currency} {item.price.toLocaleString()}
            </span>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Cooking / Prep Note (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra ketchup, mild spice"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center border border-stone-300 rounded-xl bg-white p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg text-stone-600 hover:bg-stone-100 flex items-center justify-center"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg text-stone-600 hover:bg-stone-100 flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 sm:flex-none bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all text-xs"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleOrder}
                className="flex-1 sm:flex-none bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all text-xs"
              >
                <Zap className="w-4 h-4" />
                <span>Order Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
