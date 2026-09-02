import { 
  AssistantContextPayload, 
  RestaurantConfig, 
  MenuItem, 
  DessertBarItem, 
  SpecialRecipeItem, 
  OfferItem, 
  ChefMember, 
  EventItem, 
  ReviewItem,
  OrderItemEntry,
  DealItem 
} from '../types';
import responseLibraryJson from '../data/restaurant_ai_responses.json';

export interface PrewrittenResponse {
  id: number;
  intent: string;
  language: 'roman_urdu' | 'urdu';
  emotion: string;
  text: string;
}

export const ALL_20000_RESPONSES: PrewrittenResponse[] = responseLibraryJson as PrewrittenResponse[];

// Index the 20,000 responses by intent and language for high-performance O(1) candidate lookup
const responsesByIntentLang = new Map<string, PrewrittenResponse[]>();
for (const item of ALL_20000_RESPONSES) {
  const key = `${item.intent}__${item.language}`;
  let list = responsesByIntentLang.get(key);
  if (!list) {
    list = [];
    responsesByIntentLang.set(key, list);
  }
  list.push(item);
}

// Memory tracking of recently served response IDs to guarantee variety and prevent repetition
const recentUsedResponseIds: number[] = [];
const MAX_RECENT_HISTORY = 100;

export function getIndexedPrewrittenResponse(
  intent: string,
  toUrdu: boolean,
  fallbackText?: string
): string {
  const langKey = toUrdu ? 'urdu' : 'roman_urdu';
  const key = `${intent}__${langKey}`;
  const candidates = responsesByIntentLang.get(key) || [];
  if (candidates.length === 0) {
    return fallbackText || '';
  }

  // Filter out recently used ones if candidate pool permits
  let freshCandidates = candidates.filter(c => !recentUsedResponseIds.includes(c.id));
  if (freshCandidates.length === 0) {
    freshCandidates = candidates;
  }

  const selected = freshCandidates[Math.floor(Math.random() * freshCandidates.length)] || candidates[0];
  recentUsedResponseIds.push(selected.id);
  if (recentUsedResponseIds.length > MAX_RECENT_HISTORY) {
    recentUsedResponseIds.shift();
  }

  return selected.text;
}

export interface AssistantEngineData {
  config: RestaurantConfig;
  menuItems: MenuItem[];
  deals?: DealItem[];
  dessertBarItems?: DessertBarItem[];
  specialRecipes?: SpecialRecipeItem[];
  offers?: OfferItem[];
  chefs?: ChefMember[];
  events?: EventItem[];
  reviews?: ReviewItem[];
  cartItems?: OrderItemEntry[];
}

export interface AssistantQuickPrompt {
  id: string;
  label: string;
  query: string;
}

export type QueryLanguage = 'english' | 'roman_urdu' | 'urdu_script';

export type CustomerEmotion = 
  | 'happy' 
  | 'excited' 
  | 'thankful' 
  | 'curious' 
  | 'confused' 
  | 'disappointed' 
  | 'angry' 
  | 'frustrated' 
  | 'unsure' 
  | 'neutral' 
  | 'sarcastic';

export type AssistantSituation =
  | 'GREETING'
  | 'FOOD_PRAISE'
  | 'FOOD_COMPLAINT'
  | 'PRICE_PRAISE'
  | 'PRICE_COMPLAINT'
  | 'COMPETITOR_FAMOUS'
  | 'COMPETITOR_SMALLER'
  | 'COMPETITOR_COMPARISON'
  | 'COMPETITOR_ANOTHER_BETTER'
  | 'THIS_RESTAURANT_BETTER'
  | 'DELIVERY_PRAISE'
  | 'DELIVERY_COMPLAINT'
  | 'SERVICE_PRAISE'
  | 'SERVICE_COMPLAINT'
  | 'ANGRY_CUSTOMER'
  | 'SARCASM'
  | 'THANKS'
  | 'DEALS_QUERY'
  | 'RECOMMENDATION'
  | 'BUDGET_REQUEST'
  | 'BUDGET_FILTER_INFO'
  | 'ITEM_UNAVAILABLE'
  | 'FINE_DINING_EXPERIENCE'
  | 'AVAILABILITY_QUERY'
  | 'INGREDIENT_QUERY'
  | 'PRICE_QUERY'
  | 'SPECIFIC_ITEM_QUERY'
  | 'CATEGORY_QUERY'
  | 'CHEAPEST_ITEM_QUERY'
  | 'RESERVATION'
  | 'PAYMENT_QR'
  | 'CART_QUERY'
  | 'CHECKOUT_FLOW'
  | 'ORDER_CANCELLATION'
  | 'ORDER_TRACKING'
  | 'REVIEWS_INFO'
  | 'LOCATION_HOURS_CONTACT'
  | 'MASCOT_INFO'
  | 'REFUND_POLICY'
  | 'SUGGESTION'
  | 'PRIVACY_GUARD'
  | 'OUT_OF_SCOPE'
  | 'MEANINGLESS_GIBBERISH'
  | 'CLARIFICATION_NEEDED';

