import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ThemeToggleProps {
  className?: string;
  variant?: 'navbar' | 'compact' | 'drawer';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '',
  variant = 'navbar' 
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  if (variant === 'drawer') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between transition-all duration-300 cursor-pointer ${
          isDark
            ? 'bg-[#181412] border-[#2a241f] text-[#f5efe6] hover:border-[#d4af37]/60'
            : 'bg-[#F4EFE6] border-[#DFD5C6] text-[#1C1917] hover:border-[#B45309]/60'
        } ${className}`}
        aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            isDark ? 'bg-[#291b11] text-[#d4af37]' : 'bg-[#EAE2D5] text-[#B45309]'
          }`}>
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold uppercase tracking-wider">
              {isDark ? 'Dark Atmosphere' : 'Light Atmosphere'}
            </div>
            <div className={`text-[10px] ${isDark ? 'text-[#a89d8f]' : 'text-[#78716C]'}`}>
              {isDark ? 'Switch to Sunlit Light Theme' : 'Switch to Cinematic Dark Theme'}
            </div>
          </div>
        </div>

        <div className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-widest ${
          isDark
            ? 'bg-[#2a241f] text-[#d4af37] border border-[#d4af37]/30'
            : 'bg-[#EAE2D5] text-[#B45309] border border-[#B45309]/30'
        }`}>
          {isDark ? '🌙 DARK' : '☀️ LIGHT'}
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative group p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] ${
        isDark
          ? 'bg-[#181412]/90 border-[#2a241f] text-[#c5bcad] hover:text-[#fdfbf7] hover:border-[#d4af37]/60 hover:bg-[#251f1a]'
          : 'bg-[#F4EFE6] border-[#DFD5C6] text-[#57534E] hover:text-[#1C1917] hover:border-[#B45309]/60 hover:bg-[#EAE2D5]'
      } ${className}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      id="theme-toggle-button"
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center text-[#d4af37]"
            >
              <Moon className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center text-[#B45309]"
            >
              <Sun className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
