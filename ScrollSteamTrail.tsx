import React, { useEffect, useState, useRef, useCallback } from 'react';

interface SteamParticle {
  id: string;
  x: number; // percentage across screen (0 - 100)
  y: number; // px from top of viewport
  size: number; // px width/height
  driftX: number; // px horizontal drift
  driftY: number; // px upward rise
  initialRotation: number;
  finalRotation: number;
  scaleStart: number;
  scaleEnd: number;
  opacityPeak: number;
  durationMs: number;
  variant: number; // 0, 1, 2 for varied cloud shapes
}

/**
 * ScrollSteamTrail
 * Subtle cinematic atmospheric smoke/steam trail that softly puffs and drifts upward
 * whenever website content sections/cards scroll upward and exit the top viewport.
 * 
 * - Lightweight & GPU-accelerated
 * - 100% pointer-events-none (never intercepts clicks or scroll)
 * - Auto-throttled and reduced on mobile devices
 * - Respects prefers-reduced-motion
 */
export const ScrollSteamTrail: React.FC = () => {
  const [particles, setParticles] = useState<SteamParticle[]>([]);
  const lastScrollY = useRef(0);
  const lastSpawnTime = useRef(0);
  const exitingElementsSet = useRef<WeakSet<Element>>(new WeakSet());
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.innerWidth < 768;
    const handleResize = () => {
      isMobile.current = window.innerWidth < 768;
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const spawnSmokeAt = useCallback((xPercent: number, yPx: number = 60) => {
    const now = performance.now();
    const minCooldown = isMobile.current ? 280 : 160;

    if (now - lastSpawnTime.current < minCooldown) {
      return;
    }
    lastSpawnTime.current = now;

    // Determine count: 1 on mobile, 1-2 on desktop
    const count = isMobile.current ? 1 : (Math.random() > 0.4 ? 2 : 1);
    const newParticles: SteamParticle[] = [];

    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * (isMobile.current ? 6 : 10);
      const clampedX = Math.max(5, Math.min(95, xPercent + offsetX));
      const durationMs = 1800 + Math.random() * 800; // 1.8s - 2.6s

      const particle: SteamParticle = {
        id: `steam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        x: clampedX,
        y: yPx + (Math.random() * 15 - 5),
        size: isMobile.current ? (45 + Math.random() * 25) : (65 + Math.random() * 45),
        driftX: (Math.random() - 0.45) * 35,
        driftY: -(50 + Math.random() * 55),
        initialRotation: (Math.random() - 0.5) * 30,
        finalRotation: (Math.random() - 0.5) * 70,
        scaleStart: 0.6 + Math.random() * 0.25,
        scaleEnd: 1.25 + Math.random() * 0.4,
        opacityPeak: isMobile.current ? 0.22 : (0.24 + Math.random() * 0.12),
        durationMs,
        variant: Math.floor(Math.random() * 3),
      };

      newParticles.push(particle);
    }

    setParticles((prev) => {
      // Keep particle array small (maximum 8 particles at once)
      const current = prev.slice(-6);
      return [...current, ...newParticles];
    });
  }, []);

  // Monitor element exit via IntersectionObserver + Scroll Direction check
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      if (observer) {
        observer.disconnect();
      }

      // Root margin top negative offset accounts for navbar height (~60px-70px)
      observer = new IntersectionObserver(
        (entries) => {
          const currentScrollY = window.scrollY;
          const isScrollingDown = currentScrollY > lastScrollY.current;

          entries.forEach((entry) => {
            const rect = entry.boundingClientRect;
            const target = entry.target;

            // Trigger when element exits past top of viewport while scrolling down
            if (
              !entry.isIntersecting &&
              rect.top < 85 &&
              rect.bottom < window.innerHeight &&
              isScrollingDown
            ) {
              if (!exitingElementsSet.current.has(target)) {
                exitingElementsSet.current.add(target);

                const elementCenterX = rect.left + rect.width / 2;
                const xPercent = (elementCenterX / window.innerWidth) * 100;
                
                // Spawn smoke at the top edge location where content just disappeared
                spawnSmokeAt(xPercent, Math.max(50, Math.min(80, rect.bottom)));
              }
            } else if (entry.isIntersecting) {
              // Reset when element re-enters viewport
              exitingElementsSet.current.delete(target);
            }
          });

          lastScrollY.current = currentScrollY;
        },
        {
          root: null,
          rootMargin: '-60px 0px 0px 0px',
          threshold: [0, 0.05],
        }
      );

      // Select meaningful content blocks: sections, articles, cards, headers, grid items
      const elementsToWatch = document.querySelectorAll(
        'main section, main article, main .card-luxury, main h2, main [data-steam-trigger]'
      );

      elementsToWatch.forEach((el) => observer?.observe(el));
    };

    setupObserver();

    // Re-observe when DOM dynamically updates (e.g. route changes, tabs)
    const mutationObserver = new MutationObserver(() => {
      setupObserver();
    });

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mutationObserver.observe(mainElement, { childList: true, subtree: true });
    }

    // Passive scroll listener to update lastScrollY reference continuously
    const handleScroll = () => {
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [spawnSmokeAt]);

  // Clean up completed particles
  const removeParticle = (id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  if (particles.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-35 overflow-hidden select-none"
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <SteamWisp
          key={particle.id}
          particle={particle}
          onComplete={() => removeParticle(particle.id)}
        />
      ))}
    </div>
  );
};

interface SteamWispProps {
  particle: SteamParticle;
  onComplete: () => void;
}

const SteamWisp: React.FC<SteamWispProps> = ({ particle, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, particle.durationMs);

    return () => clearTimeout(timer);
  }, [particle.durationMs, onComplete]);

  // Cloud gradient variations for natural wispy smoke
  const getGradient = (variant: number) => {
    switch (variant) {
      case 0:
        return 'radial-gradient(ellipse at 50% 50%, rgba(245, 235, 220, 0.35) 0%, rgba(212, 175, 55, 0.18) 35%, rgba(200, 185, 160, 0.08) 60%, rgba(0,0,0,0) 80%)';
      case 1:
        return 'radial-gradient(circle at 45% 45%, rgba(255, 248, 235, 0.38) 0%, rgba(225, 195, 140, 0.16) 40%, rgba(180, 160, 140, 0.06) 65%, rgba(0,0,0,0) 85%)';
      case 2:
      default:
        return 'radial-gradient(ellipse at 55% 50%, rgba(240, 230, 215, 0.32) 0%, rgba(210, 165, 80, 0.15) 30%, rgba(190, 175, 150, 0.07) 55%, rgba(0,0,0,0) 75%)';
    }
  };

  return (
    <div
      className="absolute steam-scroll-trail-wisp will-change-transform pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}px`,
        width: `${particle.size}px`,
        height: `${particle.size * 0.85}px`,
        marginLeft: `-${particle.size / 2}px`,
        marginTop: `-${particle.size / 2}px`,
        background: getGradient(particle.variant),
        filter: 'blur(8px)',
        borderRadius: '50% 60% 70% 50%',
        animationDuration: `${particle.durationMs}ms`,
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        // CSS Custom Properties for keyframe animation
        ['--drift-x' as any]: `${particle.driftX}px`,
        ['--drift-y' as any]: `${particle.driftY}px`,
        ['--rot-start' as any]: `${particle.initialRotation}deg`,
        ['--rot-end' as any]: `${particle.finalRotation}deg`,
        ['--scale-start' as any]: `${particle.scaleStart}`,
        ['--scale-end' as any]: `${particle.scaleEnd}`,
        ['--opacity-peak' as any]: `${particle.opacityPeak}`,
      }}
    />
  );
};
