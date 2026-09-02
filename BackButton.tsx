import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  ariaLabel?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = 'Back',
  className = '',
  ariaLabel = 'Go back to previous page',
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      initial="initial"
      className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18130f]/80 hover:bg-[#261c14] border border-[#2e2319] hover:border-[#d4af37]/60 text-[#c5bcad] hover:text-[#fdfbf7] text-xs font-semibold tracking-wider transition-colors duration-200 backdrop-blur-sm cursor-pointer shadow-sm ${className}`}
    >
      <motion.span
        variants={{
          initial: { x: 0 },
          hover: { x: -3.5 },
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        className="text-[#d4af37] flex items-center justify-center shrink-0"
      >
        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.4]" />
      </motion.span>
      <span className="font-medium text-[11px] sm:text-xs tracking-wide select-none">{label}</span>
    </motion.button>
  );
};
