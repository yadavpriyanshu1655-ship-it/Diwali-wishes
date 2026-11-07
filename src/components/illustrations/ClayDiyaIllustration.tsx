import React from 'react';

export const ClayDiyaIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Soft Ambient Radiance */}
      <div 
        className="absolute -top-10 w-44 h-44 sm:w-56 sm:h-56 rounded-full pointer-events-none opacity-40 blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(213, 167, 91, 0.45) 0%, rgba(185, 101, 67, 0.15) 50%, transparent 75%)',
        }}
      />

      <svg
        className="w-48 h-48 sm:w-60 sm:h-60 max-w-full drop-shadow-sm select-none"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Terracotta gradient for earthen clay */}
          <linearGradient id="clayGradient" x1="120" y1="120" x2="120" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C97552" />
            <stop offset="60%" stopColor="#B96543" />
            <stop offset="100%" stopColor="#8C4428" />
          </linearGradient>

          {/* Clay interior oil reservoir */}
          <linearGradient id="oilGradient" x1="120" y1="125" x2="120" y2="155" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B4527" />
            <stop offset="100%" stopColor="#67311B" />
          </linearGradient>

          {/* Warm Flame Glow */}
          <radialGradient id="flameInner" cx="50%" cy="65%" r="50%">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="35%" stopColor="#F7DF94" />
            <stop offset="70%" stopColor="#D5A75B" />
            <stop offset="100%" stopColor="#B96543" />
          </radialGradient>

          {/* Brass rim accent */}
          <linearGradient id="brassAccent" x1="40" y1="135" x2="200" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B96543" />
            <stop offset="30%" stopColor="#E2BD78" />
            <stop offset="50%" stopColor="#D5A75B" />
            <stop offset="70%" stopColor="#E2BD78" />
            <stop offset="100%" stopColor="#B96543" />
          </linearGradient>
        </defs>

        {/* Outer Sacred Halo Ring */}
        <circle
          cx="120"
          cy="150"
          r="92"
          stroke="#78805B"
          strokeWidth="1"
          strokeDasharray="3 4"
          strokeOpacity="0.3"
        />

        {/* Diya Clay Base Pedestal */}
        <path
          d="M92 196 C 104 204, 136 204, 148 196 L 152 204 C 136 211, 104 211, 88 204 Z"
          fill="#8C4428"
          opacity="0.85"
        />

        {/* Diya Main Body (Mitti Bowl) */}
        <path
          d="M38 140 C 44 186, 88 202, 120 202 C 152 202, 196 186, 202 140 C 206 136, 185 130, 120 130 C 55 130, 34 136, 38 140 Z"
          fill="url(#clayGradient)"
        />

        {/* Decorative Engraved Grooves on Clay */}
        <path
          d="M60 152 C 78 178, 100 188, 120 188 C 140 188, 162 178, 180 152"
          stroke="#FAF6EE"
          strokeWidth="1.2"
          strokeOpacity="0.28"
          strokeDasharray="2 3"
        />

        {/* Top Rim of Diya (Sandalwood / Brass Trim) */}
        <ellipse
          cx="120"
          cy="136"
          rx="82"
          ry="15"
          fill="url(#brassAccent)"
        />

        {/* Oil Pool Interior */}
        <ellipse
          cx="120"
          cy="138"
          rx="72"
          ry="11"
          fill="url(#oilGradient)"
        />

        {/* Cotton Wick (Baati) */}
        <path
          d="M120 138 C 120 128, 119 116, 120 106"
          stroke="#49382E"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Gentle Flame (Peaceful Natural Candlelight) */}
        <g transform="translate(0, -6)">
          {/* Flame Aura */}
          <path
            d="M120 62 C 110 88, 104 102, 108 114 C 111 123, 116 128, 120 128 C 124 128, 129 123, 132 114 C 136 102, 130 88, 120 62 Z"
            fill="url(#flameInner)"
            opacity="0.95"
          />

          {/* Flame Core White-Hot Heart */}
          <path
            d="M120 90 C 116 102, 114 110, 116 117 C 117 121, 119 123, 120 123 C 121 123, 123 121, 124 117 C 126 110, 124 102, 120 90 Z"
            fill="#FFFDF9"
            opacity="0.9"
          />
        </g>
      </svg>
    </div>
  );
};
