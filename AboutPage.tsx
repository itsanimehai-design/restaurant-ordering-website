import React from 'react';
import { PageId } from '../types';
import { useRestaurantData } from '../context/RestaurantDataContext';
import { STORY_CHAPTERS, TIMELINE_MILESTONES } from '../data/restaurantData';
import { BackButton } from '../components/BackButton';
import { ScrollSideEntry } from '../components/ScrollSideEntry';
import { Flame, Sparkles, HeartHandshake, Leaf } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  onBack?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onBack }) => {
  const { chefs, config, events } = useRestaurantData();

  const coreValues = [
    {
      title: 'Primal Fire Technique',
      desc: 'Mastery over living flame without gas shortcuts. Every char, ember, and smoke layer is calibrated with precision.',
      icon: Flame
    },
    {
      title: 'Regenerative Terroir Sourcing',
      desc: 'Partnering exclusively with single-estate heirloom farmers, day-boat divers, and ethical heritage livestock ranchers.',
      icon: Leaf
    },
    {
      title: 'Warm Gastronomic Hospitality',
      desc: 'Michelin-level elegance delivered with authentic warmth, intimacy, and unpretentious attentiveness.',
      icon: HeartHandshake
    },
    {
      title: 'Botanical Spice Alchemy',
      desc: 'Reviving rare spices gathered along ancient spice routes, hand-ground daily to bring unexpected sensory depth.',
      icon: Sparkles
    }
  ];

  return (
    <div className="w-full pt-28 pb-24 bg-[#0d0b0a] min-h-screen text-[#f5efe6] overflow-x-hidden">
      {/* 1. HERO HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top-Left Back Navigation */}
        <div className="mb-6">
          <BackButton onClick={onBack || (() => onNavigate('home'))} />
        </div>

        <ScrollSideEntry direction="left" delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181412] border border-[#d4af37]/40 text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>Our Heritage &amp; Ethos</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#fdfbf7]">
              The Alchemy of Fire &amp; Spice
            </h1>
            <p className="text-sm sm:text-base text-[#c5bcad] leading-relaxed">
              Born from a reverence for ancestral live-fire hearth cooking, {config.name} brings primal gastronomy into the realm of modern culinary luxury.
            </p>
          </div>
        </ScrollSideEntry>

        {/* Large Cinematic Banner */}
        <ScrollSideEntry direction="right" delay={0.15}>
          <div className="relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden border border-[#2e2620] shadow-2xl mb-24">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85"
              alt="The Open Hearth Kitchen"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b0a] via-black/30 to-black/20" />
            <div className="absolute bottom-8 left-8 right-8 max-w-xl">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                📍 {config.contact.city} Flagship Hearth
              </span>
              <p className="font-serif text-2xl sm:text-3xl text-[#fdfbf7]">
                "We cook with flame because it cannot be replicated by machinery. It carries a soul."
              </p>
            </div>
          </div>
        </ScrollSideEntry>

        {/* 2. STORY CHAPTERS */}
        <div className="space-y-24 mb-24">
          {STORY_CHAPTERS.map((chapter, idx) => {
            const isOdd = idx % 2 === 1;
            const textDirection = isOdd ? 'right' : 'left';
            const imgDirection = isOdd ? 'left' : 'right';

            return (
              <div
                key={idx}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                  isOdd ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <ScrollSideEntry
                  direction={textDirection}
                  delay={0.1}
                  className={`lg:col-span-6 space-y-4 ${isOdd ? 'lg:order-2' : ''}`}
                >
                  <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold block">
                    Chapter 0{idx + 1} • {chapter.subtitle}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7]">
                    {chapter.title}
                  </h2>
                  <p className="text-sm sm:text-base text-[#c5bcad] leading-relaxed">
                    {chapter.content}
                  </p>
                </ScrollSideEntry>

                <ScrollSideEntry
                  direction={imgDirection}
                  delay={0.15}
                  className={`lg:col-span-6 ${isOdd ? 'lg:order-1' : ''}`}
                >
                  <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#2e2620] shadow-xl group">
                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </ScrollSideEntry>
              </div>
            );
          })}
        </div>

        {/* 3. MEET THE MASTERS (DYNAMIC CHEFS & TEAM) */}
        <div className="py-16 border-t border-[#1f1a16] mb-24">
          <ScrollSideEntry direction="left" delay={0.1}>
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold block">
                The Curators
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#fdfbf7]">
                Meet The Culinary Directorate
              </h2>
              <p className="text-sm text-[#9d9385]">
                Decades of master experience harmonized under one roof.
              </p>
            </div>
          </ScrollSideEntry>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chefs.map((chef, idx) => {
              const direction = idx % 2 === 0 ? 'left' : 'right';
              return (
                <ScrollSideEntry
                  key={chef.id}
                  direction={direction}
                  delay={(idx % 3) * 0.12}
                  className="h-full"
                >
                  <div className="p-6 rounded-2xl bg-[#14110f] border border-[#26201a] flex flex-col justify-between space-y-4 hover:border-[#d4af37]/30 transition-all h-full">
                    <div className="h-64 rounded-xl overflow-hidden relative">
                      <img
                        src={chef.image}
                        alt={chef.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-serif text-xl font-bold text-[#fdfbf7]">Chef {chef.name}</h3>
                        <span className="text-xs text-[#d4af37] font-semibold">{chef.role}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs text-[#c5bcad] leading-relaxed line-clamp-4">
                        {chef.bio}
                      </p>
                      {chef.specialty && (
                        <div className="p-2.5 rounded-lg bg-[#1a1613] border border-[#2e2620] text-xs text-[#d6cebf] italic">
                          Specialty: {chef.specialty}
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollSideEntry>
              );
            })}
          </div>
        </div>

        {/* 4. UPCOMING EVENTS & EXPERIENCES */}
        {events.length > 0 && (
          <div className="py-16 border-t border-[#1f1a16] mb-24">
            <ScrollSideEntry direction="left" delay={0.1}>
              <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold block">
                  Calendar &amp; Gatherings
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7]">
                  Exclusive Dining Events
                </h2>
              </div>
            </ScrollSideEntry>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((evt, idx) => {
                const direction = idx % 2 === 0 ? 'left' : 'right';
                return (
                  <ScrollSideEntry
                    key={evt.id}
                    direction={direction}
                    delay={(idx % 2) * 0.12}
                    className="h-full"
                  >
                    <div className="p-6 rounded-2xl bg-[#14110f] border border-[#26201a] flex flex-col justify-between space-y-4 h-full">
                      {evt.image && (
                        <div className="h-44 -mx-6 -mt-6 mb-2 overflow-hidden">
                          <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#d4af37] font-mono mb-2">
                          <span>{evt.date}</span>
                          {evt.time && <span>{evt.time}</span>}
                        </div>
                        <h3 className="font-serif text-xl font-bold text-white">{evt.title}</h3>
                        <p className="text-xs text-[#a89d8f] mt-1 leading-relaxed">{evt.description}</p>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="font-bold text-[#d4af37] font-mono">{evt.price}</span>
                        <button
                          onClick={() => onNavigate('reservations')}
                          className="btn-gold px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Book Ticket
                        </button>
                      </div>
                    </div>
                  </ScrollSideEntry>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. RESTAURANT TIMELINE */}
        <div className="py-16 border-t border-[#1f1a16] mb-24">
          <ScrollSideEntry direction="left" delay={0.1}>
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold block">
                Evolution &amp; Milestones
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#fdfbf7]">
                The Culinary Journey
              </h2>
            </div>
          </ScrollSideEntry>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIMELINE_MILESTONES.map((m, idx) => {
              const direction = idx % 2 === 0 ? 'left' : 'right';
              return (
                <ScrollSideEntry
                  key={idx}
                  direction={direction}
                  delay={(idx % 4) * 0.1}
                  className="h-full"
                >
                  <div
                    className="p-6 rounded-2xl bg-[#14110f] border border-[#26201a] flex flex-col justify-between space-y-4 h-full"
                  >
                    <div>
                      <span className="font-serif text-3xl font-bold text-[#d4af37] block mb-2">
                        {m.year}
                      </span>
                      <h4 className="font-serif text-lg font-semibold text-[#fdfbf7]">
                        {m.title}
                      </h4>
                      <p className="text-xs text-[#9d9385] mt-2 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>
                </ScrollSideEntry>
              );
            })}
          </div>
        </div>

        {/* 6. ETHOS / CORE VALUES */}
        <div className="py-16 border-t border-[#1f1a16]">
          <ScrollSideEntry direction="left" delay={0.1}>
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold block">
                Core Pillars
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7]">
                What We Stand For
              </h2>
            </div>
          </ScrollSideEntry>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, i) => {
              const Icon = v.icon;
              const direction = i % 2 === 0 ? 'left' : 'right';
              return (
                <ScrollSideEntry
                  key={i}
                  direction={direction}
                  delay={(i % 4) * 0.1}
                  className="h-full"
                >
                  <div className="p-6 rounded-2xl bg-[#14110f] border border-[#26201a] space-y-3 h-full">
                    <div className="w-10 h-10 rounded-xl bg-[#1f1814] text-[#d4af37] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif text-lg font-semibold text-[#fdfbf7]">
                      {v.title}
                    </h4>
                    <p className="text-xs text-[#9d9385] leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </ScrollSideEntry>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
