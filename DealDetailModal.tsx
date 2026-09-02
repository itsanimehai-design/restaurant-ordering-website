import React, { useState, useMemo } from 'react';
import { X, Check, Plus, Minus, ShoppingBag, Zap, Clock, Users, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';
import { DealBox, DealAddon, StoreSettings, CartItem } from '../types';

interface DealDetailModalProps {
  deal: DealBox | null;
  settings: StoreSettings;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
  onOrderNow: (cartItem: CartItem) => void;
}

export const DealDetailModal: React.FC<DealDetailModalProps> = ({
  deal,
  settings,
  onClose,
  onAddToCart,
  onOrderNow,
}) => {
  if (!deal) return null;

  // Selected addons: set of addon IDs
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  // Selected options: map of groupId -> choiceId
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    deal?.optionGroups?.forEach((group) => {
      if (group?.id && Array.isArray(group.choices) && group.choices.length > 0 && group.choices[0]?.id) {
        initial[group.id] = group.choices[0].id;
      }
    });
    return initial;
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleOptionChange = (groupId: string, choiceId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [groupId]: choiceId }));
  };

  // Calculate Unit & Total Price
  const { unitPrice, totalPrice, chosenAddonsList, chosenOptionsList } = useMemo(() => {
    let unit = deal?.price || 0;

    const chosenAddons: { id: string; name: string; price: number }[] = [];
    (deal?.addons || []).forEach((addon) => {
      if (selectedAddonIds.includes(addon.id)) {
        unit += addon.price;
        chosenAddons.push({ id: addon.id, name: addon.name, price: addon.price });
      }
    });

    const chosenOpts: { groupTitle: string; choiceName: string; extraPrice?: number }[] = [];
    (deal?.optionGroups || []).forEach((group) => {
      const selectedChoiceId = selectedOptions[group.id];
      const choice = (group?.choices || []).find((c) => c.id === selectedChoiceId);
      if (choice) {
        if (choice.extraPrice) unit += choice.extraPrice;
        chosenOpts.push({ groupTitle: group.title, choiceName: choice.name, extraPrice: choice.extraPrice });
      }
    });

    const total = unit * quantity;
    return {
      unitPrice: unit,
      totalPrice: total,
      chosenAddonsList: chosenAddons,
      chosenOptionsList: chosenOpts,
    };
  }, [deal, selectedAddonIds, selectedOptions, quantity]);

  const createCartItem = (): CartItem => {
    const includedSummary = (deal.includedItems || []).map(
      (item) => `${item.quantity}x ${item.name}${item.unit ? ` (${item.unit})` : ''}`
    );

    return {
      cartId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      itemType: 'deal',
      referenceId: deal.id,
      name: deal.name,
      image: deal.image,
      basePrice: deal.price,
      unitPrice,
      quantity,
      selectedAddons: chosenAddonsList,
      selectedOptions: chosenOptionsList,
      includedItemsSummary: includedSummary,
      specialInstructions: specialInstructions.trim() || undefined,
      itemTotal: totalPrice,
    };
  };

  const handleAdd = () => {
    onAddToCart(createCartItem());
    onClose();
  };

  const handleInstantOrder = () => {
    onOrderNow(createCartItem());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar with Responsive Back & Close buttons */}
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Deal Image & Badges */}
          <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden bg-stone-100 -mt-2">
            <img
              src={deal.image}
              alt={deal.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {deal.discount && (
                <span className="bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                  {deal.discount}
                </span>
              )}
              {deal.tag && (
                <span className="bg-amber-500 text-stone-950 text-xs font-extrabold px-2.5 py-1 rounded-full uppercase">
                  {deal.tag}
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-4 right-4 text-white">
              <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">{deal.name}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-200 mt-1">
                {deal.servings && (
                  <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded">
                    <Users className="w-3.5 h-3.5 text-amber-300" /> {deal.servings}
                  </span>
                )}
                {deal.prepTimeMinutes && (
                  <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded">
                    <Clock className="w-3.5 h-3.5 text-stone-300" /> ~{deal.prepTimeMinutes} mins prep
                  </span>
                )}
                <span className="bg-emerald-600/90 text-white font-bold px-2 py-0.5 rounded">
                  {deal.category}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {deal.description && (
            <p className="text-sm text-stone-600 leading-relaxed">{deal.description}</p>
          )}

          {/* INCLUDED ITEMS DETAILED BREAKDOWN */}
          {deal.includedItems && deal.includedItems.length > 0 && (
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
              <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>What's Inside This Deal / Box:</span>
                </span>
                <span className="text-[11px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                  {deal.includedItems.length} items included
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {deal.includedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-2.5 rounded-lg border border-stone-200/80 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900 leading-snug">{item.name}</p>
                        {item.note && <p className="text-[10px] text-stone-500">{item.note}</p>}
                      </div>
                    </div>
                    {item.unit && (
                      <span className="text-[10px] text-stone-400 font-medium lowercase">
                        {item.unit}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OPTION GROUPS (e.g. Drink Flavors, Spice Level) */}
          {deal.optionGroups && deal.optionGroups.length > 0 && (
            <div className="space-y-4">
              {deal.optionGroups.map((group) => (
                <div key={group.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      {group.title}
                    </label>
                    {group.required && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.choices.map((choice) => {
                      const isSelected = selectedOptions[group.id] === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => handleOptionChange(group.id, choice.id)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-400'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            <span>{choice.name}</span>
                          </div>
                          {choice.extraPrice ? (
                            <span className="text-amber-700 font-bold text-[11px]">
                              +{settings.currency} {choice.extraPrice}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ADD-ONS / UPSELLS */}
          {deal.addons && deal.addons.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                Popular Add-ons & Extras (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {deal.addons.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-400'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-stone-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{addon.name}</span>
                      </div>
                      <span className="text-emerald-700 font-bold text-[11px]">
                        +{settings.currency} {addon.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-1.5">
              Special Instructions for the Kitchen (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra napkins, no spicy sauce on burger #1, etc."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Modal Bottom Bar: Quantity & Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center border border-stone-300 rounded-xl bg-white p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg text-stone-600 hover:bg-stone-100 flex items-center justify-center transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-stone-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg text-stone-600 hover:bg-stone-100 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right sm:text-left">
              <span className="text-[10px] text-stone-500 block uppercase font-bold">Total Price:</span>
              <span className="text-xl font-extrabold text-stone-900 font-serif">
                {settings.currency} {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleInstantOrder}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-amber-600/25 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Order Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
