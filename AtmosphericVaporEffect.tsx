import React from 'react';

export type AtmosphericEffectType = 'steam' | 'mist' | 'none';

interface AtmosphericVaporEffectProps {
  type?: AtmosphericEffectType;
  item?: {
    name?: string;
    category?: string;
    temperature?: string;
    description?: string;
    tags?: string[];
  };
  intensity?: 'subtle' | 'normal' | 'rich';
  className?: string;
}

/**
 * Determines whether an item should have realistic warm steam, cool mist, or none.
 * Hot foods receive warm rising steam.
 * Cold drinks, ice creams, and chilled desserts receive refreshing cool mist.
 * Mutually exclusive: never both.
 */
export function getAtmosphericEffectType(item?: {
  name?: string;
  category?: string;
  temperature?: string;
  description?: string;
  tags?: string[];
}): AtmosphericEffectType {
  if (!item) return 'none';

  const name = (item.name || '').toLowerCase();
  const cat = (item.category || '').toLowerCase();
  const temp = (item.temperature || '').toLowerCase();
  const desc = (item.description || '').toLowerCase();
  const tagsStr = (item.tags || []).join(' ').toLowerCase();
  const text = `${name} ${cat} ${temp} ${desc} ${tagsStr}`;

  // 1. Explicit Cold Indicators -> Mist
  const isColdCategory = [
    'soft-drinks',
    'signature-drinks',
    'milkshakes',
    'ice-creams',
    'falooda-kulfi',
    'cold-refreshers',
  ].includes(cat);

  const isColdTemp = [
    'ice cold',
    'chilled',
    'frost cold',
    'cold',
    'sub-zero',
  ].some((t) => temp.includes(t));

  const hasColdKeywords = [
    'ice cream',
    'gelato',
    'kulfi',
    'falooda',
    'milkshake',
    'shake',
    'smoothie',
    'lassi',
    'cola',
    'pepsi',
    'coke',
    'sprite',
    '7up',
    'mirinda',
    'pakola',
    'mountain dew',
    'gourmet cola',
    'next cola',
    'soda',
    'lemonade',
    'margarita',
    'cold coffee',
    'iced coffee',
    'cold chocolate',
    'iced latte',
    'iced',
    'slush',
    'mojito',
    'chilled',
    'cooler',
    'frappe',
    'frost',
    'frozen',
    'sorbet',
    'mousse',
    'cheesecake',
    'water',
  ].some((kw) => text.includes(kw));

  // Check if warm dessert override (e.g. Sizzling Brownie, Warm Gulab Jamun, Lava Cake)
  const isExplicitWarmDessert =
    temp.includes('warm') ||
    temp.includes('sizzling') ||
    text.includes('sizzling') ||
    text.includes('warm brownie') ||
    text.includes('lava cake') ||
    text.includes('gulab jamun') ||
    text.includes('halwa');

  if ((isColdCategory || isColdTemp || hasColdKeywords) && !isExplicitWarmDessert) {
    return 'mist';
  }

  // 2. Explicit Hot Indicators -> Steam
  const isHotCategory = [
    'grills',
    'main-courses',
    'burgers',
    'pasta',
    'starters',
    'soups-salads',
    'specials',
    'sundaes-warm',
  ].includes(cat);

  const isHotTemp = [
    'warm',
    'sizzling',
    'hot',
    'freshly brewed',
    'steaming',
  ].some((t) => temp.includes(t));

  const hasHotKeywords = [
    'karahi',
    'biryani',
    'bbq',
    'tikka',
    'boti',
    'kebab',
    'kabab',
    'grill',
    'naan',
    'roti',
    'handi',
    'nihari',
    'haleem',
    'sizzler',
    'skillet',
    'steak',
    'soup',
    'shorba',
    'broast',
    'burger',
    'pasta',
    'curry',
    'platter',
    'chops',
    'mutton',
    'beef',
    'chicken',
    'seekh',
    'samosa',
    'wings',
    'tandoori',
    'shinwari',
    'pulao',
    'hearth',
    'charcoal',
    'roast',
    'chai',
    'karak',
    'doodh patti',
    'kashmiri chai',
    'lava cake',
    'sizzling brownie',
  ].some((kw) => text.includes(kw));

  if (isHotCategory || isHotTemp || hasHotKeywords || isExplicitWarmDessert) {
    return 'steam';
  }

  return 'none';
}

export const AtmosphericVaporEffect: React.FC<AtmosphericVaporEffectProps> = ({
  type,
  item,
  intensity = 'normal',
  className = '',
}) => {
  const resolvedType = type && type !== 'none' ? type : getAtmosphericEffectType(item);

  if (resolvedType === 'none') {
    return null;
  }

  const opacityClass =
    intensity === 'subtle'
      ? 'opacity-65'
      : intensity === 'rich'
      ? 'opacity-100'
      : 'opacity-85';

  return (
    <div
      className={`vapor-container ${opacityClass} ${className}`}
      aria-hidden="true"
    >
      {resolvedType === 'steam' ? (
        /* Realistic Warm Rising Steam Plumes */
        <>
          <div className="steam-plume steam-plume-1" />
          <div className="steam-plume steam-plume-2" />
          <div className="steam-plume steam-plume-3" />
          {/* Subtle Warm Hearth Tint at Base */}
          <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-amber-500/10 via-amber-500/5 to-transparent blur-sm pointer-events-none" />
        </>
      ) : (
        /* Refreshing Chilled Cool Mist / Vapor Clouds */
        <>
          <div className="mist-cloud mist-cloud-1" />
          <div className="mist-cloud mist-cloud-2" />
          <div className="mist-cloud mist-cloud-3" />
          {/* Subtle Cool Frosted Glow at Base */}
          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-cyan-400/10 via-sky-300/5 to-transparent blur-md pointer-events-none" />
        </>
      )}
    </div>
  );
};
