import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Package,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Plus,
  Flame,
  Utensils,
  DollarSign,
  AlertCircle,
  Phone,
  MessageSquareQuote,
} from 'lucide-react';
import { DealBox, MenuItem, Order, StoreSettings, CategoryItem } from '../../../types';

interface DashboardSectionProps {
  deals: DealBox[];
  menuItems: MenuItem[];
  orders: Order[];
  settings: StoreSettings;
  categories: CategoryItem[];
  onNavigateTab: (tab: any) => void;
  onOpenCreateDeal: () => void;
  onOpenCreateProduct: () => void;
  onUpdateOrderStatus: (id: string, status: Order['status']) => Promise<Order>;
  onToggleStoreStatus: () => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  deals,
  menuItems,
  orders,
  settings,
  categories,
  onNavigateTab,
  onOpenCreateDeal,
  onOpenCreateProduct,
  onUpdateOrderStatus,
  onToggleStoreStatus,
}) => {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeDeals = Array.isArray(deals) ? deals : [];
  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Calculate Metrics
  const totalRevenue = safeOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

  const pendingOrders = safeOrders.filter((o) => o.status === 'pending');
  const activeOrders = safeOrders.filter((o) => ['confirmed', 'preparing', 'out_for_delivery'].includes(o.status));
  const completedOrders = safeOrders.filter((o) => o.status === 'completed');
  const avgOrderValue = safeOrders.length > 0 ? Math.round(totalRevenue / Math.max(1, safeOrders.filter(o => o.status !== 'cancelled').length)) : 0;

  const activeDeals = safeDeals.filter((d) => d.isActive && d.isAvailable);
  const featuredDeals = safeDeals.filter((d) => d.isFeatured);
  const activeProducts = safeMenuItems.filter((p) => p.isAvailable);

  const recentOrders = safeOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner with Store Status & Quick Actions */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Live Restaurant Overview
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                settings.isOpen ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${settings.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              {settings.isOpen ? 'Open for Orders' : 'Store Paused / Closed'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-serif tracking-tight text-white">
            {settings.name}
          </h1>
          <p className="text-xs text-stone-400 max-w-xl">
            {settings.tagline}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onToggleStoreStatus}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              settings.isOpen
                ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
            }`}
          >
            {settings.isOpen ? 'Pause Store Ordering' : 'Turn Store Online'}
          </button>

          <button
            type="button"
            onClick={onOpenCreateDeal}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Deal Box</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateProduct}
            className="bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-stone-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Sales</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
            {settings.currency} {totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500">
            Avg Order: <span className="font-bold text-stone-800">{settings.currency} {avgOrderValue.toLocaleString()}</span>
          </div>
        </div>

        {/* Metric 2: Pending Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1 cursor-pointer hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Orders</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
              pendingOrders.length > 0 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-stone-100 text-stone-600'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 font-serif flex items-center gap-2">
            <span>{pendingOrders.length}</span>
            {pendingOrders.length > 0 && (
              <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
                Action Required
              </span>
            )}
          </div>
          <div className="text-[11px] text-stone-500 flex items-center gap-1 group-hover:text-amber-700">
            <span>{activeOrders.length} in kitchen / delivery</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Metric 3: Active Deals & Boxes */}
        <div
          onClick={() => onNavigateTab('deals')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1 cursor-pointer hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Food Deals & Boxes</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
            {activeDeals.length}
            <span className="text-xs font-normal text-stone-400 ml-1">/ {safeDeals.length} total</span>
          </div>
          <div className="text-[11px] text-stone-500 flex items-center gap-1 group-hover:text-amber-700">
            <span>{featuredDeals.length} featured on banner</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Metric 4: Single Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1 cursor-pointer hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Food Products</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
            {activeProducts.length}
            <span className="text-xs font-normal text-stone-400 ml-1">/ {safeMenuItems.length} total</span>
          </div>
          <div className="text-[11px] text-stone-500 flex items-center gap-1 group-hover:text-amber-700">
            <span>{safeCategories.length} live categories</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders + Quick Management Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Orders Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900 font-serif">Recent Customer Orders</h2>
              <p className="text-[11px] text-stone-500">Live feed of orders received on website</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>View All ({safeOrders.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-stone-400 space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-xs font-semibold">No orders received yet.</p>
                <p className="text-[11px] text-stone-400">When customers place orders, they will appear here with instant sound & status controls.</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-stone-900 font-mono">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          order.status === 'pending'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : order.status === 'confirmed'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'preparing'
                            ? 'bg-orange-100 text-orange-800'
                            : order.status === 'out_for_delivery'
                            ? 'bg-sky-100 text-sky-800'
                            : order.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-stone-800">
                      {order.customerName} &bull; <span className="text-stone-500 font-normal">{order.customerPhone}</span>
                    </div>

                    <div className="text-[11px] text-stone-500 line-clamp-1">
                      {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0">
                    <div className="text-xs font-extrabold text-stone-900 font-serif">
                      {settings.currency} {order.grandTotal.toLocaleString()}
                    </div>

                    <div className="flex items-center gap-1">
                      {order.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => onUpdateOrderStatus(order.id, 'confirmed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2 py-1 rounded-lg shadow-2xs"
                        >
                          Confirm
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-2 py-1 rounded-lg"
                        >
                          Kitchen
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          type="button"
                          onClick={() => onUpdateOrderStatus(order.id, 'out_for_delivery')}
                          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] px-2 py-1 rounded-lg"
                        >
                          Dispatch
                        </button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <button
                          type="button"
                          onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2 py-1 rounded-lg"
                        >
                          Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Quick Portal Navigation Hub */}
        <div className="space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
              Quick Management Shortcuts
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => onNavigateTab('deals')}
                className="w-full text-left p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">Manage Deals & Boxes</span>
                    <span className="text-[10px] text-stone-500">Add contents, prices, add-ons</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('products')}
                className="w-full text-left p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">Single Menu Products</span>
                    <span className="text-[10px] text-stone-500">Burgers, ice cream, spicy, drinks</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('homepage')}
                className="w-full text-left p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-xs">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">Homepage & Hero Banners</span>
                    <span className="text-[10px] text-stone-500">Banner photos, text & buttons</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('branding')}
                className="w-full text-left p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">Branding & Logo</span>
                    <span className="text-[10px] text-stone-500">Site title, logo, tagline</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('delivery')}
                className="w-full text-left p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-xs">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">Delivery Rates & Zones</span>
                    <span className="text-[10px] text-stone-500">Delivery fees, min orders, areas</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
