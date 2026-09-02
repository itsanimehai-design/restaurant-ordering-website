import React from 'react';
import { CheckCircle2, Clock, MapPin, Phone, MessageSquareQuote, ShoppingBag, ArrowRight } from 'lucide-react';
import { Order, StoreSettings } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  settings: StoreSettings;
  onClose: () => void;
  onOpenOwnerPortal: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  settings,
  onClose,
  onOpenOwnerPortal,
}) => {
  if (!order) return null;

  const handleWhatsAppInquiry = () => {
    const text = `Hi ${settings.name}! I just placed order *${order.orderNumber}* for ${settings.currency} ${order.grandTotal.toLocaleString()}. Please confirm order status.`;
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 text-center shadow-2xl border border-stone-200">
        
        {/* Animated Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-extrabold text-stone-900 font-serif">Order Placed Successfully!</h2>
        <p className="text-xs text-stone-500 mt-1">
          Thank you <strong className="text-stone-800">{order.customerName}</strong>! Your order is sent to the restaurant kitchen.
        </p>

        {/* Order Details Card */}
        <div className="my-5 bg-stone-50 border border-stone-200 rounded-xl p-4 text-left text-xs space-y-2.5">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase">Order Reference:</span>
              <p className="font-extrabold text-amber-700 text-sm font-mono">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-400 font-bold uppercase">Status:</span>
              <p className="font-bold text-emerald-700 capitalize flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                {order.status}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase">
              Items Ordered ({(order.items || []).length}):
            </span>
            <ul className="divide-y divide-stone-200/60 max-h-32 overflow-y-auto pr-1">
              {(order.items || []).map((item, idx) => (
                <li key={idx} className="py-1 flex justify-between text-stone-800">
                  <span className="truncate">
                    <strong>{item.quantity}x</strong> {item.name}
                  </span>
                  <span className="font-semibold shrink-0 ml-2">
                    {settings.currency} {item.itemTotal.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-extrabold text-stone-900">
            <span>Grand Total:</span>
            <span className="text-amber-700 font-serif">{settings.currency} {order.grandTotal.toLocaleString()}</span>
          </div>

          <div className="pt-1 text-[11px] text-stone-500 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>Estimated delivery in <strong>{settings.estimatedDeliveryTime}</strong></span>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Track / Message on WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
          >
            Back to Restaurant Menu
          </button>
        </div>

        {/* View in Owner Portal Hint */}
        <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400">
          Restaurant owner?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenOwnerPortal();
            }}
            className="text-amber-700 font-semibold hover:underline"
          >
            View this order in Owner Portal Live Dashboard &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
