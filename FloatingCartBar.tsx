import React, { useState, useEffect, useMemo } from 'react';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { 
  ShoppingBag, 
  ArrowRight, 
  Trash2, 
  Plus, 
  Minus, 
  Bike, 
  Store, 
  ChevronUp, 
  ChevronDown, 
  Sparkles,
  X,
  UtensilsCrossed,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingCartBarProps {
  onShowToast?: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ onShowToast }) => {
  const {
    cartItems,
    lastAddedItem,
    lastAddedTimestamp,
    updateCartQty,
    removeFromCart,
    clearCart,
    openOrderModal,
    isOrderModalOpen,
    isOwnerModeActive,
    formatPrice,
    config
  } = useRestaurantData();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [justAddedAlert, setJustAddedAlert] = useState<string | null>(null);

  // Total quantity of items in cart
  const totalQuantity = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  // Delivery charge calculation from config
  const minOrderForFree = config?.deliverySettings?.freeDeliveryThreshold || 2000;
  const isFreeDelivery = subtotal >= minOrderForFree;
  const deliveryFee = isFreeDelivery ? 0 : (config?.deliverySettings?.deliveryFee ?? 150);
  const estimatedTotal = subtotal + (orderType === 'delivery' ? deliveryFee : 0);

  // Flash highlight when an item is added
  useEffect(() => {
    if (lastAddedItem && lastAddedTimestamp > 0) {
      // Auto restore from minimized if user adds an item
      setIsMinimized(false);
      setJustAddedAlert(lastAddedItem.name);
      
      const timer = setTimeout(() => {
        setJustAddedAlert(null);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [lastAddedTimestamp, lastAddedItem]);

  // Auto close expanded tray when cart becomes empty
  useEffect(() => {
    if (cartItems.length === 0) {
      setIsExpanded(false);
      setIsMinimized(false);
    }
  }, [cartItems.length]);

  // Do not show floating bar if cart is empty, order modal is open, or in owner dashboard
  if (cartItems.length === 0 || isOrderModalOpen || isOwnerModeActive) {
    return null;
  }

  // Handle direct navigation to checkout step
  const handleProceedToCheckout = () => {
    setIsExpanded(false);
    openOrderModal(orderType, undefined, 'checkout');
    if (onShowToast) {
      onShowToast('Proceeding to Checkout', `Completing order for ${totalQuantity} items.`, 'gold');
    }
  };

  // Handle opening cart review in modal
  const handleViewFullCart = () => {
    setIsExpanded(false);
    openOrderModal(orderType, undefined, 'cart');
  };

  return (
    <aside 
      aria-label="Shopping cart quick bar"
      className="fixed bottom-3 sm:bottom-4 lg:bottom-6 left-0 right-0 z-35 pointer-events-none px-3 sm:px-6"
    >
      <div className="max-w-2xl mx-auto pointer-events-auto relative">
        <AnimatePresence>
          {/* ════════════════════════════════════════════════════════════════
              EXPANDED MINI-CART TRAY (POPOVER)
              ════════════════════════════════════════════════════════════════ */}
          {isExpanded && !isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="mb-2 bg-[#14110e]/98 border border-[#d4af37]/40 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/90 backdrop-blur-2xl p-4 sm:p-5 overflow-hidden text-[#f7f4ef]"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 25px rgba(212, 175, 55, 0.15)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#2a221a]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-display font-bold text-[#fdfbf7] tracking-wide flex items-center gap-2">
                      <span>Your Order Summary</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] font-semibold">
                        {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                      </span>
                    </h2>
                    <p className="text-[11px] text-[#a89d91]">Review dishes or adjust quantities before checkout</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={clearCart}
                    className="p-1.5 text-xs text-[#a89d91] hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="Clear entire cart"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Clear</span>
                  </button>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 text-[#a89d91] hover:text-white hover:bg-[#251e18] rounded-lg transition-colors cursor-pointer"
                    title="Close preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Delivery / Pickup Choice in Tray */}
              <div className="mt-3 flex items-center p-1 rounded-xl bg-[#1b1612] border border-[#2e241c] text-xs">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
                    orderType === 'delivery'
                      ? 'bg-[#d4af37] text-black shadow-md'
                      : 'text-[#a89d91] hover:text-white'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Home Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
                    orderType === 'pickup'
                      ? 'bg-[#d4af37] text-black shadow-md'
                      : 'text-[#a89d91] hover:text-white'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Takeaway Pickup</span>
                </button>
              </div>

              {/* Scrollable Items List */}
              <div className="mt-3 max-h-56 sm:max-h-64 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#1a1410] border border-[#2d241d] hover:border-[#d4af37]/30 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-11 h-11 rounded-lg object-cover border border-[#3b2f25] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-[#251c15] border border-[#3b2f25] flex items-center justify-center text-[#d4af37] shrink-0">
                          <UtensilsCrossed className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm font-bold text-[#fdfbf7] truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 text-[11px] text-[#a89d91] mt-0.5">
                          <span className="text-[#d4af37] font-semibold">{formatPrice(item.price)} each</span>
                          {item.servingSize && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-[#251e18] rounded text-[#c5bcad]">
                              {item.servingSize}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-[#fdfbf7] min-w-[3.5rem] text-right">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <div className="flex items-center bg-[#251e18] rounded-lg border border-[#3d3024] p-0.5">
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#a89d91] hover:text-white hover:bg-[#34291f] transition-colors cursor-pointer"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#fdfbf7]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#a89d91] hover:text-white hover:bg-[#34291f] transition-colors cursor-pointer"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-[#8c8275] hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                        title="Remove item"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Breakdown & Action Buttons */}
              <div className="mt-4 pt-3 border-t border-[#2a221a] flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs text-[#a89d91]">
                  <span>Subtotal ({totalQuantity} items):</span>
                  <span className="text-[#fdfbf7] font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {orderType === 'delivery' && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#a89d91]">Estimated Delivery Fee:</span>
                    <span className={isFreeDelivery ? 'text-emerald-400 font-bold' : 'text-[#fdfbf7] font-semibold'}>
                      {isFreeDelivery ? 'FREE' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-[#231b15]">
                  <span className="text-sm font-bold text-[#fdfbf7]">Total Payable:</span>
                  <span className="text-base sm:text-lg font-black text-[#d4af37]">
                    {formatPrice(estimatedTotal)}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleViewFullCart}
                    className="flex-1 py-2.5 rounded-xl bg-[#231a14] hover:bg-[#32251c] text-[#c5bcad] hover:text-white border border-[#3b2d22] text-xs uppercase font-bold tracking-wider transition-all cursor-pointer text-center"
                  >
                    View Full Cart
                  </button>
                  <button
                    onClick={handleProceedToCheckout}
                    className="flex-[1.5] py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#d4af37] text-black text-xs uppercase font-extrabold tracking-wider shadow-lg shadow-[#d4af37]/25 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════════════════════════════
            COLLAPSED / FLOATING PILL (WHEN MINIMIZED)
            ════════════════════════════════════════════════════════════════ */}
        {isMinimized ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex justify-end"
          >
            <button
              onClick={() => setIsMinimized(false)}
              className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#18130f]/95 border-2 border-[#d4af37] text-[#fdfbf7] shadow-2xl shadow-black/80 hover:bg-[#251d16] transition-all cursor-pointer backdrop-blur-xl"
              style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(212, 175, 55, 0.4)',
              }}
              title="Expand Cart"
              aria-label={`Open Cart (${totalQuantity} items, ${formatPrice(subtotal)})`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" />
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#d4af37] text-black text-[10px] font-black flex items-center justify-center shadow-md">
                  {totalQuantity}
                </span>
              </div>
              <div className="text-left leading-tight">
                <span className="text-[10px] uppercase tracking-wider text-[#a89d91] font-bold block">Cart</span>
                <span className="text-xs font-black text-[#d4af37]">{formatPrice(subtotal)}</span>
              </div>
              <ChevronUp className="w-4 h-4 text-[#d4af37]" />
            </button>
          </motion.div>
        ) : (
          /* ════════════════════════════════════════════════════════════════
              PRIMARY FLOATING CART BAR DOCK
              ════════════════════════════════════════════════════════════════ */
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className="group relative rounded-2xl sm:rounded-full bg-[#120f0d]/95 border border-[#d4af37]/50 shadow-2xl shadow-black/90 backdrop-blur-2xl p-2 sm:p-2.5 transition-all"
            style={{
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(212, 175, 55, 0.2)',
            }}
          >
            {/* Real-time Just Added Micro-Banner Alert */}
            <AnimatePresence>
              {justAddedAlert && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: -42, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none whitespace-nowrap px-3.5 py-1.5 rounded-full bg-[#1b1510] border border-[#d4af37] text-[#d4af37] text-xs font-bold shadow-xl flex items-center gap-1.5 z-40"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  <span>Added <strong className="text-white">{justAddedAlert}</strong> to Cart!</span>
                  <Sparkles className="w-3 h-3 text-[#d4af37] animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Left Side: Cart Icon, Item Avatars Stack & Price */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2.5 sm:gap-3 text-left p-1 rounded-xl sm:rounded-full hover:bg-[#1f1914] transition-colors cursor-pointer shrink-0"
                aria-label="Toggle cart details"
              >
                {/* Bag with Counter Badge */}
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#2a1e14] to-[#17110c] border border-[#d4af37]/60 flex items-center justify-center text-[#d4af37] shadow-inner shrink-0">
                  <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#d4af37] text-black text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                    {totalQuantity}
                  </span>
                </div>

                {/* Stacking Avatars of Cart Items (Desktop/Tablet) */}
                <div className="hidden md:flex items-center -space-x-2 overflow-hidden shrink-0">
                  {cartItems.slice(0, 3).map((item, idx) => (
                    <div
                      key={item.id + idx}
                      className="w-7 h-7 rounded-full border-2 border-[#120f0d] bg-[#221a14] overflow-hidden shrink-0"
                      title={item.name}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-[#d4af37]">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <div className="w-7 h-7 rounded-full border-2 border-[#120f0d] bg-[#2d2218] flex items-center justify-center text-[9px] font-black text-[#d4af37] shrink-0">
                      +{cartItems.length - 3}
                    </div>
                  )}
                </div>

                {/* Subtotal & Label */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-[#fdfbf7] tracking-wide">
                      {formatPrice(subtotal)}
                    </span>
                    <span className="text-[10px] text-[#a89d91] font-medium hidden sm:inline">
                      ({totalQuantity} {totalQuantity === 1 ? 'dish' : 'dishes'})
                    </span>
                  </div>
                  <span className="text-[10px] text-[#d4af37] font-semibold flex items-center gap-1">
                    <span>{isExpanded ? 'Hide details' : 'View summary'}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronUp className="w-3 h-3" />
                    )}
                  </span>
                </div>
              </button>

              {/* Right Side: Quick Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* View Cart Details Button (Toggles Tray) */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-full bg-[#201812] hover:bg-[#2c2119] border border-[#3d2f24] text-[#c5bcad] hover:text-[#fdfbf7] text-xs font-bold transition-all cursor-pointer"
                >
                  <span>{isExpanded ? 'Collapse' : 'Cart Tray'}</span>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>

                {/* PROCEED TO CHECKOUT BUTTON */}
                <button
                  type="button"
                  id="floating-cart-checkout-btn"
                  onClick={handleProceedToCheckout}
                  className="group relative px-4 sm:px-6 py-2.5 sm:py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#d4af37] text-black text-xs sm:text-xs uppercase font-black tracking-wider shadow-lg shadow-[#d4af37]/30 hover:shadow-[#d4af37]/50 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
                  title="Proceed to checkout screen"
                >
                  <Bike className="w-3.5 h-3.5 text-black sm:inline hidden" />
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Minimize Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false);
                    setIsMinimized(true);
                  }}
                  className="p-2 rounded-full text-[#7d7367] hover:text-[#fdfbf7] hover:bg-[#221a14] transition-colors cursor-pointer"
                  title="Minimize floating bar"
                  aria-label="Minimize floating cart bar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </aside>
  );
};
