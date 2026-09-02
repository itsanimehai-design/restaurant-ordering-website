import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface SlideItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  category?: string;
  badge?: string;
}

export interface ResponsiveImageSliderProps {
  slides?: SlideItem[];
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showThumbnails?: boolean;
  className?: string;
  aspectRatio?: 'video' | 'wide' | 'cinematic';
  onImageClick?: (slide: SlideItem, index: number) => void;
}

export const SAMPLE_RESPONSIVE_SLIDES: SlideItem[] = [
  {
    id: 'slide-1',
    title: 'Artisan Wood Hearth Grilling',
    subtitle: 'Signature Technique',
    description: 'Piping hot seekh kebabs and charred lamb chops seared over wild olive wood coals.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85',
    category: 'Live Hearth',
    badge: 'Chef Signature'
  },
  {
    id: 'slide-2',
    title: 'Slow-Simmered Clay Pot Handi',
    subtitle: 'Ancestral Recipe',
    description: 'Rich desi ghee gravy infused with stone-ground cardamom, whole mace, and tender cuts.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1600&q=85',
    category: 'Handi & Karahi',
    badge: 'Guest Favorite'
  },
  {
    id: 'slide-3',
    title: 'Aromatic Dum Biryani with Golden Saffron',
    subtitle: 'Royal Feast',
    description: 'Aged basmati rice layered with spiced mutton, caramelized onions, and fragrant rose water.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1600&q=85',
    category: 'Rice Specialties',
    badge: 'Weekend Special'
  },
  {
    id: 'slide-4',
    title: 'Traditional Tandoori Oven Naan & Roti',
    subtitle: 'Freshly Baked',
    description: 'Blistered rogheni and garlic butter naans baked against glowing clay walls.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=85',
    category: 'Clay Tandoor',
    badge: 'Oven Fresh'
  },
  {
    id: 'slide-5',
    title: 'Chilled Royal Falooda & Kulfi Bar',
    subtitle: 'Artisan Refreshment',
    description: 'Pistachio kulfi layered with vermicelli, basil seeds, rose syrup, and rabri.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=1600&q=85',
    category: 'Dessert Bar',
    badge: 'Cool Treat'
  },
  {
    id: 'slide-6',
    title: 'Heated Starlit Dining Ambience',
    subtitle: 'Intimate Atmosphere',
    description: 'Handcrafted copper chandeliers, warm embers, and private dining salon seating.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
    category: 'Ambiance',
    badge: 'Ilahiabad'
  }
];

// Spring and kinetic easing physics for 120fps card swiping
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0.3,
    scale: 0.96,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 340, damping: 34, mass: 0.75 },
      opacity: { duration: 0.35, ease: 'easeOut' },
      scale: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.96,
    transition: {
      x: { type: 'spring', stiffness: 340, damping: 34, mass: 0.75 },
      opacity: { duration: 0.25, ease: 'easeIn' },
      scale: { duration: 0.3 }
    }
  })
};

const SWIPE_THRESHOLD = 40; // Pixels required to trigger swipe
const VELOCITY_THRESHOLD = 300; // Drag velocity threshold

