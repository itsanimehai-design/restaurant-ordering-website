import React, { useState, useEffect } from 'react';
import { PageId, MenuItem, GalleryItem, ToastNotification } from './types';
import { RestaurantDataProvider, useRestaurantData } from './context/RestaurantDataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DishModal } from './components/DishModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { Lightbox } from './components/Lightbox';
import { Toast } from './components/Toast';
import { OnlineOrderModal } from './components/OnlineOrderModal';
import { AiAssistantProvider } from './context/AiAssistantContext';
import { AiAssistantModal } from './components/AiAssistantModal';
import { BudgetFilterModal } from './components/BudgetFilterModal';
import { FloatingCartBar } from './components/FloatingCartBar';
import { ScrollSteamTrail } from './components/ScrollSteamTrail';
import { scrollToTop } from './utils/smoothScroll';

// Admin / Owner Management Components
import { OwnerDashboard } from './components/admin/OwnerDashboard';
import { OwnerCommandBar } from './components/admin/OwnerCommandBar';
import { OwnerLoginModal } from './components/admin/OwnerLoginModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { ContactPage } from './pages/ContactPage';
import { EventsPage } from './pages/EventsPage';
import { OffersPage } from './pages/OffersPage';
import { ChefsPage } from './pages/ChefsPage';

