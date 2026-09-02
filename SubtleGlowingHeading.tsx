import React, { useMemo } from 'react';

interface SubtleGlowingHeadingProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  enableLetterMovement?: boolean;
  enableGlow?: boolean;
  id?: string;
}

export const SubtleGlowingHeading: React.FC<SubtleGlowingHeadingProps> = ({
  text,
  className = '',
  as: Component = 'h2',
  enableLetterMovement = true,
  enableGlow = true,
  id
}) => {
  // Split words to prevent arbitrary hyphenation on line wrap
  const words = useMemo(() => {
    return text.split(' ');
  }, [text]);

  let globalCharIndex = 0;

  return (
    <Component
      id={id}
      aria-label={text}
      className={`font-serif tracking-tight select-text ${enableGlow ? 'subtle-heading-glow' : ''} ${className}`}
    >
      {words.map((word, wordIndex) => {
        const letters = Array.from(word);
        return (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {letters.map((char, charIdx) => {
              const delayIndex = globalCharIndex++;
              // Compute staggered subtle delay (0s to 3.2s)
              const animationDelay = `${((delayIndex * 0.14) % 3.5).toFixed(2)}s`;

              if (!enableLetterMovement) {
                return <span key={charIdx}>{char}</span>;
              }

              return (
                <span
                  key={charIdx}
                  className="subtle-letter-float"
                  style={{ animationDelay }}
                >
                  {char}
                </span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        );
      })}
    </Component>
  );
};
