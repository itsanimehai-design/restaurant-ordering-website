import React from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Eye, 
  LogOut, 
  Coins, 
  Sparkles,
  PlusCircle,
  Code2
} from 'lucide-react';

interface OwnerCommandBarProps {
  onQuickAddDish?: () => void;
}

export const OwnerCommandBar: React.FC<OwnerCommandBarProps> = ({ onQuickAddDish }) => {
  const { 
    authSession, 
    logoutOwner, 
    isOwnerModeActive, 
    setIsOwnerModeActive,
    config,
    updateConfig,
    openOwnerPortal,
    setOwnerActiveTab
  } = useRestaurantData();

  if (!authSession.isAuthenticated) {
    return null;
  }

  const currencies = [
    { code: 'PKR', symbol: 'PKR', label: 'PKR (Rs.)' },
    { code: 'GBP', symbol: '£', label: 'GBP (£)' },
    { code: 'USD', symbol: '$', label: 'USD ($)' },
    { code: 'EUR', symbol: '€', label: 'EUR (€)' }
  ];

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = currencies.find(c => c.code === e.target.value);
    if (selected) {
      updateConfig({
        currencyCode: selected.code,
        currencySymbol: selected.symbol
      });
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-[#14110F]/95 border-b border-[#C5A059]/40 backdrop-blur-md px-4 py-2 text-xs text-[#F5F2ED] shadow-xl flex flex-wrap items-center justify-between gap-3 transition-all">
      {/* Left: Owner Authentication Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C158] font-semibold text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="tracking-wide">Owner Control Panel</span>
        </div>
        <span className="hidden md:inline-block text-[#D6CEBF]/80 text-[11px]">
          Signed in as <strong className="text-white font-semibold">{authSession.username}</strong>
        </span>
      </div>

      {/* Middle / Right: Controls */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-3">
        {/* Currency Quick Selector */}
        <div className="flex items-center gap-1.5 bg-[#1E1A17] border border-white/10 rounded-lg px-2 py-1 text-[11px]">
          <Coins className="w-3 h-3 text-[#C5A059]" />
          <span className="text-[#D6CEBF] hidden sm:inline">Currency:</span>
          <select
            value={config.currencyCode || 'PKR'}
            onChange={handleCurrencyChange}
            className="bg-transparent text-white font-medium outline-none cursor-pointer text-[11px]"
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code} className="bg-[#1C1815] text-white">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Direct Code Workspace Button */}
        <button
          onClick={() => {
            setOwnerActiveTab('code-workspace');
            setIsOwnerModeActive(true);
          }}
          className="px-3 py-1.5 rounded-lg bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/50 text-[#f5d061] font-bold flex items-center gap-1.5 transition-all text-[11px] cursor-pointer"
          title="Open Code Workspace & JSON Editor"
        >
          <Code2 className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Code Workspace</span>
        </button>

        {/* View Switcher: Dashboard vs Live Website */}
        {isOwnerModeActive ? (
          <button
            onClick={() => setIsOwnerModeActive(false)}
            className="px-3.5 py-1.5 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/30 border border-[#C5A059]/50 text-[#F5F2ED] font-semibold flex items-center gap-1.5 transition-all text-[11px] cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>View Live Website</span>
          </button>
        ) : (
          <button
            onClick={() => setIsOwnerModeActive(true)}
            className="btn-gold px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 text-[11px] cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Open Owner Dashboard</span>
          </button>
        )}

        {/* Quick Add Dish if on dashboard */}
        {isOwnerModeActive && onQuickAddDish && (
          <button
            onClick={onQuickAddDish}
            className="hidden sm:flex px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium items-center gap-1.5 text-[11px] transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Add Dish</span>
          </button>
        )}

        {/* Sign Out */}
        <button
          onClick={logoutOwner}
          className="px-2.5 py-1.5 rounded-lg hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 text-rose-300 font-medium flex items-center gap-1.5 transition-colors text-[11px]"
          title="Sign out of Owner Session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
    </div>
  );
};
