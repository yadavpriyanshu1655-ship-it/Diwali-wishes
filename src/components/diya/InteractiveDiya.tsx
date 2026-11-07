import React, { useState } from 'react';
import { Sparkles, RotateCcw, Check } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

export type DiyaState = 'unlit' | 'lighting' | 'lit';

interface InteractiveDiyaProps {
  className?: string;
  onLightChange?: (isLit: boolean) => void;
}

export const InteractiveDiya: React.FC<InteractiveDiyaProps> = ({
  className = '',
  onLightChange,
}) => {
  const [diyaState, setDiyaState] = useState<DiyaState>('unlit');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isLit = diyaState === 'lit';
  const isLighting = diyaState === 'lighting';
  const isActive = isLit || isLighting;

  const handleLightDiya = () => {
    if (diyaState !== 'unlit') return;

    setDiyaState('lighting');
    soundEngine.playDiyaLightStrike();

    // Trigger confirmation toast
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3200);

    // Transition to steady lit state after ignition animation
    setTimeout(() => {
      setDiyaState('lit');
      if (onLightChange) onLightChange(true);
      window.dispatchEvent(
        new CustomEvent('shubh-deep:diya-lit', {
          detail: { timestamp: Date.now() },
        })
      );
    }, 850);
  };

  const handleReplay = () => {
    setDiyaState('unlit');
    if (onLightChange) onLightChange(false);
    window.dispatchEvent(
      new CustomEvent('shubh-deep:diya-extinguished', {
        detail: { timestamp: Date.now() },
      })
    );
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      role="region"
      aria-label="Interactive Sacred Diya"
    >
      {/* Surrounding Area Warm Amber Illumination */}
      <div
        className={`absolute -top-16 sm:-top-20 w-64 h-64 sm:w-96 sm:h-96 rounded-full pointer-events-none transition-all duration-1000 ${
          isActive
            ? 'opacity-85 scale-100 surrounding-glow-reveal'
            : 'opacity-0 scale-75'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(213, 167, 91, 0.42) 0%, rgba(185, 101, 67, 0.16) 45%, rgba(243, 235, 221, 0) 70%)',
        }}
        aria-hidden="true"
      />

      {/* Main Interactive Diya Artwork */}
      <div
        onClick={diyaState === 'unlit' ? handleLightDiya : undefined}
        className={`relative cursor-${
          diyaState === 'unlit' ? 'pointer' : 'default'
        } focus:outline-none group`}
        tabIndex={diyaState === 'unlit' ? 0 : -1}
        role={diyaState === 'unlit' ? 'button' : 'img'}
        aria-label={
          isActive
            ? 'Auspicious terracotta diya glowing with living flame'
            : 'Unlit terracotta diya — click to light'
        }
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && diyaState === 'unlit') {
            e.preventDefault();
            handleLightDiya();
          }
        }}
      >
        <svg
          className="w-56 h-56 sm:w-72 sm:h-72 max-w-full drop-shadow-sm diya-floating"
          viewBox="0 0 260 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Terracotta gradient for earthen clay body */}
            <linearGradient id="terracottaClay" x1="130" y1="125" x2="130" y2="205" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C97552" />
              <stop offset="55%" stopColor="#B96543" />
              <stop offset="100%" stopColor="#8C4428" />
            </linearGradient>

            {/* Clay interior oil reservoir */}
            <linearGradient id="sesameOilPool" x1="130" y1="130" x2="130" y2="160" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8B4527" />
              <stop offset="100%" stopColor="#67311B" />
            </linearGradient>

            {/* Warm Flame Inner Gradient */}
            <radialGradient id="flameHotCenter" cx="50%" cy="65%" r="50%">
              <stop offset="0%" stopColor="#FFFDF9" />
              <stop offset="35%" stopColor="#F7DF94" />
              <stop offset="70%" stopColor="#D5A75B" />
              <stop offset="100%" stopColor="#B96543" />
            </radialGradient>

            {/* Brass rim accent */}
            <linearGradient id="brassBevel" x1="45" y1="138" x2="215" y2="138" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#B96543" />
              <stop offset="25%" stopColor="#E2BD78" />
              <stop offset="50%" stopColor="#D5A75B" />
              <stop offset="75%" stopColor="#E2BD78" />
              <stop offset="100%" stopColor="#B96543" />
            </linearGradient>

            {/* Soft Ambient Light Rays Gradient */}
            <radialGradient id="rayGradient" cx="130" cy="105" r="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D5A75B" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#B96543" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#F3EBDD" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Sacred Geometry Ring */}
          <circle
            cx="130"
            cy="155"
            r="96"
            stroke="#78805B"
            strokeWidth="1"
            strokeDasharray="3 4"
            strokeOpacity={isActive ? 0.45 : 0.22}
            className="transition-opacity duration-700"
          />

          {/* Subtle Light Rays (Visible only when lit) */}
          {isActive && (
            <g className="rays-rotating" opacity="0.6">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="130"
                  y1="105"
                  x2={130 + Math.cos((deg * Math.PI) / 180) * 88}
                  y2={105 + Math.sin((deg * Math.PI) / 180) * 88}
                  stroke="url(#rayGradient)"
                  strokeWidth="1.2"
                  strokeDasharray="4 6"
                />
              ))}
            </g>
          )}

          {/* Botanical Accent: Minimal Mango Leaves at base */}
          <g opacity="0.85">
            <path
              d="M80 196 C 60 194, 46 204, 38 212 C 54 216, 72 210, 84 200 Z"
              fill="#78805B"
            />
            <path d="M42 210 C 60 205, 75 201, 82 198" stroke="#FAF6EE" strokeWidth="0.8" strokeOpacity="0.5" />
            <path
              d="M180 196 C 200 194, 214 204, 222 212 C 206 216, 188 210, 176 200 Z"
              fill="#78805B"
            />
            <path d="M218 210 C 200 205, 185 201, 178 198" stroke="#FAF6EE" strokeWidth="0.8" strokeOpacity="0.5" />
          </g>

          {/* Floral Accent: Fresh Marigold Petals around base */}
          <g opacity="0.9">
            <circle cx="68" cy="204" r="5.5" fill="#D5A75B" />
            <circle cx="68" cy="204" r="3" fill="#B96543" />
            <circle cx="192" cy="204" r="5.5" fill="#D5A75B" />
            <circle cx="192" cy="204" r="3" fill="#B96543" />
            <ellipse cx="130" cy="220" rx="4" ry="2.5" fill="#D5A75B" opacity="0.8" />
            <ellipse cx="145" cy="218" rx="3.5" ry="2" fill="#B96543" opacity="0.75" />
            <ellipse cx="115" cy="218" rx="3.5" ry="2" fill="#D5A75B" opacity="0.75" />
          </g>

          {/* Diya Clay Base Pedestal */}
          <path
            d="M100 200 C 112 208, 148 208, 160 200 L 164 208 C 148 215, 112 215, 96 208 Z"
            fill="#8C4428"
            opacity="0.88"
          />

          {/* Diya Main Clay Body (Mitti Bowl) */}
          <path
            d="M44 144 C 50 190, 96 206, 130 206 C 164 206, 210 190, 216 144 C 220 140, 198 134, 130 134 C 62 134, 40 140, 44 144 Z"
            fill="url(#terracottaClay)"
          />

          {/* Traditional Engraved Handcraft Grooves on Clay */}
          <path
            d="M68 156 C 88 182, 110 192, 130 192 C 150 192, 172 182, 192 156"
            stroke="#FAF6EE"
            strokeWidth="1.2"
            strokeOpacity="0.25"
            strokeDasharray="2 3"
          />

          {/* Top Rim of Diya (Brass & Sandalwood Trim) */}
          <ellipse cx="130" cy="140" rx="86" ry="15" fill="url(#brassBevel)" />

          {/* Oil Pool Interior */}
          <ellipse cx="130" cy="142" rx="76" ry="11" fill="url(#sesameOilPool)" />

          {/* Cotton Wick (Rui ki Baati) */}
          <path
            d="M130 142 C 130 132, 129 120, 130 110"
            stroke={isActive ? '#49382E' : '#5C4033'}
            strokeWidth="3.4"
            strokeLinecap="round"
          />

          {/* Unlit State: Sleeping Ember Tip & Whisper on Cotton Wick */}
          {!isActive && (
            <g className="wick-ember">
              <circle cx="130" cy="109" r="2.2" fill="#E07A5F" opacity="0.85" />
              <circle cx="130" cy="109" r="1.2" fill="#D5A75B" opacity="0.9" />
              {/* Subtle gentle smoke wisp hint */}
              <path
                d="M130 106 C 128 100, 132 94, 130 88"
                stroke="#49382E"
                strokeWidth="0.8"
                strokeOpacity="0.18"
                strokeDasharray="1.5 2"
                fill="none"
              />
            </g>
          )}

          {/* Lit State: Living Flame with CSS Keyframe Animation */}
          {isActive && (
            <g
              transform="translate(0, -6)"
              className={isLighting ? 'flame-igniting' : 'flame-active'}
            >
              {/* Flame Outer Warm Glow / Terracotta Aura */}
              <path
                d="M130 64 C 120 90, 114 104, 118 116 C 121 125, 126 130, 130 130 C 134 130, 139 125, 142 116 C 146 104, 140 90, 130 64 Z"
                fill="url(#flameHotCenter)"
                opacity="0.96"
              />

              {/* Flame Core White-Hot Amber Heart */}
              <path
                d="M130 92 C 126 104, 124 112, 126 119 C 127 123, 129 125, 130 125 C 131 125, 133 123, 134 119 C 136 112, 134 104, 130 92 Z"
                fill="#FFFDF9"
                className="flame-core-active"
                opacity="0.94"
              />

              {/* Blue/indigo subtle base transition at wick junction */}
              <ellipse cx="130" cy="122" rx="4.5" ry="2" fill="#78805B" opacity="0.45" />
            </g>
          )}
        </svg>

        {/* Hover / Unlit Click Cue for the Diya */}
        {diyaState === 'unlit' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="bg-surface/90 text-primary text-[11px] font-sans px-3 py-1 rounded-full border border-primary/20 shadow-soft">
              Tap to light
            </span>
          </div>
        )}
      </div>

      {/* Gentle Confirmation Toast / Message */}
      {showConfirmation && (
        <div
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-secondary/30 text-secondary text-xs font-sans animate-fade-in shadow-soft"
          role="status"
        >
          <Check className="w-3.5 h-3.5 text-primary" />
          <span className="font-serif-indian text-primary font-medium">दीपक प्रज्वलित हुआ</span>
          <span className="text-[11px] text-text/70">• Light has arrived</span>
        </div>
      )}

      {/* State 1: INITIAL UNLIT STATE */}
      {diyaState === 'unlit' && (
        <div className="mt-4 sm:mt-6 flex flex-col items-center text-center gap-3">
          {/* Small instruction */}
          <p className="font-sans text-xs sm:text-sm text-text/75 italic">
            "Every light begins with a little spark."
          </p>

          {/* Action button */}
          <button
            type="button"
            onClick={handleLightDiya}
            className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary text-surface font-sans font-medium text-sm sm:text-base tracking-wide border border-primary/40 shadow-earthy hover:bg-[#A64C28] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300 min-h-[48px] touch-manipulation cursor-pointer button-glow-idle"
            aria-label="Light the Diya"
          >
            <Sparkles className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform" />
            <span>Light the Diya 🪔</span>
          </button>
        </div>
      )}

      {/* State 2: LIGHTING PROGRESS */}
      {diyaState === 'lighting' && (
        <div className="mt-4 sm:mt-6 flex flex-col items-center text-center gap-2">
          <p className="font-serif-indian text-sm sm:text-base text-primary animate-pulse">
            ॥ दीप प्रज्वलनम् ॥
          </p>
          <span className="text-xs font-sans text-secondary tracking-widest uppercase">
            Kindling the sacred light...
          </span>
        </div>
      )}

      {/* State 3: AFTER LIGHTING STATE (Reveals warmth message & replay) */}
      {diyaState === 'lit' && (
        <div
          className="mt-5 sm:mt-7 flex flex-col items-center text-center max-w-lg mx-auto px-4 transition-all duration-700 animate-fade-in"
          aria-live="polite"
        >
          {/* Sacred Sanskrit Shloka Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-secondary/25 text-xs font-serif-indian text-secondary mb-3 shadow-soft">
            <Sparkles className="w-3 h-3 text-accent" />
            <span>॥ दीपज्योतिर्नमोऽस्तुते ॥</span>
          </div>

          {/* Primary Warmth Message */}
          <p className="font-serif-indian text-base sm:text-lg md:text-xl text-primary font-medium leading-relaxed mb-2">
            "May this little light bring warmth, happiness, and beautiful moments into your life."
          </p>

          {/* Subtle Secondary Line */}
          <p className="font-sans text-xs sm:text-sm text-text/80 tracking-wide font-normal mb-5">
            Keep smiling, keep shining.
          </p>

          {/* Replay Interaction Button */}
          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface/80 hover:bg-surface border border-secondary/25 hover:border-primary/30 text-xs font-sans font-medium text-text/80 hover:text-primary transition-all active:scale-[0.98] shadow-sm touch-manipulation cursor-pointer"
            aria-label="Relight the Diya"
            title="Reset and light again"
          >
            <RotateCcw className="w-3.5 h-3.5 text-secondary group-hover:text-primary" />
            <span>Relight the Diya ↺</span>
          </button>
        </div>
      )}
    </div>
  );
};
