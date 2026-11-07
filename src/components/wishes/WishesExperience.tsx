import React, { useState, useMemo } from 'react';
import { WISHES_DATA, WishCategory, WishItem } from '../../data/wishesData';
import { RangoliDivider, SmallPetalIcon } from '../illustrations/RangoliMotif';
import { soundEngine } from '../../services/soundEngine';
import {
  Smile,
  Heart,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';

export const WishesExperience: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<WishCategory>('funny');
  const [copied, setCopied] = useState<boolean>(false);
  const [animKey, setAnimKey] = useState<number>(0);

  // Group wishes by category
  const categorizedWishes = useMemo(() => {
    return {
      funny: WISHES_DATA.filter((w) => w.category === 'funny'),
      heartwarming: WISHES_DATA.filter((w) => w.category === 'heartwarming'),
      flirt: WISHES_DATA.filter((w) => w.category === 'flirt'),
    };
  }, []);

  // Track seen indices to strictly prevent immediate repeats
  const [history, setHistory] = useState<{ [key in WishCategory]: number[] }>({
    funny: [0],
    heartwarming: [0],
    flirt: [0],
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentWish: WishItem =
    categorizedWishes[activeCategory][currentIndex] ||
    categorizedWishes[activeCategory][0];

  // Change Category Handler
  const handleCategoryChange = (category: WishCategory) => {
    if (category === activeCategory) return;
    soundEngine.playTempleBell();
    setActiveCategory(category);

    // Pick first or random from that category
    const list = categorizedWishes[category];
    const past = history[category];
    let nextIdx = 0;
    if (past.length > 0) {
      nextIdx = past[past.length - 1] % list.length;
    } else {
      nextIdx = Math.floor(Math.random() * list.length);
      setHistory((prev) => ({ ...prev, [category]: [nextIdx] }));
    }
    setCurrentIndex(nextIdx);
    setAnimKey((prev) => prev + 1);
  };

  // Next Wish Handler (Non-repeating random picker)
  const handleNextWish = () => {
    soundEngine.playTempleBell();
    const list = categorizedWishes[activeCategory];
    const past = history[activeCategory];

    // Filter out indices already seen
    const availableIndices = list
      .map((_, i) => i)
      .filter((i) => !past.includes(i));

    let nextIdx: number;
    if (availableIndices.length > 0) {
      // Pick random unseen
      nextIdx =
        availableIndices[Math.floor(Math.random() * availableIndices.length)];
      setHistory((prev) => ({
        ...prev,
        [activeCategory]: [...prev[activeCategory], nextIdx],
      }));
    } else {
      // All have been seen; reset history and pick any different from current
      const candidateList = list
        .map((_, i) => i)
        .filter((i) => i !== currentIndex);
      nextIdx =
        candidateList[Math.floor(Math.random() * candidateList.length)] ?? 0;
      setHistory((prev) => ({
        ...prev,
        [activeCategory]: [nextIdx],
      }));
    }

    setCurrentIndex(nextIdx);
    setAnimKey((prev) => prev + 1);
  };

  // Replay Current Wish
  const handleReplayWish = () => {
    soundEngine.playTempleBell();
    setAnimKey((prev) => prev + 1);
  };

  // Copy to Clipboard with fallback support
  const handleCopyWish = async () => {
    const textToCopy = `✨ *शुभ दीपावली | Shubh Deep* ✨\n\n${currentWish.hindi}${
      currentWish.english ? `\n\n"${currentWish.english}"` : ''
    }\n\n— Wishing you light and joy! 🪔`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      // Graceful fallback
    }
  };

  // Split lines for staggered reveal
  const lines = currentWish.hindi.split('\n');

  return (
    <section
      id="festive-wishes"
      className="py-16 sm:py-24 border-b border-secondary/15 relative overflow-hidden select-none"
      aria-label="Diwali Wishes and Shayari Experience"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-secondary font-medium font-sans mb-2">
            <SmallPetalIcon />
            <span>Mithas & Shayari</span>
            <SmallPetalIcon />
          </div>
          <h2 className="font-serif-indian text-3xl sm:text-4xl text-text font-bold">
            शुभकामनाएं एवं शायरी
          </h2>
          <p className="font-sans text-xs sm:text-sm text-text/75 mt-1">
            Pick a mood below to discover playful banter, soulful blessings, or gentle festive compliments.
          </p>
          <RangoliDivider className="mt-4" />
        </div>

        {/* 1. Three Category Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Category A: Funny Shayari */}
          <button
            type="button"
            onClick={() => handleCategoryChange('funny')}
            className={`group p-4 sm:p-5 rounded-xl border text-left transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              activeCategory === 'funny'
                ? 'bg-surface border-primary shadow-earthy -translate-y-0.5'
                : 'bg-surface/60 border-secondary/20 hover:border-primary/40 hover:bg-surface/85'
            }`}
            aria-selected={activeCategory === 'funny'}
            role="tab"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🍬</span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  activeCategory === 'funny'
                    ? 'bg-primary text-surface'
                    : 'bg-[#F3EBDD] text-secondary'
                }`}
              >
                <Smile className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="font-serif-indian text-base sm:text-lg font-bold text-text">
              Funny Shayari
            </h3>
            <span className="text-[11px] font-serif-indian text-primary font-medium block">
              हँसी-मज़ाक शायरी
            </span>
            <p className="text-[11px] font-sans text-text/65 mt-1 leading-relaxed">
              Playful Diwali humor, calories & Kaju Katli stories.
            </p>
            {activeCategory === 'funny' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-t-full" />
            )}
          </button>

          {/* Category B: Heartwarming Wishes */}
          <button
            type="button"
            onClick={() => handleCategoryChange('heartwarming')}
            className={`group p-4 sm:p-5 rounded-xl border text-left transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              activeCategory === 'heartwarming'
                ? 'bg-surface border-primary shadow-earthy -translate-y-0.5'
                : 'bg-surface/60 border-secondary/20 hover:border-primary/40 hover:bg-surface/85'
            }`}
            aria-selected={activeCategory === 'heartwarming'}
            role="tab"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🪔</span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  activeCategory === 'heartwarming'
                    ? 'bg-primary text-surface'
                    : 'bg-[#F3EBDD] text-secondary'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="font-serif-indian text-base sm:text-lg font-bold text-text">
              Heartwarming
            </h3>
            <span className="text-[11px] font-serif-indian text-primary font-medium block">
              दिल से शुभकामनाएं
            </span>
            <p className="text-[11px] font-sans text-text/65 mt-1 leading-relaxed">
              Quiet peace, gratitude, blessings & true friendship.
            </p>
            {activeCategory === 'heartwarming' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-t-full" />
            )}
          </button>

          {/* Category C: A Little Flirt */}
          <button
            type="button"
            onClick={() => handleCategoryChange('flirt')}
            className={`group p-4 sm:p-5 rounded-xl border text-left transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              activeCategory === 'flirt'
                ? 'bg-surface border-primary shadow-earthy -translate-y-0.5'
                : 'bg-surface/60 border-secondary/20 hover:border-primary/40 hover:bg-surface/85'
            }`}
            aria-selected={activeCategory === 'flirt'}
            role="tab"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">✨</span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  activeCategory === 'flirt'
                    ? 'bg-primary text-surface'
                    : 'bg-[#F3EBDD] text-secondary'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className="font-serif-indian text-base sm:text-lg font-bold text-text">
              A Little Flirt
            </h3>
            <span className="text-[11px] font-serif-indian text-primary font-medium block">
              हल्की-सी शरारत
            </span>
            <p className="text-[11px] font-sans text-text/65 mt-1 leading-relaxed">
              Cute hints, lovely smiles & tasteful playful teasing.
            </p>
            {activeCategory === 'flirt' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-t-full" />
            )}
          </button>
        </div>

        {/* 2. Interactive Wish Display Card (Artisanal Khadi Postcard) */}
        <div
          key={animKey}
          className="relative rounded-2xl bg-surface border border-secondary/25 shadow-earthy p-6 sm:p-10 paper-texture wish-card-enter transition-all"
        >
          {/* Card Top Border Corner Flourish */}
          <div className="flex items-center justify-between border-b border-secondary/15 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentWish.emoji}</span>
              <span className="font-serif-indian text-xs sm:text-sm text-secondary font-medium tracking-wide">
                ॥ {currentWish.tag} ॥
              </span>
            </div>

            {/* Counter indicator */}
            <span className="text-[11px] font-sans text-secondary/60 tracking-widest uppercase">
              {currentIndex + 1} of {categorizedWishes[activeCategory].length}
            </span>
          </div>

          {/* Staggered Animated Message Lines */}
          <div className="min-h-[140px] sm:min-h-[160px] flex flex-col justify-center">
            <div className="space-y-2.5">
              {lines.map((line, idx) => {
                const lineClass =
                  idx === 0
                    ? 'wish-line-1'
                    : idx === 1
                    ? 'wish-line-2'
                    : idx === 2
                    ? 'wish-line-3'
                    : 'wish-line-4';
                return (
                  <p
                    key={idx}
                    className={`font-serif-indian text-lg sm:text-2xl md:text-2xl text-text font-normal leading-relaxed ${lineClass}`}
                  >
                    {line}
                  </p>
                );
              })}
            </div>

            {/* Subtle English Translation / Poetic Subtitle */}
            {currentWish.english && (
              <p className="font-sans text-xs sm:text-sm text-text/70 italic mt-6 pt-4 border-t border-secondary/15 wish-line-4">
                "{currentWish.english}"
              </p>
            )}
          </div>

          {/* 3. Action Controls: Next Wish, Copy to Clipboard, Replay */}
          <div className="mt-8 pt-6 border-t border-secondary/15 flex flex-wrap items-center justify-between gap-3">
            {/* Left Actions: Copy & Replay */}
            <div className="flex items-center gap-2">
              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopyWish}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F3EBDD] hover:bg-surface border border-secondary/20 hover:border-primary/40 text-xs font-sans font-medium text-text transition-all active:scale-[0.97] touch-manipulation cursor-pointer"
                aria-label="Copy wish to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-primary" />
                    <span className="text-primary font-semibold">कॉपी हो गया!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-secondary" />
                    <span>Copy Wish</span>
                  </>
                )}
              </button>

              {/* Replay / Trace Button */}
              <button
                type="button"
                onClick={handleReplayWish}
                className="p-2 rounded-lg bg-[#F3EBDD] hover:bg-surface border border-secondary/20 hover:border-primary/40 text-secondary hover:text-primary transition-all active:scale-[0.97] touch-manipulation cursor-pointer"
                title="Re-animate Message"
                aria-label="Re-animate Message"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right Action: Primary "Next Wish" Button */}
            <button
              type="button"
              onClick={handleNextWish}
              className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-primary text-surface font-sans font-medium text-xs sm:text-sm tracking-wide shadow-earthy hover:bg-[#A64C28] active:scale-[0.97] transition-all touch-manipulation cursor-pointer"
              aria-label="Generate next Diwali wish"
            >
              <span className="font-serif-indian text-xs sm:text-sm">
                अगली शुभकामना
              </span>
              <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Copy Toast Feedback notification */}
          {copied && (
            <div
              className="absolute top-4 right-4 bg-primary text-surface text-xs font-sans px-3 py-1.5 rounded-full shadow-earthy flex items-center gap-1.5 copy-toast-pop"
              role="alert"
            >
              <Check className="w-3.5 h-3.5 text-accent" />
              <span>Copied to clipboard!</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
