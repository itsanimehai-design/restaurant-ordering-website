export type PageId = 
  | 'home' 
  | 'menu' 
  | 'about' 
  | 'gallery' 
  | 'reviews' 
  | 'reservations' 
  | 'contact' 
  | 'events' 
  | 'offers' 
  | 'chefs';

export interface PaymentMethodItem {
  name: string;
  icon: string;
  desc: string;
}

export interface QrPaymentConfig {
  isEnabled: boolean; // toggle QR payment on/off
  qrCodeImage: string; // editable QR image asset (Data URI or URL)
  accountName: string; // e.g. "Merchant Raast / JazzCash / Easypaisa"
  accountNumber?: string; // e.g. "0300-1234567" or Raast ID / IBAN
  bankOrWalletName?: string; // e.g. "Raast Instant QR • JazzCash • Easypaisa • All Banking Apps"
  instructions?: string; // "Scan the QR code with your supported payment app to make your payment."
  enableCashOnDelivery?: boolean; // Default true
  enableCardOnDelivery?: boolean; // Default true
  enableBankTransfer?: boolean; // Default false
}

export type AssistantSection = 
  | 'food' 
  | 'meals'
  | 'desserts' 
  | 'drinks' 
  | 'cart' 
  | 'delivery' 
  | 'pickup' 
  | 'checkout' 
  | 'payment' 
  | 'reservations' 
  | 'events' 
  | 'offers' 
  | 'gallery' 
  | 'info' 
  | 'contact' 
  | 'reviews' 
  | 'chefs' 
  | 'general';

export interface AssistantContextPayload {
  section: AssistantSection;
  title?: string;
  itemId?: string;
  itemName?: string;
  itemPrice?: number;
  itemCategory?: string;
  itemDescription?: string;
  customContext?: string;
  tags?: string[];
  spiceLevel?: string;
  isChefSpecial?: boolean;
}

export interface AiAssistantConfig {
  isEnabled: boolean;
  assistantName: string; // e.g. "Mr. Billa AI" or "Ember Assistant"
  greeting: string; // Roman Urdu greeting
  avatarIcon: 'billa-cat' | 'sparkles' | 'chef' | 'bot' | 'heart';
  welcomeMessage: string;
  language: 'roman-urdu' | 'urdu' | 'english';
  temperature?: number; // e.g. 0.6 default
  customNotes?: string;
  enabledSections: {
    menuAndFood: boolean;
    ordersAndCheckout: boolean;
    reservations: boolean;
    eventsAndOffers: boolean;
    restaurantInfo: boolean;
    reviewsAndGallery: boolean;
  };
}

export type Food3DModelPreset = 
  | 'karahi' 
  | 'burger' 
  | 'pizza' 
  | 'steak' 
  | 'lamb-chops' 
  | 'pasta' 
  | 'dessert-skillet' 
  | 'cocktail' 
  | 'custom';

export interface Food3DConfig {
  isEnabled: boolean;
  modelPreset: Food3DModelPreset;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  price?: number;
  glowIntensity: 'subtle' | 'radiant' | 'fiery' | 'ember';
  particleEffect: 'embers' | 'steam' | 'sparkles' | 'spicedust' | 'none';
  rotationSpeed: number; // 0.2 to 3.0
  floatingDistance: number; // 5 to 30
  animationSpeed: number; // 0.2 to 2.5
  enableAutoRotate: boolean;
  enableInteractiveDrag: boolean;
  enableSteamOrEmbers: boolean;
  customImageUrl?: string;
  linkedDishId?: string; // Optional binding to a menu dish id
}

export interface CustomCategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  imageUrl?: string;
  order: number;
  isPublished: boolean;
  badgeText?: string;
}

export interface RestaurantStoryDetails {
  heroTitle: string;
  heroSubtitle: string;
  storyChapter1Title: string;
  storyChapter1Content: string;
  storyChapter2Title: string;
  storyChapter2Content: string;
  culinaryPhilosophy: string;
  cuisineType: string;
  amenities: string[];
  seatingCapacity: string;
  seatingDescription: string;
  reservationNotice: string;
  coverImage: string;
  interiorImage: string;
  hearthImage: string;
}

export type MenuCategory = 
  | 'starters'
  | 'soups-salads'
  | 'main-courses'
  | 'grills'
  | 'burgers'
  | 'pasta'
  | 'seafood'
  | 'desserts'
  | 'soft-drinks'
  | 'signature-drinks'
  | 'specials'
  | string;

