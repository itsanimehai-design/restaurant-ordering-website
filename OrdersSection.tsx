import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Phone,
  MapPin,
  MessageSquareQuote,
  AlertCircle,
  CreditCard,
  Banknote,
  DollarSign,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { Order, OrderStatus, StoreSettings } from '../../../types';

interface OrdersSectionProps {
  orders: Order[];
  settings: StoreSettings;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => Promise<Order>;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  settings,
  onUpdateOrderStatus,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);

  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrders.filter((order) => {
    if (!order) return false;
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.customerPhone.toLowerCase().includes(searchLower) ||
      (order.deliveryAddress && order.deliveryAddress.toLowerCase().includes(searchLower));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1"><Clock className="w-3 h-3" /> PENDING</span>;
      case 'confirmed':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> CONFIRMED</span>;
      case 'preparing':
        return <span className="bg-orange-100 text-orange-800 border border-orange-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1"><Clock className="w-3 h-3" /> PREPARING</span>;
      case 'out_for_delivery':
        return <span className="bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1"><Truck className="w-3 h-3" /> ON THE WAY</span>;
      case 'ready_for_pickup':
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> READY FOR PICKUP</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> DELIVERED</span>;
      case 'cancelled':
        return <span className="bg-stone-200 text-stone-700 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1"><XCircle className="w-3 h-3" /> CANCELLED</span>;
    }
  };

  const sendWhatsAppUpdate = (order: Order) => {
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hi ${order.customerName}! Your order *${order.orderNumber}* from *${settings.name}* is now *${order.status.replace(/_/g, ' ').toUpperCase()}*.\nTotal: ${settings.currency} ${order.grandTotal}\nThank you for choosing us!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-stone-900 font-serif">Customer Orders Management</h2>
          <p className="text-xs text-stone-500">Track and update incoming delivery & takeaway orders in real time</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500">Total Orders:</span>
          <span className="bg-stone-900 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
            {safeOrders.length}
          </span>
        </div>
      </div>

      {/* Search & Filter Tabs */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, customer name, phone number, address..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 px-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Orders', count: safeOrders.length },
            { id: 'pending', label: 'Pending', count: safeOrders.filter((o) => o.status === 'pending').length },
            { id: 'confirmed', label: 'Confirmed', count: safeOrders.filter((o) => o.status === 'confirmed').length },
            { id: 'preparing', label: 'Preparing', count: safeOrders.filter((o) => o.status === 'preparing').length },
            { id: 'out_for_delivery', label: 'Out for Delivery', count: safeOrders.filter((o) => o.status === 'out_for_delivery').length },
            { id: 'completed', label: 'Completed', count: safeOrders.filter((o) => o.status === 'completed').length },
            { id: 'cancelled', label: 'Cancelled', count: safeOrders.filter((o) => o.status === 'cancelled').length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedStatus === tab.id
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedStatus === tab.id ? 'bg-amber-700 text-white' : 'bg-stone-200 text-stone-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400 space-y-2 shadow-2xs">
          <ShoppingBag className="w-10 h-10 mx-auto text-stone-300" />
          <h3 className="text-sm font-bold text-stone-700">No orders found</h3>
          <p className="text-xs text-stone-400">
            {search ? 'Try adjusting your search criteria.' : 'Customer orders placed on the website will be displayed here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-4 sm:p-5 space-y-4 hover:border-amber-300 transition-all"
            >
              {/* Order Card Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 font-black flex items-center justify-center font-mono text-xs">
                    {order.orderNumber.slice(-4)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-stone-900 font-mono">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                      <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                        {order.orderType === 'delivery' ? 'Home Delivery' : 'Self Pickup'}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {/* Status Dropdown Changer */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-stone-500">Update Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-900 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing in Kitchen</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="ready_for_pickup">Ready for Pickup</option>
                    <option value="completed">Completed / Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order Body: Customer & Delivery Info + Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Customer Details */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 space-y-2">
                  <span className="font-extrabold text-[11px] uppercase tracking-wider text-amber-800 block">
                    Customer Information
                  </span>
                  <div className="space-y-1">
                    <div className="font-bold text-stone-900 text-sm">{order.customerName}</div>
                    <div className="flex items-center gap-3 text-stone-600">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="flex items-center gap-1 font-semibold text-stone-700 hover:text-amber-700"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-600" />
                        <span>{order.customerPhone}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => sendWhatsAppUpdate(order)}
                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px]"
                      >
                        <MessageSquareQuote className="w-3.5 h-3.5" />
                        <span>WhatsApp Customer</span>
                      </button>
                    </div>

                    {order.deliveryAddress && (
                      <div className="flex items-start gap-1.5 text-stone-600 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>
                          {order.deliveryAddress} {order.deliveryArea && `(${order.deliveryArea})`}
                        </span>
                      </div>
                    )}

                    {order.specialInstructions && (
                      <div className="text-[11px] bg-amber-100/60 p-2 rounded-lg text-amber-900 mt-1">
                        <span className="font-bold">Instructions:</span> {order.specialInstructions}
                      </div>
                    )}
                  </div>
                </div>

                {/* Ordered Items Breakdown */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 space-y-2">
                  <span className="font-extrabold text-[11px] uppercase tracking-wider text-amber-800 block">
                    Ordered Food & Deals
                  </span>
                  <div className="divide-y divide-stone-200/60 max-h-40 overflow-y-auto space-y-1.5">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="pt-1.5 first:pt-0 flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-stone-900">
                            {item.quantity}x {item.name}
                          </div>
                          {item.includedItemsSummary && item.includedItemsSummary.length > 0 && (
                            <div className="text-[10px] text-stone-500 pl-2">
                              {item.includedItemsSummary.join(' + ')}
                            </div>
                          )}
                          {item.selectedAddons && item.selectedAddons.length > 0 && (
                            <div className="text-[10px] text-amber-700 pl-2">
                              Add-ons: {(item.selectedAddons || []).map((a) => `${a.name} (+${settings.currency}${a.price})`).join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="font-bold text-stone-800 shrink-0 font-serif">
                          {settings.currency} {item.itemTotal.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Card Footer: Payment & Total Breakdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-stone-100 gap-2 text-xs">
                <div className="flex items-center gap-2 text-stone-600">
                  <span className="font-bold">Payment Method:</span>
                  <span className="font-bold uppercase bg-stone-100 px-2 py-0.5 rounded text-stone-800">
                    {order.paymentMethod.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 mr-2">
                      Subtotal: {settings.currency}{order.subtotal} | Delivery: {settings.currency}{order.deliveryFee}
                      {order.discount > 0 && ` | Discount: -${settings.currency}${order.discount}`}
                    </span>
                    <span className="text-sm font-black text-stone-900 font-serif">
                      Total: {settings.currency} {order.grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
