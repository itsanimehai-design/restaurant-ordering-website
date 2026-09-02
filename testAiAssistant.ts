import { generateAssistantResponse } from './aiAssistantEngine';
import { RestaurantConfig, MenuItem, DessertBarItem } from '../types';

// Mock test data matching actual system structure
const mockConfig: RestaurantConfig = {
  name: 'Ilahiabad Grill & Dine',
  tagline: 'Authentic Traditional Flavours',
  currencySymbol: '₨',
  contact: {
    address: 'Main Boulevard, Ilahiabad, Pakistan',
    phone: '+92 300 1234567',
    email: 'info@ilahiabadgrill.com',
    whatsappNumber: '923001234567'
  },
  qrPayment: {
    isEnabled: true,
    accountName: 'Ilahiabad Dine Official'
  },
  hours: [
    { day: 'All Days', lunch: '12:30 PM – 3:30 PM', dinner: '6:30 PM – 11:30 PM' }
  ]
} as any;

const mockMenuItems: MenuItem[] = [
  {
    id: 'food-1',
    name: 'Special Chicken Karahi',
    category: 'karahi',
    price: 1450,
    description: 'Fresh chicken cooked in traditional iron wok with fresh tomatoes, ginger and green chillies.',
    isAvailable: true,
    isChefSpecial: true,
    spiceLevel: 2,
    pairingNote: 'Garlic Naan and Mint Raita'
  },
  {
    id: 'food-2',
    name: 'Smoky Beef Burger',
    category: 'burgers',
    price: 650,
    description: 'Charcoal grilled beef patty with cheddar cheese and smoky BBQ sauce.',
    isAvailable: true,
    spiceLevel: 1
  },
  {
    id: 'food-3',
    name: 'Crispy Fries',
    category: 'starters',
    price: 250,
    description: 'Golden salted French fries served with garlic mayo.',
    isAvailable: true,
    spiceLevel: 0
  },
  {
    id: 'food-4',
    name: 'Cold Drink (Can 250ml)',
    category: 'soft-drinks',
    price: 120,
    description: 'Ice chilled Pepsi, 7Up or Mirinda can.',
    isAvailable: true
  },
  {
    id: 'food-5',
    name: 'Mutton Handi Boneless',
    category: 'mutton',
    price: 2200,
    description: 'Tender boneless mutton cooked in creamy clay pot gravy.',
    isAvailable: true,
    spiceLevel: 2
  }
] as any[];

const mockDesserts: DessertBarItem[] = [
  {
    id: 'des-1',
    name: 'Royal Shahi Kulfa',
    category: 'kulfi',
    price: 280,
    description: 'Traditional creamy pistachio and saffron kulfa.',
    servingSize: '1 Bowl',
    isAvailable: true
  },
  {
    id: 'des-2',
    name: 'Chocolate Lava Cake',
    category: 'cake',
    price: 450,
    description: 'Warm molten chocolate cake with vanilla scoop.',
    servingSize: '1 Piece',
    isAvailable: true
  }
] as any[];

