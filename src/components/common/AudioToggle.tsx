import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

export const AudioToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(soundEngine.getIsPlaying());

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe((active) => {
      setIsPlaying(active);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggle = () => {
    soundEngine.toggle();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-sans font-medium select-none focus:outline-none focus:ring-1 focus:ring-primary touch-manipulation cursor-pointer ${
        isPlaying
          ? 'bg-surface border-primary/40 text-primary shadow-soft'
          : 'bg-surface/60 border-secondary/20 text-secondary hover:text-primary hover:border-secondary/40'
      }`}
      aria-label={isPlaying ? 'ध्वनि बंद करें (Mute Audio)' : 'ध्वनि चालू करें (Play Meditative Soundscape)'}
      title={isPlaying ? 'Mute Background Audio' : 'Play Background Audio'}
    >
      <div className="relative flex items-center justify-center">
        {!isPlaying ? (
          <BellOff className="w-3.5 h-3.5 text-secondary group-hover:text-primary transition-colors" />
        ) : (
          <>
            <Bell className="w-3.5 h-3.5 text-primary animate-pulse" />
            {/* Gentle acoustic wave ripple */}
            <span className="absolute -inset-1 rounded-full border border-primary/30 animate-ping pointer-events-none opacity-40" />
          </>
        )}
      </div>

      <span className="font-serif-indian text-[11px] leading-none hidden sm:inline">
        {isPlaying ? 'संगीत' : 'ध्वनि'}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-text/60 font-sans hidden md:inline">
        {isPlaying ? 'Sound On' : 'Sound Off'}
      </span>
    </button>
  );
};
