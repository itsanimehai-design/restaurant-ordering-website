import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { 
  Utensils, 
  BookOpen, 
  Tag, 
  Image as ImageIcon, 
  Building2, 
  Award, 
  Calendar, 
  MessageSquare, 
  Database,
  ExternalLink,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  Menu as MenuIcon,
  X,
  Sparkles,
  Flame,
  QrCode,
  Bot,
  Package,
  Layers,
  Send,
  ShoppingBag,
  CupSoda,
  IceCream2,
  LayoutTemplate,
  Truck,
  Bell,
  KeyRound,
  Globe,
  Code2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Sub-Managers
import { CodeWorkspaceManager } from './CodeWorkspaceManager';
import { MenuManager } from './MenuManager';
import { DealsManager } from './DealsManager';
import { RecipeManager } from './RecipeManager';
import { OffersManager } from './OffersManager';
import { GalleryManager } from './GalleryManager';
import { RestaurantInfoManager } from './RestaurantInfoManager';
import { ChefManager } from './ChefManager';
import { EventsManager } from './EventsManager';
import { ReviewsManager } from './ReviewsManager';
import { PaymentSettingsManager } from './PaymentSettingsManager';
import { AiAssistantManager } from './AiAssistantManager';
import { Food3DManager } from './Food3DManager';
import { CategoriesManager } from './CategoriesManager';
import { RestaurantDetailsBlockManager } from './RestaurantDetailsBlockManager';
import { NashtaPointManager } from './NashtaPointManager';
import { OrdersManager } from './OrdersManager';
import { SoftDrinksManager } from './SoftDrinksManager';
import { IceCreamManager } from './IceCreamManager';
import { HomepageManager } from './HomepageManager';
import { BrandingManager } from './BrandingManager';
import { DeliveryPickupManager } from './DeliveryPickupManager';
import { NotificationManager } from './NotificationManager';
import { SecurityManager } from './SecurityManager';

type DashboardTab = 
  | 'code-workspace'
  | 'orders'
  | 'homepage'
  | 'branding'
  | 'details-block'
  | 'nashta'
  | 'drinks'
  | 'ice-cream'
  | 'food-3d'
  | 'categories'
  | 'menu' 
  | 'deals'
  | 'delivery'
  | 'recipes' 
  | 'offers' 
  | 'gallery' 
  | 'payments'
  | 'notifications'
  | 'security'
  | 'ai-assistant'
  | 'info' 
  | 'chefs' 
  | 'events' 
  | 'reviews' 
  | 'backup';

export const OwnerDashboard: React.FC = () => {
  const { 
    ownerSession, 
    ownerLogout, 
    toggleOwnerMode, 
    config, 
    orders = [],
    nashtaItems = [],
    softDrinks = [],
    dessertBarItems = [],
    menuItems, 
    deals = [],
    specialRecipes, 
    offers, 
    galleryItems, 
    chefs, 
    events, 
    reviews,
    exportDataJson,
    importDataJson,
    resetToDefaults,
    publishStatus,
    publishAllChanges,
    ownerActiveTab,
    setOwnerActiveTab
  } = useRestaurantData();

  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    if (ownerActiveTab && (ownerActiveTab as DashboardTab)) {
      return ownerActiveTab as DashboardTab;
    }
    return 'code-workspace';
  });

  // Sync with context if ownerActiveTab changes externally
  React.useEffect(() => {
    if (ownerActiveTab && ownerActiveTab !== activeTab) {
      setActiveTab(ownerActiveTab as DashboardTab);
    }
  }, [ownerActiveTab]);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    if (setOwnerActiveTab) {
      setOwnerActiveTab(tab);
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{
    id: number;
    title: string;
    message?: string;
    type?: 'success' | 'gold' | 'info';
  } | null>(null);

  const showToast = (title: string, message?: string, type: 'success' | 'gold' | 'info' = 'success') => {
    const id = Date.now();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 3800);
  };

  const navItems: { id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number; highlight?: boolean }[] = [
    { id: 'code-workspace', label: 'Code Workspace & JSON Editor', icon: Code2, highlight: true },
    { id: 'orders', label: 'Live Orders & Notifications', icon: ShoppingBag, count: orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length },
    { id: 'homepage', label: 'Homepage Layout & Hero', icon: LayoutTemplate },
    { id: 'branding', label: 'Logo, Favicon & Brand Identity', icon: Globe },
    { id: 'details-block', label: 'Restaurant Details & Glow Title', icon: Building2 },
    { id: 'menu', label: 'Menu Management', icon: Utensils, count: menuItems.length },
    { id: 'categories', label: 'Custom Categories', icon: Layers, count: (config.customCategories || []).length },
    { id: 'deals', label: 'Meals & Deals (Combos)', icon: Package, count: deals.length },
    { id: 'nashta', label: 'Nashta Point (Breakfast & Chai)', icon: Sparkles, count: nashtaItems.length },
    { id: 'drinks', label: 'Soft Drinks & Packaging Sizes', icon: CupSoda, count: (softDrinks || []).length },
    { id: 'ice-cream', label: 'Ice Cream & Dessert Bar', icon: IceCream2, count: (dessertBarItems || []).length },
    { id: 'delivery', label: 'Delivery, Pickup & Hotlines', icon: Truck },
    { id: 'food-3d', label: '3D Food Showcase & Visual', icon: Sparkles },
    { id: 'recipes', label: 'Special Recipes', icon: BookOpen, count: specialRecipes.length },
    { id: 'offers', label: 'Seasonal Promo Offers', icon: Tag, count: offers.length },
    { id: 'gallery', label: 'Gallery Showcase', icon: ImageIcon, count: galleryItems.length },
    { id: 'payments', label: 'Payment & QR Settings', icon: QrCode },
    { id: 'notifications', label: 'Alerts & Kitchen Chimes', icon: Bell },
    { id: 'security', label: 'Owner Password & Security', icon: KeyRound },
    { id: 'ai-assistant', label: 'AI Assistant & Billa', icon: Bot },
    { id: 'info', label: 'Restaurant Info & Hours', icon: Building2 },
    { id: 'chefs', label: 'Chef Management', icon: Award, count: chefs.length },
    { id: 'events', label: 'Events & Tastings', icon: Calendar, count: events.length },
    { id: 'reviews', label: 'Reviews Moderation', icon: MessageSquare, count: reviews.length },
    { id: 'backup', label: 'Backup & Restore', icon: Database }
  ];

  const handleDownloadBackup = () => {
    const jsonString = exportDataJson();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ember_spice_cms_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup Exported', 'JSON data file downloaded successfully.', 'gold');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = importDataJson(importJsonText);
    if (success) {
      setShowImportModal(false);
      setImportJsonText('');
      showToast('Database Restored', 'All content successfully imported from JSON.', 'success');
    } else {
      showToast('Import Failed', 'Invalid JSON payload structure.', 'info');
    }
  };

  const handleResetData = () => {
    resetToDefaults();
    setResetConfirmOpen(false);
    showToast('Reset Complete', 'Website restored to default fine-dining catalog.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#0A0908] text-[#F5F2ED] flex flex-col selection:bg-[#C5A059] selection:text-black">
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-[100] max-w-sm w-full bg-[#181512] border border-[#C5A059]/60 rounded-2xl p-4 shadow-2xl flex items-start gap-3 backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-xl bg-[#C5A059]/20 text-[#E5C158] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{toast.title}</h4>
              {toast.message && <p className="text-xs text-[#D6CEBF]/90 mt-0.5 leading-relaxed">{toast.message}</p>}
            </div>
            <button onClick={() => setToast(null)} className="text-white/40 hover:text-white p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Owner Header */}
      <header className="sticky top-0 z-40 bg-[#0D0B0A]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Mode */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#E5C158]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-white text-sm tracking-wider uppercase">
                  {config.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#8C5E10]/40 text-[#E5C158] text-[9px] font-mono font-bold uppercase tracking-wider border border-[#C5A059]/30">
                  Owner CMS
                </span>
              </div>
              <p className="text-[11px] text-[#D6CEBF]/70 hidden sm:block">
                Protected Content Management System • Live Website Sync
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Code Workspace Quick Toggle Button */}
            <button
              onClick={() => handleTabChange('code-workspace')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'code-workspace'
                  ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30'
                  : 'bg-white/10 hover:bg-white/15 text-[#e5c158] border border-[#d4af37]/40'
              }`}
              title="Open Live Code & JSON Workspace"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Code Workspace</span>
            </button>

            {/* Publish Changes Button */}
            <button
              onClick={() => {
                publishAllChanges();
                showToast('Changes Published Live', 'All menu items, 3D visual, and restaurant details are live on the customer website!', 'gold');
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
              title="Publish all drafted changes to live website"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {publishStatus === 'published' ? 'Published Live' : 'Publish Changes'}
              </span>
            </button>

            {/* View Live Website Button */}
            <button
              onClick={() => toggleOwnerMode(false)}
              className="btn-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#C5A059]/20"
              title="Return to public customer view"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Live Website</span>
              <span className="sm:hidden">Live Site</span>
            </button>

            {/* User session & logout */}
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/10 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#D6CEBF] font-mono text-[11px] truncate max-w-[140px]">
                {ownerSession?.username || 'Executive Owner'}
              </span>
            </div>

            <button
              onClick={ownerLogout}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/40 hover:text-rose-400 text-[#D6CEBF] transition-colors"
              title="Log out of Owner Panel"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 text-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav */}
        <aside className={`lg:w-64 shrink-0 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-[#120F0D] border border-white/10 rounded-2xl p-3 sticky top-24 space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold text-[#C5A059] tracking-widest">
              Content Sections
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C5A059] text-[#0D0D0D] font-bold shadow-md shadow-[#C5A059]/20'
                      : item.highlight
                      ? 'bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#e5c158] hover:bg-[#d4af37]/25 font-bold'
                      : 'text-[#D6CEBF] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0D0D0D]' : item.highlight ? 'text-[#e5c158]' : 'text-[#C5A059]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#d4af37] text-black font-bold uppercase tracking-wider">
                      Live Code
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/5 text-white/60'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Helper Box */}
            <div className="mt-4 p-3 rounded-xl bg-[#181412] border border-[#C5A059]/20 text-[11px] text-[#D6CEBF] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#E5C158]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Design Protected
              </div>
              <p className="text-[10px] leading-relaxed text-[#D6CEBF]/70">
                You have full control over dishes, prices, photos, and texts while preserving the bespoke luxury layout.
              </p>
            </div>
          </div>
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 min-w-0">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-[#14110F] border border-white/5 rounded-xl p-3.5">
              <div className="text-[10px] uppercase font-bold text-[#D6CEBF]/60 tracking-wider">Live Dishes</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {menuItems.filter(m => m.isAvailable !== false).length}
                <span className="text-xs font-normal text-white/40 ml-1">/ {menuItems.length}</span>
              </div>
            </div>

            <div className="bg-[#14110F] border border-white/5 rounded-xl p-3.5">
              <div className="text-[10px] uppercase font-bold text-[#D6CEBF]/60 tracking-wider">Specials & Deals</div>
              <div className="text-xl font-bold font-mono text-[#E5C158] mt-0.5">
                {specialRecipes.filter(r => r.isPublished).length + offers.filter(o => o.isActive).length}
              </div>
            </div>

            <div className="bg-[#14110F] border border-white/5 rounded-xl p-3.5">
              <div className="text-[10px] uppercase font-bold text-[#D6CEBF]/60 tracking-wider">Gallery Photos</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {galleryItems.length}
              </div>
            </div>

            <div className="bg-[#14110F] border border-white/5 rounded-xl p-3.5">
              <div className="text-[10px] uppercase font-bold text-[#D6CEBF]/60 tracking-wider">Patron Reviews</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {reviews.filter(r => r.isApproved).length}
              </div>
            </div>
          </div>

          {/* Active Section View */}
          {activeTab === 'code-workspace' && (
            <CodeWorkspaceManager
              onShowToast={showToast}
              onNavigateTab={(tab) => handleTabChange(tab as DashboardTab)}
            />
          )}
          {activeTab === 'orders' && <OrdersManager onShowToast={showToast} />}
          {activeTab === 'homepage' && <HomepageManager onShowToast={showToast} />}
          {activeTab === 'branding' && <BrandingManager onShowToast={showToast} />}
          {activeTab === 'details-block' && <RestaurantDetailsBlockManager onShowToast={showToast} />}
          {activeTab === 'menu' && <MenuManager onShowToast={showToast} />}
          {activeTab === 'categories' && <CategoriesManager onShowToast={showToast} />}
          {activeTab === 'deals' && <DealsManager onShowToast={showToast} />}
          {activeTab === 'nashta' && <NashtaPointManager onShowToast={showToast} />}
          {activeTab === 'drinks' && <SoftDrinksManager onShowToast={showToast} />}
          {activeTab === 'ice-cream' && <IceCreamManager onShowToast={showToast} />}
          {activeTab === 'delivery' && <DeliveryPickupManager onShowToast={showToast} />}
          {activeTab === 'food-3d' && <Food3DManager onShowToast={showToast} />}
          {activeTab === 'recipes' && <RecipeManager onShowToast={showToast} />}
          {activeTab === 'offers' && <OffersManager onShowToast={showToast} />}
          {activeTab === 'gallery' && <GalleryManager onShowToast={showToast} />}
          {activeTab === 'payments' && <PaymentSettingsManager onShowToast={showToast} />}
          {activeTab === 'notifications' && <NotificationManager onShowToast={showToast} />}
          {activeTab === 'security' && <SecurityManager onShowToast={showToast} />}
          {activeTab === 'ai-assistant' && <AiAssistantManager onShowToast={showToast} />}
          {activeTab === 'info' && <RestaurantInfoManager onShowToast={showToast} />}
          {activeTab === 'chefs' && <ChefManager onShowToast={showToast} />}
          {activeTab === 'events' && <EventsManager onShowToast={showToast} />}
          {activeTab === 'reviews' && <ReviewsManager onShowToast={showToast} />}

          {/* Backup & Restore Section */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="bg-[#14110F] p-5 rounded-2xl border border-white/5">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#C5A059]" />
                  Backup, Restore & Reset Database
                </h2>
                <p className="text-xs text-[#D6CEBF] mt-1">
                  Export complete website records (menu, recipes, offers, gallery, events, chefs) as JSON or restore from file.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Export Card */}
                <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 text-[#E5C158] flex items-center justify-center mb-3">
                      <Download className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-white text-base">Export Backup JSON</h3>
                    <p className="text-xs text-[#D6CEBF]/80 mt-1 leading-relaxed">
                      Download all dishes, recipes, offers, images, and settings into a standalone JSON file.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadBackup}
                    className="mt-5 btn-gold py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download JSON Backup
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-white text-base">Restore from JSON</h3>
                    <p className="text-xs text-[#D6CEBF]/80 mt-1 leading-relaxed">
                      Paste or load an existing JSON backup to restore menu, gallery, or pricing instantly.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="mt-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10"
                  >
                    <Upload className="w-4 h-4 text-blue-400" />
                    Restore JSON Data
                  </button>
                </div>

                {/* Reset Card */}
                <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-white text-base">Reset to Default Catalog</h3>
                    <p className="text-xs text-[#D6CEBF]/80 mt-1 leading-relaxed">
                      Revert all menu items, photography, and information to the original curated fine dining demo dataset.
                    </p>
                  </div>
                  <button
                    onClick={() => setResetConfirmOpen(true)}
                    className="mt-5 py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-rose-500/30"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImportModal(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-[#14110F] border border-[#C5A059]/40 rounded-2xl p-6 shadow-2xl text-[#F5F2ED]"
            >
              <button
                onClick={() => setShowImportModal(false)}
                className="absolute top-5 right-5 text-white/50 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-white mb-1">Import JSON Backup</h3>
              <p className="text-xs text-[#D6CEBF] mb-4">
                Paste raw JSON backup text to restore restaurant configurations.
              </p>

              <form onSubmit={handleImportSubmit} className="space-y-4">
                <textarea
                  rows={8}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  required
                  placeholder='{"config": {...}, "menuItems": [...]}'
                  className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl p-3 text-xs text-white font-mono outline-none"
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Apply Import
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {resetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setResetConfirmOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#14110F] border border-rose-500/40 rounded-2xl p-6 shadow-2xl text-[#F5F2ED]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Reset All Data?</h3>
                  <p className="text-xs text-[#D6CEBF]">
                    This will discard custom modifications and restore original default dishes, photos, and prices.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