export interface ClassificationResult {
  situation: AssistantSituation;
  emotion: CustomerEmotion;
  detectedItemName?: string;
  matchedMenuItem?: MenuItem;
  matchedDessertItem?: DessertBarItem;
  budgetAmount?: number;
  subCategory?: string;
  competitorName?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. LANGUAGE DETECTION
// ═══════════════════════════════════════════════════════════════════════════
export function detectQueryLanguage(text: string): QueryLanguage {
  const trimmed = text.trim();
  if (!trimmed) return 'english';

  // 1. Urdu / Arabic Unicode detection
  const urduScriptRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
  if (urduScriptRegex.test(trimmed)) {
    return 'urdu_script';
  }

  // 2. Roman Urdu dictionary markers
  const lower = trimmed.toLowerCase();
  const romanUrduWords = [
    'hai', 'hain', 'kya', 'mein', 'batao', 'kitne', 'kitna', 'kitni', 'kaise', 'karo',
    'karna', 'chahiye', 'shamil', 'sasta', 'sasti', 'saste', 'bana', 'banao', 'do',
    'paas', 'mere', 'mera', 'meri', 'ke', 'ki', 'ko', 'ye', 'yeh', 'hum', 'hamara',
    'hamare', 'konsa', 'konsi', 'kuch', 'pe', 'par', 'se', 'nahi', 'haan', 'sath',
    'saath', 'bhejo', 'acha', 'ache', 'achha', 'achi', 'pesay', 'pese', 'rupay',
    'rupe', 'bhook', 'khana', 'khano', 'milta', 'milti', 'milte', 'hoga', 'hogi',
    'hote', 'kahan', 'bataen', 'bata', 'dein', 'bataiye', 'kholna', 'band',
    'billa', 'billi', 'chai', 'meetha', 'roti', 'gosht', 'pani', 'dawat', 'taqreeb',
    'chahiye', 'chahye', 'mujhe', 'humko', 'karen', 'order', 'kon', 'kab', 'ayegi', 'kaisa',
    'kharab', 'bura', 'bekar', 'bekaar', 'mehnga', 'mehngi', 'wahan', 'dusri', 'doosri',
    'falane', 'shukriya', 'meherbani', 'shukria', 'bohat', 'bohot', 'buhat', 'zabardast'
  ];

  const words = lower.split(/[^a-z0-9]+/);
  const matchCount = words.filter(w => romanUrduWords.includes(w)).length;

  if (matchCount >= 1 || (words.length <= 4 && romanUrduWords.some(rw => lower.includes(rw)))) {
    return 'roman_urdu';
  }

  return 'english';
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. TEXT NORMALIZATION & PHONETIC TYPO RESILIENCE
// ═══════════════════════════════════════════════════════════════════════════
export function normalizeCustomerQuery(text: string): string {
  let cleaned = text.toLowerCase();

  const replacements: [RegExp, string][] = [
    [/\b(burgar|burgr|brger|burgur|bargur|burgers|brgr)\b/g, 'burger'],
    [/\b(delivry|delivri|dilivery|delivary|dlvry|delvery|deliveri|delevry|delvry)\b/g, 'delivery'],
    [/\b(kaisy|kesy|kese|kasy|kse|kaisey)\b/g, 'kaise'],
    [/\b(kitny|kitne|ktny|kitna|ktna|kitni|ktni|ktnay|kitnay)\b/g, 'kitne'],
    [/\b(drik|drnk|drnks|drinq|drincks|sharbat|coldrink|cld drink)\b/g, 'drinks'],
    [/\b(chiken|chikn|chikken|chickn|murgh|murghi)\b/g, 'chicken'],
    [/\b(karahy|karhai|krahi|karai|krhy|krahy)\b/g, 'karahi'],
    [/\b(tika|tikkah|tikah|tikke)\b/g, 'tikka'],
    [/\b(kabaab|kebab|kabob|kbab)\b/g, 'kabab'],
    [/\b(boti|botee|bot)\b/g, 'boti'],
    [/\b(metha|meetha|mtha|swet|sweet|desrt|dessrt|desert|desserts)\b/g, 'dessert'],
    [/\b(prce|priice|qemat|qeemat|kimat|keemat|ret|rat|rates|pese|pesay|rupay|rupe)\b/g, 'price'],
    [/\b(kahan|khan|kidhr|kidhar|kdr|kdhar)\b/g, 'kahan'],
    [/\b(watsp|whatsap|whtsap|watsap|whatapp|wtsp|watsapp)\b/g, 'whatsapp'],
    [/\b(fone|phon|fon|numbr|nmber|cntct|rabta)\b/g, 'phone'],
    [/\b(timng|tymng|timing|tym|timings|openng|closng)\b/g, 'timing'],
    [/\b(resrvation|reserv|bokng|buking|bokkng)\b/g, 'reservation'],
    [/\b(ordr|odr|ordar|aorder|orderin|ordrng)\b/g, 'order'],
    [/\b(cncl|cancl|cancle|cancell|mansookh)\b/g, 'cancel'],
    [/\b(bila|billi|billa|billu)\b/g, 'billa'],
    [/\b(pepci|pepsii)\b/g, 'pepsi'],
    [/\b(cok|coca|coke)\b/g, 'coke'],
    [/\b(sprit|sprte)\b/g, 'sprite'],
    [/\b(seven up|sevenup|7 up)\b/g, '7up'],
    [/\b(fnta|fantta)\b/g, 'fanta'],
    [/\b(lasi|lasii)\b/g, 'lassi'],
    [/\b(chaye|chaii)\b/g, 'chai'],
    [/\b(faluda|faloodah)\b/g, 'falooda'],
    [/\b(qulfi|kulfii)\b/g, 'kulfi'],
    [/\b(icecream|ais cream|ice-cream)\b/g, 'ice cream'],
    [/\b(shak|shk|milkshak)\b/g, 'milkshake'],
    [/\b(choclat|choclate|chocolat)\b/g, 'chocolate'],
    [/\b(khrab|khraab|kharab|kharap|kharb)\b/g, 'kharab'],
    [/\b(bekar|bekaar|bikar|bkaar)\b/g, 'bekaar'],
    [/\b(mhanga|mehnga|mehngi|mahnga|mhengay|mehngay)\b/g, 'mehnga'],
    [/\b(sastaa|sastee|sastey)\b/g, 'sasta'],
    [/\b(skan|scaan)\b/g, 'scan'],
    [/\b(jazcash|jazz cash|jazz-cash)\b/g, 'jazzcash'],
    [/\b(ezpaisa|easy paisa|easy-paisa)\b/g, 'easypaisa'],
    [/\b(rast|raast pay)\b/g, 'raast']
  ];

  for (const [regex, rep] of replacements) {
    cleaned = cleaned.replace(regex, rep);
  }

  return cleaned;
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. GIBBERISH & NONSENSE DETECTOR
// ═══════════════════════════════════════════════════════════════════════════
export function isGibberishOrNonsense(rawText: string): boolean {
  const trimmed = rawText.trim().toLowerCase();
  if (!trimmed) return false;

  // Do not flag greetings / affirmations as gibberish even with repeated letters
  if (/^(h+e+l+o+|h+i+|h+e+y+|y+o+|s+a+l+a+m+|o+k+|a+c+h+a+|b+r+o+|b+h+a+i+|p+l+z+|p+l+e+a+s+e+)$/i.test(trimmed)) {
    return false;
  }

  const words = trimmed.split(/[^a-z0-9]+/i).filter(Boolean);
  if (words.length === 0) return false;

  // 1. Repeating single character like "aaaaaa", "zzzzzz", "111111"
  if (/^([a-z0-9])\1{4,}$/i.test(trimmed)) {
    return true;
  }

  // 2. Keyboard rows and mash patterns
  const mashPatterns = [
    'asdf', 'fdsa', 'qwer', 'rewq', 'zxcv', 'vcxz', 'hjkl', 'lkjh', 'qweqwe',
    'asdasd', 'zxczxc', 'asdhjk', 'jshdjd', 'hshsh', 'fghjk', 'dfghj', 'ghjkl',
    'mnbvc', 'poiuy', 'tyuio', 'zxcvb'
  ];
  if (mashPatterns.some(p => trimmed.includes(p))) {
    return true;
  }

  // 3. Check for consonant strings with 4+ consonants and no vowels
  const allowedShortTokens = ['qr', 'pkr', 'rs', 'cod', 'fb', 'wa', 'eta', 'faq', 'sms', 'otp', 'kfc'];
  for (const w of words) {
    if (w.length >= 4 && !/[aeiouy]/i.test(w) && !allowedShortTokens.includes(w)) {
      return true;
    }
  }

  // 4. Random single token with heavy consonant clustering (5+ consecutive consonants)
  if (words.length === 1 && words[0].length >= 5) {
    const single = words[0];
    const vowels = (single.match(/[aeiou]/gi) || []).length;
    if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(single)) {
      return true;
    }
    if (vowels === 0 && !allowedShortTokens.includes(single) && !/^\d+$/.test(single)) {
      return true;
    }
  }

  return false;
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. EMOTION & SENTIMENT DETECTOR
// ═══════════════════════════════════════════════════════════════════════════
export function detectCustomerEmotion(query: string, normalized: string): CustomerEmotion {
  const lower = query.toLowerCase();
  const norm = normalized.toLowerCase();

  // Sarcasm detection (e.g. "wah kya kharab khana", "bohat shukriya itni ghatiya delivery ka")
  if (
    ((lower.includes('wah') || lower.includes('shukriya') || lower.includes('great') || lower.includes('kamal')) &&
     (lower.includes('kharab') || lower.includes('bekaar') || lower.includes('ghatiya') || lower.includes('late') || lower.includes('bura'))) ||
    ((lower.includes('itna acha') || lower.includes('itna tasty')) && (lower.includes('kacha') || lower.includes('jal gaya')))
  ) {
    return 'sarcastic';
  }

  // Angry / Aggressive
  if (
    /\b(fraud|chup|shut up|idiot|pagal|bakwas|ghatiya|gali|rubbish|hate|stupid|loot|chor|zaleel)\b/i.test(lower) ||
    /بکواس|گھٹیا|پاگل|چپ|فراڈ|لوٹ/.test(query)
  ) {
    return 'angry';
  }

  // Frustrated / Disappointed
  if (
    /\b(kharab|bekaar|bekar|bura|bad|worst|disappoint|disappointed|mayoos|late|slow|kacha|jal gaya|nahi aya|nahi aayi|bohat der)\b/i.test(lower) ||
    /\b(kharab|bekaar|bekar|bura|bad|worst|disappoint|disappointed|mayoos|late|slow|kacha|jal gaya|nahi aya|nahi aayi|bohat der)\b/i.test(norm) ||
    /خراب|بیکار|برا|مایوس|دیر|سست|نہیں آیا|جل گیا/.test(query)
  ) {
    return 'frustrated';
  }

  // Thankful
  if (
    /\b(thanks|thank you|shukriya|shukria|meherbani|jazakallah|dhanyawad)\b/i.test(lower) ||
    /شکریہ|مہربانی|جزاک اللہ/.test(query)
  ) {
    return 'thankful';
  }

  // Happy / Excited / Praise
  if (
    /\b(tasty|delicious|yummy|zabardast|lajawab|kamaal|kamal|shandar|loved it|love your food|maza aa gaya|dil khush|best food|10\/10|superb|awesome)\b/i.test(lower) ||
    /زبردست|لاجواب|مزہ آیا|کمال|شاندار|بہترین|پسند آیا/.test(query)
  ) {
    return 'happy';
  }

  // Confused / Unsure
  if (
    /\b(kaise|kahan|kidhar|samajh nahi|confusion|how to|where|kese|kaisy)\b/i.test(lower) ||
    query.includes('???') ||
    /کیسے|کہاں|سمجھ نہیں/.test(query)
  ) {
    return 'confused';
  }

  // Curious (questions about menu, options, prices, items)
  if (
    /\b(kya|kitne|kitna|konsa|konsi|option|batao|bataen|check|hai|kya hai)\b/i.test(lower) ||
    /کیا|کتنے|کونسا|بتاؤ|بتائیں/.test(query)
  ) {
    return 'curious';
  }

  return 'neutral';
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. SITUATION CLASSIFIER & CONVERSATION CONTEXT RESOLVER
// ═══════════════════════════════════════════════════════════════════════════
export function classifySituationAndIntent(
  rawQuery: string,
  normalized: string,
  context: AssistantContextPayload,
  data: AssistantEngineData,
  conversationHistory: Array<{ sender: 'user' | 'assistant'; text: string }> = []
): ClassificationResult {
  const query = rawQuery.trim();
  const lower = query.toLowerCase();
  const norm = normalized.toLowerCase();
  const emotion = detectCustomerEmotion(query, norm);
  const { menuItems = [], dessertBarItems = [] } = data;

  // ── A. Gibberish / Nonsense Check ──
  if (isGibberishOrNonsense(query)) {
    return { situation: 'MEANINGLESS_GIBBERISH', emotion: 'confused' };
  }

  // ── B. Context Memory Resolver: Find referenced item in history if elliptical ──
  let detectedItemName: string | undefined = undefined;
  let matchedMenuItem: MenuItem | undefined = undefined;
  let matchedDessertItem: DessertBarItem | undefined = undefined;

  // 1. Exact or substring match in current query
  for (const m of menuItems) {
    const mLower = m.name.toLowerCase();
    if (lower.includes(mLower) || norm.includes(mLower)) {
      matchedMenuItem = m;
      detectedItemName = m.name;
      break;
    }
  }

  if (!matchedMenuItem) {
    for (const d of dessertBarItems) {
      const dLower = d.name.toLowerCase();
      if (lower.includes(dLower) || norm.includes(dLower)) {
        matchedDessertItem = d;
        detectedItemName = d.name;
        break;
      }
    }
  }

  // 2. Distinct token matching (e.g. "burger", "karahi", "handi", "kulfa", "fries", "cake")
  if (!matchedMenuItem && !matchedDessertItem) {
    const queryTokens = norm.split(/[^a-z0-9]+/i).filter(t => t.length >= 3);
    for (const m of menuItems) {
      const itemTokens = m.name.toLowerCase().split(/[^a-z0-9]+/i).filter(t => t.length >= 3 && !['special', 'fresh', 'hot', 'crispy'].includes(t));
      if (queryTokens.some(qt => itemTokens.includes(qt))) {
        matchedMenuItem = m;
        detectedItemName = m.name;
        break;
      }
    }
  }

  if (!matchedMenuItem && !matchedDessertItem) {
    const queryTokens = norm.split(/[^a-z0-9]+/i).filter(t => t.length >= 3);
    for (const d of dessertBarItems) {
      const itemTokens = d.name.toLowerCase().split(/[^a-z0-9]+/i).filter(t => t.length >= 3 && !['royal', 'special'].includes(t));
      if (queryTokens.some(qt => itemTokens.includes(qt) || (qt === 'kulfi' && itemTokens.includes('kulfa')))) {
        matchedDessertItem = d;
        detectedItemName = d.name;
        break;
      }
    }
  }

  // 3. If not found in current query, search context & previous conversation history for item reference
  if (!matchedMenuItem && !matchedDessertItem) {
    if (context.itemName || context.itemId) {
      matchedMenuItem = menuItems.find(m => m.id === context.itemId || m.name.toLowerCase() === context.itemName?.toLowerCase());
      if (matchedMenuItem) detectedItemName = matchedMenuItem.name;
    } else if (conversationHistory.length > 0) {
      // Look back through last 3 user/assistant messages for item mention
      const recentHistory = conversationHistory.slice(-4);
      for (const msg of recentHistory.reverse()) {
        const histLower = msg.text.toLowerCase();
        for (const m of menuItems) {
          if (histLower.includes(m.name.toLowerCase())) {
            matchedMenuItem = m;
            detectedItemName = m.name;
            break;
          }
        }
        if (matchedMenuItem) break;
      }
    }
  }

  // ── C. Angry / Rude Customer Guard ──
  if (
    /\b(fraud|chup kar|shut up|idiot|pagal|bakwas|ghatiya|gali|rubbish|hate|stupid|tum log bekaar|time waste|zaleel)\b/i.test(lower) ||
    /بکواس|گھٹیا|پاگل|چپ کر|فراڈ|لوٹ رہے/.test(query)
  ) {
    return { situation: 'ANGRY_CUSTOMER', emotion: 'angry' };
  }

  // ── D. Competitor Comparison (Bigger/Famous vs Smaller/Other) ──
  const famousCompetitors: { key: string; display: string }[] = [
    { key: 'kolachi', display: 'Kolachi' },
    { key: 'bundu khan', display: 'Bundu Khan' },
    { key: 'monal', display: 'Monal' },
    { key: 'lalqila', display: 'LalQila' },
    { key: 'lal qila', display: 'LalQila' },
    { key: 'shinwari', display: 'Shinwari' },
    { key: 'haveli', display: 'Haveli' },
    { key: 'bbq tonight', display: 'BBQ Tonight' },
    { key: 'barbeque tonight', display: 'BBQ Tonight' },
    { key: 'kababjees', display: 'Kababjees' },
    { key: 'kabab jees', display: 'Kababjees' },
    { key: 'arizona grill', display: 'Arizona Grill' },
    { key: 'howdy', display: 'Howdy' },
    { key: 'hardees', display: "Hardee's" },
    { key: "hardee's", display: "Hardee's" },
    { key: 'kfc', display: 'KFC' },
    { key: 'mcdonald', display: "McDonald's" },
    { key: 'mcdonalds', display: "McDonald's" },
    { key: "mcdonald's", display: "McDonald's" },
    { key: 'cheezious', display: 'Cheezious' },
    { key: 'broadway', display: 'Broadway Pizza' },
    { key: 'subway', display: 'Subway' },
    { key: 'dominos', display: "Domino's" },
    { key: "domino's", display: "Domino's" },
    { key: 'pizza hut', display: 'Pizza Hut' },
    { key: 'salt n pepper', display: "Salt'n Pepper" },
    { key: "salt'n pepper", display: "Salt'n Pepper" },
    { key: 'salt and pepper', display: "Salt'n Pepper" },
    { key: 'optp', display: 'OPTP' },
    { key: 'butt karahi', display: 'Butt Karahi' },
    { key: 'savour', display: 'Savour Foods' },
    { key: 'savour foods', display: 'Savour Foods' },
    { key: 'nandos', display: "Nando's" },
    { key: "nando's", display: "Nando's" },
    { key: 'gloria jeans', display: "Gloria Jean's" },
    { key: 'tim hortons', display: 'Tim Hortons' },
    { key: 'ginsoy', display: 'Ginsoy' },
    { key: 'student biryani', display: 'Student Biryani' },
    { key: 'tuscany courtyard', display: 'Tuscany Courtyard' },
    { key: 'cafe aylanto', display: 'Cafe Aylanto' },
    { key: 'chaaye khana', display: 'Chaaye Khana' },
    { key: 'meikong', display: 'Mei Kong' },
    { key: 'mei kong', display: 'Mei Kong' },
    { key: 'second cup', display: 'Second Cup' }
  ];

  const matchedFamous = famousCompetitors.find(fc => lower.includes(fc.key) || norm.includes(fc.key));
  if (matchedFamous) {
    return { situation: 'COMPETITOR_FAMOUS', emotion: 'neutral', detectedItemName: matchedFamous.display };
  }

  const smallerCompetitorKeywords = [
    'doosri jagah', 'dusri jagah', 'doosre restaurant', 'dusre restaurant', 'doosri dukan', 'dusri dukan',
    'falane restaurant', 'falane ka', 'falana restaurant', 'dusra restaurant', 'doosra restaurant',
    'local dukan', 'dhaba', 'street vendor', 'street food', 'wahan sasta', 'wahan sasti', 'wahan behtar',
    'wahan zyada', 'tum log mehngay ho aur woh saste', 'wahan ka burger better', 'tum se acha',
    'wahan ka khana tum se acha', 'wahan better', 'yahan se acha to wahan', 'tum se behtar',
    'cheaper elsewhere', 'better elsewhere', 'bahar sasta', 'dusri shop', 'doosri shop',
    'دوسری جگہ', 'دوسرا ریسٹورنٹ', 'وہاں سستا', 'تم سے اچھا', 'دوسری دکان'
  ];

  if (
    smallerCompetitorKeywords.some(kw => lower.includes(kw) || norm.includes(kw)) ||
    /(?:doosri|dusri|falane|dusra|doosra).*(?:sasta|behtar|acha|better|mehnga)/i.test(norm)
  ) {
    return { situation: 'COMPETITOR_SMALLER', emotion: 'neutral' };
  }

  // ── E. Sarcasm Check ──
  if (emotion === 'sarcastic') {
    return { situation: 'SARCASM', emotion: 'sarcastic', detectedItemName };
  }

  // ── F. Customer Says This Restaurant Is Better / High Praise ──
  if (
    /\b(tumhara food best|tumhara khana best|yahan sabse acha|ye restaurant bohat acha|you are the best|best food in town|sabse best restaurant)\b/i.test(lower) ||
    /آپ کا کھانا بہترین|سب سے اچھا ریسٹورنٹ|بہترین کھانا/.test(query)
  ) {
    return { situation: 'THIS_RESTAURANT_BETTER', emotion: 'happy' };
  }

  // ── G. Delivery Complaints vs Delivery Praise ──
  if (
    /(?:delivery|rider|order).*(?:late|slow|der|nahi aya|nahi aayi|bekaar|bekar|kharab|problem|issue|time lag)/i.test(lower) ||
    /(?:late|slow|der|nahi aya).*(?:delivery|rider|order)/i.test(lower) ||
    /ڈیلیوری.*(لیٹ|سست|خراب|دیر)|آرڈر.*(نہیں آیا|دیر|لیٹ)|بہت دیر ہو گئی/.test(query)
  ) {
    return { situation: 'DELIVERY_COMPLAINT', emotion: 'frustrated' };
  }

  if (
    /(?:delivery|rider|order).*(?:fast|jaldi|on time|time par|time pe|zabardast|achi|best|great|quick)/i.test(lower) ||
    /(?:fast|jaldi|on time|time par|quick).*(?:delivery|rider|order)/i.test(lower) ||
    /ڈیلیوری.*(وقت پر|فاسٹ|تیز|بہترین|زبردست)|فاسٹ ڈیلیوری/.test(query)
  ) {
    return { situation: 'DELIVERY_PRAISE', emotion: 'happy' };
  }

  // ── H. Service Complaints vs Service Praise ──
  if (
    /(?:service|staff|waiter|behavior|rawaiyya|attitude).*(?:bekaar|bekar|kharab|bura|bad|worst|rude|slow|theek nahi|ganda)/i.test(lower) ||
    /(?:bekaar|bekar|kharab|bura|bad|worst|rude).*(?:service|staff|waiter)/i.test(lower) ||
    /سروس.*(بیکار|خراب|بری|سست)|سٹاف.*(روڈ|خراب|بدتمیز|بیکار)/.test(query)
  ) {
    return { situation: 'SERVICE_COMPLAINT', emotion: 'disappointed' };
  }

  if (
    /(?:service|staff|waiter|behavior|rawaiyya).*(?:achi|acha|polite|helpful|great|excellent|zabardast|best|friendly|cooperative)/i.test(lower) ||
    /(?:great|excellent|good|best|zabardast).*(?:service|staff|waiter)/i.test(lower) ||
    /سروس.*(بہت اچھی|عمدہ|بہترین|زبردست)|سٹاف.*(مددگار|شائستہ|اچھا)/.test(query)
  ) {
    return { situation: 'SERVICE_PRAISE', emotion: 'happy' };
  }

  // ── I. Price Complaints vs Price Praise ──
  if (
    /(?:price|qeemat|rate|pese|khana|burger|karahi|handi|tikka|ye|yeh|itna|itni).*(?:mehnga|mehngi|mehngay|zyada|expensive|overpriced|loot|afford nahi|worth it nahi|kam karo)/i.test(lower) ||
    /(?:bohat|bohot|buhat|itna|itni|kitna|kitni|too|ye to bohat).*(?:mehnga|mehngi|mehngay|expensive|overpriced)/i.test(lower) ||
    /(?:price|rate|qeemat)\s*(?:zyada|high|kam)/i.test(norm) ||
    /قیمت.*(زیادہ|مہنگی|مہنگا)|بہت مہنگا|بہت مہنگی|مہنگا ہے|مہنگی ہے/.test(query)
  ) {
    return { situation: 'PRICE_COMPLAINT', emotion: 'frustrated', detectedItemName, matchedMenuItem };
  }

  if (
    /(?:price|qeemat|rate).*(?:sasta|sasti|saste|reasonable|munasib|kam|affordable|pocket friendly|worth it|achi)/i.test(lower) ||
    /(?:bohat|bohot|buhat).*(?:sasta|sasti|saste|reasonable|munasib|pocket friendly|affordable)/i.test(lower) ||
    /(?:sasta|sasti|saste).*(?:khana|food|yahan)/i.test(lower) ||
    /قیمت.*(مناسب|کم|سستی|سستا)|بہت سستا|سستا کھانا|مناسب ریٹ/.test(query)
  ) {
    return { situation: 'PRICE_PRAISE', emotion: 'happy' };
  }

  // ── J. Food Complaints (Taste / Quality opinion) ──
  if (
    /(?:taste|zaika|khana|food|burger|karahi|handi|tikka|roll|boti|fries|dish).*(?:kharab|khrab|bura|bekaar|bekar|ganda|kacha|jal gaya|theek nahi|thanda|cold|be swad|be maza)/i.test(lower) ||
    /(?:kharab|khrab|bura|bekaar|bekar|ganda|kacha|jal gaya|theek nahi|thanda|cold|be swad|be maza).*(?:taste|zaika|khana|food|burger|karahi|handi|tikka|roll|boti|fries|dish)/i.test(lower) ||
    /\b(taste kharab|taste bura|taste bekaar|khana bekaar|ye khana kitna khrab|ye khana kitna kharab|pasand nahi aya|pasand nahi aayi|burgar khrab|burger kharab|ye bohat bura tha)\b/i.test(lower) ||
    /کھانا.*(خراب|بیکار|برا|کچا|ٹھنڈا|پسند نہیں)|(خراب|بیکار|برا|کچا|ٹھنڈا).*کھانا|ذائقہ.*(خراب|برا|بیکار)|پسند نہیں آیا/.test(query)
  ) {
    return { situation: 'FOOD_COMPLAINT', emotion: 'disappointed', detectedItemName, matchedMenuItem };
  }

  // ── K. Food Praise (Taste / Quality praise) ──
  if (
    /(?:taste|zaika|khana|food|burger|karahi|handi|tikka|roll|boti|fries|dish).*(?:tasty|delicious|yummy|zabardast|lajawab|kamaal|kamal|shandar|fresh|mazedar|maza aya|bohat acha|bohot acha|acha tha)/i.test(lower) ||
    /(?:tasty|delicious|yummy|zabardast|lajawab|kamaal|kamal|shandar|fresh|mazedar|maza aya|bohat acha|bohot acha).*(?:taste|zaika|khana|food|burger|karahi|handi|tikka|roll|boti|fries|dish)/i.test(lower) ||
    /\b(bohat tasty|tasty tha|delicious tha|yummy|zabardast taste|taste zabardast|bohat acha khana|khana bohat acha|maza aa gaya|maza aya|loved it|lajawab|fresh tha)\b/i.test(lower) ||
    /کھانا.*(مزیدار|بہترین|شاندار|لاجواب|کمال|زبردست|بہت اچھا)|(مزیدار|بہترین|شاندار|لاجواب|کمال|زبردست|بہت اچھا).*کھانا|ذائقہ.*(لاجواب|شاندار|کمال|زبردست|مزیدار|بہت اچھا)|بہت مزہ آیا|پسند آیا/.test(query)
  ) {
    return { situation: 'FOOD_PRAISE', emotion: 'happy', detectedItemName, matchedMenuItem };
  }

  // ── L. Thanks / Appreciation ──
  const thanksKeywords = ['thank you', 'thanks', 'thx', 'thank u', 'thankyou', 'shukriya', 'shukria', 'bohat meherbani', 'jazakallah', 'jazak allah', 'شکریہ', 'مہربانی'];
  const cleanedPunc = lower.replace(/[.,/#!$%^&*;:{}=\-_`~()?!👋😊❤️👍]/g, ' ').trim();
  if (thanksKeywords.some(t => cleanedPunc === t || cleanedPunc.startsWith(t + ' ') || cleanedPunc.endsWith(' ' + t))) {
    return { situation: 'THANKS', emotion: 'thankful' };
  }

  // ── M. Greeting & Casual ──
  if (isGreetingOrCasualMessage(query)) {
    return { situation: 'GREETING', emotion: 'happy' };
  }

  // ── N. Budget Calculation & Budget Prompts ──
  const isBudgetPrompt = lower.includes('budget') || norm.includes('budget') || lower.includes('bana do') || lower.includes('banao') || lower.includes('menu bana') || lower.includes('mein kya') || lower.includes('bachat') || lower.includes('paas') || lower.includes('mere paas');
  const extractedBudget = extractBudgetFromQuery(query) || extractBudgetFromQuery(norm);
  if (extractedBudget && (isBudgetPrompt || extractedBudget > 0)) {
    return { situation: 'BUDGET_REQUEST', emotion: 'curious', budgetAmount: extractedBudget };
  }

  if (
    norm.includes('budget filter') ||
    (norm.includes('budget') && (norm.includes('kaise') || norm.includes('use') || norm.includes('kahan') || norm.includes('kholo') || norm.includes('how to')))
  ) {
    return { situation: 'BUDGET_FILTER_INFO', emotion: 'curious' };
  }

  // ── Deals, Combos & Meals Packages ──
  if (
    norm.includes('deal') || norm.includes('deals') ||
    norm.includes('combo') || norm.includes('family pack') || norm.includes('family deal') ||
    norm.includes('couple deal') || norm.includes('friends deal') || norm.includes('single deal') ||
    norm.includes('party deal') || norm.includes('meals and deals') || norm.includes('meal combo') ||
    (norm.includes('meals') && (norm.includes('kya') || norm.includes('available') || norm.includes('options') || norm.includes('packages') || norm.includes('batao'))) ||
    /ڈیلز|ڈیل|کمبو|فیملی ڈیل|کپل ڈیل/.test(query)
  ) {
    return { situation: 'DEALS_QUERY', emotion: 'curious' };
  }

  // ── O. Recommendations ──
  const recKeywords = ['kya loon', 'kya lun', 'kya acha hai', 'kya acha h', 'suggest karo', 'recommend karo', 'kya mangwaon', 'special kya hai', 'bhook lagi hai', 'mashwara do', 'کیا لوں', 'کیا اچھا ہے', 'تجویز کریں'];
  if (recKeywords.some(kw => lower.includes(kw) || norm.includes(kw))) {
    return { situation: 'RECOMMENDATION', emotion: 'curious' };
  }

  // ── P. Order Cancellation ──
  if (norm.includes('cancel') || lower.includes('mansookh') || norm.includes('cancellation')) {
    return { situation: 'ORDER_CANCELLATION', emotion: 'curious' };
  }

  // ── Q. Order Status & Flow ──
  if (norm.includes('status') || norm.includes('track') || norm.includes('stages') || lower.includes('marahil') || lower.includes('kahan pohncha')) {
    return { situation: 'ORDER_TRACKING', emotion: 'curious' };
  }

  // ── R. QR & Payment ──
  if (norm.includes('qr') || norm.includes('scan') || norm.includes('raast') || norm.includes('jazzcash') || norm.includes('easypaisa') || norm.includes('payment method')) {
    return { situation: 'PAYMENT_QR', emotion: 'curious' };
  }

  // ── S. Cart & Checkout ──
  if (
    (norm.includes('add to cart') && norm.includes('order now')) ||
    (norm.includes('cart') && norm.includes('direct') && norm.includes('farq')) ||
    (norm.includes('farq') && norm.includes('order'))
  ) {
    return { situation: 'CHECKOUT_FLOW', emotion: 'curious' };
  }

  if (norm.includes('cart') && (norm.includes('kahan') || norm.includes('kidhar') || norm.includes('items') || norm.includes('total') || norm.includes('where'))) {
    return { situation: 'CART_QUERY', emotion: 'curious' };
  }

  // ── T. Reservations & Timings ──
  if (norm.includes('reservation') || norm.includes('table book') || norm.includes('booking') || norm.includes('seat')) {
    return { situation: 'RESERVATION', emotion: 'curious' };
  }

  // ── U. Reviews Info vs AI Rating ──
  if (norm.includes('ai rating') || (norm.includes('rating') && norm.includes('review'))) {
    return { situation: 'REVIEWS_INFO', emotion: 'curious' };
  }

  // ── V. Cheapest Dish / Lowest Price ──
  if (norm.includes('sab se sasta') || norm.includes('sabse sasta') || norm.includes('cheapest') || norm.includes('lowest price') || norm.includes('kam price')) {
    return { situation: 'CHEAPEST_ITEM_QUERY', emotion: 'curious' };
  }

  // ── W. Category Queries (Burgers, Drinks, Desserts, Chicken, Mutton, Karahi, etc.) ──
  if (norm.includes('drink') || norm.includes('pepsi') || norm.includes('coke') || norm.includes('sprite') || norm.includes('cold drink') || norm.includes('lassi')) {
    return { situation: 'CATEGORY_QUERY', emotion: 'curious', subCategory: 'drinks' };
  }
  if (norm.includes('dessert') || norm.includes('ice cream') || norm.includes('kulfi') || norm.includes('falooda') || norm.includes('meetha')) {
    return { situation: 'CATEGORY_QUERY', emotion: 'curious', subCategory: 'desserts' };
  }
  if (norm.includes('chicken') && (norm.includes('option') || norm.includes('kya hai') || norm.includes('dishes') || norm.includes('menu'))) {
    return { situation: 'CATEGORY_QUERY', emotion: 'curious', subCategory: 'chicken' };
  }
  if (norm.includes('mutton') && (norm.includes('option') || norm.includes('kya hai') || norm.includes('dishes') || norm.includes('menu'))) {
    return { situation: 'CATEGORY_QUERY', emotion: 'curious', subCategory: 'mutton' };
  }

  // ── X. Specific Item Inquiry / Price Inquiry / Negative & Unavailable Item Checks ──
  const isNegativeAvailabilityQuery =
    /\b(nahi hai|available nahi|nahi milta|nahi milega|khatam|available nahi hai|kyun nahi|missing|unavailable|not available|mojood nahi|not on menu)\b/i.test(lower) ||
    /نہیں ہے|دستیاب نہیں|ختم ہو گیا|موجود نہیں|نہیں مل رہا/.test(query);

  if (matchedMenuItem) {
    if (matchedMenuItem.isAvailable === false || isNegativeAvailabilityQuery) {
      return { situation: 'ITEM_UNAVAILABLE', emotion: 'curious', detectedItemName: matchedMenuItem.name, matchedMenuItem };
    }
    if (norm.includes('price') || norm.includes('kitne') || norm.includes('cost') || norm.includes('rate') || norm.includes('qeemat') || norm.includes('aur price')) {
      return { situation: 'PRICE_QUERY', emotion: 'curious', detectedItemName, matchedMenuItem, matchedDessertItem };
    }
    if (norm.includes('available') || norm.includes('hai') || norm.includes('mil jayega')) {
      return { situation: 'AVAILABILITY_QUERY', emotion: 'curious', detectedItemName, matchedMenuItem, matchedDessertItem };
    }
    if (norm.includes('ingredient') || norm.includes('kya hai') || norm.includes('sauce') || norm.includes('spicy') || norm.includes('serving')) {
      return { situation: 'INGREDIENT_QUERY', emotion: 'curious', detectedItemName, matchedMenuItem, matchedDessertItem };
    }
    return { situation: 'SPECIFIC_ITEM_QUERY', emotion: 'curious', detectedItemName, matchedMenuItem, matchedDessertItem };
  }

  if (matchedDessertItem) {
    if (matchedDessertItem.isAvailable === false || isNegativeAvailabilityQuery) {
      return { situation: 'ITEM_UNAVAILABLE', emotion: 'curious', detectedItemName: matchedDessertItem.name, matchedDessertItem };
    }
    if (norm.includes('price') || norm.includes('kitne') || norm.includes('cost') || norm.includes('rate') || norm.includes('qeemat') || norm.includes('aur price')) {
      return { situation: 'PRICE_QUERY', emotion: 'curious', detectedItemName, matchedMenuItem, matchedDessertItem };
    }
    if (norm.includes('available') || norm.includes('hai') || norm.includes('mil jayega')) {
      return { situation: 'AVAILABILITY_QUERY', emotion: 'curious', detectedItemName, matchedMenuItem, matchedDessertItem };
    }
    return { situation: 'SPECIFIC_ITEM_QUERY', emotion: 'curious', detectedItemName, matchedMenuItem, matchedDessertItem };
  }

  // Check if user is inquiring about an item NOT on the menu or asking negative availability
  const unconfiguredItemMatch = norm.match(/(?:sushi|pizza|biryani|pasta|pulao|shawarma|chowmein|steak|soup|fish|prawn|roll|lasagna|hotpot|noodles|momos|dim sum|tacos|sandwich|curry|halwa|nihari|haleem|chana|daal|burger)\b/i);
  if (unconfiguredItemMatch || isNegativeAvailabilityQuery) {
    const rawMatchedName = unconfiguredItemMatch ? unconfiguredItemMatch[0] : (detectedItemName || 'Item');
    const capitalName = rawMatchedName.charAt(0).toUpperCase() + rawMatchedName.slice(1);
    return { situation: 'ITEM_UNAVAILABLE', emotion: 'curious', detectedItemName: capitalName };
  }

  // ── Fine Dining / Open-Fire Hearth Experience ──
  if (
    norm.includes('experience') || norm.includes('fine dining') || norm.includes('open fire') ||
    norm.includes('open-fire') || norm.includes('hearth') || norm.includes('ambience') ||
    norm.includes('charcoal') || norm.includes('environment') || norm.includes('dining experience') ||
    /فائن ڈائننگ|اوپن فائر|تجربہ|ماحول/.test(query)
  ) {
    return { situation: 'FINE_DINING_EXPERIENCE', emotion: 'curious' };
  }

  // ── Y. Location, Hours, Phone, Contact ──
  if (
    norm.includes('location') || norm.includes('address') || norm.includes('kahan') || norm.includes('pata') ||
    norm.includes('timing') || norm.includes('hours') || norm.includes('open') || norm.includes('close') ||
    norm.includes('phone') || norm.includes('contact') || norm.includes('number') || norm.includes('whatsapp')
  ) {
    return { situation: 'LOCATION_HOURS_CONTACT', emotion: 'curious' };
  }

  // ── Z. Mascot Info ──
  if (norm.includes('billa') || lower.includes('billi') || norm.includes('mascot') || lower.includes('cat')) {
    return { situation: 'MASCOT_INFO', emotion: 'curious' };
  }

  // ── Out-of-Scope Check ──
  const offTopicKeywords = [
    'weather', 'mausam', 'barish', 'temperature', 'cricket', 'score', 'match', 'ipl', 'psl',
    'prime minister', 'president', 'imran', 'nawaz', 'biden', 'trump', 'politics', 'siyasat',
    'election', 'vote', 'news', 'khabar', 'crypto', 'bitcoin', 'ethereum', 'stock market',
    'dollar rate', 'dollar', 'gold price', 'python', 'javascript', 'coding', 'chatgpt', 'openai',
    'gemini model', 'deepseek', 'anthropic', 'capital of', 'darul hukumat', 'movie', 'film',
    'actor', 'actress', 'song', 'gaana', 'cinema', 'game', 'pubg', 'fortnite', 'gta',
    'messi', 'ronaldo', 'cristiano', 'football', 'iphone', 'samsung', 'math', 'calculate',
    '2+2', 'who created', 'general knowledge', 'history of pakistan', 'joke', 'shayari',
    'car', 'bike', 'job', 'salary', 'university', 'college', 'exam', 'paper', 'hospital'
  ];
  if (offTopicKeywords.some(kw => lower.includes(kw) || norm.includes(kw))) {
    return { situation: 'OUT_OF_SCOPE', emotion: 'neutral' };
  }

  // If query is restaurant related but didn't match a specific item
  if (isRestaurantRelatedTopic(lower) || isRestaurantRelatedTopic(norm)) {
    return { situation: 'CLARIFICATION_NEEDED', emotion: 'neutral' };
  }

  return { situation: 'OUT_OF_SCOPE', emotion: 'neutral' };
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. DYNAMIC MULTI-SLOT RESPONSE ENGINE (1000+ Variations Per Situation)
// ═══════════════════════════════════════════════════════════════════════════

let variationCounter = 0;
function pickElement<T>(arr: T[], offset: number = 0): T {
  const index = (variationCounter + offset) % arr.length;
  return arr[index];
}

/**
 * Generates natural dynamic responses with 1000+ possible permutations per situation
 */
export function generateDynamicSituationResponse(
  classification: ClassificationResult,
  toUrdu: boolean,
  data: AssistantEngineData,
  rawQuery: string
): string {
  variationCounter++;
  const { situation, emotion, detectedItemName, matchedMenuItem, matchedDessertItem, budgetAmount, subCategory } = classification;
  const { config, menuItems = [], dessertBarItems = [], reviews = [], cartItems = [] } = data;
  const curr = config.currencySymbol || '₨';

  // Sample real items for dynamic suggestions
  const availableFood = menuItems.filter(m => m.isAvailable !== false);
  const sampleSpecial = availableFood.find(m => m.isChefSpecial) || availableFood[0] || { name: 'Special Chicken Karahi', price: 950 };
  const cheapestDish = [...availableFood].sort((a, b) => a.price - b.price)[0] || { name: 'Crispy Fries', price: 250 };
  const randomAltFood = availableFood[variationCounter % availableFood.length] || sampleSpecial;

  // ──────────────────────────────────────────────────────────────────────────
  // A. GREETING
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'GREETING') {
    const openersRoman = [
      'Ji, batayein!', 'Hello ji 👋', 'Assalam o Alaikum!', 'Ji bilkul, poochiye.',
      'Hello! Main yahan hoon.', 'Ji janab, batayein.', 'Welcome ji! 😊', 'Ji zaroor, batayein.'
    ];
    const bodiesRoman = [
      'Main menu, food dishes, prices aur ordering mein help kar sakta hoon.',
      'Aapko hamari live dishes, deals ya delivery ke bare mein kya maloom karna hai?',
      'Menu check karna hai ya kisi specific dish ke bare mein poochna hai?',
      'Aaj kya try karne ka irada hai? Main top dishes suggest kar deta hoon.'
    ];
    const emojis = ['😊 🍽️', '👋 ✨', '🙂 💬', '✨ 🍔'];

    const openersUrdu = [
      'جی، بتائیں!', 'ہیلو جی 👋', 'السلام علیکم!', 'جی بالکل، پوچھیے۔',
      'ہیلو! میں یہاں موجود ہوں۔', 'جی جناب، فرمائیں۔', 'خوش آمدید! 😊', 'جی ضرور، بتائیں۔'
    ];
    const bodiesUrdu = [
      'میں مینو، کھانوں، قیمتوں اور آرڈرنگ میں مدد کر سکتا ہوں۔',
      'آپ کو ہماری ڈشز، ڈیلز یا ہوم ڈیلیوری کے بارے میں کیا معلوم کرنا ہے؟',
      'مینو چیک کرنا ہے یا کسی خاص ڈش کے بارے میں جاننا ہے؟',
      'آج کیا آرڈر کرنے کا ارادہ ہے؟ میں بہترین ڈشز تجویز کر سکتا ہوں۔'
    ];

    if (toUrdu) {
      return `${pickElement(openersUrdu, 0)} ${pickElement(bodiesUrdu, 1)} ${pickElement(emojis, 2)}`;
    }
    return `${pickElement(openersRoman, 0)} ${pickElement(bodiesRoman, 1)} ${pickElement(emojis, 2)}`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // B. FOOD COMPLAINT (Taste / Quality Opinion e.g. "ye khana kitna khrab h")
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'FOOD_COMPLAINT') {
    const itemMention = detectedItemName ? ` (${detectedItemName})` : '';

    const openersRoman = [
      'Samajh gaya 😕', 'Aapki feedback samajh mein aayi 😔', 'Aapka concern bilkul valid hai 🤝',
      'Sun kar afsos hua ke aapko taste pasand nahi aya 😕', 'Aapki opinion note kar li gayi hai 🤝',
      'Har customer ka taste preference alag hota hai 😕', 'Aapko experience acha nahi laga, samajh sakta hoon 😔'
    ];
    const bodiesRoman = [
      `Agar aapko food quality ya taste${itemMention} pasand nahi aaya to aap apna genuine Review submit kar sakte hain.`,
      `Hamare kitchen mein har dish freshly prepare hoti hai, lekin agar aapko taste theek nahi laga to aap reviews section mein detailed feedback de sakte hain.`,
      `Aapka feedback hamari team ke liye zaroori hai. Aap chahein to Reviews page par apna experience share kar sakte hain.`
    ];
    const suggestionsRoman = [
      `Agar chahein to main menu mein se koi doosra option jaise '${randomAltFood.name}' suggest kar deta hoon. 🍽️`,
      `Aap menu se koi alternate dish try kar sakte hain ya Budget Filter se apni pasand ka item dekh sakte hain. 🍽️`,
      `Main aapki pasand ke mutabiq mild ya special spice options bata sakta hoon. 🍽️`
    ];

    const openersUrdu = [
      'سمجھ گیا 😕', 'آپ کا فیڈ بیک سمجھ میں آیا 😔', 'آپ کی بات بالکل اہم ہے 🤝',
      'سن کر افسوس ہوا کہ آپ کو ذائقہ پسند نہیں آیا 😕', 'آپ کی رائے نوٹ کر لی گئی ہے 🤝',
      'ہر کسٹمر کا ذائقہ اور پسند مختلف ہو سکتی ہے 😕', 'آپ کا تجربہ اچھا نہیں رہا، میں سمجھ سکتا ہوں 😔'
    ];
    const bodiesUrdu = [
      `اگر آپ کو کھانے کا ذائقہ یا کوالٹی${itemMention} پسند نہیں آئی تو آپ اپنا حقیقی ریویو جمع کروا سکتے ہیں۔`,
      `ہمارے کچن میں کھانا تازہ تیار کیا جاتا ہے، لیکن اگر آپ کو پسند نہیں آیا تو آپ Reviews سیکشن میں اپنی رائے شیئر کر سکتے ہیں۔`,
      `کسٹمر کا فیڈ بیک بہت اہم ہوتا ہے۔ آپ چاہیں تو ریویو سسٹم کے ذریعے اپنا تفصیلی فیڈ بیک شیئر کریں۔`
    ];
    const suggestionsUrdu = [
      `اگر چاہیں تو میں مینو میں سے کوئی دوسرا آپشن جیسے '${randomAltFood.name}' تجویز کر دیتا ہوں۔ 🍽️`,
      `آپ مینو سے کوئی متبادل ڈش منتخب کر سکتے ہیں یا بجٹ فلٹر سے اپنی پسند کا کھانا دیکھ سکتے ہیں۔ 🍽️`,
      `میں آپ کے ذائقے کے مطابق دیگر لائیو آپشنز بتا سکتا ہوں۔ 🍽️`
    ];

    if (toUrdu) {
      return `${pickElement(openersUrdu, 0)} ${pickElement(bodiesUrdu, 1)} ${pickElement(suggestionsUrdu, 2)}`;
    }
    return `${pickElement(openersRoman, 0)} ${pickElement(bodiesRoman, 1)} ${pickElement(suggestionsRoman, 2)}`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // C. PRICE COMPLAINT (e.g. "Ye bohat mehnga hai", "Price bohat zyada hai")
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'PRICE_COMPLAINT') {
    const itemMention = detectedItemName ? ` ${detectedItemName}` : '';

    const openersRoman = [
      'Aapka budget concern samajh sakta hoon 🙂', 'Ji, price ke hawale se aapka point samajh aaya 🤝',
      'Har customer ka budget frame different hota hai 🙂', 'Samajh gaya! Pricing standard portions aur fresh preparation par based hoti hai 🧾',
      'Ji, agar aapko ye rate zyada lag raha hai 🤝'
    ];
    const bodiesRoman = [
      `Hamari menu pricing quality ingredients aur standard serving size ke mutabiq rakhi gayi hai.`,
      `Hamari website par har budget ke liye options mojood hain.`,
      `Aap Budget Filter use kar ke kam budget mein bhi delicious food dhoond sakte hain.`
    ];
    const suggestionsRoman = [
      `Aap chahein to hamara affordable item '${cheapestDish.name}' (${curr} ${cheapestDish.price}) ya doosre budget options dekh sakte hain. 💰`,
      `Aap Budget Filter mein apna budget daal kar us ke andar aane wale tamam items dekh sakte hain. 💰`,
      `Main aapke specific budget ke mutabiq best value meal combo calculate kar ke bata sakta hoon. 💰`
    ];

    const openersUrdu = [
      'آپ کا بجٹ سے متعلق نکتہ سمجھ سکتا ہوں 🙂', 'جی، قیمت کے حوالے سے آپ کی بات سمجھ آئی 🤝',
      'ہر کسٹمر کا بجٹ اور ترجیح مختلف ہوتی ہے 🙂', 'سمجھ گیا۔ قیمتیں معیاری اجزاء اور معیاری سرونگ سائز کے مطابق ہیں 🧾',
      'جی، اگر آپ کو یہ ریٹ زیادہ لگ رہا ہے 🤝'
    ];
    const bodiesUrdu = [
      `ہماری مینو کی قیمتیں تازہ اجزاء اور معیاری سرونگ سائز کے مطابق رکھی گئی ہیں۔`,
      `ہماری ویب سائٹ پر ہر بجٹ کے مطابق کھانے اور ڈرنکس دستیاب ہیں۔`,
      `آپ بجٹ فلٹر کے ذریعے کم بجٹ میں بھی بہترین آپشنز تلاش کر سکتے ہیں۔`
    ];
    const suggestionsUrdu = [
      `آپ چاہیں تو ہماری مناسب قیمت والی ڈش '${cheapestDish.name}' (${curr} ${cheapestDish.price}) یا دیگر بجٹ آپشنز دیکھ سکتے ہیں۔ 💰`,
      `آپ بجٹ فلٹر میں اپنا بجٹ درج کر کے دستیاب ڈشز دیکھ سکتے ہیں۔ 💰`,
      `میں آپ کے بتائے گئے بجٹ کے اندر مکمل میل کمبو بھی بنا سکتا ہوں۔ 💰`
    ];

    if (toUrdu) {
      return `${pickElement(openersUrdu, 0)} ${pickElement(bodiesUrdu, 1)} ${pickElement(suggestionsUrdu, 2)}`;
    }
    return `${pickElement(openersRoman, 0)} ${pickElement(bodiesRoman, 1)} ${pickElement(suggestionsRoman, 2)}`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // D. COMPETITOR COMPARISON (Bigger/Famous vs Smaller/Other)
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'COMPETITOR_FAMOUS') {
    const compName = detectedItemName || 'Woh';
    if (toUrdu) {
      return `${compName} بلاشبہ ایک معروف اور قابلِ احترام برانڈ ہے۔ ہم Ember & Spice میں اپنے منفرد اوپن فائر ہرتھ ڈائننگ (open-fire hearth dining) کے تجربے، لائیو کوئلہ تیاری اور خالص ذائقوں پر فوکس کرتے ہیں تاکہ آپ کو ایک اعلیٰ فائن ڈائننگ کا تجربہ فراہم کر سکیں۔`;
    }
    return `${compName} bilkul ek mashhoor aur qabil-e-ehtiram brand hai. Hum Ember & Spice mein apne unique open-fire hearth dining experience, live charcoal preparation aur authentic zaiqon par focus karte hain taake aapko ek behtareen fine dining tajurba mile.`;
  }

  if (situation === 'COMPETITOR_SMALLER' || situation === 'COMPETITOR_COMPARISON' || situation === 'COMPETITOR_ANOTHER_BETTER') {
    if (toUrdu) {
      return 'یہ آپ کی اپنی پسند پر ہے کہ آپ کو کون سا اچھا لگتا ہے۔ ہم دونوں اپنی جگہ بہتر تجربہ دینے کی کوشش کرتے ہیں۔';
    }
    return 'Yeh aap ki apni choice par hai ke aap ko kaun sa acha lagta hai. Hum dono apni jagah behtar experience dene ki koshish karte hain.';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // E. THIS RESTAURANT BETTER / HIGH PRAISE
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'THIS_RESTAURANT_BETTER' || situation === 'FOOD_PRAISE') {
    const itemMention = detectedItemName ? ` ${detectedItemName}` : '';
    const openersRoman = [
      'Bohat bohat shukriya! ❤️', 'Dil se shukriya ji! 😊', 'Aapka appreciation sun kar bohat khushi hui! ✨',
      'Ye sun kar hamari team ko bohat khushi hui! 😊', 'Bohat meherbani aapke ache alfaaz ki! 🙏'
    ];
    const bodiesRoman = [
      `Humein khushi hai ke aapko hamara food${itemMention} aur quality pasand aayi.`,
      `Aapka positive feedback hamare liye bohat bari motivation hai.`,
      `Hamari koshish hoti hai ke har guest ko authentic taste aur fresh quality mile.`
    ];
    const closersRoman = [
      'Dobara zaroor tashreef layein ya order karein! 🍽️',
      'Aapka agla order serve karne ka intezar rahega! 😊',
      'Aap chahein to Reviews section mein bhi 5-star rating share kar sakte hain. ⭐'
    ];

    const openersUrdu = [
      'بہت بہت شکریہ! ❤️', 'دل سے شکریہ جی! 😊', 'آپ کی تعریف سن کر بہت خوشی ہوئی! ✨',
      'یہ سن کر ہماری ٹیم کو بہت خوشی ہوئی! 😊', 'بہت مہربانی آپ کے اچھے الفاظ کی! 🙏'
    ];
    const bodiesUrdu = [
      `ہمیں خوشی ہے کہ آپ کو ہمارا کھانا${itemMention} اور کوالٹی پسند آئی۔`,
      `آپ کا مثبت فیڈ بیک ہمارے لیے بہت بڑی حوصلہ افزائی ہے۔`,
      `ہماری کوشش ہوتی ہے کہ ہر کسٹمر کو تازہ اور بہترین کھانا ملے۔`
    ];
    const closersUrdu = [
      'دوبارہ ضرور تشریف لائیں یا آن لائن آرڈر کریں! 🍽️',
      'آپ کی اگلی خدمت کا انتظار رہے گا! 😊',
      'آپ چاہیں تو Reviews سیکشن میں بھی اپنا 5 اسٹار ریویو شیئر کر سکتے ہیں۔ ⭐'
    ];

    if (toUrdu) {
      return `${pickElement(openersUrdu, 0)} ${pickElement(bodiesUrdu, 1)} ${pickElement(closersUrdu, 2)}`;
    }
    return `${pickElement(openersRoman, 0)} ${pickElement(bodiesRoman, 1)} ${pickElement(closersRoman, 2)}`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // F. ANGRY CUSTOMER (Calm, Respectful, No Argument)
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'ANGRY_CUSTOMER') {
    const openersRoman = [
      'Main samajh sakta hoon ke aap upset hain 😔',
      'Aapki pareshani aur gussa samajh mein aa raha hai 🤝',
      'Sun kar afsos hua ke aap disappointed hue 😔',
      'Main calmly aapki help karne ke liye mojood hoon 🤝'
    ];
    const bodiesRoman = [
      'Aap apna specific issue bata dein taake main restaurant ki available information ke mutabiq help kar sakun.',
      'Agar order, delivery ya food ke hawale se koi masla hai to batayein, main verified system details check kar leta hoon.',
      'Aapka concern genuinely note kiya ja sakta hai. Aap apna review bhi share kar sakte hain.'
    ];
    const closersRoman = [
      'Batayein, main kis cheez mein aapko assist karun? 💬',
      'Main aapke sawal ka sahi jawab dene ki poori koshish karunga. 💬',
      'Aap thora detail bata dein taake sahi guide kar sakun. 🤝'
    ];

    const openersUrdu = [
      'میں سمجھ سکتا ہوں کہ آپ پریشان ہیں 😔',
      'آپ کی ناگواری اور پریشانی سمجھ میں آ رہی ہے 🤝',
      'سن کر افسوس ہوا کہ آپ مایوس ہوئے 😔',
      'میں سکون سے آپ کی مدد کے لیے حاضر ہوں 🤝'
    ];
    const bodiesUrdu = [
      'آپ اپنا مخصوص مسئلہ بتا دیں تاکہ میں ریسٹورنٹ کی اصل معلومات کے مطابق رہنمائی کر سکوں۔',
      'اگر آرڈر، ڈیلیوری یا کھانے سے متعلق کوئی مسئلہ ہے تو بتائیں، میں درست تفصیلات چیک کر کے بتاتا ہوں۔',
      'آپ کا فیڈ بیک ہمارے لیے اہم ہے۔ آپ چاہیں تو ریویو سسٹم میں بھی مسئلہ لکھ سکتے ہیں۔'
    ];
    const closersUrdu = [
      'بتائیں، میں کس چیز میں آپ کی مدد کروں؟ 💬',
      'میں آپ کے مسئلے کا مناسب حل تلاش کرنے کی پوری کوشش کروں گا۔ 💬',
      'آپ تفصیل بتا دیں تاکہ صحیح رہنمائی ہو سکے۔ 🤝'
    ];

    if (toUrdu) {
      return `${pickElement(openersUrdu, 0)} ${pickElement(bodiesUrdu, 1)} ${pickElement(closersUrdu, 2)}`;
    }
    return `${pickElement(openersRoman, 0)} ${pickElement(bodiesRoman, 1)} ${pickElement(closersRoman, 2)}`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // G. DELIVERY COMPLAINT (Late / Slow)
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'DELIVERY_COMPLAINT') {
    const openersRoman = [
      'Delivery delay ki pareshani samajh sakta hoon 🛵',
      'Order late hone par humein afsos hai 😔',
      'Aapki delivery timing concern samajh aayi 🛵'
    ];
    const bodiesRoman = [
      'Order place hone ke baad real tracking stages yeh hoti hain: Order Placed → Confirming → Preparing → Ready/Out for Delivery → Completed.',
      'Peak hours ya kitchen preparation time ki wajah se thora waqt lag sakta hai.',
      'Website par active orders ka status live update hota hai.'
    ];
    const closersRoman = [
      'Aap Contact page se restaurant counter par bhi update le sakte hain. 📦',
      'Rider standard delivery route ke mutabiq jald se jald deliver karta hai. ⚡',
      'Main order tracking stages ke bare mein mazeed guide kar sakta hoon. 💬'
    ];

    const openersUrdu = [
      'ڈیلیوری میں تاخیر کی پریشانی سمجھ سکتا ہوں 🛵',
      'آرڈر میں دیر ہونے پر معذرت خواہ ہیں 😔',
      'ڈیلیوری کے وقت کے بارے میں آپ کی تشویش بجا ہے 🛵'
    ];
    const bodiesUrdu = [
      'ویب سائٹ پر آرڈر کے اصل مراحل یہ ہیں: Order Placed → Confirming → Preparing → Ready/Out for Delivery → Completed۔',
      'رش کے اوقات یا کچن تیاری کے دوران تھوڑا وقت لگ سکتا ہے۔',
      'ویب سائٹ پر لائیو اسٹیٹس اپ ڈیٹ ہوتا ہے۔'
    ];
    const closersUrdu = [
      'آپ Contact پیج کے ذریعے ریسٹورنٹ کاؤنٹر سے بھی رابطہ کر سکتے ہیں۔ 📦',
      'رائڈر کوشش کرتا ہے کہ کھانا جلد از جلد اور گرم گرم پہنچے۔ ⚡',
      'میں آرڈر اسٹیٹس کے مراحل سمجھانے میں مزید مدد کر سکتا ہوں۔ 💬'
    ];

    if (toUrdu) {
      return `${pickElement(openersUrdu, 0)} ${pickElement(bodiesUrdu, 1)} ${pickElement(closersUrdu, 2)}`;
    }
    return `${pickElement(openersRoman, 0)} ${pickElement(bodiesRoman, 1)} ${pickElement(closersRoman, 2)}`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // H. SARCASM
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'SARCASM') {
    if (toUrdu) {
      return 'آپ کی بات کا مقصد سمجھ گیا۔ اگر آپ کو کوئی مسئلہ یا شکایت ہے تو بتائیں، میں ریسٹورنٹ کی اصل تفصیلات کے مطابق حل کرنے میں مدد کروں گا۔ 🤝';
    }
    return 'Aapki baat ka context samajh gaya. Agar aapko koi issue ya complaint hai to batayein, main restaurant ki accurate details ke mutabiq help karta hoon. 🤝';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // I. THANKS / APPRECIATION
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'THANKS') {
    const thanksResponsesRoman = [
      'You are most welcome! 😊 Khushi hui ke main help kar saka.',
      'Bohat shukriya! Agar mazeed kuch poochna ho to main yahan hoon. 🙏',
      'Most welcome ji! Khana enjoy karein. 🍽️',
      'Shukriya! Aapka experience hamesha acha rahe, yahi hamari koshish hai. ✨',
      'Koi baat nahi ji! Batayein agar kuch aur dekhna hai. 😊'
    ];
    const thanksResponsesUrdu = [
      'بہت خوش آمدید! 😊 خوشی ہوئی کہ میں مدد کر سکا۔',
      'بہت شکریہ! اگر مزید کچھ پوچھنا ہو تو میں حاضر ہوں۔ 🙏',
      'خوش آمدید جی! کھانا انجوائے کریں۔ 🍽️',
      'شکریہ! آپ کا تجربہ ہمیشہ اچھا رہے، یہی ہماری کوشش ہے۔ ✨',
      'کوئی بات نہیں جی! بتائیں اگر کچھ اور دیکھنا چاہتے ہیں۔ 😊'
    ];

    if (toUrdu) return pickElement(thanksResponsesUrdu, 0);
    return pickElement(thanksResponsesRoman, 0);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // J. RECOMMENDATIONS
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'RECOMMENDATION') {
    const topDishes = availableFood.slice(0, 4);
    if (topDishes.length > 0) {
      if (toUrdu) {
        let text = 'ہمارے مینو کی چند مقبول اور بہترین ڈشز یہ ہیں:\n';
        topDishes.forEach(d => {
          text += `• ${d.name} — ${curr} ${d.price.toLocaleString()} (${d.category})\n`;
        });
        text += '\nآپ اپنی پسند کے مطابق کوئی بھی ڈش منتخب کر کے Add to Cart یا Order Now کر سکتے ہیں۔ 🍽️';
        return text;
      }
      let text = 'Hamare menu ki top recommended dishes yeh hain:\n';
      topDishes.forEach(d => {
        text += `• ${d.name} — ${curr} ${d.price.toLocaleString()} (${d.category})\n`;
      });
      text += '\nAap apni preference ke mutabiq dish choose kar ke direct order kar sakte hain. 🍽️';
      return text;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DEALS QUERY (Meals & Deals, Combos, Family Deals, Couple Deals)
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'DEALS_QUERY') {
    const dealsList = (data.deals || []).filter(d => d.isAvailable !== false);
    if (dealsList.length > 0) {
      if (toUrdu) {
        let text = 'ہمارے پاس مندرجہ ذیل شاندار ویلیو ڈیلز اور کمبوز دستیاب ہیں: 🎁✨\n\n';
        dealsList.slice(0, 6).forEach((d) => {
          const dealPrice = d.price || d.discountedPrice || 0;
          const origPrice = d.originalPrice || 0;
          text += `• ${d.name} — ${curr} ${dealPrice.toLocaleString()}`;
          if (origPrice > dealPrice) {
            text += ` (اصل قیمت: ${curr} ${origPrice.toLocaleString()} — بچت: ${curr} ${(origPrice - dealPrice).toLocaleString()})`;
          }
          const servesInfo = d.serves || d.servingSize;
          if (servesInfo) {
            text += ` [سرونگ: ${servesInfo}]`;
          }
          if (d.includedItems && d.includedItems.length > 0) {
            text += `\n  شامل آئٹمز: ${d.includedItems.map(i => `${i.productName || i.name} ×${i.quantity}`).join('، ')}\n`;
          }
        });
        text += '\nآپ مینو میں "Meals & Deals" ٹیب سے براہِ راست کسی بھی ڈیل کو کارٹ میں شامل کر کے آرڈر کر سکتے ہیں۔ 🍽️📦';
        return text;
      } else {
        let text = 'Hamare paas yeh value deals aur combo packages available hain: 🎁✨\n\n';
        dealsList.slice(0, 6).forEach((d) => {
          const dealPrice = d.price || d.discountedPrice || 0;
          const origPrice = d.originalPrice || 0;
          text += `• ${d.name} — ${curr} ${dealPrice.toLocaleString()}`;
          if (origPrice > dealPrice) {
            text += ` (Original: ${curr} ${origPrice.toLocaleString()} — Save: ${curr} ${(origPrice - dealPrice).toLocaleString()})`;
          }
          const servesInfo = d.serves || d.servingSize;
          if (servesInfo) {
            text += ` [Serves: ${servesInfo}]`;
          }
          if (d.includedItems && d.includedItems.length > 0) {
            text += `\n  Includes: ${d.includedItems.map(i => `${i.productName || i.name} ×${i.quantity}`).join(', ')}\n`;
          }
        });
        text += '\nAap Menu page par "Meals & Deals" tab se directly kisi bhi deal ko Cart mein add kar ke order kar sakte hain. 🍽️📦';
        return text;
      }
    } else {
      if (toUrdu) {
        return 'فی الحال تمام اسپیشل ڈیلز مینو پیج پر دیکھی جا سکتی ہیں یا آپ بجٹ فلٹر کے ذریعے اپنی پسند کا کمبو بنا سکتے ہیں۔ 🍽️';
      }
      return 'Filhal special deals Menu page par "Meals & Deals" tab par available hain, ya aap Budget Filter use kar ke custom combo bana sakte hain. 🍽️';
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // K. BUDGET REQUEST (Combo Generator)
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'BUDGET_REQUEST' && budgetAmount) {
    const combo = buildRealBudgetCombo(budgetAmount, menuItems, dessertBarItems);
    if (combo) {
      if (toUrdu) {
        let text = `آپ کا بجٹ: ${curr} ${budgetAmount.toLocaleString()} 💰\n\n`;
        combo.items.forEach(item => {
          text += `• ${item.name} ×${item.qty} — ${curr} ${item.price.toLocaleString()}${item.note ? ` (${item.note})` : ''}\n`;
        });
        text += `\nکل رقم (Total): ${curr} ${combo.total.toLocaleString()}\n`;
        if (combo.remaining > 0) {
          text += `باقی رقم (Remaining): ${curr} ${combo.remaining.toLocaleString()} 👍`;
        } else {
          text += `یہ آپ کے بجٹ کا مکمل متوازن میل کمبو ہے۔ 🍽️`;
        }
        return text;
      } else {
        let text = `Aap ka budget: ${curr} ${budgetAmount.toLocaleString()} 💰\n\n`;
        combo.items.forEach(item => {
          text += `• ${item.name} ×${item.qty} — ${curr} ${item.price.toLocaleString()}${item.note ? ` (${item.note})` : ''}\n`;
        });
        text += `\nTotal: ${curr} ${combo.total.toLocaleString()}\n`;
        if (combo.remaining > 0) {
          text += `Remaining amount: ${curr} ${combo.remaining.toLocaleString()} 👍`;
        } else {
          text += `Yeh aapke budget mein complete meal combo hai. 🍽️`;
        }
        return text;
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // L. ITEM UNAVAILABLE & NEGATIVE QUERIES
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'ITEM_UNAVAILABLE') {
    if (toUrdu) {
      return 'فی الحال یہ آئٹم ہمارے پاس موجود نہیں ہے، لیکن آپ ہماری باقی اسپیشلٹیز ٹرائی کر سکتے ہیں۔';
    }
    return 'Filhal yeh item hamare paas mojood nahi hai, lekin aap hamari baqi specialties try kar sakte hain.';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // M. PRICE QUERY / SPECIFIC ITEM QUERY
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'PRICE_QUERY' || situation === 'AVAILABILITY_QUERY' || situation === 'INGREDIENT_QUERY' || situation === 'SPECIFIC_ITEM_QUERY') {
    if (matchedMenuItem) {
      if (situation === 'PRICE_QUERY') {
        if (matchedMenuItem.price > 0) {
          if (toUrdu) return `${matchedMenuItem.name} کی قیمت ${curr} ${matchedMenuItem.price.toLocaleString()} ہے۔ 🧾`;
          return `${matchedMenuItem.name} ki price ${curr} ${matchedMenuItem.price.toLocaleString()} hai. 🧾`;
        }
        if (toUrdu) return `${matchedMenuItem.name} کی قیمت ابھی ہماری ویب سائٹ پر دستیاب نہیں ہے۔`;
        return `${matchedMenuItem.name} ki price abhi hamari website par available nahi hai.`;
      }
      return formatItemDetails(matchedMenuItem, toUrdu, curr);
    }

    if (matchedDessertItem) {
      const priceStr = matchedDessertItem.price > 0 ? `${curr} ${matchedDessertItem.price.toLocaleString()}` : (toUrdu ? 'دستیاب نہیں' : 'Not available');
      if (toUrdu) {
        return `${matchedDessertItem.name} (${priceStr}): ${matchedDessertItem.description || 'روایتی تازہ ڈیزرٹ'}۔ سرونگ سائز: ${matchedDessertItem.servingSize || 'معیاری'}۔ 🍦`;
      }
      return `${matchedDessertItem.name} (${priceStr}): ${matchedDessertItem.description || 'Freshly crafted dessert'}. Serving size: ${matchedDessertItem.servingSize || 'Standard'}. 🍦`;
    }

    // If item was asked specifically but not found in database (Missing Restaurant Info)
    if (toUrdu) {
      return 'فی الحال یہ آئٹم ہمارے پاس موجود نہیں ہے، لیکن آپ ہماری باقی اسپیشلٹیز ٹرائی کر سکتے ہیں۔';
    }
    return 'Filhal yeh item hamare paas mojood nahi hai, lekin aap hamari baqi specialties try kar sakte hain.';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // M. CHEAPEST ITEM QUERY
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'CHEAPEST_ITEM_QUERY') {
    if (toUrdu) {
      return `مینو میں سب سے سستا آئٹم ${cheapestDish.name} ہے جس کی قیمت ${curr} ${cheapestDish.price.toLocaleString()} ہے۔ 💰`;
    }
    return `Menu mein sab se sasta item ${cheapestDish.name} hai jis ki price ${curr} ${cheapestDish.price.toLocaleString()} hai. 💰`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // N. CATEGORY QUERIES (Drinks, Desserts, Chicken, Mutton)
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'CATEGORY_QUERY') {
    if (subCategory === 'drinks') {
      const drinks = menuItems.filter(m => m.category === 'soft-drinks' || m.category === 'signature-drinks' || m.id.startsWith('sd-') || m.id.startsWith('drink-') || m.id.startsWith('beverage-')).slice(0, 6);
      if (drinks.length > 0) {
        if (toUrdu) {
          const list = drinks.map(d => `${d.name} (${curr} ${d.price.toLocaleString()})`).join('، ');
          return `ڈرنکس میں ہمارے پاس یہ آپشنز موجود ہیں: ${list}۔ تمام بوتل والی کولڈ ڈرنکس اور جوسز آئس چلڈ دستیاب ہیں۔ 🥤`;
        }
        const list = drinks.map(d => `${d.name} (${curr} ${d.price.toLocaleString()})`).join(', ');
        return `Drinks mein hamare paas yeh options available hain: ${list}. Tamam cold drinks ice-chilled available hain. 🥤`;
      }
    }

    if (subCategory === 'desserts') {
      const sampleD = dessertBarItems.slice(0, 5);
      if (sampleD.length > 0) {
        if (toUrdu) {
          const list = sampleD.map(d => `${d.name} (${curr} ${d.price.toLocaleString()})`).join('، ');
          return `ڈیزرٹس اور آئس کریم میں ہمارے پاس یہ آپشنز ہیں: ${list}۔ 🍦`;
        }
        const list = sampleD.map(d => `${d.name} (${curr} ${d.price.toLocaleString()})`).join(', ');
        return `Desserts aur ice cream mein hamare paas yeh options hain: ${list}. 🍦`;
      }
    }

    if (subCategory === 'chicken') {
      const chickenDishes = menuItems.filter(m => m.name.toLowerCase().includes('chicken') || m.description.toLowerCase().includes('chicken') || m.name.toLowerCase().includes('boti')).slice(0, 5);
      if (chickenDishes.length > 0) {
        if (toUrdu) {
          const list = chickenDishes.map(d => `${d.name} (${curr} ${d.price.toLocaleString()})`).join('، ');
          return `چکن کے مقبول آپشنز: ${list}۔ 🍗`;
        }
        const list = chickenDishes.map(d => `${d.name} (${curr} ${d.price.toLocaleString()})`).join(', ');
        return `Chicken ke popular options: ${list}. 🍗`;
      }
    }

    if (subCategory === 'mutton') {
      const muttonDishes = menuItems.filter(m => m.name.toLowerCase().includes('mutton') || m.description.toLowerCase().includes('mutton')).slice(0, 5);
      if (muttonDishes.length > 0) {
        if (toUrdu) {
          const list = muttonDishes.map(d => `${d.name} (${curr} ${d.price.toLocaleString()})`).join('، ');
          return `مٹن میں ہمارے پاس یہ آپشنز دستیاب ہیں: ${list}۔ 🍽️`;
        }
        const list = muttonDishes.map(d => `${d.name} (${curr} ${d.price.toLocaleString()})`).join(', ');
        return `Mutton mein hamare paas yeh options available hain: ${list}. 🍽️`;
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // O. BUDGET FILTER INFO
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'BUDGET_FILTER_INFO') {
    if (toUrdu) {
      return 'بجٹ فلٹر استعمال کرنے کے لیے بجٹ فلٹر کھولیں، اپنا بجٹ درج کریں، پھر ویب سائٹ آپ کے بجٹ کے اندر دستیاب تمام کھانے، ڈرنکس اور ڈیزرٹس دکھائے گی۔ 💰';
    }
    return 'Budget Filter kholo, apna budget enter karo, phir website tumhare budget ke andar available items dikhayegi. 💰';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // P. ORDER CANCELLATION (2-3 Minute Window Policy)
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'ORDER_CANCELLATION') {
    if (toUrdu) {
      return 'آرڈر پلیس کرنے کے بعد کسٹمر کے پاس 2 سے 3 منٹ کا منسوخی ونڈو (Cancellation Window) ہوتا ہے۔ اس دوران لائیو کاؤنٹ ڈاؤن اور Cancel Order بٹن دکھایا جاتا ہے۔ 2 سے 3 منٹ ختم ہونے کے بعد کچن کھانا تیار کرنا شروع کر دیتا ہے اور آرڈر کینسل نہیں کیا جا سکتا۔ ⏱️';
    }
    return 'Order place karne ke baad customer 2 se 3 minute ke cancellation window ke andar apna order cancel kar sakta hai. Is dauran countdown aur Cancel button show hota hai. 2-3 minute baad kitchen preparation start ho jati hai. ⏱️';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Q. ORDER TRACKING & STAGES
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'ORDER_TRACKING') {
    if (toUrdu) {
      return 'ویب سائٹ پر آرڈر کے مراحل یہ ہیں:\n1. Order Placed\n2. Confirming\n3. Preparing\n4. Ready / Out for Delivery\n5. Completed\n(اور اگر کینسل کیا جائے تو Cancelled)۔ 📦';
    }
    return 'Website par real order tracking stages yeh hain:\nOrder Placed → Confirming → Preparing → Ready / Out for Delivery → Completed (ya Cancelled). 📦';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // R. PAYMENT & QR
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'PAYMENT_QR') {
    const qrConf = config.qrPayment;
    const isEnabled = qrConf?.isEnabled !== false;
    const accName = qrConf?.accountName || 'Official Merchant Account';

    if (toUrdu) {
      if (!isEnabled) {
        return 'کیو آر پیمنٹ فی الحال ویب سائٹ سیٹنگز میں دستیاب نہیں ہے۔ آپ کیش آن ڈیلیوری منتخب کر سکتے ہیں۔ 💳';
      }
      return `کیو آر پیمنٹ سسٹم فعال ہے۔ چیک آؤٹ پر دکھایا گیا QR کوڈ کسی بھی بینکنگ ایپ، راستہ، جاز کیش یا ایزی پیسہ سے اسکین کر کے ادائیگی کر سکتے ہیں۔ اکاؤنٹ کا نام: ${accName}۔ 📱✅`;
    }
    if (!isEnabled) {
      return 'QR payment abhi hamari website par available nahi hai. Aap Cash on Delivery choose kar sakte hain. 💳';
    }
    return `QR Payment system enabled hai. Customer checkout screen par displayed QR code scan kar ke PKR mein payment kar sakta hai. Account name: '${accName}'. 📱✅`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // S. CART & CHECKOUT
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'CHECKOUT_FLOW') {
    if (toUrdu) {
      return 'Add to Cart اور Order Now دو الگ فیچرز ہیں:\n• Add to Cart: آئٹم کو کارٹ میں محفوظ کرتا ہے تاکہ آپ مزید براؤزنگ جاری رکھ سکیں۔\n• Order Now: سیدھا چیک آؤٹ اور آرڈر کنفرمیشن پر لے جاتا ہے۔ 🛒';
    }
    return 'Add to Cart aur Order Now alag alag hain:\n• Add to Cart: Item ko cart mein save karta hai taake shopping jari rakh sakein.\n• Order Now: Direct checkout aur ordering flow par le jata hai. 🛒';
  }

  if (situation === 'CART_QUERY') {
    const totalQty = cartItems.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

    if (toUrdu) {
      return `کارٹ ویب سائٹ کے اوپر دائیں کونے (Navbar) اور آرڈر پینل میں موجود ہے۔ فی الحال کارٹ میں ${totalQty} آئٹمز ہیں جن کا سب ٹوٹل ${curr} ${subtotal.toLocaleString()} ہے۔ 🛒`;
    }
    return `Cart website ke navbar aur order modal mein mojood hai. Is waqt cart mein ${totalQty} items hain jinka subtotal ${curr} ${subtotal.toLocaleString()} hai. 🛒`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // T. RESERVATIONS
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'RESERVATION') {
    const lunchHours = config.hours?.[0]?.lunch || '12:30 PM – 3:30 PM';
    const dinnerHours = config.hours?.[0]?.dinner || '6:30 PM – 11:30 PM';

    if (toUrdu) {
      return `ٹیبل بکنگ کے لیے Reservations پیج پر جائیں۔ وہاں مہمانوں کی تعداد، تاریخ اور وقت منتخب کر کے درخواست بھیجیں۔ اوقات: لنچ (${lunchHours}) اور ڈنر (${dinnerHours})۔ 📅🪑`;
    }
    return `Table reservation ke liye website ke Reservations page par jayein. Wahan guests, date aur time select kar ke request submit karein. Lunch: ${lunchHours} | Dinner: ${dinnerHours}. 📅🪑`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // T2. FINE DINING & HEARTH EXPERIENCE
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'FINE_DINING_EXPERIENCE') {
    if (toUrdu) {
      return 'Ember & Spice میں ہم منفرد اوپن فائر ہرتھ ڈائننگ (open-fire hearth dining) کا تجربہ پیش کرتے ہیں، جہاں لائیو کوئلوں پر روایتی اور جدید ذائقے تیار کیے جاتے ہیں۔ ہمارا پرسکون فائن ڈائننگ ماحول اور ماہر شیفس آپ کے ہر لمحے کو یادگار بناتے ہیں۔ 🍽️🔥';
    }
    return 'Ember & Spice mein hum unique open-fire hearth dining experience pesh karte hain, jahan premium delicacies live glowing charcoal embers par prepare ki jati hain. Hamara fine dining ambiance aur chef craftsmanship aapke har visit ko behtareen banate hain. 🍽️🔥';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // U. REVIEWS & AI RATING
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'REVIEWS_INFO') {
    if (toUrdu) {
      return 'ریویو (Review) اور اے آئی ریٹنگ (AI Rating) دو الگ چیزیں ہیں:\n• Review: کسٹمر کا خود لکھا گیا حقیقی فیڈ بیک اور اسٹارز ہیں۔\n• AI Rating: اصل کسٹمر ریویوز کے ڈیٹا کی بنیاد پر شفاف انداز میں ظاہر کی جانے والی سمری ہے۔ ⭐';
    }
    return 'Review aur AI Rating mein farq hai:\n• Review: Customer ka apna genuine feedback aur rating hoti hai.\n• AI Rating: Genuine customer reviews ke sentiment data se calculate ki jati hai. ⭐';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // V. LOCATION, HOURS & CONTACT
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'LOCATION_HOURS_CONTACT') {
    const loc = config.contact?.address || 'Ilahiabad, Pakistan';
    const ph = config.contact?.phone || '';
    if (toUrdu) {
      return `ریسٹورنٹ کی لوکیشن ${loc} ہے۔${ph ? ` رابطہ فون: ${ph}۔` : ''} آپ Contact پیج سے مزید تفصیلات حاصل کر سکتے ہیں۔ 📍`;
    }
    return `Restaurant location: ${loc}.${ph ? ` Phone: ${ph}.` : ''} Aap Contact page par complete details dekh sakte hain. 📍`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // W. MASCOT INFO
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'MASCOT_INFO') {
    if (toUrdu) {
      return 'مسٹر بلا (Mr. Billa) اس ویب سائٹ کا پیارا کیٹ میسکاٹ ہے، جو شیف ہیٹ پہنے ہوئے کچن کوالٹی اور مہمانوں کی خوشی کا خیال رکھتا ہے۔ 🐱🍳';
    }
    return 'Mr. Billa website ka cute cat mascot hai jo chef hat ke sath represent karta hai aur kitchen quality ensure karta hai. 🐱🍳';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // X. CLARIFICATION NEEDED (Ambiguous Intent)
  // ──────────────────────────────────────────────────────────────────────────
  if (situation === 'CLARIFICATION_NEEDED') {
    const clarificationsRoman = [
      'Ji, aap price ke bare mein pooch rahe hain ya menu options ke bare mein? 🙂',
      'Ji, kya aap specific dish ka taste dekhna chahte hain ya ordering process? 🍽️',
      'Thora sa clear bata dein taake main accurate restaurant details bata sakun. 💬',
      'Aap food items, delivery ya table reservation mein se kya dekhna chahte hain? 🙂'
    ];
    const clarificationsUrdu = [
      'جی، آپ قیمت کے بارے میں پوچھ رہے ہیں یا مینو کے آپشنز کے بارے میں؟ 🙂',
      'جی، کیا آپ مخصوص ڈش کی معلومات دیکھنا چاہتے ہیں یا آرڈرنگ کا طریقہ؟ 🍽️',
      'تھوڑا سا واضح بتا دیں تاکہ میں درست ریسٹورنٹ معلومات فراہم کر سکوں۔ 💬',
      'آپ فوڈ آئٹمز، ڈیلیوری یا ٹیبل بکنگ میں سے کیا معلوم کرنا چاہتے ہیں؟ 🙂'
    ];

    if (toUrdu) return pickElement(clarificationsUrdu, 0);
    return pickElement(clarificationsRoman, 0);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Y. OUT OF SCOPE (Polite Refusal)
  // ──────────────────────────────────────────────────────────────────────────
  if (toUrdu) {
    return 'میں صرف Ember & Spice ریسٹورنٹ کے بارے میں مدد کر سکتا ہوں۔';
  }
  return 'Main sirf Ember & Spice restaurant ke baare mein madad kar sakta hoon.';
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. CORE ASSISTANT ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════
export function generateAssistantResponse(
  rawQuery: string,
  context: AssistantContextPayload,
  data: AssistantEngineData,
  conversationHistory: Array<{ sender: 'user' | 'assistant'; text: string }> = []
): string {
  const query = rawQuery.trim();
  const normalized = normalizeCustomerQuery(query);
  const lang = detectQueryLanguage(query);
  const toUrdu = lang === 'roman_urdu' || lang === 'urdu_script';

  // 1. Situation and Intent Understanding
  const classification = classifySituationAndIntent(query, normalized, context, data, conversationHistory);

  // 2. Generate Context-Aware Dynamic Response (1000+ Permutations)
  return generateDynamicSituationResponse(classification, toUrdu, data, query);
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. HELPER UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

function isRestaurantRelatedTopic(lower: string): boolean {
  const restaurantKeywords = [
    'menu', 'food', 'dish', 'dishes', 'khana', 'khano', 'recipe', 'ingredient', 'taste',
    'burger', 'burgers', 'pizza', 'karahi', 'handi', 'tikka', 'kabab', 'boti', 'bbq',
    'roll', 'shawarma', 'biryani', 'pulao', 'rice', 'chawal', 'naan', 'roti', 'paratha',
    'soup', 'salad', 'pasta', 'steak', 'chowmein', 'fish', 'prawn', 'wings', 'nuggets',
    'fries', 'starter', 'starters', 'main course', 'curry', 'daal', 'paneer', 'mutton',
    'chicken', 'beef', 'vegetable', 'veg', 'non-veg', 'halal', 'hygiene', 'sauce',
    'chutni', 'raita', 'spice', 'spicy', 'mirch', 'sweet', 'meetha', 'dessert', 'desserts',
    'ice cream', 'icecream', 'kulfi', 'falooda', 'shake', 'milkshake', 'drink', 'drinks',
    'cold drink', 'cold drinks', 'soft drink', 'soft drinks', 'bottled', 'bottle',
    'pepsi', 'coke', '7up', 'sprite', 'dew', 'fanta', 'mirinda', 'water', 'pani', 'juice',
    'chai', 'tea', 'coffee', 'lassi', 'beverage', 'beverages',
    'price', 'prices', 'cost', 'qeemat', 'rate', 'rupay', 'pese', 'pesay', 'pkr', 'rs', '₨',
    'sasta', 'sasti', 'saste', 'mehnga', 'budget', 'discount', 'deal', 'deals', 'offer',
    'offers', 'voucher', 'coupon', 'bachat', 'combo', 'meal', 'portion', 'serving',
    'order', 'ordering', 'cart', 'order now', 'add to cart', 'direct order', 'cancel',
    'cancellation', 'track', 'tracking', 'status', 'delivery', 'home delivery', 'rider',
    'eta', 'pickup', 'takeaway', 'parcel', 'address', 'area', 'fee', 'charges',
    'payment', 'pay', 'cash', 'cod', 'cash on delivery', 'card', 'qr', 'scan', 'raast',
    'jazzcash', 'easypaisa', 'bill', 'total', 'subtotal', 'receipt',
    'review', 'reviews', 'rating', 'ratings', 'feedback', 'ai rating', 'star', 'stars',
    'customer', 'chef', 'chefs', 'cook', 'kitchen', 'reservation', 'reservations',
    'table', 'book', 'booking', 'seat', 'timing', 'timings', 'hours', 'open', 'close',
    'khula', 'band', 'location', 'pata', 'branch', 'phone', 'number', 'contact', 'rabta',
    'whatsapp', 'email', 'mascot', 'billa', 'billi', 'site for sale', 'restaurant',
    'dine in', 'service', 'services'
  ];

  return restaurantKeywords.some(kw => lower.includes(kw));
}

export function isGreetingOrCasualMessage(rawText: string): boolean {
  const trimmed = rawText.trim();
  if (!trimmed) return true;

  const cleaned = trimmed.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?!👋😊❤️👍]/g, ' ').trim();
  if (!cleaned) return true;

  // Elongated greetings like "helllooooo", "hiiii", "sallam"
  if (/^(h+e+l+o+|h+i+|h+e+y+|y+o+|s+a+l+a+m+|h+y+|s+u+p+)$/i.test(cleaned)) {
    return true;
  }

  // Urdu greetings
  if (/^(?:سلام|ہیلو|ہائے|السلام علیکم|اسلام علیکم|اسلام وعلیکم|اسلام و علیکم|وعلیکم السلام)(?:\s+(?:بھائی|جناب|سر|جی))?$/.test(trimmed)) {
    return true;
  }

  const greetingExacts = new Set([
    'hello', 'hi', 'hey', 'halo', 'hallo', 'helo', 'helloo', 'hellooo', 'helloooo',
    'hii', 'hiii', 'hiiii', 'hy', 'hay', 'salam', 'assalam', 'assalam o alaikum',
    'assalamu alaikum', 'assalam-o-alaikum', 'assalam alaikum', 'aoa', 'asalam',
    'asalamu alaikum', 'aslam o alaikum', 'wsalam', 'walaikum assalam', 'salam bhai',
    'yo', 'bro', 'bhai', 'bhai jan', 'bhaijaan', 'bhai sahab', 'bhaiya',
    'oye', 'acha', 'accha', 'achha', 'hmm', 'hmmm', 'hmmmm',
    'ok', 'okay', 'okk', 'k', 'kk', 'yaar', 'yar', 'haan', 'han', 'ji', 'g', 'jee',
    'boss', 'janab', 'sir', 'suno', 'sunain', 'listen', 'madad', 'help',
    'kia hal hai', 'kya hal hai', 'kya haal hai', 'kaise ho', 'kaisay ho', 'kesay ho', 'kese ho',
    'how are you', 'what is up', 'whats up', 'wazzup', 'sup',
    // Urdu script
    'ہیلو', 'ہائے', 'سلام', 'السلام علیکم', 'اسلام علیکم', 'اسلام وعلیکم', 'اسلام و علیکم', 'وعلیکم السلام', 'بھائی', 'اوئے', 'اچھا',
    'ہمم', 'اوکے', 'ہاں', 'جی', 'جناب', 'سنیں', 'کیسے ہو', 'کیا حال ہے', 'مدد', 'سلام بھائی'
  ]);

  if (greetingExacts.has(cleaned)) {
    return true;
  }

  const tokens = cleaned.split(/\s+/).filter(Boolean);
  if (tokens.length <= 3) {
    const greetingWords = ['hello', 'hi', 'hey', 'hy', 'hay', 'salam', 'aoa', 'assalam', 'bro', 'bhai', 'ji', 'g', 'oye', 'yaar', 'yar', 'boss', 'janab', 'sir'];
    const allAreCasual = tokens.every(t => greetingWords.includes(t) || greetingExacts.has(t));
    if (allAreCasual) return true;
  }

  return false;
}

export function extractBudgetFromQuery(query: string): number | null {
  const match = query.match(/(?:₨|rs|pkr|budget|rupees|rupay|pesay)?\s*([0-9]{3,5})/i);
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    if (!isNaN(num) && num >= 50 && num <= 50000) {
      return num;
    }
  }
  return null;
}

export function buildRealBudgetCombo(
  budget: number,
  menuItems: MenuItem[],
  dessertItems: DessertBarItem[] = []
): { items: { name: string; price: number; qty: number; note?: string }[]; total: number; remaining: number } | null {
  const validMenuItems = menuItems.filter(m => (m.isAvailable !== false) && m.price > 0 && m.price <= budget);
  const validDrinks = validMenuItems.filter(m => m.category === 'soft-drinks' || m.category === 'signature-drinks' || m.id.startsWith('sd-') || m.id.startsWith('drink-') || m.id.startsWith('beverage-'));
  const validFood = validMenuItems.filter(m => !validDrinks.includes(m));

  if (validMenuItems.length === 0) {
    return null;
  }

  let chosenFood: MenuItem | null = null;
  let remainingBudget = budget;

  const targetFoodPriceMax = budget >= 300 ? budget - 110 : budget;
  const foodCandidates = validFood.filter(f => f.price <= targetFoodPriceMax).sort((a, b) => b.price - a.price);

  if (foodCandidates.length > 0) {
    chosenFood = foodCandidates[0];
    remainingBudget -= chosenFood.price;
  } else if (validFood.length > 0) {
    chosenFood = [...validFood].sort((a, b) => a.price - b.price)[0];
    remainingBudget -= chosenFood.price;
  }

  let chosenDrink: MenuItem | null = null;
  if (remainingBudget >= 100) {
    const drinkCandidates = validDrinks.filter(d => d.price <= remainingBudget).sort((a, b) => b.price - a.price);
    if (drinkCandidates.length > 0) {
      chosenDrink = drinkCandidates[0];
      remainingBudget -= chosenDrink.price;
    }
  }

  let chosenSideOrDessert: { name: string; price: number } | null = null;
  if (remainingBudget >= 80) {
    const cheapSides = validFood.filter(f => f.price <= remainingBudget && f.id !== chosenFood?.id && (f.category === 'starters' || f.name.toLowerCase().includes('naan') || f.name.toLowerCase().includes('roti') || f.name.toLowerCase().includes('fries')));
    const cheapDesserts = dessertItems.filter(d => d.isAvailable !== false && d.price <= remainingBudget);

    if (cheapSides.length > 0) {
      chosenSideOrDessert = { name: cheapSides[0].name, price: cheapSides[0].price };
      remainingBudget -= cheapSides[0].price;
    } else if (cheapDesserts.length > 0) {
      chosenSideOrDessert = { name: cheapDesserts[0].name, price: cheapDesserts[0].price };
      remainingBudget -= cheapDesserts[0].price;
    }
  }

  const comboList: { name: string; price: number; qty: number; note?: string }[] = [];
  if (chosenFood) {
    comboList.push({
      name: chosenFood.name,
      price: chosenFood.price,
      qty: 1,
      note: chosenFood.pairingNote ? `Includes ${chosenFood.pairingNote}` : undefined
    });
  }
  if (chosenDrink) {
    comboList.push({
      name: chosenDrink.name,
      price: chosenDrink.price,
      qty: 1
    });
  }
  if (chosenSideOrDessert) {
    comboList.push({
      name: chosenSideOrDessert.name,
      price: chosenSideOrDessert.price,
      qty: 1
    });
  }

  if (comboList.length === 0) {
    const cheapest = [...validMenuItems].sort((a, b) => a.price - b.price)[0];
    comboList.push({ name: cheapest.name, price: cheapest.price, qty: 1 });
  }

  const total = comboList.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const remaining = Math.max(0, budget - total);

  return {
    items: comboList,
    total,
    remaining
  };
}

export function formatItemDetails(item: MenuItem, toUrdu: boolean, currency: string = '₨'): string {
  const priceStr = item.price > 0 ? `${currency} ${item.price.toLocaleString()}` : (toUrdu ? 'قیمت ابھی ویب سائٹ پر دستیاب نہیں ہے' : 'Price is currently not available');
  const spice = item.spiceLevel !== undefined ? (item.spiceLevel === 0 ? (toUrdu ? 'نان اسپائسی (Mild)' : 'Non-spicy / Mild') : item.spiceLevel === 3 ? (toUrdu ? 'تیز مصالحہ دار (Ember Spiced)' : 'Bold Ember Spiced') : (toUrdu ? 'درمیانہ مصالحہ (Medium Spicy)' : 'Medium Spicy')) : '';
  const sauces = item.category === 'burgers' ? (toUrdu ? 'کرسپی فرائز اور اسپیشل ساس شامل ہے' : 'Crispy fries aur signature sauce shamil hai') : item.pairingNote || (toUrdu ? 'تازہ املی چٹنی اور پودینہ رائتہ کے ساتھ پیش کیا جاتا ہے' : 'Fresh mint raita aur imli chutney ke sath serve hota hai');

  if (toUrdu) {
    let out = `${item.name} (${priceStr}):\n• تفصیل: ${item.description || 'روایتی تازہ ذائقہ'}`;
    if (spice) out += `\n• مصالحہ: ${spice}`;
    if (sauces) out += `\n• ساتھ شامل: ${sauces}`;
    out += `\n• دستیابی: ${item.isAvailable !== false ? 'دستیاب ہے' : 'فی الحال آؤٹ آف اسٹاک'}`;
    return out;
  }

  let out = `${item.name} (${priceStr}):\n• Description: ${item.description || 'Freshly prepared'}`;
  if (spice) out += `\n• Spice level: ${spice}`;
  if (sauces) out += `\n• Included: ${sauces}`;
  out += `\n• Availability: ${item.isAvailable !== false ? 'Available' : 'Currently out of stock'}`;
  return out;
}

export function getContextualQuickPrompts(context: AssistantContextPayload): AssistantQuickPrompt[] {
  switch (context.section) {
    case 'food':
      return [
        { id: 'q-food-1', label: 'Ye kya hai?', query: 'Ye kya hai aur isme kya shamil hai?' },
        { id: 'q-food-2', label: 'Price kitni hai?', query: 'Is dish ki price kitni hai?' },
        { id: 'q-food-3', label: 'Sab se sasta item?', query: 'Menu mein sab se sasta item konsa hai?' },
        { id: 'q-food-4', label: 'Budget ₨1000 menu', query: 'Mere paas ₨1000 hain, mera menu bana do.' },
      ];

    case 'desserts':
      return [
        { id: 'q-des-1', label: 'Ice cream & Desserts?', query: 'Ice cream aur dessert ke kon se options hain?' },
        { id: 'q-des-2', label: 'Chocolate milkshake?', query: 'Chocolate milkshake available hai?' },
        { id: 'q-des-3', label: 'Falooda & Kulfi?', query: 'Falooda aur Kulfi ki prices kya hain?' },
        { id: 'q-des-4', label: 'Budget ₨500 meetha', query: '₨500 mein koi acha dessert bata do.' },
      ];

    case 'drinks':
      return [
        { id: 'q-drk-1', label: 'Bottled soft drinks', query: 'Pepsi, Coke aur bottled cold drinks available hain?' },
        { id: 'q-drk-2', label: 'Cold drinks prices', query: 'Soft drinks aur cold drinks kitne ki hain?' },
        { id: 'q-drk-3', label: 'Fresh drinks & lassi', query: 'Fresh drinks aur Lassi ki prices kya hain?' },
      ];

    case 'delivery':
      return [
        { id: 'q-del-1', label: 'Delivery kaise karun?', query: 'Delivery kaise karun?' },
        { id: 'q-del-2', label: 'Delivery fee kitni hai?', query: 'Delivery fee kitni hai?' },
        { id: 'q-del-3', label: 'Order cancel time?', query: 'Order cancel karne ka time kitna hota hai?' },
      ];

    case 'pickup':
      return [
        { id: 'q-pic-1', label: 'Pickup kaise hoga?', query: 'Pickup kaise hoga?' },
        { id: 'q-pic-2', label: 'Restaurant location', query: 'Pickup ke liye location kahan hai?' },
      ];

    case 'checkout':
    case 'payment':
      return [
        { id: 'q-pay-1', label: 'QR payment kaise karein?', query: 'QR payment kaise kaam karta hai?' },
        { id: 'q-pay-2', label: 'Payment methods', query: 'Kon se payment methods available hain?' },
        { id: 'q-pay-3', label: 'Order cancel rules', query: 'Kya order place karne ke baad cancel ho sakta hai?' },
      ];

    case 'cart':
      return [
        { id: 'q-crt-1', label: 'Cart vs Order Now', query: 'Add to Cart aur Order Now mein kya farq hai?' },
        { id: 'q-crt-2', label: '₨1000 Meal Combo', query: 'Mere paas ₨1000 hain, mera menu bana do.' },
      ];

    case 'reservations':
      return [
        { id: 'q-res-1', label: 'Table book kaise karein?', query: 'Table reservation kaise karte hain?' },
        { id: 'q-res-2', label: 'Timing & Hours', query: 'Restaurant ke opening hours kya hain?' },
      ];

    case 'offers':
      return [
        { id: 'q-off-1', label: 'Current Offers & Deals', query: 'Website par current offers aur deals kya hain?' },
        { id: 'q-off-2', label: 'Current Events', query: 'Restaurant mein upcoming events kon se hain?' },
      ];

    default:
      return [
        { id: 'q-gen-1', label: 'Mere paas ₨1000 hain', query: 'Mere paas ₨1000 hain, mera menu bana do.' },
        { id: 'q-gen-2', label: 'Chicken mein kya options hain?', query: 'Chicken mein kya options hain?' },
        { id: 'q-gen-3', label: 'Sab se sasta item?', query: 'Sab se sasta item konsa hai?' },
        { id: 'q-gen-4', label: 'Budget Filter kaise use karein?', query: 'Budget Filter kaise use karte hain?' },
      ];
  }
}
