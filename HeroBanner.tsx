import React from 'react';
import { Sparkles, ArrowRight, Flame, ShieldCheck, Clock, MessageSquareQuote } from 'lucide-react';
import { StoreSettings, DealBox } from '../types';

interface HeroBannerProps {
  settings: StoreSettings;
  deals?: DealBox[];
  featuredDeals?: DealBox[];
  onSelectDeal: (deal: DealBox) => void;
  onExploreDeals?: () => void;
  onScrollToDeals?: () => void;
  onOpenOwnerPortal?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  settings,
  deals = [],
  featuredDeals,
  onSelectDeal,
  onExploreDeals,
  onScrollToDeals,
  onOpenOwnerPortal,
}) => {
  const allDeals = Array.isArray(featuredDeals) && featuredDeals.length > 0
    ? featuredDeals
    : (Array.isArray(deals) ? deals : []);

  const topDeal = allDeals.find((d) => d && d.isFeatured && d.isActive) ||
    allDeals.find((d) => d && d.isActive) ||
    (allDeals.length > 0 ? allDeals[0] : null);

  const handleExplore = () => {
    if (onScrollToDeals) {
      onScrollToDeals();
    } else if (onExploreDeals) {
      onExploreDeals();
    } else {
      document.getElementById('deals-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-stone-50 to-stone-100/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>FRESHLY COOKED & UNLIMITED FEAST BOXES</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-stone-950 tracking-tight leading-[1.15] font-serif">
              Crave Big. Save Bigger with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600">
                Unlimited Food Deals
              </span>
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl">
              From loaded <strong className="text-stone-800">Family Feast Boxes</strong> with multiple burgers, nuggets, fries & drinks to fiery <strong className="text-stone-800">Spicy Sizzlers</strong> and creamy <strong className="text-stone-800">Ice Cream Sundaes</strong>. Custom-built and updated dynamically in real-time!
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleExplore}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-amber-600/20 text-sm transition-all transform active:scale-95"
              >
                <span>Explore All Deals & Boxes</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${settings?.whatsappNumber || '923001234567'}?text=Hi!%20I%20would%20like%20to%20order%20from%20PakBite%20Restaurant`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl shadow-md shadow-emerald-600/20 text-sm transition-all"
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>WhatsApp Order</span>
              </a>

              {onOpenOwnerPortal && (
                <button
                  type="button"
                  onClick={onOpenOwnerPortal}
                  className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold px-4 py-3 rounded-xl text-xs sm:text-sm border border-stone-800 transition-all"
                >
                  <span>Owner Portal</span>
                </button>
              )}
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">100% Fresh</p>
                  <p className="text-[11px] text-stone-500">Made to order</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">30-45 Mins</p>
                  <p className="text-[11px] text-stone-500">Fast home delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Best Value</p>
                  <p className="text-[11px] text-stone-500">Big savings in PKR</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Spotlight Deal Card */}
          {topDeal && (
            <div className="lg:col-span-5">
              <div
                onClick={() => onSelectDeal(topDeal)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDeal(topDeal);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View deal ${topDeal.name}`}
                className="group relative bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-stone-200/80 overflow-hidden hover:shadow-2xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
                  {topDeal.discount && (
                    <span className="bg-rose-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md">
                      {topDeal.discount}
                    </span>
                  )}
                  {topDeal.tag && (
                    <span className="bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {topDeal.tag}
                    </span>
                  )}
                </div>

                <div className="relative h-48 sm:h-56 rounded-xl overflow-hidden mb-4 bg-stone-100">
                  <img
                    src={topDeal.image}
                    alt={topDeal.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[11px] font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md text-stone-200">
                      {topDeal.servings || 'Featured Box'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">{topDeal.name}</h3>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">{topDeal.description}</p>
                    </div>
                  </div>

                  {/* Included Items Preview */}
                  {topDeal.includedItems && topDeal.includedItems.length > 0 && (
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/70 text-xs">
                      <p className="font-bold text-stone-700 text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <span>📦 Included in Box ({topDeal.includedItems.length} items):</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {topDeal.includedItems.slice(0, 4).map((item) => (
                          <span
                            key={item.id}
                            className="bg-white border border-stone-200 text-stone-800 text-[11px] font-medium px-2 py-0.5 rounded-md shadow-xs"
                          >
                            <strong>{item.quantity}x</strong> {item.name}
                          </span>
                        ))}
                        {topDeal.includedItems.length > 4 && (
                          <span className="text-[11px] text-stone-500 font-medium px-1 self-center">
                            +{topDeal.includedItems.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif">
                          {settings.currency} {topDeal.price.toLocaleString()}
                        </span>
                        {topDeal.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            {settings.currency} {topDeal.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold">Special Box Price</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDeal(topDeal);
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
                    >
                      <span>Customize & Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
