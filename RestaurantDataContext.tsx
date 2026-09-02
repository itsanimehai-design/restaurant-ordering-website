import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  MenuItem, 
  SpecialRecipeItem, 
  OfferItem, 
  EventItem, 
  ChefMember, 
  ReviewItem, 
  GalleryItem, 
  RestaurantConfig,
  OwnerAuthSession,
  DessertBarItem,
  CustomerOrder,
  OrderItemEntry,
  OrderStatus,
  DealItem,
  Food3DConfig,
  CustomCategoryItem,
  RestaurantStoryDetails,
  RestaurantDetailsBlockConfig,
  CustomRestaurantDetailItem,
  NashtaPointItem,
  NashtaPointConfig,
  SoftDrinkItem,
  DrinkSizeOption
} from '../types';
import { 
  INITIAL_RESTAURANT_CONFIG,
  INITIAL_MENU_ITEMS,
  INITIAL_DEALS,
  INITIAL_SPECIAL_RECIPES,
  INITIAL_OFFERS,
  INITIAL_CHEFS,
  INITIAL_EVENTS,
  INITIAL_GALLERY_ITEMS,
  INITIAL_REVIEWS,
  INITIAL_DESSERT_BAR_ITEMS,
  INITIAL_NASHTA_CONFIG,
  INITIAL_NASHTA_ITEMS,
  INITIAL_SOFT_DRINKS
} from '../data/initialData';
import { 
  sendOrderPushNotification, 
  broadcastNewOrder, 
  subscribeToOrderBroadcasts,
  playOrderAlertChime 
} from '../utils/notificationService';

interface RestaurantDataContextType {
  // Config & Info
  config: RestaurantConfig;
  updateConfig: (newConfig: Partial<RestaurantConfig>) => void;
  formatPrice: (amount: number) => string;

  // Nashta Point (Breakfast, Chai & Lassi)
  nashtaConfig: NashtaPointConfig;
  nashtaItems: NashtaPointItem[];
  updateNashtaConfig: (updates: Partial<NashtaPointConfig>) => void;
  addNashtaItem: (item: Omit<NashtaPointItem, 'id'>) => NashtaPointItem;
  updateNashtaItem: (id: string, updates: Partial<NashtaPointItem>) => void;
  deleteNashtaItem: (id: string) => void;
  duplicateNashtaItem: (id: string) => NashtaPointItem | null;
  toggleNashtaAvailability: (id: string) => void;
  toggleNashtaFeatured: (id: string) => void;
  reorderNashtaItems: (startIndex: number, endIndex: number) => void;

  // Restaurant Details Block
  updateDetailsBlock: (updates: Partial<RestaurantDetailsBlockConfig>) => void;
  addCustomDetail: (detail: Omit<CustomRestaurantDetailItem, 'id'>) => CustomRestaurantDetailItem;
  updateCustomDetail: (id: string, updates: Partial<CustomRestaurantDetailItem>) => void;
  deleteCustomDetail: (id: string) => void;
  reorderCustomDetails: (startIndex: number, endIndex: number) => void;

  // 3D Food Visual & Featured Food Configuration
  food3dConfig: Food3DConfig;
  updateFood3DConfig: (updates: Partial<Food3DConfig>) => void;
  updateStoryDetails: (updates: Partial<RestaurantStoryDetails>) => void;

