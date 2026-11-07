import React, { useState, useMemo, useEffect } from 'react';
import { WishItem } from '../../data/wishesData';
import { RangoliDivider, SmallPetalIcon } from '../illustrations/RangoliMotif';
import { soundEngine } from '../../services/soundEngine';
import { useSiteContent } from '../../context/ContentContext';
import {
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';

export const WishesExperience: React.FC = () => {
  const { wishes, categories, getContent } = useSiteContent();

  const [activeCategory, setActiveCategory] = useState<string>('funny');
  const [copied, setCopied] = useState<boolean>(false);
  const [animKey, setAnimKey] = useState<number>(0);

  // Group wishes by category slug
  const categorizedWishes = useMemo(() => {
    const map: Record<string, WishItem[]> = {};

    categories.forEach((cat) => {
      map[cat.id] = [];
    });

    wishes.forEach((w) => {
      const catKey = w.category || 'funny';
      if (!map[catKey]) {
        map[catKey] = [];
      }
      map[catKey].push(w);
    });

    return map;
  }, [wishes, categories]);

  // Track seen indices to strictly prevent immediate repeats
  const [history, setHistory] = useState<Record<string, number[]>>({
    funny: [0],
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Active list of wishes for current category
  const activeList = categorizedWishes[activeCategory] || categorizedWishes['funny'] || wishes;

  const currentWish: WishItem =
    activeList[currentIndex] ||
    activeList[0] || {
      id: 'default',
      category: 'funny',
      hindi: 'शुभ दीपावली!\nसुख, शांति और समृद्धि की मंगलकामनाएं।',
      english: 'Happy Deepavali! Wishing you serenity, health and prosperity.',
      tag: 'Diwali Blessing',
      emoji: '🪔',
    };

  // Keep index within bounds if activeList length changes
  useEffect(() => {
    if (currentIndex >= activeList.length) {
      setCurrentIndex(0);
    }
  }, [activeList, currentIndex]);

  // Change Category Handler
  const handleCategoryChange = (category: string) => {
    if (category === activeCategory) return;
    soundEngine.playTempleBell();
    setActiveCategory(category);

    const list = categorizedWishes[category] || [];
    const past = history[category] || [];
    let nextIdx = 0;
    if (list.length > 0) {
      if (past.length > 0) {
        nextIdx = past[past.length - 1] % list.length;
      } else {
        nextIdx = Math.floor(Math.random() * list.length);
        setHistory((prev) => ({ ...prev, [category]: [nextIdx] }));
      }
    }
    setCurrentIndex(nextIdx);
    setAnimKey((prev) => prev + 1);
  };

  // Next Wish Handler (Non-repeating random picker)
  const handleNextWish = () => {
    soundEngine.playTempleBell();
    const list = activeList;
    if (list.length <= 1) {
      setAnimKey((prev) => prev + 1);
      return;
    }

    const past = history[activeCategory] || [];

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
        [activeCategory]: [...(prev[activeCategory] || []), nextIdx],
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

  // Copy to Clipboard Handler
  const handleCopyWish = async () => {
    soundEngine.playTempleBell();
    const formattedWish = `${currentWish.hindi}\n\n${
      currentWish.english ? currentWish.english + '\n\n' : ''
    }✨ Shubh Deepavali! ✨\n— Sent with warmth from SHUBH DEEP`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(formattedWish);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = formattedWish;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
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
            <span>{getContent('wishes_badge', 'Festive Verses & Heartfelt Wishes')}</span>
            <SmallPetalIcon />
          </div>
          <h2 className="font-serif-indian text-3xl sm:text-4xl text-text font-bold">
            {getContent('wishes_heading', 'शब्दों में दीपावली की मिठास')}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-text/75 mt-1 leading-relaxed">
            {getContent(
              'wishes_subtitle',
              'Spreading warmth, lighthearted laughter, and heartfelt blessings to celebrate this festival of lights.'
            )}
          </p>
          <RangoliDivider className="mt-4" />
        </div>

        {/* Dynamic Category Selection Cards */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
          {categories.map((cat) => {
            const count = (categorizedWishes[cat.id] || []).length;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`group px-4 sm:px-5 py-3 rounded-xl border text-left transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-primary/40 flex items-center gap-3 ${
                  isSelected
                    ? 'bg-surface border-primary shadow-earthy -translate-y-0.5'
                    : 'bg-surface/60 border-secondary/20 hover:border-primary/40 hover:bg-surface/85'
                }`}
                aria-selected={isSelected}
                role="tab"
              >
                <span className="text-2xl select-none">{cat.emoji}</span>
                <div>
                  <h3 className="font-serif-indian text-sm sm:text-base font-bold text-text leading-tight">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-sans text-secondary font-medium block">
                    {count} {count === 1 ? 'verse' : 'verses'}
                  </span>
                </div>
                {isSelected && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Wish Display Card (Artisanal Khadi Postcard) */}
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
              {currentIndex + 1} of {activeList.length || 1}
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
              <p className="font-sans text-xs sm:text-sm text-text/70 italic mt-6 pt-4 border-t border-secondary/15 wish-line-4 leading-relaxed">
                "{currentWish.english}"
              </p>
            )}

            {/* Attached Media Image (if uploaded via CMS) */}
            {currentWish.imageUrl && (
              <div className="mt-5 rounded-xl overflow-hidden border border-secondary/25 max-h-56 mx-auto">
                <img
                  src={currentWish.imageUrl}
                  alt={currentWish.tag}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Action Controls: Next Wish, Copy to Clipboard, Replay */}
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
                    <span>{getContent('wishes_copy_btn', 'Copy Wish')}</span>
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
                {getContent('wishes_next_btn', 'अगली शुभकामना')}
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
