import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  Layers,
  Sparkles,
  Home,
  Palette,
  Store,
  Truck,
  CreditCard,
  MessageSquareQuote,
  Bell,
  Shield,
  Settings,
  Plus,
  ExternalLink,
  Menu as MenuIcon,
  X,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { DealBox, MenuItem, Order, StoreSettings, Category } from '../../types';
import { DealFormModal } from './DealFormModal';
import { MenuItemModal } from './MenuItemModal';
import { useToast } from '../Toast';
import { apiVerifyOwnerPassword } from '../../lib/api';

// Modular Sections
import { DashboardSection } from './sections/DashboardSection';
import { OrdersSection } from './sections/OrdersSection';
import { ProductsSection } from './sections/ProductsSection';
import { CategoriesSection } from './sections/CategoriesSection';
import { DealsManagerSection } from './sections/DealsManagerSection';
import { HomepageSection } from './sections/HomepageSection';
import { BrandingSection } from './sections/BrandingSection';
import { RestaurantInfoSection } from './sections/RestaurantInfoSection';
import { DeliverySection } from './sections/DeliverySection';
import { PaymentsSection } from './sections/PaymentsSection';
import { WhatsAppSection } from './sections/WhatsAppSection';
import { NotificationsSection } from './sections/NotificationsSection';
import { SecuritySection } from './sections/SecuritySection';
import { SettingsSection } from './sections/SettingsSection';

export type OwnerSectionId =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'deals'
  | 'homepage'
  | 'branding'
  | 'restaurant_info'
  | 'delivery'
  | 'payments'
  | 'whatsapp'
  | 'notifications'
  | 'security'
  | 'settings';

interface OwnerPortalProps {
  deals: DealBox[];
  menuItems: MenuItem[];
  orders: Order[];
  settings: StoreSettings;
  categories?: Category[];
  onClose: () => void;
  onCreateDeal: (deal: Partial<DealBox>) => Promise<DealBox>;
  onUpdateDeal: (id: string, deal: Partial<DealBox>) => Promise<DealBox>;
  onDeleteDeal: (id: string) => Promise<boolean>;
  onDuplicateDeal: (id: string) => Promise<DealBox>;
  onReorderDeals: (orderedIds: string[]) => Promise<boolean>;
  onCreateMenuItem: (item: Partial<MenuItem>) => Promise<MenuItem>;
  onUpdateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<MenuItem>;
  onDeleteMenuItem: (id: string) => Promise<boolean>;
  onUpdateOrderStatus: (id: string, status: Order['status']) => Promise<Order>;
  onUpdateSettings: (settings: Partial<StoreSettings>) => Promise<StoreSettings>;
  onResetData: () => Promise<void>;
  // Category management
  onCreateCategory?: (name: string, icon?: string) => Promise<Category>;
  onUpdateCategory?: (id: string, name: string, icon?: string) => Promise<Category>;
  onDeleteCategory?: (id: string) => Promise<boolean>;
}