export interface DrinkSizeOption {
  id?: string;
  size?: string; // '250ml Slim Can' | '345ml Glass Bottle' | '500ml PET' | '1.5L Family Sharing' | 'Single Clay Cup'
  label?: string; // alias for size
  price: number;
  volumeMl?: number;
  isPopular?: boolean;
  isAvailable?: boolean;
  isDefault?: boolean;
  packaging?: string;
  packagingType?: string; // alias for packaging
  image?: string;
  description?: string;
}

export type SoftDrinkPackagingOption = DrinkSizeOption;

export interface SoftDrinkItem {
  id: string;
  name: string;
  brand: string;
  category: 'carbonated' | 'local-heritage' | 'diet-zero' | 'energy-refreshers' | 'water-juices' | 'traditional';
  description: string;
  image: string;
  sizes: DrinkSizeOption[];
  packagingOptions?: DrinkSizeOption[]; // alias for compatibility
  isAvailable: boolean;
  flavorProfile: string;
  flavor?: string; // alias
  drinkType?: string; // alias
  temperature: 'Ice Cold' | 'Chilled' | 'Room Temp' | 'Warm/Freshly Brewed';
  servingTemperature?: string; // alias
  tags?: string[];
  isHalalCertified?: boolean;
  isFeatured?: boolean;
}

export type DessertBarCategory = 
  | 'all' 
  | 'milkshakes' 
  | 'ice-creams' 
  | 'sundaes-warm' 
  | 'falooda-kulfi' 
  | 'cold-refreshers';

export interface DessertBarItem {
  id: string;
  name: string;
  category: 'milkshakes' | 'ice-creams' | 'sundaes-warm' | 'falooda-kulfi' | 'cold-refreshers';
  description: string;
  image: string;
  price: number;
  servingSize: string;
  flavorNotes: string;
  isAvailable: boolean;
  isChefSpecial?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  tags?: string[];
  toppingsIncluded?: string[];
  temperature?: 'Frost Cold' | 'Ice Chilled' | 'Warm & Sizzling' | 'Velvety Chilled';
}

export interface DealIncludedProduct {
  name?: string;
  productName?: string; // alias for compatibility
  quantity: number;
  note?: string;
  category?: 'food' | 'drink' | 'dessert' | 'other';
}

export interface DealItem {
  id: string;
  name: string;
  tagline?: string;
  category?: 'family' | 'couple' | 'friends' | 'single' | 'party' | 'kids' | 'custom' | string;
  description: string;
  price: number; // selling/discounted price
  discountedPrice?: number; // alias for price
  originalPrice?: number;
  image: string;
  serves?: string; // e.g. "Serves 4-6 Persons"
  servingSize?: string; // alias for serves
  includedItems: DealIncludedProduct[];
  badge?: string; // e.g. "Chef's Signature Feast", "Mega Saver Deal", "Family Special"
  savingsText?: string; // e.g. "Save ₨650"
  isChefSpecial?: boolean;
  isPopular?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  spiceLevel?: 0 | 1 | 2 | 3;
  aiRating?: number; // e.g. 4.9
  showAiRating?: boolean;
  order?: number;
}

export interface MealItem extends DealItem {}

export interface ProductOptionVariant {
  name: string; // e.g. "Size", "Portion", "Flavor", "Spice Level"
  options: { label: string; priceDelta: number; isDefault?: boolean }[];
}

export interface ProductAddOnItem {
  id: string;
  name: string; // e.g. "Extra Cheese", "Extra Patty", "Extra Sauce", "Garlic Mayo", "BBQ Sauce", "Jalapeños", "Extra Fries"
  price: number;
  isAvailable?: boolean;
}

export interface NotificationSettings {
  browserPush: boolean;
  soundAlerts: boolean;
  emailAlerts: boolean;
  emailAddress?: string;
  whatsappAlerts: boolean;
  whatsappNumber?: string;
  smsAlerts: boolean;
  smsNumber?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number;
  image: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isHalal?: boolean;
  isChefSpecial?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isAvailable?: boolean;
  isPublished?: boolean;
  isArchived?: boolean;
  displayOrder?: number;
  food3dPreset?: Food3DModelPreset;
  spiceLevel?: 0 | 1 | 2 | 3; // 0 none, 1 mild, 2 medium, 3 bold ember
  calories?: number;
  pairingNote?: string;
  allergens?: string[];
  customTags?: string[];
  specialOfferText?: string;
  ingredientsList?: string[];
  servingPortion?: string;
  options?: ProductOptionVariant[];
  addOns?: ProductAddOnItem[];
}

