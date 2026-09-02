import { 
  MenuItem, 
  ReviewItem, 
  GalleryItem, 
  TimelineMilestone, 
  ChefMember,
  ChefProfile, 
  SeatingArea,
  OfferItem,
  EventItem,
  SpecialRecipeItem,
  SoftDrinkItem,
  DrinkSizeOption,
  DessertBarItem,
  RestaurantConfig,
  DealItem,
  NashtaPointItem,
  NashtaPointConfig
} from '../types';

export const DEFAULT_DEMO_QR_CODE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="320" height="320"><rect width="320" height="320" fill="%23ffffff" rx="20"/><g fill="%2314110f"><rect x="30" y="30" width="76" height="76" rx="12"/><rect x="42" y="42" width="52" height="52" fill="%23ffffff" rx="6"/><rect x="52" y="52" width="32" height="32" fill="%2314110f" rx="4"/><rect x="214" y="30" width="76" height="76" rx="12"/><rect x="226" y="42" width="52" height="52" fill="%23ffffff" rx="6"/><rect x="236" y="52" width="32" height="32" fill="%2314110f" rx="4"/><rect x="30" y="214" width="76" height="76" rx="12"/><rect x="42" y="226" width="52" height="52" fill="%23ffffff" rx="6"/><rect x="52" y="236" width="32" height="32" fill="%2314110f" rx="4"/><rect x="122" y="36" width="16" height="16"/><rect x="150" y="36" width="22" height="16"/><rect x="184" y="42" width="16" height="24"/><rect x="122" y="68" width="32" height="16"/><rect x="168" y="74" width="28" height="16"/><rect x="128" y="100" width="16" height="38"/><rect x="158" y="106" width="34" height="16"/><rect x="36" y="122" width="22" height="16"/><rect x="68" y="122" width="16" height="32"/><rect x="96" y="134" width="16" height="16"/><rect x="36" y="154" width="16" height="28"/><rect x="64" y="170" width="28" height="16"/><rect x="214" y="122" width="22" height="22"/><rect x="252" y="128" width="38" height="16"/><rect x="220" y="154" width="16" height="38"/><rect x="252" y="160" width="22" height="22"/><rect x="120" y="152" width="80" height="80" fill="%23d4af37" rx="10"/><text x="160" y="196" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="900" text-anchor="middle" fill="%2314110f" letter-spacing="1">SCAN TO PAY</text><rect x="122" y="244" width="28" height="16"/><rect x="160" y="238" width="22" height="28"/><rect x="194" y="254" width="16" height="22"/><rect x="224" y="214" width="28" height="22"/><rect x="262" y="220" width="28" height="16"/><rect x="224" y="250" width="22" height="38"/><rect x="256" y="250" width="34" height="22"/><rect x="36" y="192" width="22" height="12"/><rect x="74" y="192" width="16" height="12"/><rect x="122" y="278" width="22" height="12"/><rect x="154" y="278" width="44" height="12"/><rect x="208" y="278" width="12" height="12"/></g></svg>`;

export const RESTAURANT_CONFIG: RestaurantConfig = {
  name: 'SITE FOR SALE',
  legalName: 'Site For Sale Restaurant Demo',
  tagline: 'Bold Flavours. Unforgettable Moments.',
  subtitle: 'A refined dining experience where fire, flavour and craftsmanship come together.',
  aboutText: 'SITE FOR SALE is a luxury Pakistani fine-dining showcase celebrating ancestral charcoal pit cooking, copper deg slow-braising, and signature Karahi craftsmanship with unmatched elegance.',
  established: 2020,
  michelinGuide: 'Culinary Excellence Recommended',
  awards: ['Best Fine Dining Hospitality Showcase', 'Master of Charcoal & Spice Award', 'Heritage Gastronomy Trophy'],
  currencySymbol: '₨',
  currencyCode: 'PKR',
  
  contact: {
    address: 'Ilahiabad, Pakistan',
    city: 'Ilahiabad, Pakistan',
    phone: '[+92 XXX XXXXXXX]',
    phoneClean: '+923000000000',
    whatsapp: '[WhatsApp Number]',
    whatsappClean: '923000000000',
    email: '[Email Address]',
    eventsEmail: '[Events Email Address]',
    pressEmail: '[Press Email Address]',
  },

  hours: [
    { days: 'Monday – Thursday', lunch: '12:30 PM – 3:30 PM', dinner: '6:30 PM – 11:30 PM' },
    { days: 'Friday', lunch: '1:30 PM – 4:00 PM', dinner: '6:30 PM – 12:30 AM' },
    { days: 'Saturday – Sunday', lunch: '12:30 PM – 4:00 PM', dinner: '6:30 PM – 12:30 AM' },
    { days: 'Late Night Hearth Lounge', lunch: 'Daily from 10:00 PM', dinner: 'Tea, Desserts & Charcoal Delicacies' }
  ],

  social: {
    instagram: '[Instagram Link]',
    facebook: '[Facebook Link]',
    twitter: '[Twitter Link]',
    tripadvisor: '[TripAdvisor Link]',
    tiktok: '[TikTok Link]'
  },

  branding: {
    heroHeadline: 'Authentic Fire, Flavour & Charcoal Artistry',
    heroSubtitle: 'Hand-slaughtered grass-fed lamb, Shanwari Karahi, and copper-braised delicacies prepared over glowing binchotan embers.',
    primaryColor: '#d4af37',
    accentColor: '#f97316',
    categoryVisuals: {
      food: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      deals: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      drinks: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=80',
      desserts: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
    }
  },

  food3d: {
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
  },

  storyDetails: {
    heroTitle: 'The Living Hearth & Primal Flavor',
    heroSubtitle: 'Authentic Live-Fire Gastronomy Meets Modern Luxury',
    storyChapter1Title: 'Ancestral Fire Craftsmanship',
    storyChapter1Content: 'Born from a reverence for ancestral live-fire hearth cooking, our kitchen operates without gas shortcuts. Every dish is tempered over natural hardwood lump charcoal, wood embers, and cast-iron degs to extract deep aromatic complexity.',
    storyChapter2Title: 'Heirloom Spices & Terroir Sourcing',
    storyChapter2Content: 'From single-estate black cumin to stone-ground wild coriander and pasture-raised mountain lamb, every ingredient is selected daily from ethical heritage growers.',
    culinaryPhilosophy: 'We cook with flame because living fire cannot be replicated by machinery. It imparts a soul, a char, and an aroma that connects us to thousands of years of culinary heritage.',
    cuisineType: 'Pakistani Hearth Fine Dining & Charcoal Specialities',
    amenities: [
      'Live Charcoal Hearth Open Kitchen',
      'VIP Private Dining Lounges',
      'Complimentary Valet Parking',
      '100% Halal Certified Meats',
      'Open-Air Ember Terrace Seating',
      'Wheelchair Accessible Entrances',
      'Dedicated Family Dining Hall',
      'High-Speed Guest Wi-Fi'
    ],
    seatingCapacity: '160 Guests (Indoor Fine Dining & Terrace)',
    seatingDescription: 'Intimate candlelit booths, executive roundtables for banquets, and an atmospheric open-hearth viewing counter.',
    reservationNotice: 'Reservations recommended for dinner and weekend sittings. Walk-ins welcomed subject to table availability.',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85',
    interiorImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    hearthImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
  },

  detailsBlock: {
    eyebrow: 'Restaurant Overview & Culinary Heritage',
    heading: 'Where Gastronomy Meets Soul, Craft & Heritage',
    subheading: 'A tribute to the ancient mastery of open-wood fire cooking, heirloom spices, and unforgettable hospitality.',
    cuisineType: 'Pakistani Hearth Fine Dining & Charcoal Specialities',
    reservationNotes: 'Advance reservations recommended for dinner seatings and private VIP rooms. Walk-ins welcomed subject to availability.',
    deliveryNotes: 'Temperature-sealed insulated delivery keeping dishes sizzling hot from our hearth to your doorstep.',
    showCuisineBadge: true,
    showLocationCard: true,
    showHoursCard: true,
    showContactCard: true,
    showReservationCard: true,
    showDeliveryCard: true,
    showCustomDetails: true,
    customDetails: [
      {
        id: 'det-1',
        label: 'Ancestral Live Hearth',
        value: 'Pure chemical-free white binchotan coals and iron woks without gas shortcuts.',
        icon: 'flame',
        category: 'dining',
        order: 1,
        isPublished: true
      },
      {
        id: 'det-2',
        label: 'Stone-Ground Spices',
        value: 'Single-origin spices stone-milled in-house daily to preserve aromatic essential oils.',
        icon: 'sparkles',
        category: 'dining',
        order: 2,
        isPublished: true
      },
      {
        id: 'det-3',
        label: '100% Halal Certified',
        value: 'Hand-slaughtered grass-fed meats, fresh Himalayan herbs, and certified ingredients.',
        icon: 'shield-check',
        category: 'policy',
        order: 3,
        isPublished: true
      },
      {
        id: 'det-4',
        label: 'VIP Private Dining & Valet',
        value: 'Intimate banquet suites for up to 60 guests with dedicated concierge and valet parking.',
        icon: 'award',
        category: 'service',
        order: 4,
        isPublished: true
      }
    ]
  },

  customCategories: [
    { id: 'cat-1', name: 'Starters & Kebabs', slug: 'starters', description: 'Charcoal skewers, samosas & appetisers', order: 1, isPublished: true, badgeText: 'Popular' },
    { id: 'cat-2', name: 'Main Courses & Karahi', slug: 'main-courses', description: 'Clay-pot handis & wok specials', order: 2, isPublished: true, badgeText: 'Signature' },
    { id: 'cat-3', name: 'Live Grills & Steaks', slug: 'grills', description: 'Flame-seared chops & tomahawks', order: 3, isPublished: true },
    { id: 'cat-4', name: 'Artisan Burgers', slug: 'burgers', description: 'Brioche buns & smoked patties', order: 4, isPublished: true },
    { id: 'cat-5', name: 'Handcrafted Pasta', slug: 'pasta', description: 'Freshly rolled pasta & sauces', order: 5, isPublished: true },
    { id: 'cat-6', name: 'Coastal Seafood', slug: 'seafood', description: 'Fresh king prawns & sea bass', order: 6, isPublished: true },
    { id: 'cat-7', name: 'Dessert Bar & Gelato', slug: 'desserts', description: 'Hot skillets, shakes & kulfi', order: 7, isPublished: true, badgeText: 'Sweet' },
    { id: 'cat-8', name: 'Chilled Drinks & Coolers', slug: 'soft-drinks', description: 'Ice-cold sodas, shakes & coolers', order: 8, isPublished: true },
    { id: 'cat-9', name: "Chef's Hearth Specials", slug: 'specials', description: 'Rare seasonal master creations', order: 9, isPublished: true, badgeText: 'Exclusive' }
  ],

  deliverySettings: {
    isEnabled: true,
    deliveryFee: 150,
    freeDeliveryThreshold: 2500,
    estimatedDeliveryMinutes: '35-45 mins',
    estimatedPickupMinutes: '20-25 mins',
    cancellationWindowSeconds: 180,
    minOrderAmount: 500,
    deliveryAreas: ['Ilahiabad', 'Gulberg', 'DHA', 'Cantt', 'Model Town', 'Bahria']
  },

  paymentMethods: [
    { name: 'Cash', icon: 'Banknote', desc: 'Direct cash payment upon bill presentation' },
    { name: 'Debit & Credit Cards', icon: 'CreditCard', desc: 'Visa, MasterCard, PayPak & UnionPay' },
    { name: 'Online Bank Transfer', icon: 'Building2', desc: 'Direct inter-bank IBAN transfer' },
    { name: 'Easypaisa', icon: 'Smartphone', desc: 'Instant mobile wallet scan & transfer' },
    { name: 'JazzCash', icon: 'QrCode', desc: 'Quick QR code or account payment' }
  ],

  qrPayment: {
    isEnabled: true,
    qrCodeImage: DEFAULT_DEMO_QR_CODE,
    accountName: 'Official Merchant Account (Raast / Wallet)',
    accountNumber: '+92 300 0000000',
    bankOrWalletName: 'Raast Instant QR • JazzCash • Easypaisa • All Bank Apps',
    instructions: 'Scan the QR code with your supported payment app to make your payment.',
    enableCashOnDelivery: true,
    enableCardOnDelivery: true,
    enableBankTransfer: false,
  },

  aiAssistant: {
    isEnabled: true,
    assistantName: 'Ember & Spice Assistant',
    greeting: 'Aap ka shukria hamare restaurant mein aane ke liye.',
    avatarIcon: 'billa-cat',
    welcomeMessage: 'Ember & Spice ke menu, deals, fine dining experience, locations aur reservations ke bare mein kuch bhi pooch sakte hain!',
    language: 'roman-urdu',
    temperature: 0.6,
    customNotes: 'Fresh charcoal cooking, live hearth specialities, family dining hall available.',
    enabledSections: {
      menuAndFood: true,
      ordersAndCheckout: true,
      reservations: true,
      eventsAndOffers: true,
      restaurantInfo: true,
      reviewsAndGallery: true,
    }
  },

  agencyCredit: {
    name: 'OYRO WEB',
    url: 'https://oyroweb.com',
    tagline: 'Crafted as a flagship web-design showcase by OYRO WEB for premium Pakistani hospitality.'
  }
};

export const MENU_ITEMS: MenuItem[] = [
  // STARTERS (6 items)
  {
    id: 'starter-1',
    name: 'Charcoal Mutton Seekh Kebab',
    category: 'starters',
    description: 'Minced prime hill-mutton infused with smoked cloves, roasted cumin, raw papaya, and mint coriander chutney.',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isGlutenFree: true,
    spiceLevel: 2,
    pairingNote: 'Smoked Mint & Cumin Lemonade'
  },
  {
    id: 'starter-2',
    name: 'Silken Chicken Malai Boti',
    category: 'starters',
    description: 'Tender corn-fed chicken morsels marinated in thick clotted cream, white pepper, green cardamom, and smoked over applewood.',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isGlutenFree: true,
    spiceLevel: 1,
    pairingNote: 'Saffron Cardamom Lassi'
  },
  {
    id: 'starter-3',
    name: 'Crispy Lahori Fish Bites',
    category: 'starters',
    description: 'Fresh river Sole fillets crusted in spiced gram flour, crushed ajwain seeds, and pomegranate reduction.',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isNew: true,
    spiceLevel: 2,
    pairingNote: 'Fresh Iced Mint Lemonade'
  },
  {
    id: 'starter-4',
    name: 'Charred Stuffed Paneer Tikka',
    category: 'starters',
    description: 'Fresh organic cottage cheese layered with mint pistachio pesto, charred in tandoor with bell peppers and roasted onion.',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    isGlutenFree: true,
    spiceLevel: 1,
    pairingNote: 'Karak Chai Infusion'
  },
  {
    id: 'starter-5',
    name: 'Artisanal Beef Chapli Sliders',
    category: 'starters',
    description: 'Peshawari style pan-fried beef patties with crushed pomegranate seeds, dry coriander, and tamarind glaze on mini brioche.',
    price: 1550,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    spiceLevel: 3,
    pairingNote: 'Rooh Afza Botanical Sparkler'
  },
  {
    id: 'starter-6',
    name: 'Ember Dahi Sev Puri Shells',
    category: 'starters',
    description: 'Crisp semolina spheres filled with spiced chickpeas, whipped sweetened yogurt, tamarind reduction, and fine roasted sev.',
    price: 850,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    spiceLevel: 1
  },

  // SOUPS & SALADS (4 items)
  {
    id: 'soup-1',
    name: 'Fire-Roasted Shorba with Pulled Mutton',
    category: 'soups-salads',
    description: 'Aromatic slow-simmered bone broth enriched with black cardamom, cinnamon bark, fresh coriander, and tender pulled mutton.',
    price: 950,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    isGlutenFree: true,
    spiceLevel: 2
  },
  {
    id: 'soup-2',
    name: 'Smoked Tomato & Roasted Cumin Bisque',
    category: 'soups-salads',
    description: 'Charred field tomatoes pureed with tempered cumin, garlic pearls, and fresh cream dollop with crispy garlic naan croutons.',
    price: 850,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    spiceLevel: 1
  },
  {
    id: 'soup-3',
    name: 'Kachumber & Pomegranate Walnut Salad',
    category: 'soups-salads',
    description: 'Crisp diced Persian cucumber, heritage vine tomatoes, pickled red onions, fresh mint leaves, roasted walnuts, and lemon sumac dressing.',
    price: 750,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    id: 'soup-4',
    name: 'Roasted Beetroot & Smoked Paneer Salad',
    category: 'soups-salads',
    description: 'Ember-charred beetroots, house-smoked paneer cubes, candied pistachios, arugula, and wildflower honey dressing.',
    price: 1150,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    isGlutenFree: true
  },

  // MAIN COURSES (8 items)
  {
    id: 'main-1',
    name: 'Signature Shanwari Mutton Karahi',
    category: 'main-courses',
    description: 'Tender baby goat simmered in a cast-iron wok with fresh crushed tomatoes, green chillies, ginger juliennes, and organic black pepper. No onions, pure meat essence.',
    price: 3450,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isFeatured: true,
    isGlutenFree: true,
    spiceLevel: 2,
    pairingNote: 'Garlic Butter Naan & Mint Raita'
  },
  {
    id: 'main-2',
    name: 'Ember Smoky Chicken Handi',
    category: 'main-courses',
    description: 'Boneless chicken cubes cooked in a traditional clay handi with rich cashew nut paste, charcoal infused cream, and crushed fenugreek leaves.',
    price: 2450,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isFeatured: true,
    isGlutenFree: true,
    spiceLevel: 2,
    pairingNote: 'Roghani Sesame Naan'
  },
  {
    id: 'main-3',
    name: 'Slow-Braised Royal Nihari Shank',
    category: 'main-courses',
    description: '12-hour slow-cooked beef shank in velvety aromatic bone marrow gravy, served with fresh ginger slivers, fried onions, lemon, and tandoori kulcha.',
    price: 3850,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    spiceLevel: 3,
    pairingNote: 'Warm Roghani Naan & Lemon'
  },
  {
    id: 'main-4',
    name: 'Dum Pukht Special Mutton Biryani',
    category: 'main-courses',
    description: 'Long-grain aged basmati rice layered with succulent spiced mutton, saffron threads, dried plums, and sealed under dough crust to capture pure aromas.',
    price: 2250,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    isGlutenFree: true,
    spiceLevel: 2,
    pairingNote: 'Cucumber Zeera Raita'
  },
  {
    id: 'main-5',
    name: 'Velvet Daal Makhni Slow-Simmered',
    category: 'main-courses',
    description: 'Whole black lentils and kidney beans slow-simmered for 24 hours on charcoal hearth with white butter, cream, and smoked dried fenugreek.',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    isGlutenFree: true,
    spiceLevel: 1,
    pairingNote: 'Garlic Naan & Saffron Rice'
  },
  {
    id: 'main-6',
    name: 'Paneer Reshmi Karahi',
    category: 'main-courses',
    description: 'Fresh farm cottage cheese in rich tomato cream gravy with roasted capsicum, ginger slivers, and fragrant coriander seeds.',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    isGlutenFree: true,
    spiceLevel: 1
  },
  {
    id: 'main-7',
    name: 'Saffron Pulao with Fried Almonds',
    category: 'main-courses',
    description: 'Delicate basmati rice cooked in fragrant whole spice broth infused with pure Kashmiri saffron and toasted slivered nuts.',
    price: 850,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    id: 'main-8',
    name: 'Tandoori Bread Basket (Naan Trio)',
    category: 'main-courses',
    description: 'Selection of fresh hearth breads: Garlic Butter Naan, Roghani Sesame Naan, and Cheese-Stuffed Kulcha with nigella seeds.',
    price: 950,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true
  },

  // GRILLS & BBQ (5 items)
  {
    id: 'grill-1',
    name: 'Grand Ember Royal BBQ Platter',
    category: 'grills',
    description: 'A feast of Malai Boti, Mutton Seekh Kebabs, Kasturi Chicken Tikka, Smoked Lamb Chops, and Fish Tikka served over live smoking charcoal brazier with dips and naans.',
    price: 5800,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isFeatured: true,
    isGlutenFree: true,
    spiceLevel: 2,
    pairingNote: 'Serves 3–4 persons with complimentary chutneys and bread'
  },
  {
    id: 'grill-2',
    name: 'Prime Flame-Seared Mutton Chops',
    category: 'grills',
    description: 'Four rib chops marinated in raw papaya, roasted cumin, black pepper, and yogurt, grilled over red-hot binchotan charcoal.',
    price: 3950,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isGlutenFree: true,
    spiceLevel: 2
  },
  {
    id: 'grill-3',
    name: 'Smoked Beef Bihari Boti',
    category: 'grills',
    description: 'Paper-thin beef strips marinated in mustard oil, roasted gram, raw papaya, and aromatic Bihari masala, skewered and smoked to melt-in-the-mouth tenderness.',
    price: 2350,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80',
    isGlutenFree: true,
    spiceLevel: 3
  },
  {
    id: 'grill-4',
    name: 'Kasturi Chicken Tikka (Boneless)',
    category: 'grills',
    description: 'Boneless chicken thighs spiced with Kashmiri red chili, crushed dry fenugreek leaves (kasuri methi), hung curd, and mustard oil.',
    price: 1750,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    isGlutenFree: true,
    spiceLevel: 2
  },
  {
    id: 'grill-5',
    name: 'Charred Tandoori Jumbo Prawns',
    category: 'grills',
    description: 'Arabian Sea tiger prawns marinated in turmeric, crushed ajwain, lemon zest, and hung yogurt, charred over active coals.',
    price: 3600,
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isGlutenFree: true,
    spiceLevel: 2
  },

  // BURGERS & CASUAL (4 items)
  {
    id: 'burger-1',
    name: 'The Ember Wagyu Chapli Gourmet Burger',
    category: 'burgers',
    description: 'Coarse-ground spiced beef patty with roasted coriander, fried tomato slice, smoked cheddar, mint aioli on toasted brioche bun with spiced masala fries.',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isFeatured: true,
    spiceLevel: 2
  },
  {
    id: 'burger-2',
    name: 'Crispy Fire-Bird Tikka Burger',
    category: 'burgers',
    description: 'Double buttermilk fried chicken breast drenched in spicy tandoori glaze, crunchy purple cabbage slaw, and green garlic mayo.',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    spiceLevel: 3
  },
  {
    id: 'burger-3',
    name: 'Pulled Smoked Lamb Brioche Roll',
    category: 'burgers',
    description: '10-hour smoked shredded lamb shoulder with caramelized onion jam, melted Monterey Jack, and pickled jalapeños on charcoal bun.',
    price: 1750,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    spiceLevel: 2
  },
  {
    id: 'burger-4',
    name: 'Grilled Paneer & Portobello Mushroom Burger',
    category: 'burgers',
    description: 'Thick grilled cottage cheese steak, charred portobello mushroom, mint coriander pesto, and crisp rocket leaves on toasted potato bun.',
    price: 1350,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true
  },

  // PASTA & FUSION (3 items)
  {
    id: 'pasta-1',
    name: 'Smoked Makhni Penne with Charred Tikka',
    category: 'pasta',
    description: 'Italian durum wheat penne tossed in our signature 24-hour slow-cooked butter tomato sauce, tender tandoori chicken, and shaved parmesan.',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    spiceLevel: 1
  },
  {
    id: 'pasta-2',
    name: 'Saffron Cream Tagliatelle with Tiger Prawns',
    category: 'pasta',
    description: 'Handmade ribbon pasta tossed in pure Kashmiri saffron infused cream, charred garlic prawns, and toasted pistachio crumb.',
    price: 2450,
    image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true
  },
  {
    id: 'pasta-3',
    name: 'Wild Morel & Truffle Cream Fettuccine',
    category: 'pasta',
    description: 'Wild Himalayan morels, black truffle butter, fresh herbs, and aged parmesan over bronze-cut fettuccine.',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true
  },

  // SEAFOOD (3 items)
  {
    id: 'seafood-1',
    name: 'Tandoori Whole Red Snapper',
    category: 'seafood',
    description: 'Fresh coastal Red Snapper scored and rubbed in cracked carom seeds, ginger garlic paste, and lemon zest, cooked whole over hot embers.',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isGlutenFree: true,
    spiceLevel: 2
  },
  {
    id: 'seafood-2',
    name: 'Charred Tiger Prawns with Tamarind Glaze',
    category: 'seafood',
    description: 'Jumbo prawns pan-seared with crushed dry spices, tangy tamarind reduction, and micro greens.',
    price: 3600,
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
    isGlutenFree: true,
    spiceLevel: 2
  },
  {
    id: 'seafood-3',
    name: 'Pan-Seared Lahori River Sole Fillet',
    category: 'seafood',
    description: 'Delicate river sole crusted with cracked coriander and black pepper, served on creamy mustard greens and saffron mash.',
    price: 2850,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    isGlutenFree: true
  },

  // DESSERTS (6 items)
  {
    id: 'dessert-1',
    name: 'Warm Shahi Tukra with Rabri Espuma',
    category: 'desserts',
    description: 'Crispy ghee-fried brioche steeped in saffron cardamom syrup, topped with 8-hour thickened rabri foam, silver vark, and crushed pistachios.',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isFeatured: true,
    isVegetarian: true
  },
  {
    id: 'dessert-2',
    name: 'Golden Rose Kunafa with Pistachio Crumb',
    category: 'desserts',
    description: 'Spun kataifi pastry baked with gooey akawi and mozzarella cheese, soaked in hot damask rose water syrup and toasted emerald pistachios.',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isVegetarian: true
  },
  {
    id: 'dessert-3',
    name: 'Heritage Pistachio & Saffron Matka Kulfi',
    category: 'desserts',
    description: 'Slow-churned frozen cream infused with Iranian saffron, green cardamom, and roasted pistachios, served in traditional earthen pot with falooda noodles.',
    price: 850,
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    id: 'dessert-4',
    name: 'Hot Gulab Jamun with Cardamom Cream',
    category: 'desserts',
    description: 'Khoya dumplings fried in pure desi ghee, soaked in rose syrup, served warm with vanilla bean cream and almond slivers.',
    price: 750,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true
  },
  {
    id: 'dessert-5',
    name: 'Royal Gajar Halwa Tart with Khoya Crumble',
    category: 'desserts',
    description: 'Winter red carrot pudding slow-cooked in pure milk and desi ghee, encased in almond butter pastry tart with pistachio dust.',
    price: 950,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true
  },
  {
    id: 'dessert-6',
    name: 'Smoked Dark Chocolate & Cardamom Dome',
    category: 'desserts',
    description: '70% dark chocolate dome with molten salted caramel cardamom center, table-side warm chocolate ganache pour.',
    price: 1350,
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true
  },

  // SIGNATURE DRINKS (6 items)
  {
    id: 'drink-1',
    name: 'Traditional Clay Pot Karak Chai',
    category: 'signature-drinks',
    description: 'Strong black tea slow-boiled with whole spices, evaporated milk, and cardamom, served in unglazed earthen clay cups.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true
  },
  {
    id: 'drink-2',
    name: 'Royal Pink Kashmiri Chai (Noon Chai)',
    category: 'signature-drinks',
    description: 'Traditional slow-brewed pink green tea leaves with sea salt, baking soda, creamy milk, and generous crushed almonds and pistachios.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isVegetarian: true
  },
  {
    id: 'drink-3',
    name: 'Smoked Mint & Cumin Lemonade',
    category: 'signature-drinks',
    description: 'Fresh lemon juice, garden mint extract, roasted cumin powder, black Himalayan rock salt, and sparkling soda.',
    price: 550,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    id: 'drink-4',
    name: 'Rooh Afza Botanical Sparkler',
    category: 'signature-drinks',
    description: 'Refined herbal rose infusion, sweet basil seeds (tukh malanga), fresh lime squeeze, and sparkling mineral water.',
    price: 600,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    id: 'drink-5',
    name: 'Saffron & Cardamom Silk Lassi',
    category: 'signature-drinks',
    description: 'Thick churned farm yogurt, soaked Kashmiri saffron, green cardamom powder, and crushed pistachios.',
    price: 650,
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
    isGlutenFree: true
  },
  {
    id: 'drink-6',
    name: 'Ember Smoked Botanical Cooler',
    category: 'signature-drinks',
    description: 'Smoked pomegranate juice, charred rosemary sprig, fresh ginger extract, and sparkling tonic water.',
    price: 750,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isVegetarian: true,
    isGlutenFree: true
  },

  // SOFT DRINKS & POPULAR PAKISTANI BEVERAGES
  {
    id: 'sd-pepsi',
    name: 'Pepsi-Cola (Chilled)',
    category: 'soft-drinks',
    description: 'Original crisp, refreshing cola served ice-cold with fresh lemon slice and chilled crystal glassware.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isGlutenFree: true,
    isVegetarian: true
  },
  {
    id: 'sd-coca-cola',
    name: 'Coca-Cola Classic',
    category: 'soft-drinks',
    description: 'The timeless classic effervescent cola, served frosty cold with ice and citrus garnish.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isGlutenFree: true,
    isVegetarian: true
  },
  {
    id: 'sd-sprite',
    name: 'Sprite Lemon-Lime',
    category: 'soft-drinks',
    description: 'Crisp, clean, 100% natural lemon and lime sparkling soft drink served over crushed mountain ice.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isGlutenFree: true,
    isVegetarian: true
  },
  {
    id: 'sd-7up',
    name: '7UP Crisp Refreshment',
    category: 'soft-drinks',
    description: 'Iconic caffeine-free lemon-lime soda with bubbly effervescence, perfectly pairing with spicy karahi and grills.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isGlutenFree: true,
    isVegetarian: true
  },
  {
    id: 'sd-mirinda',
    name: 'Mirinda Orange Fizz',
    category: 'soft-drinks',
    description: 'Vibrant and zesty orange citrus soft drink bursting with fruity sweetness and fizzy sparkle.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isGlutenFree: true,
    isVegetarian: true
  },
  {
    id: 'sd-mountain-dew',
    name: 'Mountain Dew (Do The Dew)',
    category: 'soft-drinks',
    description: 'High-citrus exhilarating soda with intense punch, served chilled.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isGlutenFree: true,
    isVegetarian: true
  },
  {
    id: 'sd-gourmet-cola',
    name: 'Gourmet Cola (Heritage Classic)',
    category: 'soft-drinks',
    description: 'Pakistan’s celebrated indigenous cola brewed with pure cane sweetness, subtle vanilla, and deep carbonation.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isAvailable: true,
    isGlutenFree: true,
    isVegetarian: true
  },
  {
    id: 'sd-next-cola',
    name: 'Next Cola (Pakistani Pride)',
    category: 'soft-drinks',
    description: 'Pakistan’s top trending premium cola crafted by Mezan Group, known for its ultra-smooth bubbles and rich caramel profile.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isFeatured: true,
    isAvailable: true,
    isGlutenFree: true,
    isVegetarian: true
  },
  {
    id: 'sd-pakola-ice-cream',
    name: 'Pakola Ice Cream Soda (National Icon)',
    category: 'soft-drinks',
    description: 'The legendary emerald-green sparkling soda of Pakistan since 14th August 1950, infused with creamy vanilla and botanical essence.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    isFeatured: true,
    isAvailable: true,
    isGlutenFree: true,
    isVegetarian: true
  }
];

export const SOFT_DRINKS: SoftDrinkItem[] = [
  // 1. PEPSI
  {
    id: 'drink-pepsi',
    name: 'Pepsi-Cola',
    brand: 'PepsiCo Pakistan',
    category: 'carbonated',
    description: 'The global classic crisp cola offering bold effervescence and balanced sweetness. Served with ice and fresh lemon.',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Bold Caramel & Crisp Sweet Fizz',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Chilled', 'Classic', 'Pair with Grills'],
    sizes: [
      { size: '250ml Slim Can', price: 140, isPopular: true },
      { size: '345ml Glass Bottle', price: 120 },
      { size: '500ml PET Bottle', price: 190 },
      { size: '1.5L Family Sharing', price: 290 }
    ]
  },
  // 2. COCA-COLA
  {
    id: 'drink-coca-cola',
    name: 'Coca-Cola Classic',
    brand: 'The Coca-Cola Company Pakistan',
    category: 'carbonated',
    description: 'The original iconic red refreshment. Distinctive kola nut extract and fine bubbles served at freezing point.',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Rich Kola Nut, Spice Oils & Refreshing Bite',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Chilled', 'Global Icon', 'Biryani Pairing'],
    sizes: [
      { size: '250ml Slim Can', price: 140, isPopular: true },
      { size: '345ml Glass Bottle', price: 120 },
      { size: '500ml PET Bottle', price: 190 },
      { size: '1.5L Family Sharing', price: 290 }
    ]
  },
  // 3. SPRITE
  {
    id: 'drink-sprite',
    name: 'Sprite Lemon-Lime',
    brand: 'The Coca-Cola Company Pakistan',
    category: 'carbonated',
    description: 'Crisp, clean, caffeine-free lemon-lime soda delivering instant thirst quenching cut through rich gravies.',
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Zesty Citrus, Lime Peel & Clean Fizz',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Caffeine-Free', 'Crisp Lime', 'Karahi Pairing'],
    sizes: [
      { size: '250ml Slim Can', price: 140, isPopular: true },
      { size: '345ml Glass Bottle', price: 120 },
      { size: '500ml PET Bottle', price: 190 },
      { size: '1.5L Family Sharing', price: 290 }
    ]
  },
  // 4. 7UP
  {
    id: 'drink-7up',
    name: '7UP Refreshment',
    brand: 'PepsiCo Pakistan',
    category: 'carbonated',
    description: 'The beloved lemon-lime beverage widely enjoyed at Pakistani weddings and dawat banquets for easy digestion.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Sparkling Lemon, Lime & Gentle Carbonation',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Dawat Favorite', 'Digestive Fizz', 'Ice Cold'],
    sizes: [
      { size: '250ml Slim Can', price: 140, isPopular: true },
      { size: '345ml Glass Bottle', price: 120 },
      { size: '500ml PET Bottle', price: 190 },
      { size: '1.5L Family Sharing', price: 290 }
    ]
  },
  // 5. MIRINDA
  {
    id: 'drink-mirinda',
    name: 'Mirinda Orange',
    brand: 'PepsiCo Pakistan',
    category: 'carbonated',
    description: 'Bursting with luscious orange flavor and playful fizzy bubbles. Sweet, tangy, and deeply satisfying.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Sun-Ripened Orange, Citrus Zest & Sweet Sparkle',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Fruity', 'Orange Zing', 'Kids & Family'],
    sizes: [
      { size: '250ml Slim Can', price: 140, isPopular: true },
      { size: '500ml PET Bottle', price: 190 },
      { size: '1.5L Family Sharing', price: 290 }
    ]
  },
  // 6. MOUNTAIN DEW
  {
    id: 'drink-mountain-dew',
    name: 'Mountain Dew',
    brand: 'PepsiCo Pakistan',
    category: 'carbonated',
    description: 'Exhilarating, high-citrus green sparkler with maximum refreshment. An all-time youth favorite in Pakistan.',
    image: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Electric Citrus, Lime & Punchy Fizz',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['High Citrus', 'Bold', 'Charcoal Grills'],
    sizes: [
      { size: '250ml Slim Can', price: 140, isPopular: true },
      { size: '500ml PET Bottle', price: 190 },
      { size: '1.5L Family Sharing', price: 290 }
    ]
  },
  // 7. GOURMET COLA
  {
    id: 'drink-gourmet-cola',
    name: 'Gourmet Cola',
    brand: 'Gourmet Foods Pakistan',
    category: 'local-heritage',
    description: 'The pioneering Pakistani local cola brand. Smooth carbonation with deep aromatic caramel notes.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Rich Roasted Caramel, Vanilla & Soft Fizz',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Classic Heritage', 'Proudly Pakistani', 'Value Choice'],
    sizes: [
      { size: '300ml Can', price: 110, isPopular: true },
      { size: '500ml PET Bottle', price: 140 },
      { size: '1.5L Family Sharing', price: 220 }
    ]
  },
  // 8. NEXT COLA
  {
    id: 'drink-next-cola',
    name: 'Next Cola',
    brand: 'Mezan Group Pakistan',
    category: 'local-heritage',
    description: 'Pakistan’s fastest-growing national cola. Crafted with premium ingredients, crystal mountain water, and a smooth refreshing punch.',
    image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Balanced Caramel, Vanilla Undertones & Micro-Bubbles',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Trending National Brand', '100% Pakistani', 'Top Seller'],
    sizes: [
      { size: '250ml Slim Can', price: 120, isPopular: true },
      { size: '500ml PET Bottle', price: 160 },
      { size: '1.5L Family Sharing', price: 250 }
    ]
  },
  // 9. PAKOLA ICE CREAM SODA
  {
    id: 'drink-pakola-soda',
    name: 'Pakola Ice Cream Soda',
    brand: 'Pakola Heritage Pakistan',
    category: 'local-heritage',
    description: '“Dil Bola Pakola!” The iconic emerald green soda of Pakistan since 1950. Unique velvety ice-cream vanilla and floral essence.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Creamy Vanilla, Sweet Rose & Emerald Sparkle',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['National Heritage 1950', 'Green Icon', 'Legendary Taste'],
    sizes: [
      { size: '250ml Slim Can', price: 140, isPopular: true },
      { size: '500ml PET Bottle', price: 180 },
      { size: '1.5L Family Sharing', price: 280 }
    ]
  },
  // 10. PAKOLA LYCHEE FIZZ
  {
    id: 'drink-pakola-lychee',
    name: 'Pakola Lychee Sparkler',
    brand: 'Pakola Heritage Pakistan',
    category: 'local-heritage',
    description: 'Exotic Pakistani lychee fruit nectar charged with gentle carbonation and served over crushed rose ice.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Sweet Tropical Lychee & Floral Nectar',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Tropical', 'Pakola Range', 'Fragrant'],
    sizes: [
      { size: '250ml Slim Can', price: 140, isPopular: true },
      { size: '500ml PET Bottle', price: 180 }
    ]
  },
  // 11. GOURMET LEMON UP
  {
    id: 'drink-gourmet-lemon-up',
    name: 'Gourmet Lemon Up',
    brand: 'Gourmet Foods Pakistan',
    category: 'local-heritage',
    description: 'Pakistani-crafted sparkling lemon soda with a lively citrus punch, great alongside mutton chops.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Zesty Mountain Lemon & Pure Carbonation',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Lahori Flavor', 'Lemon Zing', 'Crisp'],
    sizes: [
      { size: '300ml Can', price: 110 },
      { size: '1.5L Family Sharing', price: 220 }
    ]
  },
  // 12. GOURMET APPLE
  {
    id: 'drink-gourmet-apple',
    name: 'Gourmet Crisp Apple Fizz',
    brand: 'Gourmet Foods Pakistan',
    category: 'local-heritage',
    description: 'Golden apple sparkling soda prepared with sweet apple essence and uplifting bubbly finish.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Crisp Green Apple & Honey Sweetness',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Apple Crisp', 'Pakistani', 'Refreshing'],
    sizes: [
      { size: '300ml Can', price: 110 },
      { size: '1.5L Family Sharing', price: 220 }
    ]
  },
  // 13. NEXT COLA ZERO / DIET
  {
    id: 'drink-next-zero',
    name: 'Next Cola Zero Sugar',
    brand: 'Mezan Group Pakistan',
    category: 'diet-zero',
    description: 'All the robust Next Cola taste with zero sugar and zero calories. Perfect for health-conscious diners.',
    image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Sugar-Free Caramel Cola with Clean Crisp Finish',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['0 Sugar', '0 Calories', 'Diabetic Friendly'],
    sizes: [
      { size: '250ml Slim Can', price: 130, isPopular: true },
      { size: '500ml PET Bottle', price: 170 },
      { size: '1.5L Family Sharing', price: 260 }
    ]
  },
  // 14. DIET COCA-COLA
  {
    id: 'drink-diet-coke',
    name: 'Coca-Cola Zero Sugar / Diet',
    brand: 'The Coca-Cola Company Pakistan',
    category: 'diet-zero',
    description: 'Classic full flavor with zero calories and zero sugar, served ice cold with lemon slice.',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Sugar-Free Effervescent Kola Taste',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Zero Sugar', 'Diet', 'Light'],
    sizes: [
      { size: '250ml Slim Can', price: 150, isPopular: true },
      { size: '500ml PET Bottle', price: 200 }
    ]
  },
  // 15. DIET 7UP
  {
    id: 'drink-diet-7up',
    name: 'Diet 7UP Free (Sugar-Free)',
    brand: 'PepsiCo Pakistan',
    category: 'diet-zero',
    description: 'Clear crisp lemon-lime refreshment with zero sugar, zero calories, and zero guilt.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Sugar-Free Lemon-Lime & Clean Sparkling Note',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Zero Sugar', 'Calorie Free', 'Caffeine Free'],
    sizes: [
      { size: '250ml Slim Can', price: 150, isPopular: true },
      { size: '500ml PET Bottle', price: 200 }
    ]
  },
  // 16. STING BERRY RUSH
  {
    id: 'drink-sting',
    name: 'Sting Berry Rush Sparkler',
    brand: 'PepsiCo Pakistan',
    category: 'energy-refreshers',
    description: 'Electric red strawberry-infused sparkling energy drink with caffeine, taurine, and B-vitamins.',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Sweet Wild Berry, Strawberry Sparkle & Energizing Kick',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Energy Sparkler', 'Berry Rush', 'Ice Chilled'],
    sizes: [
      { size: '250ml Slim Can', price: 160, isPopular: true },
      { size: '300ml Bottle', price: 140 },
      { size: '500ml PET Bottle', price: 200 }
    ]
  },
  // 17. GOURMET COLA / NEXT COLA
  {
    id: 'drink-pak-cola-sparkler',
    name: 'Gourmet Cola / Next Cola (Ice Cold)',
    brand: 'Pakistani Heritage Bottlers',
    category: 'local-heritage',
    description: 'Iconic Pakistani local cola with bold aromatic caramel undertones and crisp effervescent sparkle.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Bold Caramel, Aromatic Spices & Deep Crisp Fizz',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Pakistani Heritage', 'Crisp Caramel', 'Ice Chilled'],
    sizes: [
      { size: '250ml Can', price: 120, isPopular: true },
      { size: '500ml PET Bottle', price: 180 },
      { size: '1.5L Family Bottle', price: 260 }
    ]
  },
  // 18. NATURAL MINERAL WATER (AQUAFINA / NESTLÉ)
  {
    id: 'drink-water',
    name: 'Nestlé Pure Life / Aquafina Mineral Water',
    brand: 'Nestlé & PepsiCo Pakistan',
    category: 'water-juices',
    description: 'Pure, multi-stage filtered mountain mineral water with essential balanced minerals. Served chilled or room temperature.',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Crystal Clear & Pure Hydration',
    temperature: 'Chilled',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Pure Spring Hydration', 'Chilled or Room Temp', 'Essential'],
    sizes: [
      { size: '500ml Single PET', price: 90 },
      { size: '1.5L Table Bottle', price: 160, isPopular: true }
    ]
  },
  // 19. TRADITIONAL ROOH AFZA BOTANICAL SPARKLER
  {
    id: 'drink-rooh-afza',
    name: 'Royal Rooh Afza Botanical Sparkler',
    brand: 'Hamdard Pakistan Heritage',
    category: 'traditional',
    description: 'The century-old natural herbal elixir made with distillates of damask rose, kewra, and herbs, combined with lime and chia seeds.',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Damask Rose, Kewra Distillate, Lemon & Tukh Malanga',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['100-Year Heritage', 'Summer Cooler', 'Rose Herbal'],
    sizes: [
      { size: '350ml Tall Crystal Goblet', price: 350, isPopular: true },
      { size: '1.2L Sharing Pitcher', price: 850 }
    ]
  },
  // 20. SMOKED MINT & CUMIN SHIKANJVI LEMONADE
  {
    id: 'drink-lemonade',
    name: 'Smoked Mint & Cumin Shikanjvi',
    brand: 'In-House Artisan',
    category: 'traditional',
    description: 'Hand-squeezed fresh lemons, fresh spearmint leaves, black kala namak, roasted ground zeera, and crushed ice.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Zesty Lemon, Garden Spearmint & Roasted Cumin Salt',
    temperature: 'Ice Cold',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Artisanal House Crafted', 'Digestive', 'Summer Favorite'],
    sizes: [
      { size: '350ml Mason Jar', price: 380, isPopular: true },
      { size: '1.2L Table Pitcher', price: 950 }
    ]
  },
  // 21. SAFFRON & CARDAMOM SILK LASSI
  {
    id: 'drink-lassi',
    name: 'Saffron & Cardamom Silk Lassi',
    brand: 'In-House Dairy',
    category: 'traditional',
    description: 'Slow-churned Punjabi buffalo milk yogurt infused with Iranian saffron threads, green cardamom, and crushed pistachios in clay matka.',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Velvety Churned Yogurt, Saffron Fragrance & Pistachio Crunch',
    temperature: 'Chilled',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Rich Dairy', 'Clay Matka', 'Sweet Lassi'],
    sizes: [
      { size: '400ml Clay Matka Cup', price: 480, isPopular: true },
      { size: '1.2L Royal Jug', price: 1250 }
    ]
  },
  // 22. TRADITIONAL CLAY POT KARAK CHAI
  {
    id: 'drink-karak-chai',
    name: 'Dhabba-Style Karak Chai (Matka Cup)',
    brand: 'House Tea Masters',
    category: 'traditional',
    description: 'Simmered strong black tea leaves with whole crushed green cardamom, cinnamon bark, and evaporated creamy milk in unglazed clay cup.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Aromatic Cardamom, Robust Spiced Black Tea & Rich Milk',
    temperature: 'Warm/Freshly Brewed',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Piping Hot', 'Earthen Cup', 'Pakistani Soul'],
    sizes: [
      { size: 'Single Matka Cup (200ml)', price: 250, isPopular: true },
      { size: 'Table Thermos Pot (4 Cups)', price: 750 }
    ]
  },
  // 23. ROYAL PINK KASHMIRI CHAI (NOON CHAI)
  {
    id: 'drink-kashmiri-chai',
    name: 'Royal Pink Kashmiri Chai (Noon Chai)',
    brand: 'House Tea Masters',
    category: 'traditional',
    description: 'Slow-brewed Himalayan green tea leaves with sea salt, baking soda, creamy milk, clotted malai foam, and crushed almonds and pistachios.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    flavorProfile: 'Floral Pink Tea, Nutty Almond Pistachio Crunch & Malai',
    temperature: 'Warm/Freshly Brewed',
    isAvailable: true,
    isHalalCertified: true,
    tags: ['Royal Pink', 'Winter Special', 'Rich Malai & Nuts'],
    sizes: [
      { size: 'Single Matka Cup (220ml)', price: 350, isPopular: true },
      { size: 'Royal Dawat Kettle (4 Cups)', price: 1100 }
    ]
  }
];

export const SPECIAL_RECIPES: SpecialRecipeItem[] = [
  {
    id: 'rec-1',
    title: 'Chef Tariq’s 24-Hour Shanwari Secret Gravy',
    description: 'The prized recipe behind our signature mutton karahi, passed through three generations of mountain hearth masters.',
    ingredients: [
      'Fresh baby goat leg meat (1.2kg)',
      'Sun-ripened heritage tomatoes (800g)',
      'Organic mutton tallow and desi ghee (150g)',
      'Crushed ginger roots and whole green chillies',
      'Freshly roasted black peppercorns & rock salt'
    ],
    price: 3450,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    category: 'Special Heritage Preparation',
    isPublished: true,
    prepTime: '45 mins active / 3 hrs slow simmer',
    cookingMethod: 'High heat cast iron wok over live acacia charcoal',
    chefNotes: 'Never add water or onions; the moisture comes purely from the slow-melting tomatoes and meat juices.'
  },
  {
    id: 'rec-2',
    title: 'Imperial Saffron Dum Pukht Seal',
    description: 'The ancient art of slow cooking in sealed earthen vessels to trap the royal fragrance of long grain basmati rice and tender spiced mutton.',
    ingredients: [
      'Aged basmati rice (minimum 2 years aged)',
      'Marinated mutton with yogurt & raw papaya',
      'Pure Kashmiri Saffron steeped in warm milk',
      'Dried sour plums (Aloo Bukhara) & fried golden shallots',
      'Whole wheat dough collar for airtight seal'
    ],
    price: 2250,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    category: 'Royal Mughal Cuisine',
    isPublished: true,
    prepTime: '2 hours preparation',
    cookingMethod: 'Slow steam trapped under live embers',
    chefNotes: 'The dough seal must never be broken until table-side presentation to release the cloud of saffron aroma.'
  }
];

export const OFFERS: OfferItem[] = [
  {
    id: 'off-1',
    title: 'Weekend Family Hearth Banquet',
    description: 'Enjoy a curated feast for 4 persons including the Grand BBQ Platter, Shanwari Karahi, Bread Basket, Desserts, and Karak Chai at a special banquet price.',
    discount: '20% OFF BANQUET',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    startDate: 'Ongoing Every Weekend',
    endDate: 'Saturday & Sunday',
    isActive: true,
    code: 'FAMILYHEARTH',
    terms: 'Valid for table bookings of 4 or more guests on weekends.'
  },
  {
    id: 'off-2',
    title: 'Chef’s Table Weekday Lunch Dawat',
    description: 'Complimentary traditional appetizers and freshly brewed Karak Chai with every Main Course selection during weekday lunch hours.',
    discount: 'Complimentary Appetizer + Chai',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    startDate: 'Monday to Thursday',
    endDate: '12:30 PM – 3:30 PM',
    isActive: true,
    code: 'LUNCHEMBER',
    terms: 'Applicable on dine-in orders placed between 12:30 PM and 3:30 PM.'
  },
  {
    id: 'off-3',
    title: 'Ramadan & Iftar Dawat Specials',
    description: 'Exquisite multi-course Iftar & Dinner buffet featuring traditional Rooh Afza, fresh dates, pakoras, live BBQ skewers, and dessert table.',
    discount: 'Special Dawat Menu',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    startDate: 'Seasonal / Ramadan',
    endDate: 'Sunset – 9:00 PM',
    isActive: true,
    code: 'RAMADANDAWAT',
    terms: 'Prior booking strongly recommended via WhatsApp concierge.'
  },
  {
    id: 'off-4',
    title: 'Late Night Tea & Desserts Pairing',
    description: 'Order any two handcrafted desserts and receive two complimentary clay pot Karak or Kashmiri Chais from 10:00 PM onwards.',
    discount: 'Complimentary Chai Pairing',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
    startDate: 'Daily from 10:00 PM',
    endDate: 'Closing',
    isActive: true,
    code: 'NIGHTCHAI',
    terms: 'Applicable in the Hearth Lounge area.'
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Wedding & Mehndi Luxury Banquets',
    description: 'Bespoke fine-dining banquet experiences for private wedding receptions, intimate Mehndi gatherings, and engagement dinners with custom live-cooking stations.',
    date: 'Custom Dates Available',
    time: 'Lunch or Evening Services',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    location: 'Grand Ballroom & Dining Salon',
    price: 4500,
    bookingStatus: 'open',
    isPublished: true
  },
  {
    id: 'evt-2',
    title: 'Corporate Executive Dinners & Private Suites',
    description: 'Dedicated private dining chambers equipped with discreet audio-visual capabilities, personalized multi-course menus, and VIP concierge hostesses.',
    date: 'Monday – Thursday Evenings',
    time: '7:00 PM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80',
    location: 'Executive Boardroom & Private Salon',
    price: 3800,
    bookingStatus: 'open',
    isPublished: true
  },
  {
    id: 'evt-3',
    title: 'Heritage Masterclass: The Alchemy of Live Fire',
    description: 'Join Executive Chef Tariq Al-Hashmi for an intimate live cooking demonstration uncovering spice roasting, marinades, and wood smoke calibration.',
    date: 'Last Saturday of Every Month',
    time: '4:00 PM – 6:30 PM',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
    location: 'Chef’s Hearth Counter',
    price: 3200,
    bookingStatus: 'limited',
    isPublished: true
  },
  {
    id: 'evt-4',
    title: 'Eid-ul-Fitr & Eid-ul-Adha Dawat Celebrations',
    description: 'Festive holiday menus celebrating the bounty of fresh meats, slow-cooked whole legs of lamb, and grand celebratory dessert spreads for the entire family.',
    date: 'Eid Holidays',
    time: 'All-day Service',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    location: 'All Restaurant Chambers',
    price: 4200,
    bookingStatus: 'inquiry',
    isPublished: true
  }
];

export const CHEFS: ChefMember[] = [
  {
    id: 'chef-1',
    name: 'Chef Tariq Al-Hashmi',
    role: 'Executive Chef & Culinary Director',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80',
    specialty: 'Wood-Fired Hearth & Shanwari Gastronomy',
    bio: 'With over 20 years of mastery across heritage royal kitchens and contemporary luxury hotels, Chef Tariq has redefined modern Pakistani gastronomy. His philosophy marries ancient charcoal roasting techniques with refined presentation and uncompromising ingredient purity.',
    experienceYears: 22,
    accolades: [
      'Gold Medalist - South Asian Culinary Mastership',
      'Master of Traditional Hearth & Smoke 2024',
      'Mentor to Emerging Pakistani Chefs',
      'Author of “Embers of the Indus”'
    ],
    signatureDish: 'Shanwari Baby Goat Karahi & Flame-Seared Mutton Chops',
    isPublished: true
  },
  {
    id: 'chef-2',
    name: 'Chef Hamza Qureshi',
    role: 'Sous Chef & BBQ Master',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    specialty: 'Tandoor & Dum Pukht Slow Cooking',
    bio: 'Hailing from a celebrated family of royal tandoor artisans, Chef Hamza oversees the live charcoal hearths, curating our signature marinades with slow-stone-ground spices and raw papaya infusions.',
    experienceYears: 14,
    accolades: [
      'Master of Tandoor & Kebabs Award',
      'Specialist in Dum Pukht Saffron Rice Techniques'
    ],
    signatureDish: 'Silken Chicken Malai Boti & Grand BBQ Platter',
    isPublished: true
  },
  {
    id: 'chef-3',
    name: 'Chef Zoya Mir',
    role: 'Head Pastry Chef & Confectionery Director',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=800&q=80',
    specialty: 'Modern South Asian Sweets & Patisserie',
    bio: 'Trained in Paris and Istanbul, Chef Zoya elevates classic Pakistani sweets into contemporary works of art, blending saffron, cardamom, and rose water with modern French confectionery techniques.',
    experienceYears: 11,
    accolades: [
      'Pastry Innovator of the Year 2025',
      'Creator of the Signature Shahi Tukra Rabri Espuma'
    ],
    signatureDish: 'Golden Rose Kunafa & Warm Shahi Tukra Tart',
    isPublished: true
  }
];

export const CHEF_PROFILE: ChefProfile = {
  name: 'Chef Tariq Al-Hashmi',
  role: 'Executive Chef & Culinary Director',
  image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80',
  bio: 'With over 20 years of culinary mastery, Chef Tariq has dedicated his career to celebrating the soul of Pakistani food—from the primal sizzle of northern charcoal hearths to the fragrant slow-braises of Mughal courts.',
  philosophy: '“Fire is not merely heat—it is a sacred element that awakens the memory of our land. When you combine live acacia wood embers with the purest spices, food ceases to be sustenance and becomes celebration.”',
  accolades: [
    'South Asian Culinary Mastership Gold Medal',
    'Master of Traditional Hearth & Smoke 2024',
    'Mentor to Emerging Pakistani Chefs',
    'Heritage Gastronomy Trophy'
  ],
  signatureDish: 'Shanwari Baby Goat Karahi & Flame-Seared Mutton Chops'
};

export const STORY_CHAPTERS = [
  {
    title: 'The Vision of Pakistani Luxury',
    subtitle: 'Where heritage fire meets refined hospitality',
    content: 'This showcase was born from a singular passion: to elevate Pakistan’s rich culinary heritage into an uncompromising fine-dining experience. We replaced ordinary dining norms with primal hearth cooking, generous hospitality, and exquisite architectural elegance.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Sourcing of Royal Spices',
    subtitle: 'Pure saffron, mountain herbs, and farm meats',
    content: 'We source pure saffron directly from historic valleys, hand-ground coriander and cumin seeds, organic desi ghee, and grass-fed hill mutton. Every ingredient honors the soil and pastoral traditions of our region.',
    image: 'https://images.unsplash.com/photo-1514944298352-780c10222a01?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Art of Live Charcoal',
    subtitle: 'Acacia wood, clay tandoors & stone grinding',
    content: 'Our open kitchen features live charcoal pits and high-heat cast iron woks where our chefs craft every karahi and skewer to order, ensuring each bite captures the authentic smoke and intense sizzle of real fire.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
  }
];

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    year: '2020',
    title: 'The Concept Ignition',
    description: 'Conceived as an exclusive dining experience dedicated to re-imagining modern Pakistani fine gastronomy.'
  },
  {
    year: '2022',
    title: 'The Flagship Hearth Launch',
    description: 'Opening of our signature multi-chamber restaurant with open-fire charcoal pit, clay tandoors, and luxury private dining salons.'
  },
  {
    year: '2024',
    title: 'Hospitality Recognition',
    description: 'Awarded top honors for Best Fine Dining Hospitality Showcase and Master of Charcoal & Spice.'
  },
  {
    year: '2026',
    title: 'National Showcase Model',
    description: 'Selected as the premier showcase project by OYRO WEB for defining the benchmark in high-end digital restaurant experiences.'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Charcoal Grilled Mutton Seekh Platter',
    category: 'dishes',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=80',
    caption: 'Freshly skewered hill mutton infused with aromatic herbs, grilled over acacia charcoal.',
    aspectRatio: 'wide'
  },
  {
    id: 'gal-2',
    title: 'Main Dining Hall & Ambient Amber Chandeliers',
    category: 'interior',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Warm dark timber, comfortable velvet booth seating, and refined South Asian hospitality.',
    aspectRatio: 'wide'
  },
  {
    id: 'gal-3',
    title: 'Chef Tariq at the Live Charcoal Hearth',
    category: 'chef',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Mastering flame and spice during the evening dinner service.',
    aspectRatio: 'tall'
  },
  {
    id: 'gal-4',
    title: 'Shanwari Mutton Karahi Presentation',
    category: 'dishes',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
    caption: 'Served sizzling hot in cast iron with fresh ginger juliennes and hot tandoori naan.',
    aspectRatio: 'square'
  },
  {
    id: 'gal-5',
    title: 'Private Family Dining Chamber',
    category: 'interior',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80',
    caption: 'Secluded banquet chamber designed for private family dawat gatherings and corporate events.',
    aspectRatio: 'tall'
  },
  {
    id: 'gal-6',
    title: 'Traditional Karak & Kashmiri Chai Ritual',
    category: 'experience',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
    caption: 'Brewed slow with whole cardamom and served in unglazed clay matka cups.',
    aspectRatio: 'square'
  },
  {
    id: 'gal-7',
    title: 'Wedding Reception & Dawat Celebration',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    caption: 'Bespoke event setups with customized royal menu service.',
    aspectRatio: 'wide'
  },
  {
    id: 'gal-8',
    title: 'Royal Shahi Tukra & Saffron Matka Kulfi',
    category: 'dishes',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Decadent artisanal sweets crafted fresh by our pastry team.',
    aspectRatio: 'square'
  },
  {
    id: 'gal-9',
    title: 'Late Night Ember Garden & Chai Lounge',
    category: 'experience',
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fresh juices, iced shakes, and relaxed tea conversations under starlit lighting.',
    aspectRatio: 'wide'
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    customerName: 'Usman Chaudhry & Family',
    roleOrCity: 'Family Dining Patron',
    rating: 5,
    review: '“An extraordinary fine-dining experience. The Shanwari Mutton Karahi and Silken Malai Boti are the best we have ever tasted in Pakistan. The atmosphere is warm, family-friendly, and truly luxurious.”',
    date: 'August 2026',
    isFeatured: true,
    orderedDishes: ['Signature Shanwari Mutton Karahi', 'Silken Chicken Malai Boti', 'Traditional Clay Pot Karak Chai'],
    source: 'Verified Diner'
  },
  {
    id: 'rev-2',
    customerName: 'Ayesha Malik',
    roleOrCity: 'Food & Hospitality Critic',
    rating: 5,
    review: '“This fine dining showcase proves that Pakistani cuisine belongs at the peak of global luxury dining. The charcoal smoke aroma, the tenderness of the Nihari shank, and the royal presentation of the Shahi Tukra are unforgettable.”',
    date: 'July 2026',
    isFeatured: true,
    orderedDishes: ['Slow-Braised Royal Nihari Shank', 'Warm Shahi Tukra with Rabri Espuma'],
    source: 'Gastronomy Critic'
  },
  {
    id: 'rev-3',
    customerName: 'Bilal Ahmed',
    roleOrCity: 'Corporate Dinner Host',
    rating: 5,
    review: '“We hosted an executive dinner for 16 guests in the Private Dining Chamber. The service was impeccable, the Grand BBQ Platter was sizzling and generous, and our international clients were thoroughly impressed.”',
    date: 'August 2026',
    isFeatured: false,
    orderedDishes: ['Grand Ember Royal BBQ Platter', 'Dum Pukht Special Mutton Biryani'],
    source: 'Private Dining Guest'
  },
  {
    id: 'rev-4',
    customerName: 'Fatima & Saad Qureshi',
    roleOrCity: 'Anniversary Celebration',
    rating: 5,
    review: '“From the instant we were greeted by the hostess to the final Kashmiri Chai, everything felt magical. The seating is intimate, the lighting is gorgeous, and the food has that genuine desi soul with high-end finesse.”',
    date: 'June 2026',
    isFeatured: true,
    orderedDishes: ['Ember Smoky Chicken Handi', 'Royal Pink Kashmiri Chai'],
    source: 'Verified Diner'
  },
  {
    id: 'rev-5',
    customerName: 'Zainab Tariq',
    roleOrCity: 'Weekend Diner',
    rating: 5,
    review: '“The Wagyu Chapli Burger and the Saffron Lassi are absolute game-changers. The staff is polite, and the restaurant is spotlessly clean. Can’t wait to come back with our extended family!”',
    date: 'May 2026',
    isFeatured: false,
    orderedDishes: ['The Ember Wagyu Chapli Gourmet Burger', 'Saffron & Cardamom Silk Lassi'],
    source: 'Verified Diner'
  }
];

export const SEATING_AREAS: SeatingArea[] = [
  {
    id: 'hearth-main',
    name: 'The Main Hearth Hall',
    description: 'Immerse in the warm glow of our open charcoal kitchen with comfortable family booths and amber chandeliers.',
    capacity: 'Tables for 2 to 8 guests',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    ambiance: 'Vibrant, welcoming & family-friendly'
  },
  {
    id: 'private-dining',
    name: 'The Royal Dawat Chamber',
    description: 'A secluded private banquet room for family gatherings, Eid dawats, business dinners, and intimate celebrations.',
    capacity: '10 to 24 guests',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80',
    ambiance: 'Exclusive, private & prestigious'
  },
  {
    id: 'home-delivery',
    name: 'Home Delivery',
    description: 'Fresh piping hot charcoal grills, handi karahis, and chilled beverages delivered straight to your doorstep in 35-45 minutes.',
    capacity: 'Fresh Doorstep Delivery Service',
    image: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&w=800&q=80',
    ambiance: 'Piping hot, contactless & lightning-fast delivery'
  }
];

export const FAQS = [
  {
    question: 'How do I reserve a table or private banquet room?',
    answer: 'You can book directly via our interactive online reservation page, or click our WhatsApp Concierge button for instant personal assistance with large family parties.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Cash, all major Debit/Credit Cards (Visa, MasterCard, PayPak), Online Bank Transfer, Easypaisa, and JazzCash. (Available payment methods may vary).'
  },
  {
    question: 'Do you cater for family events and private dawats?',
    answer: 'Yes! We have dedicated private dining chambers and customized multi-course event packages for Weddings, Mehndis, Corporate Banquets, and Eid celebrations.'
  },
  {
    question: 'Are all meats Halal and freshly prepared?',
    answer: 'All our meats and ingredients are 100% Halal, hand-slaughtered, and prepared fresh daily on our live charcoal hearths and tandoors.'
  },
  {
    question: 'Is valet parking available?',
    answer: 'Yes, complimentary executive valet parking is provided for all dining patrons directly at our main restaurant porch.'
  }
];

export const DESSERT_BAR_ITEMS: DessertBarItem[] = [
  // --- MILKSHAKES ---
  {
    id: 'shake-mango',
    name: 'Sindhri Mango Milkshake',
    category: 'milkshakes',
    description: 'Blended with fresh ripe Pakistani Sindhri mango pulp, rich organic buffalo milk, and a scoop of artisanal mango gelato topped with fresh diced mango cubes.',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    price: 580,
    servingSize: '350ml Tall Frosted Glass',
    flavorNotes: 'Sun-ripened sweet mango, creamy whole milk & golden nectar',
    isAvailable: true,
    isChefSpecial: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Frost Cold',
    tags: ['Seasonal King', 'Fresh Fruit', 'House Favorite']
  },
  {
    id: 'shake-banana',
    name: 'Creamy Banana Caramel Shake',
    category: 'milkshakes',
    description: 'Fresh ripe bananas churned with Madagascar vanilla bean cream, farm milk, and a drizzle of house-made golden caramel.',
    image: 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=800&q=80',
    price: 490,
    servingSize: '350ml Tall Frosted Glass',
    flavorNotes: 'Velvety ripe banana, whipped cream & warm caramel crunch',
    isAvailable: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Frost Cold',
    tags: ['Naturally Sweet', 'Rich Energy', 'Kids Favorite']
  },
  {
    id: 'shake-chocolate',
    name: 'Belgian Fudge Chocolate Milkshake',
    category: 'milkshakes',
    description: 'Decadent 70% dark Belgian cocoa blended with whole dairy cream, chocolate ice cream, and chocolate curls with dark fudge rim.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    price: 590,
    servingSize: '350ml Frosted Goblet',
    flavorNotes: 'Deep roasted cocoa, melted fudge drizzle & chocolate flakes',
    isAvailable: true,
    isChefSpecial: true,
    isVegetarian: true,
    temperature: 'Frost Cold',
    tags: ['Triple Chocolate', 'Decadent', 'Bestseller']
  },
  {
    id: 'shake-strawberry',
    name: 'Fresh Swat Strawberry Shake',
    category: 'milkshakes',
    description: 'Valley-fresh Swat strawberries pureed with rich condensed milk, artisan strawberry cream, and crushed pink meringue.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
    price: 540,
    servingSize: '350ml Tall Frosted Glass',
    flavorNotes: 'Tart sweet red berries, velvety cream & rose notes',
    isAvailable: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Frost Cold',
    tags: ['Fresh Berries', 'Naturally Pink', 'Refreshing']
  },
  {
    id: 'shake-vanilla',
    name: 'Madagascar Vanilla Bean Shake',
    category: 'milkshakes',
    description: 'Pure double-fold Madagascar vanilla pods infused into rich slow-churned cream and topped with fresh whipped vanilla foam.',
    image: 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?auto=format&fit=crop&w=800&q=80',
    price: 490,
    servingSize: '350ml Frosted Glass',
    flavorNotes: 'Floral vanilla bean, buttery sweet milk & silky texture',
    isAvailable: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Frost Cold',
    tags: ['Classic', 'Pure Vanilla Pod', 'Timeless']
  },
  {
    id: 'shake-oreo',
    name: 'Crushed Oreo Cookies & Cream Shake',
    category: 'milkshakes',
    description: 'Crunchy dark chocolate Oreo cookies crushed and spun with sweet vanilla cream, drizzled with hot fudge and whole biscuit crown.',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80',
    price: 580,
    servingSize: '350ml Frosted Mason Jar',
    flavorNotes: 'Chocolate biscuit crunch, vanilla cream filling & cocoa dust',
    isAvailable: true,
    isChefSpecial: true,
    isVegetarian: true,
    temperature: 'Frost Cold',
    tags: ['Oreo Crunch', 'Crowd Favorite', 'Extra Thick']
  },
  {
    id: 'shake-pistachio',
    name: 'Royal Roasted Pistachio (Pista) Shake',
    category: 'milkshakes',
    description: 'Persian emerald pistachios slow-roasted and stone-ground into rich pistachio butter, churned with cardamom milk and slivered nuts.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    price: 650,
    servingSize: '350ml Crystal Goblet',
    flavorNotes: 'Nutty toasted pistachio, green cardamom & sweet rabri note',
    isAvailable: true,
    isChefSpecial: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Frost Cold',
    tags: ['Royal Nut', 'Stone Ground', 'Signature']
  },
  {
    id: 'shake-lotus',
    name: 'Lotus Biscoff Speculoos Thickshake',
    category: 'milkshakes',
    description: 'Caramelized Belgian speculoos cookie butter blended with rich vanilla gelato, topped with crushed Biscoff crumbs and warm cookie spread.',
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80',
    price: 640,
    servingSize: '350ml Frosted Mason Jar',
    flavorNotes: 'Warm cinnamon spice, roasted caramelized biscuit & rich cream',
    isAvailable: true,
    isVegetarian: true,
    temperature: 'Frost Cold',
    tags: ['Biscoff Spread', 'Modern Favorite', 'Decadent']
  },

  // --- ARTISANAL ICE CREAMS ---
  {
    id: 'ice-mango',
    name: 'Chausa & Sindhri Mango Gelato',
    category: 'ice-creams',
    description: 'Hand-churned gelato crafted with pure Pakistani Chausa mango puree, sweet milk solids, and candied mango ribbons.',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80',
    price: 420,
    servingSize: 'Double Scoop Waffle Bowl (180g)',
    flavorNotes: 'Explosive natural mango aroma, velvety smooth & sunshine sweet',
    isAvailable: true,
    isChefSpecial: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Frost Cold',
    tags: ['Authentic Fruit', 'No Artificial Flavors', 'Gold Medal']
  },
  {
    id: 'ice-chocolate',
    name: 'Dark Belgian Truffle Ice Cream',
    category: 'ice-creams',
    description: 'Double-dark chocolate cream blended with melted bittersweet cocoa truffles, chocolate fudge sauce, and crispy chocolate pearls.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    price: 450,
    servingSize: 'Double Scoop Waffle Bowl (180g)',
    flavorNotes: 'Intense 72% dark cocoa, fudgy texture & silky finish',
    isAvailable: true,
    isVegetarian: true,
    temperature: 'Frost Cold',
    tags: ['Chocoholic', 'Handcrafted', 'Rich']
  },
  {
    id: 'ice-vanilla',
    name: 'Tahitian Vanilla Bean Ice Cream',
    category: 'ice-creams',
    description: 'Speckled with authentic whole vanilla seeds, cooked with egg-free organic cream for pure satin perfection.',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80',
    price: 390,
    servingSize: 'Double Scoop Waffle Bowl (180g)',
    flavorNotes: 'Sweet custard warmth, real vanilla speckles & delicate aroma',
    isAvailable: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Frost Cold',
    tags: ['Gourmet Classic', 'Natural Pods', 'Pure Cream']
  },
  {
    id: 'ice-strawberry',
    name: 'Wild Strawberry & Cream Ice Cream',
    category: 'ice-creams',
    description: 'Fresh seasonal strawberries simmered with lemon zest and folded into slow-churned sweet cream with berry preserves.',
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80',
    price: 420,
    servingSize: 'Double Scoop Waffle Bowl (180g)',
    flavorNotes: 'Bright ruby berry bursts, sweet cream swirl & light citrus',
    isAvailable: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Frost Cold',
    tags: ['Berry Swirl', 'Crisp Waffle Cone', 'Summer Delight']
  },
  {
    id: 'ice-pistachio',
    name: 'Shahi Zafrani Pistachio Gelato',
    category: 'ice-creams',
    description: 'Emerald pistachios stone-ground with Iranian saffron threads and silver leaf (varq) garnish.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    price: 490,
    servingSize: 'Double Scoop Earthen Bowl (180g)',
    flavorNotes: 'Roasted pistachio nuttiness, aromatic saffron & cardamom kiss',
    isAvailable: true,
    isChefSpecial: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Frost Cold',
    tags: ['Royal Saffron', 'Pistachio Crunch', 'Heritage Recipe']
  },

  // --- SUNDAES & WARM DESSERTS ---
  {
    id: 'dessert-brownie-icecream',
    name: 'Sizzling Skillet Fudge Brownie with Ice Cream',
    category: 'sundaes-warm',
    description: 'Freshly baked warm dark chocolate brownie served on a cast-iron skillet, topped with Tahitian vanilla bean ice cream and hot Belgian chocolate ganache.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    price: 750,
    servingSize: 'Sizzling Cast Iron Skillet',
    flavorNotes: 'Hot molten fudge, crispy brownie edges & icy melting vanilla',
    isAvailable: true,
    isChefSpecial: true,
    isVegetarian: true,
    temperature: 'Warm & Sizzling',
    tags: ['Table Sizzler', 'All-Time Favorite', 'Warm & Cold Contrast']
  },
  {
    id: 'dessert-chocolate-sundae',
    name: 'Grand Royal Chocolate Tower Sundae',
    category: 'sundaes-warm',
    description: 'Triple scoops of dark truffle and vanilla ice cream layered with warm fudge, toasted almonds, chocolate wafer rolls, and whipped cloud cream.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    price: 690,
    servingSize: '400ml Tall Crystal Sundae Boat',
    flavorNotes: 'Layered fudge ribbons, crunchy almond flakes & cherry top',
    isAvailable: true,
    isVegetarian: true,
    temperature: 'Frost Cold',
    tags: ['Sharing Sundae', 'Toasted Almonds', 'Waffle Crisps']
  },
  {
    id: 'dessert-mango-mastani',
    name: 'Shahi Mango Mastani Royal Float',
    category: 'sundaes-warm',
    description: 'Thick mango milkshake topped with two scoops of mango gelato, chopped cashews, pistachios, tutty-fruity, and fresh Sindhri mango slices.',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    price: 680,
    servingSize: '450ml Royal Tall Goblet',
    flavorNotes: 'Luscious mango pulp, crunchy nuts & double mango richness',
    isAvailable: true,
    isChefSpecial: true,
    isVegetarian: true,
    temperature: 'Frost Cold',
    tags: ['Mango Overload', 'Royal Fusion', 'Summer King']
  },

  // --- FALOODA & TRADITIONAL KULFI ---
  {
    id: 'dessert-falooda',
    name: 'Royal Shahi Rabri Falooda',
    category: 'falooda-kulfi',
    description: 'Handcrafted cornstarch vermicelli sev, chilled damask rose syrup, soaked basil seeds (tukh malanga), slow-reduced thick rabri malai, and a sliced block of pistachio kulfi.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    price: 650,
    servingSize: '450ml Crystal Goblet or Earthen Bowl',
    flavorNotes: 'Rose aroma, silky rabri, chewy falooda sev & cooling tukh malanga',
    isAvailable: true,
    isChefSpecial: true,
    isVegetarian: true,
    temperature: 'Frost Cold',
    tags: ['Lahori Heritage', 'Ultimate Summer Cooler', 'Signature']
  },
  {
    id: 'dessert-kulfi',
    name: 'Shahi Matka Malai & Zafran Kulfi',
    category: 'falooda-kulfi',
    description: 'Slow-simmered whole buffalo milk cooked for 8 hours in traditional iron karahi with Iranian saffron, green cardamom, roasted pistachios, and almonds, frozen in unglazed terracotta matka.',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
    price: 450,
    servingSize: 'Unglazed Clay Matka (160g)',
    flavorNotes: 'Dense caramelized milk solids (khoya), cardamom & saffron aroma',
    isAvailable: true,
    isChefSpecial: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Frost Cold',
    tags: ['8-Hour Slow Cooked', 'Clay Pot Baked', 'Authentic Pakistan']
  },
  {
    id: 'dessert-rabri-kheer',
    name: 'Zafrani Malai Rabri Kheer (Shahi Tukda Crown)',
    category: 'falooda-kulfi',
    description: 'Fragrant basmati rice slow-cooked in thick cardamom cream, topped with shredded rabri malai, golden saffron strands, and crushed pistachios.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    price: 520,
    servingSize: 'Silver Rimmed Clay Bowl',
    flavorNotes: 'Caramelized milk rice, saffron floral notes & silver leaf finish',
    isAvailable: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Velvety Chilled',
    tags: ['Mughlai Dessert', 'Wedding Feast Classic', 'Saffron Fragrant']
  },

  // --- COLD BREWS, CHOCOLATES & REFRESHERS ---
  {
    id: 'beverage-mint-lemonade',
    name: 'Fresh Garden Mint Lemonade',
    category: 'cold-refreshers',
    description: 'Chilled crushed ice cooler with fresh hand-picked mint leaves, freshly squeezed lime, pink Himalayan black salt, and sparkling soda.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    price: 390,
    servingSize: '350ml Mason Jar with Lime Wedge',
    flavorNotes: 'Electric mint freshness, zesty lime punch & restorative salt',
    isAvailable: true,
    isChefSpecial: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Frost Cold',
    tags: ['Digestive Hero', 'Fresh Pressed', 'Spicy Food Pairing']
  },
  {
    id: 'beverage-fresh-lemonade',
    name: 'Classic Pulpy Lemonade',
    category: 'cold-refreshers',
    description: 'Freshly squeezed sun-ripened lemons, pure cane syrup, mountain spring water, and crushed lemon pulp over ice cubes.',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80',
    price: 340,
    servingSize: '350ml Tall Chilled Glass',
    flavorNotes: 'Crisp citrus acidity, clean sweet balance & natural vitamin C',
    isAvailable: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Ice Chilled',
    tags: ['Pure Citrus', 'Thirst Quencher', 'Natural']
  },
  {
    id: 'beverage-iced-coffee',
    name: 'Caramel Hazelnut Iced Coffee',
    category: 'cold-refreshers',
    description: '18-hour cold brew Arabica espresso shot poured over ice, condensed sweet milk, and roasted hazelnut syrup topped with velvety cold foam.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    price: 490,
    servingSize: '350ml Frosted Tumbler',
    flavorNotes: 'Dark roasted espresso, nutty hazelnut & sweet creamy foam',
    isAvailable: true,
    isVegetarian: true,
    isGlutenFree: true,
    temperature: 'Ice Chilled',
    tags: ['Cold Brew Espresso', 'Energy Lift', 'Barista Craft']
  },
  {
    id: 'beverage-cold-chocolate',
    name: 'Swiss Creamy Cold Chocolate',
    category: 'cold-refreshers',
    description: 'Silky melted Swiss cocoa simmered with sweet milk and chilled to freezing point, served with shaved dark chocolate curls and whipped vanilla cream.',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80',
    price: 480,
    servingSize: '350ml Chilled Goblet',
    flavorNotes: 'Rich melted milk chocolate, velvety smoothness & cocoa dust',
    isAvailable: true,
    isVegetarian: true,
    temperature: 'Ice Chilled',
    tags: ['Chilled Swiss Cocoa', 'Silky Smooth', 'Comfort Classic']
  }
];

export const DEALS: DealItem[] = [
  {
    id: 'deal-family-grand',
    name: 'Grand Royal Family Deal',
    category: 'family',
    description: 'A sumptuous multi-course royal feast designed for the whole family. Features our signature mutton karahi, charcoal chicken tikka boti, fresh roghani naans, raita, salad, chilled bottled drinks, and traditional matka malai kulfi.',
    price: 4800,
    originalPrice: 5650,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
    serves: 'Serves 5-6 Persons',
    includedItems: [
      { name: 'Shanwari Mutton Karahi (Full 1kg)', quantity: 1, category: 'food' },
      { name: 'Flame-Seared Chicken Tikka Boti Skewers (8 pcs)', quantity: 1, category: 'food' },
      { name: 'Tandoori Sesame Roghani Naan', quantity: 6, category: 'food' },
      { name: 'Fresh Garden Salad & Chilled Mint Raita', quantity: 2, category: 'food' },
      { name: 'Chilled Soft Drinks / Bottled Drinks (345ml)', quantity: 4, category: 'drink' },
      { name: 'Shahi Matka Malai Kulfi (Family Bowl)', quantity: 1, category: 'dessert' }
    ],
    badge: '👑 Family Favorite',
    savingsText: 'Save ₨850 compared to a la carte',
    isChefSpecial: true,
    isPopular: true,
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 2,
    aiRating: 4.9,
    showAiRating: true,
    order: 1
  },
  {
    id: 'deal-couple-ember',
    name: 'Ember Couple Feast Deal',
    category: 'couple',
    description: 'Intimate candlelight feast for two. Delicious smoky boneless chicken handi, melt-in-mouth chicken malai seekh kababs, fresh naans, refreshing mint coolers, and our famous hot skillet fudge brownie with vanilla ice cream.',
    price: 2450,
    originalPrice: 2980,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    serves: 'Serves 2 Persons',
    includedItems: [
      { name: 'Smoky Boneless Chicken Handi (Half)', quantity: 1, category: 'food' },
      { name: 'Silken Chicken Malai Seekh Kababs (4 pcs)', quantity: 1, category: 'food' },
      { name: 'Fresh Butter Roghani Naan', quantity: 3, category: 'food' },
      { name: 'Fresh Garden Mint Lemonade / Chilled Colas', quantity: 2, category: 'drink' },
      { name: 'Sizzling Skillet Brownie with Vanilla Ice Cream', quantity: 1, category: 'dessert' }
    ],
    badge: '✨ Romantic Candlelight',
    savingsText: 'Save ₨530',
    isChefSpecial: true,
    isPopular: true,
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 1,
    aiRating: 4.95,
    showAiRating: true,
    order: 2
  },
  {
    id: 'deal-friends-bbq',
    name: 'Friends BBQ Night Platter Deal',
    category: 'friends',
    description: 'The ultimate charcoal barbecue hangout combo. Live flame-grilled mutton chops, spicy beef seekh kababs, chicken boti, royal saffron biryani, fresh naans, and chilled drinks for friends.',
    price: 3600,
    originalPrice: 4250,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    serves: 'Serves 3-4 Persons',
    includedItems: [
      { name: 'Grand Charcoal BBQ Skewer Platter (Chops, Tikka, Seekh)', quantity: 1, category: 'food' },
      { name: 'Dum Pukht Special Mutton Biryani (Full Handi)', quantity: 1, category: 'food' },
      { name: 'Tandoori Garlic & Butter Naans', quantity: 4, category: 'food' },
      { name: 'Chilled Soft Drinks / Pakola Sodas (345ml)', quantity: 4, category: 'drink' },
      { name: 'Zeera Mint Raita & Laccha Onions', quantity: 2, category: 'food' }
    ],
    badge: '🔥 BBQ Bestseller',
    savingsText: 'Save ₨650',
    isChefSpecial: true,
    isPopular: true,
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 2,
    aiRating: 4.85,
    showAiRating: true,
    order: 3
  },
  {
    id: 'deal-solo-executive',
    name: 'Solo Executive Shinwari Deal',
    category: 'single',
    description: 'Perfect single diner lunch or dinner combo. A sizzling single wok of Desi Ghee Shinwari Chicken Karahi with hot roghani naan, raita, salad, and a crisp chilled beverage.',
    price: 1350,
    originalPrice: 1650,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=80',
    serves: 'Serves 1 Person',
    includedItems: [
      { name: 'Desi Ghee Shinwari Chicken Karahi (Single Wok)', quantity: 1, category: 'food' },
      { name: 'Fresh Hot Roghani Naan', quantity: 2, category: 'food' },
      { name: 'Chilled Soft Drink / Next Cola (250ml Slim Can)', quantity: 1, category: 'drink' },
      { name: 'Mint Raita & Fresh Sliced Salad', quantity: 1, category: 'food' }
    ],
    badge: '⚡ Quick Executive',
    savingsText: 'Save ₨300',
    isPopular: true,
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 2,
    aiRating: 4.8,
    showAiRating: true,
    order: 4
  },
  {
    id: 'deal-party-grand-dawat',
    name: 'Grand Dawat & Party Feast Deal',
    category: 'party',
    description: 'Grand celebration banquet deal crafted for family gatherings, birthdays, and celebrations. Includes 2 full mutton karahis, 2 handis of saffron biryani, giant BBQ skewer towers, 12 naans, 8 drinks, and 2 royal rabri faloodas.',
    price: 8900,
    originalPrice: 10600,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    serves: 'Serves 8-10 Persons',
    includedItems: [
      { name: 'Shanwari Mutton Karahi (Full 1kg each)', quantity: 2, category: 'food' },
      { name: 'Dum Pukht Royal Mutton Biryani (Full Handis)', quantity: 2, category: 'food' },
      { name: 'Grand Charcoal BBQ Mixed Skewer Towers', quantity: 2, category: 'food' },
      { name: 'Assorted Tandoori Roghani & Garlic Naans', quantity: 12, category: 'food' },
      { name: 'Chilled Soft Drinks (500ml Sharing Bottles)', quantity: 8, category: 'drink' },
      { name: 'Royal Shahi Rabri Falooda Crystal Goblets', quantity: 2, category: 'dessert' },
      { name: 'Bowls of Garden Mint Raita & Fresh Kachumber', quantity: 4, category: 'food' }
    ],
    badge: '🎉 Mega Party Feast',
    savingsText: 'Save ₨1,700 Mega Value',
    isChefSpecial: true,
    isPopular: true,
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 2,
    aiRating: 4.98,
    showAiRating: true,
    order: 5
  },
  {
    id: 'deal-kids-nawabs',
    name: 'Little Nawabs Kids Happy Deal',
    category: 'kids',
    description: 'Mild, flavorful, and 100% child-friendly! Golden crispy chicken tenders, crunchy french fries, fresh Sindhri mango milkshake, and a scoop of sweet Madagascar vanilla gelato.',
    price: 950,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1000&q=80',
    serves: 'Serves 1-2 Kids',
    includedItems: [
      { name: 'Mild Crispy Chicken Malai Tenders / Chapli Slider', quantity: 1, category: 'food' },
      { name: 'Golden Seasoned French Fries Basket', quantity: 1, category: 'food' },
      { name: 'Sindhri Mango Milkshake (Child Frosted Cup)', quantity: 1, category: 'drink' },
      { name: 'Madagascar Vanilla Bean Ice Cream Scoop', quantity: 1, category: 'dessert' }
    ],
    badge: '🎈 Kids Special',
    savingsText: 'Save ₨250',
    isPopular: true,
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 0,
    aiRating: 4.9,
    showAiRating: true,
    order: 6
  },
  {
    id: 'deal-late-night-desi',
    name: 'Late Night Desi Feast Combo',
    category: 'custom',
    description: 'Crafted for late night cravings! Hot charcoal-grilled chapli kababs, slow-simmered handi gravy, fresh hot tandoori naans, and two steaming clay pots of traditional Karak Chai.',
    price: 1850,
    originalPrice: 2250,
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1000&q=80',
    serves: 'Serves 2 Persons',
    includedItems: [
      { name: 'Charcoal Seared Peshawari Chapli Kababs (2 pcs)', quantity: 1, category: 'food' },
      { name: 'Boneless Makhani Chicken Handi (Half)', quantity: 1, category: 'food' },
      { name: 'Fresh Hot Tandoori Naan', quantity: 3, category: 'food' },
      { name: 'Traditional Clay Pot Karak Chai', quantity: 2, category: 'drink' }
    ],
    badge: '🌙 Late Night Special',
    savingsText: 'Save ₨400',
    isPopular: true,
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 2,
    aiRating: 4.85,
    showAiRating: true,
    order: 7
  },
  {
    id: 'deal-grills-biryani-combo',
    name: 'Charcoal Grills & Biryani Platter Deal',
    category: 'friends',
    description: 'Fragrant Dum Pukht Saffron Mutton Biryani combined with charcoal-grilled seekh kabab skewers, chilled Pakola Ice Cream Sodas, and roasted pistachio gelato.',
    price: 2950,
    originalPrice: 3500,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
    serves: 'Serves 3 Persons',
    includedItems: [
      { name: 'Dum Pukht Saffron Mutton Biryani (Full Handi)', quantity: 1, category: 'food' },
      { name: 'Flame-Kissed Chicken Seekh Kababs (6 pcs)', quantity: 1, category: 'food' },
      { name: 'Pakola Ice Cream Soda / Chilled Soft Drinks (345ml)', quantity: 3, category: 'drink' },
      { name: 'Shahi Zafrani Pistachio Gelato Scoop', quantity: 1, category: 'dessert' },
      { name: 'Chilled Cucumber Mint Raita', quantity: 1, category: 'food' }
    ],
    badge: '⭐ Chef Selection',
    savingsText: 'Save ₨550',
    isChefSpecial: true,
    isPopular: true,
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 2,
    aiRating: 4.9,
    showAiRating: true,
    order: 8
  }
];

export const DEFAULT_NASHTA_CONFIG: NashtaPointConfig = {
  isEnabled: true,
  eyebrow: 'TRADITIONAL MORNING RITUAL • DESI BREAKFAST',
  heading: 'NASHTA POINT',
  tagline: 'Authentic Desi Breakfast, Earthen Pot Chais, Fresh Churned Lassis & Sizzling Puris',
  description: 'Start your morning with our soulful traditional breakfast spread — hot flaky tandoori and tawa parathas, slow-simmered Lahori chana, freshly fried crispy puris with fragrant halwa, farm-fresh desi eggs, and traditional slow-brewed chais and chilled matka lassis.',
  timingBadge: 'Daily 7:00 AM – 1:30 PM • Friday & Sunday Extended',
  featuredOfferText: 'Sunday Grand Nashta Feast: 2 Puris + Chana + Halwa + Matka Chai @ Rs. 499 only!',
  featuredOfferCode: 'MORNINGFEAST',
  showOfferBanner: true,
  heroImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80'
};

export const NASHTA_POINT_ITEMS: NashtaPointItem[] = [
  // 1. HALWA PURI
  {
    id: 'nashta-halwa-puri-thali',
    name: 'Royal Lahori Halwa Puri Thali',
    category: 'halwa-puri',
    categoryLabel: 'Halwa Puri Thali',
    description: '2 piping hot crispy golden puffed puris served with fragrant cardamom-infused sooji halwa, spicy tarka chana curry, and tangy mixed mango-lemon achar.',
    price: 590,
    originalPrice: 690,
    serves: '1-2 Persons',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    badge: '👑 Morning Signature',
    pairing: 'Best paired with Saffron Matka Lassi or Karak Chai',
    dietary: ['veg', 'halal', 'desi-ghee'],
    order: 1,
    timing: '7:00 AM – 1:30 PM',
    offerText: 'Special Weekend Deal'
  },
  {
    id: 'nashta-extra-puris',
    name: 'Kadai Fried Golden Puris (Set of 2)',
    category: 'halwa-puri',
    categoryLabel: 'Halwa Puri Thali',
    description: 'Fluffy, crisp, and deep-fried puffed dough rounds served steaming hot straight from the kadai oil.',
    price: 140,
    serves: '2 Hot Puris',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Freshly Fried',
    dietary: ['veg', 'halal'],
    order: 2,
    timing: '7:00 AM – 1:30 PM'
  },
  {
    id: 'nashta-zafrani-halwa',
    name: 'Shahi Zafrani Sooji Halwa',
    category: 'halwa-puri',
    categoryLabel: 'Halwa Puri Thali',
    description: 'Semolina slowly roasted in pure Desi Ghee, infused with saffron syrup, green cardamom, and toasted almond & pistachio slivers.',
    price: 280,
    serves: 'Bowl (250g)',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Desi Ghee',
    dietary: ['veg', 'halal', 'desi-ghee'],
    order: 3,
    timing: '7:00 AM – 1:30 PM'
  },

  // 2. CHAI
  {
    id: 'nashta-matka-karak-chai',
    name: 'Dhabba-Style Matka Karak Chai',
    category: 'chai',
    categoryLabel: 'Chai Ritual',
    description: 'Simmered strong Assam & Kenyan black tea leaves with crushed cardamom pods, cinnamon bark, and rich evaporated milk served in a fragrant unglazed clay matka.',
    price: 250,
    serves: 'Single Clay Pot',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    badge: '☕ Clay Matka',
    pairing: 'Pairs perfectly with Desi Ghee Paratha or Omelette',
    dietary: ['veg', 'halal'],
    order: 4,
    timing: 'All Day / 7:00 AM onwards'
  },
  {
    id: 'nashta-kashmiri-pink-chai',
    name: 'Royal Pink Kashmiri Chai (Noon Chai)',
    category: 'chai',
    categoryLabel: 'Chai Ritual',
    description: 'Slow-brewed Himalayan green tea leaves with sea salt, baking soda, creamy milk, clotted malai foam crown, and crushed roasted almonds and pistachios.',
    price: 350,
    serves: 'Earthen Cup (220ml)',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: false,
    badge: '🌸 Royal Pink & Malai',
    dietary: ['veg', 'halal'],
    order: 5,
    timing: '7:00 AM – 1:30 PM'
  },
  {
    id: 'nashta-doodh-patti',
    name: 'Peshawari Zafrani Doodh Patti Chai',
    category: 'chai',
    categoryLabel: 'Chai Ritual',
    description: 'Brewed entirely in buffalo whole milk with zero added water, steeped with loose CTC black tea, green cardamom, and a golden saffron thread.',
    price: 280,
    serves: 'Traditional Glass',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Zero Water Added',
    dietary: ['veg', 'halal'],
    order: 6,
    timing: 'All Day'
  },

  // 3. LASSI
  {
    id: 'nashta-saffron-malai-lassi',
    name: 'Royal Saffron & Malai Sweet Lassi',
    category: 'lassi',
    categoryLabel: 'Fresh Lassi Bar',
    description: 'Traditional slow-churned Punjabi buffalo yogurt blended with crystal sugar, Kashmiri saffron infusion, clotted thick malai layer, and roasted crushed pistachios.',
    price: 480,
    originalPrice: 550,
    serves: '450ml Clay Matka',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    badge: '🥛 Thick Malai Crown',
    pairing: 'Ideal with spicy Murgh Chana or Aloo Paratha',
    dietary: ['veg', 'halal', 'desi-ghee'],
    order: 7,
    timing: '7:00 AM – 1:30 PM',
    offerText: 'Popular Breakfast Churn'
  },
  {
    id: 'nashta-mango-lassi',
    name: 'Sindhri Mango Pulp Lassi',
    category: 'lassi',
    categoryLabel: 'Fresh Lassi Bar',
    description: 'Creamy yogurt churned with pure sweet Sindhri mango pulp, a dash of cardamom, and crushed ice.',
    price: 520,
    serves: 'Tall Glass (400ml)',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Fresh Churned',
    dietary: ['veg', 'halal'],
    order: 8,
    timing: '7:00 AM – 1:30 PM'
  },
  {
    id: 'nashta-namkeen-zeera-lassi',
    name: 'Desi Namkeen Zeera & Mint Lassi',
    category: 'lassi',
    categoryLabel: 'Fresh Lassi Bar',
    description: 'Light salted churned buttermilk infused with roasted cumin seeds, pink Himalayan rock salt, and garden fresh mint extract. Refreshing and digestive.',
    price: 380,
    serves: 'Clay Matka (400ml)',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Digestive & Cool',
    dietary: ['veg', 'halal'],
    order: 9,
    timing: '7:00 AM – 1:30 PM'
  },

  // 4. PARATHAS
  {
    id: 'nashta-lacha-paratha',
    name: 'Crispy Desi Ghee Lacha Paratha',
    category: 'paratha',
    categoryLabel: 'Crispy Parathas',
    description: 'Multi-layered spiral dough rolled and pan-crisped to golden flaky perfection in 100% pure organic Desi Ghee on cast iron tawa.',
    price: 180,
    serves: '1 Large Paratha',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    badge: '🧈 Pure Desi Ghee',
    dietary: ['veg', 'halal', 'desi-ghee'],
    order: 10,
    timing: '7:00 AM – 1:30 PM'
  },
  {
    id: 'nashta-aloo-paratha',
    name: 'Spicy Tandoori Aloo Paratha',
    category: 'paratha',
    categoryLabel: 'Crispy Parathas',
    description: 'Stuffed generously with seasoned mashed potatoes, fresh green coriander, chopped green chillies, roasted cumin, and crushed pomegranate anardana, topped with melting white butter.',
    price: 260,
    serves: '1 Stuffed Paratha',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Desi Makhan Topping',
    pairing: 'Served with homemade garlic pickle and mint yogurt raita',
    dietary: ['veg', 'halal'],
    order: 11,
    timing: '7:00 AM – 1:30 PM'
  },
  {
    id: 'nashta-keema-paratha',
    name: 'Royal Mutton Keema Paratha',
    category: 'paratha',
    categoryLabel: 'Crispy Parathas',
    description: 'Stuffed with slow-braised spiced minced lamb and mutton, fresh mint leaves, and warm garam masala, toasted crisp in desi ghee.',
    price: 490,
    serves: '1 Stuffed Paratha',
    image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Mutton Mince',
    dietary: ['non-veg', 'halal', 'desi-ghee'],
    order: 12,
    timing: '7:00 AM – 1:30 PM'
  },

  // 5. EGGS
  {
    id: 'nashta-desi-omelette',
    name: 'Desi Spiced Masala Omelette',
    category: 'eggs',
    categoryLabel: 'Farm Fresh Eggs',
    description: 'Three farm-fresh organic eggs beaten with finely diced onions, tomatoes, fresh green chillies, coriander leaves, and crushed red chili flakes, pan-seared in desi butter.',
    price: 290,
    serves: '1 Person',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    badge: '🍳 Desi Ghee Fried',
    pairing: 'Great with Lacha Paratha & Matka Chai',
    dietary: ['halal', 'desi-ghee'],
    order: 13,
    timing: '7:00 AM – 1:30 PM'
  },
  {
    id: 'nashta-lahori-khagina',
    name: 'Lahori Khagina (Spiced Scrambled Eggs)',
    category: 'eggs',
    categoryLabel: 'Farm Fresh Eggs',
    description: 'Soft scrambled eggs tossed with roasted cumin seeds, juicy tomatoes, caramelized shallots, turmeric, and fresh ginger strips.',
    price: 340,
    serves: '1-2 Persons',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Chef Special',
    dietary: ['halal'],
    order: 14,
    timing: '7:00 AM – 1:30 PM'
  },
  {
    id: 'nashta-half-fry-eggs',
    name: 'Double Half-Fry Eggs (Zeera & Pepper)',
    category: 'eggs',
    categoryLabel: 'Farm Fresh Eggs',
    description: 'Two sunny-side-up desi eggs with luscious golden runny yolks, seasoned with roasted zeera and freshly cracked black peppercorns.',
    price: 240,
    serves: '2 Eggs Platter',
    image: 'https://images.unsplash.com/photo-1508253775351-be0aac8ce07e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1508253775351-be0aac8ce07e?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1508253775351-be0aac8ce07e?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Organic Farm Eggs',
    dietary: ['halal'],
    order: 15,
    timing: '7:00 AM – 1:30 PM'
  },

  // 6. CHANA & MORNING GRAVIES
  {
    id: 'nashta-lahori-murgh-chana',
    name: 'Lahori Murgh Chana (Chicken & Chickpeas)',
    category: 'chana',
    categoryLabel: 'Morning Chana Gravy',
    description: 'Tender chicken simmered in rich buttery Lahori chickpeas, cracked black pepper, whole spices, and fragrant oil roghan.',
    price: 680,
    originalPrice: 780,
    serves: '2 Persons',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    badge: '🔥 House Specialty',
    pairing: 'Enjoy with Rogheni Naan or Tawa Paratha',
    dietary: ['non-veg', 'halal'],
    order: 16,
    timing: '7:00 AM – 1:30 PM'
  },
  {
    id: 'nashta-tarka-chana-masala',
    name: 'Tarkay Walay Desi Chana Masala',
    category: 'chana',
    categoryLabel: 'Morning Chana Gravy',
    description: 'Slow-cooked Punjabi chickpeas tempered with golden fried garlic, whole red button chillies, and aromatic curry leaves.',
    price: 420,
    serves: '2 Persons',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    badge: 'Vegetarian Classic',
    dietary: ['veg', 'halal'],
    order: 17,
    timing: '7:00 AM – 1:30 PM'
  },
  {
    id: 'nashta-morning-nalli-nihari',
    name: 'Shahi Nalli Nihari Morning Cut',
    category: 'specials',
    categoryLabel: 'Morning Specials',
    description: 'Overnight slow-cooked beef shank stew infused with marrow bone nalli, fresh julienned ginger, green chillies, and lime squeeze.',
    price: 890,
    serves: '1-2 Persons',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    badge: '🥩 Slow-Cooked Marrow',
    dietary: ['non-veg', 'halal'],
    order: 18,
    timing: '7:00 AM – 12:00 PM'
  },
  {
    id: 'nashta-combo-sunday-buffet',
    name: 'Sunday Grand Nashta Feast Platter',
    category: 'combos',
    categoryLabel: 'Morning Combos',
    description: 'Complete family breakfast spread: 4 Hot Crispy Puris + Sooji Halwa + Lahori Murgh Chana + 2 Desi Masala Omelettes + 2 Earthen Matka Karak Chais + Mixed Achar.',
    price: 1590,
    originalPrice: 1950,
    serves: 'Feast for 2-3 Persons',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isFeatured: true,
    badge: '⭐ Best Value Combo',
    dietary: ['halal', 'desi-ghee'],
    order: 19,
    timing: 'Friday & Sunday 7:00 AM – 1:30 PM',
    offerText: 'Save ₨360 on Grand Combo'
  }
];

