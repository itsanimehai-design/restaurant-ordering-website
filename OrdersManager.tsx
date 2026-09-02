import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  Bike, 
  Store, 
  Phone, 
  User, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Ban, 
  Bell, 
  Volume2, 
  Search, 
  Filter, 
  RefreshCw,
  QrCode,
  CreditCard,
  Banknote,
  Building2,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomerOrder, OrderStatus } from '../../types';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { 
  playOrderAlertChime, 
  requestPushNotificationPermission, 
  getNotificationPermissionStatus 
} from '../../utils/notificationService';

interface OrdersManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({ onShowToast }) => {
  const { orders, updateOrderStatus, formatPrice } = useRestaurantData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    setPermissionStatus(getNotificationPermissionStatus());
  }, []);

  const handleRequestPermission = async () => {
    const perm = await requestPushNotificationPermission();
    setPermissionStatus(perm);
    if (perm === 'granted') {
      playOrderAlertChime();
      onShowToast('Push Notifications Enabled', 'You will receive real-time order alerts even when this tab is in the background.', 'gold');
    } else if (perm === 'denied') {
      onShowToast('Permission Blocked', 'Please enable notification permissions in your browser address bar settings.', 'info');
    }
  };

  const handleTestChime = () => {
    playOrderAlertChime();
    onShowToast('Sound Chime Tested', 'Audio alert synthesizer tested successfully.', 'gold');
  };

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = 
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.deliveryAddress && ord.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') {
      return ord.status !== 'completed' && ord.status !== 'cancelled';
    }
    return ord.status === filterStatus;
  });

  const activeOrdersCount = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return { label: 'Order Placed', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'confirming':
        return { label: 'Confirming', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'preparing':
        return { label: 'Kitchen Preparing', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'ready_or_out_for_delivery':
        return { label: 'Ready / Out for Delivery', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'completed':
        return { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      default:
        return { label: status, color: 'bg-white/10 text-white/80 border-white/20' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#14110F] p-5 sm:p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5">
              <ShoppingBag className="w-6 h-6 text-[#C5A059]" />
              Live Customer Orders
            </h2>
            {activeOrdersCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#8C5E10]/40 text-[#E5C158] text-xs font-mono font-bold border border-[#C5A059]/40 animate-pulse">
                {activeOrdersCount} Active
              </span>
            )}
          </div>
          <p className="text-xs text-[#D6CEBF]/80 mt-1">
            Real-time ordering monitor with instant audio chimes and browser push notification dispatch.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleTestChime}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-colors"
            title="Test notification sound chime"
          >
            <Volume2 className="w-4 h-4 text-[#E5C158]" />
            <span className="hidden md:inline">Test Chime</span>
          </button>

          <button
            onClick={handleRequestPermission}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              permissionStatus === 'granted'
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                : 'btn-gold text-black'
            }`}
            title="Enable browser desktop/mobile push alerts"
          >
            <Bell className="w-4 h-4" />
            <span>
              {permissionStatus === 'granted' ? 'Push Alerts Active' : 'Enable Push Alerts'}
            </span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer name, phone, or address..."
            className="w-full bg-[#14110F] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C5A059]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: 'Active Only' },
            { id: 'placed', label: 'Placed' },
            { id: 'preparing', label: 'Kitchen' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === tab.id
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'bg-[#14110F] text-[#D6CEBF] hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#14110F] border border-white/5 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 text-white/30 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Orders Found</h3>
          <p className="text-xs text-[#D6CEBF]/70 mt-1 max-w-sm mx-auto">
            {searchQuery || filterStatus !== 'all'
              ? 'Try changing your search keywords or active filter.'
              : 'When patrons place home delivery or pickup orders, they will appear here with live notifications.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const isDelivery = order.orderType === 'delivery';

            return (
              <div
                key={order.id}
                className="bg-[#14110F] border border-white/10 rounded-2xl p-5 hover:border-[#C5A059]/40 transition-colors shadow-lg"
              >
                {/* Top Row: Order ID, Type, Time, Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                      {order.id}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                      isDelivery ? 'bg-amber-950/30 text-amber-300 border border-amber-500/30' : 'bg-blue-950/30 text-blue-300 border border-blue-500/30'
                    }`}>
                      {isDelivery ? <Bike className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                      <span>{isDelivery ? 'Home Delivery' : 'Pickup'}</span>
                    </span>
                    <span className="text-[11px] text-[#D6CEBF]/60 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>

                    <select
                      value={order.status}
                      onChange={(e) => {
                        const newStat = e.target.value as OrderStatus;
                        updateOrderStatus(order.id, newStat);
                        onShowToast('Order Status Updated', `Order ${order.id} is now marked as "${newStat}".`, 'success');
                      }}
                      className="bg-[#1A1614] border border-white/15 rounded-xl px-2.5 py-1 text-xs text-white font-semibold focus:outline-none focus:border-[#C5A059] cursor-pointer"
                    >
                      <option value="placed">Mark: Order Placed</option>
                      <option value="confirming">Mark: Confirming</option>
                      <option value="preparing">Mark: Kitchen Preparing</option>
                      <option value="ready_or_out_for_delivery">Mark: Ready / Out for Delivery</option>
                      <option value="completed">Mark: Completed</option>
                      <option value="cancelled">Mark: Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Middle: Customer Details & Items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-3 text-xs">
                  {/* Customer Information */}
                  <div className="bg-black/30 rounded-xl p-3 space-y-1.5 border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">Customer Details</div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#E5C158]" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="text-[#D6CEBF] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#E5C158]" />
                      <a href={`tel:${order.phoneNumber}`} className="hover:text-white underline">
                        {order.phoneNumber}
                      </a>
                    </div>
                    {order.emailAddress && (
                      <div className="text-[#D6CEBF]/70 text-[11px] truncate">
                        {order.emailAddress}
                      </div>
                    )}
                    {order.deliveryAddress && (
                      <div className="text-[#D6CEBF] flex items-start gap-1.5 pt-1 border-t border-white/5">
                        <MapPin className="w-3.5 h-3.5 text-[#E5C158] shrink-0 mt-0.5" />
                        <span className="leading-snug">{order.deliveryAddress}</span>
                      </div>
                    )}
                  </div>

                  {/* Payment Details */}
                  <div className="bg-black/30 rounded-xl p-3 space-y-1.5 border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">Payment & Total</div>
                    <div className="text-white flex items-center gap-1.5 font-semibold">
                      {order.paymentMethod === 'qr_payment' ? (
                        <>
                          <QrCode className="w-3.5 h-3.5 text-[#E5C158]" />
                          <span>QR Payment (Raast / App)</span>
                        </>
                      ) : order.paymentMethod === 'card_on_delivery' ? (
                        <>
                          <CreditCard className="w-3.5 h-3.5 text-[#E5C158]" />
                          <span>Card on Delivery</span>
                        </>
                      ) : order.paymentMethod === 'bank_transfer' ? (
                        <>
                          <Building2 className="w-3.5 h-3.5 text-[#E5C158]" />
                          <span>Bank Transfer</span>
                        </>
                      ) : (
                        <>
                          <Banknote className="w-3.5 h-3.5 text-[#E5C158]" />
                          <span>Cash on Delivery</span>
                        </>
                      )}
                    </div>
                    {order.paymentReference && (
                      <div className="text-[11px] text-[#E5C158] font-mono">
                        Ref/TxID: {order.paymentReference}
                      </div>
                    )}
                    <div className="pt-1.5 border-t border-white/5 flex items-baseline justify-between">
                      <span className="text-[#D6CEBF]/70">Total Amount:</span>
                      <span className="text-base font-bold font-mono text-emerald-400">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Special Requests & Notes */}
                  <div className="bg-black/30 rounded-xl p-3 space-y-1 border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">Special Requests</div>
                    {order.specialRequests ? (
                      <p className="text-[#D6CEBF] italic leading-relaxed text-[11px]">
                        "{order.specialRequests}"
                      </p>
                    ) : (
                      <p className="text-white/40 italic text-[11px]">None specified</p>
                    )}
                  </div>
                </div>

                {/* Ordered Items Breakdown */}
                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] uppercase font-bold text-[#D6CEBF]/60 tracking-wider mb-2">
                    Ordered Dishes & Items ({order.items.reduce((a, b) => a + b.quantity, 0)} items)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-white/5 px-2.5 py-1.5 rounded-lg">
                        <span className="text-white font-medium truncate mr-2">
                          <span className="font-bold text-[#E5C158] mr-1">{item.quantity}×</span>
                          {item.name}
                        </span>
                        <span className="font-mono text-[#D6CEBF] shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
