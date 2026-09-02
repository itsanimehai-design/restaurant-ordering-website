import React, { useState, useEffect, useMemo } from 'react';
import { 
  CustomerOrder, 
  OrderStatus, 
  PageId, 
  MenuItem, 
  DessertBarItem 
} from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { 
  X, 
  ShoppingBag, 
  Bike, 
  Store, 
  Plus, 
  Minus, 
  Trash2, 
  Clock, 
  Phone, 
  User, 
  Mail,
  MapPin, 
  FileText, 
  CheckCircle2, 
  Ban, 
  Send, 
  ChevronLeft,
  ChevronRight, 
  Sparkles, 
  Flame,
  IceCream,
  CupSoda,
  Check,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  QrCode,
  Banknote,
  CreditCard,
  Building2,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BackButton } from './BackButton';
import { AiAssistantButton } from './AiAssistantButton';

interface OnlineOrderModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialOrderType?: 'delivery' | 'pickup';
  onNavigate?: (page: PageId) => void;
}

export const OnlineOrderModal: React.FC<OnlineOrderModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  initialOrderType: propInitialOrderType,
  onNavigate,
}) => {
  const { 
    config, 
    menuItems, 
    dessertBarItems, 
    formatPrice,
    orders,
    activeOrder,
    placeOrder,
    cancelOrder,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    isOrderModalOpen,
    setIsOrderModalOpen,
    initialOrderType: contextOrderType,
    initialOrderStep: contextOrderStep,
  } = useRestaurantData();

  // Effective modal visibility & close handler
  const isModalVisible = propIsOpen !== undefined ? propIsOpen : isOrderModalOpen;
  const handleModalClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      setIsOrderModalOpen(false);
    }
  };

  // Order mode toggle: 'delivery' or 'pickup'
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>(
    propInitialOrderType || contextOrderType || 'delivery'
  );

  // Wizard active step: 'cart' | 'checkout' | 'confirmation'
  const [activeStep, setActiveStep] = useState<'cart' | 'checkout'>(
    contextOrderStep || 'cart'
  );

  // Customer Checkout Form State (No account creation, No mandatory email)
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState(''); // STRICTLY OPTIONAL
  const [deliveryAddress, setDeliveryAddress] = useState(''); // STRICTLY OPTIONAL
  const [specialRequests, setSpecialRequests] = useState(''); // STRICTLY OPTIONAL

  // Payment Method Selection
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'qr_payment' | 'card_on_delivery' | 'bank_transfer'>('cod');
  const [paymentReference, setPaymentReference] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Form error state (only fullName and phoneNumber can trigger errors)
  const [formErrors, setFormErrors] = useState<{ fullName?: string; phoneNumber?: string }>({});

  // Active category for in-modal quick item adder
  const [browseCategory, setBrowseCategory] = useState<'food' | 'desserts' | 'drinks'>('food');

  // Viewing confirmed or active order
  const [viewingOrder, setViewingOrder] = useState<CustomerOrder | null>(null);

  // Live cancellation countdown seconds
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // Sync initial order type and step when modal opens
  useEffect(() => {
    if (isModalVisible) {
      const targetType = propInitialOrderType || contextOrderType || 'delivery';
      setOrderType(targetType);
      if (contextOrderStep) {
        setActiveStep(contextOrderStep);
      }
    }
  }, [propInitialOrderType, contextOrderType, contextOrderStep, isModalVisible]);

  // If there's an active order that was placed recently (not cancelled/completed), show status tracker by default
  useEffect(() => {
    if (activeOrder && activeOrder.status !== 'cancelled' && activeOrder.status !== 'completed') {
      setViewingOrder(activeOrder);
    } else if (!activeOrder) {
      setViewingOrder(null);
    }
  }, [activeOrder]);

  // Real-time cancellation countdown timer effect
  useEffect(() => {
    if (!viewingOrder) {
      setRemainingSeconds(0);
      return;
    }

    const calculateRemaining = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - viewingOrder.createdAt) / 1000);
      const totalAllowed = viewingOrder.cancellationWindowSeconds || 180; // 3 minutes
      const left = Math.max(0, totalAllowed - elapsed);
      setRemainingSeconds(left);
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [viewingOrder]);

  // Calculate cart subtotal
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  // Configured delivery fee (Complimentary or flat)
  const deliveryFee = orderType === 'delivery' ? 0 : 0;
  const orderTotal = cartSubtotal + deliveryFee;

  // Format seconds as MM:SS (e.g. "02:59")
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Generate the EXACT WhatsApp formatted order message
  const generateWhatsAppMessage = (order: CustomerOrder) => {
    const itemLines = order.items
      .map((item) => `${item.name} × ${item.quantity}`)
      .join('\n');

    let paymentMethodLabel = 'Cash on Delivery';
    if (order.paymentMethod === 'qr_payment') {
      paymentMethodLabel = 'QR Payment (Raast / Wallet / Banking App)';
    } else if (order.paymentMethod === 'card_on_delivery') {
      paymentMethodLabel = 'Card on Delivery (Mobile POS Terminal)';
    } else if (order.paymentMethod === 'bank_transfer') {
      paymentMethodLabel = 'Direct Bank Transfer';
    }

    let msg = `NEW ORDER\n\n`;
    msg += `Customer:\n${order.customerName}\n\n`;
    msg += `Phone:\n${order.phoneNumber}\n\n`;
    msg += `Order:\n${itemLines}\n\n`;
    msg += `Payment Method:\n${paymentMethodLabel}\n\n`;
    
    if (order.paymentReference && order.paymentReference.trim()) {
      msg += `Payment Ref/TxID:\n${order.paymentReference.trim()}\n\n`;
    }

    msg += `Subtotal:\n₨ ${order.totalPrice.toLocaleString()}\n\n`;
    msg += `Delivery/Pickup:\n${order.orderType === 'delivery' ? 'Online Delivery' : 'Pickup'}\n\n`;
    
    if (order.deliveryAddress && order.deliveryAddress.trim()) {
      msg += `Address:\n${order.deliveryAddress.trim()}\n\n`;
    }
    
    if (order.specialRequests && order.specialRequests.trim()) {
      msg += `Special Requests:\n${order.specialRequests.trim()}\n\n`;
    }
    
    msg += `Total:\n₨ ${order.totalPrice.toLocaleString()}`;

    return msg;
  };

  // Handle proceed to checkout step
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to proceed.');
      return;
    }
    setActiveStep('checkout');
  };

  // Handle final order submission
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { fullName?: string; phoneNumber?: string } = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone Number is required';
    } else if (phoneNumber.trim().replace(/\D/g, '').length < 8) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    if (cartItems.length === 0) {
      alert('Please add at least one item to your order.');
      setActiveStep('cart');
      return;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    // Place the order: Full Name & Phone Number REQUIRED. Email, Address, Special requests OPTIONAL
    const newOrder = placeOrder({
      orderType,
      customerName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      emailAddress: emailAddress.trim() || undefined,
      deliveryAddress: orderType === 'delivery' && deliveryAddress.trim() ? deliveryAddress.trim() : undefined,
      specialRequests: specialRequests.trim() || undefined,
      paymentMethod,
      paymentReference: paymentReference.trim() || undefined,
      items: [...cartItems],
      totalPrice: orderTotal,
      deliveryFee,
    });

    setViewingOrder(newOrder);
    clearCart();
    setActiveStep('cart');

    // Generate direct WhatsApp link to restaurant
    const waText = generateWhatsAppMessage(newOrder);
    const waUrl = `https://wa.me/${config.contact.whatsappClean}?text=${encodeURIComponent(waText)}`;
    
    // Automatically open WhatsApp in new tab for direct restaurant receipt
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Fallback
    }
  };

  // Handle order cancellation within 2-3 minute window
  const handleCancelCurrentOrder = () => {
    if (!viewingOrder) return;

    if (remainingSeconds <= 0) {
      alert('Cancellation period has ended. Please contact the restaurant for assistance.');
      return;
    }

    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this order? This action cannot be undone.'
    );

    if (confirmCancel) {
      const res = cancelOrder(viewingOrder.id);
      if (res.success) {
        setViewingOrder((prev) => prev ? { ...prev, status: 'cancelled', cancelledAt: Date.now() } : null);

        // Optional alert to restaurant WhatsApp
        const cancelMsg = `*ORDER CANCELLED #${viewingOrder.id}*\nCustomer: ${viewingOrder.customerName}\nPhone: ${viewingOrder.phoneNumber}\nStatus: Cancelled by customer within 3-min window.`;
        const waUrl = `https://wa.me/${config.contact.whatsappClean}?text=${encodeURIComponent(cancelMsg)}`;
        try {
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        } catch {
          // ignore
        }
      } else {
        alert(res.message);
      }
    }
  };

  // Status progression steps: Order Placed → Confirming → Preparing → Ready / Out for Delivery → Completed
  const statusSteps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'placed', label: 'Order Placed', desc: 'Received in system' },
    { key: 'confirming', label: 'Confirming', desc: 'Verified by staff' },
    { key: 'preparing', label: 'Preparing', desc: 'Fresh in kitchen' },
    { 
      key: 'ready_or_out_for_delivery', 
      label: viewingOrder?.orderType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup', 
      desc: viewingOrder?.orderType === 'delivery' ? 'Rider on the way' : 'Counter ready' 
    },
    { key: 'completed', label: 'Completed', desc: 'Order fulfilled' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 0;
      case 'confirming': return 1;
      case 'preparing': return 2;
      case 'ready_or_out_for_delivery': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  if (!isModalVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-[#14100d] border border-[#2e241c] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Gold Accent Border */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#d4af37]" />

          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-[#261e17] flex items-center justify-between bg-[#18130f]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#261b11] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#fdfbf7]">
                  {viewingOrder 
                    ? `Order #${viewingOrder.id}` 
                    : activeStep === 'checkout' 
                    ? 'Complete Your Checkout' 
                    : 'Your Order Cart'}
                </h3>
                <p className="text-xs text-[#a89d8f]">
                  {viewingOrder 
                    ? 'Live tracking & direct restaurant dispatch' 
                    : activeStep === 'checkout'
                    ? 'Fast checkout • No account required • No mandatory email'
                    : `${cartItems.reduce((a, b) => a + b.quantity, 0)} item(s) in your selection`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {viewingOrder ? (
                <BackButton
                  label="Back"
                  onClick={() => {
                    setViewingOrder(null);
                    setActiveStep('cart');
                  }}
                  ariaLabel="Back to Cart"
                />
              ) : activeStep === 'checkout' ? (
                <BackButton
                  label="Back to Cart"
                  onClick={() => setActiveStep('cart')}
                  ariaLabel="Return to Cart"
                />
              ) : (
                <BackButton
                  label="Back to Menu"
                  onClick={handleModalClose}
                  ariaLabel="Close and return to menu"
                />
              )}

              <AiAssistantButton
                context={{
                  section: viewingOrder ? 'delivery' : activeStep === 'checkout' ? 'checkout' : 'cart',
                  title: viewingOrder ? `Order #${viewingOrder.id}` : activeStep === 'checkout' ? 'Online Checkout' : 'Order Cart'
                }}
                variant="pill"
                label="AI Help"
                size="xs"
              />

              <button
                onClick={handleModalClose}
                className="p-2 rounded-full text-[#a89d8f] hover:text-white hover:bg-[#261f18] transition-colors cursor-pointer"
                aria-label="Close Order Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

            {/* ════════════════════════════════════════════════════════════════
                VIEW ACTIVE / CONFIRMED ORDER RECEIPT & LIVE TRACKER
                ════════════════════════════════════════════════════════════════ */}
            {viewingOrder ? (
              <div className="space-y-6">
                {/* 9. ORDER CONFIRMATION BANNER */}
                {viewingOrder.status === 'cancelled' ? (
                  <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                    <div className="flex items-center gap-2.5 text-rose-400 font-bold text-base sm:text-lg">
                      <Ban className="w-5 h-5 shrink-0" />
                      <span>Your order has been cancelled successfully.</span>
                    </div>
                    <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed">
                      Order #{viewingOrder.id} has been cancelled. No charges apply. The kitchen has been alerted.
                    </p>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-[#1b140f] border border-[#d4af37]/40 space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d2218] pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-base sm:text-lg">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <span>Order Received Successfully</span>
                        </div>
                        <p className="text-xs text-[#c5bcad]">
                          Order Number: <strong className="text-[#d4af37] font-mono">{viewingOrder.id}</strong>
                        </p>
                      </div>
                      <span className="text-xs text-[#d4af37] font-semibold px-3.5 py-1.5 rounded-full bg-[#2a1d12] border border-[#d4af37]/40 self-start sm:self-auto">
                        {viewingOrder.orderType === 'delivery' ? '🛵 Online Delivery' : '🛍️ Pickup'}
                      </span>
                    </div>

                    {/* Live Order Status Pipeline: Order Placed → Confirming → Preparing → Ready / Out for Delivery → Completed */}
                    <div>
                      <div className="text-[11px] text-[#a89d8f] uppercase tracking-wider mb-2 font-semibold flex items-center justify-between">
                        <span>Current Status: <strong className="text-[#fdfbf7] capitalize">{viewingOrder.status.replace(/_/g, ' ')}</strong></span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {statusSteps.map((step, idx) => {
                          const currentIdx = getStepIndex(viewingOrder.status);
                          const isDone = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;

                          return (
                            <div 
                              key={step.key}
                              className={`p-2.5 rounded-xl border text-center transition-all ${
                                isCurrent
                                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-white font-bold shadow-md shadow-[#d4af37]/20'
                                  : isDone
                                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                                  : 'bg-[#15110e] border-[#261f18] text-[#6e6355]'
                              }`}
                            >
                              <div className="text-xs font-semibold flex items-center justify-center gap-1">
                                {isDone && !isCurrent && <Check className="w-3 h-3 text-emerald-400" />}
                                {isCurrent && <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />}
                                <span>{step.label}</span>
                              </div>
                              <span className="text-[10px] block opacity-80 mt-0.5">{step.desc}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. ORDER CANCELLATION SYSTEM (2-3 Minutes Countdown) */}
                {viewingOrder.status !== 'cancelled' && (
                  <div className="p-5 rounded-2xl bg-[#1a120c] border border-[#3b2b1d] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${remainingSeconds > 0 ? 'text-[#d4af37] animate-pulse' : 'text-zinc-500'}`} />
                          <h4 className="text-sm font-bold text-[#fdfbf7]">
                            {remainingSeconds > 0 
                              ? `Cancel order — ${formatTime(remainingSeconds)} remaining`
                              : 'Order Cancellation Closed'}
                          </h4>
                        </div>
                        {remainingSeconds > 0 ? (
                          <p className="text-xs text-amber-200/90 mt-1">
                            You can cancel this order within the 3-minute grace window before kitchen firing begins.
                          </p>
                        ) : (
                          <p className="text-xs text-zinc-400 mt-1">
                            Cancellation period has ended. Please contact the restaurant for assistance.
                          </p>
                        )}
                      </div>

                      {/* Cancel Order Button */}
                      <button
                        onClick={handleCancelCurrentOrder}
                        disabled={remainingSeconds <= 0}
                        className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          remainingSeconds > 0
                            ? 'bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 hover:text-white shadow-lg shadow-rose-950/40'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed opacity-70'
                        }`}
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel Order</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-[#8e8272] border-t border-[#2a1e14] pt-2 flex items-center justify-between">
                      <span>Need instant changes? Direct phone line:</span>
                      <a 
                        href={`tel:${config.contact.phoneClean}`}
                        className="text-[#d4af37] hover:underline font-semibold flex items-center gap-1 shrink-0 ml-2"
                      >
                        <Phone className="w-3 h-3" /> {config.contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* 7. ORDER SUMMARY RECEIPT */}
                <div className="p-5 rounded-2xl bg-[#18120e] border border-[#2e2319] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#291f16] pb-3">
                    <div>
                      <span className="text-[10px] text-[#8e8272] uppercase tracking-wider">Customer</span>
                      <h4 className="font-serif text-base font-bold text-[#fdfbf7]">{viewingOrder.customerName}</h4>
                      <p className="text-xs text-[#d4af37] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {viewingOrder.phoneNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#8e8272] uppercase tracking-wider">Method</span>
                      <span className="block text-xs font-bold text-[#fdfbf7] capitalize mt-0.5">
                        {viewingOrder.orderType === 'delivery' ? 'Online Delivery' : 'Pickup'}
                      </span>
                    </div>
                  </div>

                  {/* Email ONLY if provided */}
                  {viewingOrder.emailAddress && (
                    <div className="p-2.5 rounded-xl bg-[#120e0b] border border-[#241a12] text-xs">
                      <span className="text-[10px] text-[#8e8272] uppercase font-bold tracking-wider block mb-0.5">
                        Email Address
                      </span>
                      <p className="text-[#e2dacd]">{viewingOrder.emailAddress}</p>
                    </div>
                  )}

                  {/* Delivery Address ONLY if provided */}
                  {viewingOrder.deliveryAddress && (
                    <div className="p-2.5 rounded-xl bg-[#120e0b] border border-[#241a12] text-xs">
                      <span className="text-[10px] text-[#8e8272] uppercase font-bold tracking-wider block mb-0.5">
                        Delivery Address
                      </span>
                      <p className="text-[#e2dacd]">{viewingOrder.deliveryAddress}</p>
                    </div>
                  )}

                  {/* Payment Method in Receipt */}
                  <div className="p-2.5 rounded-xl bg-[#120e0b] border border-[#241a12] text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8e8272] uppercase font-bold tracking-wider block mb-0.5">
                        Payment Method
                      </span>
                      <p className="text-[#fdfbf7] font-semibold flex items-center gap-1.5">
                        {viewingOrder.paymentMethod === 'qr_payment' ? (
                          <>
                            <QrCode className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span className="text-[#d4af37]">QR Payment (Raast / Wallets)</span>
                          </>
                        ) : viewingOrder.paymentMethod === 'card_on_delivery' ? (
                          <>
                            <CreditCard className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>Card on Delivery (POS)</span>
                          </>
                        ) : viewingOrder.paymentMethod === 'bank_transfer' ? (
                          <>
                            <Building2 className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>Direct Bank Transfer</span>
                          </>
                        ) : (
                          <>
                            <Banknote className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>Cash on Delivery</span>
                          </>
                        )}
                      </p>
                    </div>
                    {viewingOrder.paymentReference && (
                      <div className="text-right">
                        <span className="text-[10px] text-[#8e8272] uppercase font-bold tracking-wider block mb-0.5">
                          Ref / TxID
                        </span>
                        <span className="font-mono text-xs text-[#d4af37] font-bold">
                          {viewingOrder.paymentReference}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Special Requests ONLY if provided */}
                  {viewingOrder.specialRequests && (
                    <div className="p-2.5 rounded-xl bg-[#120e0b] border border-[#241a12] text-xs">
                      <span className="text-[10px] text-[#8e8272] uppercase font-bold tracking-wider block mb-0.5">
                        Special Requests &amp; Allergies
                      </span>
                      <p className="text-[#e2dacd] italic">"{viewingOrder.specialRequests}"</p>
                    </div>
                  )}

                  {/* Ordered Items List */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] text-[#8e8272] uppercase font-bold tracking-wider block">
                      Ordered Items ({viewingOrder.items.reduce((a, b) => a + b.quantity, 0)})
                    </span>
                    <div className="divide-y divide-[#261c14]">
                      {viewingOrder.items.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#241a12] text-[#d4af37] font-bold flex items-center justify-center text-[10px]">
                              {item.quantity}x
                            </span>
                            <span className="text-[#fdfbf7] font-medium">{item.name}</span>
                          </div>
                          <span className="font-semibold text-[#d4af37]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subtotal, Delivery Fee & Total Summary */}
                  <div className="pt-3 border-t border-[#291f16] space-y-1.5 text-xs text-[#a89d8f]">
                    <div className="flex items-center justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-white">
                        {formatPrice(viewingOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{viewingOrder.orderType === 'delivery' ? 'Delivery Fee:' : 'Pickup:'}</span>
                      <span className="text-emerald-400 font-semibold">
                        {viewingOrder.orderType === 'delivery' ? 'Complimentary' : 'Free'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#291f16] flex items-center justify-between text-sm sm:text-base font-bold">
                      <span className="text-[#fdfbf7]">Final Total (PKR):</span>
                      <span className="font-serif text-xl sm:text-2xl text-[#d4af37]">
                        {formatPrice(viewingOrder.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* 8. DIRECT RESTAURANT ORDER WHATSAPP BUTTON */}
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${config.contact.whatsappClean}?text=${encodeURIComponent(generateWhatsAppMessage(viewingOrder))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Direct to Restaurant on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : activeStep === 'cart' ? (
              /* ════════════════════════════════════════════════════════════════
                  STEP 1: PREMIUM CART INTERFACE & DRAWER VIEW
                  ════════════════════════════════════════════════════════════════ */
              <div className="space-y-6">
                
                {/* Cart Items List */}
                {cartItems.length === 0 ? (
                  <div className="p-8 sm:p-12 rounded-3xl bg-[#18130f] border border-dashed border-[#33261c] text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#241a12] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mx-auto">
                      <ShoppingBag className="w-8 h-8 opacity-75" />
                    </div>
                    <h4 className="font-serif text-lg text-[#fdfbf7] font-semibold">Your Cart is Currently Empty</h4>
                    <p className="text-xs text-[#a89d8f] max-w-sm mx-auto">
                      Add any delicious charcoal BBQ, fresh Handi Karahi, Gelato, or Cold Drinks from the menu below.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleModalClose}
                        className="btn-gold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold cursor-pointer"
                      >
                        Explore Full Menu
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37]">
                        Items In Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})
                      </span>
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-xs text-[#8c7d6e] hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                      </button>
                    </div>

                    {/* Cart Item Cards with Images, Names, Prices, Quantities, Subtotal, Remove */}
                    <div className="space-y-3 bg-[#18130f] border border-[#2e2319] p-3 sm:p-4 rounded-2xl divide-y divide-[#261c14]">
                      {cartItems.map((item) => (
                        <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3 sm:gap-4">
                          {/* Product Image */}
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#33261c] shrink-0 bg-[#0d0b0a]"
                            />
                          )}

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs sm:text-sm font-semibold text-[#fdfbf7] truncate">
                              {item.name}
                            </h5>
                            <span className="text-xs font-bold text-[#d4af37]">
                              {formatPrice(item.price)} each
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1.5 bg-[#120e0b] border border-[#2e2319] rounded-xl p-1">
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.id, -1)}
                                className="w-6 h-6 rounded-lg bg-[#241a12] hover:bg-[#38281b] text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-[#fdfbf7]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.id, 1)}
                                className="w-6 h-6 rounded-lg bg-[#241a12] hover:bg-[#38281b] text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Line Subtotal */}
                            <span className="w-20 text-right font-serif text-xs sm:text-sm font-bold text-[#d4af37]">
                              {formatPrice(item.price * item.quantity)}
                            </span>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-[#8c7d6e] hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-rose-950/30"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Subtotal and Total Preview */}
                    <div className="p-4 rounded-2xl bg-[#18120e] border border-[#2e2319] space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#a89d8f]">
                        <span>Subtotal:</span>
                        <span className="font-semibold text-white">{formatPrice(cartSubtotal)}</span>
                      </div>
                      <div className="pt-2 border-t border-[#2a2016] flex items-center justify-between text-base font-bold">
                        <span className="text-[#fdfbf7]">Estimated Total:</span>
                        <span className="font-serif text-xl text-[#d4af37]">
                          {formatPrice(orderTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Add Menu Recommendations Strip */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#a89d8f] font-semibold">Quick Add to Cart:</span>
                    <div className="flex items-center gap-1 bg-[#120e0b] p-0.5 rounded-lg border border-[#2a2016]">
                      <button
                        type="button"
                        onClick={() => setBrowseCategory('food')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          browseCategory === 'food' ? 'bg-[#d4af37] text-black' : 'text-[#a89d8f] hover:text-white'
                        }`}
                      >
                        <Flame className="w-3 h-3 inline mr-1" /> Food
                      </button>
                      <button
                        type="button"
                        onClick={() => setBrowseCategory('desserts')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          browseCategory === 'desserts' ? 'bg-[#d4af37] text-black' : 'text-[#a89d8f] hover:text-white'
                        }`}
                      >
                        <IceCream className="w-3 h-3 inline mr-1" /> Desserts &amp; Shakes
                      </button>
                      <button
                        type="button"
                        onClick={() => setBrowseCategory('drinks')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          browseCategory === 'drinks' ? 'bg-[#d4af37] text-black' : 'text-[#a89d8f] hover:text-white'
                        }`}
                      >
                        <CupSoda className="w-3 h-3 inline mr-1" /> Drinks
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {browseCategory === 'food' && menuItems.filter(m => m.category === 'main-courses' || m.category === 'grills' || m.category === 'starters').slice(0, 8).map((dish) => (
                      <div
                        key={dish.id}
                        className="w-48 shrink-0 p-2.5 rounded-xl bg-[#18120e] border border-[#2e2218] flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {dish.image && (
                            <img src={dish.image} alt={dish.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-[#fdfbf7] truncate">{dish.name}</div>
                            <div className="text-[11px] text-[#d4af37] font-bold">{formatPrice(dish.price)}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart({ id: dish.id, name: dish.name, price: dish.price, category: dish.category, image: dish.image })}
                          className="mt-2 w-full py-1 rounded-lg bg-[#241a12] hover:bg-[#d4af37] hover:text-black text-xs font-bold text-[#d4af37] transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add to Cart
                        </button>
                      </div>
                    ))}

                    {browseCategory === 'desserts' && dessertBarItems.slice(0, 8).map((dessert) => (
                      <div
                        key={dessert.id}
                        className="w-48 shrink-0 p-2.5 rounded-xl bg-[#18120e] border border-[#2e2218] flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {dessert.image && (
                            <img src={dessert.image} alt={dessert.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-[#fdfbf7] truncate">{dessert.name}</div>
                            <div className="text-[11px] text-[#d4af37] font-bold">{formatPrice(dessert.price)}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart({ id: dessert.id, name: dessert.name, price: dessert.price, category: dessert.category, image: dessert.image })}
                          className="mt-2 w-full py-1 rounded-lg bg-[#241a12] hover:bg-[#d4af37] hover:text-black text-xs font-bold text-[#d4af37] transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add to Cart
                        </button>
                      </div>
                    ))}

                    {browseCategory === 'drinks' && menuItems.filter(m => m.category === 'soft-drinks' || m.category === 'signature-drinks').slice(0, 8).map((drink) => (
                      <div
                        key={drink.id}
                        className="w-48 shrink-0 p-2.5 rounded-xl bg-[#18120e] border border-[#2e2218] flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {drink.image && (
                            <img src={drink.image} alt={drink.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-[#fdfbf7] truncate">{drink.name}</div>
                            <div className="text-[11px] text-[#d4af37] font-bold">{formatPrice(drink.price)}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart({ id: drink.id, name: drink.name, price: drink.price, category: drink.category, image: drink.image })}
                          className="mt-2 w-full py-1 rounded-lg bg-[#241a12] hover:bg-[#d4af37] hover:text-black text-xs font-bold text-[#d4af37] transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. CART ACTIONS: Continue Shopping vs Proceed to Checkout */}
                <div className="pt-4 border-t border-[#261e17] flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="w-full sm:w-1/2 py-3.5 rounded-2xl bg-[#1e1712] hover:bg-[#2c2017] border border-[#382a1d] text-xs uppercase tracking-wider font-bold text-[#c5bcad] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Continue Shopping
                  </button>

                  <button
                    type="button"
                    disabled={cartItems.length === 0}
                    onClick={handleProceedToCheckout}
                    className={`w-full sm:w-1/2 py-3.5 rounded-2xl text-xs uppercase tracking-widest font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      cartItems.length > 0
                        ? 'btn-gold shadow-xl shadow-[#d4af37]/25 hover:scale-[1.01]'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Proceed to Checkout</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ) : (
              /* ════════════════════════════════════════════════════════════════
                  STEP 2: CLEAN CHECKOUT PROCESS (No Account, Optional Email)
                  ════════════════════════════════════════════════════════════════ */
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                {/* Top-Left Back Navigation within checkout */}
                <div className="flex items-center justify-between pb-1 border-b border-[#241a12]">
                  <BackButton
                    label="Back to Cart"
                    onClick={() => setActiveStep('cart')}
                    ariaLabel="Return to Cart"
                  />
                  <span className="text-[11px] text-[#8e8272] uppercase tracking-wider font-semibold">
                    Checkout Step 2 of 2
                  </span>
                </div>

                {/* 5 & 6. DELIVERY / PICKUP METHOD SELECTION */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase font-bold tracking-wider text-[#d4af37] block">
                      1. Select Fulfillment Method
                    </label>
                    <AiAssistantButton
                      context={{
                        section: orderType === 'delivery' ? 'delivery' : 'pickup',
                        title: orderType === 'delivery' ? 'Online Delivery (Delivery Zones & Timings)' : 'Pickup (Self Collection)'
                      }}
                      variant="badge"
                      label={orderType === 'delivery' ? 'Delivery FAQ' : 'Pickup FAQ'}
                      size="xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Online Delivery Button */}
                    <motion.button
                      type="button"
                      id="order-btn-delivery"
                      onClick={() => setOrderType('delivery')}
                      whileHover={{ y: -3, scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      animate={
                        orderType === 'delivery'
                          ? { scale: [1, 1.02, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className={`relative p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-3.5 transition-all duration-300 cursor-pointer text-left overflow-hidden ${
                        orderType === 'delivery'
                          ? 'bg-gradient-to-br from-[#332214] via-[#24170e] to-[#18110c] border-[#d4af37] text-white shadow-[0_8px_25px_-4px_rgba(212,175,55,0.3),0_0_15px_rgba(212,175,55,0.15)] ring-1 ring-[#d4af37]/70'
                          : 'bg-[#18130f] border-[#2e2319] text-[#a89d8f] hover:text-white hover:border-[#4d3826] hover:bg-[#201813]'
                      }`}
                    >
                      {/* Active Indicator Badge */}
                      {orderType === 'delivery' && (
                        <motion.span
                          layoutId="fulfillment-badge"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse inline-block" />
                          Selected
                        </motion.span>
                      )}

                      {/* Delivery Icon with gentle forward-moving animation */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                        orderType === 'delivery'
                          ? 'bg-gradient-to-br from-[#d4af37] to-[#b38f24] text-[#120f0d] font-bold shadow-md shadow-[#d4af37]/30'
                          : 'bg-[#241a12] text-[#d4af37]'
                      }`}>
                        <motion.div
                          animate={
                            orderType === 'delivery'
                              ? {
                                  x: [0, 4, 0],
                                  rotate: [0, -2, 2, 0],
                                }
                              : { x: 0, rotate: 0 }
                          }
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          <Bike className="w-5 h-5 stroke-[2.2]" />
                        </motion.div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm sm:text-base text-[#fdfbf7]">
                            Online Delivery
                          </span>
                        </div>
                        <div className="text-[11px] text-[#a89d8f] mt-0.5">
                          Hot dispatch to your location
                        </div>
                        {orderType === 'delivery' && (
                          <motion.div
                            initial={{ opacity: 0, y: 2 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] text-[#d4af37] font-semibold mt-1 flex items-center gap-1"
                          >
                            <span>Express Kitchen Courier</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>

                    {/* Pickup Button */}
                    <motion.button
                      type="button"
                      id="order-btn-pickup"
                      onClick={() => setOrderType('pickup')}
                      whileHover={{ y: -3, scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      animate={
                        orderType === 'pickup'
                          ? { scale: [1, 1.02, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className={`relative p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-3.5 transition-all duration-300 cursor-pointer text-left overflow-hidden ${
                        orderType === 'pickup'
                          ? 'bg-gradient-to-br from-[#2c2016] via-[#20160f] to-[#18120c] border-[#d4af37] text-white shadow-[0_8px_25px_-4px_rgba(212,175,55,0.25),0_0_15px_rgba(212,175,55,0.12)] ring-1 ring-[#d4af37]/70'
                          : 'bg-[#18130f] border-[#2e2319] text-[#a89d8f] hover:text-white hover:border-[#4d3826] hover:bg-[#201813]'
                      }`}
                    >
                      {/* Active Indicator Badge */}
                      {orderType === 'pickup' && (
                        <motion.span
                          layoutId="fulfillment-badge"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] inline-block" />
                          Selected
                        </motion.span>
                      )}

                      {/* Pickup Store Icon with subtle breathing scale */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                        orderType === 'pickup'
                          ? 'bg-gradient-to-br from-[#d4af37] to-[#b38f24] text-[#120f0d] font-bold shadow-md shadow-[#d4af37]/30'
                          : 'bg-[#241a12] text-[#d4af37]'
                      }`}>
                        <motion.div
                          animate={
                            orderType === 'pickup'
                              ? {
                                  scale: [1, 1.08, 1],
                                }
                              : { scale: 1 }
                          }
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          <Store className="w-5 h-5 stroke-[2.2]" />
                        </motion.div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-serif font-bold text-sm sm:text-base text-[#fdfbf7]">
                          Pickup
                        </div>
                        <div className="text-[11px] text-[#a89d8f] mt-0.5">
                          Collect fresh from counter
                        </div>
                        {orderType === 'pickup' && (
                          <motion.div
                            initial={{ opacity: 0, y: 2 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] text-[#d4af37] font-semibold mt-1 flex items-center gap-1"
                          >
                            <span>Ready in 15–20 mins</span>
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* 4. CUSTOMER CONTACT & OPTIONAL DETAILS */}
                <div className="space-y-4 pt-2 border-t border-[#261e17]">
                  <label className="text-xs uppercase font-bold tracking-wider text-[#d4af37] block">
                    2. Customer Information
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name - REQUIRED */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#c5bcad] font-medium flex items-center justify-between">
                        <span>Full Name <span className="text-rose-400 font-bold">*</span></span>
                        <span className="text-[10px] text-emerald-400 font-semibold">Required</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e8272]" />
                        <input
                          id="checkout-fullname"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Tariq Mehmood"
                          className={`w-full bg-[#120e0b] border ${formErrors.fullName ? 'border-rose-500' : 'border-[#2e2319]'} focus:border-[#d4af37] text-xs sm:text-sm text-[#fdfbf7] pl-10 pr-3.5 py-3 rounded-xl focus:outline-none placeholder-[#6b5f51]`}
                        />
                      </div>
                      {formErrors.fullName && (
                        <p className="text-[10px] text-rose-400">{formErrors.fullName}</p>
                      )}
                    </div>

                    {/* Phone Number - REQUIRED */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#c5bcad] font-medium flex items-center justify-between">
                        <span>Phone Number <span className="text-rose-400 font-bold">*</span></span>
                        <span className="text-[10px] text-emerald-400 font-semibold">Required for dispatch</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e8272]" />
                        <input
                          id="checkout-phone"
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="e.g. +92 300 1234567"
                          className={`w-full bg-[#120e0b] border ${formErrors.phoneNumber ? 'border-rose-500' : 'border-[#2e2319]'} focus:border-[#d4af37] text-xs sm:text-sm text-[#fdfbf7] pl-10 pr-3.5 py-3 rounded-xl focus:outline-none placeholder-[#6b5f51]`}
                        />
                      </div>
                      {formErrors.phoneNumber && (
                        <p className="text-[10px] text-rose-400">{formErrors.phoneNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* 1. EMAIL MUST BE OPTIONAL - Explicit Label: "Email Address (Optional)" */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#c5bcad] font-medium flex items-center justify-between">
                      <span>Email Address (Optional)</span>
                      <span className="text-[10px] text-[#8e8272]">(Optional - For receipt copy)</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e8272]" />
                      <input
                        id="checkout-email"
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="e.g. yourname@example.com (Optional)"
                        className="w-full bg-[#120e0b] border border-[#2e2319] focus:border-[#d4af37] text-xs sm:text-sm text-[#fdfbf7] pl-10 pr-3.5 py-3 rounded-xl focus:outline-none placeholder-[#6b5f51]"
                      />
                    </div>
                  </div>

                  {/* Delivery Address - SHOWN IF ONLINE DELIVERY, STRICTLY OPTIONAL */}
                  {orderType === 'delivery' && (
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#c5bcad] font-medium flex items-center justify-between">
                        <span>Delivery Address</span>
                        <span className="text-[10px] text-[#8e8272]">(Optional - Can also share via WhatsApp / Call)</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#8e8272]" />
                        <textarea
                          id="checkout-address"
                          rows={2}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="House/Apartment #, Street, Sector / Area (Optional: you can complete order and share pin on WhatsApp)"
                          className="w-full bg-[#120e0b] border border-[#2e2319] focus:border-[#d4af37] text-xs sm:text-sm text-[#fdfbf7] pl-10 pr-3.5 py-2.5 rounded-xl focus:outline-none placeholder-[#6b5f51] resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Dietary Requirements, Allergies & Special Requests - OPTIONAL */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#c5bcad] font-medium flex items-center justify-between">
                      <span>Dietary Requirements, Allergies &amp; Special Requests</span>
                      <span className="text-[10px] text-[#8e8272]">(Optional)</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3 w-4 h-4 text-[#8e8272]" />
                      <textarea
                        id="checkout-special-requests"
                        rows={2}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="e.g. Mild spice on Karahi, extra green chutney, no nuts in desserts, extra napkins..."
                        className="w-full bg-[#120e0b] border border-[#2e2319] focus:border-[#d4af37] text-xs sm:text-sm text-[#fdfbf7] pl-10 pr-3.5 py-2.5 rounded-xl focus:outline-none placeholder-[#6b5f51] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. PAYMENT METHOD SELECTION (Cash / QR Payment / Card / Bank Transfer) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#18120e] border border-[#2e2319] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2a2016] pb-2 text-xs">
                    <span className="text-[#a89d8f] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-[#d4af37]" />
                      Select Payment Method
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#a89d8f] hidden sm:inline">
                        {paymentMethod === 'qr_payment' ? '✨ Instant QR Scan' : 'Pay on Delivery'}
                      </span>
                      <AiAssistantButton
                        context={{
                          section: 'payment',
                          title: 'Payment & QR Guide'
                        }}
                        variant="badge"
                        label="Payment Help"
                        size="xs"
                      />
                    </div>
                  </div>

                  {/* Payment Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Option 1: Cash on Delivery / Pay on Delivery */}
                    <label 
                      className={`relative flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'bg-[#2a1d12] border-[#d4af37] shadow-md shadow-[#d4af37]/10'
                          : 'bg-[#120e0b] border-[#291f16] hover:border-[#3d2f23]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[#d4af37] w-4 h-4 cursor-pointer"
                      />
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-lg ${paymentMethod === 'cod' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-[#1e1711] text-[#a89d8f]'}`}>
                          <Banknote className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-[#fdfbf7]">Cash on Delivery</span>
                          <span className="text-[10px] text-[#8e8272]">Pay in cash upon arrival</span>
                        </div>
                      </div>
                    </label>

                    {/* Option 2: QR Payment (Dynamic from Owner Config) */}
                    {(config.qrPayment?.isEnabled !== false) && (
                      <label 
                        className={`relative flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === 'qr_payment'
                            ? 'bg-[#2a1d12] border-[#d4af37] shadow-md shadow-[#d4af37]/15 ring-1 ring-[#d4af37]/30'
                            : 'bg-[#120e0b] border-[#291f16] hover:border-[#3d2f23]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value="qr_payment"
                          checked={paymentMethod === 'qr_payment'}
                          onChange={() => setPaymentMethod('qr_payment')}
                          className="accent-[#d4af37] w-4 h-4 cursor-pointer"
                        />
                        <div className="flex items-center gap-2.5 flex-1">
                          <div className={`p-2 rounded-lg ${paymentMethod === 'qr_payment' ? 'bg-[#d4af37] text-black font-bold' : 'bg-[#1e1711] text-[#a89d8f]'}`}>
                            <QrCode className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#fdfbf7]">QR Payment</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                                Raast / Wallets
                              </span>
                            </div>
                            <span className="text-[10px] text-[#8e8272]">Scan &amp; pay with phone app</span>
                          </div>
                        </div>
                      </label>
                    )}

                    {/* Option 3: Card on Delivery (Mobile POS) */}
                    {config.qrPayment?.enableCardOnDelivery && (
                      <label 
                        className={`relative flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === 'card_on_delivery'
                            ? 'bg-[#2a1d12] border-[#d4af37] shadow-md shadow-[#d4af37]/10'
                            : 'bg-[#120e0b] border-[#291f16] hover:border-[#3d2f23]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value="card_on_delivery"
                          checked={paymentMethod === 'card_on_delivery'}
                          onChange={() => setPaymentMethod('card_on_delivery')}
                          className="accent-[#d4af37] w-4 h-4 cursor-pointer"
                        />
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg ${paymentMethod === 'card_on_delivery' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-[#1e1711] text-[#a89d8f]'}`}>
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-[#fdfbf7]">Card on Delivery</span>
                            <span className="text-[10px] text-[#8e8272]">Rider brings mobile POS terminal</span>
                          </div>
                        </div>
                      </label>
                    )}

                    {/* Option 4: Direct Bank Transfer */}
                    {config.qrPayment?.enableBankTransfer && (
                      <label 
                        className={`relative flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === 'bank_transfer'
                            ? 'bg-[#2a1d12] border-[#d4af37] shadow-md shadow-[#d4af37]/10'
                            : 'bg-[#120e0b] border-[#291f16] hover:border-[#3d2f23]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value="bank_transfer"
                          checked={paymentMethod === 'bank_transfer'}
                          onChange={() => setPaymentMethod('bank_transfer')}
                          className="accent-[#d4af37] w-4 h-4 cursor-pointer"
                        />
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg ${paymentMethod === 'bank_transfer' ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-[#1e1711] text-[#a89d8f]'}`}>
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-[#fdfbf7]">Direct Bank Transfer</span>
                            <span className="text-[10px] text-[#8e8272]">Online IBAN / Raast transfer</span>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>

                  {/* Dynamic QR PAYMENT INSTRUCTION & SCANNER BOX */}
                  {paymentMethod === 'qr_payment' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#221811] to-[#16100c] border border-[#d4af37]/50 shadow-xl space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-[#352518] pb-3">
                        <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
                          <QrCode className="w-4 h-4 text-[#d4af37]" />
                          <span>Restaurant Payment QR Code</span>
                        </div>
                        <span className="text-[10px] text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-[#382617] border border-[#d4af37]/30">
                          {config.qrPayment?.bankOrWalletName || 'Raast Instant QR / All Wallets'}
                        </span>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-5">
                        {/* Large Scannable QR Code Frame */}
                        <div className="relative group p-3 rounded-2xl bg-white shadow-2xl border-2 border-[#d4af37] shrink-0">
                          <img
                            src={config.qrPayment?.qrCodeImage || '/assets/demo-payment-qr.svg'}
                            alt="Restaurant Payment QR Code"
                            className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg"
                          />
                          <div className="text-center mt-1">
                            <span className="text-[9px] font-bold text-zinc-700 tracking-wider uppercase">
                              Scan with any Banking / Wallet App
                            </span>
                          </div>
                        </div>

                        {/* Payment Details & Instructions */}
                        <div className="space-y-3 flex-1 w-full text-left">
                          {/* Prominent Order Total in PKR */}
                          <div className="p-3 rounded-xl bg-[#2a1a10] border border-[#d4af37]/60 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-[#baa995] uppercase font-bold tracking-wider block">
                                Amount to Pay (PKR)
                              </span>
                              <span className="font-serif text-xl sm:text-2xl font-bold text-[#d4af37]">
                                {formatPrice(orderTotal)}
                              </span>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 text-[10px] font-bold">
                              Exact Bill
                            </span>
                          </div>

                          {/* Required Instruction */}
                          <div className="p-3 rounded-xl bg-[#2e1f14] border border-[#d4af37]/40 text-xs text-[#fdfbf7] space-y-1">
                            <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                              Scan the QR code with your supported payment app to make your payment.
                            </p>
                            <p className="text-[11px] text-[#c5bcad] leading-relaxed">
                              {config.qrPayment?.instructions || 'Open your Raast-enabled banking app, JazzCash, Easypaisa, or SadaPay, choose QR Scan, and confirm the amount.'}
                            </p>
                          </div>

                          {/* Account / Wallet Name */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-[#140e0a] border border-[#2e2116]">
                              <span className="text-[10px] text-[#8e8272] uppercase font-bold tracking-wider block mb-0.5">
                                Beneficiary / Account Name
                              </span>
                              <p className="text-[#fdfbf7] font-semibold text-xs truncate">
                                {config.qrPayment?.accountName || 'Official Merchant Account'}
                              </p>
                            </div>

                            {/* Account Number / Raast ID with Copy Button */}
                            {config.qrPayment?.accountNumber && (
                              <div className="p-2.5 rounded-xl bg-[#140e0a] border border-[#2e2116] flex items-center justify-between">
                                <div>
                                  <span className="text-[10px] text-[#8e8272] uppercase font-bold tracking-wider block mb-0.5">
                                    Raast ID / Account #
                                  </span>
                                  <p className="text-[#d4af37] font-mono font-bold text-xs">
                                    {config.qrPayment.accountNumber}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(config.qrPayment?.accountNumber || '');
                                    setCopiedAccount(true);
                                    setTimeout(() => setCopiedAccount(false), 2000);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#291e15] hover:bg-[#382b1f] text-[10px] text-white flex items-center gap-1 font-semibold border border-[#3e2e21] transition-colors cursor-pointer"
                                  title="Copy account number"
                                >
                                  {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#d4af37]" />}
                                  <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Customer Transaction Reference Note (Optional) */}
                          <div className="space-y-1">
                            <label className="text-[11px] text-[#c5bcad] font-medium flex items-center justify-between">
                              <span>Transaction ID / Sender Name (Optional)</span>
                              <span className="text-[10px] text-[#8e8272]">(Optional - For instant cross-verification)</span>
                            </label>
                            <input
                              type="text"
                              value={paymentReference}
                              onChange={(e) => setPaymentReference(e.target.value)}
                              placeholder="e.g. TID 98726154 or Sent from 0300-1234567"
                              className="w-full bg-[#120e0b] border border-[#2e2319] focus:border-[#d4af37] text-xs text-[#fdfbf7] px-3 py-2 rounded-xl focus:outline-none placeholder-[#6b5f51]"
                            />
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] text-[#8e8272]">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>No card details stored. You complete payment securely in your banking app.</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 7. ORDER SUMMARY (Before Final Submission) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#18120e] border border-[#2e2319] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#2a2016] pb-2 text-xs">
                    <span className="text-[#a89d8f] uppercase font-bold tracking-wider">Order Summary</span>
                    <span className="text-[#d4af37] font-semibold">
                      {orderType === 'delivery' ? '🛵 Online Delivery' : '🛍️ Pickup'}
                    </span>
                  </div>

                  {/* Itemized preview */}
                  <div className="space-y-1.5 text-xs max-h-36 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-[#c5bcad]">
                        <span className="truncate pr-2">
                          <strong className="text-white">{item.quantity}x</strong> {item.name}
                        </span>
                        <span className="font-medium text-[#d4af37] shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#2a2016] space-y-1.5 text-xs text-[#a89d8f]">
                    <div className="flex items-center justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-white">{formatPrice(cartSubtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{orderType === 'delivery' ? 'Delivery Fee:' : 'Pickup:'}</span>
                      <span className="text-emerald-400 font-semibold">
                        {orderType === 'delivery' ? 'Complimentary' : 'Free'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#2a2016] flex items-center justify-between text-base font-bold">
                      <span className="text-[#fdfbf7]">Final Total (PKR):</span>
                      <span className="font-serif text-xl sm:text-2xl text-[#d4af37]">
                        {formatPrice(orderTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Final Order Confirmation / Submit Button */}
                <div className="space-y-3">
                  <button
                    id="submit-order-checkout-btn"
                    type="submit"
                    className="w-full py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-widest font-extrabold btn-gold shadow-xl shadow-[#d4af37]/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      Submit {orderType === 'delivery' ? 'Online Delivery' : 'Pickup'} Order ({formatPrice(orderTotal)})
                    </span>
                  </button>

                  <p className="text-[11px] text-center text-[#8e8272]">
                    Includes direct WhatsApp dispatch to restaurant and 3-minute cancel window.
                  </p>
                </div>

              </form>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