export const ResponsiveImageSlider: React.FC<ResponsiveImageSliderProps> = ({
  slides = SAMPLE_RESPONSIVE_SLIDES,
  autoPlayInterval = 5000,
  showIndicators = true,
  showThumbnails = true,
  className = '',
  aspectRatio = 'cinematic',
  onImageClick
}) => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const totalSlides = slides.length;
  // Calculate modulo index so page can increment/decrement continuously
  const currentIndex = ((page % totalSlides) + totalSlides) % totalSlides;
  const currentSlide = slides[currentIndex] || slides[0];

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
    },
    []
  );

  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (targetIndex === currentIndex) return;
      const newDirection = targetIndex > currentIndex ? 1 : -1;
      setPage([targetIndex, newDirection]);
    },
    [currentIndex]
  );

  const nextSlide = useCallback(() => {
    paginate(1);
  }, [paginate]);

  const prevSlide = useCallback(() => {
    paginate(-1);
  }, [paginate]);

  // Autoplay management
  useEffect(() => {
    if (!isPlaying || isHovered || isDragging || autoPlayInterval <= 0) return;

    const timer = setInterval(() => {
      paginate(1);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, isDragging, autoPlayInterval, paginate]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  // Aspect ratio styling
  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-[16/9]'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : 'aspect-[16/9] sm:aspect-[21/10] md:aspect-[2.35/1] min-h-[340px] sm:min-h-[460px] md:min-h-[520px]';

  return (
    <div
      className={`relative w-full max-w-7xl mx-auto rounded-3xl overflow-hidden bg-[#120f0d] border border-[#2b2118] shadow-2xl group select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Interactive Swipeable Restaurant Image Slider"
    >
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        {/* Category / Badge Tag */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-[#d4af37]/40 text-[#d4af37] text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            <span>{currentSlide?.badge || 'Signature Feature'}</span>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#1c140e]/80 backdrop-blur-md border border-white/10 text-white/80 text-[10px] font-medium uppercase tracking-wider">
            {currentSlide?.category || 'Anthology'}
          </span>
        </div>

        {/* Play/Pause & Counter Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/10 text-white text-xs font-mono font-semibold tracking-wider">
            <span className="text-[#d4af37]">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="text-white/40 mx-1">/</span>
            <span className="text-white/60">{String(totalSlides).padStart(2, '0')}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            className="w-8 h-8 rounded-full bg-black/65 backdrop-blur-md border border-white/10 hover:border-[#d4af37] text-white hover:text-[#d4af37] flex items-center justify-center transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </motion.button>
        </div>
      </div>

      {/* 
        High-Performance Motion Drag / Swipe Stage
        - Kinetic Spring Physics
        - Touch / Drag Velocity Detection
        - AnimatePresence Directional Transitions
      */}
      <div className={`relative w-full ${aspectClass} overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing`}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(_e, { offset, velocity }) => {
              setIsDragging(false);
              const swipe = offset.x;
              const vel = velocity.x;

              if (swipe < -SWIPE_THRESHOLD || vel < -VELOCITY_THRESHOLD) {
                paginate(1);
              } else if (swipe > SWIPE_THRESHOLD || vel > VELOCITY_THRESHOLD) {
                paginate(-1);
              }
            }}
            onClick={() => {
              if (!isDragging && onImageClick) {
                onImageClick(currentSlide, currentIndex);
              }
            }}
            className="absolute inset-0 w-full h-full"
            style={{
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)',
              WebkitTransform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            {/* Background Image with Contrast Optimization */}
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover pointer-events-none"
              style={{
                transform: 'translate3d(0, 0, 0)',
                WebkitTransform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                imageRendering: '-webkit-optimize-contrast'
              }}
              loading="eager"
              draggable={false}
            />

            {/* Cinematic Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b0a] via-[#0d0b0a]/40 to-transparent opacity-90 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0b0a]/75 via-transparent to-[#0d0b0a]/75 pointer-events-none" />

            {/* Content Overlay with Staggered Entrance */}
            <div className="slider-text-overlay absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-14 z-20 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="max-w-3xl space-y-2.5"
              >
                {currentSlide.subtitle && (
                  <span className="inline-block text-[#d4af37] text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]">
                    {currentSlide.subtitle}
                  </span>
                )}
                <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-[#fdfbf7] leading-tight drop-shadow-md">
                  {currentSlide.title}
                </h3>
                {currentSlide.description && (
                  <p className="text-xs sm:text-sm md:text-base text-[#c5bcad] leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-3">
                    {currentSlide.description}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Lightbox / Zoom Action */}
            {onImageClick && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick(currentSlide, currentIndex);
                }}
                className="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:border-[#d4af37] text-white hover:text-[#d4af37] flex items-center justify-center transition-colors cursor-pointer opacity-0 group-hover:opacity-100 shadow-xl pointer-events-auto"
                aria-label="View high-resolution photo"
              >
                <Maximize2 className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Smooth Navigation Arrow: LEFT */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={prevSlide}
        aria-label="Previous slide"
        className="slider-nav-btn absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#14110f]/85 backdrop-blur-md border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0d0b0a] flex items-center justify-center shadow-2xl cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>

      {/* Smooth Navigation Arrow: RIGHT */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={nextSlide}
        aria-label="Next slide"
        className="slider-nav-btn absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#14110f]/85 backdrop-blur-md border border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0d0b0a] flex items-center justify-center shadow-2xl cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>

      {/* Slide Indicators / Dots */}
      {showIndicators && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
          {slides.map((_, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? 'w-7 bg-[#d4af37] shadow-[0_0_10px_#d4af37]'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            );
          })}
        </div>
      )}

      {/* Subtle Progress Bar */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 z-30 overflow-hidden">
          <motion.div
            key={currentIndex}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-[#d4af37] to-amber-500"
          />
        </div>
      )}

      {/* Miniature Thumbnail Strip */}
      {showThumbnails && (
        <div className="hidden md:flex items-center gap-2 p-3 bg-[#0d0b0a] border-t border-[#261d15] overflow-x-auto">
          {slides.map((slide, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={slide.id ? `${slide.id}-${idx}` : idx}
                onClick={() => goToSlide(idx)}
                className={`relative flex-1 h-14 rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? 'border-[#d4af37] ring-1 ring-[#d4af37] opacity-100 scale-102'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  style={{
                    transform: 'translate3d(0, 0, 0)',
                    WebkitTransform: 'translate3d(0, 0, 0)'
                  }}
                />
                <div className="absolute inset-0 bg-black/30" />
                <span className="absolute bottom-1 left-2 text-[10px] font-semibold text-white truncate max-w-[90%]">
                  {slide.title}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
