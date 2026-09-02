import React, { useState, useEffect, useCallback } from 'react';
import {
  apiGetDeals,
  apiCreateDeal,
  apiUpdateDeal,
  apiDeleteDeal,
  apiDuplicateDeal,
  apiReorderDeals,
  apiGetMenuItems,
  apiCreateMenuItem,
  apiUpdateMenuItem,
  apiDeleteMenuItem,
  apiGetOrders,
  apiUpdateOrderStatus,
  apiGetSettings,
  apiUpdateSettings,
  apiResetToDefault,
  apiGetCategories,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
} from './lib/api';
import { DealBox, MenuItem, Order, StoreSettings, CartItem, Category } from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DealsSection } from './components/DealsSection';
import { MenuSection } from './components/MenuSection';
import { DealDetailModal } from './components/DealDetailModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OwnerPortal } from './components/owner/OwnerPortal';
import { ToastProvider, useToast } from './components/Toast';
import {
  Sparkles,
  ShoppingBag,
  MessageSquareQuote,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  Truck,
  Flame,
  Award,
  ChevronRight,
  Heart,
} from 'lucide-react';

const CART_STORAGE_KEY = 'pakbite_cart_v1';
const ORDER_TYPE_KEY = 'pakbite_order_type_v1';

function AppContent() {
  const { showToast } = useToast();

  // Data states
  const [deals, setDeals] = useState<DealBox[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    name: 'PakBite Food & Deals',
    tagline: 'Unlimited Crispy Food Deals, Boxes & Combos',
    logo: '',
    phone: '0300-1234567',
    whatsappNumber: '923001234567',
    address: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
    currency: 'Rs.',
    deliveryFee: 150,
    freeDeliveryThreshold: 2000,
    isOpen: true,
    estimatedDeliveryTime: '30-45 mins',
    announcement: '🔥 Flat 25% OFF on Family Feast Boxes! Free Delivery over Rs. 2,000.',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isOwnerMode, setIsOwnerMode] = useState(false);

  // Customer Interactions & Modals
  const [selectedDeal, setSelectedDeal] = useState<DealBox | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Deals & Boxes');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number } | null>(null);

  // Order Type (delivery vs pickup)
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>(() => {
    try {
      const saved = localStorage.getItem(ORDER_TYPE_KEY);
      return (saved as any) || 'delivery';
    } catch {
      return 'delivery';
    }
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(Array.isArray(cart) ? cart : []));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Persist order type
  useEffect(() => {
    try {
      localStorage.setItem(ORDER_TYPE_KEY, orderType);
    } catch (e) {
      console.error(e);
    }
  }, [orderType]);

  // Initial Fetch
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [dealsData, menuData, categoriesData, ordersData, settingsData] = await Promise.all([
        apiGetDeals(),
        apiGetMenuItems(),
        apiGetCategories(),
        apiGetOrders(),
        apiGetSettings(),
      ]);

      setDeals(Array.isArray(dealsData) ? dealsData : []);
      setMenuItems(Array.isArray(menuData) ? menuData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      if (settingsData) setSettings(settingsData);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Cart Handlers
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      // Check if exact same item exists (same referenceId and addons)
      const existingIdx = prev.findIndex((ci) => {
        if (ci.referenceId !== item.referenceId) return false;
        const add1 = (ci.selectedAddons || []).map((a) => a.id).sort().join(',');
        const add2 = (item.selectedAddons || []).map((a) => a.id).sort().join(',');
        return add1 === add2;
      });

      if (existingIdx > -1) {
        const updated = [...prev];
        const current = updated[existingIdx];
        const newQty = current.quantity + item.quantity;
        const singlePrice = current.itemTotal / current.quantity;
        updated[existingIdx] = {
          ...current,
          quantity: newQty,
          itemTotal: singlePrice * newQty,
        };
        return updated;
      }
      return [...prev, item];
    });

    showToast('Added to Cart', `${item.name} (${item.quantity}x)`, 'success');
  };

  const handleUpdateCartQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const unitPrice = item.unitPrice || item.basePrice;
          return {
            ...item,
            quantity,
            itemTotal: unitPrice * quantity,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const handleApplyPromo = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    const safeCart = Array.isArray(cart) ? cart : [];
    const subtotal = safeCart.reduce((sum, i) => sum + (i?.itemTotal || 0), 0);

    if (clean === 'PAKBITE50') {
      const discount = Math.min(250, Math.round(subtotal * 0.15));
      setAppliedPromo({ code: clean, discountAmount: discount });
      showToast('Promo Applied!', `You saved ${settings.currency} ${discount} with PAKBITE50`, 'success');
      return true;
    } else if (clean === 'DEAL20') {
      const discount = Math.min(400, Math.round(subtotal * 0.2));
      setAppliedPromo({ code: clean, discountAmount: discount });
      showToast('Promo Applied!', `You saved ${settings.currency} ${discount} with DEAL20`, 'success');
      return true;
    } else {
      showToast('Invalid Coupon', 'Try PAKBITE50 or DEAL20', 'error');
      return false;
    }
  };

  const handleOrderPlaced = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setAppliedPromo(null);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setPlacedOrder(order);
    showToast('Order Confirmed!', `Order ${order.orderNumber} received.`, 'success');
  };

  // ================= OWNER ACTIONS =================
  const handleCreateDeal = async (dealData: Partial<DealBox>): Promise<DealBox> => {
    const created = await apiCreateDeal(dealData);
    setDeals((prev) => [...prev, created]);
    return created;
  };

  const handleUpdateDeal = async (id: string, dealData: Partial<DealBox>): Promise<DealBox> => {
    const updated = await apiUpdateDeal(id, dealData);
    setDeals((prev) => prev.map((d) => (d.id === id ? updated : d)));
    return updated;
  };

  const handleDeleteDeal = async (id: string): Promise<boolean> => {
    const ok = await apiDeleteDeal(id);
    if (ok) {
      setDeals((prev) => prev.filter((d) => d.id !== id));
    }
    return ok;
  };

  const handleDuplicateDeal = async (id: string): Promise<DealBox> => {
    const cloned = await apiDuplicateDeal(id);
    setDeals((prev) => [cloned, ...prev]);
    return cloned;
  };

  const handleReorderDeals = async (orderedIds: string[]): Promise<boolean> => {
    const ok = await apiReorderDeals(orderedIds);
    if (ok) {
      const map = new Map(deals.map((d) => [d.id, d]));
      const reordered = orderedIds.map((id) => map.get(id)).filter(Boolean) as DealBox[];
      setDeals(reordered);
    }
    return ok;
  };

  const handleCreateMenuItem = async (itemData: Partial<MenuItem>): Promise<MenuItem> => {
    const created = await apiCreateMenuItem(itemData);
    setMenuItems((prev) => [...prev, created]);
    return created;
  };

  const handleUpdateMenuItem = async (id: string, itemData: Partial<MenuItem>): Promise<MenuItem> => {
    const updated = await apiUpdateMenuItem(id, itemData);
    setMenuItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  };

  const handleDeleteMenuItem = async (id: string): Promise<boolean> => {
    const ok = await apiDeleteMenuItem(id);
    if (ok) {
      setMenuItems((prev) => prev.filter((i) => i.id !== id));
    }
    return ok;
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']): Promise<Order> => {
    const updated = await apiUpdateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  };

  const handleUpdateSettings = async (newSettings: Partial<StoreSettings>): Promise<StoreSettings> => {
    const updated = await apiUpdateSettings(newSettings);
    setSettings(updated);
    return updated;
  };

  const handleResetData = async () => {
    await apiResetToDefault();
    await refreshData();
  };

  // Category Handlers
  const handleCreateCategory = async (name: string, icon?: string): Promise<Category> => {
    const created = await apiCreateCategory({ name, icon });
    setCategories((prev) => [...prev, created]);
    return created;
  };

  const handleUpdateCategory = async (id: string, name: string, icon?: string): Promise<Category> => {
    const updated = await apiUpdateCategory(id, { name, icon });
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const handleDeleteCategory = async (id: string): Promise<boolean> => {
    const ok = await apiDeleteCategory(id);
    if (ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
    return ok;
  };

  const totalCartCount = (Array.isArray(cart) ? cart : []).reduce(
    (sum, item) => sum + (item?.quantity || 0),
    0
  );

  // If in Owner Mode, show Owner Portal
  if (isOwnerMode) {
    return (
      <OwnerPortal
        deals={deals}
        menuItems={menuItems}
        orders={orders}
        settings={settings}
        categories={categories}
        onClose={() => setIsOwnerMode(false)}
        onCreateDeal={handleCreateDeal}
        onUpdateDeal={handleUpdateDeal}
        onDeleteDeal={handleDeleteDeal}
        onDuplicateDeal={handleDuplicateDeal}
        onReorderDeals={handleReorderDeals}
        onCreateMenuItem={handleCreateMenuItem}
        onUpdateMenuItem={handleUpdateMenuItem}
        onDeleteMenuItem={handleDeleteMenuItem}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateSettings={handleUpdateSettings}
        onResetData={handleResetData}
        onCreateCategory={handleCreateCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    );
  }

  // Customer Facing Storefront
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col antialiased selection:bg-amber-500 selection:text-white">
      {/* Top Announcement Bar */}
      {settings.announcement && (
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 text-white text-[11px] sm:text-xs font-bold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200 shrink-0" />
          <span>{settings.announcement}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        settings={settings}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        orderType={orderType}
        onToggleOrderType={(type) => {
          setOrderType(type);
          showToast('Delivery Option', `Switched to ${type === 'delivery' ? 'Home Delivery' : 'Takeaway Pickup'}`, 'info');
        }}
        onOpenOwnerPortal={() => setIsOwnerMode(true)}
        isOwnerMode={isOwnerMode}
        activeSection={selectedCategory}
        onSelectSection={(sec) => setSelectedCategory(sec)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 sm:space-y-14">
        {/* Hero Banner with Featured Deals */}
        <HeroBanner
          deals={deals}
          settings={settings}
          onSelectDeal={(deal) => setSelectedDeal(deal)}
          onScrollToDeals={() => {
            document.getElementById('deals-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenOwnerPortal={() => setIsOwnerMode(true)}
        />

        {/* Dynamic Deals & Food Boxes Section */}
        <div id="deals-section">
          <DealsSection
            deals={deals}
            settings={settings}
            onSelectDeal={(deal) => setSelectedDeal(deal)}
            onQuickAddToCart={(deal) => {
              const cartItem: CartItem = {
                cartId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                itemType: 'deal',
                referenceId: deal.id,
                name: deal.name,
                image: deal.image,
                basePrice: deal.price,
                unitPrice: deal.price,
                quantity: 1,
                selectedAddons: [],
                selectedOptions: [],
                includedItemsSummary: deal.includedItems?.map((i) => `${i.quantity}x ${i.name}`),
                itemTotal: deal.price,
              };
              handleAddToCart(cartItem);
            }}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenOwnerPortal={() => setIsOwnerMode(true)}
          />
        </div>

        {/* Regular Menu Section (Ice Cream, Drinks, Spicy Food, Deal Meal, Burgers) */}
        <MenuSection
          items={menuItems}
          settings={settings}
          onSelectItem={(item) => setSelectedMenuItem(item)}
          onQuickAddToCart={(item) => {
            const cartItem: CartItem = {
              cartId: `cart-menu-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
              itemType: 'menu_item',
              referenceId: item.id,
              name: item.name,
              image: item.image,
              basePrice: item.price,
              unitPrice: item.price,
              quantity: 1,
              selectedAddons: [],
              selectedOptions: [],
              itemTotal: item.price,
            };
            handleAddToCart(cartItem);
          }}
        />

        {/* Quality & Fresh Guarantee Badge Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-stone-900">Hot & Fast Delivery</h4>
              <p className="text-[11px] text-stone-500">Delivered in {settings.estimatedDeliveryTime} fresh from our kitchen</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-stone-900">Hygiene & Quality Standard</h4>
              <p className="text-[11px] text-stone-500">Premium ingredients, fresh brioche buns and master chef recipes</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-stone-900">Unlimited Custom Deals</h4>
              <p className="text-[11px] text-stone-500">Huge savings on combo boxes and family portions</p>
            </div>
          </div>
        </div>
      </main>

      {/* Customer Footer */}
      <footer className="mt-16 bg-stone-900 text-stone-300 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center font-black">
                  P
                </div>
                <span className="font-extrabold text-lg text-white font-serif tracking-tight">
                  {settings.name}
                </span>
              </div>
              <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
                {settings.tagline}. Order hot & crispy fried chicken, zinger combos, mega family deals, and chilled drinks directly to your doorstep.
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs text-stone-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> {settings.address}
                </span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mb-3">Popular Boxes</h4>
              <ul className="space-y-1.5 text-xs text-stone-400">
                {deals.slice(0, 4).map((d) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedDeal(d)}
                      className="hover:text-amber-400 transition-colors text-left"
                    >
                      {d.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Owner Access & Direct Support */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mb-3">Owner & Support</h4>
              
              <button
                type="button"
                onClick={() => setIsOwnerMode(true)}
                className="w-full bg-stone-800 hover:bg-stone-700 text-amber-400 hover:text-amber-300 font-bold p-2.5 rounded-xl border border-stone-700 text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Open Owner Portal</span>
              </button>

              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>WhatsApp Ordering</span>
              </a>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>&copy; {new Date().getFullYear()} {settings.name}. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Pakistan Foodies
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Cart Bar for Mobile */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3 px-4 rounded-2xl shadow-xl flex items-center justify-between animate-bounce-subtle"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white text-stone-900 font-bold text-xs flex items-center justify-center">
                {totalCartCount}
              </div>
              <span className="text-xs">View My Cart</span>
            </div>
            <span className="text-xs font-extrabold font-serif">
              {settings.currency}{' '}
              {(Array.isArray(cart) ? cart : [])
                .reduce((sum, item) => sum + (item?.itemTotal || 0), 0)
                .toLocaleString()}{' '}
              &rarr;
            </span>
          </button>
        </div>
      )}

      {/* Deal Customizer Modal */}
      <DealDetailModal
        deal={selectedDeal}
        settings={settings}
        onClose={() => setSelectedDeal(null)}
        onAddToCart={handleAddToCart}
        onOrderNow={(cartItem) => {
          setCart([cartItem]);
          setSelectedDeal(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Single Menu Item Customizer Modal */}
      <ItemDetailModal
        item={selectedMenuItem}
        settings={settings}
        onClose={() => setSelectedMenuItem(null)}
        onAddToCart={handleAddToCart}
        onOrderNow={(cartItem) => {
          setCart([cartItem]);
          setSelectedMenuItem(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        settings={settings}
        orderType={orderType}
        onToggleOrderType={setOrderType}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={() => setAppliedPromo(null)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        settings={settings}
        orderType={orderType}
        onToggleOrderType={setOrderType}
        onOrderPlaced={handleOrderPlaced}
        appliedPromo={appliedPromo}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        order={placedOrder}
        settings={settings}
        onClose={() => setPlacedOrder(null)}
        onOpenOwnerPortal={() => {
          setPlacedOrder(null);
          setIsOwnerMode(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