export function runAutomatedAssistantTestSuite() {
  console.log('=== RUNNING ASK AI COMPREHENSIVE SUITE OF TEST CONVERSATIONS ===\n');

  const testCases = [
    // 1. Greetings & Casual
    { query: 'Hi', expectedSituation: 'GREETING' },
    { query: 'Salam bhai', expectedSituation: 'GREETING' },
    { query: 'اسلام علیکم', expectedSituation: 'GREETING' },
    { query: 'helllooooo', expectedSituation: 'GREETING' },

    // 2. Typos & Phonetic queries
    { query: 'burgar kitny ka hy?', expectedSituation: 'PRICE_QUERY' },
    { query: 'chiken krahy ki prce btao', expectedSituation: 'PRICE_QUERY' },
    { query: 'delivri kaisy krwain?', expectedSituation: 'LOCATION_HOURS_CONTACT' },

    // 3. Food Complaints (Opinion vs Missing Info)
    { query: 'ye khana kitna khrab h', expectedSituation: 'FOOD_COMPLAINT' },
    { query: 'taste bohat bura tha', expectedSituation: 'FOOD_COMPLAINT' },
    { query: 'کھانا بہت خراب تھا', expectedSituation: 'FOOD_COMPLAINT' },

    // 4. Food Praise
    { query: 'Special Chicken Karahi bohat tasty thi', expectedSituation: 'FOOD_PRAISE' },
    { query: 'Burger zabardast maza aya', expectedSituation: 'FOOD_PRAISE' },

    // 5. Price Complaints (Opinion vs Missing Info)
    { query: 'ye to bohat mehnga hai', expectedSituation: 'PRICE_COMPLAINT' },
    { query: 'قیمت بہت زیادہ ہے', expectedSituation: 'PRICE_COMPLAINT' },

    // 6. Price Praise
    { query: 'bohat sasta khana hai yahan', expectedSituation: 'PRICE_PRAISE' },

    // 7. Competitor Comparison
    { query: 'doosri jagah ye sasta milta hai', expectedSituation: 'COMPETITOR_COMPARISON' },
    { query: 'falane restaurant ka burger tum se behtar hai', expectedSituation: 'COMPETITOR_ANOTHER_BETTER' },

    // 8. Anger / Frustration
    { query: 'tum log fraud ho bakwas time waste', expectedSituation: 'ANGRY_CUSTOMER' },

    // 9. Delivery Complaints & Praise
    { query: 'delivery bohat late ho gayi rider nahi aya', expectedSituation: 'DELIVERY_COMPLAINT' },
    { query: 'fast delivery on time thi maza aya', expectedSituation: 'DELIVERY_PRAISE' },

    // 10. Service Complaints & Praise
    { query: 'staff ka rawaiyya bekaar tha service kharab', expectedSituation: 'SERVICE_COMPLAINT' },
    { query: 'great service staff bohat polite tha', expectedSituation: 'SERVICE_PRAISE' },

    // 11. Thanks
    { query: 'thank you so much', expectedSituation: 'THANKS' },
    { query: 'bohat shukriya', expectedSituation: 'THANKS' },

    // 12. Budget requests
    { query: 'Mere paas ₨1000 hain, mera menu bana do', expectedSituation: 'BUDGET_REQUEST' },
    { query: '500 rupees mein kya milega?', expectedSituation: 'BUDGET_REQUEST' },

    // 13. Specific item queries (Real Menu Data)
    { query: 'Smoky Beef Burger ki details batao', expectedSituation: 'SPECIFIC_ITEM_QUERY' },
    { query: 'Special Chicken Karahi kitne ki hai?', expectedSituation: 'PRICE_QUERY' },
    { query: 'Royal Shahi Kulfa', expectedSituation: 'SPECIFIC_ITEM_QUERY' },

    // 14. Unknown restaurant fact (Missing info)
    { query: 'Pizza kitne ka hai?', expectedSituation: 'PRICE_QUERY' },

    // 15. Policy & Operations
    { query: 'Order cancel karne ka time kitna hota hai?', expectedSituation: 'ORDER_CANCELLATION' },
    { query: 'QR payment kaise kaam karta hai?', expectedSituation: 'PAYMENT_QR' },
    { query: 'Table reservation kaise karein?', expectedSituation: 'RESERVATION' },
    { query: 'AI rating aur normal review mein kya farq hai?', expectedSituation: 'REVIEWS_INFO' },

    // 16. Out of Scope
    { query: 'Aaj mausam kaisa hai aur cricket score kya hai?', expectedSituation: 'OUT_OF_SCOPE' },
    { query: 'Who is the president of America?', expectedSituation: 'OUT_OF_SCOPE' }
  ];

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    const res = generateAssistantResponse(tc.query, { section: 'general' }, {
      config: mockConfig,
      menuItems: mockMenuItems,
      dessertBarItems: mockDesserts
    });

    console.log(`[TEST] Query: "${tc.query}"`);
    console.log(`[OUTPUT] ${res.slice(0, 100)}...`);
    console.log('---');
    if (res && res.length > 5) passed++;
    else failed++;
  }

  // Multi-turn context test
  console.log('=== MULTI-TURN CONTEXT & ELLIPSIS TEST ===');
  const history: Array<{ sender: 'user' | 'assistant'; text: string }> = [
    { sender: 'user', text: 'Smoky Beef Burger kaisa hai?' },
    { sender: 'assistant', text: 'Smoky Beef Burger (₨ 650): Charcoal grilled beef patty...' }
  ];
  const followUp1 = generateAssistantResponse('Aur price?', { section: 'food' }, {
    config: mockConfig,
    menuItems: mockMenuItems,
    dessertBarItems: mockDesserts
  }, history);
  console.log(`Follow-up 1 (Aur price?): ${followUp1}`);

  const followUp2 = generateAssistantResponse('Aur delivery?', { section: 'food' }, {
    config: mockConfig,
    menuItems: mockMenuItems,
    dessertBarItems: mockDesserts
  }, history);
  console.log(`Follow-up 2 (Aur delivery?): ${followUp2}`);

  console.log(`\nTests completed. Passed: ${passed}, Failed: ${failed}`);
}
