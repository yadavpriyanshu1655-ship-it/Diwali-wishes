import React from 'react';

export const RangoliDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-3 select-none pointer-events-none ${className}`} aria-hidden="true">
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-secondary/40" />
      <svg className="w-5 h-5 text-primary opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Sacred 8-petal minimal lotus/star */}
        <circle cx="12" cy="12" r="3" fill="#D5A75B" fillOpacity="0.4" />
        <path d="M12 2C12 7 17 12 22 12C17 12 12 17 12 22C12 17 7 12 2 12C7 12 12 7 12 2Z" />
      </svg>
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-secondary/40" />
    </div>
  );
};

export const SmallPetalIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg className={`w-4 h-4 text-accent inline-block ${className}`} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1C8 5 12 8 15 8C12 8 8 11 8 15C8 11 4 8 1 8C4 8 8 5 8 1Z" opacity="0.75" />
    </svg>
  );
};