export interface SpecialRecipeItem {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  price: number;
  image: string;
  category: string;
  isPublished: boolean;
  prepTime?: string;
  cookingMethod?: string;
  chefNotes?: string;
}

export interface OfferItem {
  id: string;
  title: string;
  description: string;
  discount: string; // e.g. "25% OFF", "Complimentary Wagyu Upgrade", "Buy 1 Get 1"
  image: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  code?: string;
  terms?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  location?: string;
  price?: number;
  bookingStatus: 'open' | 'limited' | 'sold-out' | 'inquiry';
  isPublished: boolean;
}

export interface ChefMember {
  id: string;
  name: string;
  role: string;
  image: string;
  specialty: string;
  bio: string;
  experienceYears: number;
  accolades: string[];
  signatureDish: string;
  isPublished: boolean;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  roleOrCity?: string;
  rating: number;
  review: string;
  date: string;
  isFeatured?: boolean;
  isApproved?: boolean;
  orderedDishes?: string[];
  source?: 'Verified Diner' | 'Michelin Guide Inspector' | 'Gastronomy Critic' | 'Private Dining Guest';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'dishes' | 'interior' | 'chef' | 'experience' | 'events';
  image: string;
  caption: string;
  aspectRatio?: 'tall' | 'wide' | 'square';
  order?: number;
}

export interface OperatingHours {
  days: string;
  lunch: string;
  dinner: string;
}

export interface RestaurantContact {
  address: string;
  city: string;
  phone: string;
  phoneClean: string;
  cleanPhone?: string;
  whatsapp: string;
  whatsappClean: string;
  cleanWhatsapp?: string;
  email: string;
  eventsEmail: string;
  pressEmail: string;
  province?: string;
  postalCode?: string;
  googleMapsEmbedUrl?: string;
}

export interface RestaurantSocial {
  instagram: string;
  facebook: string;
  twitter: string;
  tripadvisor: string;
  tiktok?: string;
  youtube?: string;
}

export interface RestaurantBranding {
  logoImage?: string;
  faviconImage?: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  heroBackground?: string;
  heroButtons?: {
    primaryText?: string;
    primaryLink?: string;
    secondaryText?: string;
    secondaryLink?: string;
  };
  primaryColor?: string;
  accentColor?: string;
  sectionsVisibility?: {
    hero?: boolean;
    featured?: boolean;
    promo?: boolean;
    food?: boolean;
    deals?: boolean;
    nashta?: boolean;
    drinks?: boolean;
    desserts?: boolean;
    recipes?: boolean;
    chefs?: boolean;
    events?: boolean;
    gallery?: boolean;
    reviews?: boolean;
    about?: boolean;
  };
  categoryVisuals?: {
    food?: string;
    deals?: string;
    drinks?: string;
    desserts?: string;
  };
}

export interface DeliverySettings {
  isEnabled: boolean;
  deliveryFee: number;
  freeDeliveryThreshold?: number;
  estimatedDeliveryMinutes: string;
  estimatedPickupMinutes: string;
  cancellationWindowSeconds: number; // default 180 seconds
  minOrderAmount?: number;
  deliveryAreas?: string[];
}

export interface CustomRestaurantDetailItem {
  id: string;
  label: string; // e.g. "Dining Ambience", "Dress Code", "Private Dining", "Dietary Certification", "Valet Parking"
  value: string; // e.g. "Candlelit Charcoal Hearth with Live Fire View", "Smart Casual • Traditional Welcome", "Private VIP Dining Hall available for up to 60 guests"
  icon?: 'map-pin' | 'clock' | 'phone' | 'mail' | 'utensils' | 'calendar' | 'truck' | 'sparkles' | 'award' | 'shield-check' | 'users' | 'flame' | 'star' | 'heart' | 'info';
  category?: 'general' | 'dining' | 'service' | 'policy' | 'special';
  order: number;
  isPublished: boolean;
}

