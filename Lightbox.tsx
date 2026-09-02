import React, { useEffect, useCallback } from 'react';
import { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LightboxProps {
  isOpen: boolean;
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  items,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const currentItem = items[currentIndex];

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(items.length - 1);
    }
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0);
    }
  }, [currentIndex, items.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentItem) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-[#171412]/80 hover:bg-[#26201a] text-[#fdfbf7] border border-white/10 transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#171412]/80 hover:bg-[#26201a] text-[#fdfbf7] border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-[#171412]/80 hover:bg-[#26201a] text-[#fdfbf7] border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Content Container */}
        <div className="max-w-5xl w-full flex flex-col items-center justify-center">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative max-h-[75vh] w-auto overflow-hidden rounded-xl border border-white/10 shadow-2xl"
          >
            <img
              src={currentItem.image}
              alt={currentItem.title}
              className="max-h-[75vh] w-auto object-contain rounded-xl"
            />
          </motion.div>

          {/* Caption & Counter */}
          <div className="mt-6 text-center max-w-xl space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[11px] font-semibold uppercase tracking-wider">
                {currentItem.category}
              </span>
              <span className="text-xs text-[#8c8275]">
                {currentIndex + 1} / {items.length}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#fdfbf7]">
              {currentItem.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#c5bcad] leading-relaxed">
              {currentItem.caption}
            </p>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
