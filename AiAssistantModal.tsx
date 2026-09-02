import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  RotateCcw, 
  ShieldCheck, 
  Wallet,
  Check, 
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAiAssistant } from '../context/AiAssistantContext';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { 
  getContextualQuickPrompts, 
  generateAssistantResponse,
  AssistantQuickPrompt,
  detectQueryLanguage
} from '../utils/aiAssistantEngine';
import cuteChefCatMascot from '../assets/images/cute_cat_mascot_1787654767169.jpg';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  isUrduScript?: boolean;
}

export const AiAssistantModal: React.FC = () => {
  const { isOpen, closeAssistant, activeContext, openBudgetFilter } = useAiAssistant();
  const { 
    config, 
    menuItems, 
    dessertBarItems, 
    specialRecipes, 
    offers, 
    chefs, 
    events, 
    reviews, 
    cartItems 
  } = useRestaurantData();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const assistantName = config.aiAssistant?.assistantName || 'Ember & Spice Assistant';
  const avatarIcon = config.aiAssistant?.avatarIcon || 'billa-cat';
  const defaultGreeting = config.aiAssistant?.greeting || 'Aap ka shukria hamare restaurant mein aane ke liye.';

  // Initialize first-time greeting only once when first opened
  useEffect(() => {
    if (isOpen) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setMessages((prev) => {
        if (prev.length === 0) {
          return [
            {
              id: 'msg-welcome-first',
              sender: 'assistant',
              text: defaultGreeting,
              time: timeStr,
              isUrduScript: false
            }
          ];
        }
        return prev;
      });

      // Focus input after opening animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, defaultGreeting]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeAssistant();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAssistant]);

  if (!isOpen) return null;

  const quickPrompts: AssistantQuickPrompt[] = getContextualQuickPrompts(activeContext);

  const handleSendMessage = (queryText?: string) => {
    const queryToSend = (queryText || inputQuery).trim();
    if (!queryToSend || isTyping) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `user-${Date.now()}`;
    const userLang = detectQueryLanguage(queryToSend);
    const userIsUrduScript = userLang === 'urdu_script';

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: queryToSend,
        time: timeStr,
        isUrduScript: userIsUrduScript
      }
    ]);

    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAssistantResponse(queryToSend, activeContext, {
        config,
        menuItems,
        dessertBarItems,
        specialRecipes,
        offers,
        chefs,
        events,
        reviews,
        cartItems
      }, messages);

      const responseIsUrduScript = /[\u0600-\u06FF]/.test(response);

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUrduScript: responseIsUrduScript
        }
      ]);
      setIsTyping(false);
    }, 400);
  };

  const handleResetChat = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'assistant',
        text: defaultGreeting,
        time: timeStr,
        isUrduScript: false
      }
    ]);
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={closeAssistant}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-md bg-[#16110d] border border-[#d4af37]/40 rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[620px] h-[580px]"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#22170f] via-[#1c130d] to-[#160f0a] border-b border-[#2d2015] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#d4af37] bg-[#291e15] shadow-md flex items-center justify-center">
                  {avatarIcon === 'billa-cat' ? (
                    <img 
                      src={cuteChefCatMascot} 
                      alt={assistantName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Sparkles className="w-5 h-5 text-[#d4af37]" />
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#16110d]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base font-bold text-[#fdfbf7] flex items-center gap-1.5">
                    {assistantName}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                    Restaurant AI
                  </span>
                </div>
                <p className="text-[11px] text-[#a89d8f] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Menu, Prices, Combos &amp; Ordering
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  const target = e.currentTarget;
                  closeAssistant();
                  setTimeout(() => {
                    openBudgetFilter(500, target);
                  }, 50);
                }}
                className="px-2 py-1 rounded-lg bg-[#291b11] border border-[#d4af37]/50 text-[#d4af37] text-[11px] font-bold flex items-center gap-1 hover:bg-[#d4af37] hover:text-black transition-colors cursor-pointer mr-1"
                title="Open Budget Filter"
              >
                <Wallet className="w-3 h-3" />
                <span>Budget</span>
              </button>

              <button
                type="button"
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-2 rounded-xl text-[#a89d8f] hover:text-[#fdfbf7] hover:bg-[#251910] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={closeAssistant}
                title="Close assistant"
                className="p-2 rounded-xl text-[#a89d8f] hover:text-[#fdfbf7] hover:bg-[#251910] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Badge (Where the customer is right now) */}
          <div className="px-4 py-2 bg-[#120d09] border-b border-[#23180f] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-[#c5bcad] truncate max-w-[70%]">
              <span className="text-[#d4af37] font-bold">📍 Context:</span>
              <span className="font-medium text-[#fdfbf7] truncate">
                {activeContext.itemName ? (
                  `${activeContext.itemName} ${activeContext.itemPrice ? `(₨ ${activeContext.itemPrice.toLocaleString()})` : ''}`
                ) : (
                  activeContext.title || activeContext.section.toUpperCase()
                )}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
              Live Data
            </span>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-[#16110d]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#d4af37]/60 shrink-0 mt-0.5">
                    {avatarIcon === 'billa-cat' ? (
                      <img src={cuteChefCatMascot} alt="AI" className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-[#d4af37] p-0.5" />
                    )}
                  </div>
                )}

                <div className={`max-w-[84%] relative group ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    dir={msg.isUrduScript ? 'rtl' : 'ltr'}
                    className={`p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-md ${
                      msg.isUrduScript ? 'font-serif text-[14px] leading-loose' : ''
                    } ${
                      msg.sender === 'user'
                        ? 'bg-[#d4af37] text-[#120d09] font-medium rounded-tr-xs'
                        : 'bg-[#221811] text-[#fdfbf7] border border-[#352518] rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-[#8e8272]">
                    <span>{msg.time}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        type="button"
                        onClick={() => copyMessage(msg.id, msg.text)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#d4af37] cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-[#d4af37]/60 shrink-0 mt-0.5">
                  <img src={cuteChefCatMascot} alt="AI" className="w-full h-full object-cover" />
                </div>
                <div className="p-3 rounded-2xl bg-[#221811] border border-[#352518] rounded-tl-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Prompts Chips */}
          <div className="p-2.5 bg-[#140e0a] border-t border-[#23180f] overflow-x-auto custom-scrollbar flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-[#8e8272] uppercase font-bold tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              Quick:
            </span>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => handleSendMessage(prompt.query)}
                className="px-2.5 py-1 rounded-full bg-[#20150e] hover:bg-[#2e1f14] border border-[#d4af37]/30 hover:border-[#d4af37] text-[11px] text-[#fdfbf7] whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#18120d] border-t border-[#2d2015]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Poochiye (English, Roman Urdu, یا اردو میں)..."
                className="flex-1 bg-[#100b08] border border-[#312316] focus:border-[#d4af37] text-xs sm:text-sm text-[#fdfbf7] px-3.5 py-2.5 rounded-xl focus:outline-none placeholder-[#746656]"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38e22] text-[#120d09] font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-[#8e8272]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Sirf {config.name} food &amp; services
              </span>
              <span>English • Roman Urdu • اردو</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