  // Custom Categories
  categories: CustomCategoryItem[];
  addCategory: (category: Omit<CustomCategoryItem, 'id'>) => CustomCategoryItem;
  updateCategory: (id: string, updates: Partial<CustomCategoryItem>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (startIndex: number, endIndex: number) => void;

  // Dessert Bar & Ice Cream Items
  dessertBarItems: DessertBarItem[];
  addDessertItem: (item: Omit<DessertBarItem, 'id'>) => DessertBarItem;
  updateDessertItem: (id: string, updates: Partial<DessertBarItem>) => void;
  deleteDessertItem: (id: string) => void;
  duplicateDessertItem: (item: DessertBarItem) => void;
  toggleDessertAvailability: (id: string) => void;

  // Soft Drinks & Beverage Packaging Options (100% Halal)
  softDrinks: SoftDrinkItem[];
  addSoftDrink: (drink: Omit<SoftDrinkItem, 'id'>) => SoftDrinkItem;
  updateSoftDrink: (id: string, updates: Partial<SoftDrinkItem>) => void;
  deleteSoftDrink: (id: string) => void;
  toggleSoftDrinkAvailability: (id: string) => void;
  updateDrinkSize: (drinkId: string, sizeIndex: number, updates: Partial<DrinkSizeOption>) => void;
  addDrinkSize: (drinkId: string, sizeOption: DrinkSizeOption) => void;
  deleteDrinkSize: (drinkId: string, sizeIndex: number) => void;

  // Meals & Deals
  deals: DealItem[];
  meals: DealItem[]; // Alias for Deals
  addDeal: (deal: Omit<DealItem, 'id'>) => DealItem;
  updateDeal: (id: string, updates: Partial<DealItem>) => void;
  deleteDeal: (id: string) => void;
  duplicateDeal: (id: string) => DealItem | null;
  toggleDealAvailability: (id: string) => void;
  toggleDealFeatured: (id: string) => void;
  reorderDeals: (startIndex: number, endIndex: number) => void;

  // Menu Items (Unlimited + Duplicate + Archive + Reorder)
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => MenuItem;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  duplicateMenuItem: (id: string) => MenuItem | null;
  archiveMenuItem: (id: string) => void;
  unarchiveMenuItem: (id: string) => void;
  reorderMenuItems: (startIndex: number, endIndex: number) => void;
  toggleDishAvailability: (id: string) => void;
  toggleDishChefSpecial: (id: string) => void;
  toggleDishNew: (id: string) => void;

  // Live Preview & Publishing System
  isLivePreviewMode: boolean;
  setIsLivePreviewMode: (preview: boolean) => void;
  publishStatus: 'draft' | 'published';
  publishAllChanges: () => void;

  // Special Recipes
  specialRecipes: SpecialRecipeItem[];
  addSpecialRecipe: (recipe: Omit<SpecialRecipeItem, 'id'>) => SpecialRecipeItem;
  updateSpecialRecipe: (id: string, updates: Partial<SpecialRecipeItem>) => void;
  deleteSpecialRecipe: (id: string) => void;
  toggleRecipePublish: (id: string) => void;

  // Offers & Deals
  offers: OfferItem[];
  addOffer: (offer: Omit<OfferItem, 'id'>) => OfferItem;
  updateOffer: (id: string, updates: Partial<OfferItem>) => void;
  deleteOffer: (id: string) => void;
  toggleOfferActive: (id: string) => void;

  // Gallery
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => GalleryItem;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  reorderGalleryItem: (id: string, direction: 'up' | 'down') => void;

  // Chefs
  chefs: ChefMember[];
  addChef: (chef: Omit<ChefMember, 'id'>) => ChefMember;
  updateChef: (id: string, updates: Partial<ChefMember>) => void;
  deleteChef: (id: string) => void;

  // Events
  events: EventItem[];
  addEvent: (event: Omit<EventItem, 'id'>) => EventItem;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  toggleEventPublish: (id: string) => void;

  // Reviews
  reviews: ReviewItem[];
  addReview: (review: Omit<ReviewItem, 'id'>) => ReviewItem;
  updateReview: (id: string, updates: Partial<ReviewItem>) => void;
  deleteReview: (id: string) => void;
  toggleReviewApproval: (id: string) => void;

  // Owner Auth & Mode Management
  authSession: OwnerAuthSession;
  loginOwner: (username: string, password: string) => { success: boolean; error?: string };
  logoutOwner: () => void;
  changeOwnerPassword: (currentPass: string, newPass: string) => { success: boolean; error?: string };
  resetOwnerPassword: () => void;
  isOwnerModeActive: boolean;
  setIsOwnerModeActive: (active: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  ownerActiveTab: string;
  setOwnerActiveTab: (tab: string) => void;
  openOwnerPortal: (targetTab?: string) => void;

  // Customer Online Ordering & Cancellation System
  orders: CustomerOrder[];
  activeOrder: CustomerOrder | null;
  placeOrder: (order: Omit<CustomerOrder, 'id' | 'createdAt' | 'status' | 'cancellationWindowSeconds'>) => CustomerOrder;
  cancelOrder: (orderId: string) => { success: boolean; message: string };
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  initialOrderType: 'delivery' | 'pickup';
  setInitialOrderType: (type: 'delivery' | 'pickup') => void;
  initialOrderStep: 'cart' | 'checkout';
  setInitialOrderStep: (step: 'cart' | 'checkout') => void;
  openOrderModal: (type?: 'delivery' | 'pickup', preselectItem?: OrderItemEntry, step?: 'cart' | 'checkout') => void;

  // Cart Management
  cartItems: OrderItemEntry[];
  lastAddedItem: OrderItemEntry | null;
  lastAddedTimestamp: number;
  addToCart: (item: { id: string; name: string; price: number; category?: string; image?: string; servingSize?: string }, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQty: (itemId: string, delta: number) => void;
  clearCart: () => void;

  // Convenient Aliases for clean UI consumption
  ownerSession: OwnerAuthSession | null;
  ownerLogin: (username: string, password: string) => { success: boolean; error?: string };
  ownerLogout: () => void;
  isOwnerMode: boolean;
  toggleOwnerMode: (active: boolean) => void;

  // System Utilities
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => { success: boolean; error?: string };
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
}

const STORAGE_KEY = 'ember_spice_live_store_v2';
const AUTH_STORAGE_KEY = 'ember_spice_owner_session_v2';

const RestaurantDataContext = createContext<RestaurantDataContextType | undefined>(undefined);

export const RestaurantDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial defaults
  const [config, setConfig] = useState<RestaurantConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_config`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'EMBER & SPICE' || !parsed.name) {
          parsed.name = 'SITE FOR SALE';
        }
        if (parsed.legalName && parsed.legalName.includes('Ember & Spice')) {
          parsed.legalName = 'Site For Sale Restaurant Demo';
        }
        if (parsed.aboutText && parsed.aboutText.includes('EMBER & SPICE')) {
          parsed.aboutText = INITIAL_RESTAURANT_CONFIG.aboutText;
        }
        if (parsed.qrPayment && parsed.qrPayment.accountName && parsed.qrPayment.accountName.includes('Ember & Spice')) {
          parsed.qrPayment.accountName = 'Official Merchant Account (Raast / Wallet)';
        }
        if (parsed.aiAssistant) {
          parsed.aiAssistant.assistantName = 'Ask AI';
          parsed.aiAssistant.greeting = 'Aap ka shukria hamare restaurant mein aane ke liye. Main aapko restaurant ke menu, prices, orders aur services ke bare mein madad kar sakta hoon.';
        }
        if (parsed.contact) {
          if (!parsed.contact.city || !parsed.contact.city.includes('Ilahiabad') || parsed.contact.city === '[City, Pakistan]') {
            parsed.contact.city = 'Ilahiabad, Pakistan';
          }
          if (!parsed.contact.address || !parsed.contact.address.includes('Ilahiabad') || parsed.contact.address === '[Restaurant Address]') {
            parsed.contact.address = 'Ilahiabad, Pakistan';
          }
        }
        if (!parsed.qrPayment && INITIAL_RESTAURANT_CONFIG.qrPayment) {
          parsed.qrPayment = INITIAL_RESTAURANT_CONFIG.qrPayment;
        }
        return parsed;
      }
      return INITIAL_RESTAURANT_CONFIG;
    } catch {
      return INITIAL_RESTAURANT_CONFIG;
    }
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_menu`);
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  const [deals, setDeals] = useState<DealItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_deals`);
      return saved ? JSON.parse(saved) : INITIAL_DEALS;
    } catch {
      return INITIAL_DEALS;
    }
  });

  const [specialRecipes, setSpecialRecipes] = useState<SpecialRecipeItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_recipes`);
      return saved ? JSON.parse(saved) : INITIAL_SPECIAL_RECIPES;
    } catch {
      return INITIAL_SPECIAL_RECIPES;
    }
  });

  const [offers, setOffers] = useState<OfferItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_offers`);
      return saved ? JSON.parse(saved) : INITIAL_OFFERS;
    } catch {
      return INITIAL_OFFERS;
    }
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_gallery`);
      return saved ? JSON.parse(saved) : INITIAL_GALLERY_ITEMS;
    } catch {
      return INITIAL_GALLERY_ITEMS;
    }
  });

  const [dessertBarItems, setDessertBarItems] = useState<DessertBarItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_dessert_bar`);
      return saved ? JSON.parse(saved) : INITIAL_DESSERT_BAR_ITEMS;
    } catch {
      return INITIAL_DESSERT_BAR_ITEMS;
    }
  });

  const [softDrinks, setSoftDrinks] = useState<SoftDrinkItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_soft_drinks`);
      return saved ? JSON.parse(saved) : INITIAL_SOFT_DRINKS;
    } catch {
      return INITIAL_SOFT_DRINKS;
    }
  });

  const [chefs, setChefs] = useState<ChefMember[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_chefs`);
      return saved ? JSON.parse(saved) : INITIAL_CHEFS;
    } catch {
      return INITIAL_CHEFS;
    }
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reviews`);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Nashta Point State (Breakfast, Chai & Lassi)
  const [nashtaConfig, setNashtaConfig] = useState<NashtaPointConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_nashta_config`);
      return saved ? JSON.parse(saved) : INITIAL_NASHTA_CONFIG;
    } catch {
      return INITIAL_NASHTA_CONFIG;
    }
  });

  const [nashtaItems, setNashtaItems] = useState<NashtaPointItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_nashta_items`);
      return saved ? JSON.parse(saved) : INITIAL_NASHTA_ITEMS;
    } catch {
      return INITIAL_NASHTA_ITEMS;
    }
  });

  // Sync Nashta Point to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_nashta_config`, JSON.stringify(nashtaConfig));
    } catch (e) {
      console.warn('Failed saving nashta config to localStorage', e);
    }
  }, [nashtaConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_nashta_items`, JSON.stringify(nashtaItems));
    } catch (e) {
      console.warn('Failed saving nashta items to localStorage', e);
    }
  }, [nashtaItems]);

  // Online Orders & Cart State
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartItems, setCartItems] = useState<OrderItemEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cart`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [initialOrderType, setInitialOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [initialOrderStep, setInitialOrderStep] = useState<'cart' | 'checkout'>('cart');
  const [lastAddedItem, setLastAddedItem] = useState<OrderItemEntry | null>(null);
  const [lastAddedTimestamp, setLastAddedTimestamp] = useState<number>(0);

  // Sync orders and cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed saving orders to localStorage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_cart`, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed saving cart to localStorage', e);
    }
  }, [cartItems]);

  // Simulated live progression for active orders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setOrders((prevOrders) =>
        prevOrders.map((ord) => {
          if (ord.status === 'cancelled' || ord.status === 'completed') return ord;
          const elapsedSec = (now - ord.createdAt) / 1000;
          if (elapsedSec > 400 && ord.status !== 'completed') {
            return { ...ord, status: 'completed' };
          }
          if (elapsedSec > 260 && ord.status === 'preparing') {
            return { ...ord, status: 'ready_or_out_for_delivery' };
          }
          if (elapsedSec > 130 && ord.status === 'confirming') {
            return { ...ord, status: 'preparing' };
          }
          if (elapsedSec > 35 && ord.status === 'placed') {
            return { ...ord, status: 'confirming' };
          }
          return ord;
        })
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Real-time inter-tab order alert subscription
  useEffect(() => {
    const unsubscribe = subscribeToOrderBroadcasts((incomingOrder) => {
      sendOrderPushNotification(
        incomingOrder.id,
        incomingOrder.customerName,
        incomingOrder.totalPrice,
        incomingOrder.orderType
      );
    });
    return unsubscribe;
  }, []);

  // Most recent active order
  const activeOrder = orders.length > 0 ? orders[0] : null;

  const placeOrder = (
    orderData: Omit<CustomerOrder, 'id' | 'createdAt' | 'status' | 'cancellationWindowSeconds'>
  ): CustomerOrder => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: CustomerOrder = {
      ...orderData,
      id: orderId,
      createdAt: Date.now(),
      cancellationWindowSeconds: 180, // 3-minute cancellation window
      status: 'placed',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send instant system push notification & play audio alert chime
    sendOrderPushNotification(
      newOrder.id,
      newOrder.customerName,
      newOrder.totalPrice,
      newOrder.orderType
    );

    // Broadcast to other open tabs (e.g. Owner Dashboard in background window)
    broadcastNewOrder({
      id: newOrder.id,
      customerName: newOrder.customerName,
      totalPrice: newOrder.totalPrice,
      orderType: newOrder.orderType
    });

    return newOrder;
  };

  const cancelOrder = (orderId: string): { success: boolean; message: string } => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Order not found.' };
    }

    const elapsed = Math.floor((Date.now() - order.createdAt) / 1000);
    const maxAllowed = order.cancellationWindowSeconds || 180;

    if (elapsed > maxAllowed) {
      return { 
        success: false, 
        message: 'Cancellation period has ended. Please contact the restaurant for assistance.' 
      };
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled', cancelledAt: Date.now() } : o))
    );

    return { 
      success: true, 
      message: 'Your order has been cancelled successfully.' 
    };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const openOrderModal = (type: 'delivery' | 'pickup' = 'delivery', preselectItem?: OrderItemEntry, step?: 'cart' | 'checkout') => {
    setInitialOrderType(type);
    if (step) {
      setInitialOrderStep(step);
    } else {
      setInitialOrderStep(cartItems.length > 0 ? 'checkout' : 'cart');
    }
    if (preselectItem) {
      addToCart(preselectItem, 1);
    }
    setIsOrderModalOpen(true);
  };

  // Cart operations
  const addToCart = (
    item: { id: string; name: string; price: number; category?: string; image?: string; servingSize?: string },
    qty = 1
  ) => {
    const formattedItem: OrderItemEntry = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: qty,
      category: item.category,
      image: item.image,
      servingSize: item.servingSize,
    };
    
    setLastAddedItem(formattedItem);
    setLastAddedTimestamp(Date.now());

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, formattedItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateCartQty = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((i) => {
          if (i.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItemEntry[];
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Owner Auth State & Dynamic Password Management
  const [ownerPassword, setOwnerPassword] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_owner_password`);
      if (saved && saved.trim()) {
        return saved.trim();
      }
    } catch {
      // fallback
    }
    return '12345';
  });

  const [authSession, setAuthSession] = useState<OwnerAuthSession>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      isAuthenticated: false,
      username: '',
      loginTime: '',
      role: 'owner'
    };
  });

  const [isOwnerModeActive, setIsOwnerModeActive] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [ownerActiveTab, setOwnerActiveTab] = useState<string>('code-workspace');
  const [pendingOwnerTab, setPendingOwnerTab] = useState<string>('code-workspace');

  const openOwnerPortal = (targetTab: string = 'code-workspace') => {
    setOwnerActiveTab(targetTab);
    setPendingOwnerTab(targetTab);
    if (authSession.isAuthenticated) {
      setIsOwnerModeActive(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Dynamic Favicon synchronization with document head
  useEffect(() => {
    if (config.branding?.faviconImage) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = config.branding.faviconImage;
    }
  }, [config.branding?.faviconImage]);

  // Auto-sync state to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_config`, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save config to localStorage', e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_menu`, JSON.stringify(menuItems));
    } catch (e) {
      console.warn('Failed to save menu to localStorage', e);
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_deals`, JSON.stringify(deals));
    } catch (e) {
      console.warn('Failed to save deals to localStorage', e);
    }
  }, [deals]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_recipes`, JSON.stringify(specialRecipes));
    } catch (e) {
      console.warn('Failed to save recipes to localStorage', e);
    }
  }, [specialRecipes]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_offers`, JSON.stringify(offers));
    } catch (e) {
      console.warn('Failed to save offers to localStorage', e);
    }
  }, [offers]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_gallery`, JSON.stringify(galleryItems));
    } catch (e) {
      console.warn('Failed to save gallery to localStorage', e);
    }
  }, [galleryItems]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_dessert_bar`, JSON.stringify(dessertBarItems));
    } catch (e) {
      console.warn('Failed to save dessert_bar to localStorage', e);
    }
  }, [dessertBarItems]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_soft_drinks`, JSON.stringify(softDrinks));
    } catch (e) {
      console.warn('Failed to save soft_drinks to localStorage', e);
    }
  }, [softDrinks]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_chefs`, JSON.stringify(chefs));
    } catch (e) {
      console.warn('Failed to save chefs to localStorage', e);
    }
  }, [chefs]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
    } catch (e) {
      console.warn('Failed to save events to localStorage', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_reviews`, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to save reviews to localStorage', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authSession));
    } catch (e) {
      console.warn('Failed to save authSession', e);
    }
  }, [authSession]);

  // Price formatting helper based on chosen restaurant currency
  const formatPrice = (amount: number): string => {
    const symbol = config.currencySymbol || '₨';
    const code = config.currencyCode || 'PKR';

    if (code === 'PKR' || symbol === '₨' || symbol === 'Rs.' || symbol.toUpperCase() === 'PKR') {
      return `₨ ${amount.toLocaleString()}`;
    }
    if (symbol === '£' || code === 'GBP') {
      return `£${amount.toLocaleString()}`;
    }
    if (symbol === '$' || code === 'USD') {
      return `$${amount.toLocaleString()}`;
    }
    if (symbol === '€' || code === 'EUR') {
      return `€${amount.toLocaleString()}`;
    }
    return `${symbol} ${amount.toLocaleString()}`;
  };

  // CONFIG METHODS
  const updateConfig = (newConfig: Partial<RestaurantConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...newConfig,
      contact: {
        ...prev.contact,
        ...(newConfig.contact || {})
      },
      social: {
        ...prev.social,
        ...(newConfig.social || {})
      },
      qrPayment: newConfig.qrPayment !== undefined ? {
        ...(prev.qrPayment || {
          isEnabled: true,
          qrCodeImage: '',
          accountName: '',
          instructions: 'Scan the QR code with your supported payment app to make your payment.'
        }),
        ...newConfig.qrPayment
      } : prev.qrPayment
    }));
  };

  // 3D Food Visual & Featured Food Configuration
  const [food3dConfig, setFood3dConfig] = useState<Food3DConfig>(() => {
    return config.food3d || INITIAL_RESTAURANT_CONFIG.food3d || {
      isEnabled: true,
      modelPreset: 'karahi',
      title: 'Live Shinwari Charcoal Mutton Karahi',
      subtitle: 'Slow-simmered in pure organic butter over glowing binchotan coals',
      description: 'Our flagship hearth masterpiece: succulent cuts of grass-fed mountain lamb, ripe Peshawar tomatoes, slivered ginger, and cracked black pepper, prepared in a hand-forged iron wok on living charcoal.',
      tag: 'Signature Hearth Showpiece',
      price: 3450,
      glowIntensity: 'radiant',
      particleEffect: 'embers',
      rotationSpeed: 1.0,
      floatingDistance: 12,
      animationSpeed: 1.0,
      enableAutoRotate: true,
      enableInteractiveDrag: true,
      enableSteamOrEmbers: true,
      customImageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
      linkedDishId: 'main-1'
    };
  });

  // Custom Categories
  const [categories, setCategories] = useState<CustomCategoryItem[]>(() => {
    return config.customCategories || INITIAL_RESTAURANT_CONFIG.customCategories || [
      { id: 'cat-1', name: 'Starters & Kebabs', slug: 'starters', description: 'Charcoal skewers & appetisers', order: 1, isPublished: true, badgeText: 'Popular' },
      { id: 'cat-2', name: 'Main Courses & Karahi', slug: 'main-courses', description: 'Clay-pot handis & wok specials', order: 2, isPublished: true, badgeText: 'Signature' },
      { id: 'cat-3', name: 'Live Grills & Steaks', slug: 'grills', description: 'Flame-seared chops & tomahawks', order: 3, isPublished: true },
      { id: 'cat-4', name: 'Artisan Burgers', slug: 'burgers', description: 'Brioche buns & smoked patties', order: 4, isPublished: true },
      { id: 'cat-5', name: 'Handcrafted Pasta', slug: 'pasta', description: 'Freshly rolled pasta & sauces', order: 5, isPublished: true },
      { id: 'cat-6', name: 'Coastal Seafood', slug: 'seafood', description: 'Fresh king prawns & sea bass', order: 6, isPublished: true },
      { id: 'cat-7', name: 'Dessert Bar & Gelato', slug: 'desserts', description: 'Hot skillets, shakes & kulfi', order: 7, isPublished: true, badgeText: 'Sweet' },
      { id: 'cat-8', name: 'Chilled Drinks & Coolers', slug: 'soft-drinks', description: 'Ice-cold sodas, shakes & coolers', order: 8, isPublished: true },
      { id: 'cat-9', name: "Chef's Hearth Specials", slug: 'specials', description: 'Rare seasonal master creations', order: 9, isPublished: true, badgeText: 'Exclusive' }
    ];
  });

  const [isLivePreviewMode, setIsLivePreviewMode] = useState<boolean>(false);
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>('published');

  const updateFood3DConfig = (updates: Partial<Food3DConfig>) => {
    setFood3dConfig((prev) => {
      const next = { ...prev, ...updates };
      setConfig((c) => ({ ...c, food3d: next }));
      return next;
    });
    setPublishStatus('draft');
  };

  const updateDetailsBlock = (updates: Partial<RestaurantDetailsBlockConfig>) => {
    setConfig((prev) => ({
      ...prev,
      detailsBlock: {
        ...(prev.detailsBlock || INITIAL_RESTAURANT_CONFIG.detailsBlock || {
          eyebrow: 'Restaurant Overview & Culinary Heritage',
          heading: 'Where Gastronomy Meets Soul, Craft & Heritage',
          subheading: 'A tribute to the ancient mastery of open-wood fire cooking, heirloom spices, and unforgettable hospitality.',
          cuisineType: 'Pakistani Hearth Fine Dining & Charcoal Specialities',
          reservationNotes: 'Advance reservations recommended for dinner seatings and private VIP rooms.',
          deliveryNotes: 'Temperature-sealed insulated delivery keeping dishes sizzling hot to your doorstep.',
          showCuisineBadge: true,
          showLocationCard: true,
          showHoursCard: true,
          showContactCard: true,
          showReservationCard: true,
          showDeliveryCard: true,
          showCustomDetails: true,
          customDetails: []
        }),
        ...updates
      }
    }));
    setPublishStatus('draft');
  };

  // NASHTA POINT (BREAKFAST, CHAI & LASSI) METHODS
  const updateNashtaConfig = (updates: Partial<NashtaPointConfig>) => {
    setNashtaConfig((prev) => ({ ...prev, ...updates }));
    setPublishStatus('draft');
  };

  const addNashtaItem = (itemData: Omit<NashtaPointItem, 'id'>): NashtaPointItem => {
    const newItem: NashtaPointItem = {
      ...itemData,
      id: `nashta-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      order: nashtaItems.length + 1,
      isAvailable: itemData.isAvailable !== false
    };
    setNashtaItems((prev) => [...prev, newItem]);
    setPublishStatus('draft');
    return newItem;
  };

  const updateNashtaItem = (id: string, updates: Partial<NashtaPointItem>) => {
    setNashtaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    setPublishStatus('draft');
  };

  const deleteNashtaItem = (id: string) => {
    setNashtaItems((prev) => prev.filter((item) => item.id !== id));
    setPublishStatus('draft');
  };

  const duplicateNashtaItem = (id: string): NashtaPointItem | null => {
    const target = nashtaItems.find((n) => n.id === id);
    if (!target) return null;
    const duplicated: NashtaPointItem = {
      ...target,
      id: `nashta-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${target.name} (Copy)`,
      order: nashtaItems.length + 1
    };
    setNashtaItems((prev) => [...prev, duplicated]);
    setPublishStatus('draft');
    return duplicated;
  };

  const toggleNashtaAvailability = (id: string) => {
    setNashtaItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const toggleNashtaFeatured = (id: string) => {
    setNashtaItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
      )
    );
  };

  const reorderNashtaItems = (startIndex: number, endIndex: number) => {
    setNashtaItems((prev) => {
      const result: NashtaPointItem[] = [...prev];
      const removed = result.splice(startIndex, 1)[0];
      if (removed) {
        result.splice(endIndex, 0, removed);
      }
      return result.map((item: NashtaPointItem, idx: number) => ({ ...item, order: idx + 1 }));
    });
    setPublishStatus('draft');
  };


  const addCustomDetail = (detailData: Omit<CustomRestaurantDetailItem, 'id'>): CustomRestaurantDetailItem => {
    const currentDetails = config.detailsBlock?.customDetails || INITIAL_RESTAURANT_CONFIG.detailsBlock?.customDetails || [];
    const newDetail: CustomRestaurantDetailItem = {
      ...detailData,
      id: `det-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      order: currentDetails.length + 1,
      isPublished: true
    };
    const updatedList = [...currentDetails, newDetail];
    updateDetailsBlock({ customDetails: updatedList });
    return newDetail;
  };

  const updateCustomDetail = (id: string, updates: Partial<CustomRestaurantDetailItem>) => {
    const currentDetails = config.detailsBlock?.customDetails || INITIAL_RESTAURANT_CONFIG.detailsBlock?.customDetails || [];
    const updatedList = currentDetails.map((det) => (det.id === id ? { ...det, ...updates } : det));
    updateDetailsBlock({ customDetails: updatedList });
  };

  const deleteCustomDetail = (id: string) => {
    const currentDetails = config.detailsBlock?.customDetails || INITIAL_RESTAURANT_CONFIG.detailsBlock?.customDetails || [];
    const updatedList = currentDetails.filter((det) => det.id !== id);
    updateDetailsBlock({ customDetails: updatedList });
  };

  const reorderCustomDetails = (startIndex: number, endIndex: number) => {
    const currentDetails = config.detailsBlock?.customDetails || INITIAL_RESTAURANT_CONFIG.detailsBlock?.customDetails || [];
    const result = [...currentDetails];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const reordered = result.map((item, idx) => ({ ...item, order: idx + 1 }));
    updateDetailsBlock({ customDetails: reordered });
  };

  const updateStoryDetails = (updates: Partial<RestaurantStoryDetails>) => {
    setConfig((prev) => ({
      ...prev,
      storyDetails: {
        ...(prev.storyDetails || INITIAL_RESTAURANT_CONFIG.storyDetails || {
          heroTitle: 'The Living Hearth & Primal Flavor',
          heroSubtitle: 'Authentic Live-Fire Gastronomy Meets Modern Luxury',
          storyChapter1Title: 'Ancestral Fire Craftsmanship',
          storyChapter1Content: 'Mastery over living flame without gas shortcuts.',
          storyChapter2Title: 'Heirloom Spices & Terroir Sourcing',
          storyChapter2Content: 'Ethical heritage growers and mountain lamb.',
          culinaryPhilosophy: 'We cook with flame because living fire cannot be replicated by machinery.',
          cuisineType: 'Pakistani Hearth Fine Dining & Charcoal Specialities',
          amenities: ['Live Charcoal Hearth', 'VIP Private Dining', 'Valet Parking', 'Halal Certified'],
          seatingCapacity: '160 Guests',
          seatingDescription: 'Intimate candlelit booths & banquet roundtables.',
          reservationNotice: 'Reservations recommended for dinner.',
          coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85',
          interiorImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
          hearthImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
        }),
        ...updates
      }
    }));
    setPublishStatus('draft');
  };

  const addCategory = (categoryData: Omit<CustomCategoryItem, 'id'>): CustomCategoryItem => {
    const newCat: CustomCategoryItem = {
      ...categoryData,
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      order: categories.length + 1,
      isPublished: true
    };
    setCategories((prev) => [...prev, newCat]);
    setConfig((c) => ({ ...c, customCategories: [...categories, newCat] }));
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<CustomCategoryItem>) => {
    setCategories((prev) => {
      const next = prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat));
      setConfig((c) => ({ ...c, customCategories: next }));
      return next;
    });
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => {
      const next = prev.filter((cat) => cat.id !== id);
      setConfig((c) => ({ ...c, customCategories: next }));
      return next;
    });
  };

  const reorderCategories = (startIndex: number, endIndex: number) => {
    setCategories((prev) => {
      const result = [...prev];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      const reordered = result.map((cat: CustomCategoryItem, idx: number) => ({ ...cat, order: idx + 1 }));
      setConfig((c) => ({ ...c, customCategories: reordered }));
      return reordered;
    });
  };

  const duplicateMenuItem = (id: string): MenuItem | null => {
    const target = menuItems.find((m) => m.id === id);
    if (!target) return null;
    const duplicated: MenuItem = {
      ...target,
      id: `menu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${target.name} (Copy)`,
      isPublished: true
    };
    setMenuItems((prev) => [duplicated, ...prev]);
    return duplicated;
  };

  const archiveMenuItem = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isArchived: true, isAvailable: false } : item))
    );
  };

  const unarchiveMenuItem = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isArchived: false, isAvailable: true } : item))
    );
  };

  const reorderMenuItems = (startIndex: number, endIndex: number) => {
    setMenuItems((prev) => {
      const result = [...prev];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((item: MenuItem, idx: number) => ({ ...item, displayOrder: idx + 1 }));
    });
  };

  const publishAllChanges = () => {
    setPublishStatus('published');
    try {
      localStorage.setItem(`${STORAGE_KEY}_config`, JSON.stringify(config));
      localStorage.setItem(`${STORAGE_KEY}_menu`, JSON.stringify(menuItems));
      localStorage.setItem(`${STORAGE_KEY}_deals`, JSON.stringify(deals));
    } catch (e) {
      console.warn('Error saving to storage', e);
    }
  };

  const addMenuItem = (itemData: Omit<MenuItem, 'id'>): MenuItem => {
    const newItem: MenuItem = {
      ...itemData,
      id: `menu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isAvailable: itemData.isAvailable !== false,
      isPublished: true
    };
    setMenuItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleDishAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const toggleDishChefSpecial = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isChefSpecial: !item.isChefSpecial } : item
      )
    );
  };

  const toggleDishNew = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isNew: !item.isNew } : item
      )
    );
  };

  // MEALS / DEALS METHODS
  const addDeal = (dealData: Omit<DealItem, 'id'>): DealItem => {
    const newDeal: DealItem = {
      ...dealData,
      id: `deal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isAvailable: dealData.isAvailable !== false,
      includedItems: dealData.includedItems || []
    };
    setDeals((prev) => [newDeal, ...prev]);
    return newDeal;
  };

  const updateDeal = (id: string, updates: Partial<DealItem>) => {
    setDeals((prev) =>
      prev.map((deal) => (deal.id === id ? { ...deal, ...updates } : deal))
    );
  };

  const deleteDeal = (id: string) => {
    setDeals((prev) => prev.filter((deal) => deal.id !== id));
  };

  const duplicateDeal = (id: string): DealItem | null => {
    const target = deals.find((d) => d.id === id);
    if (!target) return null;
    const duplicated: DealItem = {
      ...target,
      id: `deal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${target.name} (Copy)`,
      order: (target.order || 0) + 1
    };
    setDeals((prev) => [duplicated, ...prev]);
    return duplicated;
  };

  const toggleDealAvailability = (id: string) => {
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === id ? { ...deal, isAvailable: !deal.isAvailable } : deal
      )
    );
  };

  const toggleDealFeatured = (id: string) => {
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === id ? { ...deal, isFeatured: !deal.isFeatured } : deal
      )
    );
  };

  const reorderDeals = (startIndex: number, endIndex: number) => {
    setDeals((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  // SPECIAL RECIPES METHODS
  const addSpecialRecipe = (recipeData: Omit<SpecialRecipeItem, 'id'>): SpecialRecipeItem => {
    const newRecipe: SpecialRecipeItem = {
      ...recipeData,
      id: `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isPublished: recipeData.isPublished !== false
    };
    setSpecialRecipes((prev) => [newRecipe, ...prev]);
    return newRecipe;
  };

  const updateSpecialRecipe = (id: string, updates: Partial<SpecialRecipeItem>) => {
    setSpecialRecipes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteSpecialRecipe = (id: string) => {
    setSpecialRecipes((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleRecipePublish = (id: string) => {
    setSpecialRecipes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPublished: !item.isPublished } : item
      )
    );
  };

  // OFFERS METHODS
  const addOffer = (offerData: Omit<OfferItem, 'id'>): OfferItem => {
    const newOffer: OfferItem = {
      ...offerData,
      id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isActive: offerData.isActive !== false
    };
    setOffers((prev) => [newOffer, ...prev]);
    return newOffer;
  };

  const updateOffer = (id: string, updates: Partial<OfferItem>) => {
    setOffers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleOfferActive = (id: string) => {
    setOffers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  // GALLERY METHODS
  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>): GalleryItem => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      order: galleryItems.length + 1
    };
    setGalleryItems((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateGalleryItem = (id: string, updates: Partial<GalleryItem>) => {
    setGalleryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const reorderGalleryItem = (id: string, direction: 'up' | 'down') => {
    setGalleryItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const newArray = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const [movedItem] = newArray.splice(index, 1);
      newArray.splice(targetIndex, 0, movedItem);
      return newArray;
    });
  };

  // CHEF METHODS
  const addChef = (chefData: Omit<ChefMember, 'id'>): ChefMember => {
    const newChef: ChefMember = {
      ...chefData,
      id: `chef-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isPublished: true
    };
    setChefs((prev) => [...prev, newChef]);
    return newChef;
  };

  const updateChef = (id: string, updates: Partial<ChefMember>) => {
    setChefs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteChef = (id: string) => {
    setChefs((prev) => prev.filter((item) => item.id !== id));
  };

  // EVENT METHODS
  const addEvent = (eventData: Omit<EventItem, 'id'>): EventItem => {
    const newEvent: EventItem = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isPublished: eventData.isPublished !== false
    };
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    setEvents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleEventPublish = (id: string) => {
    setEvents((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPublished: !item.isPublished } : item
      )
    );
  };

  // REVIEWS METHODS
  const addReview = (reviewData: Omit<ReviewItem, 'id'>): ReviewItem => {
    const newReview: ReviewItem = {
      ...reviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isApproved: reviewData.isApproved !== undefined ? reviewData.isApproved : true
    };
    setReviews((prev) => [newReview, ...prev]);
    return newReview;
  };

  const updateReview = (id: string, updates: Partial<ReviewItem>) => {
    setReviews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleReviewApproval = (id: string) => {
    setReviews((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isApproved: !item.isApproved } : item
      )
    );
  };

  // OWNER AUTHENTICATION & SECURITY
  const loginOwner = (username: string, password: string): { success: boolean; error?: string } => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1-10 character rule validation
    if (cleanPass.length < 1 || cleanPass.length > 10) {
      return {
        success: false,
        error: 'Password must be between 1 and 10 characters in length.'
      };
    }

    // Owner credentials verification (Accepts stored ownerPassword, test password '12345', or default passphrases)
    const isPasswordValid = 
      cleanPass === ownerPassword ||
      cleanPass === '12345' ||
      cleanPass === 'ember2026' ||
      cleanPass === 'admin123' ||
      cleanPass === 'ember';

    if (isPasswordValid) {
      const displayName = cleanUser ? (cleanUser === 'owner' || cleanUser === 'admin' ? 'Restaurant Executive (Owner)' : username) : 'Restaurant Executive (Owner)';
      const session: OwnerAuthSession = {
        isAuthenticated: true,
        username: displayName,
        loginTime: new Date().toISOString(),
        role: 'owner'
      };

      setAuthSession(session);
      setIsOwnerModeActive(true);
      setIsLoginModalOpen(false);
      if (pendingOwnerTab) {
        setOwnerActiveTab(pendingOwnerTab);
      }
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Incorrect passphrase. Testing key is 12345 or your saved security password.' 
    };
  };

  const changeOwnerPassword = (currentPass: string, newPass: string): { success: boolean; error?: string } => {
    const cleanCurrent = currentPass.trim();
    const cleanNew = newPass.trim();

    // Validate old password
    const isOldPassCorrect = 
      cleanCurrent === ownerPassword ||
      cleanCurrent === '12345' ||
      cleanCurrent === 'ember2026' ||
      cleanCurrent === 'admin123' ||
      cleanCurrent === 'ember';

    if (!isOldPassCorrect) {
      return { success: false, error: 'Current password does not match system records.' };
    }

    // Validate new password rules (1-10 chars, alphanumeric)
    if (cleanNew.length < 1 || cleanNew.length > 10) {
      return { success: false, error: 'New password must be between 1 and 10 characters in length.' };
    }

    setOwnerPassword(cleanNew);
    try {
      localStorage.setItem(`${STORAGE_KEY}_owner_password`, cleanNew);
    } catch (e) {
      console.warn('Failed to persist owner password', e);
    }

    return { success: true };
  };

  const resetOwnerPassword = () => {
    setOwnerPassword('12345');
    try {
      localStorage.setItem(`${STORAGE_KEY}_owner_password`, '12345');
    } catch (e) {
      console.warn('Failed to reset owner password in storage', e);
    }
  };

  const logoutOwner = () => {
    const clearedSession: OwnerAuthSession = {
      isAuthenticated: false,
      username: '',
      loginTime: '',
      role: 'owner'
    };
    setAuthSession(clearedSession);
    setIsOwnerModeActive(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // SOFT DRINKS & SIZES METHODS (100% HALAL)
  const addSoftDrink = (drinkData: Omit<SoftDrinkItem, 'id'>): SoftDrinkItem => {
    const newDrink: SoftDrinkItem = {
      ...drinkData,
      id: `sd-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isAvailable: drinkData.isAvailable !== false
    };
    setSoftDrinks((prev) => [...prev, newDrink]);
    return newDrink;
  };

  const updateSoftDrink = (id: string, updates: Partial<SoftDrinkItem>) => {
    setSoftDrinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteSoftDrink = (id: string) => {
    setSoftDrinks((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleSoftDrinkAvailability = (id: string) => {
    setSoftDrinks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const updateDrinkSize = (drinkId: string, sizeIndex: number, updates: Partial<DrinkSizeOption>) => {
    setSoftDrinks((prev) =>
      prev.map((item) => {
        if (item.id !== drinkId) return item;
        const newSizes = [...item.sizes];
        if (newSizes[sizeIndex]) {
          newSizes[sizeIndex] = { ...newSizes[sizeIndex], ...updates };
        }
        return { ...item, sizes: newSizes };
      })
    );
  };

  const addDrinkSize = (drinkId: string, sizeOption: DrinkSizeOption) => {
    setSoftDrinks((prev) =>
      prev.map((item) => {
        if (item.id !== drinkId) return item;
        return { ...item, sizes: [...item.sizes, sizeOption] };
      })
    );
  };

  const deleteDrinkSize = (drinkId: string, sizeIndex: number) => {
    setSoftDrinks((prev) =>
      prev.map((item) => {
        if (item.id !== drinkId) return item;
        const newSizes = item.sizes.filter((_, idx) => idx !== sizeIndex);
        return { ...item, sizes: newSizes };
      })
    );
  };

  // DESSERT BAR & ICE CREAM METHODS
  const addDessertItem = (itemData: Omit<DessertBarItem, 'id'>): DessertBarItem => {
    const newItem: DessertBarItem = {
      ...itemData,
      id: `dessert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      isAvailable: itemData.isAvailable !== false
    };
    setDessertBarItems((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateDessertItem = (id: string, updates: Partial<DessertBarItem>) => {
    setDessertBarItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteDessertItem = (id: string) => {
    setDessertBarItems((prev) => prev.filter((item) => item.id !== id));
  };

  const duplicateDessertItem = (item: DessertBarItem) => {
    const duplicated: DessertBarItem = {
      ...item,
      id: `dessert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${item.name} (Copy)`
    };
    setDessertBarItems((prev) => [...prev, duplicated]);
  };

  const toggleDessertAvailability = (id: string) => {
    setDessertBarItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  const resetToDefaults = () => {
    setConfig(INITIAL_RESTAURANT_CONFIG);
    setMenuItems(INITIAL_MENU_ITEMS);
    setDeals(INITIAL_DEALS);
    setSpecialRecipes(INITIAL_SPECIAL_RECIPES);
    setOffers(INITIAL_OFFERS);
    setGalleryItems(INITIAL_GALLERY_ITEMS);
    setDessertBarItems(INITIAL_DESSERT_BAR_ITEMS);
    setSoftDrinks(INITIAL_SOFT_DRINKS);
    setChefs(INITIAL_CHEFS);
    setEvents(INITIAL_EVENTS);
    setReviews(INITIAL_REVIEWS);
    setNashtaConfig(INITIAL_NASHTA_CONFIG);
    setNashtaItems(INITIAL_NASHTA_ITEMS);

    try {
      localStorage.removeItem(`${STORAGE_KEY}_config`);
      localStorage.removeItem(`${STORAGE_KEY}_menu`);
      localStorage.removeItem(`${STORAGE_KEY}_deals`);
      localStorage.removeItem(`${STORAGE_KEY}_recipes`);
      localStorage.removeItem(`${STORAGE_KEY}_offers`);
      localStorage.removeItem(`${STORAGE_KEY}_gallery`);
      localStorage.removeItem(`${STORAGE_KEY}_dessert_bar`);
      localStorage.removeItem(`${STORAGE_KEY}_soft_drinks`);
      localStorage.removeItem(`${STORAGE_KEY}_chefs`);
      localStorage.removeItem(`${STORAGE_KEY}_events`);
      localStorage.removeItem(`${STORAGE_KEY}_reviews`);
      localStorage.removeItem(`${STORAGE_KEY}_nashta_config`);
      localStorage.removeItem(`${STORAGE_KEY}_nashta_items`);
    } catch (e) {
      console.warn('Failed clearing storage', e);
    }
  };

  const exportDataJSON = (): string => {
    const payload = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      config,
      nashtaConfig,
      nashtaItems,
      menuItems,
      deals,
      specialRecipes,
      offers,
      galleryItems,
      dessertBarItems,
      softDrinks,
      chefs,
      events,
      reviews
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJSON = (jsonStr: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.config) setConfig(parsed.config);
      if (parsed.nashtaConfig) setNashtaConfig(parsed.nashtaConfig);
      if (Array.isArray(parsed.nashtaItems)) setNashtaItems(parsed.nashtaItems);
      if (Array.isArray(parsed.menuItems)) setMenuItems(parsed.menuItems);
      if (Array.isArray(parsed.deals)) setDeals(parsed.deals);
      if (Array.isArray(parsed.specialRecipes)) setSpecialRecipes(parsed.specialRecipes);
      if (Array.isArray(parsed.offers)) setOffers(parsed.offers);
      if (Array.isArray(parsed.galleryItems)) setGalleryItems(parsed.galleryItems);
      if (Array.isArray(parsed.dessertBarItems)) setDessertBarItems(parsed.dessertBarItems);
      if (Array.isArray(parsed.softDrinks)) setSoftDrinks(parsed.softDrinks);
      if (Array.isArray(parsed.chefs)) setChefs(parsed.chefs);
      if (Array.isArray(parsed.events)) setEvents(parsed.events);
      if (Array.isArray(parsed.reviews)) setReviews(parsed.reviews);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Malformed JSON configuration file.' };
    }
  };

  return (
    <RestaurantDataContext.Provider
      value={{
        config,
        updateConfig,
        formatPrice,

        // Soft Drinks & Beverage Packaging Options (100% Halal)
        softDrinks,
        addSoftDrink,
        updateSoftDrink,
        deleteSoftDrink,
        toggleSoftDrinkAvailability,
        updateDrinkSize,
        addDrinkSize,
        deleteDrinkSize,

        // Nashta Point (Breakfast, Chai & Lassi)
        nashtaConfig,
        nashtaItems,
        updateNashtaConfig,
        addNashtaItem,
        updateNashtaItem,
        deleteNashtaItem,
        duplicateNashtaItem,
        toggleNashtaAvailability,
        toggleNashtaFeatured,
        reorderNashtaItems,

        // Restaurant Details Block
        updateDetailsBlock,
        addCustomDetail,
        updateCustomDetail,
        deleteCustomDetail,
        reorderCustomDetails,

        // 3D Food Visual & Featured Food Configuration
        food3dConfig,
        updateFood3DConfig,
        updateStoryDetails,

        // Custom Categories
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,

        // Live Preview & Publishing
        isLivePreviewMode,
        setIsLivePreviewMode,
        publishStatus,
        publishAllChanges,

        dessertBarItems,
        addDessertItem,
        updateDessertItem,
        deleteDessertItem,
        duplicateDessertItem,
        toggleDessertAvailability,

        deals,
        meals: deals,
        addDeal,
        updateDeal,
        deleteDeal,
        duplicateDeal,
        toggleDealAvailability,
        toggleDealFeatured,
        reorderDeals,

        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        duplicateMenuItem,
        archiveMenuItem,
        unarchiveMenuItem,
        reorderMenuItems,
        toggleDishAvailability,
        toggleDishChefSpecial,
        toggleDishNew,

        specialRecipes,
        addSpecialRecipe,
        updateSpecialRecipe,
        deleteSpecialRecipe,
        toggleRecipePublish,

        offers,
        addOffer,
        updateOffer,
        deleteOffer,
        toggleOfferActive,

        galleryItems,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        reorderGalleryItem,

        chefs,
        addChef,
        updateChef,
        deleteChef,

        events,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventPublish,

        reviews,
        addReview,
        updateReview,
        deleteReview,
        toggleReviewApproval,

        authSession,
        loginOwner,
        logoutOwner,
        changeOwnerPassword,
        resetOwnerPassword,
        isOwnerModeActive,
        setIsOwnerModeActive,
        isLoginModalOpen,
        setIsLoginModalOpen,
        ownerActiveTab,
        setOwnerActiveTab,
        openOwnerPortal,

        // Customer Online Orders & Cancellation
        orders,
        activeOrder,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        isOrderModalOpen,
        setIsOrderModalOpen,
        initialOrderType,
        setInitialOrderType,
        initialOrderStep,
        setInitialOrderStep,
        openOrderModal,

        // Cart Management
        cartItems,
        lastAddedItem,
        lastAddedTimestamp,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,

        // Aliases
        ownerSession: authSession.isAuthenticated ? authSession : null,
        ownerLogin: loginOwner,
        ownerLogout: logoutOwner,
        isOwnerMode: isOwnerModeActive,
        toggleOwnerMode: setIsOwnerModeActive,

        resetToDefaults,
        exportDataJSON,
        importDataJSON,
        exportDataJson: exportDataJSON,
        importDataJson: (jsonStr: string) => importDataJSON(jsonStr).success
      }}
    >
      {children}
    </RestaurantDataContext.Provider>
  );
};

export const useRestaurantData = (): RestaurantDataContextType => {
  const context = useContext(RestaurantDataContext);
  if (!context) {
    throw new Error('useRestaurantData must be used within a RestaurantDataProvider');
  }
  return context;
};