export const OwnerPortal: React.FC<OwnerPortalProps> = ({
  deals,
  menuItems,
  orders,
  settings,
  categories = [],
  onClose,
  onCreateDeal,
  onUpdateDeal,
  onDeleteDeal,
  onDuplicateDeal,
  onReorderDeals,
  onCreateMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  onUpdateOrderStatus,
  onUpdateSettings,
  onResetData,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<OwnerSectionId>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Deal Form Modal state
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<DealBox | null>(null);

  // Menu Form Modal state
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [menuItemToEdit, setMenuItemToEdit] = useState<MenuItem | null>(null);

  const navigationItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard, badge: undefined },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingBag, badge: (orders || []).filter((o) => o.status === 'pending').length || undefined },
    { id: 'products' as const, label: 'Products', icon: Utensils, badge: (menuItems || []).length },
    { id: 'categories' as const, label: 'Categories', icon: Layers, badge: (categories || []).length || undefined },
    { id: 'deals' as const, label: 'Deals / Boxes', icon: Sparkles, badge: (deals || []).length },
    { id: 'homepage' as const, label: 'Homepage', icon: Home, badge: undefined },
    { id: 'branding' as const, label: 'Branding', icon: Palette, badge: undefined },
    { id: 'restaurant_info' as const, label: 'Restaurant Info', icon: Store, badge: undefined },
    { id: 'delivery' as const, label: 'Delivery', icon: Truck, badge: undefined },
    { id: 'payments' as const, label: 'Payments', icon: CreditCard, badge: undefined },
    { id: 'whatsapp' as const, label: 'WhatsApp', icon: MessageSquareQuote, badge: undefined },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell, badge: undefined },
    { id: 'security' as const, label: 'Security', icon: Shield, badge: undefined },
    { id: 'settings' as const, label: 'Settings', icon: Settings, badge: undefined },
  ];

  // Deal Handlers
  const handleOpenNewDeal = () => {
    setDealToEdit(null);
    setDealModalOpen(true);
  };

  const handleEditDeal = (deal: DealBox) => {
    setDealToEdit(deal);
    setDealModalOpen(true);
  };

  const handleSaveDeal = async (data: Partial<DealBox>) => {
    if (dealToEdit) {
      await onUpdateDeal(dealToEdit.id, data);
      showToast('Deal Updated', `${data.name} updated on customer website.`, 'success');
    } else {
      await onCreateDeal(data);
      showToast('New Deal Live', `${data.name} is now live in the deal catalog!`, 'success');
    }
  };

  const handleToggleActiveDeal = async (deal: DealBox) => {
    const updated = !deal.isActive;
    await onUpdateDeal(deal.id, { isActive: updated });
    showToast(
      updated ? 'Deal Visible' : 'Deal Hidden',
      `${deal.name} is now ${updated ? 'visible to customers' : 'hidden from website'}.`,
      'info'
    );
  };

  const handleToggleFeaturedDeal = async (deal: DealBox) => {
    const updated = !deal.isFeatured;
    await onUpdateDeal(deal.id, { isFeatured: updated });
    showToast(
      updated ? 'Marked Featured' : 'Removed from Featured',
      `${deal.name} ${updated ? 'will now show in Hero Featured section' : 'unmarked'}.`,
      'info'
    );
  };

  const handleDuplicateDeal = async (deal: DealBox) => {
    const cloned = await onDuplicateDeal(deal.id);
    showToast('Deal Duplicated', `Created copy: ${cloned.name}`, 'success');
  };

  const handleDeleteDeal = async (id: string) => {
    await onDeleteDeal(id);
    showToast('Deal Deleted', 'Deal box was removed from the database.', 'info');
  };

  // Menu Product Handlers
  const handleOpenNewProduct = () => {
    setMenuItemToEdit(null);
    setMenuModalOpen(true);
  };

  const handleEditProduct = (item: MenuItem) => {
    setMenuItemToEdit(item);
    setMenuModalOpen(true);
  };

  const handleSaveMenuItem = async (data: Partial<MenuItem>) => {
    if (menuItemToEdit) {
      await onUpdateMenuItem(menuItemToEdit.id, data);
      showToast('Product Updated', `${data.name} saved successfully.`, 'success');
    } else {
      await onCreateMenuItem(data);
      showToast('New Product Created', `${data.name} added to menu.`, 'success');
    }
  };

  // Password Unlock state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPasswordCode, setShowPasswordCode] = useState(false);

  // Password Unlock handler
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passwordInput.trim();
    if (!cleanPass) {
      setPasswordError('Please enter your password.');
      return;
    }

    setIsVerifying(true);
    setPasswordError(null);

    try {
      const res = await apiVerifyOwnerPassword(cleanPass);
      if (res.success) {
        setIsUnlocked(true);
        setPasswordError(null);
        setPasswordInput('');
      } else {
        setPasswordError(res.error || 'Incorrect password. Please try again.');
      }
    } catch {
      setPasswordError('Connection error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // If locked, render password lock prompt
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-black text-white font-serif tracking-tight">
              Owner Portal
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Enter your password to manage {settings.name || 'restaurant'}
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPasswordCode ? 'text' : 'password'}
                autoFocus
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                placeholder="Enter password"
                className={`w-full bg-stone-950 border ${
                  passwordError ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-stone-800 focus:border-amber-500'
                } rounded-2xl py-3.5 pl-4 pr-11 text-center text-lg sm:text-xl font-mono font-bold text-white focus:outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowPasswordCode(!showPasswordCode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 p-1.5 rounded-lg hover:bg-stone-800 transition-colors"
                aria-label={showPasswordCode ? 'Hide password' : 'Show password'}
              >
                {showPasswordCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {passwordError && (
              <p className="text-xs text-rose-400 font-medium">{passwordError}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-all"
              >
                Back to Site
              </button>
              <button
                type="submit"
                disabled={isVerifying || !passwordInput.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-black text-xs transition-all shadow-md"
              >
                {isVerifying ? 'Verifying...' : 'Unlock Portal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-stone-950 text-white border-b border-stone-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
            
            {/* Left: Mobile Nav Toggle & Branding */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-stone-950 font-black flex items-center justify-center text-xs shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base font-serif text-white tracking-tight">
                      Owner Portal
                    </span>
                    <span className="hidden sm:inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                      Unlimited CMS
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 hidden sm:block">
                    {settings.name} &bull; Live Database Active
                  </span>
                </div>
              </div>
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenNewDeal}
                className="hidden sm:flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ New Deal</span>
              </button>

              <button
                type="button"
                onClick={handleOpenNewProduct}
                className="hidden sm:flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-stone-700 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ New Product</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white font-bold text-xs px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-stone-800 transition-all shrink-0 active:scale-95"
                title="Back to Customer Site"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Back to Site</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Navigation (Desktop) & Drawer (Mobile) */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white lg:bg-transparent lg:border-none border-r border-stone-200 p-4 lg:p-0 flex flex-col justify-between transition-transform duration-200 ${
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-80px)] lg:max-h-none no-scrollbar">
            <div className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-wider text-stone-400">
              Management Navigation
            </div>

            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-amber-700 text-amber-100' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Lock / Exit */}
          <div className="pt-4 border-t border-stone-200 lg:border-t-0 space-y-2">
            <button
              type="button"
              onClick={() => setIsUnlocked(false)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200/60 transition-colors"
            >
              <Lock className="w-4 h-4 text-stone-400" />
              <span>Lock Portal</span>
            </button>
          </div>
        </aside>

        {/* Mobile Backdrop overlay */}
        {mobileNavOpen && (
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          />
        )}

        {/* Main Section Content Container */}
        <main className="flex-1 min-w-0">
          {activeSection === 'dashboard' && (
            <DashboardSection
              deals={deals}
              menuItems={menuItems}
              orders={orders}
              settings={settings}
              onNavigate={(section) => setActiveSection(section as OwnerSectionId)}
              onToggleStoreStatus={async (isOpen) => {
                await onUpdateSettings({ isOpen });
                showToast('Store Status Updated', isOpen ? 'Store is now Online!' : 'Store marked Closed.', 'info');
              }}
              onOpenNewDeal={handleOpenNewDeal}
              onOpenNewProduct={handleOpenNewProduct}
            />
          )}

          {activeSection === 'orders' && (
            <OrdersSection
              orders={orders}
              settings={settings}
              onUpdateOrderStatus={onUpdateOrderStatus}
            />
          )}

          {activeSection === 'products' && (
            <ProductsSection
              menuItems={menuItems}
              categories={categories}
              settings={settings}
              onOpenNewProduct={handleOpenNewProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={onDeleteMenuItem}
            />
          )}

          {activeSection === 'categories' && (
            <CategoriesSection
              categories={categories}
              menuItems={menuItems}
              deals={deals}
              onCreateCategory={onCreateCategory || (async (name) => ({ id: `cat-${Date.now()}`, name }))}
              onUpdateCategory={onUpdateCategory || (async (id, name) => ({ id, name }))}
              onDeleteCategory={onDeleteCategory || (async () => true)}
            />
          )}

          {activeSection === 'deals' && (
            <DealsManagerSection
              deals={deals}
              settings={settings}
              onOpenNewDeal={handleOpenNewDeal}
              onEditDeal={handleEditDeal}
              onToggleActive={handleToggleActiveDeal}
              onToggleFeatured={handleToggleFeaturedDeal}
              onDuplicateDeal={handleDuplicateDeal}
              onDeleteDeal={handleDeleteDeal}
              onReorderDeals={onReorderDeals}
            />
          )}

          {activeSection === 'homepage' && (
            <HomepageSection
              settings={settings}
              onUpdateSettings={onUpdateSettings}
            />
          )}

          {activeSection === 'branding' && (
            <BrandingSection
              settings={settings}
              onUpdateSettings={onUpdateSettings}
            />
          )}

          {activeSection === 'restaurant_info' && (
            <RestaurantInfoSection
              settings={settings}
              onUpdateSettings={onUpdateSettings}
            />
          )}

          {activeSection === 'delivery' && (
            <DeliverySection
              settings={settings}
              onUpdateSettings={onUpdateSettings}
            />
          )}

          {activeSection === 'payments' && (
            <PaymentsSection
              settings={settings}
              onUpdateSettings={onUpdateSettings}
            />
          )}

          {activeSection === 'whatsapp' && (
            <WhatsAppSection
              settings={settings}
              onUpdateSettings={onUpdateSettings}
            />
          )}

          {activeSection === 'notifications' && (
            <NotificationsSection
              settings={settings}
              onUpdateSettings={onUpdateSettings}
            />
          )}

          {activeSection === 'security' && (
            <SecuritySection
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              onLockPortal={() => setIsUnlocked(false)}
            />
          )}

          {activeSection === 'settings' && (
            <SettingsSection
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              onResetData={onResetData}
            />
          )}
        </main>
      </div>

      {/* Modals for Adding/Editing Deals and Menu Items */}
      {dealModalOpen && (
        <DealFormModal
          deal={dealToEdit}
          currency={settings.currency || 'Rs.'}
          onClose={() => setDealModalOpen(false)}
          onSave={handleSaveDeal}
        />
      )}

      {menuModalOpen && (
        <MenuItemModal
          item={menuItemToEdit}
          currency={settings.currency || 'Rs.'}
          categories={categories}
          onClose={() => setMenuModalOpen(false)}
          onSave={handleSaveMenuItem}
        />
      )}
    </div>
  );
};
