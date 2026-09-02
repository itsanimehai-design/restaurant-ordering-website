import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageSquareQuote, Truck, Store, Tag } from 'lucide-react';
import { CartItem, StoreSettings } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: StoreSettings;
  orderType: 'delivery' | 'pickup';
  onToggleOrderType: (type: 'delivery' | 'pickup') => void;
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: { code: string; discountAmount: number } | null;
  onApplyPromo: (code: string) => void;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  settings,
  orderType,
  onToggleOrderType,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const safeCart = Array.isArray(cart) ? cart : [];
  const subtotal = safeCart.reduce((sum, item) => sum + (item?.itemTotal || 0), 0);
  const isFreeDelivery = orderType === 'pickup' || subtotal >= (settings?.freeDeliveryThreshold ?? 2000);
  const deliveryFee = orderType === 'pickup' ? 0 : (isFreeDelivery ? 0 : (settings?.deliveryFee ?? 150));
  const discount = appliedPromo ? appliedPromo.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME10' || code === 'DEAL10') {
      onApplyPromo(code);
      setPromoInput('');
      setPromoError('');
    } else if (code === 'BITE50' || code === 'SAVE50') {
      onApplyPromo(code);
      setPromoInput('');
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try "WELCOME10" or "BITE50"');
    }
  };

  const generateWhatsAppMessage = () => {
    let msg = `*🍽️ NEW ORDER - ${settings.name}*\n\n`;
    msg += `*Order Type:* ${orderType === 'delivery' ? '🚗 Home Delivery' : '🏪 Takeaway Pickup'}\n\n`;
    msg += `*ITEMS:*\n`;

    safeCart.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}* (x${item.quantity}) - ${settings.currency} ${item.itemTotal}\n`;
      if (item.includedItemsSummary && item.includedItemsSummary.length > 0) {
        msg += `   _Included:_ ${item.includedItemsSummary.join(', ')}\n`;
      }
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        msg += `   _Options:_ ${item.selectedOptions.map((o) => `${o.groupTitle}: ${o.choiceName}`).join(', ')}\n`;
      }
      if (item.selectedAddons && item.selectedAddons.length > 0) {
        msg += `   _Add-ons:_ ${item.selectedAddons.map((a) => a.name).join(', ')}\n`;
      }
      if (item.specialInstructions) {
        msg += `   _Note:_ ${item.specialInstructions}\n`;
      }
      msg += `\n`;
    });

    msg += `*Subtotal:* ${settings.currency} ${subtotal.toLocaleString()}\n`;
    if (discount > 0) {
      msg += `*Discount (${appliedPromo?.code}):* -${settings.currency} ${discount.toLocaleString()}\n`;
    }
    msg += `*Delivery Fee:* ${deliveryFee === 0 ? 'FREE' : `${settings.currency} ${deliveryFee}`}\n`;
    msg += `*Grand Total:* *${settings.currency} ${grandTotal.toLocaleString()}*\n\n`;
    msg += `Please confirm my order and share estimated delivery time. Thank you!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-stone-900 font-serif">Your Order Cart</h2>
                <p className="text-[11px] text-stone-500">{safeCart.length} unique items added</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery / Pickup Tabs */}
          <div className="px-4 py-2.5 bg-stone-100/70 border-b border-stone-200 flex gap-2">
            <button
              type="button"
              onClick={() => onToggleOrderType('delivery')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                orderType === 'delivery'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              <span>Home Delivery</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleOrderType('pickup')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                orderType === 'pickup'
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Takeaway Pickup</span>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-bold text-stone-700 text-sm">Your cart is empty</h3>
                <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                  Add some hot deals, burger feast boxes, or chilled drinks to start your feast!
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 inline-flex items-center gap-1 bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Browse Menu & Deals
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartId} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug truncate">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartId)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Included Items Tag for Deals */}
                      {item.includedItemsSummary && item.includedItemsSummary.length > 0 && (
                        <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2">
                          <strong className="text-amber-800">Box:</strong> {item.includedItemsSummary.join(', ')}
                        </p>
                      )}

                      {/* Selected Options / Addons */}
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <p className="text-[10px] text-stone-500">
                          {item.selectedOptions.map((o) => `${o.choiceName}`).join(', ')}
                        </p>
                      )}

                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <p className="text-[10px] text-emerald-700 font-medium">
                          + {item.selectedAddons.map((a) => a.name).join(', ')}
                        </p>
                      )}

                      {item.specialInstructions && (
                        <p className="text-[10px] text-stone-400 italic">
                          "{item.specialInstructions}"
                        </p>
                      )}

                      {/* Price & Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-xs text-stone-900">
                          {settings.currency} {item.itemTotal.toLocaleString()}
                        </span>

                        <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 rounded-l"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 rounded-r"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3">
              {/* Promo code form */}
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon <strong>{appliedPromo.code}</strong> applied (-{settings.currency} {appliedPromo.discountAmount})</span>
                  </div>
                  <button
                    type="button"
                    onClick={onRemovePromo}
                    className="text-stone-400 hover:text-rose-600 text-xs font-bold ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePromoSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value);
                      setPromoError('');
                    }}
                    placeholder="Coupon code (e.g. WELCOME10)"
                    className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 uppercase focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-stone-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && <p className="text-[10px] text-rose-600">{promoError}</p>}

              {/* Cost Calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{settings.currency} {subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{settings.currency} {discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>
                    {orderType === 'pickup' ? (
                      <span className="text-emerald-600 font-bold">Takeaway (Rs. 0)</span>
                    ) : isFreeDelivery ? (
                      <span className="text-emerald-600 font-bold">FREE Delivery</span>
                    ) : (
                      `${settings.currency} ${deliveryFee}`
                    )}
                  </span>
                </div>

                {orderType === 'delivery' && !isFreeDelivery && (
                  <p className="text-[10px] text-amber-700">
                    Add {settings.currency} {(settings.freeDeliveryThreshold - subtotal).toLocaleString()} more for FREE Delivery!
                  </p>
                )}

                <div className="flex justify-between text-sm font-extrabold text-stone-950 border-t border-stone-200 pt-2">
                  <span>Grand Total</span>
                  <span className="text-base text-amber-700 font-serif">{settings.currency} {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={onProceedToCheckout}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-amber-600/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={generateWhatsAppMessage}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquareQuote className="w-4 h-4" />
                  <span>Order via WhatsApp Direct</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
