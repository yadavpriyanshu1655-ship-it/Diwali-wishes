import React, { useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { RangoliDivider, SmallPetalIcon } from '../illustrations/RangoliMotif';
import { ClayDiyaIllustration } from '../illustrations/ClayDiyaIllustration';

type GiftState = 'closed' | 'opening' | 'revealed';

export const FinalSurprise: React.FC = () => {
  const [giftState, setGiftState] = useState<GiftState>('closed');
  const [animKey, setAnimKey] = useState<number>(0);

  const isClosed = giftState === 'closed';
  const isOpening = giftState === 'opening';
  const isRevealed = giftState === 'revealed';

  const handleOpenGift = () => {
    if (giftState !== 'closed') return;

    soundEngine.playTempleBell();
    soundEngine.playDiyaLightStrike();
    setGiftState('opening');

    // Trigger celebratory sparkles event for fireworks & petals
    window.dispatchEvent(
      new CustomEvent('shubh-deep:diya-lit', {
        detail: { timestamp: Date.now() },
      })
    );

    // Stagger transition to revealed state after lid opens and light emerges
    setTimeout(() => {
      setGiftState('revealed');
    }, 1100);
  };

  const handleReplayMagic = () => {
    soundEngine.playTempleBell();
    setGiftState('closed');
    setAnimKey((prev) => prev + 1);
    const target = document.querySelector('#final-surprise');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="final-surprise"
      className="py-16 sm:py-24 border-b border-secondary/15 relative overflow-hidden select-none"
      aria-label="Final Diwali Surprise Experience"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-secondary font-medium font-sans mb-2">
            <SmallPetalIcon />
            <span>The Final Blessing</span>
            <SmallPetalIcon />
          </div>
          <h2 className="font-serif-indian text-3xl sm:text-5xl text-primary font-bold tracking-tight">
            A Little Surprise For You...
          </h2>
          <p className="font-sans text-xs sm:text-base text-text/80 mt-2 max-w-lg mx-auto leading-relaxed">
            Because every beautiful celebration deserves a little extra happiness.
          </p>
          <RangoliDivider className="mt-5" />
        </div>

        {/* Gift Box Container */}
        <div key={animKey} className="max-w-lg mx-auto flex flex-col items-center">
          
          {/* ============================================================
              1. GIFT BOX VISUAL (Closed / Opening State)
              ============================================================ */}
          {(isClosed || isOpening) && (
            <div
              className={`flex flex-col items-center transition-all duration-700 ${
                isOpening ? 'gift-box-up' : ''
              }`}
            >
              <div
                onClick={isClosed ? handleOpenGift : undefined}
                className={`relative select-none ${
                  isClosed ? 'cursor-pointer group' : 'cursor-default'
                }`}
                role={isClosed ? 'button' : 'img'}
                tabIndex={isClosed ? 0 : -1}
                aria-label={
                  isClosed
                    ? 'Traditional Terracotta Gift Box — Click to open'
                    : 'Opening festive gift box'
                }
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && isClosed) {
                    e.preventDefault();
                    handleOpenGift();
                  }
                }}
              >
                {/* Emerging Soft Warm Light from Inside (Appears during opening) */}
                {isOpening && (
                  <div
                    className="absolute -top-16 inset-x-0 mx-auto w-64 h-64 rounded-full pointer-events-none light-emerge"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(213, 167, 91, 0.65) 0%, rgba(185, 101, 67, 0.25) 50%, transparent 75%)',
                    }}
                    aria-hidden="true"
                  />
                )}

                {/* Floating micro-embers during opening */}
                {isOpening && (
                  <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none" aria-hidden="true">
                    <span className="w-2 h-2 rounded-full bg-accent gift-ember-1 absolute left-1/3" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F7DF94] gift-ember-2 absolute" />
                    <span className="w-2 h-2 rounded-full bg-primary gift-ember-3 absolute right-1/3" />
                  </div>
                )}

                {/* Handcrafted Illustrated Traditional Gift Box SVG */}
                <svg
                  className="w-64 h-64 sm:w-80 sm:h-80 max-w-full drop-shadow-md"
                  viewBox="0 0 280 280"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Terracotta Box Base Gradient */}
                    <linearGradient id="boxClay" x1="140" y1="120" x2="140" y2="240" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#C97552" />
                      <stop offset="60%" stopColor="#B96543" />
                      <stop offset="100%" stopColor="#8C4428" />
                    </linearGradient>

                    {/* Terracotta Box Lid Gradient */}
                    <linearGradient id="lidClay" x1="140" y1="80" x2="140" y2="135" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#D98260" />
                      <stop offset="60%" stopColor="#B96543" />
                      <stop offset="100%" stopColor="#9C4A2C" />
                    </linearGradient>

                    {/* Warm Ivory Ribbon Gradient */}
                    <linearGradient id="ivoryRibbon" x1="140" y1="90" x2="140" y2="240" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFDF9" />
                      <stop offset="50%" stopColor="#FAF6EE" />
                      <stop offset="100%" stopColor="#EADBCA" />
                    </linearGradient>

                    {/* Golden Marigold Accent */}
                    <radialGradient id="marigoldGold" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#F7DF94" />
                      <stop offset="65%" stopColor="#D5A75B" />
                      <stop offset="100%" stopColor="#B96543" />
                    </radialGradient>
                  </defs>

                  {/* Surface Shadow */}
                  <ellipse cx="140" cy="248" rx="88" ry="12" fill="#49382E" fillOpacity="0.12" />

                  {/* 1. Main Box Body (Terracotta Clay) */}
                  <rect
                    x="56"
                    y="130"
                    width="168"
                    height="110"
                    rx="12"
                    fill="url(#boxClay)"
                  />

                  {/* Traditional Handcrafted Surface Etchings on Box */}
                  <path
                    d="M68 150 L212 150 M68 220 L212 220"
                    stroke="#FAF6EE"
                    strokeWidth="1"
                    strokeOpacity="0.25"
                    strokeDasharray="3 3"
                  />

                  {/* Vertical Ribbon Band on Box Body */}
                  <rect
                    x="125"
                    y="130"
                    width="30"
                    height="110"
                    fill="url(#ivoryRibbon)"
                    className={isOpening ? 'ribbon-untie' : ''}
                  />

                  {/* 2. Gift Lid Group (Animated 3D Opening) */}
                  <g className={isOpening ? 'lid-open' : ''}>
                    {/* Lid Main Rect */}
                    <rect
                      x="48"
                      y="98"
                      width="184"
                      height="38"
                      rx="8"
                      fill="url(#lidClay)"
                      stroke="#8C4428"
                      strokeWidth="1"
                    />

                    {/* Ribbon Across Lid */}
                    <rect
                      x="125"
                      y="98"
                      width="30"
                      height="38"
                      fill="url(#ivoryRibbon)"
                      className={isOpening ? 'ribbon-untie' : ''}
                    />
                    <rect
                      x="48"
                      y="112"
                      width="184"
                      height="12"
                      fill="url(#ivoryRibbon)"
                      fillOpacity="0.9"
                      className={isOpening ? 'ribbon-untie' : ''}
                    />

                    {/* 3. Handcrafted Ribbon Bow & Marigold Foliage on Top */}
                    <g className={isOpening ? 'ribbon-untie' : ''}>
                      {/* Left Botanical Mango Leaf */}
                      <path
                        d="M130 96 C 104 90, 94 76, 92 64 C 110 68, 126 84, 130 96 Z"
                        fill="#78805B"
                      />
                      <line x1="130" y1="96" x2="94" y2="66" stroke="#FAF6EE" strokeWidth="0.8" strokeOpacity="0.5" />

                      {/* Right Botanical Mango Leaf */}
                      <path
                        d="M150 96 C 176 90, 186 76, 188 64 C 170 68, 154 84, 150 96 Z"
                        fill="#78805B"
                      />
                      <line x1="150" y1="96" x2="186" y2="66" stroke="#FAF6EE" strokeWidth="0.8" strokeOpacity="0.5" />

                      {/* Ribbon Left Loop */}
                      <path
                        d="M140 96 C 110 70, 90 85, 115 102 C 128 102, 135 100, 140 96 Z"
                        fill="url(#ivoryRibbon)"
                        stroke="#D5A75B"
                        strokeWidth="0.8"
                      />

                      {/* Ribbon Right Loop */}
                      <path
                        d="M140 96 C 170 70, 190 85, 165 102 C 152 102, 145 100, 140 96 Z"
                        fill="url(#ivoryRibbon)"
                        stroke="#D5A75B"
                        strokeWidth="0.8"
                      />

                      {/* Ribbon Hanging Tails */}
                      <path
                        d="M132 100 Q 116 122, 108 140"
                        stroke="url(#ivoryRibbon)"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M148 100 Q 164 122, 172 140"
                        stroke="url(#ivoryRibbon)"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />

                      {/* Center Marigold Blossom Knot (Genda Phool Accent) */}
                      <circle cx="140" cy="96" r="10" fill="url(#marigoldGold)" />
                      <circle cx="140" cy="96" r="6" fill="#B96543" />
                      <circle cx="140" cy="96" r="3" fill="#FFFDF9" />
                    </g>
                  </g>
                </svg>
              </div>

              {/* Action Button: "Open Your Gift" */}
              {isClosed && (
                <div className="mt-6 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={handleOpenGift}
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl bg-primary text-surface font-sans font-medium text-sm sm:text-base tracking-wide border border-primary/40 shadow-earthy hover:bg-[#A64C28] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 min-h-[48px] touch-manipulation cursor-pointer button-glow-idle"
                    aria-label="Open Your Gift"
                  >
                    <Sparkles className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform" />
                    <span className="font-medium tracking-wide">Open Your Gift</span>
                  </button>

                  <span className="text-[11px] font-sans text-secondary/75 tracking-wider uppercase mt-2.5">
                    Tap to unbox your festive surprise
                  </span>
                </div>
              )}

              {/* Opening Transition Hint */}
              {isOpening && (
                <div className="mt-4 flex flex-col items-center animate-pulse">
                  <span className="font-serif-indian text-primary text-base">
                    ॥ उपहार खुल रहा है... ॥
                  </span>
                  <span className="text-xs font-sans text-secondary tracking-widest uppercase">
                    Unveiling your celebration...
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              2. SPECIAL MESSAGE REVEAL & FINAL CELEBRATION SCREEN
              ============================================================ */}
          {isRevealed && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              
              {/* Special Message Card (Artisanal Handmade Khadi Surface) */}
              <div className="w-full max-w-xl p-6 sm:p-10 rounded-2xl bg-surface border-2 border-primary/30 shadow-earthy paper-texture text-center relative mb-8">
                
                {/* Auspicious Header Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3EBDD] border border-secondary/25 text-xs font-serif-indian text-secondary mb-6 shadow-soft">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>॥ दीपावली हार्दिक संदेश ॥</span>
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                </div>

                {/* Staggered Line-by-Line Animated Poem */}
                <div className="space-y-4 my-2 text-text">
                  {/* Stanza 1 */}
                  <div className="space-y-1">
                    <p className="font-serif-indian text-lg sm:text-2xl text-text font-normal leading-relaxed special-line-1">
                      जिंदगी में रोशनी हमेशा बनी रहे,
                    </p>
                    <p className="font-serif-indian text-lg sm:text-2xl text-text font-normal leading-relaxed special-line-2">
                      चेहरे पर मुस्कान कभी कम न हो।
                    </p>
                  </div>

                  {/* Stanza 2 */}
                  <div className="space-y-1 pt-2">
                    <p className="font-serif-indian text-lg sm:text-2xl text-text font-normal leading-relaxed special-line-3">
                      हर ख्वाब पूरा हो तुम्हारा,
                    </p>
                    <p className="font-serif-indian text-lg sm:text-2xl text-text font-normal leading-relaxed special-line-4">
                      और खुशियों का कोई अंत न हो।
                    </p>
                  </div>

                  {/* Stanza 3 (Playful & Subtly Flirty) */}
                  <div className="pt-3 border-t border-secondary/15 space-y-1.5">
                    <p className="font-serif-indian text-sm sm:text-base text-secondary font-medium italic special-line-5">
                      वैसे एक छोटी सी बात...
                    </p>
                    <p className="font-sans text-sm sm:text-base text-primary/90 font-medium leading-relaxed special-line-6">
                      Diwali ke diye toh har koi jalata hai,
                    </p>
                    <p className="font-sans text-sm sm:text-base text-primary font-semibold leading-relaxed special-line-7">
                      par kuch log apni smile se hi celebration complete kar dete hain! 😉
                    </p>
                  </div>
                </div>

                {/* Final Greeting */}
                <div className="mt-8 pt-6 border-t border-secondary/20 special-final-greeting">
                  <h3 className="font-serif-indian text-2xl sm:text-3xl font-bold text-primary">
                    Happy Diwali to You and Your Family!
                  </h3>
                  <span className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-secondary mt-1 block">
                    May Peace & Joy Abound
                  </span>
                </div>
              </div>

              {/* ============================================================
                  3. FINAL CELEBRATION SCREEN
                  ============================================================ */}
              <div className="w-full max-w-xl p-8 sm:p-10 rounded-2xl bg-surface/75 border border-secondary/25 shadow-soft paper-texture text-center relative flex flex-col items-center final-screen-enter">
                
                {/* Main Heading */}
                <h3 className="font-serif-indian text-4xl sm:text-5xl font-bold text-primary tracking-tight mb-1">
                  शुभ दीपावली
                </h3>
                <p className="font-serif-indian text-xl sm:text-2xl text-text font-normal mb-4">
                  Happy Diwali!
                </p>

                {/* Lit Clay Diya Centerpiece */}
                <div className="my-2 flex flex-col items-center">
                  <ClayDiyaIllustration />
                  <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-secondary/70 mt-2 font-medium">
                    • Anantam Deepam •
                  </span>
                </div>

                {/* Closing Heartfelt Line */}
                <p className="font-serif-indian text-base sm:text-xl text-primary font-medium italic mt-6 mb-8 max-w-md mx-auto leading-relaxed">
                  "Keep smiling. Keep shining. Keep spreading happiness."
                </p>

                {/* Replay Magic Feature Button */}
                <button
                  type="button"
                  onClick={handleReplayMagic}
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-surface hover:bg-[#F3EBDD] border border-secondary/30 hover:border-primary/50 text-text hover:text-primary font-sans text-xs sm:text-sm font-medium tracking-wide shadow-soft active:scale-[0.97] transition-all touch-manipulation cursor-pointer"
                  aria-label="Replay Magic — Open festive gift again"
                >
                  <RotateCcw className="w-4 h-4 text-secondary group-hover:text-primary group-hover:-rotate-45 transition-transform" />
                  <span className="font-medium">Replay Magic ✨</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
