import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AssistantContextPayload, AssistantSection } from '../types';
import { useRestaurantData } from './RestaurantDataContext';

export interface BudgetAnchorRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface AiAssistantContextType {
  isOpen: boolean;
  isBudgetFilterOpen: boolean;
  activeContext: AssistantContextPayload;
  openAssistant: (context?: Partial<AssistantContextPayload>) => void;
  closeAssistant: () => void;
  openBudgetFilter: (
    initialBudget?: number,
    anchor?: HTMLElement | React.SyntheticEvent | BudgetAnchorRect | null
  ) => void;
  closeBudgetFilter: () => void;
  initialBudgetFilterValue?: number;
  budgetAnchorRect?: BudgetAnchorRect | null;
  isSectionEnabled: (section: AssistantSection) => boolean;
}

const defaultContext: AssistantContextPayload = {
  section: 'general',
  title: 'SITE FOR SALE Restaurant Guide'
};

const AiAssistantContext = createContext<AiAssistantContextType | undefined>(undefined);

export const AiAssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { config } = useRestaurantData();
  const [isOpen, setIsOpen] = useState(false);
  const [isBudgetFilterOpen, setIsBudgetFilterOpen] = useState(false);
  const [initialBudgetFilterValue, setInitialBudgetFilterValue] = useState<number | undefined>(undefined);
  const [budgetAnchorRect, setBudgetAnchorRect] = useState<BudgetAnchorRect | null>(null);
  const [activeContext, setActiveContext] = useState<AssistantContextPayload>(defaultContext);

  const isSectionEnabled = (section: AssistantSection): boolean => {
    const aiConfig = config.aiAssistant;
    if (!aiConfig || aiConfig.isEnabled === false) return false;
    if (!aiConfig.enabledSections) return true;

    switch (section) {
      case 'food':
      case 'desserts':
      case 'drinks':
        return aiConfig.enabledSections.menuAndFood !== false;
      case 'cart':
      case 'delivery':
      case 'pickup':
      case 'checkout':
      case 'payment':
        return aiConfig.enabledSections.ordersAndCheckout !== false;
      case 'reservations':
        return aiConfig.enabledSections.reservations !== false;
      case 'events':
      case 'offers':
        return aiConfig.enabledSections.eventsAndOffers !== false;
      case 'info':
      case 'contact':
        return aiConfig.enabledSections.restaurantInfo !== false;
      case 'reviews':
      case 'gallery':
      case 'chefs':
        return aiConfig.enabledSections.reviewsAndGallery !== false;
      default:
        return true;
    }
  };

  const openAssistant = (context?: Partial<AssistantContextPayload>) => {
    const targetSection = context?.section || 'general';
    // If globally disabled, do not open
    if (config.aiAssistant?.isEnabled === false) return;

    setActiveContext({
      ...defaultContext,
      ...context,
      section: targetSection
    });
    setIsOpen(true);
  };

  const closeAssistant = () => {
    setIsOpen(false);
  };

  const openBudgetFilter = (
    budget?: number,
    anchor?: HTMLElement | React.SyntheticEvent | BudgetAnchorRect | null
  ) => {
    if (budget) {
      setInitialBudgetFilterValue(budget);
    }

    let calculatedRect: BudgetAnchorRect | null = null;

    if (anchor) {
      if ('currentTarget' in anchor && anchor.currentTarget instanceof HTMLElement) {
        const r = anchor.currentTarget.getBoundingClientRect();
        calculatedRect = { top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
      } else if ('target' in anchor && anchor.target instanceof HTMLElement) {
        const r = anchor.target.getBoundingClientRect();
        calculatedRect = { top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
      } else if (anchor instanceof HTMLElement) {
        const r = anchor.getBoundingClientRect();
        calculatedRect = { top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
      } else if ('top' in anchor && 'left' in anchor) {
        calculatedRect = anchor as BudgetAnchorRect;
      }
    }

    // If no explicit anchor passed, find the active trigger element in DOM
    if (!calculatedRect && typeof document !== 'undefined') {
      const candidates = [
        document.getElementById('header-budget-filter-btn'),
        document.getElementById('mobile-header-budget-filter-btn'),
        document.getElementById('menu-budget-filter-trigger')
      ];
      for (const el of candidates) {
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            calculatedRect = { top: r.top, left: r.left, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
            break;
          }
        }
      }
    }

    setBudgetAnchorRect(calculatedRect);
    setIsBudgetFilterOpen(true);
  };

  const closeBudgetFilter = () => {
    setIsBudgetFilterOpen(false);
    setInitialBudgetFilterValue(undefined);
    setBudgetAnchorRect(null);
  };

  return (
    <AiAssistantContext.Provider
      value={{
        isOpen,
        isBudgetFilterOpen,
        activeContext,
        openAssistant,
        closeAssistant,
        openBudgetFilter,
        closeBudgetFilter,
        initialBudgetFilterValue,
        budgetAnchorRect,
        isSectionEnabled
      }}
    >
      {children}
    </AiAssistantContext.Provider>
  );
};

export const useAiAssistant = () => {
  const ctx = useContext(AiAssistantContext);
  if (!ctx) {
    throw new Error('useAiAssistant must be used within an AiAssistantProvider');
  }
  return ctx;
};
