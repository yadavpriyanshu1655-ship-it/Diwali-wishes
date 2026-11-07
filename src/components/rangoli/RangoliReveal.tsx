import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface RangoliRevealProps {
  autoReveal?: boolean;
  className?: string;
}

export const RangoliReveal: React.FC<RangoliRevealProps> = ({
  autoReveal = false,
  className = '',
}) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(autoReveal);
  const [animationKey, setAnimationKey] = useState<number>(0);

  useEffect(() => {
    if (autoReveal) {
      setIsRevealed(true);
    }
  }, [autoReveal]);

  // Listen to global diya lit event
  useEffect(() => {
    const handleDiyaLit = () => {
      setIsRevealed(true);
      setAnimationKey((prev) => prev + 1);
    };

    window.addEventListener('shubh-deep:diya-lit', handleDiyaLit);
    return () => {
      window.removeEventListener('shubh-deep:diya-lit', handleDiyaLit);
    };
  }, []);

  const handleToggleReveal = () => {
    if (!isRevealed) {
      soundEngine.playTempleBell();
      setIsRevealed(true);
      setAnimationKey((prev) => prev + 1);
    } else {
      // Re-trigger animation
      soundEngine.playTempleBell();
      setAnimationKey((prev) => prev + 1);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRevealed(false);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      role="region"
      aria-label="Traditional Indian Floral Rangoli"
    >
      {/* Surrounding Ambient Radial Aura */}
      <div
        className={`absolute inset-0 m-auto w-64 h-64 sm:w-80 sm:h-80 rounded-full pointer-events-none transition-opacity duration-1000 ${
          isRevealed ? 'opacity-40' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(213, 167, 91, 0.35) 0%, rgba(185, 101, 67, 0.12) 50%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Rangoli SVG Artwork */}
      <div
        key={animationKey}
        onClick={handleToggleReveal}
        className={`relative cursor-pointer group focus:outline-none transition-transform duration-500 ${
          isRevealed ? 'scale-100' : 'scale-95 opacity-80 hover:opacity-100'
        }`}
        title={isRevealed ? 'Click to redraw Rangoli' : 'Click to blossom Rangoli'}
      >
        <svg
          className="w-64 h-64 sm:w-80 sm:h-80 max-w-full drop-shadow-sm"
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Terracotta gradient */}
            <linearGradient id="rangoliTerracotta" x1="150" y1="50" x2="150" y2="250" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C97552" />
              <stop offset="60%" stopColor="#B96543" />
              <stop offset="100%" stopColor="#8C4428" />
            </linearGradient>

            {/* Turmeric mustard gradient */}
            <linearGradient id="rangoliMustard" x1="150" y1="70" x2="150" y2="230" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F7DF94" />
              <stop offset="70%" stopColor="#D5A75B" />
              <stop offset="100%" stopColor="#B96543" />
            </linearGradient>
          </defs>

          {/* 1. Outer Concentric Geometry Ring (Muted Olive & Cream Dots) */}
          <circle
            cx="150"
            cy="150"
            r="136"
            stroke="#78805B"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            strokeOpacity="0.45"
            className={isRevealed ? 'rangoli-drawing-ring1' : 'opacity-30'}
          />
          <circle
            cx="150"
            cy="150"
            r="126"
            stroke="#FAF6EE"
            strokeWidth="1"
            strokeOpacity="0.6"
            className={isRevealed ? 'rangoli-drawing-ring2' : 'opacity-20'}
          />

          {/* 2. Outer 8 Auspicious Mango Leaf Flourishes (Muted Olive #78805B) */}
          <g className={isRevealed ? 'rangoli-blossoming' : 'opacity-0'}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <g key={i} transform={`rotate(${angle} 150 150)`}>
                {/* Mango Leaf */}
                <path
                  d="M150 20 C143 36, 141 54, 150 72 C159 54, 157 36, 150 20 Z"
                  fill="#78805B"
                  fillOpacity="0.88"
                />
                <line x1="150" y1="22" x2="150" y2="68" stroke="#FAF6EE" strokeWidth="0.8" strokeOpacity="0.65" />
                {/* Little rice flour boundary dots */}
                <circle cx="140" cy="46" r="1.5" fill="#FAF6EE" />
                <circle cx="160" cy="46" r="1.5" fill="#FAF6EE" />
                <circle cx="150" cy="16" r="2.2" fill="#D5A75B" />
              </g>
            ))}
          </g>

          {/* 3. Middle 8 Terracotta Petals Ring (#B96543) */}
          <g className={isRevealed ? 'rangoli-blossoming' : 'opacity-10'}>
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
              <g key={i} transform={`rotate(${angle} 150 150)`}>
                <path
                  d="M150 64 C132 84, 134 112, 150 126 C166 112, 168 84, 150 64 Z"
                  fill="url(#rangoliTerracotta)"
                  opacity="0.92"
                />
                <path
                  d="M150 72 C138 90, 140 108, 150 118 C160 108, 162 90, 150 72 Z"
                  stroke="#FAF6EE"
                  strokeWidth="0.9"
                  strokeOpacity="0.5"
                  fill="none"
                />
                <circle cx="150" cy="74" r="2.5" fill="#D5A75B" />
              </g>
            ))}
          </g>

          {/* 4. Concentric Sacred Geometry Ring of Rice-Flour Dots */}
          <g opacity={isRevealed ? '0.85' : '0.2'}>
            {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map(
              (deg) => (
                <circle
                  key={deg}
                  cx={150 + Math.cos((deg * Math.PI) / 180) * 62}
                  cy={150 + Math.sin((deg * Math.PI) / 180) * 62}
                  r="1.7"
                  fill="#FAF6EE"
                />
              )
            )}
          </g>

          {/* 5. Inner 8-Petal Sacred Lotus (Mustard & Cream #D5A75B / #FAF6EE) */}
          <g className={isRevealed ? 'rangoli-blossoming' : 'opacity-25'}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <g key={i} transform={`rotate(${angle} 150 150)`}>
                <path
                  d="M150 96 C138 114, 140 134, 150 144 C160 134, 162 114, 150 96 Z"
                  fill="url(#rangoliMustard)"
                />
                <circle cx="150" cy="104" r="2" fill="#FAF6EE" />
              </g>
            ))}
          </g>

          {/* 6. Central Bindu & Auspicious Solar Seed (#B96543) */}
          <circle cx="150" cy="150" r="14" fill="#B96543" />
          <circle cx="150" cy="150" r="10" fill="#D5A75B" />
          <circle cx="150" cy="150" r="5" fill="#FAF6EE" />

          {/* 8 Inner Seed Dots */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <circle
              key={deg}
              cx={150 + Math.cos((deg * Math.PI) / 180) * 22}
              cy={150 + Math.sin((deg * Math.PI) / 180) * 22}
              r="1.8"
              fill="#D5A75B"
            />
          ))}
        </svg>

        {/* Unrevealed State Invitation Badge */}
        {!isRevealed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded-full bg-surface/90 text-primary border border-secondary/25 shadow-soft text-xs font-sans font-medium flex items-center gap-1.5 group-hover:border-primary/40 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Tap to reveal Rangoli</span>
            </span>
          </div>
        )}
      </div>

      {/* Bottom Controls / Label */}
      <div className="mt-4 flex items-center gap-3">
        <span className="font-serif-indian text-xs sm:text-sm text-secondary flex items-center gap-1.5">
          <span>•</span>
          <span>पारंपरिक पुष्प रंगोली</span>
          <span>•</span>
        </span>

        {isRevealed && (
          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded-md text-secondary/60 hover:text-primary hover:bg-surface border border-transparent hover:border-secondary/20 transition-colors"
            title="Reset Rangoli"
            aria-label="Reset Rangoli"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