import { ArrowUp, CalendarCheck, Phone, Bike } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MainAppContent: React.FC = () => {
  const { 
    menuItems, 
    cartItems,
    config, 
    authSession, 
    isOwnerModeActive, 
    setIsOwnerModeActive,
    isLoginModalOpen,
    setIsLoginModalOpen,
    openOrderModal
  } = useRestaurantData();

  const [activePage, setActivePage] = useState<PageId>('home');
  const [pageHistory, setPageHistory] = useState<PageId[]>([]);
  const [activeMenuTab, setActiveMenuTab] = useState<'standard' | 'dessert-bar' | 'soft-drinks' | 'recipes' | 'food' | 'meals' | 'deals'>('standard');
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<GalleryItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Back to Top Button
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut for Owner Login (Alt+O or Ctrl+Shift+O)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'o') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'o')) {
        e.preventDefault();
        setIsLoginModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsLoginModalOpen]);

  const addToast = (
    title: string,
    message?: string,
    type: 'success' | 'gold' | 'info' = 'gold'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleWishlist = (dishId: string) => {
    const dish = menuItems.find((d) => d.id === dishId);
    if (!dish) return;

    if (wishlistIds.includes(dishId)) {
      setWishlistIds((prev) => prev.filter((id) => id !== dishId));
      addToast('Removed from Wishlist', `${dish.name} removed from your selection.`, 'info');
    } else {
      setWishlistIds((prev) => [...prev, dishId]);
      addToast('Saved to Dining Wishlist', `${dish.name} attached for your table booking.`, 'gold');
    }
  };

  const handleRemoveWishlistItem = (dishId: string) => {
    const dish = menuItems.find((d) => d.id === dishId);
    setWishlistIds((prev) => prev.filter((id) => id !== dishId));
    if (dish) {
      addToast('Dish Removed', `${dish.name} removed.`, 'info');
    }
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
    addToast('Wishlist Cleared', 'All selected dishes have been cleared.', 'info');
  };

  const handleOpenLightbox = (items: GalleryItem[], index: number) => {
    setLightboxItems(items);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const wishlistDishes = menuItems.filter((dish) => wishlistIds.includes(dish.id));

  const handleNavigate = (page: PageId, tab?: string) => {
    if (page !== activePage) {
      setPageHistory((prev) => [...prev, activePage]);
    }
    setActivePage(page);
    if (tab) {
      setActiveMenuTab(tab as any);
    }
    scrollToTop(450);
  };

  const handleBack = () => {
    if (pageHistory.length > 0) {
      const prev = pageHistory[pageHistory.length - 1];
      setPageHistory((history) => history.slice(0, -1));
      setActivePage(prev);
    } else {
      setActivePage('home');
    }
    scrollToTop(450);
  };

  // If owner is logged in and owner mode is active, render Owner Dashboard
  if (authSession.isAuthenticated && isOwnerModeActive) {
    return (
      <div className="min-h-screen bg-[#0A0908] text-[#F5F2ED]">
        <Toast toasts={toasts} onDismiss={dismissToast} />
        <OwnerDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0b0a] text-[#f5efe6] flex flex-col relative selection:bg-[#c59b27]/30 selection:text-[#fbf7ee] transition-colors duration-300">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Sticky Owner Command Bar (Visible only when logged in as Owner) */}
      {authSession.isAuthenticated && (
        <OwnerCommandBar />
      )}

      {/* Atmospheric Scroll-Triggered Smoke & Steam Trail Overlay */}
      <ScrollSteamTrail />

      {/* Global Navigation Bar */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistDrawerOpen(true)}
      />

      {/* Main Page Dynamic Routing with Smooth Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {activePage === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                onOpenDishModal={setSelectedDish}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
              />
            )}
            {activePage === 'menu' && (
              <MenuPage
                onNavigate={handleNavigate}
                onBack={handleBack}
                onOpenDishModal={setSelectedDish}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlistIds}
                onShowToast={addToast}
                initialTab={activeMenuTab}
              />
            )}
            {activePage === 'about' && (
              <AboutPage onNavigate={handleNavigate} onBack={handleBack} />
            )}
            {activePage === 'chefs' && (
              <ChefsPage onNavigate={handleNavigate} onBack={handleBack} onShowToast={addToast} />
            )}
            {activePage === 'offers' && (
              <OffersPage onNavigate={handleNavigate} onBack={handleBack} onShowToast={addToast} />
            )}
            {activePage === 'events' && (
              <EventsPage onNavigate={handleNavigate} onBack={handleBack} onShowToast={addToast} />
            )}
            {activePage === 'gallery' && (
              <GalleryPage
                onNavigate={handleNavigate}
                onBack={handleBack}
                onOpenLightbox={handleOpenLightbox}
              />
            )}
            {activePage === 'reviews' && (
              <ReviewsPage onNavigate={handleNavigate} onBack={handleBack} onShowToast={addToast} />
            )}
            {activePage === 'reservations' && (
              <ReservationsPage
                onNavigate={handleNavigate}
                onBack={handleBack}
                wishlistItems={wishlistDishes}
                onShowToast={addToast}
              />
            )}
            {activePage === 'contact' && (
              <ContactPage onNavigate={handleNavigate} onBack={handleBack} onShowToast={addToast} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer 
        onNavigate={handleNavigate} 
        onShowToast={addToast} 
        onOpenOwnerLogin={() => setIsLoginModalOpen(true)} 
      />

      {/* Online Order & Cancellation Modal */}
      <OnlineOrderModal />

      {/* Owner Login Modal */}
      <OwnerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsOwnerModeActive(true);
          addToast('Owner Authenticated', 'Welcome back to the executive management dashboard.', 'gold');
        }}
      />

      {/* Dish Quick Detail Modal */}
      <DishModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        isWishlisted={selectedDish ? wishlistIds.includes(selectedDish.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onNavigate={handleNavigate}
      />

      {/* Reservation Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistDrawerOpen}
        onClose={() => setIsWishlistDrawerOpen(false)}
        wishlistItems={wishlistDishes}
        onRemoveItem={handleRemoveWishlistItem}
        onClearWishlist={handleClearWishlist}
        onProceedToReservation={() => {
          setIsWishlistDrawerOpen(false);
          handleNavigate('reservations');
        }}
        onNavigate={handleNavigate}
      />

      {/* Fullscreen Photo Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />

      {/* AI Assistant Context Modal */}
      <AiAssistantModal />

      {/* Budget Filter Modal */}
      <BudgetFilterModal onOpenOrderModal={(type) => openOrderModal(type || 'delivery')} />

      {/* Persistent Floating Cart Bar with Direct Checkout Redirection */}
      <FloatingCartBar onShowToast={addToast} />

      {/* Floating Back to Top Button with GPU Isolation */}
      {showBackToTop && (
        <button
          onClick={() => scrollToTop(400)}
          className={`fixed ${cartItems.length > 0 ? 'bottom-20 lg:bottom-6' : 'bottom-16 lg:bottom-6'} left-4 sm:left-6 z-30 p-2.5 sm:p-3 rounded-full bg-[#171412]/90 border border-[#d4af37]/40 text-[#d4af37] shadow-2xl hover:bg-[#d4af37] hover:text-[#0d0b0a] transition-all duration-300 focus:outline-none cursor-pointer`}
          style={{
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Floating Quick Navigation Trigger on Mobile with Repaint Prevention (when cart is empty) */}
      {cartItems.length === 0 && !isOwnerModeActive && (
        <div 
          className="floating-bottom-dock lg:hidden p-2 sm:p-2.5 bg-[#0d0b0a]/95 border-t border-[#26201a] backdrop-blur-md flex items-center gap-2"
          style={{
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            contain: 'layout paint'
          }}
        >
          <button
            onClick={() => openOrderModal('delivery')}
            className="flex-1 py-2.5 rounded-xl bg-[#291b11] border border-[#d4af37] text-[#d4af37] text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-transform"
          >
            <Bike className="w-4 h-4" />
            <span>Order Online</span>
          </button>
          <button
            onClick={() => handleNavigate('reservations')}
            className="flex-1 btn-gold py-2.5 rounded-xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-transform"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Table</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <RestaurantDataProvider>
        <AiAssistantProvider>
          <MainAppContent />
        </AiAssistantProvider>
      </RestaurantDataProvider>
    </ThemeProvider>
  );
}
