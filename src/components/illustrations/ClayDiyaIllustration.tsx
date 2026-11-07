import React from 'react';

export const ClayDiyaIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Soft Ambient Radiance (Gentle Breathing Glow) */}
      <div 
        className="absolute -top-8 w-48 h-48 sm:w-64 sm:h-64 rounded-full pointer-events-none opacity-40 blur-2xl flame-breathing"
        style={{
          background: 'radial-gradient(circle, rgba(213, 167, 91, 0.5) 0%, rgba(185, 101, 67, 0.18) 50%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      <svg
        className="w-52 h-52 sm:w-64 sm:h-64 max-w-full drop-shadow-sm diya-floating"
        viewBox="0 0 260 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Traditional Mitti ka Diya (Clay Lamp)"
      >
        <defs>
          {/* Terracotta gradient for earthen clay body */}
          <linearGradient id="clayGradient" x1="130" y1="125" x2="130" y2="205" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C97552" />
            <stop offset="55%" stopColor="#B96543" />
            <stop offset="100%" stopColor="#8C4428" />
          </linearGradient>

          {/* Clay interior oil reservoir */}
          <linearGradient id="oilGradient" x1="130" y1="130" x2="130" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B4527" />
            <stop offset="100%" stopColor="#67311B" />
          </linearGradient>

          {/* Warm Flame Inner Glow */}
          <radialGradient id="flameInner" cx="50%" cy="65%" r="50%">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="35%" stopColor="#F7DF94" />
            <stop offset="70%" stopColor="#D5A75B" />
            <stop offset="100%" stopColor="#B96543" />
          </radialGradient>

          {/* Brass rim accent */}
          <linearGradient id="brassAccent" x1="45" y1="138" x2="215" y2="138" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B96543" />
            <stop offset="25%" stopColor="#E2BD78" />
            <stop offset="50%" stopColor="#D5A75B" />
            <stop offset="75%" stopColor="#E2BD78" />
            <stop offset="100%" stopColor="#B96543" />
          </linearGradient>
        </defs>

        {/* Outer Sacred Geometry Ring */}
        <circle
          cx="130"
          cy="155"
          r="96"
          stroke="#78805B"
          strokeWidth="1"
          strokeDasharray="3 4"
          strokeOpacity="0.28"
        />

        {/* Botanical Accent: Minimal Mango Leaves at base (Left & Right) */}
        <g opacity="0.85">
          {/* Left Leaf */}
          <path
            d="M80 196 C 60 194, 46 204, 38 212 C 54 216, 72 210, 84 200 Z"
            fill="#78805B"
          />
          <path d="M42 210 C 60 205, 75 201, 82 198" stroke="#FAF6EE" strokeWidth="0.8" strokeOpacity="0.5" />

          {/* Right Leaf */}
          <path
            d="M180 196 C 200 194, 214 204, 222 212 C 206 216, 188 210, 176 200 Z"
            fill="#78805B"
          />
          <path d="M218 210 C 200 205, 185 201, 178 198" stroke="#FAF6EE" strokeWidth="0.8" strokeOpacity="0.5" />
        </g>

        {/* Floral Accent: Traditional Fresh Marigold Petals (Genda Phool) around Diya Base */}
        <g opacity="0.9">
          {/* Left Marigold cluster */}
          <circle cx="68" cy="204" r="5.5" fill="#D5A75B" />
          <circle cx="68" cy="204" r="3" fill="#B96543" />

          {/* Right Marigold cluster */}
          <circle cx="192" cy="204" r="5.5" fill="#D5A75B" />
          <circle cx="192" cy="204" r="3" fill="#B96543" />

          {/* Center-front loose auspicious petal */}
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

        {/* Diya Main Clay Body (Hand-molded Mitti Bowl) */}
        <path
          d="M44 144 C 50 190, 96 206, 130 206 C 164 206, 210 190, 216 144 C 220 140, 198 134, 130 134 C 62 134, 40 140, 44 144 Z"
          fill="url(#clayGradient)"
        />

        {/* Traditional Engraved Handcraft Grooves on Clay */}
        <path
          d="M68 156 C 88 182, 110 192, 130 192 C 150 192, 172 182, 192 156"
          stroke="#FAF6EE"
          strokeWidth="1.2"
          strokeOpacity="0.25"
          strokeDasharray="2 3"
        />

        {/* Top Rim of Diya (Sandalwood / Subtle Brass Accent) */}
        <ellipse
          cx="130"
          cy="140"
          rx="86"
          ry="15"
          fill="url(#brassAccent)"
        />

        {/* Oil Pool Interior (Cold-pressed Sesame / Ghee Reservoir) */}
        <ellipse
          cx="130"
          cy="142"
          rx="76"
          ry="11"
          fill="url(#oilGradient)"
        />

        {/* Natural Cotton Wick (Rui ki Baati) */}
        <path
          d="M130 142 C 130 132, 129 119, 130 109"
          stroke="#49382E"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Auspicious Peaceful Candlelight Flame */}
        <g transform="translate(0, -6)">
          {/* Flame Outer Aura */}
          <path
            d="M130 64 C 120 90, 114 104, 118 116 C 121 125, 126 130, 130 130 C 134 130, 139 125, 142 116 C 146 104, 140 90, 130 64 Z"
            fill="url(#flameInner)"
            opacity="0.95"
          />

          {/* Flame Core White-Hot Heart */}
          <path
            d="M130 92 C 126 104, 124 112, 126 119 C 127 123, 129 125, 130 125 C 131 125, 133 123, 134 119 C 136 112, 134 104, 130 92 Z"
            fill="#FFFDF9"
            opacity="0.92"
          />
        </g>
      </svg>
    </div>
  );
};
