import React, { useState } from 'react';
import {
  X,
  Truck,
  Store,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle,
  AlertCircle,
  MessageSquareQuote,
  Copy,
  Check,
} from 'lucide-react';
import { CartItem, Order, StoreSettings } from '../types';
import { apiPlaceOrder } from '../lib/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: StoreSettings;
  orderType: 'delivery' | 'pickup';
  onToggleOrderType: (type: 'delivery' | 'pickup') => void;
  onOrderPlaced: (order: Order) => void;
  appliedPromo: { code: string; discountAmount: number } | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  settings,
  orderType,
  onToggleOrderType,
  onOrderPlaced,
  appliedPromo,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryArea, setDeliveryArea] = useState(
    Array.isArray(settings.deliveryAreas) && settings.deliveryAreas.length > 0
      ? settings.deliveryAreas[0]
      : 'Main Area'
  );
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'jazzcash_easypaisa' | 'card'>('cash_on_delivery');
  const [selectedOnlineWallet, setSelectedOnlineWallet] = useState<'jazzcash' | 'easypaisa'>('jazzcash');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const safeCart = Array.isArray(cart) ? cart : [];
  const subtotal = safeCart.reduce((sum, item) => sum + (item?.itemTotal || 0), 0);
  const freeThreshold = settings.freeDeliveryThreshold ?? settings.deliveryRules?.freeDeliveryThreshold ?? 1800;
  const standardFee = settings.deliveryFee ?? settings.deliveryRules?.standardFee ?? 150;
  const isFreeDelivery = orderType === 'pickup' || subtotal >= freeThreshold;
  const deliveryFee = orderType === 'pickup' ? 0 : (isFreeDelivery ? 0 : standardFee);
  const discount = appliedPromo ? appliedPromo.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(key);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.name = 'Please enter your full name';
    if (!customerPhone.trim() || customerPhone.replace(/[^0-9]/g, '').length < 8) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      errs.address = 'Please enter your delivery street/house address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const orderPayload: Partial<Order> = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        orderType,
        deliveryArea: orderType === 'delivery' ? deliveryArea : undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        paymentMethod: paymentMethod === 'jazzcash_easypaisa'
          ? (`${selectedOnlineWallet}_online` as any)
          : paymentMethod,
        items: safeCart,
        subtotal,
        deliveryFee,
        discount,
        grandTotal,
        specialInstructions: specialInstructions.trim() || undefined,
      };

      const placedOrder = await apiPlaceOrder(orderPayload);
      onOrderPlaced(placedOrder);
    } catch (err: any) {
      console.error('Order error:', err);
      setServerError(err.message || 'Failed to place order. Please check your items and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppCheckout = () => {
    if (!validate()) return;
    let msg = `*🍽️ ORDER - ${settings.name}*\n\n`;
    msg += `*Customer:* ${customerName}\n`;
    msg += `*Phone:* ${customerPhone}\n`;
    if (customerEmail) msg += `*Email:* ${customerEmail}\n`;
    msg += `*Type:* ${orderType === 'delivery' ? `🚗 Delivery to: ${deliveryAddress} (${deliveryArea})` : '🏪 Takeaway / Pickup'}\n`;
    msg += `*Payment:* ${
      paymentMethod === 'jazzcash_easypaisa'
        ? selectedOnlineWallet.toUpperCase()
        : paymentMethod.replace(/_/g, ' ').toUpperCase()
    }\n\n`;
    msg += `*ORDER ITEMS:*\n`;

    safeCart.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}* (x${item.quantity}) - ${settings.currency} ${item.itemTotal}\n`;
      if (item.includedItemsSummary && item.includedItemsSummary.length > 0) {
        msg += `   _Items:_ ${item.includedItemsSummary.join(', ')}\n`;
      }
      if (item.selectedAddons && item.selectedAddons.length > 0) {
        msg += `   _Add-ons:_ ${item.selectedAddons.map((a) => a.name).join(', ')}\n`;
      }
    });

    msg += `\n*Subtotal:* ${settings.currency} ${subtotal.toLocaleString()}`;
    if (deliveryFee > 0) msg += `\n*Delivery Fee:* ${settings.currency} ${deliveryFee}`;
    if (discount > 0) msg += `\n*Discount:* -${settings.currency} ${discount}`;
    msg += `\n*Grand Total:* *${settings.currency} ${grandTotal.toLocaleString()}*\n`;
    if (specialInstructions) msg += `\n*Special Instructions:* ${specialInstructions}\n`;

    const targetNumber = (settings.whatsappNumber || '923001234567').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${targetNumber}?text=${encoded}`, '_blank');
  };

  const deliveryAreasList = Array.isArray(settings.deliveryAreas) && settings.deliveryAreas.length > 0
    ? settings.deliveryAreas
    : ['Gulberg', 'DHA Phase 1 - 6', 'Model Town', 'Johar Town', 'F-7 / Blue Area', 'Other Area'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-stone-900 font-serif">Checkout & Place Order</h2>
            <p className="text-xs text-stone-500">Instant confirmation with real-time order tracking</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Unable to process order:</p>
              <p className="mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* 1. Order Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
              1. Delivery Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onToggleOrderType('delivery')}
                className={`p-3 sm:p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                  orderType === 'delivery'
                    ? 'border-amber-600 bg-amber-50/60 text-amber-950 ring-1 ring-amber-500 shadow-xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className={`p-2 rounded-xl ${orderType === 'delivery' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-extrabold">Home Delivery</p>
                  <p className="text-[11px] text-stone-500">{settings.estimatedDeliveryTime || '30-45 mins'}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onToggleOrderType('pickup')}
                className={`p-3 sm:p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                  orderType === 'pickup'
                    ? 'border-amber-600 bg-amber-50/60 text-amber-950 ring-1 ring-amber-500 shadow-xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className={`p-2 rounded-xl ${orderType === 'pickup' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  <Store className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-extrabold">Takeaway Pickup</p>
                  <p className="text-[11px] text-stone-500">Ready in 15-20 mins</p>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Customer Contact */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
              2. Contact Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="e.g. Ali Ahmed"
                  className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-rose-500 ring-rose-200' : 'border-stone-300 focus:border-amber-500 focus:ring-amber-500/20'
                  }`}
                />
                {errors.name && <p className="text-[10px] text-rose-600 font-medium mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Phone Number (Calling / WhatsApp) *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  placeholder="e.g. 0300 1234567"
                  className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-rose-500 ring-rose-200' : 'border-stone-300 focus:border-amber-500 focus:ring-amber-500/20'
                  }`}
                />
                {errors.phone && <p className="text-[10px] text-rose-600 font-medium mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-500 block mb-1">Email Address (Optional for e-receipt)</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="e.g. name@example.com"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* 3. Conditional Home Address (Required for Delivery, Hidden for Pickup) */}
          {orderType === 'delivery' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                3. Delivery Address
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">Delivery Area *</label>
                  <select
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    {deliveryAreasList.map((area, idx) => (
                      <option key={idx} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">House / Flat / Street / Landmark Address *</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                    }}
                    placeholder="e.g. House #14-B, Street 5, Near City Hospital"
                    className={`w-full bg-stone-50 border rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 ${
                      errors.address ? 'border-rose-500 ring-rose-200' : 'border-stone-300 focus:border-amber-500 focus:ring-amber-500/20'
                    }`}
                  />
                  {errors.address && <p className="text-[10px] text-rose-600 font-medium mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>
          )}

          {/* 4. Payment Method */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
              {orderType === 'delivery' ? '4.' : '3.'} Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500 shadow-2xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${paymentMethod === 'cash_on_delivery' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  <Banknote className="w-4 h-4" />
                </div>
                <span>{orderType === 'pickup' ? 'Cash on Pickup' : 'Cash on Delivery'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('jazzcash_easypaisa')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
                  paymentMethod === 'jazzcash_easypaisa'
                    ? 'border-amber-600 bg-amber-50 text-amber-950 ring-1 ring-amber-500 shadow-2xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${paymentMethod === 'jazzcash_easypaisa' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  <Smartphone className="w-4 h-4" />
                </div>
                <span>JazzCash / EasyPaisa</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50 text-blue-950 ring-1 ring-blue-500 shadow-2xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <span>Card on Delivery</span>
              </button>
            </div>

            {/* Online Payment Details (JazzCash & Easypaisa) */}
            {paymentMethod === 'jazzcash_easypaisa' && (
              <div className="mt-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-3 animate-in fade-in duration-150">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOnlineWallet('jazzcash')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      selectedOnlineWallet === 'jazzcash'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    JazzCash Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOnlineWallet('easypaisa')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      selectedOnlineWallet === 'easypaisa'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    Easypaisa Account
                  </button>
                </div>

                {selectedOnlineWallet === 'jazzcash' ? (
                  <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Account Title:</span>
                      <strong className="text-stone-900">{settings.jazzCashAccountTitle || settings.name || 'PakBite Food'}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">JazzCash Number:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="font-mono text-stone-900">{settings.jazzCashAccountNumber || '0300-1234567'}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy(settings.jazzCashAccountNumber || '0300-1234567', 'jazz')}
                          className="p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600"
                          title="Copy Number"
                        >
                          {copiedAccount === 'jazz' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-amber-800 pt-1 border-t border-amber-100">
                      Transfer <strong className="font-bold">{settings.currency} {grandTotal.toLocaleString()}</strong> to this JazzCash number and keep transaction screenshot handy.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Account Title:</span>
                      <strong className="text-stone-900">{settings.easypaisaAccountTitle || settings.name || 'PakBite Food'}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Easypaisa Number:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="font-mono text-stone-900">{settings.easypaisaAccountNumber || '0300-1234567'}</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy(settings.easypaisaAccountNumber || '0300-1234567', 'easy')}
                          className="p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600"
                          title="Copy Number"
                        >
                          {copiedAccount === 'easy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-emerald-800 pt-1 border-t border-emerald-100">
                      Transfer <strong className="font-bold">{settings.currency} {grandTotal.toLocaleString()}</strong> to this Easypaisa number and keep transaction screenshot handy.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 5. Special Instructions */}
          <div>
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-1">
              Order Notes / Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra napkins, no spicy sauce, ring bell twice"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* 6. Order Bill Breakdown */}
          <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Subtotal ({safeCart.length} item{safeCart.length !== 1 ? 's' : ''}):</span>
              <span className="font-semibold text-stone-900">{settings.currency} {subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Promo Discount:</span>
                <span>-{settings.currency} {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee:</span>
              <span>{deliveryFee === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : `${settings.currency} ${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-stone-950 border-t border-stone-200 pt-3">
              <span>Total Payable:</span>
              <span className="text-base text-amber-700 font-serif font-black">{settings.currency} {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* 7. Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || safeCart.length === 0}
              className="w-full sm:flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Confirming with Server...'
                  : `Confirm & Place Order (${settings.currency} ${grandTotal.toLocaleString()})`}
              </span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppCheckout}
              disabled={isSubmitting || safeCart.length === 0}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>Order via WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
