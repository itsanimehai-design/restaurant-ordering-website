import React, { useState, useMemo } from 'react';
import { PageId, GalleryItem } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { BackButton } from '../components/BackButton';
import { Flame, Sparkles, Eye, Maximize2, Sliders, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollSideEntry } from '../components/ScrollSideEntry';
import { ResponsiveImageSlider, SlideItem } from '../components/ResponsiveImageSlider';

interface GalleryPageProps {
  onNavigate: (page: PageId) => void;
  onBack?: () => void;
  onOpenLightbox: (items: GalleryItem[], index: number) => void;
}

type GalleryCategory = 'all' | 'dishes' | 'interior' | 'chef' | 'experience' | 'events';
type ViewMode = 'slider' | 'grid' | 'both';

const GALLERY_CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'All Photography' },
  { id: 'dishes', label: 'Signature Dishes' },
  { id: 'interior', label: 'Restaurant Interior' },
  { id: 'chef', label: 'Chef & Hearth' },
  { id: 'experience', label: 'Dining Rituals' },
  { id: 'events', label: 'Private Events' },
];

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onNavigate,
  onBack,
  onOpenLightbox,
}) => {
  const { galleryItems, config } = useRestaurantData();
  const [selectedCat, setSelectedCat] = useState<GalleryCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('both');

  const filteredItems = useMemo(() => {
    if (selectedCat === 'all') return galleryItems;
    return galleryItems.filter((item) => item.category === selectedCat);
  }, [galleryItems, selectedCat]);

  // Convert gallery items to slide items
  const sliderSlides: SlideItem[] = useMemo(() => {
    return filteredItems.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.category.toUpperCase(),
      description: item.caption,
      image: item.image,
      category: item.category,
      badge: 'Editorial Collection'
    }));
  }, [filteredItems]);

  const handleSlideImageClick = (_slide: SlideItem, index: number) => {
    onOpenLightbox(filteredItems, index);
  };

  return (
    <div className="w-full pt-28 pb-24 bg-[#0d0b0a] min-h-screen text-[#f5efe6] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top-Left Back Navigation */}
        <div className="mb-6">
          <BackButton onClick={onBack || (() => onNavigate('home'))} />
        </div>

        {/* Header */}
        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181412] border border-[#d4af37]/40 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visual Anthology</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#fdfbf7]">
              Moments at {config.name}
            </h1>
            <p className="text-sm sm:text-base text-[#c5bcad] leading-relaxed">
              Explore the visceral beauty of our open wood hearth, signature plating, artisan beverage bar, and celebratory gatherings with smooth hardware-accelerated presentation.
            </p>
          </div>
        </ScrollSideEntry>

        {/* View Mode & Category Controls */}
        <ScrollSideEntry direction="right" delay={0.15}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 border-y border-[#26201a] py-4">
            {/* View Mode Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-[#14110f] border border-[#2b2118]">
              <button
                onClick={() => setViewMode('both')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === 'both'
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'text-[#a89d8f] hover:text-white'
                }`}
              >
                Featured &amp; Grid
              </button>
              <button
                onClick={() => setViewMode('slider')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'text-[#a89d8f] hover:text-white'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>Slider Only</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'text-[#a89d8f] hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Grid Only</span>
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {GALLERY_CATEGORIES.map((cat) => {
                const isSelected = selectedCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#d4af37] text-[#0d0b0a] border-[#d4af37] shadow-md font-bold'
                        : 'bg-[#14110f] border-[#26201a] text-[#a89d8f] hover:text-[#fdfbf7] hover:border-[#3a3028]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollSideEntry>

        {/* 1. CINEMATIC HARDWARE-ACCELERATED SLIDER */}
        {(viewMode === 'slider' || viewMode === 'both') && (
          <div className="mb-14">
            <ResponsiveImageSlider
              slides={sliderSlides.length > 0 ? sliderSlides : undefined}
              autoPlayInterval={5500}
              aspectRatio="cinematic"
              onImageClick={handleSlideImageClick}
              showThumbnails={true}
              showIndicators={true}
            />
          </div>
        )}

        {/* 2. GALLERY GRID */}
        {(viewMode === 'grid' || viewMode === 'both') && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredItems.map((item, index) => {
                const direction = index % 2 === 0 ? 'left' : 'right';
                return (
                  <ScrollSideEntry
                    key={item.id}
                    direction={direction}
                    delay={(index % 3) * 0.08}
                    className={item.aspectRatio === 'tall' ? 'sm:row-span-2' : ''}
                  >
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => onOpenLightbox(filteredItems, index)}
                      className={`relative rounded-2xl overflow-hidden border border-[#26201a] group cursor-pointer bg-[#14110f] shadow-xl hover:border-[#d4af37]/40 transition-all duration-300 ${
                        item.aspectRatio === 'tall' ? 'h-[480px]' : 'h-72'
                      }`}
                    >
                      {/* Image */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        loading="lazy"
                      />

                      {/* Dark Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                      {/* Expand Icon */}
                      <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Maximize2 className="w-4 h-4 text-[#d4af37]" />
                      </div>

                      {/* Caption & Title */}
                      <div className="absolute bottom-5 left-5 right-5 space-y-1">
                        <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[10px] uppercase tracking-wider font-semibold">
                          {item.category}
                        </span>
                        <h3 className="font-serif text-lg font-semibold text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#c5bcad] line-clamp-2 leading-relaxed opacity-90">
                          {item.caption}
                        </p>
                      </div>
                    </motion.div>
                  </ScrollSideEntry>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

