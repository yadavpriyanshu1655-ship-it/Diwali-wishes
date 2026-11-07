import React from 'react';
import { ClayDiyaIllustration } from './illustrations/ClayDiyaIllustration';
import { FloralToran } from './illustrations/FloralToran';
import { RangoliDivider } from './illustrations/RangoliMotif';
import { Sparkles, ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const handleEnterCelebration = () => {
    const target = document.querySelector('#festive-intro');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-2 pb-16 sm:pb-24 overflow-hidden">
      {/* Decorative Traditional Toran at Viewport Top */}
      <FloralToran className="mb-4 sm:mb-6" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Auspicious Vedic Invocation Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-secondary/25 shadow-soft mb-6 sm:mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="font-serif-indian text-xs sm:text-sm tracking-wide text-secondary font-medium">
            ॥ तमसो मा ज्योतिर्गमय ॥
          </span>
          <span className="w-1 h-1 rounded-full bg-secondary/40" />
          <span className="text-[11px] font-sans tracking-widest text-text/70 uppercase">
            Festival of Deep
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-serif-indian text-4xl sm:text-6xl md:text-7xl font-bold text-primary tracking-tight leading-tight sm:leading-none mb-3">
          शुभ दीपावली
        </h1>

        {/* Subtitle */}
        <p className="font-serif-indian text-xl sm:text-2xl md:text-3xl text-text font-normal mb-4 tracking-wide">
          A Little Light, A Lot of Happiness.
        </p>

        {/* Delicate Sacred Divider */}
        <RangoliDivider className="my-5" />

        {/* Short Emotional Introductory Text */}
        <p className="max-w-2xl mx-auto font-sans text-sm sm:text-base md:text-lg text-text/80 leading-relaxed font-normal mb-8 sm:mb-10 px-2">
          In every humble earthen flame rests an eternal promise—that even the gentlest diya can dispel the deepest shadow. 
          May this season of light bring stillness to your thoughts, peace to your home, and abundant grace to every step of your journey.
        </p>

        {/* Clay Diya Centerpiece Illustration */}
        <div className="my-6 sm:my-10 flex flex-col items-center justify-center">
          <ClayDiyaIllustration />
          <p className="text-xs font-sans tracking-widest uppercase text-secondary/70 mt-4 flex items-center gap-1.5">
            <span>•</span> Mitti ka Deepam <span>•</span>
          </p>
        </div>

        {/* Prominent Enter Celebration Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={handleEnterCelebration}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-lg bg-primary text-surface font-sans font-medium text-sm sm:text-base tracking-wide shadow-earthy hover:bg-[#A35232] active:scale-[0.99] transition-all border border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <span>Enter Celebration</span>
            <ArrowDown className="w-4 h-4 text-accent group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
