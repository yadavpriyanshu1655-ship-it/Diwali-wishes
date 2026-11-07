import React from 'react';
import { RangoliDivider, SmallPetalIcon } from './illustrations/RangoliMotif';
import { RangoliReveal } from './rangoli/RangoliReveal';
import { Sun, Heart, Sparkle } from 'lucide-react';

export const FestiveIntro: React.FC = () => {
  const traditions = [
    {
      num: '०१',
      titleHindi: 'माटी का दीप',
      titleEn: 'Earthen Stillness',
      desc: 'Hand-pressed clay, fragrant sesame oil, and an unhurried cotton flame—revering the quiet grace of natural elements.',
      icon: Sun,
    },
    {
      num: '०२',
      titleHindi: 'हृदय का प्रकाश',
      titleEn: 'Inner Radiance',
      desc: 'Lighting within ourselves the virtues of compassion, humility, and forgiveness, dispelling the shadows of discord.',
      icon: Heart,
    },
    {
      num: '०३',
      titleHindi: 'पारस्परिक सौहार्द',
      titleEn: 'Shared Harmony',
      desc: 'Opening doorway thresholds with fresh mango leaves, sharing homemade mithai, and embracing every soul as family.',
      icon: Sparkle,
    },
  ];

  return (
    <section id="festive-intro" className="py-16 sm:py-24 border-t border-b border-secondary/15 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-secondary font-medium font-sans mb-2">
            <SmallPetalIcon />
            <span>The Spirit of Deepavali</span>
            <SmallPetalIcon />
          </div>
          <h2 className="font-serif-indian text-2xl sm:text-4xl text-text font-bold leading-snug">
            दीपक की ज्योति से आलोकित हो संसार
          </h2>
          <p className="font-serif-indian text-base sm:text-lg text-primary italic mt-1">
            "May the flame of every earthen lamp illuminate the world with peace."
          </p>
          <RangoliDivider className="mt-4" />
        </div>

        {/* Editorial Narrative Paragraph */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative p-6 sm:p-10 rounded-xl bg-surface border border-secondary/20 shadow-soft paper-texture">
            {/* Subtle decorative quote embellishment */}
            <div className="text-secondary/20 font-serif-indian text-5xl absolute top-3 left-4 select-none pointer-events-none">
              “
            </div>
            <p className="font-sans text-sm sm:text-base md:text-lg text-text/85 leading-relaxed relative z-10 text-justify sm:text-center">
              Diwali is a return to simplicity. It is the fragrance of raw river clay baking in the potter's kiln, 
              the deliberate geometry of rice-flour rangoli adorning courtyard steps, and the warmth of reuniting with loved ones. 
              When an earthen lamp is lit, it asks for neither fanfare nor extravagance—only a drop of oil to offer unconditional brightness. 
              In that quiet gesture lies the true soul of <span className="font-semibold text-primary">SHUBH DEEP</span>: 
              a mindful celebration of light, harmony, and renewed hope.
            </p>
            <div className="mt-6 flex justify-center items-center gap-2 text-xs font-serif-indian text-secondary">
              <span>॥ आनन्दो भवतु ॥</span>
            </div>
          </div>
        </div>

        {/* Traditional Floral Rangoli Reveal Showcase */}
        <div className="my-16 py-10 px-4 sm:px-8 rounded-2xl bg-surface/50 border border-secondary/20 flex flex-col items-center justify-center text-center shadow-soft">
          <div className="max-w-md mx-auto mb-6">
            <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest text-secondary font-semibold font-sans mb-1">
              <span>•</span>
              <span>Auspicious Kolam Art</span>
              <span>•</span>
            </div>
            <h3 className="font-serif-indian text-2xl sm:text-3xl font-bold text-text">
              पारंपरिक पुष्प रंगोली
            </h3>
            <p className="font-sans text-xs sm:text-sm text-text/75 mt-1.5 leading-relaxed">
              Drawn with natural mineral pigments of turmeric ochre, river terracotta, and white rice flour to welcome prosperity into every home.
            </p>
          </div>

          <RangoliReveal />
        </div>

        {/* 3 Balanced Editorial Pillars (Avoiding excessive cards) */}
        <div id="celebration-spirit" className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {traditions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-lg bg-surface/70 border border-secondary/20 hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif-indian text-lg font-bold text-accent">
                      {item.num}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#F3EBDD] flex items-center justify-center text-primary border border-secondary/15">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-serif-indian text-lg sm:text-xl font-bold text-text mb-1">
                    {item.titleHindi}
                  </h3>
                  <div className="text-xs uppercase tracking-wider text-secondary font-medium font-sans mb-3">
                    {item.titleEn}
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-text/75 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-secondary/15 flex items-center gap-2 text-xs text-secondary/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                  <span className="tracking-wider uppercase text-[10px]">Pavitra Parampara</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