export interface RestaurantDetailsBlockConfig {
  eyebrow: string; // e.g. "Restaurant Overview & Culinary Heritage"
  heading: string; // e.g. "Where Gastronomy Meets Soul, Craft & Heritage" or "About Our Restaurant"
  subheading?: string; // e.g. "A tribute to the ancient mastery of open-wood fire cooking and warm Pakistani hospitality."
  cuisineType?: string; // e.g. "Pakistani Fine Dining & Live Charcoal Hearth"
  reservationNotes?: string; // e.g. "Advance booking recommended for evening dinners and private dining rooms."
  deliveryNotes?: string; // e.g. "Freshly sealed insulated packaging to maintain ember heat and fragrant aroma."
  showCuisineBadge?: boolean;
  showLocationCard?: boolean;
  showHoursCard?: boolean;
  showContactCard?: boolean;
  showReservationCard?: boolean;
  showDeliveryCard?: boolean;
  showCustomDetails?: boolean;
  customDetails: CustomRestaurantDetailItem[];
}

export interface RestaurantConfig {
  name: string;
  legalName: string;
  tagline: string;
  subtitle: string;
  logoText?: string;
  aboutText: string;
  established: number;
  michelinGuide: string;
  awards: string[];
  currencySymbol: string; // e.g. "₨", "PKR", "Rs."
  currencyCode: string; // e.g. "PKR"
  contact: RestaurantContact;
  hours: OperatingHours[];
  social: RestaurantSocial;
  branding?: RestaurantBranding;
  deliverySettings?: DeliverySettings;
  paymentMethods?: PaymentMethodItem[];
  qrPayment?: QrPaymentConfig;
  aiAssistant?: AiAssistantConfig;
  food3d?: Food3DConfig;
  storyDetails?: RestaurantStoryDetails;
  customCategories?: CustomCategoryItem[];
  detailsBlock?: RestaurantDetailsBlockConfig;
  notificationSettings?: NotificationSettings;
  agencyCredit: {
    name: string;
    url: string;
    tagline: string;
  };
}

export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  highlight?: string;
}

export interface ChefProfile {
  name: string;
  role: string;
  image: string;
  bio: string;
  philosophy: string;
  accolades: string[];
  signatureDish: string;
}

export interface SeatingArea {
  id: string;
  name: string;
  description: string;
  capacity: string;
  image: string;
  ambiance: string;
}

export interface ReservationRequest {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: string;
  occasion: string;
  specialRequests?: string;
  wishlistDishes?: string[];
  createdAt?: string;
}

export interface ContactMessage {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  inquiryType: 'general' | 'private-dining' | 'press' | 'careers';
  message: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'gold';
}

export type OrderStatus = 
  | 'placed' 
  | 'confirming' 
  | 'preparing' 
  | 'ready_or_out_for_delivery' 
  | 'completed' 
  | 'cancelled';

export interface OrderItemEntry {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  image?: string;
  servingSize?: string;
  notes?: string;
}

export interface CustomerOrder {
  id: string;
  orderType: 'delivery' | 'pickup';
  customerName: string;
  phoneNumber: string;
  emailAddress?: string; // Optional (Email Address (Optional))
  deliveryAddress?: string; // Optional
  specialRequests?: string; // Dietary Requirements, Allergies & Special Requests (Optional)
  items: OrderItemEntry[];
  totalPrice: number;
  deliveryFee?: number;
  paymentMethod?: 'cod' | 'qr_payment' | 'card_on_delivery' | 'bank_transfer';
  paymentReference?: string;
  createdAt: number; // timestamp ms
  cancellationWindowSeconds: number; // 180 seconds (3 mins)
  status: OrderStatus;
  cancelledAt?: number;
}

export interface NashtaPointItem {
  id: string;
  name: string;
  category: 'all' | 'chai' | 'lassi' | 'paratha' | 'eggs' | 'halwa-puri' | 'chana' | 'combos' | 'specials' | string;
  categoryLabel?: string;
  description: string;
  price: number;
  originalPrice?: number;
  serves?: string;
  image: string;
  images?: string[];
  featuredImage?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  badge?: string; // e.g. "Desi Ghee", "Clay Matka", "Fresh Churned", "Morning Special"
  pairing?: string;
  dietary?: ('veg' | 'non-veg' | 'halal' | 'desi-ghee' | string)[];
  order?: number;
  timing?: string;
  offerText?: string;
}

export interface NashtaPointConfig {
  isEnabled: boolean;
  eyebrow: string;
  heading: string;
  tagline: string;
  description: string;
  timingBadge: string;
  featuredOfferText?: string;
  featuredOfferCode?: string;
  showOfferBanner?: boolean;
  heroImage?: string;
}

export interface OwnerAuthSession {
  isAuthenticated: boolean;
  username: string;
  loginTime: string;
  role: 'owner' | 'manager';
}
