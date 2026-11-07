import React, { useState } from 'react';
import { InteractiveDiya } from './diya/InteractiveDiya';
import { FloralToran } from './illustrations/FloralToran';
import { RangoliDivider } from './illustrations/RangoliMotif';
import { Sparkles, ArrowDown, Flame } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

interface HeroProps {
  onEnterCelebration?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onEnterCelebration }) => {
  const [isClicked, setIsClicked] = useState(false);
  const { getContent } = useSiteContent();

  const handleEnterCelebration = () => {
    setIsClicked(true);

    if (onEnterCelebration) {
      onEnterCelebration();
    }

    window.dispatchEvent(
      new CustomEvent('shubh-deep:enter-celebration', {
        detail: { timestamp: Date.now() },
      })
    );

    const target = document.querySelector('#festive-intro');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      setIsClicked(false);
    }, 400);
  };

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100dvh-4.5rem)] sm:min-h-[calc(100dvh-5rem)] flex flex-col justify-between items-center pt-2 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
      aria-label="Welcome to Shubh Deep"
    >
      {/* Decorative Traditional Toran at Viewport Top */}
      <div className="w-full">
        <FloralToran className="mb-2 sm:mb-4" />
      </div>

      {/* Main Full-Screen Welcome Content */}
      <div className="max-w-4xl w-full mx-auto text-center flex flex-col items-center my-auto py-4">
        
        {/* Step 1: Branding & Decorative Label (A FESTIVAL OF LIGHT) */}
        <div className="hero-anim-brand inline-flex flex-col sm:flex-row items-center gap-2 px-4 py-1.5 rounded-full bg-surface/90 border border-secondary/25 shadow-soft mb-5 sm:mb-6">
          <div className="flex items-center gap-1.5 text-primary">
            <Flame className="w-3.5 h-3.5 fill-primary/20" />
            <span className="font-serif-indian text-xs sm:text-sm font-semibold tracking-wider">
              SHUBH DEEP
            </span>
          </div>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-secondary/40" />
          <div className="flex items-center gap-1 text-[10.5px] sm:text-[11px] font-sans tracking-[0.22em] text-secondary font-semibold uppercase">
            <Sparkles className="w-3 h-3 text-accent" />
            <span>{getContent('hero_badge', 'A FESTIVAL OF LIGHT')}</span>
          </div>
        </div>

        {/* Step 2: Main Hindi Heading */}
        <h1 className="hero-anim-heading font-serif-indian text-5xl sm:text-7xl md:text-8xl font-bold text-primary tracking-tight leading-tight sm:leading-none mb-3 drop-shadow-sm">
          {getContent('hero_heading_hindi', 'शुभ दीपावली')}
        </h1>

        {/* Step 3: Subtitle */}
        <p className="hero-anim-subtitle font-serif-indian text-xl sm:text-3xl md:text-4xl text-text font-normal mb-3 tracking-wide">
          {getContent('hero_subtitle', 'A Little Light, A Lot of Happiness.')}
        </p>

        {/* Step 5: Delicate Sacred Divider with Floral/Petal Motifs */}
        <div className="hero-anim-petals w-full max-w-xs mx-auto my-3 sm:my-4">
          <RangoliDivider />
        </div>

        {/* Step 3: Heartwarming Introductory Message */}
        <p className="hero-anim-subtitle max-w-xl mx-auto font-sans text-sm sm:text-base md:text-lg text-text/85 italic leading-relaxed mb-6 sm:mb-8 px-2 font-normal">
          {getContent('hero_intro_quote', '"May this beautiful festival bring peace, happiness, and countless little reasons to smile."')}
        </p>

        {/* Step 4: Interactive Sacred Diya Centerpiece */}
        <div className="hero-anim-diya my-2 sm:my-4 w-full flex flex-col items-center justify-center">
          <InteractiveDiya />
        </div>

        {/* Step 6: Prominent Enter Celebration Button */}
        <div className="hero-anim-button mt-8 sm:mt-10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleEnterCelebration}
            className={`group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl bg-surface/90 text-text font-sans font-medium text-sm sm:text-base tracking-wide border border-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 min-h-[48px] touch-manipulation cursor-pointer shadow-soft ${
              isClicked
                ? 'scale-[0.97] bg-[#FAF6EE] shadow-inner ring-2 ring-primary/40'
                : 'hover:-translate-y-0.5 hover:bg-surface hover:border-primary/40 hover:text-primary active:scale-[0.97]'
            }`}
            aria-label="Enter Celebration — Explore Shubh Deep"
          >
            <span className="font-medium tracking-wide">
              {getContent('hero_enter_btn', 'Enter Celebration')}
            </span>
            <ArrowDown
              className={`w-4 h-4 text-accent transition-transform duration-300 ${
                isClicked ? 'translate-y-1' : 'group-hover:translate-y-1'
              }`}
            />
          </button>

          <span className="text-[11px] font-sans text-secondary/70 tracking-wider uppercase">
            Scroll to explore reflections & traditions
          </span>
        </div>

      </div>

      {/* Subtle Bottom Grounding Motif */}
      <div className="w-full flex justify-center items-center py-2 opacity-60">
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-secondary/30" />
        <span className="mx-2 text-xs font-serif-indian text-secondary">॥ शुभ दीप ॥</span>
        <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-secondary/30" />
      </div>
    </section>
  );
};
