export interface IncludedItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string; // e.g. "pcs", "box", "large", "can", "dip"
  note?: string; // e.g. "Crispy or Grilled"
}

export interface DealAddon {
  id: string;
  name: string;
  price: number; // in PKR
  isAvailable?: boolean;
}

export interface DealOptionChoice {
  id: string;
  name: string;
  extraPrice?: number;
}

export interface DealOptionGroup {
  id: string;
  title: string;
  required: boolean;
  minSelect?: number;
  maxSelect?: number;
  choices: DealOptionChoice[];
}

export interface DealBox {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number; // PKR
  originalPrice?: number; // PKR
  discount?: string; // e.g. "25% OFF" or "Save Rs. 350"
  category: string; // e.g. "Family Boxes", "Duo Deals", "Mega Meals", "Midnight Boxes", "Kids Boxes"
  includedItems: IncludedItem[];
  addons?: DealAddon[];
  optionGroups?: DealOptionGroup[];
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean; // Hide/Show toggle
  tag?: string; // "Bestseller", "New", "Hot Deal", "Limited Time"
  servings?: string; // e.g. "Serves 3-4"
  prepTimeMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string; // 'Ice Cream' | 'Drinks' | 'Deal Meal' | 'Spicy Food' | 'Burgers' | etc.
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isSpicy?: boolean;
  tag?: string;
  portion?: string;
  createdAt: string;
}

export interface CartItem {
  cartId: string;
  itemType: 'deal' | 'menu_item';
  referenceId: string; // deal id or menu item id
  name: string;
  image: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  selectedAddons: { id: string; name: string; price: number }[];
  selectedOptions: { groupTitle: string; choiceName: string; extraPrice?: number }[];
  includedItemsSummary?: string[]; // snapshot of items inside deal
  specialInstructions?: string;
  itemTotal: number;
}

export type OrderStatus =
  | 'New'
  | 'Accepted'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'ready_for_pickup'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  deliveryArea?: string;
  paymentMethod: 'cash_on_delivery' | 'jazzcash_easypaisa' | 'card';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  status: OrderStatus;
  createdAt: string;
  specialInstructions?: string;
}

export interface Category {
  id: string;
  name: string;
  type?: 'product' | 'deal' | 'both';
  icon?: string;
  image?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CategoryItem extends Category {}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  minDeliveryTimeMinutes?: number;
}

export interface StoreSettings {
  // 1. Branding & Identity
  name: string;
  tagline?: string;
  logo?: string;
  logoUrl?: string;
  favicon?: string;
  faviconUrl?: string;
  currency: string;
  primaryColor?: string;

  // 2. Hero & Homepage Content
  heroBannerUrl?: string;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroBadge?: string;
  heroExploreButtonText?: string;
  heroWhatsappButtonText?: string;
  hero?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    heroImage?: string;
    orderButtonText?: string;
    whatsappButtonText?: string;
  };

  // 3. Homepage Sections Visibility
  sections?: {
    hero?: boolean;
    featuredDeals?: boolean;
    dealsCatalog?: boolean;
    productsMenu?: boolean;
    guaranteeBadges?: boolean;
    floatingCart?: boolean;
  };
  showHero?: boolean;
  showFeaturedDeals?: boolean;
  dealsSectionTitle?: string;
  dealsSectionSubtitle?: string;
  showMenuSection?: boolean;
  menuSectionTitle?: string;
  menuSectionSubtitle?: string;
  showWhyChooseUs?: boolean;
  showFloatingCart?: boolean;

  // 4. Restaurant Information & Contact
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  openingHours?: string;
  isOpen: boolean;
  announcement?: string;
  announcementText?: string;
  showAnnouncement?: boolean;

  // 5. Delivery & Pickup Rules
  deliveryRules?: {
    enableDelivery?: boolean;
    enablePickup?: boolean;
    standardFee?: number;
    freeDeliveryThreshold?: number;
    minimumOrderAmount?: number;
    estimatedTimeMinutes?: number;
    zones?: DeliveryZone[];
  };
  enableHomeDelivery?: boolean;
  enablePickup?: boolean;
  deliveryFee?: number;
  freeDeliveryThreshold?: number;
  estimatedDeliveryTime?: string;
  minimumOrderAmount?: number;
  deliveryAreas?: string[];

  // 6. Payments
  payments?: {
    cashOnDelivery?: boolean;
    cardOnDelivery?: boolean;
    jazzcash?: boolean;
    jazzcashTitle?: string;
    jazzcashNumber?: string;
    easypaisa?: boolean;
    easypaisaTitle?: string;
    easypaisaNumber?: string;
  };
  enableCashOnDelivery?: boolean;
  enableJazzCash?: boolean;
  jazzCashAccountTitle?: string;
  jazzCashAccountNumber?: string;
  enableEasypaisa?: boolean;
  easypaisaAccountTitle?: string;
  easypaisaAccountNumber?: string;
  enableCardPayment?: boolean;

  // 7. WhatsApp Ordering
  whatsappSettings?: {
    enableDirectWhatsApp?: boolean;
    orderPhone?: string;
    messageTemplate?: string;
  };
  enableWhatsappOrdering?: boolean;
  whatsappOrderTemplate?: string;

  // 8. Notifications
  notifications?: {
    soundAlerts?: boolean;
    emailAlertsAddress?: string;
    staffAlertPhone?: string;
  };
  orderNotificationSound?: boolean;
  orderNotificationEmail?: string;
  staffAlertPhone?: string;

  // 9. Security
  security?: {
    requirePinForPortal?: boolean;
    adminPin?: string;
  };
  requireOwnerPin?: boolean;
  ownerPin?: string;

  // 10. Footer & Social
  footer?: {
    copyrightText?: string;
    footerNote?: string;
  };
  footerAboutText?: string;
  footerCopyright?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
}
