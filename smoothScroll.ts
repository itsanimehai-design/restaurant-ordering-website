/**
 * Resilient, Non-Blocking Smooth Scrolling Utility
 * - Uses native browser smooth scrolling on the compositor thread
 * - Will NEVER freeze, trap, or block user wheel, trackpad, keyboard, or touch scrolling
 * - Accurately compensates for fixed/sticky header heights (85px)
 * - Safe for desktop, tablet, and mobile
 */

export const smoothScrollTo = (
  target: HTMLElement | string | number,
  offset = 85,
  _duration?: number
): void => {
  if (typeof window === 'undefined') return;

  try {
    if (typeof target === 'number') {
      window.scrollTo({
        top: Math.max(0, target),
        behavior: 'smooth',
      });
      return;
    }

    let element: HTMLElement | null = null;

    if (typeof target === 'string') {
      const cleanSelector = target.trim();
      const selector = cleanSelector.startsWith('#')
        ? cleanSelector
        : `#${cleanSelector}`;
      element = document.querySelector<HTMLElement>(selector);
    } else if (target instanceof HTMLElement) {
      element = target;
    }

    if (element) {
      const elementRect = element.getBoundingClientRect();
      const targetPosition = Math.max(
        0,
        elementRect.top + window.pageYOffset - offset
      );

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  } catch {
    // Fallback if smooth scrolling fails
    if (typeof target === 'number') {
      window.scrollTo(0, target);
    }
  }
};

export const scrollToTop = (_duration?: number): void => {
  smoothScrollTo(0);
};

export const scrollToSection = (sectionId: string, offset = 85): void => {
  smoothScrollTo(sectionId, offset);
};
