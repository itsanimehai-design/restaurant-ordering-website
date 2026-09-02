import React from 'react';
import { Sparkles, Bot, MessageSquareText, HelpCircle } from 'lucide-react';
import { AssistantContextPayload } from '../types';
import { useAiAssistant } from '../context/AiAssistantContext';
import { useRestaurantData } from '../context/RestaurantDataContext';
import cuteChefCatMascot from '../assets/images/cute_cat_mascot_1787654767169.jpg';

interface AiAssistantButtonProps {
  context: AssistantContextPayload;
  label?: string;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'icon' | 'pill' | 'badge' | 'glass';
  className?: string;
  tooltipText?: string;
}

export const AiAssistantButton: React.FC<AiAssistantButtonProps> = ({
  context,
  label = 'Ask AI',
  size = 'sm',
  variant = 'pill',
  className = '',
  tooltipText = 'Ask AI'
}) => {
  const { openAssistant, isSectionEnabled } = useAiAssistant();
  const { config } = useRestaurantData();

  const isEnabled = isSectionEnabled(context.section);
  if (!isEnabled || config.aiAssistant?.isEnabled === false) {
    return null;
  }

  const avatarIcon = config.aiAssistant?.avatarIcon || 'billa-cat';

  const renderIcon = (iconSizeClass: string = 'w-3.5 h-3.5') => {
    if (avatarIcon === 'billa-cat') {
      return (
        <div className="relative shrink-0 overflow-hidden rounded-full border border-[#d4af37]">
          <img 
            src={cuteChefCatMascot} 
            alt="Mr. Billa Mascot" 
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-cover"
          />
        </div>
      );
    }
    if (avatarIcon === 'bot') {
      return <Bot className={`${iconSizeClass} text-[#d4af37]`} />;
    }
    return <Sparkles className={`${iconSizeClass} text-[#d4af37] ai-sparkle-pulse`} />;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    openAssistant(context);
  };

  // Sizing definitions
  const sizeClasses = {
    xs: 'px-2 py-1 text-[11px] gap-1',
    sm: 'px-2.5 sm:px-3 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-xs gap-2',
  };

  // Base styling with continuous, non-intrusive subtle luxury gold glow
  if (variant === 'pill') {
    return (
      <button
        type="button"
        id={`ai-btn-${context.section}-${context.itemId || 'general'}`}
        onClick={handleClick}
        title={tooltipText}
        className={`inline-flex items-center rounded-xl sm:rounded-full bg-gradient-to-r from-[#2a1d12] to-[#1a120c] border border-[#d4af37]/70 text-[#fdfbf7] hover:border-[#d4af37] hover:bg-[#342416] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-md cursor-pointer ai-assistant-glow select-none ${sizeClasses[size]} ${className}`}
      >
        {renderIcon('w-3.5 h-3.5')}
        <span className="font-bold text-[#fdfbf7] tracking-wide whitespace-nowrap">
          {label || 'Ask AI'}
        </span>
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <button
        type="button"
        id={`ai-btn-${context.section}-${context.itemId || 'general'}`}
        onClick={handleClick}
        title={tooltipText}
        className={`inline-flex items-center rounded-md px-2 py-0.5 bg-[#251910] border border-[#d4af37]/50 text-[#d4af37] text-[10px] font-bold hover:bg-[#342416] hover:border-[#d4af37] transition-all cursor-pointer ai-assistant-glow ${className}`}
      >
        {renderIcon('w-3 h-3')}
        {label && <span className="ml-1">{label}</span>}
      </button>
    );
  }

  if (variant === 'glass') {
    return (
      <button
        type="button"
        id={`ai-btn-${context.section}-${context.itemId || 'general'}`}
        onClick={handleClick}
        title={tooltipText}
        className={`inline-flex items-center justify-center rounded-xl bg-[#1a140f]/80 backdrop-blur-md border border-[#d4af37]/50 hover:border-[#d4af37] text-[#d4af37] transition-all duration-300 shadow-lg cursor-pointer ai-assistant-glow hover:scale-105 ${sizeClasses[size]} ${className}`}
      >
        {renderIcon('w-4 h-4')}
        {label && <span className="font-medium text-xs text-[#fdfbf7]">{label}</span>}
      </button>
    );
  }

  // Default 'icon' button: small, elegant, perfectly circular/rounded
  return (
    <button
      type="button"
      id={`ai-btn-${context.section}-${context.itemId || 'general'}`}
      onClick={handleClick}
      title={tooltipText}
      aria-label={tooltipText}
      className={`inline-flex items-center justify-center rounded-full bg-[#20160f] border border-[#d4af37]/60 text-[#d4af37] hover:bg-[#2d1f14] hover:border-[#d4af37] hover:scale-110 transition-all duration-300 shadow-sm cursor-pointer ai-assistant-glow shrink-0 ${
        size === 'xs' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-7 h-7'
      } ${className}`}
    >
      {renderIcon(size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5')}
    </button>
  );
};
