import React from 'react';

export type ScrollEntryDirection = 'left' | 'right';

export interface ScrollSideEntryProps {
  children: React.ReactNode;
  direction?: ScrollEntryDirection;
  index?: number;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  id?: string;
  viewportMargin?: string;
  amount?: number;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * ScrollSideEntry (Neutralized / Static Display)
 * 
 * Completely disables all scroll-triggered left/right/horizontal sliding animations.
 * Content displays statically in place with zero horizontal movement or delay.
 */
export const ScrollSideEntry: React.FC<ScrollSideEntryProps> = ({
  children,
  className = '',
  id,
  style,
  onClick
}) => {
  return (
    <div
      id={id}
      className={className}
      style={{
        transform: 'none',
        opacity: 1,
        animation: 'none',
        transition: 'none',
        ...style
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export interface ScrollSideAlternateProps {
  children: React.ReactNode[];
  baseDelay?: number;
  staggerInterval?: number;
  className?: string;
  startDirection?: ScrollEntryDirection;
}

/**
 * ScrollSideAlternate (Neutralized / Static Display)
 * Renders child elements in place statically without any alternating slide effects.
 */
export const ScrollSideAlternate: React.FC<ScrollSideAlternateProps> = ({
  children,
  className = ''
}) => {
  return <div className={className}>{children}</div>;
};

export default ScrollSideEntry;
