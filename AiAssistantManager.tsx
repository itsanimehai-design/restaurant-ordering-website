import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Sliders, 
  Eye, 
  ShieldCheck,
  Zap,
  Tag,
  Send,
  Trash2,
  Gauge,
  HelpCircle,
  Flame,
  Building2,
  Store,
  Compass,
  AlertCircle
} from 'lucide-react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { AiAssistantConfig, AssistantContextPayload } from '../../types';
import cuteChefCatMascot from '../../assets/images/cute_cat_mascot_1787654767169.jpg';
import { generateAssistantResponse } from '../../utils/aiAssistantEngine';

interface AiAssistantManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

interface TestMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  ruleBadge?: string;
}

export const AiAssistantManager: React.FC<AiAssistantManagerProps> = ({ onShowToast }) => {
  const { 
    config, 
    updateConfig,
    menuItems,
    deals,
    specialRecipes,
    offers,
    events,
    chefs,
    reviews,
    dessertBarItems
  } = useRestaurantData();

  const currentAiConfig: AiAssistantConfig = config.aiAssistant || {
    isEnabled: true,
    assistantName: 'Ember & Spice Assistant',
    greeting: 'Aap ka shukria Ember & Spice mein aane ke liye.',
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
  };

  const [formState, setFormState] = useState<AiAssistantConfig>({
    ...currentAiConfig,
    temperature: currentAiConfig.temperature ?? 0.6
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Live Test Window State
  const [testInput, setTestInput] = useState('');
  const [testMessages, setTestMessages] = useState<TestMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: formState.greeting || 'Aap ka shukria Ember & Spice mein aane ke liye.',
      timestamp: 'Just now',
      ruleBadge: 'Welcome Greeting'
    }
  ]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [testMessages]);

  const handleChange = <K extends keyof AiAssistantConfig>(key: K, value: AiAssistantConfig[K]) => {
    setFormState(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSectionToggle = (sectionKey: keyof AiAssistantConfig['enabledSections']) => {
    setFormState(prev => ({
      ...prev,
      enabledSections: {
        ...prev.enabledSections,
        [sectionKey]: !prev.enabledSections[sectionKey]
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateConfig({
      aiAssistant: formState
    });
    setHasChanges(false);
    onShowToast('AI Assistant Settings Saved', `Temperature set to ${formState.temperature ?? 0.6} and parameters updated.`, 'gold');
  };

  const handleResetToDefaults = () => {
    const defaults: AiAssistantConfig = {
      isEnabled: true,
      assistantName: 'Ember & Spice Assistant',
      greeting: 'Aap ka shukria Ember & Spice mein aane ke liye.',
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
    };
    setFormState(defaults);
    setHasChanges(true);
    onShowToast('Reset to Defaults', 'Temperature set to 0.6. Click "Save Changes" to apply.', 'info');
  };

  const handleSendTestQuery = (queryToSend?: string) => {
    const text = (queryToSend ?? testInput).trim();
    if (!text) return;

    const userMsg: TestMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const contextPayload: AssistantContextPayload = {
      section: 'general',
      customContext: formState.customNotes
    };

    const engineData = {
      config: {
        ...config,
        aiAssistant: formState
      },
      menuItems,
      deals,
      specialRecipes,
      offers,
      events,
      chefs,
      reviews,
      dessertBarItems
    };

    const convHistory = testMessages.map(m => ({
      sender: m.sender,
      text: m.text
    }));

    const response = generateAssistantResponse(text, contextPayload, engineData, convHistory);

    // Identify rule badge for transparency
    let badge = 'Ember & Spice AI Response';
    const lower = text.toLowerCase();
    if (lower.includes('pizza') || lower.includes('biryani') || lower.includes('nahi hai') || lower.includes('available nahi')) {
      badge = 'Rule: Item Unavailable';
    } else if (/kfc|mcdonald|monal|bundu khan|kolachi|lalqila|habibi|broadway|cheezious|hardees/i.test(lower)) {
      badge = 'Rule: Famous Competitor';
    } else if (/doosri|dusri|falane|dhaba|local dukan|street food|dusra restaurant/i.test(lower)) {
      badge = 'Rule: Smaller Competitor';
    } else if (/president|prime minister|ronaldo|messi|elon musk|weather|gdp|iphone|samsung|movie/i.test(lower)) {
      badge = 'Rule: Outside Scope Refusal';
    } else if (/fine dining|open fire|hearth|experience|ambience/i.test(lower)) {
      badge = 'Rule: Fine Dining Experience';
    }

    const assistantMsg: TestMessage = {
      id: 'a-' + Date.now(),
      sender: 'assistant',
      text: response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ruleBadge: badge
    };

    setTestMessages(prev => [...prev, userMsg, assistantMsg]);
    if (!queryToSend) {
      setTestInput('');
    }
  };

  const handleClearChat = () => {
    setTestMessages([
      {
        id: 'init-re',
        sender: 'assistant',
        text: formState.greeting || 'Aap ka shukria Ember & Spice mein aane ke liye.',
        timestamp: 'Just now',
        ruleBadge: 'Welcome Greeting'
      }
    ]);
  };

  const currentTemp = formState.temperature ?? 0.6;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#22170f] via-[#1a120c] to-[#140e0a] border border-[#d4af37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#d4af37] bg-[#291e15] shadow-lg flex items-center justify-center shrink-0">
            {formState.avatarIcon === 'billa-cat' ? (
              <img src={cuteChefCatMascot} alt="Mr. Billa" className="w-full h-full object-cover" />
            ) : (
              <Sparkles className="w-7 h-7 text-[#d4af37]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#fdfbf7]">
                AI Assistant &amp; Roman Urdu Companion
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                {formState.isEnabled ? 'Active' : 'Disabled'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Temp: {currentTemp.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-[#a89d8f] mt-0.5">
              Control the customer-facing Roman Urdu AI guide, strict scope guardrails, temperature, and live chat testing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 rounded-xl bg-[#221811] hover:bg-[#2d2016] text-xs text-[#c5bcad] font-semibold border border-[#382618] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38e22] text-[#120d09] text-xs font-bold hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Main Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* Master Toggle */}
          <div className="p-5 rounded-2xl bg-[#18120e] border border-[#2e2319] flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-bold text-[#fdfbf7] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#d4af37]" />
                Enable AI Assistant Throughout Website
              </label>
              <p className="text-xs text-[#8e8272]">
                Displays small glowing AI helper buttons beside dishes, checkout, delivery, and services.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formState.isEnabled}
                onChange={(e) => handleChange('isEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#2d2116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#fdfbf7] after:border-[#2d2116] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
            </label>
          </div>

          {/* Identity & Naming */}
          <div className="p-5 rounded-2xl bg-[#18120e] border border-[#2e2319] space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-[#a89d8f] border-b border-[#2a2016] pb-2 flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#d4af37]" />
              Assistant Identity &amp; Branding
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#c5bcad]">Assistant Name</label>
                <input
                  type="text"
                  value={formState.assistantName}
                  onChange={(e) => handleChange('assistantName', e.target.value)}
                  placeholder="e.g. Ember & Spice Assistant"
                  className="w-full bg-[#120e0b] border border-[#2e2319] focus:border-[#d4af37] text-xs text-[#fdfbf7] px-3.5 py-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#c5bcad]">Avatar Icon</label>
                <select
                  value={formState.avatarIcon}
                  onChange={(e) => handleChange('avatarIcon', e.target.value as any)}
                  className="w-full bg-[#120e0b] border border-[#2e2319] focus:border-[#d4af37] text-xs text-[#fdfbf7] px-3.5 py-2.5 rounded-xl focus:outline-none"
                >
                  <option value="billa-cat">Mr. Billa (Cute Chef Hat Mascot)</option>
                  <option value="sparkles">Golden Sparkles (Minimalist)</option>
                  <option value="bot">Robot AI Bot</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#c5bcad]">Greeting Message (Roman Urdu)</label>
              <textarea
                rows={2}
                value={formState.greeting}
                onChange={(e) => handleChange('greeting', e.target.value)}
                placeholder="Aap ka shukria Ember & Spice mein aane ke liye."
                className="w-full bg-[#120e0b] border border-[#2e2319] focus:border-[#d4af37] text-xs text-[#fdfbf7] px-3.5 py-2 rounded-xl focus:outline-none leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#c5bcad]">Supported Language Mode</label>
              <select
                value={formState.language}
                onChange={(e) => handleChange('language', e.target.value as any)}
                className="w-full bg-[#120e0b] border border-[#2e2319] focus:border-[#d4af37] text-xs text-[#fdfbf7] px-3.5 py-2.5 rounded-xl focus:outline-none"
              >
                <option value="roman-urdu">Roman Urdu (Default &amp; Recommended)</option>
                <option value="urdu">Urdu Script</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>

          {/* Section Visibility Controls */}
          <div className="p-5 rounded-2xl bg-[#18120e] border border-[#2e2319] space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-[#a89d8f] border-b border-[#2a2016] pb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#d4af37]" />
              Section-by-Section Button Display
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'menuAndFood', label: 'Menu & Food Dishes', desc: 'Dishes, drinks, dessert bar cards' },
                { key: 'ordersAndCheckout', label: 'Online Delivery & Checkout', desc: 'Order modal, cart, payment step' },
                { key: 'reservations', label: 'Table Reservations', desc: 'Dine-in booking & seating forms' },
                { key: 'eventsAndOffers', label: 'Events & Deals', desc: 'Dawat packages & promotion cards' },
                { key: 'restaurantInfo', label: 'Restaurant Info & Contact', desc: 'Timings, phone, maps, footer' },
                { key: 'reviewsAndGallery', label: 'Reviews & Gallery', desc: 'Customer reviews & gallery items' },
              ].map((sec) => (
                <label
                  key={sec.key}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#120e0b] border border-[#281e15] hover:border-[#382b1e] transition-all cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formState.enabledSections[sec.key as keyof AiAssistantConfig['enabledSections']]}
                    onChange={() => handleSectionToggle(sec.key as keyof AiAssistantConfig['enabledSections'])}
                    className="accent-[#d4af37] w-4 h-4 mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-[#fdfbf7]">{sec.label}</span>
                    <span className="text-[10px] text-[#8e8272]">{sec.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Extra Custom Notes / Special Knowledge */}
          <div className="p-5 rounded-2xl bg-[#18120e] border border-[#2e2319] space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-[#a89d8f] border-b border-[#2a2016] pb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#d4af37]" />
              Owner Notes &amp; Special Knowledge (Optional)
            </h3>
            <p className="text-xs text-[#8e8272]">
              Add special announcements or custom notes the AI can use when guiding customers.
            </p>
            <textarea
              rows={3}
              value={formState.customNotes || ''}
              onChange={(e) => handleChange('customNotes', e.target.value)}
              placeholder="e.g. Special live charcoal BBQ on weekends, 100% Halal certified, family seating on 2nd floor."
              className="w-full bg-[#120e0b] border border-[#2e2319] focus:border-[#d4af37] text-xs text-[#fdfbf7] px-3.5 py-2 rounded-xl focus:outline-none"
            />
          </div>
        </div>

        {/* Right 5 Cols: Side Panel with Temperature Slider & Live Test Window */}
        <div className="lg:col-span-5 space-y-5">
          {/* Temperature Slider Card */}
          <div className="p-5 rounded-2xl bg-[#18120e] border border-[#2e2319] space-y-4">
            <div className="flex items-center justify-between border-b border-[#2a2016] pb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#a89d8f] flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-[#d4af37]" />
                Temperature Sliding Bar
              </span>
              <span className="px-2.5 py-1 rounded-lg font-mono text-xs font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                {currentTemp.toFixed(1)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#c5bcad]">
                <span className="font-semibold">Temperature: {currentTemp.toFixed(1)}</span>
                <span className="text-[11px] text-[#d4af37] font-medium">
                  {currentTemp <= 0.3 ? 'Deterministic (Strict)' : currentTemp <= 0.7 ? 'Balanced & Precise (Recommended 0.6)' : 'Creative'}
                </span>
              </div>

              {/* Slider Input */}
              <div className="relative py-1">
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={currentTemp}
                  onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#2a1e15] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                />
                <div className="flex justify-between text-[9px] text-[#8e8272] pt-1">
                  <span>0.0 (Strict)</span>
                  <span className="font-bold text-[#d4af37]">0.6 (Optimal)</span>
                  <span>1.0 (Creative)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleChange('temperature', 0.6)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    Math.abs(currentTemp - 0.6) < 0.01 
                      ? 'bg-[#d4af37] text-[#120d09] border-[#d4af37]' 
                      : 'bg-[#221811] text-[#c5bcad] border-[#382618] hover:bg-[#2d2016]'
                  }`}
                >
                  Set to 0.6 (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('temperature', 0.2)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    Math.abs(currentTemp - 0.2) < 0.01 
                      ? 'bg-[#d4af37] text-[#120d09] border-[#d4af37]' 
                      : 'bg-[#221811] text-[#c5bcad] border-[#382618] hover:bg-[#2d2016]'
                  }`}
                >
                  Set to 0.2
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('temperature', 0.8)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    Math.abs(currentTemp - 0.8) < 0.01 
                      ? 'bg-[#d4af37] text-[#120d09] border-[#d4af37]' 
                      : 'bg-[#221811] text-[#c5bcad] border-[#382618] hover:bg-[#2d2016]'
                  }`}
                >
                  Set to 0.8
                </button>
              </div>

              <p className="text-[11px] text-[#8e8272] pt-1 leading-relaxed">
                0.6 temperature balances accurate restaurant menu facts with natural conversational Roman Urdu responses.
              </p>
            </div>
          </div>

          {/* Test Window (Chat Prompt) */}
          <div className="p-5 rounded-2xl bg-[#18120e] border border-[#2e2319] space-y-3 flex flex-col h-[520px]">
            <div className="flex items-center justify-between border-b border-[#2a2016] pb-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs uppercase font-bold tracking-wider text-[#fdfbf7]">
                  Test Window (Chat Prompt)
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1 rounded-lg bg-[#221811] hover:bg-[#2d2016] text-[#8e8272] hover:text-[#fdfbf7] text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear test chat"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>

            {/* Quick Test Prompt Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-[#8e8272] font-semibold block">Quick Test Queries:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSendTestQuery('Kya aap ke paas pizza hai?')}
                  className="px-2 py-1 rounded-lg bg-[#221811] hover:bg-[#2e2116] border border-[#352518] text-[10px] text-[#c5bcad] hover:text-[#d4af37] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <AlertCircle className="w-2.5 h-2.5 text-amber-400" />
                  Kya pizza hai?
                </button>
                <button
                  type="button"
                  onClick={() => handleSendTestQuery('KFC ya Monal kaisa hai?')}
                  className="px-2 py-1 rounded-lg bg-[#221811] hover:bg-[#2e2116] border border-[#352518] text-[10px] text-[#c5bcad] hover:text-[#d4af37] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Building2 className="w-2.5 h-2.5 text-blue-400" />
                  Monal kaisa hai?
                </button>
                <button
                  type="button"
                  onClick={() => handleSendTestQuery('Doosri dukan ya dhaba kaisa hai?')}
                  className="px-2 py-1 rounded-lg bg-[#221811] hover:bg-[#2e2116] border border-[#352518] text-[10px] text-[#c5bcad] hover:text-[#d4af37] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Store className="w-2.5 h-2.5 text-purple-400" />
                  Doosri dukan?
                </button>
                <button
                  type="button"
                  onClick={() => handleSendTestQuery('Who is the Prime Minister of Pakistan?')}
                  className="px-2 py-1 rounded-lg bg-[#221811] hover:bg-[#2e2116] border border-[#352518] text-[10px] text-[#c5bcad] hover:text-[#d4af37] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-2.5 h-2.5 text-red-400" />
                  Outside Scope
                </button>
                <button
                  type="button"
                  onClick={() => handleSendTestQuery('Open-fire hearth dining experience kaisa hai?')}
                  className="px-2 py-1 rounded-lg bg-[#221811] hover:bg-[#2e2116] border border-[#352518] text-[10px] text-[#c5bcad] hover:text-[#d4af37] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Flame className="w-2.5 h-2.5 text-orange-400" />
                  Fine Dining
                </button>
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div 
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto space-y-2.5 p-3 rounded-xl bg-[#120e0b] border border-[#281e15] text-xs scrollbar-thin"
            >
              {testMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[9px] text-[#8e8272]">{msg.timestamp}</span>
                    {msg.ruleBadge && (
                      <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                        {msg.ruleBadge}
                      </span>
                    )}
                  </div>
                  <div 
                    className={`p-2.5 rounded-xl max-w-[90%] text-[11px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#d4af37] text-[#120d09] font-medium rounded-tr-none'
                        : 'bg-[#20160f] border border-[#352518] text-[#fdfbf7] rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Prompt Box */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendTestQuery();
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="User query type karein (e.g. Kya pizza hai?)..."
                className="flex-1 bg-[#120e0b] border border-[#2e2319] focus:border-[#d4af37] text-xs text-[#fdfbf7] px-3.5 py-2.5 rounded-xl focus:outline-none placeholder-[#695d4f]"
              />
              <button
                type="submit"
                disabled={!testInput.trim()}
                className="p-2.5 rounded-xl bg-[#d4af37] hover:bg-[#b38e22] text-[#120d09] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shrink-0"
                title="Send test prompt"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center gap-1.5 text-[10px] text-[#8e8272] pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Strict rules enforced at temperature {currentTemp.toFixed(1)}.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
