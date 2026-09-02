import React, { useState } from 'react';
import { PageId, ChefMember, SpecialRecipeItem } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { 
  Award, 
  Flame, 
  UtensilsCrossed, 
  ArrowRight
} from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { ScrollSideEntry } from '../components/ScrollSideEntry';
import { scrollToTop } from '../utils/smoothScroll';

interface ChefsPageProps {
  onNavigate: (page: PageId) => void;
  onBack?: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const ChefsPage: React.FC<ChefsPageProps> = ({ onNavigate, onBack, onShowToast }) => {
  const { chefs, specialRecipes, formatPrice } = useRestaurantData();
  const [selectedRecipe, setSelectedRecipe] = useState<SpecialRecipeItem | null>(null);

  const publishedChefs = chefs.filter(c => c.isPublished !== false);
  const publishedRecipes = specialRecipes.filter(r => r.isPublished !== false);

  return (
    <div className="pt-24 pb-20 bg-[#0d0b0a] text-[#f5efe6] min-h-screen overflow-x-hidden">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#241e19] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#181310]/80 via-[#0d0b0a]/90 to-[#0d0b0a] pointer-events-none" />
        <div className="absolute -top-32 right-1/3 w-96 h-96 bg-[#c59b27]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top-Left Back Navigation */}
        <div className="relative max-w-5xl mx-auto mb-8">
          <BackButton onClick={onBack || (() => onNavigate('home'))} />
        </div>

        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="relative max-w-5xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1713] border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              Masters of Fire, Spice &amp; Heritage
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-[#fdfbf7] tracking-tight">
              Our <span className="text-gradient-gold">Culinary Brigade</span>
            </h1>

            <p className="text-base sm:text-lg text-[#c5bcad] max-w-3xl mx-auto font-light leading-relaxed">
              Meet the culinary artisans who honor Pakistan’s timeless gastronomic heritage with primal live charcoal cooking, slow stone-ground spices, and theatrical fine-dining craftsmanship.
            </p>
          </div>
        </ScrollSideEntry>
      </section>

      {/* Chefs Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {publishedChefs.map((chef, index) => {
            const isEven = index % 2 === 1;
            const entryDirection = isEven ? 'right' : 'left';
            return (
              <ScrollSideEntry
                key={chef.id}
                direction={entryDirection}
                delay={0.1}
              >
                <div
                  className={`flex flex-col ${
                    isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  } gap-8 lg:gap-12 items-center bg-[#15110e] border border-[#26201a] rounded-3xl p-6 sm:p-10 shadow-2xl`}
                >
                  {/* Chef Photo */}
                  <div className="w-full lg:w-5/12 relative group shrink-0">
                    <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#2a241f]">
                      <img
                        src={chef.image}
                        alt={chef.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b0a] via-transparent to-transparent opacity-80" />

                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-md bg-[#0d0b0a]/90 backdrop-blur-md border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold font-mono">
                          {chef.experienceYears}+ Years Mastership
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chef Bio & Accolades */}
                  <div className="w-full lg:w-7/12 space-y-5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] block mb-1">
                        {chef.role}
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#fdfbf7]">
                        {chef.name}
                      </h2>
                      <p className="text-xs text-[#c59b27] font-mono mt-1">
                        Specialty: {chef.specialty}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-[#c5bcad] leading-relaxed font-light">
                      {chef.bio}
                    </p>

                    {chef.signatureDish && (
                      <div className="p-4 rounded-xl bg-[#1c1713] border border-[#2a241f] space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-[#8c8273] font-bold block">
                          Signature Creation
                        </span>
                        <p className="text-xs font-bold text-[#fdfbf7] flex items-center gap-2">
                          <Flame className="w-3.5 h-3.5 text-[#d4af37]" />
                          {chef.signatureDish}
                        </p>
                      </div>
                    )}

                    {chef.accolades && chef.accolades.length > 0 && (
                      <div>
                        <span className="text-[11px] uppercase tracking-widest text-[#8c8273] font-bold block mb-2">
                          Accolades &amp; Honors
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#c5bcad]">
                          {chef.accolades.map((acc, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Award className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                              <span>{acc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollSideEntry>
            );
          })}
        </div>
      </section>

      {/* Secret Heritage Recipes Section */}
      <section className="py-16 bg-[#110d0b] border-y border-[#241e19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollSideEntry direction="left" delay={0.1}>
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                The Kitchen Vault
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#fdfbf7]">
                Heritage Culinary Formulations
              </h2>
              <p className="text-xs sm:text-sm text-[#a69c8d]">
                Explore the time-honored preparations, wood-smoke secrets, and hand-ground spice ratios that define our signature offerings.
              </p>
            </div>
          </ScrollSideEntry>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedRecipes.map((recipe, rIdx) => {
              const rDirection = rIdx % 2 === 0 ? 'left' : 'right';
              return (
                <ScrollSideEntry
                  key={recipe.id}
                  direction={rDirection}
                  delay={(rIdx % 2) * 0.12}
                  className="h-full"
                >
                  <div
                    className="bg-[#15110e] border border-[#26201a] hover:border-[#d4af37]/50 rounded-2xl p-6 sm:p-8 space-y-6 transition-all duration-300 shadow-xl h-full flex flex-col justify-between"
                  >
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-24 h-24 rounded-xl object-cover border border-[#2a241f] shrink-0"
                          loading="lazy"
                        />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#c59b27] tracking-widest">
                            {recipe.category}
                          </span>
                          <h3 className="text-lg sm:text-xl font-display font-bold text-[#fdfbf7] mt-0.5">
                            {recipe.title}
                          </h3>
                          <p className="text-xs text-[#8c8273] mt-1 font-mono">
                            Prep: {recipe.prepTime}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-[#c5bcad] leading-relaxed font-light">
                        {recipe.description}
                      </p>

                      {recipe.ingredients && (
                        <div className="space-y-2">
                          <span className="text-[11px] uppercase tracking-wider font-bold text-[#d4af37] block">
                            Core Ingredients:
                          </span>
                          <ul className="grid grid-cols-1 gap-1.5 text-xs text-[#a69c8d]">
                            {recipe.ingredients.map((ing, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                                <span>{ing}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {recipe.chefNotes && (
                        <div className="p-3.5 rounded-xl bg-[#1a1410] border border-[#2a241f] text-xs text-[#c5bcad] italic">
                          <strong className="text-[#d4af37] not-italic">Chef’s Note:</strong> “{recipe.chefNotes}”
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-[#201a15]">
                      <span className="text-xs font-mono font-bold text-[#fdfbf7]">
                        Dine-in: {formatPrice(recipe.price)}
                      </span>
                      <button
                        onClick={() => {
                          onNavigate('menu');
                          scrollToTop();
                        }}
                        className="text-xs font-bold text-[#d4af37] hover:text-[#fdfbf7] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        View in Menu <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </ScrollSideEntry>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
