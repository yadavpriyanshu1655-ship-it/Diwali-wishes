import React from 'react';

export const FloralToran: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden flex justify-center opacity-85 select-none pointer-events-none ${className}`} aria-hidden="true">
      <svg
        className="w-full max-w-5xl h-10 sm:h-12 md:h-14"
        viewBox="0 0 1000 60"
        fill="none"
        preserveAspectRatio="xMidYMin meet"
      >
        {/* Main Toran thread */}
        <path
          d="M0 8 Q 125 24, 250 8 T 500 8 T 750 8 T 1000 8"
          stroke="#78805B"
          strokeWidth="1.75"
          strokeDasharray="4 2"
        />

        {/* Marigold and Mango leaf clusters repeated symmetrically */}
        {[125, 250, 375, 500, 625, 750, 875].map((x, i) => (
          <g key={i} transform={`translate(${x}, 12)`}>
            {/* Hanging thread */}
            <line x1="0" y1="-4" x2="0" y2="10" stroke="#78805B" strokeWidth="1.2" />

            {/* Mango leaf (Muted Olive) */}
            <path
              d="M0 8 C-7 18, -9 30, 0 44 C9 30, 7 18, 0 8 Z"
              fill="#78805B"
              fillOpacity="0.85"
            />
            <line x1="0" y1="8" x2="0" y2="40" stroke="#FAF6EE" strokeWidth="0.75" strokeOpacity="0.6" />

            {/* Marigold blossom (Warm Ochre / Mustard) */}
            <circle cx="0" cy="8" r="6" fill="#D5A75B" />
            <circle cx="0" cy="8" r="3.5" fill="#B96543" />

            {/* Terracotta sacred bead */}
            <circle cx="0" cy="20" r="2" fill="#B96543" />
          </g>
        ))}
      </svg>
    </div>
  );
};
